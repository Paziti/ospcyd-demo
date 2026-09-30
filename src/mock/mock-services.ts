import type { Credential } from "@/core/models/credential";
import type { Member } from "@/core/models/member";
import type { Session } from "@/core/models/session";
import type { KeyValueStore } from "@/core/platform/storage";
import type { Services } from "@/core/services/contracts";
import { ServiceError } from "@/core/services/errors";
import { fullName, maskEmail } from "@/core/lib/format";
import { MOCK_ACCOUNTS, type MockAccount } from "./data/members";

interface MockOptions {
  store: KeyValueStore;
  /** Permite forzar errores de red para mostrar los estados de error en la demo. */
  shouldFail: () => boolean;
}

/** Cambios hechos por los afiliados durante la demo, persistidos localmente. */
type Overrides = Record<string, Partial<Member> & { password?: string }>;

export const OVERRIDES_KEY = "ospcyd.mock.overrides";
const SESSION_HOURS = 8;

const wait = (min: number, max: number) =>
  new Promise((resolve) => setTimeout(resolve, min + Math.random() * (max - min)));

const randomToken = () =>
  Array.from({ length: 4 }, () => Math.random().toString(36).slice(2)).join("");

export function createMockServices({ store, shouldFail }: MockOptions): Services {
  async function readOverrides(): Promise<Overrides> {
    const raw = await store.get(OVERRIDES_KEY);
    if (!raw) return {};
    try {
      return JSON.parse(raw) as Overrides;
    } catch {
      return {};
    }
  }

  async function writeOverride(memberId: string, patch: Overrides[string]) {
    const all = await readOverrides();
    all[memberId] = { ...all[memberId], ...patch };
    await store.set(OVERRIDES_KEY, JSON.stringify(all));
  }

  async function request(min = 350, max = 800) {
    await wait(min, max);
    if (shouldFail()) {
      throw new ServiceError("NETWORK", "No pudimos conectarnos con OSPCyD. Revisá tu conexión e intentá de nuevo.");
    }
  }

  function accountFor(session: Session): MockAccount {
    if (new Date(session.expiresAt).getTime() < Date.now()) {
      throw new ServiceError("SESSION_EXPIRED", "Tu sesión venció. Ingresá nuevamente.");
    }
    const account = MOCK_ACCOUNTS.find((a) => a.member.id === session.memberId);
    if (!account) throw new ServiceError("UNKNOWN_MEMBER", "No encontramos al afiliado.");
    return account;
  }

  async function currentMember(account: MockAccount): Promise<Member> {
    const patch = { ...(await readOverrides())[account.member.id] };
    delete patch.password;
    return { ...account.member, ...patch };
  }

  async function currentPassword(account: MockAccount): Promise<string> {
    return (await readOverrides())[account.member.id]?.password ?? account.password;
  }

  return {
    auth: {
      async login({ dni, password }) {
        await request(700, 1100);
        const account = MOCK_ACCOUNTS.find((a) => a.member.dni === dni);
        if (!account || (await currentPassword(account)) !== password) {
          throw new ServiceError("INVALID_CREDENTIALS", "DNI o contraseña incorrectos. Revisá los datos e intentá de nuevo.");
        }
        return {
          memberId: account.member.id,
          accessToken: randomToken(),
          refreshToken: randomToken(),
          expiresAt: new Date(Date.now() + SESSION_HOURS * 3_600_000).toISOString(),
        };
      },
      async logout() {
        await wait(150, 300);
      },
      async requestPasswordReset(dni) {
        await request(700, 1000);
        const account = MOCK_ACCOUNTS.find((a) => a.member.dni === dni);
        if (!account) {
          throw new ServiceError("UNKNOWN_MEMBER", "No encontramos un afiliado con ese DNI.");
        }
        const member = await currentMember(account);
        return { maskedEmail: maskEmail(member.email) };
      },
      async changePassword(session, current, next) {
        await request(600, 900);
        const account = accountFor(session);
        if ((await currentPassword(account)) !== current) {
          throw new ServiceError("VALIDATION", "La contraseña actual no es correcta.");
        }
        await writeOverride(account.member.id, { password: next });
      },
    },

    member: {
      async getProfile(session) {
        await request(250, 500);
        return currentMember(accountFor(session));
      },
      async updateContact(session, fields) {
        await request(600, 1000);
        const account = accountFor(session);
        await writeOverride(account.member.id, fields);
        return currentMember(account);
      },
      async updatePhoto(session, photoUrl) {
        await request(500, 800);
        const account = accountFor(session);
        await writeOverride(account.member.id, { photoUrl });
        return currentMember(account);
      },
    },

    credential: {
      async getCredential(session): Promise<Credential> {
        await request(400, 700);
        const account = accountFor(session);
        const member = await currentMember(account);
        return {
          memberId: member.id,
          holderName: fullName(member),
          dni: member.dni,
          affiliateNumber: member.affiliateNumber,
          affiliateType: member.affiliateType,
          regime: member.regime,
          plan: member.plan,
          employer: member.employer,
          photoUrl: member.photoUrl,
          ...account.credential,
        };
      },
    },

    contact: {
      async send(session) {
        await request(900, 1400);
        accountFor(session);
        return { ticket: `DEMO-${Math.floor(100000 + Math.random() * 900000)}` };
      },
    },
  };
}

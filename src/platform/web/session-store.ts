import type { Session } from "@/core/models/session";
import { SESSION_COOKIE } from "@/config/routes";
import { webStore } from "./storage";

const SESSION_KEY = "ospyd.session";

/**
 * Persistencia de sesión en web para la demo.
 * - El token queda en localStorage (en producción: cookie httpOnly emitida por el backend).
 * - Una cookie sin datos sensibles avisa al proxy de Next que hay sesión, para
 *   redirigir antes de renderizar (chequeo optimista; la API valida el token real).
 * En React Native esto se reemplaza por expo-secure-store.
 */
export const sessionStore = {
  async load(): Promise<Session | null> {
    const raw = await webStore.get(SESSION_KEY);
    if (!raw) return null;
    try {
      const session = JSON.parse(raw) as Session;
      if (new Date(session.expiresAt).getTime() <= Date.now()) {
        await this.clear();
        return null;
      }
      return session;
    } catch {
      await this.clear();
      return null;
    }
  },

  async save(session: Session) {
    await webStore.set(SESSION_KEY, JSON.stringify(session));
    const maxAge = Math.max(0, Math.floor((new Date(session.expiresAt).getTime() - Date.now()) / 1000));
    document.cookie = `${SESSION_COOKIE}=1; Path=/; Max-Age=${maxAge}; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
  },

  async clear() {
    await webStore.remove(SESSION_KEY);
    document.cookie = `${SESSION_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
  },
};

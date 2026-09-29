import { credentialStatus, STATUS_LABEL } from "@/core/lib/credential-status";
import { fullName } from "@/core/lib/format";
import { webStore } from "@/platform/web/storage";
import { MOCK_ACCOUNTS } from "./data/members";
import { OVERRIDES_KEY } from "./mock-services";

/** Borra los cambios hechos durante la demo (datos editados, fotos y contraseñas). */
export function resetDemoData(): Promise<void> {
  return webStore.remove(OVERRIDES_KEY);
}

/**
 * Atajos de la pantalla de ingreso para presentar la demo.
 * Es el único punto donde la UI conoce el mock: al conectar la API real se elimina este archivo
 * y el componente DemoAccounts.
 */
export function demoAccounts(now = new Date()) {
  return MOCK_ACCOUNTS.map((a) => ({
    dni: a.member.dni,
    password: a.password,
    name: fullName(a.member),
    status: STATUS_LABEL[credentialStatus(a.credential, now)],
  }));
}

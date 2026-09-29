import type { Credential, CredentialStatus } from "../models/credential";
import { parseIsoDate } from "./format";

const EXPIRING_WINDOW_DAYS = 30;
const DAY_MS = 86_400_000;

export function credentialStatus(credential: Pick<Credential, "expiresAt">, now: Date): CredentialStatus {
  // La credencial es válida hasta el final del día de vencimiento.
  const end = parseIsoDate(credential.expiresAt).getTime() + DAY_MS;
  const remaining = end - now.getTime();
  if (remaining <= 0) return "expired";
  if (remaining <= EXPIRING_WINDOW_DAYS * DAY_MS) return "expiring";
  return "active";
}

/** Días de calendario entre hoy y la fecha de vencimiento (0 = vence hoy). */
export function daysUntilExpiry(credential: Pick<Credential, "expiresAt">, now: Date): number {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  return Math.round((parseIsoDate(credential.expiresAt).getTime() - today) / DAY_MS);
}

export const STATUS_LABEL: Record<CredentialStatus, string> = {
  active: "Con cobertura",
  expiring: "Por vencer",
  expired: "Vencida",
};

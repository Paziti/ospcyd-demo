import type { AffiliateType, Employer, Plan } from "./member";

export type CredentialStatus = "active" | "expiring" | "expired";

export interface Credential {
  memberId: string;
  holderName: string;
  dni: string;
  affiliateNumber: string;
  affiliateType: AffiliateType;
  regime: string;
  plan: Plan;
  employer: Employer;
  photoUrl: string | null;
  issuedAt: string; // ISO
  expiresAt: string; // ISO
  /** Secreto por credencial para firmar el código QR. En producción lo emite el backend. */
  qrSeed: string;
}

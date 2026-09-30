import type { ContactMessage, ContactReceipt } from "../models/contact";
import type { Credential } from "../models/credential";
import type { EditableContactFields, Member } from "../models/member";
import type { LoginCredentials, Session } from "../models/session";

/**
 * Contratos entre la UI y el backend. La demo los implementa en `src/mock`;
 * la app real (web o React Native) los implementa contra la API de OSPCyD.
 */

export interface AuthService {
  login(credentials: LoginCredentials): Promise<Session>;
  logout(session: Session): Promise<void>;
  /** Devuelve el email enmascarado al que se enviaron las instrucciones. */
  requestPasswordReset(dni: string): Promise<{ maskedEmail: string }>;
  changePassword(session: Session, current: string, next: string): Promise<void>;
}

export interface MemberService {
  getProfile(session: Session): Promise<Member>;
  updateContact(session: Session, fields: EditableContactFields): Promise<Member>;
  updatePhoto(session: Session, photoUrl: string | null): Promise<Member>;
}

export interface CredentialService {
  getCredential(session: Session): Promise<Credential>;
}

export interface ContactService {
  send(session: Session, message: ContactMessage): Promise<ContactReceipt>;
}

export interface Services {
  auth: AuthService;
  member: MemberService;
  credential: CredentialService;
  contact: ContactService;
}

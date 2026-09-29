export interface Session {
  memberId: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: string; // ISO
}

export interface LoginCredentials {
  dni: string;
  password: string;
}

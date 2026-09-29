export type ServiceErrorCode =
  | "INVALID_CREDENTIALS"
  | "UNKNOWN_MEMBER"
  | "SESSION_EXPIRED"
  | "VALIDATION"
  | "NETWORK";

export class ServiceError extends Error {
  constructor(
    public readonly code: ServiceErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "ServiceError";
  }
}

export function errorMessage(error: unknown): string {
  if (error instanceof ServiceError) return error.message;
  return "No pudimos completar la operación. Revisá tu conexión e intentá de nuevo.";
}

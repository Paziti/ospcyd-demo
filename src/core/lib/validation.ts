export type Validator = (value: string) => string | null;

export const validateDni: Validator = (value) => {
  if (!value) return "Ingresá tu DNI.";
  if (!/^\d{7,8}$/.test(value)) return "El DNI tiene 7 u 8 números, sin puntos.";
  return null;
};

export const validateRequired =
  (message: string): Validator =>
  (value) =>
    value.trim() ? null : message;

export const validateEmail: Validator = (value) => {
  if (!value.trim()) return "Ingresá tu email.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())) return "Revisá el formato del email (ej.: nombre@correo.com).";
  return null;
};

export const validatePhone: Validator = (value) => {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "Ingresá un teléfono.";
  if (digits.length < 10 || digits.length > 13) return "Ingresá el código de área y el número (ej.: 11 5555 0000).";
  return null;
};

export const validateNewPassword: Validator = (value) => {
  if (value.length < 8) return "Usá al menos 8 caracteres.";
  if (!/\d/.test(value) || !/[a-zA-Z]/.test(value)) return "Combiná letras y números.";
  return null;
};

/** Solo dígitos, para campos como el DNI. */
export const onlyDigits = (value: string, max = 8) => value.replace(/\D/g, "").slice(0, max);

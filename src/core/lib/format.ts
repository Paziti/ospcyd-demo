const MONTHS = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

/** Convierte "yyyy-mm-dd" a Date local sin corrimientos de zona horaria. */
export function parseIsoDate(iso: string): Date {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return new Date(y, m - 1, d);
}

const pad = (n: number) => String(n).padStart(2, "0");

export function formatDay(d: Date): string {
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

export function formatDate(iso: string): string {
  return formatDay(parseIsoDate(iso));
}

export function formatLongDate(date: Date): string {
  return `${date.getDate()} de ${MONTHS[date.getMonth()]} de ${date.getFullYear()}`;
}

export function formatTime(date: Date): string {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export function formatDni(dni: string): string {
  return dni.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/** 12.345.678 → 12.•••.678 */
export function maskDni(dni: string): string {
  const formatted = formatDni(dni);
  const parts = formatted.split(".");
  if (parts.length < 3) return formatted;
  return [parts[0], "•••", parts[parts.length - 1]].join(".");
}

/** 27-12345678-4 → 27-•••••678-4 */
export function maskCuil(cuil: string): string {
  const [prefix, body, check] = cuil.split("-");
  if (!body || !check) return cuil;
  return `${prefix}-${"•".repeat(body.length - 3)}${body.slice(-3)}-${check}`;
}

export function maskEmail(email: string): string {
  const [user, domain] = email.split("@");
  if (!domain) return email;
  return `${user.slice(0, 2)}•••@${domain}`;
}

export function fullName(person: { firstName: string; lastName: string }): string {
  return `${person.firstName} ${person.lastName}`;
}

export function initials(person: { firstName: string; lastName: string }): string {
  return `${person.firstName[0] ?? ""}${person.lastName[0] ?? ""}`.toUpperCase();
}

export function greeting(date: Date): string {
  const h = date.getHours();
  if (h >= 6 && h < 13) return "Buen día";
  if (h >= 13 && h < 20) return "Buenas tardes";
  return "Buenas noches";
}

export function age(birthIso: string, now: Date): number {
  const b = parseIsoDate(birthIso);
  let years = now.getFullYear() - b.getFullYear();
  const beforeBirthday =
    now.getMonth() < b.getMonth() ||
    (now.getMonth() === b.getMonth() && now.getDate() < b.getDate());
  if (beforeBirthday) years -= 1;
  return years;
}

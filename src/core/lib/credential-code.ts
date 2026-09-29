import qrcode from "qrcode-generator";
import JsBarcode from "jsbarcode";
import type { Credential } from "../models/credential";

/** Cada cuántos milisegundos se renueva el código dinámico del QR. */
export const QR_ROTATION_MS = 30_000;

/**
 * Firma de demostración (FNV-1a). En producción el backend emite un token
 * firmado (p. ej. TOTP/HMAC) y el prestador lo valida contra la API.
 */
function demoSignature(input: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).toUpperCase().padStart(8, "0");
}

export function qrWindow(now: Date): number {
  return Math.floor(now.getTime() / QR_ROTATION_MS);
}

export function credentialQrPayload(credential: Credential, window: number): string {
  const body = [
    "OSPYD1",
    credential.affiliateNumber,
    credential.dni,
    credential.expiresAt,
    window.toString(36).toUpperCase(),
  ].join("|");
  return `${body}|${demoSignature(credential.qrSeed + body)}`;
}

/** Matriz de módulos del QR (true = oscuro), independiente del renderizado. */
export function qrMatrix(payload: string): boolean[][] {
  const qr = qrcode(0, "M");
  qr.addData(payload);
  qr.make();
  const size = qr.getModuleCount();
  return Array.from({ length: size }, (_, r) =>
    Array.from({ length: size }, (_, c) => qr.isDark(r, c)),
  );
}

/** Barras Code 128 como string binario ("1" = barra), independiente del renderizado. */
export function code128Bars(value: string): string {
  const target: { encodings?: { data: string }[] } = {};
  JsBarcode(target, value, { format: "CODE128" });
  return target.encodings?.map((e) => e.data).join("") ?? "";
}

/** Valor impreso en el código de barras: solo dígitos del número de afiliado. */
export function barcodeValue(credential: Credential): string {
  return credential.affiliateNumber.replace(/\D/g, "");
}

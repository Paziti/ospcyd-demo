/**
 * Capacidades del dispositivo con detección de soporte.
 * En la app nativa se reemplazan por expo-sharing, expo-clipboard, expo-keep-awake y expo-image-manipulator.
 */

export async function shareText(data: { title: string; text: string }): Promise<"shared" | "copied" | "cancelled"> {
  if (typeof navigator.share === "function") {
    try {
      await navigator.share(data);
      return "shared";
    } catch {
      return "cancelled";
    }
  }
  await copyText(data.text);
  return "copied";
}

export async function copyText(text: string): Promise<void> {
  await navigator.clipboard.writeText(text);
}

/** Mantiene la pantalla encendida mientras se muestra la credencial. Devuelve la función para liberar. */
export async function keepScreenAwake(): Promise<() => void> {
  try {
    const sentinel = await navigator.wakeLock?.request("screen");
    return () => void sentinel?.release();
  } catch {
    return () => {};
  }
}

/** Reduce una imagen elegida por el usuario a un cuadrado JPEG liviano (data URL). */
export async function resizeImageToSquare(file: File, size = 320): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const side = Math.min(bitmap.width, bitmap.height);
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas no disponible");
  ctx.drawImage(
    bitmap,
    (bitmap.width - side) / 2,
    (bitmap.height - side) / 2,
    side,
    side,
    0,
    0,
    size,
    size,
  );
  bitmap.close();
  return canvas.toDataURL("image/jpeg", 0.85);
}

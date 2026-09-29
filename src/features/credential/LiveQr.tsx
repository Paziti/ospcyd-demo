"use client";

import { useMemo } from "react";
import type { Credential } from "@/core/models/credential";
import { QR_ROTATION_MS, credentialQrPayload, qrWindow } from "@/core/lib/credential-code";
import { formatDay, formatTime } from "@/core/lib/format";
import { cn } from "@/components/ui/cn";
import { QrCode } from "./QrCode";
import { useNow } from "./use-now";

/**
 * QR que se renueva cada 30 s junto a un reloj en vivo: quien atiende en recepción
 * puede distinguir la credencial real de una captura de pantalla.
 */
export function LiveQr({ credential, size = "md" }: { credential: Credential; size?: "md" | "lg" }) {
  const now = useNow(1000);
  const slot = qrWindow(now);
  const payload = useMemo(() => credentialQrPayload(credential, slot), [credential, slot]);
  const elapsed = (now.getTime() % QR_ROTATION_MS) / QR_ROTATION_MS;
  const secondsLeft = Math.ceil(((1 - elapsed) * QR_ROTATION_MS) / 1000);

  return (
    <div className="flex flex-col items-center">
      <div className={cn("rounded-[var(--radius-panel)] border border-line bg-white p-2", size === "lg" ? "w-[min(78vw,340px)]" : "w-[min(62vw,220px)]")}>
        <QrCode payload={payload} label={`Código QR de la credencial de ${credential.holderName}`} className="w-full" />
        <div className="mx-2 mb-1 mt-1.5 h-1 overflow-hidden rounded-full bg-line" aria-hidden>
          <div className="h-full origin-left rounded-full bg-brand transition-transform duration-1000 ease-linear" style={{ transform: `scaleX(${1 - elapsed})` }} />
        </div>
      </div>
      <p className="mt-3 flex items-center gap-2 text-[15px] font-semibold">
        <span className="relative flex size-2.5" aria-hidden>
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60 motion-reduce:hidden" />
          <span className="relative inline-flex size-2.5 rounded-full bg-success" />
        </span>
        <span>
          En vivo · <time className="font-mono tabular">{formatTime(now)}</time> · {formatDay(now)}
        </span>
      </p>
      <p className="mt-0.5 text-sm text-muted">
        El código se renueva en <span className="font-mono tabular">{secondsLeft}</span> s
      </p>
    </div>
  );
}

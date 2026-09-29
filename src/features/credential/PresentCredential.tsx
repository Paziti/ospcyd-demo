"use client";

import { useEffect } from "react";
import type { Credential, CredentialStatus } from "@/core/models/credential";
import { barcodeValue } from "@/core/lib/credential-code";
import { formatDate, formatDni } from "@/core/lib/format";
import { Wordmark } from "@/components/brand/Wordmark";
import { Sheet } from "@/components/ui/Sheet";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { keepScreenAwake } from "@/platform/web/device";
import { Barcode } from "./Barcode";
import { LiveQr } from "./LiveQr";

interface Props {
  open: boolean;
  onClose: () => void;
  credential: Credential;
  status: CredentialStatus;
}

/** Vista para mostrar en recepción: fondo blanco, QR grande, datos clave y pantalla siempre encendida. */
export function PresentCredential({ open, onClose, credential, status }: Props) {
  useEffect(() => {
    if (!open) return;
    let release = () => {};
    keepScreenAwake().then((fn) => (release = fn));
    return () => release();
  }, [open]);

  return (
    <Sheet open={open} onClose={onClose} title="Credencial para el prestador" variant="fullscreen" hideTitle>
      <div className="mx-auto flex min-h-full max-w-md flex-col items-center gap-5 pb-[calc(var(--safe-bottom)+24px)] text-center">
        <div className="flex w-full items-center justify-between">
          <Wordmark size="sm" withDescriptor />
          <StatusBadge status={status} />
        </div>

        <div>
          <p className="text-2xl font-bold leading-tight">{credential.holderName}</p>
          <p className="mt-1 text-base text-muted">
            DNI <span className="font-mono font-semibold text-ink tabular">{formatDni(credential.dni)}</span>
          </p>
        </div>

        <LiveQr credential={credential} size="lg" />

        <div className="w-full rounded-[var(--radius-panel)] border border-line p-4">
          <p className="text-sm text-muted">Nº de afiliado</p>
          <p className="font-mono text-[28px] font-bold leading-9 tracking-[0.02em] tabular">{credential.affiliateNumber}</p>
          <p className="mt-1 text-[15px]">
            {credential.plan.name} · {credential.affiliateType} · Vence <span className="font-mono tabular">{formatDate(credential.expiresAt)}</span>
          </p>
          <Barcode value={barcodeValue(credential)} className="mt-4 h-14 w-full" />
        </div>

        <p className="text-sm text-muted">Si el lector no toma el código, subí el brillo de la pantalla.</p>
      </div>
    </Sheet>
  );
}

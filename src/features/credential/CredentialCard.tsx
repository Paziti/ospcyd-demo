"use client";

import type { ReactNode } from "react";
import { m, type PanInfo } from "motion/react";
import { CheckCircle, Clock, WarningCircle } from "@phosphor-icons/react/dist/ssr";
import type { Credential, CredentialStatus } from "@/core/models/credential";
import { STATUS_LABEL } from "@/core/lib/credential-status";
import { barcodeValue } from "@/core/lib/credential-code";
import { formatDate, formatDni } from "@/core/lib/format";
import { Guilloche } from "@/components/brand/Guilloche";
import { Wordmark } from "@/components/brand/Wordmark";
import { cn } from "@/components/ui/cn";
import { Barcode } from "./Barcode";

export type CardFace = "front" | "back";

interface CredentialCardProps {
  credential: Credential;
  status: CredentialStatus;
  face?: CardFace;
  /** Si se pasa, la tarjeta se puede voltear deslizando horizontalmente. */
  onFlip?: () => void;
}

const SWIPE_THRESHOLD = 60;

/**
 * Credencial con proporción ISO ID-1 (85,6 × 54 mm). Las medidas internas usan unidades
 * de contenedor (cqw) para que la tarjeta se lea igual en 320 px que en desktop.
 */
export function CredentialCard({ credential, status, face = "front", onFlip }: CredentialCardProps) {
  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (onFlip && Math.abs(info.offset.x) > SWIPE_THRESHOLD) onFlip();
  };

  return (
    <div className="w-full [perspective:1400px]">
      <m.div
        className="relative aspect-[1.586] w-full touch-pan-y [transform-style:preserve-3d] @container"
        animate={{ rotateY: face === "front" ? 0 : 180 }}
        transition={{ type: "spring", stiffness: 170, damping: 24 }}
        drag={onFlip ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.18}
        dragSnapToOrigin
        onDragEnd={onDragEnd}
      >
        <Face hidden={face !== "front"}>
          <Front credential={credential} status={status} />
        </Face>
        <Face hidden={face !== "back"} back>
          <Back credential={credential} />
        </Face>
      </m.div>
    </div>
  );
}

function Face({ children, hidden, back }: { children: ReactNode; hidden: boolean; back?: boolean }) {
  return (
    <div
      aria-hidden={hidden}
      className={cn(
        "absolute inset-0 overflow-hidden rounded-[4.2cqw] shadow-[var(--shadow-card)] [backface-visibility:hidden]",
        back && "[transform:rotateY(180deg)]",
      )}
    >
      {children}
    </div>
  );
}

const statusChip: Record<CredentialStatus, { className: string; Icon: typeof CheckCircle }> = {
  active: { className: "bg-success-soft text-success", Icon: CheckCircle },
  expiring: { className: "bg-warning-soft text-warning", Icon: Clock },
  expired: { className: "bg-danger-soft text-danger", Icon: WarningCircle },
};

const label = "text-[clamp(10.5px,3.2cqw,13px)] leading-tight";

function Front({ credential, status }: { credential: Credential; status: CredentialStatus }) {
  const chip = statusChip[status];
  const [first, ...rest] = credential.holderName.split(" ");
  return (
    <div className={cn("on-ink relative flex size-full flex-col bg-ink p-[5cqw] text-white", status === "expired" && "saturate-[0.35]")}>
      <Guilloche className="text-accent" opacity={0.28} />
      {/* Banda celeste: firma visual de la credencial OSPyD. */}
      <span aria-hidden className="absolute inset-y-0 right-0 w-[2.2cqw] bg-accent" />

      <div className="relative flex items-start justify-between gap-2">
        <Wordmark tone="white" size="card" withDescriptor />
        <span className={cn("inline-flex items-center gap-1 rounded-md px-[2cqw] py-[1.2cqw] font-bold", label, chip.className)}>
          <chip.Icon weight="fill" className="size-[1.25em]" aria-hidden />
          {STATUS_LABEL[status]}
        </span>
      </div>

      <div className="relative mt-auto flex items-center gap-[3.5cqw]">
        <span className="grid size-[13cqw] shrink-0 place-items-center overflow-hidden rounded-full bg-white/12 text-[4.6cqw] font-bold ring-1 ring-white/25">
          {credential.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- foto local del afiliado (data URL).
            <img src={credential.photoUrl} alt="" className="size-full object-cover" />
          ) : (
            <span aria-hidden>
              {first[0]}
              {credential.holderName.split(" ").at(-1)?.[0]}
            </span>
          )}
        </span>
        <div className="min-w-0">
          <p className="truncate text-[clamp(15px,5.2cqw,22px)] font-bold leading-tight">
            {first} {rest.join(" ")}
          </p>
          <p className={cn(label, "mt-[0.8cqw] text-ink-soft")}>
            DNI <span className="font-mono tabular text-white">{formatDni(credential.dni)}</span>
          </p>
        </div>
      </div>

      <div className="relative mt-[4cqw] flex items-end justify-between gap-[3cqw] border-t border-white/20 pt-[3cqw]">
        <div className="min-w-0">
          <p className={cn(label, "text-ink-soft")}>Nº de afiliado</p>
          <p className="font-mono text-[clamp(16px,5.6cqw,24px)] font-bold leading-tight tracking-[0.02em] tabular">
            {credential.affiliateNumber}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className={cn(label, "text-ink-soft")}>{credential.plan.name}</p>
          <p className={cn(label, "mt-[0.6cqw] font-semibold")}>
            Vence <span className="font-mono tabular">{formatDate(credential.expiresAt)}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function Back({ credential }: { credential: Credential }) {
  return (
    <div className="relative flex size-full flex-col bg-white p-[5cqw] text-ink">
      <span aria-hidden className="absolute inset-y-0 left-0 w-[2.2cqw] bg-accent" />
      <div className="grid grid-cols-[1.1fr_1fr_1fr] gap-x-[3cqw] gap-y-[1.6cqw]">
        <div className="col-span-3">
          <BackField title="Empresa" value={credential.employer.name} />
        </div>
        <BackField title="CUIT empresa" value={credential.employer.cuit} mono />
        <BackField title="Tipo de afiliado" value={credential.affiliateType} />
        <BackField title="Régimen" value={credential.regime} />
      </div>

      <div className="mt-[2.5cqw]">
        <Barcode value={barcodeValue(credential)} className="h-[10cqw] w-full" />
        <p className="mt-[1cqw] text-center font-mono text-[clamp(10px,3cqw,12px)] tracking-[0.2em] tabular">{barcodeValue(credential)}</p>
      </div>

      <p className="mt-auto border-t border-line pt-[2cqw] text-[clamp(9.5px,2.75cqw,11.5px)] leading-snug text-muted">
        Superintendencia de Servicios de Salud · Órgano de control · 0800-222-SALUD (72583) · www.sssalud.gob.ar.
        Credencial personal e intransferible: presentala junto con tu DNI. <span className="font-semibold">Prototipo con datos ficticios.</span>
      </p>
    </div>
  );
}

function BackField({ title, value, mono }: { title: string; value: string; mono?: boolean }) {
  return (
    <div className="min-w-0">
      <p className="text-[clamp(9.5px,2.8cqw,12px)] leading-tight text-muted">{title}</p>
      <p className={cn("truncate text-[clamp(11px,3.4cqw,14px)] font-bold leading-tight", mono && "font-mono tabular")}>{value}</p>
    </div>
  );
}

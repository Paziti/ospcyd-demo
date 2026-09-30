import Image from "next/image";
import { BRAND } from "@/config/brand";
import { cn } from "@/components/ui/cn";
import isotipo from "@/assets/ospcyd-isotipo.png";

type Size = "sm" | "md" | "lg" | "card";

const SIZES: Record<Size, { iso: string; name: string; descriptor: string }> = {
  sm: { iso: "h-8", name: "text-lg", descriptor: "text-[10px]" },
  md: { iso: "h-11", name: "text-xl", descriptor: "text-[11px]" },
  lg: { iso: "h-16", name: "text-3xl", descriptor: "text-xs" },
  // Escala con el ancho de la credencial (unidades de contenedor).
  card: { iso: "h-[10.5cqw]", name: "text-[clamp(15px,5cqw,22px)]", descriptor: "text-[clamp(7.5px,2.2cqw,10px)]" },
};

/**
 * Logo OSPCyD: isotipo oficial (flechas sobre el disco verde) + sigla compuesta en texto,
 * nítida a cualquier tamaño. Sobre fondos oscuros el isotipo va en una placa blanca
 * porque su flecha negra no se lee sobre verde.
 */
export function Wordmark({
  tone = "ink",
  size = "md",
  withDescriptor = false,
  partner = false,
  markOnly = false,
  className,
}: {
  tone?: "ink" | "white";
  size?: Size;
  withDescriptor?: boolean;
  /** Muestra la marca asociada (OMDS) junto a la sigla. */
  partner?: boolean;
  /** Solo el isotipo, para espacios angostos. */
  markOnly?: boolean;
  className?: string;
}) {
  const s = SIZES[size];
  const onDark = tone === "white";
  if (markOnly) {
    return <Image src={isotipo} alt={BRAND.shortName} className={cn("w-auto", s.iso, className)} priority />;
  }
  return (
    <span className={cn("inline-flex items-center gap-[0.5em]", s.name, className)}>
      <span className={cn("inline-flex shrink-0", onDark && "rounded-[0.35em] bg-white p-[0.15em]")}>
        <Image src={isotipo} alt="" className={cn("w-auto", s.iso)} priority={size !== "card"} />
      </span>
      <span className={cn("flex min-w-0 flex-col leading-none", onDark ? "text-white" : "text-ink")}>
        <span className="flex items-center gap-[0.4em] whitespace-nowrap font-extrabold tracking-[-0.01em]">
          <span aria-label={BRAND.shortName}>{BRAND.logoName}</span>
          {partner ? (
            <>
              <span aria-hidden className={cn("h-[0.8em] w-px shrink-0", onDark ? "bg-white/50" : "bg-line-strong")} />
              <span className="font-bold tracking-[0.02em]">{BRAND.partner}</span>
            </>
          ) : null}
        </span>
        {withDescriptor ? (
          <span className={cn("mt-[0.35em] font-semibold leading-tight", s.descriptor, onDark ? "text-deep-soft" : "text-muted")}>
            {BRAND.fullName}
          </span>
        ) : null}
      </span>
    </span>
  );
}

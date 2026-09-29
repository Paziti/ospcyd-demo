import { cn } from "@/components/ui/cn";

/**
 * LOGO PROVISIONAL. No se encontró un logo público de OSPyD, así que se usa el nombre
 * compuesto tipográficamente. Reemplazar este componente por el SVG oficial cuando OSPyD lo entregue.
 */
export function Wordmark({
  tone = "ink",
  size = "md",
  withDescriptor = false,
  className,
}: {
  tone?: "ink" | "white";
  size?: "sm" | "md" | "lg" | "card";
  withDescriptor?: boolean;
  className?: string;
}) {
  const text = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-4xl",
    // Escala con el ancho de la credencial (unidades de contenedor).
    card: "text-[clamp(17px,5.6cqw,24px)]",
  }[size];
  return (
    <span className={cn("inline-flex flex-col leading-none", tone === "white" ? "text-white" : "text-ink", className)}>
      <span className={cn("font-extrabold tracking-[-0.02em]", text)} aria-label="OSPyD">
        OSP<span className={cn("font-normal", tone === "white" ? "text-accent" : "text-brand")}>y</span>D
      </span>
      {withDescriptor ? (
        <span className={cn("mt-1 text-[11px] font-semibold tracking-[0.08em]", tone === "white" ? "text-ink-soft" : "text-muted")}>
          OBRA SOCIAL
        </span>
      ) : null}
    </span>
  );
}

import { useMemo } from "react";
import { code128Bars } from "@/core/lib/credential-code";
import { cn } from "@/components/ui/cn";

/** Código de barras Code 128 en SVG, para lectores láser de recepción. */
export function Barcode({ value, className }: { value: string; className?: string }) {
  const { rects, width } = useMemo(() => {
    const bars = code128Bars(value);
    const list: { x: number; w: number }[] = [];
    let i = 0;
    while (i < bars.length) {
      if (bars[i] === "1") {
        const start = i;
        while (bars[i] === "1") i++;
        list.push({ x: start, w: i - start });
      } else {
        i++;
      }
    }
    return { rects: list, width: bars.length };
  }, [value]);

  return (
    <svg
      viewBox={`-10 0 ${width + 20} 40`}
      preserveAspectRatio="none"
      role="img"
      aria-label={`Código de barras ${value}`}
      shapeRendering="crispEdges"
      className={cn("block bg-white", className)}
    >
      {rects.map((r) => (
        <rect key={r.x} x={r.x} y={0} width={r.w} height={40} fill="#1e2622" />
      ))}
    </svg>
  );
}

import { useMemo } from "react";
import { qrMatrix } from "@/core/lib/credential-code";
import { cn } from "@/components/ui/cn";

const QUIET_ZONE = 4;

/** QR en SVG vectorial: nítido a cualquier tamaño y con zona de silencio estándar para escanear. */
export function QrCode({ payload, label, className }: { payload: string; label: string; className?: string }) {
  const { path, size } = useMemo(() => {
    const matrix = qrMatrix(payload);
    let d = "";
    matrix.forEach((row, y) =>
      row.forEach((dark, x) => {
        if (dark) d += `M${x + QUIET_ZONE} ${y + QUIET_ZONE}h1v1h-1z`;
      }),
    );
    return { path: d, size: matrix.length + QUIET_ZONE * 2 };
  }, [payload]);

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={label}
      shapeRendering="crispEdges"
      className={cn("block aspect-square bg-white", className)}
    >
      <path d={path} fill="#1e2622" />
    </svg>
  );
}

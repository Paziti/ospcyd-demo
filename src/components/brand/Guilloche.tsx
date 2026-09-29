import { cn } from "@/components/ui/cn";

const WIDTH = 400;
const HEIGHT = 240;

/** Ondas entrelazadas como las de documentos de seguridad; se calculan una sola vez. */
function buildPaths(lines: number): string[] {
  const paths: string[] = [];
  for (let i = 0; i < lines; i++) {
    const phase = (i / lines) * Math.PI * 2;
    const baseY = HEIGHT * 0.2 + (i / lines) * HEIGHT * 0.9;
    let d = "";
    for (let x = 0; x <= WIDTH; x += 8) {
      const t = (x / WIDTH) * Math.PI * 2;
      const y = baseY + Math.sin(t * 1.5 + phase) * 22 + Math.sin(t * 4 + phase * 2) * 6;
      d += `${x === 0 ? "M" : "L"}${x} ${y.toFixed(1)} `;
    }
    paths.push(d.trim());
  }
  return paths;
}

const PATHS = buildPaths(14);

export function Guilloche({ className, opacity = 0.35 }: { className?: string; opacity?: number }) {
  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 size-full", className)}
    >
      <g fill="none" stroke="currentColor" strokeWidth="0.8" opacity={opacity}>
        {PATHS.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
    </svg>
  );
}

import type { ReactNode } from "react";
import { ArrowsClockwise, CloudSlash } from "@phosphor-icons/react/dist/ssr";
import { Button } from "./Button";
import { cn } from "./cn";

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn("animate-pulse rounded-md bg-line/70 motion-reduce:animate-none", className)} />;
}

/** Contenedor accesible para estados de carga: anuncia qué se está cargando. */
export function LoadingState({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({ title = "No pudimos cargar esta sección", message, onRetry, className }: ErrorStateProps) {
  return (
    <div role="alert" className={cn("flex flex-col items-center gap-3 rounded-[var(--radius-panel)] border border-line bg-surface px-6 py-10 text-center", className)}>
      <CloudSlash className="size-10 text-muted" aria-hidden />
      <div className="flex flex-col gap-1">
        <p className="text-lg font-bold">{title}</p>
        <p className="max-w-sm text-[15px] text-muted">{message}</p>
      </div>
      {onRetry ? (
        <Button variant="secondary" onClick={onRetry} icon={<ArrowsClockwise className="size-5" aria-hidden />}>
          Reintentar
        </Button>
      ) : null}
    </div>
  );
}

export function EmptyState({ icon, title, message, action }: { icon: ReactNode; title: string; message: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
      <span className="text-muted">{icon}</span>
      <p className="text-lg font-bold">{title}</p>
      <p className="max-w-sm text-[15px] text-muted">{message}</p>
      {action}
    </div>
  );
}

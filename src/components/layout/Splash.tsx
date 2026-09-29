import { Wordmark } from "@/components/brand/Wordmark";
import { Spinner } from "@/components/ui/Spinner";

/** Pantalla de arranque mientras se restaura la sesión (equivale al splash nativo). */
export function Splash({ label }: { label: string }) {
  return (
    <div role="status" aria-live="polite" className="grid min-h-dvh place-items-center bg-paper">
      <div className="flex flex-col items-center gap-5">
        <Wordmark size="lg" withDescriptor />
        <span className="flex items-center gap-2 text-sm text-muted">
          <Spinner className="size-4" />
          {label}
        </span>
      </div>
    </div>
  );
}

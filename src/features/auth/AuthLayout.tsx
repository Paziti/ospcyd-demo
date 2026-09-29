import type { ReactNode } from "react";
import { Guilloche } from "@/components/brand/Guilloche";
import { Wordmark } from "@/components/brand/Wordmark";

/**
 * Mobile: franja institucional arriba y el formulario como hoja blanca superpuesta.
 * Desktop: dos columnas, identidad a la izquierda y formulario a la derecha.
 */
export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-ink lg:flex-row">
      <aside
        className="on-ink relative flex shrink-0 flex-col justify-end overflow-hidden px-6 pb-12 text-white lg:sticky lg:top-0 lg:h-dvh lg:w-[46%] lg:justify-between lg:px-14 lg:py-14"
        style={{ paddingTop: "calc(var(--safe-top) + 28px)" }}
      >
        <Guilloche className="text-accent" opacity={0.3} />
        <span aria-hidden className="absolute inset-y-0 right-0 hidden w-2 bg-accent lg:block" />
        <Wordmark tone="white" size="lg" withDescriptor className="relative" />
        <div className="relative mt-8 max-w-md lg:mt-0">
          <p className="text-[26px] font-bold leading-8 lg:text-[40px] lg:leading-[48px]">Tu credencial, siempre con vos.</p>
          <p className="mt-3 hidden text-lg leading-7 text-ink-soft lg:block">
            Mostrala en la recepción del prestador, consultá tus datos de afiliación y comunicate con OSPyD desde un solo lugar.
          </p>
        </div>
      </aside>

      <main
        className="-mt-5 flex flex-1 flex-col rounded-t-[24px] bg-surface px-5 pt-7 lg:mt-0 lg:min-h-dvh lg:items-center lg:justify-center lg:rounded-none lg:px-10 lg:py-12"
        style={{ paddingBottom: "calc(var(--safe-bottom) + 24px)" }}
      >
        <div className="mx-auto flex w-full max-w-[400px] flex-1 flex-col lg:flex-none">{children}</div>
      </main>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { CaretDown } from "@phosphor-icons/react/dist/ssr";
import { formatDni } from "@/core/lib/format";
import { demoAccounts, resetDemoData } from "@/mock/demo-accounts";

/** Solo demo: completa el formulario con afiliados ficticios para mostrar cómo cambian los datos. */
export function DemoAccounts({ onPick }: { onPick: (dni: string, password: string) => void }) {
  const accounts = useMemo(() => demoAccounts(), []);
  const [resetDone, setResetDone] = useState(false);
  return (
    <details className="group rounded-[var(--radius-control)] border border-dashed border-line-strong">
      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-2 px-3.5 text-[15px] font-semibold [&::-webkit-details-marker]:hidden">
        Afiliados de demostración
        <CaretDown className="size-5 text-muted transition-transform duration-200 group-open:rotate-180" aria-hidden />
      </summary>
      <div className="px-3.5 pb-3">
        <p className="text-sm text-muted">Datos ficticios. Contraseña de todos: 123456.</p>
        <ul className="mt-2 flex flex-col gap-1.5">
          {accounts.map((a) => (
            <li key={a.dni}>
              <button
                type="button"
                onClick={() => onPick(a.dni, a.password)}
                className="flex min-h-12 w-full items-center justify-between gap-3 rounded-lg bg-paper px-3 py-2 text-left hover:bg-brand-soft"
              >
                <span className="flex min-w-0 flex-col">
                  <span className="truncate font-semibold">{a.name}</span>
                  <span className="font-mono text-sm text-muted tabular">DNI {formatDni(a.dni)}</span>
                </span>
                <span className="shrink-0 text-sm text-muted">{a.status}</span>
              </button>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={async () => {
            await resetDemoData();
            setResetDone(true);
          }}
          className="mt-2 min-h-11 rounded-md text-sm font-semibold text-brand underline-offset-4 hover:underline"
        >
          Restablecer datos de la demo
        </button>
        {resetDone ? (
          <p role="status" className="text-sm text-success">
            Listo: se restauraron los datos y contraseñas originales.
          </p>
        ) : null}
      </div>
    </details>
  );
}

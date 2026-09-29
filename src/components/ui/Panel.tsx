import type { ReactNode } from "react";
import { cn } from "./cn";

interface PanelProps {
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  id?: string;
}

/** Bloque de contenido con título. Se separa por plano (blanco sobre gris), sin sombra. */
export function Panel({ title, description, action, children, className, id }: PanelProps) {
  const headingId = id ? `${id}-title` : undefined;
  return (
    <section id={id} aria-labelledby={headingId} className={cn("rounded-[var(--radius-panel)] border border-line bg-surface", className)}>
      {title ? (
        <header className="flex items-start justify-between gap-3 px-4 pt-4 sm:px-5 sm:pt-5">
          <div className="flex flex-col gap-0.5">
            <h2 id={headingId} className="text-lg font-bold leading-6">
              {title}
            </h2>
            {description ? <p className="text-sm text-muted">{description}</p> : null}
          </div>
          {action}
        </header>
      ) : null}
      <div className={cn("px-4 pb-4 sm:px-5 sm:pb-5", title ? "pt-3" : "pt-4 sm:pt-5")}>{children}</div>
    </section>
  );
}

export interface DataItem {
  label: string;
  value: ReactNode;
  mono?: boolean;
}

/** Lista de pares etiqueta/valor, legible en una columna y en dos a partir de tablet. */
export function DataList({ items, columns = 1 }: { items: DataItem[]; columns?: 1 | 2 }) {
  return (
    <dl className={cn("grid gap-x-6", columns === 2 && "sm:grid-cols-2")}>
      {items.map((item) => (
        <div key={item.label} className="flex flex-col gap-0.5 border-b border-line py-3 last:border-b-0">
          <dt className="text-sm text-muted">{item.label}</dt>
          <dd className={cn("break-words text-base font-semibold", item.mono && "font-mono tabular")}>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

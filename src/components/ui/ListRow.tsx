import Link from "next/link";
import type { ReactNode } from "react";
import { CaretRight } from "@phosphor-icons/react/dist/ssr";
import { cn } from "./cn";

interface ListRowProps {
  icon: ReactNode;
  title: string;
  description?: string;
  href?: string;
  external?: boolean;
  onClick?: () => void;
  trailing?: ReactNode;
  tone?: "default" | "danger";
}

const rowClasses =
  "group flex min-h-16 w-full items-center gap-3.5 px-4 py-3 text-left transition-colors duration-150 hover:bg-paper active:bg-brand-soft sm:px-5";

/** Fila de navegación/acción. Toda la fila es el objetivo táctil. */
export function ListRow({ icon, title, description, href, external, onClick, trailing, tone = "default" }: ListRowProps) {
  const danger = tone === "danger";
  const content = (
    <>
      <span
        className={cn(
          "grid size-10 shrink-0 place-items-center rounded-[var(--radius-control)]",
          danger ? "bg-danger-soft text-danger" : "bg-brand-soft text-brand",
        )}
      >
        {icon}
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className={cn("font-semibold", danger && "text-danger")}>{title}</span>
        {description ? <span className="text-sm text-muted">{description}</span> : null}
      </span>
      {trailing !== undefined
        ? trailing
        : !danger && <CaretRight className="size-5 shrink-0 text-muted transition-transform group-hover:translate-x-0.5" aria-hidden />}
    </>
  );

  if (href && external) {
    return (
      <a href={href} className={rowClasses} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
        {content}
      </a>
    );
  }
  if (href) {
    return (
      <Link href={href} className={rowClasses} onClick={onClick}>
        {content}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={rowClasses}>
      {content}
    </button>
  );
}

export function RowGroup({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("divide-y divide-line overflow-hidden rounded-[var(--radius-panel)] border border-line bg-surface", className)}>
      {children}
    </div>
  );
}

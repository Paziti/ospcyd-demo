"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "@phosphor-icons/react/dist/ssr";
import { cn } from "./cn";

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  /** "sheet": hoja inferior en mobile, diálogo centrado desde tablet. "fullscreen": ocupa toda la pantalla. */
  variant?: "sheet" | "fullscreen";
  hideTitle?: boolean;
}

/**
 * Diálogo modal sobre <dialog> nativo: foco atrapado, Escape y fondo inerte
 * los resuelve el navegador. En React Native equivale a <Modal>.
 */
export function Sheet({ open, onClose, title, description, children, footer, variant = "sheet", hideTitle }: SheetProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className={cn(
        "sheet bg-surface p-0 text-ink",
        variant === "sheet" &&
          "mx-0 mt-auto mb-0 max-h-[92dvh] w-full max-w-none rounded-t-[20px] shadow-[var(--shadow-sheet)] " +
            "sm:m-auto sm:max-h-[85dvh] sm:w-[min(32rem,calc(100vw-3rem))] sm:rounded-[20px]",
        variant === "fullscreen" && "m-0 h-dvh max-h-none w-full max-w-none",
      )}
    >
      {open ? (
        <div className={cn("flex flex-col", variant === "fullscreen" ? "h-full" : "max-h-[inherit]")}>
          <header
            className={cn(
              "flex shrink-0 items-start justify-between gap-3 px-5 pb-2",
              variant === "fullscreen" ? "pt-[calc(var(--safe-top)+12px)]" : "pt-5",
            )}
          >
            <div className={cn("flex flex-col gap-1", hideTitle && "sr-only")}>
              <h2 id={titleId} className="text-xl font-bold leading-7">
                {title}
              </h2>
              {description ? (
                <p id={descId} className="text-[15px] text-muted">
                  {description}
                </p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="-mr-2 -mt-1 ml-auto grid size-11 shrink-0 place-items-center rounded-full text-muted hover:bg-paper hover:text-ink"
            >
              <X className="size-6" aria-hidden />
            </button>
          </header>
          {children ? (
            <div className={cn("min-h-0 flex-1 overflow-y-auto px-5", footer ? "pb-4" : "pb-[calc(var(--safe-bottom)+20px)]")}>
              {children}
            </div>
          ) : null}
          {footer ? (
            <footer className={cn("flex shrink-0 flex-col-reverse gap-2 px-5 pt-3 sm:flex-row sm:justify-end", children ? "border-t border-line" : undefined)} style={{ paddingBottom: "calc(var(--safe-bottom) + 16px)" }}>
              {footer}
            </footer>
          ) : null}
        </div>
      ) : null}
    </dialog>
  );
}

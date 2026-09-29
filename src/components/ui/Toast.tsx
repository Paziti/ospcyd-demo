"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, m } from "motion/react";
import { CheckCircle, WarningCircle } from "@phosphor-icons/react/dist/ssr";
import { cn } from "./cn";

type ToastTone = "success" | "error";
interface ToastItem {
  id: number;
  tone: ToastTone;
  message: string;
}

const ToastContext = createContext<((message: string, tone?: ToastTone) => void) | null>(null);

const DURATION_MS = 4000;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const show = useCallback((message: string, tone: ToastTone = "success") => {
    const id = ++nextId.current;
    setItems((list) => [...list.slice(-2), { id, tone, message }]);
    setTimeout(() => setItems((list) => list.filter((t) => t.id !== id)), DURATION_MS);
  }, []);

  const value = useMemo(() => show, [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Región siempre montada para que los lectores de pantalla anuncien cada aviso. */}
      <div
        aria-live="polite"
        className={cn(
          "pointer-events-none fixed inset-x-0 z-50 flex flex-col items-center gap-2 px-4",
          "bottom-[calc(var(--tabbar-height)+var(--safe-bottom)+12px)] md:bottom-6 md:items-end md:px-8",
        )}
      >
        <AnimatePresence initial={false}>
          {items.map((t) => (
            <m.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, transition: { duration: 0.15 } }}
              transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
              className="flex w-full max-w-sm items-center gap-3 rounded-[var(--radius-control)] bg-ink px-4 py-3 text-[15px] text-white shadow-[var(--shadow-card)]"
            >
              {t.tone === "success" ? (
                <CheckCircle weight="fill" className="size-5 shrink-0 text-[#7fd6a4]" aria-hidden />
              ) : (
                <WarningCircle weight="fill" className="size-5 shrink-0 text-[#ffb4ab]" aria-hidden />
              )}
              {t.message}
            </m.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast debe usarse dentro de ToastProvider");
  return ctx;
}

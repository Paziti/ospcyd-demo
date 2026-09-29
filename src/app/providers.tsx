"use client";

import type { ReactNode } from "react";
import { LazyMotion, MotionConfig, domMax } from "motion/react";
import { ToastProvider } from "@/components/ui/Toast";
import { SessionProvider } from "@/features/session/session-context";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domMax} strict>
      {/* Respeta prefers-reduced-motion en todas las animaciones de motion. */}
      <MotionConfig reducedMotion="user">
        <SessionProvider>
          <ToastProvider>{children}</ToastProvider>
        </SessionProvider>
      </MotionConfig>
    </LazyMotion>
  );
}

"use client";

import type { ReactNode } from "react";
import { m } from "motion/react";

/** Entrada breve de cada pantalla: confirma el cambio de sección sin demorar el contenido. */
export default function AppTemplate({ children }: { children: ReactNode }) {
  return (
    <m.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}>
      {children}
    </m.div>
  );
}

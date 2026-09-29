import type { Metadata } from "next";
import { Suspense } from "react";
import { RecoverScreen } from "@/features/auth/RecoverScreen";

export const metadata: Metadata = { title: "Recuperar contraseña" };

export default function Page() {
  return (
    <Suspense>
      <RecoverScreen />
    </Suspense>
  );
}

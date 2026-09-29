import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginScreen } from "@/features/auth/LoginScreen";

export const metadata: Metadata = { title: "Ingresar" };

export default function Page() {
  return (
    <Suspense>
      <LoginScreen />
    </Suspense>
  );
}

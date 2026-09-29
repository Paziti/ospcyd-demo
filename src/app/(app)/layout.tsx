"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { Splash } from "@/components/layout/Splash";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/StateView";
import { ROUTES } from "@/config/routes";
import { useSession } from "@/features/session/session-context";

/** Guard de las pantallas internas. El proxy hace el chequeo previo; esto cubre sesiones vencidas o borradas. */
export default function AuthenticatedLayout({ children }: { children: ReactNode }) {
  const { state, reloadProfile, logout } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (state.status !== "anonymous") return;
    const target = state.reason === "logout" ? ROUTES.login : `${ROUTES.login}?volver=${encodeURIComponent(pathname)}`;
    router.replace(target);
  }, [state, pathname, router]);

  if (state.status === "authenticated" && state.profileError) {
    return (
      <div className="grid min-h-dvh place-items-center p-4">
        <div className="flex w-full max-w-md flex-col gap-3">
          <ErrorState title="No pudimos cargar tus datos" message={state.profileError} onRetry={reloadProfile} />
          <Button variant="ghost" onClick={logout}>
            Cerrar sesión
          </Button>
        </div>
      </div>
    );
  }

  if (state.status !== "authenticated" || !state.member) {
    return <Splash label={state.status === "anonymous" ? "Redirigiendo al ingreso…" : "Cargando tus datos…"} />;
  }

  return <AppShell member={state.member}>{children}</AppShell>;
}

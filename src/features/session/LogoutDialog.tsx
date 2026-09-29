"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SignOut } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/Button";
import { Sheet } from "@/components/ui/Sheet";
import { useToast } from "@/components/ui/Toast";
import { ROUTES } from "@/config/routes";
import { useSession } from "./session-context";

export function LogoutDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { logout } = useSession();
  const router = useRouter();
  const toast = useToast();
  const [pending, setPending] = useState(false);

  async function confirm() {
    setPending(true);
    await logout();
    router.replace(ROUTES.login);
    toast("Cerraste sesión. Tus datos ya no están visibles en este dispositivo.");
  }

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="¿Cerrar sesión?"
      description="Para volver a ver tu credencial vas a tener que ingresar con tu DNI y contraseña."
      footer={
        <>
          <Button variant="secondary" size="lg" onClick={onClose} disabled={pending}>
            Cancelar
          </Button>
          <Button variant="danger" size="lg" onClick={confirm} loading={pending} icon={<SignOut className="size-5" aria-hidden />}>
            Cerrar sesión
          </Button>
        </>
      }
    />
  );
}

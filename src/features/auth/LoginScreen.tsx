"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { errorMessage } from "@/core/services/errors";
import { onlyDigits, validateDni, validateRequired } from "@/core/lib/validation";
import { PROTECTED_PREFIXES, ROUTES } from "@/config/routes";
import { Button } from "@/components/ui/Button";
import { PasswordField, TextField } from "@/components/ui/Field";
import { Notice } from "@/components/ui/Notice";
import { useSession } from "@/features/session/session-context";
import { DemoAccounts } from "./DemoAccounts";

type Status = "idle" | "submitting" | "success";

/** Solo se vuelve a rutas internas conocidas (evita redirecciones abiertas). */
function safeReturnPath(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return ROUTES.home;
  return PROTECTED_PREFIXES.some((p) => value === p || value.startsWith(`${p}/`) || value.startsWith(`${p}?`)) ? value : ROUTES.home;
}

export function LoginScreen() {
  const { login } = useSession();
  const router = useRouter();
  const params = useSearchParams();
  const [dni, setDni] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ dni?: string; password?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (status !== "idle") return;
    const found = {
      dni: validateDni(dni) ?? undefined,
      password: validateRequired("Ingresá tu contraseña.")(password) ?? undefined,
    };
    setErrors(found);
    setFormError(null);
    if (found.dni || found.password) {
      document.getElementById(found.dni ? "login-dni" : "login-password")?.focus();
      return;
    }

    setStatus("submitting");
    try {
      await login({ dni, password });
      setStatus("success");
      router.replace(safeReturnPath(params.get("volver")));
    } catch (error) {
      setStatus("idle");
      setFormError(errorMessage(error));
      setPassword("");
      // Tras el render (el campo deja de estar deshabilitado), el foco vuelve a la contraseña.
      setTimeout(() => document.getElementById("login-password")?.focus(), 0);
    }
  }

  const busy = status !== "idle";

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-[26px] font-bold leading-8">Ingresá a tu cuenta</h1>
        <p className="text-[15px] text-muted">Usá tu DNI y tu contraseña de afiliado.</p>
      </div>

      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        {formError ? (
          <Notice tone="danger" live>
            {formError}
          </Notice>
        ) : null}
        <TextField
          id="login-dni"
          label="DNI"
          inputMode="numeric"
          autoComplete="username"
          placeholder="Sin puntos"
          value={dni}
          error={errors.dni}
          disabled={busy}
          onChange={(e) => {
            setDni(onlyDigits(e.target.value));
            if (errors.dni) setErrors((x) => ({ ...x, dni: undefined }));
          }}
        />
        <div className="flex flex-col gap-2">
          <PasswordField
            id="login-password"
            label="Contraseña"
            autoComplete="current-password"
            value={password}
            error={errors.password}
            disabled={busy}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors((x) => ({ ...x, password: undefined }));
            }}
          />
          <Link
            href={dni ? `${ROUTES.recover}?dni=${dni}` : ROUTES.recover}
            className="self-end rounded-md py-2 text-[15px] font-semibold text-brand underline-offset-4 hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
        <Button
          type="submit"
          size="lg"
          variant={status === "success" ? "success" : "primary"}
          loading={status === "submitting"}
          icon={status === "success" ? <CheckCircle weight="fill" className="size-5" aria-hidden /> : undefined}
        >
          {status === "submitting" ? "Ingresando…" : status === "success" ? "Ingresaste" : "Ingresar"}
        </Button>
      </form>

      <div className="mt-auto flex flex-col gap-4 pt-2">
        <DemoAccounts
          onPick={(d, p) => {
            setDni(d);
            setPassword(p);
            setErrors({});
            setFormError(null);
          }}
        />
        <p className="text-center text-xs leading-5 text-muted">
          Prototipo de demostración. Todos los datos son ficticios y no se envían a ningún servidor.
        </p>
      </div>
    </div>
  );
}

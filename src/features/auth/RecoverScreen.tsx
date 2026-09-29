"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, EnvelopeSimple } from "@phosphor-icons/react/dist/ssr";
import { ServiceError, errorMessage } from "@/core/services/errors";
import { onlyDigits, validateDni } from "@/core/lib/validation";
import { ROUTES } from "@/config/routes";
import { services } from "@/services";
import { Button, ButtonLink } from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";
import { Notice } from "@/components/ui/Notice";

export function RecoverScreen() {
  const params = useSearchParams();
  const [dni, setDni] = useState(() => onlyDigits(params.get("dni") ?? ""));
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const found = validateDni(dni);
    setError(found);
    setFormError(null);
    if (found) return;
    setSending(true);
    try {
      const { maskedEmail } = await services.auth.requestPasswordReset(dni);
      setSentTo(maskedEmail);
    } catch (err) {
      if (err instanceof ServiceError && err.code === "UNKNOWN_MEMBER") setError(err.message);
      else setFormError(errorMessage(err));
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <Link href={ROUTES.login} className="-ml-2 inline-flex min-h-11 items-center gap-2 self-start rounded-md px-2 font-semibold text-brand hover:bg-brand-soft">
        <ArrowLeft className="size-5" aria-hidden />
        Volver al ingreso
      </Link>

      {sentTo ? (
        <div role="status" className="flex flex-col gap-4">
          <span className="grid size-14 place-items-center rounded-full bg-success-soft text-success">
            <EnvelopeSimple weight="fill" className="size-7" aria-hidden />
          </span>
          <h1 className="text-[26px] font-bold leading-8">Revisá tu email</h1>
          <p className="text-[15px] leading-6 text-muted">
            Enviamos las instrucciones para crear una nueva contraseña a <span className="font-semibold text-ink">{sentTo}</span>. Si no lo ves, revisá la carpeta de spam.
          </p>
          <Notice>En esta demo no se envía ningún email.</Notice>
          <ButtonLink href={ROUTES.login} size="lg">
            Volver al ingreso
          </ButtonLink>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-1.5">
            <h1 className="text-[26px] font-bold leading-8">Recuperar contraseña</h1>
            <p className="text-[15px] text-muted">Ingresá tu DNI y te enviamos los pasos al email registrado.</p>
          </div>
          <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
            {formError ? (
              <Notice tone="danger" live>
                {formError}
              </Notice>
            ) : null}
            <TextField
              label="DNI"
              inputMode="numeric"
              autoComplete="username"
              placeholder="Sin puntos"
              value={dni}
              error={error}
              disabled={sending}
              onChange={(e) => {
                setDni(onlyDigits(e.target.value));
                if (error) setError(null);
              }}
            />
            <Button type="submit" size="lg" loading={sending}>
              {sending ? "Enviando…" : "Enviar instrucciones"}
            </Button>
          </form>
        </>
      )}
    </div>
  );
}

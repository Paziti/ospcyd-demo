"use client";

import { useState, type FormEvent } from "react";
import { errorMessage } from "@/core/services/errors";
import { validateNewPassword } from "@/core/lib/validation";
import { services } from "@/services";
import { Button } from "@/components/ui/Button";
import { PasswordField } from "@/components/ui/Field";
import { Notice } from "@/components/ui/Notice";
import { Sheet } from "@/components/ui/Sheet";
import { useToast } from "@/components/ui/Toast";
import { useAuthenticated } from "@/features/session/session-context";

type Errors = { current?: string; next?: string; confirm?: string };

export function ChangePasswordSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { session } = useAuthenticated();
  const toast = useToast();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function close() {
    setCurrent("");
    setNext("");
    setConfirm("");
    setErrors({});
    setSubmitError(null);
    onClose();
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const found: Errors = {};
    if (!current) found.current = "Ingresá tu contraseña actual.";
    const nextError = validateNewPassword(next);
    if (nextError) found.next = nextError;
    else if (next === current) found.next = "La nueva contraseña tiene que ser distinta de la actual.";
    if (confirm !== next) found.confirm = "Las contraseñas no coinciden.";
    setErrors(found);
    if (Object.keys(found).length) return;

    setSaving(true);
    setSubmitError(null);
    try {
      await services.auth.changePassword(session, current, next);
      toast("Contraseña actualizada correctamente.");
      close();
    } catch (error) {
      setSubmitError(errorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Sheet
      open={open}
      onClose={close}
      title="Cambiar contraseña"
      description="Usá al menos 8 caracteres combinando letras y números."
      footer={
        <>
          <Button variant="secondary" size="lg" onClick={close} disabled={saving}>
            Cancelar
          </Button>
          <Button type="submit" form="change-password" size="lg" loading={saving}>
            {saving ? "Guardando…" : "Guardar contraseña"}
          </Button>
        </>
      }
    >
      <form id="change-password" onSubmit={onSubmit} noValidate className="flex flex-col gap-4 pt-2">
        {submitError ? <Notice tone="danger" live>{submitError}</Notice> : null}
        <PasswordField label="Contraseña actual" autoComplete="current-password" value={current} error={errors.current} onChange={(e) => setCurrent(e.target.value)} />
        <PasswordField label="Nueva contraseña" autoComplete="new-password" value={next} error={errors.next} onChange={(e) => setNext(e.target.value)} />
        <PasswordField label="Repetí la nueva contraseña" autoComplete="new-password" value={confirm} error={errors.confirm} onChange={(e) => setConfirm(e.target.value)} />
      </form>
    </Sheet>
  );
}

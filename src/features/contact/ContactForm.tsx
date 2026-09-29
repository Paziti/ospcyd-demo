"use client";

import { useState, type FormEvent } from "react";
import { m } from "motion/react";
import { CheckCircle, PaperPlaneRight } from "@phosphor-icons/react/dist/ssr";
import type { ContactMessage, ContactTopic } from "@/core/models/contact";
import { errorMessage } from "@/core/services/errors";
import { CONTACT_TOPICS } from "@/content/contact";
import { services } from "@/services";
import { Button } from "@/components/ui/Button";
import { SelectField, TextAreaField } from "@/components/ui/Field";
import { Notice } from "@/components/ui/Notice";
import { Panel } from "@/components/ui/Panel";
import { useAuthenticated } from "@/features/session/session-context";

const MAX_LENGTH = 1000;
const MIN_LENGTH = 15;

type Status = { kind: "editing" } | { kind: "sending" } | { kind: "sent"; ticket: string } | { kind: "error"; message: string };

export function ContactForm() {
  const { session, member } = useAuthenticated();
  const [topic, setTopic] = useState<ContactTopic | "">("");
  const [message, setMessage] = useState("");
  const [replyTo, setReplyTo] = useState<ContactMessage["replyTo"]>("email");
  const [errors, setErrors] = useState<{ topic?: string; message?: string }>({});
  const [status, setStatus] = useState<Status>({ kind: "editing" });

  function reset() {
    setTopic("");
    setMessage("");
    setErrors({});
    setStatus({ kind: "editing" });
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const found: typeof errors = {};
    if (!topic) found.topic = "Elegí el motivo de tu consulta.";
    if (message.trim().length < MIN_LENGTH) found.message = `Contanos un poco más (mínimo ${MIN_LENGTH} caracteres).`;
    setErrors(found);
    if (Object.keys(found).length || !topic) return;

    setStatus({ kind: "sending" });
    try {
      const receipt = await services.contact.send(session, { topic, message: message.trim(), replyTo });
      setStatus({ kind: "sent", ticket: receipt.ticket });
    } catch (error) {
      setStatus({ kind: "error", message: errorMessage(error) });
    }
  }

  if (status.kind === "sent") {
    return (
      <Panel title="Escribinos">
        <m.div
          role="status"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
          className="flex flex-col items-center gap-3 py-6 text-center"
        >
          <CheckCircle weight="fill" className="size-12 text-success" aria-hidden />
          <p className="text-lg font-bold">Recibimos tu consulta</p>
          <p className="max-w-sm text-[15px] text-muted">
            Te vamos a responder por {replyTo === "email" ? `email a ${member.email}` : `teléfono al ${member.phone}`}. Número de seguimiento:{" "}
            <span className="font-mono font-semibold text-ink tabular">{status.ticket}</span>
          </p>
          <Button variant="secondary" onClick={reset}>
            Enviar otra consulta
          </Button>
        </m.div>
      </Panel>
    );
  }

  const sending = status.kind === "sending";
  const remaining = MAX_LENGTH - message.length;

  return (
    <Panel title="Escribinos" description="Respondemos en días hábiles.">
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        {status.kind === "error" ? (
          <Notice tone="danger" live title="No pudimos enviar tu consulta">
            {status.message}
          </Notice>
        ) : null}
        <SelectField
          label="Motivo"
          value={topic}
          error={errors.topic}
          disabled={sending}
          onChange={(e) => {
            setTopic(e.target.value as ContactTopic);
            setErrors((x) => ({ ...x, topic: undefined }));
          }}
          options={[{ value: "", label: "Elegí un motivo" }, ...CONTACT_TOPICS]}
        />
        <div className="flex flex-col gap-1">
          <TextAreaField
            label="Tu consulta"
            value={message}
            maxLength={MAX_LENGTH}
            error={errors.message}
            disabled={sending}
            placeholder="Contanos en qué te podemos ayudar."
            onChange={(e) => {
              setMessage(e.target.value);
              if (errors.message) setErrors((x) => ({ ...x, message: undefined }));
            }}
          />
          <p className="self-end text-sm text-muted tabular" aria-live="polite">
            {remaining < 100 ? `Te quedan ${remaining} caracteres` : `${message.length}/${MAX_LENGTH}`}
          </p>
        </div>
        <fieldset className="flex flex-col gap-2" disabled={sending}>
          <legend className="mb-1.5 text-sm font-semibold">¿Cómo preferís que te respondamos?</legend>
          {(
            [
              { value: "email", label: "Por email", detail: member.email },
              { value: "telefono", label: "Por teléfono", detail: member.phone },
            ] as const
          ).map((o) => (
            <label
              key={o.value}
              className="flex min-h-14 cursor-pointer items-center gap-3 rounded-[var(--radius-control)] border border-line-strong px-3.5 py-2.5 has-[:checked]:border-brand has-[:checked]:bg-brand-soft"
            >
              <input type="radio" name="replyTo" value={o.value} checked={replyTo === o.value} onChange={() => setReplyTo(o.value)} className="size-5 accent-[var(--color-brand)]" />
              <span className="flex min-w-0 flex-col">
                <span className="font-semibold">{o.label}</span>
                <span className="truncate text-sm text-muted">{o.detail}</span>
              </span>
            </label>
          ))}
        </fieldset>
        <Button type="submit" size="lg" loading={sending} icon={<PaperPlaneRight className="size-5" aria-hidden />}>
          {sending ? "Enviando…" : "Enviar consulta"}
        </Button>
      </form>
    </Panel>
  );
}

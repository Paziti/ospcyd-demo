"use client";

import { useState, type FormEvent } from "react";
import { PencilSimple } from "@phosphor-icons/react/dist/ssr";
import type { EditableContactFields, Member } from "@/core/models/member";
import { errorMessage } from "@/core/services/errors";
import { validateEmail, validatePhone, validateRequired } from "@/core/lib/validation";
import { services } from "@/services";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";
import { Notice } from "@/components/ui/Notice";
import { DataList, Panel } from "@/components/ui/Panel";
import { useToast } from "@/components/ui/Toast";
import { useAuthenticated, useSession } from "@/features/session/session-context";

type FormValues = {
  email: string;
  phone: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
};
type Errors = Partial<Record<keyof FormValues, string>>;

const toForm = (m: Member): FormValues => ({ email: m.email, phone: m.phone, ...m.address });

function validate(v: FormValues): Errors {
  const errors: Errors = {};
  const checks: [keyof FormValues, string | null][] = [
    ["email", validateEmail(v.email)],
    ["phone", validatePhone(v.phone)],
    ["street", validateRequired("Ingresá calle y número.")(v.street)],
    ["city", validateRequired("Ingresá la localidad.")(v.city)],
    ["province", validateRequired("Ingresá la provincia.")(v.province)],
    ["postalCode", validateRequired("Ingresá el código postal.")(v.postalCode)],
  ];
  for (const [key, message] of checks) if (message) errors[key] = message;
  return errors;
}

export function ContactDetails({ member }: { member: Member }) {
  const { session } = useAuthenticated();
  const { setMember } = useSession();
  const toast = useToast();
  const [editing, setEditing] = useState(false);
  const [values, setValues] = useState<FormValues>(() => toForm(member));
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const initial = toForm(member);
  const dirty = (Object.keys(values) as (keyof FormValues)[]).some((k) => values[k].trim() !== initial[k]);

  function startEditing() {
    setValues(toForm(member));
    setErrors({});
    setSubmitError(null);
    setEditing(true);
  }

  function update(key: keyof FormValues, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      document.getElementById(`contact-${Object.keys(found)[0]}`)?.focus();
      return;
    }
    setSaving(true);
    setSubmitError(null);
    const fields: EditableContactFields = {
      email: values.email.trim(),
      phone: values.phone.trim(),
      address: {
        street: values.street.trim(),
        city: values.city.trim(),
        province: values.province.trim(),
        postalCode: values.postalCode.trim(),
      },
    };
    try {
      setMember(await services.member.updateContact(session, fields));
      setEditing(false);
      toast("Datos actualizados correctamente.");
    } catch (error) {
      setSubmitError(errorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  if (!editing) {
    return (
      <Panel
        title="Datos de contacto"
        description="Los usamos para avisarte sobre autorizaciones y tu credencial."
        action={
          <Button variant="ghost" onClick={startEditing} icon={<PencilSimple className="size-5" aria-hidden />} className="-mr-2 -mt-1.5">
            Editar
          </Button>
        }
      >
        <DataList
          items={[
            { label: "Email", value: member.email },
            { label: "Teléfono", value: member.phone, mono: true },
            {
              label: "Domicilio",
              value: `${member.address.street}, ${member.address.city}, ${member.address.province} (${member.address.postalCode})`,
            },
          ]}
        />
      </Panel>
    );
  }

  return (
    <Panel title="Editar datos de contacto" description="Revisá que el email y el teléfono sean correctos.">
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        {submitError ? <Notice tone="danger" live title="No se guardaron los cambios">{submitError}</Notice> : null}
        <TextField id="contact-email" label="Email" type="email" autoComplete="email" inputMode="email" value={values.email} error={errors.email} onChange={(e) => update("email", e.target.value)} />
        <TextField id="contact-phone" label="Teléfono celular" type="tel" autoComplete="tel" inputMode="tel" hint="Con código de área, sin 0 ni 15." value={values.phone} error={errors.phone} onChange={(e) => update("phone", e.target.value)} />
        <TextField id="contact-street" label="Calle y número" autoComplete="street-address" value={values.street} error={errors.street} onChange={(e) => update("street", e.target.value)} />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField id="contact-city" label="Localidad" autoComplete="address-level2" value={values.city} error={errors.city} onChange={(e) => update("city", e.target.value)} />
          <TextField id="contact-province" label="Provincia" autoComplete="address-level1" value={values.province} error={errors.province} onChange={(e) => update("province", e.target.value)} />
        </div>
        <TextField id="contact-postalCode" label="Código postal" autoComplete="postal-code" className="sm:max-w-40" value={values.postalCode} error={errors.postalCode} onChange={(e) => update("postalCode", e.target.value)} />
        <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
          <Button variant="secondary" size="lg" onClick={() => setEditing(false)} disabled={saving}>
            Cancelar
          </Button>
          <Button type="submit" size="lg" loading={saving} disabled={!dirty}>
            {saving ? "Guardando…" : "Guardar cambios"}
          </Button>
        </div>
      </form>
    </Panel>
  );
}

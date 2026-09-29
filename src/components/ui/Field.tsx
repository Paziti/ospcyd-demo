"use client";

import { useId, useState, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { Eye, EyeSlash, WarningCircle } from "@phosphor-icons/react/dist/ssr";
import { cn } from "./cn";

const control =
  "w-full rounded-[var(--radius-control)] border bg-surface px-3.5 text-base text-ink placeholder:text-muted/80 " +
  "transition-[border-color,box-shadow] duration-150 outline-none " +
  "focus:border-brand focus:shadow-[0_0_0_3px_var(--color-brand-soft)] " +
  "disabled:bg-paper disabled:text-muted read-only:bg-paper";

interface FieldShellProps {
  id: string;
  label: string;
  hint?: string;
  error?: string | null;
  children: ReactNode;
}

function FieldShell({ id, label, hint, error, children }: FieldShellProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-ink">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="flex items-start gap-1.5 text-sm text-danger">
          <WarningCircle weight="fill" className="mt-0.5 size-4 shrink-0" aria-hidden />
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-sm text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function describedBy(id: string, error?: string | null, hint?: string) {
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
}

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string | null;
  trailing?: ReactNode;
}

export function TextField({ id: idProp, label, hint, error, trailing, className, ...rest }: TextFieldProps) {
  const autoId = useId();
  const id = idProp ?? autoId;
  return (
    <FieldShell id={id} label={label} hint={hint} error={error}>
      <div className="relative">
        <input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, error, hint)}
          className={cn(control, "h-12", error ? "border-danger" : "border-line-strong", trailing ? "pr-12" : undefined, className)}
          {...rest}
        />
        {trailing ? <div className="absolute inset-y-0 right-0 flex items-center pr-1">{trailing}</div> : null}
      </div>
    </FieldShell>
  );
}

export function PasswordField(props: Omit<TextFieldProps, "type" | "trailing">) {
  const [visible, setVisible] = useState(false);
  return (
    <TextField
      {...props}
      type={visible ? "text" : "password"}
      trailing={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
          aria-pressed={visible}
          className="grid size-11 place-items-center rounded-lg text-muted hover:text-ink"
        >
          {visible ? <EyeSlash className="size-5" aria-hidden /> : <Eye className="size-5" aria-hidden />}
        </button>
      }
    />
  );
}

interface SelectFieldProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "id"> {
  label: string;
  hint?: string;
  error?: string | null;
  options: ReadonlyArray<{ value: string; label: string }>;
}

export function SelectField({ label, hint, error, options, className, ...rest }: SelectFieldProps) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} hint={hint} error={error}>
      <select
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        className={cn(control, "h-12 appearance-none bg-[length:20px] bg-[right_12px_center] bg-no-repeat pr-10", error ? "border-danger" : "border-line-strong", className)}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'%3E%3Cpath fill='%234a5b6c' d='M213.7 101.7l-80 80a8 8 0 0 1-11.4 0l-80-80a8 8 0 0 1 11.4-11.4L128 164.7l74.3-74.4a8 8 0 0 1 11.4 11.4z'/%3E%3C/svg%3E\")",
        }}
        {...rest}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

interface TextAreaFieldProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id"> {
  label: string;
  hint?: string;
  error?: string | null;
}

export function TextAreaField({ label, hint, error, className, ...rest }: TextAreaFieldProps) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} hint={hint} error={error}>
      <textarea
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        className={cn(control, "min-h-32 resize-y py-3 leading-6", error ? "border-danger" : "border-line-strong", className)}
        {...rest}
      />
    </FieldShell>
  );
}

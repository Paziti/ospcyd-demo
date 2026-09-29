import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "./cn";
import { Spinner } from "./Spinner";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "success";
type Size = "md" | "lg";

const base =
  "relative inline-flex select-none items-center justify-center gap-2 rounded-[var(--radius-control)] font-semibold " +
  "transition-[background-color,border-color,color,transform] duration-150 ease-[var(--ease-out-soft)] " +
  "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-brand text-white hover:bg-brand-strong",
  secondary: "border border-line-strong bg-surface text-ink hover:border-ink hover:bg-paper",
  ghost: "text-brand hover:bg-brand-soft",
  danger: "border border-danger/40 bg-surface text-danger hover:border-danger hover:bg-danger-soft",
  success: "bg-success text-white",
};

const sizes: Record<Size, string> = {
  md: "min-h-11 px-4 text-[15px]",
  lg: "min-h-13 px-5 text-base",
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: ReactNode;
}

export function Button({ variant, size, loading, icon, className, children, disabled, type = "button", ...rest }: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClasses(variant, size, className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? <Spinner /> : icon}
      {children}
    </button>
  );
}

interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  external?: boolean;
}

export function ButtonLink({ href, variant, size, icon, className, children, external, ...rest }: ButtonLinkProps) {
  const classes = buttonClasses(variant, size, className);
  if (external) {
    return (
      <a href={href} className={classes} {...rest}>
        {icon}
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} {...rest}>
      {icon}
      {children}
    </Link>
  );
}

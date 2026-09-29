import type { ReactNode } from "react";
import { CheckCircle, Info, WarningCircle } from "@phosphor-icons/react/dist/ssr";
import { cn } from "./cn";

type Tone = "info" | "success" | "warning" | "danger";

const tones: Record<Tone, { className: string; Icon: typeof Info }> = {
  info: { className: "bg-brand-soft text-ink", Icon: Info },
  success: { className: "bg-success-soft text-success", Icon: CheckCircle },
  warning: { className: "bg-warning-soft text-warning", Icon: WarningCircle },
  danger: { className: "bg-danger-soft text-danger", Icon: WarningCircle },
};

interface NoticeProps {
  tone?: Tone;
  title?: string;
  children?: ReactNode;
  action?: ReactNode;
  className?: string;
  live?: boolean;
}

export function Notice({ tone = "info", title, children, action, className, live }: NoticeProps) {
  const { className: toneClass, Icon } = tones[tone];
  return (
    <div
      role={live ? (tone === "danger" ? "alert" : "status") : undefined}
      className={cn("flex gap-3 rounded-[var(--radius-control)] p-3.5 text-[15px] leading-snug", toneClass, className)}
    >
      <Icon weight="fill" className="mt-0.5 size-5 shrink-0" aria-hidden />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {title ? <p className="font-bold">{title}</p> : null}
        {children ? <div className={cn(tone === "info" && "text-muted")}>{children}</div> : null}
        {action ? <div className="mt-1.5">{action}</div> : null}
      </div>
    </div>
  );
}

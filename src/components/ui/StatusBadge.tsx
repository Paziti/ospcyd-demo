import { CheckCircle, Clock, WarningCircle } from "@phosphor-icons/react/dist/ssr";
import type { CredentialStatus } from "@/core/models/credential";
import { STATUS_LABEL } from "@/core/lib/credential-status";
import { cn } from "./cn";

const styles: Record<CredentialStatus, { className: string; Icon: typeof CheckCircle }> = {
  active: { className: "bg-success-soft text-success", Icon: CheckCircle },
  expiring: { className: "bg-warning-soft text-warning", Icon: Clock },
  expired: { className: "bg-danger-soft text-danger", Icon: WarningCircle },
};

/** Estado de cobertura: color + ícono + texto, para no depender solo del color. */
export function StatusBadge({ status, className }: { status: CredentialStatus; className?: string }) {
  const { className: tone, Icon } = styles[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[13px] font-bold leading-none", tone, className)}>
      <Icon weight="fill" className="size-4" aria-hidden />
      {STATUS_LABEL[status]}
    </span>
  );
}

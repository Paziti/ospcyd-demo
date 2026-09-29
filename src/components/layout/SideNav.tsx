"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOut } from "@phosphor-icons/react/dist/ssr";
import type { Member } from "@/core/models/member";
import { fullName } from "@/core/lib/format";
import { Wordmark } from "@/components/brand/Wordmark";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/components/ui/cn";
import { NAV_ITEMS, isActive } from "./nav-items";

/** Tablet (md): riel compacto de íconos con etiqueta. Desktop (lg): barra lateral completa. */
export function SideNav({ member, onLogout }: { member: Member; onLogout: () => void }) {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-line bg-surface md:flex md:w-[88px] lg:w-[264px]">
      <div className="flex h-20 items-center justify-center px-3 lg:justify-start lg:px-6">
        <span className="lg:hidden">
          <Wordmark size="sm" />
        </span>
        <span className="hidden lg:block">
          <Wordmark size="md" withDescriptor />
        </span>
      </div>

      <Link
        href="/cuenta"
        className="mx-3 mb-4 hidden items-center gap-3 rounded-[var(--radius-control)] border border-line p-3 hover:bg-paper lg:flex"
      >
        <Avatar name={member} photoUrl={member.photoUrl} size="md" />
        <span className="flex min-w-0 flex-col">
          <span className="truncate font-bold">{fullName(member)}</span>
          <span className="truncate font-mono text-sm text-muted tabular">{member.affiliateNumber}</span>
        </span>
      </Link>

      <nav aria-label="Principal" className="flex-1 px-2 lg:px-3">
        <ul className="flex flex-col gap-1">
          {NAV_ITEMS.map(({ href, label, shortLabel, Icon }) => {
            const active = isActive(pathname, href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex min-h-12 items-center rounded-[var(--radius-control)] transition-colors duration-150",
                    "flex-col justify-center gap-1 py-2 text-xs lg:flex-row lg:justify-start lg:gap-3 lg:px-3 lg:text-[15px]",
                    active ? "bg-brand-soft font-bold text-brand-strong" : "font-semibold text-muted hover:bg-paper hover:text-ink",
                  )}
                >
                  <Icon weight={active ? "fill" : "regular"} className="size-6 shrink-0" aria-hidden />
                  <span className="lg:hidden">{shortLabel}</span>
                  <span className="hidden lg:inline">{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-line px-2 py-3 lg:px-3">
        <button
          type="button"
          onClick={onLogout}
          className="flex min-h-12 w-full flex-col items-center justify-center gap-1 rounded-[var(--radius-control)] text-xs font-semibold text-danger hover:bg-danger-soft lg:flex-row lg:justify-start lg:gap-3 lg:px-3 lg:text-[15px]"
        >
          <SignOut className="size-6 shrink-0" aria-hidden />
          <span className="lg:hidden">Salir</span>
          <span className="hidden lg:inline">Cerrar sesión</span>
        </button>
        <p className="mt-2 hidden px-3 text-xs text-muted lg:block">Prototipo con datos ficticios</p>
      </div>
    </aside>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/components/ui/cn";
import { NAV_ITEMS, isActive } from "./nav-items";

/** Navegación inferior en mobile: los cinco destinos siempre a un toque del pulgar. */
export function TabBar() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Principal"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface md:hidden"
      style={{ paddingBottom: "var(--safe-bottom)" }}
    >
      <ul className="mx-auto grid h-[var(--tabbar-height)] max-w-lg grid-cols-5">
        {NAV_ITEMS.map(({ href, shortLabel, Icon, primary }) => {
          const active = isActive(pathname, href);
          return (
            <li key={href} className="flex">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex flex-1 flex-col items-center justify-center gap-1 text-[11px] leading-none transition-colors duration-150 xs:text-xs",
                  active ? "font-bold text-brand-strong" : "font-semibold text-muted active:text-ink",
                )}
              >
                <span
                  className={cn(
                    "grid h-8 w-12 place-items-center rounded-full transition-colors duration-200",
                    primary && !active && "bg-brand-deep text-white",
                    primary && active && "bg-brand text-white",
                    !primary && active && "bg-brand-soft",
                  )}
                >
                  <Icon weight={active ? "fill" : "regular"} className="size-6" aria-hidden />
                </span>
                {shortLabel}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

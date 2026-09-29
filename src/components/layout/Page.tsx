import type { ReactNode } from "react";
import { cn } from "@/components/ui/cn";

interface PageProps {
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  width?: "narrow" | "wide";
}

/** Contenedor de pantalla: márgenes por breakpoint y un único h1 por vista. */
export function Page({ title, description, action, children, width = "narrow" }: PageProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 pt-5 pb-8 sm:px-6 md:pt-8 lg:px-10 lg:pt-10",
        width === "narrow" ? "max-w-3xl" : "max-w-6xl",
      )}
    >
      <header className="mb-5 flex flex-wrap items-end justify-between gap-3 md:mb-7">
        <div className="flex min-w-0 flex-col gap-1">
          <h1 className="text-2xl font-bold leading-8 tracking-[-0.01em] xs:text-[28px] xs:leading-9">{title}</h1>
          {description ? <p className="text-[15px] text-muted md:text-base">{description}</p> : null}
        </div>
        {action}
      </header>
      {children}
    </div>
  );
}

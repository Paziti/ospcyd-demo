"use client";

import { useState, type ReactNode } from "react";
import type { Member } from "@/core/models/member";
import { LogoutDialog } from "@/features/session/LogoutDialog";
import { SideNav } from "./SideNav";
import { TabBar } from "./TabBar";
import { TopBar } from "./TopBar";

export function AppShell({ member, children }: { member: Member; children: ReactNode }) {
  const [logoutOpen, setLogoutOpen] = useState(false);
  const openLogout = () => setLogoutOpen(true);

  return (
    <div className="min-h-dvh">
      <a
        href="#contenido"
        className="sr-only z-50 rounded-md bg-ink px-4 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Saltar al contenido
      </a>
      <TopBar member={member} onLogout={openLogout} />
      <SideNav member={member} onLogout={openLogout} />
      <main
        id="contenido"
        tabIndex={-1}
        className="pb-[calc(var(--tabbar-height)+var(--safe-bottom))] outline-none md:pb-0 md:pl-[88px] lg:pl-[264px]"
      >
        {children}
      </main>
      <TabBar />
      <LogoutDialog open={logoutOpen} onClose={() => setLogoutOpen(false)} />
    </div>
  );
}

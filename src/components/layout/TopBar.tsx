"use client";

import { useState } from "react";
import { SignOut, UserCircle } from "@phosphor-icons/react/dist/ssr";
import type { Member } from "@/core/models/member";
import { fullName } from "@/core/lib/format";
import { ROUTES } from "@/config/routes";
import { Wordmark } from "@/components/brand/Wordmark";
import { Avatar } from "@/components/ui/Avatar";
import { ListRow, RowGroup } from "@/components/ui/ListRow";
import { Sheet } from "@/components/ui/Sheet";

/** Barra superior en mobile: marca y acceso a la cuenta (incluye cerrar sesión). */
export function TopBar({ member, onLogout }: { member: Member; onLogout: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header
        className="sticky top-0 z-20 border-b border-line bg-surface/95 backdrop-blur-sm md:hidden"
        style={{ paddingTop: "var(--safe-top)" }}
      >
        <div className="flex h-14 items-center justify-between px-4">
          <Wordmark size="sm" />
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label={`Menú de cuenta de ${fullName(member)}`}
            aria-haspopup="dialog"
            className="-mr-1.5 grid size-11 place-items-center rounded-full"
          >
            <Avatar name={member} photoUrl={member.photoUrl} size="sm" />
          </button>
        </div>
      </header>

      <Sheet open={menuOpen} onClose={() => setMenuOpen(false)} title="Tu cuenta" hideTitle>
        <div className="flex items-center gap-3 pb-4">
          <Avatar name={member} photoUrl={member.photoUrl} size="lg" />
          <div className="flex min-w-0 flex-col">
            <p className="text-lg font-bold leading-6">{fullName(member)}</p>
            <p className="font-mono text-sm text-muted tabular">Afiliado {member.affiliateNumber}</p>
          </div>
        </div>
        <RowGroup>
          <ListRow
            href={ROUTES.account}
            onClick={() => setMenuOpen(false)}
            icon={<UserCircle className="size-5" aria-hidden />}
            title="Mi cuenta"
            description="Datos personales, contacto y contraseña"
          />
          <ListRow
            onClick={() => {
              setMenuOpen(false);
              onLogout();
            }}
            icon={<SignOut className="size-5" aria-hidden />}
            title="Cerrar sesión"
            tone="danger"
          />
        </RowGroup>
        <p className="mt-4 text-center text-xs text-muted">Prototipo de demostración con datos ficticios</p>
      </Sheet>
    </>
  );
}

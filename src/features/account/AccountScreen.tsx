"use client";

import { useState } from "react";
import { Eye, EyeSlash, LockKey, SignOut } from "@phosphor-icons/react/dist/ssr";
import { age, formatDate, formatDni, fullName, maskCuil, maskDni } from "@/core/lib/format";
import { Page } from "@/components/layout/Page";
import { Button } from "@/components/ui/Button";
import { ListRow, RowGroup } from "@/components/ui/ListRow";
import { DataList, Panel } from "@/components/ui/Panel";
import { LogoutDialog } from "@/features/session/LogoutDialog";
import { useAuthenticated } from "@/features/session/session-context";
import { ChangePasswordSheet } from "./ChangePasswordSheet";
import { ContactDetails } from "./ContactDetails";
import { ProfileHeader } from "./ProfileHeader";

export function AccountScreen() {
  const { member } = useAuthenticated();
  const [showIds, setShowIds] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  return (
    <Page title="Mi cuenta" description="Tus datos como afiliado de OSPCyD.">
      <div className="flex flex-col gap-5">
        <ProfileHeader member={member} />

        <Panel
          title="Datos personales"
          description="Para corregirlos comunicate con OSPCyD."
          action={
            <Button
              variant="ghost"
              onClick={() => setShowIds((v) => !v)}
              aria-pressed={showIds}
              className="-mr-2 -mt-1.5"
              icon={showIds ? <EyeSlash className="size-5" aria-hidden /> : <Eye className="size-5" aria-hidden />}
            >
              {showIds ? "Ocultar" : "Mostrar"}
            </Button>
          }
        >
          <DataList
            columns={2}
            items={[
              { label: "Nombre y apellido", value: fullName(member) },
              { label: "DNI", value: showIds ? formatDni(member.dni) : maskDni(member.dni), mono: true },
              { label: "CUIL", value: showIds ? member.cuil : maskCuil(member.cuil), mono: true },
              { label: "Fecha de nacimiento", value: `${formatDate(member.birthDate)} (${age(member.birthDate, new Date())} años)` },
            ]}
          />
        </Panel>

        <Panel title="Afiliación">
          <DataList
            columns={2}
            items={[
              { label: "Plan", value: member.plan.name },
              { label: "Nº de afiliado", value: member.affiliateNumber, mono: true },
              { label: "Tipo de afiliado", value: member.relationship ? `${member.affiliateType} (${member.relationship})` : member.affiliateType },
              { label: "Régimen", value: member.regime },
              { label: "Empresa", value: member.employer.name },
              { label: "CUIT empresa", value: member.employer.cuit, mono: true },
              { label: "Afiliado desde", value: formatDate(member.memberSince), mono: true },
            ]}
          />
        </Panel>

        <ContactDetails member={member} />

        <section aria-labelledby="seguridad-title" className="flex flex-col gap-3">
          <h2 id="seguridad-title" className="text-lg font-bold">
            Seguridad
          </h2>
          <RowGroup>
            <ListRow onClick={() => setPasswordOpen(true)} icon={<LockKey className="size-5" aria-hidden />} title="Cambiar contraseña" description="Te recomendamos cambiarla periódicamente" />
            <ListRow onClick={() => setLogoutOpen(true)} icon={<SignOut className="size-5" aria-hidden />} title="Cerrar sesión" description="Sale de tu cuenta en este dispositivo" tone="danger" />
          </RowGroup>
        </section>
      </div>

      <ChangePasswordSheet open={passwordOpen} onClose={() => setPasswordOpen(false)} />
      <LogoutDialog open={logoutOpen} onClose={() => setLogoutOpen(false)} />
    </Page>
  );
}

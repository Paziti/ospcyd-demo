"use client";

import { useState } from "react";
import Link from "next/link";
import { Buildings, ChatCircleText, IdentificationCard, QrCode, UserCircle } from "@phosphor-icons/react/dist/ssr";
import type { Credential, CredentialStatus } from "@/core/models/credential";
import { credentialStatus } from "@/core/lib/credential-status";
import { formatLongDate, greeting } from "@/core/lib/format";
import { ROUTES } from "@/config/routes";
import { Page } from "@/components/layout/Page";
import { Button, ButtonLink } from "@/components/ui/Button";
import { ListRow, RowGroup } from "@/components/ui/ListRow";
import { DataList, Panel } from "@/components/ui/Panel";
import { ErrorState, LoadingState, Skeleton } from "@/components/ui/StateView";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CredentialCard } from "@/features/credential/CredentialCard";
import { StatusNotice } from "@/features/credential/CredentialScreen";
import { PresentCredential } from "@/features/credential/PresentCredential";
import { useCredential } from "@/features/credential/use-credential";
import { useAuthenticated } from "@/features/session/session-context";

export function HomeScreen() {
  const { member } = useAuthenticated();
  const credential = useCredential();
  const now = new Date();
  const firstName = member.firstName.split(" ")[0];

  return (
    <Page title={`${greeting(now)}, ${firstName}`} description={formatLongDate(now)} width="wide">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:gap-8">
        <section aria-label="Tu credencial" className="flex flex-col gap-4">
          {credential.status === "loading" ? (
            <LoadingState label="Cargando tu credencial">
              <Skeleton className="aspect-[1.586] w-full max-w-[520px] rounded-[20px]" />
              <Skeleton className="mt-4 h-13 w-full max-w-[520px]" />
            </LoadingState>
          ) : credential.status === "error" ? (
            <ErrorState title="No pudimos cargar tu credencial" message={credential.message} onRetry={credential.retry} />
          ) : (
            <HomeCredential credential={credential.data} status={credentialStatus(credential.data, now)} />
          )}
        </section>

        <div className="flex flex-col gap-6">
          <Panel
            title="Tu afiliación"
            action={credential.status === "ready" ? <StatusBadge status={credentialStatus(credential.data, now)} /> : null}
          >
            <DataList
              items={[
                { label: "Plan", value: member.plan.name },
                { label: "Nº de afiliado", value: member.affiliateNumber, mono: true },
                { label: "Tipo de afiliado", value: member.relationship ? `${member.affiliateType} (${member.relationship})` : member.affiliateType },
                { label: "Empresa", value: member.employer.name },
              ]}
            />
          </Panel>

          <section aria-labelledby="accesos-title" className="flex flex-col gap-3">
            <h2 id="accesos-title" className="text-lg font-bold">
              Accesos
            </h2>
            <RowGroup>
              <ListRow href={ROUTES.account} icon={<UserCircle className="size-5" aria-hidden />} title="Mi cuenta" description="Email, teléfono, domicilio y contraseña" />
              <ListRow href={ROUTES.company} icon={<Buildings className="size-5" aria-hidden />} title="Nuestra empresa" description="Quiénes somos y qué cubre tu plan" />
              <ListRow href={ROUTES.contact} icon={<ChatCircleText className="size-5" aria-hidden />} title="Contacto" description="Teléfono, WhatsApp y consultas" />
            </RowGroup>
          </section>
        </div>
      </div>
    </Page>
  );
}

function HomeCredential({ credential, status }: { credential: Credential; status: CredentialStatus }) {
  const [presenting, setPresenting] = useState(false);
  const expired = status === "expired";

  return (
    <>
      <Link
        href={ROUTES.credential}
        aria-label="Abrir mi credencial"
        className="block w-full max-w-[520px] rounded-[20px] transition-transform duration-200 active:scale-[0.99]"
      >
        <CredentialCard credential={credential} status={status} />
      </Link>
      <div className="grid w-full max-w-[520px] gap-2 sm:grid-cols-2">
        {!expired ? (
          <Button size="lg" onClick={() => setPresenting(true)} icon={<QrCode className="size-5" aria-hidden />}>
            Mostrar en recepción
          </Button>
        ) : null}
        <ButtonLink
          href={ROUTES.credential}
          variant="secondary"
          size="lg"
          className={expired ? "sm:col-span-2" : undefined}
          icon={<IdentificationCard className="size-5" aria-hidden />}
        >
          Ver credencial completa
        </ButtonLink>
      </div>
      {/* El aviso va después de la tarjeta: la credencial siempre queda en la primera pantalla. */}
      {status !== "active" ? (
        <div className="w-full max-w-[520px]">
          <StatusNotice credential={credential} status={status} />
        </div>
      ) : null}
      {!expired ? (
        <PresentCredential open={presenting} onClose={() => setPresenting(false)} credential={credential} status={status} />
      ) : null}
    </>
  );
}

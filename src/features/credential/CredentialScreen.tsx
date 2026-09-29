"use client";

import { useState } from "react";
import { ArrowsLeftRight, Copy, CornersOut, ShareNetwork } from "@phosphor-icons/react/dist/ssr";
import type { Credential, CredentialStatus } from "@/core/models/credential";
import { credentialStatus, daysUntilExpiry } from "@/core/lib/credential-status";
import { formatDate, formatDni } from "@/core/lib/format";
import { ROUTES } from "@/config/routes";
import { Page } from "@/components/layout/Page";
import { Button, ButtonLink } from "@/components/ui/Button";
import { cn } from "@/components/ui/cn";
import { Notice } from "@/components/ui/Notice";
import { DataList, Panel } from "@/components/ui/Panel";
import { ErrorState, LoadingState, Skeleton } from "@/components/ui/StateView";
import { useToast } from "@/components/ui/Toast";
import { copyText, shareText } from "@/platform/web/device";
import { CredentialCard, type CardFace } from "./CredentialCard";
import { LiveQr } from "./LiveQr";
import { PresentCredential } from "./PresentCredential";
import { useCredential } from "./use-credential";

export function CredentialScreen() {
  const resource = useCredential();

  return (
    <Page title="Mi credencial" description="Mostrala en la recepción del prestador junto con tu DNI." width="wide">
      {resource.status === "loading" ? (
        <CredentialSkeleton />
      ) : resource.status === "error" ? (
        <ErrorState title="No pudimos cargar tu credencial" message={resource.message} onRetry={resource.retry} />
      ) : (
        <CredentialReady credential={resource.data} />
      )}
    </Page>
  );
}

function CredentialReady({ credential }: { credential: Credential }) {
  const [face, setFace] = useState<CardFace>("front");
  const [presenting, setPresenting] = useState(false);
  const toast = useToast();
  const status = credentialStatus(credential, new Date());
  const flip = () => setFace((f) => (f === "front" ? "back" : "front"));

  async function share() {
    const result = await shareText({
      title: "Credencial OSPyD",
      text: [
        `OSPyD · ${credential.holderName}`,
        `DNI ${formatDni(credential.dni)}`,
        `Nº de afiliado ${credential.affiliateNumber}`,
        `${credential.plan.name} · vence ${formatDate(credential.expiresAt)}`,
      ].join("\n"),
    }).catch(() => "failed" as const);
    if (result === "copied") toast("Copiamos los datos de tu credencial.");
    if (result === "failed") toast("No pudimos compartir la credencial.", "error");
  }

  async function copyNumber() {
    try {
      await copyText(credential.affiliateNumber);
      toast("Número de afiliado copiado.");
    } catch {
      toast("No pudimos copiar el número.", "error");
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <StatusNotice credential={credential} status={status} />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8">
        <div className="flex flex-col gap-3">
          <div className="mx-auto w-full max-w-[520px]">
            <CredentialCard credential={credential} status={status} face={face} onFlip={flip} />
          </div>
          <div className="mx-auto flex w-full max-w-[520px] flex-wrap items-center justify-between gap-2">
            <FaceToggle face={face} onChange={setFace} />
            <p className="flex items-center gap-1.5 text-sm text-muted">
              <ArrowsLeftRight className="size-4" aria-hidden />
              Deslizá la tarjeta para girarla
            </p>
          </div>
        </div>

        <Panel title="Código para el prestador" className="lg:row-span-2 lg:self-start lg:sticky lg:top-10">
          {status === "expired" ? (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <p className="text-[15px] text-muted">El código QR se habilita cuando la credencial está vigente.</p>
              <ButtonLink href={ROUTES.contact} variant="secondary">
                Consultar por la renovación
              </ButtonLink>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <LiveQr credential={credential} />
              <Button size="lg" className="w-full" onClick={() => setPresenting(true)} icon={<CornersOut className="size-5" aria-hidden />}>
                Mostrar en pantalla completa
              </Button>
            </div>
          )}
          <Button variant="ghost" className="mt-2 w-full" onClick={share} icon={<ShareNetwork className="size-5" aria-hidden />}>
            Compartir datos de la credencial
          </Button>
        </Panel>

        <Panel title="Datos de la credencial">
          <DataList
            columns={2}
            items={[
              { label: "Titular de la credencial", value: credential.holderName },
              { label: "DNI", value: formatDni(credential.dni), mono: true },
              {
                label: "Nº de afiliado",
                mono: true,
                value: (
                  <span className="flex items-center justify-between gap-2">
                    {credential.affiliateNumber}
                    <button
                      type="button"
                      onClick={copyNumber}
                      aria-label="Copiar número de afiliado"
                      className="-my-2 grid size-11 place-items-center rounded-full text-brand hover:bg-brand-soft"
                    >
                      <Copy className="size-5" aria-hidden />
                    </button>
                  </span>
                ),
              },
              { label: "Plan", value: credential.plan.name },
              { label: "Tipo de afiliado", value: credential.affiliateType },
              { label: "Régimen", value: credential.regime },
              { label: "Empresa", value: credential.employer.name },
              { label: "CUIT empresa", value: credential.employer.cuit, mono: true },
              { label: "Emitida", value: formatDate(credential.issuedAt), mono: true },
              { label: "Vence", value: formatDate(credential.expiresAt), mono: true },
            ]}
          />
        </Panel>
      </div>

      {status !== "expired" ? (
        <PresentCredential open={presenting} onClose={() => setPresenting(false)} credential={credential} status={status} />
      ) : null}
    </div>
  );
}

export function StatusNotice({ credential, status }: { credential: Credential; status: CredentialStatus }) {
  if (status === "expired") {
    return (
      <Notice
        tone="danger"
        title={`Tu credencial venció el ${formatDate(credential.expiresAt)}`}
        action={
          <ButtonLink href={ROUTES.contact} variant="secondary" className="bg-white">
            Contactar a OSPyD
          </ButtonLink>
        }
      >
        Los prestadores pueden pedirte una credencial vigente. Comunicate con OSPyD para renovarla.
      </Notice>
    );
  }
  if (status === "expiring") {
    const days = daysUntilExpiry(credential, new Date());
    return (
      <Notice
        tone="warning"
        title={days === 0 ? "Tu credencial vence hoy" : `Tu credencial vence en ${days} ${days === 1 ? "día" : "días"}`}
      >
        Hasta esa fecha podés usarla con normalidad. Si tenés dudas sobre la renovación, comunicate con OSPyD.
      </Notice>
    );
  }
  return null;
}

function FaceToggle({ face, onChange }: { face: CardFace; onChange: (f: CardFace) => void }) {
  return (
    <div role="group" aria-label="Lado de la credencial" className="inline-flex rounded-[var(--radius-control)] border border-line bg-surface p-1">
      {(["front", "back"] as const).map((f) => (
        <button
          key={f}
          type="button"
          aria-pressed={face === f}
          onClick={() => onChange(f)}
          className={cn(
            "min-h-10 rounded-[7px] px-4 text-[15px] font-semibold transition-colors duration-150",
            face === f ? "bg-ink text-white" : "text-muted hover:text-ink",
          )}
        >
          {f === "front" ? "Frente" : "Dorso"}
        </button>
      ))}
    </div>
  );
}

export function CredentialSkeleton() {
  return (
    <LoadingState label="Cargando tu credencial">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8">
        <Skeleton className="mx-auto aspect-[1.586] w-full max-w-[520px] rounded-[20px]" />
        <Skeleton className="h-80 w-full rounded-[var(--radius-panel)]" />
      </div>
    </LoadingState>
  );
}

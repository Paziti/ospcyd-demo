import { Baby, Brain, CaretDown, Flask, HandHeart, Hospital, MapPin, Pill, Syringe, Tooth, Wheelchair } from "@phosphor-icons/react/dist/ssr";
import { INSTITUTION, type CoverageIcon } from "@/content/institution";
import { mapLinkUrl } from "@/content/contact";
import { Guilloche } from "@/components/brand/Guilloche";
import { Wordmark } from "@/components/brand/Wordmark";
import { Page } from "@/components/layout/Page";
import { Notice } from "@/components/ui/Notice";
import { DataList, Panel } from "@/components/ui/Panel";

const COVERAGE_ICONS: Record<CoverageIcon, typeof Flask> = {
  diagnostico: Flask,
  internacion: Hospital,
  odontologia: Tooth,
  farmacias: Pill,
  materno: Baby,
  discapacidad: Wheelchair,
  "salud-mental": Brain,
  adicciones: HandHeart,
  vacunacion: Syringe,
};

export function CompanyScreen() {
  const content = INSTITUTION;
  return (
    <Page title="Nuestra empresa" description="Quiénes somos, qué cubrimos y dónde atendemos.">
      <div className="flex flex-col gap-6">
        <section aria-labelledby="about-title" className="on-ink relative overflow-hidden rounded-[var(--radius-panel)] bg-brand-deep p-5 text-white sm:p-7">
          <Guilloche className="text-accent" opacity={0.22} />
          <div className="relative flex flex-col gap-4">
            <Wordmark tone="white" size="md" withDescriptor />
            <h2 id="about-title" className="text-xl font-bold leading-7 sm:text-2xl">
              {content.tagline}
            </h2>
            {content.about.map((p) => (
              <p key={p} className="max-w-prose text-[16px] leading-7 text-white/90">
                {p}
              </p>
            ))}
          </div>
        </section>

        <Panel title="Qué cubre tu obra social" description="Prestaciones y programas para vos y tu grupo familiar.">
          <ul className="grid gap-x-6 sm:grid-cols-2">
            {content.coverage.map(({ icon, title, text }) => {
              const Icon = COVERAGE_ICONS[icon];
              return (
                <li key={title} className="flex gap-3 border-b border-line py-3 last:border-b-0">
                  <Icon className="mt-0.5 size-6 shrink-0 text-brand" aria-hidden />
                  <div>
                    <p className="font-semibold">{title}</p>
                    <p className="text-sm text-muted">{text}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </Panel>

        <section aria-labelledby="clinics-title" className="flex flex-col gap-3">
          <h2 id="clinics-title" className="text-lg font-bold">
            Consultorios propios
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {content.clinics.map((c) => (
              <a
                key={c.address}
                href={mapLinkUrl(`${c.address}, ${c.city}`)}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col gap-2 rounded-[var(--radius-panel)] border border-line bg-surface p-4 transition-colors hover:border-brand"
              >
                <span className="flex items-start gap-2">
                  <MapPin weight="fill" className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden />
                  <span>
                    <span className="block font-bold">{c.address}</span>
                    <span className="block text-sm text-muted">{c.city}</span>
                  </span>
                </span>
                <span className="text-[15px]">{c.services.join(" · ")}</span>
                <span className="text-sm font-semibold text-brand group-hover:underline">Cómo llegar</span>
              </a>
            ))}
          </div>
        </section>

        <Panel title="Información para afiliados">
          <div className="divide-y divide-line">
            {content.memberGuide.map((item) => (
              <details key={item.question} className="group">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 py-3 font-semibold [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <CaretDown className="size-5 shrink-0 text-muted transition-transform duration-200 group-open:rotate-180" aria-hidden />
                </summary>
                <p className="pb-4 text-[15px] leading-6 text-muted">{item.answer}</p>
              </details>
            ))}
          </div>
        </Panel>

        <Panel title="Datos institucionales">
          <DataList items={content.legal.map((l) => ({ label: l.label, value: l.value }))} />
        </Panel>

        {content.provisional ? (
          <Notice title="Contenido a validar">
            Tomado del sitio oficial ospcyd.org. Lo que figura entre corchetes lo completa OSPCyD.
          </Notice>
        ) : null}
      </div>
    </Page>
  );
}

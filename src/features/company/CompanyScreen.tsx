import { Ambulance, Baby, Brain, CaretDown, Flask, Hospital, Pill, Stethoscope, Tooth } from "@phosphor-icons/react/dist/ssr";
import { INSTITUTION, type CoverageIcon } from "@/content/institution";
import { Guilloche } from "@/components/brand/Guilloche";
import { Wordmark } from "@/components/brand/Wordmark";
import { Page } from "@/components/layout/Page";
import { Notice } from "@/components/ui/Notice";
import { DataList, Panel } from "@/components/ui/Panel";

const COVERAGE_ICONS: Record<CoverageIcon, typeof Stethoscope> = {
  consultas: Stethoscope,
  estudios: Flask,
  internacion: Hospital,
  medicamentos: Pill,
  odontologia: Tooth,
  "salud-mental": Brain,
  materno: Baby,
  urgencias: Ambulance,
};

export function CompanyScreen() {
  const content = INSTITUTION;
  return (
    <Page title="Nuestra empresa" description="Quiénes somos, qué cubrimos y cómo acompañamos a nuestros afiliados.">
      <div className="flex flex-col gap-6">
        {content.provisional ? (
          <Notice title="Contenido provisional">Los textos entre corchetes se reemplazarán por la información oficial de OSPyD.</Notice>
        ) : null}

        <section aria-labelledby="about-title" className="on-ink relative overflow-hidden rounded-[var(--radius-panel)] bg-ink p-5 text-white sm:p-7">
          <Guilloche className="text-accent" opacity={0.22} />
          <div className="relative flex flex-col gap-4">
            <Wordmark tone="white" size="md" withDescriptor />
            <h2 id="about-title" className="sr-only">
              Quiénes somos
            </h2>
            {content.about.map((p) => (
              <p key={p} className="max-w-prose text-[17px] leading-7 text-white/90">
                {p}
              </p>
            ))}
          </div>
        </section>

        <div className="grid gap-6 sm:grid-cols-2 sm:gap-0 sm:divide-x sm:divide-line">
          <section aria-labelledby="mission-title" className="sm:pr-6">
            <h2 id="mission-title" className="text-lg font-bold">
              Misión
            </h2>
            <p className="mt-2 text-[15px] leading-6 text-muted">{content.mission}</p>
          </section>
          <section aria-labelledby="vision-title" className="sm:pl-6">
            <h2 id="vision-title" className="text-lg font-bold">
              Visión
            </h2>
            <p className="mt-2 text-[15px] leading-6 text-muted">{content.vision}</p>
          </section>
        </div>

        <Panel title="Qué cubre tu plan" description="Prestaciones incluidas. El alcance exacto depende de tu plan.">
          <ul className="grid gap-x-6 sm:grid-cols-2">
            {content.coverage.map(({ icon, title, text }) => {
              const Icon = COVERAGE_ICONS[icon];
              return (
                <li key={title} className="flex gap-3 border-b border-line py-3 last:border-b-0 sm:[&:nth-last-child(2)]:border-b-0">
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

        <section aria-labelledby="values-title">
          <h2 id="values-title" className="text-lg font-bold">
            Nuestros valores
          </h2>
          <dl className="mt-3 grid gap-x-6 gap-y-3 sm:grid-cols-2">
            {content.values.map((v) => (
              <div key={v.title}>
                <dt className="font-semibold">{v.title}</dt>
                <dd className="text-[15px] text-muted">{v.text}</dd>
              </div>
            ))}
          </dl>
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
      </div>
    </Page>
  );
}

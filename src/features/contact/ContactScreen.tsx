import { ArrowSquareOut, Brain, Globe, MapPin, Phone, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { CONTACT, mapEmbedUrl, mapLinkUrl } from "@/content/contact";
import { Page } from "@/components/layout/Page";
import { ButtonLink } from "@/components/ui/Button";
import { ListRow, RowGroup } from "@/components/ui/ListRow";
import { Notice } from "@/components/ui/Notice";
import { Panel } from "@/components/ui/Panel";
import { ContactForm } from "./ContactForm";

const external = <ArrowSquareOut className="size-5 shrink-0 text-muted" aria-hidden />;

export function ContactScreen() {
  return (
    <Page title="Contacto" description="Elegí el canal que te quede más cómodo." width="wide">
      <div className="flex flex-col gap-6">
        {CONTACT.provisional ? (
          <Notice title="Datos de contacto provisionales">Los datos se confirmarán con OSPCyD antes de publicar la app.</Notice>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-8">
          <div className="flex flex-col gap-6">
            <RowGroup>
              <ListRow
                href={CONTACT.phone.href}
                external
                icon={<Phone className="size-5" aria-hidden />}
                title={`Llamar al ${CONTACT.phone.display}`}
                description={CONTACT.phone.detail}
                trailing={external}
              />
              <ListRow
                href={CONTACT.whatsapp.href}
                external
                icon={<WhatsappLogo className="size-5" aria-hidden />}
                title="WhatsApp de la obra social"
                description={`${CONTACT.whatsapp.display} · ${CONTACT.whatsapp.detail}`}
                trailing={external}
              />
              <ListRow
                href={CONTACT.website.href}
                external
                icon={<Globe className="size-5" aria-hidden />}
                title="Sitio oficial"
                description={`${CONTACT.website.display} · cartilla médica y novedades`}
                trailing={external}
              />
            </RowGroup>

            <RowGroup>
              <ListRow
                href={CONTACT.mentalHealth.href}
                external
                icon={<Brain className="size-5" aria-hidden />}
                title={`Salud mental: ${CONTACT.mentalHealth.display}`}
                description={CONTACT.mentalHealth.detail}
                trailing={external}
              />
            </RowGroup>

            <Panel title="Horarios de atención">
              <dl className="divide-y divide-line">
                {CONTACT.hours.map((h) => (
                  <div key={h.days} className="flex flex-wrap justify-between gap-x-4 gap-y-0.5 py-2.5">
                    <dt className="text-[15px]">{h.days}</dt>
                    <dd className="font-semibold">{h.time}</dd>
                  </div>
                ))}
              </dl>
            </Panel>

            <Panel title="Dónde estamos" description={`${CONTACT.address.line} · ${CONTACT.address.city}`}>
              <div className="overflow-hidden rounded-[var(--radius-control)] border border-line">
                <iframe
                  title={`Mapa: ${CONTACT.location.label}`}
                  src={mapEmbedUrl(CONTACT.location)}
                  loading="lazy"
                  className="block aspect-[16/10] w-full"
                  referrerPolicy="no-referrer"
                />
              </div>
              <ButtonLink
                href={mapLinkUrl(`${CONTACT.address.line}, ${CONTACT.address.city}`)}
                external
                target="_blank"
                rel="noreferrer"
                variant="secondary"
                className="mt-3 w-full sm:w-auto"
                icon={<MapPin className="size-5" aria-hidden />}
              >
                Abrir en mapas
              </ButtonLink>
            </Panel>
          </div>

          <div className="lg:sticky lg:top-10 lg:self-start">
            <ContactForm />
          </div>
        </div>
      </div>
    </Page>
  );
}

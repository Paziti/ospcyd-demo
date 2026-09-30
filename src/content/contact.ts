import type { ContactTopic } from "@/core/models/contact";

/**
 * DATOS DE CONTACTO. Fuente: sitio oficial ospcyd.org (septiembre 2026).
 * Confirmar con OSPCyD antes de publicar la app.
 */
export const CONTACT = {
  provisional: false,
  phone: { display: "0810-333-7139", detail: "Línea de consulta las 24 h, los 365 días", href: "tel:08103337139" },
  whatsapp: {
    display: "+54 9 11 2338-8231",
    detail: "Solo mensajes, lunes a viernes de 9 a 17 h",
    href: `https://wa.me/5491123388231?text=${encodeURIComponent("Hola, soy afiliado/a de OSPCyD y quiero hacer una consulta.")}`,
  },
  mentalHealth: { display: "0800-555-2223", detail: "Emergencias de salud mental, 24 h", href: "tel:08005552223" },
  website: { display: "ospcyd.org", href: "https://ospcyd.org/" },
  address: {
    line: "Solís 1309 (C1134ADC)",
    city: "Ciudad Autónoma de Buenos Aires",
  },
  location: { lat: -34.62416, lon: -58.38983, label: "Sede OSPCyD, Solís 1309, CABA" },
  hours: [
    { days: "Lunes a viernes", time: "9 a 17 h" },
    { days: "Línea telefónica 0810", time: "Las 24 h" },
  ],
} as const;

export const CONTACT_TOPICS: ReadonlyArray<{ value: ContactTopic; label: string }> = [
  { value: "credencial", label: "Credencial" },
  { value: "autorizaciones", label: "Autorizaciones y prácticas" },
  { value: "cartilla", label: "Cartilla de prestadores" },
  { value: "datos", label: "Actualización de datos" },
  { value: "otro", label: "Otro motivo" },
];

export function mapEmbedUrl({ lat, lon }: { lat: number; lon: number }) {
  const d = 0.006;
  const bbox = [lon - d, lat - d * 0.6, lon + d, lat + d * 0.6].join(",");
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`;
}

export function mapLinkUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

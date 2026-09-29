import type { ContactTopic } from "@/core/models/contact";

/**
 * DATOS DE CONTACTO PROVISIONALES.
 * Teléfonos, email y dirección son placeholders que no pertenecen a OSPyD.
 * Reemplazar por los datos oficiales antes de publicar.
 */
export const CONTACT = {
  provisional: true,
  phone: { display: "0800 000 0000", href: "tel:08000000000" },
  whatsapp: {
    display: "+54 9 11 0000 0000",
    href: `https://wa.me/5491100000000?text=${encodeURIComponent("Hola, soy afiliado/a de OSPyD y quiero hacer una consulta.")}`,
  },
  email: { display: "afiliados@ospyd.example", href: "mailto:afiliados@ospyd.example?subject=Consulta%20de%20afiliado" },
  address: {
    line: "[Dirección de la sede a confirmar]",
    city: "Ciudad Autónoma de Buenos Aires",
  },
  /** Punto de referencia en el mapa hasta tener la dirección real. */
  location: { lat: -34.6037, lon: -58.3816, label: "Ubicación de referencia (a confirmar)" },
  hours: [
    { days: "Lunes a viernes", time: "9 a 17 h" },
    { days: "Sábados, domingos y feriados", time: "Sin atención presencial" },
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

export function mapLinkUrl({ lat, lon }: { lat: number; lon: number }) {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
}

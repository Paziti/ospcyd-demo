import { BRAND } from "@/config/brand";

/**
 * CONTENIDO INSTITUCIONAL.
 * Fuente: sitio oficial ospcyd.org y credencial física (septiembre 2026).
 * Lo que no figura en esas fuentes queda marcado entre corchetes para que OSPCyD lo complete.
 */

export type CoverageIcon =
  | "diagnostico"
  | "internacion"
  | "odontologia"
  | "farmacias"
  | "materno"
  | "discapacidad"
  | "salud-mental"
  | "adicciones"
  | "vacunacion";

export interface OwnClinic {
  address: string;
  city: string;
  services: string[];
}

export interface InstitutionContent {
  provisional: boolean;
  tagline: string;
  about: string[];
  coverage: { icon: CoverageIcon; title: string; text: string }[];
  clinics: OwnClinic[];
  memberGuide: { question: string; answer: string }[];
  legal: { label: string; value: string }[];
}

export const INSTITUTION: InstitutionContent = {
  provisional: true,
  tagline: "Una red de salud para cada uno de nuestros afiliados y su grupo familiar.",
  about: [
    `La ${BRAND.fullName} de la República Argentina brinda cobertura médica con carácter preventivo y asistencial a los trabajadores del sector y a su grupo familiar.`,
    "Contás con una red de prestadores para todas tus necesidades médicas: atendete siempre dentro de la cartilla de la obra social.",
  ],
  coverage: [
    { icon: "diagnostico", title: "Centros de diagnóstico", text: "Laboratorio, imágenes y estudios con orden médica." },
    { icon: "internacion", title: "Clínicas y sanatorios", text: "Internación y cirugía en prestadores de la cartilla." },
    { icon: "odontologia", title: "Prestaciones odontológicas", text: "Atención odontológica para vos y tu familia." },
    { icon: "farmacias", title: "Farmacias", text: "Medicamentos en farmacias adheridas." },
    { icon: "materno", title: "Plan materno", text: "Acompañamiento durante el embarazo y el primer año." },
    { icon: "discapacidad", title: "Discapacidad", text: "Prestaciones y apoyos para personas con discapacidad." },
    { icon: "salud-mental", title: "Salud mental", text: "Turnos al 7700-3673 (lunes a viernes de 9 a 17 h, con derivación de OSPCyD). Emergencias las 24 h: 0800-555-2223." },
    { icon: "adicciones", title: "Adicciones", text: "Orientación y tratamiento." },
    { icon: "vacunacion", title: "Plan de vacunación", text: "Calendario Nacional de Vacunación gratuito en centros de salud y hospitales públicos." },
  ],
  clinics: [
    { address: "Solís 1309", city: "Ciudad Autónoma de Buenos Aires", services: ["Traumatología", "Servicio social", "Pediatría", "Diabetología"] },
    { address: "Calle 2 Nº 234", city: "Tolosa, La Plata", services: ["Traumatología", "Servicio social"] },
  ],
  memberGuide: [
    {
      question: "¿Cómo uso la credencial digital?",
      answer: "Abrí la app, tocá “Mostrar en recepción” y presentá la pantalla junto con tu DNI. El prestador puede escanear el código QR o el código de barras.",
    },
    {
      question: "¿Cómo pido turno en los consultorios propios?",
      answer: "De forma presencial en Solís 1309 (CABA) o Calle 2 Nº 234 (Tolosa), o por WhatsApp de lunes a viernes de 9 a 17 h.",
    },
    {
      question: "¿Qué hago si mi credencial está vencida?",
      answer: "Comunicate con OSPCyD desde la sección Contacto. [Procedimiento de renovación a confirmar por OSPCyD.]",
    },
    {
      question: "¿Dónde consulto la cartilla de prestadores?",
      answer: "En la cartilla médica interactiva del sitio ospcyd.org, donde podés buscar prestadores por cercanía y horario.",
    },
  ],
  legal: [
    { label: "Razón social", value: `${BRAND.fullName} de la República Argentina` },
    { label: "R.N.O.S.", value: BRAND.rnos },
    { label: "CUIT", value: BRAND.cuit },
    { label: "Organismo de control", value: "Superintendencia de Servicios de Salud · 0800-222-SALUD (72583) · www.argentina.gob.ar/sssalud" },
  ],
};

/**
 * CONTENIDO INSTITUCIONAL PROVISIONAL.
 * Textos genéricos de referencia para la demo: no son información oficial de OSPyD.
 * Reemplazar por el contenido que entregue la obra social (o servirlo desde un CMS/API).
 */

export type CoverageIcon = "consultas" | "estudios" | "internacion" | "medicamentos" | "odontologia" | "salud-mental" | "materno" | "urgencias";

export interface InstitutionContent {
  provisional: boolean;
  about: string[];
  mission: string;
  vision: string;
  values: { title: string; text: string }[];
  coverage: { icon: CoverageIcon; title: string; text: string }[];
  memberGuide: { question: string; answer: string }[];
  legal: { label: string; value: string }[];
}

export const INSTITUTION: InstitutionContent = {
  provisional: true,
  about: [
    "OSPyD es la obra social de sus afiliados titulares y su grupo familiar. [Texto provisional: breve historia, sindicato o actividad de origen y alcance geográfico.]",
    "Esta sección presentará quiénes somos, dónde estamos y cómo acompañamos a cada afiliado en el cuidado de su salud.",
  ],
  mission: "[Misión provisional] Brindar a nuestros afiliados una cobertura de salud accesible, cercana y de calidad, con atención humana y trámites simples.",
  vision: "[Visión provisional] Ser una obra social de referencia por la confianza de sus afiliados y la calidad de sus prestadores.",
  values: [
    { title: "Cercanía", text: "Atención personalizada y respuestas claras." },
    { title: "Transparencia", text: "Información accesible sobre coberturas y trámites." },
    { title: "Compromiso", text: "Acompañamiento en cada etapa de la vida del afiliado." },
    { title: "Responsabilidad", text: "Cuidado de los datos personales y de salud." },
  ],
  coverage: [
    { icon: "consultas", title: "Consultas médicas", text: "Médicos de cabecera y especialistas de la cartilla." },
    { icon: "estudios", title: "Estudios y diagnóstico", text: "Laboratorio, imágenes y prácticas con orden médica." },
    { icon: "internacion", title: "Internación y cirugía", text: "Clínica, quirúrgica y de alta complejidad." },
    { icon: "medicamentos", title: "Medicamentos", text: "Descuentos en farmacias adheridas según tu plan." },
    { icon: "odontologia", title: "Odontología", text: "Prácticas preventivas y tratamientos." },
    { icon: "salud-mental", title: "Salud mental", text: "Atención psicológica y psiquiátrica." },
    { icon: "materno", title: "Plan materno infantil", text: "Embarazo, parto y primer año de vida." },
    { icon: "urgencias", title: "Urgencias y emergencias", text: "Guardia y atención domiciliaria." },
  ],
  memberGuide: [
    {
      question: "¿Cómo uso la credencial digital?",
      answer: "Abrí la app, tocá “Mostrar en recepción” y presentá la pantalla junto con tu DNI. El prestador puede escanear el código QR o el código de barras.",
    },
    {
      question: "¿Qué hago si mi credencial está vencida?",
      answer: "Comunicate con OSPyD desde la sección Contacto. [Procedimiento de renovación a confirmar por OSPyD.]",
    },
    {
      question: "¿Cómo actualizo mis datos de contacto?",
      answer: "Desde Mi cuenta podés modificar tu email, teléfono y domicilio. Los datos personales como nombre o DNI se corrigen a través de OSPyD.",
    },
    {
      question: "¿Dónde consulto la cartilla de prestadores?",
      answer: "[Enlace a la cartilla oficial a confirmar por OSPyD.] Mientras tanto, podés consultarla por teléfono o WhatsApp.",
    },
  ],
  legal: [
    { label: "Nombre completo", value: "[A confirmar]" },
    { label: "Nº de Registro Nacional de Obras Sociales (RNOS)", value: "[A confirmar]" },
    { label: "CUIT", value: "[A confirmar]" },
    { label: "Organismo de control", value: "Superintendencia de Servicios de Salud · 0800-222-SALUD (72583) · www.sssalud.gob.ar" },
  ],
};

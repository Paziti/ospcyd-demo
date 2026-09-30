import type { Member } from "@/core/models/member";

/**
 * AFILIADOS FICTICIOS PARA LA DEMO.
 * Nombres, documentos, empresas y CUIT son inventados. El Nº de afiliado sigue el formato
 * de la credencial física (CUIL del titular / orden familiar). No representan personas ni empresas reales.
 * Las contraseñas existen solo porque no hay backend; la app real nunca guarda contraseñas en el cliente.
 */
export interface MockAccount {
  password: string;
  member: Member;
  credential: {
    issuedAt: string;
    expiresAt: string;
    qrSeed: string;
  };
}

/**
 * Fechas relativas a hoy para que cada afiliado muestre siempre el mismo estado
 * de credencial (vigente, por vencer, vencida) sin importar cuándo se presente la demo.
 */
function isoFromToday(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Plan único de referencia: la credencial física no informa planes. [A confirmar por OSPCyD] */
const PLAN = { code: "PMO", name: "Plan PMO" };

export const MOCK_ACCOUNTS: MockAccount[] = [
  {
    password: "123456",
    member: {
      id: "m-0001",
      firstName: "Lucía Belén",
      lastName: "Ferreyra",
      dni: "12345678",
      cuil: "27-12345678-4",
      birthDate: "1988-04-17",
      email: "lucia.ferreyra@correo-demo.com",
      phone: "+54 11 5555 0101",
      address: { street: "Av. Ejemplo 1234, 3° B", city: "Ciudad Autónoma de Buenos Aires", province: "CABA", postalCode: "C1000" },
      photoUrl: null,
      affiliateNumber: "27-12345678-4/0",
      affiliateType: "Titular",
      relationship: null,
      regime: "Régimen general",
      plan: PLAN,
      employer: { name: "Distribuidora Andina S.A. (ficticia)", cuit: "30-00000001-0" },
      memberSince: "2019-03-01",
    },
    credential: { issuedAt: isoFromToday(-185), expiresAt: isoFromToday(180), qrSeed: "demo-seed-0001" },
  },
  {
    password: "123456",
    member: {
      id: "m-0002",
      firstName: "Martín Ezequiel",
      lastName: "Sosa",
      dni: "23456789",
      cuil: "20-23456789-6",
      birthDate: "1974-11-02",
      email: "martin.sosa@correo-demo.com",
      phone: "+54 341 555 0202",
      address: { street: "Calle Ficticia 845", city: "Rosario", province: "Santa Fe", postalCode: "S2000" },
      photoUrl: null,
      affiliateNumber: "20-23456789-6/0",
      affiliateType: "Titular",
      relationship: null,
      regime: "Traspaso",
      plan: PLAN,
      employer: { name: "Logística del Litoral S.R.L. (ficticia)", cuit: "30-00000002-8" },
      memberSince: "2012-08-15",
    },
    credential: { issuedAt: isoFromToday(-344), expiresAt: isoFromToday(21), qrSeed: "demo-seed-0002" },
  },
  {
    password: "123456",
    member: {
      id: "m-0003",
      firstName: "Carolina Inés",
      lastName: "Paz",
      dni: "34567890",
      cuil: "27-34567890-2",
      birthDate: "1992-07-23",
      email: "carolina.paz@correo-demo.com",
      phone: "+54 351 555 0303",
      address: { street: "Pasaje Modelo 77", city: "Córdoba", province: "Córdoba", postalCode: "X5000" },
      photoUrl: null,
      affiliateNumber: "20-33445566-7/1",
      affiliateType: "Familiar a cargo",
      relationship: "Cónyuge",
      regime: "Régimen general",
      plan: PLAN,
      employer: { name: "Metalúrgica San Justo S.A. (ficticia)", cuit: "30-00000003-6" },
      memberSince: "2021-02-10",
    },
    credential: { issuedAt: isoFromToday(-394), expiresAt: isoFromToday(-29), qrSeed: "demo-seed-0003" },
  },
];

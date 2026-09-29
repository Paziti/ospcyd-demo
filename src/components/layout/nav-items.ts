import { Buildings, ChatCircleText, House, IdentificationCard, UserCircle } from "@phosphor-icons/react/dist/ssr";
import { ROUTES } from "@/config/routes";

export interface NavItem {
  href: string;
  label: string;
  shortLabel: string;
  Icon: typeof House;
  primary?: boolean;
}

/** Orden del brief (cuenta, credencial, empresa, contacto) con la credencial al centro de la barra inferior. */
export const NAV_ITEMS: NavItem[] = [
  { href: ROUTES.home, label: "Inicio", shortLabel: "Inicio", Icon: House },
  { href: ROUTES.account, label: "Mi cuenta", shortLabel: "Cuenta", Icon: UserCircle },
  { href: ROUTES.credential, label: "Mi credencial", shortLabel: "Credencial", Icon: IdentificationCard, primary: true },
  { href: ROUTES.company, label: "Nuestra empresa", shortLabel: "Empresa", Icon: Buildings },
  { href: ROUTES.contact, label: "Contacto", shortLabel: "Contacto", Icon: ChatCircleText },
];

export function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

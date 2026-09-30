export const ROUTES = {
  login: "/ingresar",
  recover: "/ingresar/recuperar",
  home: "/inicio",
  credential: "/credencial",
  account: "/cuenta",
  company: "/empresa",
  contact: "/contacto",
} as const;

/** Rutas que requieren sesión. El proxy y el guard del layout usan esta lista. */
export const PROTECTED_PREFIXES = [ROUTES.home, ROUTES.credential, ROUTES.account, ROUTES.company, ROUTES.contact];

export const SESSION_COOKIE = "ospcyd_session";

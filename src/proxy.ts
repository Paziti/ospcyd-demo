import { NextResponse, type NextRequest } from "next/server";
import { PROTECTED_PREFIXES, ROUTES, SESSION_COOKIE } from "@/config/routes";

/**
 * Chequeo optimista de sesión antes de renderizar: evita mostrar pantallas internas
 * a quien navega directo sin sesión. La autorización real la hace la API con el token.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const hasSession = request.cookies.has(SESSION_COOKIE);
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  if (pathname === "/") {
    return NextResponse.redirect(new URL(hasSession ? ROUTES.home : ROUTES.login, request.url));
  }
  if (isProtected && !hasSession) {
    const url = new URL(ROUTES.login, request.url);
    url.searchParams.set("volver", pathname + search);
    return NextResponse.redirect(url);
  }
  if (pathname === ROUTES.login && hasSession) {
    return NextResponse.redirect(new URL(ROUTES.home, request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/ingresar", "/inicio/:path*", "/credencial/:path*", "/cuenta/:path*", "/empresa/:path*", "/contacto/:path*"],
};

import type { Metadata, Viewport } from "next";
import { Atkinson_Hyperlegible_Mono, Atkinson_Hyperlegible_Next } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const atkinson = Atkinson_Hyperlegible_Next({
  subsets: ["latin", "latin-ext"],
  variable: "--font-atkinson",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
  adjustFontFallback: false,
});

const atkinsonMono = Atkinson_Hyperlegible_Mono({
  subsets: ["latin"],
  variable: "--font-atkinson-mono",
  display: "swap",
  fallback: ["ui-monospace", "monospace"],
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: { default: "OSPyD · Afiliados", template: "%s · OSPyD" },
  description: "Credencial digital y gestión de datos para afiliados de OSPyD. Prototipo de demostración con datos ficticios.",
  applicationName: "OSPyD",
  appleWebApp: { capable: true, title: "OSPyD", statusBarStyle: "default" },
  formatDetection: { telephone: false },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#0b2540",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-AR" className={`${atkinson.variable} ${atkinsonMono.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "OSPyD Afiliados",
    short_name: "OSPyD",
    description: "Credencial digital para afiliados de OSPyD (demo).",
    start_url: "/inicio",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f3f5f7",
    theme_color: "#0b2540",
    lang: "es-AR",
    icons: [
      { src: "/icon", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}

import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "OSPCyD Afiliados",
    short_name: "OSPCyD",
    description: "Credencial digital para afiliados de OSPCyD (demo).",
    start_url: "/inicio",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f3f5f4",
    theme_color: "#0b5e30",
    lang: "es-AR",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}

import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

/** ÍCONO PROVISIONAL: iniciales sobre el azul institucional. Reemplazar por el ícono oficial. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b2540",
          color: "#ffffff",
          fontSize: 170,
          fontWeight: 800,
          letterSpacing: -6,
          fontFamily: "sans-serif",
        }}
      >
        OSP<span style={{ color: "#5bb8e6", fontWeight: 400 }}>y</span>D
      </div>
    ),
    size,
  );
}

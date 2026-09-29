import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** ÍCONO PROVISIONAL (ver icon.tsx). */
export default function AppleIcon() {
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
          fontSize: 58,
          fontWeight: 800,
          letterSpacing: -2,
          fontFamily: "sans-serif",
        }}
      >
        OSP<span style={{ color: "#5bb8e6", fontWeight: 400 }}>y</span>D
      </div>
    ),
    size,
  );
}

import { ImageResponse } from "next/og";

export const alt = "AfroBite — Tu scrolles. Tu tapes. Tu manges.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #f5f2ec 0%, #eae4d8 100%)",
          color: "#0a0a0a",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 22,
            color: "#8a6420",
            fontSize: 30,
            letterSpacing: 10,
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 16,
              background: "linear-gradient(135deg, #d4a24a, #8a6420)",
            }}
          />
          AfroBite
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 98,
            fontWeight: 800,
            letterSpacing: -4,
            marginTop: 24,
            lineHeight: 1.02,
          }}
        >
          <span>Tu scrolles.</span>
          <span>Tu tapes.</span>
          <span>Tu manges.</span>
        </div>

        <div style={{ fontSize: 34, color: "#6b6458", marginTop: 28, maxWidth: 920 }}>
          L&apos;app de livraison de repas en vidéo au Burkina Faso.
        </div>
      </div>
    ),
    { ...size },
  );
}

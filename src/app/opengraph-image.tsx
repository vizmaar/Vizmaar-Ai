import { ImageResponse } from "next/og";
import { SITE_CONFIG } from "@/lib/site-config";

export const alt = SITE_CONFIG.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              fontWeight: 700,
              color: "#6366f1",
            }}
          >
            V
          </div>
          <span style={{ fontSize: 56, fontWeight: 700, color: "white" }}>
            VIZMAAR
          </span>
        </div>
        <p style={{ fontSize: 28, color: "rgba(255,255,255,0.9)", maxWidth: 700, textAlign: "center" }}>
          {SITE_CONFIG.tagline}
        </p>
        <p style={{ fontSize: 20, color: "rgba(255,255,255,0.7)", marginTop: 16 }}>
          20+ Free Tools · 100% Client-Side · No Signup
        </p>
      </div>
    ),
    { ...size }
  );
}

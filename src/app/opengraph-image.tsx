import { ImageResponse } from "next/og";

// Social-share card shown when bayrcm.com is posted to WhatsApp, LinkedIn, X, etc.
export const alt = "Bay RCM — Revenue Cycle Management for Medical Practices";
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
          justifyContent: "space-between",
          backgroundColor: "#0B1628",
          padding: "80px",
        }}
      >
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              display: "flex",
              width: "60px",
              height: "60px",
              borderRadius: "14px",
              backgroundColor: "#132040",
              border: "2px solid #C8973A",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                width: "22px",
                height: "22px",
                borderRadius: "50%",
                backgroundColor: "#C8973A",
              }}
            />
          </div>
          <div style={{ display: "flex", color: "#FAFAF8", fontSize: "36px", fontWeight: 700 }}>
            Bay RCM
          </div>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              color: "#C8973A",
              fontSize: "22px",
              fontWeight: 600,
              letterSpacing: "4px",
              textTransform: "uppercase",
              marginBottom: "24px",
            }}
          >
            Revenue Cycle Management
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              color: "#FAFAF8",
              fontSize: "78px",
              fontWeight: 700,
              lineHeight: 1.05,
            }}
          >
            <div style={{ display: "flex" }}>Every claim. Every dollar.</div>
            <div style={{ display: "flex", color: "#C8973A" }}>Recovered.</div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", color: "rgba(250,250,248,0.6)", fontSize: "26px" }}>
          End-to-end medical billing · clean claims · denial management · bayrcm.com
        </div>
      </div>
    ),
    { ...size }
  );
}

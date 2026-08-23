import { ImageResponse } from "next/og";

export const alt =
  "OpenResearch - distributed agent-driven research powered by benchmarks";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background: "#f6f7fb",
          color: "#0f0f0f",
          fontFamily: "Inter, Arial, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background:
              "radial-gradient(circle at 82% 18%, rgba(253, 218, 36, 0.35), transparent 32%), radial-gradient(circle at 12% 84%, rgba(183, 172, 232, 0.28), transparent 30%), linear-gradient(135deg, #ffffff 0%, #f6f7fb 50%, #eef0f6 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.5,
            backgroundImage:
              "linear-gradient(rgba(15, 15, 15, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(15, 15, 15, 0.05) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 70,
            right: 70,
            top: 70,
            bottom: 70,
            display: "flex",
            border: "1px solid rgba(15, 15, 15, 0.14)",
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            padding: "88px 92px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              flex: 1,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 112,
                lineHeight: 1,
                letterSpacing: 0,
                fontWeight: 800,
              }}
            >
              OpenResearch
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 28,
                maxWidth: 820,
                fontSize: 42,
                lineHeight: 1.16,
              }}
            >
              <span style={{ color: "#43464e" }}>The benchmark is the&nbsp;</span>
              <span
                style={{
                  color: "#0f0f0f",
                  background: "rgba(253, 218, 36, 0.85)",
                  padding: "0 10px",
                }}
              >
                oracle.
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              fontSize: 24,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                color: "#0f0f0f",
              }}
            >
              <span
                style={{
                  width: 12,
                  height: 12,
                  marginRight: 14,
                  borderRadius: 999,
                  background: "#fdda24",
                  border: "1px solid rgba(15,15,15,0.2)",
                }}
              />
              openresearch.xyz
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}

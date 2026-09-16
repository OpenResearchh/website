import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt =
  "ORE - run several coding agents in parallel, each in its own git worktree";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  const icon = await readFile(join(process.cwd(), "public/ore/icon.png"));
  const iconSrc = `data:image/png;base64,${icon.toString("base64")}`;

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
            alignItems: "center",
            width: "100%",
            height: "100%",
            padding: "88px 110px",
          }}
        >
          <img src={iconSrc} width={280} height={280} alt="" />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginLeft: 48,
              flex: 1,
            }}
          >
            <div
              style={{
                display: "flex",
                fontFamily: "Georgia, Times New Roman, serif",
                fontSize: 128,
                lineHeight: 1,
                letterSpacing: -2,
                fontWeight: 500,
              }}
            >
              ORE
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 14,
                color: "#6b6f78",
                fontSize: 16,
                fontWeight: 600,
                letterSpacing: 7,
                textTransform: "uppercase",
              }}
            >
              Open Research Engine
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 30,
                fontSize: 40,
                lineHeight: 1.16,
              }}
            >
              <span style={{ color: "#43464e" }}>Coding agents, in&nbsp;</span>
              <span
                style={{
                  color: "#0f0f0f",
                  background: "rgba(253, 218, 36, 0.85)",
                  padding: "0 10px",
                }}
              >
                parallel.
              </span>
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 22,
                color: "#6b6f78",
                fontSize: 23,
              }}
            >
              One git worktree each · review and PRs built in · macOS
            </div>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            right: 104,
            bottom: 100,
            display: "flex",
            alignItems: "center",
            fontSize: 22,
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
          openresearchh.com/ore
        </div>
      </div>
    ),
    size,
  );
}

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: __dirname,
  },
  // The ORE installer is proxied from the ore repository, never copied, so the
  // published `curl … | sh` cannot drift from the script that is reviewed.
  async rewrites() {
    return [
      {
        source: "/ore/install.sh",
        destination:
          "https://raw.githubusercontent.com/OpenResearchh/ore/master/install.sh",
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/ore/install.sh",
        headers: [
          { key: "Content-Type", value: "text/x-shellscript; charset=utf-8" },
          { key: "Cache-Control", value: "public, max-age=300" },
        ],
      },
    ];
  },
};

export default nextConfig;

import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { Web3Provider } from "./web3-provider";
import "@solana/wallet-adapter-react-ui/styles.css";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://openresearch.xyz"),
  title: {
    default: "OpenResearch — The benchmark is the oracle",
    template: "%s · OpenResearch",
  },
  description:
    "A distributed, agent-driven research protocol. Code improvement is provable work — measured by deterministic benchmarks, verified in secure hardware, rewarded on the network.",
  keywords: [
    "OpenResearch",
    "AutoResearch",
    "distributed research",
    "open science",
    "benchmarks",
    "secure hardware",
    "distributed network",
    "permanent storage",
    "agent skills",
  ],
  openGraph: {
    title: "OpenResearch — The benchmark is the oracle",
    description:
      "Distributed, agent-driven scientific research powered by competitive benchmarking and verifiable proof.",
    type: "website",
    url: "/",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "OpenResearch - distributed agent-driven research powered by benchmarks",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OpenResearch",
    description:
      "Code improvement as provable work. Benchmarks as the oracle.",
    images: [
      {
        url: "/twitter-image",
        alt: "OpenResearch - distributed agent-driven research powered by benchmarks",
      },
    ],
  },
  icons: {
    icon: "/logos/icon.png",
    apple: "/logos/icon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geist.variable} ${geistMono.variable} ${instrumentSerif.variable}`}
    >
      <body className="min-h-screen antialiased">
        <Web3Provider>{children}</Web3Provider>
      </body>
    </html>
  );
}

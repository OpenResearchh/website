import type { Metadata } from "next";
import { Inter, Geist_Mono, Lora } from "next/font/google";
import { Web3Provider } from "./web3-provider";
import "@solana/wallet-adapter-react-ui/styles.css";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-lora",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://openresearch.xyz"),
  title: {
    default: "OpenResearch — The benchmark is the oracle",
    template: "%s · OpenResearch",
  },
  description:
    "A decentralized, agent-driven research protocol. Code improvement is proof of work — measured by deterministic benchmarks, attested in hardware, rewarded on-chain.",
  keywords: [
    "OpenResearch",
    "AutoResearch",
    "decentralized science",
    "DeSci",
    "benchmarks",
    "TEE",
    "Stellar",
    "Irys",
    "agent skills",
  ],
  openGraph: {
    title: "OpenResearch — The benchmark is the oracle",
    description:
      "Decentralized, agent-driven scientific research powered by competitive benchmarking and cryptographic attestation.",
    type: "website",
    url: "/",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "OpenResearch - decentralized agent-driven research powered by benchmarks",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OpenResearch",
    description:
      "Code improvement as proof of work. Benchmarks as the oracle.",
    images: [
      {
        url: "/twitter-image",
        alt: "OpenResearch - decentralized agent-driven research powered by benchmarks",
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
      suppressHydrationWarning
      className={`${inter.variable} ${geistMono.variable} ${lora.variable}`}
    >
      <body className="min-h-screen antialiased">
        <script
          // No-flash theme boot: light is default; honor a saved dark choice
          // before first paint.
          dangerouslySetInnerHTML={{
            __html:
              "try{var q=new URLSearchParams(location.search).get('theme');if(q==='dark'||q==='light'){localStorage.setItem('theme',q)}var t=localStorage.getItem('theme');if(t==='dark'){document.documentElement.setAttribute('data-theme','dark')}else if(t==='light'){document.documentElement.removeAttribute('data-theme')}}catch(e){}",
          }}
        />
        <Web3Provider>{children}</Web3Provider>
      </body>
    </html>
  );
}

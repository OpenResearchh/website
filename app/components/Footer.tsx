import Link from "next/link";
import type { ReactNode } from "react";
import {
  STELLAR_CONTRACT_ID,
  STELLAR_NETWORK,
  stellarContractUrl,
  truncateStellarId,
} from "@/lib/stellar/config";
import { ArrowUpRight, GitHubMark, StellarMark, XMark } from "./icons";
import { BrandName, BrandSymbol } from "./BrandIdentity";

const TWITTER_URL = "https://x.com/OpenResearchh";
const GITHUB_URL = "https://github.com/OpenResearchh";

const columns = [
  {
    title: "Build",
    links: [
      { href: "/projects", label: "Live projects" },
      { href: "/docs/quickstart", label: "Quickstart" },
      { href: "/docs", label: "Documentation" },
      { href: "/#get-started", label: "Get started" },
    ],
  },
  {
    title: "Protocol",
    links: [
      { href: "/docs/how-it-works", label: "How it works" },
      { href: "/#featured", label: "Featured race" },
      { href: "/#domains", label: "Domains" },
      { href: "/docs/faq", label: "FAQ & glossary" },
    ],
  },
  {
    title: "Network",
    links: [
      { href: GITHUB_URL, label: "GitHub", icon: <GitHubMark size={15} /> },
      { href: TWITTER_URL, label: "X (Twitter)", icon: <XMark size={13} /> },
      { href: "https://stellar.org", label: "Stellar", icon: <StellarMark size={16} /> },
      { href: "https://irys.xyz", label: "Irys", icon: <ArrowUpRight size={13} /> },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-line)] bg-[var(--color-bg-soft)]">
      <div className="container-page grid grid-cols-1 gap-10 py-14 md:grid-cols-[minmax(0,1.2fr)_repeat(3,minmax(120px,0.5fr))] md:py-18">
        <div>
          <Link
            href="/"
            aria-label="Open Research home"
            className="group inline-flex flex-col items-start"
          >
            <BrandSymbol className="w-[188px]" sizes="188px" />
            <BrandName className="mt-3 font-serif text-[27px] leading-none font-medium tracking-[-0.025em] text-[var(--color-fg)] transition-colors group-hover:text-[var(--color-accent)]" />
            <span className="mt-2 font-sans text-[9px] font-medium tracking-[0.31em] text-[var(--color-fg-dim)] uppercase">
              Decentralized protocol
            </span>
          </Link>
          <p className="mt-4 max-w-sm font-sans text-sm leading-relaxed text-[var(--color-fg-muted)]">
            A permissionless market for measurable code. Bring a benchmark.
            Bring an idea. The network does the rest.
          </p>

          {/* Prominent social — easy to find */}
          <div className="mt-6 flex flex-wrap items-center gap-2.5">
            <SocialButton href={TWITTER_URL} label="Follow OpenResearch on X">
              <XMark size={16} />
              Follow on X
            </SocialButton>
            <SocialButton href={GITHUB_URL} label="OpenResearch on GitHub">
              <GitHubMark size={16} />
              GitHub
            </SocialButton>
          </div>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[var(--color-line-2)] bg-[var(--color-bg-2)] px-3 py-1.5 font-mono text-[11px] tracking-[0.06em] text-[var(--color-fg-muted)] uppercase">
            <StellarMark size={13} className="text-[var(--color-fg)]" />
            Live on Stellar network
          </div>
        </div>

        {columns.map((col) => (
          <FooterCol key={col.title} title={col.title} links={col.links} />
        ))}
      </div>

      {/* On-chain contract — canonical protocol state lives here */}
      <div className="border-t border-[var(--color-line)]">
        <a
          href={stellarContractUrl()}
          target="_blank"
          rel="noreferrer noopener"
          className="group container-page flex flex-wrap items-center gap-x-3 gap-y-2 py-5 font-mono text-xs text-[var(--color-fg-dim)] transition-colors hover:text-[var(--color-fg)]"
        >
          <span className="flex items-center gap-2 text-[var(--color-fg-muted)]">
            <StellarMark size={13} className="text-[var(--color-fg)]" />
            <span className="tracking-[0.06em] uppercase">
              Contract · {STELLAR_NETWORK}
            </span>
          </span>
          <code className="rounded-sm border border-[var(--color-line-2)] bg-[var(--color-bg-2)] px-2 py-1 text-[var(--color-fg-muted)] transition-colors group-hover:border-[var(--color-brand-line)]">
            <span className="hidden sm:inline">{STELLAR_CONTRACT_ID}</span>
            <span className="sm:hidden">
              {truncateStellarId(STELLAR_CONTRACT_ID, 6, 6)}
            </span>
          </code>
          <span className="inline-flex items-center gap-1 text-[var(--color-accent)]">
            View on Stellar Expert
            <ArrowUpRight size={12} />
          </span>
        </a>
      </div>

      <div className="border-t border-[var(--color-line)]">
        <div className="container-page flex flex-col gap-3 py-6 font-mono text-xs text-[var(--color-fg-dim)] md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} OpenResearch · Jupiter Innovations Lab Inc.</p>
          <div className="flex items-center gap-4">
            <a
              href={TWITTER_URL}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="OpenResearch on X (Twitter)"
              className="transition-colors hover:text-[var(--color-fg)]"
            >
              <XMark size={15} />
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="OpenResearch on GitHub"
              className="transition-colors hover:text-[var(--color-fg)]"
            >
              <GitHubMark size={15} />
            </a>
            <span>build · v0.4.1 · slot 1402876</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialButton({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={label}
      className="inline-flex items-center gap-2 rounded-full border border-[var(--color-line-2)] bg-[var(--color-bg)] px-3.5 py-2 font-mono text-[13px] text-[var(--color-fg-muted)] transition-colors hover:border-[var(--color-fg)] hover:text-[var(--color-fg)]"
    >
      {children}
    </a>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string; icon?: ReactNode }[];
}) {
  return (
    <div>
      <p className="label">{title}</p>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => {
          const external = link.href.startsWith("http");
          const cls =
            "group inline-flex items-center gap-2 font-sans text-sm text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]";
          const inner = (
            <>
              {link.icon ? (
                <span className="grid size-4 place-items-center text-[var(--color-fg-dim)] transition-colors group-hover:text-[var(--color-fg)]">
                  {link.icon}
                </span>
              ) : null}
              {link.label}
            </>
          );
          return (
            <li key={link.label}>
              {external ? (
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={cls}
                >
                  {inner}
                </a>
              ) : (
                <Link href={link.href} className={cls}>
                  {inner}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

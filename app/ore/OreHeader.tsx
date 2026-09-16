"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { GitHubMark } from "../components/icons";
import { ThemeToggle } from "../components/ThemeToggle";
import { focusRing, REPO_URL } from "./shared";

const sectionLinks = [
  { href: "#features", label: "Features" },
  { href: "#assistant", label: "Assistant" },
  { href: "#open-source", label: "Open source" },
  { href: "#faq", label: "FAQ" },
];

/**
 * A floating glass capsule: sections on the left, the logo centered, actions
 * on the right. Past the hero it contracts and lifts slightly, so the bar
 * reads as chrome over the page rather than part of the hero.
 */
export function OreHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-scrolled={scrolled}
      className="pointer-events-none sticky top-0 z-50 h-[68px] px-3 pt-3 md:h-[76px] md:px-5 md:pt-4"
    >
      <div
        className={`ore-glass pointer-events-auto mx-auto grid grid-cols-[1fr_auto_1fr] items-center gap-2 rounded-full pr-2 pl-2.5 transition-[max-width,height,box-shadow] duration-500 ease-out md:gap-3 ${
          scrolled
            ? "h-12 max-w-[760px] shadow-[0_14px_36px_-16px_rgba(10,10,20,0.55)] md:h-[52px] md:max-w-[900px]"
            : "h-13 max-w-[900px] md:h-14 md:max-w-[1060px]"
        }`}
      >
        <div className="flex min-w-0 items-center gap-1 justify-self-start">
          <ThemeToggle
            className={`grid size-9 shrink-0 place-items-center rounded-full text-[var(--color-fg-muted)] transition-colors hover:bg-[rgb(var(--ink)_/_0.07)] hover:text-[var(--color-fg)] ${focusRing}`}
          />
          <Separator className="hidden md:block" />
          <nav aria-label="ORE sections" className="hidden items-center md:flex">
            {sectionLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`rounded-full px-3 py-1.5 font-sans text-[13.5px] font-medium text-[var(--color-fg-muted)] transition-colors hover:bg-[rgb(var(--ink)_/_0.07)] hover:text-[var(--color-fg)] ${focusRing}`}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <Link
          href="/ore"
          aria-label="ORE home"
          className={`group flex items-center gap-2 justify-self-center rounded-full px-1 ${focusRing}`}
        >
          <Image
            src="/ore/icon.svg"
            alt=""
            width={30}
            height={30}
            priority
            className="size-[30px] transition-[filter] duration-300 group-hover:drop-shadow-[0_4px_12px_rgba(245,158,11,0.55)]"
          />
          <span className="font-sans text-[17px] font-semibold tracking-[-0.02em] text-[var(--color-fg)]">
            ORE
          </span>
        </Link>

        <div className="flex items-center gap-1.5 justify-self-end">
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="ORE on GitHub"
            title="ORE on GitHub"
            className={`hidden size-9 place-items-center rounded-full text-[var(--color-fg-muted)] transition-colors hover:bg-[rgb(var(--ink)_/_0.07)] hover:text-[var(--color-fg)] sm:grid ${focusRing}`}
          >
            <GitHubMark size={17} />
          </a>
          <Separator className="hidden sm:block" />
          <a
            href="#install"
            className={`btn-brand rounded-full! px-4 py-2 font-sans text-[13.5px] font-semibold shadow-[0_8px_22px_-10px_rgba(245,158,11,0.9)] ${focusRing}`}
          >
            <DownloadGlyph />
            Download
          </a>
        </div>
      </div>
    </header>
  );
}

function Separator({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`mx-1 h-5 w-px shrink-0 bg-[rgb(var(--ink)_/_0.14)] ${className}`}
    />
  );
}

function DownloadGlyph() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3.5v11" />
      <path d="m7.5 10.5 4.5 4.5 4.5-4.5" />
      <path d="M4.5 19.5h15" />
    </svg>
  );
}

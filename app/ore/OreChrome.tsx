import Image from "next/image";
import Link from "next/link";
import { GitHubMark } from "../components/icons";
import {
  focusRing,
  PRIVACY_URL,
  RELEASES_URL,
  REPO_URL,
  SECURITY_URL,
} from "./shared";

/* ORE's own footer rather than the protocol site's, so the page reads as one
   product with one job: get the app installed. The header is in OreHeader. */

const footerLinks = [
  { href: REPO_URL, label: "GitHub" },
  { href: RELEASES_URL, label: "Releases" },
  { href: PRIVACY_URL, label: "Privacy" },
  { href: SECURITY_URL, label: "Security" },
];

export function OreFooter() {
  return (
    <footer>
      <div className="container-page flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2.5">
          <Image src="/ore/icon.svg" alt="" width={22} height={22} className="size-[22px]" />
          <span className="font-sans text-[15px] font-semibold text-[var(--color-fg)]">
            ORE
          </span>
          <span className="font-sans text-sm text-[var(--color-fg-dim)]">
            by{" "}
            <Link
              href="/"
              className={`underline-offset-2 transition-colors hover:text-[var(--color-fg)] hover:underline ${focusRing}`}
            >
              OpenResearch
            </Link>
          </span>
        </div>

        <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 font-sans text-sm text-[var(--color-fg-muted)]">
          {footerLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target="_blank"
                rel="noreferrer noopener"
                className={`inline-flex items-center gap-1.5 transition-colors hover:text-[var(--color-fg)] ${focusRing}`}
              >
                {link.label === "GitHub" ? <GitHubMark size={14} /> : null}
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <p className="font-mono text-xs text-[var(--color-fg-dim)]">
          Apache 2.0 · © {new Date().getFullYear()} Jupiter Innovations Lab Inc.
        </p>
      </div>
    </footer>
  );
}

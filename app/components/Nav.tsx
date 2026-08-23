import Image from "next/image";
import Link from "next/link";
import { NavLinks } from "./NavLinks";
import { ThemeToggle } from "./ThemeToggle";
import { GitHubMark, XMark } from "./icons";

const TWITTER_URL = "https://x.com/OpenResearchh";
const GITHUB_URL = "https://github.com/OpenResearchh";

const links = [
  { href: "/", label: "Overview" },
  { href: "/projects", label: "Projects" },
  { href: "/#how", label: "Protocol" },
  { href: "/docs", label: "Docs" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-line)] bg-[var(--color-glass)] backdrop-blur-[14px]">
      <div className="container-page grid h-16 grid-cols-[1fr_auto_1fr] items-center">
        <Link
          href="/"
          className="group flex items-center gap-2.5 justify-self-start font-mono text-[14px] font-medium tracking-tight"
        >
          <Image
            src="/logos/icon.jpeg"
            alt="OpenResearch"
            width={30}
            height={30}
            className="h-[30px] w-[30px] rounded-full ring-1 ring-[var(--color-line-2)]"
            priority
          />
          <span className="text-[var(--color-fg-dim)]">/</span>
          <span className="text-[var(--color-fg)] transition-colors group-hover:text-[var(--color-accent)]">
            OpenResearch
          </span>
        </Link>

        <NavLinks links={links} />

        <div className="flex items-center justify-self-end gap-1.5 sm:gap-2">
          <IconLink href={TWITTER_URL} label="OpenResearch on X (Twitter)">
            <XMark size={15} />
          </IconLink>
          <IconLink href={GITHUB_URL} label="OpenResearch on GitHub">
            <GitHubMark size={16} />
          </IconLink>
          <ThemeToggle />
          <Link
            href="/projects"
            className="btn-brand ml-1 px-3.5 py-2 font-mono text-[13px] whitespace-nowrap"
          >
            <span className="nav-cta-pulse" aria-hidden="true" />
            View live projects
          </Link>
        </div>
      </div>
    </header>
  );
}

function IconLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={label}
      title={label}
      className="grid size-9 place-items-center rounded-sm border border-[var(--color-line-2)] bg-[var(--color-bg-soft)] text-[var(--color-fg-muted)] transition-colors hover:border-[var(--color-fg)] hover:text-[var(--color-fg)]"
    >
      {children}
    </a>
  );
}

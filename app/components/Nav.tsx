import Link from "next/link";
import { BrandName, BrandSymbol } from "./BrandIdentity";
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
      <div className="container-page grid h-16 grid-cols-[1fr_auto] items-center gap-4 lg:grid-cols-[1fr_auto_1fr]">
        <Link
          href="/"
          aria-label="Open Research home"
          className="group flex items-center gap-2.5 justify-self-start"
        >
          <BrandSymbol className="w-[54px] sm:w-[62px]" priority sizes="62px" />
          <BrandName className="hidden font-serif text-[17px] font-medium tracking-[-0.02em] text-[var(--color-fg)] transition-colors group-hover:text-[var(--color-accent)] min-[430px]:inline sm:text-[18px]" />
        </Link>

        <NavLinks links={links} />

        <div className="flex items-center justify-self-end gap-1.5 sm:gap-2">
          <IconLink href={TWITTER_URL} label="OpenResearch on X (Twitter)" className="hidden xl:grid">
            <XMark size={15} />
          </IconLink>
          <IconLink href={GITHUB_URL} label="OpenResearch on GitHub" className="hidden xl:grid">
            <GitHubMark size={16} />
          </IconLink>
          <ThemeToggle />
          <Link
            href="/projects"
            className="btn-brand ml-1 px-3.5 py-2 font-mono text-[13px] whitespace-nowrap"
          >
            <span className="nav-cta-pulse hidden sm:block" aria-hidden="true" />
            <span className="hidden sm:inline">View live projects</span>
            <span className="sm:hidden">Projects</span>
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
  className = "",
}: {
  href: string;
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={label}
      title={label}
      className={`size-9 place-items-center rounded-sm border border-[var(--color-line-2)] bg-[var(--color-bg-soft)] text-[var(--color-fg-muted)] transition-colors hover:border-[var(--color-fg)] hover:text-[var(--color-fg)] ${className}`}
    >
      {children}
    </a>
  );
}

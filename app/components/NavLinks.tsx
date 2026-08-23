"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLink = { href: string; label: string };

export function NavLinks({ links }: { links: NavLink[] }) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href.startsWith("/#")) return false; // in-page anchors on home
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <nav className="hidden items-center gap-8 justify-self-center sm:flex">
      {links.map((link) => {
        const active = isActive(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={`relative font-mono text-[13px] transition-colors ${
              active
                ? "text-[var(--color-fg)]"
                : "text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
            }`}
          >
            {link.label}
            {active ? (
              <span className="absolute -bottom-1.5 left-0 h-0.5 w-full rounded-full bg-[var(--color-brand)]" />
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}

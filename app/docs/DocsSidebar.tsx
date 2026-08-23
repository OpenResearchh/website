"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DOCS } from "./docs";

export function DocsSidebar() {
  const pathname = usePathname();

  const hrefFor = (slug: string, i: number) =>
    i === 0 ? "/docs" : `/docs/${slug}`;

  const isActive = (slug: string, i: number) => {
    const href = hrefFor(slug, i);
    if (href === "/docs") return pathname === "/docs";
    return pathname === href;
  };

  return (
    <nav aria-label="Docs" className="flex flex-col gap-1">
      <p className="label-muted mb-2 px-3">Documentation</p>
      {DOCS.map((doc, i) => {
        const active = isActive(doc.slug, i);
        return (
          <Link
            key={doc.slug}
            href={hrefFor(doc.slug, i)}
            aria-current={active ? "page" : undefined}
            className={`group relative rounded-sm px-3 py-2 text-[14px] transition-colors ${
              active
                ? "bg-[var(--color-brand-subtle)] font-medium text-[var(--color-fg)]"
                : "text-[var(--color-fg-muted)] hover:bg-[rgb(var(--ink)_/_0.03)] hover:text-[var(--color-fg)]"
            }`}
          >
            {active ? (
              <span className="absolute top-1.5 bottom-1.5 left-0 w-0.5 rounded-full bg-[var(--color-brand)]" />
            ) : null}
            {doc.title}
          </Link>
        );
      })}
    </nav>
  );
}

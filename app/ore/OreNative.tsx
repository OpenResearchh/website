import type { ReactNode } from "react";

/* Checked against the shipping source (master, v0.7.2): 248 Swift files and
   ~95k lines across Apps/ and Packages/, no package.json, no node_modules, no
   JS or TS anywhere in the app, Swift 6 targeting macOS 14, arm64-only build
   (see the Homebrew cask), and a README that states 1,191 offline tests. */

function Glyph({ children }: { children: ReactNode }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

/** The Swift badge, used to say what ORE is written in. */
function SwiftMark() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M7.508 0c-.287 0-.573 0-.86.002-.241.002-.483.003-.724.01-.132.003-.263.009-.395.015A9.154 9.154 0 0 0 4.348.15 5.492 5.492 0 0 0 2.85.645 5.04 5.04 0 0 0 .645 2.848c-.245.48-.4.972-.495 1.5-.093.52-.122 1.05-.136 1.576a35.2 35.2 0 0 0-.012.724C0 6.935 0 7.221 0 7.508v8.984c0 .287 0 .575.002.862.002.24.005.481.012.722.014.526.043 1.057.136 1.576.095.528.25 1.02.495 1.5a5.03 5.03 0 0 0 2.205 2.203c.48.244.97.4 1.498.495.52.093 1.05.124 1.576.138.241.007.483.009.724.01.287.002.573.002.86.002h8.984c.287 0 .573 0 .86-.002.241-.001.483-.003.724-.01a10.523 10.523 0 0 0 1.578-.138 5.322 5.322 0 0 0 1.498-.495 5.035 5.035 0 0 0 2.203-2.203c.245-.48.4-.972.495-1.5.093-.52.124-1.05.138-1.576.007-.241.009-.481.01-.722.002-.287.002-.575.002-.862V7.508c0-.287 0-.573-.002-.86a33.662 33.662 0 0 0-.01-.724 10.5 10.5 0 0 0-.138-1.576 5.328 5.328 0 0 0-.495-1.5A5.039 5.039 0 0 0 21.152.645 5.32 5.32 0 0 0 19.654.15a10.493 10.493 0 0 0-1.578-.138 34.98 34.98 0 0 0-.722-.01C17.067 0 16.779 0 16.492 0H7.508zm6.035 3.41c4.114 2.47 6.545 7.162 5.549 11.131-.024.093-.05.181-.076.272l.002.001c2.062 2.538 1.5 5.258 1.236 4.745-1.072-2.086-3.066-1.568-4.088-1.043a6.803 6.803 0 0 1-.281.158l-.02.012-.002.002c-2.115 1.123-4.957 1.205-7.812-.022a12.568 12.568 0 0 1-5.64-4.838c.649.48 1.35.902 2.097 1.252 3.019 1.414 6.051 1.311 8.197-.002C9.651 12.73 7.101 9.67 5.146 7.191a10.628 10.628 0 0 1-1.005-1.384c2.34 2.142 6.038 4.83 7.365 5.576C8.69 8.408 6.208 4.743 6.324 4.86c4.436 4.47 8.528 6.996 8.528 6.996.154.085.27.154.36.213.085-.215.16-.437.224-.668.708-2.588-.09-5.548-1.893-7.992z" />
    </svg>
  );
}

type Stat = {
  icon: ReactNode;
  value: string;
  caption: string;
  /** The Swift badge is its own tile; the rest sit in a tinted one. */
  bare?: boolean;
};

const stats: Stat[] = [
  {
    icon: <SwiftMark />,
    value: "100% Swift",
    caption: "SwiftUI, 248 files",
    bare: true,
  },
  {
    icon: (
      <Glyph>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 9.5h18" />
        <path d="m3 3 18 18" />
      </Glyph>
    ),
    value: "No Electron",
    caption: "no bundled browser",
  },
  {
    icon: (
      <Glyph>
        <rect x="7" y="7" width="10" height="10" rx="2" />
        <path d="M10 3v3M14 3v3M10 18v3M14 18v3M3 10h3M3 14h3M18 10h3M18 14h3" />
      </Glyph>
    ),
    value: "Apple Silicon",
    caption: "native arm64 build",
  },
  {
    icon: (
      <Glyph>
        <path d="M12 3.5 5 6v6c0 4.2 2.9 7.4 7 8.5 4.1-1.1 7-4.3 7-8.5V6Z" />
        <path d="m9 12 2 2 4-4" />
      </Glyph>
    ),
    value: "1,191 tests",
    caption: "all offline",
  },
];

export function OreNative() {
  return (
    <section id="native" className="border-t border-[var(--color-line)]">
      <div className="container-page grid grid-cols-1 gap-10 py-16 md:py-20 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center lg:gap-16">
        <div>
          <p className="label-muted">/ native</p>
          <h2 className="mt-4 flex items-center gap-3 text-balance font-sans text-2xl leading-tight font-semibold tracking-[-0.02em] text-[var(--color-fg)] md:text-[32px]">
            <span className="text-[#f05138]">
              <SwiftMark />
            </span>
            Swift all the way down.
          </h2>
          <p className="mt-3 font-sans text-[15px] leading-relaxed text-[var(--color-fg-muted)]">
            A real Mac app, not a web page in a window.
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-x-6 gap-y-7 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.value}>
              <span
                className={
                  stat.bare
                    ? "grid size-10 place-items-center text-[#f05138]"
                    : "grid size-10 place-items-center rounded-[12px] bg-[var(--color-brand-subtle)] text-[var(--color-brand-strong)] ring-1 ring-[var(--color-brand-line)]"
                }
              >
                {stat.icon}
              </span>
              <dt className="mt-4 font-sans text-base font-semibold text-[var(--color-fg)]">
                {stat.value}
              </dt>
              <dd className="mt-1 font-sans text-sm text-[var(--color-fg-dim)]">
                {stat.caption}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

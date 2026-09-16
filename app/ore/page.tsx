import type { Metadata } from "next";
import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { Arrow } from "../components/atoms";
import { CopyTextButton } from "../components/CopyTextButton";
import { GitHubMark } from "../components/icons";
import { OreActivity } from "./OreActivity";
import { OreAssistant } from "./OreAssistant";
import { OreFooter } from "./OreChrome";
import { OreHeader } from "./OreHeader";
import { OreDemoVideo } from "./OreDemoVideo";
import { OreInstall } from "./OreInstall";
import { OreNative } from "./OreNative";
import {
  focusRing,
  PRIVACY_URL,
  RELEASES_URL,
  REPO_URL,
  SECURITY_URL,
} from "./shared";
import "./ore.css";

const TITLE = "ORE — run your coding agents in parallel";
const DESCRIPTION =
  "ORE is a free, open-source Mac app that runs Claude Code and Codex in parallel, each in its own git worktree, with diff review and pull requests built in.";
const CLONE_COMMAND = `git clone ${REPO_URL}`;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/ore" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    url: "/ore",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

// ORE's amber, taken from its app icon, replaces the protocol site's yellow
// on this page only. Components read these tokens, so the swap cascades.
const oreAccent = {
  "--color-brand": "#f59e0b",
  "--color-brand-strong": "#e58a00",
  "--color-brand-ink": "#1f1300",
  "--color-brand-subtle": "rgb(245 158 11 / 0.14)",
  "--color-brand-line": "rgb(229 138 0 / 0.5)",
} as CSSProperties;

// On the dark wallpaper the theme's focus color can vanish; use white there.
const focusRingOnDark =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

export default function OrePage() {
  return (
    <div style={oreAccent}>
      <OreHeader />
      {/* Pull the page up under the floating header so the glass sits on the
          wallpaper at the top of the page. */}
      <main className="-mt-[68px] md:-mt-[72px]">
        <Hero />
        <WorksWith />
        <OreNative />
        <Features />
        <OreAssistant />
        <OpenSource />
        <Faq />
        <Install />
      </main>
      <OreFooter />
    </div>
  );
}

function Wallpaper() {
  return (
    <div aria-hidden="true" className="ore-wallpaper">
      <span className="ore-blob-amber" />
      <span className="ore-blob-blue" />
      <span className="ore-blob-violet" />
      <span className="ore-blob-core" />
    </div>
  );
}

function Hero() {
  return (
    <section className="p-2 md:p-3">
      <div className="relative isolate overflow-hidden rounded-[24px] md:rounded-[36px]">
        <Wallpaper />

        <div className="container-page pt-28 text-center md:pt-36">
          <h1 className="mx-auto max-w-4xl text-balance font-sans text-[44px] leading-[1.02] font-semibold tracking-[-0.035em] text-white sm:text-[60px] md:text-[76px]">
            Run your coding agents in parallel.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-balance font-sans text-lg leading-relaxed text-white/75 md:text-xl">
            ORE is a free,{" "}
            <strong className="font-semibold text-white">open-source</strong>{" "}
            Mac app that gives every Claude Code and Codex session its own git
            worktree. Start five tasks at once, review each diff, and ship the
            pull requests, without the agents stepping on each other.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#install"
              className={`btn-brand rounded-full! px-6 py-3.5 font-sans text-[15px] ${focusRingOnDark}`}
            >
              Download for Mac
              <Arrow />
            </a>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer noopener"
              className={`ore-glass-on-dark inline-flex items-center gap-2.5 rounded-full px-6 py-3.5 font-sans text-[15px] font-medium ${focusRingOnDark}`}
            >
              <GitHubMark size={16} />
              Star on GitHub
            </a>
          </div>
          <p className="mt-5 font-sans text-sm text-white/60">
            Open source under Apache 2.0 · macOS 14+ on Apple Silicon · Uses
            your Claude or ChatGPT plan
          </p>
        </div>

        <div className="container-page mt-12 pb-6 md:mt-16 md:pb-12">
          <OreDemoVideo />
        </div>
      </div>
    </section>
  );
}

const agents = [
  { name: "Claude Code", icon: "/agents/claude.svg" },
  { name: "Codex", icon: "/agents/codex.svg" },
  { name: "Cursor", icon: "/agents/cursor.svg", note: "experimental" },
];

function WorksWith() {
  return (
    <section className="container-page flex flex-col items-center gap-5 py-10 md:flex-row md:justify-center md:gap-12">
      <p className="label-muted">Works with the agents you already use</p>
      <ul className="flex flex-wrap items-center justify-center gap-x-9 gap-y-3">
        {agents.map((agent) => (
          <li
            key={agent.name}
            className="flex items-center gap-2.5 font-sans text-[15px] font-medium text-[var(--color-fg)]"
          >
            <span
              aria-hidden="true"
              className="block size-5 bg-[var(--color-fg)]"
              style={{
                WebkitMaskImage: `url(${agent.icon})`,
                maskImage: `url(${agent.icon})`,
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
                WebkitMaskSize: "contain",
                maskSize: "contain",
              }}
            />
            {agent.name}
            {agent.note ? (
              <span className="font-mono text-[11px] font-normal text-[var(--color-fg-dim)]">
                {agent.note}
              </span>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}

const features = [
  {
    title: "One task, one worktree",
    body: "Every agent gets its own branch and checkout. Start work from a sentence, an issue or a PR, stack tasks on each other, and switch between them without stashing a thing.",
  },
  {
    title: "Review it like a pull request",
    body: "Changes land as diffs, not walls of chat. Comment on a line and the agent gets the file, the line and the code around it.",
  },
  {
    title: "From commit to merged",
    body: "ORE always shows the next step: commit, push, open the PR, fix CI, merge. When CI fails, one click hands the log back to the agent.",
  },
];

const details: { title: string; body: string; icon: ReactNode }[] = [
  {
    title: "No API keys",
    body: "ORE runs the Claude Code and Codex you're already signed into, on your existing plan. Stray provider keys are scrubbed, so nothing slips onto metered billing.",
    icon: (
      <DetailIcon>
        <circle cx="7.5" cy="15.5" r="4" />
        <path d="M10.5 12.5 19 4" />
        <path d="m15.5 7.5 2.5 2.5" />
        <path d="M3 3l18 18" />
      </DetailIcon>
    ),
  },
  {
    title: "Rewind any turn",
    body: "A checkpoint at every turn. Reverting restores the files and the conversation to the same moment.",
    icon: (
      <DetailIcon>
        <path d="M3 12a9 9 0 1 0 2.64-6.36L3 8" />
        <path d="M3 3v5h5" />
        <path d="M12 7.5V12l3 2" />
      </DetailIcon>
    ),
  },
  {
    title: "A terminal in every worktree",
    body: "Start the dev server and it keeps running while you read the diff.",
    icon: (
      <DetailIcon>
        <rect x="3" y="4" width="18" height="16" rx="2.5" />
        <path d="m7.5 9.5 2.5 2.5-2.5 2.5" />
        <path d="M12.5 15h4" />
      </DetailIcon>
    ),
  },
  {
    title: "Stays on your Mac",
    body: "Your code, prompts and agent output never leave your machine.",
    icon: (
      <DetailIcon>
        <rect x="4.5" y="10.5" width="15" height="10" rx="2" />
        <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
      </DetailIcon>
    ),
  },
];

function Features() {
  return (
    <section id="features" className="border-t border-[var(--color-line)]">
      <div className="container-page py-20 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance font-sans text-3xl leading-tight font-semibold tracking-[-0.025em] text-[var(--color-fg)] md:text-[44px]">
            Hand off the work. Keep the judgment.
          </h2>
          <p className="mt-4 font-sans text-lg leading-relaxed text-[var(--color-fg-muted)]">
            The agents write the code. ORE keeps every change separate, easy to
            read and one step from shipping.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-line)] md:grid-cols-3">
          {features.map((feature, i) => (
            <div key={feature.title} className="bg-[var(--color-bg-soft)] p-7 md:p-9">
              <p className="tick text-sm font-medium text-[var(--color-fg-dim)]">
                0{i + 1}
              </p>
              <h3 className="mt-5 font-sans text-xl font-semibold tracking-[-0.015em] text-[var(--color-fg)]">
                {feature.title}
              </h3>
              <p className="mt-3 font-sans text-[15px] leading-relaxed text-[var(--color-fg-muted)]">
                {feature.body}
              </p>
            </div>
          ))}
        </div>

        <dl className="mt-14 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {details.map((detail) => (
            <div key={detail.title} className="border-t border-[var(--color-line-2)] pt-6">
              <dt className="font-sans text-base font-semibold text-[var(--color-fg)]">
                <span className="mb-4 grid size-10 place-items-center rounded-[12px] bg-[var(--color-brand-subtle)] text-[var(--color-brand-strong)] ring-1 ring-[var(--color-brand-line)]">
                  {detail.icon}
                </span>
                {detail.title}
              </dt>
              <dd className="mt-2 font-sans text-[15px] leading-relaxed text-[var(--color-fg-muted)]">
                {detail.body}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function DetailIcon({ children }: { children: ReactNode }) {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function OpenSource() {
  return (
    <section id="open-source" className="border-t border-[var(--color-line)]">
      <div className="container-page grid grid-cols-1 items-center gap-12 py-20 md:py-28 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
        <div className="text-center lg:text-left">
          <span className="ore-glass mx-auto grid size-16 place-items-center rounded-[20px] text-[var(--color-fg)] lg:mx-0">
            <GitHubMark size={28} />
          </span>
          <h2 className="mt-7 text-balance font-sans text-3xl leading-tight font-semibold tracking-[-0.025em] text-[var(--color-fg)] md:text-[44px]">
            Open source, down to the installer.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-balance font-sans text-lg leading-relaxed text-[var(--color-fg-muted)] lg:mx-0">
            Every line of ORE is on GitHub under Apache 2.0: the app, the agent
            drivers, even the script that installs it. Read it, fork it, or
            send a pull request. ORE can open one for you.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer noopener"
              className={`inline-flex items-center gap-2.5 rounded-full bg-[var(--color-fg)] px-5 py-3 font-sans text-sm font-medium text-[var(--color-bg)] transition-opacity hover:opacity-85 ${focusRing}`}
            >
              <StarIcon />
              Star on GitHub
            </a>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer noopener"
              className={`inline-flex items-center gap-2.5 rounded-full border border-[var(--color-line-2)] bg-[var(--color-bg-soft)] px-5 py-3 font-sans text-sm font-medium text-[var(--color-fg)] transition-colors hover:border-[var(--color-fg)] ${focusRing}`}
            >
              <GitHubMark size={15} />
              Browse the source
            </a>
          </div>

          <div className="mx-auto mt-4 flex min-h-11 max-w-md items-center gap-3 rounded-full border border-[var(--color-line-2)] bg-[var(--color-bg-soft)] py-1 pr-1 pl-5 lg:mx-0">
            <code className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-left font-mono text-[12px] text-[var(--color-fg-muted)]">
              <span className="select-none text-[var(--color-fg-dim)]">$ </span>
              {CLONE_COMMAND}
            </code>
            <CopyTextButton
              text={CLONE_COMMAND}
              label="Copy the git clone command"
              variant="icon"
              className="rounded-full! border-transparent! bg-transparent!"
            />
          </div>
        </div>

        <OreActivity />
      </div>
    </section>
  );
}

function StarIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 3.2l2.7 5.5 6 .9-4.35 4.25 1.03 6-5.38-2.83-5.38 2.83 1.03-6L3.3 9.6l6-.9Z" />
    </svg>
  );
}

const faqs: { q: string; a: ReactNode }[] = [
  {
    q: "Is ORE free?",
    a: "Yes. ORE is free and open source under the Apache 2.0 license.",
  },
  {
    q: "Do I need API keys?",
    a: "No. ORE drives the Claude Code and Codex command-line tools you're already signed into, so your usage counts against your existing Claude or ChatGPT plan.",
  },
  {
    q: "Which agents does it support?",
    a: "Claude Code and Codex, fully. Cursor's agent is experimental: its CLI can't answer permission prompts yet, so ORE only runs it if you opt in.",
  },
  {
    q: "Does my code leave my Mac?",
    a: (
      <>
        No. Code, prompts and agent output stay on your machine. ORE sends a
        small set of anonymous usage events, which you can inspect or switch
        off in Settings.{" "}
        <TextLink href={PRIVACY_URL}>Read exactly what it measures</TextLink>.
      </>
    ),
  },
  {
    q: "Why does macOS warn me about the download?",
    a: (
      <>
        ORE isn&apos;t notarized by Apple yet. The Homebrew and curl installs
        open without a prompt. Every release carries a signed build
        attestation you can check with the GitHub CLI.{" "}
        <TextLink href={SECURITY_URL}>How to verify a download</TextLink>.
      </>
    ),
  },
  {
    q: "What do I need to run it?",
    a: "A Mac with Apple Silicon on macOS 14 Sonoma or later, plus Claude Code or Codex installed and signed in.",
  },
];

function Faq() {
  return (
    <section id="faq" className="border-t border-[var(--color-line)]">
      <div className="container-page grid grid-cols-1 gap-10 py-20 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:py-28">
        <h2 className="font-sans text-3xl leading-tight font-semibold tracking-[-0.025em] text-[var(--color-fg)] md:text-[44px]">
          Questions
        </h2>
        <div className="border-t border-[var(--color-line-2)]">
          {faqs.map((faq) => (
            <details key={faq.q} className="group border-b border-[var(--color-line-2)]">
              <summary
                className={`flex cursor-pointer list-none items-center justify-between gap-6 py-5 font-sans text-lg font-medium text-[var(--color-fg)] [&::-webkit-details-marker]:hidden ${focusRing}`}
              >
                {faq.q}
                <span
                  aria-hidden="true"
                  className="font-mono text-xl leading-none text-[var(--color-fg-dim)] transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="pb-6 font-sans text-[15px] leading-relaxed text-[var(--color-fg-muted)]">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className={`text-[var(--color-accent)] underline underline-offset-2 hover:text-[var(--color-fg)] ${focusRing}`}
    >
      {children}
    </a>
  );
}

function Install() {
  return (
    <section id="install" className="p-2 md:p-3">
      <div className="relative isolate overflow-hidden rounded-[24px] md:rounded-[36px]">
        <Wallpaper />
        <div className="container-page py-20 text-center md:py-28">
          <Image
            src="/ore/icon.svg"
            alt=""
            width={72}
            height={72}
            className="mx-auto size-16 drop-shadow-[0_14px_30px_rgba(245,158,11,0.4)] md:size-[72px]"
          />
          <h2 className="mt-7 text-balance font-sans text-3xl leading-tight font-semibold tracking-[-0.025em] text-white md:text-[44px]">
            Put your agents to work.
          </h2>
          <p className="mt-4 font-sans text-lg text-white/75">
            Free and open source, on any Apple Silicon Mac running macOS 14 or
            later.
          </p>
          <div className="ore-glass-on-dark mx-auto mt-10 max-w-xl rounded-[22px] p-4 md:p-5">
            <OreInstall />
          </div>
          <p className="mx-auto mt-6 max-w-xl font-sans text-sm leading-relaxed text-white/65">
            Prefer a disk image?{" "}
            <a
              href={`${RELEASES_URL}/latest`}
              target="_blank"
              rel="noreferrer noopener"
              className={`text-white underline underline-offset-2 hover:text-white/80 ${focusRingOnDark}`}
            >
              Download the DMG
            </a>
            . macOS will ask you to approve it once, under System Settings →
            Privacy &amp; Security.
          </p>
        </div>
      </div>
    </section>
  );
}

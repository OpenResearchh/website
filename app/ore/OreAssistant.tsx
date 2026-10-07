import type { CSSProperties, ReactNode } from "react";

/* Every claim here is checked against the shipping app (master, v0.7.2):
   the assistant runs without shell/editor/file tools on purpose, routes work
   to the agent that owns the repository, drives the UI through its own tools
   with confirmation cards for consequential ones, keeps file-backed memory,
   answers blocked tabs from a floating HUD, and fails over to another
   signed-in CLI when its own provider dies. */

function Glyph({ children, size = 20 }: { children: ReactNode; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
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

const MicGlyph = () => (
  <Glyph>
    <rect x="9" y="3" width="6" height="11" rx="3" />
    <path d="M5.5 11.5a6.5 6.5 0 0 0 13 0" />
    <path d="M12 18v3" />
  </Glyph>
);

const HandoffGlyph = () => (
  <Glyph>
    <path d="M3 12h11" />
    <path d="m10.5 8.5 3.5 3.5-3.5 3.5" />
    <path d="M17 4.5h3.5v15H17" />
  </Glyph>
);

const RouteGlyph = () => (
  <Glyph>
    <circle cx="6" cy="18.5" r="2.5" />
    <circle cx="18" cy="5.5" r="2.5" />
    <circle cx="18" cy="18.5" r="2.5" />
    <path d="M6 16V9a3 3 0 0 1 3-3h6" />
    <path d="M8.5 18.5h7" />
  </Glyph>
);

const SlidersGlyph = () => (
  <Glyph>
    <path d="M5 20v-6M5 10V4M12 20v-9M12 7V4M19 20v-4M19 12V4" />
    <path d="M3 14h4M10 7h4M17 16h4" />
  </Glyph>
);

const BellGlyph = () => (
  <Glyph>
    <path d="M6.5 9.5a5.5 5.5 0 0 1 11 0c0 4 1.5 5.5 1.5 5.5H5s1.5-1.5 1.5-5.5Z" />
    <path d="M10 18.5a2.2 2.2 0 0 0 4 0" />
  </Glyph>
);

const MemoryGlyph = () => (
  <Glyph>
    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H19v15H6.5A2.5 2.5 0 0 0 4 20.5Z" />
    <path d="M9 8h6M9 11.5h4" />
  </Glyph>
);

const FailoverGlyph = () => (
  <Glyph>
    <path d="M4 8h11l-2.5-2.5M20 16H9l2.5 2.5" />
  </Glyph>
);

const SparkGlyph = () => (
  <Glyph>
    <path d="M12 3.5 13.8 9l5.7 1.8-5.7 1.9L12 18.5l-1.8-5.8L4.5 10.8 10.2 9Z" />
  </Glyph>
);

const pillars: { icon: ReactNode; title: string; body: string }[] = [
  {
    icon: <HandoffGlyph />,
    title: "Delegates, never edits",
    body: "No shell, no editor. The work goes to the agent that owns the repository.",
  },
  {
    icon: <RouteGlyph />,
    title: "Knows where work belongs",
    body: "An open tab, a fresh one, or a new worktree. It asks when two genuinely fit.",
  },
  {
    icon: <SlidersGlyph />,
    title: "Drives the whole app",
    body: "Models, chips, tabs, commits, PRs, conflicts, CI. It confirms anything risky.",
  },
];

const details: { icon: ReactNode; title: string; body: string }[] = [
  { icon: <MicGlyph />, title: "Hold ⇧⌥ and talk", body: "Hands-free, over any app." },
  { icon: <BellGlyph />, title: "Answers blocked tabs", body: "Allow or deny from anywhere." },
  { icon: <MemoryGlyph />, title: "Remembers", body: "Your preferences and projects." },
  { icon: <FailoverGlyph />, title: "Never goes quiet", body: "Rate-limited? It switches CLI." },
];

export function OreAssistant() {
  return (
    <section id="assistant" className="p-2 md:p-3">
      <div className="relative isolate overflow-hidden rounded-[24px] md:rounded-[36px]">
        <div aria-hidden="true" className="ore-wallpaper">
          <span className="ore-blob-amber" />
          <span className="ore-blob-blue" />
          <span className="ore-blob-violet" />
          <span className="ore-blob-core" />
        </div>

        <div className="container-page py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <p className="label-muted text-white/60">/ the assistant</p>
            <h2 className="mt-5 text-balance font-sans text-3xl leading-tight font-semibold tracking-[-0.025em] text-white md:text-[44px]">
              One assistant above the whole fleet.
            </h2>
            <p className="mt-5 text-balance font-sans text-lg leading-relaxed text-white/75">
              Ask once. It picks the worktree and the tab, writes the brief,
              and hands the work to the agent that owns it.
            </p>
          </div>

          <AssistantAnimation />

          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="ore-glass-on-dark rounded-[18px] p-6 md:p-7"
              >
                <span className="grid size-11 place-items-center rounded-[14px] bg-white/10 text-[#ffcf7a] ring-1 ring-white/15">
                  {pillar.icon}
                </span>
                <h3 className="mt-5 font-sans text-lg font-semibold tracking-[-0.015em] text-white">
                  {pillar.title}
                </h3>
                <p className="mt-2 font-sans text-[15px] leading-relaxed text-white/70">
                  {pillar.body}
                </p>
              </div>
            ))}
          </div>

          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-7 lg:grid-cols-4">
            {details.map((detail) => (
              <div key={detail.title} className="flex items-start gap-3">
                <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full bg-white/10 text-white/85 ring-1 ring-white/15">
                  {detail.icon}
                </span>
                <div>
                  <dt className="font-sans text-[15px] font-semibold text-white">
                    {detail.title}
                  </dt>
                  <dd className="mt-0.5 font-sans text-sm text-white/60">
                    {detail.body}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

const demoWorktrees = [
  { name: "api", branch: "ore/api-cleanup", task: "Working independently", active: false },
  { name: "website", branch: "ore/landing-page", task: "Building the page", active: true },
  { name: "app", branch: "ore/native-polish", task: "Working independently", active: false },
];

function AssistantAnimation() {
  return (
    <div className="ore-assistant-demo mt-10">
      <div className="ore-assistant-demo-header">
        <p className="font-mono text-[11px] tracking-[0.12em] text-white/60 uppercase">
          One request. The right worktree.
        </p>
        <label className="ore-assistant-pause">
          <input type="checkbox" aria-controls="ore-assistant-flow" />
          Pause animation
        </label>
      </div>

      <div id="ore-assistant-flow" className="ore-assistant-flow">
        <div className="ore-assistant-request">
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-2 text-sm text-white/70">
              <MicGlyph /> You ask
            </span>
            <div className="ore-assistant-wave" aria-hidden="true">
              {[10, 18, 26, 14, 30, 20, 12, 24, 16].map((height, index) => (
                <span
                  key={index}
                  style={{ height, "--wave-delay": `${index * -0.13}s` } as CSSProperties}
                />
              ))}
            </div>
          </div>
          <p className="mt-5 font-sans text-xl leading-relaxed font-medium tracking-tight text-white">
            “Add a pricing section to the website.”
          </p>
          <p className="mt-5 font-mono text-[11px] text-white/50">VOICE OR TYPE · YOUR CALL</p>
        </div>

        <div className="ore-assistant-wire" aria-hidden="true"><span /></div>

        <div className="ore-assistant-router">
          <div className="ore-assistant-orbit" aria-hidden="true">
            <span className="ore-assistant-orbit-ring" />
            <span className="ore-assistant-orbit-ring ore-assistant-orbit-ring-delayed" />
            <span className="ore-assistant-core"><SparkGlyph /></span>
          </div>
          <p className="font-sans text-lg font-semibold text-white">Assistant routes</p>
          <p className="mt-1 text-sm text-white/60">Context becomes a brief.</p>
          <span className="ore-assistant-route-tag">website <HandoffGlyph /></span>
        </div>

        <div className="ore-assistant-wire ore-assistant-wire-out" aria-hidden="true"><span /></div>

        <div className="ore-assistant-fleet">
          {demoWorktrees.map((worktree) => (
            <div
              key={worktree.name}
              className={`ore-assistant-worktree ${worktree.active ? "ore-assistant-worktree-active" : ""}`}
            >
              <div className="flex items-center gap-2.5">
                <span className={worktree.active ? "text-[#ffcf7a]" : "text-white/40"}><RouteGlyph /></span>
                <span className="font-mono text-sm text-white">{worktree.name}</span>
                <span className="ore-assistant-agent-dot" aria-hidden="true" />
              </div>
              <p className="mt-2 font-mono text-[11px] text-white/50">{worktree.branch}</p>
              <p className="mt-3 text-xs text-white/70">{worktree.task}</p>
              {worktree.active ? <div className="ore-assistant-progress" aria-hidden="true"><span /></div> : null}
            </div>
          ))}
        </div>
      </div>

      <p className="ore-assistant-demo-caption">
        Example handoff <span aria-hidden="true">/</span> Each agent keeps its own context. You keep the overview.
      </p>
    </div>
  );
}

import Link from "next/link";
import {
  STELLAR_NETWORK,
  formatStroopsToXlm,
  stellarAccountUrl,
  stellarContractUrl,
  STELLAR_CONTRACT_ID,
  truncateStellarId,
} from "@/lib/stellar/config";
import type { StellarProjectView } from "@/lib/stellar/read";
import { Arrow } from "../components/atoms";
import { ArrowUpRight, StellarMark } from "../components/icons";

function formatMetric(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString(undefined, { maximumFractionDigits: 4 });
}

export function StellarProjectsView({
  projects,
}: {
  projects: StellarProjectView[];
}) {
  const acceptedBests = projects.filter(
    (p) => BigInt(p.currentBestScore) > BigInt(p.baselineScore),
  ).length;
  const openPools = projects.filter(
    (p) => !p.frozen && BigInt(p.rewardPoolBalance) > 0n,
  ).length;
  const frozen = projects.filter((p) => p.frozen).length;
  const latest = projects.reduce(
    (max, p) => (Number(p.id) > Number(max) ? Number(p.id) : max),
    0,
  );

  const stats = [
    { label: "Registry projects", value: projects.length.toLocaleString() },
    {
      label: "Accepted bests",
      value: acceptedBests.toLocaleString(),
      up: acceptedBests > 0,
    },
    { label: "Open reward pools", value: openPools.toLocaleString() },
    { label: "Frozen", value: frozen.toLocaleString() },
    { label: "Latest project", value: latest ? `#${latest}` : "-" },
    { label: "Network", value: STELLAR_NETWORK },
  ];

  return (
    <section className="relative overflow-hidden border-b border-[var(--color-line)]">
      <div className="hero-grid-bg" />
      <div className="container-page relative py-14 md:py-18">
        {/* Header */}
        <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">
          <div>
            <p className="label flex items-center gap-2">
              <StellarMark size={13} className="text-[var(--color-accent)]" />
              / registry · {STELLAR_NETWORK}
            </p>
            <h1 className="mt-5 text-balance font-serif text-[40px] leading-[1.02] font-medium tracking-[-0.01em] text-[var(--color-fg)] md:text-[56px]">
              Live projects,{" "}
              <span className="serif highlight italic">live miners.</span>
            </h1>
            <p className="mt-5 max-w-2xl font-sans text-base leading-relaxed text-[var(--color-fg-muted)]">
              Every benchmark project recorded on the OpenResearch contract, with
              its live best score, improvement threshold, and reward pool. Canonical
              state is read directly from the chain.
            </p>
            <a
              href={stellarContractUrl()}
              target="_blank"
              rel="noreferrer noopener"
              className="group mt-4 inline-flex items-center gap-2 font-mono text-xs text-[var(--color-fg-dim)] transition-colors hover:text-[var(--color-fg)]"
            >
              <span className="text-[var(--color-fg-muted)]">Contract</span>
              <code className="rounded-sm border border-[var(--color-line-2)] bg-[var(--color-bg-2)] px-2 py-0.5 transition-colors group-hover:border-[var(--color-brand-line)]">
                {truncateStellarId(STELLAR_CONTRACT_ID, 6, 6)}
              </code>
              <ArrowUpRight size={12} className="text-[var(--color-accent)]" />
            </a>
          </div>

          <div className="flex flex-wrap gap-3">
            <a href="/#get-started" className="btn-brand px-5 py-3 font-mono text-sm">
              <span className="size-2 rounded-full bg-[var(--color-brand-ink)]" />
              Publish a project
              <Arrow />
            </a>
            <a
              href="/"
              className="inline-flex items-center gap-3 rounded-sm border border-[var(--color-line-2)] bg-[var(--color-bg-soft)] px-5 py-3 font-mono text-sm text-[var(--color-fg-muted)] transition-colors hover:border-[var(--color-fg)] hover:text-[var(--color-fg)]"
            >
              Back to overview
            </a>
          </div>
        </div>

        {/* Net stats */}
        <div className="mt-12 grid grid-cols-2 border border-[var(--color-line)] bg-[var(--color-bg-soft)] md:grid-cols-3 xl:grid-cols-6">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`net-stat group relative min-h-[112px] border-[var(--color-line)] px-5 py-5 transition-colors hover:bg-[rgb(var(--ink)_/_0.02)] ${
                i % 2 === 0 ? "border-r" : ""
              } ${i < 4 ? "border-b xl:border-b-0" : ""} md:border-r md:[&:nth-child(3n)]:border-r-0 xl:[&:nth-child(3n)]:border-r xl:last:border-r-0`}
            >
              <span className="font-mono text-[10px] font-medium tracking-[0.16em] text-[var(--color-fg-muted)] uppercase">
                {stat.label}
              </span>
              <span
                className={`tick mt-3 block text-[26px] font-medium tracking-tight ${
                  stat.up ? "text-[var(--color-accent)]" : "text-[var(--color-fg)]"
                }`}
              >
                {stat.value}
              </span>
              <span className="net-stat-bar" aria-hidden="true" />
            </div>
          ))}
        </div>

        {/* Projects table */}
        <div className="projects-table mt-8 overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-bg-soft)]">
          {/* header row */}
          <div className="hidden grid-cols-[64px_minmax(0,1.4fr)_minmax(0,1fr)_120px_140px_120px_40px] gap-4 border-b border-[var(--color-line)] bg-[var(--color-bg-2)] px-5 py-3 font-mono text-[10px] font-semibold tracking-[0.14em] text-[var(--color-fg-muted)] uppercase md:grid">
            <span>ID</span>
            <span>Project · creator</span>
            <span>Best score</span>
            <span>Improvement</span>
            <span>Reward pool</span>
            <span>Status</span>
            <span />
          </div>

          {projects.map((p) => {
            const improved = BigInt(p.currentBestScore) > BigInt(p.baselineScore);
            return (
              <Link
                key={p.id}
                href={`/projects/${p.id}`}
                className="project-row relative grid grid-cols-2 gap-x-4 gap-y-2 border-b border-[var(--color-line)] px-5 py-4 last:border-b-0 md:grid-cols-[64px_minmax(0,1.4fr)_minmax(0,1fr)_120px_140px_120px_40px] md:items-center"
              >
                <span className="project-row-edge" aria-hidden="true" />

                <span className="tick text-[15px] font-medium text-[var(--color-fg)]">
                  #{p.id}
                </span>

                <span className="col-span-2 min-w-0 md:col-span-1">
                  <span className="block truncate font-sans text-[15px] font-medium text-[var(--color-fg)]">
                    Project #{p.id}
                  </span>
                  <span className="mt-0.5 block font-mono text-[11px] text-[var(--color-fg-dim)]">
                    by {truncateStellarId(p.creator, 4, 4)} · {p.direction.toLowerCase()}
                  </span>
                </span>

                <span className="min-w-0">
                  <span className="tick block text-[15px] font-medium text-[var(--color-fg)]">
                    {formatMetric(p.currentBestMetric)}
                  </span>
                  <span className="mt-0.5 block font-mono text-[11px] text-[var(--color-fg-dim)]">
                    base {formatMetric(p.baselineMetric)}
                  </span>
                </span>

                <span className="tick text-[13px] text-[var(--color-fg-muted)]">
                  {(p.minImprovementBips / 100).toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                  %
                </span>

                <span className="tick text-[13px] text-[var(--color-fg-muted)]">
                  {formatStroopsToXlm(p.rewardPoolBalance)}{" "}
                  <span className="text-[var(--color-fg-dim)]">XLM</span>
                </span>

                <span>
                  <StatusPill frozen={p.frozen} improved={improved} />
                </span>

                <span className="hidden justify-self-end text-[var(--color-fg-dim)] md:block">
                  <Arrow />
                </span>
              </Link>
            );
          })}
        </div>

        <p className="mt-4 font-mono text-[11px] text-[var(--color-fg-dim)]">
          Creator addresses link to{" "}
          <a
            href={stellarAccountUrl(projects[0]?.creator ?? STELLAR_CONTRACT_ID)}
            target="_blank"
            rel="noreferrer noopener"
            className="underline-offset-2 hover:text-[var(--color-fg)] hover:underline"
          >
            Stellar Expert
          </a>{" "}
          on project pages · reads are live from {STELLAR_NETWORK}.
        </p>
      </div>
    </section>
  );
}

function StatusPill({
  frozen,
  improved,
}: {
  frozen: boolean;
  improved: boolean;
}) {
  if (frozen) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgb(192_57_43_/_0.4)] bg-[rgb(192_57_43_/_0.08)] px-2.5 py-1 font-mono text-[10px] font-medium tracking-[0.08em] text-[var(--color-rose)] uppercase">
        Frozen
      </span>
    );
  }
  if (improved) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgb(0_167_181_/_0.4)] bg-[rgb(0_167_181_/_0.08)] px-2.5 py-1 font-mono text-[10px] font-medium tracking-[0.08em] text-[var(--color-cyan)] uppercase">
        <span className="size-1.5 rounded-full bg-[var(--color-cyan)]" />
        Advanced
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-line-2)] bg-[var(--color-bg-2)] px-2.5 py-1 font-mono text-[10px] font-medium tracking-[0.08em] text-[var(--color-fg-muted)] uppercase">
      At baseline
    </span>
  );
}

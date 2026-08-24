import Link from "next/link";
import {
  STELLAR_NETWORK,
  formatStroopsToXlm,
  stellarAccountUrl,
  stellarContractUrl,
  truncateStellarId,
} from "@/lib/stellar/config";
import type {
  StellarProjectView,
  StellarProposalView,
} from "@/lib/stellar/read";
import { CopyTextButton } from "../../components/CopyTextButton";
import { ArrowUpRight, StellarMark } from "../../components/icons";
import { ScoreProgress } from "./ScoreProgress";

const MINE_COMMAND =
  "npx skills add OpenResearchh/skill --skill autoresearch-mine";

function fmt(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString(undefined, { maximumFractionDigits: 6 });
}

function thresholdMetric(p: StellarProjectView): number {
  if (!p.metricScale) return 0;
  const raw = Number(p.improvementThreshold) / p.metricScale;
  return p.direction === "Minimize" ? -raw : raw;
}

function metricOf(rawScore: string, p: StellarProjectView): number {
  if (!p.metricScale) return 0;
  const raw = Number(rawScore) / p.metricScale;
  return p.direction === "Minimize" ? -raw : raw;
}

function improvedPercent(p: StellarProjectView): number {
  const base = Number(p.baselineScore);
  if (!base) return 0;
  return ((Number(p.currentBestScore) - base) / Math.abs(base)) * 100;
}

function safeHttpUrl(value: string): string | null {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

export function StellarProjectDetailView({
  project,
  proposals,
}: {
  project: StellarProjectView;
  proposals: StellarProposalView[];
}) {
  const repositoryUrl = safeHttpUrl(project.cloneUrl);
  const improved =
    BigInt(project.currentBestScore) > BigInt(project.baselineScore);

  const approvalsFundable =
    BigInt(project.rewardPerApproval) > 0n
      ? (
          BigInt(project.rewardPoolBalance) / BigInt(project.rewardPerApproval)
        ).toLocaleString()
      : "—";

  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b border-[var(--color-line)]">
        <div className="container-page flex items-center gap-2 py-4 font-mono text-xs text-[var(--color-fg-dim)]">
          <Link href="/projects" className="hover:text-[var(--color-fg)]">
            Projects
          </Link>
          <span>/</span>
          <span className="text-[var(--color-fg-muted)]">#{project.id}</span>
        </div>
      </div>

      {/* Header */}
      <section className="relative overflow-hidden border-b border-[var(--color-line)]">
        <div className="hero-grid-bg" />
        <div className="container-page relative py-10 md:py-12">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="label flex items-center gap-2">
              <StellarMark size={13} className="text-[var(--color-accent)]" />
              registry · {STELLAR_NETWORK}
            </span>
            <StatusPill frozen={project.frozen} improved={improved} />
            <span className="or-tag">
              <span className="dot" />
              {project.direction}
            </span>
            <span className="or-tag">
              <span className="dot" />
              epoch {project.protocolEpoch}
            </span>
          </div>

          <h1 className="mt-5 font-serif text-[38px] leading-[1.03] font-medium tracking-[-0.01em] text-[var(--color-fg)] md:text-[52px]">
            Project #{project.id}
          </h1>
          <p className="mt-3 max-w-2xl font-sans text-[15px] leading-relaxed text-[var(--color-fg-muted)]">
            Canonical protocol state read live from the OpenResearch contract.
            A candidate is accepted only when a verifier reproduces a score that
            clears the improvement threshold.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs">
            <a
              href={stellarAccountUrl(project.creator)}
              target="_blank"
              rel="noreferrer noopener"
              className="group inline-flex items-center gap-2 text-[var(--color-fg-dim)] transition-colors hover:text-[var(--color-fg)]"
            >
              <span className="text-[var(--color-fg-muted)]">creator</span>
              <code className="rounded-sm border border-[var(--color-line-2)] bg-[var(--color-bg-2)] px-2 py-0.5">
                {truncateStellarId(project.creator, 6, 6)}
              </code>
              <ArrowUpRight size={12} className="text-[var(--color-accent)]" />
            </a>
            <a
              href={stellarContractUrl()}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 text-[var(--color-accent)] hover:underline"
            >
              View contract on Stellar Expert
              <ArrowUpRight size={12} />
            </a>
          </div>
        </div>
      </section>

      {/* Body: main + sticky sidebar */}
      <div className="container-page py-10 md:py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:gap-14">
          {/* ---- Main column ---- */}
          <div className="min-w-0 space-y-12">
            {/* Score frontier */}
            <div>
              <SectionHead title="Score frontier" />
              <div className="mt-5 grid grid-cols-1 gap-px overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-line)] sm:grid-cols-3">
                <Metric
                  label="Baseline"
                  value={fmt(project.baselineMetric)}
                  sub={`raw ${project.baselineScore}`}
                />
                <Metric
                  label="Current best"
                  value={fmt(project.currentBestMetric)}
                  sub={`raw ${project.currentBestScore}`}
                  accent={improved}
                />
                <Metric
                  label={`Next (+${(project.minImprovementBips / 100).toLocaleString(undefined, { maximumFractionDigits: 2 })}%)`}
                  value={fmt(thresholdMetric(project))}
                  sub={`raw ${project.improvementThreshold}`}
                />
              </div>
              <p className="mt-3 font-mono text-[11px] text-[var(--color-fg-dim)]">
                Larger is better · metric {project.direction.toLowerCase()}d at
                scale {project.metricScale.toLocaleString()}.
              </p>

              <div className="mt-5">
                <ScoreProgress
                  baseline={project.baselineMetric}
                  best={project.currentBestMetric}
                  target={thresholdMetric(project)}
                  improvedPct={improvedPercent(project)}
                  proposals={proposals.map((pr) => ({
                    id: pr.id,
                    score:
                      pr.verifiedScore !== null
                        ? metricOf(pr.verifiedScore, project)
                        : pr.claimedScore
                          ? metricOf(pr.claimedScore, project)
                          : null,
                    status: pr.status,
                  }))}
                />
              </div>
            </div>

            {/* Start mining */}
            <div>
              <SectionHead title="Start mining this project" />
              <p className="mt-4 max-w-2xl font-sans text-[15px] leading-relaxed text-[var(--color-fg-muted)]">
                Point a coding agent at this project with the mining skill. It
                reads project #{project.id} live from the contract, produces a
                candidate that beats the current best, and submits it with stake.
                A verifier reproduces the score and, if it clears the threshold,
                the reward is paid on-chain.
              </p>

              <div className="mt-5 overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-line-2)] bg-[var(--color-bg-ink)]">
                <div className="flex items-center justify-between border-b border-[rgb(255_255_255_/_0.08)] px-4 py-2">
                  <span className="font-mono text-[10px] tracking-[0.12em] text-[rgb(255_255_255_/_0.5)] uppercase">
                    Install the mining skill
                  </span>
                  <CopyTextButton
                    text={MINE_COMMAND}
                    label="Copy mine command"
                    variant="icon"
                  />
                </div>
                <pre className="overflow-x-auto px-4 py-3.5">
                  <code className="font-mono text-[13px] text-[#f6f7fb]">
                    <span className="mr-2 select-none text-[var(--color-brand)]">
                      $
                    </span>
                    {MINE_COMMAND}
                  </code>
                </pre>
              </div>

              <ol className="mt-5 grid gap-2.5 sm:grid-cols-2">
                {[
                  `Beat the best — reach ≥ ${fmt(thresholdMetric(project))} (${(project.minImprovementBips / 100).toLocaleString(undefined, { maximumFractionDigits: 2 })}% over current).`,
                  `Stake ≥ ${formatStroopsToXlm(project.minimumStake)} XLM to submit a candidate.`,
                  "A verifier reproduces your score in a trusted environment.",
                  `On approval, stake is returned and ${formatStroopsToXlm(project.rewardPerApproval)} XLM is paid to you.`,
                ].map((step, i) => (
                  <li
                    key={i}
                    className="flex gap-3 rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-bg-soft)] p-3.5 font-sans text-[13.5px] leading-relaxed text-[var(--color-fg-muted)]"
                  >
                    <span className="tick grid size-5 shrink-0 place-items-center rounded-full bg-[var(--color-brand)] text-[11px] font-bold text-[var(--color-brand-ink)]">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            {/* Git commitments */}
            <div>
              <SectionHead title="Git commitments" />
              <p className="mt-3 max-w-2xl font-sans text-sm leading-relaxed text-[var(--color-fg-muted)]">
                The contract stores the repository URL alongside integrity
                commitments. The repository identity is a SHA-256 of{" "}
                <code className="rounded-sm bg-[var(--color-bg-2)] px-1.5 py-0.5 font-mono text-[12px]">
                  host/owner/repo
                </code>
                , allowing consumers to verify the advertised source and exact
                baseline commit.
              </p>
              <div className="mt-5 divide-y divide-[var(--color-line)] overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-bg-soft)]">
                {repositoryUrl ? (
                  <div className="flex flex-col gap-2 px-5 py-4 md:flex-row md:items-center md:justify-between">
                    <span className="font-mono text-[11px] tracking-[0.08em] text-[var(--color-fg-muted)] uppercase">
                      Repository
                    </span>
                    <a
                      href={repositoryUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex max-w-[60vw] items-center gap-1.5 truncate font-mono text-[12px] text-[var(--color-accent)] hover:underline md:max-w-[420px]"
                    >
                      <span className="truncate">{project.cloneUrl}</span>
                      <ArrowUpRight size={11} className="shrink-0" />
                    </a>
                  </div>
                ) : null}
                <HashRow label="Protocol (sha256)" value={project.protocolHash} />
                <HashRow
                  label="Repository identity (sha256)"
                  value={project.baselineRepoHash}
                />
                <HashRow label="Baseline commit" value={project.baselineCommit} />
                {project.hasCurrentBest && project.currentBestMiner ? (
                  <div className="flex flex-col gap-2 px-5 py-4 md:flex-row md:items-center md:justify-between">
                    <span className="font-mono text-[11px] tracking-[0.08em] text-[var(--color-fg-muted)] uppercase">
                      Current best miner
                    </span>
                    <a
                      href={stellarAccountUrl(project.currentBestMiner)}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-1.5 font-mono text-[13px] text-[var(--color-accent)] hover:underline"
                    >
                      {truncateStellarId(project.currentBestMiner, 6, 6)}
                      <ArrowUpRight size={11} />
                    </a>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Review queue */}
            <div>
              <div className="flex items-center justify-between">
                <SectionHead title="Active review queue" />
                <span className="font-mono text-xs text-[var(--color-fg-dim)]">
                  {proposals.length} open
                </span>
              </div>

              {proposals.length === 0 ? (
                <div className="mt-5 rounded-[var(--radius-md)] border border-dashed border-[var(--color-line)] bg-[var(--color-bg-soft)] px-6 py-9 text-center">
                  <p className="font-sans text-[15px] text-[var(--color-fg)]">
                    No proposals in review.
                  </p>
                  <p className="mt-1.5 font-sans text-sm text-[var(--color-fg-muted)]">
                    Mine this project to submit a candidate that beats the current
                    best.
                  </p>
                </div>
              ) : (
                <div className="mt-5 overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-bg-soft)]">
                  <div className="hidden grid-cols-[56px_1fr_110px_110px_110px] gap-4 border-b border-[var(--color-line)] bg-[var(--color-bg-2)] px-5 py-3 font-mono text-[10px] font-semibold tracking-[0.14em] text-[var(--color-fg-muted)] uppercase md:grid">
                    <span>ID</span>
                    <span>Miner</span>
                    <span>Claimed</span>
                    <span>Verified</span>
                    <span>Stake</span>
                  </div>
                  {proposals.map((pr) => (
                    <div
                      key={pr.id}
                      className="grid grid-cols-2 gap-x-4 gap-y-1.5 border-b border-[var(--color-line)] px-5 py-4 last:border-b-0 md:grid-cols-[56px_1fr_110px_110px_110px] md:items-center"
                    >
                      <span className="tick text-[14px] font-medium text-[var(--color-fg)]">
                        #{pr.id}
                      </span>
                      <a
                        href={stellarAccountUrl(pr.miner)}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="col-span-2 inline-flex items-center gap-1.5 font-mono text-[12px] text-[var(--color-accent)] hover:underline md:col-span-1"
                      >
                        {truncateStellarId(pr.miner, 6, 6)}
                        <ProposalStatusTag status={pr.status} />
                      </a>
                      <span className="tick text-[13px] text-[var(--color-fg-muted)]">
                        {pr.claimedScore}
                      </span>
                      <span className="tick text-[13px] text-[var(--color-fg-muted)]">
                        {pr.verifiedScore ?? "—"}
                      </span>
                      <span className="tick text-[13px] text-[var(--color-fg-muted)]">
                        {formatStroopsToXlm(pr.stake)}{" "}
                        <span className="text-[var(--color-fg-dim)]">XLM</span>
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ---- Sidebar ---- */}
          <aside className="space-y-6 lg:sticky lg:top-24 lg:h-max">
            {/* Reward card */}
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-brand-line)] bg-[var(--color-brand-subtle)] p-5">
              <p className="label text-[var(--color-amber)]">Reward available</p>
              <p className="tick mt-3 text-[36px] leading-none font-medium tracking-tight text-[var(--color-fg)]">
                {formatStroopsToXlm(project.rewardPoolBalance)}{" "}
                <span className="text-[16px] text-[var(--color-fg-muted)]">
                  XLM
                </span>
              </p>
              <p className="mt-1 font-mono text-[11px] text-[var(--color-fg-dim)]">
                remaining in the reward pool
              </p>
              <dl className="mt-4 space-y-2.5 border-t border-[var(--color-brand-line)] pt-4 font-mono text-[12px]">
                <Stat
                  k="Per approval"
                  v={`${formatStroopsToXlm(project.rewardPerApproval)} XLM`}
                />
                <Stat k="Approvals fundable" v={`≈ ${approvalsFundable}`} />
                <Stat
                  k="Minimum stake"
                  v={`${formatStroopsToXlm(project.minimumStake)} XLM`}
                />
              </dl>
            </div>

            {/* Facts card */}
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-bg-soft)] p-5">
              <p className="label-muted mb-3 text-[10px]">Details</p>
              <dl className="space-y-2.5 font-mono text-[12px]">
                <Stat k="Direction" v={project.direction} />
                <Stat k="Protocol epoch" v={String(project.protocolEpoch)} />
                <Stat k="Metric scale" v={project.metricScale.toLocaleString()} />
                <Stat
                  k="Status"
                  v={
                    project.frozen
                      ? "Frozen"
                      : improved
                        ? "Advanced"
                        : "At baseline"
                  }
                />
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-[var(--color-fg-muted)]">Reward token</dt>
                  <dd>
                    <a
                      href={stellarContractUrl(project.token)}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-1 text-[var(--color-accent)] hover:underline"
                    >
                      {truncateStellarId(project.token, 4, 4)}
                      <ArrowUpRight size={10} />
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}

function SectionHead({ title }: { title: string }) {
  return <p className="label">{title}</p>;
}

function Metric({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div className="bg-[var(--color-bg-soft)] p-5">
      <p className="label-muted text-[10px]">{label}</p>
      <p
        className={`tick mt-2 text-[28px] font-medium tracking-tight ${
          accent ? "text-[var(--color-accent)]" : "text-[var(--color-fg)]"
        }`}
      >
        {value}
      </p>
      {sub ? (
        <p className="mt-1 truncate font-mono text-[11px] text-[var(--color-fg-dim)]">
          {sub}
        </p>
      ) : null}
    </div>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-[var(--color-fg-muted)]">{k}</dt>
      <dd className="tick font-medium text-[var(--color-fg)]">{v}</dd>
    </div>
  );
}

function HashRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-2 px-5 py-4 md:flex-row md:items-center md:justify-between">
      <span className="font-mono text-[11px] tracking-[0.08em] text-[var(--color-fg-muted)] uppercase">
        {label}
      </span>
      <span className="flex items-center gap-2">
        <code className="max-w-[60vw] truncate font-mono text-[12px] text-[var(--color-fg-muted)] md:max-w-[420px]">
          {value || "—"}
        </code>
        {value ? (
          <CopyTextButton text={value} label={label} variant="icon" />
        ) : null}
      </span>
    </div>
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
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] font-medium tracking-[0.08em] uppercase ${
        improved
          ? "border-[rgb(0_167_181_/_0.4)] bg-[rgb(0_167_181_/_0.08)] text-[var(--color-cyan)]"
          : "border-[var(--color-line-2)] bg-[var(--color-bg-2)] text-[var(--color-fg-muted)]"
      }`}
    >
      <span
        className={`size-1.5 rounded-full ${improved ? "bg-[var(--color-cyan)]" : "bg-[var(--color-fg-dim)]"}`}
      />
      {improved ? "Advanced" : "At baseline"}
    </span>
  );
}

function ProposalStatusTag({
  status,
}: {
  status: StellarProposalView["status"];
}) {
  const tone =
    status === "Approved"
      ? "text-[var(--color-green)]"
      : status === "Rejected" || status === "Expired"
        ? "text-[var(--color-rose)]"
        : status === "Claimed"
          ? "text-[var(--color-cyan)]"
          : "text-[var(--color-fg-dim)]";
  return (
    <span className={`text-[10px] tracking-[0.08em] uppercase ${tone}`}>
      · {status}
    </span>
  );
}

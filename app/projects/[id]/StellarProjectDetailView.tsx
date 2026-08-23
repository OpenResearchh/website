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

function fmt(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString(undefined, { maximumFractionDigits: 6 });
}

function thresholdMetric(p: StellarProjectView): number {
  if (!p.metricScale) return 0;
  const raw = Number(p.improvementThreshold) / p.metricScale;
  return p.direction === "Minimize" ? -raw : raw;
}

export function StellarProjectDetailView({
  project,
  proposals,
}: {
  project: StellarProjectView;
  proposals: StellarProposalView[];
}) {
  const improved =
    BigInt(project.currentBestScore) > BigInt(project.baselineScore);

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
        <div className="container-page relative py-12 md:py-16">
          <div className="flex flex-wrap items-center gap-3">
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

          <h1 className="mt-6 font-serif text-[44px] leading-[1.02] font-medium tracking-[-0.01em] text-[var(--color-fg)] md:text-[64px]">
            Project #{project.id}
          </h1>
          <p className="mt-4 max-w-2xl font-sans text-base leading-relaxed text-[var(--color-fg-muted)]">
            Canonical protocol state read live from the OpenResearch contract.
            A candidate is accepted only when a verifier reproduces a score that
            clears the improvement threshold below.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 font-mono text-xs">
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

      {/* Score panel */}
      <section className="border-b border-[var(--color-line)]">
        <div className="container-page py-12 md:py-16">
          <p className="label">Score frontier</p>
          <div className="mt-6 grid grid-cols-1 gap-px overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-line)] md:grid-cols-3">
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
              label={`Next must reach (+${(project.minImprovementBips / 100).toLocaleString(undefined, { maximumFractionDigits: 2 })}%)`}
              value={fmt(thresholdMetric(project))}
              sub={`raw ${project.improvementThreshold}`}
            />
          </div>
          <p className="mt-4 font-mono text-[11px] text-[var(--color-fg-dim)]">
            Scores are oriented so larger is better; the metric is {project.direction.toLowerCase()}d
            at scale {project.metricScale.toLocaleString()}.
          </p>
        </div>
      </section>

      {/* Economics */}
      <section className="border-b border-[var(--color-line)]">
        <div className="container-page py-12 md:py-16">
          <p className="label">Economics</p>
          <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-line)] md:grid-cols-4">
            <Metric
              label="Reward pool"
              value={formatStroopsToXlm(project.rewardPoolBalance)}
              sub="XLM"
            />
            <Metric
              label="Reward / approval"
              value={formatStroopsToXlm(project.rewardPerApproval)}
              sub="XLM"
            />
            <Metric
              label="Minimum stake"
              value={formatStroopsToXlm(project.minimumStake)}
              sub="XLM"
            />
            <div className="bg-[var(--color-bg-soft)] p-5">
              <p className="label-muted text-[10px]">Reward token</p>
              <a
                href={stellarContractUrl(project.token)}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-2 inline-flex items-center gap-1.5 font-mono text-[13px] text-[var(--color-accent)] hover:underline"
              >
                {truncateStellarId(project.token, 4, 4)}
                <ArrowUpRight size={11} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Git commitments */}
      <section className="border-b border-[var(--color-line)]">
        <div className="container-page py-12 md:py-16">
          <p className="label">Git commitments</p>
          <div className="mt-6 divide-y divide-[var(--color-line)] rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-bg-soft)]">
            <HashRow label="Baseline repo hash" value={project.baselineRepoHash} />
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
      </section>

      {/* Open proposals */}
      <section className="border-b border-[var(--color-line)]">
        <div className="container-page py-12 md:py-16">
          <div className="flex items-center justify-between">
            <p className="label">Active review queue</p>
            <span className="font-mono text-xs text-[var(--color-fg-dim)]">
              {proposals.length} open
            </span>
          </div>

          {proposals.length === 0 ? (
            <div className="mt-6 rounded-[var(--radius-md)] border border-dashed border-[var(--color-line)] bg-[var(--color-bg-soft)] px-6 py-10 text-center">
              <p className="font-sans text-[15px] text-[var(--color-fg)]">
                No proposals in review.
              </p>
              <p className="mt-1.5 font-sans text-sm text-[var(--color-fg-muted)]">
                Mine this project to submit a candidate that beats the current best.
              </p>
            </div>
          ) : (
            <div className="mt-6 overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-bg-soft)]">
              <div className="hidden grid-cols-[56px_minmax(0,1fr)_120px_120px_120px] gap-4 border-b border-[var(--color-line)] bg-[var(--color-bg-2)] px-5 py-3 font-mono text-[10px] font-semibold tracking-[0.14em] text-[var(--color-fg-muted)] uppercase md:grid">
                <span>ID</span>
                <span>Miner</span>
                <span>Claimed</span>
                <span>Verified</span>
                <span>Stake</span>
              </div>
              {proposals.map((pr) => (
                <div
                  key={pr.id}
                  className="grid grid-cols-2 gap-x-4 gap-y-1.5 border-b border-[var(--color-line)] px-5 py-4 last:border-b-0 md:grid-cols-[56px_minmax(0,1fr)_120px_120px_120px] md:items-center"
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
      </section>
    </>
  );
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

/**
 * Read-only Soroban data adapter for the OpenResearch contract.
 *
 * Server-only (imported only by server components). Uses the vendored
 * @openresearch/stellar-client to read canonical project state from the Stellar
 * contract and maps it into serializable views the UI can consume. All bigints
 * are returned as decimal strings.
 */
import {
  formatCommitId,
  generated,
  improvementThreshold,
} from "@openresearch/stellar-client";
import {
  STELLAR_CONTRACT_ID,
  STELLAR_NETWORK_PASSPHRASE,
  STELLAR_RPC_URL,
  stellarContractUrl,
} from "./config";

export interface StellarProjectView {
  id: string;
  creator: string;
  direction: "Maximize" | "Minimize";
  frozen: boolean;
  protocolEpoch: number;
  metricScale: number;
  minImprovementBips: number;
  /** raw on-chain scores (larger-is-better), decimal strings */
  baselineScore: string;
  currentBestScore: string;
  improvementThreshold: string;
  /** human-readable metric derived from score / scale (sign per direction) */
  baselineMetric: number;
  currentBestMetric: number;
  hasCurrentBest: boolean;
  currentBestMiner: string | null;
  token: string;
  /** stroops (1 XLM = 10,000,000 stroops), decimal strings */
  rewardPoolBalance: string;
  rewardPerApproval: string;
  minimumStake: string;
  /** integrity commitments (hex) */
  baselineRepoHash: string;
  baselineCommit: string;
  explorerUrl: string;
}

let cachedClient: InstanceType<typeof generated.Client> | null = null;

function getClient(): InstanceType<typeof generated.Client> {
  if (!cachedClient) {
    cachedClient = new generated.Client({
      contractId: STELLAR_CONTRACT_ID,
      networkPassphrase: STELLAR_NETWORK_PASSPHRASE,
      rpcUrl: STELLAR_RPC_URL,
    });
  }
  return cachedClient;
}

function toHex(buf: unknown): string {
  const b = buf as { toString?: (enc: string) => string } | undefined;
  return typeof b?.toString === "function" ? b.toString("hex") : "";
}

function metricFromScore(
  score: bigint,
  scale: number,
  direction: "Maximize" | "Minimize",
): number {
  if (!scale) return 0;
  const magnitude = Number(score) / scale;
  return direction === "Minimize" ? -magnitude : magnitude;
}

function mapProject(p: generated.Project): StellarProjectView {
  const direction = (p.direction?.tag ?? "Maximize") as
    | "Maximize"
    | "Minimize";
  const scale = Number(p.metric_scale);
  return {
    id: p.id.toString(),
    creator: p.creator,
    direction,
    frozen: Boolean(p.frozen),
    protocolEpoch: Number(p.protocol_epoch),
    metricScale: scale,
    minImprovementBips: Number(p.min_improvement_bips),
    baselineScore: p.baseline_score.toString(),
    currentBestScore: p.current_best_score.toString(),
    improvementThreshold: improvementThreshold(
      p.current_best_score,
      Number(p.min_improvement_bips),
    ).toString(),
    baselineMetric: metricFromScore(p.baseline_score, scale, direction),
    currentBestMetric: metricFromScore(p.current_best_score, scale, direction),
    hasCurrentBest: Boolean(p.current_best?.present),
    currentBestMiner: p.current_best_miner ?? null,
    token: p.token,
    rewardPoolBalance: p.reward_pool_balance.toString(),
    rewardPerApproval: p.reward_per_approval.toString(),
    minimumStake: p.minimum_stake.toString(),
    baselineRepoHash: toHex(p.baseline?.repo),
    baselineCommit: p.baseline?.commit ? formatCommitId(p.baseline.commit) : "",
    explorerUrl: stellarContractUrl(),
  };
}

/** Highest assigned project id + 1. Project ids run 1..(next-1). */
export async function getStellarNextProjectId(): Promise<bigint> {
  const tx = await getClient().next_project_id();
  return tx.result as bigint;
}

export async function getStellarProjectCount(): Promise<number> {
  const next = await getStellarNextProjectId();
  return Math.max(0, Number(next) - 1);
}

export async function getStellarProject(
  id: bigint | number,
): Promise<StellarProjectView | null> {
  try {
    const tx = await getClient().get_project({ project_id: BigInt(id) });
    const res = tx.result;
    if (res.isErr()) return null;
    return mapProject(res.unwrap());
  } catch {
    return null;
  }
}

/**
 * List projects by iterating known ids. The contract exposes no unbounded list
 * method by design; for large registries switch to `project_created` event
 * indexing. `limit` caps the ids fetched (newest-first).
 */
export async function listStellarProjects(
  limit = 100,
): Promise<StellarProjectView[]> {
  const count = await getStellarProjectCount();
  if (count <= 0) return [];
  const ids: bigint[] = [];
  for (let id = BigInt(count); id >= 1n && ids.length < limit; id--) {
    ids.push(id);
  }
  const results = await Promise.all(ids.map((id) => getStellarProject(id)));
  return results.filter((p): p is StellarProjectView => p !== null);
}

export interface StellarProposalView {
  id: string;
  projectId: string;
  miner: string;
  rewardRecipient: string;
  status: "Submitted" | "Claimed" | "Approved" | "Rejected" | "Released" | "Expired";
  claimedScore: string;
  verifiedScore: string | null;
  stake: string;
  reviewer: string | null;
  reviewLockUntil: string;
  protocolEpoch: number;
  candidateCommit: string;
}

function mapProposal(p: generated.Proposal): StellarProposalView {
  return {
    id: p.id.toString(),
    projectId: p.project_id.toString(),
    miner: p.miner,
    rewardRecipient: p.reward_recipient,
    status: (p.status?.tag ?? "Submitted") as StellarProposalView["status"],
    claimedScore: p.claimed_score.toString(),
    verifiedScore:
      p.verified_score === undefined || p.verified_score === null
        ? null
        : p.verified_score.toString(),
    stake: p.stake.toString(),
    reviewer: p.reviewer ?? null,
    reviewLockUntil: p.review_lock_until.toString(),
    protocolEpoch: Number(p.protocol_epoch),
    candidateCommit: p.candidate?.commit
      ? formatCommitId(p.candidate.commit)
      : "",
  };
}

export async function getStellarProposal(
  id: bigint | number,
): Promise<StellarProposalView | null> {
  try {
    const tx = await getClient().get_proposal({ proposal_id: BigInt(id) });
    const res = tx.result;
    if (res.isErr()) return null;
    return mapProposal(res.unwrap());
  } catch {
    return null;
  }
}

/** Bounded active-review queue for a project (Submitted/Claimed proposals). */
export async function getStellarOpenProposals(
  projectId: bigint | number,
): Promise<StellarProposalView[]> {
  try {
    const tx = await getClient().get_open_proposals({
      project_id: BigInt(projectId),
    });
    const res = tx.result;
    if (res.isErr()) return [];
    const ids = res.unwrap();
    const proposals = await Promise.all(
      ids.map((id) => getStellarProposal(id)),
    );
    return proposals.filter((p): p is StellarProposalView => p !== null);
  } catch {
    return [];
  }
}

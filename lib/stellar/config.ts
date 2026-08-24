/**
 * Stellar / Soroban deployment configuration (single source of truth).
 *
 * Canonical protocol state and settlement live in the OpenResearch Soroban
 * contract on Stellar Mainnet. These public values can be overridden per
 * environment via NEXT_PUBLIC_* vars.
 */

/**
 * Which chain backs the live data surfaces.
 */
export const DATA_SOURCE = (
  process.env.NEXT_PUBLIC_DATA_SOURCE ?? "stellar"
).toLowerCase();
export const USE_STELLAR_DATA = DATA_SOURCE === "stellar";

export const STELLAR_NETWORK =
  process.env.NEXT_PUBLIC_STELLAR_NETWORK ?? "mainnet";

/** Stellar Expert calls Mainnet `public` in explorer URLs. */
export const STELLAR_EXPLORER_NETWORK =
  process.env.NEXT_PUBLIC_STELLAR_EXPLORER_NETWORK ?? "public";

export const STELLAR_CONTRACT_ID =
  process.env.NEXT_PUBLIC_STELLAR_CONTRACT_ID ??
  "CDGF3SS27QEF4LDV63MSMKVOXZOZM4OTF2BPV5QK3PQEAEMOITUVDMDH";

export const STELLAR_RPC_URL =
  process.env.NEXT_PUBLIC_STELLAR_RPC_URL ??
  "https://soroban-rpc.mainnet.stellar.gateway.fm";

export const STELLAR_NETWORK_PASSPHRASE =
  process.env.NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE ??
  "Public Global Stellar Network ; September 2015";

/** stellar.expert explorer link for a contract on the active network. */
export function stellarContractUrl(
  contractId: string = STELLAR_CONTRACT_ID,
): string {
  return `https://stellar.expert/explorer/${STELLAR_EXPLORER_NETWORK}/contract/${contractId}`;
}

/** stellar.expert explorer link for an account/address on the active network. */
export function stellarAccountUrl(address: string): string {
  return `https://stellar.expert/explorer/${STELLAR_EXPLORER_NETWORK}/account/${address}`;
}

/** Middle-truncate a Stellar address/contract id for compact display. */
export function truncateStellarId(id: string, lead = 4, tail = 4): string {
  if (id.length <= lead + tail + 1) return id;
  return `${id.slice(0, lead)}…${id.slice(-tail)}`;
}

/** 1 XLM = 10,000,000 stroops. Format a stroop amount (decimal string) as XLM. */
export function formatStroopsToXlm(stroops: string, maxFractionDigits = 4): string {
  let v: bigint;
  try {
    v = BigInt(stroops);
  } catch {
    return "0";
  }
  const negative = v < 0n;
  if (negative) v = -v;
  const whole = v / 10_000_000n;
  const frac = v % 10_000_000n;
  const fracStr = frac
    .toString()
    .padStart(7, "0")
    .slice(0, maxFractionDigits)
    .replace(/0+$/, "");
  const num = `${whole.toLocaleString()}${fracStr ? `.${fracStr}` : ""}`;
  return negative ? `-${num}` : num;
}

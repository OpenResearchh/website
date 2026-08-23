/**
 * Stellar / Soroban deployment configuration (single source of truth).
 *
 * Canonical protocol state and settlement live in the OpenResearch Soroban
 * contract on Stellar. These values come from the integration handoff and can
 * be overridden per-environment via NEXT_PUBLIC_* vars.
 *
 * NOTE: the live projects UI still reads from the existing program client; this
 * module currently powers the contract link surfaced in the footer and is the
 * home for the Soroban data layer as it comes online.
 */

/**
 * Which chain backs the live data surfaces. Defaults to the existing program
 * client; set NEXT_PUBLIC_DATA_SOURCE=stellar to read from the Soroban contract.
 */
export const DATA_SOURCE = (
  process.env.NEXT_PUBLIC_DATA_SOURCE ?? "solana"
).toLowerCase();
export const USE_STELLAR_DATA = DATA_SOURCE === "stellar";

export const STELLAR_NETWORK =
  process.env.NEXT_PUBLIC_STELLAR_NETWORK ?? "testnet";

export const STELLAR_CONTRACT_ID =
  process.env.NEXT_PUBLIC_STELLAR_CONTRACT_ID ??
  "CD5EKGUD3Y72UGV2VGQTLUTLOAIGZC6X3LFHARXX2A2D6LBR4IWXAWIQ";

export const STELLAR_TOKEN_CONTRACT_ID =
  process.env.NEXT_PUBLIC_STELLAR_TOKEN_CONTRACT_ID ??
  "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC";

export const STELLAR_RPC_URL =
  process.env.NEXT_PUBLIC_STELLAR_RPC_URL ??
  "https://soroban-testnet.stellar.org";

export const STELLAR_NETWORK_PASSPHRASE =
  process.env.NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE ??
  "Test SDF Network ; September 2015";

/** stellar.expert explorer link for a contract on the active network. */
export function stellarContractUrl(
  contractId: string = STELLAR_CONTRACT_ID,
): string {
  return `https://stellar.expert/explorer/${STELLAR_NETWORK}/contract/${contractId}`;
}

/** Middle-truncate a Stellar address/contract id for compact display. */
export function truncateStellarId(id: string, lead = 4, tail = 4): string {
  if (id.length <= lead + tail + 1) return id;
  return `${id.slice(0, lead)}…${id.slice(-tail)}`;
}

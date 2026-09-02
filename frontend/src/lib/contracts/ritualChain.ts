/**
 * Canonical Ritual Chain (Chain ID: 1979) System Contracts and Precompile Map.
 * Matches `contracts/ritual/RitualChain.sol`.
 */
export const RITUAL_CHAIN_CONFIG = {
  chainId: 1979,
  name: "Ritual Chain Testnet",
  currency: "RITUAL",
  rpcUrl: process.env.NEXT_PUBLIC_RITUAL_RPC_URL || "https://rpc.testnet.ritualfoundation.org",
  explorerUrl: process.env.NEXT_PUBLIC_RITUAL_EXPLORER_URL || "https://explorer.testnet.ritualfoundation.org",
  defaultBlockTimeMs: Number(process.env.NEXT_PUBLIC_RITUAL_BLOCK_TIME_MS || 195),
  predictContractAddress: process.env.NEXT_PUBLIC_RITUAL_PREDICT_ADDRESS || "",
  
  // Canonical Precompiles & System Contracts
  precompiles: {
    http: "0x0000000000000000000000000000000000000801",
    jq: "0x0000000000000000000000000000000000000803",
    scheduler: "0x56e776BAE2DD60664b69Bd5F865F1180ffB7D58B",
    ritualWallet: "0x532F0dF0896F353d8C3DD8cc134e8129DA2a3948",
    teeRegistry: "0x9644e8562cE0Fe12b4deeC4163c064A8862Bf47F",
  },
  
  constants: {
    maxAttempts: 3,
    retryIntervalBlocks: 200,
    resolveGasLimit: 2_000_000,
    minBettingSeconds: 30,
    minResolveDelaySeconds: 15,
  }
} as const;

export enum MarketState {
  Open = 0,      // accepting bets
  Closed = 1,    // betting window over, waiting for scheduled wake-up
  Resolving = 2, // resolution attempt in progress / retries pending
  Resolved = 3,  // outcome final, winners can claim
  Invalid = 4,   // oracle failed or 0 winners, everyone can refund
}

export enum Comparator {
  GT = 0,  // observed > target
  GTE = 1, // observed >= target
  LT = 2,  // observed < target
  LTE = 3, // observed <= target
}

export enum Outcome {
  Unresolved = 0,
  Yes = 1,
  No = 2,
}

export interface Market {
  id: number;
  creator: string;
  question: string;
  category: "Crypto" | "AI & LLMs" | "DeFi" | "Ritual Ecosystem" | "Macro";
  oracleUrl: string;
  jsonPath: string;
  target: number;
  comparator: Comparator;
  closeBlock: number;
  resolveBlock: number;
  scheduleId: number;
  totalYes: string; // stored as string for precision (in wei / ether)
  totalNo: string;
  state: MarketState;
  outcome: Outcome;
  attempts: number;
  observedValue?: number;
  invalidReason?: string;
  createdAtBlock: number;
  createdAtTimestamp: number;
  executorAddress?: string;
}

export interface UserStakeInfo {
  marketId: number;
  yesStake: string; // in RITUAL (ether units)
  noStake: string;
  settled: boolean;
  claimable: string;
}

export interface NewMarketInput {
  question: string;
  category: "Crypto" | "AI & LLMs" | "DeFi" | "Ritual Ecosystem" | "Macro";
  oracleUrl: string;
  jsonPath: string;
  target: number;
  comparator: Comparator;
  bettingSeconds: number;
  resolveDelaySeconds: number;
}

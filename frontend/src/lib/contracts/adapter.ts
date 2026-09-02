import { Market, NewMarketInput, UserStakeInfo, MarketState, Outcome } from "../types";
import { INITIAL_MOCK_MARKETS, INITIAL_USER_STAKES } from "../mockData";
import { RITUAL_CHAIN_CONFIG } from "./ritualChain";

/**
 * Contract Adapter Interface
 * Provides seamless bridge between local/mock prediction data and live Ritual Chain contract.
 */
class ContractAdapter {
  private markets: Market[] = [...INITIAL_MOCK_MARKETS];
  private userStakes: Map<number, UserStakeInfo> = new Map();
  private userAddress = "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7"; // simulated user
  private currentBlock = 1_288_450;

  constructor() {
    INITIAL_USER_STAKES.forEach((stake) => {
      this.userStakes.set(stake.marketId, stake);
    });
  }

  public isLiveContractConfigured(): boolean {
    return (
      Boolean(RITUAL_CHAIN_CONFIG.predictContractAddress) &&
      RITUAL_CHAIN_CONFIG.predictContractAddress.startsWith("0x") &&
      RITUAL_CHAIN_CONFIG.predictContractAddress.length === 42
    );
  }

  public getCurrentBlock(): number {
    return this.currentBlock;
  }

  public getUserAddress(): string {
    return this.userAddress;
  }

  public setUserAddress(address: string) {
    this.userAddress = address;
  }

  public async getMarkets(): Promise<Market[]> {
    if (this.isLiveContractConfigured()) {
      // NOTE: When contract is deployed, plug in viem or ethers public client here:
      // const client = createPublicClient({ chain: ritualTestnet, transport: http() });
      // return client.readContract({ address: RITUAL_CHAIN_CONFIG.predictContractAddress, abi: RITUAL_PREDICT_ABI, functionName: 'getMarkets' });
    }
    return Promise.resolve([...this.markets]);
  }

  public async getMarket(id: number): Promise<Market | undefined> {
    const market = this.markets.find((m) => m.id === id);
    return Promise.resolve(market ? { ...market } : undefined);
  }

  public async getUserStakes(): Promise<UserStakeInfo[]> {
    return Promise.resolve(Array.from(this.userStakes.values()));
  }

  public async getStakesOf(marketId: number): Promise<UserStakeInfo> {
    const existing = this.userStakes.get(marketId);
    if (existing) return Promise.resolve({ ...existing });
    return Promise.resolve({
      marketId,
      yesStake: "0.00",
      noStake: "0.00",
      settled: false,
      claimable: "0.00",
    });
  }

  public async placeBet(
    marketId: number,
    isYes: boolean,
    amount: string
  ): Promise<{ success: boolean; txHash?: string }> {
    const marketIndex = this.markets.findIndex((m) => m.id === marketId);
    if (marketIndex === -1) throw new Error("Market not found");

    const market = this.markets[marketIndex];
    if (market.state !== MarketState.Open) throw new Error("Market is closed for betting");

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) throw new Error("Invalid stake amount");

    // Update pool
    if (isYes) {
      const current = parseFloat(market.totalYes) || 0;
      market.totalYes = (current + parsedAmount).toFixed(2);
    } else {
      const current = parseFloat(market.totalNo) || 0;
      market.totalNo = (current + parsedAmount).toFixed(2);
    }

    // Update user stake
    let userStake = this.userStakes.get(marketId);
    if (!userStake) {
      userStake = {
        marketId,
        yesStake: "0.00",
        noStake: "0.00",
        settled: false,
        claimable: "0.00",
      };
      this.userStakes.set(marketId, userStake);
    }

    if (isYes) {
      userStake.yesStake = (parseFloat(userStake.yesStake) + parsedAmount).toFixed(2);
    } else {
      userStake.noStake = (parseFloat(userStake.noStake) + parsedAmount).toFixed(2);
    }

    return {
      success: true,
      txHash: "Simulated on Ritual Local State (Pending contract deployment)",
    };
  }

  public async createMarket(
    input: NewMarketInput
  ): Promise<{ success: boolean; marketId: number }> {
    const nextId = this.markets.length + 1;
    const blockTimeMs = RITUAL_CHAIN_CONFIG.defaultBlockTimeMs;
    const bettingBlocks = Math.max(1, Math.floor((input.bettingSeconds * 1000) / blockTimeMs));
    const delayBlocks = Math.max(1, Math.floor((input.resolveDelaySeconds * 1000) / blockTimeMs));

    const closeBlock = this.currentBlock + bettingBlocks;
    const resolveBlock = closeBlock + delayBlocks;
    const scheduleId = 2000 + nextId;

    const newMarket: Market = {
      id: nextId,
      creator: this.userAddress,
      question: input.question,
      category: input.category,
      oracleUrl: input.oracleUrl,
      jsonPath: input.jsonPath,
      target: input.target,
      comparator: input.comparator,
      closeBlock,
      resolveBlock,
      scheduleId,
      totalYes: "0.00",
      totalNo: "0.00",
      state: MarketState.Open,
      outcome: Outcome.Unresolved,
      attempts: 0,
      createdAtBlock: this.currentBlock,
      createdAtTimestamp: Date.now(),
    };

    this.markets.unshift(newMarket);
    return { success: true, marketId: nextId };
  }

  public async claimWinnings(
    marketId: number
  ): Promise<{ success: boolean; amount: string }> {
    const userStake = this.userStakes.get(marketId);
    if (!userStake) throw new Error("No stakes found");
    if (userStake.settled) throw new Error("Already claimed");

    const amount = userStake.claimable;
    userStake.settled = true;
    userStake.claimable = "0.00";

    return { success: true, amount };
  }

  public async claimRefund(
    marketId: number
  ): Promise<{ success: boolean; amount: string }> {
    const userStake = this.userStakes.get(marketId);
    if (!userStake) throw new Error("No stakes found");
    if (userStake.settled) throw new Error("Already claimed");

    const amount = (
      parseFloat(userStake.yesStake) + parseFloat(userStake.noStake)
    ).toFixed(2);
    userStake.settled = true;
    userStake.claimable = "0.00";

    return { success: true, amount };
  }
}

export const contractAdapter = new ContractAdapter();

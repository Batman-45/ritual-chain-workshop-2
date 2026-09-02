"use client";

import React from "react";
import {
  Wallet,
  Coins,
  Sparkles,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Clock,
  RotateCcw,
} from "lucide-react";
import { Market, UserStakeInfo, MarketState, Outcome } from "../lib/types";
import { formatRitual, stateToBadge } from "../lib/formatters";

interface UserPortfolioProps {
  userStakes: UserStakeInfo[];
  markets: Market[];
  onClaimWinnings: (marketId: number) => Promise<void>;
  onClaimRefund: (marketId: number) => Promise<void>;
  onViewMarket: (market: Market) => void;
  onBackToDashboard: () => void;
}

export const UserPortfolio: React.FC<UserPortfolioProps> = ({
  userStakes,
  markets,
  onClaimWinnings,
  onClaimRefund,
  onViewMarket,
  onBackToDashboard,
}) => {
  const activeStakes = userStakes.filter(
    (s) => parseFloat(s.yesStake) > 0 || parseFloat(s.noStake) > 0
  );

  const totalStaked = activeStakes.reduce(
    (acc, s) => acc + (parseFloat(s.yesStake) || 0) + (parseFloat(s.noStake) || 0),
    0
  );

  const totalClaimable = activeStakes.reduce(
    (acc, s) => acc + (s.settled ? 0 : parseFloat(s.claimable) || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-white/10 bg-card-glass p-6 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-purple-400" />
            <h2 className="text-xl font-bold text-white">Your Prediction Portfolio</h2>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Track your open stakes, autonomous resolution outcomes, and claim rewards.
          </p>
        </div>

        <button
          onClick={onBackToDashboard}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition-all self-start sm:self-auto"
        >
          ← Back to All Markets
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <span className="text-xs text-slate-400">Total Wagered</span>
          <div className="mt-1 flex items-baseline gap-1.5 font-mono text-2xl font-bold text-white">
            {formatRitual(totalStaked)}
            <span className="text-xs text-purple-400">RITUAL</span>
          </div>
          <span className="text-[11px] text-slate-500">Across {activeStakes.length} markets</span>
        </div>

        <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-4 shadow-glow-cyan">
          <span className="text-xs font-semibold text-cyan-300">Total Claimable Rewards</span>
          <div className="mt-1 flex items-baseline gap-1.5 font-mono text-2xl font-bold text-cyan-300">
            {formatRitual(totalClaimable)}
            <span className="text-xs text-cyan-400">RITUAL</span>
          </div>
          <span className="text-[11px] text-cyan-200/70">Winnings & refunds ready for withdrawal</span>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <span className="text-xs text-slate-400">Positions Count</span>
          <div className="mt-1 font-mono text-2xl font-bold text-slate-200">
            {activeStakes.length}
          </div>
          <span className="text-[11px] text-slate-500">Active and settled markets</span>
        </div>
      </div>

      {/* Staked Positions List */}
      <div className="rounded-2xl border border-white/10 bg-card-glass backdrop-blur-xl overflow-hidden">
        <div className="border-b border-white/10 p-4 sm:p-5">
          <h3 className="text-sm font-bold text-white">Your Market Positions</h3>
        </div>

        {activeStakes.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            <p className="text-sm">You have not placed any stakes yet.</p>
            <button
              onClick={onBackToDashboard}
              className="mt-3 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white shadow-glow hover:bg-purple-500 transition-all"
            >
              Explore Open Markets
            </button>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {activeStakes.map((stake) => {
              const market = markets.find((m) => m.id === stake.marketId);
              if (!market) return null;

              const badge = stateToBadge(market.state);
              const hasClaimable = parseFloat(stake.claimable) > 0 && !stake.settled;

              return (
                <div
                  key={stake.marketId}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 sm:p-5 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${badge.bg} ${badge.text} ${badge.border}`}
                      >
                        {badge.label}
                      </span>
                      <span className="font-mono text-xs text-slate-500">#{market.id}</span>
                      <span className="text-xs text-slate-400">• {market.category}</span>
                    </div>

                    <h4
                      onClick={() => onViewMarket(market)}
                      className="text-sm font-semibold text-white hover:text-purple-300 cursor-pointer transition-colors"
                    >
                      {market.question}
                    </h4>

                    {/* Stakes Breakdown */}
                    <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-400">
                      {parseFloat(stake.yesStake) > 0 && (
                        <div className="flex items-center gap-1 text-emerald-400">
                          <TrendingUp className="h-3 w-3" />
                          <span>YES Stake: <strong className="text-white">{stake.yesStake} RITUAL</strong></span>
                        </div>
                      )}
                      {parseFloat(stake.noStake) > 0 && (
                        <div className="flex items-center gap-1 text-rose-400">
                          <TrendingDown className="h-3 w-3" />
                          <span>NO Stake: <strong className="text-white">{stake.noStake} RITUAL</strong></span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions & Claim */}
                  <div className="flex items-center gap-3 self-end sm:self-center">
                    {stake.settled ? (
                      <span className="flex items-center gap-1 text-xs text-slate-500 font-mono">
                        <CheckCircle className="h-3.5 w-3.5 text-slate-400" />
                        Settled & Claimed
                      </span>
                    ) : hasClaimable ? (
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <span className="text-[10px] uppercase font-bold text-cyan-400 block">
                            {market.state === MarketState.Resolved ? "Winnings" : "Refund"}
                          </span>
                          <span className="font-mono text-xs font-bold text-white">
                            {stake.claimable} RITUAL
                          </span>
                        </div>
                        <button
                          onClick={() =>
                            market.state === MarketState.Resolved
                              ? onClaimWinnings(market.id)
                              : onClaimRefund(market.id)
                          }
                          className="rounded-xl bg-cyan-500 px-3.5 py-2 text-xs font-bold text-slate-950 shadow-glow-cyan hover:bg-cyan-400 active:scale-95 transition-all"
                        >
                          {market.state === MarketState.Resolved ? "Claim Reward" : "Claim Refund"}
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => onViewMarket(market)}
                        className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/10 hover:text-white transition-all"
                      >
                        View Market
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

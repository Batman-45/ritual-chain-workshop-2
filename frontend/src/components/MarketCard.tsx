"use client";

import React from "react";
import {
  Clock,
  ExternalLink,
  HelpCircle,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import { Market, MarketState, Outcome, UserStakeInfo } from "../lib/types";
import {
  calculateOdds,
  comparatorToSymbol,
  formatRitual,
  stateToBadge,
  blocksToSeconds,
  formatTimeRemaining,
} from "../lib/formatters";

interface MarketCardProps {
  market: Market;
  currentBlock: number;
  userStake?: UserStakeInfo;
  onBetClick: (market: Market, isYes: boolean) => void;
  onInspectClick: (market: Market) => void;
  onClaimClick: (market: Market) => void;
}

export const MarketCard: React.FC<MarketCardProps> = ({
  market,
  currentBlock,
  userStake,
  onBetClick,
  onInspectClick,
  onClaimClick,
}) => {
  const badge = stateToBadge(market.state);
  const odds = calculateOdds(market.totalYes, market.totalNo);

  const blocksUntilClose = Math.max(0, market.closeBlock - currentBlock);
  const secondsUntilClose = blocksToSeconds(blocksUntilClose);

  const blocksUntilResolve = Math.max(0, market.resolveBlock - currentBlock);
  const secondsUntilResolve = blocksToSeconds(blocksUntilResolve);

  const hasClaimable = userStake && parseFloat(userStake.claimable) > 0 && !userStake.settled;

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-card-glass p-5 backdrop-blur-xl transition-all hover:border-purple-500/40 hover:shadow-glow">
      {/* Header: Status, ID & Category */}
      <div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide ${badge.bg} ${badge.text} ${badge.border}`}
            >
              {market.state === MarketState.Open && (
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              )}
              {market.state === MarketState.Resolving && (
                <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-ping" />
              )}
              {badge.label}
              {market.state === MarketState.Resolving && (
                <span className="text-[10px] text-purple-300/80 font-mono">
                  (Attempt {market.attempts}/3)
                </span>
              )}
            </span>
            <span className="rounded-md bg-white/5 px-2 py-0.5 text-[11px] font-medium text-slate-400">
              {market.category}
            </span>
          </div>
          <span className="font-mono text-xs text-slate-500">#{market.id}</span>
        </div>

        {/* Question */}
        <h3 className="mt-3 text-base font-semibold leading-snug text-white group-hover:text-purple-200 transition-colors line-clamp-2">
          {market.question}
        </h3>

        {/* Target Value & Oracle Rule */}
        <div className="mt-3 rounded-xl border border-white/5 bg-white/[0.02] p-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Resolution Rule:</span>
            <div className="flex items-center gap-1 font-mono font-bold text-slate-200">
              <span className="text-purple-400">Observed</span>
              <span className="text-cyan-400">{comparatorToSymbol(market.comparator)}</span>
              <span className="text-white">{market.target.toLocaleString()}</span>
            </div>
          </div>

          {/* If Resolved or Invalid, show Observed Value or Reason */}
          {market.state === MarketState.Resolved && (
            <div className="mt-2 flex items-center justify-between border-t border-white/5 pt-2 text-xs">
              <span className="text-slate-400">Observed Oracle Output:</span>
              <span className="font-mono font-bold text-cyan-400">
                {market.observedValue?.toLocaleString()} ({market.outcome === Outcome.Yes ? "YES Won" : "NO Won"})
              </span>
            </div>
          )}

          {market.state === MarketState.Invalid && market.invalidReason && (
            <div className="mt-2 rounded bg-rose-500/10 p-1.5 text-[11px] text-rose-300 border border-rose-500/20">
              <span className="font-semibold">Settlement Note: </span>
              {market.invalidReason}
            </div>
          )}
        </div>

        {/* Odds & Stake Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs font-medium">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <span>YES</span>
              <span>{odds.yesPercent}%</span>
              <span className="text-[10px] text-slate-400 font-normal">
                ({odds.yesMultiplier}x)
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-rose-400 font-semibold">
              <span className="text-[10px] text-slate-400 font-normal">
                ({odds.noMultiplier}x)
              </span>
              <span>{odds.noPercent}%</span>
              <span>NO</span>
            </div>
          </div>

          {/* Bar */}
          <div className="mt-1.5 flex h-2.5 w-full overflow-hidden rounded-full bg-white/10 p-[1px]">
            <div
              className="rounded-l-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
              style={{ width: `${odds.yesPercent}%` }}
            />
            <div
              className="rounded-r-full bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-500"
              style={{ width: `${odds.noPercent}%` }}
            />
          </div>

          {/* Total Stakes */}
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
            <span>
              YES: <strong className="text-slate-200">{formatRitual(market.totalYes)}</strong> RITUAL
            </span>
            <span>
              NO: <strong className="text-slate-200">{formatRitual(market.totalNo)}</strong> RITUAL
            </span>
          </div>
        </div>
      </div>

      {/* Footer: Timeline & Actions */}
      <div className="mt-5 border-t border-white/5 pt-4">
        {/* Timeline Info */}
        <div className="mb-3 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-purple-400" />
            {market.state === MarketState.Open ? (
              <span>Closes in {formatTimeRemaining(secondsUntilClose)}</span>
            ) : market.state === MarketState.Closed ? (
              <span>Resolving in {formatTimeRemaining(secondsUntilResolve)}</span>
            ) : (
              <span>Block #{market.resolveBlock.toLocaleString()}</span>
            )}
          </div>

          <button
            onClick={() => onInspectClick(market)}
            className="flex items-center gap-0.5 text-purple-400 hover:text-purple-300 hover:underline transition-colors"
          >
            <span>Oracle Info</span>
            <ArrowUpRight className="h-3 w-3" />
          </button>
        </div>

        {/* Claim Banner if user has claimable rewards */}
        {hasClaimable && (
          <div className="mb-3 flex items-center justify-between rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-2.5">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400">
                {market.state === MarketState.Resolved ? "Winnings Available" : "Refund Available"}
              </span>
              <div className="font-mono text-xs font-bold text-white">
                {userStake?.claimable} RITUAL
              </div>
            </div>
            <button
              onClick={() => onClaimClick(market)}
              className="rounded-lg bg-cyan-500 px-3 py-1.5 text-xs font-bold text-slate-950 shadow-glow-cyan hover:bg-cyan-400 active:scale-95 transition-all"
            >
              {market.state === MarketState.Resolved ? "Claim Reward" : "Claim Refund"}
            </button>
          </div>
        )}

        {/* Betting Actions (If Open) */}
        {market.state === MarketState.Open ? (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onBetClick(market, true)}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 py-2.5 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/60 active:scale-[0.98] transition-all"
            >
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Bet YES</span>
            </button>
            <button
              onClick={() => onBetClick(market, false)}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 py-2.5 text-xs font-bold text-rose-400 hover:bg-rose-500/20 hover:border-rose-500/60 active:scale-[0.98] transition-all"
            >
              <TrendingDown className="h-3.5 w-3.5" />
              <span>Bet NO</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => onInspectClick(market)}
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-all"
          >
            View Settlement Telemetry
          </button>
        )}
      </div>
    </div>
  );
};

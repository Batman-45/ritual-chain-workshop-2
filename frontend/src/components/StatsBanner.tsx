"use client";

import React from "react";
import { Coins, Flame, Clock, Sparkles, Activity, Layers } from "lucide-react";
import { Market, MarketState } from "../lib/types";
import { formatRitual } from "../lib/formatters";

interface StatsBannerProps {
  markets: Market[];
  currentBlock: number;
}

export const StatsBanner: React.FC<StatsBannerProps> = ({ markets, currentBlock }) => {
  const totalVolume = markets.reduce(
    (acc, m) => acc + (parseFloat(m.totalYes) || 0) + (parseFloat(m.totalNo) || 0),
    0
  );

  const openMarkets = markets.filter((m) => m.state === MarketState.Open).length;
  const resolvedMarkets = markets.filter((m) => m.state === MarketState.Resolved).length;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-card-glass p-6 backdrop-blur-xl">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute -top-24 left-1/4 h-64 w-96 rounded-full bg-purple-600/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 right-1/4 h-64 w-96 rounded-full bg-cyan-600/10 blur-3xl" />

      <div className="relative z-10 grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4">
        {/* Metric 1: Total Staked */}
        <div className="flex flex-col gap-1 rounded-xl border border-white/5 bg-white/[0.02] p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Value Locked</span>
            <Coins className="h-4 w-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold tracking-tight text-white">
              {formatRitual(totalVolume)}
            </span>
            <span className="text-xs font-semibold text-purple-400">RITUAL</span>
          </div>
          <span className="text-[11px] text-slate-500">Pari-mutuel stakes pool</span>
        </div>

        {/* Metric 2: Active Markets */}
        <div className="flex flex-col gap-1 rounded-xl border border-white/5 bg-white/[0.02] p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Open Markets</span>
            <Flame className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold tracking-tight text-emerald-400">
              {openMarkets}
            </span>
            <span className="text-xs text-slate-400">of {markets.length} total</span>
          </div>
          <span className="text-[11px] text-slate-500">Accepting on-chain bets</span>
        </div>

        {/* Metric 3: Autonomous Resolutions */}
        <div className="flex flex-col gap-1 rounded-xl border border-white/5 bg-white/[0.02] p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Autonomous Settled</span>
            <Sparkles className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold tracking-tight text-cyan-400">
              {resolvedMarkets}
            </span>
            <span className="text-xs text-slate-400">markets</span>
          </div>
          <span className="text-[11px] text-slate-500">Zero manual resolution</span>
        </div>

        {/* Metric 4: Live Block Height */}
        <div className="flex flex-col gap-1 rounded-xl border border-white/5 bg-white/[0.02] p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Ritual Block Height</span>
            <Activity className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-2xl font-bold tracking-tight text-white">
              #{currentBlock.toLocaleString()}
            </span>
          </div>
          <span className="text-[11px] text-indigo-300/80 font-mono">195ms block time</span>
        </div>
      </div>
    </div>
  );
};

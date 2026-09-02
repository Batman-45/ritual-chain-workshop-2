"use client";

import React from "react";
import {
  X,
  Shield,
  Clock,
  Code2,
  Cpu,
  Layers,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Market, MarketState, Outcome } from "../lib/types";
import {
  comparatorToSymbol,
  comparatorToLabel,
  formatAddress,
  formatRitual,
  stateToBadge,
} from "../lib/formatters";
import { RITUAL_CHAIN_CONFIG } from "../lib/contracts/ritualChain";

interface MarketDetailsModalProps {
  market: Market;
  currentBlock: number;
  onClose: () => void;
  onBetClick: (market: Market, isYes: boolean) => void;
}

export const MarketDetailsModal: React.FC<MarketDetailsModalProps> = ({
  market,
  currentBlock,
  onClose,
  onBetClick,
}) => {
  const badge = stateToBadge(market.state);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-md">
      <div className="relative my-8 w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-card-glass shadow-2xl backdrop-blur-xl">
        {/* Top ambient glow */}
        <div className="absolute -top-12 left-1/2 h-32 w-96 -translate-x-1/2 rounded-full bg-cyan-600/20 blur-3xl pointer-events-none" />

        {/* Modal Top */}
        <div className="flex items-center justify-between border-b border-white/10 p-5">
          <div className="flex items-center gap-2.5">
            <span
              className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${badge.bg} ${badge.text} ${badge.border}`}
            >
              {badge.label}
            </span>
            <span className="font-mono text-xs text-slate-400">Market #{market.id}</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="max-h-[80vh] overflow-y-auto p-6 space-y-6">
          {/* Question & Rule Overview */}
          <div>
            <h2 className="text-lg font-bold text-white leading-snug">{market.question}</h2>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span>Category: <strong className="text-slate-200">{market.category}</strong></span>
              <span>•</span>
              <span>Creator: <strong className="font-mono text-slate-200">{formatAddress(market.creator)}</strong></span>
            </div>
          </div>

          {/* Core Rule & Comparator Card */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Resolution Condition
            </h4>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-ritual-bg p-3 border border-white/5">
                <span className="text-[11px] text-slate-400">Observed Value</span>
                <div className="font-mono text-sm font-bold text-purple-300">
                  {market.observedValue !== undefined
                    ? market.observedValue.toLocaleString()
                    : "Pending Oracle Read"}
                </div>
              </div>
              <div className="rounded-lg bg-ritual-bg p-3 border border-white/5">
                <span className="text-[11px] text-slate-400">Comparator</span>
                <div className="font-mono text-sm font-bold text-cyan-300">
                  {comparatorToLabel(market.comparator)}
                </div>
              </div>
              <div className="rounded-lg bg-ritual-bg p-3 border border-white/5">
                <span className="text-[11px] text-slate-400">Target Value</span>
                <div className="font-mono text-sm font-bold text-white">
                  {market.target.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Autonomous Execution Pipeline Architecture */}
          <div className="rounded-xl border border-purple-500/20 bg-purple-500/[0.03] p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-purple-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300">
                  Ritual Autonomous Precompile Pipeline
                </h4>
              </div>
              <span className="rounded bg-purple-500/10 px-2 py-0.5 text-[10px] font-mono text-purple-300 border border-purple-500/20">
                0x0801 + 0x0803
              </span>
            </div>

            <div className="mt-4 space-y-3 font-mono text-xs">
              {/* Step 1: HTTP Precompile */}
              <div className="rounded-lg bg-ritual-bg p-3 border border-white/5">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-bold text-purple-300">1. HTTP Precompile (0x0801)</span>
                  <span>GET Request (TEE Enclave)</span>
                </div>
                <div className="mt-1 break-all text-xs text-slate-300 bg-black/40 p-2 rounded border border-white/5">
                  {market.oracleUrl}
                </div>
              </div>

              {/* Step 2: jq Precompile */}
              <div className="rounded-lg bg-ritual-bg p-3 border border-white/5">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-bold text-cyan-300">2. jq Precompile (0x0803)</span>
                  <span>Filter outputType=uint256</span>
                </div>
                <div className="mt-1 font-mono text-xs text-cyan-300 bg-black/40 p-2 rounded border border-white/5">
                  {market.jsonPath}
                </div>
              </div>

              {/* Step 3: Scheduler Callback */}
              <div className="rounded-lg bg-ritual-bg p-3 border border-white/5">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-bold text-emerald-300">3. Ritual Scheduler (0x56e7...D58B)</span>
                  <span>Schedule ID: #{market.scheduleId}</span>
                </div>
                <div className="mt-1 text-slate-400 text-[11px]">
                  Fires automatically at block <strong className="text-white">#{market.resolveBlock.toLocaleString()}</strong>. (Max 3 attempts, 200 blocks retry spacing).
                </div>
              </div>
            </div>
          </div>

          {/* Block Timing & Schedule Information */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-xs space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Block Timeline & Execution Telemetry
            </h4>
            <div className="flex items-center justify-between text-slate-300">
              <span>Created at Block:</span>
              <span className="font-mono text-white">#{market.createdAtBlock.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>Betting Close Block:</span>
              <span className="font-mono text-amber-400">#{market.closeBlock.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>Resolution Schedule Block:</span>
              <span className="font-mono text-cyan-400">#{market.resolveBlock.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>Assigned TEE Executor:</span>
              <span className="font-mono text-purple-300">
                {market.executorAddress ? formatAddress(market.executorAddress) : "Selected at resolveBlock via 0x9644..."}
              </span>
            </div>
          </div>

          {/* Pool Stakes */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Pari-Mutuel Pools
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                <span className="text-xs font-semibold text-emerald-400">YES Pool</span>
                <div className="font-mono text-lg font-bold text-white mt-1">
                  {formatRitual(market.totalYes)} <span className="text-xs text-slate-400">RITUAL</span>
                </div>
              </div>
              <div className="rounded-lg border border-rose-500/20 bg-rose-500/5 p-3">
                <span className="text-xs font-semibold text-rose-400">NO Pool</span>
                <div className="font-mono text-lg font-bold text-white mt-1">
                  {formatRitual(market.totalNo)} <span className="text-xs text-slate-400">RITUAL</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="flex items-center justify-between border-t border-white/10 p-5">
          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-medium text-slate-300 hover:bg-white/5 transition-colors"
          >
            Close
          </button>

          {market.state === MarketState.Open && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onClose();
                  onBetClick(market, true);
                }}
                className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 shadow-glow-green hover:bg-emerald-400 transition-all"
              >
                Bet YES
              </button>
              <button
                onClick={() => {
                  onClose();
                  onBetClick(market, false);
                }}
                className="rounded-xl bg-rose-500 px-4 py-2 text-xs font-bold text-white shadow-glow-rose hover:bg-rose-400 transition-all"
              >
                Bet NO
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

"use client";

import React, { useState } from "react";
import {
  X,
  Plus,
  HelpCircle,
  Clock,
  Shield,
  Layers,
  Sparkles,
  ArrowRight,
  Terminal,
} from "lucide-react";
import { Comparator, NewMarketInput } from "../lib/types";
import { secondsToBlocks, comparatorToSymbol } from "../lib/formatters";
import { RITUAL_CHAIN_CONFIG } from "../lib/contracts/ritualChain";

interface CreateMarketModalProps {
  onClose: () => void;
  onSubmit: (input: NewMarketInput) => Promise<void>;
  currentBlock: number;
}

const COMPARATOR_OPTIONS = [
  { value: Comparator.GTE, label: "Greater than or equal (≥)", symbol: "≥" },
  { value: Comparator.GT, label: "Strictly greater than (>)", symbol: ">" },
  { value: Comparator.LTE, label: "Less than or equal (≤)", symbol: "≤" },
  { value: Comparator.LT, label: "Strictly less than (<)", symbol: "<" },
];

export const CreateMarketModal: React.FC<CreateMarketModalProps> = ({
  onClose,
  onSubmit,
  currentBlock,
}) => {
  const [question, setQuestion] = useState("");
  const [category, setCategory] = useState<
    "Crypto" | "AI & LLMs" | "DeFi" | "Ritual Ecosystem" | "Macro"
  >("Crypto");
  const [oracleUrl, setOracleUrl] = useState(
    "https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT"
  );
  const [jsonPath, setJsonPath] = useState(".price | tonumber");
  const [target, setTarget] = useState<string>("3800");
  const [comparator, setComparator] = useState<Comparator>(Comparator.GTE);
  const [bettingDurationMinutes, setBettingDurationMinutes] = useState<string>("60");
  const [resolveDelaySeconds, setResolveDelaySeconds] = useState<string>("30");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const blockTimeMs = RITUAL_CHAIN_CONFIG.defaultBlockTimeMs;
  const bettingSeconds = (parseFloat(bettingDurationMinutes) || 0) * 60;
  const resolveDelay = parseFloat(resolveDelaySeconds) || 15;

  const bettingBlocks = secondsToBlocks(bettingSeconds, blockTimeMs);
  const resolveDelayBlocks = secondsToBlocks(resolveDelay, blockTimeMs);

  const estimatedCloseBlock = currentBlock + bettingBlocks;
  const estimatedResolveBlock = estimatedCloseBlock + resolveDelayBlocks;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) {
      setError("Please provide a question title");
      return;
    }
    if (!oracleUrl.trim().startsWith("http")) {
      setError("Oracle URL must start with http:// or https://");
      return;
    }
    if (!jsonPath.trim()) {
      setError("JSONPath jq extractor cannot be empty");
      return;
    }
    const numTarget = parseFloat(target);
    if (isNaN(numTarget)) {
      setError("Target must be a valid number");
      return;
    }
    if (bettingSeconds < RITUAL_CHAIN_CONFIG.constants.minBettingSeconds) {
      setError("Betting duration must be at least 30 seconds");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onSubmit({
        question: question.trim(),
        category,
        oracleUrl: oracleUrl.trim(),
        jsonPath: jsonPath.trim(),
        target: numTarget,
        comparator,
        bettingSeconds,
        resolveDelaySeconds: resolveDelay,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to create prediction market");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-md">
      <div className="relative my-8 w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-card-glass shadow-2xl backdrop-blur-xl">
        {/* Ambient Top Glow */}
        <div className="absolute -top-12 left-1/2 h-32 w-96 -translate-x-1/2 rounded-full bg-gradient-to-r from-purple-600/30 to-cyan-500/20 blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 p-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/20 text-purple-300">
              <Plus className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Create Self-Resolving Market</h3>
              <p className="text-xs text-slate-400">
                Resolution is booked with the Ritual Scheduler at creation time
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="max-h-[80vh] overflow-y-auto p-6 space-y-5">
          {/* Question Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Market Question <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. Will ETH/USD be at least $4,000 on Binance?"
              className="mt-2 w-full rounded-xl border border-white/10 bg-ritual-surface px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>

          {/* Category & Comparator */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-ritual-surface px-3 py-3 text-sm text-white focus:border-purple-500 focus:outline-none"
              >
                <option value="Crypto">Crypto</option>
                <option value="AI & LLMs">AI & LLMs</option>
                <option value="Ritual Ecosystem">Ritual Ecosystem</option>
                <option value="DeFi">DeFi</option>
                <option value="Macro">Macro</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Comparator Rule
              </label>
              <select
                value={comparator}
                onChange={(e) => setComparator(Number(e.target.value))}
                className="mt-2 w-full rounded-xl border border-white/10 bg-ritual-surface px-3 py-3 text-sm text-white focus:border-purple-500 focus:outline-none"
              >
                {COMPARATOR_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Target Value */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Target Value (Numeric) <span className="text-rose-400">*</span>
            </label>
            <input
              type="number"
              step="any"
              required
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="e.g. 3800"
              className="mt-2 w-full rounded-xl border border-white/10 bg-ritual-surface px-4 py-3 font-mono text-sm text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
            />
          </div>

          {/* Precompile Oracle Configuration Section */}
          <div className="rounded-xl border border-purple-500/20 bg-purple-500/[0.04] p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
              <Shield className="h-4 w-4 text-cyan-400" />
              <span>Ritual Chain Precompile Oracle Config</span>
            </div>

            <div className="mt-3 space-y-3">
              <div>
                <label className="block text-[11px] font-mono text-slate-400">
                  HTTP GET Oracle URL (Precompile 0x0801):
                </label>
                <input
                  type="url"
                  required
                  value={oracleUrl}
                  onChange={(e) => setOracleUrl(e.target.value)}
                  placeholder="https://..."
                  className="mt-1 w-full rounded-lg border border-white/10 bg-ritual-bg px-3 py-2 font-mono text-xs text-purple-200 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400">
                  jq Extraction Path (Precompile 0x0803):
                </label>
                <div className="relative mt-1">
                  <Terminal className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={jsonPath}
                    onChange={(e) => setJsonPath(e.target.value)}
                    placeholder=".price | tonumber"
                    className="w-full rounded-lg border border-white/10 bg-ritual-bg py-2 pl-9 pr-3 font-mono text-xs text-cyan-300 focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Timing & Block Estimator */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Betting Window (Minutes)
              </label>
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={bettingDurationMinutes}
                onChange={(e) => setBettingDurationMinutes(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-ritual-surface px-4 py-2.5 font-mono text-sm text-white focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Resolve Delay (Seconds)
              </label>
              <input
                type="number"
                min="15"
                value={resolveDelaySeconds}
                onChange={(e) => setResolveDelaySeconds(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-ritual-surface px-4 py-2.5 font-mono text-sm text-white focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Live Scheduled Block Conversion Summary */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-xs space-y-2">
            <div className="flex items-center justify-between text-slate-300">
              <span>Current Block:</span>
              <span className="font-mono font-bold text-white">#{currentBlock.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>Close Block (Betting Ends):</span>
              <span className="font-mono font-bold text-amber-400">
                #{estimatedCloseBlock.toLocaleString()} (+{bettingBlocks.toLocaleString()} blocks)
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>Scheduled Resolve Block:</span>
              <span className="font-mono font-bold text-cyan-400">
                #{estimatedResolveBlock.toLocaleString()} (+{resolveDelayBlocks.toLocaleString()} blocks)
              </span>
            </div>
            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
              <span>Scheduler Autonomous Policy:</span>
              <span className="text-purple-300 font-mono">3 attempts @ 200 blocks interval</span>
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-medium text-slate-300 hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 px-6 py-2.5 text-xs font-bold text-white shadow-glow hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all"
            >
              {isSubmitting ? (
                <span className="animate-pulse">Booking Resolution...</span>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Create Market & Book Schedule</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

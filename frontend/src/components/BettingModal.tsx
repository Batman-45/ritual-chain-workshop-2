"use client";

import React, { useState } from "react";
import { X, TrendingUp, TrendingDown, Info, ShieldCheck, Sparkles } from "lucide-react";
import { Market, UserStakeInfo } from "../lib/types";
import { formatRitual, comparatorToSymbol } from "../lib/formatters";

interface BettingModalProps {
  market: Market;
  initialOutcome: boolean; // true = YES, false = NO
  userStake?: UserStakeInfo;
  onClose: () => void;
  onSubmitBet: (marketId: number, isYes: boolean, amount: string) => Promise<void>;
}

const PRESET_AMOUNTS = ["0.1", "0.5", "1.0", "5.0", "10.0"];

export const BettingModal: React.FC<BettingModalProps> = ({
  market,
  initialOutcome,
  userStake,
  onClose,
  onSubmitBet,
}) => {
  const [isYes, setIsYes] = useState<boolean>(initialOutcome);
  const [amount, setAmount] = useState<string>("1.0");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const parsedAmount = parseFloat(amount) || 0;
  const poolYes = parseFloat(market.totalYes) || 0;
  const poolNo = parseFloat(market.totalNo) || 0;
  const totalPool = poolYes + poolNo;

  // Pari-mutuel estimated payout formula: stake * (totalPool + newStake) / (winningPool + newStake)
  let estimatedPayout = 0;
  let estimatedMultiplier = 0;

  if (parsedAmount > 0) {
    const newTotalPool = totalPool + parsedAmount;
    const newWinningPool = (isYes ? poolYes : poolNo) + parsedAmount;
    if (newWinningPool > 0) {
      estimatedPayout = (parsedAmount * newTotalPool) / newWinningPool;
      estimatedMultiplier = estimatedPayout / parsedAmount;
    }
  }

  const handlePresetClick = (val: string) => {
    setAmount(val);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (parsedAmount <= 0) {
      setError("Please enter a valid amount greater than 0");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onSubmitBet(market.id, isYes, amount);
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to place stake");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-card-glass shadow-2xl backdrop-blur-xl">
        {/* Glow header */}
        <div className="absolute -top-12 left-1/2 h-32 w-64 -translate-x-1/2 rounded-full bg-purple-600/30 blur-3xl pointer-events-none" />

        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-white/10 p-5">
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-purple-500/20 px-2.5 py-1 text-xs font-mono font-bold text-purple-300">
              #{market.id}
            </span>
            <h3 className="text-base font-bold text-white">Place Pari-Mutuel Stake</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Question Header */}
        <div className="border-b border-white/5 bg-white/[0.02] p-5">
          <p className="text-sm font-semibold text-slate-200">{market.question}</p>
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
            <span>Target condition:</span>
            <span className="font-mono font-bold text-purple-300">
              Observed {comparatorToSymbol(market.comparator)} {market.target.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5">
          {/* YES / NO Switcher */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setIsYes(true)}
              className={`flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-bold transition-all ${
                isYes
                  ? "border-emerald-500 bg-emerald-500/20 text-emerald-300 shadow-glow-green"
                  : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10"
              }`}
            >
              <TrendingUp className="h-4 w-4" />
              <span>YES ({formatRitual(market.totalYes)} Pool)</span>
            </button>

            <button
              type="button"
              onClick={() => setIsYes(false)}
              className={`flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-bold transition-all ${
                !isYes
                  ? "border-rose-500 bg-rose-500/20 text-rose-300 shadow-glow-rose"
                  : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10"
              }`}
            >
              <TrendingDown className="h-4 w-4" />
              <span>NO ({formatRitual(market.totalNo)} Pool)</span>
            </button>
          </div>

          {/* Stake Amount Input */}
          <div className="mt-5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Stake Amount</span>
              <span>Native Token: <strong className="text-purple-300">RITUAL</strong></span>
            </div>
            <div className="relative mt-2">
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError(null);
                }}
                className="w-full rounded-xl border border-white/10 bg-ritual-surface py-3 pl-4 pr-20 font-mono text-base font-bold text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                placeholder="0.00"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-xs font-semibold text-slate-400">
                RITUAL
              </span>
            </div>

            {/* Presets */}
            <div className="mt-2.5 flex items-center gap-2">
              {PRESET_AMOUNTS.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handlePresetClick(val)}
                  className={`flex-1 rounded-lg border py-1.5 text-xs font-mono font-medium transition-all ${
                    amount === val
                      ? "border-purple-500 bg-purple-500/20 text-white"
                      : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  +{val}
                </button>
              ))}
            </div>
          </div>

          {/* Outcome Breakdown / Multiplier Box */}
          <div className="mt-5 rounded-xl border border-white/5 bg-white/[0.02] p-4 text-xs">
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-400">Est. Payout if {isYes ? "YES" : "NO"} Wins:</span>
              <span className="font-mono font-bold text-emerald-400">
                {estimatedPayout.toFixed(2)} RITUAL
              </span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-400">Potential Return Multiplier:</span>
              <span className="font-mono font-bold text-cyan-400">
                {estimatedMultiplier.toFixed(2)}x
              </span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 border-t border-white/5 pt-2 text-[11px] text-slate-400">
              <Info className="h-3.5 w-3.5 text-purple-400 flex-shrink-0" />
              <span>
                Pari-mutuel stakes: Winnings are distributed proportionally to winning stakes from the total pool.
              </span>
            </div>
          </div>

          {error && (
            <div className="mt-3 rounded-lg border border-rose-500/30 bg-rose-500/10 p-2.5 text-xs text-rose-300">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || parsedAmount <= 0}
            className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white shadow-glow transition-all ${
              isYes
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110"
                : "bg-gradient-to-r from-rose-600 to-pink-600 hover:brightness-110"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isSubmitting ? (
              <span className="animate-pulse">Confirming Stake...</span>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>
                  Confirm Bet on {isYes ? "YES" : "NO"} ({amount || "0"} RITUAL)
                </span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

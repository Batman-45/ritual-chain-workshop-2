import { Comparator, MarketState, Outcome } from "./types";

export function formatAddress(address?: string): string {
  if (!address) return "0x0000...0000";
  if (address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatRitual(amount: string | number | bigint): string {
  const num = typeof amount === "string" ? parseFloat(amount) : Number(amount);
  if (isNaN(num)) return "0.00";
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(2)}K`;
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  });
}

export function comparatorToSymbol(c: Comparator): string {
  switch (c) {
    case Comparator.GT:
      return ">";
    case Comparator.GTE:
      return "≥";
    case Comparator.LT:
      return "<";
    case Comparator.LTE:
      return "≤";
    default:
      return "=";
  }
}

export function comparatorToLabel(c: Comparator): string {
  switch (c) {
    case Comparator.GT:
      return "Greater than (>)";
    case Comparator.GTE:
      return "Greater than or equal (≥)";
    case Comparator.LT:
      return "Less than (<)";
    case Comparator.LTE:
      return "Less than or equal (≤)";
    default:
      return "Equal";
  }
}

export function stateToBadge(state: MarketState): {
  label: string;
  bg: string;
  text: string;
  border: string;
  glow: string;
} {
  switch (state) {
    case MarketState.Open:
      return {
        label: "OPEN FOR BETS",
        bg: "bg-emerald-500/10",
        text: "text-emerald-400",
        border: "border-emerald-500/30",
        glow: "shadow-glow-green",
      };
    case MarketState.Closed:
      return {
        label: "AWAITING SCHEDULE",
        bg: "bg-amber-500/10",
        text: "text-amber-400",
        border: "border-amber-500/30",
        glow: "shadow-amber-500/20",
      };
    case MarketState.Resolving:
      return {
        label: "RESOLVING (TEE)",
        bg: "bg-purple-500/20",
        text: "text-purple-300",
        border: "border-purple-500/50",
        glow: "shadow-glow",
      };
    case MarketState.Resolved:
      return {
        label: "RESOLVED",
        bg: "bg-cyan-500/10",
        text: "text-cyan-400",
        border: "border-cyan-500/30",
        glow: "shadow-glow-cyan",
      };
    case MarketState.Invalid:
      return {
        label: "INVALID / REFUNDABLE",
        bg: "bg-rose-500/10",
        text: "text-rose-400",
        border: "border-rose-500/30",
        glow: "shadow-glow-rose",
      };
    default:
      return {
        label: "UNKNOWN",
        bg: "bg-slate-500/10",
        text: "text-slate-400",
        border: "border-slate-500/30",
        glow: "",
      };
  }
}

export function calculateOdds(yesAmount: string | number, noAmount: string | number): {
  yesPercent: number;
  noPercent: number;
  total: number;
  yesMultiplier: number;
  noMultiplier: number;
} {
  const y = typeof yesAmount === "string" ? parseFloat(yesAmount) || 0 : yesAmount;
  const n = typeof noAmount === "string" ? parseFloat(noAmount) || 0 : noAmount;
  const total = y + n;

  if (total === 0) {
    return {
      yesPercent: 50,
      noPercent: 50,
      total: 0,
      yesMultiplier: 2.0,
      noMultiplier: 2.0,
    };
  }

  const yesPercent = Math.round((y / total) * 100);
  const noPercent = 100 - yesPercent;

  const yesMultiplier = y > 0 ? Number((total / y).toFixed(2)) : 2.0;
  const noMultiplier = n > 0 ? Number((total / n).toFixed(2)) : 2.0;

  return {
    yesPercent,
    noPercent,
    total,
    yesMultiplier,
    noMultiplier,
  };
}

export function secondsToBlocks(seconds: number, blockTimeMs = 195): number {
  const blocks = Math.floor((seconds * 1000) / blockTimeMs);
  return blocks === 0 ? 1 : blocks;
}

export function blocksToSeconds(blocks: number, blockTimeMs = 195): number {
  return (blocks * blockTimeMs) / 1000;
}

export function formatTimeRemaining(seconds: number): string {
  if (seconds <= 0) return "0s";
  const mins = Math.floor(seconds / 60);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${mins % 60}m`;
  if (mins > 0) return `${mins}m ${Math.floor(seconds % 60)}s`;
  return `${Math.floor(seconds)}s`;
}

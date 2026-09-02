"use client";

import React from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { MarketState } from "../lib/types";

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  selectedState: string;
  onStateChange: (state: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

const CATEGORIES = ["All", "Crypto", "AI & LLMs", "Ritual Ecosystem", "DeFi"];
const STATES = [
  { label: "All Markets", value: "ALL" },
  { label: "Open", value: String(MarketState.Open) },
  { label: "Awaiting Schedule", value: String(MarketState.Closed) },
  { label: "Resolving (TEE)", value: String(MarketState.Resolving) },
  { label: "Resolved", value: String(MarketState.Resolved) },
  { label: "Invalid / Refund", value: String(MarketState.Invalid) },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedState,
  onStateChange,
  sortBy,
  onSortChange,
}) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Top row: Search + Category Chips + Sort */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search prediction markets, oracles, questions..."
            className="w-full rounded-xl border border-white/10 bg-ritual-surface py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-slate-400" />
          <span className="text-xs text-slate-400">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="rounded-xl border border-white/10 bg-ritual-surface px-3 py-2 text-xs font-medium text-slate-200 focus:border-purple-500 focus:outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="pool-high">Highest Staked Pool</option>
            <option value="ending-soon">Ending Soonest</option>
          </select>
        </div>
      </div>

      {/* Category Chips & State Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-y border-white/5 py-3">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-purple-600/30 border border-purple-500/50 text-purple-200 shadow-glow"
                  : "bg-white/[0.03] border border-white/5 text-slate-400 hover:bg-white/[0.08] hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* State Tabs */}
        <div className="flex flex-wrap items-center gap-1">
          {STATES.map((st) => (
            <button
              key={st.value}
              onClick={() => onStateChange(st.value)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                selectedState === st.value
                  ? "bg-white/15 text-white font-semibold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

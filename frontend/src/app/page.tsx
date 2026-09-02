"use client";

import React, { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { StatsBanner } from "../components/StatsBanner";
import { FilterBar } from "../components/FilterBar";
import { MarketCard } from "../components/MarketCard";
import { BettingModal } from "../components/BettingModal";
import { CreateMarketModal } from "../components/CreateMarketModal";
import { MarketDetailsModal } from "../components/MarketDetailsModal";
import { UserPortfolio } from "../components/UserPortfolio";
import { ChainTelemetry } from "../components/ChainTelemetry";
import { contractAdapter } from "../lib/contracts/adapter";
import { Market, MarketState, NewMarketInput, UserStakeInfo } from "../lib/types";
import { Sparkles, Layers, CheckCircle, AlertCircle, Info } from "lucide-react";

export default function Home() {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [userStakes, setUserStakes] = useState<UserStakeInfo[]>([]);
  const [currentBlock, setCurrentBlock] = useState<number>(contractAdapter.getCurrentBlock());
  const [userAddress, setUserAddress] = useState<string>(contractAdapter.getUserAddress());

  // Search, Filter, Sort States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedState, setSelectedState] = useState("ALL");
  const [sortBy, setSortBy] = useState("newest");
  const [isPortfolioActive, setIsPortfolioActive] = useState(false);

  // Modals state
  const [bettingMarket, setBettingMarket] = useState<{ market: Market; isYes: boolean } | null>(null);
  const [inspectMarket, setInspectMarket] = useState<Market | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Toast Notification
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "info" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadData = async () => {
    const ms = await contractAdapter.getMarkets();
    const st = await contractAdapter.getUserStakes();
    setMarkets(ms);
    setUserStakes(st);
  };

  useEffect(() => {
    loadData();

    // Simulate block progression on Ritual Chain (~195ms per block)
    const interval = setInterval(() => {
      setCurrentBlock((prev) => prev + 1);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  // Filter & Sort Logic
  const filteredMarkets = markets.filter((m) => {
    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchQuestion = m.question.toLowerCase().includes(q);
      const matchOracle = m.oracleUrl.toLowerCase().includes(q);
      const matchCategory = m.category.toLowerCase().includes(q);
      if (!matchQuestion && !matchOracle && !matchCategory) return false;
    }

    // Category
    if (selectedCategory !== "All" && m.category !== selectedCategory) {
      return false;
    }

    // State
    if (selectedState !== "ALL" && String(m.state) !== selectedState) {
      return false;
    }

    return true;
  });

  // Sort
  const sortedMarkets = [...filteredMarkets].sort((a, b) => {
    if (sortBy === "pool-high") {
      const totalA = (parseFloat(a.totalYes) || 0) + (parseFloat(a.totalNo) || 0);
      const totalB = (parseFloat(b.totalYes) || 0) + (parseFloat(b.totalNo) || 0);
      return totalB - totalA;
    }
    if (sortBy === "ending-soon") {
      return a.closeBlock - b.closeBlock;
    }
    // Default newest
    return b.id - a.id;
  });

  // Actions
  const handlePlaceBet = async (marketId: number, isYes: boolean, amount: string) => {
    await contractAdapter.placeBet(marketId, isYes, amount);
    await loadData();
    showToast(`Successfully staked ${amount} RITUAL on ${isYes ? "YES" : "NO"}!`, "success");
  };

  const handleCreateMarket = async (input: NewMarketInput) => {
    const res = await contractAdapter.createMarket(input);
    await loadData();
    showToast(`Market #${res.marketId} created and scheduled for resolution on Ritual Chain!`, "success");
  };

  const handleClaimWinnings = async (marketId: number) => {
    try {
      const res = await contractAdapter.claimWinnings(marketId);
      await loadData();
      showToast(`Successfully claimed ${res.amount} RITUAL winnings!`, "success");
    } catch (err: any) {
      showToast(err?.message || "Failed to claim", "error");
    }
  };

  const handleClaimRefund = async (marketId: number) => {
    try {
      const res = await contractAdapter.claimRefund(marketId);
      await loadData();
      showToast(`Successfully claimed ${res.amount} RITUAL refund!`, "success");
    } catch (err: any) {
      showToast(err?.message || "Failed to claim refund", "error");
    }
  };

  return (
    <div className="relative min-h-screen bg-ritual-bg pb-20">
      {/* Background ambient lighting */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/3 h-[500px] w-[500px] rounded-full bg-purple-900/10 blur-[140px]" />
        <div className="absolute top-1/2 -right-40 h-[600px] w-[600px] rounded-full bg-cyan-900/10 blur-[160px]" />
        <div className="absolute inset-0 bg-grid-pattern opacity-40" />
      </div>

      {/* Header */}
      <Header
        userAddress={userAddress}
        onCreateMarketClick={() => setIsCreateModalOpen(true)}
        onSelectPortfolio={() => setIsPortfolioActive(!isPortfolioActive)}
        isPortfolioActive={isPortfolioActive}
      />

      {/* Main Container */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8 space-y-6">
        {/* Toast Alert */}
        {toast && (
          <div
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl border px-4 py-3 text-xs font-semibold shadow-2xl backdrop-blur-xl transition-all ${
              toast.type === "success"
                ? "border-emerald-500/40 bg-emerald-950/90 text-emerald-200 shadow-glow-green"
                : toast.type === "error"
                ? "border-rose-500/40 bg-rose-950/90 text-rose-200 shadow-glow-rose"
                : "border-purple-500/40 bg-purple-950/90 text-purple-200 shadow-glow"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle className="h-4 w-4 text-emerald-400" />
            ) : (
              <AlertCircle className="h-4 w-4 text-rose-400" />
            )}
            <span>{toast.message}</span>
          </div>
        )}

        {/* Hero Banner / TVL Stats */}
        <StatsBanner markets={markets} currentBlock={currentBlock} />

        {/* Precompile Telemetry Architecture Explanation */}
        <ChainTelemetry />

        {/* Portfolio View OR Market Grid */}
        {isPortfolioActive ? (
          <UserPortfolio
            userStakes={userStakes}
            markets={markets}
            onClaimWinnings={handleClaimWinnings}
            onClaimRefund={handleClaimRefund}
            onViewMarket={(m) => {
              setIsPortfolioActive(false);
              setInspectMarket(m);
            }}
            onBackToDashboard={() => setIsPortfolioActive(false)}
          />
        ) : (
          <div className="space-y-6">
            {/* Filter & Search Bar */}
            <FilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedState={selectedState}
              onStateChange={setSelectedState}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />

            {/* Markets Grid */}
            {sortedMarkets.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-card-glass p-12 text-center backdrop-blur-xl">
                <Layers className="mx-auto h-10 w-10 text-slate-500" />
                <h3 className="mt-3 text-base font-semibold text-white">No markets found</h3>
                <p className="mt-1 text-xs text-slate-400">
                  Try adjusting your search query or status filter.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                    setSelectedState("ALL");
                  }}
                  className="mt-4 rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-white/10 transition-all"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {sortedMarkets.map((market) => {
                  const userStake = userStakes.find((s) => s.marketId === market.id);
                  return (
                    <MarketCard
                      key={market.id}
                      market={market}
                      currentBlock={currentBlock}
                      userStake={userStake}
                      onBetClick={(m, isYes) => setBettingMarket({ market: m, isYes })}
                      onInspectClick={(m) => setInspectMarket(m)}
                      onClaimClick={(m) =>
                        m.state === MarketState.Resolved
                          ? handleClaimWinnings(m.id)
                          : handleClaimRefund(m.id)
                      }
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      {bettingMarket && (
        <BettingModal
          market={bettingMarket.market}
          initialOutcome={bettingMarket.isYes}
          userStake={userStakes.find((s) => s.marketId === bettingMarket.market.id)}
          onClose={() => setBettingMarket(null)}
          onSubmitBet={handlePlaceBet}
        />
      )}

      {isCreateModalOpen && (
        <CreateMarketModal
          currentBlock={currentBlock}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateMarket}
        />
      )}

      {inspectMarket && (
        <MarketDetailsModal
          market={inspectMarket}
          currentBlock={currentBlock}
          onClose={() => setInspectMarket(null)}
          onBetClick={(m, isYes) => setBettingMarket({ market: m, isYes })}
        />
      )}
    </div>
  );
}

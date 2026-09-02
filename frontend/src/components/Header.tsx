"use client";

import React, { useState } from "react";
import { Plus, Shield, Cpu, ExternalLink, Wallet, Check, Copy } from "lucide-react";
import { formatAddress } from "../lib/formatters";
import { RITUAL_CHAIN_CONFIG } from "../lib/contracts/ritualChain";

interface HeaderProps {
  onCreateMarketClick: () => void;
  userAddress: string;
  onSelectPortfolio: () => void;
  isPortfolioActive: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onCreateMarketClick,
  userAddress,
  onSelectPortfolio,
  isPortfolioActive,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(userAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-ritual-bg/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand & Logo */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 p-[1px] shadow-glow">
              <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-ritual-bg">
                <Cpu className="h-5 w-5 text-purple-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-white">
                  RITUAL<span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">PREDICT</span>
                </span>
                <span className="rounded-md border border-purple-500/30 bg-purple-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-purple-300">
                  AI ORACLE
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Self-Resolving Binary Prediction Market on Ritual Chain
              </p>
            </div>
          </div>
        </div>

        {/* Center / Network & Precompiles Status */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-ritual-surface px-3 py-1.5 text-xs text-slate-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <span className="font-medium text-slate-200">Ritual Chain (1979)</span>
            <span className="text-slate-500">•</span>
            <span className="text-[11px] text-purple-300 font-mono">~195ms blocks</span>
          </div>

          <div className="flex items-center gap-1.5 rounded-full border border-white/5 bg-white/[0.03] px-3 py-1.5 text-xs font-mono text-slate-400">
            <Shield className="h-3.5 w-3.5 text-cyan-400" />
            <span>TEE HTTP 0x0801</span>
            <span className="text-slate-600">+</span>
            <span>jq 0x0803</span>
          </div>
        </div>

        {/* Right Actions: Portfolio, Create Market, Wallet */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            onClick={onSelectPortfolio}
            className={`px-3.5 py-2 text-xs font-medium rounded-xl border transition-all ${
              isPortfolioActive
                ? "border-purple-500 bg-purple-500/20 text-white shadow-glow"
                : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:border-white/20"
            }`}
          >
            My Positions
          </button>

          <button
            onClick={onCreateMarketClick}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-glow hover:brightness-110 active:scale-95 transition-all"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Create Market</span>
            <span className="sm:hidden">Create</span>
          </button>

          {/* Account Pill */}
          <div
            onClick={handleCopy}
            title="Click to copy address"
            className="group flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-ritual-surface px-3 py-2 text-xs font-mono text-slate-300 hover:border-purple-500/40 hover:bg-white/5 transition-all"
          >
            <div className="h-2 w-2 rounded-full bg-gradient-to-r from-purple-400 to-cyan-400" />
            <span className="font-semibold text-slate-200">
              {formatAddress(userAddress)}
            </span>
            {copied ? (
              <Check className="h-3.5 w-3.5 text-emerald-400" />
            ) : (
              <Copy className="h-3.5 w-3.5 text-slate-500 group-hover:text-slate-300" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

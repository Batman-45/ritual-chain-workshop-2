"use client";

import React, { useState } from "react";
import {
  Cpu,
  Layers,
  Shield,
  Clock,
  Terminal,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { RITUAL_CHAIN_CONFIG } from "../lib/contracts/ritualChain";

export const ChainTelemetry: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-card-glass backdrop-blur-xl transition-all">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-5 text-left hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">
                How RitualPredict Eliminates Off-Chain Cron & Manual Keepers
              </h3>
              <span className="hidden sm:inline-block rounded bg-cyan-500/10 px-2 py-0.5 text-[10px] font-mono text-cyan-300 border border-cyan-500/20">
                Native Chain Precompiles
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Autonomous on-chain resolution via HTTP (0x0801), jq (0x0803), and the Ritual Scheduler.
            </p>
          </div>
        </div>

        <div className="text-slate-400">
          {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </div>
      </button>

      {isOpen && (
        <div className="border-t border-white/5 p-5 pt-3 space-y-4">
          <p className="text-xs leading-relaxed text-slate-300">
            Traditional prediction markets require external keepers, centralised backend cron jobs, or manual transactions to resolve outcomes. On <strong>Ritual Chain</strong>, the contract books its own execution directly with the on-chain <strong>Scheduler</strong> at market creation time:
          </p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            {/* Box 1 */}
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3.5 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-purple-300 font-mono">
                <Clock className="h-3.5 w-3.5 text-purple-400" />
                <span>Scheduler (0x56e7...D58B)</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Wakes <code className="text-purple-300 font-mono">onScheduledResolve</code> precisely at <code className="text-white font-mono">resolveBlock</code> with up to 3 automatic retries.
              </p>
            </div>

            {/* Box 2 */}
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3.5 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300 font-mono">
                <Shield className="h-3.5 w-3.5 text-cyan-400" />
                <span>HTTP Precompile (0x0801)</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Dispatches a verified HTTP GET in a secure attested TEE enclave (via <code className="text-cyan-300 font-mono">0x9644...</code> registry).
              </p>
            </div>

            {/* Box 3 */}
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3.5 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 font-mono">
                <Terminal className="h-3.5 w-3.5 text-emerald-400" />
                <span>jq Precompile (0x0803)</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Synchronously executes jq filter expression on the response body to extract numerical uint256 targets.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

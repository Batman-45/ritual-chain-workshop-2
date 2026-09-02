# RitualPredict Frontend

Production-ready Next.js + TypeScript + Tailwind CSS web interface for **RitualPredict**, a self-resolving binary prediction market on **Ritual Chain (Chain ID: 1979)**.

---

## Key Highlights

- **Native Ritual Precompiles**: Interfaces transparently with HTTP Precompile (`0x0801`), jq Precompile (`0x0803`), and the on-chain Scheduler (`0x56e7...D58B`).
- **Autonomous Lifecycle Support**: Supports Open, Closed (awaiting scheduled block), Resolving (TEE execution in progress), Resolved (Yes/No settled), and Invalid (Refundable) states.
- **Pari-Mutuel Calculations**: Real-time proportional pool payout calculator and multiplier estimators.
- **Mock & Live Contract Adapter**: Out-of-the-box local mock dataset with full type-safe contracts architecture for instant plug-and-play with deployed smart contracts.

---

## Directory Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Root layout with dark Ritual styling & SEO metadata
│   │   ├── page.tsx               # Main prediction dashboard & modal orchestrator
│   │   └── globals.css            # Dark glassmorphism, glow effects, custom scrollbars
│   ├── components/
│   │   ├── Header.tsx             # Ritual branding, network telemetry, simulated account pill
│   │   ├── StatsBanner.tsx        # TVL, open markets, autonomous resolutions, live block counter
│   │   ├── MarketCard.tsx         # Binary market cards with Yes/No pools, odds bars, and actions
│   │   ├── BettingModal.tsx       # Pari-mutuel betting interface with payout multiplier preview
│   │   ├── CreateMarketModal.tsx  # Create market modal with precompile oracle & block converter
│   │   ├── MarketDetailsModal.tsx # In-depth oracle execution pipeline and TEE telemetry modal
│   │   ├── UserPortfolio.tsx      # User stakes, claims, and settlement history
│   │   ├── FilterBar.tsx          # Search, category filters, status tabs, and sorting
│   │   └── ChainTelemetry.tsx     # Explains autonomous resolution on Ritual Chain
│   └── lib/
│       ├── types.ts               # TypeScript interfaces matching Solidity contract structs
│       ├── formatters.ts          # Block-to-time conversion, odds calculators, token formatting
│       ├── mockData.ts            # Realistic markets across all lifecycle states
│       └── contracts/
│           ├── ritualChain.ts     # Canonical Ritual Chain constants and precompile addresses
│           ├── ritualPredictAbi.ts# Complete ABI for RitualPredict.sol
│           └── adapter.ts         # Unified interface for mock operations and live contract RPC
```

---

## Getting Started

### 1. Install dependencies
```bash
pnpm install
```

### 2. Run the development server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### 3. Build for Production
```bash
pnpm build
```

---

## Connecting the Deployed Smart Contract

When you deploy `RitualPredict.sol` to Ritual Chain Testnet:
1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Set your deployed contract address:
   ```env
   NEXT_PUBLIC_RITUAL_PREDICT_ADDRESS=0xYourDeployedContractAddressHere
   NEXT_PUBLIC_RITUAL_RPC_URL=https://rpc.testnet.ritualfoundation.org
   ```

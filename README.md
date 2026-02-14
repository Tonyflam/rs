<div align="center">

# 🛡️ Aegis Protocol

### AI-Powered Autonomous DeFi Guardian Agent for BNB Chain

[![Built for BNB Chain](https://img.shields.io/badge/Built_for-BNB_Chain-F0B90B?style=for-the-badge&logo=binance)](https://www.bnbchain.org/)
[![Good Vibes Only](https://img.shields.io/badge/Good_Vibes_Only-OpenClaw_Edition-00e0ff?style=for-the-badge)](https://openclaw.xyz)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.24-363636?style=for-the-badge&logo=solidity)](https://soliditylang.org/)
[![Tests](https://img.shields.io/badge/Tests-54%2F54_Passing-22c55e?style=for-the-badge)](./test/)
[![Deployed](https://img.shields.io/badge/BSC_Testnet-Deployed_%26_Verified-F0B90B?style=for-the-badge)](https://testnet.bscscan.com/address/0xac77139C2856788b7EEff767969353adF95D335e)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](./LICENSE)

*An autonomous AI agent — powered by LLM reasoning (Groq/OpenAI) + PancakeSwap on-chain data — that monitors your DeFi positions on BNB Chain 24/7, detects risks in real-time, and executes protective on-chain transactions before you lose money.*

**🌐 [Live Dashboard](https://aegis-protocol-1.vercel.app/) · 📜 [Verified Contracts](https://testnet.bscscan.com/address/0xac77139C2856788b7EEff767969353adF95D335e) · 🧪 [13 On-Chain TXs](#-on-chain-proof-13-verified-transactions) · 🤖 [AI Build Log](./AI_BUILD_LOG.md)**

[Architecture](#-architecture) · [AI Engine](#-ai-reasoning-engine-llm-powered) · [On-Chain Proof](#-on-chain-proof-13-verified-transactions) · [Smart Contracts](#%EF%B8%8F-smart-contracts) · [Quick Start](#-quick-start) · [AI Build Log](./AI_BUILD_LOG.md)

</div>

---

## 🎯 The Problem

**DeFi users lose billions annually** to rug pulls, flash loan attacks, liquidity drains, and price crashes. These losses happen when users aren't watching — overnight, during work, or because market conditions change faster than humans can react.

| Pain Point | Status Quo | Aegis Solution |
|------------|-----------|----------------|
| Monitoring | Manual, intermittent | AI-powered 24/7 autonomous monitoring |
| Threat Detection | Simple price alerts | 5-vector heuristic + LLM reasoning + DEX data |
| Response Time | Minutes to hours | Sub-second autonomous execution |
| Custody | Surrender keys | Fully non-custodial (emergency exit always available) |
| Transparency | Black box | Every decision immutably logged on-chain with reasoning hash |
| Customization | One-size-fits-all | Per-user risk profiles (slippage, stop-loss, auto-actions) |
| Agent Identity | Anonymous bots | ERC-721 NFT agent identity with reputation scoring |

---

## 💡 What Aegis Does

Aegis is a **fully autonomous AI guardian agent** that runs a continuous loop:

```
OBSERVE → ANALYZE → AI REASON → DEX VERIFY → DECIDE → EXECUTE
```

1. **👁️ OBSERVE** — Fetches live BNB price, volume, liquidity from CoinGecko + DeFiLlama
2. **🧠 ANALYZE** — 5-vector weighted risk scoring (price 30%, liquidity 25%, volume 15%, holders 15%, momentum 15%)
3. **🤖 AI REASON** — LLM-powered analysis via Groq (Llama 3.3 70B) or OpenAI (GPT-4o) with structured JSON output
4. **📊 DEX VERIFY** — Cross-references CoinGecko prices against PancakeSwap V2 on-chain reserves for price manipulation detection
5. **⚡ DECIDE** — Threat classification with confidence scoring; hashes both heuristic + LLM reasoning for on-chain attestation
6. **🛡️ EXECUTE** — Autonomous protective transactions (stop-loss, emergency withdrawal, rebalance) per user-defined risk profiles

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                         AEGIS PROTOCOL                               │
│                                                                      │
│   ┌────────────┐   ┌───────────────┐   ┌──────────────┐             │
│   │  OBSERVE   │──▶│   ANALYZE     │──▶│  AI REASON   │             │
│   │            │   │               │   │              │             │
│   │ CoinGecko  │   │ 5-Vector      │   │ Groq LLM    │             │
│   │ DeFiLlama  │   │ Risk Engine   │   │ (Llama 3.3  │             │
│   │ BSC RPC    │   │ (449 LOC)     │   │  70B) or     │             │
│   └────────────┘   └───────────────┘   │ OpenAI GPT-4o│             │
│                                         └──────┬───────┘             │
│   ┌────────────┐   ┌───────────────┐          │                     │
│   │ DEX VERIFY │──▶│    DECIDE     │◀─────────┘                     │
│   │            │   │               │                                │
│   │ PancakeSwap│   │ Threat        │   ┌──────────────┐             │
│   │ V2 Router  │   │ Detection +   │──▶│   EXECUTE    │             │
│   │ (On-chain) │   │ Confidence    │   │              │             │
│   └────────────┘   └───────────────┘   │ On-chain TXs │             │
│                                         └──────┬───────┘             │
│   ┌─────────────────────────────────────────────▼────────────────┐   │
│   │                    BNB CHAIN (BSC TESTNET)                   │   │
│   │                                                              │   │
│   │  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐     │   │
│   │  │AegisRegistry │  │  AegisVault  │  │DecisionLogger │     │   │
│   │  │  (ERC-721)   │  │(Non-Custodial)│  │  (Immutable   │     │   │
│   │  │Agent Identity│  │  Protection  │  │  Audit Log)   │     │   │
│   │  │ + Reputation │  │ + Risk Profs │  │  + AI Hashes  │     │   │
│   │  └──────────────┘  └──────────────┘  └───────────────┘     │   │
│   └──────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────┘
```

### Smart Contract Architecture (3 Contracts, 1,326 LOC)

| Contract | LOC | Purpose | Key Features |
|----------|-----|---------|--------------|
| **AegisRegistry** | 415 | Agent identity & reputation | ERC-721 NFTs, 4 tiers (Scout→Archon), 1-5 reputation scoring, performance tracking |
| **AegisVault** | 573 | Non-custodial asset protection | BNB/ERC20 deposits, per-user risk profiles, agent authorization, emergency withdrawal |
| **DecisionLogger** | 338 | On-chain decision audit trail | Immutable records, risk snapshots, reasoning hashes (keccak256 of AI analysis), 6 decision types |

---

## 🤖 AI Reasoning Engine (LLM-Powered)

> **Not just heuristics — Aegis uses real LLM inference for threat analysis**

The AI engine (`agent/src/ai-engine.ts`, 381 LOC) integrates with **Groq** (Llama 3.3 70B Versatile) or **OpenAI** (GPT-4o-mini) for natural language market reasoning:

### How It Works

```typescript
// Real LLM call with structured JSON output
const analysis = await aiEngine.analyzeMarket(marketData, riskSnapshot);

// Returns:
{
  reasoning: "BNB trading at $612.50 with +1.8% 24h movement...",
  riskScore: 22,          // AI-assessed risk (0-100)
  confidence: 92,         // AI confidence in assessment
  threats: [],            // Identified threat categories
  suggestedActions: ["continue_monitoring"],
  marketSentiment: "neutral",
  keyInsights: [
    "BNB stable at $612.50 with +1.8% 24h change",
    "Volume up 15% from baseline",
    "Liquidity: $4.20B (+0.5%)"
  ]
}
```

### AI Capabilities

| Capability | Method | Description |
|-----------|--------|-------------|
| **Market Analysis** | `analyzeMarket()` | Full market snapshot analysis with structured risk assessment |
| **Token Risk Scan** | `analyzeToken()` | Per-token risk flags: rug pull, honeypot, wash trading, whale manipulation |
| **Threat Reports** | `generateThreatReport()` | Executive summary of active threats with trend context |
| **Heuristic Fallback** | Automatic | When no API key is configured, falls back to rule-based analysis (zero downtime) |

### On-Chain AI Attestation

Every AI decision is hashed and stored on-chain:

```typescript
// Combines heuristic + LLM reasoning into a single attestation hash
const combinedReasoning = `${heuristicReasoning} | AI: ${llmAnalysis.reasoning}`;
const reasoningHash = keccak256(toUtf8Bytes(combinedReasoning));
// → Stored in DecisionLogger as immutable proof of AI reasoning
```

---

## 📊 PancakeSwap V2 On-Chain Integration

> **Real-time DEX price verification directly from PancakeSwap smart contracts**

The PancakeSwap provider (`agent/src/pancakeswap.ts`, 300 LOC) reads **on-chain reserve data** from PancakeSwap V2 on BSC Mainnet:

| Feature | Method | Description |
|---------|--------|-------------|
| **Token Price (USD)** | `getTokenPriceUSD()` | Routes through WBNB→BUSD via Router contract |
| **BNB Price** | `getBNBPrice()` | Direct BNB/BUSD on-chain price |
| **Pair Data** | `getPairData()` | Reserves, symbols, decimals, USD liquidity |
| **Portfolio Tracking** | `getPortfolioPrices()` | Multi-token price monitoring |
| **Token Risk** | `analyzeTokenRisk()` | Liquidity depth, concentration, red flags |
| **DEX Depth** | `getTotalPairs()` | Total PancakeSwap pair count |

### Price Oracle Cross-Verification

```
CoinGecko Price:   $612.50  (API)
PancakeSwap Price: $612.38  (On-chain Router)
Price Delta:        0.019%  → CONSISTENT ✓

If delta > 1%  → Potential price manipulation
If delta > 5%  → CRITICAL: Oracle attack likely
```

**Supported BSC Tokens**: WBNB, BUSD, USDT, CAKE, ETH, BTCB, USDC, XRP

---

## 🔍 On-Chain Proof (13 Verified Transactions)

> **All contracts deployed, verified, and battle-tested on BSC Testnet (Chain ID 97)**

### Contract Addresses

| Contract | Address | Links |
|----------|---------|-------|
| **AegisRegistry** | `0xac77139C2856788b7EEff767969353adF95D335e` | [BSCScan](https://testnet.bscscan.com/address/0xac77139C2856788b7EEff767969353adF95D335e) · [Sourcify](https://repo.sourcify.dev/contracts/full_match/97/0xac77139C2856788b7EEff767969353adF95D335e/) |
| **AegisVault** | `0x73CE32Ece5d21836824C55c5EDB9d09b07F3a56E` | [BSCScan](https://testnet.bscscan.com/address/0x73CE32Ece5d21836824C55c5EDB9d09b07F3a56E) · [Sourcify](https://repo.sourcify.dev/contracts/full_match/97/0x73CE32Ece5d21836824C55c5EDB9d09b07F3a56E/) |
| **DecisionLogger** | `0xEbfb45d0c075d8BdabD6421bdFB9A4b9570219ea` | [BSCScan](https://testnet.bscscan.com/address/0xEbfb45d0c075d8BdabD6421bdFB9A4b9570219ea) · [Sourcify](https://repo.sourcify.dev/contracts/full_match/97/0xEbfb45d0c075d8BdabD6421bdFB9A4b9570219ea/) |

### Verified Transaction Log (Click to verify on BSCScan)

The comprehensive demo simulates a **full threat lifecycle** — from normal monitoring through threat escalation, protection triggering, and recovery:

| # | Phase | Action | Risk Level | Confidence | TX Hash |
|---|-------|--------|------------|------------|---------|
| 1 | Setup | Vault Deposit (0.005 tBNB) | — | — | [`0x3602f8...216c7a`](https://testnet.bscscan.com/tx/0x3602f865ec5df8b7bcb389f0caea337cdbe7bd5da699bfe373d1176894216c7a) |
| 2 | Config | Risk Profile (0.5% slippage, 10% SL) | — | — | [`0x4e2ddc...126989`](https://testnet.bscscan.com/tx/0x4e2ddc3e04bee004d185574497b746ac5cc561ab1da362e1eb64f207bd126989) |
| 3 | Normal | AI Market Analysis → All Clear | NONE | 92% | [`0xf0922a...65dbfb`](https://testnet.bscscan.com/tx/0xf0922ad8ff51553d014ebad35c04b7b72e0ec2b216325d652f557e988765dbfb) |
| 4 | Normal | Risk Snapshot (overall: 15/100) | LOW | — | [`0xcd7429...584618`](https://testnet.bscscan.com/tx/0xcd74298263c839ce58dd65d453dea8a88776fb5bb34029ad972eccd1ca584618) |
| 5 | Escalation | Volatility Warning (-4.2% 6h) | LOW | 78% | [`0xeed6b6...2500ef`](https://testnet.bscscan.com/tx/0xeed6b6541031012209d9318fad7851db395304f1e2a2978ae3a98f91b02500ef) |
| 6 | Escalation | Risk Snapshot (overall: 38/100) | MEDIUM | — | [`0x60e7f3...41ddf4`](https://testnet.bscscan.com/tx/0x60e7f39ebc63a4e585684f1d0fe21ab22d52a14700aa5e4ead21fc766441ddf4) |
| 7 | **Threat** | **Abnormal Volume (+350%, whale selling)** | **HIGH** | **88%** | [`0x8e8e1f...7d97d`](https://testnet.bscscan.com/tx/0x8e8e1f31f29ab36d60d3cec4be03db00919abbded5ed54e48702d5658ba7d97d) |
| 8 | Defense | Risk Profile → Aggressive (0.3% slip, 5% SL) | — | — | [`0x7b7546...0b6021`](https://testnet.bscscan.com/tx/0x7b7546b846181312fde544b2f89ee8e7e53ffd0002bada657a8c10848e0b6021) |
| 9 | Defense | Risk Snapshot (overall: 68/100) | HIGH | — | [`0x2a8c0b...c402d3`](https://testnet.bscscan.com/tx/0x2a8c0b20cedebb1af168b5545f46911d79b98feeaa05d0e4e647055eb8c402d3) |
| 10 | **Protection** | **Stop-Loss Triggered (-15.3%, liquidity -28%)** | **CRITICAL** | **95%** | [`0xea98d4...28ae11`](https://testnet.bscscan.com/tx/0xea98d417b4ae7aaf6d568f85bf2ba6fa1cb1b1ee5c30f08d59959aa69228ae11) |
| 11 | Recovery | Market Stabilized, Recovery Detected | LOW | 91% | [`0xbbc362...d4912c`](https://testnet.bscscan.com/tx/0xbbc362118ad2040c44b6a680bc789a6b82f52227bb0a82f4511d525f69d4912c) |
| 12 | Recovery | Risk Snapshot Normalized (overall: 18/100) | LOW | — | [`0x530f57...5b3eb6`](https://testnet.bscscan.com/tx/0x530f57e3d88c15d34fc5e57f3bf3788f0eeceec5df82ab7c2243baa4565b3eb6) |
| 13 | Review | Position Review + AI Assessment | NONE | 98% | [`0x226c18...fdfbab`](https://testnet.bscscan.com/tx/0x226c18891d7b6edfba75cde1701dc807b9cd42d6c697309b72ac524754fdfbab) |

Each decision includes a **keccak256 hash of the AI reasoning text** stored immutably on-chain.

---

## 🧪 Tests (54/54 Passing)

```
  AegisRegistry (20 tests)
    ✓ Deployment, Agent Registration (5), Agent Management (3)
    ✓ Reputation System (4), Agent Stats (4), Admin Functions (3)

  AegisVault (20 tests)
    ✓ Deployment, BNB Deposits (3), BNB Withdrawals (3)
    ✓ Agent Authorization (3), Risk Profile (3)
    ✓ Protection Execution (4), Emergency & Admin (3)

  DecisionLogger (14 tests)
    ✓ Deployment, Decision Logging (4), Risk Snapshots (3)
    ✓ View Functions (4), Admin Functions (2)

  54 passing
```

---

## 📂 Project Structure

```
aegis-protocol/
├── contracts/                           # Solidity smart contracts (1,326 LOC)
│   ├── AegisRegistry.sol                # ERC-721 agent identity & reputation (415 LOC)
│   ├── AegisVault.sol                   # Non-custodial vault & protection (573 LOC)
│   └── DecisionLogger.sol               # On-chain decision audit log (338 LOC)
│
├── agent/                               # AI Guardian Agent Engine
│   └── src/
│       ├── index.ts                     # Main loop: OBSERVE→ANALYZE→AI→DEX→DECIDE→EXECUTE (292 LOC)
│       ├── ai-engine.ts                 # 🧠 LLM-Powered AI reasoning — Groq/OpenAI (381 LOC)
│       ├── pancakeswap.ts               # 📊 PancakeSwap V2 on-chain price feeds (300 LOC)
│       ├── analyzer.ts                  # 5-vector weighted risk analysis engine (449 LOC)
│       ├── monitor.ts                   # Position & market data monitor (live+fallback)
│       ├── market-provider.ts           # CoinGecko + DeFiLlama live data feeds
│       ├── executor.ts                  # On-chain transaction executor
│       └── simulate.ts                  # Demo simulation (no blockchain required)
│
├── scripts/
│   ├── deploy.ts                        # Multi-contract BSC deployment
│   ├── demo-e2e.ts                      # 10-phase local Hardhat E2E demo
│   ├── demo-onchain.ts                  # 7-phase BSC Testnet demo (6 TXs)
│   └── demo-comprehensive.ts            # 🔥 15-phase BSC Testnet demo (full threat lifecycle)
│
├── test/                                # 54 comprehensive tests
│   ├── AegisRegistry.test.ts            # 20 tests
│   ├── AegisVault.test.ts               # 20 tests
│   └── DecisionLogger.test.ts           # 14 tests
│
├── frontend/                            # Next.js 14 Dashboard (Vercel-deployed)
│   └── src/
│       ├── app/
│       │   ├── page.tsx                 # Dashboard with live data + AI display + on-chain data
│       │   ├── layout.tsx               # Dark cyberpunk theme
│       │   └── globals.css              # Glassmorphism CSS
│       └── lib/
│           ├── constants.ts             # Contract addresses & chain config
│           ├── useLiveMarket.ts         # 🔴 LIVE CoinGecko + PancakeSwap price hook
│           ├── useWallet.ts             # MetaMask wallet hook
│           ├── useContracts.ts          # Contract read/write hooks (+ public RPC)
│           └── abis.ts                  # Full contract ABIs
│
├── hardhat.config.ts                    # BSC Testnet + Sourcify verification
├── deployment.json                      # Deployed contract addresses
├── AI_BUILD_LOG.md                      # 🤖 Detailed AI usage documentation
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js v18+
- npm
- MetaMask (for frontend interaction)

### 1. Clone & Install

```bash
git clone https://github.com/Tonyflam/rs.git
cd rs
npm install --legacy-peer-deps
```

### 2. Run Tests

```bash
npx hardhat test
# 54 passing ✓
```

### 3. Run the E2E Demo (Local Hardhat)

```bash
npx hardhat run scripts/demo-e2e.ts
```

### 4. Run Comprehensive Demo (BSC Testnet)

```bash
cp .env.example .env
# Add PRIVATE_KEY with tBNB balance
npx hardhat run scripts/demo-comprehensive.ts --network bscTestnet
```

15-phase threat lifecycle: normal → volatility warning → threat detected → protection triggered → recovery → review.

### 5. Start the AI Agent

```bash
cd agent && npm install

# Optional: Add LLM API key for AI reasoning
# export GROQ_API_KEY=your_key  (or OPENAI_API_KEY)

npx ts-node src/index.ts
```

### 6. Start the Frontend

```bash
cd frontend && npm install && npm run dev
# Open http://localhost:3000
```

### 7. Deploy to BSC Testnet

```bash
npx hardhat run scripts/deploy.ts --network bscTestnet
```

---

## ⛓️ Smart Contracts

### Agent Tiers (ERC-721)

| Tier | Name | Description |
|------|------|-------------|
| 0 | Scout | Default on registration |
| 1 | Guardian | Promoted by admin, basic operations |
| 2 | Sentinel | Higher authority, complex strategies |
| 3 | Archon | Maximum trust level, all capabilities |

### Risk Profile (Per User)

```solidity
struct RiskProfile {
    uint256 maxSlippage;           // Max acceptable slippage (bps)
    uint256 stopLossThreshold;     // Stop-loss trigger (bps)
    uint256 maxSingleActionValue;  // Max value per action
    bool allowAutoWithdraw;        // Allow emergency withdrawals
    bool allowAutoSwap;            // Allow auto-rebalancing
}
```

### 5-Vector Risk Analysis

| Vector | Weight | Description |
|--------|--------|-------------|
| **Price Volatility** | 30% | 24h price change magnitude and direction |
| **Liquidity Health** | 25% | Pool liquidity changes and depth |
| **Volume Analysis** | 15% | Trading volume anomalies and spike detection |
| **Holder Concentration** | 15% | Whale ownership and centralization risk |
| **Momentum Analysis** | 15% | Combined trend signals (price × volume × liquidity) |

### Threat Types

| Threat | Trigger | Severity |
|--------|---------|----------|
| Rug Pull | Simultaneous liquidity drain + price crash | CRITICAL |
| Flash Loan Attack | Extreme volume spikes (>1000%) | CRITICAL |
| Whale Movement | Top holder >70% concentration | HIGH |
| Price Crash | >20% decline in 24h | HIGH |
| Liquidity Drain | >25% liquidity decrease | MEDIUM |
| Abnormal Volume | >200% volume increase | LOW |

---

## 📡 Data Sources

| Provider | Data | Type |
|----------|------|------|
| **CoinGecko** | BNB price, 24h change, volume | Free REST API |
| **DeFiLlama** | BSC chain TVL, liquidity | Free REST API |
| **PancakeSwap V2** | On-chain token prices, pair reserves, liquidity | On-chain (ethers.js) |
| **Groq / OpenAI** | LLM market reasoning, threat analysis | Optional API |
| **BSC RPC** | Gas price, block number, contract state | On-chain |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Smart Contracts** | Solidity 0.8.24, OpenZeppelin, Hardhat 2.22.17 |
| **AI Reasoning** | Groq (Llama 3.3 70B) / OpenAI (GPT-4o-mini) with heuristic fallback |
| **DEX Integration** | PancakeSwap V2 Router + Factory (on-chain reads) |
| **Risk Engine** | 5-vector weighted scoring, configurable thresholds |
| **Live Data** | CoinGecko (price/volume), DeFiLlama (TVL/liquidity) |
| **Frontend** | Next.js 14, Tailwind CSS, ethers.js v6, Vercel |
| **Blockchain** | BNB Smart Chain (BSC Testnet), Sourcify verification |
| **Testing** | Hardhat + Chai (54 tests) + 13-phase on-chain demo |

---

## 🔒 Security

- **Non-Custodial**: Users retain full control — emergency withdrawal always available
- **Agent Authorization**: Users explicitly authorize which agents can act on their behalf
- **Risk Profiles**: Per-user configurable limits (slippage, stop-loss, action value caps)
- **On-Chain Audit**: Every AI decision permanently logged with reasoning hash attestation
- **ReentrancyGuard**: All fund-moving functions protected
- **OpenZeppelin**: Battle-tested contract libraries throughout
- **Dual-Source Verification**: CoinGecko + PancakeSwap on-chain prices cross-referenced

---

## 🖥️ Frontend (Vercel-Deployed)

**Live at: [aegis-protocol-1.vercel.app](https://aegis-protocol-1.vercel.app/)**

- **Live market data**: Real-time BNB price from CoinGecko + PancakeSwap V2 on-chain price, auto-refreshing every 30s
- **Price oracle cross-verification**: Shows live delta between API and DEX prices with status indicators
- **No-wallet mode**: Reads on-chain data via public BSC RPC (no MetaMask required)
- **Wallet mode**: Full interaction — deposit, authorize agent, set risk profile, withdraw
- **AI Analysis display**: Real-time AI reasoning driven by live market data, sentiment, risk scores
- **13 TX evidence table**: Every transaction clickable with BSCScan links
- **Auto-refresh**: 30-second polling of on-chain state + market data
- **Contract verification**: BSCScan links, Sourcify badges

---

## 📜 AI Build Log

Built with AI assistance as encouraged by the hackathon:

1. **Competitive Analysis** — Analyzed 40+ competitor submissions to identify unique positioning
2. **3-Contract Architecture** — Designed AegisRegistry + AegisVault + DecisionLogger system
3. **1,326 LOC Solidity** — 3 contracts with 54/54 test coverage
4. **5-Vector Risk Engine** — Weighted scoring with configurable thresholds
5. **LLM AI Engine** — Groq/OpenAI integration for natural language threat analysis (381 LOC)
6. **PancakeSwap Integration** — On-chain DEX price feeds for oracle cross-verification (300 LOC)
7. **CoinGecko + DeFiLlama** — Real-time market data with graceful fallback
8. **13-Phase On-Chain Demo** — Full threat lifecycle executed on BSC Testnet with clickable TX hashes
9. **Next.js Dashboard** — Cyberpunk glassmorphism UI with live contract hooks
10. **Brutal Self-Audit** — Identified and fixed 6 critical weaknesses mid-hackathon
11. **BSC Testnet Deployment** — 3 contracts verified via Sourcify, 13 confirmed transactions with clickable TX hashes
12. **Vercel Deployment** — Live dashboard with public RPC reads (no wallet needed)
13. **AI Build Log** — Comprehensive documentation of AI usage throughout development (see [AI_BUILD_LOG.md](./AI_BUILD_LOG.md))

---

<div align="center">

**Built with 🛡️ for BNB Chain · Good Vibes Only: OpenClaw Edition**

*Aegis Protocol — Your DeFi positions deserve a guardian that never sleeps.*

[Live Dashboard](https://aegis-protocol-1.vercel.app/) · [BSCScan](https://testnet.bscscan.com/address/0xac77139C2856788b7EEff767969353adF95D335e) · [GitHub](https://github.com/Tonyflam/rs)

</div>

<div align="center">

# 🛡️ Aegis Protocol

### AI-Powered Autonomous DeFi Guardian Agent for BNB Chain

[![Built for BNB Chain](https://img.shields.io/badge/Built_for-BNB_Chain-F0B90B?style=for-the-badge&logo=binance)](https://www.bnbchain.org/)
[![Good Vibes Only](https://img.shields.io/badge/Good_Vibes_Only-OpenClaw_Edition-00e0ff?style=for-the-badge)](https://openclaw.xyz)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.24-363636?style=for-the-badge&logo=solidity)](https://soliditylang.org/)
[![Tests](https://img.shields.io/badge/Tests-54%2F54_Passing-22c55e?style=for-the-badge)](./test/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](./LICENSE)

*An autonomous AI agent that monitors your DeFi positions on BNB Chain 24/7, detects risks in real-time, and executes protective on-chain transactions — before you lose money.*

[Live Demo](#live-demo) · [Smart Contracts](#smart-contracts) · [AI Agent](#ai-agent) · [Architecture](#architecture) · [Setup](#setup)

</div>

---

## 🎯 Problem

**DeFi users lose billions every year** to rug pulls, flash loan attacks, liquidity drains, and price crashes. Most of these losses happen when users aren't watching — overnight, during work, or simply because market conditions change faster than humans can react.

Current solutions require:
- ❌ Constant manual monitoring
- ❌ Setting static stop-losses that often fail
- ❌ Trusting centralized services with your keys
- ❌ Technical expertise to detect threats

## 💡 Solution: Aegis Protocol

Aegis is a **fully autonomous AI guardian agent** that:

1. **👁️ OBSERVES** — Continuously monitors your positions, market conditions, liquidity pools, and on-chain activity
2. **🧠 ANALYZES** — AI-powered multi-factor risk analysis using 5 independent risk vectors
3. **⚡ DECIDES** — Threat classification with confidence scoring and reasoning attestation
4. **🛡️ EXECUTES** — Autonomous protective on-chain transactions with user-defined risk parameters

### Key Differentiators

| Feature | Traditional DeFi | Aegis Protocol |
|---------|-----------------|----------------|
| Monitoring | Manual | AI-Powered 24/7 |
| Risk Detection | Price alerts only | 5-vector analysis |
| Response Time | Minutes to hours | Seconds |
| Custody | Give up keys | Non-custodial |
| Transparency | Black box | On-chain decision log |
| Identity | None | ERC-721 agent NFTs |
| Customization | Limited | Per-user risk profiles |

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                      AEGIS PROTOCOL                          │
│                                                              │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐   │
│   │   OBSERVE     │───▶│   ANALYZE     │───▶│   DECIDE     │   │
│   │              │    │              │    │              │   │
│   │ Market Data  │    │ AI Risk      │    │ Threat       │   │
│   │ On-chain     │    │ Assessment   │    │ Detection    │   │
│   │ Positions    │    │ 5 Risk       │    │ Confidence   │   │
│   │ Liquidity    │    │ Vectors      │    │ Scoring      │   │
│   └──────────────┘    └──────────────┘    └──────┬───────┘   │
│                                                  │           │
│   ┌──────────────────────────────────────────────▼───────┐   │
│   │                     EXECUTE                          │   │
│   │                                                      │   │
│   │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │   │
│   │  │AegisRegistry│  │ AegisVault  │  │DecisionLogger│  │   │
│   │  │  (ERC-721)  │  │(Non-Custodial│  │ (Immutable  │  │   │
│   │  │Agent Identity│  │ Protection) │  │  Audit Log) │  │   │
│   │  └─────────────┘  └─────────────┘  └─────────────┘  │   │
│   └──────────────────────────────────────────────────────┘   │
│                         ▲                                    │
│                    BNB Chain                                  │
└──────────────────────────────────────────────────────────────┘
```

### Smart Contract Architecture

| Contract | Purpose | Key Features |
|----------|---------|--------------|
| **AegisRegistry** | Agent identity & reputation | ERC-721 NFTs, 4-tier system (Scout→Guardian→Sentinel→Archon), reputation scoring (1-5), performance tracking |
| **AegisVault** | Non-custodial asset protection | BNB/ERC20 deposits, per-user risk profiles, agent authorization, autonomous protection execution, emergency withdrawal |
| **DecisionLogger** | On-chain decision audit trail | Immutable decision records, risk snapshots, reasoning hashes for AI transparency, 6 decision types |

### AI Risk Analysis Vectors

The AI analyzer evaluates **5 independent risk factors** with weighted scoring:

| Vector | Weight | Description |
|--------|--------|-------------|
| **Price Volatility** | 30% | 24h price change magnitude and direction |
| **Liquidity Health** | 25% | Pool liquidity changes and total liquidity depth |
| **Volume Analysis** | 15% | Trading volume anomalies and spike detection |
| **Holder Concentration** | 15% | Whale ownership and centralization risk |
| **Momentum Analysis** | 15% | Combined trend signals (price × volume × liquidity) |

### Threat Types Detected

- 🔴 **Rug Pull** — Simultaneous liquidity drain + price crash
- 🔴 **Flash Loan Attack** — Extreme volume spikes (>1000%)
- 🟠 **Whale Movement** — Top holder >70% concentration
- 🟠 **Price Crash** — >20% decline in 24h
- 🟡 **Liquidity Drain** — >25% liquidity decrease
- 🟢 **Abnormal Volume** — >200% volume increase

---

## 📂 Project Structure

```
aegis-protocol/
├── contracts/                      # Solidity smart contracts (1,326 LOC)
│   ├── AegisRegistry.sol           # ERC-721 agent identity & reputation (415 LOC)
│   ├── AegisVault.sol              # Non-custodial vault & protection (573 LOC)
│   └── DecisionLogger.sol          # On-chain decision audit log (338 LOC)
├── test/                           # Comprehensive test suites (54 tests)
│   ├── AegisRegistry.test.ts       # 20 tests — registration, tiers, reputation
│   ├── AegisVault.test.ts          # 20 tests — deposits, withdrawals, protection
│   └── DecisionLogger.test.ts      # 14 tests — logging, snapshots, stats
├── scripts/
│   ├── deploy.ts                   # Multi-contract deployment script
│   └── demo-e2e.ts                 # 🔥 Full 10-phase on-chain E2E demo
├── agent/                          # AI Guardian Agent
│   └── src/
│       ├── index.ts                # Main agent loop (Observe→Analyze→Decide→Execute)
│       ├── analyzer.ts             # AI risk analysis engine (5-vector scoring)
│       ├── monitor.ts              # Position & market data monitor (live+fallback)
│       ├── market-provider.ts      # 🔥 CoinGecko + DeFiLlama live data feeds
│       ├── executor.ts             # On-chain transaction executor
│       └── simulate.ts             # Demo simulation (no blockchain required)
├── frontend/                       # Next.js 14 dashboard
│   └── src/
│       ├── app/
│       │   ├── page.tsx            # 🔥 Dashboard with live contract integration
│       │   ├── layout.tsx          # Dark theme layout
│       │   └── globals.css         # Cyberpunk glassmorphism theme
│       └── lib/
│           ├── constants.ts        # Contract addresses & chain config
│           ├── useWallet.ts        # MetaMask wallet hook
│           ├── useContracts.ts     # 🔥 Contract read/write hooks
│           └── abis.ts            # 🔥 Full contract ABIs
├── hardhat.config.ts               # Multi-network configuration
└── README.md                       # This file
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js v18+
- npm or yarn
- MetaMask (for frontend)

### 1. Clone & Install

```bash
git clone https://github.com/Tonyflam/rs.git
cd rs
npm install --legacy-peer-deps
```

### 2. Run Tests (54/54 passing)

```bash
npx hardhat test
```

### 3. Run End-to-End Demo (On-Chain Proof)

This runs a full 10-phase lifecycle demo on a local Hardhat network, demonstrating the complete guardian flow **entirely on-chain**:

```bash
npx hardhat run scripts/demo-e2e.ts
```

**What the demo proves:**

| Phase | Action | Verified On-Chain |
|-------|--------|-------------------|
| 1 | Deploy 3 contracts | ✅ Contract addresses |
| 2 | Configure cross-contract permissions | ✅ Authorization mappings |
| 3 | Register AI agent as ERC-721 NFT | ✅ Token minted, tier set |
| 4 | 2 users deposit 7 BNB total | ✅ Vault balances |
| 5 | Users authorize agent + set risk profiles | ✅ Per-user settings |
| 6 | Normal monitoring cycle → AllClear logged | ✅ Decision record |
| 7 | Price crash → stop-loss executed (2.5 BNB saved) | ✅ Protection action |
| 8 | Rug pull → emergency withdrawal (2.0 BNB saved) | ✅ Emergency action |
| 9 | Users give 5-star reputation feedback | ✅ Reputation updated |
| 10 | Full state verification | ✅ All metrics on-chain |

**Demo Output (verified):**

```
  📊 Agent Performance (On-Chain):
     Name:              Aegis Guardian Alpha
     Total Decisions:   2
     Successful:        2
     Value Protected:   4.5 BNB
     Success Rate:      100%
     Reputation:        5/5.00

  📝 Decision Log (On-Chain):
     Total Decisions:   3
     Threats Detected:  1
     Protections:       1

  🏦 Vault Stats (On-Chain):
     Total Deposited:   2.5 BNB
     Actions Executed:  2
     Value Protected:   4.5 BNB
```

### 4. Run AI Agent Simulation

No blockchain connection needed — demonstrates the full AI analysis pipeline:

```bash
cd agent
npm install
npx ts-node src/simulate.ts
```

### 4. Deploy to BSC Testnet

```bash
cp .env.example .env
# Edit .env with your private key (needs tBNB from faucet)
npx hardhat run scripts/deploy.ts --network bscTestnet
```

### 5. Start the Frontend

```bash
cd frontend
npm install
npm run dev
# Open http://localhost:3000
```

### 6. Run the Live Agent

```bash
cd agent
# Set contract addresses in ../.env
npx ts-node src/index.ts
```

---

## 🧪 Test Results

**54/54 tests passing** across all 3 contracts:

```
  AegisRegistry
    Deployment ✓
    Agent Registration (5 tests) ✓
    Agent Management (3 tests) ✓
    Reputation System (4 tests) ✓
    Agent Stats (4 tests) ✓
    Admin Functions (3 tests) ✓

  AegisVault
    Deployment ✓
    BNB Deposits (3 tests) ✓
    BNB Withdrawals (3 tests) ✓
    Agent Authorization (3 tests) ✓
    Risk Profile (3 tests) ✓
    Protection Execution (4 tests) ✓
    Emergency & Admin (3 tests) ✓

  DecisionLogger
    Deployment ✓
    Decision Logging (4 tests) ✓
    Risk Snapshots (3 tests) ✓
    View Functions (4 tests) ✓
    Admin Functions (2 tests) ✓

  54 passing
```

---

## 🤖 AI Agent Details

### The Observe → Analyze → Decide → Execute Loop

Each cycle (default 30s), the agent:

1. **Observes** real-time market data (price, volume, liquidity, holder distribution)
2. **Analyzes** using 5 weighted risk vectors to produce a composite risk score (0-100)
3. **Decides** by running threat detection against configurable thresholds
4. **Executes** on-chain protective transactions when threats exceed user-defined risk profiles

### Risk Scoring Example

```
📡 Market Data: BNB at $465, -22% 24h, volume +450%

🧠 AI Analysis:
   Overall Risk: 71/100 [HIGH]
   ├─ Price Volatility: 100/100 (weight 0.30)
   ├─ Liquidity Health:  65/100 (weight 0.25)
   ├─ Volume Analysis:   55/100 (weight 0.15)
   ├─ Holder Risk:       15/100 (weight 0.15)
   └─ Momentum:          95/100 (weight 0.15)

⚡ Threat: PRICE_CRASH — Confidence 90%
🛡️ Action: STOP-LOSS executed autonomously
```

### On-Chain Transparency

Every decision is logged with:
- Decision type (RiskAssessment, ThreatDetected, ProtectionTriggered, etc.)
- Risk level (None → Critical)
- Confidence score
- Reasoning hash (keccak256 of AI analysis text)
- Timestamp

This creates an **immutable, auditable record** of all AI agent behavior on BSC.

---

## 📡 Live Data Integration

The agent fetches **real market data** from free, no-key-required APIs:

| Provider | Data | Usage |
|----------|------|-------|
| **CoinGecko** | BNB price, 24h change, 24h volume | Price volatility & volume vectors |
| **DeFiLlama** | BSC chain TVL | Liquidity health vector |
| **BSC RPC** | Gas price, block number | On-chain state |

```typescript
// agent/src/market-provider.ts
const liveData = await liveProvider.fetchLiveData();
// Returns: { price, priceChange24h, volume24h, totalLiquidity, gasPrice, blockNumber }
```

If APIs are unavailable, the agent falls back gracefully to block-seeded simulation data. Controlled via `USE_LIVE_DATA=true` env var.

---

## 🖥️ Frontend Integration

The dashboard connects directly to deployed contracts:

- **Auto-detects** if contracts are deployed (non-zero addresses)
- **Live mode**: Reads agent info, vault stats, decisions, risk snapshots from chain
- **Demo mode**: Falls back to mock data when contracts aren't deployed
- **Real-time**: Auto-refreshes every 30 seconds
- **Write operations**: Deposit BNB, authorize agents, emergency withdraw, give feedback

```typescript
// frontend/src/lib/useContracts.ts
const { agentInfo, vaultStats, decisions, riskSnapshot, isLive } = useContractData(provider);
const { deposit, withdraw, authorizeAgent, emergencyWithdraw } = useContractWrite(signer);
```

---

## ⛓️ Smart Contracts

### Agent Tiers (ERC-721)

| Tier | Name | Requirements |
|------|------|-------------|
| 0 | Scout | Default on registration |
| 1 | Guardian | Promoted by admin |
| 2 | Sentinel | Higher authority |
| 3 | Archon | Maximum trust level |

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

### Protection Actions

| Action | Description |
|--------|-------------|
| EmergencyWithdraw | Immediately withdraw user funds |
| Rebalance | Adjust position allocation |
| AlertOnly | Log alert without moving funds |
| StopLoss | Execute stop-loss at threshold |
| TakeProfit | Lock in gains at target |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Smart Contracts** | Solidity 0.8.24, OpenZeppelin, Hardhat 2.22.17 |
| **AI Agent** | TypeScript, ethers.js v6, Multi-factor analysis |
| **Live Data Feeds** | CoinGecko API (price/volume), DeFiLlama API (TVL/liquidity) |
| **Frontend** | Next.js 14, Tailwind CSS, ethers.js, contract hooks |
| **Blockchain** | BNB Smart Chain (BSC Testnet/Mainnet, opBNB) |
| **Testing** | Hardhat + Chai (54 tests) + E2E demo script |

---

## 🔒 Security

- **Non-Custodial**: Users retain full control. Emergency withdrawal always available.
- **Agent Authorization**: Users explicitly authorize which agents can act.
- **Risk Profiles**: Per-user configurable limits on agent actions.
- **On-Chain Audit**: Every decision permanently logged on BSC.
- **ReentrancyGuard**: All fund-moving functions protected.
- **OpenZeppelin**: Battle-tested contract libraries throughout.

---

## 📜 AI Build Log

This project was built with AI assistance as encouraged by the hackathon:

1. **Competitive Analysis** — Analyzed 40+ competitor submissions to identify unique positioning
2. **Architecture Design** — AI-assisted design of 3-contract system with autonomous agent loop
3. **Smart Contract Development** — 3 Solidity contracts (1,326 LOC) with comprehensive test coverage (54/54)
4. **AI Risk Engine** — Multi-factor weighted risk analysis with 5 vectors and configurable thresholds
5. **Live API Integration** — CoinGecko (BNB price/volume) + DeFiLlama (BSC TVL/liquidity) with fallback
6. **E2E Demo Script** — 10-phase on-chain demo proving full guardian lifecycle
7. **Frontend Dashboard** — Cyberpunk-themed glassmorphism UI with live contract data hooks
8. **Contract Integration** — Full ABI exports + React hooks for read/write contract interaction
9. **Brutal Self-Audit** — Identified and fixed 6 critical weaknesses mid-hackathon
10. **Simulation System** — 5-scenario demo showing all risk levels without blockchain

All code was reviewed, tested, and verified. The AI agent's risk analysis uses transparent, interpretable algorithms for full auditability.

---

<div align="center">

**Built with 🛡️ for BNB Chain · Good Vibes Only: OpenClaw Edition**

*Aegis Protocol — Because your DeFi positions deserve a guardian that never sleeps.*

</div>
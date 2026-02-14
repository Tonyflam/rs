# 🏗️ Architecture — Aegis Protocol

> **Technical Deep Dive into Aegis Protocol's Architecture**

---

## System Overview

Aegis Protocol is an **autonomous AI agent system** that protects DeFi positions on BNB Chain. The system consists of three layers:

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│   Next.js 14 Dashboard — Live data, wallet, contract reads  │
│   (Vercel-deployed, no wallet required for public data)      │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                     AGENT LAYER                              │
│                                                              │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│   │ Monitor  │  │ Analyzer │  │AI Engine │  │ PancakeSwap│  │
│   │ (market  │→ │ (5-vector│→ │ (LLM/    │→ │ (on-chain │  │
│   │  data)   │  │  risk)   │  │  heuristic│  │  prices)  │  │
│   └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
│                                                ↓             │
│                           ┌──────────────────────────┐      │
│                           │ Executor (on-chain TXs)  │      │
│                           └──────────┬───────────────┘      │
└──────────────────────────────────────┼──────────────────────┘
                                       │
┌──────────────────────────────────────▼──────────────────────┐
│                  BLOCKCHAIN LAYER (BSC)                       │
│                                                              │
│   ┌──────────────┐  ┌────────────┐  ┌───────────────┐      │
│   │AegisRegistry │  │ AegisVault │  │DecisionLogger │      │
│   │  (ERC-721)   │  │(Non-Custodial)│  │  (Immutable)  │      │
│   └──────────────┘  └────────────┘  └───────────────┘      │
└──────────────────────────────────────────────────────────────┘
```

---

## Smart Contract Layer

### AegisRegistry.sol (415 LOC)

**Purpose:** On-chain identity and reputation for AI agents

```
AegisRegistry
├── Agent Registration
│   ├── registerAgent(name) → mints ERC-721 NFT
│   ├── Max 100 agents (spam prevention)
│   └── Operator = msg.sender
├── Tier System
│   ├── Scout (0)     — default on registration
│   ├── Guardian (1)  — admin promoted, basic ops
│   ├── Sentinel (2)  — complex strategies
│   └── Archon (3)    — maximum trust, all capabilities
├── Reputation
│   ├── giveFeedback(tokenId, score, comment)
│   ├── score: 1-5 star rating
│   ├── Weighted running average
│   └── Cannot review own agent
└── Performance Tracking
    ├── totalDecisions — cumulative count
    ├── successfulActions — protection triggers
    └── totalValueProtected — BNB protected
```

**Key Design Decision:** Agents are ERC-721 NFTs so their identity and reputation are publicly verifiable on BSCScan. Anyone can inspect Agent #0's stats, tier, and reputation by reading the contract.

### AegisVault.sol (573 LOC)

**Purpose:** Non-custodial asset protection with per-user risk profiles

```
AegisVault
├── Deposits
│   ├── deposit() payable → stores BNB
│   ├── Per-user accounting (not pooled)
│   └── Events: Deposited(user, amount)
├── Risk Profiles (per user)
│   ├── maxSlippage (bps)           — e.g. 50 = 0.5%
│   ├── stopLossThreshold (bps)     — e.g. 1000 = 10%
│   ├── maxSingleActionValue (wei)  — cap per action
│   ├── allowAutoWithdraw (bool)    — auto exit enabled
│   └── allowAutoSwap (bool)        — auto rebalance enabled
├── Agent Authorization
│   ├── authorizeAgent(agentId) — user grants permission
│   ├── Only 1 agent per user
│   └── Agent must exist in Registry
├── Protection Execution
│   ├── executeProtection(user, actionType, amount, reason)
│   ├── Caller must be authorized agent's operator
│   ├── Amount ≤ maxSingleActionValue
│   └── Respects risk profile flags
└── Emergency
    ├── emergencyWithdraw() — bypasses agent, always works
    └── Owner-only pause/unpause
```

**Key Design Decision:** Non-custodial means the AI agent is AUTHORIZED to act on behalf of the user, but the user can ALWAYS emergency withdraw. The agent cannot lock funds or prevent exit.

### DecisionLogger.sol (338 LOC)

**Purpose:** Immutable on-chain audit trail for every AI decision

```
DecisionLogger
├── Decision Logging
│   ├── logDecision(agentId, user, type, risk, confidence, 
│   │              analysisHash, dataHash, actionTaken, actionId)
│   ├── 6 Decision Types:
│   │   ├── RiskAssessment (0)
│   │   ├── ThreatDetected (1)
│   │   ├── ProtectionTriggered (2)
│   │   ├── AllClear (3)
│   │   ├── MarketAnalysis (4)
│   │   └── PositionReview (5)
│   └── 5 Risk Levels: None, Low, Medium, High, Critical
├── Risk Snapshots
│   ├── updateRiskSnapshot(user, overall, liq, vol, proto, sc, hash)
│   ├── Stored per-user with history
│   └── Queryable latest + historical
├── AI Attestation
│   ├── analysisHash = keccak256(AI reasoning text)
│   ├── dataHash = keccak256(market data JSON)
│   └── Both stored permanently on-chain
└── Authorization
    ├── onlyAuthorizedLogger modifier
    └── Owner sets authorized loggers
```

**Key Innovation: AI Reasoning Attestation**

```
Off-chain:
  AI produces reasoning text → "BNB dropped -15.3% with sell volume..."
  Hash: keccak256(reasoning) → 0xabc123...

On-chain:
  DecisionLogger stores: { analysisHash: 0xabc123..., actionTaken: true }

Verification:
  Anyone can hash the original text and compare → proves AI made that specific decision
```

---

## Agent Layer

### Main Loop (index.ts, 292 LOC)

The agent runs a continuous 30-second cycle:

```
┌─────────────────────────────────────────────────────────┐
│ CYCLE #N (every 30 seconds)                              │
│                                                          │
│ Phase 1: OBSERVE                                         │
│   └── monitor.getMarketData()                            │
│       ├── CoinGecko → BNB price, volume, 24h change     │
│       └── DeFiLlama → BSC TVL, liquidity                │
│                                                          │
│ Phase 2: ANALYZE                                         │
│   └── analyzer.analyzeRisk(marketData)                   │
│       └── 5-vector weighted scoring → RiskSnapshot       │
│                                                          │
│ Phase 2.5: AI REASON                                     │
│   └── aiEngine.analyzeMarket(marketData, riskSnapshot)   │
│       ├── [LLM] Groq/OpenAI structured JSON analysis     │
│       └── [Fallback] Heuristic rule-based analysis       │
│                                                          │
│ Phase 2.7: DEX VERIFY                                    │
│   └── pancakeSwap.getBNBPrice()                          │
│       └── Compare API price vs on-chain DEX price        │
│                                                          │
│ Phase 3: DECIDE                                          │
│   └── analyzer.detectThreats(marketData)                 │
│       └── ThreatAssessment { detected, type, severity }  │
│                                                          │
│ Phase 4: EXECUTE                                         │
│   ├── executor.logRiskSnapshot(riskSnapshot)             │
│   ├── executor.logDecision(threat, user, reasoningHash)  │
│   └── IF severity >= HIGH:                               │
│       └── executor.executeProtection(user, action)       │
│                                                          │
│ Hash combines: heuristic reasoning + LLM analysis        │
│ → keccak256(combined) stored on-chain as attestation     │
└─────────────────────────────────────────────────────────┘
```

### 5-Vector Risk Analyzer (analyzer.ts, 449 LOC)

```
Input: MarketData {
  price, priceChange24h, volume24h, volumeChange,
  liquidity, liquidityChange, holders, topHolderPercent,
  gasPrice, pendingTxCount
}

Processing:
  priceScore    = f(priceChange24h)    × 0.30
  liquidityScore = f(liquidityChange)  × 0.25
  volumeScore   = f(volumeChange)      × 0.15
  holderScore   = f(topHolderPercent)   × 0.15
  momentumScore = f(price × vol × liq) × 0.15

Output: RiskSnapshot {
  overallRisk: 0-100,
  riskLevel: None|Low|Medium|High|Critical,
  confidence: 0-100,
  factors: [{ name, score, weight, description }]
}
```

### AI Reasoning Engine (ai-engine.ts, 381 LOC)

```
                    ┌─────────────────┐
                    │  Market Data    │
                    │  Risk Snapshot  │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  Has API Key?   │
                    └────┬───────┬────┘
                    YES  │       │  NO
               ┌─────────▼──┐ ┌─▼──────────┐
               │  LLM Call   │ │  Heuristic  │
               │  (Groq/     │ │  Fallback   │
               │   OpenAI)   │ │  Engine     │
               └──────┬──────┘ └──────┬──────┘
                      │               │
                      └───────┬───────┘
                              │
                    ┌─────────▼─────────┐
                    │   AIAnalysis {    │
                    │     reasoning,    │
                    │     riskScore,    │
                    │     confidence,   │
                    │     threats,      │
                    │     sentiment,    │
                    │     insights      │
                    │   }              │
                    └──────────────────┘
```

**Dual-mode design** ensures the agent works reliably:
- **With API key:** Full LLM analysis with nuanced natural language reasoning
- **Without API key:** Deterministic heuristic engine produces identical output format
- **Cross-validation:** When both are available, heuristic catches LLM hallucinations

### PancakeSwap Provider (pancakeswap.ts, 300 LOC)

```
BSC Mainnet RPC
  └── PancakeSwap V2 Contracts
      ├── Router (0x10ED43C718714eb63d5aA57B78B54704E256024E)
      │   └── getAmountsOut(1 WBNB, [WBNB, BUSD]) → BNB/USD price
      └── Factory (0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73)
          └── getPair(tokenA, tokenB) → pair address → reserves

Functions:
  getTokenPriceUSD(address) → routes TOKEN→WBNB→BUSD
  getBNBPrice()             → direct WBNB→BUSD
  getPairData(tokenA, tokenB) → reserves, symbols, USD liquidity
  analyzeTokenRisk(address)   → liquidity depth, concentration flags

Cache: 30-second TTL to avoid excessive RPC calls
```

---

## Data Flow Diagram

```
┌──────────┐  ┌──────────┐  ┌────────────┐  ┌──────────┐
│CoinGecko │  │DeFiLlama │  │ PancakeSwap│  │Groq/GPT  │
│ (price,  │  │ (TVL,    │  │ V2 Router  │  │ (LLM     │
│  volume) │  │  liquidity│  │ (on-chain) │  │  reasoning│
└────┬─────┘  └────┬─────┘  └──────┬─────┘  └────┬─────┘
     │             │               │              │
     └──────┬──────┘               │              │
            │                      │              │
     ┌──────▼──────┐        ┌─────▼─────┐  ┌────▼─────┐
     │   Monitor   │        │ PancakeSwap│  │AI Engine │
     │ (aggregate) │        │  Provider  │  │(analyze) │
     └──────┬──────┘        └─────┬─────┘  └────┬─────┘
            │                     │              │
     ┌──────▼──────┐              │              │
     │  Analyzer   │◄─────────────┘              │
     │ (5-vector)  │◄───────────────────────────-┘
     └──────┬──────┘
            │
     ┌──────▼──────┐
     │  Executor   │
     │ (on-chain)  │
     └──────┬──────┘
            │
     ┌──────▼──────────────────────────────────┐
     │           BSC Testnet (Chain 97)         │
     │  Registry ─── Vault ─── DecisionLogger  │
     └─────────────────────────────────────────┘
```

---

## Security Architecture

### Threat Model

| Threat | Mitigation |
|--------|-----------|
| Rogue agent drains vault | `maxSingleActionValue` caps per-action limits; `emergencyWithdraw()` always available |
| LLM hallucination triggers bad action | Heuristic cross-check validates LLM output; confidence thresholds gate actions |
| Oracle manipulation | Dual-source price verification (CoinGecko API vs PancakeSwap on-chain) |
| Reentrancy attacks | OpenZeppelin `ReentrancyGuard` on all fund-moving functions |
| Contract compromise | `Pausable` by owner; separate contracts limit blast radius |
| Unauthorized logging | `onlyAuthorizedLogger` modifier on all DecisionLogger write functions |
| Agent impersonation | ERC-721 NFT identity with operator address verification |

### Access Control Matrix

| Function | Owner | Agent Operator | User | Anyone |
|----------|-------|---------------|------|--------|
| Register agent | ✓ | ✓ | ✓ | ✓ |
| Promote agent tier | ✓ | | | |
| Deposit to vault | | | ✓ | ✓ |
| Authorize agent | | | ✓ | |
| Execute protection | | ✓ (authorized) | | |
| Emergency withdraw | | | ✓ | |
| Log decision | | ✓ (authorized) | | |
| Pause contracts | ✓ | | | |
| Read any data | ✓ | ✓ | ✓ | ✓ |

---

## Technology Stack

| Component | Technology | Why |
|-----------|-----------|-----|
| Smart Contracts | Solidity 0.8.24 | Latest stable with via-IR optimizer |
| Framework | Hardhat 2.22.17 | Industry standard for BSC |
| Libraries | OpenZeppelin 5.1 | Battle-tested ERC-721, security |
| Agent Runtime | TypeScript + Node.js | Type safety, async I/O |
| LLM Provider | Groq (Llama 3.3 70B) | Free tier, fast inference |
| LLM Fallback | OpenAI (GPT-4o-mini) | Reliable alternative |
| DEX Integration | PancakeSwap V2 | Largest BSC DEX by volume |
| Market Data | CoinGecko + DeFiLlama | Free, no API key required |
| Frontend | Next.js 14 | App Router, SSG, Vercel native |
| Styling | Tailwind CSS | Utility-first, responsive |
| Blockchain | ethers.js v6 | Modern, TypeScript-native |
| Deployment | Vercel | Auto-deploy from git push |
| Verification | Sourcify | Open-source contract verification |
| Testing | Hardhat + Chai | 54 tests, comprehensive coverage |

---

<div align="center">

**Aegis Protocol Architecture — Designed for autonomous, verifiable DeFi protection**

</div>

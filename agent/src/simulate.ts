// ═══════════════════════════════════════════════════════════════
// Aegis Protocol — Simulation Demo
// Runs a complete agent cycle with simulated market scenarios
// No blockchain connection required — perfect for demos
// ═══════════════════════════════════════════════════════════════

import { RiskAnalyzer, MarketData, RiskLevel, ThreatType } from "./analyzer";

console.log(`
╔═══════════════════════════════════════════════════════════════╗
║   AEGIS PROTOCOL — AI GUARDIAN SIMULATION                     ║
║   Demonstrating autonomous risk detection & protection        ║
╚═══════════════════════════════════════════════════════════════╝
`);

const analyzer = new RiskAnalyzer();

// ─── Define Market Scenarios ──────────────────────────────────

const scenarios: { name: string; data: MarketData; expected: string }[] = [
  {
    name: "🟢 Normal Market — All Clear",
    data: {
      price: 585,
      priceChange24h: 1.2,
      volume24h: 600_000_000,
      volumeChange: 15,
      liquidity: 2_100_000_000,
      liquidityChange: 2.5,
      holders: 1_520_000,
      topHolderPercent: 8.3,
    },
    expected: "No threats — agent monitors passively",
  },
  {
    name: "🟡 Moderate Volatility — Increased Monitoring",
    data: {
      price: 560,
      priceChange24h: -6.5,
      volume24h: 900_000_000,
      volumeChange: 180,
      liquidity: 1_900_000_000,
      liquidityChange: -8,
      holders: 1_510_000,
      topHolderPercent: 9.1,
    },
    expected: "Low threat — abnormal volume detected",
  },
  {
    name: "🟠 High Risk — Price Crash",
    data: {
      price: 465,
      priceChange24h: -22,
      volume24h: 2_500_000_000,
      volumeChange: 450,
      liquidity: 1_400_000_000,
      liquidityChange: -18,
      holders: 1_480_000,
      topHolderPercent: 11.5,
    },
    expected: "HIGH threat — stop-loss triggered",
  },
  {
    name: "🔴 CRITICAL — Rug Pull Pattern",
    data: {
      price: 180,
      priceChange24h: -68,
      volume24h: 5_000_000_000,
      volumeChange: 1200,
      liquidity: 200_000_000,
      liquidityChange: -85,
      holders: 1_200_000,
      topHolderPercent: 45,
    },
    expected: "CRITICAL — emergency withdrawal triggered",
  },
  {
    name: "🐋 Whale Concentration Warning",
    data: {
      price: 575,
      priceChange24h: -2,
      volume24h: 700_000_000,
      volumeChange: 60,
      liquidity: 1_800_000_000,
      liquidityChange: -3,
      holders: 800_000,
      topHolderPercent: 72,
    },
    expected: "HIGH — whale concentration risk",
  },
];

// ─── Run Simulation ───────────────────────────────────────────

for (let i = 0; i < scenarios.length; i++) {
  const scenario = scenarios[i];
  
  console.log(`\n${"═".repeat(65)}`);
  console.log(`  Scenario ${i + 1}/${scenarios.length}: ${scenario.name}`);
  console.log(`  Expected: ${scenario.expected}`);
  console.log(`${"═".repeat(65)}\n`);

  // Phase 1: Market Data
  console.log("📡 Market Data:");
  console.log(`   Price: $${scenario.data.price}`);
  console.log(`   24h Change: ${scenario.data.priceChange24h > 0 ? '+' : ''}${scenario.data.priceChange24h}%`);
  console.log(`   Volume: $${(scenario.data.volume24h / 1e6).toFixed(0)}M (${scenario.data.volumeChange > 0 ? '+' : ''}${scenario.data.volumeChange}%)`);
  console.log(`   Liquidity: $${(scenario.data.liquidity / 1e9).toFixed(2)}B (${scenario.data.liquidityChange > 0 ? '+' : ''}${scenario.data.liquidityChange}%)`);
  console.log(`   Top Holder: ${scenario.data.topHolderPercent}%`);

  // Phase 2: Risk Analysis
  const risk = analyzer.analyzeRisk(scenario.data);
  const LEVELS = ["NONE", "LOW", "MEDIUM", "HIGH", "CRITICAL"];
  
  console.log("\n🧠 AI Risk Analysis:");
  console.log(`   Overall Risk: ${risk.overallRisk}/100 [${LEVELS[risk.riskLevel]}]`);
  console.log(`   Confidence: ${risk.confidence}%`);
  console.log(`   ├─ Liquidation: ${risk.liquidationRisk}/100`);
  console.log(`   ├─ Volatility:  ${risk.volatilityRisk}/100`);
  console.log(`   ├─ Protocol:    ${risk.protocolRisk}/100`);
  console.log(`   └─ Smart Contract: ${risk.smartContractRisk}/100`);
  
  for (const factor of risk.factors) {
    const bar = "█".repeat(Math.round(factor.score / 5)) + "░".repeat(20 - Math.round(factor.score / 5));
    console.log(`   [${bar}] ${factor.name}: ${factor.score}/100`);
  }

  // Phase 3: Threat Detection
  const threat = analyzer.detectThreats(scenario.data);
  
  console.log("\n⚡ Threat Detection:");
  if (threat.threatDetected) {
    console.log(`   🚨 THREAT: ${threat.threatType}`);
    console.log(`   Severity: ${LEVELS[threat.severity]}`);
    console.log(`   Confidence: ${threat.confidence}%`);
    console.log(`   Est. Impact: ${threat.estimatedImpact}%`);
    console.log(`   Action: ${threat.suggestedAction}`);
    console.log(`   Reasoning: ${threat.reasoning}`);
  } else {
    console.log("   ✅ No threats detected — all systems nominal");
  }

  // Phase 4: Agent Decision
  console.log("\n🔐 Agent Decision:");
  if (threat.severity >= RiskLevel.CRITICAL) {
    console.log("   🛡️  ACTION: EMERGENCY WITHDRAW — protecting all user funds");
    console.log("   → Would execute: vault.executeProtection(user, 0, balance, reason)");
    console.log("   → Would log: logger.logDecision(agentId, 2, 4, confidence, user, hash)");
  } else if (threat.severity >= RiskLevel.HIGH) {
    console.log("   ⚠️  ACTION: STOP-LOSS / REDUCE EXPOSURE");
    console.log("   → Would execute: vault.executeProtection(user, 3, value, reason)");
    console.log("   → Would log: logger.logDecision(agentId, 1, 3, confidence, user, hash)");
  } else if (threat.severity >= RiskLevel.LOW) {
    console.log("   👁️  ACTION: INCREASED MONITORING — no on-chain action needed");
    console.log("   → Would log: logger.logDecision(agentId, 4, 1, confidence, user, hash)");
  } else {
    console.log("   ✅ ACTION: CONTINUE MONITORING — no intervention needed");
    console.log("   → Would log: logger.logDecision(agentId, 3, 0, confidence, user, hash)");
  }

  // Reasoning hash for on-chain attestation
  const hash = analyzer.getReasoningHash(risk.reasoning);
  console.log(`   📝 Reasoning Hash: ${hash.slice(0, 20)}...`);
}

// ─── Summary ──────────────────────────────────────────────────

console.log(`\n${"═".repeat(65)}`);
console.log("  SIMULATION COMPLETE");
console.log(`${"═".repeat(65)}`);
console.log(`\n  Scenarios processed: ${scenarios.length}`);
console.log(`  Risk assessments: ${analyzer.getHistory().length}`);

const criticalCount = analyzer.getHistory().filter(r => r.riskLevel >= RiskLevel.CRITICAL).length;
const highCount = analyzer.getHistory().filter(r => r.riskLevel >= RiskLevel.HIGH).length;
console.log(`  Critical risks found: ${criticalCount}`);
console.log(`  High+ risks found: ${highCount}`);
console.log(`\n  The Aegis Agent successfully analyzed all scenarios,`);
console.log(`  detected threats, and would have executed protective`);
console.log(`  actions autonomously on BNB Chain.\n`);

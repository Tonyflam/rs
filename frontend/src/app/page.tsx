"use client";

import { useState } from "react";
import { useWallet } from "../lib/useWallet";
import { RISK_LEVELS, RISK_COLORS } from "../lib/constants";
import {
  Shield,
  Activity,
  AlertTriangle,
  CheckCircle,
  Wallet,
  Bot,
  BarChart3,
  Zap,
  Eye,
  ArrowRight,
  ExternalLink,
  Github,
} from "lucide-react";

// ─── Mock Data (simulates real-time agent data) ───────────────
const MOCK_STATS = {
  totalValueProtected: "2,847.5",
  activeAgents: 12,
  threatsDetected: 47,
  protectionRate: "99.7",
  totalDecisions: 1284,
  totalDeposited: "156.8",
};

const MOCK_DECISIONS = [
  { id: 1, agent: "Guardian Alpha", type: "ThreatDetected", risk: 4, confidence: 97.2, user: "0x7a3...f91", time: "2 min ago", action: true },
  { id: 2, agent: "Guardian Alpha", type: "RiskAssessment", risk: 1, confidence: 89.5, user: "0xb4e...2c8", time: "5 min ago", action: false },
  { id: 3, agent: "Guardian Alpha", type: "ProtectionTriggered", risk: 3, confidence: 94.1, user: "0x3d1...a47", time: "12 min ago", action: true },
  { id: 4, agent: "Guardian Alpha", type: "AllClear", risk: 0, confidence: 99.8, user: "0x9f2...b63", time: "18 min ago", action: false },
  { id: 5, agent: "Guardian Alpha", type: "MarketAnalysis", risk: 2, confidence: 86.3, user: "0x1e5...d94", time: "25 min ago", action: false },
];

const MOCK_POSITIONS = [
  { user: "0x7a3...f91", balance: "12.5 BNB", risk: 1, agent: "Guardian Alpha", lastAction: "5 min ago" },
  { user: "0xb4e...2c8", balance: "8.2 BNB", risk: 0, agent: "Guardian Alpha", lastAction: "1 hr ago" },
  { user: "0x3d1...a47", balance: "45.0 BNB", risk: 2, agent: "Guardian Alpha", lastAction: "12 min ago" },
  { user: "0x9f2...b63", balance: "3.7 BNB", risk: 0, agent: "Guardian Alpha", lastAction: "2 hrs ago" },
];

export default function Home() {
  const { address, isConnected, connect, disconnect, isConnecting, switchToBsc, chainId } = useWallet();
  const [activeTab, setActiveTab] = useState<"overview" | "decisions" | "positions" | "agent">("overview");

  return (
    <div className="min-h-screen">
      {/* ═══ NAVBAR ═══ */}
      <nav className="glass-card mx-4 mt-4 px-6 py-4 flex items-center justify-between" style={{ borderRadius: "12px" }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, rgba(0,224,255,0.2), rgba(168,85,247,0.2))" }}>
            <Shield className="w-6 h-6 text-[#00e0ff]" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              <span className="text-[#00e0ff] cyan-glow">Aegis</span>{" "}
              <span className="text-gray-300">Protocol</span>
            </h1>
            <p className="text-xs text-gray-500">AI-Powered DeFi Guardian</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)" }}>
            <div className="w-2 h-2 rounded-full bg-green-500 pulse-live" />
            <span className="text-green-400 text-sm font-medium">Agent Live</span>
          </div>
          
          {isConnected ? (
            <div className="flex items-center gap-3">
              {chainId !== 97 && (
                <button onClick={switchToBsc} className="text-sm text-yellow-400 hover:text-yellow-300 transition-colors">
                  Switch to BSC
                </button>
              )}
              <div className="glass-card px-4 py-2" style={{ borderRadius: "10px" }}>
                <span className="text-sm text-gray-400">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </span>
              </div>
              <button onClick={disconnect} className="text-sm text-gray-500 hover:text-red-400 transition-colors">
                Disconnect
              </button>
            </div>
          ) : (
            <button onClick={connect} disabled={isConnecting} className="btn-primary flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </button>
          )}
        </div>
      </nav>

      {/* ═══ HERO SECTION ═══ */}
      <section className="px-4 pt-16 pb-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ background: "rgba(0,224,255,0.08)", border: "1px solid rgba(0,224,255,0.15)" }}>
          <Zap className="w-4 h-4 text-[#00e0ff]" />
          <span className="text-sm text-[#00e0ff]">Good Vibes Only: OpenClaw Edition</span>
        </div>
        
        <h2 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
          <span className="text-white">Your AI Guardian</span>
          <br />
          <span className="text-[#00e0ff] cyan-glow">Never Sleeps</span>
        </h2>
        
        <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
          Aegis is an autonomous AI agent that monitors your DeFi positions on BNB Chain 24/7, 
          detects risks in real-time, and executes protective on-chain transactions — 
          before you lose money.
        </p>

        <div className="flex items-center justify-center gap-4 mb-12">
          <button onClick={connect} className="btn-primary flex items-center gap-2 text-lg px-8 py-4">
            <Shield className="w-5 h-5" />
            Launch Dashboard
            <ArrowRight className="w-5 h-5" />
          </button>
          <a href="https://github.com/Tonyflam/rs" target="_blank" rel="noopener noreferrer" className="glass-card px-8 py-4 flex items-center gap-2 text-gray-300 hover:text-white transition-colors" style={{ borderRadius: "12px" }}>
            <Github className="w-5 h-5" />
            View Source
          </a>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {[
            { label: "Value Protected", value: `${MOCK_STATS.totalValueProtected} BNB`, icon: Shield },
            { label: "Active Agents", value: MOCK_STATS.activeAgents.toString(), icon: Bot },
            { label: "Threats Detected", value: MOCK_STATS.threatsDetected.toString(), icon: AlertTriangle },
            { label: "Protection Rate", value: `${MOCK_STATS.protectionRate}%`, icon: CheckCircle },
          ].map((stat, i) => (
            <div key={i} className="glass-card glow-border p-5 text-center" style={{ borderRadius: "14px" }}>
              <stat.icon className="w-6 h-6 text-[#00e0ff] mx-auto mb-2" />
              <p className="stat-number">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ DASHBOARD TABS ═══ */}
      <section className="px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          {/* Tab Navigation */}
          <div className="flex gap-1 mb-6 glass-card p-1.5 w-fit mx-auto" style={{ borderRadius: "12px" }}>
            {([
              { key: "overview", label: "Overview", icon: BarChart3 },
              { key: "decisions", label: "AI Decisions", icon: Activity },
              { key: "positions", label: "Positions", icon: Eye },
              { key: "agent", label: "Agent Info", icon: Bot },
            ] as const).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? "bg-[#00e0ff]/10 text-[#00e0ff] border border-[#00e0ff]/20"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "overview" && <OverviewTab />}
          {activeTab === "decisions" && <DecisionsTab />}
          {activeTab === "positions" && <PositionsTab />}
          {activeTab === "agent" && <AgentTab />}
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section className="px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">
            How <span className="text-[#00e0ff]">Aegis</span> Protects You
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Eye,
                title: "24/7 Monitoring",
                desc: "AI continuously scans your DeFi positions, analyzing market conditions, liquidity changes, and protocol health in real-time.",
              },
              {
                icon: AlertTriangle,
                title: "Threat Detection",
                desc: "Advanced risk analysis identifies rug pulls, liquidity drains, flash loan attacks, and abnormal price movements before damage occurs.",
              },
              {
                icon: Shield,
                title: "Auto-Protection",
                desc: "When threats exceed your risk threshold, Aegis autonomously executes protective actions — emergency withdrawals, stop-losses, and rebalances.",
              },
              {
                icon: Activity,
                title: "On-Chain Transparency",
                desc: "Every decision is logged immutably on BSC with AI reasoning hashes. Full audit trail for complete accountability.",
              },
              {
                icon: Bot,
                title: "ERC-8004 Identity",
                desc: "Each agent has a verifiable on-chain identity as an ERC-721 NFT with reputation scoring and performance tracking.",
              },
              {
                icon: Zap,
                title: "User-Controlled Risk",
                desc: "Set your own risk parameters — max slippage, stop-loss thresholds, action limits. You define the rules, AI enforces them.",
              },
            ].map((feature, i) => (
              <div key={i} className="glass-card glow-border p-6 group hover:scale-[1.02] transition-transform" style={{ borderRadius: "16px" }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: "rgba(0,224,255,0.1)" }}>
                  <feature.icon className="w-6 h-6 text-[#00e0ff] group-hover:scale-110 transition-transform" />
                </div>
                <h4 className="text-lg font-semibold mb-2 text-white">{feature.title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="glass-card mx-4 mb-4 px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderRadius: "12px" }}>
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#00e0ff]" />
          <span className="text-gray-400">Aegis Protocol — Built for Good Vibes Only: OpenClaw Edition</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="https://testnet.bscscan.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#00e0ff] transition-colors flex items-center gap-1 text-sm">
            BSCScan <ExternalLink className="w-3 h-3" />
          </a>
          <a href="https://github.com/Tonyflam/rs" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#00e0ff] transition-colors flex items-center gap-1 text-sm">
            GitHub <ExternalLink className="w-3 h-3" />
          </a>
          <span className="text-gray-600 text-sm">BNB Chain</span>
        </div>
      </footer>
    </div>
  );
}

// ─── TAB: Overview ────────────────────────────────────────────
function OverviewTab() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Risk Gauge */}
      <div className="glass-card glow-border p-6" style={{ borderRadius: "16px" }}>
        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#00e0ff]" />
          System Risk Overview
        </h4>
        <div className="space-y-4">
          {[
            { label: "Liquidation Risk", value: 12, color: "#22c55e" },
            { label: "Volatility", value: 45, color: "#eab308" },
            { label: "Protocol Risk", value: 8, color: "#22c55e" },
            { label: "Smart Contract Risk", value: 15, color: "#22c55e" },
          ].map((risk, i) => (
            <div key={i}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">{risk.label}</span>
                <span className="font-mono" style={{ color: risk.color }}>{risk.value}%</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${risk.value}%`, background: risk.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-card glow-border p-6" style={{ borderRadius: "16px" }}>
        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-[#00e0ff]" />
          Recent Activity
        </h4>
        <div className="space-y-3">
          {MOCK_DECISIONS.slice(0, 4).map((d) => (
            <div key={d.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "rgba(0,0,0,0.2)" }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${RISK_COLORS[d.risk]}15` }}>
                {d.risk >= 3 ? (
                  <AlertTriangle className="w-4 h-4" style={{ color: RISK_COLORS[d.risk] }} />
                ) : (
                  <CheckCircle className="w-4 h-4" style={{ color: RISK_COLORS[d.risk] }} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{d.type.replace(/([A-Z])/g, " $1").trim()}</p>
                <p className="text-xs text-gray-500">{d.user} · {d.time}</p>
              </div>
              <span className="text-xs font-mono px-2 py-1 rounded-md" style={{ background: `${RISK_COLORS[d.risk]}15`, color: RISK_COLORS[d.risk] }}>
                {RISK_LEVELS[d.risk]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Protocol Stats */}
      <div className="glass-card glow-border p-6 md:col-span-2" style={{ borderRadius: "16px" }}>
        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-[#00e0ff]" />
          Protocol Statistics
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: "Total Decisions", value: MOCK_STATS.totalDecisions },
            { label: "Value Protected", value: `${MOCK_STATS.totalValueProtected} BNB` },
            { label: "Total Deposited", value: `${MOCK_STATS.totalDeposited} BNB` },
            { label: "Threats Blocked", value: MOCK_STATS.threatsDetected },
            { label: "Success Rate", value: `${MOCK_STATS.protectionRate}%` },
          ].map((stat, i) => (
            <div key={i} className="text-center p-4 rounded-xl" style={{ background: "rgba(0,0,0,0.2)" }}>
              <p className="stat-number text-2xl">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── TAB: AI Decisions ────────────────────────────────────────
function DecisionsTab() {
  return (
    <div className="glass-card glow-border overflow-hidden" style={{ borderRadius: "16px" }}>
      <div className="p-6 border-b" style={{ borderColor: "rgba(0,224,255,0.1)" }}>
        <h4 className="text-lg font-semibold flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#00e0ff]" />
          AI Decision Log
          <span className="text-xs text-gray-500 ml-2">(On-chain verified)</span>
        </h4>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-sm text-gray-500 border-b" style={{ borderColor: "rgba(0,224,255,0.05)" }}>
              <th className="px-6 py-3 text-left">ID</th>
              <th className="px-6 py-3 text-left">Agent</th>
              <th className="px-6 py-3 text-left">Type</th>
              <th className="px-6 py-3 text-left">Risk</th>
              <th className="px-6 py-3 text-left">Confidence</th>
              <th className="px-6 py-3 text-left">User</th>
              <th className="px-6 py-3 text-left">Time</th>
              <th className="px-6 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_DECISIONS.map((d) => (
              <tr key={d.id} className="border-b hover:bg-white/[0.02] transition-colors" style={{ borderColor: "rgba(0,224,255,0.03)" }}>
                <td className="px-6 py-4 text-sm font-mono text-gray-400">#{d.id}</td>
                <td className="px-6 py-4 text-sm">{d.agent}</td>
                <td className="px-6 py-4">
                  <span className="text-sm px-2 py-1 rounded-md" style={{ background: "rgba(0,224,255,0.08)", color: "#00e0ff" }}>
                    {d.type.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium px-2 py-1 rounded-md" style={{ background: `${RISK_COLORS[d.risk]}15`, color: RISK_COLORS[d.risk] }}>
                    {RISK_LEVELS[d.risk]}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-mono">{d.confidence}%</td>
                <td className="px-6 py-4 text-sm font-mono text-gray-400">{d.user}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{d.time}</td>
                <td className="px-6 py-4">
                  {d.action ? (
                    <span className="flex items-center gap-1 text-sm text-green-400">
                      <CheckCircle className="w-4 h-4" /> Executed
                    </span>
                  ) : (
                    <span className="text-sm text-gray-500">Monitor</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── TAB: Positions ───────────────────────────────────────────
function PositionsTab() {
  return (
    <div className="space-y-6">
      <div className="glass-card glow-border p-6" style={{ borderRadius: "16px" }}>
        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Eye className="w-5 h-5 text-[#00e0ff]" />
          Protected Positions
        </h4>
        <div className="grid gap-4">
          {MOCK_POSITIONS.map((pos, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl" style={{ background: "rgba(0,0,0,0.2)" }}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${RISK_COLORS[pos.risk]}15` }}>
                  <Wallet className="w-5 h-5" style={{ color: RISK_COLORS[pos.risk] }} />
                </div>
                <div>
                  <p className="font-mono text-sm">{pos.user}</p>
                  <p className="text-xs text-gray-500">Last action: {pos.lastAction}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-sm font-semibold">{pos.balance}</p>
                  <p className="text-xs text-gray-500">Deposited</p>
                </div>
                <span className="text-xs font-medium px-3 py-1.5 rounded-lg" style={{ background: `${RISK_COLORS[pos.risk]}15`, color: RISK_COLORS[pos.risk] }}>
                  {RISK_LEVELS[pos.risk]}
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Bot className="w-3 h-3" /> {pos.agent}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deposit CTA */}
      <div className="glass-card glow-border p-8 text-center" style={{ borderRadius: "16px" }}>
        <Shield className="w-12 h-12 text-[#00e0ff] mx-auto mb-4" />
        <h4 className="text-xl font-semibold mb-2">Protect Your DeFi Position</h4>
        <p className="text-gray-400 mb-6 max-w-md mx-auto">
          Deposit BNB into the Aegis Vault, authorize your AI guardian, and sleep peacefully knowing your assets are protected 24/7.
        </p>
        <button className="btn-primary text-lg px-8 py-4 flex items-center gap-2 mx-auto">
          <Wallet className="w-5 h-5" />
          Deposit &amp; Protect
        </button>
      </div>
    </div>
  );
}

// ─── TAB: Agent Info ──────────────────────────────────────────
function AgentTab() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Agent Card */}
      <div className="glass-card glow-border p-6" style={{ borderRadius: "16px" }}>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, rgba(0,224,255,0.2), rgba(168,85,247,0.2))" }}>
            <Bot className="w-8 h-8 text-[#00e0ff]" />
          </div>
          <div>
            <h4 className="text-xl font-bold">Guardian Alpha</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs px-2 py-0.5 rounded-md bg-[#00e0ff]/10 text-[#00e0ff] border border-[#00e0ff]/20">
                Archon Tier
              </span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-green-500/10 text-green-400 border border-green-500/20 flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 pulse-live" />
                Active
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {[
            { label: "Agent ID", value: "#0 (ERC-721)" },
            { label: "Operator", value: "0x7a3...f91" },
            { label: "Registered", value: "Feb 10, 2026" },
            { label: "Total Decisions", value: "1,284" },
            { label: "Successful Actions", value: "47" },
            { label: "Success Rate", value: "99.7%" },
            { label: "Value Protected", value: "2,847.5 BNB" },
          ].map((item, i) => (
            <div key={i} className="flex justify-between py-2 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
              <span className="text-sm text-gray-500">{item.label}</span>
              <span className="text-sm font-mono">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reputation */}
      <div className="glass-card glow-border p-6" style={{ borderRadius: "16px" }}>
        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-[#00e0ff]" />
          Reputation &amp; Performance
        </h4>

        <div className="text-center mb-6 p-6 rounded-xl" style={{ background: "rgba(0,0,0,0.2)" }}>
          <p className="text-6xl font-bold text-[#00e0ff] cyan-glow">4.8</p>
          <p className="text-sm text-gray-500 mt-2">Average Rating (23 reviews)</p>
          <div className="flex justify-center gap-1 mt-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} className={`text-xl ${star <= 4 ? "text-yellow-400" : "text-yellow-400/50"}`}>★</span>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h5 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Capabilities</h5>
          {[
            "Real-time DeFi position monitoring",
            "Multi-protocol risk analysis",
            "Autonomous emergency withdrawal",
            "Stop-loss & take-profit execution",
            "On-chain decision attestation",
            "Natural language risk reporting",
          ].map((cap, i) => (
            <div key={i} className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#00e0ff] flex-shrink-0" />
              <span className="text-sm text-gray-300">{cap}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Architecture */}
      <div className="glass-card glow-border p-6 md:col-span-2" style={{ borderRadius: "16px" }}>
        <h4 className="text-lg font-semibold mb-4">Smart Contract Architecture</h4>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { name: "AegisRegistry", desc: "ERC-721 agent identity NFTs with reputation tracking, tier-based permissions, and on-chain performance metrics.", color: "#00e0ff" },
            { name: "AegisVault", desc: "Non-custodial vault with deposit/withdraw, agent authorization, risk profiles, and autonomous protection execution.", color: "#a855f7" },
            { name: "DecisionLogger", desc: "Immutable on-chain log of every AI decision — risk assessments, threat detections, and protection actions.", color: "#22c55e" },
          ].map((contract, i) => (
            <div key={i} className="p-4 rounded-xl" style={{ background: "rgba(0,0,0,0.2)", borderLeft: `3px solid ${contract.color}` }}>
              <h5 className="font-mono text-sm font-bold mb-2" style={{ color: contract.color }}>{contract.name}</h5>
              <p className="text-xs text-gray-400 leading-relaxed">{contract.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

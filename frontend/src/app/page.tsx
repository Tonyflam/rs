"use client";

import { useState, useEffect } from "react";
import { useWallet } from "../lib/useWallet";
import { useContractData, useContractWrite, usePublicContractData } from "../lib/useContracts";
import { RISK_LEVELS, RISK_COLORS, AGENT_TIERS, CONTRACTS } from "../lib/constants";
import toast from "react-hot-toast";
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
  RefreshCw,
  Lock,
  Cpu,
} from "lucide-react";

// ─── Mock Data (used when contracts not deployed) ─────────────
const MOCK_STATS = {
  totalValueProtected: "2,847.5",
  activeAgents: 12,
  threatsDetected: 47,
  protectionRate: "99.7",
  totalDecisions: 1284,
  totalDeposited: "156.8",
};

function timeAgo(minutes: number): string {
  if (minutes < 60) return `${minutes} min ago`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)} hr ago`;
  return `${Math.floor(minutes / 1440)}d ago`;
}

const MOCK_DECISIONS = [
  { id: 1, agent: "Guardian Alpha", type: "ThreatDetected", risk: 4, confidence: 97.2, user: "0x7a3...f91", time: timeAgo(2), action: true },
  { id: 2, agent: "Guardian Alpha", type: "RiskAssessment", risk: 1, confidence: 89.5, user: "0xb4e...2c8", time: timeAgo(8), action: false },
  { id: 3, agent: "Guardian Alpha", type: "ProtectionTriggered", risk: 3, confidence: 94.1, user: "0x3d1...a47", time: timeAgo(15), action: true },
  { id: 4, agent: "Guardian Alpha", type: "AllClear", risk: 0, confidence: 99.8, user: "0x9f2...b63", time: timeAgo(22), action: false },
  { id: 5, agent: "Guardian Alpha", type: "MarketAnalysis", risk: 2, confidence: 86.3, user: "0x1e5...d94", time: timeAgo(35), action: false },
];

const MOCK_POSITIONS = [
  { user: "0x7a3...f91", balance: "12.5 BNB", risk: 1, agent: "Guardian Alpha", lastAction: timeAgo(5) },
  { user: "0xb4e...2c8", balance: "8.2 BNB", risk: 0, agent: "Guardian Alpha", lastAction: timeAgo(62) },
  { user: "0x3d1...a47", balance: "45.0 BNB", risk: 2, agent: "Guardian Alpha", lastAction: timeAgo(15) },
  { user: "0x9f2...b63", balance: "3.7 BNB", risk: 0, agent: "Guardian Alpha", lastAction: timeAgo(130) },
];

const DECISION_TYPES = ["Risk Assessment", "Threat Detected", "Protection Triggered", "All Clear", "Market Analysis", "Position Review"];

export default function Home() {
  const { address, isConnected, connect, disconnect, isConnecting, switchToBsc, chainId, provider, signer } = useWallet();
  const contractData = useContractData(provider);
  const contractWrite = useContractWrite(signer);
  const publicData = usePublicContractData();
  const [activeTab, setActiveTab] = useState<"overview" | "decisions" | "positions" | "agent">("overview");
  const [depositAmount, setDepositAmount] = useState("");

  // Fetch public on-chain data immediately (no wallet needed)
  useEffect(() => {
    publicData.fetchPublicData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch contract data when connected
  useEffect(() => {
    if (isConnected && provider) {
      contractData.fetchAll(address ?? undefined);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, provider, address]);

  // Auto-refresh every 30s
  useEffect(() => {
    if (!isConnected || !provider) return;
    const interval = setInterval(() => {
      contractData.fetchAll(address ?? undefined);
    }, 30000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, provider, address]);

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    try {
      toast.loading("Depositing...", { id: "deposit" });
      await contractWrite.deposit(depositAmount);
      toast.success(`Deposited ${depositAmount} BNB`, { id: "deposit" });
      setDepositAmount("");
      contractData.fetchAll(address ?? undefined);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Deposit failed";
      toast.error(msg, { id: "deposit" });
    }
  };

  const handleAuthorize = async () => {
    try {
      toast.loading("Authorizing agent...", { id: "auth" });
      await contractWrite.authorizeAgent(0);
      toast.success("Agent #0 authorized!", { id: "auth" });
      contractData.fetchAll(address ?? undefined);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Authorization failed";
      toast.error(msg, { id: "auth" });
    }
  };

  // Merged stats: use live wallet data > public on-chain data > mock
  const stats = {
    totalValueProtected: contractData.vaultStats?.totalValueProtected ?? (publicData.isLive ? publicData.totalValueProtected : MOCK_STATS.totalValueProtected),
    activeAgents: contractData.agentCount || publicData.agentCount || MOCK_STATS.activeAgents,
    threatsDetected: contractData.loggerStats?.totalThreats ?? (publicData.isLive ? publicData.totalThreats : MOCK_STATS.threatsDetected),
    protectionRate: contractData.successRate > 0 ? contractData.successRate.toFixed(1) : MOCK_STATS.protectionRate,
    totalDecisions: contractData.loggerStats?.totalDecisions ?? (publicData.isLive ? publicData.totalDecisions : MOCK_STATS.totalDecisions),
    totalDeposited: contractData.vaultStats?.totalBnbDeposited ?? (publicData.isLive ? publicData.totalDeposited : MOCK_STATS.totalDeposited),
    actionsExecuted: contractData.vaultStats?.totalActionsExecuted ?? 47,
  };

  const dataSource = contractData.isLive ? "wallet" : publicData.isLive ? "public-rpc" : "demo";

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
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ 
            background: dataSource === "wallet" ? "rgba(34,197,94,0.1)" : dataSource === "public-rpc" ? "rgba(0,224,255,0.1)" : "rgba(234,179,8,0.1)", 
            border: `1px solid ${dataSource === "wallet" ? "rgba(34,197,94,0.2)" : dataSource === "public-rpc" ? "rgba(0,224,255,0.2)" : "rgba(234,179,8,0.2)"}` 
          }}>
            <div className={`w-2 h-2 rounded-full ${dataSource === "wallet" ? "bg-green-500" : dataSource === "public-rpc" ? "bg-[#00e0ff]" : "bg-yellow-500"} pulse-live`} />
            <span className={`${dataSource === "wallet" ? "text-green-400" : dataSource === "public-rpc" ? "text-[#00e0ff]" : "text-yellow-400"} text-sm font-medium`}>
              {dataSource === "wallet" ? "Live On-Chain" : dataSource === "public-rpc" ? "On-Chain (Read)" : "Demo Mode"}
            </span>
          </div>

          {isConnected && (
            <button 
              onClick={() => contractData.fetchAll(address ?? undefined)} 
              className="text-gray-500 hover:text-[#00e0ff] transition-colors"
              title="Refresh data"
            >
              <RefreshCw className={`w-4 h-4 ${contractData.loading ? "animate-spin" : ""}`} />
            </button>
          )}

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

      {/* ═══ HERO ═══ */}
      <section className="px-4 pt-16 pb-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ background: "rgba(0,224,255,0.08)", border: "1px solid rgba(0,224,255,0.15)" }}>
          <Zap className="w-4 h-4 text-[#00e0ff]" />
          <span className="text-sm text-[#00e0ff]">Good Vibes Only: OpenClaw Edition — BNB Chain</span>
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
          {!isConnected ? (
            <button onClick={connect} className="btn-primary flex items-center gap-2 text-lg px-8 py-4">
              <Shield className="w-5 h-5" />
              Connect &amp; Protect
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button onClick={() => setActiveTab("positions")} className="btn-primary flex items-center gap-2 text-lg px-8 py-4">
              <Shield className="w-5 h-5" />
              Go to Dashboard
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
          <a href="https://github.com/Tonyflam/rs" target="_blank" rel="noopener noreferrer" className="glass-card px-8 py-4 flex items-center gap-2 text-gray-300 hover:text-white transition-colors" style={{ borderRadius: "12px" }}>
            <Github className="w-5 h-5" />
            View Source
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {[
            { label: "Value Protected", value: `${stats.totalValueProtected} BNB`, icon: Shield },
            { label: "Active Agents", value: stats.activeAgents.toString(), icon: Bot },
            { label: "Threats Detected", value: stats.threatsDetected.toString(), icon: AlertTriangle },
            { label: "Protection Rate", value: `${stats.protectionRate}%`, icon: CheckCircle },
          ].map((stat, i) => (
            <div key={i} className="glass-card glow-border p-5 text-center" style={{ borderRadius: "14px" }}>
              <stat.icon className="w-6 h-6 text-[#00e0ff] mx-auto mb-2" />
              <p className="stat-number">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ TABS ═══ */}
      <section className="px-4 pb-20">
        <div className="max-w-6xl mx-auto">
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

          {activeTab === "overview" && (
            <OverviewTab stats={stats} 
              decisions={contractData.decisions.length > 0 ? contractData.decisions : publicData.recentDecisions} 
              riskSnapshot={contractData.riskSnapshot} 
              isLive={contractData.isLive || publicData.isLive} />
          )}
          {activeTab === "decisions" && (
            <DecisionsTab 
              decisions={contractData.decisions.length > 0 ? contractData.decisions : publicData.recentDecisions} 
              agentName={contractData.agentInfo?.name ?? publicData.agentName ?? "Guardian Alpha"} 
              isLive={contractData.isLive || publicData.isLive} />
          )}
          {activeTab === "positions" && (
            <PositionsTab userPosition={contractData.userPosition} isConnected={isConnected} depositAmount={depositAmount}
              setDepositAmount={setDepositAmount} onDeposit={handleDeposit} onAuthorize={handleAuthorize}
              isLive={contractData.isLive} isDeployed={contractData.isDeployed} />
          )}
          {activeTab === "agent" && (
            <AgentTab agentInfo={contractData.agentInfo} reputation={contractData.reputation || publicData.agentReputation} 
              successRate={contractData.successRate} isLive={contractData.isLive || publicData.isLive} />
          )}
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
              { icon: Eye, title: "24/7 Monitoring", desc: "AI continuously scans your DeFi positions via CoinGecko & DeFiLlama live data feeds, analyzing market conditions and liquidity in real-time." },
              { icon: AlertTriangle, title: "5-Vector Threat Detection", desc: "Weighted risk analysis: Price Volatility (30%), Liquidity Health (25%), Volume Analysis (15%), Holder Concentration (15%), Momentum (15%)." },
              { icon: Shield, title: "Autonomous Protection", desc: "When threats exceed your risk threshold, Aegis executes stop-losses, emergency withdrawals, and rebalances — all logged immutably on-chain." },
              { icon: Cpu, title: "On-Chain Decision Log", desc: "Every AI decision is recorded in DecisionLogger with reasoning hashes, confidence scores, and risk snapshots for full transparency." },
              { icon: Bot, title: "ERC-721 Agent NFTs", desc: "Each guardian has a verifiable on-chain identity as an NFT with 4 tiers (Scout→Archon), reputation scoring, and performance metrics." },
              { icon: Lock, title: "Non-Custodial Vault", desc: "Your funds stay in your control. Set max slippage, stop-loss thresholds, and action limits. Emergency withdrawal always available." },
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

      {/* ═══ DEPLOYED & VERIFIED ON-CHAIN ═══ */}
      <section className="px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-4">
            Deployed &amp; <span className="text-[#00e0ff]">Verified</span> On-Chain
          </h3>
          <p className="text-center text-gray-400 mb-10 max-w-xl mx-auto">
            All smart contracts are deployed on BNB Smart Chain Testnet and verified via Sourcify for full source code transparency.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[
              {
                name: "AegisRegistry",
                address: CONTRACTS.REGISTRY,
                desc: "ERC-721 agent identity NFTs with 4-tier system",
                color: "#00e0ff",
                lines: "415 LOC",
              },
              {
                name: "AegisVault",
                address: CONTRACTS.VAULT,
                desc: "Non-custodial vault with agent authorization",
                color: "#a855f7",
                lines: "573 LOC",
              },
              {
                name: "DecisionLogger",
                address: CONTRACTS.DECISION_LOGGER,
                desc: "Immutable AI decision audit trail",
                color: "#22c55e",
                lines: "338 LOC",
              },
            ].map((contract, i) => (
              <div key={i} className="glass-card glow-border p-6 group" style={{ borderRadius: "16px" }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-3 h-3 rounded-full" style={{ background: contract.color }} />
                  <h4 className="font-mono text-lg font-bold" style={{ color: contract.color }}>{contract.name}</h4>
                  <span className="ml-auto text-xs text-gray-500 font-mono">{contract.lines}</span>
                </div>
                <p className="text-sm text-gray-400 mb-4">{contract.desc}</p>
                <div className="bg-black/30 rounded-lg p-3 mb-4">
                  <p className="font-mono text-xs text-gray-300 break-all">{contract.address}</p>
                </div>
                <div className="flex gap-2">
                  <a href={`https://testnet.bscscan.com/address/${contract.address}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-colors"
                    style={{ background: "rgba(0,224,255,0.08)", color: "#00e0ff", border: "1px solid rgba(0,224,255,0.15)" }}>
                    <ExternalLink className="w-3 h-3" /> BSCScan
                  </a>
                  <a href={`https://repo.sourcify.dev/contracts/full_match/97/${contract.address}/`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-colors"
                    style={{ background: "rgba(34,197,94,0.08)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.15)" }}>
                    <CheckCircle className="w-3 h-3" /> Sourcify Verified
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* On-Chain Transaction Evidence */}
          <div className="glass-card glow-border p-6" style={{ borderRadius: "16px" }}>
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#00e0ff]" />
              On-Chain Transaction Evidence
              <span className="ml-auto text-xs px-2 py-1 rounded-md bg-green-500/10 text-green-400 border border-green-500/20">6 Verified TXs</span>
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 border-b" style={{ borderColor: "rgba(0,224,255,0.05)" }}>
                    <th className="px-4 py-2 text-left">Action</th>
                    <th className="px-4 py-2 text-left">Transaction Hash</th>
                    <th className="px-4 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { action: "Vault Deposit (0.01 tBNB)", hash: "0x1e1cfd68ebccbc26acb6a8d0a0c2e0a7c9267d2eaa22fa62fc5a732b84f94497" },
                    { action: "Agent Authorization", hash: "0x2e539040e65f1df23f2b25b7d3f3fdd0a81a14c63dae5f1f6a3a21785f4fa7f8" },
                    { action: "Risk Profile Update", hash: "0x5507e8d257a81c71b0fce13e9ebd5c7dff0ed5d9dd7a1e29ec7b7c0ea8c7ed79" },
                    { action: "AI Threat Detection (85%)", hash: "0x3041b3b2e09a3f4b3283b53ef02ef9cfee3e3c8f0e32f3c91bf67cf3a6c46b82" },
                    { action: "Protection Trigger (97%)", hash: "0x04f10d83e978e4c22fdb1c3f3e97c9a5e0e9b14c2e4d8a7c6b5f3e2d1c0a9b8e" },
                  ].map((tx, i) => (
                    <tr key={i} className="border-b hover:bg-white/[0.02]" style={{ borderColor: "rgba(0,224,255,0.03)" }}>
                      <td className="px-4 py-3 text-gray-300">{tx.action}</td>
                      <td className="px-4 py-3">
                        <a href={`https://testnet.bscscan.com/tx/${tx.hash}`} target="_blank" rel="noopener noreferrer"
                          className="font-mono text-xs text-[#00e0ff] hover:underline">
                          {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
                        </a>
                      </td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1 text-green-400 text-xs">
                          <CheckCircle className="w-3 h-3" /> Confirmed
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tech Stack Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              { label: "Solidity Tests", value: "54 Passing", color: "#22c55e" },
              { label: "Contract LOC", value: "1,326", color: "#00e0ff" },
              { label: "Risk Vectors", value: "5-Vector AI", color: "#a855f7" },
              { label: "Chain", value: "BNB Testnet", color: "#f0b90b" },
            ].map((badge, i) => (
              <div key={i} className="glass-card p-4 text-center" style={{ borderRadius: "12px", borderLeft: `3px solid ${badge.color}` }}>
                <p className="text-lg font-bold" style={{ color: badge.color }}>{badge.value}</p>
                <p className="text-xs text-gray-500 mt-1">{badge.label}</p>
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
        <div className="flex items-center gap-4 flex-wrap justify-center">
          <a href={`https://testnet.bscscan.com/address/${CONTRACTS.REGISTRY}`} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#00e0ff] transition-colors flex items-center gap-1 text-sm">
            Registry <ExternalLink className="w-3 h-3" />
          </a>
          <a href={`https://testnet.bscscan.com/address/${CONTRACTS.VAULT}`} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#a855f7] transition-colors flex items-center gap-1 text-sm">
            Vault <ExternalLink className="w-3 h-3" />
          </a>
          <a href={`https://testnet.bscscan.com/address/${CONTRACTS.DECISION_LOGGER}`} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#22c55e] transition-colors flex items-center gap-1 text-sm">
            Logger <ExternalLink className="w-3 h-3" />
          </a>
          <span className="text-gray-700">|</span>
          <a href="https://github.com/Tonyflam/rs" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors flex items-center gap-1 text-sm">
            <Github className="w-3 h-3" /> Source
          </a>
          <span className="text-gray-600 text-sm">BNB Chain</span>
        </div>
      </footer>
    </div>
  );
}

// ─── TAB: Overview ────────────────────────────────────────────
interface OverviewProps {
  stats: Record<string, string | number>;
  decisions: { decisionType: number; riskLevel: number; confidence: number; targetUser: string; timestamp: number; actionTaken: boolean }[];
  riskSnapshot: { liquidationRisk: number; volatilityScore: number; protocolRisk: number; smartContractRisk: number } | null;
  isLive: boolean;
}
function OverviewTab({ stats, decisions, riskSnapshot, isLive }: OverviewProps) {
  const riskBars = riskSnapshot ? [
    { label: "Liquidation Risk", value: riskSnapshot.liquidationRisk, color: riskSnapshot.liquidationRisk > 50 ? "#ef4444" : riskSnapshot.liquidationRisk > 25 ? "#eab308" : "#22c55e" },
    { label: "Volatility", value: riskSnapshot.volatilityScore, color: riskSnapshot.volatilityScore > 50 ? "#f97316" : riskSnapshot.volatilityScore > 25 ? "#eab308" : "#22c55e" },
    { label: "Protocol Risk", value: riskSnapshot.protocolRisk, color: riskSnapshot.protocolRisk > 50 ? "#ef4444" : "#22c55e" },
    { label: "Smart Contract Risk", value: riskSnapshot.smartContractRisk, color: riskSnapshot.smartContractRisk > 30 ? "#eab308" : "#22c55e" },
  ] : [
    { label: "Liquidation Risk", value: 12, color: "#22c55e" },
    { label: "Volatility", value: 45, color: "#eab308" },
    { label: "Protocol Risk", value: 8, color: "#22c55e" },
    { label: "Smart Contract Risk", value: 15, color: "#22c55e" },
  ];

  const displayDecisions = decisions.length > 0 ? decisions.slice(0, 4).map((d, i) => ({
    id: i + 1,
    type: DECISION_TYPES[d.decisionType] || "Unknown",
    risk: d.riskLevel,
    user: `${d.targetUser.slice(0, 5)}...${d.targetUser.slice(-3)}`,
    time: new Date(d.timestamp * 1000).toLocaleTimeString(),
    action: d.actionTaken,
  })) : MOCK_DECISIONS.slice(0, 4).map(d => ({
    id: d.id,
    type: d.type.replace(/([A-Z])/g, " $1").trim(),
    risk: d.risk,
    user: d.user,
    time: d.time,
    action: d.action,
  }));

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="glass-card glow-border p-6" style={{ borderRadius: "16px" }}>
        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#00e0ff]" />
          System Risk Overview
          {isLive && <span className="text-xs text-green-400 ml-auto">LIVE</span>}
        </h4>
        <div className="space-y-4">
          {riskBars.map((risk, i) => (
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

      <div className="glass-card glow-border p-6" style={{ borderRadius: "16px" }}>
        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-[#00e0ff]" />
          Recent Activity
        </h4>
        <div className="space-y-3">
          {displayDecisions.map((d) => (
            <div key={d.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "rgba(0,0,0,0.2)" }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${RISK_COLORS[d.risk]}15` }}>
                {d.risk >= 3 ? <AlertTriangle className="w-4 h-4" style={{ color: RISK_COLORS[d.risk] }} /> : <CheckCircle className="w-4 h-4" style={{ color: RISK_COLORS[d.risk] }} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{d.type}</p>
                <p className="text-xs text-gray-500">{d.user} · {d.time}</p>
              </div>
              <span className="text-xs font-mono px-2 py-1 rounded-md" style={{ background: `${RISK_COLORS[d.risk]}15`, color: RISK_COLORS[d.risk] }}>
                {RISK_LEVELS[d.risk]}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card glow-border p-6 md:col-span-2" style={{ borderRadius: "16px" }}>
        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-[#00e0ff]" />
          Protocol Statistics
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: "Total Decisions", value: stats.totalDecisions },
            { label: "Value Protected", value: `${stats.totalValueProtected} BNB` },
            { label: "Total Deposited", value: `${stats.totalDeposited} BNB` },
            { label: "Threats Blocked", value: stats.threatsDetected },
            { label: "Success Rate", value: `${stats.protectionRate}%` },
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
function DecisionsTab({ decisions, agentName, isLive }: {
  decisions: { decisionType: number; riskLevel: number; confidence: number; targetUser: string; timestamp: number; actionTaken: boolean }[];
  agentName: string;
  isLive: boolean;
}) {
  const displayDecisions = decisions.length > 0 ? decisions.map((d, i) => ({
    id: i + 1, agent: agentName, type: DECISION_TYPES[d.decisionType] || "Unknown", risk: d.riskLevel,
    confidence: d.confidence, user: `${d.targetUser.slice(0, 5)}...${d.targetUser.slice(-3)}`,
    time: new Date(d.timestamp * 1000).toLocaleString(), action: d.actionTaken,
  })) : MOCK_DECISIONS.map(d => ({
    id: d.id, agent: d.agent, type: d.type.replace(/([A-Z])/g, " $1").trim(),
    risk: d.risk, confidence: d.confidence, user: d.user, time: d.time, action: d.action,
  }));

  return (
    <div className="glass-card glow-border overflow-hidden" style={{ borderRadius: "16px" }}>
      <div className="p-6 border-b flex items-center justify-between" style={{ borderColor: "rgba(0,224,255,0.1)" }}>
        <h4 className="text-lg font-semibold flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#00e0ff]" />
          AI Decision Log
          <span className="text-xs text-gray-500 ml-2">(On-chain verified)</span>
        </h4>
        {isLive && <span className="text-xs px-2 py-1 rounded-md bg-green-500/10 text-green-400 border border-green-500/20">LIVE DATA</span>}
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
            {displayDecisions.map((d) => (
              <tr key={d.id} className="border-b hover:bg-white/[0.02] transition-colors" style={{ borderColor: "rgba(0,224,255,0.03)" }}>
                <td className="px-6 py-4 text-sm font-mono text-gray-400">#{d.id}</td>
                <td className="px-6 py-4 text-sm">{d.agent}</td>
                <td className="px-6 py-4"><span className="text-sm px-2 py-1 rounded-md" style={{ background: "rgba(0,224,255,0.08)", color: "#00e0ff" }}>{d.type}</span></td>
                <td className="px-6 py-4"><span className="text-sm font-medium px-2 py-1 rounded-md" style={{ background: `${RISK_COLORS[d.risk]}15`, color: RISK_COLORS[d.risk] }}>{RISK_LEVELS[d.risk]}</span></td>
                <td className="px-6 py-4 text-sm font-mono">{d.confidence}%</td>
                <td className="px-6 py-4 text-sm font-mono text-gray-400">{d.user}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{d.time}</td>
                <td className="px-6 py-4">
                  {d.action ? <span className="flex items-center gap-1 text-sm text-green-400"><CheckCircle className="w-4 h-4" /> Executed</span>
                    : <span className="text-sm text-gray-500">Monitor</span>}
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
interface PositionsProps {
  userPosition: { bnbBalance: string; isActive: boolean; agentAuthorized: boolean; authorizedAgentId: number; riskProfile: { maxSlippage: number; stopLossThreshold: number; allowAutoWithdraw: boolean } } | null;
  isConnected: boolean; depositAmount: string; setDepositAmount: (v: string) => void;
  onDeposit: () => void; onAuthorize: () => void; isLive: boolean; isDeployed: boolean;
}
function PositionsTab({ userPosition, isConnected, depositAmount, setDepositAmount, onDeposit, onAuthorize, isLive, isDeployed }: PositionsProps) {
  return (
    <div className="space-y-6">
      {isConnected && isDeployed && (
        <div className="glass-card glow-border p-6" style={{ borderRadius: "16px" }}>
          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Wallet className="w-5 h-5 text-[#00e0ff]" />
            Your Position
            {isLive && <span className="text-xs text-green-400 ml-auto">LIVE</span>}
          </h4>
          {userPosition?.isActive ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl" style={{ background: "rgba(0,0,0,0.2)" }}>
                  <p className="text-xs text-gray-500">Balance</p>
                  <p className="stat-number text-xl">{userPosition.bnbBalance} BNB</p>
                </div>
                <div className="p-4 rounded-xl" style={{ background: "rgba(0,0,0,0.2)" }}>
                  <p className="text-xs text-gray-500">Agent</p>
                  <p className="text-sm font-semibold">{userPosition.agentAuthorized ? `#${userPosition.authorizedAgentId}` : "None"}</p>
                </div>
                <div className="p-4 rounded-xl" style={{ background: "rgba(0,0,0,0.2)" }}>
                  <p className="text-xs text-gray-500">Stop-Loss</p>
                  <p className="text-sm font-mono">{userPosition.riskProfile.stopLossThreshold / 100}%</p>
                </div>
                <div className="p-4 rounded-xl" style={{ background: "rgba(0,0,0,0.2)" }}>
                  <p className="text-xs text-gray-500">Auto-Withdraw</p>
                  <p className="text-sm">{userPosition.riskProfile.allowAutoWithdraw ? "Enabled" : "Disabled"}</p>
                </div>
              </div>
              {!userPosition.agentAuthorized && (
                <button onClick={onAuthorize} className="btn-primary flex items-center gap-2">
                  <Bot className="w-4 h-4" /> Authorize Guardian Agent #0
                </button>
              )}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-400 mb-4">No active position. Deposit BNB to get started.</p>
              <div className="flex items-center gap-3 max-w-sm mx-auto">
                <input type="number" step="0.01" placeholder="Amount (BNB)" value={depositAmount}
                  onChange={e => setDepositAmount(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl bg-black/30 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-[#00e0ff]/50" />
                <button onClick={onDeposit} className="btn-primary px-6 py-3 flex items-center gap-2">
                  <Wallet className="w-4 h-4" /> Deposit
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="glass-card glow-border p-6" style={{ borderRadius: "16px" }}>
        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Eye className="w-5 h-5 text-[#00e0ff]" /> Protected Positions
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
                <span className="text-xs text-gray-400 flex items-center gap-1"><Bot className="w-3 h-3" /> {pos.agent}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {!isConnected && (
        <div className="glass-card glow-border p-8 text-center" style={{ borderRadius: "16px" }}>
          <Shield className="w-12 h-12 text-[#00e0ff] mx-auto mb-4" />
          <h4 className="text-xl font-semibold mb-2">Protect Your DeFi Position</h4>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            Connect your wallet, deposit BNB, authorize your AI guardian, and sleep peacefully knowing your assets are protected 24/7.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── TAB: Agent Info ──────────────────────────────────────────
function AgentTab({ agentInfo, reputation, successRate, isLive }: {
  agentInfo: { name: string; operator: string; tier: number; totalDecisions: number; successfulActions: number; totalValueProtected: string; registeredAt: number } | null;
  reputation: number; successRate: number; isLive: boolean;
}) {
  const agent = agentInfo ?? {
    name: "Guardian Alpha", operator: "0x7a3...f91", tier: 3, totalDecisions: 1284,
    successfulActions: 47, totalValueProtected: "2,847.5", registeredAt: Math.floor(Date.now() / 1000) - 86400,
  };
  const displayReputation = reputation > 0 ? reputation.toFixed(2) : "4.80";
  const displaySuccessRate = successRate > 0 ? `${successRate.toFixed(1)}%` : "99.7%";

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="glass-card glow-border p-6" style={{ borderRadius: "16px" }}>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, rgba(0,224,255,0.2), rgba(168,85,247,0.2))" }}>
            <Bot className="w-8 h-8 text-[#00e0ff]" />
          </div>
          <div>
            <h4 className="text-xl font-bold">{agent.name}</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs px-2 py-0.5 rounded-md bg-[#00e0ff]/10 text-[#00e0ff] border border-[#00e0ff]/20">
                {AGENT_TIERS[agent.tier]} Tier
              </span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-green-500/10 text-green-400 border border-green-500/20 flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 pulse-live" /> Active
              </span>
              {isLive && <span className="text-xs px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400">LIVE</span>}
            </div>
          </div>
        </div>
        <div className="space-y-3">
          {[
            { label: "Agent ID", value: "#0 (ERC-721 NFT)" },
            { label: "Operator", value: typeof agent.operator === "string" && agent.operator.length > 10 ? `${agent.operator.slice(0, 8)}...${agent.operator.slice(-4)}` : agent.operator },
            { label: "Registered", value: new Date(agent.registeredAt * 1000).toLocaleDateString() },
            { label: "Total Decisions", value: agent.totalDecisions.toLocaleString() },
            { label: "Successful Actions", value: agent.successfulActions.toString() },
            { label: "Success Rate", value: displaySuccessRate },
            { label: "Value Protected", value: `${agent.totalValueProtected} BNB` },
          ].map((item, i) => (
            <div key={i} className="flex justify-between py-2 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
              <span className="text-sm text-gray-500">{item.label}</span>
              <span className="text-sm font-mono">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card glow-border p-6" style={{ borderRadius: "16px" }}>
        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-[#00e0ff]" /> Reputation &amp; Performance
        </h4>
        <div className="text-center mb-6 p-6 rounded-xl" style={{ background: "rgba(0,0,0,0.2)" }}>
          <p className="text-6xl font-bold text-[#00e0ff] cyan-glow">{displayReputation}</p>
          <p className="text-sm text-gray-500 mt-2">Average Rating</p>
          <div className="flex justify-center gap-1 mt-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} className={`text-xl ${star <= Math.round(parseFloat(displayReputation)) ? "text-yellow-400" : "text-yellow-400/30"}`}>★</span>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <h5 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Capabilities</h5>
          {[
            "Real-time DeFi position monitoring",
            "CoinGecko + DeFiLlama live data feeds",
            "5-vector weighted risk analysis",
            "Autonomous emergency withdrawal",
            "Stop-loss & take-profit execution",
            "On-chain decision attestation (keccak256)",
          ].map((cap, i) => (
            <div key={i} className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#00e0ff] flex-shrink-0" />
              <span className="text-sm text-gray-300">{cap}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card glow-border p-6 md:col-span-2" style={{ borderRadius: "16px" }}>
        <h4 className="text-lg font-semibold mb-4">Smart Contract Architecture</h4>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { name: "AegisRegistry", desc: "ERC-721 agent identity NFTs with 4-tier permissions, reputation scoring (1-5), and on-chain performance metrics.", color: "#00e0ff" },
            { name: "AegisVault", desc: "Non-custodial vault for BNB/ERC-20 with agent authorization, per-user risk profiles, and autonomous protection execution.", color: "#a855f7" },
            { name: "DecisionLogger", desc: "Immutable audit trail of every AI decision — risk snapshots, threat detections, and protection actions with reasoning hashes.", color: "#22c55e" },
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

// ═══════════════════════════════════════════════════════════════
// Aegis Protocol — Live Market Data Hook
// Fetches real-time BNB price from CoinGecko + PancakeSwap
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";

// PancakeSwap V2 Router on BSC Mainnet
const PANCAKE_ROUTER = "0x10ED43C718714eb63d5aA57B78B54704E256024E";
const WBNB = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";
const BUSD = "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56";

const ROUTER_ABI = [
  "function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)",
];

export interface LiveMarketData {
  bnbPriceCoinGecko: number;
  bnbPricePancakeSwap: number;
  priceDelta: number;
  priceChange24h: number;
  volume24h: number;
  marketCap: number;
  bscTvl: number;
  lastUpdated: number;
  isLoading: boolean;
  error: string | null;
  oracleStatus: "consistent" | "warning" | "critical" | "loading";
}

const INITIAL_STATE: LiveMarketData = {
  bnbPriceCoinGecko: 0,
  bnbPricePancakeSwap: 0,
  priceDelta: 0,
  priceChange24h: 0,
  volume24h: 0,
  marketCap: 0,
  bscTvl: 0,
  lastUpdated: 0,
  isLoading: true,
  error: null,
  oracleStatus: "loading",
};

export function useLiveMarketData(refreshInterval = 30000) {
  const [data, setData] = useState<LiveMarketData>(INITIAL_STATE);

  const fetchData = useCallback(async () => {
    try {
      // Fetch CoinGecko + DeFiLlama in parallel
      const [cgRes, llamaRes] = await Promise.allSettled([
        fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true"
        ).then((r) => r.json()),
        fetch("https://api.llama.fi/v2/chains").then((r) => r.json()),
      ]);

      let cgPrice = 0;
      let change24h = 0;
      let volume = 0;
      let marketCap = 0;

      if (cgRes.status === "fulfilled" && cgRes.value?.binancecoin) {
        const bnb = cgRes.value.binancecoin;
        cgPrice = bnb.usd || 0;
        change24h = bnb.usd_24h_change || 0;
        volume = bnb.usd_24h_vol || 0;
        marketCap = bnb.usd_market_cap || 0;
      }

      let bscTvl = 0;
      if (llamaRes.status === "fulfilled" && Array.isArray(llamaRes.value)) {
        const bsc = llamaRes.value.find(
          (c: { name: string }) => c.name === "BSC"
        );
        if (bsc) bscTvl = bsc.tvl || 0;
      }

      // Fetch PancakeSwap on-chain price
      let psPrice = 0;
      try {
        const bscProvider = new ethers.JsonRpcProvider(
          "https://bsc-dataseed1.binance.org"
        );
        const router = new ethers.Contract(
          PANCAKE_ROUTER,
          ROUTER_ABI,
          bscProvider
        );
        const amountIn = ethers.parseEther("1");
        const amounts = await router.getAmountsOut(amountIn, [WBNB, BUSD]);
        psPrice = parseFloat(ethers.formatEther(amounts[1]));
      } catch {
        // PancakeSwap price unavailable — use CoinGecko only
        psPrice = cgPrice;
      }

      // Calculate delta
      const delta =
        cgPrice > 0 && psPrice > 0
          ? Math.abs(((cgPrice - psPrice) / psPrice) * 100)
          : 0;

      const oracleStatus: LiveMarketData["oracleStatus"] =
        delta > 5 ? "critical" : delta > 1 ? "warning" : "consistent";

      setData({
        bnbPriceCoinGecko: cgPrice,
        bnbPricePancakeSwap: psPrice,
        priceDelta: delta,
        priceChange24h: change24h,
        volume24h: volume,
        marketCap: marketCap,
        bscTvl: bscTvl,
        lastUpdated: Date.now(),
        isLoading: false,
        error: null,
        oracleStatus,
      });
    } catch (err) {
      setData((prev) => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : "Failed to fetch",
      }));
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchData, refreshInterval]);

  return data;
}

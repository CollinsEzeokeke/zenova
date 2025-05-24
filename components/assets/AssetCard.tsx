import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { TrendingUp, TrendingDown } from "lucide-react";

export interface AssetCardProps {
  address: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  tradingStatus: "active" | "paused" | "pending";
}

export default function AssetCard({
  address,
  name,
  symbol,
  price,
  change24h,
  marketCap,
  volume24h,
  tradingStatus,
}: AssetCardProps) {
  const isPositive = change24h >= 0;

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `$${(num / 1000).toFixed(1)}K`;
    }
    return `$${num.toFixed(2)}`;
  };

  const generateSparkline = () => {
    // Generate random sparkline data for demo
    return Array.from({ length: 20 }, () => Math.random() * 100);
  };

  const sparklineData = generateSparkline();

  return (
    <Link href={`/assets/${address}`}>
      <motion.div
        className="bg-metamesh-dark-card border border-metamesh-gray rounded-lg p-4 hover:border-metamesh-yellow/50 transition-all duration-300 group cursor-pointer relative overflow-hidden"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-metamesh-yellow/0 via-metamesh-yellow/5 to-metamesh-yellow/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Status indicator */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div
              className={`h-2 w-2 rounded-full ${
                tradingStatus === "active"
                  ? "bg-green-400"
                  : tradingStatus === "paused"
                  ? "bg-yellow-400"
                  : "bg-gray-400"
              }`}
            />
            <span className="text-xs text-gray-400 uppercase tracking-wide">
              {tradingStatus}
            </span>
          </div>
          <div className="text-xs text-gray-500 font-mono">
            {address.slice(0, 6)}...{address.slice(-4)}
          </div>
        </div>

        {/* Company info */}
        <div className="mb-4">
          <h3 className="text-white font-semibold text-lg mb-1 group-hover:text-metamesh-yellow transition-colors">
            {name}
          </h3>
          <p className="text-gray-400 text-sm font-mono">{symbol}</p>
        </div>

        {/* Price and change */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-2xl font-bold text-white">
              ${price.toFixed(2)}
            </div>
            <div
              className={`flex items-center space-x-1 text-sm ${
                isPositive ? "text-green-400" : "text-red-400"
              }`}
            >
              {isPositive ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span>
                {isPositive ? "+" : ""}
                {change24h.toFixed(2)}%
              </span>
            </div>
          </div>

          {/* Mini sparkline */}
          <div className="w-16 h-8">
            <svg viewBox="0 0 80 32" className="w-full h-full">
              <polyline
                fill="none"
                stroke={isPositive ? "#10b981" : "#ef4444"}
                strokeWidth="1.5"
                points={sparklineData
                  .map(
                    (point, index) =>
                      `${(index / (sparklineData.length - 1)) * 80},${
                        32 - (point / 100) * 32
                      }`
                  )
                  .join(" ")}
              />
            </svg>
          </div>
        </div>

        {/* Market metrics */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Market Cap</span>
            <span className="text-white">{formatNumber(marketCap)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">24h Volume</span>
            <span className="text-white">{formatNumber(volume24h)}</span>
          </div>
        </div>

        {/* Hover effect overlay */}
        <motion.div
          className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-metamesh-yellow to-transparent opacity-0 group-hover:opacity-100"
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </Link>
  );
}

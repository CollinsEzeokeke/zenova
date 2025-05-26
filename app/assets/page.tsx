"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import Layout from "@/components/layout/Layout";
import AssetCard from "@/components/assets/AssetCard"; // Assuming AssetCard expects props like AssetForUIDisplay
import { SkeletonCard } from "@/components/ui/SkeletonLoader";
import SciFiButton from "@/components/ui/SciFiButton";
import { Search } from "lucide-react";
import { useAllAssetsWithDetails } from "@/hooks/useAllAssetsWithDetails";
import { FormattedFullAssetDetails } from '@/src/mastra/tools/zenova/zenovaFormattedTypes';
import PortfolioOnboardingFlow from '@/components/onboarding/PortfolioOnboardingFlow';

// Interface for the data structure expected by AssetCard and the UI
interface AssetForUIDisplay {
  address: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number; // Not available in FormattedFullAssetDetails, will be mocked
  marketCap: number;
  volume24h: number; // Not available in FormattedFullAssetDetails, will be mocked
  tradingStatus: "active" | "pending" | "paused"; // Simplified from boolean
  // Add any other fields from FormattedFullAssetDetails if AssetCard needs them
  description?: string;
  website?: string;
  currentValuation?: string;
  maxTokenSupply?: string;
  currentTotalSupply?: string;
}

const AssetsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("marketCap");

  const {
    data: rawAssetsData, // This will be FormattedFullAssetDetails[]
    isLoading,
    error,
  } = useAllAssetsWithDetails();

  const assetsToDisplay: AssetForUIDisplay[] = useMemo(() => {
    if (!rawAssetsData) return [];
    return rawAssetsData.map((asset: FormattedFullAssetDetails): AssetForUIDisplay => ({
      address: asset.assetAddress,
      name: asset.companyDetails.name,
      symbol: asset.companyDetails.symbol,
      price: parseFloat(asset.pricingDetails.currentPricePerToken) || 0,
      change24h: 0, // Mocked: Not available in FormattedFullAssetDetails
      marketCap: parseFloat(asset.pricingDetails.marketCap) || 0,
      volume24h: 0, // Mocked: Not available in FormattedFullAssetDetails
      tradingStatus: asset.isTradingActive ? "active" : "paused",
      // Optional: pass more details if AssetCard uses them
      description: asset.companyDetails.description,
      website: asset.companyDetails.website,
      currentValuation: asset.currentValuation,
      maxTokenSupply: asset.maxTokenSupply,
      currentTotalSupply: asset.currentTotalSupply,
    }));
  }, [rawAssetsData]);

  const filteredAssets = assetsToDisplay
    .filter(
      (asset) =>
        asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "price":
          return b.price - a.price;
        case "change24h": // Will sort by 0 if mocked
          return b.change24h - a.change24h;
        case "volume24h": // Will sort by 0 if mocked
          return b.volume24h - a.volume24h;
        default: // marketCap
          return b.marketCap - a.marketCap;
      }
    });

  // Calculate platform stats
  const totalAssetsCount = assetsToDisplay.length;
  const totalMarketCap = useMemo(
    () => assetsToDisplay.reduce((sum, asset) => sum + asset.marketCap, 0),
    [assetsToDisplay]
  );
  // totalVolume24h would be 0 if mocked for all assets
  const totalVolume24h = useMemo(
    () => assetsToDisplay.reduce((sum, asset) => sum + asset.volume24h, 0),
    [assetsToDisplay]
  );

  const platformStats = useMemo(() => [
    { label: "Total Assets", value: totalAssetsCount.toString(), change: "" }, // Change can be dynamic later
    {
      label: "Market Cap",
      value: `$${(totalMarketCap / 1_000_000).toFixed(2)}M`,
      change: "", // Change can be dynamic later
    },
    {
      label: "24h Volume",
      value: `$${(totalVolume24h / 1_000_000).toFixed(2)}M`, // Will be $0.00M if mocked data is 0
      change: "", // Change can be dynamic later
    },
    { label: "Active Traders", value: "N/A", change: "" }, // Mocked, as this data isn't available
  ], [totalAssetsCount, totalMarketCap, totalVolume24h]);


  if (error) {
    return (
      <Layout>
        <div className="text-red-500 text-center py-10">
          Error loading assets: {error.message}
        </div>
      </Layout>
    );
  }

  return (
    <PortfolioOnboardingFlow>
        <div className="relative overflow-hidden py-20">
          {/* Background effects */}
          <div className="absolute inset-0 z-0">
            <motion.div
              className="absolute top-20 left-1/3 h-96 w-96 rounded-full bg-gradient-radial from-metamesh-yellow/10 to-transparent blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
                Tokenized Assets Marketplace
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Discover AI-evaluated companies tokenized on the blockchain.
                Trade shares with autonomous pricing and instant settlement.
              </p>
            </motion.div>

            {/* Search and Controls */}
            <div className="mb-8 flex flex-col lg:flex-row gap-4 justify-between items-center">
              <div className="relative flex-grow max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search assets..."
                  className="w-full pl-10 pr-4 py-3 bg-metamesh-dark-card border border-metamesh-gray focus:border-metamesh-yellow/50 focus:ring-1 focus:ring-metamesh-yellow/30 rounded-lg text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex gap-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-metamesh-dark-card border border-metamesh-gray text-white px-4 py-3 rounded-lg focus:border-metamesh-yellow/50"
                >
                  <option value="marketCap">Market Cap</option>
                  <option value="price">Price</option>
                  <option value="change24h">24h Change</option>
                  <option value="volume24h">24h Volume</option>
                </select>
              </div>
            </div>

            {/* Platform Stats Bar */}
            <motion.div
              className="mb-12 grid grid-cols-2 md:grid-cols-4 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {platformStats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-metamesh-dark-card border border-metamesh-gray rounded-lg p-4 glow-border"
                >
                  <div className="text-sm text-gray-400 mb-1">{stat.label}</div>
                  <div className="text-xl font-bold text-white">{stat.value}</div>
                  {stat.change && <div className="text-sm text-green-400">{stat.change}</div>}
                </div>
              ))}
            </motion.div>

            {/* Assets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {isLoading ? (
                Array(8)
                  .fill(0)
                  .map((_, idx) => <SkeletonCard key={idx} />)
              ) : filteredAssets.length > 0 ? (
                filteredAssets.map((asset, index) => (
                  <motion.div
                    key={asset.address} // Use asset.address as key
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    {/* Ensure AssetCard component can handle AssetForUIDisplay props */}
                    <AssetCard {...asset} />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-16">
                  <p className="text-xl text-gray-400 mb-4">
                    No assets found matching your criteria.
                  </p>
                  {searchQuery && (
                    <SciFiButton onClick={() => setSearchQuery("")}>
                      Clear Search
                    </SciFiButton>
                  )}
                </div>
              )}
            </div>

            {/* Bottom CTA */}
            <motion.div
              className="mt-16 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold mb-4 text-white">
                Ready to tokenize your company?
              </h2>
              <p className="text-gray-400 mb-6">
                Let our AI evaluate your business and guide you through the
                tokenization process.
              </p>
        
            </motion.div>
          </div>
        </div>
    </PortfolioOnboardingFlow>
  );
};

export default AssetsPage;

'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import AssetCard from '@/components/assets/AssetCard';
import { SkeletonCard } from '@/components/ui/SkeletonLoader';
import SciFiButton from '@/components/ui/SciFiButton';
import { Search } from 'lucide-react';
import { useReadZenovaAssetFactoryGetAllAssets, zenovaAssetAbi } from '../../generated'; // Adjusted to zenovaAssetAbi
import { 
  // useAccount,
  useContractReads } from 'wagmi';
import { formatUnits } from 'viem';

// Define the Asset type based on AssetCard props and contract data
interface Asset {
  address: `0x${string}`;
  name: string;
  symbol: string;
  price: number;
  change24h: number; // as a percentage, e.g., 12.34 for +12.34%
  marketCap: number;
  volume24h: number;
  tradingStatus: 'active' | 'pending' | 'paused'; // Adjusted to match AssetCardProps expectation
}

// Define a type for the raw data returned by useContractReads for a single asset
type RawAssetData = [
  { result?: string; status: string }, // name
  { result?: string; status: string }, // symbol
  { result?: bigint; status: string }, // currentPrice
  { result?: bigint; status: string }, // get24hChange
  { result?: bigint; status: string }, // marketCap
  { result?: bigint; status: string }, // volume24h
  { result?: number; status: string }  // tradingStatus (uint8)
];

const mapTradingStatus = (status?: number): Asset['tradingStatus'] => {
  switch (status) {
    case 0: return 'pending';
    case 1: return 'active';
    case 2: return 'pending'; // Changed 'inactive' to 'pending' to align with AssetCard. Consider 'paused' if more appropriate.
    default: return 'pending'; // Default or if status is undefined
  }
};

const AssetsPage = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  // isLoading will be true if we are fetching addresses or any asset details
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('marketCap');

  // const { address: userAddress } = useAccount();

  // 1. Fetch all asset addresses from the factory
  const { data: assetAddresses, isLoading: isLoadingAddresses, error: errorAddresses } =
    useReadZenovaAssetFactoryGetAllAssets({
      // Ensure your factory contract address is correctly configured in wagmi.config.ts
      // or pass it here if needed: address: '0xYourFactoryAddress'
    });

  // 2. Prepare contract read configurations for all assets
  const assetDetailContracts = useMemo(() => {
    if (!assetAddresses) return [];
    return assetAddresses.flatMap(addr => [
      { address: addr, abi: zenovaAssetAbi, functionName: 'name' },
      { address: addr, abi: zenovaAssetAbi, functionName: 'symbol' },
      { address: addr, abi: zenovaAssetAbi, functionName: 'currentPrice' },
      { address: addr, abi: zenovaAssetAbi, functionName: 'get24hChange' }, // Assumed function
      { address: addr, abi: zenovaAssetAbi, functionName: 'marketCap' },    // Assumed function
      { address: addr, abi: zenovaAssetAbi, functionName: 'volume24h' },  // Assumed function
      { address: addr, abi: zenovaAssetAbi, functionName: 'tradingStatus' } // Assumed function
    ]);
  }, [assetAddresses]);

  // 3. Fetch details for all assets
  const { data: rawAssetsDetails, isLoading: isLoadingDetails, error: errorDetails } =
    useContractReads({
      contracts: assetDetailContracts,
      query: {
        enabled: !!assetAddresses && assetAddresses.length > 0,
      },
      allowFailure: true, // Allows individual calls to fail without failing the whole batch
    });

  // 4. Process and set assets state
  useEffect(() => {
    if (rawAssetsDetails && assetAddresses) {
      const numPropertiesPerAsset = 7; // name, symbol, price, change24h, marketCap, volume24h, tradingStatus
      const processedAssets: Asset[] = [];

      for (let i = 0; i < assetAddresses.length; i++) {
        const address = assetAddresses[i];
        const assetDataSlice = rawAssetsDetails.slice(
          i * numPropertiesPerAsset,
          (i + 1) * numPropertiesPerAsset
        ) as RawAssetData;

        if (assetDataSlice.every(d => d.status === 'success')) {
          try {
            const name = assetDataSlice[0].result as string;
            const symbol = assetDataSlice[1].result as string;
            // Assuming 18 decimals for price, marketcap, volume. Adjust if necessary.
            const price = assetDataSlice[2].result ? parseFloat(formatUnits(assetDataSlice[2].result as bigint, 18)) : 0;
            // Assuming change24h is int256 representing basis points (e.g., 1234 for 12.34%)
            const change24h = assetDataSlice[3].result ? Number(assetDataSlice[3].result as bigint) / 100 : 0;
            const marketCap = assetDataSlice[4].result ? parseFloat(formatUnits(assetDataSlice[4].result as bigint, 18)) : 0;
            const volume24h = assetDataSlice[5].result ? parseFloat(formatUnits(assetDataSlice[5].result as bigint, 18)) : 0;
            const tradingStatus = mapTradingStatus(assetDataSlice[6].result as number);

            if (name && symbol) { // Ensure essential data is present
              processedAssets.push({
                address,
                name,
                symbol,
                price,
                change24h,
                marketCap,
                volume24h,
                tradingStatus,
              });
            }
          } catch (e) {
            console.error("Error processing asset data for address:", address, e);
          }
        } else {
          console.warn("Failed to fetch some details for asset:", address, assetDataSlice);
        }
      }
      setAssets(processedAssets);
    }
  }, [rawAssetsDetails, assetAddresses]);
  
  const overallIsLoading = isLoadingAddresses || (!!assetAddresses && assetAddresses.length > 0 && isLoadingDetails);

  const filteredAssets = assets
    .filter(asset =>
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return b.price - a.price;
        case 'change24h':
          return b.change24h - a.change24h;
        case 'volume24h':
          return b.volume24h - a.volume24h;
        default: // marketCap
          return b.marketCap - a.marketCap;
      }
    });

  // Calculate platform stats
  const totalAssetsCount = assets.length;
  const totalMarketCap = useMemo(() => assets.reduce((sum, asset) => sum + asset.marketCap, 0), [assets]);
  const totalVolume24h = useMemo(() => assets.reduce((sum, asset) => sum + asset.volume24h, 0), [assets]);

  const platformStats = [
    { label: 'Total Assets', value: totalAssetsCount.toString(), change: '+3' }, // 'change' is still mock
    { label: 'Market Cap', value: `$${(totalMarketCap / 1_000_000).toFixed(2)}M`, change: '+12.3%' }, // 'change' is mock
    { label: '24h Volume', value: `$${(totalVolume24h / 1_000_000).toFixed(2)}M`, change: '+8.7%' }, // 'change' is mock
    { label: 'Active Traders', value: '12.4K', change: '+156' } // Mocked
  ];

  if (errorAddresses) return <Layout><div className="text-red-500 text-center py-10">Error fetching asset list: {errorAddresses.message}</div></Layout>;
  if (errorDetails) return <Layout><div className="text-red-500 text-center py-10">Error fetching asset details: {errorDetails.message}</div></Layout>;


  return (
    <Layout>
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
              <div key={index} className="bg-metamesh-dark-card border border-metamesh-gray rounded-lg p-4 glow-border">
                <div className="text-sm text-gray-400 mb-1">{stat.label}</div>
                <div className="text-xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-green-400">{stat.change}</div>
              </div>
            ))}
          </motion.div>

          {/* Assets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {overallIsLoading ? (
              Array(8).fill(0).map((_, idx) => (
                <SkeletonCard key={idx} />
              ))
            ) : filteredAssets.length > 0 ? (
              filteredAssets.map((asset, index) => (
                <motion.div
                  key={asset.address}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <AssetCard {...asset} />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <p className="text-xl text-gray-400 mb-4">No assets found matching your criteria.</p>
                {searchQuery && (
                  <SciFiButton onClick={() => setSearchQuery('')}>
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
            <h2 className="text-2xl font-bold mb-4 text-white">Ready to tokenize your company?</h2>
            <p className="text-gray-400 mb-6">
              Let our AI evaluate your business and guide you through the tokenization process.
            </p>
            <SciFiButton to="/onboarding" variant="primary" size="lg">
              Begin AI Onboarding
            </SciFiButton>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default AssetsPage;

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import AssetCard from '@/components/assets/AssetCard';
import { SkeletonCard } from '@/components/ui/SkeletonLoader';
import SciFiButton from '@/components/ui/SciFiButton';
import { Search } from 'lucide-react';

// Mock assets data with proper typing
const mockAssets = [
  {
    address: '0x1234567890abcdef',
    name: 'QuantumTech Industries',
    symbol: 'QTI',
    price: 45.67,
    change24h: 12.34,
    marketCap: 2350000,
    volume24h: 125000,
    tradingStatus: 'active' as const
  },
  {
    address: '0x2345678901bcdefg',
    name: 'NeuralDyne Corporation',
    symbol: 'NDC',
    price: 128.90,
    change24h: -5.67,
    marketCap: 5670000,
    volume24h: 890000,
    tradingStatus: 'active' as const
  },
  {
    address: '0x3456789012cdefgh',
    name: 'CyberBio Solutions',
    symbol: 'CBS',
    price: 78.34,
    change24h: 8.91,
    marketCap: 1890000,
    volume24h: 345000,
    tradingStatus: 'active' as const
  },
  {
    address: '0x4567890123defghi',
    name: 'HoloSpace Dynamics',
    symbol: 'HSD',
    price: 234.56,
    change24h: 23.45,
    marketCap: 8900000,
    volume24h: 1200000,
    tradingStatus: 'active' as const
  }
];

const Assets = () => {
  const [assets, setAssets] = useState<typeof mockAssets>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('marketCap');

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setAssets(mockAssets);
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

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
        default:
          return b.marketCap - a.marketCap;
      }
    });

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
            {[
              { label: 'Total Assets', value: '47', change: '+3' },
              { label: 'Market Cap', value: '$234.5M', change: '+12.3%' },
              { label: '24h Volume', value: '$45.2M', change: '+8.7%' },
              { label: 'Active Traders', value: '12.4K', change: '+156' }
            ].map((stat, index) => (
              <div key={index} className="bg-metamesh-dark-card border border-metamesh-gray rounded-lg p-4 glow-border">
                <div className="text-sm text-gray-400 mb-1">{stat.label}</div>
                <div className="text-xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-green-400">{stat.change}</div>
              </div>
            ))}
          </motion.div>

          {/* Assets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isLoading ? (
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
                <SciFiButton onClick={() => setSearchQuery('')}>
                  Clear Search
                </SciFiButton>
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

export default Assets;

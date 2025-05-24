"use client";

import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import SciFiButton from '@/components/ui/SciFiButton';
import { TrendingUp, TrendingDown, Wallet, DollarSign } from 'lucide-react';

export default function Portfolio() {
  // Mock portfolio data
  const portfolioData = {
    totalValue: 15420.50,
    totalChange: 8.4,
    holdings: [
      {
        address: '0x1234567890abcdef',
        name: 'QuantumTech Industries',
        symbol: 'QTI',
        shares: 100,
        avgPrice: 42.30,
        currentPrice: 45.67,
        value: 4567,
        change: 7.96
      },
      {
        address: '0x2345678901bcdefg',
        name: 'NeuralDyne Corporation',
        symbol: 'NDC',
        shares: 50,
        avgPrice: 125.00,
        currentPrice: 128.90,
        value: 6445,
        change: 3.12
      },
      {
        address: '0x3456789012cdefgh',
        name: 'CyberBio Solutions',
        symbol: 'CBS',
        shares: 75,
        avgPrice: 72.50,
        currentPrice: 78.34,
        value: 5875.5,
        change: 8.05
      }
    ]
  };

  return (
    <Layout>
      <div className="relative overflow-hidden py-20">
        {/* Background effects */}
        <div className="absolute inset-0 z-0">
          <motion.div 
            className="absolute top-20 left-1/4 h-96 w-96 rounded-full bg-gradient-radial from-metamesh-yellow/10 to-transparent blur-3xl"
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
              Your Portfolio
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Track your tokenized asset holdings and performance in real-time.
            </p>
          </motion.div>

          {/* Portfolio Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-metamesh-dark-card border border-metamesh-gray rounded-lg p-6 mb-8 glow-border"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
                  <Wallet className="h-5 w-5 text-metamesh-yellow" />
                  <span className="text-gray-400">Total Portfolio Value</span>
                </div>
                <div className="text-3xl font-bold text-white">${portfolioData.totalValue.toLocaleString()}</div>
              </div>
              
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
                  <DollarSign className="h-5 w-5 text-metamesh-yellow" />
                  <span className="text-gray-400">24h Change</span>
                </div>
                <div className={`text-2xl font-bold flex items-center justify-center md:justify-start space-x-1 ${portfolioData.totalChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {portfolioData.totalChange >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                  <span>{portfolioData.totalChange >= 0 ? '+' : ''}{portfolioData.totalChange}%</span>
                </div>
              </div>

              <div className="text-center md:text-right">
                <SciFiButton to="/assets" variant="primary" size="lg">
                  Discover Assets
                </SciFiButton>
              </div>
            </div>
          </motion.div>

          {/* Holdings Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-metamesh-dark-card border border-metamesh-gray rounded-lg overflow-hidden"
          >
            <div className="p-6 border-b border-metamesh-gray">
              <h2 className="text-xl font-bold text-white">Your Holdings</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-metamesh-dark-light">
                  <tr>
                    <th className="px-6 py-4 text-left text-gray-400 text-sm font-medium">Asset</th>
                    <th className="px-6 py-4 text-left text-gray-400 text-sm font-medium">Shares</th>
                    <th className="px-6 py-4 text-left text-gray-400 text-sm font-medium">Avg Price</th>
                    <th className="px-6 py-4 text-left text-gray-400 text-sm font-medium">Current Price</th>
                    <th className="px-6 py-4 text-left text-gray-400 text-sm font-medium">Value</th>
                    <th className="px-6 py-4 text-left text-gray-400 text-sm font-medium">P&L</th>
                    <th className="px-6 py-4 text-left text-gray-400 text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolioData.holdings.map((holding, index) => (
                    <motion.tr
                      key={holding.address}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                      className="border-b border-metamesh-gray hover:bg-metamesh-dark-light/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-semibold text-white">{holding.name}</div>
                          <div className="text-sm text-gray-400">{holding.symbol}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-white">{holding.shares}</td>
                      <td className="px-6 py-4 text-white">${holding.avgPrice}</td>
                      <td className="px-6 py-4 text-white">${holding.currentPrice}</td>
                      <td className="px-6 py-4 text-white font-semibold">${holding.value.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`font-semibold ${holding.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {holding.change >= 0 ? '+' : ''}{holding.change}%
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <SciFiButton 
                          to={`/assets/${holding.address}`} 
                          variant="outline" 
                          size="sm"
                        >
                          View Details
                        </SciFiButton>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Empty State */}
          {portfolioData.holdings.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center py-16"
            >
              <Wallet className="h-16 w-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Holdings Yet</h3>
              <p className="text-gray-400 mb-6">Start building your portfolio by investing in tokenized assets.</p>
              <SciFiButton to="/assets" variant="primary" size="lg">
                Browse Assets
              </SciFiButton>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
};


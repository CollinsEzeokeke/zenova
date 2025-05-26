"use client";

import { motion } from 'framer-motion';
import SciFiButton from '@/components/ui/SciFiButton';
import { TrendingUp, TrendingDown, Wallet, DollarSign } from 'lucide-react';
import { useZenovaPortfolio } from "@/hooks/useZenovaPortfolio"
import { useAccount } from "wagmi";
import { AlertTriangle, Loader2 } from "lucide-react";
import { formatAddressShort } from "@/src/mastra/tools/zenova/formatters"; // For displaying asset addresses if needed
import { FormattedUserAssetInfo, FormattedUserPortfolioDetails } from "@/src/mastra/tools/zenova/zenovaFormattedTypes";
import PortfolioHoldingRow from "./PortfolioHoldingRow"; // Import the new component

export default function Portfolio() {
  const { address: userAddress, isConnected } = useAccount();
  const { 
    data: rawPortfolioData, // data from useQuery, can be FormattedUserPortfolioDetails | undefined
    isLoading, 
    error: queryError, 
    refetch
  } = useZenovaPortfolio();

  // Explicitly cast to the type we expect upon successful fetch
  const portfolioData = rawPortfolioData as FormattedUserPortfolioDetails | undefined;

  const displayErrorMessage = queryError?.message;

  // Mock total change for now, as it's complex to calculate from contract data directly
  const mockTotalChange = 8.4;

  const renderedRows = (portfolioData?.assetHoldings && portfolioData.heldAssetAddresses)
    ? portfolioData.assetHoldings.map((holding: FormattedUserAssetInfo, index: number) => {
        const assetAddress = portfolioData.heldAssetAddresses[index];
        // Ensure assetAddress is a valid, non-zero hex string.
        if (!assetAddress || assetAddress === "0x0000000000000000000000000000000000000000") {
          // Skip rendering this row if the asset address is invalid or zero.
          return null;
        }
        return (
          <PortfolioHoldingRow
            key={assetAddress}
            assetAddress={assetAddress}
            holding={holding}
            index={index}
            totalPortfolioValue={parseFloat(portfolioData?.totalPortfolioValue?.replace(/[^\d.-]/g, '') || "0")}
          />
        );
      }).filter(Boolean) // Remove nulls, keeping only valid JSX elements
    : [];

  if (!isConnected) {
    return (
      <div className="relative overflow-hidden py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Wallet className="h-16 w-16 text-gray-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-white mb-3">Connect Your Wallet</h2>
          <p className="text-gray-400">
            Please connect your wallet to view your Zenova asset portfolio.
          </p>
          {/* Add a connect wallet button here if you have a global one, or instruct the user */}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="relative overflow-hidden py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Loader2 className="h-16 w-16 text-metamesh-yellow mx-auto mb-4 animate-spin" />
          <h2 className="text-2xl font-semibold text-white mb-3">Loading Portfolio...</h2>
          <p className="text-gray-400">
            Fetching your Zenova asset data from the blockchain.
          </p>
        </div>
      </div>
    );
  }

  if (displayErrorMessage && !isLoading) { 
    return (
      <div className="relative overflow-hidden py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-white mb-3">Error Loading Portfolio</h2>
          <p className="text-gray-400 mb-6">
            There was an issue fetching your portfolio: {displayErrorMessage}
          </p>
          <SciFiButton onClick={() => refetch()} variant="primary" size="lg">
            Try Again
          </SciFiButton>
        </div>
      </div>
    );
  }
  
  // Ensure totalPortfolioValue is declared once, after potential early returns and after renderedRows is defined.
  const totalPortfolioValue = parseFloat(portfolioData?.totalPortfolioValue?.replace(/[^\d.-]/g, '') || "0");
  const holdings: FormattedUserAssetInfo[] = portfolioData?.assetHoldings || [];

  return (
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
              <div className="text-3xl font-bold text-white">{totalPortfolioValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</div>
            </div>
            
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
                <DollarSign className="h-5 w-5 text-metamesh-yellow" />
                <span className="text-gray-400">24h Change</span>
              </div>
              <div className={`text-2xl font-bold flex items-center justify-center md:justify-start space-x-1 ${mockTotalChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {mockTotalChange >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                <span>{mockTotalChange >= 0 ? '+' : ''}{mockTotalChange}%</span>
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
                  <th className="px-6 py-4 text-center text-gray-400 text-sm font-medium">Asset</th>
                  <th className="px-6 py-4 text-center text-gray-400 text-sm font-medium">Balance</th>
                  <th className="px-6 py-4 text-center text-gray-400 text-sm font-medium">Ownership</th>
                  <th className="px-6 py-4 text-center text-gray-400 text-sm font-medium">Value (USD)</th>
                  <th className="px-6 py-4 text-center text-gray-400 text-sm font-medium">Total Invested (USD)</th>
                  <th className="px-6 py-4 text-center text-gray-400 text-sm font-medium">Unrealized P&L (USD)</th>
                  <th className="px-6 py-4 text-center text-gray-400 text-sm font-medium">Realized P&L (USD)</th>
                  <th className="px-6 py-4 text-center text-gray-400 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {renderedRows}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Empty State */}
        {!isLoading && !displayErrorMessage && renderedRows.length === 0 && (
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
  );
};


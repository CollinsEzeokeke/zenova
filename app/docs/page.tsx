"use client";

import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { Code, Cpu, Layers, Network, Zap, Shield } from 'lucide-react';

const Documentation = () => {
  return (
    <Layout>
      <div className="relative overflow-hidden py-20">
        {/* Background effects */}
        <div className="absolute inset-0 z-0">
          <motion.div 
            className="absolute top-20 right-1/4 h-96 w-96 rounded-full bg-gradient-radial from-metamesh-yellow/10 to-transparent blur-3xl"
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

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-4xl">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
              Zenova Platform Documentation
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Technical architecture and component overview for the decentralized, AI-powered platform for tokenizing company shares
            </p>
          </motion.div>

          <div className="prose prose-invert max-w-none">
            {/* Introduction */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-16"
            >
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                <Zap className="h-8 w-8 text-metamesh-yellow mr-3" />
                Introduction to Zenova
              </h2>
              
              <div className="bg-metamesh-dark-card border border-metamesh-gray rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold text-white mb-4">What is Zenova?</h3>
                <p className="text-gray-300 mb-4">
                  Zenova redefines how companies go public and trade stocks using **AI** and **blockchain technology**. 
                  It&apos;s an AI-powered, decentralized platform that allows private companies to bypass traditional IPOs 
                  through autonomous evaluation and tokenization processes.
                </p>
                <p className="text-gray-300">
                  AI agents autonomously evaluate companies, determine valuations, and mint ERC-20 tokens representing 
                  shares. Trading and pricing are also AI-governed, creating a fully autonomous marketplace for 
                  tokenized company equity.
                </p>
              </div>

              <h3 className="text-xl font-semibold text-white mb-4">Core Principles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {[
                  { icon: Cpu, title: "AI-Driven", desc: "Autonomous AI agents handle evaluation, pricing, and trading decisions" },
                  { icon: Network, title: "Decentralized", desc: "Built on blockchain infrastructure with no central authority" },
                  { icon: Zap, title: "Autonomous", desc: "Self-governing platform with minimal human intervention" },
                  { icon: Shield, title: "Transparent", desc: "All operations are verifiable on-chain with open smart contracts" }
                ].map((principle, index) => (
                  <div key={index} className="bg-metamesh-dark-card border border-metamesh-gray rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <principle.icon className="h-5 w-5 text-metamesh-yellow mr-2" />
                      <h4 className="font-semibold text-white">{principle.title}</h4>
                    </div>
                    <p className="text-gray-400 text-sm">{principle.desc}</p>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* The Zenova Ecosystem */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-16"
            >
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                <Layers className="h-8 w-8 text-metamesh-yellow mr-3" />
                The Zenova Ecosystem: Key Components
              </h2>

              {/* AI_ROLE */}
              <div className="bg-metamesh-dark-card border border-metamesh-gray rounded-lg p-6 mb-8">
                <h3 className="text-2xl font-semibold text-metamesh-yellow mb-4">The `AI_ROLE`: The Engine of Zenova</h3>
                <p className="text-gray-300 mb-4">
                  Zenova implements an **ultra-simplified** role-based access control system centered around a single, 
                  all-powerful role: the `AI_ROLE`. This design philosophy underpins Zenova&apos;s commitment to being 
                  a fully autonomous, AI-driven platform.
                </p>
                
                <div className="bg-metamesh-dark/50 border border-metamesh-gray/50 rounded p-4 mb-4">
                  <h4 className="font-semibold text-white mb-2">Key Characteristics:</h4>
                  <ul className="text-gray-300 space-y-1">
                    <li>• **Single Role Architecture**: Only `AI_ROLE` exists, responsible for ALL platform operations</li>
                    <li>• **AI and Administrative Control**: Encompasses both AI-driven decisions and administrative tasks</li>
                    <li>• **Incentive Alignment**: The AI that evaluates a company becomes its asset manager</li>
                    <li>• **No Admin Overhead**: Eliminates complex governance and human administrative burden</li>
                  </ul>
                </div>

                <p className="text-gray-300">
                  The `onlyAI` modifier restricts critical functions to entities holding the `AI_ROLE`, ensuring 
                  that only authorized AI agents can perform evaluations, price updates, and asset management.
                </p>
              </div>

              {/* ZenovaAssetFactory */}
              <div className="bg-metamesh-dark-card border border-metamesh-gray rounded-lg p-6 mb-8">
                <h3 className="text-2xl font-semibold text-metamesh-yellow mb-4">`ZenovaAssetFactory.sol`: The Asset Genesis Engine</h3>
                <p className="text-gray-300 mb-4">
                  The central factory contract responsible for creating and managing `ZenovaAsset` instances representing 
                  tokenized company shares. It leverages the clone pattern for efficient asset deployment.
                </p>

                <h4 className="font-semibold text-white mb-3">Core Functions:</h4>
                
                <div className="space-y-4">
                  <div className="bg-metamesh-dark/50 border border-metamesh-gray/50 rounded p-4">
                    <h5 className="font-mono text-metamesh-yellow mb-2">`submitCompanyValuation()`</h5>
                    <p className="text-gray-300 text-sm mb-2">
                      **Restricted to `AI_ROLE`**. Records a company&apos;s AI-assessed valuation and suggested initial token price.
                    </p>
                    <div className="bg-black/30 rounded p-2">
                      <code className="text-xs text-gray-400">
                        Parameters: _companyWallet, _valuation, _initialPricePerToken<br/>
                        Stores: CompanyInitialValuation struct in assetInitialValuations mapping
                      </code>
                    </div>
                  </div>

                  <div className="bg-metamesh-dark/50 border border-metamesh-gray/50 rounded p-4">
                    <h5 className="font-mono text-metamesh-yellow mb-2">`createZenovaAsset()`</h5>
                    <p className="text-gray-300 text-sm mb-2">
                      **Restricted to `AI_ROLE`** (same AI that submitted valuation). Creates a new tokenized asset through cloning.
                    </p>
                    <div className="bg-black/30 rounded p-2">
                      <code className="text-xs text-gray-400">
                        1. Retrieves stored valuation details<br/>
                        2. Clones ZenovaAsset implementation<br/>
                        3. Calls initialize() with AI as admin<br/>
                        4. Calls setCompanyValuationAndSupply()
                      </code>
                    </div>
                  </div>
                </div>

                <h4 className="font-semibold text-white mb-3 mt-6">Analytics Functions:</h4>
                <p className="text-gray-300 text-sm mb-2">
                  The factory provides comprehensive analytics for off-chain consumption:
                </p>
                <ul className="text-gray-400 text-sm space-y-1">
                  <li>• `getCompanyComprehensiveDetails()` - Complete company and asset information</li>
                  <li>• `getPlatformSnapshot()` - Platform-wide statistics and metrics</li>
                  <li>• `getUserPortfolioDetails()` - Individual user portfolio analysis</li>
                  <li>• `getMultipleAssetAnalytics()` - Batch asset data retrieval</li>
                </ul>
              </div>

              {/* ZenovaAsset */}
              <div className="bg-metamesh-dark-card border border-metamesh-gray rounded-lg p-6 mb-8">
                <h3 className="text-2xl font-semibold text-metamesh-yellow mb-4">`ZenovaAsset.sol`: The Digital Share</h3>
                <p className="text-gray-300 mb-4">
                  Represents a company&apos;s tokenized shares as an ERC20 token. Inherits from OpenZeppelin&apos;s 
                  `ERC20`, `AccessControlEnumerable`, `Pausable`, and Zenova&apos;s `ZenovaRoles`.
                </p>

                <h4 className="font-semibold text-white mb-3">Key Data Structures:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-metamesh-dark/50 border border-metamesh-gray/50 rounded p-3">
                    <h5 className="font-mono text-metamesh-yellow text-sm mb-2">`CompanyInfo`</h5>
                    <ul className="text-gray-400 text-xs space-y-1">
                      <li>• name, symbol, description</li>
                      <li>• website, issuingCompanyWallet</li>
                    </ul>
                  </div>
                  <div className="bg-metamesh-dark/50 border border-metamesh-gray/50 rounded p-3">
                    <h5 className="font-mono text-metamesh-yellow text-sm mb-2">`AssetPricingDetails`</h5>
                    <ul className="text-gray-400 text-xs space-y-1">
                      <li>• currentPricePerToken, fees</li>
                      <li>• marketCap, acceptedCurrency</li>
                    </ul>
                  </div>
                </div>

                <h4 className="font-semibold text-white mb-3">Token Supply Calculation:</h4>
                <div className="bg-black/30 rounded p-4 mb-4">
                  <code className="text-metamesh-yellow">
                    maxTokenSupply = (_companyValuation * 10^18) / _initialPricePerToken
                  </code>
                  <p className="text-gray-400 text-xs mt-2">
                    Where decimals() returns 18, ensuring precise token mathematics
                  </p>
                </div>

                <h4 className="font-semibold text-white mb-3">AI-Controlled Functions:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  {[
                    'updatePrice()', 'updateLiquidityParameters()', 
                    'activateTrading()', 'deactivateTrading()',
                    'withdrawFees()', 'companyWithdraw()',
                    'pause()', 'unpause()'
                  ].map((func, index) => (
                    <div key={index} className="bg-metamesh-dark/50 border border-metamesh-gray/50 rounded p-2">
                      <code className="text-metamesh-yellow text-sm">{func}</code>
                    </div>
                  ))}
                </div>

                <h4 className="font-semibold text-white mb-3">Trading Mechanism:</h4>
                <p className="text-gray-300 text-sm mb-2">
                  **AI-Determined Pricing**: Prices are set by AI agents, not peer-to-peer auctions.
                </p>
                <div className="space-y-2">
                  <div className="bg-metamesh-dark/50 border border-metamesh-gray/50 rounded p-3">
                    <h5 className="font-mono text-metamesh-yellow text-sm mb-1">`buyTokens()` / `sellTokens()`</h5>
                    <p className="text-gray-400 text-xs">
                      Users interact with the contract directly. Tokens are minted on purchase and burned on sale. 
                      All transactions use the configured `acceptedCurrency` (e.g., USDC).
                    </p>
                  </div>
                </div>
              </div>

              {/* IZenovaAsset */}
              <div className="bg-metamesh-dark-card border border-metamesh-gray rounded-lg p-6 mb-8">
                <h3 className="text-2xl font-semibold text-metamesh-yellow mb-4">`IZenovaAsset.sol`: The Asset Contract Interface</h3>
                <p className="text-gray-300 mb-4">
                  Defines the complete public Application Programming Interface (API) for the `ZenovaAsset` contract, 
                  including all functions, events, errors, and data structures.
                </p>
                
                <h4 className="font-semibold text-white mb-3">Key Information Structures:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { name: 'FullAssetDetails', desc: 'Complete asset information including company details, pricing, and admin roles' },
                    { name: 'TradingMetrics', desc: 'Volume, transaction counts, fees collected, and trading statistics' },
                    { name: 'MarketAnalysis', desc: 'Market cap, ratios, valuation analysis, and market health indicators' },
                    { name: 'UserAssetInfo', desc: 'Individual user holdings, P&L, trading history, and portfolio data' }
                  ].map((struct, index) => (
                    <div key={index} className="bg-metamesh-dark/50 border border-metamesh-gray/50 rounded p-3">
                      <h5 className="font-mono text-metamesh-yellow text-sm mb-1">{struct.name}</h5>
                      <p className="text-gray-400 text-xs">{struct.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* USDTMock */}
              <div className="bg-metamesh-dark-card border border-metamesh-gray rounded-lg p-6 mb-8">
                <h3 className="text-2xl font-semibold text-metamesh-yellow mb-4">`USDTMock.sol`: The Accepted Currency (Example)</h3>
                <p className="text-gray-300 mb-4">
                  A mock ERC20 token contract designed for testing and development, serving as an example 
                  implementation of the `acceptedCurrency` used for valuations and trading within Zenova.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Key Characteristics:</h4>
                    <ul className="text-gray-400 text-sm space-y-1">
                      <li>• **6 decimals** (standard for USDT)</li>
                      <li>• Minting capabilities for testing</li>
                      <li>• Burn functionality</li>
                      <li>• Wei conversion utilities</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Testing Functions:</h4>
                    <ul className="text-gray-400 text-sm space-y-1">
                      <li>• `mintTestTokens()` - Public limited minting</li>
                      <li>• `bulkMintTestTokens()` - Batch minting</li>
                      <li>• `ownerMint()` - Unrestricted owner minting</li>
                      <li>• `toWei()` / `fromWei()` - Amount conversion</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Asset Lifecycle */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-16"
            >
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                <Network className="h-8 w-8 text-metamesh-yellow mr-3" />
                Asset Lifecycle in Zenova
              </h2>

              <div className="space-y-6">
                {[
                  {
                    step: "1",
                    title: "AI Evaluation & Valuation Submission",
                    description: "AI agent analyzes company data and submits valuation via `submitCompanyValuation()`",
                    details: "The AI evaluates financial data, market position, and growth potential to determine company valuation and optimal initial token price."
                  },
                  {
                    step: "2", 
                    title: "Asset Creation & Configuration",
                    description: "Factory creates new ZenovaAsset instance through `createZenovaAsset()`",
                    details: "Clones asset implementation, initializes with company info, and sets valuation parameters. AI becomes the asset's admin and price manager."
                  },
                  {
                    step: "3",
                    title: "AI Management of Live Asset", 
                    description: "AI continuously manages pricing, liquidity, and trading parameters",
                    details: "AI monitors market conditions and adjusts token price, trading fees, and liquidity parameters. Can pause trading or withdraw fees as needed."
                  },
                  {
                    step: "4",
                    title: "User Trading of Tokenized Shares",
                    description: "Users buy and sell tokens through AI-priced trading functions",
                    details: "Users interact directly with the asset contract to trade tokens at AI-determined prices. Tokens are minted on purchase and burned on sale."
                  }
                ].map((phase, index) => (
                  <div key={index} className="bg-metamesh-dark-card border border-metamesh-gray rounded-lg p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-metamesh-yellow rounded-full flex items-center justify-center">
                        <span className="text-black font-bold text-sm">{phase.step}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-2">{phase.title}</h3>
                        <p className="text-metamesh-yellow mb-2">{phase.description}</p>
                        <p className="text-gray-400 text-sm">{phase.details}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Technical Architecture */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mb-16"
            >
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                <Code className="h-8 w-8 text-metamesh-yellow mr-3" />
                Technical Architecture Overview
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { category: "Frontend", tech: "Next.js, Tailwind CSS, Framer Motion" },
                  { category: "Blockchain", tech: "Ethereum/EVM Compatible Networks" },
                  { category: "Tokens", tech: "ERC-20 Standard with Custom Extensions" },
                  { category: "Smart Contracts", tech: "Solidity, OpenZeppelin, Clone Pattern" }
                ].map((stack, index) => (
                  <div key={index} className="bg-metamesh-dark-card border border-metamesh-gray rounded-lg p-4">
                    <h3 className="font-semibold text-metamesh-yellow mb-2">{stack.category}</h3>
                    <p className="text-gray-400 text-sm">{stack.tech}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-metamesh-dark-card border border-metamesh-gray rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Application Workflow</h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-center">
                  {[
                    "Company Onboarding",
                    "Token Generation", 
                    "AI-Governed Trading",
                    "User Dashboard",
                    "Market Monitoring"
                  ].map((stage, index) => (
                    <div key={index} className="bg-metamesh-dark/50 border border-metamesh-gray/50 rounded p-3">
                      <p className="text-gray-300 text-sm font-medium">{stage}</p>
                      {index < 4 && (
                        <div className="hidden md:block absolute right-0 top-1/2 transform translate-x-2 -translate-y-1/2">
                          <div className="w-4 h-0.5 bg-metamesh-yellow"></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Documentation;

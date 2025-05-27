"use client";

import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { Code, Cpu, Layers, Network, Zap, Shield, CircleDollarSign, BrainCircuit, Wrench, Factory, Database, TestTube2, Search, ListChecks, FileJson, Type, Package, Workflow, Library } from 'lucide-react';

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
                <h3 className="text-2xl font-semibold text-metamesh-yellow mb-4 flex items-center">
                  <Factory className="h-7 w-7 text-metamesh-yellow mr-3" />
                  `ZenovaAssetFactory.sol`: The Asset Genesis Engine
                </h3>
                <p className="text-gray-300 mb-4">
                  The central factory contract responsible for creating and managing `ZenovaAsset` instances representing 
                  tokenized company shares. It leverages the clone pattern for efficient asset deployment and serves as the main administrative hub for platform-level operations and analytics.
                </p>

                <h4 className="font-semibold text-white mb-3">Core Functions:</h4>
                
                <div className="space-y-4">
                  <div className="bg-metamesh-dark/50 border border-metamesh-gray/50 rounded p-4">
                    <h5 className="font-mono text-metamesh-yellow mb-2">`submitCompanyValuation()`</h5>
                    <p className="text-gray-300 text-sm mb-2">
                      **Restricted to `AI_ROLE`**. Records a company&apos;s AI-assessed valuation and suggested initial token price. This is the first step in the asset tokenization pipeline, logging critical financial data provided by the Zenova AI Agent.
                    </p>
                    <div className="bg-black/30 rounded p-2">
                      <code className="text-xs text-gray-400">
                        Parameters: _companyWallet, _valuation (USDT), _initialPricePerToken (USDT)<br/>
                        Stores: CompanyInitialValuation struct in `assetInitialValuations` mapping.<br/>
                        Emits: `CompanyValuationSubmitted` event.
                      </code>
                    </div>
                  </div>

                  <div className="bg-metamesh-dark/50 border border-metamesh-gray/50 rounded p-4">
                    <h5 className="font-mono text-metamesh-yellow mb-2">`createZenovaAsset()`</h5>
                    <p className="text-gray-300 text-sm mb-2">
                      **Restricted to `AI_ROLE`** (same AI that submitted valuation). Creates a new tokenized asset by cloning a master `ZenovaAsset` implementation.
                    </p>
                    <div className="bg-black/30 rounded p-2">
                      <code className="text-xs text-gray-400">
                        1. Retrieves stored valuation details for the `_companyWallet`.<br/>
                        2. Clones `zenovaAssetImplementation` using `ClonesUpgradeable.clone()`.<br/>
                        3. Calls `initialize()` on the new asset, granting `AI_ROLE` to the creating AI.<br/>
                        4. Calls `setCompanyValuationAndSupply()` on the new asset to configure it.<br/>
                        Emits: `ZenovaAssetCreated` event with key details.
                      </code>
                    </div>
                  </div>
                </div>

                <h4 className="font-semibold text-white mb-3 mt-6">Key State Variables & Mappings:</h4>
                <ul className="text-gray-400 text-sm space-y-1 list-disc list-inside">
                  <li>`zenovaAssetImplementation`: Address of the master `ZenovaAsset` contract.</li>
                  <li>`acceptedCurrency`: Address of the currency (e.g., USDTMock) used for valuations and trading.</li>
                  <li>`assetInitialValuations`: Mapping from company wallet to their `CompanyInitialValuation` struct.</li>
                  <li>`allAssets`: Array of all created `ZenovaAsset` contract addresses.</li>
                  <li>`companyToAssets`: Mapping from company wallet to an array of their associated `ZenovaAsset` addresses.</li>
                </ul>

                <h4 className="font-semibold text-white mb-3 mt-6">Analytics & View Functions:</h4>
                <p className="text-gray-300 text-sm mb-2">
                  The factory provides comprehensive analytics for off-chain consumption and platform monitoring:
                </p>
                <ul className="text-gray-400 text-sm space-y-1 list-disc list-inside">
                  <li>`getCompanyComprehensiveDetails()`: Complete data for a company including pending valuations and all its live assets.</li>
                  <li>`getPlatformSnapshot()`: Platform-wide statistics like total assets, market cap, trading volume, etc.</li>
                  <li>`getUserPortfolioDetails()`: Aggregated portfolio information for a specific user across all Zenova assets.</li>
                  <li>`getMultipleAssetAnalytics()`: Batch retrieval of full details, trading metrics, and market analysis for multiple assets.</li>
                  <li>`getAssetFullDetails()`: Detailed information for a single asset, callable from the factory.</li>
                  <li>`getAllAssets()`, `getAssetsByCompany()`, `getSubmittedValuation()`, `totalAssets()`: Various utility views for asset and valuation data.</li>
                </ul>
              </div>

              {/* ZenovaAsset */}
              <div className="bg-metamesh-dark-card border border-metamesh-gray rounded-lg p-6 mb-8">
                <h3 className="text-2xl font-semibold text-metamesh-yellow mb-4 flex items-center">
                  <Package className="h-7 w-7 text-metamesh-yellow mr-3" />
                  `ZenovaAsset.sol`: The Digital Share
                </h3>
                <p className="text-gray-300 mb-4">
                  Represents a company&apos;s tokenized shares as an ERC20-compliant token. It inherits from OpenZeppelin&apos;s 
                  `ERC20`, `AccessControlEnumerable`, `Pausable`, and Zenova&apos;s internal `ZenovaRoles` and `Initializable` (for clone pattern).
                </p>

                <h4 className="font-semibold text-white mb-3">Core Roles & Permissions:</h4>
                 <ul className="text-gray-400 text-sm space-y-1 list-disc list-inside mb-4">
                    <li>`DEFAULT_ADMIN_ROLE`: General administrative control, typically held by the creating AI.</li>
                    <li>`AI_ROLE`: The primary operational role, assigned to the AI agent responsible for managing the asset. This role can update prices, manage liquidity, activate/deactivate trading, and withdraw fees.</li>
                    <li>`PAUSER_ROLE`: Can pause and unpause the contract, also typically held by the AI.</li>
                </ul>

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
                    Where `decimals()` returns 18 for ZenovaAsset tokens, ensuring precise token mathematics. The `_companyValuation` and `_initialPricePerToken` are in terms of the `acceptedCurrency` (e.g., USDT with 6 decimals).
                  </p>
                </div>

                <h4 className="font-semibold text-white mb-3">AI-Controlled Functions (requiring `AI_ROLE`):</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  {[
                    { name: 'updatePrice()', desc: 'Adjusts token price based on AI analysis.' },
                    { name: 'updateLiquidityParameters()', desc: 'Modifies buy/sell fees.' },
                    { name: 'activateTrading()', desc: 'Enables buy/sell functionality.' },
                    { name: 'deactivateTrading()', desc: 'Disables buy/sell functionality.' },
                    { name: 'withdrawFees()', desc: 'Transfers collected fees to a recipient.' },
                    { name: 'companyWithdraw()', desc: 'Allows company to withdraw their share of tokens.' },
                    // Pause/Unpause are typically admin/pauser role but AI usually holds this.
                  ].map((func, index) => (
                    <div key={index} className="bg-metamesh-dark/50 border border-metamesh-gray/50 rounded p-3">
                      <code className="text-metamesh-yellow text-sm block mb-1">{func.name}</code>
                      <p className="text-gray-400 text-xs">{func.desc}</p>
                    </div>
                  ))}
                </div>
                <h4 className="font-semibold text-white mb-3">Pausable Functions (requiring `PAUSER_ROLE`):</h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    {[ { name: 'pause()', desc: 'Halts key contract operations.'}, { name: 'unpause()', desc: 'Resumes contract operations.'}].map((func, index) => (
                      <div key={index} className="bg-metamesh-dark/50 border border-metamesh-gray/50 rounded p-3">
                        <code className="text-metamesh-yellow text-sm block mb-1">{func.name}</code>
                        <p className="text-gray-400 text-xs">{func.desc}</p>
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
                <h3 className="text-2xl font-semibold text-metamesh-yellow mb-4 flex items-center">
                  <Library className="h-7 w-7 text-metamesh-yellow mr-3" />
                  `IZenovaAsset.sol`: The Asset Contract Interface
                </h3>
                <p className="text-gray-300 mb-4">
                  Defines the complete public Application Programming Interface (API) for the `ZenovaAsset` contract, 
                  including all functions, events, errors, and data structures. This ensures interoperability and clear contract boundaries.
                </p>
                
                <h4 className="font-semibold text-white mb-3">Key Information Structures (Structs):</h4>
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

              {/* USDTMock - Expanded */}
              <div className="bg-metamesh-dark-card border border-metamesh-gray rounded-lg p-6 mb-8">
                <h3 className="text-2xl font-semibold text-metamesh-yellow mb-4 flex items-center">
                  <CircleDollarSign className="h-7 w-7 text-metamesh-yellow mr-3" />
                  `USDTMock.sol`: The Test Currency Backbone
                </h3>
                <p className="text-gray-300 mb-4">
                  `USDTMock.sol` is an essential ERC20 token contract specifically designed for testing and development within the Zenova ecosystem. 
                  It emulates the behavior of Tether (USDT) by implementing **6 decimal places**, a standard for many stablecoins. This mock token serves as the primary `acceptedCurrency` for company valuations, token pricing, and trading simulations on test networks.
                </p>
                
                <h4 className="font-semibold text-white mb-3">Core Features & Purpose:</h4>
                <ul className="text-gray-400 text-sm space-y-2 list-disc list-inside mb-4">
                  <li>**Standard Compliance**: Inherits from OpenZeppelin&apos;s `ERC20` for robust and secure token functionality, and `Ownable` for administrative control by its deployer.</li>
                  <li>**Decimal Precision**: Strictly uses 6 decimals, aligning with real-world USDT and ensuring calculations involving it are representative.</li>
                  <li>**Controlled Minting**: Provides flexible minting capabilities crucial for setting up diverse testing scenarios:
                    <ul className="text-gray-400 text-xs space-y-1 list-disc list-inside pl-4 mt-1">
                      <li>`MAX_MINT_PER_TRANSACTION`: A constant (e.g., 1,000,000 USDT) to prevent accidental minting of excessive amounts in a single public transaction.</li>
                    </ul>
                  </li>
                  <li>**Test Environment Focus**: Enables rigorous testing of Zenova&apos;s economic model, trading mechanics, and fee collection without risking real assets.</li>
                </ul>

                <h4 className="font-semibold text-white mb-3">Key Functions:</h4>
                <div className="space-y-3">
                  {[
                    { name: "mintTestTokens(address recipient, uint256 amount)", desc: "Publicly callable function to mint a specified `amount` of mock USDT to a `recipient`. Amount is capped by `MAX_MINT_PER_TRANSACTION`." },
                    { name: "bulkMintTestTokens(address[] recipients, uint256[] amounts)", desc: "Allows minting tokens to multiple `recipients` with corresponding `amounts` in a single transaction. Useful for test setups." },
                    { name: "ownerMint(address recipient, uint256 amount)", desc: "An `onlyOwner` function for the contract deployer to mint arbitrary amounts, typically for initial large-scale liquidity provisioning in tests." },
                    { name: "burn(uint256 amount)", desc: "Allows the caller to burn a specified `amount` of their own mock USDT tokens." },
                    { name: "toWei(uint256 humanAmount)", desc: "Utility to convert a human-readable amount (e.g., 100 USDT) to its 6-decimal representation (e.g., 100 * 10^6)." },
                    { name: "fromWei(uint256 weiAmount)", desc: "Utility to convert a 6-decimal wei amount back to a human-readable format." },
                    { name: "decimals()", desc: "Returns the constant value of 6."}
                  ].map((func, index) => (
                    <div key={index} className="bg-metamesh-dark/50 border border-metamesh-gray/50 rounded p-3">
                      <h5 className="font-mono text-metamesh-yellow text-sm mb-1">{func.name}</h5>
                      <p className="text-gray-400 text-xs">{func.desc}</p>
                    </div>
                  ))}
                </div>

                <h4 className="font-semibold text-white mb-3 mt-5">Events & Errors:</h4>
                 <ul className="text-gray-400 text-sm space-y-1 list-disc list-inside">
                    <li>**Events**: `TokensMinted`, `BulkTokensMinted` to log minting activities.</li>
                    <li>**Custom Errors**: `USDTMock__ZeroAddress`, `USDTMock__ZeroAmount`, `USDTMock__ExceedsMaxMint`, `USDTMock__ArrayLengthMismatch`, `USDTMock__InvalidArrayLength` for clear revert reasons.</li>
                </ul>
              </div>

              {/* The Zenova AI Agent - New Section */}
              <div className="bg-metamesh-dark-card border border-metamesh-gray rounded-lg p-6 mb-8">
                <h3 className="text-2xl font-semibold text-metamesh-yellow mb-4 flex items-center">
                  <BrainCircuit className="h-7 w-7 text-metamesh-yellow mr-3" />
                  The Zenova AI Agent: Autonomous Platform Orchestrator
                </h3>
                <p className="text-gray-300 mb-4">
                  At the heart of Zenova&apos;s autonomous operations is the **Zenova AI Agent**, defined in `src/mastra/agents/ZenovaAgent.ts`. 
                  This sophisticated agent, built using the Mastra SDK, is responsible for intelligent decision-making, smart contract interactions, and overall platform management. It embodies the `AI_ROLE` discussed in the smart contracts.
                </p>

                <h4 className="font-semibold text-white mb-3">Core Technologies:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {[
                    { icon: Cpu, title: "Language Model", desc: "Powered by Google's Gemini 2.5 Pro (`gemini-2.5-pro-preview-05-06`) for advanced reasoning and task execution." },
                    { icon: Layers, title: "Mastra SDK", desc: "`@mastra/core` provides the foundational agent framework, enabling structured instructions, tool usage, and memory management." },
                    { icon: Database, title: "Persistent Memory", desc: "Utilizes `UpstashStore` (Redis-based) for long-term conversation history and `UpstashVector` for semantic storage and recall of information." },
                    { icon: Zap, title: "Embeddings", desc: "`@mastra/fastembed` is used to generate embeddings, facilitating efficient semantic search within the agent's memory to retrieve relevant context." },
                  ].map((tech, index) => (
                    <div key={index} className="bg-metamesh-dark/50 border border-metamesh-gray/50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <tech.icon className="h-5 w-5 text-metamesh-yellow mr-2" />
                        <h5 className="font-semibold text-white">{tech.title}</h5>
                      </div>
                      <p className="text-gray-400 text-sm">{tech.desc}</p>
                    </div>
                  ))}
                </div>
                
                <h4 className="font-semibold text-white mb-3">Key Responsibilities & Workflow:</h4>
                <ul className="text-gray-300 space-y-3 list-disc list-inside mb-4">
                  <li>
                    <strong>Company Onboarding & Valuation:</strong>
                    <p className="text-gray-400 text-sm ml-4">Guides companies through data submission. Performs rigorous due diligence using its analytical capabilities and the `tavilySearchTool` to verify information, analyze market comparables, and identify risks. Adopts a conservative approach to determine fair valuation and initial token price (in USDT), then uses `zenovaFactory_submitCompanyValuationTool`.</p>
                  </li>
                  <li>
                    <strong>Zenova Asset Creation:</strong>
                    <p className="text-gray-400 text-sm ml-4">Post-valuation, the same AI agent is solely authorized to create the `ZenovaAsset` using `zenovaFactory_createZenovaAssetTool`. The agent automatically receives the `AI_ROLE` and admin control over the new asset. Critically, it immediately activates trading for the new asset using `zenovaAsset_activateTradingTool`.</p>
                  </li>
                  <li>
                    <strong>Autonomous Asset Management:</strong>
                    <p className="text-gray-400 text-sm ml-4">Continuously manages live assets. This includes updating token prices (`zenovaAsset_updatePriceTool`), adjusting liquidity parameters like fees (`zenovaAsset_updateLiquidityParamsTool`), managing trading states (defaulting to active), withdrawing fees (`zenovaAsset_withdrawFeesTool`), and handling critical situations with `pause/unpause` tools.</p>
                  </li>
                  <li>
                    <strong>User Interaction & Information Provision:</strong>
                    <p className="text-gray-400 text-sm ml-4">Serves as the primary interface for user queries about the platform, companies, or specific assets. Utilizes a suite of getter tools for both the Factory and individual Assets to provide accurate, on-chain information.</p>
                  </li>
                </ul>

                <h4 className="font-semibold text-white mb-3">Operational Principles:</h4>
                <p className="text-gray-300 mb-2">The agent operates under strict guidelines defined in its instruction set:</p>
                <ul className="text-gray-400 text-sm space-y-1 list-disc list-inside">
                  <li>**Precision & Transparency**: Reflects Zenova&apos;s core values in all interactions.</li>
                  <li>**Conservative Valuation**: Prioritizes realistic, evidence-backed valuations over speculation.</li>
                  <li>**AI-Driven Automation**: Manages the platform with minimal human intervention.</li>
                  <li>**Contextual Awareness**: Leverages its memory system with a structured working memory template (tracking user profiles, company onboarding status, platform interactions, and internal operational notes) for coherent and informed interactions.</li>
                </ul>
              </div>

              {/* The Zenova AI Toolkit - New Section */}
              <div className="bg-metamesh-dark-card border border-metamesh-gray rounded-lg p-6 mb-8">
                <h3 className="text-2xl font-semibold text-metamesh-yellow mb-4 flex items-center">
                  <Wrench className="h-7 w-7 text-metamesh-yellow mr-3" />
                  The Zenova AI Toolkit: Empowering Autonomous Operations
                </h3>
                <p className="text-gray-300 mb-4">
                  The Zenova AI Agent is equipped with a comprehensive suite of tools, located in `src/mastra/tools/`, to interact with the Zenova smart contracts, external services, and manage data. These tools are essential for its autonomous operation and decision-making processes. They are built using `createTool` from `@mastra/core` and often use Zod for schema validation.
                </p>

                {/* Factory Platform Tools */}
                <div className="mb-6">
                  <h4 className="text-xl font-semibold text-white mb-3 flex items-center">
                    <Factory className="h-6 w-6 text-metamesh-yellow mr-2" />
                    Zenova Asset Factory Tools
                  </h4>
                  <p className="text-gray-400 text-sm mb-3">
                    Tools for interacting with `ZenovaAssetFactory.sol` (defined in `zenovaFactoryPlatformTools.ts`, leveraging interactions from `zenovaBlockchainInteractions.ts` and server-only interactions from `zenovaBlockchainInteractionsServeOnlyInteractions.ts`). These manage platform-level operations.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { name: "submitCompanyValuationFactoryTool", type: "Write", desc: "Submits AI-assessed company valuation." },
                      { name: "createZenovaAssetFactoryTool", type: "Write", desc: "Creates a new tokenized company asset." },
                      { name: "getZenovaAssetImplementationTool", type: "Read", desc: "Fetches master asset contract address." },
                      { name: "getAllAssetsFactoryTool", type: "Read", desc: "Lists all created Zenova assets." },
                      { name: "getCompanyComprehensiveDetailsTool", type: "Read", desc: "Provides full data on a specific company." },
                      { name: "getPlatformSnapshotTool", type: "Read", desc: "Gives an overview of platform metrics." },
                      { name: "getUserPortfolioDetailsTool", type: "Read", desc: "Details a user's holdings across Zenova." }
                    ].map(tool => (
                      <div key={tool.name} className="bg-metamesh-dark/50 border border-metamesh-gray/50 rounded p-3">
                        <span className={`text-xs font-semibold ${tool.type === 'Write' ? 'text-orange-400' : 'text-sky-400'} block mb-1`}>{tool.type}</span>
                        <code className="text-metamesh-yellow text-sm block">{tool.name}</code>
                        <p className="text-gray-400 text-xs mt-1">{tool.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Asset Tools */}
                <div className="mb-6">
                  <h4 className="text-xl font-semibold text-white mb-3 flex items-center">
                    <Package className="h-6 w-6 text-metamesh-yellow mr-2" /> {/* Changed from Database */}
                    Zenova Asset Tools
                  </h4>
                  <p className="text-gray-400 text-sm mb-3">
                    Tools for interacting with individual `ZenovaAsset.sol` contracts (defined in `zenovaAssetTools.ts`, using interactions from `zenovaAssetInteractions.ts` and server-only from `zenovaAssetServerOnlyInteractions.ts`). These manage specific tokenized shares.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { name: "updateAssetPriceTool", type: "Write", desc: "Updates the token's price." },
                      { name: "activateAssetTradingTool", type: "Write", desc: "Enables trading for an asset." },
                      { name: "buyAssetTokensTool / sellAssetTokensTool", type: "Write", desc: "Facilitates user token trades (via AI)." },
                      { name: "getAssetFullDetailsTool", type: "Read", desc: "Fetches all details of a specific asset." },
                      { name: "getAssetTradingMetricsTool", type: "Read", desc: "Retrieves trading activity data." },
                      { name: "getAssetUserAssetInfoTool", type: "Read", desc: "Gets a user's specific data for one asset." }
                    ].map(tool => (
                      <div key={tool.name} className="bg-metamesh-dark/50 border border-metamesh-gray/50 rounded p-3">
                        <span className={`text-xs font-semibold ${tool.type === 'Write' ? 'text-orange-400' : 'text-sky-400'} block mb-1`}>{tool.type}</span>
                        <code className="text-metamesh-yellow text-sm block">{tool.name}</code>
                        <p className="text-gray-400 text-xs mt-1">{tool.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* USDT Mock Tools */}
                <div className="mb-6">
                  <h4 className="text-xl font-semibold text-white mb-3 flex items-center">
                    <TestTube2 className="h-6 w-6 text-metamesh-yellow mr-2" />
                    USDT Mock Tools
                  </h4>
                  <p className="text-gray-400 text-sm mb-3">
                    Tools for interacting with `USDTMock.sol` (defined in `usdtMockTools.ts` - typically split like `usdtMockInteractions.ts` and `usdtMockOnlyServerInteractions.ts`). Used for managing the test currency during development and simulation.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { name: "mintUsdtTestTokensTool", type: "Write", desc: "Mints test USDT to an address." },
                      { name: "getUsdtBalanceOfTool", type: "Read", desc: "Checks an address's test USDT balance." },
                      { name: "convertUsdtToWeiTool / convertUsdtFromWeiTool", type: "Read", desc: "Utility for amount conversions." }
                    ].map(tool => (
                      <div key={tool.name} className="bg-metamesh-dark/50 border border-metamesh-gray/50 rounded p-3">
                         <span className={`text-xs font-semibold ${tool.type === 'Write' ? 'text-orange-400' : 'text-sky-400'} block mb-1`}>{tool.type}</span>
                        <code className="text-metamesh-yellow text-sm block">{tool.name}</code>
                        <p className="text-gray-400 text-xs mt-1">{tool.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Web Intelligence Tool */}
                 <div className="mb-6">
                  <h4 className="text-xl font-semibold text-white mb-3 flex items-center">
                    <Search className="h-6 w-6 text-metamesh-yellow mr-2" />
                    Web Intelligence (`tavilySearchTool.ts`)
                  </h4>
                  <div className="bg-metamesh-dark/50 border border-metamesh-gray/50 rounded p-4">
                    <code className="text-metamesh-yellow text-sm block mb-1">tavilySearchTool</code>
                    <p className="text-gray-400 text-sm">
                      Leverages the Tavily API to perform real-time web searches. This is crucial for the AI agent during company due diligence, allowing it to verify claims, research market conditions, and gather external data to support its valuation and management decisions. It supports advanced search parameters like depth, result limits, and domain filtering.
                    </p>
                  </div>
                </div>

                {/* Core Utilities */}
                <div>
                  <h4 className="text-xl font-semibold text-white mb-3 flex items-center">
                    <ListChecks className="h-6 w-6 text-metamesh-yellow mr-2" />
                    Core Utilities & Data Structures
                  </h4>
                  <p className="text-gray-400 text-sm mb-3">
                    A set of foundational files ensure data integrity, consistency, and type safety across the AI agent and its tools:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { icon: Type, name: "Data Formatters (`formatters.ts`)", desc: "Provides functions like `formatUsdtAmount`, `formatDefaultTokenAmount`, `formatAddress`, `formatTimestamp` to ensure consistent data representation." },
                      { icon: FileJson, name: "Schema Definitions (`zenovaZodSchemas.ts`)", desc: "Uses Zod to define strict schemas for tool inputs and outputs, ensuring type safety and robust validation." },
                      { icon: Code, name: "Blockchain Types (`zenovaBlockchainTypes.ts`)", desc: "TypeScript definitions for raw data structures returned directly by smart contracts before formatting." },
                      { icon: Zap, name: "Formatted Types (`zenovaFormattedTypes.ts`)", desc: "TypeScript definitions for data after it has been processed by formatters, ready for UI or agent consumption." }
                    ].map(util => (
                      <div key={util.name} className="bg-metamesh-dark/50 border border-metamesh-gray/50 rounded p-3">
                        <div className="flex items-center mb-1">
                          <util.icon className="h-5 w-5 text-metamesh-yellow mr-2 flex-shrink-0" />
                          <h5 className="text-metamesh-yellow text-sm font-semibold">{util.name}</h5>
                        </div>
                        <p className="text-gray-400 text-xs">{util.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Asset Lifecycle */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mb-16"
            >
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                <Workflow className="h-8 w-8 text-metamesh-yellow mr-3" />
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
              transition={{ duration: 0.5, delay: 0.5 }}
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

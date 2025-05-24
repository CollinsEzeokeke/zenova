import { Agent } from "@mastra/core";
import { Memory } from "@mastra/memory";
import { UpstashStore, UpstashVector } from "@mastra/upstash";
import { google } from "@ai-sdk/google";
import { fastembed } from "@mastra/fastembed";

// Import all Zenova tools from the index file
import {
  // Factory Platform Tools (Reads)
  getZenovaAssetImplementationTool,
  getAcceptedCurrencyFactoryTool,
  getTotalAssetsFactoryTool,
  getAllAssetsFactoryTool,
  getAssetsByCompanyFactoryTool,
  getSubmittedValuationFactoryTool,
  getAssetFullDetailsFactoryTool,
  getMultipleAssetFullDetailsFactoryTool,
  getCompanyComprehensiveDetailsTool,
  getPlatformSnapshotTool,
  getUserPortfolioDetailsTool, // Factory version for user's overall portfolio
  getMultipleAssetAnalyticsTool,

  // Factory Platform Tools (Writes)
  submitCompanyValuationFactoryTool,
  createZenovaAssetFactoryTool,

  // Asset Tools (Reads)
  getAssetCompanyNameTool,
  getAssetSymbolTool,
  getAssetDecimalsTool,
  getAssetTotalSupplyTool,
  getAssetBalanceOfTool,
  getAssetCompanyInfoTool,
  getAssetPricingDetailsTool,
  getAssetFullDetailsTool, // Asset-specific version
  getAssetCurrentValuationTool,
  getAssetMaxTokenSupplyTool,
  getAssetIsTradingActiveTool,
  getAssetCollectedFeesTool,
  getAssetBuyQuoteTool,
  getAssetSellQuoteTool,
  getAssetTradingMetricsTool,
  getAssetMarketAnalysisTool,
  getAssetUserAssetInfoTool, // Asset-specific for a user
  getAssetSnapshotInfoTool,

  // Asset Tools (Writes)
  setAssetCompanyValuationTool,
  updateAssetPriceTool,
  updateAssetLiquidityParamsTool,
  activateAssetTradingTool,
  deactivateAssetTradingTool,
  buyAssetTokensTool,
  sellAssetTokensTool,
  withdrawAssetFeesTool,
  companyWithdrawAssetTokensTool,
  pauseAssetTradingTool,
  unpauseAssetTradingTool,

  // Web Search Tool
  tavilySearchTool,
} from "../tools"; // Points to zenova/src/mastra/tools/index.ts

// Get Redis credentials for memory storage - Adapted for Zenova
const getRedisCredentials = () => {
  if (
    process.env.ZENOVA_UPSTASH_REDIS_REST_URL &&
    process.env.ZENOVA_UPSTASH_REDIS_REST_TOKEN
  ) {
    return {
      url: process.env.ZENOVA_UPSTASH_REDIS_REST_URL,
      token: process.env.ZENOVA_UPSTASH_REDIS_REST_TOKEN,
    };
  }
  throw new Error(
    "ZENOVA_UPSTASH_REDIS_REST_URL and ZENOVA_UPSTASH_REDIS_REST_TOKEN environment variables are required."
  );
};

// Get Vector credentials for vector storage - Adapted for Zenova
const getVectorCredentials = () => {
  if (
    process.env.ZENOVA_UPSTASH_VECTOR_REST_URL &&
    process.env.ZENOVA_UPSTASH_VECTOR_REST_TOKEN
  ) {
    return {
      url: process.env.ZENOVA_UPSTASH_VECTOR_REST_URL,
      token: process.env.ZENOVA_UPSTASH_VECTOR_REST_TOKEN,
    };
  }
  throw new Error(
    "ZENOVA_UPSTASH_VECTOR_REST_URL and ZENOVA_UPSTASH_VECTOR_REST_TOKEN environment variables are required."
  );
};

const memoryStorage = new UpstashStore({
  url: getRedisCredentials().url,
  token: getRedisCredentials().token,
});

const vectorStore = new UpstashVector({
  url: getVectorCredentials().url,
  token: getVectorCredentials().token,
});

export const getMemoryConfig = () => {
  return new Memory({
    storage: memoryStorage,
    vector: vectorStore,
    embedder: fastembed,
    options: {
      lastMessages: 15,
      semanticRecall: {
        topK: 7,
        messageRange: 5,
      },
      workingMemory: {
        enabled: true,
        template: `
# Zenova AI Agent Context

## User Interaction Profile
- User Wallet Address (if provided for portfolio queries):
- User Name (if provided):
- Interaction Goal: [Company Onboarding/Asset Inquiry/Platform Info/Investment]
- Current Request:
- Interaction Status: [Initial Query/Awaiting Company Data/Evaluation in Progress/Asset Management]

## Company Onboarding & Asset Management (Primary Focus)
- Target Company Wallet (for valuation/creation):
- Company Name:
- Company Symbol:
- Company Description Provided:
- Company Website Provided:
- Valuation Status: [Not Started/Pending AI Evaluation/Valuation Submitted/Asset Created]
- Submitted Valuation (USDT):
- Initial Price Per Token (USDT):
- Evaluator AI Address (this agent's address for this company):
- Associated ZenovaAsset Address (if created):

## Platform & Asset Interaction (General User Queries)
- Queried Asset Address:
- Queried Company Wallet:
- Last Tool Used:
- Recent Query Topics: [Platform Stats/Specific Asset Details/Trading Info]

## Agent Operational Notes (Internal)
- AI_ROLE Address: [This agent's primary operational address]
- Information Needed for Current Task:
- Recommended Next Steps (for agent):
- Key Findings from Web Search (if any):
- Current Operational Mode: [Company Evaluation/Asset Management/User Support]
`,
      },
      threads: {
        generateTitle: true,
      },
    },
  });
};

export const zenovaAgent = new Agent({
  name: "Zenova AI Platform Agent",
  instructions: `
You are the Zenova AI, a highly autonomous agent responsible for managing the Zenova platform, a decentralized system for tokenizing company equity.
Your core function is to interact with companies wishing to tokenize their shares and with users interested in these tokenized assets, all governed by the Zenova protocol's smart contracts and your AI-driven logic.

CORE OPERATING PRINCIPLE:
As the Zenova AI, you embody precision, transparency, and intelligent automation. You are the primary interface for company onboarding, asset creation, and ongoing AI-driven management of tokenized shares. You operate based on the Zenova README, which outlines a system with a single, powerful AI_ROLE for all significant operations. Your valuations MUST be conservative and reflect verifiable real-world value.

KEY RESPONSIBILITIES & WORKFLOWS:

1. COMPANY ONBOARDING & VALUATION:
   - When a company wishes to tokenize its shares, you will guide them through the data submission process.
   - CRITICAL VALUATION PROTOCOL: You MUST perform rigorous due diligence. Use your analytical capabilities extensively, augmented by 'zenova-tavily-search', to:
     - Thoroughly verify all company-provided information (financials, market position, IP, team, etc.) against independent, reputable sources.
     - Actively seek out and analyze comparable company valuations, market trends, sector-specific risks, and overall economic conditions.
     - Identify any red flags, inconsistencies, or unsubstantiated claims.
     - Adopt a CONSERVATIVE and PRUDENT approach to valuation. Your primary goal is to establish a fair, defensible, and realistic market value that does NOT exceed demonstrable real-life potential. Avoid speculative hype or overly optimistic projections.
   - Based on this STRICT and EVIDENCE-BACKED evaluation, you will determine a fair valuation and a proposed initial price per token (in USDT, which has 6 decimals). If data is insufficient or unverifiable to support a credible valuation, you should indicate this and potentially request more information or decline to provide a valuation that meets Zenova's standards.
   - You will then use the 'zenovaFactory_submitCompanyValuation' tool, providing the company's wallet address, your meticulously calculated and conservative valuation, and the initial price per token. Your AI wallet (associated with this agent) will be recorded as the evaluatorAI.

2. ZENOVA ASSET CREATION:
   - After a valuation is successfully submitted by YOU (this agent), YOU are the ONLY entity authorized to create the ZenovaAsset for that company.
   - You will use the 'zenovaFactory_createZenovaAsset' tool, providing the company's wallet (for which you submitted the valuation) and the necessary company information (name, symbol, description, website, and the company's issuing wallet which MUST match the company wallet used for valuation).
   - Upon successful creation, the new ZenovaAsset address will be returned. This address is crucial for all subsequent interactions with that specific tokenized asset. The agent (your AI wallet) automatically receives AI_ROLE and admin control over this new asset.
   - CRITICAL POST-CREATION STEP: Once an asset is successfully created, you MUST immediately activate trading for it using 'zenovaAsset_activateTrading'. Trading should be considered active by default for all created assets.

3. ASSET MANAGEMENT (AI-DRIVEN):
   - Price Updates: Periodically, or based on specific triggers/analyses, you will use 'zenovaAsset_updatePrice' to adjust the token price, reflecting your ongoing assessment of market dynamics or company performance. This requires the assetAddress and the new price (in USDT).
   - Liquidity Parameters: You can adjust buy/sell fees using 'zenovaAsset_updateLiquidityParameters'.
   - TRADING STATE MANAGEMENT (ACTIVE BY DEFAULT):
     - Default State: Trading for any existing ZenovaAsset MUST be active.
     - Activation: If you find that trading for an existing asset is deactivated, and there are no explicit, ongoing extreme circumstances (e.g., severe market instability, critical security concerns for that specific asset, direct regulatory order) justifying this deactivation, you MUST proactively reactivate trading using 'zenovaAsset_activateTrading'.
     - Deactivation: Deactivating trading ('zenovaAsset_deactivateTrading') is a significant action reserved ONLY for extreme and justifiable cases. It should not be a routine operation. If deactivation is necessary, the reason must be clearly logged or understood in context.
   - Fee Withdrawal: You can withdraw collected fees using 'zenovaAsset_withdrawFees'.
   - Pausing/Unpausing: In critical situations, you can 'zenovaAsset_pauseTrading' or 'zenovaAsset_unpauseTrading' for specific assets. This is a temporary measure, distinct from full trading deactivation.
   - Company Withdrawals: You can facilitate company token withdrawals using 'zenovaAsset_companyWithdrawTokens'.

4. USER INTERACTION & INFORMATION PROVISION:
   - Users might inquire about the platform, specific companies, or tokenized assets.
   - Utilize the suite of getter tools for both the Factory and individual Assets to provide accurate, on-chain information. Examples:
     - Factory: 'zenovaFactory_getPlatformSnapshot', 'zenovaFactory_getAllAssets', 'zenovaFactory_getCompanyComprehensiveDetails', 'zenovaFactory_getUserPortfolioDetails' (for a user's overall Zenova holdings).
     - Asset: 'zenovaAsset_getFullDetails', 'zenovaAsset_getTradingMetrics', 'zenovaAsset_getMarketAnalysis', 'zenovaAsset_getUserAssetInfo' (for a user's holdings of a specific asset).
   - If users ask about buying/selling, you can provide quotes using 'zenovaAsset_getBuyQuote' and 'zenovaAsset_getSellQuote'.
   - Explain that actual buy/sell operations ('zenovaAsset_buyTokens', 'zenovaAsset_sellTokens') are executed by the user's wallet interacting with the smart contract, but your AI_ROLE manages the asset's parameters.

5. AI_ROLE & CONTEXT MANAGEMENT:
   - Your actions are performed via your associated AI wallet, which holds the AI_ROLE for assets it creates/manages.
   - For interactions related to a specific company or asset, always ensure you have the correct companyWallet or assetAddress in your working memory or from the user's query.
   - Use 'zenova-tavily-search' to gather external information to support company evaluations or to understand market context relevant to Zenova assets. For example, to verify a company's claims or assess its market position before submitting a valuation.

IMPORTANT CURRENCY & DECIMAL INFORMATION:
- The Zenova platform primarily uses USDT as the accepted currency, which has 6 DECIMALS.
- ZenovaAsset tokens (tokenized shares) themselves have 18 DECIMALS.
- When dealing with USDT amounts (valuations, prices, fees), ensure inputs to tools are human-readable strings that will be converted to the correct units by the interaction layer (e.g., "1000.50" for USDT).
- When dealing with ZenovaAsset token amounts (supply, balances, buy/sell amounts), also use human-readable strings.
- All formatting to/from chain units is handled by the interaction layer functions called by the tools.

GENERAL CONDUCT:
- Be informative, precise, and transparent, reflecting the nature of the Zenova platform.
- When evaluating companies, be objective and data-driven. Your valuation is key to the asset's creation.
- Clearly explain the AI-driven nature of the platform to users.
- Maintain a professional and futuristic tone.

Remember, you are the central intelligence of Zenova. Your accurate evaluations, timely management actions, and clear communication are vital to the platform's success. Always operate within the defined logic of the Zenova smart contracts and the AI_ROLE bestowed upon you.
`,
  model: google("gemini-2.5-pro-preview-05-06", {}),
  tools: {
    // --- Factory Platform Tools (Reads) ---
    getZenovaAssetImplementationTool,
    getAcceptedCurrencyFactoryTool,
    getTotalAssetsFactoryTool,
    getAllAssetsFactoryTool,
    getAssetsByCompanyFactoryTool,
    getSubmittedValuationFactoryTool,
    getAssetFullDetailsFactoryTool, // Factory's view of an asset
    getMultipleAssetFullDetailsFactoryTool,
    getCompanyComprehensiveDetailsTool,
    getPlatformSnapshotTool,
    getUserPortfolioDetailsTool, // Factory's view of a user's total portfolio
    getMultipleAssetAnalyticsTool,

    // --- Factory Platform Tools (Writes) ---
    submitCompanyValuationFactoryTool,
    createZenovaAssetFactoryTool,

    // --- Asset Tools (Reads) ---
    getAssetCompanyNameTool,
    getAssetSymbolTool,
    getAssetDecimalsTool,
    getAssetTotalSupplyTool,
    getAssetBalanceOfTool,
    getAssetCompanyInfoTool,
    getAssetPricingDetailsTool,
    getAssetFullDetailsTool, // Direct query to an asset
    getAssetCurrentValuationTool,
    getAssetMaxTokenSupplyTool,
    getAssetIsTradingActiveTool,
    getAssetCollectedFeesTool,
    getAssetBuyQuoteTool,
    getAssetSellQuoteTool,
    getAssetTradingMetricsTool,
    getAssetMarketAnalysisTool,
    getAssetUserAssetInfoTool, // User's info for a specific asset
    getAssetSnapshotInfoTool,

    // --- Asset Tools (Writes) ---
    setAssetCompanyValuationTool, // Note: This is on ZenovaAsset, typically after factory creation & initialization
    updateAssetPriceTool,
    updateAssetLiquidityParamsTool,
    activateAssetTradingTool,
    deactivateAssetTradingTool,
    buyAssetTokensTool, // User action, but AI might guide or provide info
    sellAssetTokensTool, // User action, but AI might guide or provide info
    withdrawAssetFeesTool,
    companyWithdrawAssetTokensTool,
    pauseAssetTradingTool,
    unpauseAssetTradingTool,

    // --- Web Search Tool ---
    tavilySearchTool,
  },
  memory: getMemoryConfig(),
});

import { z } from 'zod';
import { createTool } from '@mastra/core';
import { isAddress, createWalletClient, createPublicClient, http, formatUnits, getAbiItem, decodeEventLog, parseUnits, getAddress, BaseError } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { assetChainTestnet } from 'viem/chains';
import { tavily } from '@tavily/core';

const EthereumAddressSchema = z.string().refine(isAddress, {
  message: "Invalid Ethereum address"
});
const PositiveStringIntegerSchema = z.string().regex(/^\d+$/, "Must be a positive integer string");
const PositiveStringFloatSchema = z.string().refine((val) => parseFloat(val) > 0 && !isNaN(parseFloat(val)), {
  message: "Must be a positive number string"
});
const TransactionSuccessResponseSchema = z.object({
  success: z.literal(true),
  transactionHash: EthereumAddressSchema,
  message: z.string().optional()
});
const AssetCreationSuccessResponseSchema = TransactionSuccessResponseSchema.extend({
  assetAddress: EthereumAddressSchema.optional()
});
const ToolErrorResponseSchema = z.object({
  error: z.string()
});
const UsdtAmountSchema = PositiveStringFloatSchema;
z.object({
  recipient: EthereumAddressSchema,
  amount: UsdtAmountSchema
});
z.object({
  recipients: z.array(EthereumAddressSchema),
  amounts: z.array(UsdtAmountSchema)
});
z.object({
  amount: UsdtAmountSchema
});
z.object({
  account: EthereumAddressSchema
});
z.object({
  // For toWei and fromWei
  amount: z.string()
  // Can be human amount for toWei, or wei amount for fromWei
});
const ZenovaAssetAmountSchema = PositiveStringFloatSchema;
const AssetAddressInputSchema = z.object({
  assetAddress: EthereumAddressSchema
});
const AssetBalanceOfInputSchema = AssetAddressInputSchema.extend({
  account: EthereumAddressSchema
});
const CompanyInfoSchema = z.object({
  name: z.string().min(1, "Company name is required"),
  symbol: z.string().min(1, "Company symbol is required").max(10, "Symbol too long"),
  description: z.string().optional(),
  website: z.string().url().optional(),
  // Optional URL
  issuingCompanyWallet: EthereumAddressSchema
});
const AssetPricingDetailsSchema = z.object({
  currentPricePerToken: PositiveStringFloatSchema,
  // USDT formatted string
  buyFeeBPS: PositiveStringIntegerSchema,
  // BPS as string
  sellFeeBPS: PositiveStringIntegerSchema,
  // BPS as string
  marketCap: PositiveStringFloatSchema,
  // USDT formatted string
  lastPriceUpdateTimestamp: PositiveStringIntegerSchema,
  // Timestamp as string
  acceptedCurrency: EthereumAddressSchema
});
const ZenovaAssetFullDetailsSchema = z.object({
  assetAddress: EthereumAddressSchema,
  companyDetails: CompanyInfoSchema,
  pricingDetails: AssetPricingDetailsSchema,
  currentValuation: UsdtAmountSchema,
  maxTokenSupply: ZenovaAssetAmountSchema,
  currentTotalSupply: ZenovaAssetAmountSchema,
  isTradingActive: z.boolean(),
  admin: EthereumAddressSchema,
  priceAI: EthereumAddressSchema,
  liquidityManager: EthereumAddressSchema
});
const TradingMetricsSchema = z.object({
  totalVolumeTraded: UsdtAmountSchema,
  totalTokensTraded: ZenovaAssetAmountSchema,
  totalBuyTransactions: PositiveStringIntegerSchema,
  totalSellTransactions: PositiveStringIntegerSchema,
  totalFeesCollected: UsdtAmountSchema,
  averageTradeSize: UsdtAmountSchema,
  lastTradeTimestamp: PositiveStringIntegerSchema,
  priceVolatility: PositiveStringIntegerSchema
  // BPS as string
});
const MarketAnalysisSchema = z.object({
  currentMarketCap: UsdtAmountSchema,
  fullyDilutedMarketCap: UsdtAmountSchema,
  circulationRatioBPS: PositiveStringIntegerSchema,
  // BPS as string
  liquidityRatioBPS: PositiveStringIntegerSchema,
  // BPS as string
  priceToValuationRatioBPS: PositiveStringIntegerSchema,
  // BPS as string
  isOvervalued: z.boolean(),
  isUndervalued: z.boolean(),
  timeSinceLastPriceUpdate: PositiveStringIntegerSchema
  // Duration string
});
const UserAssetInfoSchema = z.object({
  tokenBalance: ZenovaAssetAmountSchema,
  tokenBalanceValue: UsdtAmountSchema,
  percentageOfSupplyBPS: PositiveStringIntegerSchema,
  // BPS as string
  totalPurchaseValue: UsdtAmountSchema,
  totalSaleValue: UsdtAmountSchema,
  totalFeesPaid: UsdtAmountSchema,
  lastTradeTimestamp: PositiveStringIntegerSchema,
  hasTraded: z.boolean(),
  realizedPnL: UsdtAmountSchema,
  // Can be negative, so PositiveStringFloatSchema might be too restrictive. Using z.string() for now.
  unrealizedPnL: UsdtAmountSchema
  // Same as above.
});
const AssetSnapshotSchema = z.object({
  currentPrice: UsdtAmountSchema,
  totalSupply: ZenovaAssetAmountSchema,
  marketCap: UsdtAmountSchema,
  contractBalance: UsdtAmountSchema,
  isTradingActive: z.boolean(),
  lastPriceUpdate: PositiveStringIntegerSchema
  // Timestamp as string
});
const SetCompanyValuationInputSchema = AssetAddressInputSchema.extend({
  companyValuation: UsdtAmountSchema,
  initialPricePerToken: UsdtAmountSchema,
  evaluator: EthereumAddressSchema
});
const UpdatePriceInputSchema = AssetAddressInputSchema.extend({
  newPricePerToken: UsdtAmountSchema
});
const UpdateLiquidityParamsInputSchema = AssetAddressInputSchema.extend({
  newBuyFeeBPS: z.number().int().min(0).max(5e3),
  newSellFeeBPS: z.number().int().min(0).max(5e3)
});
const BuySellTokensInputSchema = AssetAddressInputSchema.extend({
  tokenAmount: ZenovaAssetAmountSchema
});
const WithdrawFeesInputSchema = AssetAddressInputSchema.extend({
  recipient: EthereumAddressSchema
});
const CompanyWithdrawInputSchema = AssetAddressInputSchema.extend({
  amountOfTokens: ZenovaAssetAmountSchema
});
const UserAddressInputSchema = z.object({
  // For individual asset user info
  user: EthereumAddressSchema
});
const GetUserAssetInfoInputSchema = AssetAddressInputSchema.extend(UserAddressInputSchema.shape);
const CompanyInitialValuationSchema = z.object({
  companyWallet: EthereumAddressSchema,
  valuation: UsdtAmountSchema,
  initialPricePerToken: UsdtAmountSchema,
  evaluatorAI: EthereumAddressSchema,
  assessmentTimestamp: PositiveStringIntegerSchema,
  exists: z.boolean()
});
const SubmitCompanyValuationInputSchema = z.object({
  companyWallet: EthereumAddressSchema,
  valuation: UsdtAmountSchema,
  initialPricePerToken: UsdtAmountSchema
});
const CreateZenovaAssetInputSchema = z.object({
  companyWallet: EthereumAddressSchema,
  companyInfo: CompanyInfoSchema
});
const GetAssetsByCompanyInputSchema = z.object({
  companyWallet: EthereumAddressSchema
});
const GetSubmittedValuationInputSchema = z.object({
  companyWallet: EthereumAddressSchema
});
const GetAssetFullDetailsInputSchema = z.object({
  assetAddress: EthereumAddressSchema
});
const GetMultipleAssetFullDetailsInputSchema = z.object({
  assetAddresses: z.array(EthereumAddressSchema)
});
const FactoryUserAddressInputSchema = z.object({
  // For factory-level user portfolio details
  userAddress: EthereumAddressSchema
});
const FactoryTotalAssetsOutputSchema = PositiveStringIntegerSchema;
const FactoryAllAssetsOutputSchema = z.array(EthereumAddressSchema);
const FactoryAssetsByCompanyOutputSchema = z.array(EthereumAddressSchema);
const CompanyComprehensiveDetailsSchema = z.object({
  companyWallet: EthereumAddressSchema,
  pendingValuation: CompanyInitialValuationSchema.optional(),
  assetAddresses: z.array(EthereumAddressSchema),
  assetDetails: z.array(ZenovaAssetFullDetailsSchema),
  totalMarketCap: UsdtAmountSchema,
  // Was PositiveBigIntSchema, now UsdtAmountSchema (string)
  totalTokensIssued: ZenovaAssetAmountSchema,
  // Was PositiveBigIntSchema, assuming general Zenova asset amount (string)
  totalTradingVolume: UsdtAmountSchema,
  // Was PositiveBigIntSchema, now UsdtAmountSchema (string)
  hasActiveAssets: z.boolean()
});
const PlatformSnapshotSchema = z.object({
  totalAssetsCreated: PositiveStringIntegerSchema,
  totalCompaniesOnboarded: PositiveStringIntegerSchema,
  totalActiveAssets: PositiveStringIntegerSchema,
  totalMarketCapitalization: UsdtAmountSchema,
  totalTradingVolume: UsdtAmountSchema,
  totalFeesCollected: UsdtAmountSchema,
  averageAssetMarketCap: UsdtAmountSchema,
  totalTokensInCirculation: ZenovaAssetAmountSchema,
  totalMaxTokenSupply: ZenovaAssetAmountSchema,
  largestAssetByMarketCap: EthereumAddressSchema,
  mostActiveAssetByVolume: EthereumAddressSchema
});
const UserPortfolioDetailsSchema = z.object({
  userAddress: EthereumAddressSchema,
  totalPortfolioValue: UsdtAmountSchema,
  totalInvestedAmount: UsdtAmountSchema,
  totalRealizedPnL: UsdtAmountSchema,
  // Should allow negative, PositiveStringFloatSchema for PnL might be too strict. UsdtAmountSchema implies positive.
  totalUnrealizedPnL: UsdtAmountSchema,
  // Using UsdtAmountSchema for now, but PnL can be negative.
  totalFeesPaid: UsdtAmountSchema,
  numberOfAssetsHeld: PositiveStringIntegerSchema,
  heldAssetAddresses: z.array(EthereumAddressSchema),
  assetHoldings: z.array(UserAssetInfoSchema),
  isActiveTrader: z.boolean()
});
const MultipleAssetAnalyticsSchema = z.tuple([
  z.array(ZenovaAssetFullDetailsSchema),
  z.array(TradingMetricsSchema),
  z.array(MarketAnalysisSchema)
]);
z.object({
  userAddress: EthereumAddressSchema,
  assetAddress: EthereumAddressSchema
});
z.object({
  role: z.string(),
  account: EthereumAddressSchema,
  contractAddress: EthereumAddressSchema
});
z.object({
  assetAddress: EthereumAddressSchema,
  pause: z.boolean()
});

if (!process.env.AI_BOT_PRIVATE_KEY) {
  throw new Error("AI_BOT_PRIVATE_KEY is not set");
}
if (!process.env.NEXT_PUBLIC_ASSETCHAIN_TESTNET_RPC_URL) {
  throw new Error("NEXT_PUBLIC_ASSETCHAIN_TESTNET_RPC_URL is not set");
}
const publicClient = createPublicClient({
  chain: assetChainTestnet,
  transport: http(process.env.NEXT_PUBLIC_ASSETCHAIN_TESTNET_RPC_URL)
});
const aiAccount = privateKeyToAccount(process.env.AI_BOT_PRIVATE_KEY);
const aiWalletClient = createWalletClient({
  account: aiAccount,
  chain: assetChainTestnet,
  transport: http(process.env.NEXT_PUBLIC_ASSETCHAIN_TESTNET_RPC_URL)
});

const zenovaAssetAbi = [
  { type: "constructor", inputs: [], stateMutability: "nonpayable" },
  {
    type: "function",
    inputs: [],
    name: "AI_ROLE",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view"
  },
  {
    type: "function",
    inputs: [],
    name: "DEFAULT_ADMIN_ROLE",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view"
  },
  {
    type: "function",
    inputs: [],
    name: "LIQUIDITY_MANAGER_ROLE",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view"
  },
  {
    type: "function",
    inputs: [],
    name: "PRICE_AI_ROLE",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view"
  },
  {
    type: "function",
    inputs: [],
    name: "activateTrading",
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    inputs: [
      { name: "owner", internalType: "address", type: "address" },
      { name: "spender", internalType: "address", type: "address" }
    ],
    name: "allowance",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view"
  },
  {
    type: "function",
    inputs: [
      { name: "spender", internalType: "address", type: "address" },
      { name: "value", internalType: "uint256", type: "uint256" }
    ],
    name: "approve",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    inputs: [],
    name: "assetPricingDetails",
    outputs: [
      {
        name: "currentPricePerToken",
        internalType: "uint256",
        type: "uint256"
      },
      { name: "buyFeeBPS", internalType: "uint256", type: "uint256" },
      { name: "sellFeeBPS", internalType: "uint256", type: "uint256" },
      { name: "marketCap", internalType: "uint256", type: "uint256" },
      {
        name: "lastPriceUpdateTimestamp",
        internalType: "uint256",
        type: "uint256"
      },
      { name: "acceptedCurrency", internalType: "address", type: "address" }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    inputs: [{ name: "account", internalType: "address", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view"
  },
  {
    type: "function",
    inputs: [
      { name: "tokenAmountToBuy", internalType: "uint256", type: "uint256" }
    ],
    name: "buyTokens",
    outputs: [],
    stateMutability: "payable"
  },
  {
    type: "function",
    inputs: [],
    name: "collectedFees",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view"
  },
  {
    type: "function",
    inputs: [],
    name: "companyInfo",
    outputs: [
      { name: "name", internalType: "string", type: "string" },
      { name: "symbol", internalType: "string", type: "string" },
      { name: "description", internalType: "string", type: "string" },
      { name: "website", internalType: "string", type: "string" },
      {
        name: "issuingCompanyWallet",
        internalType: "address",
        type: "address"
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    inputs: [
      { name: "amountOfTokens", internalType: "uint256", type: "uint256" }
    ],
    name: "companyWithdraw",
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    inputs: [],
    name: "currentValuation",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view"
  },
  {
    type: "function",
    inputs: [],
    name: "deactivateTrading",
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", internalType: "uint8", type: "uint8" }],
    stateMutability: "view"
  },
  {
    type: "function",
    inputs: [],
    name: "getAssetPricingDetails",
    outputs: [
      {
        name: "",
        internalType: "struct ZenovaAsset.AssetPricingDetails",
        type: "tuple",
        components: [
          {
            name: "currentPricePerToken",
            internalType: "uint256",
            type: "uint256"
          },
          { name: "buyFeeBPS", internalType: "uint256", type: "uint256" },
          { name: "sellFeeBPS", internalType: "uint256", type: "uint256" },
          { name: "marketCap", internalType: "uint256", type: "uint256" },
          {
            name: "lastPriceUpdateTimestamp",
            internalType: "uint256",
            type: "uint256"
          },
          {
            name: "acceptedCurrency",
            internalType: "address",
            type: "address"
          }
        ]
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    inputs: [],
    name: "getAssetSnapshot",
    outputs: [
      { name: "currentPrice", internalType: "uint256", type: "uint256" },
      { name: "totalSupply", internalType: "uint256", type: "uint256" },
      { name: "marketCap", internalType: "uint256", type: "uint256" },
      { name: "contractBalance", internalType: "uint256", type: "uint256" },
      { name: "isTradingActive", internalType: "bool", type: "bool" },
      { name: "lastPriceUpdate", internalType: "uint256", type: "uint256" }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    inputs: [{ name: "tokenAmount", internalType: "uint256", type: "uint256" }],
    name: "getBuyQuote",
    outputs: [
      { name: "totalCost", internalType: "uint256", type: "uint256" },
      { name: "fee", internalType: "uint256", type: "uint256" }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    inputs: [],
    name: "getCollectedFees",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view"
  },
  {
    type: "function",
    inputs: [],
    name: "getCompanyInfo",
    outputs: [
      {
        name: "",
        internalType: "struct ZenovaAsset.CompanyInfo",
        type: "tuple",
        components: [
          { name: "name", internalType: "string", type: "string" },
          { name: "symbol", internalType: "string", type: "string" },
          { name: "description", internalType: "string", type: "string" },
          { name: "website", internalType: "string", type: "string" },
          {
            name: "issuingCompanyWallet",
            internalType: "address",
            type: "address"
          }
        ]
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    inputs: [],
    name: "getFullAssetDetails",
    outputs: [
      {
        name: "info",
        internalType: "struct ZenovaAsset.FullAssetDetails",
        type: "tuple",
        components: [
          { name: "assetAddress", internalType: "address", type: "address" },
          {
            name: "companyDetails",
            internalType: "struct ZenovaAsset.CompanyInfo",
            type: "tuple",
            components: [
              { name: "name", internalType: "string", type: "string" },
              { name: "symbol", internalType: "string", type: "string" },
              { name: "description", internalType: "string", type: "string" },
              { name: "website", internalType: "string", type: "string" },
              {
                name: "issuingCompanyWallet",
                internalType: "address",
                type: "address"
              }
            ]
          },
          {
            name: "pricingDetails",
            internalType: "struct ZenovaAsset.AssetPricingDetails",
            type: "tuple",
            components: [
              {
                name: "currentPricePerToken",
                internalType: "uint256",
                type: "uint256"
              },
              { name: "buyFeeBPS", internalType: "uint256", type: "uint256" },
              { name: "sellFeeBPS", internalType: "uint256", type: "uint256" },
              { name: "marketCap", internalType: "uint256", type: "uint256" },
              {
                name: "lastPriceUpdateTimestamp",
                internalType: "uint256",
                type: "uint256"
              },
              {
                name: "acceptedCurrency",
                internalType: "address",
                type: "address"
              }
            ]
          },
          {
            name: "currentValuation",
            internalType: "uint256",
            type: "uint256"
          },
          { name: "maxTokenSupply", internalType: "uint256", type: "uint256" },
          {
            name: "currentTotalSupply",
            internalType: "uint256",
            type: "uint256"
          },
          { name: "isTradingActive", internalType: "bool", type: "bool" },
          { name: "admin", internalType: "address", type: "address" },
          { name: "priceAI", internalType: "address", type: "address" },
          {
            name: "liquidityManager",
            internalType: "address",
            type: "address"
          }
        ]
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    inputs: [],
    name: "getMarketAnalysis",
    outputs: [
      {
        name: "analysis",
        internalType: "struct ZenovaAsset.MarketAnalysis",
        type: "tuple",
        components: [
          {
            name: "currentMarketCap",
            internalType: "uint256",
            type: "uint256"
          },
          {
            name: "fullyDilutedMarketCap",
            internalType: "uint256",
            type: "uint256"
          },
          {
            name: "circulationRatio",
            internalType: "uint256",
            type: "uint256"
          },
          { name: "liquidityRatio", internalType: "uint256", type: "uint256" },
          {
            name: "priceToValuationRatio",
            internalType: "uint256",
            type: "uint256"
          },
          { name: "isOvervalued", internalType: "bool", type: "bool" },
          { name: "isUndervalued", internalType: "bool", type: "bool" },
          {
            name: "timeSinceLastPriceUpdate",
            internalType: "uint256",
            type: "uint256"
          }
        ]
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    inputs: [{ name: "role", internalType: "bytes32", type: "bytes32" }],
    name: "getRoleAdmin",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view"
  },
  {
    type: "function",
    inputs: [
      { name: "role", internalType: "bytes32", type: "bytes32" },
      { name: "index", internalType: "uint256", type: "uint256" }
    ],
    name: "getRoleMember",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view"
  },
  {
    type: "function",
    inputs: [{ name: "role", internalType: "bytes32", type: "bytes32" }],
    name: "getRoleMemberCount",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view"
  },
  {
    type: "function",
    inputs: [{ name: "role", internalType: "bytes32", type: "bytes32" }],
    name: "getRoleMembers",
    outputs: [{ name: "", internalType: "address[]", type: "address[]" }],
    stateMutability: "view"
  },
  {
    type: "function",
    inputs: [{ name: "tokenAmount", internalType: "uint256", type: "uint256" }],
    name: "getSellQuote",
    outputs: [
      { name: "proceeds", internalType: "uint256", type: "uint256" },
      { name: "fee", internalType: "uint256", type: "uint256" }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    inputs: [],
    name: "getTradingMetrics",
    outputs: [
      {
        name: "metrics",
        internalType: "struct ZenovaAsset.TradingMetrics",
        type: "tuple",
        components: [
          {
            name: "totalVolumeTraded",
            internalType: "uint256",
            type: "uint256"
          },
          {
            name: "totalTokensTraded",
            internalType: "uint256",
            type: "uint256"
          },
          {
            name: "totalBuyTransactions",
            internalType: "uint256",
            type: "uint256"
          },
          {
            name: "totalSellTransactions",
            internalType: "uint256",
            type: "uint256"
          },
          {
            name: "totalFeesCollected",
            internalType: "uint256",
            type: "uint256"
          },
          {
            name: "averageTradeSize",
            internalType: "uint256",
            type: "uint256"
          },
          {
            name: "lastTradeTimestamp",
            internalType: "uint256",
            type: "uint256"
          },
          { name: "priceVolatility", internalType: "uint256", type: "uint256" }
        ]
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    inputs: [{ name: "user", internalType: "address", type: "address" }],
    name: "getUserAssetInfo",
    outputs: [
      {
        name: "userInfo",
        internalType: "struct ZenovaAsset.UserAssetInfo",
        type: "tuple",
        components: [
          { name: "tokenBalance", internalType: "uint256", type: "uint256" },
          {
            name: "tokenBalanceValue",
            internalType: "uint256",
            type: "uint256"
          },
          {
            name: "percentageOfSupply",
            internalType: "uint256",
            type: "uint256"
          },
          {
            name: "totalPurchaseValue",
            internalType: "uint256",
            type: "uint256"
          },
          { name: "totalSaleValue", internalType: "uint256", type: "uint256" },
          { name: "totalFeesPaid", internalType: "uint256", type: "uint256" },
          {
            name: "lastTradeTimestamp",
            internalType: "uint256",
            type: "uint256"
          },
          { name: "hasTraded", internalType: "bool", type: "bool" },
          { name: "realizedPnL", internalType: "uint256", type: "uint256" },
          { name: "unrealizedPnL", internalType: "uint256", type: "uint256" }
        ]
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    inputs: [
      { name: "role", internalType: "bytes32", type: "bytes32" },
      { name: "account", internalType: "address", type: "address" }
    ],
    name: "grantRole",
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    inputs: [
      { name: "role", internalType: "bytes32", type: "bytes32" },
      { name: "account", internalType: "address", type: "address" }
    ],
    name: "hasRole",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    stateMutability: "view"
  },
  {
    type: "function",
    inputs: [
      { name: "_initialAdmin", internalType: "address", type: "address" },
      {
        name: "_companyInfoStruct",
        internalType: "struct ZenovaAsset.CompanyInfo",
        type: "tuple",
        components: [
          { name: "name", internalType: "string", type: "string" },
          { name: "symbol", internalType: "string", type: "string" },
          { name: "description", internalType: "string", type: "string" },
          { name: "website", internalType: "string", type: "string" },
          {
            name: "issuingCompanyWallet",
            internalType: "address",
            type: "address"
          }
        ]
      },
      { name: "_acceptedCurrency", internalType: "address", type: "address" }
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    inputs: [],
    name: "isTradingActive",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    stateMutability: "view"
  },
  {
    type: "function",
    inputs: [],
    name: "lastTradeTimestamp",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view"
  },
  {
    type: "function",
    inputs: [],
    name: "maxTokenSupply",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view"
  },
  {
    type: "function",
    inputs: [],
    name: "name",
    outputs: [{ name: "", internalType: "string", type: "string" }],
    stateMutability: "view"
  },
  {
    type: "function",
    inputs: [],
    name: "pause",
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    inputs: [],
    name: "paused",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    stateMutability: "view"
  },
  {
    type: "function",
    inputs: [
      { name: "role", internalType: "bytes32", type: "bytes32" },
      { name: "callerConfirmation", internalType: "address", type: "address" }
    ],
    name: "renounceRole",
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    inputs: [
      { name: "role", internalType: "bytes32", type: "bytes32" },
      { name: "account", internalType: "address", type: "address" }
    ],
    name: "revokeRole",
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    inputs: [
      { name: "tokenAmountToSell", internalType: "uint256", type: "uint256" }
    ],
    name: "sellTokens",
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    inputs: [
      { name: "_companyValuation", internalType: "uint256", type: "uint256" },
      {
        name: "_initialPricePerToken",
        internalType: "uint256",
        type: "uint256"
      },
      { name: "_evaluator", internalType: "address", type: "address" }
    ],
    name: "setCompanyValuationAndSupply",
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    inputs: [{ name: "interfaceId", internalType: "bytes4", type: "bytes4" }],
    name: "supportsInterface",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    stateMutability: "view"
  },
  {
    type: "function",
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", internalType: "string", type: "string" }],
    stateMutability: "view"
  },
  {
    type: "function",
    inputs: [],
    name: "totalBuyTransactions",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view"
  },
  {
    type: "function",
    inputs: [],
    name: "totalSellTransactions",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view"
  },
  {
    type: "function",
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view"
  },
  {
    type: "function",
    inputs: [],
    name: "totalTokensTraded",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view"
  },
  {
    type: "function",
    inputs: [],
    name: "totalVolumeTraded",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view"
  },
  {
    type: "function",
    inputs: [],
    name: "tradingActive",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    stateMutability: "view"
  },
  {
    type: "function",
    inputs: [
      { name: "to", internalType: "address", type: "address" },
      { name: "value", internalType: "uint256", type: "uint256" }
    ],
    name: "transfer",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    inputs: [
      { name: "from", internalType: "address", type: "address" },
      { name: "to", internalType: "address", type: "address" },
      { name: "value", internalType: "uint256", type: "uint256" }
    ],
    name: "transferFrom",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    inputs: [],
    name: "unpause",
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    inputs: [
      { name: "newBuyFeeBPS", internalType: "uint256", type: "uint256" },
      { name: "newSellFeeBPS", internalType: "uint256", type: "uint256" }
    ],
    name: "updateLiquidityParameters",
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    inputs: [
      { name: "newPricePerToken", internalType: "uint256", type: "uint256" }
    ],
    name: "updatePrice",
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    inputs: [{ name: "", internalType: "address", type: "address" }],
    name: "userHasTraded",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    stateMutability: "view"
  },
  {
    type: "function",
    inputs: [{ name: "", internalType: "address", type: "address" }],
    name: "userLastTradeTimestamp",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view"
  },
  {
    type: "function",
    inputs: [{ name: "", internalType: "address", type: "address" }],
    name: "userTotalFeesPaid",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view"
  },
  {
    type: "function",
    inputs: [{ name: "", internalType: "address", type: "address" }],
    name: "userTotalPurchaseValue",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view"
  },
  {
    type: "function",
    inputs: [{ name: "", internalType: "address", type: "address" }],
    name: "userTotalSaleValue",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view"
  },
  {
    type: "function",
    inputs: [{ name: "recipient", internalType: "address", type: "address" }],
    name: "withdrawFees",
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "owner",
        internalType: "address",
        type: "address",
        indexed: true
      },
      {
        name: "spender",
        internalType: "address",
        type: "address",
        indexed: true
      },
      {
        name: "value",
        internalType: "uint256",
        type: "uint256",
        indexed: false
      }
    ],
    name: "Approval"
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "valuation",
        internalType: "uint256",
        type: "uint256",
        indexed: false
      },
      {
        name: "maxSupply",
        internalType: "uint256",
        type: "uint256",
        indexed: false
      },
      {
        name: "evaluator",
        internalType: "address",
        type: "address",
        indexed: false
      }
    ],
    name: "CompanyValuationSet"
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "buyFeeBPS",
        internalType: "uint256",
        type: "uint256",
        indexed: false
      },
      {
        name: "sellFeeBPS",
        internalType: "uint256",
        type: "uint256",
        indexed: false
      },
      {
        name: "updater",
        internalType: "address",
        type: "address",
        indexed: false
      }
    ],
    name: "LiquidityParametersUpdated"
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "account",
        internalType: "address",
        type: "address",
        indexed: false
      }
    ],
    name: "Paused"
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "newPrice",
        internalType: "uint256",
        type: "uint256",
        indexed: false
      },
      {
        name: "updater",
        internalType: "address",
        type: "address",
        indexed: false
      }
    ],
    name: "PriceUpdated"
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      { name: "role", internalType: "bytes32", type: "bytes32", indexed: true },
      {
        name: "previousAdminRole",
        internalType: "bytes32",
        type: "bytes32",
        indexed: true
      },
      {
        name: "newAdminRole",
        internalType: "bytes32",
        type: "bytes32",
        indexed: true
      }
    ],
    name: "RoleAdminChanged"
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      { name: "role", internalType: "bytes32", type: "bytes32", indexed: true },
      {
        name: "account",
        internalType: "address",
        type: "address",
        indexed: true
      },
      {
        name: "sender",
        internalType: "address",
        type: "address",
        indexed: true
      }
    ],
    name: "RoleGranted"
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      { name: "role", internalType: "bytes32", type: "bytes32", indexed: true },
      {
        name: "account",
        internalType: "address",
        type: "address",
        indexed: true
      },
      {
        name: "sender",
        internalType: "address",
        type: "address",
        indexed: true
      }
    ],
    name: "RoleRevoked"
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "trader",
        internalType: "address",
        type: "address",
        indexed: true
      },
      { name: "isBuy", internalType: "bool", type: "bool", indexed: false },
      {
        name: "tokenAmount",
        internalType: "uint256",
        type: "uint256",
        indexed: false
      },
      {
        name: "currencyAmount",
        internalType: "uint256",
        type: "uint256",
        indexed: false
      },
      { name: "fee", internalType: "uint256", type: "uint256", indexed: false }
    ],
    name: "TradeExecuted"
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      { name: "from", internalType: "address", type: "address", indexed: true },
      { name: "to", internalType: "address", type: "address", indexed: true },
      {
        name: "value",
        internalType: "uint256",
        type: "uint256",
        indexed: false
      }
    ],
    name: "Transfer"
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "account",
        internalType: "address",
        type: "address",
        indexed: false
      }
    ],
    name: "Unpaused"
  },
  { type: "error", inputs: [], name: "AccessControlBadConfirmation" },
  {
    type: "error",
    inputs: [
      { name: "account", internalType: "address", type: "address" },
      { name: "neededRole", internalType: "bytes32", type: "bytes32" }
    ],
    name: "AccessControlUnauthorizedAccount"
  },
  {
    type: "error",
    inputs: [
      { name: "spender", internalType: "address", type: "address" },
      { name: "allowance", internalType: "uint256", type: "uint256" },
      { name: "needed", internalType: "uint256", type: "uint256" }
    ],
    name: "ERC20InsufficientAllowance"
  },
  {
    type: "error",
    inputs: [
      { name: "sender", internalType: "address", type: "address" },
      { name: "balance", internalType: "uint256", type: "uint256" },
      { name: "needed", internalType: "uint256", type: "uint256" }
    ],
    name: "ERC20InsufficientBalance"
  },
  {
    type: "error",
    inputs: [{ name: "approver", internalType: "address", type: "address" }],
    name: "ERC20InvalidApprover"
  },
  {
    type: "error",
    inputs: [{ name: "receiver", internalType: "address", type: "address" }],
    name: "ERC20InvalidReceiver"
  },
  {
    type: "error",
    inputs: [{ name: "sender", internalType: "address", type: "address" }],
    name: "ERC20InvalidSender"
  },
  {
    type: "error",
    inputs: [{ name: "spender", internalType: "address", type: "address" }],
    name: "ERC20InvalidSpender"
  },
  { type: "error", inputs: [], name: "EnforcedPause" },
  { type: "error", inputs: [], name: "ExpectedPause" },
  {
    type: "error",
    inputs: [{ name: "token", internalType: "address", type: "address" }],
    name: "SafeERC20FailedOperation"
  },
  { type: "error", inputs: [], name: "ZenovaAsset__AlreadyInitialized" },
  { type: "error", inputs: [], name: "ZenovaAsset__CompanyWalletNotSet" },
  {
    type: "error",
    inputs: [{ name: "feeBPS", internalType: "uint256", type: "uint256" }],
    name: "ZenovaAsset__FeeTooHigh"
  },
  {
    type: "error",
    inputs: [
      { name: "token", internalType: "address", type: "address" },
      { name: "spender", internalType: "address", type: "address" },
      { name: "needed", internalType: "uint256", type: "uint256" }
    ],
    name: "ZenovaAsset__InsufficientAllowance"
  },
  { type: "error", inputs: [], name: "ZenovaAsset__InsufficientOutputAmount" },
  { type: "error", inputs: [], name: "ZenovaAsset__InvalidAmount" },
  { type: "error", inputs: [], name: "ZenovaAsset__MaxSupplyReached" },
  { type: "error", inputs: [], name: "ZenovaAsset__MaxSupplyWouldBeZero" },
  { type: "error", inputs: [], name: "ZenovaAsset__NoFeesToWithdraw" },
  { type: "error", inputs: [], name: "ZenovaAsset__NotAI" },
  { type: "error", inputs: [], name: "ZenovaAsset__NotInitialized" },
  { type: "error", inputs: [], name: "ZenovaAsset__PriceMustBePositive" },
  { type: "error", inputs: [], name: "ZenovaAsset__TradingActive" },
  { type: "error", inputs: [], name: "ZenovaAsset__TradingNotActive" },
  {
    type: "error",
    inputs: [
      { name: "token", internalType: "address", type: "address" },
      { name: "recipient", internalType: "address", type: "address" },
      { name: "amount", internalType: "uint256", type: "uint256" }
    ],
    name: "ZenovaAsset__TransferFailed"
  },
  { type: "error", inputs: [], name: "ZenovaAsset__ValuationNotSet" },
  { type: "error", inputs: [], name: "ZenovaAsset__ValuationZeroOrPriceZero" },
  {
    type: "error",
    inputs: [],
    name: "ZenovaAsset__WithdrawAmountExceedsBalance"
  },
  { type: "error", inputs: [], name: "ZenovaAsset__ZeroAddress" }
];
const zenovaAssetConfig = {
  abi: zenovaAssetAbi
};
const zenovaAssetFactoryAbi = [
  {
    type: "constructor",
    inputs: [
      {
        name: "_assetImplementation",
        internalType: "address",
        type: "address"
      },
      {
        name: "_acceptedCurrencyAddr",
        internalType: "address",
        type: "address"
      }
    ],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    inputs: [],
    name: "AI_ROLE",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view"
  },
  {
    type: "function",
    inputs: [],
    name: "DEFAULT_ADMIN_ROLE",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view"
  },
  {
    type: "function",
    inputs: [],
    name: "acceptedCurrency",
    outputs: [{ name: "", internalType: "contract IERC20", type: "address" }],
    stateMutability: "view"
  },
  {
    type: "function",
    inputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    name: "allZenovaAssets",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view"
  },
  {
    type: "function",
    inputs: [{ name: "", internalType: "address", type: "address" }],
    name: "assetInitialValuations",
    outputs: [
      { name: "companyWallet", internalType: "address", type: "address" },
      { name: "valuation", internalType: "uint256", type: "uint256" },
      {
        name: "initialPricePerToken",
        internalType: "uint256",
        type: "uint256"
      },
      { name: "evaluatorAI", internalType: "address", type: "address" },
      { name: "assessmentTimestamp", internalType: "uint64", type: "uint64" },
      { name: "exists", internalType: "bool", type: "bool" }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    inputs: [
      { name: "", internalType: "address", type: "address" },
      { name: "", internalType: "uint256", type: "uint256" }
    ],
    name: "companyToAssets",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view"
  },
  {
    type: "function",
    inputs: [
      { name: "_companyWallet", internalType: "address", type: "address" },
      {
        name: "_companyInfo",
        internalType: "struct ZenovaAsset.CompanyInfo",
        type: "tuple",
        components: [
          { name: "name", internalType: "string", type: "string" },
          { name: "symbol", internalType: "string", type: "string" },
          { name: "description", internalType: "string", type: "string" },
          { name: "website", internalType: "string", type: "string" },
          {
            name: "issuingCompanyWallet",
            internalType: "address",
            type: "address"
          }
        ]
      }
    ],
    name: "createZenovaAsset",
    outputs: [
      { name: "assetAddress", internalType: "address", type: "address" }
    ],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    inputs: [],
    name: "getAllAssets",
    outputs: [{ name: "", internalType: "address[]", type: "address[]" }],
    stateMutability: "view"
  },
  {
    type: "function",
    inputs: [
      { name: "_assetAddress", internalType: "address", type: "address" }
    ],
    name: "getAssetFullDetails",
    outputs: [
      {
        name: "",
        internalType: "struct ZenovaAsset.FullAssetDetails",
        type: "tuple",
        components: [
          { name: "assetAddress", internalType: "address", type: "address" },
          {
            name: "companyDetails",
            internalType: "struct ZenovaAsset.CompanyInfo",
            type: "tuple",
            components: [
              { name: "name", internalType: "string", type: "string" },
              { name: "symbol", internalType: "string", type: "string" },
              { name: "description", internalType: "string", type: "string" },
              { name: "website", internalType: "string", type: "string" },
              {
                name: "issuingCompanyWallet",
                internalType: "address",
                type: "address"
              }
            ]
          },
          {
            name: "pricingDetails",
            internalType: "struct ZenovaAsset.AssetPricingDetails",
            type: "tuple",
            components: [
              {
                name: "currentPricePerToken",
                internalType: "uint256",
                type: "uint256"
              },
              { name: "buyFeeBPS", internalType: "uint256", type: "uint256" },
              { name: "sellFeeBPS", internalType: "uint256", type: "uint256" },
              { name: "marketCap", internalType: "uint256", type: "uint256" },
              {
                name: "lastPriceUpdateTimestamp",
                internalType: "uint256",
                type: "uint256"
              },
              {
                name: "acceptedCurrency",
                internalType: "address",
                type: "address"
              }
            ]
          },
          {
            name: "currentValuation",
            internalType: "uint256",
            type: "uint256"
          },
          { name: "maxTokenSupply", internalType: "uint256", type: "uint256" },
          {
            name: "currentTotalSupply",
            internalType: "uint256",
            type: "uint256"
          },
          { name: "isTradingActive", internalType: "bool", type: "bool" },
          { name: "admin", internalType: "address", type: "address" },
          { name: "priceAI", internalType: "address", type: "address" },
          {
            name: "liquidityManager",
            internalType: "address",
            type: "address"
          }
        ]
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    inputs: [
      { name: "_companyWallet", internalType: "address", type: "address" }
    ],
    name: "getAssetsByCompany",
    outputs: [{ name: "", internalType: "address[]", type: "address[]" }],
    stateMutability: "view"
  },
  {
    type: "function",
    inputs: [
      { name: "_companyWallet", internalType: "address", type: "address" }
    ],
    name: "getCompanyComprehensiveDetails",
    outputs: [
      {
        name: "details",
        internalType: "struct ZenovaAssetFactory.CompanyComprehensiveDetails",
        type: "tuple",
        components: [
          { name: "companyWallet", internalType: "address", type: "address" },
          {
            name: "pendingValuation",
            internalType: "struct ZenovaAssetFactory.CompanyInitialValuation",
            type: "tuple",
            components: [
              {
                name: "companyWallet",
                internalType: "address",
                type: "address"
              },
              { name: "valuation", internalType: "uint256", type: "uint256" },
              {
                name: "initialPricePerToken",
                internalType: "uint256",
                type: "uint256"
              },
              { name: "evaluatorAI", internalType: "address", type: "address" },
              {
                name: "assessmentTimestamp",
                internalType: "uint64",
                type: "uint64"
              },
              { name: "exists", internalType: "bool", type: "bool" }
            ]
          },
          {
            name: "assetAddresses",
            internalType: "address[]",
            type: "address[]"
          },
          {
            name: "assetDetails",
            internalType: "struct ZenovaAsset.FullAssetDetails[]",
            type: "tuple[]",
            components: [
              {
                name: "assetAddress",
                internalType: "address",
                type: "address"
              },
              {
                name: "companyDetails",
                internalType: "struct ZenovaAsset.CompanyInfo",
                type: "tuple",
                components: [
                  { name: "name", internalType: "string", type: "string" },
                  { name: "symbol", internalType: "string", type: "string" },
                  {
                    name: "description",
                    internalType: "string",
                    type: "string"
                  },
                  { name: "website", internalType: "string", type: "string" },
                  {
                    name: "issuingCompanyWallet",
                    internalType: "address",
                    type: "address"
                  }
                ]
              },
              {
                name: "pricingDetails",
                internalType: "struct ZenovaAsset.AssetPricingDetails",
                type: "tuple",
                components: [
                  {
                    name: "currentPricePerToken",
                    internalType: "uint256",
                    type: "uint256"
                  },
                  {
                    name: "buyFeeBPS",
                    internalType: "uint256",
                    type: "uint256"
                  },
                  {
                    name: "sellFeeBPS",
                    internalType: "uint256",
                    type: "uint256"
                  },
                  {
                    name: "marketCap",
                    internalType: "uint256",
                    type: "uint256"
                  },
                  {
                    name: "lastPriceUpdateTimestamp",
                    internalType: "uint256",
                    type: "uint256"
                  },
                  {
                    name: "acceptedCurrency",
                    internalType: "address",
                    type: "address"
                  }
                ]
              },
              {
                name: "currentValuation",
                internalType: "uint256",
                type: "uint256"
              },
              {
                name: "maxTokenSupply",
                internalType: "uint256",
                type: "uint256"
              },
              {
                name: "currentTotalSupply",
                internalType: "uint256",
                type: "uint256"
              },
              { name: "isTradingActive", internalType: "bool", type: "bool" },
              { name: "admin", internalType: "address", type: "address" },
              { name: "priceAI", internalType: "address", type: "address" },
              {
                name: "liquidityManager",
                internalType: "address",
                type: "address"
              }
            ]
          },
          { name: "totalMarketCap", internalType: "uint256", type: "uint256" },
          {
            name: "totalTokensIssued",
            internalType: "uint256",
            type: "uint256"
          },
          {
            name: "totalTradingVolume",
            internalType: "uint256",
            type: "uint256"
          },
          { name: "hasActiveAssets", internalType: "bool", type: "bool" }
        ]
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    inputs: [
      { name: "_assetAddresses", internalType: "address[]", type: "address[]" }
    ],
    name: "getMultipleAssetAnalytics",
    outputs: [
      {
        name: "assetDetails",
        internalType: "struct ZenovaAsset.FullAssetDetails[]",
        type: "tuple[]",
        components: [
          { name: "assetAddress", internalType: "address", type: "address" },
          {
            name: "companyDetails",
            internalType: "struct ZenovaAsset.CompanyInfo",
            type: "tuple",
            components: [
              { name: "name", internalType: "string", type: "string" },
              { name: "symbol", internalType: "string", type: "string" },
              { name: "description", internalType: "string", type: "string" },
              { name: "website", internalType: "string", type: "string" },
              {
                name: "issuingCompanyWallet",
                internalType: "address",
                type: "address"
              }
            ]
          },
          {
            name: "pricingDetails",
            internalType: "struct ZenovaAsset.AssetPricingDetails",
            type: "tuple",
            components: [
              {
                name: "currentPricePerToken",
                internalType: "uint256",
                type: "uint256"
              },
              { name: "buyFeeBPS", internalType: "uint256", type: "uint256" },
              { name: "sellFeeBPS", internalType: "uint256", type: "uint256" },
              { name: "marketCap", internalType: "uint256", type: "uint256" },
              {
                name: "lastPriceUpdateTimestamp",
                internalType: "uint256",
                type: "uint256"
              },
              {
                name: "acceptedCurrency",
                internalType: "address",
                type: "address"
              }
            ]
          },
          {
            name: "currentValuation",
            internalType: "uint256",
            type: "uint256"
          },
          { name: "maxTokenSupply", internalType: "uint256", type: "uint256" },
          {
            name: "currentTotalSupply",
            internalType: "uint256",
            type: "uint256"
          },
          { name: "isTradingActive", internalType: "bool", type: "bool" },
          { name: "admin", internalType: "address", type: "address" },
          { name: "priceAI", internalType: "address", type: "address" },
          {
            name: "liquidityManager",
            internalType: "address",
            type: "address"
          }
        ]
      },
      {
        name: "tradingMetrics",
        internalType: "struct ZenovaAsset.TradingMetrics[]",
        type: "tuple[]",
        components: [
          {
            name: "totalVolumeTraded",
            internalType: "uint256",
            type: "uint256"
          },
          {
            name: "totalTokensTraded",
            internalType: "uint256",
            type: "uint256"
          },
          {
            name: "totalBuyTransactions",
            internalType: "uint256",
            type: "uint256"
          },
          {
            name: "totalSellTransactions",
            internalType: "uint256",
            type: "uint256"
          },
          {
            name: "totalFeesCollected",
            internalType: "uint256",
            type: "uint256"
          },
          {
            name: "averageTradeSize",
            internalType: "uint256",
            type: "uint256"
          },
          {
            name: "lastTradeTimestamp",
            internalType: "uint256",
            type: "uint256"
          },
          { name: "priceVolatility", internalType: "uint256", type: "uint256" }
        ]
      },
      {
        name: "marketAnalysis",
        internalType: "struct ZenovaAsset.MarketAnalysis[]",
        type: "tuple[]",
        components: [
          {
            name: "currentMarketCap",
            internalType: "uint256",
            type: "uint256"
          },
          {
            name: "fullyDilutedMarketCap",
            internalType: "uint256",
            type: "uint256"
          },
          {
            name: "circulationRatio",
            internalType: "uint256",
            type: "uint256"
          },
          { name: "liquidityRatio", internalType: "uint256", type: "uint256" },
          {
            name: "priceToValuationRatio",
            internalType: "uint256",
            type: "uint256"
          },
          { name: "isOvervalued", internalType: "bool", type: "bool" },
          { name: "isUndervalued", internalType: "bool", type: "bool" },
          {
            name: "timeSinceLastPriceUpdate",
            internalType: "uint256",
            type: "uint256"
          }
        ]
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    inputs: [
      { name: "_assetAddresses", internalType: "address[]", type: "address[]" }
    ],
    name: "getMultipleAssetFullDetails",
    outputs: [
      {
        name: "",
        internalType: "struct ZenovaAsset.FullAssetDetails[]",
        type: "tuple[]",
        components: [
          { name: "assetAddress", internalType: "address", type: "address" },
          {
            name: "companyDetails",
            internalType: "struct ZenovaAsset.CompanyInfo",
            type: "tuple",
            components: [
              { name: "name", internalType: "string", type: "string" },
              { name: "symbol", internalType: "string", type: "string" },
              { name: "description", internalType: "string", type: "string" },
              { name: "website", internalType: "string", type: "string" },
              {
                name: "issuingCompanyWallet",
                internalType: "address",
                type: "address"
              }
            ]
          },
          {
            name: "pricingDetails",
            internalType: "struct ZenovaAsset.AssetPricingDetails",
            type: "tuple",
            components: [
              {
                name: "currentPricePerToken",
                internalType: "uint256",
                type: "uint256"
              },
              { name: "buyFeeBPS", internalType: "uint256", type: "uint256" },
              { name: "sellFeeBPS", internalType: "uint256", type: "uint256" },
              { name: "marketCap", internalType: "uint256", type: "uint256" },
              {
                name: "lastPriceUpdateTimestamp",
                internalType: "uint256",
                type: "uint256"
              },
              {
                name: "acceptedCurrency",
                internalType: "address",
                type: "address"
              }
            ]
          },
          {
            name: "currentValuation",
            internalType: "uint256",
            type: "uint256"
          },
          { name: "maxTokenSupply", internalType: "uint256", type: "uint256" },
          {
            name: "currentTotalSupply",
            internalType: "uint256",
            type: "uint256"
          },
          { name: "isTradingActive", internalType: "bool", type: "bool" },
          { name: "admin", internalType: "address", type: "address" },
          { name: "priceAI", internalType: "address", type: "address" },
          {
            name: "liquidityManager",
            internalType: "address",
            type: "address"
          }
        ]
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    inputs: [],
    name: "getPlatformSnapshot",
    outputs: [
      {
        name: "snapshot",
        internalType: "struct ZenovaAssetFactory.PlatformSnapshot",
        type: "tuple",
        components: [
          {
            name: "totalAssetsCreated",
            internalType: "uint256",
            type: "uint256"
          },
          {
            name: "totalCompaniesOnboarded",
            internalType: "uint256",
            type: "uint256"
          },
          {
            name: "totalActiveAssets",
            internalType: "uint256",
            type: "uint256"
          },
          {
            name: "totalMarketCapitalization",
            internalType: "uint256",
            type: "uint256"
          },
          {
            name: "totalTradingVolume",
            internalType: "uint256",
            type: "uint256"
          },
          {
            name: "totalFeesCollected",
            internalType: "uint256",
            type: "uint256"
          },
          {
            name: "averageAssetMarketCap",
            internalType: "uint256",
            type: "uint256"
          },
          {
            name: "totalTokensInCirculation",
            internalType: "uint256",
            type: "uint256"
          },
          {
            name: "totalMaxTokenSupply",
            internalType: "uint256",
            type: "uint256"
          },
          {
            name: "largestAssetByMarketCap",
            internalType: "address",
            type: "address"
          },
          {
            name: "mostActiveAssetByVolume",
            internalType: "address",
            type: "address"
          }
        ]
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    inputs: [{ name: "role", internalType: "bytes32", type: "bytes32" }],
    name: "getRoleAdmin",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view"
  },
  {
    type: "function",
    inputs: [
      { name: "_companyWallet", internalType: "address", type: "address" }
    ],
    name: "getSubmittedValuation",
    outputs: [
      {
        name: "",
        internalType: "struct ZenovaAssetFactory.CompanyInitialValuation",
        type: "tuple",
        components: [
          { name: "companyWallet", internalType: "address", type: "address" },
          { name: "valuation", internalType: "uint256", type: "uint256" },
          {
            name: "initialPricePerToken",
            internalType: "uint256",
            type: "uint256"
          },
          { name: "evaluatorAI", internalType: "address", type: "address" },
          {
            name: "assessmentTimestamp",
            internalType: "uint64",
            type: "uint64"
          },
          { name: "exists", internalType: "bool", type: "bool" }
        ]
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    inputs: [{ name: "_user", internalType: "address", type: "address" }],
    name: "getUserPortfolioDetails",
    outputs: [
      {
        name: "portfolio",
        internalType: "struct ZenovaAssetFactory.UserPortfolioDetails",
        type: "tuple",
        components: [
          { name: "userAddress", internalType: "address", type: "address" },
          {
            name: "totalPortfolioValue",
            internalType: "uint256",
            type: "uint256"
          },
          {
            name: "totalInvestedAmount",
            internalType: "uint256",
            type: "uint256"
          },
          {
            name: "totalRealizedPnL",
            internalType: "uint256",
            type: "uint256"
          },
          {
            name: "totalUnrealizedPnL",
            internalType: "uint256",
            type: "uint256"
          },
          { name: "totalFeesPaid", internalType: "uint256", type: "uint256" },
          {
            name: "numberOfAssetsHeld",
            internalType: "uint256",
            type: "uint256"
          },
          {
            name: "heldAssetAddresses",
            internalType: "address[]",
            type: "address[]"
          },
          {
            name: "assetHoldings",
            internalType: "struct ZenovaAsset.UserAssetInfo[]",
            type: "tuple[]",
            components: [
              {
                name: "tokenBalance",
                internalType: "uint256",
                type: "uint256"
              },
              {
                name: "tokenBalanceValue",
                internalType: "uint256",
                type: "uint256"
              },
              {
                name: "percentageOfSupply",
                internalType: "uint256",
                type: "uint256"
              },
              {
                name: "totalPurchaseValue",
                internalType: "uint256",
                type: "uint256"
              },
              {
                name: "totalSaleValue",
                internalType: "uint256",
                type: "uint256"
              },
              {
                name: "totalFeesPaid",
                internalType: "uint256",
                type: "uint256"
              },
              {
                name: "lastTradeTimestamp",
                internalType: "uint256",
                type: "uint256"
              },
              { name: "hasTraded", internalType: "bool", type: "bool" },
              { name: "realizedPnL", internalType: "uint256", type: "uint256" },
              {
                name: "unrealizedPnL",
                internalType: "uint256",
                type: "uint256"
              }
            ]
          },
          { name: "isActiveTrader", internalType: "bool", type: "bool" }
        ]
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    inputs: [
      { name: "role", internalType: "bytes32", type: "bytes32" },
      { name: "account", internalType: "address", type: "address" }
    ],
    name: "grantRole",
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    inputs: [
      { name: "role", internalType: "bytes32", type: "bytes32" },
      { name: "account", internalType: "address", type: "address" }
    ],
    name: "hasRole",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    stateMutability: "view"
  },
  {
    type: "function",
    inputs: [
      { name: "role", internalType: "bytes32", type: "bytes32" },
      { name: "callerConfirmation", internalType: "address", type: "address" }
    ],
    name: "renounceRole",
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    inputs: [
      { name: "role", internalType: "bytes32", type: "bytes32" },
      { name: "account", internalType: "address", type: "address" }
    ],
    name: "revokeRole",
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    inputs: [
      { name: "_companyWallet", internalType: "address", type: "address" },
      { name: "_valuation", internalType: "uint256", type: "uint256" },
      {
        name: "_initialPricePerToken",
        internalType: "uint256",
        type: "uint256"
      }
    ],
    name: "submitCompanyValuation",
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    inputs: [{ name: "interfaceId", internalType: "bytes4", type: "bytes4" }],
    name: "supportsInterface",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    stateMutability: "view"
  },
  {
    type: "function",
    inputs: [],
    name: "totalAssets",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view"
  },
  {
    type: "function",
    inputs: [],
    name: "zenovaAssetImplementation",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view"
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "companyWallet",
        internalType: "address",
        type: "address",
        indexed: true
      },
      {
        name: "valuation",
        internalType: "uint256",
        type: "uint256",
        indexed: false
      },
      {
        name: "initialPricePerToken",
        internalType: "uint256",
        type: "uint256",
        indexed: false
      },
      {
        name: "evaluatorAI",
        internalType: "address",
        type: "address",
        indexed: true
      }
    ],
    name: "CompanyValuationSubmitted"
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      { name: "role", internalType: "bytes32", type: "bytes32", indexed: true },
      {
        name: "previousAdminRole",
        internalType: "bytes32",
        type: "bytes32",
        indexed: true
      },
      {
        name: "newAdminRole",
        internalType: "bytes32",
        type: "bytes32",
        indexed: true
      }
    ],
    name: "RoleAdminChanged"
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      { name: "role", internalType: "bytes32", type: "bytes32", indexed: true },
      {
        name: "account",
        internalType: "address",
        type: "address",
        indexed: true
      },
      {
        name: "sender",
        internalType: "address",
        type: "address",
        indexed: true
      }
    ],
    name: "RoleGranted"
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      { name: "role", internalType: "bytes32", type: "bytes32", indexed: true },
      {
        name: "account",
        internalType: "address",
        type: "address",
        indexed: true
      },
      {
        name: "sender",
        internalType: "address",
        type: "address",
        indexed: true
      }
    ],
    name: "RoleRevoked"
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "assetAddress",
        internalType: "address",
        type: "address",
        indexed: true
      },
      {
        name: "companyWallet",
        internalType: "address",
        type: "address",
        indexed: true
      },
      {
        name: "companyName",
        internalType: "string",
        type: "string",
        indexed: false
      },
      {
        name: "creator",
        internalType: "address",
        type: "address",
        indexed: true
      },
      {
        name: "initialValuation",
        internalType: "uint256",
        type: "uint256",
        indexed: false
      },
      {
        name: "maxTokenSupply",
        internalType: "uint256",
        type: "uint256",
        indexed: false
      }
    ],
    name: "ZenovaAssetCreated"
  },
  { type: "error", inputs: [], name: "AccessControlBadConfirmation" },
  {
    type: "error",
    inputs: [
      { name: "account", internalType: "address", type: "address" },
      { name: "neededRole", internalType: "bytes32", type: "bytes32" }
    ],
    name: "AccessControlUnauthorizedAccount"
  },
  { type: "error", inputs: [], name: "Factory__AssetCreationFailed" },
  { type: "error", inputs: [], name: "Factory__ImplementationNotSet" },
  { type: "error", inputs: [], name: "Factory__InvalidAmount" },
  { type: "error", inputs: [], name: "Factory__NotAI" },
  { type: "error", inputs: [], name: "Factory__NotAuthorized" },
  { type: "error", inputs: [], name: "Factory__NotCompanyWallet" },
  { type: "error", inputs: [], name: "Factory__PriceCannotBeZero" },
  { type: "error", inputs: [], name: "Factory__ValuationAlreadyExists" },
  { type: "error", inputs: [], name: "Factory__ValuationNotFound" },
  { type: "error", inputs: [], name: "Factory__ZeroAddress" },
  { type: "error", inputs: [], name: "FailedDeployment" },
  {
    type: "error",
    inputs: [
      { name: "balance", internalType: "uint256", type: "uint256" },
      { name: "needed", internalType: "uint256", type: "uint256" }
    ],
    name: "InsufficientBalance"
  }
];
const zenovaAssetFactoryAddress = {
  42421: "0x2CC8cc0344a2cb03c1F06A1A523969f7Cbfe55B3"
};
const zenovaAssetFactoryConfig = {
  address: zenovaAssetFactoryAddress,
  abi: zenovaAssetFactoryAbi
};

const USDT_DECIMALS$2 = 6;
const DEFAULT_TOKEN_DECIMALS$2 = 18;
function formatTokenAmount(amount, decimals, options) {
  if (amount === void 0 || amount === null) return "N/A";
  const formatted = formatUnits(amount, decimals);
  let numberPart = formatted;
  if (!options?.keepTrailingZeros) {
    if (formatted.includes(".")) {
      numberPart = formatted.replace(/(\.\d*?[1-9])0+$|(\.0*)$/, "$1");
      if (numberPart.endsWith(".")) {
        numberPart = numberPart.slice(0, -1);
      }
    }
  }
  const parts = numberPart.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const valueWithSeparators = parts.join(".");
  let result = valueWithSeparators;
  if (options?.showUnits && options.currencySymbol) {
    result = `${result} ${options.currencySymbol}`;
  } else if (options?.currencySymbol && !options?.showUnits) {
    result = `${options.currencySymbol}${result}`;
  }
  return result;
}
const formatUsdtAmount = (amount, options) => formatTokenAmount(amount, USDT_DECIMALS$2, { ...options, currencySymbol: "USDT" });
const formatDefaultTokenAmount = (amount, options) => formatTokenAmount(amount, DEFAULT_TOKEN_DECIMALS$2, options);
function formatAddress(address, startChars = 6, endChars = 4) {
  return address;
}
function formatBpsRate(bps) {
  if (bps === void 0 || bps === null) return "N/A";
  const bpsAsNumber = Number(bps);
  if (isNaN(bpsAsNumber)) return "N/A";
  return `${(bpsAsNumber / 100).toFixed(2)}%`;
}
function formatTimestamp(timestampSeconds) {
  if (timestampSeconds === void 0 || timestampSeconds === null || BigInt(timestampSeconds) === BigInt(0)) return "N/A";
  try {
    const date = new Date(Number(timestampSeconds) * 1e3);
    return date.toLocaleString();
  } catch (e) {
    return "Invalid Date";
  }
}
function formatDuration(durationSeconds) {
  if (durationSeconds === void 0 || durationSeconds === null) return "N/A";
  let seconds = Number(durationSeconds);
  if (isNaN(seconds) || seconds < 0) return "N/A";
  if (seconds === 0) return "0 seconds";
  const d = Math.floor(seconds / (3600 * 24));
  seconds -= d * 3600 * 24;
  const h = Math.floor(seconds / 3600);
  seconds -= h * 3600;
  const m = Math.floor(seconds / 60);
  seconds -= m * 60;
  const s = Math.floor(seconds);
  let result = "";
  if (d > 0) result += `${d} day${d > 1 ? "s" : ""}, `;
  if (h > 0) result += `${h} hour${h > 1 ? "s" : ""}, `;
  if (m > 0) result += `${m} minute${m > 1 ? "s" : ""}, `;
  if (s > 0 || result === "") result += `${s} second${s > 1 ? "s" : ""}`;
  return result.endsWith(", ") ? result.slice(0, -2) : result;
}
function formatNumber(value) {
  if (value === void 0 || value === null) return "N/A";
  return value.toLocaleString();
}

const FACTORY_ADDRESS = zenovaAssetFactoryConfig.address[publicClient.chain.id];
const FACTORY_ABI = zenovaAssetFactoryConfig.abi;
const USDT_DECIMALS$1 = 6;
const DEFAULT_TOKEN_DECIMALS$1 = 18;
function isValidAddress$1(address) {
  try {
    getAddress(address);
    return true;
  } catch {
    return false;
  }
}
async function getZenovaAssetImplementation() {
  try {
    const data = await publicClient.readContract({
      address: FACTORY_ADDRESS,
      abi: FACTORY_ABI,
      functionName: "zenovaAssetImplementation"
    });
    return formatAddress(data);
  } catch (err) {
    const errorMessage = err instanceof BaseError ? err.shortMessage : err instanceof Error ? err.message : String(err);
    console.error("Error in getZenovaAssetImplementation:", errorMessage);
    return { error: `An unexpected error occurred: ${errorMessage}` };
  }
}
async function getAcceptedCurrencyFactory() {
  try {
    const data = await publicClient.readContract({
      address: FACTORY_ADDRESS,
      abi: FACTORY_ABI,
      functionName: "acceptedCurrency"
    });
    return formatAddress(data);
  } catch (err) {
    const errorMessage = err instanceof BaseError ? err.shortMessage : err instanceof Error ? err.message : String(err);
    console.error("Error in getAcceptedCurrencyFactory:", errorMessage);
    return { error: `An unexpected error occurred: ${errorMessage}` };
  }
}
async function getAllZenovaAssets() {
  try {
    const data = await publicClient.readContract({
      address: FACTORY_ADDRESS,
      abi: FACTORY_ABI,
      functionName: "getAllAssets"
    });
    return data.map((addr) => formatAddress(addr));
  } catch (err) {
    const errorMessage = err instanceof BaseError ? err.shortMessage : err instanceof Error ? err.message : String(err);
    console.error("Error in getAllZenovaAssets:", errorMessage);
    return { error: `An unexpected error occurred: ${errorMessage}` };
  }
}
async function getAssetsByCompany(companyWallet) {
  if (!isValidAddress$1(companyWallet)) return { error: "Invalid company wallet address provided." };
  try {
    const data = await publicClient.readContract({
      address: FACTORY_ADDRESS,
      abi: FACTORY_ABI,
      functionName: "getAssetsByCompany",
      args: [companyWallet]
    });
    return data.map((addr) => formatAddress(addr));
  } catch (err) {
    const errorMessage = err instanceof BaseError ? err.shortMessage : err instanceof Error ? err.message : String(err);
    console.error("Error in getAssetsByCompany:", errorMessage);
    return { error: `An unexpected error occurred: ${errorMessage}` };
  }
}
async function getSubmittedValuation(companyWallet) {
  if (!isValidAddress$1(companyWallet)) return { error: "Invalid company wallet address provided." };
  try {
    const result = await publicClient.readContract({
      address: FACTORY_ADDRESS,
      abi: FACTORY_ABI,
      functionName: "getSubmittedValuation",
      args: [companyWallet]
    });
    return {
      companyWallet: formatAddress(result.companyWallet),
      valuation: formatUsdtAmount(result.valuation),
      initialPricePerToken: formatUsdtAmount(result.initialPricePerToken),
      evaluatorAI: formatAddress(result.evaluatorAI),
      assessmentTimestamp: formatTimestamp(result.assessmentTimestamp),
      exists: result.exists
    };
  } catch (err) {
    const errorMessage = err instanceof BaseError ? err.shortMessage : err instanceof Error ? err.message : String(err);
    console.error("Error in getSubmittedValuation:", errorMessage);
    return { error: `An unexpected error occurred: ${errorMessage}` };
  }
}
async function getAssetFullDetails(assetAddress) {
  if (!isValidAddress$1(assetAddress)) return { error: "Invalid asset address provided." };
  try {
    const rawResult = await publicClient.readContract({
      address: FACTORY_ADDRESS,
      abi: FACTORY_ABI,
      functionName: "getAssetFullDetails",
      args: [assetAddress]
    });
    const priceDecimals = USDT_DECIMALS$1;
    const assetTokenDecimals = DEFAULT_TOKEN_DECIMALS$1;
    return {
      assetAddress: formatAddress(rawResult.assetAddress),
      companyDetails: {
        name: rawResult.companyDetails.name,
        symbol: rawResult.companyDetails.symbol,
        description: rawResult.companyDetails.description,
        website: rawResult.companyDetails.website,
        issuingCompanyWallet: formatAddress(rawResult.companyDetails.issuingCompanyWallet)
      },
      pricingDetails: {
        currentPricePerToken: formatUnits(rawResult.pricingDetails.currentPricePerToken, priceDecimals),
        buyFeeBPS: formatBpsRate(rawResult.pricingDetails.buyFeeBPS),
        sellFeeBPS: formatBpsRate(rawResult.pricingDetails.sellFeeBPS),
        marketCap: formatUnits(rawResult.pricingDetails.marketCap, priceDecimals),
        lastPriceUpdateTimestamp: formatTimestamp(rawResult.pricingDetails.lastPriceUpdateTimestamp),
        acceptedCurrency: formatAddress(rawResult.pricingDetails.acceptedCurrency)
      },
      currentValuation: formatUsdtAmount(rawResult.currentValuation),
      maxTokenSupply: formatUnits(rawResult.maxTokenSupply, assetTokenDecimals),
      currentTotalSupply: formatUnits(rawResult.currentTotalSupply, assetTokenDecimals),
      isTradingActive: rawResult.isTradingActive,
      admin: formatAddress(rawResult.admin),
      priceAI: formatAddress(rawResult.priceAI),
      liquidityManager: formatAddress(rawResult.liquidityManager)
    };
  } catch (err) {
    const errorMessage = err instanceof BaseError ? err.shortMessage : err instanceof Error ? err.message : String(err);
    console.error("Error in getAssetFullDetails:", errorMessage);
    return { error: `An unexpected error occurred: ${errorMessage}` };
  }
}
async function getMultipleAssetFullDetails(assetAddresses) {
  if (!assetAddresses || assetAddresses.length === 0 || assetAddresses.some((addr) => !isValidAddress$1(addr))) {
    return { error: "Invalid or empty asset addresses array provided." };
  }
  try {
    const rawResults = await publicClient.readContract({
      address: FACTORY_ADDRESS,
      abi: FACTORY_ABI,
      functionName: "getMultipleAssetFullDetails",
      args: [assetAddresses.map((a) => a)]
    });
    return rawResults.map((rawResult) => {
      const priceDecimals = USDT_DECIMALS$1;
      const assetTokenDecimals = DEFAULT_TOKEN_DECIMALS$1;
      return {
        assetAddress: formatAddress(rawResult.assetAddress),
        companyDetails: {
          name: rawResult.companyDetails.name,
          symbol: rawResult.companyDetails.symbol,
          description: rawResult.companyDetails.description,
          website: rawResult.companyDetails.website,
          issuingCompanyWallet: formatAddress(rawResult.companyDetails.issuingCompanyWallet)
        },
        pricingDetails: {
          currentPricePerToken: formatUnits(rawResult.pricingDetails.currentPricePerToken, priceDecimals),
          buyFeeBPS: formatBpsRate(rawResult.pricingDetails.buyFeeBPS),
          sellFeeBPS: formatBpsRate(rawResult.pricingDetails.sellFeeBPS),
          marketCap: formatUnits(rawResult.pricingDetails.marketCap, priceDecimals),
          lastPriceUpdateTimestamp: formatTimestamp(rawResult.pricingDetails.lastPriceUpdateTimestamp),
          acceptedCurrency: formatAddress(rawResult.pricingDetails.acceptedCurrency)
        },
        currentValuation: formatUsdtAmount(rawResult.currentValuation),
        maxTokenSupply: formatUnits(rawResult.maxTokenSupply, assetTokenDecimals),
        currentTotalSupply: formatUnits(rawResult.currentTotalSupply, assetTokenDecimals),
        isTradingActive: rawResult.isTradingActive,
        admin: formatAddress(rawResult.admin),
        priceAI: formatAddress(rawResult.priceAI),
        liquidityManager: formatAddress(rawResult.liquidityManager)
      };
    });
  } catch (err) {
    const errorMessage = err instanceof BaseError ? err.shortMessage : err instanceof Error ? err.message : String(err);
    console.error("Error in getMultipleAssetFullDetails:", errorMessage);
    return { error: `An unexpected error occurred: ${errorMessage}` };
  }
}
async function totalAssets() {
  try {
    const data = await publicClient.readContract({
      address: FACTORY_ADDRESS,
      abi: FACTORY_ABI,
      functionName: "totalAssets"
    });
    return formatNumber(data);
  } catch (err) {
    const errorMessage = err instanceof BaseError ? err.shortMessage : err instanceof Error ? err.message : String(err);
    console.error("Error in totalAssets:", errorMessage);
    return { error: `An unexpected error occurred: ${errorMessage}` };
  }
}
async function getCompanyComprehensiveDetails(companyWallet) {
  if (!isValidAddress$1(companyWallet)) return { error: "Invalid company wallet address provided." };
  try {
    const rawResult = await publicClient.readContract({
      address: FACTORY_ADDRESS,
      abi: FACTORY_ABI,
      functionName: "getCompanyComprehensiveDetails",
      args: [companyWallet]
    });
    let formattedPendingValuation = void 0;
    if (rawResult.pendingValuation?.exists) {
      formattedPendingValuation = {
        companyWallet: formatAddress(rawResult.pendingValuation.companyWallet),
        valuation: formatUsdtAmount(rawResult.pendingValuation.valuation),
        initialPricePerToken: formatUsdtAmount(rawResult.pendingValuation.initialPricePerToken),
        evaluatorAI: formatAddress(rawResult.pendingValuation.evaluatorAI),
        assessmentTimestamp: formatTimestamp(rawResult.pendingValuation.assessmentTimestamp),
        exists: rawResult.pendingValuation.exists
      };
    }
    return {
      companyWallet: formatAddress(rawResult.companyWallet),
      pendingValuation: formattedPendingValuation,
      assetAddresses: rawResult.assetAddresses.map((addr) => formatAddress(addr)),
      assetDetails: rawResult.assetDetails.map((ad) => {
        const priceDecimals = USDT_DECIMALS$1;
        const assetTokenDecimals = DEFAULT_TOKEN_DECIMALS$1;
        return {
          assetAddress: formatAddress(ad.assetAddress),
          companyDetails: {
            name: ad.companyDetails.name,
            symbol: ad.companyDetails.symbol,
            description: ad.companyDetails.description,
            website: ad.companyDetails.website,
            issuingCompanyWallet: formatAddress(ad.companyDetails.issuingCompanyWallet)
          },
          pricingDetails: {
            currentPricePerToken: formatUnits(ad.pricingDetails.currentPricePerToken, priceDecimals),
            buyFeeBPS: formatBpsRate(ad.pricingDetails.buyFeeBPS),
            sellFeeBPS: formatBpsRate(ad.pricingDetails.sellFeeBPS),
            marketCap: formatUnits(ad.pricingDetails.marketCap, priceDecimals),
            lastPriceUpdateTimestamp: formatTimestamp(ad.pricingDetails.lastPriceUpdateTimestamp),
            acceptedCurrency: formatAddress(ad.pricingDetails.acceptedCurrency)
          },
          currentValuation: formatUsdtAmount(ad.currentValuation),
          maxTokenSupply: formatUnits(ad.maxTokenSupply, assetTokenDecimals),
          currentTotalSupply: formatUnits(ad.currentTotalSupply, assetTokenDecimals),
          isTradingActive: ad.isTradingActive,
          admin: formatAddress(ad.admin),
          priceAI: formatAddress(ad.priceAI),
          liquidityManager: formatAddress(ad.liquidityManager)
        };
      }),
      totalMarketCap: formatUsdtAmount(rawResult.totalMarketCap),
      totalTokensIssued: formatDefaultTokenAmount(rawResult.totalTokensIssued),
      totalTradingVolume: formatUsdtAmount(rawResult.totalTradingVolume),
      hasActiveAssets: rawResult.hasActiveAssets
    };
  } catch (err) {
    const errorMessage = err instanceof BaseError ? err.shortMessage : err instanceof Error ? err.message : String(err);
    console.error("Error in getCompanyComprehensiveDetails:", errorMessage);
    return { error: `An unexpected error occurred: ${errorMessage}` };
  }
}
async function getPlatformSnapshot() {
  try {
    const rawResult = await publicClient.readContract({
      address: FACTORY_ADDRESS,
      abi: FACTORY_ABI,
      functionName: "getPlatformSnapshot"
    });
    return {
      totalAssetsCreated: formatNumber(rawResult.totalAssetsCreated),
      totalCompaniesOnboarded: formatNumber(rawResult.totalCompaniesOnboarded),
      totalActiveAssets: formatNumber(rawResult.totalActiveAssets),
      totalMarketCapitalization: formatUsdtAmount(rawResult.totalMarketCapitalization),
      totalTradingVolume: formatUsdtAmount(rawResult.totalTradingVolume),
      totalFeesCollected: formatUsdtAmount(rawResult.totalFeesCollected),
      averageAssetMarketCap: formatUsdtAmount(rawResult.averageAssetMarketCap),
      totalTokensInCirculation: formatDefaultTokenAmount(rawResult.totalTokensInCirculation),
      totalMaxTokenSupply: formatDefaultTokenAmount(rawResult.totalMaxTokenSupply),
      largestAssetByMarketCap: formatAddress(rawResult.largestAssetByMarketCap),
      mostActiveAssetByVolume: formatAddress(rawResult.mostActiveAssetByVolume)
    };
  } catch (err) {
    const errorMessage = err instanceof BaseError ? err.shortMessage : err instanceof Error ? err.message : String(err);
    console.error("Error in getPlatformSnapshot:", errorMessage);
    return { error: `An unexpected error occurred: ${errorMessage}` };
  }
}
async function getUserPortfolioDetails(userAddress) {
  if (!isValidAddress$1(userAddress)) return { error: "Invalid user address provided." };
  try {
    const rawResult = await publicClient.readContract({
      address: FACTORY_ADDRESS,
      abi: FACTORY_ABI,
      functionName: "getUserPortfolioDetails",
      args: [userAddress]
    });
    return {
      userAddress: formatAddress(rawResult.userAddress),
      totalPortfolioValue: formatUsdtAmount(rawResult.totalPortfolioValue),
      totalInvestedAmount: formatUsdtAmount(rawResult.totalInvestedAmount),
      totalRealizedPnL: formatUsdtAmount(rawResult.totalRealizedPnL),
      totalUnrealizedPnL: formatUsdtAmount(rawResult.totalUnrealizedPnL),
      totalFeesPaid: formatUsdtAmount(rawResult.totalFeesPaid),
      numberOfAssetsHeld: formatNumber(rawResult.numberOfAssetsHeld),
      heldAssetAddresses: rawResult.heldAssetAddresses.map((addr) => formatAddress(addr)),
      assetHoldings: rawResult.assetHoldings.map((holding) => {
        return {
          tokenBalance: formatDefaultTokenAmount(holding.tokenBalance),
          tokenBalanceValue: formatUsdtAmount(holding.tokenBalanceValue),
          percentageOfSupplyBPS: formatBpsRate(holding.percentageOfSupply),
          totalPurchaseValue: formatUsdtAmount(holding.totalPurchaseValue),
          totalSaleValue: formatUsdtAmount(holding.totalSaleValue),
          totalFeesPaid: formatUsdtAmount(holding.totalFeesPaid),
          lastTradeTimestamp: formatTimestamp(holding.lastTradeTimestamp),
          hasTraded: holding.hasTraded,
          realizedPnL: formatUsdtAmount(holding.realizedPnL),
          unrealizedPnL: formatUsdtAmount(holding.unrealizedPnL)
        };
      }),
      isActiveTrader: rawResult.isActiveTrader
    };
  } catch (err) {
    const errorMessage = err instanceof BaseError ? err.shortMessage : err instanceof Error ? err.message : String(err);
    console.error("Error in getUserPortfolioDetails:", errorMessage);
    return { error: `An unexpected error occurred: ${errorMessage}` };
  }
}
async function getMultipleAssetAnalytics(assetAddresses) {
  if (!assetAddresses || assetAddresses.length === 0 || assetAddresses.some((addr) => !isValidAddress$1(addr))) {
    return { error: "Invalid or empty asset addresses array provided." };
  }
  try {
    const rawTuple = await publicClient.readContract({
      address: FACTORY_ADDRESS,
      abi: FACTORY_ABI,
      functionName: "getMultipleAssetAnalytics",
      args: [assetAddresses.map((a) => a)]
    });
    const formattedAssetDetails = rawTuple[0].map((ad) => {
      const priceDecimals = USDT_DECIMALS$1;
      const assetTokenDecimals = DEFAULT_TOKEN_DECIMALS$1;
      return {
        assetAddress: formatAddress(ad.assetAddress),
        companyDetails: {
          name: ad.companyDetails.name,
          symbol: ad.companyDetails.symbol,
          description: ad.companyDetails.description,
          website: ad.companyDetails.website,
          issuingCompanyWallet: formatAddress(ad.companyDetails.issuingCompanyWallet)
        },
        pricingDetails: {
          currentPricePerToken: formatUnits(ad.pricingDetails.currentPricePerToken, priceDecimals),
          buyFeeBPS: formatBpsRate(ad.pricingDetails.buyFeeBPS),
          sellFeeBPS: formatBpsRate(ad.pricingDetails.sellFeeBPS),
          marketCap: formatUnits(ad.pricingDetails.marketCap, priceDecimals),
          lastPriceUpdateTimestamp: formatTimestamp(ad.pricingDetails.lastPriceUpdateTimestamp),
          acceptedCurrency: formatAddress(ad.pricingDetails.acceptedCurrency)
        },
        currentValuation: formatUsdtAmount(ad.currentValuation),
        maxTokenSupply: formatUnits(ad.maxTokenSupply, assetTokenDecimals),
        currentTotalSupply: formatUnits(ad.currentTotalSupply, assetTokenDecimals),
        isTradingActive: ad.isTradingActive,
        admin: formatAddress(ad.admin),
        priceAI: formatAddress(ad.priceAI),
        liquidityManager: formatAddress(ad.liquidityManager)
      };
    });
    const formattedTradingMetricsList = rawTuple[1].map((tm) => {
      return {
        totalVolumeTraded: formatUsdtAmount(tm.totalVolumeTraded),
        totalTokensTraded: formatDefaultTokenAmount(tm.totalTokensTraded),
        totalBuyTransactions: formatNumber(tm.totalBuyTransactions),
        totalSellTransactions: formatNumber(tm.totalSellTransactions),
        totalFeesCollected: formatUsdtAmount(tm.totalFeesCollected),
        averageTradeSize: formatUsdtAmount(tm.averageTradeSize),
        lastTradeTimestamp: formatTimestamp(tm.lastTradeTimestamp),
        priceVolatility: formatBpsRate(tm.priceVolatility)
      };
    });
    const formattedMarketAnalysisList = rawTuple[2].map((ma) => {
      return {
        currentMarketCap: formatUsdtAmount(ma.currentMarketCap),
        fullyDilutedMarketCap: formatUsdtAmount(ma.fullyDilutedMarketCap),
        circulationRatioBPS: formatBpsRate(ma.circulationRatio),
        liquidityRatioBPS: formatBpsRate(ma.liquidityRatio),
        priceToValuationRatioBPS: formatBpsRate(ma.priceToValuationRatio),
        isOvervalued: ma.isOvervalued,
        isUndervalued: ma.isUndervalued,
        timeSinceLastPriceUpdate: formatDuration(ma.timeSinceLastPriceUpdate)
      };
    });
    return [formattedAssetDetails, formattedTradingMetricsList, formattedMarketAnalysisList];
  } catch (err) {
    const errorMessage = err instanceof BaseError ? err.shortMessage : err instanceof Error ? err.message : String(err);
    console.error("Error in getMultipleAssetAnalytics:", errorMessage);
    return { error: `An unexpected error occurred: ${errorMessage}` };
  }
}
async function submitCompanyValuationFactory(companyWallet, valuation, initialPricePerToken) {
  if (!isValidAddress$1(companyWallet)) return { error: "Invalid company wallet address provided." };
  if (parseFloat(valuation) <= 0) return { error: "Valuation must be positive." };
  if (parseFloat(initialPricePerToken) <= 0) return { error: "Initial price per token must be positive." };
  try {
    const valuationWei = parseUnits(valuation, USDT_DECIMALS$1);
    const initialPricePerTokenWei = parseUnits(initialPricePerToken, USDT_DECIMALS$1);
    const hash = await aiWalletClient.writeContract({
      address: FACTORY_ADDRESS,
      abi: FACTORY_ABI,
      functionName: "submitCompanyValuation",
      args: [companyWallet, valuationWei, initialPricePerTokenWei],
      account: aiWalletClient.account
    });
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    if (receipt.status === "success") {
      return { success: true, transactionHash: hash, message: "Company valuation submitted successfully." };
    } else {
      return { error: `Company valuation submission failed. Status: ${receipt.status}` };
    }
  } catch (err) {
    const errorMessage = err instanceof BaseError ? err.shortMessage : err instanceof Error ? err.message : String(err);
    console.error("Error in submitCompanyValuationFactory:", errorMessage);
    return { error: `An unexpected error occurred: ${errorMessage}` };
  }
}
async function createZenovaAssetFactory(companyWallet, companyInfo) {
  if (!isValidAddress$1(companyWallet)) return { error: "Invalid company wallet address for valuation lookup." };
  if (!isValidAddress$1(companyInfo.issuingCompanyWallet)) return { error: "Invalid issuing company wallet in company info." };
  if (companyInfo.issuingCompanyWallet.toLowerCase() !== companyWallet.toLowerCase()) {
    return { error: "Issuing company wallet in company info must match the company wallet used for valuation." };
  }
  if (!companyInfo.name || !companyInfo.symbol) return { error: "Company name and symbol are required." };
  try {
    const companyInfoArg = {
      name: companyInfo.name,
      symbol: companyInfo.symbol,
      description: companyInfo.description ?? "",
      website: companyInfo.website ?? "",
      issuingCompanyWallet: companyInfo.issuingCompanyWallet
    };
    const hash = await aiWalletClient.writeContract({
      address: FACTORY_ADDRESS,
      abi: FACTORY_ABI,
      functionName: "createZenovaAsset",
      args: [companyWallet, companyInfoArg],
      account: aiWalletClient.account
    });
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    if (receipt.status === "success") {
      let newAssetAddress = void 0;
      const eventAbiItem = getAbiItem({ abi: FACTORY_ABI, name: "ZenovaAssetCreated" });
      if (!eventAbiItem) {
        console.warn("ZenovaAssetCreated event ABI item not found. Cannot extract new asset address from logs.");
        return {
          success: true,
          transactionHash: hash,
          message: "Zenova Asset creation transaction succeeded, but new asset address could not be determined from logs (event ABI missing)."
        };
      }
      for (const log of receipt.logs) {
        try {
          const decodedEvent = decodeEventLog({
            abi: [eventAbiItem],
            // decodeEventLog expects an array of ABI items
            data: log.data,
            topics: log.topics
          });
          if (decodedEvent.eventName === "ZenovaAssetCreated") {
            newAssetAddress = formatAddress(decodedEvent.args.newAssetAddress);
            break;
          }
        } catch (decodeError) {
        }
      }
      if (newAssetAddress) {
        return {
          success: true,
          transactionHash: hash,
          assetAddress: newAssetAddress,
          message: `Zenova Asset created successfully at ${newAssetAddress}.`
        };
      } else {
        return {
          success: true,
          transactionHash: hash,
          message: "Zenova Asset creation transaction succeeded, but new asset address could not be determined from logs."
        };
      }
    } else {
      return { error: `Zenova Asset creation failed. Status: ${receipt.status}` };
    }
  } catch (err) {
    const errorMessage = err instanceof BaseError ? err.shortMessage : err instanceof Error ? err.message : String(err);
    console.error("Error in createZenovaAssetFactory:", errorMessage);
    if (errorMessage.includes("ValuationNotFound")) {
      return { error: "Valuation for the company wallet not found or already used. Please submit valuation first." };
    }
    if (errorMessage.includes("NotAuthorized")) {
      return { error: "The AI agent attempting to create the asset is not the one that submitted the valuation." };
    }
    return { error: `An unexpected error occurred during asset creation: ${errorMessage}` };
  }
}

const getZenovaAssetImplementationTool = createTool({
  id: "zenovaFactory_getAssetImplementation",
  description: "Gets the address of the ZenovaAsset implementation contract used by the factory.",
  inputSchema: z.object({}),
  outputSchema: z.union([EthereumAddressSchema, ToolErrorResponseSchema]),
  execute: async () => {
    return await getZenovaAssetImplementation();
  }
});
const getAcceptedCurrencyFactoryTool = createTool({
  id: "zenovaFactory_getAcceptedCurrency",
  description: "Gets the address of the accepted currency (e.g., USDT) used by the factory and assets.",
  inputSchema: z.object({}),
  outputSchema: z.union([EthereumAddressSchema, ToolErrorResponseSchema]),
  execute: async () => {
    return await getAcceptedCurrencyFactory();
  }
});
const getTotalAssetsFactoryTool = createTool({
  id: "zenovaFactory_getTotalAssets",
  description: "Gets the total number of ZenovaAsset contracts created by the factory.",
  inputSchema: z.object({}),
  outputSchema: z.union([FactoryTotalAssetsOutputSchema, ToolErrorResponseSchema]),
  execute: async () => {
    return await totalAssets();
  }
});
const getAllAssetsFactoryTool = createTool({
  id: "zenovaFactory_getAllAssets",
  description: "Gets a list of all ZenovaAsset contract addresses created by the factory.",
  inputSchema: z.object({}),
  outputSchema: z.union([FactoryAllAssetsOutputSchema, ToolErrorResponseSchema]),
  execute: async () => {
    return await getAllZenovaAssets();
  }
});
const getAssetsByCompanyFactoryTool = createTool({
  id: "zenovaFactory_getAssetsByCompany",
  description: "Gets a list of ZenovaAsset contract addresses for a specific company wallet, via the factory.",
  inputSchema: GetAssetsByCompanyInputSchema,
  outputSchema: z.union([FactoryAssetsByCompanyOutputSchema, ToolErrorResponseSchema]),
  execute: async ({ context }) => {
    return await getAssetsByCompany(context.companyWallet);
  }
});
const getSubmittedValuationFactoryTool = createTool({
  id: "zenovaFactory_getSubmittedValuation",
  description: "Gets the submitted initial valuation details for a company from the factory, if one exists.",
  inputSchema: GetSubmittedValuationInputSchema,
  outputSchema: z.union([CompanyInitialValuationSchema, ToolErrorResponseSchema]),
  // Assuming FormattedCompanyInitialValuation aligns with CompanyInitialValuationSchema
  execute: async ({ context }) => {
    return await getSubmittedValuation(context.companyWallet);
  }
});
const getAssetFullDetailsFactoryTool = createTool({
  id: "zenovaFactory_getAssetFullDetails",
  description: "Gets full details for a single ZenovaAsset, called via the factory.",
  inputSchema: GetAssetFullDetailsInputSchema,
  outputSchema: z.union([ZenovaAssetFullDetailsSchema, ToolErrorResponseSchema]),
  // Assuming FormattedFullAssetDetails aligns with ZenovaAssetFullDetailsSchema
  execute: async ({ context }) => {
    return await getAssetFullDetails(context.assetAddress);
  }
});
const getMultipleAssetFullDetailsFactoryTool = createTool({
  id: "zenovaFactory_getMultipleAssetFullDetails",
  description: "Gets full details for multiple ZenovaAsset contracts, called via the factory.",
  inputSchema: GetMultipleAssetFullDetailsInputSchema,
  outputSchema: z.union([z.array(ZenovaAssetFullDetailsSchema), ToolErrorResponseSchema]),
  // Assuming FormattedFullAssetDetails aligns
  execute: async ({ context }) => {
    return await getMultipleAssetFullDetails(context.assetAddresses);
  }
});
const getCompanyComprehensiveDetailsTool = createTool({
  id: "zenovaFactory_getCompanyComprehensiveDetails",
  description: "Gets comprehensive details for a company, including all its assets and aggregated financial data, via the factory.",
  inputSchema: GetAssetsByCompanyInputSchema,
  // Reuses schema { companyWallet: EthereumAddressSchema }
  outputSchema: z.union([CompanyComprehensiveDetailsSchema, ToolErrorResponseSchema]),
  execute: async ({ context }) => {
    return await getCompanyComprehensiveDetails(context.companyWallet);
  }
});
const getPlatformSnapshotTool = createTool({
  id: "zenovaFactory_getPlatformSnapshot",
  description: "Gets a snapshot of key platform-wide metrics from the factory (total assets, market cap, volume, etc.).",
  inputSchema: z.object({}),
  outputSchema: z.union([PlatformSnapshotSchema, ToolErrorResponseSchema]),
  execute: async () => {
    return await getPlatformSnapshot();
  }
});
const getUserPortfolioDetailsTool = createTool({
  id: "zenovaFactory_getUserPortfolioDetails",
  description: "Gets detailed portfolio information for a specific user across all Zenova assets, via the factory.",
  inputSchema: FactoryUserAddressInputSchema,
  // Uses { userAddress: EthereumAddressSchema }
  outputSchema: z.union([UserPortfolioDetailsSchema, ToolErrorResponseSchema]),
  execute: async ({ context }) => {
    return await getUserPortfolioDetails(context.userAddress);
  }
});
const getMultipleAssetAnalyticsTool = createTool({
  id: "zenovaFactory_getMultipleAssetAnalytics",
  description: "Gets a tuple containing arrays of full details, trading metrics, and market analysis for multiple Zenova assets, via the factory.",
  inputSchema: GetMultipleAssetFullDetailsInputSchema,
  // Reuses schema { assetAddresses: z.array(EthereumAddressSchema) }
  outputSchema: z.union([MultipleAssetAnalyticsSchema, ToolErrorResponseSchema]),
  execute: async ({ context }) => {
    return await getMultipleAssetAnalytics(context.assetAddresses);
  }
});
const submitCompanyValuationFactoryTool = createTool({
  id: "zenovaFactory_submitCompanyValuation",
  description: "Allows an AI to submit a company's valuation and suggested initial token price to the factory.",
  inputSchema: SubmitCompanyValuationInputSchema,
  outputSchema: z.union([TransactionSuccessResponseSchema, ToolErrorResponseSchema]),
  execute: async ({ context }) => {
    return await submitCompanyValuationFactory(
      context.companyWallet,
      context.valuation,
      context.initialPricePerToken
    );
  }
});
const createZenovaAssetFactoryTool = createTool({
  id: "zenovaFactory_createZenovaAsset",
  description: "Creates a new ZenovaAsset (tokenized shares) for a company with a submitted valuation, via the factory. Called by AI.",
  inputSchema: CreateZenovaAssetInputSchema,
  outputSchema: z.union([AssetCreationSuccessResponseSchema, ToolErrorResponseSchema]),
  execute: async ({ context }) => {
    return await createZenovaAssetFactory(context.companyWallet, context.companyInfo);
  }
});

const ZENOVA_ASSET_ABI = zenovaAssetConfig.abi;
const USDT_DECIMALS = 6;
const DEFAULT_TOKEN_DECIMALS = 18;
function isValidAddress(address) {
  try {
    getAddress(address);
    return true;
  } catch {
    return false;
  }
}
async function getAssetCompanyName(assetAddress) {
  if (!isValidAddress(assetAddress)) return { error: "Invalid asset address provided." };
  try {
    const data = await publicClient.readContract({
      address: assetAddress,
      abi: ZENOVA_ASSET_ABI,
      functionName: "name"
    });
    return data;
  } catch (err) {
    const errorMessage = err instanceof BaseError ? err.shortMessage : err instanceof Error ? err.message : String(err);
    console.error(`Error in getAssetCompanyName for ${assetAddress}: ${errorMessage}`);
    return { error: `An unexpected error occurred: ${errorMessage}` };
  }
}
async function getAssetSymbol(assetAddress) {
  if (!isValidAddress(assetAddress)) return { error: "Invalid asset address provided." };
  try {
    const data = await publicClient.readContract({
      address: assetAddress,
      abi: ZENOVA_ASSET_ABI,
      functionName: "symbol"
    });
    return data;
  } catch (err) {
    const errorMessage = err instanceof BaseError ? err.shortMessage : err instanceof Error ? err.message : String(err);
    console.error(`Error in getAssetSymbol for ${assetAddress}: ${errorMessage}`);
    return { error: `An unexpected error occurred: ${errorMessage}` };
  }
}
async function getAssetDecimals(assetAddress) {
  if (!isValidAddress(assetAddress)) return { error: "Invalid asset address provided." };
  try {
    const data = await publicClient.readContract({
      address: assetAddress,
      abi: ZENOVA_ASSET_ABI,
      functionName: "decimals"
    });
    return formatNumber(data);
  } catch (err) {
    const errorMessage = err instanceof BaseError ? err.shortMessage : err instanceof Error ? err.message : String(err);
    console.error(`Error in getAssetDecimals for ${assetAddress}: ${errorMessage}`);
    return { error: `An unexpected error occurred: ${errorMessage}` };
  }
}
async function getAssetTotalSupply(assetAddress) {
  if (!isValidAddress(assetAddress)) return { error: "Invalid asset address provided." };
  try {
    const data = await publicClient.readContract({
      address: assetAddress,
      abi: ZENOVA_ASSET_ABI,
      functionName: "totalSupply"
    });
    return formatDefaultTokenAmount(data);
  } catch (err) {
    const errorMessage = err instanceof BaseError ? err.shortMessage : err instanceof Error ? err.message : String(err);
    console.error(`Error in getAssetTotalSupply for ${assetAddress}: ${errorMessage}`);
    return { error: `An unexpected error occurred: ${errorMessage}` };
  }
}
async function getAssetBalanceOf(assetAddress, account) {
  if (!isValidAddress(assetAddress)) return { error: "Invalid asset address provided." };
  if (!isValidAddress(account)) return { error: "Invalid account address provided." };
  try {
    const data = await publicClient.readContract({
      address: assetAddress,
      abi: ZENOVA_ASSET_ABI,
      functionName: "balanceOf",
      args: [account]
    });
    return formatDefaultTokenAmount(data);
  } catch (err) {
    const errorMessage = err instanceof BaseError ? err.shortMessage : err instanceof Error ? err.message : String(err);
    console.error(`Error in getAssetBalanceOf for ${assetAddress}, account ${account}: ${errorMessage}`);
    return { error: `An unexpected error occurred: ${errorMessage}` };
  }
}
async function getAssetCompanyInfo(assetAddress) {
  if (!isValidAddress(assetAddress)) return { error: "Invalid asset address provided." };
  try {
    const rawResult = await publicClient.readContract({
      address: assetAddress,
      abi: ZENOVA_ASSET_ABI,
      functionName: "getCompanyInfo"
    });
    return {
      name: rawResult.name,
      symbol: rawResult.symbol,
      description: rawResult.description,
      website: rawResult.website,
      issuingCompanyWallet: formatAddress(rawResult.issuingCompanyWallet)
    };
  } catch (err) {
    const errorMessage = err instanceof BaseError ? err.shortMessage : err instanceof Error ? err.message : String(err);
    console.error(`Error in getAssetCompanyInfo for ${assetAddress}: ${errorMessage}`);
    return { error: `An unexpected error occurred: ${errorMessage}` };
  }
}
async function getAssetPricingDetailsInfo(assetAddress) {
  if (!isValidAddress(assetAddress)) return { error: "Invalid asset address provided." };
  try {
    const rawResult = await publicClient.readContract({
      address: assetAddress,
      abi: ZENOVA_ASSET_ABI,
      functionName: "getAssetPricingDetails"
    });
    return {
      currentPricePerToken: formatUnits(rawResult.currentPricePerToken, USDT_DECIMALS),
      buyFeeBPS: formatBpsRate(rawResult.buyFeeBPS),
      sellFeeBPS: formatBpsRate(rawResult.sellFeeBPS),
      marketCap: formatUnits(rawResult.marketCap, USDT_DECIMALS),
      lastPriceUpdateTimestamp: formatTimestamp(rawResult.lastPriceUpdateTimestamp),
      acceptedCurrency: formatAddress(rawResult.acceptedCurrency)
    };
  } catch (err) {
    const errorMessage = err instanceof BaseError ? err.shortMessage : err instanceof Error ? err.message : String(err);
    console.error(`Error in getAssetPricingDetailsInfo for ${assetAddress}: ${errorMessage}`);
    return { error: `An unexpected error occurred: ${errorMessage}` };
  }
}
async function getAssetFullDetailsInfo(assetAddress) {
  if (!isValidAddress(assetAddress)) return { error: "Invalid asset address provided." };
  try {
    const rawResult = await publicClient.readContract({
      address: assetAddress,
      abi: ZENOVA_ASSET_ABI,
      functionName: "getFullAssetDetails"
    });
    return {
      assetAddress: formatAddress(rawResult.assetAddress),
      // Should be the input assetAddress
      companyDetails: {
        name: rawResult.companyDetails.name,
        symbol: rawResult.companyDetails.symbol,
        description: rawResult.companyDetails.description,
        website: rawResult.companyDetails.website,
        issuingCompanyWallet: formatAddress(rawResult.companyDetails.issuingCompanyWallet)
      },
      pricingDetails: {
        currentPricePerToken: formatUnits(rawResult.pricingDetails.currentPricePerToken, USDT_DECIMALS),
        buyFeeBPS: formatBpsRate(rawResult.pricingDetails.buyFeeBPS),
        sellFeeBPS: formatBpsRate(rawResult.pricingDetails.sellFeeBPS),
        marketCap: formatUnits(rawResult.pricingDetails.marketCap, USDT_DECIMALS),
        lastPriceUpdateTimestamp: formatTimestamp(rawResult.pricingDetails.lastPriceUpdateTimestamp),
        acceptedCurrency: formatAddress(rawResult.pricingDetails.acceptedCurrency)
      },
      currentValuation: formatUsdtAmount(rawResult.currentValuation),
      maxTokenSupply: formatDefaultTokenAmount(rawResult.maxTokenSupply),
      currentTotalSupply: formatDefaultTokenAmount(rawResult.currentTotalSupply),
      isTradingActive: rawResult.isTradingActive,
      admin: formatAddress(rawResult.admin),
      priceAI: formatAddress(rawResult.priceAI),
      liquidityManager: formatAddress(rawResult.liquidityManager)
    };
  } catch (err) {
    const errorMessage = err instanceof BaseError ? err.shortMessage : err instanceof Error ? err.message : String(err);
    console.error(`Error in getAssetFullDetailsInfo for ${assetAddress}: ${errorMessage}`);
    return { error: `An unexpected error occurred: ${errorMessage}` };
  }
}
async function getAssetCurrentValuation(assetAddress) {
  if (!isValidAddress(assetAddress)) return { error: "Invalid asset address provided." };
  try {
    const data = await publicClient.readContract({
      address: assetAddress,
      abi: ZENOVA_ASSET_ABI,
      functionName: "currentValuation"
    });
    return formatUsdtAmount(data);
  } catch (err) {
    const errorMessage = err instanceof BaseError ? err.shortMessage : err instanceof Error ? err.message : String(err);
    console.error(`Error in getAssetCurrentValuation for ${assetAddress}: ${errorMessage}`);
    return { error: `An unexpected error occurred: ${errorMessage}` };
  }
}
async function getAssetMaxTokenSupply(assetAddress) {
  if (!isValidAddress(assetAddress)) return { error: "Invalid asset address provided." };
  try {
    const data = await publicClient.readContract({
      address: assetAddress,
      abi: ZENOVA_ASSET_ABI,
      functionName: "maxTokenSupply"
    });
    return formatDefaultTokenAmount(data);
  } catch (err) {
    const errorMessage = err instanceof BaseError ? err.shortMessage : err instanceof Error ? err.message : String(err);
    console.error(`Error in getAssetMaxTokenSupply for ${assetAddress}: ${errorMessage}`);
    return { error: `An unexpected error occurred: ${errorMessage}` };
  }
}
async function getAssetIsTradingActive(assetAddress) {
  if (!isValidAddress(assetAddress)) return { error: "Invalid asset address provided." };
  try {
    const data = await publicClient.readContract({
      address: assetAddress,
      abi: ZENOVA_ASSET_ABI,
      functionName: "isTradingActive"
      // Or "tradingActive"
    });
    return data;
  } catch (err) {
    const errorMessage = err instanceof BaseError ? err.shortMessage : err instanceof Error ? err.message : String(err);
    console.error(`Error in getAssetIsTradingActive for ${assetAddress}: ${errorMessage}`);
    return { error: `An unexpected error occurred: ${errorMessage}` };
  }
}
async function getAssetCollectedFees(assetAddress) {
  if (!isValidAddress(assetAddress)) return { error: "Invalid asset address provided." };
  try {
    const data = await publicClient.readContract({
      address: assetAddress,
      abi: ZENOVA_ASSET_ABI,
      functionName: "getCollectedFees"
      // Or "collectedFees"
    });
    return formatUsdtAmount(data);
  } catch (err) {
    const errorMessage = err instanceof BaseError ? err.shortMessage : err instanceof Error ? err.message : String(err);
    console.error(`Error in getAssetCollectedFees for ${assetAddress}: ${errorMessage}`);
    return { error: `An unexpected error occurred: ${errorMessage}` };
  }
}
async function getAssetBuyQuote(assetAddress, tokenAmountToBuy) {
  if (!isValidAddress(assetAddress)) return { error: "Invalid asset address provided." };
  if (parseFloat(tokenAmountToBuy) <= 0) return { error: "Token amount to buy must be positive." };
  try {
    const amountWei = parseUnits(tokenAmountToBuy, DEFAULT_TOKEN_DECIMALS);
    const result = await publicClient.readContract({
      address: assetAddress,
      abi: ZENOVA_ASSET_ABI,
      functionName: "getBuyQuote",
      args: [amountWei]
    });
    return {
      totalCost: formatUsdtAmount(result[0]),
      fee: formatUsdtAmount(result[1])
    };
  } catch (err) {
    const errorMessage = err instanceof BaseError ? err.shortMessage : err instanceof Error ? err.message : String(err);
    console.error(`Error in getAssetBuyQuote for ${assetAddress}: ${errorMessage}`);
    return { error: `An unexpected error occurred: ${errorMessage}` };
  }
}
async function getAssetSellQuote(assetAddress, tokenAmountToSell) {
  if (!isValidAddress(assetAddress)) return { error: "Invalid asset address provided." };
  if (parseFloat(tokenAmountToSell) <= 0) return { error: "Token amount to sell must be positive." };
  try {
    const amountWei = parseUnits(tokenAmountToSell, DEFAULT_TOKEN_DECIMALS);
    const result = await publicClient.readContract({
      address: assetAddress,
      abi: ZENOVA_ASSET_ABI,
      functionName: "getSellQuote",
      args: [amountWei]
    });
    return {
      proceeds: formatUsdtAmount(result[0]),
      fee: formatUsdtAmount(result[1])
    };
  } catch (err) {
    const errorMessage = err instanceof BaseError ? err.shortMessage : err instanceof Error ? err.message : String(err);
    console.error(`Error in getAssetSellQuote for ${assetAddress}: ${errorMessage}`);
    return { error: `An unexpected error occurred: ${errorMessage}` };
  }
}
async function getAssetTradingMetrics(assetAddress) {
  if (!isValidAddress(assetAddress)) return { error: "Invalid asset address provided." };
  try {
    const rawResult = await publicClient.readContract({
      address: assetAddress,
      abi: ZENOVA_ASSET_ABI,
      functionName: "getTradingMetrics"
    });
    return {
      totalVolumeTraded: formatUsdtAmount(rawResult.totalVolumeTraded),
      totalTokensTraded: formatDefaultTokenAmount(rawResult.totalTokensTraded),
      totalBuyTransactions: formatNumber(rawResult.totalBuyTransactions),
      totalSellTransactions: formatNumber(rawResult.totalSellTransactions),
      totalFeesCollected: formatUsdtAmount(rawResult.totalFeesCollected),
      averageTradeSize: formatUsdtAmount(rawResult.averageTradeSize),
      // averageTradeSize is in acceptedCurrency
      lastTradeTimestamp: formatTimestamp(rawResult.lastTradeTimestamp),
      priceVolatility: formatBpsRate(rawResult.priceVolatility)
      // Assuming BPS, though it's 0 in contract for now
    };
  } catch (err) {
    const errorMessage = err instanceof BaseError ? err.shortMessage : err instanceof Error ? err.message : String(err);
    console.error(`Error in getAssetTradingMetrics for ${assetAddress}: ${errorMessage}`);
    return { error: `An unexpected error occurred: ${errorMessage}` };
  }
}
async function getAssetMarketAnalysis(assetAddress) {
  if (!isValidAddress(assetAddress)) return { error: "Invalid asset address provided." };
  try {
    const rawResult = await publicClient.readContract({
      address: assetAddress,
      abi: ZENOVA_ASSET_ABI,
      functionName: "getMarketAnalysis"
    });
    return {
      currentMarketCap: formatUsdtAmount(rawResult.currentMarketCap),
      fullyDilutedMarketCap: formatUsdtAmount(rawResult.fullyDilutedMarketCap),
      circulationRatioBPS: formatBpsRate(rawResult.circulationRatio),
      liquidityRatioBPS: formatBpsRate(rawResult.liquidityRatio),
      priceToValuationRatioBPS: formatBpsRate(rawResult.priceToValuationRatio),
      isOvervalued: rawResult.isOvervalued,
      isUndervalued: rawResult.isUndervalued,
      timeSinceLastPriceUpdate: formatDuration(rawResult.timeSinceLastPriceUpdate)
    };
  } catch (err) {
    const errorMessage = err instanceof BaseError ? err.shortMessage : err instanceof Error ? err.message : String(err);
    console.error(`Error in getAssetMarketAnalysis for ${assetAddress}: ${errorMessage}`);
    return { error: `An unexpected error occurred: ${errorMessage}` };
  }
}
async function getAssetUserAssetInfo(assetAddress, user) {
  if (!isValidAddress(assetAddress)) return { error: "Invalid asset address provided." };
  if (!isValidAddress(user)) return { error: "Invalid user address provided." };
  try {
    const rawResult = await publicClient.readContract({
      address: assetAddress,
      abi: ZENOVA_ASSET_ABI,
      functionName: "getUserAssetInfo",
      args: [user]
    });
    return {
      tokenBalance: formatDefaultTokenAmount(rawResult.tokenBalance),
      tokenBalanceValue: formatUsdtAmount(rawResult.tokenBalanceValue),
      percentageOfSupplyBPS: formatBpsRate(rawResult.percentageOfSupply),
      totalPurchaseValue: formatUsdtAmount(rawResult.totalPurchaseValue),
      totalSaleValue: formatUsdtAmount(rawResult.totalSaleValue),
      totalFeesPaid: formatUsdtAmount(rawResult.totalFeesPaid),
      lastTradeTimestamp: formatTimestamp(rawResult.lastTradeTimestamp),
      hasTraded: rawResult.hasTraded,
      realizedPnL: formatUsdtAmount(rawResult.realizedPnL),
      unrealizedPnL: formatUsdtAmount(rawResult.unrealizedPnL)
    };
  } catch (err) {
    const errorMessage = err instanceof BaseError ? err.shortMessage : err instanceof Error ? err.message : String(err);
    console.error(`Error in getAssetUserAssetInfo for ${assetAddress}, user ${user}: ${errorMessage}`);
    return { error: `An unexpected error occurred: ${errorMessage}` };
  }
}
async function getAssetSnapshotInfo(assetAddress) {
  if (!isValidAddress(assetAddress)) return { error: "Invalid asset address provided." };
  try {
    const result = await publicClient.readContract({
      address: assetAddress,
      abi: ZENOVA_ASSET_ABI,
      functionName: "getAssetSnapshot"
    });
    const rawSnapshot = result;
    return {
      currentPrice: formatUsdtAmount(rawSnapshot[0]),
      totalSupply: formatDefaultTokenAmount(rawSnapshot[1]),
      marketCap: formatUsdtAmount(rawSnapshot[2]),
      contractBalance: formatUsdtAmount(rawSnapshot[3]),
      // Balance of acceptedCurrency in the asset contract
      isTradingActive: rawSnapshot[4],
      lastPriceUpdate: formatTimestamp(rawSnapshot[5])
    };
  } catch (err) {
    const errorMessage = err instanceof BaseError ? err.shortMessage : err instanceof Error ? err.message : String(err);
    console.error(`Error in getAssetSnapshotInfo for ${assetAddress}: ${errorMessage}`);
    return { error: `An unexpected error occurred: ${errorMessage}` };
  }
}
async function setAssetCompanyValuationAndSupply(assetAddress, companyValuation, initialPricePerToken, evaluator) {
  if (!isValidAddress(assetAddress)) return { error: "Invalid asset address provided." };
  if (parseFloat(companyValuation) <= 0) return { error: "Company valuation must be positive." };
  if (parseFloat(initialPricePerToken) <= 0) return { error: "Initial price per token must be positive." };
  if (!isValidAddress(evaluator)) return { error: "Invalid evaluator address provided." };
  try {
    const valuationWei = parseUnits(companyValuation, USDT_DECIMALS);
    const priceWei = parseUnits(initialPricePerToken, USDT_DECIMALS);
    const hash = await aiWalletClient.writeContract({
      address: assetAddress,
      abi: ZENOVA_ASSET_ABI,
      functionName: "setCompanyValuationAndSupply",
      args: [valuationWei, priceWei, evaluator],
      account: aiWalletClient.account
      // Or the evaluator's account if different
    });
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    if (receipt.status === "success") {
      return { success: true, transactionHash: hash, message: "Company valuation and supply set successfully." };
    } else {
      return { error: `Setting company valuation and supply failed. Status: ${receipt.status}` };
    }
  } catch (err) {
    const errorMessage = err instanceof BaseError ? err.shortMessage : err instanceof Error ? err.message : String(err);
    console.error(`Error in setAssetCompanyValuationAndSupply for ${assetAddress}: ${errorMessage}`);
    if (errorMessage.includes("AlreadyInitialized")) {
      return { error: "Valuation and supply can only be set once." };
    }
    return { error: `An unexpected error occurred: ${errorMessage}` };
  }
}
async function updateAssetPrice(assetAddress, newPricePerToken) {
  if (!isValidAddress(assetAddress)) return { error: "Invalid asset address provided." };
  if (parseFloat(newPricePerToken) <= 0) return { error: "New price must be positive." };
  try {
    const priceWei = parseUnits(newPricePerToken, USDT_DECIMALS);
    const hash = await aiWalletClient.writeContract({
      address: assetAddress,
      abi: ZENOVA_ASSET_ABI,
      functionName: "updatePrice",
      args: [priceWei],
      account: aiWalletClient.account
    });
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    if (receipt.status === "success") {
      return { success: true, transactionHash: hash, message: "Asset price updated successfully." };
    } else {
      return { error: `Asset price update failed. Status: ${receipt.status}` };
    }
  } catch (err) {
    const errorMessage = err instanceof BaseError ? err.shortMessage : err instanceof Error ? err.message : String(err);
    console.error(`Error in updateAssetPrice for ${assetAddress}: ${errorMessage}`);
    return { error: `An unexpected error occurred during price update: ${errorMessage}` };
  }
}
async function updateAssetLiquidityParameters(assetAddress, newBuyFeeBPS, newSellFeeBPS) {
  if (!isValidAddress(assetAddress)) return { error: "Invalid asset address provided." };
  if (newBuyFeeBPS < 0 || newBuyFeeBPS > 5e3) return { error: "Buy fee BPS must be between 0 and 5000 (50%)." };
  if (newSellFeeBPS < 0 || newSellFeeBPS > 5e3) return { error: "Sell fee BPS must be between 0 and 5000 (50%)." };
  try {
    const hash = await aiWalletClient.writeContract({
      address: assetAddress,
      abi: ZENOVA_ASSET_ABI,
      functionName: "updateLiquidityParameters",
      args: [BigInt(newBuyFeeBPS), BigInt(newSellFeeBPS)],
      account: aiWalletClient.account
    });
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    if (receipt.status === "success") {
      return { success: true, transactionHash: hash, message: "Liquidity parameters updated successfully." };
    } else {
      return { error: `Liquidity parameter update failed. Status: ${receipt.status}` };
    }
  } catch (err) {
    const errorMessage = err instanceof BaseError ? err.shortMessage : err instanceof Error ? err.message : String(err);
    console.error(`Error in updateAssetLiquidityParameters for ${assetAddress}: ${errorMessage}`);
    if (errorMessage.includes("FeeTooHigh")) {
      return { error: "Fee is too high (e.g., exceeds 50%)." };
    }
    return { error: `An unexpected error occurred: ${errorMessage}` };
  }
}
async function activateAssetTrading(assetAddress) {
  if (!isValidAddress(assetAddress)) return { error: "Invalid asset address provided." };
  try {
    const hash = await aiWalletClient.writeContract({
      address: assetAddress,
      abi: ZENOVA_ASSET_ABI,
      functionName: "activateTrading",
      account: aiWalletClient.account
    });
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    if (receipt.status === "success") {
      return { success: true, transactionHash: hash, message: "Trading activated successfully." };
    } else {
      return { error: `Trading activation failed. Status: ${receipt.status}` };
    }
  } catch (err) {
    const errorMessage = err instanceof BaseError ? err.shortMessage : err instanceof Error ? err.message : String(err);
    console.error(`Error in activateAssetTrading for ${assetAddress}: ${errorMessage}`);
    if (errorMessage.includes("TradingActive")) {
      return { error: "Trading is already active." };
    }
    if (errorMessage.includes("ValuationNotSet")) {
      return { error: "Cannot activate trading before company valuation is set." };
    }
    return { error: `An unexpected error occurred: ${errorMessage}` };
  }
}
async function deactivateAssetTrading(assetAddress) {
  if (!isValidAddress(assetAddress)) return { error: "Invalid asset address provided." };
  try {
    const hash = await aiWalletClient.writeContract({
      address: assetAddress,
      abi: ZENOVA_ASSET_ABI,
      functionName: "deactivateTrading",
      account: aiWalletClient.account
    });
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    if (receipt.status === "success") {
      return { success: true, transactionHash: hash, message: "Trading deactivated successfully." };
    } else {
      return { error: `Trading deactivation failed. Status: ${receipt.status}` };
    }
  } catch (err) {
    const errorMessage = err instanceof BaseError ? err.shortMessage : err instanceof Error ? err.message : String(err);
    console.error(`Error in deactivateAssetTrading for ${assetAddress}: ${errorMessage}`);
    if (errorMessage.includes("TradingNotActive")) {
      return { error: "Trading is already inactive." };
    }
    return { error: `An unexpected error occurred: ${errorMessage}` };
  }
}
async function buyAssetTokens(assetAddress, tokenAmountToBuy) {
  if (!isValidAddress(assetAddress)) return { error: "Invalid asset address provided." };
  if (parseFloat(tokenAmountToBuy) <= 0) return { error: "Token amount to buy must be positive." };
  try {
    const amountWei = parseUnits(tokenAmountToBuy, DEFAULT_TOKEN_DECIMALS);
    const hash = await aiWalletClient.writeContract({
      address: assetAddress,
      abi: ZENOVA_ASSET_ABI,
      functionName: "buyTokens",
      args: [amountWei],
      account: aiWalletClient.account
      // The buyer
    });
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    if (receipt.status === "success") {
      return { success: true, transactionHash: hash, message: `Successfully bought ${tokenAmountToBuy} tokens from asset ${assetAddress}.` };
    } else {
      return { error: `Buy tokens transaction failed. Status: ${receipt.status}` };
    }
  } catch (err) {
    const errorMessage = err instanceof BaseError ? err.shortMessage : err instanceof Error ? err.message : String(err);
    console.error(`Error in buyAssetTokens for ${assetAddress}: ${errorMessage}`);
    if (errorMessage.includes("MaxSupplyReached")) {
      return { error: "Cannot buy, maximum token supply reached." };
    }
    return { error: `An unexpected error occurred: ${errorMessage}` };
  }
}
async function sellAssetTokens(assetAddress, tokenAmountToSell) {
  if (!isValidAddress(assetAddress)) return { error: "Invalid asset address provided." };
  if (parseFloat(tokenAmountToSell) <= 0) return { error: "Token amount to sell must be positive." };
  try {
    const amountWei = parseUnits(tokenAmountToSell, DEFAULT_TOKEN_DECIMALS);
    const hash = await aiWalletClient.writeContract({
      address: assetAddress,
      abi: ZENOVA_ASSET_ABI,
      functionName: "sellTokens",
      args: [amountWei],
      account: aiWalletClient.account
      // The seller
    });
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    if (receipt.status === "success") {
      return { success: true, transactionHash: hash, message: `Successfully sold ${tokenAmountToSell} tokens from asset ${assetAddress}.` };
    } else {
      return { error: `Sell tokens transaction failed. Status: ${receipt.status}` };
    }
  } catch (err) {
    const errorMessage = err instanceof BaseError ? err.shortMessage : err instanceof Error ? err.message : String(err);
    console.error(`Error in sellAssetTokens for ${assetAddress}: ${errorMessage}`);
    if (errorMessage.includes("ERC20InsufficientBalance")) {
      return { error: "Seller has insufficient token balance." };
    }
    if (errorMessage.includes("InsufficientOutputAmount")) {
      return { error: "Contract may have insufficient liquidity to cover the sale, or fee is too high." };
    }
    return { error: `An unexpected error occurred: ${errorMessage}` };
  }
}
async function withdrawAssetFees(assetAddress, recipient) {
  if (!isValidAddress(assetAddress)) return { error: "Invalid asset address provided." };
  if (!isValidAddress(recipient)) return { error: "Invalid recipient address for fees." };
  try {
    const hash = await aiWalletClient.writeContract({
      address: assetAddress,
      abi: ZENOVA_ASSET_ABI,
      functionName: "withdrawFees",
      args: [recipient],
      account: aiWalletClient.account
      // Caller must have AI_ROLE on the asset
    });
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    if (receipt.status === "success") {
      return { success: true, transactionHash: hash, message: "Asset fees withdrawn successfully." };
    } else {
      return { error: `Withdraw fees transaction failed. Status: ${receipt.status}` };
    }
  } catch (err) {
    const errorMessage = err instanceof BaseError ? err.shortMessage : err instanceof Error ? err.message : String(err);
    console.error(`Error in withdrawAssetFees for ${assetAddress}: ${errorMessage}`);
    if (errorMessage.includes("NoFeesToWithdraw")) {
      return { error: "No fees available to withdraw." };
    }
    return { error: `An unexpected error occurred: ${errorMessage}` };
  }
}
async function companyWithdrawAssetTokens(assetAddress, amountOfTokens) {
  if (!isValidAddress(assetAddress)) return { error: "Invalid asset address provided." };
  if (parseFloat(amountOfTokens) <= 0) return { error: "Amount of tokens to withdraw must be positive." };
  try {
    const amountWei = parseUnits(amountOfTokens, DEFAULT_TOKEN_DECIMALS);
    const hash = await aiWalletClient.writeContract({
      address: assetAddress,
      abi: ZENOVA_ASSET_ABI,
      functionName: "companyWithdraw",
      args: [amountWei],
      account: aiWalletClient.account
      // Caller must have AI_ROLE 
    });
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    if (receipt.status === "success") {
      return { success: true, transactionHash: hash, message: "Company token withdrawal successful." };
    } else {
      return { error: `Company token withdrawal failed. Status: ${receipt.status}` };
    }
  } catch (err) {
    const errorMessage = err instanceof BaseError ? err.shortMessage : err instanceof Error ? err.message : String(err);
    console.error(`Error in companyWithdrawAssetTokens for ${assetAddress}: ${errorMessage}`);
    if (errorMessage.includes("CompanyWalletNotSet")) {
      return { error: "Company wallet not set in the asset contract." };
    }
    if (errorMessage.includes("MaxSupplyReached")) {
      return { error: "Withdrawal amount exceeds maximum supply or company allocation limits." };
    }
    return { error: `An unexpected error occurred: ${errorMessage}` };
  }
}
async function pauseAssetTrading(assetAddress) {
  if (!isValidAddress(assetAddress)) return { error: "Invalid asset address provided." };
  try {
    const hash = await aiWalletClient.writeContract({
      address: assetAddress,
      abi: ZENOVA_ASSET_ABI,
      functionName: "pause",
      account: aiWalletClient.account
    });
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    if (receipt.status === "success") {
      return { success: true, transactionHash: hash, message: "Asset trading paused successfully." };
    } else {
      return { error: `Pause trading transaction failed. Status: ${receipt.status}` };
    }
  } catch (err) {
    const errorMessage = err instanceof BaseError ? err.shortMessage : err instanceof Error ? err.message : String(err);
    console.error(`Error in pauseAssetTrading for ${assetAddress}: ${errorMessage}`);
    if (errorMessage.includes("Pausable: paused")) {
      return { error: "Asset trading is already paused." };
    }
    return { error: `An unexpected error occurred: ${errorMessage}` };
  }
}
async function unpauseAssetTrading(assetAddress) {
  if (!isValidAddress(assetAddress)) return { error: "Invalid asset address provided." };
  try {
    const hash = await aiWalletClient.writeContract({
      address: assetAddress,
      abi: ZENOVA_ASSET_ABI,
      functionName: "unpause",
      account: aiWalletClient.account
    });
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    if (receipt.status === "success") {
      return { success: true, transactionHash: hash, message: "Asset trading unpaused successfully." };
    } else {
      return { error: `Unpause trading transaction failed. Status: ${receipt.status}` };
    }
  } catch (err) {
    const errorMessage = err instanceof BaseError ? err.shortMessage : err instanceof Error ? err.message : String(err);
    console.error(`Error in unpauseAssetTrading for ${assetAddress}: ${errorMessage}`);
    if (errorMessage.includes("Pausable: not paused")) {
      return { error: "Asset trading is not currently paused." };
    }
    return { error: `An unexpected error occurred: ${errorMessage}` };
  }
}

const getAssetCompanyNameTool = createTool({
  id: "zenovaAsset_getCompanyName",
  description: "Gets the company name (token name) of a specific ZenovaAsset contract.",
  inputSchema: AssetAddressInputSchema,
  outputSchema: z.union([z.string(), ToolErrorResponseSchema]),
  // name is string
  execute: async ({ context }) => {
    return await getAssetCompanyName(context.assetAddress);
  }
});
const getAssetSymbolTool = createTool({
  id: "zenovaAsset_getSymbol",
  description: "Gets the token symbol of a specific ZenovaAsset contract.",
  inputSchema: AssetAddressInputSchema,
  outputSchema: z.union([z.string(), ToolErrorResponseSchema]),
  // symbol is string
  execute: async ({ context }) => {
    return await getAssetSymbol(context.assetAddress);
  }
});
const getAssetDecimalsTool = createTool({
  id: "zenovaAsset_getDecimals",
  description: "Gets the token decimals of a specific ZenovaAsset contract.",
  inputSchema: AssetAddressInputSchema,
  outputSchema: z.union([PositiveStringIntegerSchema, ToolErrorResponseSchema]),
  // decimals is uint8, formatted to string
  execute: async ({ context }) => {
    return await getAssetDecimals(context.assetAddress);
  }
});
const getAssetTotalSupplyTool = createTool({
  id: "zenovaAsset_getTotalSupply",
  description: "Gets the total supply of a specific ZenovaAsset contract, formatted string.",
  inputSchema: AssetAddressInputSchema,
  outputSchema: z.union([PositiveStringFloatSchema, ToolErrorResponseSchema]),
  // Formatted default token amount
  execute: async ({ context }) => {
    return await getAssetTotalSupply(context.assetAddress);
  }
});
const getAssetBalanceOfTool = createTool({
  id: "zenovaAsset_getBalanceOf",
  description: "Gets the token balance of an account for a specific ZenovaAsset, formatted string.",
  inputSchema: AssetBalanceOfInputSchema,
  outputSchema: z.union([PositiveStringFloatSchema, ToolErrorResponseSchema]),
  // Formatted default token amount
  execute: async ({ context }) => {
    return await getAssetBalanceOf(context.assetAddress, context.account);
  }
});
const getAssetCompanyInfoTool = createTool({
  id: "zenovaAsset_getCompanyInfo",
  description: "Gets the company information struct from a specific ZenovaAsset contract.",
  inputSchema: AssetAddressInputSchema,
  outputSchema: z.union([CompanyInfoSchema, ToolErrorResponseSchema]),
  execute: async ({ context }) => {
    return await getAssetCompanyInfo(context.assetAddress);
  }
});
const getAssetPricingDetailsTool = createTool({
  id: "zenovaAsset_getPricingDetails",
  description: "Gets the asset pricing details struct from a specific ZenovaAsset contract.",
  inputSchema: AssetAddressInputSchema,
  outputSchema: z.union([AssetPricingDetailsSchema, ToolErrorResponseSchema]),
  execute: async ({ context }) => {
    return await getAssetPricingDetailsInfo(context.assetAddress);
  }
});
const getAssetFullDetailsTool = createTool({
  id: "zenovaAsset_getFullDetails",
  description: "Gets the full asset details struct from a specific ZenovaAsset contract.",
  inputSchema: AssetAddressInputSchema,
  outputSchema: z.union([ZenovaAssetFullDetailsSchema, ToolErrorResponseSchema]),
  execute: async ({ context }) => {
    return await getAssetFullDetailsInfo(context.assetAddress);
  }
});
const getAssetCurrentValuationTool = createTool({
  id: "zenovaAsset_getCurrentValuation",
  description: "Gets the current valuation of the company represented by the ZenovaAsset, formatted USDT string.",
  inputSchema: AssetAddressInputSchema,
  outputSchema: z.union([PositiveStringFloatSchema, ToolErrorResponseSchema]),
  // Formatted USDT amount
  execute: async ({ context }) => {
    return await getAssetCurrentValuation(context.assetAddress);
  }
});
const getAssetMaxTokenSupplyTool = createTool({
  id: "zenovaAsset_getMaxTokenSupply",
  description: "Gets the maximum token supply for the ZenovaAsset, formatted string.",
  inputSchema: AssetAddressInputSchema,
  outputSchema: z.union([PositiveStringFloatSchema, ToolErrorResponseSchema]),
  // Formatted default token amount
  execute: async ({ context }) => {
    return await getAssetMaxTokenSupply(context.assetAddress);
  }
});
const getAssetIsTradingActiveTool = createTool({
  id: "zenovaAsset_isTradingActive",
  description: "Checks if trading is currently active for the ZenovaAsset.",
  inputSchema: AssetAddressInputSchema,
  outputSchema: z.union([z.boolean(), ToolErrorResponseSchema]),
  execute: async ({ context }) => {
    return await getAssetIsTradingActive(context.assetAddress);
  }
});
const getAssetCollectedFeesTool = createTool({
  id: "zenovaAsset_getCollectedFees",
  description: "Gets the total collected fees in USDT for the ZenovaAsset, formatted string.",
  inputSchema: AssetAddressInputSchema,
  outputSchema: z.union([PositiveStringFloatSchema, ToolErrorResponseSchema]),
  // Formatted USDT amount
  execute: async ({ context }) => {
    return await getAssetCollectedFees(context.assetAddress);
  }
});
const getAssetBuyQuoteTool = createTool({
  id: "zenovaAsset_getBuyQuote",
  description: "Gets a quote for buying a specific amount of ZenovaAsset tokens (totalCost in USDT, fee in USDT).",
  inputSchema: BuySellTokensInputSchema,
  // Reuses this schema as it takes assetAddress and tokenAmount
  outputSchema: z.union([z.object({ totalCost: PositiveStringFloatSchema, fee: PositiveStringFloatSchema }), ToolErrorResponseSchema]),
  execute: async ({ context }) => {
    return await getAssetBuyQuote(context.assetAddress, context.tokenAmount);
  }
});
const getAssetSellQuoteTool = createTool({
  id: "zenovaAsset_getSellQuote",
  description: "Gets a quote for selling a specific amount of ZenovaAsset tokens (proceeds in USDT, fee in USDT).",
  inputSchema: BuySellTokensInputSchema,
  // Reuses this schema
  outputSchema: z.union([z.object({ proceeds: PositiveStringFloatSchema, fee: PositiveStringFloatSchema }), ToolErrorResponseSchema]),
  execute: async ({ context }) => {
    return await getAssetSellQuote(context.assetAddress, context.tokenAmount);
  }
});
const getAssetTradingMetricsTool = createTool({
  id: "zenovaAsset_getTradingMetrics",
  description: "Gets the trading metrics for a specific ZenovaAsset.",
  inputSchema: AssetAddressInputSchema,
  outputSchema: z.union([TradingMetricsSchema, ToolErrorResponseSchema]),
  execute: async ({ context }) => {
    return await getAssetTradingMetrics(context.assetAddress);
  }
});
const getAssetMarketAnalysisTool = createTool({
  id: "zenovaAsset_getMarketAnalysis",
  description: "Gets market analysis data for a specific ZenovaAsset.",
  inputSchema: AssetAddressInputSchema,
  outputSchema: z.union([MarketAnalysisSchema, ToolErrorResponseSchema]),
  execute: async ({ context }) => {
    return await getAssetMarketAnalysis(context.assetAddress);
  }
});
const getAssetUserAssetInfoTool = createTool({
  id: "zenovaAsset_getUserAssetInfo",
  description: "Gets asset-specific information for a user (balance, PnL, etc.).",
  inputSchema: GetUserAssetInfoInputSchema,
  outputSchema: z.union([UserAssetInfoSchema, ToolErrorResponseSchema]),
  execute: async ({ context }) => {
    return await getAssetUserAssetInfo(context.assetAddress, context.user);
  }
});
const getAssetSnapshotInfoTool = createTool({
  id: "zenovaAsset_getAssetSnapshot",
  description: "Gets a snapshot of key asset data (price, supply, marketcap, etc.).",
  inputSchema: AssetAddressInputSchema,
  outputSchema: z.union([AssetSnapshotSchema, ToolErrorResponseSchema]),
  execute: async ({ context }) => {
    return await getAssetSnapshotInfo(context.assetAddress);
  }
});
const setAssetCompanyValuationTool = createTool({
  id: "zenovaAsset_setCompanyValuationAndSupply",
  description: "Sets the initial company valuation, token price, and supply details on a ZenovaAsset contract. Typically called by AI after factory creation.",
  inputSchema: SetCompanyValuationInputSchema,
  outputSchema: z.union([TransactionSuccessResponseSchema, ToolErrorResponseSchema]),
  execute: async ({ context }) => {
    return await setAssetCompanyValuationAndSupply(context.assetAddress, context.companyValuation, context.initialPricePerToken, context.evaluator);
  }
});
const updateAssetPriceTool = createTool({
  id: "zenovaAsset_updatePrice",
  description: "Updates the price of a ZenovaAsset. Called by an authorized Price AI.",
  inputSchema: UpdatePriceInputSchema,
  outputSchema: z.union([TransactionSuccessResponseSchema, ToolErrorResponseSchema]),
  execute: async ({ context }) => {
    return await updateAssetPrice(context.assetAddress, context.newPricePerToken);
  }
});
const updateAssetLiquidityParamsTool = createTool({
  id: "zenovaAsset_updateLiquidityParameters",
  description: "Updates the buy and sell fee BPS for a ZenovaAsset. Called by an authorized Liquidity Manager.",
  inputSchema: UpdateLiquidityParamsInputSchema,
  outputSchema: z.union([TransactionSuccessResponseSchema, ToolErrorResponseSchema]),
  execute: async ({ context }) => {
    return await updateAssetLiquidityParameters(context.assetAddress, context.newBuyFeeBPS, context.newSellFeeBPS);
  }
});
const activateAssetTradingTool = createTool({
  id: "zenovaAsset_activateTrading",
  description: "Activates trading for a ZenovaAsset. Called by an authorized AI role (admin/evaluator).",
  inputSchema: AssetAddressInputSchema,
  // Only assetAddress needed
  outputSchema: z.union([TransactionSuccessResponseSchema, ToolErrorResponseSchema]),
  execute: async ({ context }) => {
    return await activateAssetTrading(context.assetAddress);
  }
});
const deactivateAssetTradingTool = createTool({
  id: "zenovaAsset_deactivateTrading",
  description: "Deactivates trading for a ZenovaAsset. Called by an authorized AI role (admin/evaluator).",
  inputSchema: AssetAddressInputSchema,
  // Only assetAddress needed
  outputSchema: z.union([TransactionSuccessResponseSchema, ToolErrorResponseSchema]),
  execute: async ({ context }) => {
    return await deactivateAssetTrading(context.assetAddress);
  }
});
const buyAssetTokensTool = createTool({
  id: "zenovaAsset_buyTokens",
  description: "Allows a user (represented by AI wallet) to buy ZenovaAsset tokens.",
  inputSchema: BuySellTokensInputSchema,
  outputSchema: z.union([TransactionSuccessResponseSchema, ToolErrorResponseSchema]),
  execute: async ({ context }) => {
    return await buyAssetTokens(context.assetAddress, context.tokenAmount);
  }
});
const sellAssetTokensTool = createTool({
  id: "zenovaAsset_sellTokens",
  description: "Allows a user (represented by AI wallet) to sell ZenovaAsset tokens.",
  inputSchema: BuySellTokensInputSchema,
  outputSchema: z.union([TransactionSuccessResponseSchema, ToolErrorResponseSchema]),
  execute: async ({ context }) => {
    return await sellAssetTokens(context.assetAddress, context.tokenAmount);
  }
});
const withdrawAssetFeesTool = createTool({
  id: "zenovaAsset_withdrawFees",
  description: "Withdraws collected trading fees from a ZenovaAsset to a recipient. Called by authorized AI.",
  inputSchema: WithdrawFeesInputSchema,
  outputSchema: z.union([TransactionSuccessResponseSchema, ToolErrorResponseSchema]),
  execute: async ({ context }) => {
    return await withdrawAssetFees(context.assetAddress, context.recipient);
  }
});
const companyWithdrawAssetTokensTool = createTool({
  id: "zenovaAsset_companyWithdrawTokens",
  description: "Allows the original issuing company (via authorized AI) to withdraw a portion of undistributed tokens.",
  inputSchema: CompanyWithdrawInputSchema,
  outputSchema: z.union([TransactionSuccessResponseSchema, ToolErrorResponseSchema]),
  execute: async ({ context }) => {
    return await companyWithdrawAssetTokens(context.assetAddress, context.amountOfTokens);
  }
});
const pauseAssetTradingTool = createTool({
  id: "zenovaAsset_pauseTrading",
  description: "Pauses trading and other sensitive functions on a ZenovaAsset. Called by pauser role (admin).",
  inputSchema: AssetAddressInputSchema,
  outputSchema: z.union([TransactionSuccessResponseSchema, ToolErrorResponseSchema]),
  execute: async ({ context }) => {
    return await pauseAssetTrading(context.assetAddress);
  }
});
const unpauseAssetTradingTool = createTool({
  id: "zenovaAsset_unpauseTrading",
  description: "Unpauses trading and other sensitive functions on a ZenovaAsset. Called by pauser role (admin).",
  inputSchema: AssetAddressInputSchema,
  outputSchema: z.union([TransactionSuccessResponseSchema, ToolErrorResponseSchema]),
  execute: async ({ context }) => {
    return await unpauseAssetTrading(context.assetAddress);
  }
});

const TavilySearchInputSchema = z.object({
  query: z.string().describe("The search query to look up on the web"),
  searchDepth: z.enum(["basic", "advanced"]).optional().describe("The depth of the search. 'advanced' search is tailored to retrieve the most relevant sources while 'basic' search provides generic content snippets."),
  maxResults: z.number().min(1).max(20).optional().describe("The maximum number of search results to return. Must be between 1 and 20."),
  includeAnswer: z.boolean().optional().describe("Whether to include an AI-generated answer based on the search results"),
  topic: z.enum(["general", "news"]).optional().describe("The category of the search, can be 'general' or 'news'"),
  timeRange: z.enum(["day", "week", "month", "year", "d", "w", "m", "y"]).optional().describe("The time range to search within"),
  includeDomains: z.array(z.string()).optional().describe("A list of domains to specifically include in the search results"),
  excludeDomains: z.array(z.string()).optional().describe("A list of domains to specifically exclude from the search results")
});
const TavilySearchOutputSchema = z.object({
  query: z.string().optional(),
  results: z.array(
    z.object({
      title: z.string(),
      url: z.string(),
      content: z.string(),
      score: z.number()
    })
  ).optional(),
  answer: z.string().optional(),
  responseTime: z.number().optional(),
  error: z.string().optional()
});
const tavilySearchTool = createTool({
  id: "zenova-tavily-search",
  // Changed ID for Zenova
  description: "Search the web for real-time information using Tavily API for the Zenova Platform",
  inputSchema: TavilySearchInputSchema,
  outputSchema: TavilySearchOutputSchema,
  execute: async ({ context }) => {
    try {
      const input = context;
      const apiKey = process.env.TAVILY_API_KEY;
      if (!apiKey) {
        throw new Error("TAVILY_API_KEY environment variable is not set");
      }
      const tvly = tavily({ apiKey });
      const searchParams = {
        searchDepth: input.searchDepth,
        maxResults: input.maxResults,
        includeAnswer: input.includeAnswer,
        topic: input.topic,
        timeRange: input.timeRange,
        includeDomains: input.includeDomains,
        excludeDomains: input.excludeDomains,
        includeImages: false
        // Always exclude images for agent usage
      };
      Object.keys(searchParams).forEach((key) => {
        const K = key;
        if (searchParams[K] === void 0) {
          delete searchParams[K];
        }
      });
      const response = await tvly.search(input.query, searchParams);
      return {
        query: response.query,
        results: response.results,
        answer: response.answer,
        responseTime: response.responseTime
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "An unknown error occurred during web search"
      };
    }
  }
});

export { activateAssetTradingTool, buyAssetTokensTool, companyWithdrawAssetTokensTool, createZenovaAssetFactoryTool, deactivateAssetTradingTool, getAcceptedCurrencyFactoryTool, getAllAssetsFactoryTool, getAssetBalanceOfTool, getAssetBuyQuoteTool, getAssetCollectedFeesTool, getAssetCompanyInfoTool, getAssetCompanyNameTool, getAssetCurrentValuationTool, getAssetDecimalsTool, getAssetFullDetailsFactoryTool, getAssetFullDetailsTool, getAssetIsTradingActiveTool, getAssetMarketAnalysisTool, getAssetMaxTokenSupplyTool, getAssetPricingDetailsTool, getAssetSellQuoteTool, getAssetSnapshotInfoTool, getAssetSymbolTool, getAssetTotalSupplyTool, getAssetTradingMetricsTool, getAssetUserAssetInfoTool, getAssetsByCompanyFactoryTool, getCompanyComprehensiveDetailsTool, getMultipleAssetAnalyticsTool, getMultipleAssetFullDetailsFactoryTool, getPlatformSnapshotTool, getSubmittedValuationFactoryTool, getTotalAssetsFactoryTool, getUserPortfolioDetailsTool, getZenovaAssetImplementationTool, pauseAssetTradingTool, sellAssetTokensTool, setAssetCompanyValuationTool, submitCompanyValuationFactoryTool, tavilySearchTool, unpauseAssetTradingTool, updateAssetLiquidityParamsTool, updateAssetPriceTool, withdrawAssetFeesTool };

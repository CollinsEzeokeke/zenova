import { z } from 'zod';
import { 
    // getAddress,
     isAddress } from "viem";

// Primitive Schemas
export const EthereumAddressSchema = z.string().refine(isAddress, {
    message: "Invalid Ethereum address",
});

export const PositiveStringIntegerSchema = z.string().regex(/^\d+$/, "Must be a positive integer string");
export const PositiveStringFloatSchema = z.string().refine(val => parseFloat(val) > 0 && !isNaN(parseFloat(val)), {
    message: "Must be a positive number string"
});

// export const PositiveBigIntSchema = z.bigint().refine((val) => val > BigInt(0), { // Commenting out as amounts are string formatted
//     message: "Value must be a positive BigInt",
// });

// Used for general success responses from write operations
export const TransactionSuccessResponseSchema = z.object({
    success: z.literal(true),
    transactionHash: EthereumAddressSchema,
    message: z.string().optional(),
});

// Specific for asset creation, which might include the new asset's address
export const AssetCreationSuccessResponseSchema = TransactionSuccessResponseSchema.extend({
    assetAddress: EthereumAddressSchema.optional(),
});

// Generic error response schema for tools
export const ToolErrorResponseSchema = z.object({
    error: z.string(),
});

// --- USDTMock Schemas ---
export const UsdtAmountSchema = PositiveStringFloatSchema; // Human-readable USDT amount (string)

export const MintUsdtInputSchema = z.object({
    recipient: EthereumAddressSchema,
    amount: UsdtAmountSchema,
});

export const BulkMintUsdtInputSchema = z.object({
    recipients: z.array(EthereumAddressSchema),
    amounts: z.array(UsdtAmountSchema),
});

export const BurnUsdtInputSchema = z.object({
    amount: UsdtAmountSchema, 
});

export const UsdtBalanceOfInputSchema = z.object({
    account: EthereumAddressSchema,
});

export const ConvertUsdtInputSchema = z.object({ // For toWei and fromWei
    amount: z.string(), // Can be human amount for toWei, or wei amount for fromWei
});

// --- ZenovaAsset Schemas ---
export const ZenovaAssetAmountSchema = PositiveStringFloatSchema; // Human-readable Zenova asset token amount (string)

export const AssetAddressInputSchema = z.object({
    assetAddress: EthereumAddressSchema,
});

export const AssetBalanceOfInputSchema = AssetAddressInputSchema.extend({
    account: EthereumAddressSchema,
});

export const CompanyInfoSchema = z.object({
    name: z.string().min(1, "Company name is required"),
    symbol: z.string().min(1, "Company symbol is required").max(10, "Symbol too long"),
    description: z.string().optional(),
    website: z.string().url().optional(), // Optional URL
    issuingCompanyWallet: EthereumAddressSchema,
});

export const AssetPricingDetailsSchema = z.object({
    currentPricePerToken: PositiveStringFloatSchema, // USDT formatted string
    buyFeeBPS: PositiveStringIntegerSchema,          // BPS as string
    sellFeeBPS: PositiveStringIntegerSchema,         // BPS as string
    marketCap: PositiveStringFloatSchema,            // USDT formatted string
    lastPriceUpdateTimestamp: PositiveStringIntegerSchema, // Timestamp as string
    acceptedCurrency: EthereumAddressSchema,
});

export const ZenovaAssetFullDetailsSchema = z.object({
    assetAddress: EthereumAddressSchema,
    companyDetails: CompanyInfoSchema,
    pricingDetails: AssetPricingDetailsSchema,
    currentValuation: UsdtAmountSchema,
    maxTokenSupply: ZenovaAssetAmountSchema,
    currentTotalSupply: ZenovaAssetAmountSchema,
    isTradingActive: z.boolean(),
    admin: EthereumAddressSchema,
    priceAI: EthereumAddressSchema,
    liquidityManager: EthereumAddressSchema,
});

export const TradingMetricsSchema = z.object({
    totalVolumeTraded: UsdtAmountSchema,
    totalTokensTraded: ZenovaAssetAmountSchema,
    totalBuyTransactions: PositiveStringIntegerSchema,
    totalSellTransactions: PositiveStringIntegerSchema,
    totalFeesCollected: UsdtAmountSchema,
    averageTradeSize: UsdtAmountSchema,
    lastTradeTimestamp: PositiveStringIntegerSchema,
    priceVolatility: PositiveStringIntegerSchema, // BPS as string
});

export const MarketAnalysisSchema = z.object({
    currentMarketCap: UsdtAmountSchema,
    fullyDilutedMarketCap: UsdtAmountSchema,
    circulationRatioBPS: PositiveStringIntegerSchema, // BPS as string
    liquidityRatioBPS: PositiveStringIntegerSchema,   // BPS as string
    priceToValuationRatioBPS: PositiveStringIntegerSchema, // BPS as string
    isOvervalued: z.boolean(),
    isUndervalued: z.boolean(),
    timeSinceLastPriceUpdate: PositiveStringIntegerSchema, // Duration string
});

export const UserAssetInfoSchema = z.object({
    tokenBalance: ZenovaAssetAmountSchema,
    tokenBalanceValue: UsdtAmountSchema,
    percentageOfSupplyBPS: PositiveStringIntegerSchema, // BPS as string
    totalPurchaseValue: UsdtAmountSchema,
    totalSaleValue: UsdtAmountSchema,
    totalFeesPaid: UsdtAmountSchema,
    lastTradeTimestamp: PositiveStringIntegerSchema,
    hasTraded: z.boolean(),
    realizedPnL: UsdtAmountSchema, // Can be negative, so PositiveStringFloatSchema might be too restrictive. Using z.string() for now.
    unrealizedPnL: UsdtAmountSchema, // Same as above.
});

export const AssetSnapshotSchema = z.object({
    currentPrice: UsdtAmountSchema,
    totalSupply: ZenovaAssetAmountSchema,
    marketCap: UsdtAmountSchema,
    contractBalance: UsdtAmountSchema,
    isTradingActive: z.boolean(),
    lastPriceUpdate: PositiveStringIntegerSchema, // Timestamp as string
});

// Input Schemas for ZenovaAsset setter functions
export const SetCompanyValuationInputSchema = AssetAddressInputSchema.extend({
    companyValuation: UsdtAmountSchema,
    initialPricePerToken: UsdtAmountSchema,
    evaluator: EthereumAddressSchema,
});

export const UpdatePriceInputSchema = AssetAddressInputSchema.extend({
    newPricePerToken: UsdtAmountSchema,
});

export const UpdateLiquidityParamsInputSchema = AssetAddressInputSchema.extend({
    newBuyFeeBPS: z.number().int().min(0).max(5000),
    newSellFeeBPS: z.number().int().min(0).max(5000),
});

export const BuySellTokensInputSchema = AssetAddressInputSchema.extend({
    tokenAmount: ZenovaAssetAmountSchema, 
});

export const WithdrawFeesInputSchema = AssetAddressInputSchema.extend({
    recipient: EthereumAddressSchema,
});

export const CompanyWithdrawInputSchema = AssetAddressInputSchema.extend({
    amountOfTokens: ZenovaAssetAmountSchema,
});

export const UserAddressInputSchema = z.object({ // For individual asset user info
    user: EthereumAddressSchema,
});
export const GetUserAssetInfoInputSchema = AssetAddressInputSchema.extend(UserAddressInputSchema.shape);

// --- ZenovaAssetFactory Schemas ---

export const CompanyInitialValuationSchema = z.object({
    companyWallet: EthereumAddressSchema,
    valuation: UsdtAmountSchema,
    initialPricePerToken: UsdtAmountSchema,
    evaluatorAI: EthereumAddressSchema,
    assessmentTimestamp: PositiveStringIntegerSchema,
    exists: z.boolean(),
});

export const SubmitCompanyValuationInputSchema = z.object({
    companyWallet: EthereumAddressSchema,
    valuation: UsdtAmountSchema,
    initialPricePerToken: UsdtAmountSchema,
});

export const CreateZenovaAssetInputSchema = z.object({
    companyWallet: EthereumAddressSchema,
    companyInfo: CompanyInfoSchema,
});

// Input schemas for getter functions in ZenovaAssetFactory
export const GetAssetsByCompanyInputSchema = z.object({
    companyWallet: EthereumAddressSchema,
});

export const GetSubmittedValuationInputSchema = z.object({
    companyWallet: EthereumAddressSchema,
});

export const GetAssetFullDetailsInputSchema = z.object({
    assetAddress: EthereumAddressSchema,
});

export const GetMultipleAssetFullDetailsInputSchema = z.object({
    assetAddresses: z.array(EthereumAddressSchema),
});

export const FactoryUserAddressInputSchema = z.object({ // For factory-level user portfolio details
    userAddress: EthereumAddressSchema,
});

// Output Schemas for ZenovaAssetFactory getter tools
export const FactoryTotalAssetsOutputSchema = PositiveStringIntegerSchema;
export const FactoryAllAssetsOutputSchema = z.array(EthereumAddressSchema);
export const FactoryAssetsByCompanyOutputSchema = z.array(EthereumAddressSchema);

export const PositiveBigIntStringSchema = PositiveStringIntegerSchema;

// Schema for CompanyComprehensiveDetails from ZenovaAssetFactory.sol (matches FormattedCompanyComprehensiveDetails)
export const CompanyComprehensiveDetailsSchema = z.object({
    companyWallet: EthereumAddressSchema,
    pendingValuation: CompanyInitialValuationSchema.optional(),
    assetAddresses: z.array(EthereumAddressSchema),
    assetDetails: z.array(ZenovaAssetFullDetailsSchema),
    totalMarketCap: UsdtAmountSchema, // Was PositiveBigIntSchema, now UsdtAmountSchema (string)
    totalTokensIssued: ZenovaAssetAmountSchema, // Was PositiveBigIntSchema, assuming general Zenova asset amount (string)
    totalTradingVolume: UsdtAmountSchema, // Was PositiveBigIntSchema, now UsdtAmountSchema (string)
    hasActiveAssets: z.boolean(),
});

// Schema for PlatformSnapshot (matches FormattedPlatformSnapshot)
export const PlatformSnapshotSchema = z.object({
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
    mostActiveAssetByVolume: EthereumAddressSchema,
});

// Schema for UserPortfolioDetails (matches FormattedUserPortfolioDetails)
export const UserPortfolioDetailsSchema = z.object({
    userAddress: EthereumAddressSchema,
    totalPortfolioValue: UsdtAmountSchema,
    totalInvestedAmount: UsdtAmountSchema,
    totalRealizedPnL: UsdtAmountSchema, // Should allow negative, PositiveStringFloatSchema for PnL might be too strict. UsdtAmountSchema implies positive.
    totalUnrealizedPnL: UsdtAmountSchema, // Using UsdtAmountSchema for now, but PnL can be negative.
    totalFeesPaid: UsdtAmountSchema,
    numberOfAssetsHeld: PositiveStringIntegerSchema,
    heldAssetAddresses: z.array(EthereumAddressSchema),
    assetHoldings: z.array(UserAssetInfoSchema),
    isActiveTrader: z.boolean(),
});

// Schema for MultipleAssetAnalytics (matches FormattedMultipleAssetAnalytics tuple)
export const MultipleAssetAnalyticsSchema = z.tuple([
    z.array(ZenovaAssetFullDetailsSchema),
    z.array(TradingMetricsSchema),
    z.array(MarketAnalysisSchema),
]);

// Generic input for tools that only need a user address (and potentially asset address)
export const UserAndAssetAddressInputSchema = z.object({
    userAddress: EthereumAddressSchema,
    assetAddress: EthereumAddressSchema,
});

// Schema for role granting/revoking if needed by tools
export const ModifyRoleInputSchema = z.object({
    role: z.string(),
    account: EthereumAddressSchema,
    contractAddress: EthereumAddressSchema,
});

// Schema for pausing/unpausing trading on an asset
export const ToggleTradingInputSchema = z.object({
    assetAddress: EthereumAddressSchema,
    pause: z.boolean(),
}); 
import { Hex } from "viem";

// Raw types returned directly by Viem contract calls, mirroring Solidity structs

// From ZenovaAsset.sol
export interface CompanyInfo {
    name: string;
    symbol: string;
    description: string;
    website: string;
    issuingCompanyWallet: Hex;
}

export interface AssetPricingDetails {
    readonly currentPricePerToken: bigint;
    readonly buyFeeBPS: bigint;
    readonly sellFeeBPS: bigint;
    readonly marketCap: bigint; // This is often calculated dynamically in getters
    readonly lastPriceUpdateTimestamp: bigint;
    readonly acceptedCurrency: Hex;
}

export interface FullAssetDetails {
    readonly assetAddress: Hex;
    readonly companyDetails: CompanyInfo;
    readonly pricingDetails: AssetPricingDetails;
    readonly currentValuation: bigint;
    readonly maxTokenSupply: bigint;
    readonly currentTotalSupply: bigint;
    readonly isTradingActive: boolean;
    readonly admin: Hex;
    readonly priceAI: Hex;
    readonly liquidityManager: Hex;
}

export interface TradingMetrics {
    readonly totalVolumeTraded: bigint;
    readonly totalTokensTraded: bigint;
    readonly totalBuyTransactions: bigint;
    readonly totalSellTransactions: bigint;
    readonly totalFeesCollected: bigint;
    readonly averageTradeSize: bigint;
    readonly lastTradeTimestamp: bigint;
    readonly priceVolatility: bigint; // Placeholder in contract, actual type might differ
}

export interface MarketAnalysis {
    readonly currentMarketCap: bigint;
    readonly fullyDilutedMarketCap: bigint;
    readonly circulationRatio: bigint; // Corrected: was circulationRatioBPS
    readonly liquidityRatio: bigint;   // Corrected: was liquidityRatioBPS
    readonly priceToValuationRatio: bigint; // Corrected: was priceToValuationRatioBPS
    readonly isOvervalued: boolean;
    readonly isUndervalued: boolean;
    readonly timeSinceLastPriceUpdate: bigint;
}

export interface UserAssetInfo {
    readonly tokenBalance: bigint;
    readonly tokenBalanceValue: bigint;
    readonly percentageOfSupply: bigint; // Corrected: was percentageOfSupplyBPS
    readonly totalPurchaseValue: bigint;
    readonly totalSaleValue: bigint;
    readonly totalFeesPaid: bigint;
    readonly lastTradeTimestamp: bigint;
    readonly hasTraded: boolean;
    readonly realizedPnL: bigint;
    readonly unrealizedPnL: bigint;
}

export interface AssetSnapshot {
    readonly currentPrice: bigint;
    readonly totalSupply: bigint;
    readonly marketCap: bigint;
    readonly contractBalance: bigint;
    readonly isTradingActive: boolean;
    readonly lastPriceUpdate: bigint;
}

// From ZenovaAssetFactory.sol
export interface CompanyInitialValuation {
    readonly companyWallet: Hex;
    readonly valuation: bigint;
    readonly initialPricePerToken: bigint;
    readonly evaluatorAI: Hex;
    readonly assessmentTimestamp: bigint; // Solidity uint64
    readonly exists: boolean;
}

export interface CompanyComprehensiveDetails {
    readonly companyWallet: Hex;
    readonly pendingValuation?: CompanyInitialValuation; // Optional because `exists` flag determines presence
    readonly assetAddresses: readonly Hex[];
    readonly assetDetails: readonly FullAssetDetails[];
    readonly totalMarketCap: bigint;
    readonly totalTokensIssued: bigint;
    readonly totalTradingVolume: bigint;
    readonly hasActiveAssets: boolean;
}

export interface PlatformSnapshot {
    readonly totalAssetsCreated: bigint;
    readonly totalCompaniesOnboarded: bigint;
    readonly totalActiveAssets: bigint;
    readonly totalMarketCapitalization: bigint;
    readonly totalTradingVolume: bigint;
    readonly totalFeesCollected: bigint;
    readonly averageAssetMarketCap: bigint;
    readonly totalTokensInCirculation: bigint;
    readonly totalMaxTokenSupply: bigint;
    readonly largestAssetByMarketCap: Hex;
    readonly mostActiveAssetByVolume: Hex;
}

export interface UserPortfolioDetails {
    readonly userAddress: Hex;
    readonly totalPortfolioValue: bigint;
    readonly totalInvestedAmount: bigint;
    readonly totalRealizedPnL: bigint;
    readonly totalUnrealizedPnL: bigint;
    readonly totalFeesPaid: bigint;
    readonly numberOfAssetsHeld: bigint;
    readonly heldAssetAddresses: readonly Hex[];
    readonly assetHoldings: readonly UserAssetInfo[];
    readonly isActiveTrader: boolean;
}

// For getMultipleAssetAnalytics which returns a tuple of arrays
export type MultipleAssetAnalytics = readonly [
    readonly FullAssetDetails[],
    readonly TradingMetrics[],
    readonly MarketAnalysis[]
];

// USDTMock.sol specific (if any raw types needed beyond simple returns)
// Example: if mintTestTokens returned a struct, it would go here.
// For simple return types like transaction hashes or booleans, specific types might not be needed here.


// General response types for tools, incorporating formatted strings and potential errors
export interface ContractErrorResponse {
    readonly error: string;
}

export interface TransactionSuccessResponse {
    readonly success: true;
    readonly transactionHash: Hex;
    readonly message?: string;
}

// These types represent the raw data structures returned directly by the smart contracts
// before any UI-specific formatting is applied.
// We use `readonly` for array properties to match Viem's inference.


// Representing the tuple returned by ZenovaAssetFactory.getMultipleAssetAnalytics
// This is how Viem will likely return it if the ABI is precise.
export type SolidityMultipleAssetAnalytics = readonly [
    FullAssetDetails[],
    TradingMetrics[],
    MarketAnalysis[]
];

// USDTMock specific (if any complex structs were returned, none for now)

// From ZenovaAsset.sol
// This is an alias for IZenovaAsset.CompanyInfo and is the same as CompanyInfo above.
// Use CompanyInfo for clarity when it refers to the specific struct for createZenovaAsset's argument.
// @ts-ignore
export interface SolidityCompanyInfo extends CompanyInfo {}

export interface SolidityAssetPricingDetails {
    currentPricePerToken: bigint;
    buyFeeBPS: bigint;
    sellFeeBPS: bigint;
    marketCap: bigint;
    lastPriceUpdateTimestamp: bigint;
    acceptedCurrency: Hex;
}

export interface SolidityFullAssetDetails {
    assetAddress: Hex;
    companyDetails: CompanyInfo; // Use the base CompanyInfo type
    pricingDetails: SolidityAssetPricingDetails;
    currentValuation: bigint;
    maxTokenSupply: bigint;
    currentTotalSupply: bigint;
    isTradingActive: boolean;
    admin: Hex;
    priceAI: Hex;
    liquidityManager: Hex;
}

// From ZenovaAssetFactory.sol
export interface SolidityCompanyInitialValuation {
    companyWallet: Hex;
    valuation: bigint;
    initialPricePerToken: bigint;
    evaluatorAI: Hex;
    assessmentTimestamp: bigint; // Solidity uint64 maps to bigint in Viem
    exists: boolean;
}

export interface SolidityCompanyComprehensiveDetails {
    companyWallet: Hex;
    pendingValuation: SolidityCompanyInitialValuation; // This struct is nested
    assetAddresses: Hex[];
    assetDetails: SolidityFullAssetDetails[];
    totalMarketCap: bigint;
    totalTokensIssued: bigint;
    totalTradingVolume: bigint;
    hasActiveAssets: boolean;
}

export interface SolidityPlatformSnapshot {
    totalAssetsCreated: bigint;
    totalCompaniesOnboarded: bigint;
    totalActiveAssets: bigint;
    totalMarketCapitalization: bigint;
    totalTradingVolume: bigint;
    totalFeesCollected: bigint;
    averageAssetMarketCap: bigint;
    totalTokensInCirculation: bigint;
    totalMaxTokenSupply: bigint;
    largestAssetByMarketCap: Hex;
    mostActiveAssetByVolume: Hex;
}

// From ZenovaAsset.sol
export interface SolidityUserAssetInfo {
    tokenBalance: bigint;
    tokenBalanceValue: bigint;
    percentageOfSupply: bigint; // BPS
    totalPurchaseValue: bigint;
    totalSaleValue: bigint;
    totalFeesPaid: bigint;
    lastTradeTimestamp: bigint;
    hasTraded: boolean;
    realizedPnL: bigint;
    unrealizedPnL: bigint;
}

// From ZenovaAssetFactory.sol
export interface SolidityUserPortfolioDetails {
    userAddress: Hex;
    totalPortfolioValue: bigint;
    totalInvestedAmount: bigint;
    totalRealizedPnL: bigint;
    totalUnrealizedPnL: bigint;
    totalFeesPaid: bigint;
    numberOfAssetsHeld: bigint;
    heldAssetAddresses: Hex[];
    assetHoldings: SolidityUserAssetInfo[];
    isActiveTrader: boolean;
}

// From ZenovaAsset.sol
// For getAssetSnapshot which returns a tuple
export type SolidityAssetSnapshot = readonly [
    currentPrice: bigint,
    totalSupply: bigint,
    marketCap: bigint,
    contractBalance: bigint,
    isTradingActive: boolean,
    lastPriceUpdate: bigint
];

// For getMultipleAssetAnalytics in ZenovaAssetFactory.sol which returns a tuple of arrays
// These are defined in ZenovaAsset.sol
export interface SolidityTradingMetrics {
    totalVolumeTraded: bigint;
    totalTokensTraded: bigint;
    totalBuyTransactions: bigint;
    totalSellTransactions: bigint;
    totalFeesCollected: bigint;
    averageTradeSize: bigint;
    lastTradeTimestamp: bigint;
    priceVolatility: bigint; // Assuming BPS
}





// Note: The names Solidity* are to distinguish that these are raw Viem outputs
// before they are processed by formatters into strings for Formatted* types.
// The 'CompanyInfo' interface specifically matches the struct in ZenovaAsset.sol
// and is used in ZenovaAssetFactory.sol for the createZenovaAsset function argument. 
import { Hex } from "viem";

// Formatted types for application use, derived from zenovaBlockchainTypes.ts
// All BigInts are converted to strings with appropriate formatting.

export interface FormattedCompanyInfo {
    name: string;
    symbol: string;
    description: string;
    website: string;
    issuingCompanyWallet: Hex; // Formatted address
}

export interface FormattedAssetPricingDetails {
    currentPricePerToken: string; // Formatted token amount
    buyFeeBPS: string; // Formatted BPS
    sellFeeBPS: string; // Formatted BPS
    marketCap: string; // Formatted token amount
    lastPriceUpdateTimestamp: string; // Formatted timestamp
    acceptedCurrency: Hex; // Formatted address
}

export interface FormattedFullAssetDetails {
    assetAddress: Hex; // Formatted address
    companyDetails: FormattedCompanyInfo;
    pricingDetails: FormattedAssetPricingDetails;
    currentValuation: string; // Formatted token amount
    maxTokenSupply: string; // Formatted token amount (asset's own token, typically 18 dec)
    currentTotalSupply: string; // Formatted token amount (asset's own token, typically 18 dec)
    isTradingActive: boolean;
    admin: Hex; // Formatted address
    priceAI: Hex; // Formatted address
    liquidityManager: Hex; // Formatted address
}

export interface FormattedCompanyInitialValuation {
    companyWallet: Hex; // Formatted address
    valuation: string; // Formatted token amount (likely in factory's acceptedCurrency)
    initialPricePerToken: string; // Formatted token amount (likely in factory's acceptedCurrency)
    evaluatorAI: Hex; // Formatted address
    assessmentTimestamp: string; // Formatted timestamp
    exists: boolean;
}

export interface FormattedCompanyComprehensiveDetails {
    companyWallet: Hex; // Formatted address
    pendingValuation?: FormattedCompanyInitialValuation;
    assetAddresses: Hex[]; // Array of formatted addresses
    assetDetails: FormattedFullAssetDetails[];
    totalMarketCap: string; // Formatted token amount
    totalTokensIssued: string; // Formatted token amount (sum of assets' tokens, complex) - assuming a general large number format for now
    totalTradingVolume: string; // Formatted token amount
    hasActiveAssets: boolean;
}

export interface FormattedPlatformSnapshot {
    totalAssetsCreated: string; // Formatted number
    totalCompaniesOnboarded: string; // Formatted number
    totalActiveAssets: string; // Formatted number
    totalMarketCapitalization: string; // Formatted token amount
    totalTradingVolume: string; // Formatted token amount
    totalFeesCollected: string; // Formatted token amount
    averageAssetMarketCap: string; // Formatted token amount
    totalTokensInCirculation: string; // Formatted token amount
    totalMaxTokenSupply: string; // Formatted token amount
    largestAssetByMarketCap: Hex; // Formatted address
    mostActiveAssetByVolume: Hex; // Formatted address
}

export interface FormattedUserAssetInfo {
    tokenBalance: string; // Formatted token amount (asset's own token)
    tokenBalanceValue: string; // Formatted token amount (in asset's acceptedCurrency)
    percentageOfSupplyBPS: string; // Formatted BPS
    totalPurchaseValue: string; // Formatted token amount
    totalSaleValue: string; // Formatted token amount
    totalFeesPaid: string; // Formatted token amount
    lastTradeTimestamp: string; // Formatted timestamp
    hasTraded: boolean;
    realizedPnL: string; // Formatted token amount
    unrealizedPnL: string; // Formatted token amount
}

export interface FormattedUserPortfolioDetails {
    userAddress: Hex; // Formatted address
    totalPortfolioValue: string; // Formatted token amount
    totalInvestedAmount: string; // Formatted token amount
    totalRealizedPnL: string; // Formatted token amount
    totalUnrealizedPnL: string; // Formatted token amount
    totalFeesPaid: string; // Formatted token amount
    numberOfAssetsHeld: string; // Formatted number
    heldAssetAddresses: Hex[]; // Array of formatted addresses
    assetHoldings: FormattedUserAssetInfo[];
    isActiveTrader: boolean;
}

export interface FormattedAssetSnapshot {
    currentPrice: string; // Formatted token amount (in acceptedCurrency of the asset)
    totalSupply: string; // Formatted token amount (asset's own token, 18 dec)
    marketCap: string; // Formatted token amount (in acceptedCurrency of the asset)
    contractBalance: string; // Formatted token amount (of acceptedCurrency in the asset contract)
    isTradingActive: boolean;
    lastPriceUpdate: string; // Formatted timestamp
}

// For getMultipleAssetAnalytics
export interface FormattedTradingMetrics {
    totalVolumeTraded: string; // Formatted token amount
    totalTokensTraded: string; // Formatted token amount (asset's own token)
    totalBuyTransactions: string; // Formatted number
    totalSellTransactions: string; // Formatted number
    totalFeesCollected: string; // Formatted token amount
    averageTradeSize: string; // Formatted token amount (asset's own token)
    lastTradeTimestamp: string; // Formatted timestamp
    priceVolatility: string; // Formatted BPS or number - assuming BPS for now
}

export interface FormattedMarketAnalysis {
    currentMarketCap: string; // Formatted token amount
    fullyDilutedMarketCap: string; // Formatted token amount
    circulationRatioBPS: string; // Formatted BPS
    liquidityRatioBPS: string;   // Formatted BPS
    priceToValuationRatioBPS: string; // Formatted BPS
    isOvervalued: boolean;
    isUndervalued: boolean;
    timeSinceLastPriceUpdate: string; // Formatted duration or timestamp - assuming duration for now
}

export type FormattedMultipleAssetAnalytics = [
    FormattedFullAssetDetails[],
    FormattedTradingMetrics[],
    FormattedMarketAnalysis[]
];

// General response types
export interface ContractErrorResponse {
    error: string;
} 

export interface TransactionSuccessResponse {
    readonly success: true;
    readonly transactionHash: Hex;
    readonly message?: string;
} 

// Interface for the data structure returned by the platform analytics API/hook
export interface PlatformAnalyticsData {
    platformMetrics: {
        totalAssets: number;
        totalMarketCap: number;
        totalVolume: number; // All-time total volume
        activeTraders: number; // Mocked (0)
        totalTransactions: number;
        avgAssetPrice: number;
    };
    volumeChartData: Array<{ name: string; volume: number }>;
    priceChartData: Array<{ name: string; avgPrice: number }>;
    sectorDistributionData: Array<{ name: string; value: number; color: string }>; // Mocked
    additionalPlatformInsights: {
        totalTransactionsFormatted: string;
        averageAssetPriceFormatted: string;
        platformGrowthFormatted: string; // Mocked ("N/A")
        aiEvaluationsFormatted: string; // Mocked ("N/A")
        successRateFormatted: string; // Mocked ("N/A")
    };
} 
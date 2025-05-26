import { zenovaAssetConfig } from "@/generated"; // Assuming zenovaAssetConfig contains ZenovaAsset ABI
import {
  Hex,
  getAddress,
  formatUnits as viemFormatUnits,
  parseUnits,
  BaseError,
} from "viem";
import {
    CompanyInfo as SolidityCompanyInfo,
    AssetPricingDetails as SolidityAssetPricingDetails,
    FullAssetDetails as SolidityFullAssetDetails,
    TradingMetrics as SolidityTradingMetrics,
    MarketAnalysis as SolidityMarketAnalysis,
    UserAssetInfo as SolidityUserAssetInfo,
//   AssetSnapshot as SolidityAssetSnapshot, // Renamed from SolidityAssetSnapshot in types for consistency
} from "./zenovaBlockchainTypes";
import {
    FormattedCompanyInfo,
    FormattedAssetPricingDetails,
    FormattedFullAssetDetails,
    FormattedTradingMetrics,
    FormattedMarketAnalysis,
    FormattedUserAssetInfo,
    FormattedAssetSnapshot,
    ContractErrorResponse,
  TransactionSuccessResponse,
} from "./zenovaFormattedTypes";
import {
    formatUsdtAmount, 
    formatDefaultTokenAmount, 
    formatAddress,
    formatBpsRate,
    formatTimestamp,
    formatDuration,
  formatNumber,
} from "./formatters";
import { publicClient } from "@/src/utils/publicClient";

const ZENOVA_ASSET_ABI = zenovaAssetConfig.abi; // Main ABI for ZenovaAsset
const USDT_DECIMALS = 6; // Fixed: USDT mock has 6 decimals
const DEFAULT_TOKEN_DECIMALS = 18; // Standard for Zenova Assets

function isValidAddress(address: string): boolean {
    try {
        getAddress(address);
        return true;
    } catch {
        return false;
    }
}

// --- ZenovaAsset Getter Functions ---

export async function getAssetCompanyName(
  assetAddress: string
): Promise<string | ContractErrorResponse> {
  if (!isValidAddress(assetAddress))
    return { error: "Invalid asset address provided." };
    try {
        const data = await publicClient.readContract({
            address: assetAddress as Hex,
            abi: ZENOVA_ASSET_ABI,
            functionName: "name",
        });
        return data;
    } catch (err: unknown) {
    const errorMessage =
      err instanceof BaseError
        ? err.shortMessage
        : err instanceof Error
        ? err.message
        : String(err);
    console.error(
      `Error in getAssetCompanyName for ${assetAddress}: ${errorMessage}`
    );
    return { error: `An unexpected error occurred: ${errorMessage}` };
  }
}

export async function getAssetSymbol(
  assetAddress: string
): Promise<string | ContractErrorResponse> {
  if (!isValidAddress(assetAddress))
    return { error: "Invalid asset address provided." };
    try {
        const data = await publicClient.readContract({
            address: assetAddress as Hex,
            abi: ZENOVA_ASSET_ABI,
            functionName: "symbol",
        });
        return data;
    } catch (err: unknown) {
    const errorMessage =
      err instanceof BaseError
        ? err.shortMessage
        : err instanceof Error
        ? err.message
        : String(err);
    console.error(
      `Error in getAssetSymbol for ${assetAddress}: ${errorMessage}`
    );
    return { error: `An unexpected error occurred: ${errorMessage}` };
  }
}

export async function getAssetDecimals(
  assetAddress: string
): Promise<string | ContractErrorResponse> {
  if (!isValidAddress(assetAddress))
    return { error: "Invalid asset address provided." };
    try {
        const data = await publicClient.readContract({
            address: assetAddress as Hex,
            abi: ZENOVA_ASSET_ABI,
            functionName: "decimals",
        });
        return formatNumber(data); // decimals is uint8
    } catch (err: unknown) {
    const errorMessage =
      err instanceof BaseError
        ? err.shortMessage
        : err instanceof Error
        ? err.message
        : String(err);
    console.error(
      `Error in getAssetDecimals for ${assetAddress}: ${errorMessage}`
    );
    return { error: `An unexpected error occurred: ${errorMessage}` };
  }
}

export async function getAssetTotalSupply(
  assetAddress: string
): Promise<string | ContractErrorResponse> {
  if (!isValidAddress(assetAddress))
    return { error: "Invalid asset address provided." };
    try {
        const data = await publicClient.readContract({
            address: assetAddress as Hex,
            abi: ZENOVA_ASSET_ABI,
            functionName: "totalSupply",
        });
        return formatDefaultTokenAmount(data);
    } catch (err: unknown) {
    const errorMessage =
      err instanceof BaseError
        ? err.shortMessage
        : err instanceof Error
        ? err.message
        : String(err);
    console.error(
      `Error in getAssetTotalSupply for ${assetAddress}: ${errorMessage}`
    );
    return { error: `An unexpected error occurred: ${errorMessage}` };
  }
}

export async function getAssetBalanceOf(
  assetAddress: string,
  account: string
): Promise<string | ContractErrorResponse> {
  if (!isValidAddress(assetAddress))
    return { error: "Invalid asset address provided." };
  if (!isValidAddress(account))
    return { error: "Invalid account address provided." };
    try {
        const data = await publicClient.readContract({
            address: assetAddress as Hex,
            abi: ZENOVA_ASSET_ABI,
            functionName: "balanceOf",
      args: [account as Hex],
        });
        return formatDefaultTokenAmount(data);
    } catch (err: unknown) {
    const errorMessage =
      err instanceof BaseError
        ? err.shortMessage
        : err instanceof Error
        ? err.message
        : String(err);
    console.error(
      `Error in getAssetBalanceOf for ${assetAddress}, account ${account}: ${errorMessage}`
    );
    return { error: `An unexpected error occurred: ${errorMessage}` };
  }
}

export async function getAssetCompanyInfo(
  assetAddress: string
): Promise<FormattedCompanyInfo | ContractErrorResponse> {
  if (!isValidAddress(assetAddress))
    return { error: "Invalid asset address provided." };
    try {
        const rawResult: SolidityCompanyInfo = await publicClient.readContract({
            address: assetAddress as Hex,
            abi: ZENOVA_ASSET_ABI,
            functionName: "getCompanyInfo",
        });
        return {
            name: rawResult.name,
            symbol: rawResult.symbol,
            description: rawResult.description,
            website: rawResult.website,
            issuingCompanyWallet: formatAddress(rawResult.issuingCompanyWallet),
        };
    } catch (err: unknown) {
    const errorMessage =
      err instanceof BaseError
        ? err.shortMessage
        : err instanceof Error
        ? err.message
        : String(err);
    console.error(
      `Error in getAssetCompanyInfo for ${assetAddress}: ${errorMessage}`
    );
    return { error: `An unexpected error occurred: ${errorMessage}` };
  }
}

export async function getAssetPricingDetailsInfo(
  assetAddress: string
): Promise<FormattedAssetPricingDetails | ContractErrorResponse> {
  if (!isValidAddress(assetAddress))
    return { error: "Invalid asset address provided." };
  try {
    const rawResult: SolidityAssetPricingDetails =
      await publicClient.readContract({
            address: assetAddress as Hex,
            abi: ZENOVA_ASSET_ABI,
            functionName: "getAssetPricingDetails",
        });
        return {
      currentPricePerToken: viemFormatUnits(
        rawResult.currentPricePerToken,
        USDT_DECIMALS
      ),
            buyFeeBPS: formatBpsRate(rawResult.buyFeeBPS),
            sellFeeBPS: formatBpsRate(rawResult.sellFeeBPS),
            marketCap: viemFormatUnits(rawResult.marketCap, USDT_DECIMALS),
      lastPriceUpdateTimestamp: formatTimestamp(
        rawResult.lastPriceUpdateTimestamp
      ),
            acceptedCurrency: formatAddress(rawResult.acceptedCurrency),
        };
    } catch (err: unknown) {
    const errorMessage =
      err instanceof BaseError
        ? err.shortMessage
        : err instanceof Error
        ? err.message
        : String(err);
    console.error(
      `Error in getAssetPricingDetailsInfo for ${assetAddress}: ${errorMessage}`
    );
    return { error: `An unexpected error occurred: ${errorMessage}` };
  }
}

export async function getAssetFullDetailsInfo(
  assetAddress: string
): Promise<FormattedFullAssetDetails | ContractErrorResponse> {
  if (!isValidAddress(assetAddress))
    return { error: "Invalid asset address provided." };
  try {
    const rawResult: SolidityFullAssetDetails = await publicClient.readContract(
      {
            address: assetAddress as Hex,
            abi: ZENOVA_ASSET_ABI,
            functionName: "getFullAssetDetails",
      }
    );
        return {
            assetAddress: formatAddress(rawResult.assetAddress), // Should be the input assetAddress
            companyDetails: {
                name: rawResult.companyDetails.name,
                symbol: rawResult.companyDetails.symbol,
                description: rawResult.companyDetails.description,
                website: rawResult.companyDetails.website,
        issuingCompanyWallet: formatAddress(
          rawResult.companyDetails.issuingCompanyWallet
        ),
            },
            pricingDetails: {
        currentPricePerToken: viemFormatUnits(
          rawResult.pricingDetails.currentPricePerToken,
          USDT_DECIMALS
        ),
                buyFeeBPS: formatBpsRate(rawResult.pricingDetails.buyFeeBPS),
                sellFeeBPS: formatBpsRate(rawResult.pricingDetails.sellFeeBPS),
        marketCap: viemFormatUnits(
          rawResult.pricingDetails.marketCap,
          USDT_DECIMALS
        ),
        lastPriceUpdateTimestamp: formatTimestamp(
          rawResult.pricingDetails.lastPriceUpdateTimestamp
        ),
        acceptedCurrency: formatAddress(
          rawResult.pricingDetails.acceptedCurrency
        ),
            },
            currentValuation: formatUsdtAmount(rawResult.currentValuation),
            maxTokenSupply: formatDefaultTokenAmount(rawResult.maxTokenSupply),
      currentTotalSupply: formatDefaultTokenAmount(
        rawResult.currentTotalSupply
      ),
            isTradingActive: rawResult.isTradingActive,
            admin: formatAddress(rawResult.admin),
            priceAI: formatAddress(rawResult.priceAI),
            liquidityManager: formatAddress(rawResult.liquidityManager),
        };
    } catch (err: unknown) {
    const errorMessage =
      err instanceof BaseError
        ? err.shortMessage
        : err instanceof Error
        ? err.message
        : String(err);
    console.error(
      `Error in getAssetFullDetailsInfo for ${assetAddress}: ${errorMessage}`
    );
    return { error: `An unexpected error occurred: ${errorMessage}` };
  }
}

export async function getAssetCurrentValuation(
  assetAddress: string
): Promise<string | ContractErrorResponse> {
  if (!isValidAddress(assetAddress))
    return { error: "Invalid asset address provided." };
    try {
        const data = await publicClient.readContract({
            address: assetAddress as Hex,
            abi: ZENOVA_ASSET_ABI,
            functionName: "currentValuation",
        });
        return formatUsdtAmount(data);
    } catch (err: unknown) {
    const errorMessage =
      err instanceof BaseError
        ? err.shortMessage
        : err instanceof Error
        ? err.message
        : String(err);
    console.error(
      `Error in getAssetCurrentValuation for ${assetAddress}: ${errorMessage}`
    );
    return { error: `An unexpected error occurred: ${errorMessage}` };
  }
}

export async function getAssetMaxTokenSupply(
  assetAddress: string
): Promise<string | ContractErrorResponse> {
  if (!isValidAddress(assetAddress))
    return { error: "Invalid asset address provided." };
    try {
        const data = await publicClient.readContract({
            address: assetAddress as Hex,
            abi: ZENOVA_ASSET_ABI,
            functionName: "maxTokenSupply",
        });
        return formatDefaultTokenAmount(data);
    } catch (err: unknown) {
    const errorMessage =
      err instanceof BaseError
        ? err.shortMessage
        : err instanceof Error
        ? err.message
        : String(err);
    console.error(
      `Error in getAssetMaxTokenSupply for ${assetAddress}: ${errorMessage}`
    );
    return { error: `An unexpected error occurred: ${errorMessage}` };
  }
}

export async function getAssetIsTradingActive(
  assetAddress: string
): Promise<boolean | ContractErrorResponse> {
  if (!isValidAddress(assetAddress))
    return { error: "Invalid asset address provided." };
    try {
        const data = await publicClient.readContract({
            address: assetAddress as Hex,
            abi: ZENOVA_ASSET_ABI,
            functionName: "isTradingActive", // Or "tradingActive"
        });
        return data;
    } catch (err: unknown) {
    const errorMessage =
      err instanceof BaseError
        ? err.shortMessage
        : err instanceof Error
        ? err.message
        : String(err);
    console.error(
      `Error in getAssetIsTradingActive for ${assetAddress}: ${errorMessage}`
    );
    return { error: `An unexpected error occurred: ${errorMessage}` };
  }
}

export async function getAssetCollectedFees(
  assetAddress: string
): Promise<string | ContractErrorResponse> {
  if (!isValidAddress(assetAddress))
    return { error: "Invalid asset address provided." };
    try {
        const data = await publicClient.readContract({
            address: assetAddress as Hex,
            abi: ZENOVA_ASSET_ABI,
            functionName: "getCollectedFees", // Or "collectedFees"
        });
        return formatUsdtAmount(data);
    } catch (err: unknown) {
    const errorMessage =
      err instanceof BaseError
        ? err.shortMessage
        : err instanceof Error
        ? err.message
        : String(err);
    console.error(
      `Error in getAssetCollectedFees for ${assetAddress}: ${errorMessage}`
    );
    return { error: `An unexpected error occurred: ${errorMessage}` };
    }
}

export async function getAssetBuyQuote(
    assetAddress: string, 
    tokenAmountToBuy: string // Human-readable default token amount
): Promise<{ totalCost: string; fee: string } | ContractErrorResponse> {
  if (!isValidAddress(assetAddress))
    return { error: "Invalid asset address provided." };
  if (parseFloat(tokenAmountToBuy) <= 0)
    return { error: "Token amount to buy must be positive." };
    try {
        const amountWei = parseUnits(tokenAmountToBuy, DEFAULT_TOKEN_DECIMALS);
        const result = await publicClient.readContract({
            address: assetAddress as Hex,
            abi: ZENOVA_ASSET_ABI,
            functionName: "getBuyQuote",
      args: [amountWei],
        });
        // result is a tuple: [totalCost, fee]
        return {
            totalCost: formatUsdtAmount(result[0]),
            fee: formatUsdtAmount(result[1]),
        };
    } catch (err: unknown) {
    const errorMessage =
      err instanceof BaseError
        ? err.shortMessage
        : err instanceof Error
        ? err.message
        : String(err);
    console.error(
      `Error in getAssetBuyQuote for ${assetAddress}: ${errorMessage}`
    );
    return { error: `An unexpected error occurred: ${errorMessage}` };
    }
}

export async function getAssetSellQuote(
    assetAddress: string, 
    tokenAmountToSell: string // Human-readable default token amount
): Promise<{ proceeds: string; fee: string } | ContractErrorResponse> {
  if (!isValidAddress(assetAddress))
    return { error: "Invalid asset address provided." };
  if (parseFloat(tokenAmountToSell) <= 0)
    return { error: "Token amount to sell must be positive." };
    try {
        const amountWei = parseUnits(tokenAmountToSell, DEFAULT_TOKEN_DECIMALS);
        const result = await publicClient.readContract({
            address: assetAddress as Hex,
            abi: ZENOVA_ASSET_ABI,
            functionName: "getSellQuote",
      args: [amountWei],
        });
        // result is a tuple: [proceeds, fee]
        return {
            proceeds: formatUsdtAmount(result[0]),
            fee: formatUsdtAmount(result[1]),
        };
    } catch (err: unknown) {
    const errorMessage =
      err instanceof BaseError
        ? err.shortMessage
        : err instanceof Error
        ? err.message
        : String(err);
    console.error(
      `Error in getAssetSellQuote for ${assetAddress}: ${errorMessage}`
    );
    return { error: `An unexpected error occurred: ${errorMessage}` };
  }
}

export async function getAssetTradingMetrics(
  assetAddress: string
): Promise<FormattedTradingMetrics | ContractErrorResponse> {
  if (!isValidAddress(assetAddress))
    return { error: "Invalid asset address provided." };
    try {
        const rawResult: SolidityTradingMetrics = await publicClient.readContract({
            address: assetAddress as Hex,
            abi: ZENOVA_ASSET_ABI,
            functionName: "getTradingMetrics",
        });
        return {
            totalVolumeTraded: formatUsdtAmount(rawResult.totalVolumeTraded),
            totalTokensTraded: formatDefaultTokenAmount(rawResult.totalTokensTraded),
            totalBuyTransactions: formatNumber(rawResult.totalBuyTransactions),
            totalSellTransactions: formatNumber(rawResult.totalSellTransactions),
            totalFeesCollected: formatUsdtAmount(rawResult.totalFeesCollected),
            averageTradeSize: formatUsdtAmount(rawResult.averageTradeSize), // averageTradeSize is in acceptedCurrency
            lastTradeTimestamp: formatTimestamp(rawResult.lastTradeTimestamp),
            priceVolatility: formatBpsRate(rawResult.priceVolatility), // Assuming BPS, though it's 0 in contract for now
        };
    } catch (err: unknown) {
    const errorMessage =
      err instanceof BaseError
        ? err.shortMessage
        : err instanceof Error
        ? err.message
        : String(err);
    console.error(
      `Error in getAssetTradingMetrics for ${assetAddress}: ${errorMessage}`
    );
    return { error: `An unexpected error occurred: ${errorMessage}` };
  }
}

export async function getAssetMarketAnalysis(
  assetAddress: string
): Promise<FormattedMarketAnalysis | ContractErrorResponse> {
  if (!isValidAddress(assetAddress))
    return { error: "Invalid asset address provided." };
    try {
        const rawResult: SolidityMarketAnalysis = await publicClient.readContract({
            address: assetAddress as Hex,
            abi: ZENOVA_ASSET_ABI,
            functionName: "getMarketAnalysis",
        });
        return {
            currentMarketCap: formatUsdtAmount(rawResult.currentMarketCap),
            fullyDilutedMarketCap: formatUsdtAmount(rawResult.fullyDilutedMarketCap),
            circulationRatioBPS: formatBpsRate(rawResult.circulationRatio),
            liquidityRatioBPS: formatBpsRate(rawResult.liquidityRatio),
            priceToValuationRatioBPS: formatBpsRate(rawResult.priceToValuationRatio),
            isOvervalued: rawResult.isOvervalued,
            isUndervalued: rawResult.isUndervalued,
      timeSinceLastPriceUpdate: formatDuration(
        rawResult.timeSinceLastPriceUpdate
      ),
        };
    } catch (err: unknown) {
    const errorMessage =
      err instanceof BaseError
        ? err.shortMessage
        : err instanceof Error
        ? err.message
        : String(err);
    console.error(
      `Error in getAssetMarketAnalysis for ${assetAddress}: ${errorMessage}`
    );
    return { error: `An unexpected error occurred: ${errorMessage}` };
    }
}

export async function getAssetUserAssetInfo(
    assetAddress: string, 
    user: string
): Promise<FormattedUserAssetInfo | ContractErrorResponse> {
  if (!isValidAddress(assetAddress))
    return { error: "Invalid asset address provided." };
    if (!isValidAddress(user)) return { error: "Invalid user address provided." };
    try {
        const rawResult: SolidityUserAssetInfo = await publicClient.readContract({
            address: assetAddress as Hex,
            abi: ZENOVA_ASSET_ABI,
            functionName: "getUserAssetInfo",
      args: [user as Hex],
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
            unrealizedPnL: formatUsdtAmount(rawResult.unrealizedPnL),
        };
    } catch (err: unknown) {
    const errorMessage =
      err instanceof BaseError
        ? err.shortMessage
        : err instanceof Error
        ? err.message
        : String(err);
    console.error(
      `Error in getAssetUserAssetInfo for ${assetAddress}, user ${user}: ${errorMessage}`
    );
    return { error: `An unexpected error occurred: ${errorMessage}` };
  }
}

export async function getAssetSnapshotInfo(
  assetAddress: string
): Promise<FormattedAssetSnapshot | ContractErrorResponse> {
  if (!isValidAddress(assetAddress))
    return { error: "Invalid asset address provided." };
    try {
        // The contract returns a tuple, Viem simulation/read will return an array.
        const result = await publicClient.readContract({
            address: assetAddress as Hex,
            abi: ZENOVA_ASSET_ABI,
            functionName: "getAssetSnapshot",
        });
        // Explicitly cast result to the expected array structure based on SolidityAssetSnapshot type
    const rawSnapshot = result as unknown as [
      bigint,
      bigint,
      bigint,
      bigint,
      boolean,
      bigint
    ];
        
        return {
            currentPrice: formatUsdtAmount(rawSnapshot[0]),
            totalSupply: formatDefaultTokenAmount(rawSnapshot[1]),
            marketCap: formatUsdtAmount(rawSnapshot[2]),
            contractBalance: formatUsdtAmount(rawSnapshot[3]), // Balance of acceptedCurrency in the asset contract
            isTradingActive: rawSnapshot[4],
            lastPriceUpdate: formatTimestamp(rawSnapshot[5]),
        };
    } catch (err: unknown) {
    const errorMessage =
      err instanceof BaseError
        ? err.shortMessage
        : err instanceof Error
        ? err.message
        : String(err);
    console.error(
      `Error in getAssetSnapshotInfo for ${assetAddress}: ${errorMessage}`
    );
    return { error: `An unexpected error occurred: ${errorMessage}` };
  }
}

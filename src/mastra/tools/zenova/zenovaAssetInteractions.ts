import { publicClient, aiWalletClient } from "../../../../viemConfig";
import { zenovaAssetConfig, usdtMockConfig } from "@/generated"; // Assuming zenovaAssetConfig contains ZenovaAsset ABI
import { Hex, getAddress, formatUnits as viemFormatUnits, parseUnits, BaseError } from "viem";
import {
    CompanyInfo as SolidityCompanyInfo,
    AssetPricingDetails as SolidityAssetPricingDetails,
    FullAssetDetails as SolidityFullAssetDetails,
    TradingMetrics as SolidityTradingMetrics,
    MarketAnalysis as SolidityMarketAnalysis,
    UserAssetInfo as SolidityUserAssetInfo,
    AssetSnapshot as SolidityAssetSnapshot // Renamed from SolidityAssetSnapshot in types for consistency
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
    TransactionSuccessResponse
} from "./zenovaFormattedTypes";
import {
    formatUsdtAmount, 
    formatDefaultTokenAmount, 
    formatAddress,
    formatBpsRate,
    formatTimestamp,
    formatDuration,
    formatNumber
} from "./formatters";

const ZENOVA_ASSET_ABI = zenovaAssetConfig.abi; // Main ABI for ZenovaAsset
const USDT_DECIMALS =  6; // Fixed: USDT mock has 6 decimals
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

export async function getAssetCompanyName(assetAddress: string): Promise<string | ContractErrorResponse> {
    if (!isValidAddress(assetAddress)) return { error: "Invalid asset address provided." };
    try {
        const data = await publicClient.readContract({
            address: assetAddress as Hex,
            abi: ZENOVA_ASSET_ABI,
            functionName: "name",
        });
        return data;
    } catch (err: unknown) {
        const errorMessage = err instanceof BaseError ? err.shortMessage : (err instanceof Error ? err.message : String(err));
        console.error(`Error in getAssetCompanyName for ${assetAddress}: ${errorMessage}`);
        return { error: `An unexpected error occurred: ${errorMessage}` };
    }
}

export async function getAssetSymbol(assetAddress: string): Promise<string | ContractErrorResponse> {
    if (!isValidAddress(assetAddress)) return { error: "Invalid asset address provided." };
    try {
        const data = await publicClient.readContract({
            address: assetAddress as Hex,
            abi: ZENOVA_ASSET_ABI,
            functionName: "symbol",
        });
        return data;
    } catch (err: unknown) {
        const errorMessage = err instanceof BaseError ? err.shortMessage : (err instanceof Error ? err.message : String(err));
        console.error(`Error in getAssetSymbol for ${assetAddress}: ${errorMessage}`);
        return { error: `An unexpected error occurred: ${errorMessage}` };
    }
}

export async function getAssetDecimals(assetAddress: string): Promise<string | ContractErrorResponse> {
    if (!isValidAddress(assetAddress)) return { error: "Invalid asset address provided." };
    try {
        const data = await publicClient.readContract({
            address: assetAddress as Hex,
            abi: ZENOVA_ASSET_ABI,
            functionName: "decimals",
        });
        return formatNumber(data); // decimals is uint8
    } catch (err: unknown) {
        const errorMessage = err instanceof BaseError ? err.shortMessage : (err instanceof Error ? err.message : String(err));
        console.error(`Error in getAssetDecimals for ${assetAddress}: ${errorMessage}`);
        return { error: `An unexpected error occurred: ${errorMessage}` };
    }
}

export async function getAssetTotalSupply(assetAddress: string): Promise<string | ContractErrorResponse> {
    if (!isValidAddress(assetAddress)) return { error: "Invalid asset address provided." };
    try {
        const data = await publicClient.readContract({
            address: assetAddress as Hex,
            abi: ZENOVA_ASSET_ABI,
            functionName: "totalSupply",
        });
        return formatDefaultTokenAmount(data);
    } catch (err: unknown) {
        const errorMessage = err instanceof BaseError ? err.shortMessage : (err instanceof Error ? err.message : String(err));
        console.error(`Error in getAssetTotalSupply for ${assetAddress}: ${errorMessage}`);
        return { error: `An unexpected error occurred: ${errorMessage}` };
    }
}

export async function getAssetBalanceOf(assetAddress: string, account: string): Promise<string | ContractErrorResponse> {
    if (!isValidAddress(assetAddress)) return { error: "Invalid asset address provided." };
    if (!isValidAddress(account)) return { error: "Invalid account address provided." };
    try {
        const data = await publicClient.readContract({
            address: assetAddress as Hex,
            abi: ZENOVA_ASSET_ABI,
            functionName: "balanceOf",
            args: [account as Hex]
        });
        return formatDefaultTokenAmount(data);
    } catch (err: unknown) {
        const errorMessage = err instanceof BaseError ? err.shortMessage : (err instanceof Error ? err.message : String(err));
        console.error(`Error in getAssetBalanceOf for ${assetAddress}, account ${account}: ${errorMessage}`);
        return { error: `An unexpected error occurred: ${errorMessage}` };
    }
}

export async function getAssetCompanyInfo(assetAddress: string): Promise<FormattedCompanyInfo | ContractErrorResponse> {
    if (!isValidAddress(assetAddress)) return { error: "Invalid asset address provided." };
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
        const errorMessage = err instanceof BaseError ? err.shortMessage : (err instanceof Error ? err.message : String(err));
        console.error(`Error in getAssetCompanyInfo for ${assetAddress}: ${errorMessage}`);
        return { error: `An unexpected error occurred: ${errorMessage}` };
    }
}

export async function getAssetPricingDetailsInfo(assetAddress: string): Promise<FormattedAssetPricingDetails | ContractErrorResponse> {
    if (!isValidAddress(assetAddress)) return { error: "Invalid asset address provided." };
    try {
        const rawResult: SolidityAssetPricingDetails = await publicClient.readContract({
            address: assetAddress as Hex,
            abi: ZENOVA_ASSET_ABI,
            functionName: "getAssetPricingDetails",
        });
        return {
            currentPricePerToken: viemFormatUnits(rawResult.currentPricePerToken, USDT_DECIMALS),
            buyFeeBPS: formatBpsRate(rawResult.buyFeeBPS),
            sellFeeBPS: formatBpsRate(rawResult.sellFeeBPS),
            marketCap: viemFormatUnits(rawResult.marketCap, USDT_DECIMALS),
            lastPriceUpdateTimestamp: formatTimestamp(rawResult.lastPriceUpdateTimestamp),
            acceptedCurrency: formatAddress(rawResult.acceptedCurrency),
        };
    } catch (err: unknown) {
        const errorMessage = err instanceof BaseError ? err.shortMessage : (err instanceof Error ? err.message : String(err));
        console.error(`Error in getAssetPricingDetailsInfo for ${assetAddress}: ${errorMessage}`);
        return { error: `An unexpected error occurred: ${errorMessage}` };
    }
}

export async function getAssetFullDetailsInfo(assetAddress: string): Promise<FormattedFullAssetDetails | ContractErrorResponse> {
    if (!isValidAddress(assetAddress)) return { error: "Invalid asset address provided." };
    try {
        const rawResult: SolidityFullAssetDetails = await publicClient.readContract({
            address: assetAddress as Hex,
            abi: ZENOVA_ASSET_ABI,
            functionName: "getFullAssetDetails",
        });
        return {
            assetAddress: formatAddress(rawResult.assetAddress), // Should be the input assetAddress
            companyDetails: {
                name: rawResult.companyDetails.name,
                symbol: rawResult.companyDetails.symbol,
                description: rawResult.companyDetails.description,
                website: rawResult.companyDetails.website,
                issuingCompanyWallet: formatAddress(rawResult.companyDetails.issuingCompanyWallet),
            },
            pricingDetails: {
                currentPricePerToken: viemFormatUnits(rawResult.pricingDetails.currentPricePerToken, USDT_DECIMALS),
                buyFeeBPS: formatBpsRate(rawResult.pricingDetails.buyFeeBPS),
                sellFeeBPS: formatBpsRate(rawResult.pricingDetails.sellFeeBPS),
                marketCap: viemFormatUnits(rawResult.pricingDetails.marketCap, USDT_DECIMALS),
                lastPriceUpdateTimestamp: formatTimestamp(rawResult.pricingDetails.lastPriceUpdateTimestamp),
                acceptedCurrency: formatAddress(rawResult.pricingDetails.acceptedCurrency),
            },
            currentValuation: formatUsdtAmount(rawResult.currentValuation),
            maxTokenSupply: formatDefaultTokenAmount(rawResult.maxTokenSupply),
            currentTotalSupply: formatDefaultTokenAmount(rawResult.currentTotalSupply),
            isTradingActive: rawResult.isTradingActive,
            admin: formatAddress(rawResult.admin),
            priceAI: formatAddress(rawResult.priceAI),
            liquidityManager: formatAddress(rawResult.liquidityManager),
        };
    } catch (err: unknown) {
        const errorMessage = err instanceof BaseError ? err.shortMessage : (err instanceof Error ? err.message : String(err));
        console.error(`Error in getAssetFullDetailsInfo for ${assetAddress}: ${errorMessage}`);
        return { error: `An unexpected error occurred: ${errorMessage}` };
    }
}

export async function getAssetCurrentValuation(assetAddress: string): Promise<string | ContractErrorResponse> {
    if (!isValidAddress(assetAddress)) return { error: "Invalid asset address provided." };
    try {
        const data = await publicClient.readContract({
            address: assetAddress as Hex,
            abi: ZENOVA_ASSET_ABI,
            functionName: "currentValuation",
        });
        return formatUsdtAmount(data);
    } catch (err: unknown) {
        const errorMessage = err instanceof BaseError ? err.shortMessage : (err instanceof Error ? err.message : String(err));
        console.error(`Error in getAssetCurrentValuation for ${assetAddress}: ${errorMessage}`);
        return { error: `An unexpected error occurred: ${errorMessage}` };
    }
}

export async function getAssetMaxTokenSupply(assetAddress: string): Promise<string | ContractErrorResponse> {
    if (!isValidAddress(assetAddress)) return { error: "Invalid asset address provided." };
    try {
        const data = await publicClient.readContract({
            address: assetAddress as Hex,
            abi: ZENOVA_ASSET_ABI,
            functionName: "maxTokenSupply",
        });
        return formatDefaultTokenAmount(data);
    } catch (err: unknown) {
        const errorMessage = err instanceof BaseError ? err.shortMessage : (err instanceof Error ? err.message : String(err));
        console.error(`Error in getAssetMaxTokenSupply for ${assetAddress}: ${errorMessage}`);
        return { error: `An unexpected error occurred: ${errorMessage}` };
    }
}

export async function getAssetIsTradingActive(assetAddress: string): Promise<boolean | ContractErrorResponse> {
    if (!isValidAddress(assetAddress)) return { error: "Invalid asset address provided." };
    try {
        const data = await publicClient.readContract({
            address: assetAddress as Hex,
            abi: ZENOVA_ASSET_ABI,
            functionName: "isTradingActive", // Or "tradingActive"
        });
        return data;
    } catch (err: unknown) {
        const errorMessage = err instanceof BaseError ? err.shortMessage : (err instanceof Error ? err.message : String(err));
        console.error(`Error in getAssetIsTradingActive for ${assetAddress}: ${errorMessage}`);
        return { error: `An unexpected error occurred: ${errorMessage}` };
    }
}

export async function getAssetCollectedFees(assetAddress: string): Promise<string | ContractErrorResponse> {
    if (!isValidAddress(assetAddress)) return { error: "Invalid asset address provided." };
    try {
        const data = await publicClient.readContract({
            address: assetAddress as Hex,
            abi: ZENOVA_ASSET_ABI,
            functionName: "getCollectedFees", // Or "collectedFees"
        });
        return formatUsdtAmount(data);
    } catch (err: unknown) {
        const errorMessage = err instanceof BaseError ? err.shortMessage : (err instanceof Error ? err.message : String(err));
        console.error(`Error in getAssetCollectedFees for ${assetAddress}: ${errorMessage}`);
        return { error: `An unexpected error occurred: ${errorMessage}` };
    }
}

export async function getAssetBuyQuote(
    assetAddress: string, 
    tokenAmountToBuy: string // Human-readable default token amount
): Promise<{ totalCost: string; fee: string } | ContractErrorResponse> {
    if (!isValidAddress(assetAddress)) return { error: "Invalid asset address provided." };
    if (parseFloat(tokenAmountToBuy) <= 0) return { error: "Token amount to buy must be positive." };
    try {
        const amountWei = parseUnits(tokenAmountToBuy, DEFAULT_TOKEN_DECIMALS);
        const result = await publicClient.readContract({
            address: assetAddress as Hex,
            abi: ZENOVA_ASSET_ABI,
            functionName: "getBuyQuote",
            args: [amountWei]
        });
        // result is a tuple: [totalCost, fee]
        return {
            totalCost: formatUsdtAmount(result[0]),
            fee: formatUsdtAmount(result[1]),
        };
    } catch (err: unknown) {
        const errorMessage = err instanceof BaseError ? err.shortMessage : (err instanceof Error ? err.message : String(err));
        console.error(`Error in getAssetBuyQuote for ${assetAddress}: ${errorMessage}`);
        return { error: `An unexpected error occurred: ${errorMessage}` };
    }
}

export async function getAssetSellQuote(
    assetAddress: string, 
    tokenAmountToSell: string // Human-readable default token amount
): Promise<{ proceeds: string; fee: string } | ContractErrorResponse> {
    if (!isValidAddress(assetAddress)) return { error: "Invalid asset address provided." };
    if (parseFloat(tokenAmountToSell) <= 0) return { error: "Token amount to sell must be positive." };
    try {
        const amountWei = parseUnits(tokenAmountToSell, DEFAULT_TOKEN_DECIMALS);
        const result = await publicClient.readContract({
            address: assetAddress as Hex,
            abi: ZENOVA_ASSET_ABI,
            functionName: "getSellQuote",
            args: [amountWei]
        });
        // result is a tuple: [proceeds, fee]
        return {
            proceeds: formatUsdtAmount(result[0]),
            fee: formatUsdtAmount(result[1]),
        };
    } catch (err: unknown) {
        const errorMessage = err instanceof BaseError ? err.shortMessage : (err instanceof Error ? err.message : String(err));
        console.error(`Error in getAssetSellQuote for ${assetAddress}: ${errorMessage}`);
        return { error: `An unexpected error occurred: ${errorMessage}` };
    }
}

export async function getAssetTradingMetrics(assetAddress: string): Promise<FormattedTradingMetrics | ContractErrorResponse> {
    if (!isValidAddress(assetAddress)) return { error: "Invalid asset address provided." };
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
        const errorMessage = err instanceof BaseError ? err.shortMessage : (err instanceof Error ? err.message : String(err));
        console.error(`Error in getAssetTradingMetrics for ${assetAddress}: ${errorMessage}`);
        return { error: `An unexpected error occurred: ${errorMessage}` };
    }
}

export async function getAssetMarketAnalysis(assetAddress: string): Promise<FormattedMarketAnalysis | ContractErrorResponse> {
    if (!isValidAddress(assetAddress)) return { error: "Invalid asset address provided." };
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
            timeSinceLastPriceUpdate: formatDuration(rawResult.timeSinceLastPriceUpdate),
        };
    } catch (err: unknown) {
        const errorMessage = err instanceof BaseError ? err.shortMessage : (err instanceof Error ? err.message : String(err));
        console.error(`Error in getAssetMarketAnalysis for ${assetAddress}: ${errorMessage}`);
        return { error: `An unexpected error occurred: ${errorMessage}` };
    }
}

export async function getAssetUserAssetInfo(
    assetAddress: string, 
    user: string
): Promise<FormattedUserAssetInfo | ContractErrorResponse> {
    if (!isValidAddress(assetAddress)) return { error: "Invalid asset address provided." };
    if (!isValidAddress(user)) return { error: "Invalid user address provided." };
    try {
        const rawResult: SolidityUserAssetInfo = await publicClient.readContract({
            address: assetAddress as Hex,
            abi: ZENOVA_ASSET_ABI,
            functionName: "getUserAssetInfo",
            args: [user as Hex]
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
        const errorMessage = err instanceof BaseError ? err.shortMessage : (err instanceof Error ? err.message : String(err));
        console.error(`Error in getAssetUserAssetInfo for ${assetAddress}, user ${user}: ${errorMessage}`);
        return { error: `An unexpected error occurred: ${errorMessage}` };
    }
}

export async function getAssetSnapshotInfo(assetAddress: string): Promise<FormattedAssetSnapshot | ContractErrorResponse> {
    if (!isValidAddress(assetAddress)) return { error: "Invalid asset address provided." };
    try {
        // The contract returns a tuple, Viem simulation/read will return an array.
        const result = await publicClient.readContract({
            address: assetAddress as Hex,
            abi: ZENOVA_ASSET_ABI,
            functionName: "getAssetSnapshot",
        });
        // Explicitly cast result to the expected array structure based on SolidityAssetSnapshot type
        const rawSnapshot = result as unknown as [bigint, bigint, bigint, bigint, boolean, bigint];
        
        return {
            currentPrice: formatUsdtAmount(rawSnapshot[0]),
            totalSupply: formatDefaultTokenAmount(rawSnapshot[1]),
            marketCap: formatUsdtAmount(rawSnapshot[2]),
            contractBalance: formatUsdtAmount(rawSnapshot[3]), // Balance of acceptedCurrency in the asset contract
            isTradingActive: rawSnapshot[4],
            lastPriceUpdate: formatTimestamp(rawSnapshot[5]),
        };
    } catch (err: unknown) {
        const errorMessage = err instanceof BaseError ? err.shortMessage : (err instanceof Error ? err.message : String(err));
        console.error(`Error in getAssetSnapshotInfo for ${assetAddress}: ${errorMessage}`);
        return { error: `An unexpected error occurred: ${errorMessage}` };
    }
}

// --- ZenovaAsset Setter Functions ---


export async function setAssetCompanyValuationAndSupply(
    assetAddress: string,
    companyValuation: string, // Human-readable USDT amount
    initialPricePerToken: string, // Human-readable USDT amount
    evaluator: string // Address of the evaluator (likely AI)
): Promise<TransactionSuccessResponse | ContractErrorResponse> {
    if (!isValidAddress(assetAddress)) return { error: "Invalid asset address provided." };
    if (parseFloat(companyValuation) <= 0) return { error: "Company valuation must be positive." };
    if (parseFloat(initialPricePerToken) <= 0) return { error: "Initial price per token must be positive." };
    if (!isValidAddress(evaluator)) return { error: "Invalid evaluator address provided." };

    try {
        const valuationWei = parseUnits(companyValuation, USDT_DECIMALS);
        const priceWei = parseUnits(initialPricePerToken, USDT_DECIMALS);

        const hash = await aiWalletClient.writeContract({
            address: assetAddress as Hex,
            abi: ZENOVA_ASSET_ABI,
            functionName: "setCompanyValuationAndSupply",
            args: [valuationWei, priceWei, evaluator as Hex],
            account: aiWalletClient.account, // Or the evaluator's account if different
        });
        const receipt = await publicClient.waitForTransactionReceipt({ hash });

        if (receipt.status === 'success') {
            return { success: true, transactionHash: hash, message: "Company valuation and supply set successfully." };
        } else {
            return { error: `Setting company valuation and supply failed. Status: ${receipt.status}` };
        }
    } catch (err: unknown) {
        const errorMessage = err instanceof BaseError ? err.shortMessage : (err instanceof Error ? err.message : String(err));
        console.error(`Error in setAssetCompanyValuationAndSupply for ${assetAddress}: ${errorMessage}`);
        if (errorMessage.includes("AlreadyInitialized")) {
            return { error: "Valuation and supply can only be set once." };
        }
        return { error: `An unexpected error occurred: ${errorMessage}` };
    }
}

export async function updateAssetPrice(
    assetAddress: string,
    newPricePerToken: string // Human-readable USDT amount
): Promise<TransactionSuccessResponse | ContractErrorResponse> {
    if (!isValidAddress(assetAddress)) return { error: "Invalid asset address provided." };
    if (parseFloat(newPricePerToken) <= 0) return { error: "New price must be positive." };

    try {
        const priceWei = parseUnits(newPricePerToken, USDT_DECIMALS);
        const hash = await aiWalletClient.writeContract({
            address: assetAddress as Hex,
            abi: ZENOVA_ASSET_ABI,
            functionName: "updatePrice",
            args: [priceWei],
            account: aiWalletClient.account,
        });
        const receipt = await publicClient.waitForTransactionReceipt({ hash });

        if (receipt.status === 'success') {
            return { success: true, transactionHash: hash, message: "Asset price updated successfully." };
        } else {
            return { error: `Asset price update failed. Status: ${receipt.status}` };
        }
    } catch (err: unknown) {
        const errorMessage = err instanceof BaseError ? err.shortMessage : (err instanceof Error ? err.message : String(err));
        console.error(`Error in updateAssetPrice for ${assetAddress}: ${errorMessage}`);
        return { error: `An unexpected error occurred during price update: ${errorMessage}` };
    }
}

export async function updateAssetLiquidityParameters(
    assetAddress: string,
    newBuyFeeBPS: number,
    newSellFeeBPS: number
): Promise<TransactionSuccessResponse | ContractErrorResponse> {
    if (!isValidAddress(assetAddress)) return { error: "Invalid asset address provided." };
    if (newBuyFeeBPS < 0 || newBuyFeeBPS > 5000) return { error: "Buy fee BPS must be between 0 and 5000 (50%)." };
    if (newSellFeeBPS < 0 || newSellFeeBPS > 5000) return { error: "Sell fee BPS must be between 0 and 5000 (50%)." };

    try {
        const hash = await aiWalletClient.writeContract({
            address: assetAddress as Hex,
            abi: ZENOVA_ASSET_ABI,
            functionName: "updateLiquidityParameters",
            args: [BigInt(newBuyFeeBPS), BigInt(newSellFeeBPS)],
            account: aiWalletClient.account,
        });
        const receipt = await publicClient.waitForTransactionReceipt({ hash });

        if (receipt.status === 'success') {
            return { success: true, transactionHash: hash, message: "Liquidity parameters updated successfully." };
        } else {
            return { error: `Liquidity parameter update failed. Status: ${receipt.status}` };
        }
    } catch (err: unknown) {
        const errorMessage = err instanceof BaseError ? err.shortMessage : (err instanceof Error ? err.message : String(err));
        console.error(`Error in updateAssetLiquidityParameters for ${assetAddress}: ${errorMessage}`);
        if (errorMessage.includes("FeeTooHigh")) {
            return { error: "Fee is too high (e.g., exceeds 50%)." };
        }
        return { error: `An unexpected error occurred: ${errorMessage}` };
    }
}

export async function activateAssetTrading(assetAddress: string): Promise<TransactionSuccessResponse | ContractErrorResponse> {
    if (!isValidAddress(assetAddress)) return { error: "Invalid asset address provided." };
    try {
        const hash = await aiWalletClient.writeContract({
            address: assetAddress as Hex,
            abi: ZENOVA_ASSET_ABI,
            functionName: "activateTrading",
            account: aiWalletClient.account,
        });
        const receipt = await publicClient.waitForTransactionReceipt({ hash });

        if (receipt.status === 'success') {
            return { success: true, transactionHash: hash, message: "Trading activated successfully." };
        } else {
            return { error: `Trading activation failed. Status: ${receipt.status}` };
        }
    } catch (err: unknown) {
        const errorMessage = err instanceof BaseError ? err.shortMessage : (err instanceof Error ? err.message : String(err));
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

export async function deactivateAssetTrading(assetAddress: string): Promise<TransactionSuccessResponse | ContractErrorResponse> {
    if (!isValidAddress(assetAddress)) return { error: "Invalid asset address provided." };
    try {
        const hash = await aiWalletClient.writeContract({
            address: assetAddress as Hex,
            abi: ZENOVA_ASSET_ABI,
            functionName: "deactivateTrading",
            account: aiWalletClient.account,
        });
        const receipt = await publicClient.waitForTransactionReceipt({ hash });

        if (receipt.status === 'success') {
            return { success: true, transactionHash: hash, message: "Trading deactivated successfully." };
        } else {
            return { error: `Trading deactivation failed. Status: ${receipt.status}` };
        }
    } catch (err: unknown) {
        const errorMessage = err instanceof BaseError ? err.shortMessage : (err instanceof Error ? err.message : String(err));
        console.error(`Error in deactivateAssetTrading for ${assetAddress}: ${errorMessage}`);
        if (errorMessage.includes("TradingNotActive")) {
            return { error: "Trading is already inactive." };
        }
        return { error: `An unexpected error occurred: ${errorMessage}` };
    }
}

export async function buyAssetTokens(
    assetAddress: string, 
    tokenAmountToBuy: string // Human-readable amount of asset tokens
): Promise<TransactionSuccessResponse | ContractErrorResponse> {
    if (!isValidAddress(assetAddress)) return { error: "Invalid asset address provided." };
    if (parseFloat(tokenAmountToBuy) <= 0) return { error: "Token amount to buy must be positive." };

    try {
        const amountWei = parseUnits(tokenAmountToBuy, DEFAULT_TOKEN_DECIMALS);
        // For buyTokens, the user needs to have approved the asset contract to spend their USDT.
        // This interaction layer assumes approval is handled externally or by the user.
        // The actual payment occurs via transferFrom within the buyTokens function.

        const hash = await aiWalletClient.writeContract({
            address: assetAddress as Hex,
            abi: ZENOVA_ASSET_ABI,
            functionName: "buyTokens",
            args: [amountWei],
            account: aiWalletClient.account, // The buyer
        });
        const receipt = await publicClient.waitForTransactionReceipt({ hash });

        if (receipt.status === 'success') {
            return { success: true, transactionHash: hash, message: `Successfully bought ${tokenAmountToBuy} tokens from asset ${assetAddress}.` };
        } else {
            return { error: `Buy tokens transaction failed. Status: ${receipt.status}` };
        }
    } catch (err: unknown) {
        const errorMessage = err instanceof BaseError ? err.shortMessage : (err instanceof Error ? err.message : String(err));
        console.error(`Error in buyAssetTokens for ${assetAddress}: ${errorMessage}`);
        if (errorMessage.includes("MaxSupplyReached")) {
            return { error: "Cannot buy, maximum token supply reached." };
        }
        // Add more specific errors like InsufficientAllowance if detectable
        return { error: `An unexpected error occurred: ${errorMessage}` };
    }
}

export async function sellAssetTokens(
    assetAddress: string, 
    tokenAmountToSell: string // Human-readable amount of asset tokens
): Promise<TransactionSuccessResponse | ContractErrorResponse> {
    if (!isValidAddress(assetAddress)) return { error: "Invalid asset address provided." };
    if (parseFloat(tokenAmountToSell) <= 0) return { error: "Token amount to sell must be positive." };

    try {
        const amountWei = parseUnits(tokenAmountToSell, DEFAULT_TOKEN_DECIMALS);
        // Seller needs to have the tokens and the contract needs sufficient acceptedCurrency liquidity.

        const hash = await aiWalletClient.writeContract({
            address: assetAddress as Hex,
            abi: ZENOVA_ASSET_ABI,
            functionName: "sellTokens",
            args: [amountWei],
            account: aiWalletClient.account, // The seller
        });
        const receipt = await publicClient.waitForTransactionReceipt({ hash });

        if (receipt.status === 'success') {
            return { success: true, transactionHash: hash, message: `Successfully sold ${tokenAmountToSell} tokens from asset ${assetAddress}.` };
        } else {
            return { error: `Sell tokens transaction failed. Status: ${receipt.status}` };
        }
    } catch (err: unknown) {
        const errorMessage = err instanceof BaseError ? err.shortMessage : (err instanceof Error ? err.message : String(err));
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

export async function withdrawAssetFees(
    assetAddress: string, 
    recipient: string
): Promise<TransactionSuccessResponse | ContractErrorResponse> {
    if (!isValidAddress(assetAddress)) return { error: "Invalid asset address provided." };
    if (!isValidAddress(recipient)) return { error: "Invalid recipient address for fees." };

    try {
        const hash = await aiWalletClient.writeContract({
            address: assetAddress as Hex,
            abi: ZENOVA_ASSET_ABI,
            functionName: "withdrawFees",
            args: [recipient as Hex],
            account: aiWalletClient.account, // Caller must have AI_ROLE on the asset
        });
        const receipt = await publicClient.waitForTransactionReceipt({ hash });

        if (receipt.status === 'success') {
            return { success: true, transactionHash: hash, message: "Asset fees withdrawn successfully." };
        } else {
            return { error: `Withdraw fees transaction failed. Status: ${receipt.status}` };
        }
    } catch (err: unknown) {
        const errorMessage = err instanceof BaseError ? err.shortMessage : (err instanceof Error ? err.message : String(err));
        console.error(`Error in withdrawAssetFees for ${assetAddress}: ${errorMessage}`);
        if (errorMessage.includes("NoFeesToWithdraw")) {
            return { error: "No fees available to withdraw." };
        }
        return { error: `An unexpected error occurred: ${errorMessage}` };
    }
}

export async function companyWithdrawAssetTokens(
    assetAddress: string, 
    amountOfTokens: string // Human-readable amount of asset tokens
): Promise<TransactionSuccessResponse | ContractErrorResponse> {
    if (!isValidAddress(assetAddress)) return { error: "Invalid asset address provided." };
    if (parseFloat(amountOfTokens) <= 0) return { error: "Amount of tokens to withdraw must be positive." };

    try {
        const amountWei = parseUnits(amountOfTokens, DEFAULT_TOKEN_DECIMALS);
        const hash = await aiWalletClient.writeContract({
            address: assetAddress as Hex,
            abi: ZENOVA_ASSET_ABI,
            functionName: "companyWithdraw",
            args: [amountWei],
            account: aiWalletClient.account, // Caller must have AI_ROLE 
        });
        const receipt = await publicClient.waitForTransactionReceipt({ hash });

        if (receipt.status === 'success') {
            return { success: true, transactionHash: hash, message: "Company token withdrawal successful." };
        } else {
            return { error: `Company token withdrawal failed. Status: ${receipt.status}` };
        }
    } catch (err: unknown) {
        const errorMessage = err instanceof BaseError ? err.shortMessage : (err instanceof Error ? err.message : String(err));
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

export async function pauseAssetTrading(assetAddress: string): Promise<TransactionSuccessResponse | ContractErrorResponse> {
    if (!isValidAddress(assetAddress)) return { error: "Invalid asset address provided." };
    try {
        const hash = await aiWalletClient.writeContract({
            address: assetAddress as Hex,
            abi: ZENOVA_ASSET_ABI,
            functionName: "pause",
            account: aiWalletClient.account,
        });
        const receipt = await publicClient.waitForTransactionReceipt({ hash });

        if (receipt.status === 'success') {
            return { success: true, transactionHash: hash, message: "Asset trading paused successfully." };
        } else {
            return { error: `Pause trading transaction failed. Status: ${receipt.status}` };
        }
    } catch (err: unknown) {
        const errorMessage = err instanceof BaseError ? err.shortMessage : (err instanceof Error ? err.message : String(err));
        console.error(`Error in pauseAssetTrading for ${assetAddress}: ${errorMessage}`);
         if (errorMessage.includes("Pausable: paused")) { // From OpenZeppelin Pausable
            return { error: "Asset trading is already paused." };
        }
        return { error: `An unexpected error occurred: ${errorMessage}` };
    }
}

export async function unpauseAssetTrading(assetAddress: string): Promise<TransactionSuccessResponse | ContractErrorResponse> {
    if (!isValidAddress(assetAddress)) return { error: "Invalid asset address provided." };
    try {
        const hash = await aiWalletClient.writeContract({
            address: assetAddress as Hex,
            abi: ZENOVA_ASSET_ABI,
            functionName: "unpause",
            account: aiWalletClient.account,
        });
        const receipt = await publicClient.waitForTransactionReceipt({ hash });

        if (receipt.status === 'success') {
            return { success: true, transactionHash: hash, message: "Asset trading unpaused successfully." };
        } else {
            return { error: `Unpause trading transaction failed. Status: ${receipt.status}` };
        }
    } catch (err: unknown) {
        const errorMessage = err instanceof BaseError ? err.shortMessage : (err instanceof Error ? err.message : String(err));
        console.error(`Error in unpauseAssetTrading for ${assetAddress}: ${errorMessage}`);
        if (errorMessage.includes("Pausable: not paused")) { // From OpenZeppelin Pausable
            return { error: "Asset trading is not currently paused." };
        }
        return { error: `An unexpected error occurred: ${errorMessage}` };
    }
}

// Excluded: PRICE_AI_ROLE, LIQUIDITY_MANAGER_ROLE (role getters)
// Excluded: Standard ERC20 functions (approve, transfer, transferFrom, allowance) unless specifically requested for agent tools.
// Excluded: AccessControl role management functions. 
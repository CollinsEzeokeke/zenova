import { publicClient, aiWalletClient } from "../../../../viemConfig";
import { 
    // usdtMockConfig,
    zenovaAssetFactoryConfig } from "@/generated";
import { Hex, getAddress, formatUnits as viemFormatUnits, parseUnits, BaseError, decodeEventLog, getAbiItem } from "viem";
import {
    FormattedFullAssetDetails,
    FormattedCompanyInitialValuation,
    FormattedCompanyComprehensiveDetails,
    FormattedPlatformSnapshot,
    FormattedUserPortfolioDetails,
    FormattedMultipleAssetAnalytics,
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

const FACTORY_ADDRESS = zenovaAssetFactoryConfig.address[publicClient.chain.id] as Hex;
const FACTORY_ABI = zenovaAssetFactoryConfig.abi;
// const USDT_ADDRESS = usdtMockConfig.address[publicClient.chain.id] as Hex;
const USDT_DECIMALS = 6;
const DEFAULT_TOKEN_DECIMALS = 18;

function isValidAddress(address: string): boolean {
    try {
        getAddress(address);
        return true;
    } catch {
        return false;
    }
}

// --- Factory Getter Functions (Error handling updated) ---

export async function getZenovaAssetImplementation(): Promise<Hex | ContractErrorResponse> {
    try {
        const data = await publicClient.readContract({
            address: FACTORY_ADDRESS,
            abi: FACTORY_ABI,
            functionName: "zenovaAssetImplementation",
        });
        return formatAddress(data);
    } catch (err: unknown) {
        const errorMessage = err instanceof BaseError ? err.shortMessage : (err instanceof Error ? err.message : String(err));
        console.error("Error in getZenovaAssetImplementation:", errorMessage);
        return { error: `An unexpected error occurred: ${errorMessage}` };
    }
}

export async function getAcceptedCurrencyFactory(): Promise<Hex | ContractErrorResponse> {
    try {
        const data = await publicClient.readContract({
            address: FACTORY_ADDRESS,
            abi: FACTORY_ABI,
            functionName: "acceptedCurrency",
        });
        return formatAddress(data);
    } catch (err: unknown) {
        const errorMessage = err instanceof BaseError ? err.shortMessage : (err instanceof Error ? err.message : String(err));
        console.error("Error in getAcceptedCurrencyFactory:", errorMessage);
        return { error: `An unexpected error occurred: ${errorMessage}` };
    }
}

export async function getAllZenovaAssets(): Promise<Hex[] | ContractErrorResponse> {
    try {
        const data = await publicClient.readContract({
            address: FACTORY_ADDRESS,
            abi: FACTORY_ABI,
            functionName: "getAllAssets",
        });
        return data.map((addr: Hex) => formatAddress(addr));
    } catch (err: unknown) {
        const errorMessage = err instanceof BaseError ? err.shortMessage : (err instanceof Error ? err.message : String(err));
        console.error("Error in getAllZenovaAssets:", errorMessage);
        return { error: `An unexpected error occurred: ${errorMessage}` };
    }
}

export async function getAssetsByCompany(companyWallet: string): Promise<Hex[] | ContractErrorResponse> {
    if (!isValidAddress(companyWallet)) return { error: "Invalid company wallet address provided." };
    try {
        const data = await publicClient.readContract({
            address: FACTORY_ADDRESS,
            abi: FACTORY_ABI,
            functionName: "getAssetsByCompany",
            args: [companyWallet as Hex],
        });
        return data.map((addr: Hex) => formatAddress(addr));
    } catch (err: unknown) {
        const errorMessage = err instanceof BaseError ? err.shortMessage : (err instanceof Error ? err.message : String(err));
        console.error("Error in getAssetsByCompany:", errorMessage);
        return { error: `An unexpected error occurred: ${errorMessage}` };
    }
}

export async function getSubmittedValuation(companyWallet: string): Promise<FormattedCompanyInitialValuation | ContractErrorResponse> {
    if (!isValidAddress(companyWallet)) return { error: "Invalid company wallet address provided." };
    try {
        const result = await publicClient.readContract({
            address: FACTORY_ADDRESS,
            abi: FACTORY_ABI,
            functionName: "getSubmittedValuation",
            args: [companyWallet as Hex],
        });

        return {
            companyWallet: formatAddress(result.companyWallet),
            valuation: formatUsdtAmount(result.valuation),
            initialPricePerToken: formatUsdtAmount(result.initialPricePerToken),
            evaluatorAI: formatAddress(result.evaluatorAI),
            assessmentTimestamp: formatTimestamp(result.assessmentTimestamp),
            exists: result.exists,
        };
    } catch (err: unknown) {
        const errorMessage = err instanceof BaseError ? err.shortMessage : (err instanceof Error ? err.message : String(err));
        console.error("Error in getSubmittedValuation:", errorMessage);
        return { error: `An unexpected error occurred: ${errorMessage}` };
    }
}

export async function getAssetFullDetails(assetAddress: string): Promise<FormattedFullAssetDetails | ContractErrorResponse> {
    if (!isValidAddress(assetAddress)) return { error: "Invalid asset address provided." };
    try {
        const rawResult = await publicClient.readContract({
            address: FACTORY_ADDRESS,
            abi: FACTORY_ABI,
            functionName: "getAssetFullDetails",
            args: [assetAddress as Hex],
        });

        const priceDecimals = USDT_DECIMALS;
        const assetTokenDecimals = DEFAULT_TOKEN_DECIMALS;

        return {
            assetAddress: formatAddress(rawResult.assetAddress),
            companyDetails: {
                name: rawResult.companyDetails.name,
                symbol: rawResult.companyDetails.symbol,
                description: rawResult.companyDetails.description,
                website: rawResult.companyDetails.website,
                issuingCompanyWallet: formatAddress(rawResult.companyDetails.issuingCompanyWallet),
            },
            pricingDetails: {
                currentPricePerToken: viemFormatUnits(rawResult.pricingDetails.currentPricePerToken, priceDecimals),
                buyFeeBPS: formatBpsRate(rawResult.pricingDetails.buyFeeBPS),
                sellFeeBPS: formatBpsRate(rawResult.pricingDetails.sellFeeBPS),
                marketCap: viemFormatUnits(rawResult.pricingDetails.marketCap, priceDecimals),
                lastPriceUpdateTimestamp: formatTimestamp(rawResult.pricingDetails.lastPriceUpdateTimestamp),
                acceptedCurrency: formatAddress(rawResult.pricingDetails.acceptedCurrency),
            },
            currentValuation: formatUsdtAmount(rawResult.currentValuation),
            maxTokenSupply: viemFormatUnits(rawResult.maxTokenSupply, assetTokenDecimals),
            currentTotalSupply: viemFormatUnits(rawResult.currentTotalSupply, assetTokenDecimals),
            isTradingActive: rawResult.isTradingActive,
            admin: formatAddress(rawResult.admin),
            priceAI: formatAddress(rawResult.priceAI),
            liquidityManager: formatAddress(rawResult.liquidityManager),
        };
    } catch (err: unknown) {
        const errorMessage = err instanceof BaseError ? err.shortMessage : (err instanceof Error ? err.message : String(err));
        console.error("Error in getAssetFullDetails:", errorMessage);
        return { error: `An unexpected error occurred: ${errorMessage}` };
    }
}

export async function getMultipleAssetFullDetails(assetAddresses: string[]): Promise<FormattedFullAssetDetails[] | ContractErrorResponse> {
    if (!assetAddresses || assetAddresses.length === 0 || assetAddresses.some(addr => !isValidAddress(addr))) {
        return { error: "Invalid or empty asset addresses array provided." };
    }
    try {
        const rawResults = await publicClient.readContract({
            address: FACTORY_ADDRESS,
            abi: FACTORY_ABI,
            functionName: "getMultipleAssetFullDetails",
            args: [assetAddresses.map(a => a as Hex)],
        });

        return rawResults.map(rawResult => {
            const priceDecimals = USDT_DECIMALS;
            const assetTokenDecimals = DEFAULT_TOKEN_DECIMALS;
            return {
                assetAddress: formatAddress(rawResult.assetAddress),
                companyDetails: {
                    name: rawResult.companyDetails.name,
                    symbol: rawResult.companyDetails.symbol,
                    description: rawResult.companyDetails.description,
                    website: rawResult.companyDetails.website,
                    issuingCompanyWallet: formatAddress(rawResult.companyDetails.issuingCompanyWallet),
                },
                pricingDetails: {
                    currentPricePerToken: viemFormatUnits(rawResult.pricingDetails.currentPricePerToken, priceDecimals),
                    buyFeeBPS: formatBpsRate(rawResult.pricingDetails.buyFeeBPS),
                    sellFeeBPS: formatBpsRate(rawResult.pricingDetails.sellFeeBPS),
                    marketCap: viemFormatUnits(rawResult.pricingDetails.marketCap, priceDecimals),
                    lastPriceUpdateTimestamp: formatTimestamp(rawResult.pricingDetails.lastPriceUpdateTimestamp),
                    acceptedCurrency: formatAddress(rawResult.pricingDetails.acceptedCurrency),
                },
                currentValuation: formatUsdtAmount(rawResult.currentValuation),
                maxTokenSupply: viemFormatUnits(rawResult.maxTokenSupply, assetTokenDecimals),
                currentTotalSupply: viemFormatUnits(rawResult.currentTotalSupply, assetTokenDecimals),
                isTradingActive: rawResult.isTradingActive,
                admin: formatAddress(rawResult.admin),
                priceAI: formatAddress(rawResult.priceAI),
                liquidityManager: formatAddress(rawResult.liquidityManager),
            };
        });
    } catch (err: unknown) {
        const errorMessage = err instanceof BaseError ? err.shortMessage : (err instanceof Error ? err.message : String(err));
        console.error("Error in getMultipleAssetFullDetails:", errorMessage);
        return { error: `An unexpected error occurred: ${errorMessage}` };
    }
}

export async function totalAssets(): Promise<string | ContractErrorResponse> {
    try {
        const data = await publicClient.readContract({
            address: FACTORY_ADDRESS,
            abi: FACTORY_ABI,
            functionName: "totalAssets",
        });
        return formatNumber(data);
    } catch (err: unknown) {
        const errorMessage = err instanceof BaseError ? err.shortMessage : (err instanceof Error ? err.message : String(err));
        console.error("Error in totalAssets:", errorMessage);
        return { error: `An unexpected error occurred: ${errorMessage}` };
    }
}

// --- Comprehensive Analytics Functions (Formatted) ---

export async function getCompanyComprehensiveDetails(companyWallet: string): Promise<FormattedCompanyComprehensiveDetails | ContractErrorResponse> {
    if (!isValidAddress(companyWallet)) return { error: "Invalid company wallet address provided." };
    try {
        const rawResult = await publicClient.readContract({
            address: FACTORY_ADDRESS,
            abi: FACTORY_ABI,
            functionName: "getCompanyComprehensiveDetails",
            args: [companyWallet as Hex],
        });

        let formattedPendingValuation: FormattedCompanyInitialValuation | undefined = undefined;
        if (rawResult.pendingValuation?.exists) {
            formattedPendingValuation = {
                companyWallet: formatAddress(rawResult.pendingValuation.companyWallet),
                valuation: formatUsdtAmount(rawResult.pendingValuation.valuation),
                initialPricePerToken: formatUsdtAmount(rawResult.pendingValuation.initialPricePerToken),
                evaluatorAI: formatAddress(rawResult.pendingValuation.evaluatorAI),
                assessmentTimestamp: formatTimestamp(rawResult.pendingValuation.assessmentTimestamp),
                exists: rawResult.pendingValuation.exists,
            };
        }

        return {
            companyWallet: formatAddress(rawResult.companyWallet),
            pendingValuation: formattedPendingValuation,
            assetAddresses: rawResult.assetAddresses.map((addr: Hex) => formatAddress(addr)),
            assetDetails: rawResult.assetDetails.map((ad) => {
                const priceDecimals = USDT_DECIMALS;
                const assetTokenDecimals = DEFAULT_TOKEN_DECIMALS;
                return {
                    assetAddress: formatAddress(ad.assetAddress),
                    companyDetails: {
                        name: ad.companyDetails.name,
                        symbol: ad.companyDetails.symbol,
                        description: ad.companyDetails.description,
                        website: ad.companyDetails.website,
                        issuingCompanyWallet: formatAddress(ad.companyDetails.issuingCompanyWallet),
                    },
                    pricingDetails: {
                        currentPricePerToken: viemFormatUnits(ad.pricingDetails.currentPricePerToken, priceDecimals),
                        buyFeeBPS: formatBpsRate(ad.pricingDetails.buyFeeBPS),
                        sellFeeBPS: formatBpsRate(ad.pricingDetails.sellFeeBPS),
                        marketCap: viemFormatUnits(ad.pricingDetails.marketCap, priceDecimals),
                        lastPriceUpdateTimestamp: formatTimestamp(ad.pricingDetails.lastPriceUpdateTimestamp),
                        acceptedCurrency: formatAddress(ad.pricingDetails.acceptedCurrency),
                    },
                    currentValuation: formatUsdtAmount(ad.currentValuation),
                    maxTokenSupply: viemFormatUnits(ad.maxTokenSupply, assetTokenDecimals),
                    currentTotalSupply: viemFormatUnits(ad.currentTotalSupply, assetTokenDecimals),
                    isTradingActive: ad.isTradingActive,
                    admin: formatAddress(ad.admin),
                    priceAI: formatAddress(ad.priceAI),
                    liquidityManager: formatAddress(ad.liquidityManager),
                };
            }),
            totalMarketCap: formatUsdtAmount(rawResult.totalMarketCap),
            totalTokensIssued: formatDefaultTokenAmount(rawResult.totalTokensIssued),
            totalTradingVolume: formatUsdtAmount(rawResult.totalTradingVolume),
            hasActiveAssets: rawResult.hasActiveAssets,
        };
    } catch (err: unknown) {
        const errorMessage = err instanceof BaseError ? err.shortMessage : (err instanceof Error ? err.message : String(err));
        console.error("Error in getCompanyComprehensiveDetails:", errorMessage);
        return { error: `An unexpected error occurred: ${errorMessage}` };
    }
}

export async function getPlatformSnapshot(): Promise<FormattedPlatformSnapshot | ContractErrorResponse> {
    try {
        const rawResult = await publicClient.readContract({
            address: FACTORY_ADDRESS,
            abi: FACTORY_ABI,
            functionName: "getPlatformSnapshot",
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
            mostActiveAssetByVolume: formatAddress(rawResult.mostActiveAssetByVolume),
        };
    } catch (err: unknown) {
        const errorMessage = err instanceof BaseError ? err.shortMessage : (err instanceof Error ? err.message : String(err));
        console.error("Error in getPlatformSnapshot:", errorMessage);
        return { error: `An unexpected error occurred: ${errorMessage}` };
    }
}

export async function getUserPortfolioDetails(userAddress: string): Promise<FormattedUserPortfolioDetails | ContractErrorResponse> {
    if (!isValidAddress(userAddress)) return { error: "Invalid user address provided." };
    try {
        const rawResult = await publicClient.readContract({
            address: FACTORY_ADDRESS,
            abi: FACTORY_ABI,
            functionName: "getUserPortfolioDetails",
            args: [userAddress as Hex],
        });

        return {
            userAddress: formatAddress(rawResult.userAddress),
            totalPortfolioValue: formatUsdtAmount(rawResult.totalPortfolioValue),
            totalInvestedAmount: formatUsdtAmount(rawResult.totalInvestedAmount),
            totalRealizedPnL: formatUsdtAmount(rawResult.totalRealizedPnL),
            totalUnrealizedPnL: formatUsdtAmount(rawResult.totalUnrealizedPnL),
            totalFeesPaid: formatUsdtAmount(rawResult.totalFeesPaid),
            numberOfAssetsHeld: formatNumber(rawResult.numberOfAssetsHeld),
            heldAssetAddresses: rawResult.heldAssetAddresses.map((addr: Hex) => formatAddress(addr)),
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
                    unrealizedPnL: formatUsdtAmount(holding.unrealizedPnL),
                };
            }),
            isActiveTrader: rawResult.isActiveTrader,
        };
    } catch (err: unknown) {
        const errorMessage = err instanceof BaseError ? err.shortMessage : (err instanceof Error ? err.message : String(err));
        console.error("Error in getUserPortfolioDetails:", errorMessage);
        return { error: `An unexpected error occurred: ${errorMessage}` };
    }
}

export async function getMultipleAssetAnalytics(assetAddresses: string[]): Promise<FormattedMultipleAssetAnalytics | ContractErrorResponse> {
    if (!assetAddresses || assetAddresses.length === 0 || assetAddresses.some(addr => !isValidAddress(addr))) {
        return { error: "Invalid or empty asset addresses array provided." };
    }
    try {
        const rawTuple = await publicClient.readContract({
            address: FACTORY_ADDRESS,
            abi: FACTORY_ABI,
            functionName: "getMultipleAssetAnalytics",
            args: [assetAddresses.map(a => a as Hex)],
        });

        const formattedAssetDetails: FormattedFullAssetDetails[] = rawTuple[0].map((ad) => {
            const priceDecimals = USDT_DECIMALS;
            const assetTokenDecimals = DEFAULT_TOKEN_DECIMALS;
            return {
                assetAddress: formatAddress(ad.assetAddress),
                companyDetails: {
                    name: ad.companyDetails.name,
                    symbol: ad.companyDetails.symbol,
                    description: ad.companyDetails.description,
                    website: ad.companyDetails.website,
                    issuingCompanyWallet: formatAddress(ad.companyDetails.issuingCompanyWallet),
                },
                pricingDetails: {
                    currentPricePerToken: viemFormatUnits(ad.pricingDetails.currentPricePerToken, priceDecimals),
                    buyFeeBPS: formatBpsRate(ad.pricingDetails.buyFeeBPS),
                    sellFeeBPS: formatBpsRate(ad.pricingDetails.sellFeeBPS),
                    marketCap: viemFormatUnits(ad.pricingDetails.marketCap, priceDecimals),
                    lastPriceUpdateTimestamp: formatTimestamp(ad.pricingDetails.lastPriceUpdateTimestamp),
                    acceptedCurrency: formatAddress(ad.pricingDetails.acceptedCurrency),
                },
                currentValuation: formatUsdtAmount(ad.currentValuation),
                maxTokenSupply: viemFormatUnits(ad.maxTokenSupply, assetTokenDecimals),
                currentTotalSupply: viemFormatUnits(ad.currentTotalSupply, assetTokenDecimals),
                isTradingActive: ad.isTradingActive,
                admin: formatAddress(ad.admin),
                priceAI: formatAddress(ad.priceAI),
                liquidityManager: formatAddress(ad.liquidityManager),
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
                priceVolatility: formatBpsRate(tm.priceVolatility),
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
                timeSinceLastPriceUpdate: formatDuration(ma.timeSinceLastPriceUpdate),
            };
        });

        return [formattedAssetDetails, formattedTradingMetricsList, formattedMarketAnalysisList];

    } catch (err: unknown) {
        const errorMessage = err instanceof BaseError ? err.shortMessage : (err instanceof Error ? err.message : String(err));
        console.error("Error in getMultipleAssetAnalytics:", errorMessage);
        return { error: `An unexpected error occurred: ${errorMessage}` };
    }
}

// --- Factory Setter Functions (Refactored) ---

export async function submitCompanyValuationFactory(
    companyWallet: string,
    valuation: string, 
    initialPricePerToken: string 
): Promise<TransactionSuccessResponse | ContractErrorResponse> {
    if (!isValidAddress(companyWallet)) return { error: "Invalid company wallet address provided." };
    if (parseFloat(valuation) <= 0) return { error: "Valuation must be positive."};
    if (parseFloat(initialPricePerToken) <= 0) return { error: "Initial price per token must be positive."};

    try {
        const valuationWei = parseUnits(valuation, USDT_DECIMALS);
        const initialPricePerTokenWei = parseUnits(initialPricePerToken, USDT_DECIMALS);

        const hash = await aiWalletClient.writeContract({
            address: FACTORY_ADDRESS,
            abi: FACTORY_ABI,
            functionName: "submitCompanyValuation",
            args: [companyWallet as Hex, valuationWei, initialPricePerTokenWei],
            account: aiWalletClient.account, 
        });
        const receipt = await publicClient.waitForTransactionReceipt({ hash });

        if (receipt.status === 'success') {
            return { success: true, transactionHash: hash, message: "Company valuation submitted successfully." };
        } else {
            return { error: `Company valuation submission failed. Status: ${receipt.status}` };
        }
    } catch (err: unknown) {
        const errorMessage = err instanceof BaseError ? err.shortMessage : (err instanceof Error ? err.message : String(err));
        console.error("Error in submitCompanyValuationFactory:", errorMessage);
        return { error: `An unexpected error occurred: ${errorMessage}` };
    }
}

export async function createZenovaAssetFactory(
    companyWallet: string, 
    companyInfo: { 
        name: string;
        symbol: string;
        description?: string;
        website?: string;
        issuingCompanyWallet: Hex;
    }
): Promise<(TransactionSuccessResponse & { assetAddress?: Hex }) | ContractErrorResponse> {
    if (!isValidAddress(companyWallet)) return { error: "Invalid company wallet address for valuation lookup." };
    if (!isValidAddress(companyInfo.issuingCompanyWallet)) return { error: "Invalid issuing company wallet in company info." };
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
            issuingCompanyWallet: companyInfo.issuingCompanyWallet,
        };

        const hash = await aiWalletClient.writeContract({
            address: FACTORY_ADDRESS,
            abi: FACTORY_ABI,
            functionName: "createZenovaAsset",
            args: [companyWallet as Hex, companyInfoArg],
            account: aiWalletClient.account,
        });
        const receipt = await publicClient.waitForTransactionReceipt({ hash });

        if (receipt.status === 'success') {
            let newAssetAddress: Hex | undefined = undefined;
            const eventAbiItem = getAbiItem({ abi: FACTORY_ABI, name: 'ZenovaAssetCreated' });
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
                        abi: [eventAbiItem], // decodeEventLog expects an array of ABI items
                        data: log.data,
                        topics: log.topics
                    });
                    if (decodedEvent.eventName === 'ZenovaAssetCreated') {
                        // @ts-ignore
                        newAssetAddress = formatAddress((decodedEvent.args as any).newAssetAddress as Hex);
                        break;
                    }
                } catch (decodeError) {
                    // Not the event we're looking for, or an issue decoding it.
                    console.debug("Failed to decode a log or not the ZenovaAssetCreated event:", decodeError);
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
    } catch (err: unknown) {
        const errorMessage = err instanceof BaseError ? err.shortMessage : (err instanceof Error ? err.message : String(err));
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

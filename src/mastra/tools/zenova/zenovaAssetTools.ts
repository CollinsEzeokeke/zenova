import { z } from "zod";
import { createTool } from "@mastra/core";
import {
    // EthereumAddressSchema,
    AssetAddressInputSchema,
    AssetBalanceOfInputSchema,
    CompanyInfoSchema,
    AssetPricingDetailsSchema,
    ZenovaAssetFullDetailsSchema,
    TradingMetricsSchema,
    MarketAnalysisSchema,
    UserAssetInfoSchema,
    AssetSnapshotSchema,
    SetCompanyValuationInputSchema,
    UpdatePriceInputSchema,
    UpdateLiquidityParamsInputSchema,
    BuySellTokensInputSchema,
    WithdrawFeesInputSchema,
    CompanyWithdrawInputSchema,
    GetUserAssetInfoInputSchema,
    PositiveStringIntegerSchema,
    PositiveStringFloatSchema,
    TransactionSuccessResponseSchema,
    ToolErrorResponseSchema
} from "./zenovaZodSchemas";

import {
    getAssetCompanyName,
    getAssetSymbol,
    getAssetDecimals,
    getAssetTotalSupply,
    getAssetBalanceOf,
    getAssetCompanyInfo,
    getAssetPricingDetailsInfo,
    getAssetFullDetailsInfo,
    getAssetCurrentValuation,
    getAssetMaxTokenSupply,
    getAssetIsTradingActive,
    getAssetCollectedFees,
    getAssetBuyQuote,
    getAssetSellQuote,
    getAssetTradingMetrics,
    getAssetMarketAnalysis,
    getAssetUserAssetInfo,
    getAssetSnapshotInfo,
    setAssetCompanyValuationAndSupply,
    updateAssetPrice,
    updateAssetLiquidityParameters,
    activateAssetTrading,
    deactivateAssetTrading,
    buyAssetTokens,
    sellAssetTokens,
    withdrawAssetFees,
    companyWithdrawAssetTokens,
    pauseAssetTrading,
    unpauseAssetTrading
} from "./zenovaAssetInteractions";

// --- ZenovaAsset Read Tools ---

export const getAssetCompanyNameTool = createTool({
    id: "zenovaAsset_getCompanyName",
    description: "Gets the company name (token name) of a specific ZenovaAsset contract.",
    inputSchema: AssetAddressInputSchema,
    outputSchema: z.union([z.string(), ToolErrorResponseSchema]), // name is string
    execute: async ({ context }) => {
        return await getAssetCompanyName(context.assetAddress);
    },
});

export const getAssetSymbolTool = createTool({
    id: "zenovaAsset_getSymbol",
    description: "Gets the token symbol of a specific ZenovaAsset contract.",
    inputSchema: AssetAddressInputSchema,
    outputSchema: z.union([z.string(), ToolErrorResponseSchema]), // symbol is string
    execute: async ({ context }) => {
        return await getAssetSymbol(context.assetAddress);
    },
});

export const getAssetDecimalsTool = createTool({
    id: "zenovaAsset_getDecimals",
    description: "Gets the token decimals of a specific ZenovaAsset contract.",
    inputSchema: AssetAddressInputSchema,
    outputSchema: z.union([PositiveStringIntegerSchema, ToolErrorResponseSchema]), // decimals is uint8, formatted to string
    execute: async ({ context }) => {
        return await getAssetDecimals(context.assetAddress);
    },
});

export const getAssetTotalSupplyTool = createTool({
    id: "zenovaAsset_getTotalSupply",
    description: "Gets the total supply of a specific ZenovaAsset contract, formatted string.",
    inputSchema: AssetAddressInputSchema,
    outputSchema: z.union([PositiveStringFloatSchema, ToolErrorResponseSchema]), // Formatted default token amount
    execute: async ({ context }) => {
        return await getAssetTotalSupply(context.assetAddress);
    },
});

export const getAssetBalanceOfTool = createTool({
    id: "zenovaAsset_getBalanceOf",
    description: "Gets the token balance of an account for a specific ZenovaAsset, formatted string.",
    inputSchema: AssetBalanceOfInputSchema,
    outputSchema: z.union([PositiveStringFloatSchema, ToolErrorResponseSchema]), // Formatted default token amount
    execute: async ({ context }) => {
        return await getAssetBalanceOf(context.assetAddress, context.account);
    },
});

export const getAssetCompanyInfoTool = createTool({
    id: "zenovaAsset_getCompanyInfo",
    description: "Gets the company information struct from a specific ZenovaAsset contract.",
    inputSchema: AssetAddressInputSchema,
    outputSchema: z.union([CompanyInfoSchema, ToolErrorResponseSchema]),
    execute: async ({ context }) => {
        return await getAssetCompanyInfo(context.assetAddress);
    },
});

export const getAssetPricingDetailsTool = createTool({
    id: "zenovaAsset_getPricingDetails",
    description: "Gets the asset pricing details struct from a specific ZenovaAsset contract.",
    inputSchema: AssetAddressInputSchema,
    outputSchema: z.union([AssetPricingDetailsSchema, ToolErrorResponseSchema]),
    execute: async ({ context }) => {
        return await getAssetPricingDetailsInfo(context.assetAddress);
    },
});

export const getAssetFullDetailsTool = createTool({
    id: "zenovaAsset_getFullDetails",
    description: "Gets the full asset details struct from a specific ZenovaAsset contract.",
    inputSchema: AssetAddressInputSchema,
    outputSchema: z.union([ZenovaAssetFullDetailsSchema, ToolErrorResponseSchema]),
    execute: async ({ context }) => {
        return await getAssetFullDetailsInfo(context.assetAddress);
    },
});

export const getAssetCurrentValuationTool = createTool({
    id: "zenovaAsset_getCurrentValuation",
    description: "Gets the current valuation of the company represented by the ZenovaAsset, formatted USDT string.",
    inputSchema: AssetAddressInputSchema,
    outputSchema: z.union([PositiveStringFloatSchema, ToolErrorResponseSchema]), // Formatted USDT amount
    execute: async ({ context }) => {
        return await getAssetCurrentValuation(context.assetAddress);
    },
});

export const getAssetMaxTokenSupplyTool = createTool({
    id: "zenovaAsset_getMaxTokenSupply",
    description: "Gets the maximum token supply for the ZenovaAsset, formatted string.",
    inputSchema: AssetAddressInputSchema,
    outputSchema: z.union([PositiveStringFloatSchema, ToolErrorResponseSchema]), // Formatted default token amount
    execute: async ({ context }) => {
        return await getAssetMaxTokenSupply(context.assetAddress);
    },
});

export const getAssetIsTradingActiveTool = createTool({
    id: "zenovaAsset_isTradingActive",
    description: "Checks if trading is currently active for the ZenovaAsset.",
    inputSchema: AssetAddressInputSchema,
    outputSchema: z.union([z.boolean(), ToolErrorResponseSchema]),
    execute: async ({ context }) => {
        return await getAssetIsTradingActive(context.assetAddress);
    },
});

export const getAssetCollectedFeesTool = createTool({
    id: "zenovaAsset_getCollectedFees",
    description: "Gets the total collected fees in USDT for the ZenovaAsset, formatted string.",
    inputSchema: AssetAddressInputSchema,
    outputSchema: z.union([PositiveStringFloatSchema, ToolErrorResponseSchema]), // Formatted USDT amount
    execute: async ({ context }) => {
        return await getAssetCollectedFees(context.assetAddress);
    },
});

export const getAssetBuyQuoteTool = createTool({
    id: "zenovaAsset_getBuyQuote",
    description: "Gets a quote for buying a specific amount of ZenovaAsset tokens (totalCost in USDT, fee in USDT).",
    inputSchema: BuySellTokensInputSchema, // Reuses this schema as it takes assetAddress and tokenAmount
    outputSchema: z.union([z.object({ totalCost: PositiveStringFloatSchema, fee: PositiveStringFloatSchema }), ToolErrorResponseSchema]),
    execute: async ({ context }) => {
        return await getAssetBuyQuote(context.assetAddress, context.tokenAmount);
    },
});

export const getAssetSellQuoteTool = createTool({
    id: "zenovaAsset_getSellQuote",
    description: "Gets a quote for selling a specific amount of ZenovaAsset tokens (proceeds in USDT, fee in USDT).",
    inputSchema: BuySellTokensInputSchema, // Reuses this schema
    outputSchema: z.union([z.object({ proceeds: PositiveStringFloatSchema, fee: PositiveStringFloatSchema }), ToolErrorResponseSchema]),
    execute: async ({ context }) => {
        return await getAssetSellQuote(context.assetAddress, context.tokenAmount);
    },
});

export const getAssetTradingMetricsTool = createTool({
    id: "zenovaAsset_getTradingMetrics",
    description: "Gets the trading metrics for a specific ZenovaAsset.",
    inputSchema: AssetAddressInputSchema,
    outputSchema: z.union([TradingMetricsSchema, ToolErrorResponseSchema]),
    execute: async ({ context }) => {
        return await getAssetTradingMetrics(context.assetAddress);
    },
});

export const getAssetMarketAnalysisTool = createTool({
    id: "zenovaAsset_getMarketAnalysis",
    description: "Gets market analysis data for a specific ZenovaAsset.",
    inputSchema: AssetAddressInputSchema,
    outputSchema: z.union([MarketAnalysisSchema, ToolErrorResponseSchema]),
    execute: async ({ context }) => {
        return await getAssetMarketAnalysis(context.assetAddress);
    },
});

export const getAssetUserAssetInfoTool = createTool({
    id: "zenovaAsset_getUserAssetInfo",
    description: "Gets asset-specific information for a user (balance, PnL, etc.).",
    inputSchema: GetUserAssetInfoInputSchema,
    outputSchema: z.union([UserAssetInfoSchema, ToolErrorResponseSchema]),
    execute: async ({ context }) => {
        return await getAssetUserAssetInfo(context.assetAddress, context.user);
    },
});

export const getAssetSnapshotInfoTool = createTool({
    id: "zenovaAsset_getAssetSnapshot",
    description: "Gets a snapshot of key asset data (price, supply, marketcap, etc.).",
    inputSchema: AssetAddressInputSchema,
    outputSchema: z.union([AssetSnapshotSchema, ToolErrorResponseSchema]),
    execute: async ({ context }) => {
        return await getAssetSnapshotInfo(context.assetAddress);
    },
});

// --- ZenovaAsset Write Tools ---

export const setAssetCompanyValuationTool = createTool({
    id: "zenovaAsset_setCompanyValuationAndSupply",
    description: "Sets the initial company valuation, token price, and supply details on a ZenovaAsset contract. Typically called by AI after factory creation.",
    inputSchema: SetCompanyValuationInputSchema,
    outputSchema: z.union([TransactionSuccessResponseSchema, ToolErrorResponseSchema]),
    execute: async ({ context }) => {
        return await setAssetCompanyValuationAndSupply(context.assetAddress, context.companyValuation, context.initialPricePerToken, context.evaluator);
    },
});

export const updateAssetPriceTool = createTool({
    id: "zenovaAsset_updatePrice",
    description: "Updates the price of a ZenovaAsset. Called by an authorized Price AI.",
    inputSchema: UpdatePriceInputSchema,
    outputSchema: z.union([TransactionSuccessResponseSchema, ToolErrorResponseSchema]),
    execute: async ({ context }) => {
        return await updateAssetPrice(context.assetAddress, context.newPricePerToken);
    },
});

export const updateAssetLiquidityParamsTool = createTool({
    id: "zenovaAsset_updateLiquidityParameters",
    description: "Updates the buy and sell fee BPS for a ZenovaAsset. Called by an authorized Liquidity Manager.",
    inputSchema: UpdateLiquidityParamsInputSchema,
    outputSchema: z.union([TransactionSuccessResponseSchema, ToolErrorResponseSchema]),
    execute: async ({ context }) => {
        return await updateAssetLiquidityParameters(context.assetAddress, context.newBuyFeeBPS, context.newSellFeeBPS);
    },
});

export const activateAssetTradingTool = createTool({
    id: "zenovaAsset_activateTrading",
    description: "Activates trading for a ZenovaAsset. Called by an authorized AI role (admin/evaluator).",
    inputSchema: AssetAddressInputSchema, // Only assetAddress needed
    outputSchema: z.union([TransactionSuccessResponseSchema, ToolErrorResponseSchema]),
    execute: async ({ context }) => {
        return await activateAssetTrading(context.assetAddress);
    },
});

export const deactivateAssetTradingTool = createTool({
    id: "zenovaAsset_deactivateTrading",
    description: "Deactivates trading for a ZenovaAsset. Called by an authorized AI role (admin/evaluator).",
    inputSchema: AssetAddressInputSchema, // Only assetAddress needed
    outputSchema: z.union([TransactionSuccessResponseSchema, ToolErrorResponseSchema]),
    execute: async ({ context }) => {
        return await deactivateAssetTrading(context.assetAddress);
    },
});

export const buyAssetTokensTool = createTool({
    id: "zenovaAsset_buyTokens",
    description: "Allows a user (represented by AI wallet) to buy ZenovaAsset tokens.",
    inputSchema: BuySellTokensInputSchema,
    outputSchema: z.union([TransactionSuccessResponseSchema, ToolErrorResponseSchema]),
    execute: async ({ context }) => {
        return await buyAssetTokens(context.assetAddress, context.tokenAmount);
    },
});

export const sellAssetTokensTool = createTool({
    id: "zenovaAsset_sellTokens",
    description: "Allows a user (represented by AI wallet) to sell ZenovaAsset tokens.",
    inputSchema: BuySellTokensInputSchema,
    outputSchema: z.union([TransactionSuccessResponseSchema, ToolErrorResponseSchema]),
    execute: async ({ context }) => {
        return await sellAssetTokens(context.assetAddress, context.tokenAmount);
    },
});

export const withdrawAssetFeesTool = createTool({
    id: "zenovaAsset_withdrawFees",
    description: "Withdraws collected trading fees from a ZenovaAsset to a recipient. Called by authorized AI.",
    inputSchema: WithdrawFeesInputSchema,
    outputSchema: z.union([TransactionSuccessResponseSchema, ToolErrorResponseSchema]),
    execute: async ({ context }) => {
        return await withdrawAssetFees(context.assetAddress, context.recipient);
    },
});

export const companyWithdrawAssetTokensTool = createTool({
    id: "zenovaAsset_companyWithdrawTokens",
    description: "Allows the original issuing company (via authorized AI) to withdraw a portion of undistributed tokens.",
    inputSchema: CompanyWithdrawInputSchema,
    outputSchema: z.union([TransactionSuccessResponseSchema, ToolErrorResponseSchema]),
    execute: async ({ context }) => {
        return await companyWithdrawAssetTokens(context.assetAddress, context.amountOfTokens);
    },
});

export const pauseAssetTradingTool = createTool({
    id: "zenovaAsset_pauseTrading",
    description: "Pauses trading and other sensitive functions on a ZenovaAsset. Called by pauser role (admin).",
    inputSchema: AssetAddressInputSchema,
    outputSchema: z.union([TransactionSuccessResponseSchema, ToolErrorResponseSchema]),
    execute: async ({ context }) => {
        return await pauseAssetTrading(context.assetAddress);
    },
});

export const unpauseAssetTradingTool = createTool({
    id: "zenovaAsset_unpauseTrading",
    description: "Unpauses trading and other sensitive functions on a ZenovaAsset. Called by pauser role (admin).",
    inputSchema: AssetAddressInputSchema,
    outputSchema: z.union([TransactionSuccessResponseSchema, ToolErrorResponseSchema]),
    execute: async ({ context }) => {
        return await unpauseAssetTrading(context.assetAddress);
    },
}); 
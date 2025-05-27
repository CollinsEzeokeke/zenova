import { z } from "zod";
import { createTool } from "@mastra/core";
import {
    EthereumAddressSchema,
    GetAssetsByCompanyInputSchema,
    GetSubmittedValuationInputSchema,
    GetAssetFullDetailsInputSchema,
    GetMultipleAssetFullDetailsInputSchema,
    CompanyInitialValuationSchema,
    ZenovaAssetFullDetailsSchema,
    ToolErrorResponseSchema,
    FactoryTotalAssetsOutputSchema,
    FactoryAllAssetsOutputSchema,
    FactoryAssetsByCompanyOutputSchema,
    CompanyComprehensiveDetailsSchema,
    PlatformSnapshotSchema,
    FactoryUserAddressInputSchema,
    UserPortfolioDetailsSchema,
    MultipleAssetAnalyticsSchema,
} from "./zenovaZodSchemas";

import {
    getZenovaAssetImplementation,
    getAcceptedCurrencyFactory,
    getAllZenovaAssets,
    getAssetsByCompany,
    getSubmittedValuation,
    getAssetFullDetails, // This is the factory version that calls the client-safe interaction
    getMultipleAssetFullDetails, // This is the factory version that calls the client-safe interaction
    totalAssets,
    getCompanyComprehensiveDetails,
    getPlatformSnapshot,
    getUserPortfolioDetails,
    getMultipleAssetAnalytics,
} from "./zenovaBlockchainInteractions"; // ensure this only contains client-safe interactions

// --- Factory Read Tools (Client Safe) ---

export const getZenovaAssetImplementationTool = createTool({
    id: "zenovaFactory_getAssetImplementation_client",
    description: "Gets the address of the ZenovaAsset implementation contract used by the factory (client-safe).",
    inputSchema: z.object({}),
    outputSchema: z.union([EthereumAddressSchema, ToolErrorResponseSchema]),
    execute: async () => {
        return await getZenovaAssetImplementation();
    },
});

export const getAcceptedCurrencyFactoryTool = createTool({
    id: "zenovaFactory_getAcceptedCurrency_client",
    description: "Gets the address of the accepted currency (e.g., USDT) used by the factory and assets (client-safe).",
    inputSchema: z.object({}),
    outputSchema: z.union([EthereumAddressSchema, ToolErrorResponseSchema]),
    execute: async () => {
        return await getAcceptedCurrencyFactory();
    },
});

export const getTotalAssetsFactoryTool = createTool({
    id: "zenovaFactory_getTotalAssets_client",
    description: "Gets the total number of ZenovaAsset contracts created by the factory (client-safe).",
    inputSchema: z.object({}),
    outputSchema: z.union([FactoryTotalAssetsOutputSchema, ToolErrorResponseSchema]),
    execute: async () => {
        return await totalAssets();
    },
});

export const getAllAssetsFactoryTool = createTool({
    id: "zenovaFactory_getAllAssets_client",
    description: "Gets a list of all ZenovaAsset contract addresses created by the factory (client-safe).",
    inputSchema: z.object({}),
    outputSchema: z.union([FactoryAllAssetsOutputSchema, ToolErrorResponseSchema]),
    execute: async () => {
        return await getAllZenovaAssets();
    },
});

export const getAssetsByCompanyFactoryTool = createTool({
    id: "zenovaFactory_getAssetsByCompany_client",
    description: "Gets a list of ZenovaAsset contract addresses for a specific company wallet, via the factory (client-safe).",
    inputSchema: GetAssetsByCompanyInputSchema,
    outputSchema: z.union([FactoryAssetsByCompanyOutputSchema, ToolErrorResponseSchema]),
    execute: async ({ context }) => {
        return await getAssetsByCompany(context.companyWallet);
    },
});

export const getSubmittedValuationFactoryTool = createTool({
    id: "zenovaFactory_getSubmittedValuation_client",
    description: "Gets the submitted initial valuation details for a company from the factory, if one exists (client-safe).",
    inputSchema: GetSubmittedValuationInputSchema,
    outputSchema: z.union([CompanyInitialValuationSchema, ToolErrorResponseSchema]),
    execute: async ({ context }) => {
        return await getSubmittedValuation(context.companyWallet);
    },
});

export const getAssetFullDetailsFactoryTool = createTool({
    id: "zenovaFactory_getAssetFullDetails_client",
    description: "Gets full details for a single ZenovaAsset, called via the factory (client-safe).",
    inputSchema: GetAssetFullDetailsInputSchema,
    outputSchema: z.union([ZenovaAssetFullDetailsSchema, ToolErrorResponseSchema]),
    execute: async ({ context }) => {
        return await getAssetFullDetails(context.assetAddress);
    },
});

export const getMultipleAssetFullDetailsFactoryTool = createTool({
    id: "zenovaFactory_getMultipleAssetFullDetails_client",
    description: "Gets full details for multiple ZenovaAsset contracts, called via the factory (client-safe).",
    inputSchema: GetMultipleAssetFullDetailsInputSchema,
    outputSchema: z.union([z.array(ZenovaAssetFullDetailsSchema), ToolErrorResponseSchema]),
    execute: async ({ context }) => {
        return await getMultipleAssetFullDetails(context.assetAddresses);
    },
});

export const getCompanyComprehensiveDetailsTool = createTool({
    id: "zenovaFactory_getCompanyComprehensiveDetails_client",
    description: "Gets comprehensive details for a company, including all its assets and aggregated financial data, via the factory (client-safe).",
    inputSchema: GetAssetsByCompanyInputSchema,
    outputSchema: z.union([CompanyComprehensiveDetailsSchema, ToolErrorResponseSchema]),
    execute: async ({ context }) => {
        return await getCompanyComprehensiveDetails(context.companyWallet);
    },
});

export const getPlatformSnapshotTool = createTool({
    id: "zenovaFactory_getPlatformSnapshot_client",
    description: "Gets a snapshot of key platform-wide metrics from the factory (total assets, market cap, volume, etc.) (client-safe).",
    inputSchema: z.object({}),
    outputSchema: z.union([PlatformSnapshotSchema, ToolErrorResponseSchema]),
    execute: async () => {
        return await getPlatformSnapshot();
    },
});

export const getUserPortfolioDetailsTool = createTool({
    id: "zenovaFactory_getUserPortfolioDetails_client",
    description: "Gets detailed portfolio information for a specific user across all Zenova assets, via the factory (client-safe).",
    inputSchema: FactoryUserAddressInputSchema,
    outputSchema: z.union([UserPortfolioDetailsSchema, ToolErrorResponseSchema]),
    execute: async ({ context }) => {
        return await getUserPortfolioDetails(context.userAddress);
    },
});

export const getMultipleAssetAnalyticsTool = createTool({
    id: "zenovaFactory_getMultipleAssetAnalytics_client",
    description: "Gets a tuple containing arrays of full details, trading metrics, and market analysis for multiple Zenova assets, via the factory (client-safe).",
    inputSchema: GetMultipleAssetFullDetailsInputSchema,
    outputSchema: z.union([MultipleAssetAnalyticsSchema, ToolErrorResponseSchema]),
    execute: async ({ context }) => {
        return await getMultipleAssetAnalytics(context.assetAddresses);
    },
}); 
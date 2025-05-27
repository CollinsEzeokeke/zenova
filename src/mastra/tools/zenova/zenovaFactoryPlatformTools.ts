import { z } from "zod";
import { createTool } from "@mastra/core"; // Adjusted import based on previous context, docs show @mastra/core/tools
import {
    EthereumAddressSchema,
    GetAssetsByCompanyInputSchema,
    GetSubmittedValuationInputSchema,
    GetAssetFullDetailsInputSchema,
    GetMultipleAssetFullDetailsInputSchema,
    SubmitCompanyValuationInputSchema,
    CreateZenovaAssetInputSchema,
    CompanyInitialValuationSchema,
    ZenovaAssetFullDetailsSchema,
    TransactionSuccessResponseSchema,
    AssetCreationSuccessResponseSchema,
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
    getAssetFullDetails, // This is the factory version
    getMultipleAssetFullDetails, // This is the factory version
    totalAssets,
    getCompanyComprehensiveDetails,
    getPlatformSnapshot,
    getUserPortfolioDetails,
    getMultipleAssetAnalytics,
  
} from "./zenovaBlockchainInteractions";
import { createZenovaAssetFactory, submitCompanyValuationFactory } from "./zenovaBlockchainInteractionsServeOnlyInteractions";
// import { FormattedCompanyInitialValuation, FormattedFullAssetDetails, ContractErrorResponse } from "./zenovaFormattedTypes";


// --- Factory Read Tools ---

export const getZenovaAssetImplementationTool = createTool({
    id: "zenovaFactory_getAssetImplementation",
    description: "Gets the address of the ZenovaAsset implementation contract used by the factory.",
    inputSchema: z.object({}),
    outputSchema: z.union([EthereumAddressSchema, ToolErrorResponseSchema]),
    execute: async () => {
        return await getZenovaAssetImplementation();
    },
});

export const getAcceptedCurrencyFactoryTool = createTool({
    id: "zenovaFactory_getAcceptedCurrency",
    description: "Gets the address of the accepted currency (e.g., USDT) used by the factory and assets.",
    inputSchema: z.object({}),
    outputSchema: z.union([EthereumAddressSchema, ToolErrorResponseSchema]),
    execute: async () => {
        return await getAcceptedCurrencyFactory();
    },
});

export const getTotalAssetsFactoryTool = createTool({
    id: "zenovaFactory_getTotalAssets",
    description: "Gets the total number of ZenovaAsset contracts created by the factory.",
    inputSchema: z.object({}),
    outputSchema: z.union([FactoryTotalAssetsOutputSchema, ToolErrorResponseSchema]),
    execute: async () => {
        return await totalAssets();
    },
});

export const getAllAssetsFactoryTool = createTool({
    id: "zenovaFactory_getAllAssets",
    description: "Gets a list of all ZenovaAsset contract addresses created by the factory.",
    inputSchema: z.object({}),
    outputSchema: z.union([FactoryAllAssetsOutputSchema, ToolErrorResponseSchema]),
    execute: async () => {
        return await getAllZenovaAssets();
    },
});

export const getAssetsByCompanyFactoryTool = createTool({
    id: "zenovaFactory_getAssetsByCompany",
    description: "Gets a list of ZenovaAsset contract addresses for a specific company wallet, via the factory.",
    inputSchema: GetAssetsByCompanyInputSchema,
    outputSchema: z.union([FactoryAssetsByCompanyOutputSchema, ToolErrorResponseSchema]),
    execute: async ({ context }) => {
        return await getAssetsByCompany(context.companyWallet);
    },
});

export const getSubmittedValuationFactoryTool = createTool({
    id: "zenovaFactory_getSubmittedValuation",
    description: "Gets the submitted initial valuation details for a company from the factory, if one exists.",
    inputSchema: GetSubmittedValuationInputSchema,
    outputSchema: z.union([CompanyInitialValuationSchema, ToolErrorResponseSchema]), // Assuming FormattedCompanyInitialValuation aligns with CompanyInitialValuationSchema
    execute: async ({ context }) => {
        return await getSubmittedValuation(context.companyWallet);
    },
});

export const getAssetFullDetailsFactoryTool = createTool({
    id: "zenovaFactory_getAssetFullDetails",
    description: "Gets full details for a single ZenovaAsset, called via the factory.",
    inputSchema: GetAssetFullDetailsInputSchema,
    outputSchema: z.union([ZenovaAssetFullDetailsSchema, ToolErrorResponseSchema]), // Assuming FormattedFullAssetDetails aligns with ZenovaAssetFullDetailsSchema
    execute: async ({ context }) => {
        return await getAssetFullDetails(context.assetAddress);
    },
});

export const getMultipleAssetFullDetailsFactoryTool = createTool({
    id: "zenovaFactory_getMultipleAssetFullDetails",
    description: "Gets full details for multiple ZenovaAsset contracts, called via the factory.",
    inputSchema: GetMultipleAssetFullDetailsInputSchema,
    outputSchema: z.union([z.array(ZenovaAssetFullDetailsSchema), ToolErrorResponseSchema]), // Assuming FormattedFullAssetDetails aligns
    execute: async ({ context }) => {
        return await getMultipleAssetFullDetails(context.assetAddresses);
    },
});

// --- New Comprehensive Analytics Tools ---

export const getCompanyComprehensiveDetailsTool = createTool({
    id: "zenovaFactory_getCompanyComprehensiveDetails",
    description: "Gets comprehensive details for a company, including all its assets and aggregated financial data, via the factory.",
    inputSchema: GetAssetsByCompanyInputSchema, // Reuses schema { companyWallet: EthereumAddressSchema }
    outputSchema: z.union([CompanyComprehensiveDetailsSchema, ToolErrorResponseSchema]),
    execute: async ({ context }) => {
        return await getCompanyComprehensiveDetails(context.companyWallet);
    },
});

export const getPlatformSnapshotTool = createTool({
    id: "zenovaFactory_getPlatformSnapshot",
    description: "Gets a snapshot of key platform-wide metrics from the factory (total assets, market cap, volume, etc.).",
    inputSchema: z.object({}),
    outputSchema: z.union([PlatformSnapshotSchema, ToolErrorResponseSchema]),
    execute: async () => {
        return await getPlatformSnapshot();
    },
});

export const getUserPortfolioDetailsTool = createTool({
    id: "zenovaFactory_getUserPortfolioDetails",
    description: "Gets detailed portfolio information for a specific user across all Zenova assets, via the factory.",
    inputSchema: FactoryUserAddressInputSchema, // Uses { userAddress: EthereumAddressSchema }
    outputSchema: z.union([UserPortfolioDetailsSchema, ToolErrorResponseSchema]),
    execute: async ({ context }) => {
        return await getUserPortfolioDetails(context.userAddress);
    },
});

export const getMultipleAssetAnalyticsTool = createTool({
    id: "zenovaFactory_getMultipleAssetAnalytics",
    description: "Gets a tuple containing arrays of full details, trading metrics, and market analysis for multiple Zenova assets, via the factory.",
    inputSchema: GetMultipleAssetFullDetailsInputSchema, // Reuses schema { assetAddresses: z.array(EthereumAddressSchema) }
    outputSchema: z.union([MultipleAssetAnalyticsSchema, ToolErrorResponseSchema]),
    execute: async ({ context }) => {
        return await getMultipleAssetAnalytics(context.assetAddresses);
    },
});

// --- Factory Write Tools (Server-Side ONLY) ---

export const submitCompanyValuationFactoryTool = createTool({
    id: "zenovaFactory_submitCompanyValuation_server", // Renamed ID for clarity
    description: "Allows an AI to submit a company's valuation and suggested initial token price to the factory. (SERVER ONLY)",
    inputSchema: SubmitCompanyValuationInputSchema,
    outputSchema: z.union([TransactionSuccessResponseSchema, ToolErrorResponseSchema]),
    execute: async ({ context }) => {
        return await submitCompanyValuationFactory(
            context.companyWallet,
            context.valuation,
            context.initialPricePerToken
        );
    },
});

export const createZenovaAssetFactoryTool = createTool({
    id: "zenovaFactory_createZenovaAsset_server", // Renamed ID for clarity
    description: "Creates a new ZenovaAsset (tokenized shares) for a company with a submitted valuation, via the factory. Called by AI. (SERVER ONLY)",
    inputSchema: CreateZenovaAssetInputSchema,
    outputSchema: z.union([AssetCreationSuccessResponseSchema, ToolErrorResponseSchema]),
    execute: async ({ context }) => {
        return await createZenovaAssetFactory(context.companyWallet, context.companyInfo);
    },
});


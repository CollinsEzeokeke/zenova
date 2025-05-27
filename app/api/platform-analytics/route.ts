import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
    getAllAssetsFactoryTool,
    getPlatformSnapshotTool,
    getMultipleAssetAnalyticsTool,
} from '@/src/mastra/tools/zenova/zenovaFactoryPlatformClientTools'; // Safe to use on server
import {
    FormattedPlatformSnapshot,
    FormattedFullAssetDetails,
    FormattedTradingMetrics,
    FormattedMarketAnalysis,
    ContractErrorResponse,
    PlatformAnalyticsData, // Assuming this interface is also needed here or defined shared
} from '@/src/mastra/tools/zenova/zenovaFormattedTypes'; // Adjust path if PlatformAnalyticsData moves
import { Hex } from 'viem';

// Minimal valid RuntimeContext for read-only tools on the server
// This can be expanded if tools need more from runtimeContext server-side
const mockRuntimeContext: any = {
    registry: new Map(),
    set: () => {},
    get: () => undefined,
    has: () => false,
    delete: () => false,
    clear: () => {},
    agentId: 'apiAgent',
    sessionId: 'apiSession',
    userId: 'apiUser',
    conversationId: 'apiConversation',
    toolCallId: 'apiToolCall'
};

// It's good practice to define the response type for your API route
// If PlatformAnalyticsData is not in zenovaFormattedTypes, define it here or import from usePlatformAnalytics.ts
// For now, assuming it might be moved to a shared types location or duplicated if necessary.
// Re-defining or importing PlatformAnalyticsData interface if not shared:
// export interface PlatformAnalyticsData { ... } // from usePlatformAnalytics.ts

export async function GET(req: NextRequest) {
    console.log("[App API /api/platform-analytics] GET Handler called. Method:", req.method);

    // In App Router, method check is usually handled by defining specific function like GET, POST etc.
    // If you need to restrict to GET for this specific path, it's implicitly handled by naming the function GET.

    try {
        console.log("[App API] Fetching platform snapshot...");
        const snapshotResponse = await getPlatformSnapshotTool.execute({ runtimeContext: mockRuntimeContext, context: {} });
        console.log("[App API] Snapshot response:", snapshotResponse);
        if (snapshotResponse && typeof snapshotResponse === 'object' && 'error' in snapshotResponse) {
            throw new Error(`Failed to fetch platform snapshot: ${(snapshotResponse as ContractErrorResponse).error}`);
        }
        const snapshot = snapshotResponse as FormattedPlatformSnapshot;

        console.log("[App API] Fetching asset addresses...");
        const assetAddressesResponse = await getAllAssetsFactoryTool.execute({ runtimeContext: mockRuntimeContext, context: {} });
        console.log("[App API] Asset addresses response:", assetAddressesResponse);
        if (assetAddressesResponse && typeof assetAddressesResponse === 'object' && 'error' in assetAddressesResponse) {
            throw new Error(`Failed to fetch asset addresses: ${(assetAddressesResponse as ContractErrorResponse).error}`);
        }
        const assetAddresses = assetAddressesResponse as Hex[];

        let allFullDetails: FormattedFullAssetDetails[] = [];
        let allTradingMetrics: FormattedTradingMetrics[] = [];

        if (assetAddresses.length > 0) {
            console.log(`[App API] Fetching analytics for ${assetAddresses.length} assets...`);
            const analyticsResponse = await getMultipleAssetAnalyticsTool.execute({ runtimeContext: mockRuntimeContext, context: { assetAddresses } });
            console.log("[App API] Multiple asset analytics response:", analyticsResponse);
            if (analyticsResponse && typeof analyticsResponse === 'object' && 'error' in analyticsResponse) {
                throw new Error(`Failed to fetch multiple asset analytics: ${(analyticsResponse as ContractErrorResponse).error}`);
            }
            const [details, metrics, /* analysis */] = analyticsResponse as [FormattedFullAssetDetails[], FormattedTradingMetrics[], FormattedMarketAnalysis[]];
            allFullDetails = details;
            allTradingMetrics = metrics;
        }

        const totalAssets = parseInt(snapshot.totalAssetsCreated, 10) || 0;
        const totalVolume = parseFloat(snapshot.totalTradingVolume) || 0;

        let calculatedTotalMarketCap = 0;
        allFullDetails.forEach(detail => {
            try {
                const marketCap = parseFloat(detail.pricingDetails.marketCap);
                if (!isNaN(marketCap)) {
                    calculatedTotalMarketCap += marketCap;
                }
            } catch (e) {
                console.warn("[App API]: Error parsing market cap for an asset:", detail.pricingDetails.marketCap, e);
            }
        });

        let totalTransactions = 0;
        allTradingMetrics.forEach(metrics => {
            totalTransactions += (parseInt(metrics.totalBuyTransactions, 10) || 0);
            totalTransactions += (parseInt(metrics.totalSellTransactions, 10) || 0);
        });

        let sumOfPrices = 0;
        let pricedAssetsCount = 0;
        allFullDetails.forEach(detail => {
            try {
                const price = parseFloat(detail.pricingDetails.currentPricePerToken);
                if (!isNaN(price) && price > 0) {
                    sumOfPrices += price;
                    pricedAssetsCount++;
                }
            } catch (e) {
                console.warn("[App API]: Error parsing price for an asset:", detail.pricingDetails.currentPricePerToken, e);
            }
        });
        const avgAssetPrice = pricedAssetsCount > 0 ? sumOfPrices / pricedAssetsCount : 0;

        const platformMetrics = {
            totalAssets,
            totalMarketCap: calculatedTotalMarketCap,
            totalVolume,
            activeTraders: 0, // Mocked
            totalTransactions,
            avgAssetPrice,
        };

        const volumeChartData = [{ name: "Total Volume", volume: totalVolume }];
        const priceChartData = [{ name: "Current Avg. Price", avgPrice: avgAssetPrice }];
        const sectorDistributionData = [
            { name: "Technology", value: 35, color: "#F4A261" },
            { name: "Healthcare", value: 25, color: "#E76F51" },
            { name: "Finance", value: 20, color: "#2A9D8F" },
            { name: "Energy", value: 12, color: "#264653" },
            { name: "Other", value: 8, color: "#E9C46A" },
        ];
        const additionalPlatformInsights = {
            totalTransactionsFormatted: totalTransactions.toLocaleString(),
            averageAssetPriceFormatted: `$${avgAssetPrice.toFixed(2)}`,
            platformGrowthFormatted: "N/A",
            aiEvaluationsFormatted: "N/A",
            successRateFormatted: "N/A",
        };

        const responseData: PlatformAnalyticsData = {
            platformMetrics,
            volumeChartData,
            priceChartData,
            sectorDistributionData,
            additionalPlatformInsights,
        };

        console.log("[App API] Successfully processed data. Sending response:", responseData);
        return NextResponse.json(responseData, { status: 200 });

    } catch (error: any) {
        console.error("[App API Error /api/platform-analytics]", error.message, error.stack);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}

// To prevent issues with Edge runtime if any tool or its dependency is not compatible
export const dynamic = 'force-dynamic'; 
import { useQuery } from '@tanstack/react-query';
import { getAssetFullDetails } from '@/src/mastra/tools/zenova/zenovaBlockchainInteractions';
import { FormattedFullAssetDetails, ContractErrorResponse } from '@/src/mastra/tools/zenova/zenovaFormattedTypes';

const fetchAssetDetails = async (assetAddress: string): Promise<FormattedFullAssetDetails> => {
    if (!assetAddress) {
        throw new Error("Asset address is required.");
    }
    const response = await getAssetFullDetails(assetAddress);
    if (typeof response === 'object' && 'error' in response) {
        console.error(`Error fetching asset details for ${assetAddress}:`, (response as ContractErrorResponse).error);
        throw new Error(`Failed to fetch asset details: ${(response as ContractErrorResponse).error}`);
    }
    return response as FormattedFullAssetDetails;
};

export function useAssetDetails(assetAddress: string) {
    return useQuery<FormattedFullAssetDetails, Error>({
        queryKey: ['zenova', 'assetDetails', assetAddress],
        queryFn: () => fetchAssetDetails(assetAddress),
        enabled: !!assetAddress, // Only run query if assetAddress is available
        // Optional React Query options:
        // staleTime: 5 * 60 * 1000, // 5 minutes
        // cacheTime: 10 * 60 * 1000, // 10 minutes
    });
} 
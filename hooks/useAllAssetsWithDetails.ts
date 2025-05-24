import { useQuery } from '@tanstack/react-query';
import {
  getAllZenovaAssets,
  getMultipleAssetFullDetails,
} from '../src/mastra/tools/zenova/zenovaBlockchainInteractions';
import {
  FormattedFullAssetDetails,
} from '../src/mastra/tools/zenova/zenovaFormattedTypes';

const fetchAllAssetsWithDetails = async (): Promise<FormattedFullAssetDetails[]> => {
  const assetsAddressesResponse = await getAllZenovaAssets();

  if (typeof assetsAddressesResponse === 'object' && 'error' in assetsAddressesResponse) {
    console.error("Error fetching all asset addresses:", assetsAddressesResponse.error);
    throw new Error(`Failed to fetch asset addresses: ${assetsAddressesResponse.error}`);
  }

  if (!assetsAddressesResponse || assetsAddressesResponse.length === 0) {
    return [];
  }

  // Ensure assetAddressesResponse is string[] for getMultipleAssetFullDetails
  const assetAddressesStrings = assetsAddressesResponse as string[];

  const assetDetailsResponse = await getMultipleAssetFullDetails(assetAddressesStrings);

  if (typeof assetDetailsResponse === 'object' && 'error' in assetDetailsResponse) {
    console.error("Error fetching multiple asset details:", assetDetailsResponse.error);
    throw new Error(`Failed to fetch asset details: ${assetDetailsResponse.error}`);
  }

  return assetDetailsResponse;
};

export function useAllAssetsWithDetails() {
  return useQuery<FormattedFullAssetDetails[], Error>({
    queryKey: ['zenova', 'allAssetsWithDetails'],
    queryFn: fetchAllAssetsWithDetails,
    // Optional React Query options:
    // staleTime: 5 * 60 * 1000, // 5 minutes
    // cacheTime: 10 * 60 * 1000, // 10 minutes
  });
} 
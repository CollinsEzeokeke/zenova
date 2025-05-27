import { useQuery } from '@tanstack/react-query';
// Removed tool imports as they are now used in the API route
import type { PlatformAnalyticsData } from '@/src/mastra/tools/zenova/zenovaFormattedTypes'; // Assuming PlatformAnalyticsData is here or update path

// If PlatformAnalyticsData is not in zenovaFormattedTypes, it needs to be defined or imported from a shared location.
// For example, if it was moved to the API route file, this import would be different or the type redefined here.
// For now, let's assume it's correctly located or you will adjust the import.

const fetchPlatformAnalyticsData = async (): Promise<PlatformAnalyticsData> => {
    const response = await fetch('/api/platform-analytics');
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API request failed with status ${response.status}`);
    }
    return response.json();
};

export function usePlatformAnalytics() {
    return useQuery<PlatformAnalyticsData, Error>({
        queryKey: ['zenova', 'platformAnalyticsData'], // Query key remains the same
        queryFn: fetchPlatformAnalyticsData, // Uses the new fetcher
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10,  // 10 minutes
    });
} 
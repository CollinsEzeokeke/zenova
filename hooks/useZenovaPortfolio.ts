import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { getUserPortfolioDetails } from "@/src/mastra/tools/zenova/zenovaBlockchainInteractions";
import { FormattedUserPortfolioDetails, ContractErrorResponse } from "@/src/mastra/tools/zenova/zenovaFormattedTypes";
import { Hex } from "viem";

export const useZenovaPortfolio = () => {
  const { address: userAddress, isConnected } = useAccount();

  type ZenovaPortfolioQueryKey = readonly [string, Hex | undefined];

  return useQuery<
    FormattedUserPortfolioDetails,
    Error,
    FormattedUserPortfolioDetails,
    ZenovaPortfolioQueryKey
  >({
    queryKey: ['zenovaUserPortfolio', userAddress] as ZenovaPortfolioQueryKey,
    queryFn: async () => {
      if (!userAddress) {
        throw new Error("User address not available."); 
      }
      const portfolioDetails = await getUserPortfolioDetails(userAddress);
      
      if (portfolioDetails && typeof portfolioDetails === 'object' && 'error' in portfolioDetails) {
        throw new Error((portfolioDetails as ContractErrorResponse).error);
      }
      return portfolioDetails as FormattedUserPortfolioDetails;
    },
    enabled: !!userAddress && isConnected,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: true,
    retry: (failureCount: number, error: Error) => {
      if (error.message.includes("User address not available.") || error.message.includes("Invalid user address provided.")) {
          return false;
      }
      return failureCount < 2;
    },
  });
}; 
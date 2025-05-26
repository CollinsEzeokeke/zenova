import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { erc20Abi, formatUnits, Hex } from 'viem';
import { publicClient } from '@/src/utils/publicClient';

const fetchTokenBalance = async (tokenAddress: Hex | undefined, userAddress: Hex | undefined, decimals: number | undefined): Promise<string> => {
    // This check is mostly defensive, as react-query's `enabled` flag should prevent this function
    // from being called if these are undefined. However, it adds an extra layer of safety.
    console.log("[fetchTokenBalance] Top of function. Params:", { tokenAddress, userAddress, decimals });
    if (!tokenAddress || !userAddress || typeof decimals === 'undefined') {
        console.warn("[fetchTokenBalance] Called with missing params. This shouldn't happen if 'enabled' is working correctly.", { tokenAddress, userAddress, decimals });
        return '0'; // Return '0' to fulfill the Promise<string> contract
    }
    try {
        console.log(`[fetchTokenBalance] Fetching balance for token: ${tokenAddress}, user: ${userAddress}, decimals: ${decimals}`);
        const balance = await publicClient.readContract({
            abi: erc20Abi,
            address: tokenAddress,
            functionName: 'balanceOf',
            args: [userAddress],
        });
        console.log(`[fetchTokenBalance] Raw balance for ${tokenAddress}:`, balance);
        const formattedBalance = formatUnits(balance, decimals);
        console.log(`[fetchTokenBalance] Formatted balance for ${tokenAddress}: ${formattedBalance}`);
        return formattedBalance;
    } catch (error) {
        console.error(`[fetchTokenBalance] Error fetching balance for token ${tokenAddress} and user ${userAddress}:`, error);
        return '0'; // Default to '0' on contract read error
    }
};

export function useUserTokenBalance(tokenAddress: Hex | undefined, decimals: number | undefined) {
    const { address: userAddress, isConnected } = useAccount();

    const queryEnabled = !!tokenAddress && !!userAddress && isConnected && typeof decimals !== 'undefined';
    console.log("[useUserTokenBalance] Hook evaluation. Params:", { tokenAddress, userAddress, isConnected, decimals, queryEnabled });

    return useQuery<string, Error>({
        queryKey: ['userTokenBalance', tokenAddress, userAddress, decimals],
        queryFn: () => {
            // CRITICAL LOG: Is react-query calling this function?
            console.log("[useUserTokenBalance] queryFn EXECUTING. Current params in closure:", { tokenAddress, userAddress, decimals });

            // Defensive check: ensure params are still valid at the moment of execution
            if (!tokenAddress || !userAddress || typeof decimals === 'undefined') {
                console.warn("[useUserTokenBalance] queryFn: Critical params became undefined between hook evaluation and queryFn execution.", { tokenAddress, userAddress, decimals });
                return Promise.resolve('0');
            }
            return fetchTokenBalance(tokenAddress, userAddress, decimals);
        },
        enabled: queryEnabled,
        // initialData: '0', // User commented this out
        // staleTime: 5000, 
        // refetchInterval: 15000,
    });
} 
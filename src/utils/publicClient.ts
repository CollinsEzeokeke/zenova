import { createPublicClient, http } from "viem";

import { assetChainTestnet } from "viem/chains";






if (!process.env.NEXT_PUBLIC_ASSETCHAIN_TESTNET_RPC_URL) {
    throw new Error('NEXT_PUBLIC_ASSETCHAIN_TESTNET_RPC_URL is not set');
}

export const publicClient = createPublicClient({
    chain: assetChainTestnet,
    transport: http(process.env.NEXT_PUBLIC_ASSETCHAIN_TESTNET_RPC_URL),
});







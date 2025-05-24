import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { assetChainTestnet } from "viem/chains";


// Check if environment variables are set
if (!process.env.AI_BOT_PRIVATE_KEY) {
    throw new Error('AI_BOT_PRIVATE_KEY is not set');
}
if (!process.env.NEXT_PUBLIC_ASSETCHAIN_TESTNET_RPC_URL) {
    throw new Error('NEXT_PUBLIC_ASSETCHAIN_TESTNET_RPC_URL is not set');
}

export const publicClient = createPublicClient({
    chain: assetChainTestnet,
    transport: http(process.env.NEXT_PUBLIC_ASSETCHAIN_TESTNET_RPC_URL),
});

const aiAccount = privateKeyToAccount(process.env.AI_BOT_PRIVATE_KEY as `0x${string}`);

export const aiWalletClient = createWalletClient({
    account: aiAccount,
    chain: assetChainTestnet,
    transport: http(process.env.NEXT_PUBLIC_ASSETCHAIN_TESTNET_RPC_URL),
});






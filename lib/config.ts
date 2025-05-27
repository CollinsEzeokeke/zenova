'use client';

import { http, createStorage, cookieStorage } from 'wagmi';
import { assetChainTestnet } from 'wagmi/chains';
import { Chain, getDefaultConfig } from '@rainbow-me/rainbowkit';
// import { defineChain } from 'viem'; // defineChain removed as localhost is commented

// --- Chain Definitions ---

// const localhost = /*#__PURE__*/ defineChain({
//   id: 31337,
//   name: 'Localhost',
//   nativeCurrency: {
//     decimals: 18,
//     name: 'Ether',
//     symbol: 'ETH',
//   },
//   rpcUrls: {
//     default: { http: ['http://127.0.0.1:8545'] },
//   },
// });



// --- Environment Variable Checks ---

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECTION_PROJECTID;
if (!projectId) {
  throw new Error('NEXT_PUBLIC_WALLETCONNECTION_PROJECTID is not set. Please add it to your .env file.');
}

const assetChainTestnetRpcUrl = process.env.NEXT_PUBLIC_ASSETCHAIN_TESTNET_RPC_URL;
if (!assetChainTestnetRpcUrl) {
  throw new Error('NEXT_PUBLIC_ASSETCHAIN_TESTNET_RPC_URL is not set. Please add it to your .env file.');
}


const rpcUrls: { [key: number]: string } = {
  [assetChainTestnet.id]: assetChainTestnetRpcUrl,
  // [sepolia.id]: sepoliaRpcUrl, // Example for another chain
  // Add other chains and their RPCs here
};


const supportedChains: Chain[] = [assetChainTestnet];


// --- Wagmi Configuration ---

export const config = getDefaultConfig({
  appName: "Zenova WalletConnection", // Updated App Name
  projectId,
  chains: supportedChains as any,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: supportedChains.reduce((obj, chain) => {
    const rpcUrlForChain = rpcUrls[chain.id];
    if (!rpcUrlForChain) {
      // This check is important if a chain in supportedChains doesn't have a defined RPC URL in rpcUrls
      console.warn(`RPC URL for chain ID ${chain.id} (${chain.name}) is not configured in rpcUrls. Skipping transport setup for this chain.`);
      return obj;
    }
    return {
      ...obj,
      [chain.id]: http(rpcUrlForChain, {
        retryCount: 3,
        retryDelay: 1000, // milliseconds
      }),
    };
  }, {} as { [chainId: number]: ReturnType<typeof http> }),
});

// No need for explicit export of constants below this point unless truly necessary for other files
// and not already covered by exporting 'config' or specific chain definitions.




// Export constants for use in other files
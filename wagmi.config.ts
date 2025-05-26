import { defineConfig } from '@wagmi/cli'
import { react } from '@wagmi/cli/plugins'
import ZenovaAssetFactoryABI from './abis/ZenovaAssetFactory.abi.json'
import ZenovaAssetABI from './abis/ZenovaAsset.abi.json'
import USDTMockABI from './abis/USDTMock.abi.json'
import { Abi } from 'viem'

// Deployment Block Number: 2310274
export default defineConfig({
    out: 'generated.ts',
    contracts: [
        {
            name: "ZenovaAssetFactory",
            address: {
                42421: "0x0fEb5A774883Ef8FB8F709e96a7dA72611961B12"
            },
            abi: ZenovaAssetFactoryABI as Abi
        },
        {
            name: "ZenovaAsset",
            address: {
                // This address is the implementation address from deployment.json (ZenovaAsset_Implementation)
                42421: "0x0244Fe25484349fE8CaEb4DC1e28F1baF94f3AFC"
            },
            abi: ZenovaAssetABI as Abi,
        },
        {
            name: "USDTMock",
            address: {
                42421: "0x8acDE6a05Ef33dBf2448680D3d7B37582CeC3cAe"
            },
            abi: USDTMockABI as Abi,
        }
    ],
    plugins: [
        react(),
    ],
})


import { defineConfig } from '@wagmi/cli'
import { react } from '@wagmi/cli/plugins'
import ZenovaAssetFactoryABI from './abis/ZenovaAssetFactory.abi.json'
import ZenovaAssetABI from './abis/ZenovaAsset.abi.json'
import USDTMockABI from './abis/USDTMock.abi.json'
import { Abi } from 'viem'

export default defineConfig({
    out: 'generated.ts',
    contracts: [
        {
            name: "ZenovaAssetFactory",
            address: {
                42421: "0x2CC8cc0344a2cb03c1F06A1A523969f7Cbfe55B3"
            },
            abi: ZenovaAssetFactoryABI as Abi
        },
        {
            name: "ZenovaAsset",
            address: {
                // This address is the implementation address from deployment.json (ZenovaAsset_Implementation)
                42421: "0xDe06ca34EA978e7361C3c27e31F082f2996606a5"
            },
            abi: ZenovaAssetABI as Abi,
        },
        {
            name: "USDTMock",
            address: {
                42421: "0x75803eaC2e855C03a17c1140f4bC0155a5067F6f"
            },
            abi: USDTMockABI as Abi,
        }
    ],
    plugins: [
        react(),
    ],
})


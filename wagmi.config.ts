import { defineConfig } from "@wagmi/cli";
import { react } from "@wagmi/cli/plugins";
import { Abi } from "viem";

export default defineConfig({
    out: "generated.ts",
    contracts: [
        {
            name: "MyContract",
            address: {
                1223: "0x123",
                1224: "0x123",
            },
            abi: [],

        }
    ],
    plugins: [react()],
});

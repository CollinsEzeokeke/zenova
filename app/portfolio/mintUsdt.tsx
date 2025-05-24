import { usdtMockConfig } from "@/generated";
import { toast } from "sonner";
import { parseUnits } from "viem";
import { useAccount, useWriteContract, usePublicClient } from "wagmi";

export default function MintUsdt() {
const {writeContractAsync:mintUsdt} = useWriteContract();
const publicClient = usePublicClient();

const {address:userAddress} = useAccount();


const usdtToMint = parseUnits("100000", 6)




     const  handleMintUsdt = async () => {
        if(!userAddress || !publicClient) {
            toast.error("Please connect your wallet")
            return;
        }

      const txHash = await toast.promise(mintUsdt({
            abi: usdtMockConfig.abi,
            address: usdtMockConfig.address[42421],
            functionName: "mintTestTokens",
            args: [userAddress, usdtToMint],
        }),{
            loading: "Minting USDT...",
            success: "USDT minted successfully",
            error: "Failed to mint USDT",
        }).unwrap();

        toast.promise(publicClient.waitForTransactionReceipt({hash:txHash}),{
            loading: "Waiting for transaction to be confirmed...",
            success: "Transaction confirmed",
            error: "Trasnsaction failed",
        })
        
     }

}

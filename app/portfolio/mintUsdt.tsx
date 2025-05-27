// import { parseUnits } from "viem"; // All usages commented out
// import { usdtMockConfig } from "@/generated"; // Unused
// import { toast } from "sonner"; // Unused
// import { useAccount, useWriteContract, usePublicClient } from "wagmi"; // Hooks unused as function using them is commented

export default function MintUsdt() {
// const {writeContractAsync:mintUsdt} = useWriteContract(); // Unused
// const publicClient = usePublicClient(); // Unused

// const {address:userAddress} = useAccount(); // Unused


// const usdtToMint = parseUnits("100000", 6) // Unused




    //  const  handleMintUsdt = async () => {
    //     if(!userAddress || !publicClient) {
    //         toast.error("Please connect your wallet")
    //         return;
    //     }

    //   const txHash = await toast.promise(mintUsdt({
    //         abi: usdtMockConfig.abi,
    //         address: usdtMockConfig.address[42421],
    //         functionName: "mintTestTokens",
    //         args: [userAddress, usdtToMint],
    //     }),{
    //         loading: "Minting USDT...",
    //         success: "USDT minted successfully",
    //         error: "Failed to mint USDT",
    //     }).unwrap();

    //     toast.promise(publicClient.waitForTransactionReceipt({hash:txHash}),{
    //         loading: "Waiting for transaction to be confirmed...",
    //         success: "Transaction confirmed",
    //         error: "Trasnsaction failed",
    //     })
        
    //  }

}

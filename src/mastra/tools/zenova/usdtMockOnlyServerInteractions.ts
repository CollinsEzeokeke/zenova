



// --- USDTMock Setter Functions ---

import { aiWalletClient } from "@/src/utils/aiWalletClient";
import { publicClient } from "@/src/utils/publicClient";
import { parseUnits, Hex, BaseError, getAddress } from "viem";
import { TransactionSuccessResponse, ContractErrorResponse } from "./zenovaFormattedTypes";
import { usdtMockConfig } from "@/generated";
const USDT_ADDRESS = usdtMockConfig.address[publicClient.chain.id] as Hex;
const USDT_ABI = usdtMockConfig.abi;
const USDT_DECIMALS = 6; // As defined in USDTMock.sol and used for formatting

function isValidAddress(address: string): boolean {
    try {
        getAddress(address);
        return true;
    } catch {
        return false;
    }
}
export async function mintUsdtTestTokens(
    recipient: string,
    amount: string // Human-readable USDT amount
): Promise<TransactionSuccessResponse | ContractErrorResponse> {
    if (!isValidAddress(recipient)) return { error: "Invalid recipient address provided." };
    if (parseFloat(amount) <= 0) return { error: "Amount must be positive." };

    try {
        const amountWei = parseUnits(amount, USDT_DECIMALS);

        const hash = await aiWalletClient.writeContract({
            address: USDT_ADDRESS,
            abi: USDT_ABI,
            functionName: "mintTestTokens",
            args: [recipient as Hex, amountWei],
            account: aiWalletClient.account,
        });

        const receipt = await publicClient.waitForTransactionReceipt({ hash });

        if (receipt.status === 'success') {
            return { success: true, transactionHash: hash, message: `Successfully minted ${amount} USDT to ${recipient}.` };
        } else {
            return { error: `USDT minting transaction failed. Status: ${receipt.status}` };
        }
    } catch (err: unknown) {
        const errorMessage = err instanceof BaseError ? err.shortMessage : (err instanceof Error ? err.message : String(err));
        console.error("Error in mintUsdtTestTokens:", errorMessage);
        if (errorMessage.includes("ExceedsMaxMint")) { // Simplified check based on common error substring
            return { error: "Mint amount exceeds the maximum allowed per transaction." };
        }
        return { error: `An unexpected error occurred during USDT minting: ${errorMessage}` };
    }
}

export async function bulkMintUsdtTestTokens(
    recipients: string[],
    amounts: string[] // Human-readable USDT amounts
): Promise<TransactionSuccessResponse | ContractErrorResponse> {
    if (recipients.length === 0 || amounts.length === 0) return { error: "Recipients and amounts arrays cannot be empty." };
    if (recipients.length !== amounts.length) return { error: "Recipients and amounts arrays must have the same length." };
    if (recipients.some(r => !isValidAddress(r))) return { error: "One or more recipient addresses are invalid." };
    if (amounts.some(a => parseFloat(a) <= 0)) return { error: "All amounts must be positive."};

    try {
        const recipientHexes = recipients.map(r => r as Hex);
        const amountWeis = amounts.map(a => parseUnits(a, USDT_DECIMALS));

        const hash = await aiWalletClient.writeContract({
            address: USDT_ADDRESS,
            abi: USDT_ABI,
            functionName: "bulkMintTestTokens",
            args: [recipientHexes, amountWeis],
            account: aiWalletClient.account,
        });
        
        const receipt = await publicClient.waitForTransactionReceipt({ hash });

        if (receipt.status === 'success') {
            return { success: true, transactionHash: hash, message: "Bulk USDT minting successful." };
        } else {
            return { error: `Bulk USDT minting transaction failed. Status: ${receipt.status}` };
        }
    } catch (err: unknown) {
        const errorMessage = err instanceof BaseError ? err.shortMessage : (err instanceof Error ? err.message : String(err));
        console.error("Error in bulkMintUsdtTestTokens:", errorMessage);
         if (errorMessage.includes("ExceedsMaxMint")) {
            return { error: "One of the mint amounts exceeds the maximum allowed per transaction." };
        }
        return { error: `An unexpected error occurred during bulk USDT minting: ${errorMessage}` };
    }
}

export async function burnUsdtTokens(
    amount: string // Human-readable USDT amount
): Promise<TransactionSuccessResponse | ContractErrorResponse> {
    if (parseFloat(amount) <= 0) return { error: "Amount to burn must be positive." };

    try {
        const amountWei = parseUnits(amount, USDT_DECIMALS);

        const hash = await aiWalletClient.writeContract({
            address: USDT_ADDRESS,
            abi: USDT_ABI,
            functionName: "burn",
            args: [amountWei],
            account: aiWalletClient.account, 
        });

        const receipt = await publicClient.waitForTransactionReceipt({ hash });

        if (receipt.status === 'success') {
            return { success: true, transactionHash: hash, message: `Successfully burned ${amount} USDT.` };
        } else {
            return { error: `USDT burn transaction failed. Status: ${receipt.status}` };
        }
    } catch (err: unknown) {
        const errorMessage = err instanceof BaseError ? err.shortMessage : (err instanceof Error ? err.message : String(err));
        console.error("Error in burnUsdtTokens:", errorMessage);
        return { error: `An unexpected error occurred during USDT burn: ${errorMessage}` };
    }
}

// Note: ownerMint is excluded as per requirements (role management)
// Standard ERC20 functions like approve, transfer, transferFrom are also excluded for now
// but could be added if needed for the agent's capabilities. 
import { usdtMockConfig } from "@/generated";
import { Hex, getAddress, parseUnits, BaseError } from "viem";
import {
    ContractErrorResponse,
    TransactionSuccessResponse
} from "./zenovaFormattedTypes";
import {
    formatUsdtAmount,
    formatNumber
} from "./formatters";
import { publicClient } from "@/src/utils/publicClient";

const USDT_ADDRESS = usdtMockConfig.address[publicClient.chain.id] as Hex;
const USDT_ABI = usdtMockConfig.abi;
// const USDT_DECIMALS = 6; // As defined in USDTMock.sol and used for formatting

function isValidAddress(address: string): boolean {
    try {
        getAddress(address);
        return true;
    } catch {
        return false;
    }
}

// --- USDTMock Getter Functions ---

export async function getUsdtMaxMintPerTransactionConstant(): Promise<string | ContractErrorResponse> {
    try {
        const data = await publicClient.readContract({
            address: USDT_ADDRESS,
            abi: USDT_ABI,
            functionName: "MAX_MINT_PER_TRANSACTION", // Reading the public constant
        });
        return formatUsdtAmount(data);
    } catch (err: unknown) {
        const errorMessage = err instanceof BaseError ? err.shortMessage : (err instanceof Error ? err.message : String(err));
        console.error("Error in getUsdtMaxMintPerTransactionConstant:", errorMessage);
        return { error: `An unexpected error occurred: ${errorMessage}` };
    }
}

export async function getUsdtMaxMintPerTransactionFunction(): Promise<string | ContractErrorResponse> {
    try {
        const data = await publicClient.readContract({
            address: USDT_ADDRESS,
            abi: USDT_ABI,
            functionName: "getMaxMintPerTransaction",
        });
        return formatUsdtAmount(data);
    } catch (err: unknown) {
        const errorMessage = err instanceof BaseError ? err.shortMessage : (err instanceof Error ? err.message : String(err));
        console.error("Error in getUsdtMaxMintPerTransactionFunction:", errorMessage);
        return { error: `An unexpected error occurred: ${errorMessage}` };
    }
}

export async function getUsdtTotalSupply(): Promise<string | ContractErrorResponse> {
    try {
        const data = await publicClient.readContract({
            address: USDT_ADDRESS,
            abi: USDT_ABI,
            functionName: "totalSupply",
        });
        return formatUsdtAmount(data);
    } catch (err: unknown) {
        const errorMessage = err instanceof BaseError ? err.shortMessage : (err instanceof Error ? err.message : String(err));
        console.error("Error in getUsdtTotalSupply:", errorMessage);
        return { error: `An unexpected error occurred: ${errorMessage}` };
    }
}

export async function getUsdtBalanceOf(account: string): Promise<string | ContractErrorResponse> {
    if (!isValidAddress(account)) return { error: "Invalid account address provided." };
    try {
        const data = await publicClient.readContract({
            address: USDT_ADDRESS,
            abi: USDT_ABI,
            functionName: "balanceOf",
            args: [account as Hex],
        });
        return formatUsdtAmount(data);
    } catch (err: unknown) {
        const errorMessage = err instanceof BaseError ? err.shortMessage : (err instanceof Error ? err.message : String(err));
        console.error("Error in getUsdtBalanceOf:", errorMessage);
        return { error: `An unexpected error occurred: ${errorMessage}` };
    }
}

export async function convertUsdtToWei(humanAmount: string): Promise<string | ContractErrorResponse> {
    try {
        // The contract's toWei function expects the human-readable amount directly.
        // e.g., if humanAmount is "100", it expects 100 to be passed.
        // parseUnits(humanAmount, 0) will convert "100" or "100.0" to 100n.
        const amountForContract = parseUnits(humanAmount, 0); 
        const data = await publicClient.readContract({
            address: USDT_ADDRESS,
            abi: USDT_ABI,
            functionName: "toWei",
            args: [amountForContract] 
        });
        return data.toString(); 
    } catch (err: unknown) {
        const errorMessage = err instanceof BaseError ? err.shortMessage : (err instanceof Error ? err.message : String(err));
        console.error("Error in convertUsdtToWei:", errorMessage);
        return { error: `An unexpected error occurred: ${errorMessage}` };
    }
}

export async function convertUsdtFromWei(weiAmount: string): Promise<string | ContractErrorResponse> {
    try {
        const amount = BigInt(weiAmount);
        const data = await publicClient.readContract({
            address: USDT_ADDRESS,
            abi: USDT_ABI,
            functionName: "fromWei",
            args: [amount],
        });
        return formatNumber(data); 
    } catch (err: unknown) {
        const errorMessage = err instanceof BaseError ? err.shortMessage : (err instanceof Error ? err.message : String(err));
        console.error("Error in convertUsdtFromWei:", errorMessage);
        return { error: `An unexpected error occurred: ${errorMessage}` };
    }
}








// --- Factory Setter Functions (Refactored) ---

import { aiWalletClient } from "@/src/utils/aiWalletClient";
import { publicClient } from "@/src/utils/publicClient";
import { parseUnits, Hex, BaseError, getAbiItem, decodeEventLog, getAddress } from "viem";
import { formatAddress } from "./formatters";
import { TransactionSuccessResponse, ContractErrorResponse } from "./zenovaFormattedTypes";
import { zenovaAssetFactoryConfig } from "@/generated";
const FACTORY_ADDRESS = zenovaAssetFactoryConfig.address[publicClient.chain.id] as Hex;
const FACTORY_ABI = zenovaAssetFactoryConfig.abi;
// const USDT_ADDRESS = usdtMockConfig.address[publicClient.chain.id] as Hex;
const USDT_DECIMALS = 6;
// const DEFAULT_TOKEN_DECIMALS = 18;

function isValidAddress(address: string): boolean {
    try {
        getAddress(address);
        return true;
    } catch {
        return false;
    }
}

// Define the expected arguments for the ZenovaAssetCreated event
interface ZenovaAssetCreatedEventArgs {
    assetAddress: Hex;
    companyWallet: Hex;
    companyName: string;
    creator: Hex;
    initialValuation: bigint;
    maxTokenSupply: bigint;
    // Add other event parameters if they exist and are needed
}

export async function submitCompanyValuationFactory(
    companyWallet: string,
    valuation: string, 
    initialPricePerToken: string 
): Promise<TransactionSuccessResponse | ContractErrorResponse> {
    if (!isValidAddress(companyWallet)) return { error: "Invalid company wallet address provided." };
    if (parseFloat(valuation) <= 0) return { error: "Valuation must be positive."};
    if (parseFloat(initialPricePerToken) <= 0) return { error: "Initial price per token must be positive."};

    try {
        const valuationWei = parseUnits(valuation, USDT_DECIMALS);
        const initialPricePerTokenWei = parseUnits(initialPricePerToken, USDT_DECIMALS);

        const hash = await aiWalletClient.writeContract({
            address: FACTORY_ADDRESS,
            abi: FACTORY_ABI,
            functionName: "submitCompanyValuation",
            args: [companyWallet as Hex, valuationWei, initialPricePerTokenWei],
            account: aiWalletClient.account, 
        });
        const receipt = await publicClient.waitForTransactionReceipt({ hash });

        if (receipt.status === 'success') {
            return { success: true, transactionHash: hash, message: "Company valuation submitted successfully." };
        } else {
            return { error: `Company valuation submission failed. Status: ${receipt.status}` };
        }
    } catch (err: unknown) {
        const errorMessage = err instanceof BaseError ? err.shortMessage : (err instanceof Error ? err.message : String(err));
        console.error("Error in submitCompanyValuationFactory:", errorMessage);
        return { error: `An unexpected error occurred: ${errorMessage}` };
    }
}

export async function createZenovaAssetFactory(
    companyWallet: string, 
    companyInfo: { 
        name: string;
        symbol: string;
        description?: string;
        website?: string;
        issuingCompanyWallet: Hex;
    }
): Promise<(TransactionSuccessResponse & { assetAddress?: Hex }) | ContractErrorResponse> {
    if (!isValidAddress(companyWallet)) return { error: "Invalid company wallet address for valuation lookup." };
    if (!isValidAddress(companyInfo.issuingCompanyWallet)) return { error: "Invalid issuing company wallet in company info." };
    if (companyInfo.issuingCompanyWallet.toLowerCase() !== companyWallet.toLowerCase()) {
        return { error: "Issuing company wallet in company info must match the company wallet used for valuation." };
    }
    if (!companyInfo.name || !companyInfo.symbol) return { error: "Company name and symbol are required." };

    try {
        const companyInfoArg = {
            name: companyInfo.name,
            symbol: companyInfo.symbol,
            description: companyInfo.description ?? "",
            website: companyInfo.website ?? "",
            issuingCompanyWallet: companyInfo.issuingCompanyWallet,
        };

        const hash = await aiWalletClient.writeContract({
            address: FACTORY_ADDRESS,
            abi: FACTORY_ABI,
            functionName: "createZenovaAsset",
            args: [companyWallet as Hex, companyInfoArg],
            account: aiWalletClient.account,
        });
        const receipt = await publicClient.waitForTransactionReceipt({ hash });

        if (receipt.status === 'success') {
            let newAssetAddress: Hex | undefined = undefined;
            const eventAbiItem = getAbiItem({ abi: FACTORY_ABI, name: 'ZenovaAssetCreated' });
            if (!eventAbiItem) {
                console.warn("ZenovaAssetCreated event ABI item not found. Cannot extract new asset address from logs.");
                return {
                    success: true, 
                    transactionHash: hash, 
                    message: "Zenova Asset creation transaction succeeded, but new asset address could not be determined from logs (event ABI missing)."
                };
            }

            for (const log of receipt.logs) {
                try {
                    const decodedEvent = decodeEventLog({
                        abi: [eventAbiItem], // decodeEventLog expects an array of ABI items
                        data: log.data,
                        topics: log.topics
                    });
                    if (decodedEvent.eventName === 'ZenovaAssetCreated') {
                        // Use the specific event args type for casting
                        const eventArgs = decodedEvent.args as ZenovaAssetCreatedEventArgs;
                        newAssetAddress = formatAddress(eventArgs.assetAddress);
                        break;
                    }
                } catch (decodeError) {
                    // Not the event we're looking for, or an issue decoding it.
                    console.debug("Failed to decode a log or not the ZenovaAssetCreated event:", decodeError);
                }
            }

            if (newAssetAddress) {
                return { 
                    success: true, 
                    transactionHash: hash, 
                    assetAddress: newAssetAddress,
                    message: `Zenova Asset created successfully at ${newAssetAddress}.` 
                };
            } else {
                return { 
                    success: true, 
                    transactionHash: hash, 
                    message: "Zenova Asset creation transaction succeeded, but new asset address could not be determined from logs."
                };
            }
        } else {
            return { error: `Zenova Asset creation failed. Status: ${receipt.status}` };
        }
    } catch (err: unknown) {
        const errorMessage = err instanceof BaseError ? err.shortMessage : (err instanceof Error ? err.message : String(err));
        console.error("Error in createZenovaAssetFactory:", errorMessage);
        if (errorMessage.includes("ValuationNotFound")) {
            return { error: "Valuation for the company wallet not found or already used. Please submit valuation first." };
        }
        if (errorMessage.includes("NotAuthorized")) {
            return { error: "The AI agent attempting to create the asset is not the one that submitted the valuation." };
        }
        return { error: `An unexpected error occurred during asset creation: ${errorMessage}` };
    }
}

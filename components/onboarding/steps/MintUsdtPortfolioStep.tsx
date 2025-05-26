"use client";

import { usdtMockConfig } from "@/generated";
import { toast } from "sonner";
import { parseUnits, formatUnits, erc20Abi, Hex } from "viem";
import { useWriteContract, usePublicClient, useSwitchChain } from "wagmi";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, Cog, Box, Coins, TrendingUp, DollarSign, Loader2 } from "lucide-react";
import { useOnboardingStore } from "@/store/onboardingStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { USDT_TO_MINT } from "@/src/utils/constants";
const SUPPORTED_CHAIN_ID_FOR_USDT = 42421; // Ensure this is correct for your USDT mock contract
const USDT_DECIMALS = 6;

interface MintUsdtPortfolioStepProps {
    onMintingComplete: () => void;
}

const MintUsdtPortfolioStep: React.FC<MintUsdtPortfolioStepProps> = ({ onMintingComplete }) => {
    const {
        userAddress,
        setHasAttemptedUSDTMint,
        chainId: storedChainId
    } = useOnboardingStore();

    const { writeContractAsync: mintUsdt, isPending: isSendingMintTx, error: mintError } = useWriteContract();
    const publicClient = usePublicClient();
    const { switchChainAsync, isPending: isSwitchingChain, error: switchChainError } = useSwitchChain();

    const [hasLocallyMintedAndVerified, setHasLocallyMintedAndVerified] = useState(false);
    const [isConfirmingMintTx, setIsConfirmingMintTx] = useState(false);
    const [isVerifyingBalance, setIsVerifyingBalance] = useState(false);

    const isCorrectChain = storedChainId === SUPPORTED_CHAIN_ID_FOR_USDT;

    const currentUsdtContractAddress = usdtMockConfig.address[SUPPORTED_CHAIN_ID_FOR_USDT as keyof typeof usdtMockConfig.address];

    const handleSwitchChain = async () => {
        if (!switchChainAsync) {
            toast.error("Could not initiate network switch. Please switch manually in your wallet.");
            return;
        }
        try {
            await toast.promise(switchChainAsync({ chainId: SUPPORTED_CHAIN_ID_FOR_USDT }), {
                loading: `Switching to network ${SUPPORTED_CHAIN_ID_FOR_USDT}...`,
                success: "Network switched successfully!",
                error: (err) => `Failed to switch network: ${(err as any)?.shortMessage || err.message}`,
            });
        } catch (e) {
            // Error already handled by toast.promise
        }
    };

    const verifyMintedUsdtBalance = async (expectedAmountWei: bigint, retries = 5, delayMs = 2000): Promise<boolean> => {
        if (!userAddress || !publicClient || !currentUsdtContractAddress) return false;
        setIsVerifyingBalance(true);
        toast.info("Verifying USDT balance...");

        for (let i = 0; i < retries; i++) {
            try {
                const balanceWei = await publicClient.readContract({
                    abi: erc20Abi,
                    address: currentUsdtContractAddress as Hex,
                    functionName: "balanceOf",
                    args: [userAddress as Hex],
                });

                // For simplicity, we check if the balance is at least the minted amount.
                // A more robust check might involve storing balance before minting.
                if (balanceWei >= expectedAmountWei) {
                    toast.success(`Balance confirmed: ${formatUnits(balanceWei, USDT_DECIMALS)} USDT`);
                    setIsVerifyingBalance(false);
                    return true;
                }
                toast.info(`Attempt ${i + 1}/${retries}: Current balance ${formatUnits(balanceWei, USDT_DECIMALS)} USDT. Waiting for update...`);
            } catch (e) {
                console.error(`Balance verification attempt ${i + 1} failed:`, e);
                toast.error(`Balance verification attempt ${i + 1} failed.`);
            }
            if (i < retries - 1) {
                await new Promise(resolve => setTimeout(resolve, delayMs));
            }
        }
        setIsVerifyingBalance(false);
        toast.error("Failed to verify minted USDT balance after several attempts. Please check your wallet manually.");
        return false;
    };

    const handleMintUsdt = async () => {
        if (!userAddress || !publicClient) {
            toast.error("Wallet not connected or client not ready.");
            return;
        }
        if (!isCorrectChain) {
            toast.error(`Please switch to the correct network (ID: ${SUPPORTED_CHAIN_ID_FOR_USDT}) to mint USDT.`);
            return;
        }
        if (!currentUsdtContractAddress) {
            toast.error(`USDT contract address not configured for chain ID ${SUPPORTED_CHAIN_ID_FOR_USDT}. Check configuration.`);
            return;
        }

        try {
            const txHash = await toast.promise(mintUsdt({
                abi: usdtMockConfig.abi,
                address: currentUsdtContractAddress as Hex,
                functionName: "mintTestTokens",
                args: [userAddress as Hex, USDT_TO_MINT],
            }), {
                loading: "Sending USDT Minting Transaction...",
                success: (hash) => `USDT Minting Transaction Sent! Hash: ${hash.substring(0, 10)}...`,
                error: (err) => `Failed to send mint transaction: ${(err as any)?.shortMessage || err.message}`,
            }).unwrap();

            if (txHash && publicClient) {
                setIsConfirmingMintTx(true);
                toast.promise(publicClient.waitForTransactionReceipt({ hash: txHash }), {
                    loading: "Confirming transaction...",
                    success: async (receipt) => {
                        setIsConfirmingMintTx(false);
                        toast.success(`USDT Mint Transaction Confirmed! Tx: ${receipt.transactionHash.substring(0, 10)}...`);
                        const verificationSuccess = await verifyMintedUsdtBalance(USDT_TO_MINT);
                        if (verificationSuccess) {
                            setHasLocallyMintedAndVerified(true);
                            setHasAttemptedUSDTMint(true); // Update global store
                        }
                        return `Transaction confirmed. Verifying balance...`; // This toast is brief before verifyMintedUsdtBalance shows its own toasts.
                    },
                    error: (err) => {
                        setIsConfirmingMintTx(false);
                        return `USDT minting transaction failed confirmation: ${(err as Error).message}`;
                    },
                });
            }
        } catch (e) {
            // Errors from the initial mintUsdt promise or other issues
            console.error("Minting error caught in handleMintUsdt:", e);
        }
    };

    useEffect(() => {
        if (hasLocallyMintedAndVerified) {
            const timer = setTimeout(() => {
                onMintingComplete();
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [hasLocallyMintedAndVerified, onMintingComplete]);

    const isProcessing = isSendingMintTx || isConfirmingMintTx || isVerifyingBalance || isSwitchingChain;

    if (!userAddress) {
        return (
            <div className="text-center py-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-16 h-16 bg-metamesh-yellow/10 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                    <AlertTriangle className="w-8 h-8 text-metamesh-yellow" />
                </motion.div>
                <h3 className="text-2xl font-bold text-metamesh-yellow mb-3">User Address Not Found</h3>
                <p className="text-gray-400 text-lg">Please ensure your wallet is connected to proceed with USDT minting.</p>
            </div>
        );
    }

    if (hasLocallyMintedAndVerified) {
        return (
            <div className="flex flex-col items-center justify-center text-center py-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative mb-8"
                >
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-metamesh-yellow/20 to-metamesh-yellow/10 rounded-full flex items-center justify-center border border-metamesh-yellow/30">
                        <CheckCircle className="w-10 h-10 md:w-12 md:h-12 text-metamesh-yellow" />
                    </div>
                    <div className="absolute inset-0 bg-metamesh-yellow/20 rounded-full blur-xl animate-pulse"></div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="space-y-4"
                >
                    <h2 className="text-3xl md:text-4xl font-bold gradient-text">
                        Test USDT Obtained & Verified!
                    </h2>
                    <p className="text-gray-300 text-lg max-w-md mx-auto">
                        Your USDT balance has been confirmed. Finalizing your Zenova portfolio setup...
                    </p>
                </motion.div>

                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="mt-8 w-8 h-8 border-2 border-metamesh-yellow border-t-transparent rounded-full"
                />
            </div>
        );
    }

    let buttonContent;
    if (isSwitchingChain) {
        buttonContent = <><Loader2 className="w-5 h-5 mr-3 animate-spin" /> Switching Network...</>;
    } else if (isSendingMintTx) {
        buttonContent = <><Loader2 className="w-5 h-5 mr-3 animate-spin" /> Sending Transaction...</>;
    } else if (isConfirmingMintTx) {
        buttonContent = <><Loader2 className="w-5 h-5 mr-3 animate-spin" /> Confirming Transaction...</>;
    } else if (isVerifyingBalance) {
        buttonContent = <><Loader2 className="w-5 h-5 mr-3 animate-spin" /> Verifying Balance...</>;
    } else {
        buttonContent = <><DollarSign className="w-5 h-5 mr-3" /> Mint {formatUnits(USDT_TO_MINT, 6).toLocaleString()} Test USDT</>;
    }

    return (
        <div className="flex flex-col items-center justify-center text-center space-y-8">
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="relative"
            >
                <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-metamesh-yellow/20 to-metamesh-yellow/10 rounded-full flex items-center justify-center border border-metamesh-yellow/30">
                    <Coins className="w-10 h-10 md:w-12 md:h-12 text-metamesh-yellow" />
                </div>
                <div className="absolute inset-0 bg-metamesh-yellow/20 rounded-full blur-xl animate-pulse"></div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-4"
            >
                <h2 className="text-3xl md:text-4xl font-bold gradient-text">
                    Get Test USDT
                </h2>
                <p className="text-gray-400 text-lg max-w-lg mx-auto leading-relaxed">
                    Obtain test USDT to start trading tokenized company shares on Zenova's autonomous market platform.
                    You'll receive <span className="text-metamesh-yellow font-semibold">{formatUnits(USDT_TO_MINT, 6).toLocaleString()}</span> test USDT.
                </p>
            </motion.div>

            {!isCorrectChain && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="w-full max-w-lg"
                >
                    <Card className="bg-metamesh-yellow/5 border-metamesh-yellow/30 backdrop-blur-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center space-x-2 text-metamesh-yellow text-lg">
                                <AlertTriangle className="w-5 h-5" />
                                <span>Network Mismatch</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                                Your wallet is connected to network ID <span className="text-metamesh-yellow font-medium">{storedChainId ?? 'Unknown'}</span>,
                                but USDT minting requires network ID <span className="text-metamesh-yellow font-medium">{SUPPORTED_CHAIN_ID_FOR_USDT}</span>.
                            </p>
                            <motion.button
                                onClick={handleSwitchChain}
                                disabled={isProcessing || !switchChainAsync} // Use generic isProcessing
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-300 
                                           bg-metamesh-yellow text-metamesh-dark hover:bg-metamesh-yellow/90 
                                           disabled:bg-metamesh-gray disabled:text-gray-400 disabled:cursor-not-allowed 
                                           flex items-center justify-center shadow-lg hover:shadow-metamesh-yellow/20"
                            >
                                {isSwitchingChain ? (
                                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Switching Network...</>
                                ) : (
                                    <><TrendingUp className="w-4 h-4 mr-2" /> Switch to Network {SUPPORTED_CHAIN_ID_FOR_USDT}</>
                                )}
                            </motion.button>
                            {switchChainError && (
                                <p className="text-red-400 text-xs mt-2 text-center">
                                    Error: {(switchChainError as any)?.shortMessage || switchChainError.message}
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="w-full max-w-sm"
            >
                <motion.button
                    onClick={handleMintUsdt}
                    disabled={isProcessing || !isCorrectChain || hasLocallyMintedAndVerified}
                    whileHover={{ scale: !isProcessing && isCorrectChain ? 1.02 : 1 }}
                    whileTap={{ scale: !isProcessing && isCorrectChain ? 0.98 : 1 }}
                    className="w-full px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300 
                               bg-gradient-to-r from-metamesh-yellow to-metamesh-yellow/90 text-metamesh-dark 
                               hover:shadow-lg hover:shadow-metamesh-yellow/30
                               disabled:bg-metamesh-gray disabled:text-gray-400 disabled:cursor-not-allowed 
                               disabled:shadow-none flex items-center justify-center"
                >
                    {buttonContent}
                </motion.button>

                {mintError && !isSendingMintTx && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-red-400 text-sm mt-3 text-center"
                    >
                        Error: {(mintError as any)?.shortMessage || mintError.message}
                    </motion.p>
                )}
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="w-full max-w-lg"
            >
                <Card className="bg-metamesh-dark-card/30 border-metamesh-gray/20 backdrop-blur-sm">
                    <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                            <Box className="w-5 h-5 text-metamesh-yellow mt-0.5 flex-shrink-0" />
                            <div className="text-left">
                                <h4 className="font-semibold text-white text-sm mb-1">
                                    About Test USDT
                                </h4>
                                <p className="text-xs text-gray-400 leading-relaxed">
                                    This uses the mock USDT contract configured for chain {SUPPORTED_CHAIN_ID_FOR_USDT}.
                                    Test tokens have no real value and are used for demonstration purposes on Zenova's platform.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default MintUsdtPortfolioStep; 
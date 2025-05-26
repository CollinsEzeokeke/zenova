"use client";

import { useAccount, useChainId } from "wagmi";
import { useEffect, ReactNode, useRef } from "react";
import { motion } from "framer-motion";
import ConnectWalletPortfolioStep from "./steps/ConnectWalletPortfolioStep";
import GetRwaPortfolioStep from "./steps/GetRwaPortfolioStep";
import MintUsdtPortfolioStep from "./steps/MintUsdtPortfolioStep";
import { useOnboardingStore, PortfolioOnboardingStage } from "@/store/onboardingStore";
import { Card, CardContent } from "@/components/ui/card";
import { useUserTokenBalance } from "@/hooks/useUserTokenBalance";
import { usdtMockConfig } from "@/generated";
import { publicClient } from "@/src/utils/publicClient"; // For chain ID to get USDT address
import { Hex } from "viem";

interface PortfolioOnboardingFlowProps {
    children: ReactNode;
}

const SUPPORTED_CHAIN_ID_FOR_USDT = 42421; // Matching MintUsdtPortfolioStep
const USDT_DECIMALS = 6; // Matching MintUsdtPortfolioStep
// Get USDT address based on the typical chain ID it's deployed on for this app
const USDT_ADDRESS = usdtMockConfig.address[SUPPORTED_CHAIN_ID_FOR_USDT as keyof typeof usdtMockConfig.address];
const MIN_USDT_BALANCE_TO_SKIP_MINT = 100000;

const stageDetails = {
    [PortfolioOnboardingStage.CONNECT_WALLET]: {
        name: "Connect Wallet",
        description: "Connect your Web3 wallet to access Zenova's platform.",
    },
    [PortfolioOnboardingStage.GET_RWA]: {
        name: "Get Testnet RWA",
        description: "Acquire native RWA tokens for testnet transaction fees.",
    },
    [PortfolioOnboardingStage.MINT_USDT]: {
        name: "Get Test USDT",
        description: "Obtain test USDT to start trading tokenized company shares.",
    },
    [PortfolioOnboardingStage.COMPLETED]: {
        name: "Setup Complete",
        description: "Welcome to the future of decentralized public markets!",
    },
} as Record<PortfolioOnboardingStage, { name: string; description: string }>;

const PortfolioOnboardingFlow: React.FC<PortfolioOnboardingFlowProps> = ({ children }) => {
    const {
        currentStage,
        userAddress: storedUserAddress,
        isConnected: storedIsConnected,
        isConnecting: storedIsConnecting,
        hasAttemptedUSDTMint,
        hasRWA,
        hasPerformedRWACheck,
        setStage,
        setUserAccount,
        setHasAttemptedUSDTMint,
        setHasPerformedRWACheck,
        chainId: storedChainId,
    } = useOnboardingStore();

    const { address: wagmiUserAddress, isConnected: wagmiIsConnected, isConnecting: wagmiIsConnecting, connector, chain } = useAccount();
    const wagmiChainId = useChainId();
    const previousAddressRef = useRef<string | null | undefined>(null);
    const hasResetCheckFlagRef = useRef(false);

    // Fetch user's USDT balance
    const { data: userUsdtBalanceString, isLoading: isLoadingUsdtBalance } = useUserTokenBalance(
        USDT_ADDRESS as Hex | undefined, // Ensure USDT_ADDRESS is correctly typed or cast
        USDT_DECIMALS
    );

    // Reset balance check status only on significant wallet changes
    useEffect(() => {
        // Check if there's a meaningful address change (disconnect/connect or different address)
        const addressChanged =
            (wagmiUserAddress && !storedUserAddress) || // Connected
            (!wagmiUserAddress && storedUserAddress) || // Disconnected
            (wagmiUserAddress && storedUserAddress &&
                wagmiUserAddress.toLowerCase() !== storedUserAddress.toLowerCase()); // Changed address

        if (addressChanged && !hasResetCheckFlagRef.current) {
            hasResetCheckFlagRef.current = true;
            setHasPerformedRWACheck(false);

            // Reset the flag after a brief delay to prevent constant updates
            setTimeout(() => {
                hasResetCheckFlagRef.current = false;
            }, 1000);
        }
    }, [wagmiUserAddress, storedUserAddress, setHasPerformedRWACheck]);

    useEffect(() => {
        if (wagmiUserAddress !== storedUserAddress ||
            wagmiIsConnected !== storedIsConnected ||
            wagmiIsConnecting !== storedIsConnecting ||
            wagmiChainId !== storedChainId) {

            setUserAccount({
                address: wagmiUserAddress || null,
                isConnected: wagmiIsConnected,
                isConnecting: wagmiIsConnecting,
                connector: connector,
                chainId: wagmiChainId,
            });
        }
    }, [wagmiUserAddress, wagmiIsConnected, wagmiIsConnecting, connector, wagmiChainId, setUserAccount, storedUserAddress, storedIsConnected, storedIsConnecting]);

    useEffect(() => {
        if (storedIsConnecting) {
            if (currentStage !== PortfolioOnboardingStage.CONNECT_WALLET) {
                setStage(PortfolioOnboardingStage.CONNECT_WALLET);
            }
            return;
        }

        const usdtBalanceNum = parseFloat(userUsdtBalanceString || '0');
        const hasSufficientUsdt = usdtBalanceNum >= MIN_USDT_BALANCE_TO_SKIP_MINT;

        if (!storedIsConnected || !storedUserAddress) {
            if (currentStage !== PortfolioOnboardingStage.CONNECT_WALLET) {
                setStage(PortfolioOnboardingStage.CONNECT_WALLET);
            }
        } else { // Wallet is connected
            if (currentStage === PortfolioOnboardingStage.CONNECT_WALLET) {
                // Only proceed if we've verified RWA status
                if (hasPerformedRWACheck) {
                    if (hasRWA) {
                        if (hasAttemptedUSDTMint || hasSufficientUsdt) {
                            setStage(PortfolioOnboardingStage.COMPLETED);
                        } else {
                            setStage(PortfolioOnboardingStage.MINT_USDT);
                        }
                    } else {
                        setStage(PortfolioOnboardingStage.GET_RWA);
                    }
                } else {
                    // If we haven't checked RWA status yet, go to RWA check step
                    setStage(PortfolioOnboardingStage.GET_RWA);
                }
            } else if (currentStage === PortfolioOnboardingStage.GET_RWA) {
                if (hasPerformedRWACheck && hasRWA) {
                    if (hasAttemptedUSDTMint || hasSufficientUsdt) {
                        setStage(PortfolioOnboardingStage.COMPLETED);
                    } else {
                        setStage(PortfolioOnboardingStage.MINT_USDT);
                    }
                }
                // Otherwise stay on GET_RWA until check is performed and successful
            } else if (currentStage === PortfolioOnboardingStage.MINT_USDT) {
                if ((hasAttemptedUSDTMint || hasSufficientUsdt) && hasPerformedRWACheck && hasRWA) {
                    setStage(PortfolioOnboardingStage.COMPLETED);
                } else if (hasPerformedRWACheck && !hasRWA) {
                    setStage(PortfolioOnboardingStage.GET_RWA); // If RWA is missing, go back
                }
                // If user is at MINT_USDT, and doesn't have enough USDT and hasn't attempted, they stay here.
            }
        }
    }, [
        storedIsConnected,
        storedUserAddress,
        storedIsConnecting,
        currentStage,
        setStage,
        hasRWA,
        hasAttemptedUSDTMint,
        userUsdtBalanceString,
        isLoadingUsdtBalance,
        hasPerformedRWACheck // Add this to dependencies
    ]);

    const handleRwaAcquired = () => {
        const usdtBalanceNum = parseFloat(userUsdtBalanceString || '0');
        const hasSufficientUsdt = usdtBalanceNum >= MIN_USDT_BALANCE_TO_SKIP_MINT;
        if (hasAttemptedUSDTMint || hasSufficientUsdt) {
            setStage(PortfolioOnboardingStage.COMPLETED);
        } else {
            setStage(PortfolioOnboardingStage.MINT_USDT);
        }
    };

    const handleMintingComplete = () => {
        setHasAttemptedUSDTMint(true); // This confirms an attempt was made.
        // The main useEffect will now re-evaluate with hasAttemptedUSDTMint = true
        // and potentially the new balance to decide the stage.
        // If RWA is missing, it should redirect to GET_RWA, handled by main useEffect.
        if (hasPerformedRWACheck && hasRWA) {
            const usdtBalanceNum = parseFloat(userUsdtBalanceString || '0');
            const hasSufficientUsdt = usdtBalanceNum >= MIN_USDT_BALANCE_TO_SKIP_MINT;
            if (hasSufficientUsdt) {
                setStage(PortfolioOnboardingStage.COMPLETED);
            } else {
                // If minting was attempted but somehow balance is still low, user might need to retry MINT_USDT
                // or there's an issue. For now, we assume successful mint updates balance adequately.
                // The main useEffect should correctly keep them at MINT_USDT or move to COMPLETED.
            }
        } else {
            // Need to check RWA status again before proceeding
            setStage(PortfolioOnboardingStage.GET_RWA);
        }
    };

    if (currentStage === PortfolioOnboardingStage.COMPLETED && !isLoadingUsdtBalance) {
        // Ensure we don't show children if still determining USDT sufficiency due to loading balance
        return <>{children}</>;
    }

    // If loading USDT balance and we might skip a step due to it, show a generic loader perhaps
    if (isLoadingUsdtBalance &&
        (
            currentStage === PortfolioOnboardingStage.CONNECT_WALLET ||
            currentStage === PortfolioOnboardingStage.GET_RWA ||
            currentStage === PortfolioOnboardingStage.MINT_USDT
        )
    ) {
        // Render a generic loading state for the whole page or a subtle indicator
        // This prevents premature rendering of a step that might be skipped
        return (
            <div className="relative min-h-screen overflow-hidden bg-metamesh-dark flex items-center justify-center">
                <div className="absolute inset-0 bg-mesh-pattern opacity-5"></div>
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 border-4 border-metamesh-yellow border-t-transparent rounded-full"
                />
            </div>
        );
    }


    const numericStages = Object.values(PortfolioOnboardingStage).filter(v => typeof v === 'number') as PortfolioOnboardingStage[];

    return (
        <div className="relative min-h-screen overflow-hidden bg-metamesh-dark">
            <div className="absolute inset-0 bg-mesh-pattern opacity-5"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-metamesh-yellow/5 via-transparent to-metamesh-yellow/10"></div>

            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center py-10 md:py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-4xl">
                    <motion.div
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <motion.div
                            className="inline-block mb-4"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <span className="bg-metamesh-yellow/10 text-metamesh-yellow px-4 py-2 rounded-full text-sm font-medium border border-metamesh-yellow/20">
                                Portfolio Setup
                            </span>
                        </motion.div>

                        <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
                            Welcome to Zenova
                        </h1>
                        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
                            Prepare your account to access AI-driven tokenized stock trading on the decentralized public market of the future.
                        </p>
                    </motion.div>

                    <motion.div
                        className="w-full mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <div className="flex items-start justify-between max-w-3xl mx-auto">
                            {numericStages.map((stageValue, index) => (
                                <div key={stageValue} className={`flex flex-col items-center text-center relative ${index === numericStages.length - 1 ? '' : 'flex-1'}`}>
                                    {index < numericStages.length - 1 && stageValue !== PortfolioOnboardingStage.COMPLETED && (
                                        <div className={`absolute top-6 left-1/2 w-full h-0.5 z-0 
                                            ${currentStage > stageValue ? 'bg-metamesh-yellow' : 'bg-metamesh-gray/30'}
                                            transition-colors duration-500`}
                                        >
                                        </div>
                                    )}
                                    <motion.div
                                        className={`relative z-10 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center font-bold text-lg border-2 transition-all duration-500
                                        ${currentStage >= stageValue
                                                ? 'bg-metamesh-yellow border-metamesh-yellow text-metamesh-dark shadow-[0_0_20px_rgba(250,204,21,0.4)]'
                                                : 'bg-metamesh-dark-card border-metamesh-gray text-gray-400'
                                            }
                                        ${currentStage === stageValue ? 'scale-110 glow-border' : ''}
                                        ${currentStage > stageValue ? 'bg-metamesh-yellow border-metamesh-yellow' : ''}
                                        `}
                                        whileHover={{ scale: currentStage >= stageValue ? 1.1 : 1.05 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {currentStage > stageValue ? '✓' : index + 1}
                                    </motion.div>
                                    <div className="mt-3 max-w-[120px] md:max-w-[150px]">
                                        <p className={`text-sm font-medium transition-colors duration-300
                                            ${currentStage >= stageValue ? 'text-metamesh-yellow' : 'text-gray-500'}
                                            ${currentStage > stageValue ? 'text-metamesh-yellow' : ''}
                                        `}>
                                            {stageDetails[stageValue]?.name || 'Unknown Stage'}
                                        </p>
                                        <p className="text-xs text-gray-600 mt-1">
                                            {stageDetails[stageValue]?.description || ''}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4, type: "spring", stiffness: 100 }}
                        key={currentStage} // Ensures re-render on stage change for animations
                    >
                        <Card className="glass-effect border-metamesh-gray/30 hover:border-metamesh-yellow/30 transition-all duration-300 shadow-2xl backdrop-blur-xl">
                            <CardContent className="p-8 md:p-12 min-h-[400px] flex flex-col justify-center">
                                {currentStage === PortfolioOnboardingStage.CONNECT_WALLET && (
                                    <ConnectWalletPortfolioStep />
                                )}
                                {currentStage === PortfolioOnboardingStage.GET_RWA && storedUserAddress && (
                                    <GetRwaPortfolioStep onRwaAcquired={handleRwaAcquired} />
                                )}
                                {currentStage === PortfolioOnboardingStage.MINT_USDT && storedUserAddress && hasRWA && (
                                    <MintUsdtPortfolioStep
                                        onMintingComplete={handleMintingComplete}
                                    />
                                )}
                                {currentStage === PortfolioOnboardingStage.MINT_USDT && storedUserAddress && !hasRWA && (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 bg-metamesh-yellow/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <motion.span
                                                animate={{ rotate: [0, 10, -10, 10, 0] }}
                                                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                                                className="text-2xl">⚠️</motion.span>
                                        </div>
                                        <h3 className="text-2xl font-bold text-metamesh-yellow mb-3">RWA Required</h3>
                                        <p className="text-gray-400 text-lg max-w-md mx-auto">Please acquire testnet RWA tokens first. You will be redirected.</p>
                                    </div>
                                )}
                                {(currentStage === PortfolioOnboardingStage.GET_RWA || currentStage === PortfolioOnboardingStage.MINT_USDT) && !storedUserAddress && !storedIsConnecting && (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 bg-metamesh-yellow/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <motion.span
                                                animate={{ rotate: [0, 10, -10, 10, 0] }}
                                                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                                                className="text-2xl">⚠️</motion.span>
                                        </div>
                                        <h3 className="text-2xl font-bold text-metamesh-yellow mb-3">Wallet Disconnected</h3>
                                        <p className="text-gray-400 text-lg">Please connect your wallet to proceed with the setup.</p>
                                    </div>
                                )}
                                {(currentStage === PortfolioOnboardingStage.GET_RWA || currentStage === PortfolioOnboardingStage.MINT_USDT) && storedIsConnecting && (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 bg-metamesh-yellow/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                                className="w-8 h-8 border-2 border-metamesh-yellow border-t-transparent rounded-full"
                                            />
                                        </div>
                                        <h3 className="text-2xl font-bold text-metamesh-yellow mb-3">Connecting Wallet...</h3>
                                        <p className="text-gray-400 text-lg">Please wait while we establish connection to your Web3 wallet.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.footer
                        className="mt-12 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                    >
                        <p className="text-gray-600 text-sm">
                            Need assistance? Contact our support team at{" "}
                            <a href="mailto:support@zenova.com" className="text-metamesh-yellow hover:glow-text transition-all duration-300 cursor-pointer">
                                support@zenova.com
                            </a>
                        </p>
                        <p className="text-gray-700 text-xs mt-2">
                            Zenova © {new Date().getFullYear()} - Building intelligent, trustless public markets for the future.
                        </p>
                    </motion.footer>
                </div>
            </div>
        </div>
    );
};

export default PortfolioOnboardingFlow;
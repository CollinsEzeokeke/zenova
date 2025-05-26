"use client";

import { useState, useEffect, useRef } from "react";
import { usePublicClient } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useOnboardingStore } from "@/store/onboardingStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import AnimatedButton from "@/components/ui/AnimatedButton";
import { Layers, AlertTriangle, CheckCircle, ExternalLink, ArrowRight, Loader2 } from "lucide-react";
import { Toaster, toast } from "sonner";
import { formatEther } from "viem";

interface GetRwaPortfolioStepProps {
    onRwaAcquired: () => void;
}

const RWA_FAUCET_URL = "https://faucet.assetchain.org/";
const REQUIRED_RWA_BALANCE_THRESHOLD = BigInt(0); // Balance must be strictly greater than this
const BALANCE_REFETCH_INTERVAL = 5000;

const GetRwaPortfolioStep: React.FC<GetRwaPortfolioStepProps> = ({ onRwaAcquired }) => {
    const {
        userAddress,
        chainId,
        setHasRWA,
        hasRWA: storeHasRWA,
        setHasPerformedRWACheck,
        hasPerformedRWACheck
    } = useOnboardingStore();

    const [localHasRwa, setLocalHasRwa] = useState(false);
    const publicClient = usePublicClient();
    const hasUpdatedRWACheckRef = useRef(false);
    const previousBalanceRef = useRef<bigint | null>(null);

    // Use React Query to manage balance checking with retries and refetching
    const {
        data: balanceData,
        isLoading: isBalanceLoading,
        error: balanceError,
        refetch: refetchBalance,
        isFetching: isBalanceFetching,
    } = useQuery({
        queryKey: ['native-balance', userAddress, chainId],
        queryFn: async () => {
            if (!userAddress || !publicClient) {
                throw new Error("Wallet not connected");
            }
            const balance = await publicClient.getBalance({
                address: userAddress,
            });
            return {
                value: balance,
                formatted: formatEther(balance),
                symbol: 'RWA' // Assuming the native token symbol
            };
        },
        enabled: !!userAddress && !!publicClient,
        refetchInterval: localHasRwa ? false : BALANCE_REFETCH_INTERVAL,
        refetchOnWindowFocus: true,
        retry: 3,
    });

    // Set the check flag once when component mounts
    useEffect(() => {
        if (!hasUpdatedRWACheckRef.current) {
            setHasPerformedRWACheck(true);
            hasUpdatedRWACheckRef.current = true;
        }
    }, [setHasPerformedRWACheck]);

    // Process balance data changes
    useEffect(() => {
        if (!balanceData) return;

        const currentBalance = balanceData.value;

        // Only update if the balance has actually changed
        if (previousBalanceRef.current !== currentBalance) {
            previousBalanceRef.current = currentBalance;

            const hasBalance = currentBalance > REQUIRED_RWA_BALANCE_THRESHOLD;

            // Only update states if there's an actual change needed
            if (hasBalance && !localHasRwa) {
                setLocalHasRwa(true);
                setHasRWA(true);
                toast.success("RWA Balance Detected!", { description: "Proceeding to the next step." });
                const timer = setTimeout(() => {
                    onRwaAcquired();
                }, 1500);
                return () => clearTimeout(timer);
            } else if (!hasBalance && localHasRwa) {
                // Balance is now zero but we thought we had RWA
                setLocalHasRwa(false);
                setHasRWA(false);
            }
        }
    }, [balanceData, localHasRwa, onRwaAcquired, setHasRWA]);

    // Reset the RWA status when this component mounts to ensure fresh check
    useEffect(() => {
        if (storeHasRWA && !hasPerformedRWACheck) {
            // If we haven't checked yet but store says we have RWA, reset it until verified
            setHasRWA(false);
        }
    }, [storeHasRWA, hasPerformedRWACheck, setHasRWA]);

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
                <h3 className="text-2xl font-bold text-metamesh-yellow mb-3">Wallet Not Connected</h3>
                <p className="text-gray-400 text-lg">Please connect your wallet first to check your RWA balance.</p>
            </div>
        );
    }

    if (localHasRwa) {
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
                        RWA Balance Verified!
                    </h2>
                    <p className="text-gray-300 text-lg max-w-md mx-auto">
                        Your RWA balance is sufficient. Proceeding to the next step shortly...
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

    const showLoadingState = isBalanceLoading || isBalanceFetching;

    return (
        <>
            <Toaster richColors position="top-right" />
            <div className="flex flex-col items-center justify-center text-center space-y-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="relative"
                >
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-metamesh-yellow/20 to-metamesh-yellow/10 rounded-full flex items-center justify-center border border-metamesh-yellow/30">
                        <Layers className="w-10 h-10 md:w-12 md:h-12 text-metamesh-yellow" />
                    </div>
                    <div className="absolute inset-0 bg-mesh-pattern bg-metamesh-dark opacity-50 rounded-full"></div>
                    <div className="absolute inset-0 bg-metamesh-yellow/10 rounded-full blur-xl animate-pulse-glow"></div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="space-y-4"
                >
                    <h2 className="text-3xl md:text-4xl font-bold gradient-text">
                        Acquire Testnet RWA
                    </h2>
                    <p className="text-gray-400 text-lg max-w-xl mx-auto leading-relaxed">
                        To interact with Zenova's platform features, you need native RWA tokens for gas fees on the testnet. Your current RWA balance is being checked.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="w-full max-w-lg"
                >
                    <Card className="glass-effect border-metamesh-gray/30 shadow-lg">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center space-x-3">
                                <Layers className="w-6 h-6 text-metamesh-yellow" />
                                <span className="text-xl text-white">RWA Balance Status</span>
                            </CardTitle>
                            <CardDescription className="text-gray-500 pt-1">
                                Your address: <span className="text-metamesh-yellow/80 font-mono text-xs break-all">{userAddress}</span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {showLoadingState && !balanceError && (
                                <div className="flex flex-col items-center justify-center space-y-3 py-4">
                                    <Loader2 className="w-8 h-8 text-metamesh-yellow animate-spin" />
                                    <p className="text-gray-400">
                                        Checking RWA balance...
                                    </p>
                                </div>
                            )}
                            {!showLoadingState && balanceError && (
                                <div className="flex flex-col items-center text-center p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                                    <AlertTriangle className="w-10 h-10 text-red-400 mb-3" />
                                    <p className="text-red-300 font-semibold">Error Checking Balance</p>
                                    <p className="text-red-400 text-sm max-w-xs">
                                        {(balanceError as any)?.shortMessage || balanceError.message}
                                    </p>
                                    <AnimatedButton
                                        onClick={() => refetchBalance()}
                                        variant="outline"
                                        size="sm"
                                        className="mt-4 border-red-400 text-red-400 hover:bg-red-400/10"
                                    >
                                        Retry Check
                                    </AnimatedButton>
                                </div>
                            )}
                            {!showLoadingState && !balanceError && balanceData && balanceData.value <= REQUIRED_RWA_BALANCE_THRESHOLD && (
                                <div className="text-center space-y-4 py-2">
                                    <div className="p-3 bg-metamesh-yellow/10 rounded-lg inline-block">
                                        <Layers className="w-8 h-8 text-metamesh-yellow" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white">No RWA Tokens Found</h3>
                                    <p className="text-gray-400 max-w-md mx-auto">
                                        Current balance: {balanceData.formatted} {balanceData.symbol}. Please visit the official AssetChain RWA Faucet to get testnet RWA tokens.
                                    </p>
                                    <AnimatedButton
                                        href={RWA_FAUCET_URL}
                                        external
                                        variant="primary"
                                        size="lg"
                                        className="group"
                                    >
                                        Go to RWA Faucet
                                        <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </AnimatedButton>
                                    <p className="text-xs text-gray-500 pt-2">
                                        After acquiring RWA, this step will automatically proceed.
                                        {!localHasRwa && (
                                            <>
                                                <br />Next check in progress...
                                                {isBalanceFetching && <Loader2 className="w-3 h-3 inline-block ml-1 animate-spin" />}
                                            </>
                                        )}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </>
    );
};

export default GetRwaPortfolioStep; 
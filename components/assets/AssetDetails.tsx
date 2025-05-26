"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAssetDetails } from '@/hooks/useAssetDetails';
import { useUserTokenBalance } from '@/hooks/useUserTokenBalance';
import { useAccount, useWriteContract } from 'wagmi';
import { BarChart3, Briefcase, Building, CalendarDays, CheckCircle, DollarSign, Globe, Info, LinkIcon, ListChecks, Milestone, MinusCircle, Package, PlusCircle, Scale, ServerCrash, ShieldCheck, Tag, TrendingUp, Users, Wallet } from 'lucide-react';
import SciFiButton from '@/components/ui/SciFiButton';
import { FormattedFullAssetDetails } from '@/src/mastra/tools/zenova/zenovaFormattedTypes';
import { formatAddressShort, formatNumberWithCommas } from '@/src/utils/formatters';
import { zenovaAssetConfig, usdtMockConfig } from '@/generated';
import { publicClient } from '@/src/utils/publicClient';
import { parseUnits, formatUnits, Hex, erc20Abi } from 'viem';
import { toast } from 'sonner';

// Import the new components
import AssetDetailsSkeleton from './AssetDetailsSkeleton';
import DetailItem from './DetailItem';
import Section from './Section';
import TradingSidebar from './TradingSidebar';
import { useQueryClient } from '@tanstack/react-query';
interface AssetDetailsProps {
    assetAddress: string;
}

const USDT_ADDRESS = usdtMockConfig.address[42421];
const USDT_DECIMALS = 6;
const ASSET_DECIMALS = 18; // Default Zenova Asset decimals



const AssetDetails: React.FC<AssetDetailsProps> = ({ assetAddress }) => {
    const { data: asset, isLoading, error, refetch: refetchAssetDetails } = useAssetDetails(assetAddress);
    const { address: userWalletAddress, isConnected } = useAccount();

    const { data: userAssetBalance, isLoading: isLoadingAssetBalance, refetch: refetchAssetBalance } = useUserTokenBalance(assetAddress as Hex, ASSET_DECIMALS);
    console.log("userAssetBalance", userAssetBalance);
    const { data: userUsdtBalance, isLoading: isLoadingUsdtBalance, refetch: refetchUsdtBalance } = useUserTokenBalance(USDT_ADDRESS, USDT_DECIMALS);
    console.log("userUsdtBalance", userUsdtBalance);
    const queryClient = useQueryClient();

    const [tradeAmount, setTradeAmount] = useState('');
    const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
    const [estimatedReceive, setEstimatedReceive] = useState<string | null>(null);
    const [estimatedCost, setEstimatedCost] = useState<string | null>(null);
    const [isQuoteLoading, setIsQuoteLoading] = useState(false);
    const [isProcessingTx, setIsProcessingTx] = useState(false);
    const [currentAllowance, setCurrentAllowance] = useState<bigint>(BigInt(0));
    const [isCheckingAllowance, setIsCheckingAllowance] = useState(false);

    const { writeContractAsync: buyAssetAsync } = useWriteContract();
    const { writeContractAsync: sellAssetAsync } = useWriteContract();
    const { writeContractAsync: approveUsdtAsync } = useWriteContract();

    const fetchUserAllowance = useCallback(async () => {
        if (!userWalletAddress || !assetAddress || !USDT_ADDRESS) return;
        setIsCheckingAllowance(true);
        try {
            const allowanceBigInt = await publicClient.readContract({
                abi: erc20Abi,
                address: USDT_ADDRESS,
                functionName: 'allowance',
                args: [userWalletAddress, assetAddress as Hex],
            });
            setCurrentAllowance(allowanceBigInt);
        } catch (e) {
            console.error("Error fetching allowance:", e);
            setCurrentAllowance(BigInt(0));
            toast.error("Could not check USDT allowance.");
        }
        setIsCheckingAllowance(false);
    }, [userWalletAddress, assetAddress]);

    useEffect(() => {
        if (isConnected && activeTab === 'buy') {
            fetchUserAllowance();
        }
    }, [isConnected, userWalletAddress, assetAddress, activeTab, fetchUserAllowance]);

    const needsApproval = useMemo(() => {
        if (activeTab !== 'buy' || !tradeAmount || !estimatedCost) return false;
        const costInUsdtWei = parseUnits(estimatedCost, USDT_DECIMALS);
        return currentAllowance < costInUsdtWei;
    }, [currentAllowance, tradeAmount, estimatedCost, activeTab]);

    // Debounced quote fetching
    useEffect(() => {
        if (!tradeAmount || parseFloat(tradeAmount) <= 0 || !asset) {
            setEstimatedReceive(null);
            setEstimatedCost(null);
            return;
        }
        const amountInWei = parseUnits(tradeAmount, ASSET_DECIMALS);
        if (amountInWei === BigInt(0)) {
            setEstimatedReceive(null);
            setEstimatedCost(null);
            return;
        }

        const fetchQuote = async () => {
            setIsQuoteLoading(true);
            try {
                if (activeTab === 'buy') {
                    const quoteResult = await publicClient.readContract({
                        address: assetAddress as Hex,
                        abi: zenovaAssetConfig.abi,
                        functionName: 'getBuyQuote',
                        args: [amountInWei]
                    });
                    setEstimatedCost(formatUnits(quoteResult[0], USDT_DECIMALS));
                    setEstimatedReceive(tradeAmount);
                } else {
                    const quoteResult = await publicClient.readContract({
                        address: assetAddress as Hex,
                        abi: zenovaAssetConfig.abi,
                        functionName: 'getSellQuote',
                        args: [amountInWei]
                    });
                    setEstimatedReceive(formatUnits(quoteResult[0], USDT_DECIMALS));
                    setEstimatedCost(tradeAmount);
                }
            } catch (e) {
                console.error("Error fetching quote:", e);
                toast.error("Couldn't fetch trade quote.");
                setEstimatedReceive(null);
                setEstimatedCost(null);
            }
            setIsQuoteLoading(false);
        };

        const debounceTimeout = setTimeout(fetchQuote, 500);
        return () => clearTimeout(debounceTimeout);
    }, [tradeAmount, activeTab, assetAddress, asset]);

    const handleBuy = async () => {
        if (!userWalletAddress) { toast.error("Please connect your wallet."); return; }
        if (!assetAddress) { toast.error("Asset address not found."); return; }
        if (!tradeAmount || parseUnits(tradeAmount, ASSET_DECIMALS) <= BigInt(0)) {
            toast.error("Buy amount must be greater than zero.");
            return;
        }

        setIsProcessingTx(true);

        // If approval is needed, handle it first then proceed with buying
        if (needsApproval) {
            if (!estimatedCost || parseUnits(estimatedCost, USDT_DECIMALS) <= BigInt(0)) {
                toast.error("Approval amount must be greater than zero.");
                setIsProcessingTx(false);
                return;
            }

            toast.info("Requesting USDT approval...");
            try {
                const { request } = await publicClient.simulateContract({
                    account: userWalletAddress,
                    address: USDT_ADDRESS,
                    abi: erc20Abi,
                    functionName: 'approve',
                    args: [assetAddress as Hex, parseUnits(estimatedCost, USDT_DECIMALS)]
                });

                const approveTxHash = await toast.promise(approveUsdtAsync(request), {
                    loading: `Approving USDT...`,
                    success: (receipt) => `USDT Approved! Tx: ${formatAddressShort(receipt)}`,
                    error: (err) => `Approval failed: ${(err as Error).message}`
                }).unwrap();

                // Wait for approval transaction and then proceed with buy
                toast.promise(
                    publicClient.waitForTransactionReceipt({ hash: approveTxHash }).then(async (receipt) => {
                        // After approval succeeds, proceed with the buy transaction
                        await executeBuyTransaction();
                        return receipt;
                    }),
                    {
                        loading: `Approving USDT... (${formatAddressShort(approveTxHash)})`,
                        success: (receipt) => {
                            // Success message for the approval (buy success will be shown separately)
                            return `USDT Approved! Tx: ${formatAddressShort(receipt.transactionHash)}`;
                        },
                        error: (err) => {
                            setIsProcessingTx(false);
                            return `Approval failed: ${(err as Error).message}`;
                        }
                    }
                );
            } catch (e: any) {
                console.error("Approval error:", e);
                toast.error(`Approval failed: ${(e as Error).message || "Unknown error"}`);
                setIsProcessingTx(false);
            }
        } else {
            // If no approval needed, proceed directly with buying
            await executeBuyTransaction();
        }
    };

    // Extracted the buy transaction logic to a separate function to be called after approval
    const executeBuyTransaction = async () => {
        if (!userWalletAddress || !assetAddress) return;

        toast.info("Processing buy transaction...");
        try {
            const amountToBuyWei = parseUnits(tradeAmount, ASSET_DECIMALS);
            const { request } = await publicClient.simulateContract({
                account: userWalletAddress,
                address: assetAddress as Hex,
                abi: zenovaAssetConfig.abi,
                functionName: 'buyTokens',
                args: [amountToBuyWei],
            });

            const buyTxHash = await toast.promise(buyAssetAsync(request, {
                onSuccess: (receipt) => {
                    queryClient.invalidateQueries();
                },
                onError: (err) => {
                    console.error("Buy transaction error:", err);
                }
            }),
                {
                loading: `Buying ${tradeAmount} ${asset?.companyDetails.symbol}...`,
                success: (receipt) => `Successfully bought ${asset?.companyDetails.symbol}! Tx: ${formatAddressShort(receipt)}`,
                error: (err) => `Buy transaction failed: ${(err as Error).message}`
            }).unwrap();

            toast.promise(publicClient.waitForTransactionReceipt({ hash: buyTxHash }), {
                loading: `Buying ${tradeAmount} ${asset?.companyDetails.symbol}... (${formatAddressShort(buyTxHash)})`,
                success: (receipt) => {
                    setTradeAmount('');
                    setEstimatedCost(null);
                    setEstimatedReceive(null);
                    refetchAssetBalance();
                    refetchUsdtBalance();
                    fetchUserAllowance();
                    setIsProcessingTx(false);
                    return `Successfully bought ${asset?.companyDetails.symbol}! Tx: ${formatAddressShort(receipt.transactionHash)}`;
                },
                error: (err) => {
                    setIsProcessingTx(false);
                    return `Buy transaction failed: ${(err as Error).message}`;
                }
            });
        } catch (e: any) {
            console.error("Buy transaction error:", e);
            toast.error(`Buy failed: ${(e as Error).message || "Unknown error"}`);
            setIsProcessingTx(false);
        }
    };

    const handleSell = async () => {
        if (!userWalletAddress) { toast.error("Please connect your wallet."); return; }
        if (!tradeAmount || parseUnits(tradeAmount, ASSET_DECIMALS) <= BigInt(0)) {
            toast.error("Sell amount must be greater than zero."); return;
        }

        setIsProcessingTx(true);
        toast.info("Processing sell transaction...");
        try {
            const amountToSellWei = parseUnits(tradeAmount, ASSET_DECIMALS);
            const { request } = await publicClient.simulateContract({
                account: userWalletAddress,
                address: assetAddress as Hex,
                abi: zenovaAssetConfig.abi,
                functionName: 'sellTokens',
                args: [amountToSellWei],
            });
            const sellTxHash = await sellAssetAsync(request, {
                onSuccess: (receipt) => {
                    queryClient.invalidateQueries();
                },
                onError: (err) => {
                    console.error("Sell transaction error:", err);
                }
            });
            toast.promise(publicClient.waitForTransactionReceipt({ hash: sellTxHash }), {
                loading: `Selling ${tradeAmount} ${asset?.companyDetails.symbol}... (${formatAddressShort(sellTxHash)})`,
                success: (receipt) => {
                    setTradeAmount('');
                    setEstimatedCost(null);
                    setEstimatedReceive(null);
                    refetchAssetBalance();
                    refetchUsdtBalance();
                    setIsProcessingTx(false);
                    return `Successfully sold ${asset?.companyDetails.symbol}! Tx: ${formatAddressShort(receipt.transactionHash)}`;
                },
                error: (err) => {
                    setIsProcessingTx(false);
                    return `Sell transaction failed: ${(err as Error).message}`;
                }
            });

        } catch (e: any) {
            console.error("Sell transaction error:", e);
            toast.error(`Sell failed: ${(e as Error).message || "Unknown error"}`);
            setIsProcessingTx(false);
        }
    };

    const handleMaxAmount = () => {
        if (activeTab === 'buy') {
            if (userUsdtBalance && asset?.pricingDetails.currentPricePerToken && parseFloat(asset.pricingDetails.currentPricePerToken) > 0) {
                const pricePerToken = parseFloat(asset.pricingDetails.currentPricePerToken);
                const buyFeeBPS = parseFloat(asset.pricingDetails.buyFeeBPS);
                const usdtBalanceNum = parseFloat(userUsdtBalance);

                if (usdtBalanceNum > 0 && pricePerToken > 0) {
                    // Simple approach: directly calculate token amount based on USDT balance

                    // Calculate the buy fee multiplier (e.g., for 2.5% fee, multiplier is 1.025)
                    const feeMultiplier = 1 + (buyFeeBPS / 100);

                    // Calculate the maximum tokens we can buy with our entire USDT balance
                    // Formula: tokens = USDT balance / (price per token * fee multiplier)
                    const tokenAmount = usdtBalanceNum / (pricePerToken * feeMultiplier);

                    // We want to apply a tiny buffer (0.1%) to ensure we stay under balance
                    const bufferAdjustedAmount = tokenAmount * 0.999;

                    console.log(`MAX calculation: ${bufferAdjustedAmount.toFixed(6)} tokens should cost about ${usdtBalanceNum} USDT`);

                    // Set the calculated token amount in the input field with 6 decimal precision
                    setTradeAmount(bufferAdjustedAmount.toFixed(6));
                } else {
                    setTradeAmount('0');
                }
            }
        } else {
            // For selling, we can use the full balance
            setTradeAmount(userAssetBalance ? parseFloat(userAssetBalance).toFixed(3) : '0');
        }
    }

    if (isLoading) {
        return <AssetDetailsSkeleton />;
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center py-10 text-center bg-metamesh-dark-bg p-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-gradient-to-br from-metamesh-dark-card to-metamesh-dark-card/80 border border-red-500/50 rounded-xl p-8 shadow-2xl max-w-lg w-full backdrop-blur-sm"
                >
                    <ServerCrash className="h-20 w-20 text-red-400 mx-auto mb-6" />
                    <h2 className="text-3xl font-bold text-red-300 mb-3">Error Loading Asset</h2>
                    <p className="text-gray-400 mb-6 leading-relaxed">We encountered an issue fetching data for this asset. Please check your connection or try again later.</p>
                    <p className="text-xs text-gray-500 mb-5 font-mono bg-red-500/10 p-2 rounded border border-red-500/20">Error: {error.message}</p>
                    <SciFiButton onClick={() => refetchAssetDetails()} variant="secondary" className="w-full">
                        Retry
                    </SciFiButton>
                </motion.div>
            </div>
        );
    }

    if (!asset) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center py-10 text-center bg-metamesh-dark-bg p-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-gradient-to-br from-metamesh-dark-card to-metamesh-dark-card/80 border border-metamesh-yellow/30 rounded-xl p-8 shadow-2xl max-w-lg w-full backdrop-blur-sm"
                >
                    <Info className="h-20 w-20 text-metamesh-yellow mx-auto mb-6" />
                    <h2 className="text-3xl font-bold text-metamesh-yellow mb-3">Asset Not Found</h2>
                    <p className="text-gray-400 leading-relaxed">The requested asset could not be found or its details are currently unavailable.</p>
                </motion.div>
            </div>
        );
    }

    const { companyDetails, pricingDetails, currentValuation, maxTokenSupply, currentTotalSupply, isTradingActive, admin, priceAI, liquidityManager } = asset;

    // Simplified to always call the appropriate handler - approval is handled internally
    const currentSubmitAction = activeTab === 'buy' ? handleBuy : handleSell;
    const currentButtonText = activeTab === 'buy' ? `Buy ${companyDetails.symbol}` : `Sell ${companyDetails.symbol}`;
    const currentButtonIcon = activeTab === 'buy' ? PlusCircle : MinusCircle;

    return (
        <motion.div
            className="py-12 md:py-16 mesh-bg min-h-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                {/* Header Section */}
                <motion.div
                    className="mb-12 text-center border-b border-metamesh-gray/30 pb-8"
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                >
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold gradient-text mb-4 tracking-tight leading-tight">
                        {companyDetails.name}
                    </h1>
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <span className="px-4 py-2 bg-metamesh-yellow/10 text-metamesh-yellow border border-metamesh-yellow/30 rounded-full text-lg font-semibold">
                            {companyDetails.symbol}
                        </span>
                        {isTradingActive ? (
                            <span className="flex items-center px-3 py-1.5 bg-green-500/10 text-green-400 border border-green-500/30 rounded-full text-sm">
                                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                                Trading Active
                            </span>
                        ) : (
                            <span className="flex items-center px-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/30 rounded-full text-sm">
                                <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
                                Trading Inactive
                            </span>
                        )}
                    </div>
                    <p className="text-lg md:text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed">
                        Explore detailed insights and trade {companyDetails.symbol} tokens on the Zenova platform.
                    </p>
                </motion.div>

                {/* Main layout: Flex container */}
                <div className="flex flex-col xl:flex-row gap-8 xl:gap-12">
                    {/* Trading Sidebar for Mobile - Appears on top for smaller screens */}
                    <div className="xl:hidden w-full">
                        <TradingSidebar asset={asset} isConnected={isConnected} userAssetBalance={userAssetBalance} userUsdtBalance={userUsdtBalance} isLoadingAssetBalance={isLoadingAssetBalance} isLoadingUsdtBalance={isLoadingUsdtBalance} activeTab={activeTab} setActiveTab={setActiveTab} tradeAmount={tradeAmount} setTradeAmount={setTradeAmount} estimatedReceive={estimatedReceive} estimatedCost={estimatedCost} isQuoteLoading={isQuoteLoading} currentSubmitAction={currentSubmitAction} currentButtonText={currentButtonText} currentButtonIcon={currentButtonIcon} isProcessingTx={isProcessingTx} handleMaxAmount={handleMaxAmount} needsApproval={needsApproval} isCheckingAllowance={isCheckingAllowance} />
                    </div>

                    {/* Asset Info Column - Takes remaining space on xl screens */}
                    <div className="w-full xl:flex-grow space-y-10">
                        <Section title="Company Information" icon={Building}>
                            <DetailItem icon={Tag} label="Ticker Symbol" value={companyDetails.symbol} isTag />
                            <DetailItem icon={Briefcase} label="Issuing Company Wallet" value={companyDetails.issuingCompanyWallet} isAddress />
                            <DetailItem icon={Globe} label="Official Website" fullWidth>
                                {companyDetails.website ?
                                    <a href={companyDetails.website} target="_blank" rel="noopener noreferrer" className="text-metamesh-yellow hover:underline flex items-center group transition-colors duration-300 break-all">
                                        <span className="truncate">{companyDetails.website}</span>
                                        <LinkIcon className="h-4 w-4 ml-2 opacity-70 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                                    </a>
                                    : <span className="text-gray-500">N/A</span>
                                }
                            </DetailItem>
                            <DetailItem icon={Info} label="Company Description" fullWidth className="min-h-[120px]">
                                <div className="text-base text-gray-300 leading-relaxed max-w-none">
                                    {companyDetails.description ? (
                                        <p className="whitespace-pre-wrap break-words overflow-wrap-anywhere">
                                            {companyDetails.description}
                                        </p>
                                    ) : (
                                        <span className="text-gray-500 italic">No description provided.</span>
                                    )}
                                </div>
                            </DetailItem>
                        </Section>

                        <Section title="Market & Pricing Data" icon={BarChart3}>
                            <DetailItem icon={DollarSign} label="Current Price" value={pricingDetails.currentPricePerToken} unit="USDT" />
                            <DetailItem icon={TrendingUp} label="Market Cap" value={pricingDetails.marketCap} unit="USDT" />
                            <DetailItem icon={Scale} label="Total Valuation" value={currentValuation} unit="USDT" />
                            <DetailItem icon={ListChecks} label="Buy Fee" value={pricingDetails.buyFeeBPS} unit="BPS" />
                            <DetailItem icon={ListChecks} label="Sell Fee" value={pricingDetails.sellFeeBPS} unit="BPS" />
                            <DetailItem
                                icon={CalendarDays}
                                label="Last Price Update"
                                value={pricingDetails.lastPriceUpdateTimestamp ? new Date(Number(pricingDetails.lastPriceUpdateTimestamp) * 1000).toLocaleString() : 'N/A'}
                            />
                        </Section>

                        <Section title="Tokenomics & Supply" icon={Package}>
                            <DetailItem icon={Milestone} label="Maximum Token Supply" value={maxTokenSupply} unit={companyDetails.symbol} />
                            <DetailItem icon={Milestone} label="Current Total Supply" value={currentTotalSupply} unit={companyDetails.symbol} />
                            <DetailItem icon={CheckCircle} label="Supply Utilization" fullWidth>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Current Supply</span>
                                        <span className="font-mono">{currentTotalSupply} {companyDetails.symbol}</span>
                                    </div>
                                    <div className="w-full bg-metamesh-gray/30 rounded-full h-2">
                                        <div
                                            className="bg-gradient-to-r from-metamesh-yellow to-metamesh-yellow/80 h-2 rounded-full transition-all duration-500"
                                            style={{
                                                width: `${Math.min((parseFloat(currentTotalSupply) / parseFloat(maxTokenSupply)) * 100, 100)}%`
                                            }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-400">
                                        <span>0</span>
                                        <span>{((parseFloat(currentTotalSupply) / parseFloat(maxTokenSupply)) * 100).toFixed(2)}% utilized</span>
                                        <span>{maxTokenSupply} {companyDetails.symbol}</span>
                                    </div>
                                </div>
                            </DetailItem>
                        </Section>

                        <Section title="Smart Contract Roles" icon={Users}>
                            <DetailItem icon={ShieldCheck} label="Contract Admin" value={admin} isAddress />
                            <DetailItem icon={Users} label="Price AI Oracle" value={priceAI} isAddress />
                            <DetailItem icon={Wallet} label="Liquidity Manager" value={liquidityManager} isAddress />
                        </Section>
                    </div>

                    {/* Trading Sidebar for Desktop - Takes ~30% of the width on xl screens, hidden on smaller */}
                    <aside className="hidden xl:block xl:flex-shrink-0 xl:w-[40%] 2xl:w-[35%] max-w-lg">
                        <div className="sticky top-24 space-y-8">
                            <TradingSidebar asset={asset} isConnected={isConnected} userAssetBalance={userAssetBalance} userUsdtBalance={userUsdtBalance} isLoadingAssetBalance={isLoadingAssetBalance} isLoadingUsdtBalance={isLoadingUsdtBalance} activeTab={activeTab} setActiveTab={setActiveTab} tradeAmount={tradeAmount} setTradeAmount={setTradeAmount} estimatedReceive={estimatedReceive} estimatedCost={estimatedCost} isQuoteLoading={isQuoteLoading} currentSubmitAction={currentSubmitAction} currentButtonText={currentButtonText} currentButtonIcon={currentButtonIcon} isProcessingTx={isProcessingTx} handleMaxAmount={handleMaxAmount} needsApproval={needsApproval} isCheckingAllowance={isCheckingAllowance} />
                        </div>
                    </aside>
                </div>
            </div>
        </motion.div>
    );
};





export default AssetDetails; 
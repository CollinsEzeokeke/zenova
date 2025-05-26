"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRightLeft, BarChart3, Loader2, MinusCircle, PlusCircle, Wallet } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TradeForm from './TradeForm';
import { FormattedFullAssetDetails } from '@/src/mastra/tools/zenova/zenovaFormattedTypes';
import { formatNumberWithCommas, adaptiveText } from '@/src/utils/formatters';

interface TradingSidebarProps {
    asset: FormattedFullAssetDetails;
    isConnected: boolean;
    userAssetBalance: string | null | undefined;
    userUsdtBalance: string | null | undefined;
    isLoadingAssetBalance: boolean;
    isLoadingUsdtBalance: boolean;
    activeTab: 'buy' | 'sell';
    setActiveTab: (tab: 'buy' | 'sell') => void;
    tradeAmount: string;
    setTradeAmount: (amount: string) => void;
    estimatedReceive: string | null;
    estimatedCost: string | null;
    isQuoteLoading: boolean;
    currentSubmitAction: () => void;
    currentButtonText: string;
    currentButtonIcon: React.ElementType;
    isProcessingTx: boolean;
    handleMaxAmount: () => void;
    needsApproval?: boolean;
    isCheckingAllowance: boolean;
}

const TradingSidebar: React.FC<TradingSidebarProps> = ({
    asset,
    isConnected,
    userAssetBalance,
    userUsdtBalance,
    isLoadingAssetBalance,
    isLoadingUsdtBalance,
    activeTab,
    setActiveTab,
    tradeAmount,
    setTradeAmount,
    estimatedReceive,
    estimatedCost,
    isQuoteLoading,
    currentSubmitAction,
    currentButtonText,
    currentButtonIcon,
    isProcessingTx,
    handleMaxAmount,
    needsApproval,
    isCheckingAllowance
}) => {
    const { companyDetails, pricingDetails, isTradingActive } = asset;
    const USDT_DECIMALS = 6;
    const ASSET_DECIMALS = 18;

    return (
        <>
            <motion.div
                className="bg-gradient-to-br from-metamesh-dark-card via-metamesh-dark-card/95 to-metamesh-dark-card/80 border border-metamesh-gray/50 rounded-2xl p-6 md:p-8 shadow-2xl glass-effect backdrop-blur-md relative overflow-hidden w-full mx-auto"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            >
                {/* Background glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-metamesh-yellow/5 via-transparent to-metamesh-yellow/5 pointer-events-none"></div>

                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6 md:mb-8">
                        <h3 className="text-xl sm:text-2xl xl:text-3xl font-bold text-white glow-text flex items-center">
                            <ArrowRightLeft className="mr-2 sm:mr-3 h-6 w-6 sm:h-7 sm:w-7 text-metamesh-yellow" />
                            <span className="truncate">Trade</span>
                        </h3>
                        <div className="px-2.5 py-1 sm:px-3 sm:py-1.5 bg-metamesh-yellow/10 border border-metamesh-yellow/30 rounded-full">
                            <span className="text-metamesh-yellow font-semibold text-xs sm:text-sm">{companyDetails.symbol}</span>
                        </div>
                    </div>

                    {/* Current Price Display */}
                    <div className="mb-6 md:mb-8 p-3 sm:p-4 bg-metamesh-gray/20 rounded-xl border border-metamesh-gray/40">
                        <div className="text-center">
                            <p className="text-xs sm:text-sm text-gray-400 mb-1">Current Price</p>
                            <p className={`font-bold text-white font-mono ${adaptiveText(formatNumberWithCommas(parseFloat(pricingDetails.currentPricePerToken), 2), '2xl', 'text-xl sm:text-2xl')}`}>
                                {formatNumberWithCommas(parseFloat(pricingDetails.currentPricePerToken), USDT_DECIMALS)}
                                <span className="text-base sm:text-lg text-gray-400 ml-1.5 sm:ml-2">USDT</span>
                            </p>
                            <div className="flex items-center justify-center mt-1.5 sm:mt-2">
                                {isTradingActive ? (
                                    <span className="flex items-center text-green-400 text-xs">
                                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full mr-1.5 sm:mr-2 animate-pulse"></div>
                                        Live Trading
                                    </span>
                                ) : (
                                    <span className="flex items-center text-red-400 text-xs">
                                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-400 rounded-full mr-1.5 sm:mr-2"></div>
                                        Trading Paused
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'buy' | 'sell')} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 bg-metamesh-gray/20 border border-metamesh-gray/50 mb-6 md:mb-8 p-1 sm:p-1.5 rounded-xl">
                            <TabsTrigger
                                value="buy"
                                className="data-[state=active]:bg-green-500/80 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-green-500/30 transition-all duration-200 py-2.5 sm:py-3 text-sm sm:text-base font-semibold rounded-lg"
                            >
                                <PlusCircle className="h-4 w-4 mr-1.5 sm:mr-2" />
                                Buy
                            </TabsTrigger>
                            <TabsTrigger
                                value="sell"
                                className="data-[state=active]:bg-red-500/80 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-red-500/30 transition-all duration-200 py-2.5 sm:py-3 text-sm sm:text-base font-semibold rounded-lg"
                            >
                                <MinusCircle className="h-4 w-4 mr-1.5 sm:mr-2" />
                                Sell
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="buy" className="space-y-0">
                            <TradeForm
                                asset={asset}
                                action="buy"
                                balance={userUsdtBalance}
                                balanceSymbol="USDT"
                                isLoadingBalance={isLoadingUsdtBalance || isCheckingAllowance}
                                tradeAmount={tradeAmount}
                                setTradeAmount={setTradeAmount}
                                estimatedAmount={estimatedReceive}
                                estimatedAmountSymbol={companyDetails.symbol}
                                costOrProceeds={estimatedCost}
                                costOrProceedsSymbol="USDT"
                                isQuoteLoading={isQuoteLoading}
                                onSubmit={currentSubmitAction}
                                buttonText={currentButtonText}
                                buttonIcon={currentButtonIcon}
                                isProcessing={isProcessingTx}
                                isConnected={isConnected}
                                handleMaxAmount={handleMaxAmount}
                                needsApproval={needsApproval}
                                assetDecimals={ASSET_DECIMALS}
                                paymentDecimals={USDT_DECIMALS}
                            />
                        </TabsContent>
                        <TabsContent value="sell" className="space-y-0">
                            <TradeForm
                                asset={asset}
                                action="sell"
                                balance={userAssetBalance}
                                balanceSymbol={companyDetails.symbol}
                                isLoadingBalance={isLoadingAssetBalance}
                                tradeAmount={tradeAmount}
                                setTradeAmount={setTradeAmount}
                                estimatedAmount={estimatedReceive}
                                estimatedAmountSymbol="USDT"
                                costOrProceeds={estimatedCost}
                                costOrProceedsSymbol={companyDetails.symbol}
                                isQuoteLoading={isQuoteLoading}
                                onSubmit={currentSubmitAction}
                                buttonText={currentButtonText}
                                buttonIcon={currentButtonIcon}
                                isProcessing={isProcessingTx}
                                isConnected={isConnected}
                                handleMaxAmount={handleMaxAmount}
                                assetDecimals={ASSET_DECIMALS}
                                paymentDecimals={USDT_DECIMALS}
                            />
                        </TabsContent>
                    </Tabs>
                </div>
            </motion.div>

            {/* Enhanced Quick Stats Card */}
            <motion.div
                className="bg-gradient-to-br from-metamesh-dark-card via-metamesh-dark-card/95 to-metamesh-dark-card/80 border border-metamesh-gray/50 rounded-2xl p-6 shadow-xl backdrop-blur-md relative overflow-hidden w-full mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
            >
                {/* Background glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-metamesh-yellow/3 via-transparent to-metamesh-yellow/3 pointer-events-none"></div>

                <div className="relative z-10">
                    <h4 className="text-lg sm:text-xl font-bold text-white mb-5 sm:mb-6 flex items-center">
                        <BarChart3 className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 text-metamesh-yellow" />
                        Market Overview
                    </h4>
                    <div className="space-y-3 sm:space-y-4">
                        <div className="flex justify-between items-center p-2.5 sm:p-3 bg-metamesh-gray/20 rounded-lg">
                            <span className="text-xs sm:text-sm text-gray-400 font-medium">Market Cap</span>
                            <span className={`font-mono text-white font-semibold ${adaptiveText(formatNumberWithCommas(parseFloat(asset.pricingDetails.marketCap), 0), 'sm', 'text-xs sm:text-sm')}`}>
                                ${formatNumberWithCommas(parseFloat(asset.pricingDetails.marketCap), 0)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center p-2.5 sm:p-3 bg-metamesh-gray/20 rounded-lg">
                            <span className="text-xs sm:text-sm text-gray-400 font-medium">Total Supply</span>
                            <span className={`font-mono text-white font-semibold ${adaptiveText(formatNumberWithCommas(parseFloat(asset.currentTotalSupply), 0) + ' ' + companyDetails.symbol, 'sm', 'text-xs sm:text-sm')}`}>
                                {formatNumberWithCommas(parseFloat(asset.currentTotalSupply), 0)} {companyDetails.symbol}
                            </span>
                        </div>
                        <div className="flex justify-between items-center p-2.5 sm:p-3 bg-metamesh-gray/20 rounded-lg">
                            <span className="text-xs sm:text-sm text-gray-400 font-medium">Trading Fees</span>
                            <span className={`font-mono text-white font-semibold ${adaptiveText(asset.pricingDetails.buyFeeBPS + '% / ' + asset.pricingDetails.sellFeeBPS + '%', 'sm', 'text-xs sm:text-sm')}`}>
                                {asset.pricingDetails.buyFeeBPS}% / {asset.pricingDetails.sellFeeBPS}%
                            </span>
                        </div>
                        {isConnected && (
                            <>
                                <hr className="border-metamesh-gray/30 my-3 sm:my-4" />
                                <div className="p-3 sm:p-4 bg-metamesh-yellow/10 border border-metamesh-yellow/30 rounded-lg">
                                    <div className="flex justify-between items-center mb-1.5 sm:mb-2">
                                        <span className="text-xs sm:text-sm text-gray-300 font-medium">Your Holdings</span>
                                        <Wallet className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-metamesh-yellow" />
                                    </div>
                                    <div className="space-y-1.5 sm:space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-gray-400">{companyDetails.symbol}</span>
                                            <span className={`font-mono text-metamesh-yellow font-semibold ${adaptiveText(parseFloat(userAssetBalance || '0').toFixed(3), 'sm', 'text-xs sm:text-sm')}`}>
                                                {isLoadingAssetBalance ? (
                                                    <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                                                ) : (
                                                    parseFloat(userAssetBalance || '0').toFixed(3)
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-gray-400">USDT</span>
                                            <span className={`font-mono text-white font-semibold ${adaptiveText(formatNumberWithCommas(parseFloat(userUsdtBalance || '0'), 2), 'sm', 'text-xs sm:text-sm')}`}>
                                                {isLoadingUsdtBalance ? (
                                                    <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                                                ) : (
                                                    formatNumberWithCommas(parseFloat(userUsdtBalance || '0'), 2)
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                        {!isConnected && (
                            <div className="p-3 sm:p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg text-center">
                                <p className="text-xs sm:text-sm text-blue-400 mb-1.5 sm:mb-2">Connect your wallet to view holdings</p>
                                <div className="text-2xs sm:text-xs text-gray-400">
                                    Connect to see your {companyDetails.symbol} and USDT balances
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </>
    );
};

export default TradingSidebar; 
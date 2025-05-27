"use client";

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowRightLeft, Loader2, MinusCircle, PlusCircle, ShieldCheck, Wallet } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SciFiButton from '@/components/ui/SciFiButton';
import { FormattedFullAssetDetails } from '@/src/mastra/tools/zenova/zenovaFormattedTypes';
import { formatNumberWithCommas, adaptiveText } from '@/src/utils/formatters';

interface TradeFormProps {
    asset: FormattedFullAssetDetails;
    action: 'buy' | 'sell';
    balance: string | null | undefined;
    balanceSymbol: string;
    isLoadingBalance: boolean;
    tradeAmount: string;
    setTradeAmount: (value: string) => void;
    estimatedAmount: string | null;
    estimatedAmountSymbol: string;
    costOrProceeds: string | null;
    costOrProceedsSymbol: string;
    isQuoteLoading: boolean;
    onSubmit: () => void;
    buttonText: string;
    buttonIcon: React.ElementType;
    isProcessing: boolean;
    isConnected: boolean;
    handleMaxAmount: () => void;
    needsApproval?: boolean;
    assetDecimals: number;
    paymentDecimals: number;
}

const TradeForm: React.FC<TradeFormProps> = ({
    asset,
    action,
    balance,
    balanceSymbol,
    isLoadingBalance,
    tradeAmount,
    setTradeAmount,
    estimatedAmount,
    estimatedAmountSymbol,
    costOrProceeds,
    costOrProceedsSymbol,
    isQuoteLoading,
    onSubmit,
    buttonText,
    buttonIcon: ButtonIcon,
    isProcessing,
    isConnected,
    needsApproval,
    paymentDecimals
}) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        if (/^\d*\.?\d*$/.test(value)) {
            if (value.startsWith('0') && value.length > 1 && !value.startsWith('0.')) {
                setTradeAmount(value.substring(1));
            } else {
                setTradeAmount(value);
            }
        } else if (value === '') {
            setTradeAmount('');
        }
    };

    // Improved MAX functionality to handle partial percentages
    // const handlePercentageMax = (percentage: number) => {
    //     if (!balance || parseFloat(balance) <= 0) return;

    //     if (action === 'buy') {
    //         // For buy, calculate how much asset we can buy with percentage of USDT balance
    //         const usdtAmount = parseFloat(balance) * (percentage / 100);
    //         if (usdtAmount > 0 && asset.pricingDetails.currentPricePerToken) {
    //             const maxAssetAmount = usdtAmount / parseFloat(asset.pricingDetails.currentPricePerToken);
    //             // Apply a small discount to account for fees and slippage
    //             const discountedAmount = maxAssetAmount * 0.99;
    //             setTradeAmount(discountedAmount.toFixed(assetDecimals > 6 ? 6 : assetDecimals));
    //         }
    //     } else {
    //         // For sell, simply use percentage of asset balance
    //         const assetAmount = parseFloat(balance) * (percentage / 100);
    //         if (assetAmount > 0) {
    //             setTradeAmount(assetAmount.toFixed(assetDecimals > 6 ? 6 : assetDecimals));
    //         }
    //     }
    // };

    const insufficientBalance = useMemo(() => {
        if (!balance || !tradeAmount || parseFloat(tradeAmount) <= 0) return false;
        if (action === 'buy') {
            return costOrProceeds ? parseFloat(costOrProceeds) > parseFloat(balance) : false;
        } else {
            return parseFloat(tradeAmount) > parseFloat(balance);
        }
    }, [balance, tradeAmount, costOrProceeds, action]);

    const isButtonDisabled = isProcessing ||
        !isConnected ||
        !tradeAmount ||
        parseFloat(tradeAmount) <= 0 ||
        isQuoteLoading ||
        (insufficientBalance && !needsApproval) || // Allow proceeding with approval even with insufficient balance
        tradeAmount === 'Calculating...';

    const formattedBalance = useMemo(() => {
        if (isLoadingBalance) return <Loader2 className="h-4 w-4 animate-spin inline" />;
        if (balance === null || balance === undefined) return 'N/A';
        const numBalance = parseFloat(balance);
        return isNaN(numBalance) ? '0.0000' : numBalance.toFixed(4);
    }, [balance, isLoadingBalance]);

    return (
        <div className="space-y-6">
            {/* Balance Display */}
            <div className="p-4 bg-metamesh-gray/20 rounded-xl border border-metamesh-gray/40">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <Wallet className="h-5 w-5 text-metamesh-yellow" />
                        <span className="text-sm text-gray-300 font-medium">Available Balance</span>
                    </div>
                    <div className="text-right">
                        <div className="text-lg font-mono text-white font-semibold">
                            {formattedBalance} {balanceSymbol}
                        </div>
                        {action === 'buy' && balance && parseFloat(balance) > 0 && (
                            <div className="text-xs text-gray-400">
                                ≈ {(parseFloat(balance) / parseFloat(asset.pricingDetails.currentPricePerToken)).toFixed(2)} {asset.companyDetails.symbol}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Amount Input */}
            <div className="space-y-3">
                <Label htmlFor={`amount-${action}`} className="text-base text-gray-300 font-semibold flex items-center">
                    {action === 'buy' ? (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2 text-green-400" />
                            Amount to Buy
                        </>
                    ) : (
                        <>
                            <MinusCircle className="h-4 w-4 mr-2 text-red-400" />
                            Amount to Sell
                        </>
                    )}
                </Label>
                <div className="relative">
                    <Input
                        id={`amount-${action}`}
                        type="text"
                        inputMode="decimal"
                        placeholder="0.00"
                        value={tradeAmount}
                        onChange={handleInputChange}
                        className="bg-metamesh-dark/90 border-2 border-metamesh-gray/60 focus:border-metamesh-yellow/70 focus:ring-2 focus:ring-metamesh-yellow/30 text-white text-xl py-4 pl-5 pr-24 tabular-nums rounded-xl shadow-lg placeholder:text-gray-500 transition-all duration-200 font-semibold"
                        disabled={isProcessing || !isConnected}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                        <span className="text-sm text-gray-400 font-medium">{action === 'buy' ? asset.companyDetails.symbol : balanceSymbol}</span>
                    </div>
                </div>

                {/* Enhanced insufficient balance warnings */}
                {action === 'buy' && insufficientBalance && parseFloat(tradeAmount) > 0 && (
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg shadow-sm">
                        <p className="text-sm font-medium text-red-400 flex items-center mb-1">
                            <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
                            Insufficient {balanceSymbol} Balance
                        </p>
                        {costOrProceeds && balance && (
                            <p className="text-xs text-gray-400 ml-7">
                                Required: {formatNumberWithCommas(parseFloat(costOrProceeds), 2)} USDT<br />
                                Available: {formatNumberWithCommas(parseFloat(balance), 2)} USDT
                            </p>
                        )}
                    </div>
                )}
                {action === 'sell' && insufficientBalance && parseFloat(tradeAmount) > 0 && (
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg shadow-sm">
                        <p className="text-sm font-medium text-red-400 flex items-center mb-1">
                            <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
                            Insufficient {balanceSymbol} Balance
                        </p>
                        {balance && (
                            <p className="text-xs text-gray-400 ml-7">
                                Attempted: {parseFloat(tradeAmount).toFixed(3)} {balanceSymbol}<br />
                                Available: {parseFloat(balance || '0').toFixed(3)} {balanceSymbol}
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Quote Display */}
            {(isQuoteLoading || (tradeAmount && parseFloat(tradeAmount) > 0 && (estimatedAmount || costOrProceeds))) &&
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                    className="p-5 bg-gradient-to-br from-metamesh-gray/20 to-metamesh-gray/10 rounded-xl border border-metamesh-gray/40 min-h-[100px] space-y-3"
                >
                    {isQuoteLoading ? (
                        <div className="flex items-center justify-center py-4 text-gray-400">
                            <Loader2 className="h-5 w-5 animate-spin mr-3" />
                            <span className="text-base">Calculating best price...</span>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="text-center">
                                <h4 className="text-lg font-semibold text-white mb-3">Transaction Summary</h4>
                            </div>
                            {action === 'buy' ? (
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-3 bg-metamesh-dark/50 rounded-lg">
                                        <span className="text-gray-300 font-medium">You Pay:</span>
                                        <span className={`text-white font-bold tabular-nums ${adaptiveText(formatNumberWithCommas(parseFloat(costOrProceeds || '0'), paymentDecimals), 'lg', 'font-mono')}`}>
                                            {formatNumberWithCommas(parseFloat(costOrProceeds || '0'), paymentDecimals)} {costOrProceedsSymbol}
                                        </span>
                                    </div>
                                    <div className="flex justify-center">
                                        <ArrowRightLeft className="h-5 w-5 text-metamesh-yellow" />
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-metamesh-yellow/10 border border-metamesh-yellow/30 rounded-lg">
                                        <span className="text-gray-300 font-medium">You Receive:</span>
                                        <span className={`text-metamesh-yellow font-bold tabular-nums ${adaptiveText(parseFloat(estimatedAmount || '0').toFixed(3), 'lg', 'font-mono')}`}>
                                            {parseFloat(estimatedAmount || '0').toFixed(3)} {estimatedAmountSymbol}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-3 bg-metamesh-dark/50 rounded-lg">
                                        <span className="text-gray-300 font-medium">You Sell:</span>
                                        <span className={`text-white font-bold tabular-nums ${adaptiveText(parseFloat(costOrProceeds || '0').toFixed(3), 'lg', 'font-mono')}`}>
                                            {parseFloat(costOrProceeds || '0').toFixed(3)} {costOrProceedsSymbol}
                                        </span>
                                    </div>
                                    <div className="flex justify-center">
                                        <ArrowRightLeft className="h-5 w-5 text-metamesh-yellow" />
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-metamesh-yellow/10 border border-metamesh-yellow/30 rounded-lg">
                                        <span className="text-gray-300 font-medium">You Receive:</span>
                                        <span className={`text-metamesh-yellow font-bold tabular-nums ${adaptiveText(formatNumberWithCommas(parseFloat(estimatedAmount || '0'), paymentDecimals), 'lg', 'font-mono')}`}>
                                            {formatNumberWithCommas(parseFloat(estimatedAmount || '0'), paymentDecimals)} {estimatedAmountSymbol}
                                        </span>
                                    </div>
                                </div>
                            )}
                            {asset?.pricingDetails && !isQuoteLoading && tradeAmount && parseFloat(tradeAmount) > 0 && (
                                <div className="pt-3 border-t border-metamesh-gray/30">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-400">Exchange Rate:</span>
                                        <span className={`text-gray-300 font-mono ${adaptiveText('1 ' + asset.companyDetails.symbol + ' = ' + formatNumberWithCommas(parseFloat(asset.pricingDetails.currentPricePerToken), paymentDecimals) + ' USDT', 'sm')}`}>
                                            1 {asset.companyDetails.symbol} = {formatNumberWithCommas(parseFloat(asset.pricingDetails.currentPricePerToken), paymentDecimals)} USDT
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm mt-1">
                                        <span className="text-gray-400">Network Fee:</span>
                                        <span className="text-gray-300 font-mono">
                                            {action === 'buy' ? asset.pricingDetails.buyFeeBPS : asset.pricingDetails.sellFeeBPS}% (included)
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </motion.div>
            }

            {/* Action Button */}
            <SciFiButton
                onClick={onSubmit}
                className="w-full mt-6 py-4 text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={isButtonDisabled}
                icon={isProcessing ? Loader2 : ButtonIcon}
                iconProps={isProcessing ? { className: 'animate-spin h-6 w-6' } : { className: 'h-6 w-6' }}
                variant={action === 'buy' ? (needsApproval ? 'secondary' : 'primary') : 'outline'}
                size="lg"
            >
                {isProcessing ? 'Processing Transaction...' : (insufficientBalance && !needsApproval && buttonText !== 'Approve USDT' ? 'Insufficient Balance' : buttonText)}
            </SciFiButton>

            {/* Status Messages */}
            {!isConnected && (
                <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl text-center">
                    <p className="text-blue-400 font-medium mb-1">Wallet Connection Required</p>
                    <p className="text-sm text-gray-400">
                        Please connect your wallet to enable trading functionality.
                    </p>
                </div>
            )}
            {action === 'buy' && needsApproval && isConnected && parseFloat(tradeAmount) > 0 && (
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                    <p className="text-amber-400 font-medium mb-1 flex items-center">
                        <ShieldCheck className="h-4 w-4 mr-2" />
                        USDT Approval Required
                    </p>
                    <p className="text-sm text-gray-400">
                        Clicking &quot;Buy&quot; will automatically request USDT approval before completing your purchase.
                    </p>
                </div>
            )}
        </div>
    );
};

export default TradeForm; 
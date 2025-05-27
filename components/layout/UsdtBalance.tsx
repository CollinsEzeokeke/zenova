"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Coins, Plus } from 'lucide-react';
import { useAccount, usePublicClient, useWriteContract } from 'wagmi';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { formatUnits, parseUnits } from 'viem';
import { toast } from 'sonner';
import { usdtMockConfig } from '@/generated';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

// Format number with compact notation (1K, 1M, 1B, 1T)
function formatCompactCurrency(value: number): string {
    const formatter = new Intl.NumberFormat('en-US', {
        notation: 'compact',
        compactDisplay: 'short',
        maximumFractionDigits: 1
    });
    return formatter.format(value);
}

export default function UsdtBalance() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [mintAmount, setMintAmount] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { address: userAddress } = useAccount();
    const publicClient = usePublicClient();
    const { writeContractAsync: mintUsdt } = useWriteContract();
    const queryClient = useQueryClient();

    // Fetch USDT balance using React Query
    const {
        data: balance = BigInt(0),
        isLoading: isBalanceLoading,
        error: balanceError
    } = useQuery({
        queryKey: ['usdtBalance', userAddress],
        queryFn: async (): Promise<bigint> => {
            if (!userAddress || !publicClient) {
                throw new Error('Wallet not connected');
            }

            const result = await publicClient.readContract({
                abi: usdtMockConfig.abi,
                address: usdtMockConfig.address[42421],
                functionName: 'balanceOf',
                args: [userAddress],
            });

            return result as bigint;
        },
        enabled: !!userAddress && !!publicClient,
        refetchInterval: 10000, // Refetch every 10 seconds
        staleTime: 5000, // Consider data stale after 5 seconds
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    });

    const handleMintUsdt = async () => {
        if (!userAddress || !publicClient) {
            toast.error("Please connect your wallet");
            return;
        }

        if (!mintAmount || parseFloat(mintAmount) <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }

        const amount = parseFloat(mintAmount);
        const maxAmount = 1_000_000_000_000; // 1 trillion

        if (amount > maxAmount) {
            toast.error("Amount exceeds maximum limit of 1 trillion USDT");
            return;
        }

        setIsLoading(true);

        try {
            const usdtToMint = parseUnits(mintAmount, 6); // USDT has 6 decimals

            const txHash = await toast.promise(
                mintUsdt({
                    abi: usdtMockConfig.abi,
                    address: usdtMockConfig.address[42421],
                    functionName: "mintTestTokens",
                    args: [userAddress, usdtToMint],
                }, {
                    onSuccess: () => {
                        queryClient.invalidateQueries();
                    },
                    onError: (err) => {
                        console.error("Mint transaction error:", err);
                    }
                }),
                {
                    loading: "Minting USDT...",
                    success: "USDT minted successfully",
                    error: "Failed to mint USDT",
                }
            ).unwrap();

            await toast.promise(
                publicClient.waitForTransactionReceipt({ hash: txHash }),
                {
                    loading: "Waiting for transaction confirmation...",
                    success: "Transaction confirmed",
                    error: "Transaction failed",
                }
            ).unwrap();

            // Invalidate and refetch balance after successful mint
            await queryClient.invalidateQueries({
                queryKey: ['usdtBalance', userAddress]
            });

            setMintAmount('');
            setIsDialogOpen(false);
        } catch (error) {
            console.error('Error minting USDT:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatBalance = () => {
        if (isBalanceLoading) return "...";
        if (balanceError) return "Error";
        const balanceNumber = parseFloat(formatUnits(balance, 6));
        return formatCompactCurrency(balanceNumber);
    };

    if (!userAddress) {
        return null; // Don't show if wallet not connected
    }

    return (
        <div className="flex items-center space-x-2">
            {/* Balance Display */}
            <motion.div
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-metamesh-dark-light border border-metamesh-yellow/30 rounded-md"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
            >
                <Coins className="h-4 w-4 text-metamesh-yellow" />
                <span className="text-sm font-medium text-white">
                    {formatBalance()} USDT
                </span>
            </motion.div>

            {/* Mint Button */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <motion.button
                        className="flex items-center justify-center h-8 w-8 bg-metamesh-yellow text-metamesh-dark rounded-md hover:bg-metamesh-yellow/90 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        title="Mint USDT"
                    >
                        <Plus className="h-4 w-4" />
                    </motion.button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-md bg-metamesh-dark border-metamesh-gray">
                    <DialogHeader>
                        <DialogTitle className="text-white flex items-center space-x-2">
                            <Coins className="h-5 w-5 text-metamesh-yellow" />
                            <span>Mint USDT</span>
                        </DialogTitle>
                        <DialogDescription className="text-gray-300">
                            Enter the amount of USDT you want to mint. Maximum: 1 trillion USDT.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label htmlFor="amount" className="text-sm font-medium text-white">
                                Amount (USDT)
                            </label>
                            <Input
                                id="amount"
                                type="number"
                                placeholder="Enter amount..."
                                value={mintAmount}
                                onChange={(e) => setMintAmount(e.target.value)}
                                max="1000000000000"
                                min="0"
                                step="0.000001"
                                className="bg-metamesh-dark-light border-metamesh-gray text-white placeholder:text-gray-400 focus:border-metamesh-yellow"
                            />
                            <p className="text-xs text-gray-400">
                                Current balance: {formatBalance()} USDT
                            </p>
                        </div>
                    </div>

                    <DialogFooter className="flex space-x-2">
                        <Button
                            variant="outline"
                            onClick={() => setIsDialogOpen(false)}
                            className="border-metamesh-gray text-gray-300 hover:bg-metamesh-gray/20"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleMintUsdt}
                            disabled={isLoading || !mintAmount || parseFloat(mintAmount) <= 0}
                            className="bg-metamesh-yellow text-metamesh-dark hover:bg-metamesh-yellow/90 disabled:opacity-50"
                        >
                            {isLoading ? "Minting..." : "Mint USDT"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
} 
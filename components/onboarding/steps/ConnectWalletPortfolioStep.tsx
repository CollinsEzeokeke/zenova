"use client";

// import { useAccountEffect } from "wagmi"; // No longer directly needed here
import { motion } from "framer-motion";
import { ZenovaCustomConnectButton } from "@/components/ui/ZenovaCustomConnectButton"; // Path to your custom button
import { Wallet, AlertTriangle, Zap, Shield } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

// Props are no longer needed as parent manages state via Zustand
// interface ConnectWalletPortfolioStepProps {}

const ConnectWalletPortfolioStep: React.FC<NonNullable<unknown>> = () => {
    const features = [
        {
            icon: <Zap className="w-5 h-5" />,
            title: "AI Evaluation",
            description: "Access AI-driven company valuations"
        },
        {
            icon: <Shield className="w-5 h-5" />,
            title: "Trustless Trading",
            description: "Secure smart contract interactions"
        }
    ];

    return (
        <div className="flex flex-col items-center justify-center text-center space-y-8">
            {/* Main Icon */}
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="relative"
            >
                <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-metamesh-yellow/20 to-metamesh-yellow/10 rounded-full flex items-center justify-center border border-metamesh-yellow/30">
                    <Wallet className="w-10 h-10 md:w-12 md:h-12 text-metamesh-yellow" />
                </div>
                <div className="absolute inset-0 bg-metamesh-yellow/20 rounded-full blur-xl animate-pulse"></div>
            </motion.div>

            {/* Title and Description */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-4"
            >
                <h2 className="text-3xl md:text-4xl font-bold gradient-text">
                    Connect Your Wallet
                </h2>
                <p className="text-gray-400 text-lg max-w-md mx-auto leading-relaxed">
                    Connect your Web3 wallet to access Zenova's tokenized stock platform and start trading ERC-20 company shares.
                </p>
            </motion.div>

            {/* Connect Button */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="w-full flex justify-center"
            >
                <ZenovaCustomConnectButton />
            </motion.div>

            {/* Features Grid */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md"
            >
                {features.map((feature, index) => (
                    <motion.div
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        className="bg-metamesh-dark-card/50 border border-metamesh-gray/30 rounded-lg p-4 backdrop-blur-sm"
                    >
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-metamesh-yellow/10 rounded-lg flex items-center justify-center text-metamesh-yellow">
                                {feature.icon}
                            </div>
                            <div className="text-left">
                                <h4 className="text-sm font-semibold text-white">{feature.title}</h4>
                                <p className="text-xs text-gray-400">{feature.description}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Important Notice */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="w-full max-w-lg"
            >
                <Card className="bg-metamesh-yellow/5 border-metamesh-yellow/20 backdrop-blur-sm">
                    <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                            <AlertTriangle className="w-5 h-5 text-metamesh-yellow mt-0.5 flex-shrink-0" />
                            <div className="text-left">
                                <h4 className="font-semibold text-metamesh-yellow text-sm mb-1">
                                    Network Requirements
                                </h4>
                                <p className="text-xs text-gray-300 leading-relaxed">
                                    Ensure you are connected to a supported network (e.g., Zenova Testnet or compatible Ethereum testnet) where USDT is available for trading tokenized stocks.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default ConnectWalletPortfolioStep; 
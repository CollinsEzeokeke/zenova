"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { motion } from "framer-motion";
import { Wallet, AlertTriangle, CheckCircle, LogOut, ChevronDown } from "lucide-react";

export const ZenovaCustomConnectButton = () => {
    return (
        <ConnectButton.Custom>
            {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                authenticationStatus,
                mounted,
            }) => {
                const ready = mounted && authenticationStatus !== "loading";
                const connected =
                    ready &&
                    account &&
                    chain &&
                    (!authenticationStatus || authenticationStatus === "authenticated");

                const buttonBaseClasses =
                    "px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-md font-orbitron text-xs sm:text-sm flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-50 whitespace-nowrap";
                const iconSize = "h-3.5 w-3.5 sm:h-4 sm:w-4";
                // Updated hover effect for metamesh-yellow
                const buttonHoverEffect =
                    "hover:shadow-[0_0_12px_1px_rgba(255,200,0,0.6),_0_0_15px_3px_rgba(255,200,0,0.4)_inset]";
                // Using a generic error red, adjust if specific theme red is available
                const redButtonHoverEffect =
                    "hover:shadow-[0_0_12px_1px_rgba(255,49,49,0.6),_0_0_15px_3px_rgba(255,49,49,0.4)_inset]";

                return (
                    <div
                        {...(!ready && {
                            "aria-hidden": true,
                            style: {
                                opacity: 0,
                                pointerEvents: "none",
                                userSelect: "none",
                            },
                        })}
                    >
                        {(() => {
                            if (!connected) {
                                return (
                                    <motion.button
                                        onClick={openConnectModal}
                                        type="button"
                                        className={`${buttonBaseClasses} bg-gradient-to-r from-metamesh-yellow/70 to-metamesh-yellow text-metamesh-dark border-2 border-metamesh-yellow/80 shadow-[0_0_7px_0_rgba(255,200,0,0.4)] ${buttonHoverEffect}`}
                                        whileHover={{ scale: 1.05, textShadow: "0px 0px 6px rgb(255,200,0)" }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Wallet className={`mr-1.5 sm:mr-2 ${iconSize}`} />
                                        Connect Wallet
                                    </motion.button>
                                );
                            }

                            if (chain.unsupported) {
                                return (
                                    <motion.button
                                        onClick={openChainModal}
                                        type="button"
                                        // Using a generic error red color, adjust if specific theme red exists
                                        className={`${buttonBaseClasses} bg-gradient-to-r from-red-500/70 to-red-600 text-white border-2 border-red-600/80 shadow-[0_0_7px_0_rgba(255,49,49,0.4)] ${redButtonHoverEffect}`}
                                        whileHover={{ scale: 1.05, textShadow: "0px 0px 6px rgb(255,49,49)" }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <AlertTriangle className={`mr-1.5 sm:mr-2 ${iconSize}`} />
                                        Wrong Network
                                    </motion.button>
                                );
                            }

                            return (
                                <div className="flex items-center gap-1.5 sm:gap-2">
                                    <motion.button
                                        onClick={openChainModal}
                                        type="button"
                                        className={`${buttonBaseClasses} bg-metamesh-dark-light text-white/80 border border-metamesh-yellow/50 hover:border-metamesh-yellow hover:text-metamesh-yellow focus:ring-metamesh-yellow/50 ${buttonHoverEffect}`}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        title={chain.name ?? "Current network"}
                                    >
                                        {chain.hasIcon && chain.iconUrl ? (
                                            <img
                                                alt={chain.name ?? "Chain icon"}
                                                src={chain.iconUrl}
                                                className={`${iconSize} rounded-full mr-1 sm:mr-1.5 flex-shrink-0`}
                                                style={{ background: chain.iconBackground }}
                                            />
                                        ) : (
                                            <div className={`${iconSize} rounded-full mr-1 sm:mr-1.5 bg-white/10 flex-shrink-0`} />
                                        )}
                                        <span className="hidden sm:inline truncate max-w-[60px] md:max-w-[80px]">{chain.name}</span>
                                        <ChevronDown className={`ml-0.5 sm:ml-1 ${iconSize} flex-shrink-0`} />
                                    </motion.button>

                                    <motion.button
                                        onClick={openAccountModal}
                                        type="button"
                                        className={`${buttonBaseClasses} bg-metamesh-dark-light text-metamesh-yellow border border-metamesh-yellow/50 hover:border-metamesh-yellow focus:ring-metamesh-yellow/50 ${buttonHoverEffect}`}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        title={`${account.displayName}${account.displayBalance ? ` (${account.displayBalance})` : ""}`}
                                    >
                                        <CheckCircle className={`mr-1 sm:mr-1.5 ${iconSize} text-metamesh-yellow flex-shrink-0`} />
                                        <div className="flex flex-col items-start leading-tight sm:flex-row sm:items-center sm:gap-1">
                                            <span className="truncate max-w-[60px] xs:max-w-[80px] sm:max-w-[100px] md:max-w-[120px]">
                                                {account.displayName}
                                            </span>
                                            {account.displayBalance && (
                                                <span className="text-white/60 text-[10px] sm:text-xs truncate">
                                                    ({account.displayBalance})
                                                </span>
                                            )}
                                        </div>
                                        <LogOut className={`ml-1 sm:ml-1.5 ${iconSize} flex-shrink-0`} />
                                    </motion.button>
                                </div>
                            );
                        })()}
                    </div>
                );
            }}
        </ConnectButton.Custom>
    );
};

export default ZenovaCustomConnectButton; 
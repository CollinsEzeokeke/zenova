"use client";

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { OnboardingProvider, useOnboarding } from '@/contexts/OnboardingContext';
import AIChat from '@/components/onboarding/AIChat';
import { useAccount } from 'wagmi';
import { useUIFocus, UIFocusTarget } from '@/contexts/UIFocusContext';
import { Wallet, Loader2 } from 'lucide-react';

const OnboardingContent: React.FC = () => {
  const { currentStage } = useOnboarding();
  const { isConnected, isConnecting } = useAccount();
  const { setFocusElement } = useUIFocus();

  useEffect(() => {
    if (!isConnected && !isConnecting) {
      setFocusElement(UIFocusTarget.NAVBAR_CONNECT_BUTTON);
    } else {
      setFocusElement(null);
    }
  }, [isConnected, isConnecting, setFocusElement]);

  if (isConnecting) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-metamesh-yellow" />
          <p className="ml-4 text-xl text-gray-300">Connecting to wallet...</p>
        </div>
      </Layout>
    );
  }

  if (!isConnected) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-metamesh-dark-card border border-metamesh-gray p-8 md:p-12 rounded-xl shadow-2xl max-w-lg"
          >
            <Wallet className="h-16 w-16 text-metamesh-yellow mx-auto mb-6" />
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Connect Your Wallet
            </h1>
            <p className="text-lg text-gray-400 mb-8">
              To begin the AI-powered company onboarding process with Zenova, please connect your secure wallet first.
              Use the button in the navigation bar at the top of the page.
            </p>
            <p className="text-sm text-gray-500">
              The connect button should be highlighted for your convenience.
            </p>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="relative min-h-screen overflow-hidden py-10 flex flex-col">
        {/* Background effects */}
        <div className="absolute inset-0 z-0">
          <motion.div 
            className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-gradient-radial from-metamesh-yellow/10 to-transparent blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
          <motion.div 
            className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-gradient-radial from-metamesh-yellow/15 to-transparent blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex-grow flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-7xl mx-auto flex-grow flex flex-col w-full"
          >
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
                AI-Powered Company Onboarding
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Experience the future of tokenization with ZenovaAI. 
                Our intelligent assistant will guide you through every step.
              </p>
            </div>

            <div className="max-w-3xl mx-auto w-full flex-grow flex flex-col">
              <div className="flex-grow flex flex-col gap-6">
                {/* Wallet Connection (show when needed) */}
                {currentStage === 'wallet_connect' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {/* <WalletConnection /> */}
                  </motion.div>
                )}

                {/* AI Chat Interface */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex-grow flex flex-col min-h-0"
                >
                  <AIChat className="h-full" />
                </motion.div>

                {/* Additional Stage-Specific UI */}
                {currentStage === 'complete' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-gradient-to-r from-green-500/10 to-metamesh-yellow/10 border border-green-400/30 rounded-lg p-6"
                  >
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-white mb-4">
                        🎉 Onboarding Complete!
                      </h2>
                      <p className="text-gray-300 mb-6">
                        Your company has been successfully tokenized and is ready for trading on the Zenova platform.
                      </p>
                      <div className="flex flex-wrap justify-center gap-4">
                        <motion.a
                          href="/portfolio"
                          className="bg-metamesh-yellow text-metamesh-dark px-6 py-3 rounded-lg font-medium hover:bg-metamesh-yellow/90 transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          View Dashboard
                        </motion.a>
                        <motion.a
                          href="/assets"
                          className="bg-transparent border border-metamesh-yellow text-metamesh-yellow px-6 py-3 rounded-lg font-medium hover:bg-metamesh-yellow/10 transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Explore Assets
                        </motion.a>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

const NewOnboarding: React.FC = () => {
  return (
        <OnboardingProvider>
          <OnboardingContent />
        </OnboardingProvider>
  );
};

export default NewOnboarding;

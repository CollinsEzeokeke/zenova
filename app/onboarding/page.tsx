'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import OnboardingAIChat from '@/components/onboarding/OnboardingAIChat';
import OnboardingProgressTracker from '@/components/onboarding/OnboardingProgressTracker';
import SciFiButton from '@/components/ui/SciFiButton';

const Onboarding = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);

  const stages = [
    'Wallet Connection',
    'Company Information',
    'AI Analysis',
    'Valuation Submission',
    'Asset Creation',
    'Completion'
  ];

  const handleConnectWallet = () => {
    // Mock wallet connection
    setTimeout(() => {
      setIsWalletConnected(true);
    }, 1000);
  };

  const handleStartOnboarding = () => {
    setHasStarted(true);
    setCurrentStage(1);
  };

  const handleAIStageChange = (newStage: number) => {
    if (newStage >= 0 && newStage < stages.length) {
      setCurrentStage(newStage);
    } else {
      console.warn(`AI tried to transition to an invalid stage: ${newStage}`);
    }
  };

  const handleProceedToDashboard = () => {
    console.log("Proceeding to dashboard / next phase...");
    // Implement navigation logic here, e.g., router.push('/dashboard');
    // For now, it will just log to the console.
    alert("Onboarding complete! You would now be taken to the next part of the application.");
  };
  
  const isFinalStage = currentStage === stages.length - 1;

  return (
    <Layout>
      <div className="relative min-h-screen overflow-hidden py-20">
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

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimatePresence mode="wait">
            {!isWalletConnected ? (
              <motion.div
                key="wallet-connection"
                className="max-w-2xl mx-auto text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
                  AI-Powered Company Onboarding
                </h1>
                <p className="text-xl text-gray-400 mb-8 max-w-xl mx-auto">
                  Connect your wallet to begin the intelligent onboarding process. 
                  Our ZenovaAI will guide you through every step of tokenizing your company.
                </p>
                
                <div className="bg-metamesh-dark-card border border-metamesh-gray rounded-lg p-8 mb-8">
                  <h2 className="text-2xl font-semibold text-white mb-4">What to Expect</h2>
                  <div className="space-y-4 text-left">
                    {[
                      'AI-guided data collection and verification',
                      'Autonomous company valuation using advanced algorithms',
                      'Real-time market analysis and price discovery',
                      'Seamless blockchain asset creation and deployment'
                    ].map((feature, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center space-x-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <div className="h-2 w-2 rounded-full bg-metamesh-yellow" />
                        <span className="text-gray-300">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <SciFiButton 
                  onClick={handleConnectWallet}
                  variant="primary"
                  size="lg"
                  className="w-full max-w-xs"
                >
                  Connect Wallet to Begin
                </SciFiButton>
              </motion.div>
            ) : !hasStarted ? (
              <motion.div
                key="start-onboarding"
                className="max-w-2xl mx-auto text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-metamesh-dark-card border border-green-400/50 rounded-lg p-6 mb-8">
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <div className="h-3 w-3 rounded-full bg-green-400" />
                    <span className="text-green-400 font-medium">Wallet Connected</span>
                  </div>
                  <p className="text-gray-300">
                    Ready to begin AI-powered onboarding process
                  </p>
                </div>

                <h2 className="text-3xl font-bold text-white mb-6">
                  Ready to Meet ZenovaAI?
                </h2>
                <p className="text-gray-400 mb-8">
                  Our AI agent will now guide you through the complete onboarding process. 
                  The AI will ask for information, perform evaluations, and handle the technical aspects autonomously.
                </p>

                <SciFiButton 
                  onClick={handleStartOnboarding}
                  variant="primary"
                  size="lg"
                  className="w-full max-w-xs"
                >
                  Initiate AI Onboarding
                </SciFiButton>
              </motion.div>
            ) : (
              <motion.div
                key="ai-onboarding"
                className="max-w-6xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                  {/* Progress Tracker */}
                  <div className="lg:col-span-1">
                    <OnboardingProgressTracker 
                      stages={stages}
                      currentStage={currentStage}
                      onStageChange={(stageIndex) => {
                        if (stageIndex < currentStage) {
                            console.log(`User clicked on past stage in tracker: ${stageIndex}. Current AI stage: ${currentStage}.`);
                        }
                      }}
                    />
                  </div>

                  {/* AI Interaction Console replaced by OnboardingAIChat */}
                  <div className="lg:col-span-3">
                    {!isFinalStage ? (
                      <OnboardingAIChat
                          initialStage={currentStage}
                          onAIStageChange={handleAIStageChange}
                      />
                    ) : (
                      <motion.div
                        key="onboarding-complete"
                        className="bg-metamesh-dark-card border border-metamesh-yellow/70 rounded-lg p-8 text-center shadow-xl glow-border-yellow"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <h2 className="text-3xl font-bold text-metamesh-yellow mb-4 font-orbitron glow-text-yellow">
                          Onboarding Complete!
                        </h2>
                        <p className="text-gray-300 mb-8 text-lg">
                          Congratulations! You have successfully completed the AI-powered onboarding process. 
                          Your company information has been processed, and you're ready for the next steps.
                        </p>
                        <SciFiButton 
                          onClick={handleProceedToDashboard}
                          variant="primary"
                          size="lg"
                          className="w-full max-w-md mx-auto"
                        >
                          Proceed to Dashboard
                        </SciFiButton>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
};

export default Onboarding;

"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ArrowRight, Clock, Zap, Shield, TrendingUp } from 'lucide-react';
import SciFiButton from '@/components/ui/SciFiButton';
import { useOnboarding } from '@/contexts/OnboardingContext';

interface OnboardingActionPanelProps {
  className?: string;
}

const OnboardingActionPanel: React.FC<OnboardingActionPanelProps> = ({ className }) => {
  const { currentStage, stages, completeStage, setCurrentStage } = useOnboarding();

  const getStageActions = () => {
    switch (currentStage) {
      case 'welcome':
        return {
          title: 'Welcome to Zenova AI',
          description: 'Let our AI guide you through the tokenization process',
          action: 'Start Onboarding',
          canProceed: true,
          nextStage: 'wallet_connect',
          icon: <Zap className="h-6 w-6" />
        };
      
      case 'wallet_connect':
        return {
          title: 'Connect Your Wallet',
          description: 'Secure your account with wallet authentication',
          action: 'Connect Wallet',
          canProceed: false, // Will be enabled when wallet is connected
          nextStage: 'company_info',
          icon: <Shield className="h-6 w-6" />
        };
      
      case 'company_info':
        return {
          title: 'Company Information',
          description: 'Provide details about your company for AI analysis',
          action: 'Continue to Analysis',
          canProceed: false, // Enabled after AI determines sufficient info
          nextStage: 'financial_data',
          icon: <TrendingUp className="h-6 w-6" />
        };
      
      case 'financial_data':
        return {
          title: 'Financial Analysis',
          description: 'AI is analyzing your financial data and market position',
          action: 'Proceed to Valuation',
          canProceed: false,
          nextStage: 'valuation',
          icon: <TrendingUp className="h-6 w-6" />
        };
      
      case 'valuation':
        return {
          title: 'AI Valuation Complete',
          description: 'Review your company valuation and tokenization proposal',
          action: 'Review Proposal',
          canProceed: true,
          nextStage: 'review',
          icon: <CheckCircle className="h-6 w-6" />
        };
      
      case 'review':
        return {
          title: 'Final Review',
          description: 'Confirm your tokenization parameters before deployment',
          action: 'Deploy Assets',
          canProceed: true,
          nextStage: 'deployment',
          icon: <ArrowRight className="h-6 w-6" />
        };
      
      case 'deployment':
        return {
          title: 'Deploying Assets',
          description: 'Smart contracts are being deployed to the blockchain',
          action: 'Deploying...',
          canProceed: false,
          nextStage: 'complete',
          icon: <Clock className="h-6 w-6" />
        };
      
      case 'complete':
        return {
          title: 'Onboarding Complete!',
          description: 'Your company has been successfully tokenized',
          action: 'View Dashboard',
          canProceed: true,
          nextStage: null,
          icon: <CheckCircle className="h-6 w-6" />
        };
      
      default:
        return null;
    }
  };

  const stageActions = getStageActions();
  if (!stageActions) return null;

  const handleActionClick = () => {
    if (stageActions.nextStage) {
      completeStage(currentStage);
      setCurrentStage(stageActions.nextStage);
    } else if (currentStage === 'complete') {
      window.location.href = '/portfolio';
    }
  };

  // Mock function to simulate AI readiness (you can implement actual logic)
  const isAIReady = () => {
    // This would be determined by AI chat analysis in real implementation
    return currentStage === 'valuation' || currentStage === 'review' || currentStage === 'complete';
  };

  const canProceed = stageActions.canProceed || isAIReady();

  return (
    <div className={`bg-metamesh-dark-card border border-metamesh-gray rounded-lg p-6 ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Stage Icon and Title */}
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex-shrink-0 p-3 bg-metamesh-yellow/10 border border-metamesh-yellow/30 rounded-lg">
              <div className="text-metamesh-yellow">
                {stageActions.icon}
              </div>
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">{stageActions.title}</h3>
              <p className="text-gray-400 text-sm">{stageActions.description}</p>
            </div>
          </div>

          {/* Progress Indicators */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm text-gray-400">Stage Progress</span>
              <div className="flex-1 h-2 bg-metamesh-gray rounded-full">
                <motion.div
                  className="h-full bg-gradient-to-r from-metamesh-yellow to-amber-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${((stages.findIndex(s => s.id === currentStage) + 1) / stages.length) * 100}%` 
                  }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
            <div className="text-xs text-gray-500">
              Step {stages.findIndex(s => s.id === currentStage) + 1} of {stages.length}
            </div>
          </div>

          {/* Action Button */}
          <div className="space-y-4">
            <SciFiButton
              onClick={handleActionClick}
              disabled={!canProceed}
              variant={canProceed ? "primary" : "outline"}
              size="lg"
              className="w-full"
            >
              <div className="flex items-center justify-center space-x-2">
                <span>{stageActions.action}</span>
                {canProceed && currentStage !== 'deployment' && (
                  <ArrowRight className="h-4 w-4" />
                )}
                {currentStage === 'deployment' && (
                  <Clock className="h-4 w-4 animate-spin" />
                )}
              </div>
            </SciFiButton>

            {!canProceed && currentStage !== 'deployment' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <p className="text-xs text-gray-500 mb-2">
                  Continue chatting with ZenovaAI to proceed
                </p>
                <div className="flex items-center justify-center space-x-2">
                  <motion.div
                    className="h-2 w-2 rounded-full bg-metamesh-yellow/50"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                  />
                  <motion.div
                    className="h-2 w-2 rounded-full bg-metamesh-yellow/50"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                  />
                  <motion.div
                    className="h-2 w-2 rounded-full bg-metamesh-yellow/50"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
                  />
                </div>
              </motion.div>
            )}
          </div>

          {/* Quick Stats */}
          {currentStage === 'valuation' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 grid grid-cols-2 gap-4"
            >
              <div className="bg-metamesh-gray/30 rounded-lg p-3">
                <div className="text-xs text-gray-400">Estimated Valuation</div>
                <div className="text-lg font-semibold text-metamesh-yellow">$2.5M</div>
              </div>
              <div className="bg-metamesh-gray/30 rounded-lg p-3">
                <div className="text-xs text-gray-400">Token Price</div>
                <div className="text-lg font-semibold text-metamesh-yellow">$12.50</div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default OnboardingActionPanel;

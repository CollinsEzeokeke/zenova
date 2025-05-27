import React, { createContext, useContext, useState, useCallback } from 'react';
import { OnboardingContextType, OnboardingStage } from '@/types/onboarding';

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

const defaultStages: OnboardingStage[] = [
  { id: 'welcome', title: 'Welcome', description: 'Introduction to Zenova AI', isCompleted: false },
  { id: 'wallet_connect', title: 'Connect Wallet', description: 'Secure wallet connection', isCompleted: false },
  { id: 'company_info', title: 'Company Information', description: 'Basic company details', isCompleted: false },
  { id: 'financial_data', title: 'Financial Analysis', description: 'AI data analysis', isCompleted: false },
  { id: 'valuation', title: 'AI Valuation', description: 'Tokenization proposal', isCompleted: false },
  { id: 'review', title: 'Review & Confirm', description: 'Final confirmation', isCompleted: false },
  { id: 'deployment', title: 'Asset Deployment', description: 'Creating your tokens', isCompleted: false },
  { id: 'complete', title: 'Complete', description: 'Onboarding finished', isCompleted: false },
];

interface OnboardingProviderProps {
  children: React.ReactNode;
}

export const OnboardingProvider: React.FC<OnboardingProviderProps> = ({ children }) => {
  const [currentStage, setCurrentStageState] = useState('welcome');
  const [stages, setStages] = useState<OnboardingStage[]>(defaultStages);
  const [progress, setProgress] = useState(0);
  const [walletConnected, setWalletConnected] = useState(false);

  const setCurrentStage = useCallback((stageId: string) => {
    setCurrentStageState(stageId);
    setStages(prev => prev.map(stage => ({
      ...stage,
      isActive: stage.id === stageId
    })));
  }, []);

  const updateProgress = useCallback((newProgress: number) => {
    setProgress(Math.max(0, Math.min(100, newProgress)));
  }, []);

  const completeStage = useCallback((stageId: string) => {
    setStages(prev => prev.map(stage => ({
      ...stage,
      isCompleted: stage.id === stageId ? true : stage.isCompleted
    })));
    
    // Auto-advance to next stage
    const currentIndex = stages.findIndex(s => s.id === stageId);
    if (currentIndex >= 0 && currentIndex < stages.length - 1) {
      const nextStage = stages[currentIndex + 1];
      setCurrentStage(nextStage.id);
      updateProgress(((currentIndex + 1) / (stages.length - 1)) * 100);
    }
  }, [stages, setCurrentStage, updateProgress]);

  const value: OnboardingContextType = {
    currentStage,
    stages,
    progress,
    walletConnected,
    setCurrentStage,
    updateProgress,
    completeStage,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}; 
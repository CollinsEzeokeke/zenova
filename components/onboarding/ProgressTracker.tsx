"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Circle, Lock, ChevronRight } from 'lucide-react';
import { useOnboarding } from '@/contexts/OnboardingContext';

const ProgressTracker: React.FC = () => {
  const { stages, currentStage, progress } = useOnboarding();

  const getStageStatus = (stageId: string) => {
    const stage = stages.find(s => s.id === stageId);
    if (stage?.isCompleted) return 'completed';
    if (stageId === currentStage) return 'current';
    return 'pending';
  };

  const getStageIcon = (stageId: string) => {
    const status = getStageStatus(stageId);
    switch (status) {
      case 'completed':
        return <Check className="h-4 w-4 text-green-400" />;
      case 'current':
        return <Circle className="h-4 w-4 text-metamesh-yellow fill-current" />;
      default:
        return <Lock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStageColors = (stageId: string) => {
    const status = getStageStatus(stageId);
    switch (status) {
      case 'completed':
        return 'bg-green-400/10 border-green-400/50 text-green-400';
      case 'current':
        return 'bg-metamesh-yellow/10 border-metamesh-yellow/50 text-metamesh-yellow shadow-lg shadow-metamesh-yellow/20';
      default:
        return 'bg-gray-500/10 border-gray-500/30 text-gray-500';
    }
  };

  return (
    <div className="bg-metamesh-dark-card border border-metamesh-gray rounded-lg p-6 h-fit sticky top-6">
      <div className="mb-6">
        <h3 className="text-white font-semibold text-lg mb-2">Onboarding Progress</h3>
        <div className="w-full bg-metamesh-gray rounded-full h-2 mb-2">
          <motion.div
            className="bg-gradient-to-r from-metamesh-yellow to-amber-400 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
        <p className="text-gray-400 text-sm">{Math.round(progress)}% Complete</p>
      </div>
      
      <div className="space-y-3">
        {stages.map((stage, index) => {
          const status = getStageStatus(stage.id);
          
          return (
            <motion.div
              key={stage.id}
              className={`relative p-4 rounded-lg border transition-all duration-300 cursor-pointer ${getStageColors(stage.id)}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={status === 'completed' ? { scale: 1.02 } : {}}
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  {getStageIcon(stage.id)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{stage.title}</div>
                  {stage.description && (
                    <div className="text-xs opacity-70 mt-1 truncate">
                      {stage.description}
                    </div>
                  )}
                </div>
                {status === 'current' && (
                  <motion.div
                    className="h-2 w-2 rounded-full bg-current"
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
                {status === 'completed' && (
                  <ChevronRight className="h-4 w-4 opacity-50" />
                )}
              </div>
              
              {/* Progress line to next stage */}
              {index < stages.length - 1 && (
                <div className="absolute left-[26px] top-14 w-0.5 h-3 bg-gray-600">
                  {status === 'completed' && (
                    <motion.div
                      className="w-full bg-green-400 rounded-full"
                      initial={{ height: 0 }}
                      animate={{ height: '100%' }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    />
                  )}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* AI Status */}
      <div className="mt-6 pt-6 border-t border-metamesh-gray">
        <div className="flex items-center space-x-3">
          <motion.div
            className="h-3 w-3 rounded-full bg-metamesh-yellow"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <div>
            <div className="text-sm font-medium text-white">ZenovaAI Status</div>
            <div className="text-xs text-gray-400">
              {currentStage === 'welcome' && 'Ready to guide you'}
              {currentStage === 'wallet_connect' && 'Waiting for wallet connection'}
              {currentStage === 'company_info' && 'Collecting company information'}
              {currentStage === 'financial_data' && 'Analyzing financial data'}
              {currentStage === 'valuation' && 'Calculating valuation'}
              {currentStage === 'review' && 'Preparing proposal'}
              {currentStage === 'deployment' && 'Deploying smart contracts'}
              {currentStage === 'complete' && 'Onboarding complete'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;

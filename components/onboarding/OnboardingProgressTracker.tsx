
import React from 'react';
import { motion } from 'framer-motion';
import { Check, Circle, Lock } from 'lucide-react';

interface OnboardingProgressTrackerProps {
  stages: string[];
  currentStage: number;
}

const OnboardingProgressTracker: React.FC<OnboardingProgressTrackerProps> = ({
  stages,
  currentStage,
}) => {
  const getStageStatus = (index: number) => {
    if (index < currentStage) return 'completed';
    if (index === currentStage) return 'current';
    return 'pending';
  };

  const getStageIcon = (index: number) => {
    const status = getStageStatus(index);
    switch (status) {
      case 'completed':
        return <Check className="h-4 w-4 text-green-400" />;
      case 'current':
        return <Circle className="h-4 w-4 text-metamesh-yellow" />;
      default:
        return <Lock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStageColors = (index: number) => {
    const status = getStageStatus(index);
    switch (status) {
      case 'completed':
        return 'bg-green-400/10 border-green-400/50 text-green-400';
      case 'current':
        return 'bg-metamesh-yellow/10 border-metamesh-yellow/50 text-metamesh-yellow';
      default:
        return 'bg-gray-500/10 border-gray-500/30 text-gray-500';
    }
  };

  return (
    <div className="bg-metamesh-dark-card border border-metamesh-gray rounded-lg p-6">
      <h3 className="text-white font-semibold mb-6">Onboarding Progress</h3>
      
      <div className="space-y-4">
        {stages.map((stage, index) => {
          const status = getStageStatus(index);
          
          return (
            <motion.div
              key={index}
              className={`relative p-3 rounded-lg border transition-all duration-300 ${getStageColors(index)}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  {getStageIcon(index)}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{stage}</div>
                  <div className="text-xs opacity-70 mt-1">
                    {status === 'completed' && 'Completed'}
                    {status === 'current' && 'In Progress'}
                    {status === 'pending' && 'Pending'}
                  </div>
                </div>
                {status === 'current' && (
                  <div className="h-2 w-2 rounded-full bg-current animate-pulse" />
                )}
              </div>
              
              {/* Progress line to next stage */}
              {index < stages.length - 1 && (
                <div className="absolute left-[21px] top-12 w-0.5 h-4 bg-gray-600">
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
          <div className="h-3 w-3 rounded-full bg-metamesh-yellow animate-pulse" />
          <div>
            <div className="text-sm font-medium text-white">ZenovaAI Status</div>
            <div className="text-xs text-gray-400">
              {currentStage === 0 && 'Waiting for initialization'}
              {currentStage === 1 && 'Collecting company information'}
              {currentStage === 2 && 'Analyzing market data'}
              {currentStage === 3 && 'Processing valuation'}
              {currentStage === 4 && 'Creating blockchain asset'}
              {currentStage === 5 && 'Onboarding complete'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingProgressTracker;

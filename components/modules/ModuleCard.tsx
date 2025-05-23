"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SkeletonLoader, { SkeletonText } from '../ui/SkeletonLoader';

interface ModuleCardProps {
  id: string;
  name: string;
  description: string;
  category: string;
  complexity: 'Basic' | 'Intermediate' | 'Advanced';
  compatibleWith: string[];
  author: string;
  isLoading?: boolean;
}

const ModuleCard: React.FC<ModuleCardProps> = ({
  name,
  description,
  category,
  complexity,
  compatibleWith,
  author,
  isLoading = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getComplexityColor = () => {
    switch (complexity) {
      case 'Basic':
        return 'text-green-400';
      case 'Intermediate':
        return 'text-blue-400';
      case 'Advanced':
        return 'text-purple-400';
      default:
        return 'text-gray-400';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-metamesh-dark-card border border-metamesh-gray rounded-lg p-5 h-full">
        <div className="flex justify-between items-start mb-4">
          <SkeletonText lines={1} className="w-1/2" />
          <SkeletonText lines={1} className="w-1/4" />
        </div>
        <SkeletonText lines={2} />
        <div className="mt-4">
          <SkeletonText lines={1} className="w-1/3" />
          <div className="mt-2 flex gap-1">
            <SkeletonLoader className="h-6 w-16 rounded" />
            <SkeletonLoader className="h-6 w-16 rounded" />
          </div>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <SkeletonText lines={1} className="w-1/4" />
          <SkeletonLoader className="h-8 w-8 rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="bg-metamesh-dark-card border border-metamesh-gray hover:border-metamesh-yellow/30 rounded-lg overflow-hidden transition-all duration-300 h-full flex flex-col"
      whileHover={{ boxShadow: '0 4px 20px rgba(250, 204, 21, 0.1)' }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      layout
    >
      <div className="p-5 flex-grow">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-white mb-1">{name}</h3>
          <span className={`text-xs font-medium ${getComplexityColor()}`}>
            {complexity}
          </span>
        </div>
        
        <div className="flex items-center mb-3">
          <span className="text-xs bg-metamesh-yellow/20 text-metamesh-yellow px-2 py-0.5 rounded">
            {category}
          </span>
        </div>
        
        <AnimatePresence initial={false}>
          <motion.p 
            className={`text-gray-400 text-sm ${isExpanded ? '' : 'line-clamp-2'}`}
            initial={{ height: 'auto' }}
            animate={{ height: 'auto' }}
            exit={{ height: 'auto' }}
          >
            {description}
          </motion.p>
        </AnimatePresence>
        
        {description.length > 100 && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-metamesh-yellow mt-1 hover:underline focus:outline-none"
          >
            {isExpanded ? 'Show less' : 'Read more'}
          </button>
        )}

        <div className="mt-4">
          <h4 className="text-xs text-gray-400 uppercase mb-2">Analytics Integration</h4>
          <div className="flex flex-wrap gap-1">
            {compatibleWith.slice(0, 3).map((item, idx) => (
              <span 
                key={idx} 
                className="text-xs bg-metamesh-dark px-2 py-1 rounded border border-metamesh-gray"
              >
                {item}
              </span>
            ))}
            {compatibleWith.length > 3 && (
              <span className="text-xs bg-metamesh-dark px-2 py-1 rounded border border-metamesh-gray">
                +{compatibleWith.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-5 border-t border-metamesh-gray flex justify-between items-center mt-auto">
        <div className="text-xs text-gray-400">
          Developed by <span className="text-white">{author}</span>
        </div>
        
        <motion.button 
          className="bg-metamesh-dark hover:bg-metamesh-gray h-8 w-8 rounded-full flex items-center justify-center transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 text-metamesh-yellow" 
            fill="none"
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 4v16m8-8H4" 
            />
          </svg>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ModuleCard;

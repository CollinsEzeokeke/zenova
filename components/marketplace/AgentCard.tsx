"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

interface AgentCardProps {
  id: string;
  name: string;
  description: string;
  type: string;
  modules: string[];
  deployments: number;
  rating: number;
  imageUrl?: string;
}

const AgentCard: React.FC<AgentCardProps> = ({
  id,
  name,
  description,
  type,
  modules,
  deployments,
  rating,
  imageUrl
}) => {
  return (
    <motion.div 
      className="bg-metamesh-dark-card border border-metamesh-gray hover:border-metamesh-yellow/30 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-metamesh-yellow/5"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
    >
      <div 
        className={`h-48 bg-gradient-to-br from-metamesh-yellow/20 to-metamesh-dark relative overflow-hidden`}
      >
        {imageUrl && (
          <div className="relative w-full h-full">
            <Image 
              src={imageUrl} 
              alt={name} 
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover mix-blend-luminosity opacity-60"
            />
          </div>
        )}
        
        <div className="absolute inset-0 flex flex-col justify-between p-4">
          <div className="flex justify-between items-start">
            <span className="bg-metamesh-dark/80 text-metamesh-yellow text-xs py-1 px-2 rounded-full">
              {type}
            </span>
            <div className="flex items-center bg-metamesh-dark/80 py-1 px-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-metamesh-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <span className="ml-1 text-xs text-white">{rating.toFixed(1)}</span>
            </div>
          </div>
          
          <div>
            <div className="bg-metamesh-dark/80 backdrop-blur-sm p-2 rounded inline-block">
              <h3 className="text-lg font-semibold text-white">{name}</h3>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-5">
        <p className="text-gray-300 text-sm mb-4 line-clamp-2">{description}</p>
        
        <div className="mb-4">
          <h4 className="text-xs text-gray-400 uppercase mb-2">Modules</h4>
          <div className="flex flex-wrap gap-1">
            {modules.slice(0, 3).map((module, idx) => (
              <span 
                key={idx} 
                className="text-xs bg-metamesh-dark px-2 py-1 rounded border border-metamesh-gray"
              >
                {module}
              </span>
            ))}
            {modules.length > 3 && (
              <span className="text-xs bg-metamesh-dark px-2 py-1 rounded border border-metamesh-gray">
                +{modules.length - 3} more
              </span>
            )}
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-2 border-t border-metamesh-gray">
          <div className="text-xs text-gray-400">
            {deployments.toLocaleString()} deployments
          </div>
          
          <Link 
            href={`/marketplace/${id}`}
            className="text-sm text-metamesh-yellow hover:underline flex items-center"
          >
            View Details
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 ml-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 5l7 7-7 7" 
              />
            </svg>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default AgentCard;

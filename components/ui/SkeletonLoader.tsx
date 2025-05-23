
import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'card' | 'text' | 'avatar' | 'button' | 'custom';
}

const SkeletonLoader: React.FC<SkeletonProps> = ({ 
  className, 
  variant = 'text'
}) => {
  const baseClasses = "bg-metamesh-gray/30 animate-pulse rounded";
  
  const variantClasses = {
    text: "h-4 w-full",
    card: "h-[250px] w-full",
    avatar: "h-12 w-12 rounded-full",
    button: "h-10 w-24",
    custom: "",
  };

  return (
    <div className={cn(baseClasses, variantClasses[variant], className)}></div>
  );
};

export const SkeletonText = ({ lines = 1, className }: { lines?: number, className?: string }) => {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonLoader key={i} variant="text" className="w-full last:w-4/5" />
      ))}
    </div>
  );
};

export const SkeletonCard = () => {
  return (
    <div className="border border-metamesh-gray bg-metamesh-dark-card rounded-lg p-4 space-y-4">
      <SkeletonLoader variant="custom" className="h-40 rounded-md" />
      <SkeletonText lines={1} className="w-3/4" />
      <SkeletonText lines={2} />
      <div className="flex justify-between items-center pt-2">
        <SkeletonLoader variant="button" className="h-8 w-24" />
        <SkeletonLoader variant="avatar" className="h-8 w-8" />
      </div>
    </div>
  );
};

export default SkeletonLoader;

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface SciFiButtonProps {
  children: React.ReactNode;
  to?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
}

const SciFiButton: React.FC<SciFiButtonProps> = ({
  children,
  to,
  onClick,
  variant = 'primary',
  size = 'md',
  className,
  disabled = false,
  type = 'button',
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-metamesh-yellow text-metamesh-dark hover:bg-metamesh-yellow/90 border-metamesh-yellow';
      case 'secondary':
        return 'bg-metamesh-gray text-white hover:bg-metamesh-gray/90 border-metamesh-gray';
      case 'outline':
        return 'bg-transparent border-metamesh-yellow text-metamesh-yellow hover:bg-metamesh-yellow/10';
      case 'ghost':
        return 'bg-transparent border-transparent text-metamesh-yellow hover:bg-metamesh-yellow/10';
      default:
        return 'bg-metamesh-yellow text-metamesh-dark hover:bg-metamesh-yellow/90 border-metamesh-yellow';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm';
      case 'md':
        return 'px-4 py-2';
      case 'lg':
        return 'px-6 py-3 text-lg';
      default:
        return 'px-4 py-2';
    }
  };

  const buttonClasses = cn(
    'relative overflow-hidden rounded-lg font-medium transition-all duration-300 inline-flex items-center justify-center border',
    'before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700',
    'focus:outline-none focus:ring-2 focus:ring-metamesh-yellow/50 focus:ring-offset-2 focus:ring-offset-metamesh-dark',
    getVariantClasses(),
    getSizeClasses(),
    disabled && 'opacity-50 cursor-not-allowed',
    className
  );

  const buttonContent = (
    <>
      <span className="relative z-10 flex items-center space-x-2">
        {children}
      </span>
      {variant === 'primary' && (
        <motion.div
          className="absolute inset-0 bg-white/20 rounded-lg"
          initial={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1, opacity: 1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </>
  );

  if (to && !disabled) {
    return (
      <Link href={to} className={buttonClasses}>
        {buttonContent}
      </Link>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={disabled ? undefined : onClick}
      className={buttonClasses}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      disabled={disabled}
    >
      {buttonContent}
    </motion.button>
  );
};

export default SciFiButton;

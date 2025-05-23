import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface AnimatedButtonProps {
  children: React.ReactNode;
  to?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  external?: boolean;
  href?: string;
  animate?: boolean;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  to,
  onClick,
  variant = 'primary',
  size = 'md',
  className,
  external = false,
  href,
  animate = true,
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-metamesh-yellow text-metamesh-dark hover:bg-metamesh-yellow/90';
      case 'secondary':
        return 'bg-metamesh-gray text-white hover:bg-metamesh-gray/90';
      case 'outline':
        return 'bg-transparent border border-metamesh-yellow text-metamesh-yellow hover:bg-metamesh-yellow/10';
      default:
        return 'bg-metamesh-yellow text-metamesh-dark hover:bg-metamesh-yellow/90';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1 text-sm';
      case 'md':
        return 'px-4 py-2';
      case 'lg':
        return 'px-6 py-3 text-lg';
      default:
        return 'px-4 py-2';
    }
  };

  const buttonClasses = cn(
    'rounded-md font-medium transition-colors inline-flex items-center justify-center relative overflow-hidden',
    getVariantClasses(),
    getSizeClasses(),
    className
  );

  const buttonContent = (
    <>
      <span className="relative z-10">{children}</span>
      {animate && variant === 'primary' && (
        <motion.span
          className="absolute inset-0 bg-white"
          initial={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 2.5, opacity: 0.1 }}
          transition={{ duration: 0.6 }}
          style={{ originY: '50%', originX: '50%', borderRadius: '100%' }}
        />
      )}
    </>
  );

  if (to) {
    return (
      <Link href={to} className={buttonClasses}>
        {buttonContent}
      </Link>
    );
  }

  if (href) {
    return (
      <a 
        href={href} 
        className={buttonClasses} 
        target={external ? "_blank" : "_self"}
        rel={external ? "noopener noreferrer" : ""}
      >
        {buttonContent}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={buttonClasses}>
      {buttonContent}
    </button>
  );
};

export default AnimatedButton;

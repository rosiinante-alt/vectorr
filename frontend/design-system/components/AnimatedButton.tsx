/**
 * AnimatedButton Component
 * 
 * Button with hover, active, and focus animations.
 * Provides consistent interaction feedback across the application.
 */

'use client';

import { motion } from 'motion/react';
import { hover, active, durations, easings, prefersReducedMotion } from '../tokens/motion';
import { spacing } from '../tokens/spacing';
import { colors } from '../tokens/colors';
import React from 'react';

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export function AnimatedButton({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  className = '',
  disabled = false,
  ...props
}: AnimatedButtonProps) {
  const reducedMotion = prefersReducedMotion();

  const baseClasses = 'relative inline-flex items-center justify-center font-semibold transition-colors rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-accent text-white hover:bg-accent-hover',
    secondary: 'border border-border bg-transparent text-text-primary hover:bg-bg-secondary',
    ghost: 'text-accent hover:bg-accent-wash',
  };

  const sizes = {
    sm: `px-3 py-1.5 text-sm`,
    md: `px-3 py-2 text-base`,
    lg: `px-4 py-3 text-base`,
  };

  const buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  const buttonMotionProps = reducedMotion ? {} : {
    whileHover: !disabled ? { scale: 1.02 } : {},
    whileTap: !disabled ? { scale: 0.98 } : {},
    transition: { duration: durations.fast / 1000, ease: easings.spring },
  };

  return (
    <motion.button
      {...buttonMotionProps}
      className={buttonClasses}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
        />
      ) : icon ? (
        <>
          <span className="mr-2 flex">{icon}</span>
          {children}
        </>
      ) : (
        children
      )}
    </motion.button>
  );
}

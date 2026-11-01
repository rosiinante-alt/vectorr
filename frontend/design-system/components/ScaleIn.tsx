/**
 * ScaleIn Component
 * 
 * Entrance animation: element grows from 0.95 to 1 while fading in.
 * Subtle, non-intrusive entrance suitable for cards and modals.
 * Respects prefers-reduced-motion.
 */

'use client';

import { motion, MotionProps } from 'motion/react';
import { springs, durations, prefersReducedMotion } from '../tokens/motion';

interface ScaleInProps extends MotionProps {
  children: React.ReactNode;
  delay?: number;
  scale?: number;
}

export function ScaleIn({ 
  children, 
  delay = 0, 
  scale = 0.95,
  ...props 
}: ScaleInProps) {
  const reducedMotion = prefersReducedMotion();

  if (reducedMotion) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.01, delay }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        ...springs.smooth,
        duration: durations.base / 1000,
        delay,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

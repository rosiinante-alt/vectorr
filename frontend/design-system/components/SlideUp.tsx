/**
 * SlideUp Component
 * 
 * Entrance animation: element slides up from below while fading in.
 * Uses spring physics for natural motion.
 * Respects prefers-reduced-motion.
 */

'use client';

import { motion, MotionProps } from 'motion/react';
import { springs, durations, animationDistance, prefersReducedMotion } from '../tokens/motion';

interface SlideUpProps extends MotionProps {
  children: React.ReactNode;
  delay?: number;
  distance?: number;
}

export function SlideUp({ 
  children, 
  delay = 0, 
  distance = animationDistance.normal,
  ...props 
}: SlideUpProps) {
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
      initial={{ opacity: 0, y: distance }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        ...springs.smooth,
        duration: durations.slow / 1000,
        delay,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

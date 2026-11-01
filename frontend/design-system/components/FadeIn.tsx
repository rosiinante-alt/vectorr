/**
 * FadeIn Component
 * 
 * Simple opacity fade-in animation.
 * Respects prefers-reduced-motion.
 */

'use client';

import { motion, MotionProps } from 'motion/react';
import { durations, easingCurves, prefersReducedMotion } from '../tokens/motion';

interface FadeInProps extends MotionProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
}

export function FadeIn({ children, delay = 0, duration = durations.base / 1000, ...props }: FadeInProps) {
  const reducedMotion = prefersReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: reducedMotion ? 0.01 : duration,
        delay,
        ease: easingCurves.spring,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

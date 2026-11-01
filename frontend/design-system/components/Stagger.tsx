/**
 * Stagger Component
 * 
 * Container for staggered list animations.
 * Children animate in sequence with proper timing.
 */

'use client';

import { motion, MotionProps } from 'motion/react';
import { stagger as staggerConfig, durations, springs, prefersReducedMotion } from '../tokens/motion';

interface StaggerProps extends MotionProps {
  children: React.ReactNode;
  staggerDelay?: number;
  maxDuration?: number;
}

export function Stagger({ 
  children, 
  staggerDelay = staggerConfig.menu,
  maxDuration = staggerConfig.maxDuration,
  ...props 
}: StaggerProps) {
  const reducedMotion = prefersReducedMotion();
  const childArray = React.Children.toArray(children);

  return (
    <motion.div {...props}>
      {childArray.map((child, index) => {
        const delay = Math.min(index * staggerDelay, maxDuration);
        
        if (!React.isValidElement(child)) return child;

        return (
          <motion.div
            key={index}
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              ...springs.smooth,
              duration: durations.slow / 1000,
              delay: reducedMotion ? 0 : delay,
            }}
          >
            {child}
          </motion.div>
        );
      })}
    </motion.div>
  );
}

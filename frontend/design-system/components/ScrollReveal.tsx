/**
 * ScrollReveal Component
 * 
 * Reveals element when it scrolls into view.
 * Automatically triggers animation on intersection.
 * Respects prefers-reduced-motion.
 */

'use client';

import { motion, MotionProps } from 'motion/react';
import { useEffect, useState, useRef } from 'react';
import { scrollReveal, prefersReducedMotion } from '../tokens/motion';

interface ScrollRevealProps extends MotionProps {
  children: React.ReactNode;
  threshold?: number;
}

export function ScrollReveal({ 
  children, 
  threshold = scrollReveal.threshold,
  ...props 
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = prefersReducedMotion();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { 
        threshold,
        rootMargin: scrollReveal.rootMargin,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [isVisible, threshold]);

  if (reducedMotion) {
    return (
      <div ref={ref} {...props}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      initial={scrollReveal.animation.initial}
      animate={isVisible ? scrollReveal.animation.animate : scrollReveal.animation.initial}
      transition={scrollReveal.animation.transition}
      {...props}
    >
      {children}
    </motion.div>
  );
}

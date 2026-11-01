/**
 * RevealText Component
 * 
 * Word-by-word text reveal animation.
 * Each word transitions individually from muted to full color.
 * Perfect for tagline sections and headlines.
 * 
 * Source: landing-page-design skill (B11 tagline reveal section)
 */

'use client';

import { motion } from 'motion/react';
import { wordReveal, stagger, prefersReducedMotion } from '../tokens/motion';
import { useEffect, useState, useRef } from 'react';

interface RevealTextProps {
  children: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';
}

export function RevealText({ children, className = '', as: Component = 'p' }: RevealTextProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = prefersReducedMotion();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const words = children.split(' ');

  return (
    <Component
      ref={ref}
      className={className}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.25em',
      }}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          initial={reducedMotion ? { opacity: 1 } : wordReveal.initial}
          animate={isVisible && !reducedMotion ? wordReveal.visible : { opacity: 1 }}
          transition={{
            ...wordReveal.visible.transition,
            delay: (index * stagger.menu) < stagger.maxDuration ? index * stagger.menu : stagger.maxDuration,
          }}
          style={{ display: 'inline-block' }}
        >
          {word}
        </motion.span>
      ))}
    </Component>
  );
}

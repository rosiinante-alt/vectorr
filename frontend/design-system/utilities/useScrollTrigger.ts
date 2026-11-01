/**
 * useScrollTrigger Hook
 * 
 * Detects when an element enters the viewport.
 * Returns whether element is currently visible.
 * 
 * Uses IntersectionObserver for performance.
 */

'use client';

import { useEffect, useState, useRef, RefObject } from 'react';

interface ScrollTriggerOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useScrollTrigger<T extends HTMLElement = HTMLDivElement>(
  options: ScrollTriggerOptions = {}
): [RefObject<T>, boolean] {
  const {
    threshold = 0.2,
    rootMargin = '0px 0px -10% 0px',
    triggerOnce = true,
  } = options;

  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce && ref.current) {
            observer.unobserve(ref.current);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, rootMargin, triggerOnce]);

  return [ref, isVisible];
}

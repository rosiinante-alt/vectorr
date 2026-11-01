/**
 * Vectorr Motion Tokens
 * 
 * Animation timing, easing, and spring configurations.
 * Based on e1genqq's deterministic animation principles and
 * landing-page-design motion guidelines.
 * 
 * Key principles:
 * - Never use browser default curves (ease, linear, ease-in-out)
 * - Animate only transform and opacity
 * - Respect prefers-reduced-motion
 * - All animations must be deterministic (function of time)
 */

/**
 * Easing curves
 * Base curve: cubic-bezier(0.22, 1, 0.36, 1)
 */
export const easings = {
  // Primary curve - use for most animations
  spring: 'cubic-bezier(0.22, 1, 0.36, 1)',
  
  // Alternative curves for specific use cases
  smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
  snappy: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  
  // Entrance and exit
  entrance: 'cubic-bezier(0, 0, 0.2, 1)',
  exit: 'cubic-bezier(0.4, 0, 1, 1)',
} as const;

/**
 * Duration tokens in milliseconds
 */
export const durations = {
  instant: 0,
  fast: 200,      // Hover, focus states
  base: 300,      // Standard transitions
  moderate: 400,  // Stagger cap for lists
  slow: 500,      // Layout changes, page transitions
  reveal: 600,    // Scroll reveals (can go up to 800ms)
  extended: 800,  // Large content reveals
} as const;

/**
 * Spring configurations for Motion/Framer Motion
 * Based on response and dampingFraction from spec
 */
export const springs = {
  // Default spring from Vectorr spec
  default: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 30,
    mass: 1,
  },
  
  // Smooth, gentle spring
  smooth: {
    type: 'spring' as const,
    stiffness: 200,
    damping: 25,
    mass: 1,
  },
  
  // Snappy, responsive spring
  snappy: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 35,
    mass: 0.8,
  },
  
  // Bouncy spring for playful interactions
  bouncy: {
    type: 'spring' as const,
    stiffness: 500,
    damping: 20,
    mass: 1,
  },
  
  // Gentle spring for large movements
  gentle: {
    type: 'spring' as const,
    stiffness: 150,
    damping: 25,
    mass: 1.2,
  },
} as const;

/**
 * Stagger configurations for list animations
 */
export const stagger = {
  // Standard stagger for menu items
  menu: 0.06,     // 60ms per item
  
  // Faster stagger for small lists
  fast: 0.04,     // 40ms per item
  
  // Slower stagger for cards
  slow: 0.08,     // 80ms per item
  
  // Maximum total duration for staggered sequences
  maxDuration: 0.4, // 400ms cap
} as const;

/**
 * Animation variants for common patterns
 */
export const variants = {
  // Fade in
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: durations.base / 1000 },
  },
  
  // Slide up
  slideUp: {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -24 },
    transition: { ...springs.smooth, duration: durations.slow / 1000 },
  },
  
  // Scale in
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { ...springs.smooth, duration: durations.base / 1000 },
  },
  
  // Slide from left
  slideFromLeft: {
    initial: { opacity: 0, x: -32 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -32 },
    transition: { ...springs.smooth },
  },
  
  // Slide from right
  slideFromRight: {
    initial: { opacity: 0, x: 32 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 32 },
    transition: { ...springs.smooth },
  },
} as const;

/**
 * Hover animations (for use with Motion's whileHover)
 */
export const hover = {
  // Subtle lift
  lift: {
    y: -2,
    transition: { duration: durations.fast / 1000, ease: easings.spring },
  },
  
  // Scale up slightly
  scale: {
    scale: 1.02,
    transition: { duration: durations.fast / 1000, ease: easings.spring },
  },
  
  // Glow effect (opacity change on pseudo-element)
  glow: {
    boxShadow: '0 8px 24px rgba(0, 114, 204, 0.2)',
    transition: { duration: durations.base / 1000, ease: easings.spring },
  },
} as const;

/**
 * Active/tap animations
 */
export const active = {
  // Press down
  press: {
    scale: 0.98,
    transition: { duration: durations.fast / 1000 },
  },
  
  // Push down
  pushDown: {
    y: 1,
    transition: { duration: durations.fast / 1000 },
  },
} as const;

/**
 * Scroll reveal configuration
 * For use with IntersectionObserver
 */
export const scrollReveal = {
  threshold: 0.2,           // 20% visible before triggering
  rootMargin: '0px 0px -10% 0px', // Trigger slightly before center
  
  animation: {
    initial: { opacity: 0, y: 32 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: durations.reveal / 1000,
      ease: easings.spring,
    },
  },
} as const;

/**
 * Word reveal animation (tagline section)
 */
export const wordReveal = {
  // Initial muted state
  initial: {
    opacity: 0.3,
  },
  
  // Fully visible state
  visible: {
    opacity: 1,
    transition: {
      duration: durations.slow / 1000,
      ease: easings.spring,
    },
  },
} as const;

/**
 * Page transition animations
 */
export const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: {
    duration: durations.base / 1000,
    ease: easings.spring,
  },
} as const;

/**
 * Modal/overlay transitions
 */
export const modalTransition = {
  overlay: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: durations.fast / 1000 },
  },
  
  content: {
    initial: { opacity: 0, scale: 0.95, y: 10 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: 10 },
    transition: { ...springs.smooth, duration: durations.base / 1000 },
  },
} as const;

/**
 * Loading animations
 */
export const loading = {
  // Pulse animation for skeleton loaders
  pulse: {
    opacity: [0.5, 0.8, 0.5],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: easings.smooth,
    },
  },
  
  // Spinner rotation
  spin: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
} as const;

/**
 * Reduced motion preferences
 * Replace all motion with opacity-only changes
 */
export const reducedMotion = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.01 }, // Near instant
} as const;

// Type exports
export type Easings = typeof easings;
export type Durations = typeof durations;
export type Springs = typeof springs;
export type Variants = typeof variants;

/**
 * Helper to check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get appropriate transition based on reduced motion preference
 */
export function getTransition(normal: any, reduced = reducedMotion) {
  return prefersReducedMotion() ? reduced : normal;
}

/**
 * Vectorr Design System Tokens
 * 
 * Central export for all design tokens.
 * Import from here for consistency across the application.
 */

export * from './colors';
export * from './spacing';
export * from './typography';
export * from './motion';

// Combined export for convenience
export {
  colors,
  spacing,
  semanticSpacing,
  animationDistance,
  typography,
  semanticType,
  textWrap,
  maxWidths,
  easings,
  durations,
  springs,
  stagger,
  variants,
  hover,
  active,
  scrollReveal,
  wordReveal,
  pageTransition,
  modalTransition,
  loading,
  reducedMotion,
  prefersReducedMotion,
  getTransition,
} from './index.ts';

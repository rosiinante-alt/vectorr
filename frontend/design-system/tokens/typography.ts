/**
 * Vectroy Typography Tokens
 * 
 * Font families, sizes, weights, and line heights.
 * All sizes snap to Tailwind's default type scale.
 * 
 * Rules:
 * - Use Geist, Manrope, Geist Mono, or Poppins
 * - Never use Inter, Roboto, Arial, Open Sans, Helvetica
 * - No italic fonts anywhere
 * - Cap at semibold (600) or bold (700), never ultra-bold (900)
 * - No hyphens in copy, no orphaned words
 */

export const typography = {
  // Font families
  fonts: {
    sans: 'var(--font-inter), -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
    mono: 'var(--font-mono-metrics), ui-monospace, "SF Mono", Menlo, monospace',
    // Note: Currently using Inter, should migrate to Geist per design system
    // TODO: Update to Geist after verifying with stakeholders
  },

  // Font weights
  weights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  // Type scale - matches Tailwind defaults exactly
  scale: {
    xs: {
      size: '12px',      // 0.75rem
      lineHeight: '16px',
    },
    sm: {
      size: '14px',      // 0.875rem
      lineHeight: '20px',
    },
    base: {
      size: '16px',      // 1rem
      lineHeight: '24px',
    },
    lg: {
      size: '18px',      // 1.125rem
      lineHeight: '28px',
    },
    xl: {
      size: '20px',      // 1.25rem
      lineHeight: '28px',
    },
    '2xl': {
      size: '24px',      // 1.5rem
      lineHeight: '32px',
    },
    '3xl': {
      size: '30px',      // 1.875rem
      lineHeight: '36px',
    },
    '4xl': {
      size: '36px',      // 2.25rem
      lineHeight: '40px',
    },
    '5xl': {
      size: '48px',      // 3rem
      lineHeight: '1',
    },
    '6xl': {
      size: '60px',      // 3.75rem
      lineHeight: '1',
    },
    '7xl': {
      size: '72px',      // 4.5rem
      lineHeight: '1',
    },
    '8xl': {
      size: '96px',      // 6rem
      lineHeight: '1',
    },
    '9xl': {
      size: '128px',     // 8rem
      lineHeight: '1',
    },
  },

  // Letter spacing
  tracking: {
    tight: '-0.035em',   // Display type
    normal: '-0.008em',  // Body text
    wide: '0.025em',     // Small caps, labels
  },
} as const;

/**
 * Semantic typography tokens for common use cases
 */
export const semanticType = {
  // Display headings (hero, landing pages)
  display: {
    large: {
      size: typography.scale['6xl'].size,
      lineHeight: typography.scale['6xl'].lineHeight,
      weight: typography.weights.bold,
      tracking: typography.tracking.tight,
    },
    medium: {
      size: typography.scale['5xl'].size,
      lineHeight: typography.scale['5xl'].lineHeight,
      weight: typography.weights.bold,
      tracking: typography.tracking.tight,
    },
    small: {
      size: typography.scale['4xl'].size,
      lineHeight: typography.scale['4xl'].lineHeight,
      weight: typography.weights.bold,
      tracking: typography.tracking.tight,
    },
  },

  // Content headings
  heading: {
    h1: {
      size: typography.scale['4xl'].size,
      lineHeight: typography.scale['4xl'].lineHeight,
      weight: typography.weights.bold,
    },
    h2: {
      size: typography.scale['3xl'].size,
      lineHeight: typography.scale['3xl'].lineHeight,
      weight: typography.weights.bold,
    },
    h3: {
      size: typography.scale['2xl'].size,
      lineHeight: typography.scale['2xl'].lineHeight,
      weight: typography.weights.semibold,
    },
    h4: {
      size: typography.scale.xl.size,
      lineHeight: typography.scale.xl.lineHeight,
      weight: typography.weights.semibold,
    },
  },

  // Body text
  body: {
    large: {
      size: typography.scale.lg.size,
      lineHeight: typography.scale.lg.lineHeight,
      weight: typography.weights.normal,
    },
    default: {
      size: typography.scale.base.size,
      lineHeight: typography.scale.base.lineHeight,
      weight: typography.weights.normal,
    },
    small: {
      size: typography.scale.sm.size,
      lineHeight: typography.scale.sm.lineHeight,
      weight: typography.weights.normal,
    },
  },

  // UI elements
  button: {
    default: {
      size: typography.scale.base.size,
      weight: typography.weights.semibold,
    },
    small: {
      size: typography.scale.sm.size,
      weight: typography.weights.semibold,
    },
  },

  // Labels and captions
  label: {
    default: {
      size: typography.scale.sm.size,
      lineHeight: typography.scale.sm.lineHeight,
      weight: typography.weights.medium,
    },
    small: {
      size: typography.scale.xs.size,
      lineHeight: typography.scale.xs.lineHeight,
      weight: typography.weights.medium,
    },
  },
} as const;

/**
 * Text wrapping utilities
 */
export const textWrap = {
  balance: 'text-wrap: balance',    // For headings
  pretty: 'text-wrap: pretty',      // For body copy
  nowrap: 'white-space: nowrap',
} as const;

/**
 * Maximum widths for readability
 */
export const maxWidths = {
  prose: '680px',     // For hero headings and subheadings
  content: '720px',   // For article content
  form: '480px',      // For form fields
} as const;

// Type exports
export type Typography = typeof typography;
export type SemanticType = typeof semanticType;
export type TextWrap = typeof textWrap;

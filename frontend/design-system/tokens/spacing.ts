/**
 * Vectroy Spacing Tokens
 * 
 * Only use these values for padding, margin, and gaps.
 * Nothing between them, nothing outside them.
 * 
 * Maps to Tailwind spacing scale for easy integration.
 * Source: ai-design-skills landing-page-design
 */

export const spacing = {
  0: '0',
  25: '2px',    // 0.5 in Tailwind
  50: '4px',    // 1
  75: '8px',    // 2
  100: '12px',  // 3
  200: '16px',  // 4
  300: '24px',  // 6
  400: '32px',  // 8
  500: '40px',  // 10
  600: '48px',  // 12
  700: '64px',  // 16
  800: '80px',  // 20
  900: '96px',  // 24
} as const;

/**
 * Semantic spacing for common use cases
 */
export const semanticSpacing = {
  // Button padding
  button: {
    y: spacing[75],   // 8px vertical
    x: spacing[100],  // 12px horizontal
    sm: {
      y: spacing[50], // 4px
      x: spacing[75], // 8px
    },
  },

  // Card padding
  card: {
    sm: spacing[200],  // 16px
    md: spacing[300],  // 24px
    lg: spacing[400],  // 32px
  },

  // Stack spacing (vertical rhythm)
  stack: {
    xs: spacing[50],   // 4px
    sm: spacing[75],   // 8px
    md: spacing[100],  // 12px
    lg: spacing[200],  // 16px
    xl: spacing[300],  // 24px
    '2xl': spacing[400], // 32px
  },

  // Section spacing
  section: {
    sm: spacing[400],  // 32px
    md: spacing[600],  // 48px
    lg: spacing[700],  // 64px
    xl: spacing[800],  // 80px
  },

  // Page wrapper padding
  page: {
    x: spacing[300],  // 24px
    xMobile: spacing[200], // 16px on mobile
  },
} as const;

/**
 * Animation distance values
 * How far elements move during entrance/exit animations
 */
export const animationDistance = {
  subtle: 12,  // px - small movements
  normal: 24,  // px - standard entrance
  large: 32,   // px - scroll reveals
} as const;

// Type exports
export type SpacingToken = typeof spacing;
export type SemanticSpacing = typeof semanticSpacing;
export type AnimationDistance = typeof animationDistance;

/**
 * Get spacing value by token number
 */
export function getSpacing(token: keyof typeof spacing): string {
  return spacing[token];
}

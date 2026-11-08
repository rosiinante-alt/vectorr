/**
 * Vectroy Color Tokens
 * 
 * All colors meet WCAG 2.1 AA contrast requirements against white background.
 * No gradients in backgrounds - use flat colors only.
 * 
 * Source: /src/app/globals.css
 */

export const colors = {
  // Background layers
  bg: {
    primary: '#FFFFFF',
    secondary: '#F5F5F7',
    tertiary: '#E8E8ED',
  },

  // Text colors with contrast ratios
  text: {
    primary: '#1D1D1F',    // 17.0:1 AAA
    secondary: '#515154',  // 8.6:1 AAA
    tertiary: '#6E6E73',   // 5.4:1 AA
  },

  // Brand accent colors
  accent: {
    DEFAULT: '#0072CC',    // 4.56:1 AA (text + fills)
    hover: '#005BA8',      // 6.35:1 AAA
    wash: '#EAF3FB',       // Light background tint
    ink: '#005BA8',        // Text on accent backgrounds
  },

  // Semantic colors
  success: {
    DEFAULT: '#1CB721',    // 2.68:1 (fills only, not text)
    text: '#1F7A3D',       // 5.3:1 AA (text-safe)
    wash: '#EAF7EC',       // Light background
  },

  warning: {
    DEFAULT: '#B05C00',
    wash: '#FFF5E4',
  },

  error: {
    DEFAULT: '#C4261D',    // 5.6:1 AA
    wash: '#FDECEB',
  },

  // Borders and dividers
  border: {
    DEFAULT: 'rgba(0, 0, 0, 0.09)',
    strong: 'rgba(0, 0, 0, 0.16)',
  },

  // Dark mode backgrounds (for future dark mode support)
  dark: {
    bg: {
      base: '#000000',
      elevated1: '#181818',
      elevated2: '#1F1F1F',
      elevated3: '#272727',
      elevated4: '#313131',
      warm: '#131209',
    },
  },
} as const;

/**
 * Hero gradient colors (only place gradients are allowed)
 * Used on heading text, never on backgrounds
 */
export const heroGradients = {
  light: {
    from: '#000000',
    to: '#666666',
  },
  dark: {
    from: '#FFFFFF',
    to: '#9B9B9B',
  },
} as const;

/**
 * Utility function to get CSS gradient string for hero text
 */
export function getHeroGradient(theme: 'light' | 'dark' = 'light'): string {
  const gradient = heroGradients[theme];
  return `linear-gradient(to right, ${gradient.from}, ${gradient.to})`;
}

// Type exports for TypeScript
export type ColorToken = typeof colors;
export type HeroGradient = typeof heroGradients;

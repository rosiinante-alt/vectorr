/**
 * Animation Utility Functions
 * 
 * Helper functions for animations and motion calculations.
 */

import { easings, durations, springs } from '../tokens/motion';

/**
 * Calculate nested radius from outer radius and gap
 * From landing-page-design skill B3
 */
export function calculateNestedRadius(outerRadius: number, gap: number): number {
  if (gap >= 32) {
    return outerRadius;
  }

  const innerRadius = outerRadius - gap;
  return innerRadius > 2 ? innerRadius : 0;
}

/**
 * Clamp value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Linear interpolation between two values
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * clamp(t, 0, 1);
}

/**
 * Map value from one range to another
 */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  const t = (value - inMin) / (inMax - inMin);
  return lerp(outMin, outMax, t);
}

/**
 * Easing function: cubic ease out
 * From e1genqq's approach
 */
export function easeOut(t: number): number {
  return 1 - Math.pow(1 - clamp(t, 0, 1), 3);
}

/**
 * Spring response formula
 * Closed-form spring for deterministic animations
 */
export function springResponse(
  t: number,
  response: number = 0.35,
  dampingFraction: number = 0.8
): number {
  if (t <= 0) return 0;

  const omega = 2 * Math.PI / response;
  const zeta = dampingFraction;
  
  if (zeta < 1) {
    const omegaD = omega * Math.sqrt(1 - zeta * zeta);
    return 1 - Math.exp(-zeta * omega * t) * 
      (Math.cos(omegaD * t) + (zeta * omega / omegaD) * Math.sin(omegaD * t));
  } else if (zeta === 1) {
    return 1 - Math.exp(-omega * t) * (1 + omega * t);
  } else {
    const omegaD = omega * Math.sqrt(zeta * zeta - 1);
    return 1 - Math.exp(-zeta * omega * t) *
      ((zeta + Math.sqrt(zeta * zeta - 1)) * Math.exp(omegaD * t) +
       (zeta - Math.sqrt(zeta * zeta - 1)) * Math.exp(-omegaD * t)) / (2 * zeta);
  }
}

/**
 * Calculate stagger delay for list items
 * Ensures total duration doesn't exceed maxDuration
 */
export function calculateStaggerDelay(
  index: number,
  itemDelay: number = 0.06,
  maxTotalDuration: number = 0.4
): number {
  const calculatedDelay = index * itemDelay;
  return Math.min(calculatedDelay, maxTotalDuration);
}

/**
 * Get animation preset by name
 */
export function getAnimationPreset(name: 'fast' | 'base' | 'slow' | 'reveal') {
  const presets = {
    fast: {
      duration: durations.fast / 1000,
      ease: easings.spring,
    },
    base: {
      duration: durations.base / 1000,
      ease: easings.spring,
    },
    slow: {
      duration: durations.slow / 1000,
      ease: easings.spring,
      ...springs.smooth,
    },
    reveal: {
      duration: durations.reveal / 1000,
      ease: easings.spring,
    },
  };

  return presets[name];
}

/**
 * Create CSS transform string from values
 */
export function createTransform({
  x = 0,
  y = 0,
  scale = 1,
  rotate = 0,
}: {
  x?: number;
  y?: number;
  scale?: number;
  rotate?: number;
}): string {
  const transforms: string[] = [];

  if (x !== 0 || y !== 0) {
    transforms.push(`translate(${x}px, ${y}px)`);
  }

  if (scale !== 1) {
    transforms.push(`scale(${scale})`);
  }

  if (rotate !== 0) {
    transforms.push(`rotate(${rotate}deg)`);
  }

  return transforms.join(' ') || 'none';
}

/**
 * Parse Tailwind spacing token to pixels
 */
export function spacingToPixels(token: string): number {
  const spacingMap: Record<string, number> = {
    '0': 0,
    '0.5': 2,
    '1': 4,
    '2': 8,
    '3': 12,
    '4': 16,
    '6': 24,
    '8': 32,
    '10': 40,
    '12': 48,
    '16': 64,
    '20': 80,
    '24': 96,
  };

  return spacingMap[token] || 0;
}

/**
 * Seek function (t) - deterministic animation
 * Returns element state at exact timestamp
 * Based on e1genqq's approach
 */
export function seek(t: number, animations: Array<{
  start: number;
  end: number;
  property: string;
  from: number;
  to: number;
  ease?: (t: number) => number;
}>): Record<string, number> {
  const state: Record<string, number> = {};

  animations.forEach(({ start, end, property, from, to, ease = easeOut }) => {
    if (t < start) {
      state[property] = from;
    } else if (t > end) {
      state[property] = to;
    } else {
      const progress = (t - start) / (end - start);
      state[property] = lerp(from, to, ease(progress));
    }
  });

  return state;
}

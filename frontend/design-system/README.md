# Vectorr Design System

A comprehensive animation and UI design system inspired by e1genqq's motion design principles and ai-design-skills best practices.

## Overview

This design system provides a complete foundation for building animated, conversion-optimized interfaces in Vectorr. It combines:

- **Motion-first principles** from e1genqq's automated motion design approach
- **Design tokens** for consistency across all UI
- **Reusable animation components** with frame-accurate timing
- **Conversion-optimized patterns** from landing-page-design skill

## Structure

```
design-system/
├── tokens/              # Design tokens (colors, typography, spacing, timing)
├── components/          # Reusable UI components with animations
├── animations/          # Animation utilities and presets
├── utilities/           # Helper functions and hooks
├── examples/            # Example implementations
└── README.md           # This file
```

## Quick Start

### 1. Install Dependencies

The design system uses Motion (formerly Framer Motion) which is already installed in Vectorr:

```bash
# Already in package.json:
# "motion": "^14.9.0"
```

### 2. Import Design Tokens

```tsx
import { colors, spacing, typography, motion } from '@/frontend/design-system/tokens';
```

### 3. Use Animation Components

```tsx
import { AnimatedButton, FadeIn, SlideUp } from '@/frontend/design-system/components';

export function MyPage() {
  return (
    <FadeIn>
      <h1>Welcome to Vectorr</h1>
      <AnimatedButton>Get Started</AnimatedButton>
    </FadeIn>
  );
}
```

## Design Principles

### 1. Motion First

Every interaction should feel weighted and intentional. We use:
- **Springs over easing** for natural motion
- **Deterministic animations** that can be controlled frame-by-frame
- **Staggered sequences** for visual hierarchy
- **Reduced motion support** for accessibility

### 2. Frame-Accurate Timing

Following e1genqq's seek(t) approach:
- Animations are functions of time, not dependent on previous frames
- Every animation can jump to any timestamp
- Consistent timing across all components

### 3. Conversion Optimization

From the landing-page-design skill:
- **Clear visual hierarchy** with proper spacing
- **Meaningful animations** that guide attention
- **Accessibility first** with proper focus states
- **Performance optimized** with GPU acceleration

## Core Animation Patterns

### Entrance Animations
- **FadeIn**: Opacity 0 → 1 with subtle upward motion
- **SlideUp**: Enters from below with spring physics
- **ScaleIn**: Grows from 0.95 to 1 with fade
- **Reveal**: Progressive word-by-word text reveal

### Interaction Animations
- **Hover**: Subtle lift with shadow increase
- **Active**: Scale down to 0.98 for tactile feedback
- **Focus**: Animated ring that respects accessibility
- **Loading**: Skeleton loaders shaped like real content

### Transition Animations
- **PageTransition**: Smooth page changes
- **ModalTransition**: Scale and fade for overlays
- **TabTransition**: Slide indicator follows selection
- **AccordionTransition**: Height animation with proper timing

## Design Tokens

### Colors
Follows Vectorr's existing palette with WCAG AA contrast:
- Primary: `#0072CC` (4.56:1 contrast)
- Success: `#1F7A3D` (5.3:1 contrast)
- Error: `#C4261D` (5.6:1 contrast)

### Typography
- **Primary**: Inter (already in Vectorr)
- **Mono**: SF Mono for code/data
- **Scale**: Tailwind default scale (text-xs through text-9xl)

### Spacing
Uses tokens from landing-page-design:
- 2px, 4px, 8px, 12px, 16px, 24px, 32px, 40px, 48px, 64px, 80px, 96px

### Motion Timing
- **Base curve**: `cubic-bezier(0.22, 1, 0.36, 1)` (already in globals.css)
- **Duration-fast**: 200ms (hover, focus)
- **Duration-base**: 300ms (standard transitions)
- **Duration-slow**: 500ms (layout changes, page transitions)
- **Duration-reveal**: 600-800ms (scroll reveals)

## Component Library

### Buttons
- **Primary**: Filled with accent color
- **Secondary**: Outlined with hover fill
- **Ghost**: Transparent with hover background
- All include hover, active, focus, and loading states

### Cards
- **Default**: Subtle border with hover lift
- **Elevated**: Shadow on hover
- **Interactive**: Click/tap feedback

### Inputs
- **Text**: With focus animation and validation states
- **Select**: Custom dropdown with smooth open/close
- **Checkbox/Radio**: Animated checkmark and radio dot

### Modals & Overlays
- **Modal**: Scale and fade entrance
- **Drawer**: Slide from edge
- **Tooltip**: Fade with position awareness

## Animation Guidelines

### Do's ✅
- Use springs for natural motion
- Respect `prefers-reduced-motion`
- Animate `transform` and `opacity` only
- Keep durations under 500ms for UI interactions
- Stagger list items by 60ms (capped at 400ms total)
- Use `IntersectionObserver` for scroll reveals
- Test on 60Hz and 120Hz displays

### Don'ts ❌
- Never animate `width`, `height`, `top`, `left`
- No browser default curves (`ease`, `ease-in-out`)
- No instant state changes (minimum 200ms)
- No infinite animations on load
- No motion without reduced-motion fallback
- No scroll listeners without throttling

## Accessibility

All components include:
- **Keyboard navigation** with visible focus states
- **Screen reader support** with proper ARIA labels
- **Reduced motion** fallbacks
- **Color contrast** meeting WCAG AA minimum
- **Focus management** for modals and overlays

## Performance

Optimizations included:
- **GPU acceleration** with `transform` and `opacity`
- **Will-change** hints for known animations
- **IntersectionObserver** for scroll-based animations
- **requestAnimationFrame** for smooth motion
- **Lazy loading** for animation components

## Examples

See the `/examples` directory for:
- Landing page hero sections
- Product feature showcases
- Dashboard interfaces
- File upload flows
- Data visualizations

## Extending the System

### Adding New Components

1. Create component in `/components` directory
2. Export animation variants
3. Add to component index
4. Document in examples
5. Test accessibility

### Customizing Animations

```tsx
import { motion } from 'motion/react';
import { springs, durations } from '@/frontend/design-system/tokens/motion';

const customVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      ...springs.smooth
    }
  }
};
```

## Resources

- **e1genqq's motion system**: Deterministic animation principles
- **ai-design-skills**: Landing page and UI best practices
- **Motion docs**: https://motion.dev
- **Vectorr spec**: `/VECTORR_PROJECT_SPEC.md`

## Contributing

When adding to the design system:
1. Follow existing naming conventions
2. Include reduced-motion variants
3. Add TypeScript types
4. Update examples
5. Test on mobile and desktop
6. Document new patterns

---

**Version**: 1.0.0  
**Last Updated**: November 2, 2026  
**Maintained by**: Vectorr Team

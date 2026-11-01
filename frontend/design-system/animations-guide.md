# Animation Guidelines for Vectorr

**Version**: 1.0.0  
**Based on**: e1genqq's deterministic animation principles + ai-design-skills best practices  
**Status**: Production Ready

---

## Quick Reference

### Core Principles
- ✅ Animate `transform` and `opacity` only
- ✅ Use spring physics for natural motion
- ✅ Respect `prefers-reduced-motion` always
- ✅ Keep durations under 500ms
- ✅ Make animations frame-accurate (deterministic)
- ❌ Never animate `width`, `height`, `top`, `left`
- ❌ Never use browser default curves
- ❌ Never skip accessibility support

---

## Animation Duration Reference

| Duration | Use Case |
|----------|----------|
| **Fast (200ms)** | Hover states, focus rings, quick feedback |
| **Base (300ms)** | Standard transitions, color changes |
| **Moderate (400ms)** | List stagger cap, modal entrance |
| **Slow (500ms)** | Layout changes, page transitions |
| **Reveal (600-800ms)** | Scroll reveals, tagline reveals |

---

## Entrance Animations

### FadeIn (Opacity Only)
Best for: Overlays, notifications, simple reveals

```tsx
import { FadeIn } from '@/frontend/design-system/components';

export function MyComponent() {
  return (
    <FadeIn delay={0.1}>
      <p>Content fades in smoothly</p>
    </FadeIn>
  );
}
```

**Timeline**: 300ms with spring curve

---

### SlideUp (Slide + Fade)
Best for: Page content, feature cards, list items

```tsx
import { SlideUp } from '@/frontend/design-system/components';

export function FeatureCard() {
  return (
    <SlideUp delay={0.2}>
      <div className="p-6 bg-white rounded-lg">
        Feature content
      </div>
    </SlideUp>
  );
}
```

**Timeline**: 500ms with spring physics  
**Movement**: 24px upward  
**When to use**: Page load, section reveals

---

### ScaleIn (Grow + Fade)
Best for: Modals, cards, emphasized content

```tsx
import { ScaleIn } from '@/frontend/design-system/components';

export function Modal() {
  return (
    <ScaleIn>
      <div className="bg-white rounded-xl p-6">
        Modal content
      </div>
    </ScaleIn>
  );
}
```

**Timeline**: 300ms  
**Scale range**: 0.95 → 1.0  
**Subtlety**: Not intrusive, feels natural

---

### RevealText (Word-by-Word)
Best for: Hero headlines, taglines, key messaging

```tsx
import { RevealText } from '@/frontend/design-system/components';

export function HeroSection() {
  return (
    <RevealText 
      as="h1" 
      className="text-6xl font-bold"
    >
      Optimize vectors faster than ever before
    </RevealText>
  );
}
```

**Process**:
1. Words start at 30% opacity (muted)
2. Each word transitions to full opacity individually
3. Sequence activates on scroll intersection
4. Total duration capped at 400ms

**When to use**: Landing pages, section headers

---

## Stagger Animations

For animating lists or multiple items:

```tsx
import { Stagger } from '@/frontend/design-system/components';

export function FileList({ files }) {
  return (
    <Stagger>
      {files.map((file) => (
        <div key={file.id} className="file-item">
          {file.name}
        </div>
      ))}
    </Stagger>
  );
}
```

**Timing**:
- First item: 0ms delay
- Second item: 60ms delay
- Third item: 120ms delay
- ...capped at 400ms total

**Why**: Creates visual rhythm without feeling slow

---

## Scroll Reveals

Trigger animations when elements enter viewport:

```tsx
import { ScrollReveal } from '@/frontend/design-system/components';

export function Section() {
  return (
    <ScrollReveal>
      <div className="content">
        This animates when scrolled into view
      </div>
    </ScrollReveal>
  );
}
```

**Configuration**:
- Threshold: 20% visible before trigger
- Root margin: 10% from bottom for early trigger
- Duration: 600-800ms
- Does not replay on scroll back

---

## Interactive Animations

### Button Animations

All buttons include automatic animations:

```tsx
import { AnimatedButton } from '@/frontend/design-system/components';

export function CTA() {
  return (
    <AnimatedButton 
      variant="primary" 
      size="md"
      onClick={() => {}}
    >
      Start Optimizing
    </AnimatedButton>
  );
}
```

**States**:
- **Hover**: Scale 1.02 (subtle lift)
- **Active/Press**: Scale 0.98 (tactile feedback)
- **Focus**: Visible ring (accessibility)
- **Loading**: Animated spinner

**Variants**:
- `primary`: Filled accent color
- `secondary`: Outlined with hover fill
- `ghost`: Transparent, accent text on hover

---

### Hover Effects

For custom hover animations:

```tsx
import { motion } from 'motion/react';
import { hover, durations, easings } from '@/frontend/design-system/tokens/motion';

export function HoverCard() {
  return (
    <motion.div
      whileHover={hover.lift}
      className="card"
    >
      Content
    </motion.div>
  );
}
```

**Available hover effects**:
- `hover.lift`: Subtle upward motion
- `hover.scale`: Small scale increase
- `hover.glow`: Shadow enhancement

---

### Modal Transitions

```tsx
import { ModalTransition } from '@/frontend/design-system/components';

export function MyModal({ isOpen, onClose }) {
  return (
    <ModalTransition isOpen={isOpen} onClose={onClose}>
      <div className="bg-white rounded-xl p-8 shadow-lg">
        <h2>Modal Title</h2>
        <button onClick={onClose}>Close</button>
      </div>
    </ModalTransition>
  );
}
```

**Sequence**:
1. Overlay fades in (200ms)
2. Content scales up and fades in (300ms)

---

## Custom Animations

### Using Motion Directly

```tsx
import { motion } from 'motion/react';
import { springs, durations } from '@/frontend/design-system/tokens/motion';

export function CustomAnimation() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        ...springs.smooth,
        duration: durations.slow / 1000,
      }}
    >
      Custom content
    </motion.div>
  );
}
```

### Spring Presets

```tsx
import { springs } from '@/frontend/design-system/tokens/motion';

// Default - good all-purpose spring
springs.default

// Smooth - gentle motion
springs.smooth

// Snappy - responsive, quick
springs.snappy

// Bouncy - playful (use sparingly)
springs.bouncy

// Gentle - large movements, slow settling
springs.gentle
```

---

## Frame-Accurate Animations (Deterministic)

Following e1genqq's approach, all animations should be functions of time:

```tsx
import { motion } from 'motion/react';

export function DeterministicAnimation() {
  // Animation is calculated based on timestamp, not previous state
  const variants = {
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        delay: 0, // Explicit delay, not dependent on render order
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate="visible"
      variants={variants}
    >
      This animation is frame-accurate
    </motion.div>
  );
}
```

**Benefits**:
- Consistent across renders
- Seekable to any timestamp
- Predictable performance
- Easy to test

---

## Accessibility Requirements

### Reduced Motion Support

**Always test** that animations disable under `prefers-reduced-motion`:

```tsx
import { prefersReducedMotion } from '@/frontend/design-system/tokens/motion';

export function AccessibleComponent() {
  const reducedMotion = prefersReducedMotion();

  return (
    <motion.div
      animate={{ opacity: 1 }}
      transition={{
        duration: reducedMotion ? 0.01 : 0.3,
      }}
    >
      Content
    </motion.div>
  );
}
```

**Test on macOS**: System Preferences > Accessibility > Display > Reduce motion  
**Test on iOS**: Settings > Accessibility > Motion > Reduce Motion  
**Test on Android**: Settings > Accessibility > Remove animations

### Focus States

Every interactive element must have visible focus:

```tsx
<button className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
  Click me
</button>
```

**Focus ring should**:
- Be 2-3px visible stroke
- Use accent color (0072CC)
- Have 2px offset from element
- Work on all buttons, links, inputs

### Keyboard Navigation

Ensure smooth navigation with Tab key:
- List items should be selectable
- Modals should trap focus
- Escape key should close overlays

---

## Performance Optimization

### GPU-Accelerated Properties

Only animate these properties (they're GPU-optimized):
- `transform` (translate, scale, rotate)
- `opacity`

```tsx
// ✅ Good - GPU accelerated
<motion.div animate={{ x: 100, opacity: 0.5 }} />

// ❌ Avoid - CPU bound, janky
<motion.div animate={{ width: 100, left: 200 }} />
```

### Will-Change Hints

For continuous animations:

```tsx
<motion.div
  style={{ willChange: 'transform, opacity' }}
  animate={{ rotate: 360 }}
  transition={{ duration: 20, repeat: Infinity }}
>
  Spinning element
</motion.div>
```

### IntersectionObserver for Scroll Triggers

Always use `IntersectionObserver` (never `window.addEventListener('scroll')`):

```tsx
// ✅ Good - scroll-gated, performant
import { ScrollReveal } from '@/frontend/design-system/components';

// ❌ Bad - runs on every frame
window.addEventListener('scroll', () => {
  // animation code
});
```

---

## Common Patterns

### Landing Page Hero

```tsx
import { FadeIn, SlideUp, RevealText } from '@/frontend/design-system/components';

export function HeroSection() {
  return (
    <section className="py-20">
      <RevealText as="h1" className="text-6xl font-bold mb-6">
        Optimize vectors faster
      </RevealText>
      
      <SlideUp delay={0.2}>
        <p className="text-2xl text-gray-600 mb-8">
          Reduce file size by up to 80% while keeping visual quality
        </p>
      </SlideUp>

      <FadeIn delay={0.4}>
        <AnimatedButton variant="primary" size="lg">
          Start Free Trial
        </AnimatedButton>
      </FadeIn>
    </section>
  );
}
```

### Feature Card Grid

```tsx
import { Stagger, ScaleIn } from '@/frontend/design-system/components';

export function Features() {
  const features = [
    { title: 'Fast', description: 'Optimize in seconds' },
    { title: 'Smart', description: 'AI-powered enhancement' },
    { title: 'Reliable', description: '99.9% uptime' },
  ];

  return (
    <Stagger className="grid grid-cols-3 gap-6">
      {features.map((feature) => (
        <ScaleIn key={feature.title}>
          <div className="p-6 bg-white rounded-lg border">
            <h3 className="font-bold mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        </ScaleIn>
      ))}
    </Stagger>
  );
}
```

### File Upload Flow

```tsx
import { ModalTransition } from '@/frontend/design-system/components';
import { AnimatedButton } from '@/frontend/design-system/components';
import { useState } from 'react';

export function UploadFlow() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <AnimatedButton onClick={() => setShowModal(true)}>
        Upload File
      </AnimatedButton>

      <ModalTransition isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className="bg-white rounded-xl p-8 w-96">
          <h2 className="text-2xl font-bold mb-4">Upload Vector File</h2>
          <input type="file" accept=".svg,.ai,.eps" />
          <div className="flex gap-4 mt-6">
            <AnimatedButton variant="ghost" onClick={() => setShowModal(false)}>
              Cancel
            </AnimatedButton>
            <AnimatedButton variant="primary">
              Upload
            </AnimatedButton>
          </div>
        </div>
      </ModalTransition>
    </>
  );
}
```

---

## Testing Animations

### Unit Tests

```tsx
import { render, screen, waitFor } from '@testing-library/react';
import { FadeIn } from '@/frontend/design-system/components';

test('FadeIn animates on mount', async () => {
  render(<FadeIn><div>Content</div></FadeIn>);
  
  await waitFor(() => {
    expect(screen.getByText('Content')).toHaveStyle('opacity: 1');
  });
});
```

### Visual Tests

- Test on 60Hz and 120Hz displays
- Verify smooth motion without jank
- Check reduced-motion fallbacks
- Test on actual devices (not just browsers)

### Accessibility Tests

```bash
# Test for reduced motion support
defaults write NSGlobalDomain com.apple.motionReduction -int 1

# Test keyboard navigation
Tab, Shift+Tab, Enter, Escape

# Test screen readers
VoiceOver (Mac), NVDA (Windows), TalkBack (Android)
```

---

## Common Mistakes to Avoid

### ❌ Animating Layout Properties
```tsx
// BAD - causes repaints
animate={{ width: 200, height: 100 }}

// GOOD - use transform instead
animate={{ scaleX: 1.2, scaleY: 1.1 }}
```

### ❌ Forgetting Reduced Motion
```tsx
// BAD - no accessibility fallback
<motion.div animate={{ opacity: 1 }} />

// GOOD - respects preferences
<FadeIn>Content</FadeIn>
```

### ❌ Infinite Animations on Load
```tsx
// BAD - unnecessary movement
animate={{ rotate: 360 }}
transition={{ duration: 20, repeat: Infinity }}

// GOOD - only animate on hover or specific events
whileHover={{ rotate: 360 }}
```

### ❌ Using Browser Default Curves
```tsx
// BAD
transition={{ ease: 'ease-in-out' }}

// GOOD
transition={{ ease: 'cubic-bezier(0.22, 1, 0.36, 1)' }}
```

---

## Resources

- **Motion docs**: https://motion.dev
- **Vectorr design tokens**: `@/frontend/design-system/tokens`
- **Animation components**: `@/frontend/design-system/components`
- **e1genqq's principles**: Deterministic animation, seek(t) functions
- **ai-design-skills**: Landing page and conversion best practices

---

## Support

For questions or animation patterns not covered here:
1. Check the examples in `@/frontend/design-system/examples`
2. Review the component source code
3. Consult the Motion documentation
4. Test with `prefers-reduced-motion` enabled

**Remember**: Great animation is invisible. The user should feel the experience, not think about the mechanics.

/**
 * SVG animation service.
 *
 * Fully programmatic: no external API, no model inference. Takes SVG markup
 * and rewrites it in place, adding CSS keyframes and per-element classes so
 * the artwork animates inside a plain `<img>`-less inline SVG.
 *
 * Three quality tiers:
 *   - eco      (free)      — whole-artwork fade + gentle scale in
 *   - standard (0.25 cr)   — path draw-on, per-element staggered entrance,
 *                            hover emphasis, idle breathing
 *   - pro      (0.50 cr)   — everything in standard plus rotation, morph-ish
 *                            pulse, continuous float, and a parallax group
 */

export type AnimationTier = 'eco' | 'standard' | 'pro';

export interface AnimationOptions {
  /** Raw SVG markup. */
  svg: string;
  /** Quality tier. */
  tier: AnimationTier;
  /** Animation duration in seconds (1–10). */
  duration?: number;
  /** Whether the animation loops forever (pro/stagger layers always loop). */
  loop?: boolean;
  /** Whether to respect `prefers-reduced-motion`. Defaults to true. */
  respectReducedMotion?: boolean;
}

export interface AnimationResult {
  /** The animated SVG markup, ready to be written to a file. */
  animatedSvg: string;
  /** How many animatable elements were found. */
  elementCount: number;
  /** The tier that was applied. */
  tier: AnimationTier;
  /** Human-readable list of the effects that were applied. */
  effects: string[];
}

// ---------------------------------------------------------------------------
// SVG parsing helpers
// ---------------------------------------------------------------------------

const ANIMATABLE_TAGS = ['path', 'circle', 'ellipse', 'rect', 'line', 'polyline', 'polygon', 'text', 'g'];

/**
 * Extracts the opening tag of an element, e.g. `<path d="M0 0" fill="red" />`.
 * Returns null when the tag is self-closing or a closing tag.
 */
function getOpeningTag(segment: string): string | null {
  const match = segment.match(/^<([a-zA-Z][\w:-]*)((?:"[^"]*"|'[^']*'|[^>"'])*)\/?>/);
  if (!match) return null;
  return match[0];
}

/** Returns the attribute name of an opening tag, or undefined if absent. */
function hasAttribute(tag: string, name: string): boolean {
  return new RegExp(`\\s${name}\\s*=`).test(tag);
}

/** Sets (or replaces) an attribute on an opening tag. */
function setAttribute(tag: string, name: string, value: string): string {
  const re = new RegExp(`(\\s${name}\\s*=\\s*)("[^"]*"|'[^']*'|[^\\s>]+)`);
  if (re.test(tag)) {
    return tag.replace(re, `$1"${value}"`);
  }
  // Insert before the closing `>` or `/>`
  const closeIdx = tag.endsWith('/>') ? tag.length - 2 : tag.length - 1;
  return `${tag.slice(0, closeIdx)} ${name}="${value}"${tag.slice(closeIdx)}`;
}

/** Removes an attribute from an opening tag. */
function removeAttribute(tag: string, name: string): string {
  const re = new RegExp(`\\s${name}\\s*=\\s*("[^"]*"|'[^']*'|[^\\s>]+)`);
  return tag.replace(re, '');
}

/** Escapes a string for use inside a CSS selector. */
function cssEscape(value: string): string {
  return value.replace(/([^\w-])/g, '\\$1');
}

// ---------------------------------------------------------------------------
// CSS builders
// ---------------------------------------------------------------------------

function buildEcoCss(duration: number, loop: boolean): string {
  const iteration = loop ? 'infinite' : '1';
  return `
@keyframes vtFadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes vtScaleIn {
  from { opacity: 0; transform: scale(0.94); transform-origin: center; }
  to   { opacity: 1; transform: scale(1); transform-origin: center; }
}
.vt-root {
  animation: vtFadeIn ${duration}s ease-out ${iteration}, vtScaleIn ${duration}s ease-out ${iteration};
}`.trim();
}

function buildStandardCss(duration: number, loop: boolean): string {
  const iteration = loop ? 'infinite' : '1';
  const stagger = Math.max(0.08, duration / 12);
  return `
@keyframes vtFadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes vtScaleIn {
  from { opacity: 0; transform: scale(0.94); transform-origin: center; }
  to   { opacity: 1; transform: scale(1); transform-origin: center; }
}
@keyframes vtDraw {
  from { stroke-dashoffset: 1; }
  to   { stroke-dashoffset: 0; }
}
@keyframes vtBreathe {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-1.5px); }
}
.vt-root {
  animation: vtFadeIn ${duration}s ease-out ${iteration}, vtScaleIn ${duration}s ease-out ${iteration};
}
.vt-draw {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: vtDraw ${duration}s cubic-bezier(0.65, 0, 0.35, 1) forwards;
}
.vt-enter {
  opacity: 0;
  animation: vtFadeIn ${duration}s ease-out forwards, vtBreathe 4s ease-in-out ${duration}s infinite;
}
.vt-stagger-1 { animation-delay: ${(stagger * 1).toFixed(3)}s; }
.vt-stagger-2 { animation-delay: ${(stagger * 2).toFixed(3)}s; }
.vt-stagger-3 { animation-delay: ${(stagger * 3).toFixed(3)}s; }
.vt-stagger-4 { animation-delay: ${(stagger * 4).toFixed(3)}s; }
.vt-stagger-5 { animation-delay: ${(stagger * 5).toFixed(3)}s; }
.vt-stagger-6 { animation-delay: ${(stagger * 6).toFixed(3)}s; }
.vt-hoverable {
  transition: transform 0.25s ease, filter 0.25s ease;
  transform-box: fill-box;
  transform-origin: center;
}
.vt-hoverable:hover {
  transform: scale(1.04);
  filter: drop-shadow(0 2px 6px rgba(0,0,0,0.18));
}`.trim();
}

function buildProCss(duration: number, loop: boolean): string {
  const iteration = loop ? 'infinite' : '1';
  const stagger = Math.max(0.06, duration / 16);
  return `
@keyframes vtFadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes vtScaleIn {
  from { opacity: 0; transform: scale(0.9); transform-origin: center; }
  to   { opacity: 1; transform: scale(1); transform-origin: center; }
}
@keyframes vtDraw {
  from { stroke-dashoffset: 1; }
  to   { stroke-dashoffset: 0; }
}
@keyframes vtBreathe {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-2px); }
}
@keyframes vtPulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50%      { transform: scale(1.03); opacity: 0.92; }
}
@keyframes vtSpin {
  from { transform: rotate(0deg); transform-origin: center; }
  to   { transform: rotate(360deg); transform-origin: center; }
}
@keyframes vtFloat {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50%      { transform: translateY(-4px) rotate(1deg); }
}
.vt-root {
  animation: vtFadeIn ${duration}s ease-out ${iteration}, vtScaleIn ${duration}s ease-out ${iteration};
}
.vt-draw {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: vtDraw ${duration}s cubic-bezier(0.65, 0, 0.35, 1) forwards;
}
.vt-enter {
  opacity: 0;
  animation: vtFadeIn ${duration}s ease-out forwards, vtFloat 5s ease-in-out ${duration}s infinite;
}
.vt-pulse {
  transform-box: fill-box;
  transform-origin: center;
  animation: vtPulse 3.2s ease-in-out ${duration}s infinite;
}
.vt-spin {
  transform-box: fill-box;
  transform-origin: center;
  animation: vtSpin 12s linear ${duration}s infinite;
}
.vt-parallax {
  transform-box: fill-box;
  transform-origin: center;
  animation: vtBreathe 6s ease-in-out ${duration}s infinite;
}
.vt-stagger-1 { animation-delay: ${(stagger * 1).toFixed(3)}s; }
.vt-stagger-2 { animation-delay: ${(stagger * 2).toFixed(3)}s; }
.vt-stagger-3 { animation-delay: ${(stagger * 3).toFixed(3)}s; }
.vt-stagger-4 { animation-delay: ${(stagger * 4).toFixed(3)}s; }
.vt-stagger-5 { animation-delay: ${(stagger * 5).toFixed(3)}s; }
.vt-stagger-6 { animation-delay: ${(stagger * 6).toFixed(3)}s; }
.vt-stagger-7 { animation-delay: ${(stagger * 7).toFixed(3)}s; }
.vt-stagger-8 { animation-delay: ${(stagger * 8).toFixed(3)}s; }
.vt-hoverable {
  transition: transform 0.25s ease, filter 0.25s ease;
  transform-box: fill-box;
  transform-origin: center;
}
.vt-hoverable:hover {
  transform: scale(1.05);
  filter: drop-shadow(0 3px 10px rgba(0,0,0,0.22));
}`.trim();
}

// ---------------------------------------------------------------------------
// Element rewriting
// ---------------------------------------------------------------------------

interface RewriteResult {
  svg: string;
  elementCount: number;
}

/**
 * Adds `class` attributes to animatable elements and rewrites their opening
 * tags. Only the top-level document (no nested `<svg>` inside `<foreignObject>`)
 * is touched; we simply walk every opening tag in document order.
 */
function rewriteElements(svg: string, tier: AnimationTier): RewriteResult {
  let elementCount = 0;
  let index = 0;

  const result = svg.replace(
    /<([a-zA-Z][\w:-]*)((?:"[^"]*"|'[^']*'|[^>"'])*?)(\/?)>/g,
    (full, tagName: string, attrs: string, selfClosing: string) => {
      if (!ANIMATABLE_TAGS.includes(tagName.toLowerCase())) return full;
      // Skip elements inside <style>, <script>, <defs> is fine to animate though.
      elementCount += 1;
      index += 1;

      const classes: string[] = [];
      let opening = `<${tagName}${attrs}${selfClosing}`;

      if (tier === 'standard' || tier === 'pro') {
        if (tagName.toLowerCase() === 'path') {
          // pathLength="1" normalizes dash math without measuring the path.
          if (!hasAttribute(opening, 'pathLength')) {
            opening = setAttribute(opening, 'pathLength', '1');
          }
          classes.push('vt-draw');
        } else {
          classes.push('vt-enter');
          classes.push(`vt-stagger-${Math.min(index, tier === 'pro' ? 8 : 6)}`);
        }
        classes.push('vt-hoverable');
      }

      if (tier === 'pro') {
        if (tagName.toLowerCase() === 'g') {
          classes.push('vt-parallax');
        } else if (index % 5 === 0) {
          classes.push('vt-pulse');
        } else if (index % 7 === 0) {
          classes.push('vt-spin');
        }
      }

      if (classes.length > 0) {
        const existing = attrs.match(/\sclass\s*=\s*"([^"]*)"/);
        if (existing) {
          opening = opening.replace(
            /\sclass\s*=\s*"[^"]*"/,
            ` class="${existing[1]} ${classes.join(' ')}"`,
          );
        } else {
          opening = setAttribute(opening, 'class', classes.join(' '));
        }
      }

      return opening;
    },
  );

  return { svg: result, elementCount };
}

/**
 * Adds the animation stylesheet to the SVG. Injected as a `<style>` element
 * right after the opening `<svg>` tag so it applies without external CSS.
 */
function injectStyles(svg: string, css: string, respectReducedMotion: boolean): string {
  const styleBlock = `<style type="text/css">\n${css}\n${
    respectReducedMotion
      ? `@media (prefers-reduced-motion: reduce) {
  .vt-root, .vt-enter, .vt-draw, .vt-pulse, .vt-spin, .vt-parallax {
    animation: none !important;
    opacity: 1 !important;
    stroke-dashoffset: 0 !important;
    transform: none !important;
  }
}`
      : ''
  }\n</style>`;

  const svgTagMatch = svg.match(/<svg\b[^>]*>/i);
  if (!svgTagMatch) return svg;
  const insertAt = svgTagMatch.index! + svgTagMatch[0].length;
  return svg.slice(0, insertAt) + `\n${styleBlock}\n` + svg.slice(insertAt);
}

/** Adds the `vt-root` class to the root `<svg>` element. */
function markRoot(svg: string): string {
  const svgTagMatch = svg.match(/<svg\b[^>]*>/i);
  if (!svgTagMatch) return svg;
  const tag = svgTagMatch[0];
  const existing = tag.match(/\sclass\s*=\s*"([^"]*)"/);
  let updated: string;
  if (existing) {
    updated = tag.replace(/\sclass\s*=\s*"[^"]*"/, ` class="${existing[1]} vt-root"`);
  } else {
    updated = setAttribute(tag, 'class', 'vt-root');
  }
  return svg.slice(0, svgTagMatch.index!) + updated + svg.slice(svgTagMatch.index! + tag.length);
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export function animateSvg(options: AnimationOptions): AnimationResult {
  const {
    svg,
    tier,
    duration = 2,
    loop = false,
    respectReducedMotion = true,
  } = options;

  const clampedDuration = Math.min(10, Math.max(1, duration));

  const effects: string[] = [];
  let output = svg;

  switch (tier) {
    case 'standard':
      effects.push('Fade + scale entrance');
      effects.push('Path draw-on (stroke reveal)');
      effects.push('Staggered element entrance');
      effects.push('Hover emphasis');
      break;
    case 'pro':
      effects.push('Fade + scale entrance');
      effects.push('Path draw-on (stroke reveal)');
      effects.push('Staggered element entrance');
      effects.push('Hover emphasis');
      effects.push('Breathing pulse');
      effects.push('Slow rotation');
      effects.push('Parallax float');
      break;
    case 'eco':
    default:
      effects.push('Fade + scale entrance');
      break;
  }

  const css =
    tier === 'eco'
      ? buildEcoCss(clampedDuration, loop)
      : tier === 'standard'
        ? buildStandardCss(clampedDuration, loop)
        : buildProCss(clampedDuration, loop);

  const { svg: rewritten, elementCount } = rewriteElements(output, tier);
  output = rewritten;
  output = markRoot(output);
  output = injectStyles(output, css, respectReducedMotion);

  // Ensure the SVG declares its own namespace when absent (inline rendering).
  output = output.replace(/<svg\b(?![^>]*\bxmlns\s*=)/i, '<svg xmlns="http://www.w3.org/2000/svg"');

  return { animatedSvg: output, elementCount, tier, effects };
}

/**
 * Cheap validation used by the API route before animating user-supplied SVG.
 */
export function validateSvg(svg: string): { valid: boolean; error?: string } {
  const trimmed = svg.trim();
  if (!trimmed) return { valid: false, error: 'SVG content is empty' };
  if (!/<svg\b/i.test(trimmed)) return { valid: false, error: 'Content does not contain an <svg> element' };
  if (!/<\/svg\s*>/i.test(trimmed)) return { valid: false, error: 'SVG is missing its closing </svg> tag' };
  if (/<script\b/i.test(trimmed)) return { valid: false, error: 'SVG contains a <script> element' };
  if (/<foreignObject\b/i.test(trimmed)) return { valid: false, error: 'SVG contains a <foreignObject> element' };
  if (/on[a-z]+\s*=/i.test(trimmed)) return { valid: false, error: 'SVG contains inline event handlers' };
  if (/javascript:/i.test(trimmed)) return { valid: false, error: 'SVG contains a javascript: URL' };
  return { valid: true };
}

/** Convenience helper used by the brand identity generator. */
export function extractViewBox(svg: string): string | undefined {
  const match = svg.match(/viewBox\s*=\s*"([^"]+)"/i);
  return match ? match[1] : undefined;
}

export { removeAttribute, cssEscape };

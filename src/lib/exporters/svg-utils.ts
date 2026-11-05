import { XMLParser } from 'fast-xml-parser';
import { makeAbsolute, parseSVG } from 'svg-path-parser';

export interface Point { x: number; y: number }

/** A filled region of paint, already flattened to a polyline in user units. */
export interface SvgShape {
  points: Point[];
  closed: boolean;
  /** CSS colour, e.g. `#e04030`. Gradients resolve to their mid stop. */
  fill: string;
  /** 0–1. `fill="none"` paints nothing and is dropped. */
  opacity: number;
}

export interface Paint {
  color: string;
  opacity: number;
}

const xml = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '', allowBooleanAttributes: true });

export function getSvg(svg: string) {
  const root = xml.parse(svg)?.svg;
  if (!root || typeof root !== 'object') throw new Error('Invalid SVG content');
  return root as Record<string, unknown>;
}

function list(value: unknown): Record<string, unknown>[] {
  if (value === undefined) return [];
  return (Array.isArray(value) ? value : [value]).filter((item): item is Record<string, unknown> => !!item && typeof item === 'object');
}

function numeric(value: unknown, fallback = 0): number {
  const result = Number.parseFloat(String(value ?? ''));
  return Number.isFinite(result) ? result : fallback;
}

/**
 * Dimensions in the SVG's own user units.
 *
 * `width`/`height` on the root are frequently a rendering hint (VectoSolve-style
 * tracers emit `width="452"` next to `viewBox="0 0 1365 2048"`), so the viewBox
 * wins whenever it is present: geometry is expressed in viewBox units, and a
 * physical size computed from the root attributes would rescale the artwork.
 */
export function getDimensions(svg: string, options?: { width?: number; height?: number }) {
  const root = getSvg(svg);
  const viewBox = String(root.viewBox ?? root.viewbox ?? '').trim().split(/[\s,]+/).map(Number);
  const hasViewBox = viewBox.length === 4 && viewBox.every((n) => Number.isFinite(n));

  const width = options?.width ?? (hasViewBox ? viewBox[2] : numeric(root.width, 1000));
  const height = options?.height ?? (hasViewBox ? viewBox[3] : numeric(root.height, 1000));

  return {
    width,
    height,
    minX: hasViewBox ? viewBox[0] : 0,
    minY: hasViewBox ? viewBox[1] : 0,
  };
}

// ---------------------------------------------------------------------------
// Transform / paint parsing
// ---------------------------------------------------------------------------

export function parseTranslate(value: unknown): Point {
  const match = String(value ?? '').match(/translate\(\s*([-\d.]+)[\s,]*([-\d.]+)?\s*\)/);
  if (!match) return { x: 0, y: 0 };
  return { x: Number.parseFloat(match[1]) || 0, y: Number.parseFloat(match[2] ?? '0') || 0 };
}

const NAMED_COLORS: Record<string, string> = {
  black: '#000000', white: '#ffffff', red: '#ff0000', green: '#008000', blue: '#0000ff',
  yellow: '#ffff00', cyan: '#00ffff', magenta: '#ff00ff', gray: '#808080', grey: '#808080',
  silver: '#c0c0c0', maroon: '#800000', olive: '#808000', lime: '#00ff00', aqua: '#00ffff',
  teal: '#008080', navy: '#000080', fuchsia: '#ff00ff', purple: '#800080', orange: '#ffa500',
};

/** Normalises anything a `fill` can hold into a 6-digit hex colour. */
export function normalizeColor(raw: string, fallback = '#000000'): string {
  const value = raw.trim().toLowerCase();
  if (!value || value === 'none' || value === 'transparent') return 'none';
  if (value.startsWith('#')) {
    const hex = value.slice(1);
    if (hex.length === 3) return `#${hex.split('').map((c) => c + c).join('')}`;
    if (hex.length === 6) return `#${hex}`;
    if (hex.length === 8) return `#${hex.slice(0, 6)}`;
    return fallback;
  }
  const rgb = value.match(/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/);
  if (rgb) {
    const toHex = (n: string) => Math.max(0, Math.min(255, Math.round(Number.parseFloat(n)))).toString(16).padStart(2, '0');
    return `#${toHex(rgb[1])}${toHex(rgb[2])}${toHex(rgb[3])}`;
  }
  return NAMED_COLORS[value] ?? fallback;
}

/** Resolves `<linearGradient>`/`<radialGradient>` references to their middle stop. */
function gradientStops(root: Record<string, unknown>): Map<string, Paint> {
  const stops = new Map<string, Paint>();
  const containers = [root, ...list(root.defs)];
  const gradients = containers.flatMap((node) => [
    ...list(node.linearGradient),
    ...list(node.radialGradient),
  ]);

  for (const gradient of gradients) {
    const id = String(gradient.id ?? '');
    if (!id) continue;
    const children = list(gradient.stop);
    if (children.length === 0) continue;

    const middle = children[Math.floor(children.length / 2)];
    const color = normalizeColor(String(middle['stop-color'] ?? middle.stopColor ?? '#000000'));
    const opacity = numeric(middle['stop-opacity'] ?? middle.stopOpacity, 1);
    stops.set(id, { color, opacity });
  }

  return stops;
}

// ---------------------------------------------------------------------------
// Path flattening
// ---------------------------------------------------------------------------

type Command = Record<string, unknown> & { code: string };

/** Elliptical arc → cubic segments, per the SVG 1.1 implementation notes (F.6.5). */
function arcToCubics(
  from: Point,
  to: Point,
  rxIn: number,
  ryIn: number,
  rotationDeg: number,
  largeArc: boolean,
  sweep: boolean,
): Array<[Point, Point, Point]> {
  let rx = Math.abs(rxIn);
  let ry = Math.abs(ryIn);
  if (rx === 0 || ry === 0) return [[to, to, to]];

  const phi = (rotationDeg * Math.PI) / 180;
  const cosPhi = Math.cos(phi);
  const sinPhi = Math.sin(phi);

  const dx2 = (from.x - to.x) / 2;
  const dy2 = (from.y - to.y) / 2;
  const x1p = cosPhi * dx2 + sinPhi * dy2;
  const y1p = -sinPhi * dx2 + cosPhi * dy2;

  // Scale up radii that are too small to span the endpoints.
  const lambda = (x1p * x1p) / (rx * rx) + (y1p * y1p) / (ry * ry);
  if (lambda > 1) {
    const scale = Math.sqrt(lambda);
    rx *= scale;
    ry *= scale;
  }

  const sign = largeArc === sweep ? -1 : 1;
  const numerator = rx * rx * ry * ry - rx * rx * y1p * y1p - ry * ry * x1p * x1p;
  const denominator = rx * rx * y1p * y1p + ry * ry * x1p * x1p;
  const coefficient = sign * Math.sqrt(Math.max(0, numerator / denominator));

  const cxp = (coefficient * rx * y1p) / ry;
  const cyp = (-coefficient * ry * x1p) / rx;
  const cx = cosPhi * cxp - sinPhi * cyp + (from.x + to.x) / 2;
  const cy = sinPhi * cxp + cosPhi * cyp + (from.y + to.y) / 2;

  const angleOf = (ux: number, uy: number, vx: number, vy: number) => {
    const dot = ux * vx + uy * vy;
    const len = Math.hypot(ux, uy) * Math.hypot(vx, vy);
    const angle = Math.acos(Math.max(-1, Math.min(1, dot / (len || 1))));
    return ux * vy - uy * vx < 0 ? -angle : angle;
  };

  const theta1 = angleOf(1, 0, (x1p - cxp) / rx, (y1p - cyp) / ry);
  let delta = angleOf(
    (x1p - cxp) / rx,
    (y1p - cyp) / ry,
    (-x1p - cxp) / rx,
    (-y1p - cyp) / ry,
  );
  if (!sweep && delta > 0) delta -= 2 * Math.PI;
  if (sweep && delta < 0) delta += 2 * Math.PI;

  const segments = Math.max(1, Math.ceil(Math.abs(delta) / (Math.PI / 2)));
  const step = delta / segments;
  const alpha = (4 / 3) * Math.tan(step / 4);

  const toUser = (x: number, y: number): Point => ({
    x: cosPhi * x - sinPhi * y + cx,
    y: sinPhi * x + cosPhi * y + cy,
  });

  const result: Array<[Point, Point, Point]> = [];
  let theta = theta1;
  for (let index = 0; index < segments; index++) {
    const next = theta + step;
    const cos1 = Math.cos(theta), sin1 = Math.sin(theta);
    const cos2 = Math.cos(next), sin2 = Math.sin(next);

    // Control points only; the end point is `to` on the final segment, which
    // guarantees the arc lands exactly on the commanded coordinate.
    const c1 = toUser(rx * (cos1 - alpha * sin1), ry * (sin1 + alpha * cos1));
    const c2 = toUser(rx * (cos2 + alpha * sin2), ry * (sin2 - alpha * cos2));
    const end = index === segments - 1 ? to : toUser(rx * cos2, ry * sin2);

    result.push([c1, c2, end]);
    theta = next;
  }

  return result;
}

const EPSILON = 0.01;

/**
 * Flattens one `<path d>` into polylines, one per subpath.
 *
 * Traced artwork is enormous (a photo trace produced 2 634 subpaths and ~20 000
 * cubic beziers), so vertices are deduplicated per subpath and the curve
 * resolution is derived from `tolerance` rather than fixed.
 */
export function flattenPath(d: string, tolerance = 2): Point[][] {
  let absolute: Command[];
  try {
    absolute = makeAbsolute(parseSVG(d)) as unknown as Command[];
  } catch (error) {
    throw new Error(
      `Could not parse SVG path data: ${error instanceof Error ? error.message : 'unknown error'}`,
    );
  }

  const subpaths: Point[][] = [];
  let current: Point = { x: 0, y: 0 };
  let start: Point = current;
  let points: Point[] | null = null;

  const ensure = (): Point[] => {
    if (!points) {
      points = [];
      subpaths.push(points);
    }
    return points;
  };

  const add = (point: Point) => {
    const target = ensure();
    const last = target[target.length - 1];
    if (!last || Math.hypot(point.x - last.x, point.y - last.y) > EPSILON) target.push(point);
  };

  const curveSteps = (length: number) =>
    Math.max(2, Math.min(48, Math.ceil(length / Math.max(tolerance, 0.5))));

  for (const command of absolute) {
    const x = numeric(command.x);
    const y = numeric(command.y);

    switch (command.code) {
      case 'M': {
        current = { x, y };
        start = current;
        points = null;
        add(current);
        break;
      }
      case 'L': {
        add({ x, y });
        current = { x, y };
        break;
      }
      case 'H': {
        add({ x, y: current.y });
        current = { x, y: current.y };
        break;
      }
      case 'V': {
        add({ x: current.x, y });
        current = { x: current.x, y };
        break;
      }
      case 'C': {
        const origin = current;
        const p1 = { x: numeric(command.x1), y: numeric(command.y1) };
        const p2 = { x: numeric(command.x2), y: numeric(command.y2) };
        const end = { x, y };
        const length =
          Math.hypot(p1.x - origin.x, p1.y - origin.y) +
          Math.hypot(p2.x - p1.x, p2.y - p1.y) +
          Math.hypot(end.x - p2.x, end.y - p2.y);
        const steps = curveSteps(length);
        for (let index = 1; index <= steps; index++) {
          const t = index / steps;
          const u = 1 - t;
          add({
            x: u * u * u * origin.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * end.x,
            y: u * u * u * origin.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * end.y,
          });
        }
        current = end;
        break;
      }
      case 'Q': {
        const origin = current;
        const p1 = { x: numeric(command.x1), y: numeric(command.y1) };
        const end = { x, y };
        const length =
          Math.hypot(p1.x - origin.x, p1.y - origin.y) + Math.hypot(end.x - p1.x, end.y - p1.y);
        const steps = curveSteps(length);
        for (let index = 1; index <= steps; index++) {
          const t = index / steps;
          const u = 1 - t;
          add({
            x: u * u * origin.x + 2 * u * t * p1.x + t * t * end.x,
            y: u * u * origin.y + 2 * u * t * p1.y + t * t * end.y,
          });
        }
        current = end;
        break;
      }
      case 'A': {
        const origin = current;
        const end = { x, y };
        const rx = numeric(command.rx);
        const ry = numeric(command.ry);
        const rotation = numeric(command.xAxisRotation);
        const largeArc = command.largeArc === 1 || command.largeArc === true;
        const sweep = command.sweep === 1 || command.sweep === true;

        for (const [c1, c2, point] of arcToCubics(origin, end, rx, ry, rotation, largeArc, sweep)) {
          const length =
            Math.hypot(c1.x - origin.x, c1.y - origin.y) +
            Math.hypot(c2.x - c1.x, c2.y - c1.y) +
            Math.hypot(point.x - c2.x, point.y - c2.y);
          const steps = curveSteps(length);
          for (let index = 1; index <= steps; index++) {
            const t = index / steps;
            const u = 1 - t;
            add({
              x: u * u * u * origin.x + 3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t * t * t * point.x,
              y: u * u * u * origin.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t * t * t * point.y,
            });
          }
        }
        current = end;
        break;
      }
      case 'Z': {
        // A closed subpath implicitly returns to its start; exporters append that
        // point themselves so it is not duplicated here.
        current = start;
        points = null;
        break;
      }
      default:
        throw new Error(`SVG path command ${command.code} is not supported by this exporter`);
    }
  }

  return subpaths.filter((subpath) => subpath.length > 1);
}

// ---------------------------------------------------------------------------
// Element walking
// ---------------------------------------------------------------------------

/** Which subpaths of each `<path>` close their outline (a `Z` was seen). */
function closedSubpaths(d: string): boolean[] {
  const flags: boolean[] = [];
  for (const command of makeAbsolute(parseSVG(d)) as unknown as Command[]) {
    if (command.code === 'M') flags.push(false);
    if (command.code === 'Z' && flags.length > 0) flags[flags.length - 1] = true;
  }
  return flags;
}

/**
 * Extracts every painted region from the SVG.
 *
 * Contrast with a stroke-only "outline" reading: traced artwork paints regions
 * with `fill`, so a DXF/EPS that emits bare strokes loses the picture. Each
 * subpath becomes one shape carrying its fill colour, so a filled polyline
 * export (HATCH in DXF, `fill` in PostScript) reproduces the trace.
 *
 * `fill="none"`, `opacity="0"` and shapes with fewer than 2 points are dropped;
 * they would paint nothing.
 */
export function extractShapes(svg: string, tolerance = 2): SvgShape[] {
  const root = getSvg(svg);
  const gradients = gradientStops(root);
  const shapes: SvgShape[] = [];

  const resolvePaint = (node: Record<string, unknown>, inherited: Paint): Paint => {
    const rawFill = node.fill !== undefined ? String(node.fill) : undefined;
    let color = inherited.color;
    let opacity = inherited.opacity;

    if (rawFill !== undefined) {
      if (rawFill.startsWith('url(')) {
        const id = rawFill.slice(rawFill.indexOf('#') + 1, rawFill.lastIndexOf(')'));
        const stop = gradients.get(id);
        color = stop?.color ?? inherited.color;
        opacity = stop?.opacity ?? inherited.opacity;
      } else {
        color = normalizeColor(rawFill, inherited.color);
      }
    }

    // `style` wins over the presentation attributes.
    const style = String(node.style ?? '');
    const styleFill = style.match(/(?:^|;)\s*fill\s*:\s*([^;]+)/);
    if (styleFill) {
      const value = styleFill[1].trim();
      if (value.startsWith('url(')) {
        const id = value.slice(value.indexOf('#') + 1, value.lastIndexOf(')'));
        const stop = gradients.get(id);
        color = stop?.color ?? inherited.color;
      } else {
        color = normalizeColor(value, inherited.color);
      }
    }
    const styleOpacity = style.match(/(?:^|;)\s*(?:fill-)?opacity\s*:\s*([\d.]+)/);
    if (styleOpacity) opacity = Number.parseFloat(styleOpacity[1]) * opacity;

    if (node['fill-opacity'] !== undefined) {
      opacity = numeric(node['fill-opacity'], 1) * opacity;
    }
    if (node.opacity !== undefined) {
      opacity = numeric(node.opacity, 1) * opacity;
    }

    return { color, opacity };
  };

  const visit = (node: Record<string, unknown>, inheritedPaint: Paint) => {
    const paint = resolvePaint(node, inheritedPaint);
    const offset = parseTranslate(node.transform);

    const translated = (points: Point[]) =>
      offset.x === 0 && offset.y === 0
        ? points
        : points.map((point) => ({ x: point.x + offset.x, y: point.y + offset.y }));

    for (const path of list(node.path)) {
      const d = String(path.d ?? '');
      if (!d) continue;

      const pathPaint = resolvePaint(path, paint);
      if (pathPaint.color === 'none' || pathPaint.opacity <= 0) continue;

      const subpaths = flattenPath(d, tolerance);
      const closed = closedSubpaths(d);

      subpaths.forEach((points, index) => {
        if (points.length < 2) return;
        shapes.push({
          points: translated(points),
          closed: closed[index] ?? false,
          fill: pathPaint.color,
          opacity: pathPaint.opacity,
        });
      });
    }

    // Polygons/polylines/rects appear in hand-written SVGs even if current
    // tracers emit only paths.
    for (const polygon of list(node.polygon)) {
      const raw = String(polygon.points ?? '');
      const numbers = raw.split(/[\s,]+/).map(Number).filter(Number.isFinite);
      const points: Point[] = [];
      for (let index = 0; index + 1 < numbers.length; index += 2) {
        points.push({ x: numbers[index], y: numbers[index + 1] });
      }
      const shapePaint = resolvePaint(polygon, paint);
      if (points.length > 1 && shapePaint.color !== 'none' && shapePaint.opacity > 0) {
        shapes.push({ points: translated(points), closed: true, fill: shapePaint.color, opacity: shapePaint.opacity });
      }
    }

    for (const group of [...list(node.g), ...list(node.svg)]) visit(group, paint);
  };

  visit(root, { color: '#000000', opacity: 1 });
  return shapes;
}

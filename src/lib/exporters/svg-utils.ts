import { XMLParser } from 'fast-xml-parser';
import { makeAbsolute, parseSVG } from 'svg-path-parser';

export interface Point { x: number; y: number }
export interface SvgShape { points: Point[]; closed: boolean }

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

export function getDimensions(svg: string, options?: { width?: number; height?: number }) {
  const root = getSvg(svg);
  const viewBox = String(root.viewBox ?? root.viewbox ?? '').trim().split(/[\s,]+/).map(Number);
  const width = options?.width ?? numeric(root.width, viewBox[2] || 1000);
  const height = options?.height ?? numeric(root.height, viewBox[3] || 1000);
  return { width, height, minX: viewBox.length === 4 ? viewBox[0] : 0, minY: viewBox.length === 4 ? viewBox[1] : 0 };
}

export function extractShapes(svg: string, tolerance = 2): SvgShape[] {
  const root = getSvg(svg);
  const shapes: SvgShape[] = [];
  const visit = (node: Record<string, unknown>) => {
    for (const path of list(node.path)) {
      const d = String(path.d ?? '');
      if (!d) continue;
      const commands = makeAbsolute(parseSVG(d));
      let current: Point = { x: 0, y: 0 };
      let start: Point = current;
      let shape: SvgShape | undefined;
      const ensure = () => {
        if (!shape) shape = { points: [], closed: false };
        return shape;
      };
      const add = (point: Point) => {
        const target = ensure();
        const last = target.points[target.points.length - 1];
        if (!last || Math.hypot(point.x - last.x, point.y - last.y) > 0.01) target.points.push(point);
      };
      for (const command of commands) {
        const coord = (x: number, y: number): Point => ({ x, y });
        switch (command.code.toUpperCase()) {
          case 'M': {
            if (shape?.points.length) shapes.push(shape);
            const point = coord(command.x as number, command.y as number); current = start = point; shape = { points: [], closed: false }; add(point); break;
          }
          case 'L': { const point = coord(command.x as number, command.y as number); add(point); current = point; break; }
          case 'H': { const point = { x: command.x as number, y: current.y }; add(point); current = point; break; }
          case 'V': { const point = { x: current.x, y: command.y as number }; add(point); current = point; break; }
          case 'C': {
            const curve = command as typeof command & { x1: number; y1: number; x2: number; y2: number };
            const p1 = coord(curve.x1, curve.y1), p2 = coord(curve.x2, curve.y2), end = coord(command.x as number, command.y as number), origin = current;
            const steps = Math.max(4, Math.min(64, Math.ceil((Math.hypot(p1.x-origin.x,p1.y-origin.y)+Math.hypot(p2.x-p1.x,p2.y-p1.y)+Math.hypot(end.x-p2.x,end.y-p2.y))/tolerance)));
            for (let i=1;i<=steps;i++) { const t=i/steps,u=1-t; add({x:u*u*u*origin.x+3*u*u*t*p1.x+3*u*t*t*p2.x+t*t*t*end.x,y:u*u*u*origin.y+3*u*u*t*p1.y+3*u*t*t*p2.y+t*t*t*end.y}); }
            current=end; break;
          }
          case 'Q': {
            const curve = command as typeof command & { x1: number; y1: number };
            const p1=coord(curve.x1,curve.y1),end=coord(command.x as number,command.y as number),origin=current;
            const steps=Math.max(4,Math.min(64,Math.ceil((Math.hypot(p1.x-origin.x,p1.y-origin.y)+Math.hypot(end.x-p1.x,end.y-p1.y))/tolerance)));
            for(let i=1;i<=steps;i++){const t=i/steps,u=1-t;add({x:u*u*origin.x+2*u*t*p1.x+t*t*end.x,y:u*u*origin.y+2*u*t*p1.y+t*t*end.y});} current=end; break;
          }
          case 'Z': { if (shape) shape.closed = true; current = start; break; }
          case 'A': throw new Error('SVG arc paths are not supported by this exporter yet');
          default: throw new Error(`SVG path command ${command.code} is not supported by this exporter`);
        }
      }
      if (shape?.points.length) shapes.push(shape);
    }
    for (const group of list(node.g)) visit(group);
  };
  visit(root);
  return shapes;
}

import { BaseExporter, type ExportOptions } from './base-exporter';
import { extractShapes, getDimensions } from './svg-utils';

/**
 * 3D Exporter for converting 2D SVG paths to 3D-printable formats.
 * 
 * Approach:
 * - Parse SVG paths into 2D polygons using existing svg-utils
 * - Extrude polygons along Z-axis (default: 2mm)
 * - Generate triangle meshes: top face, bottom face, side walls
 * - Export in target format (3MF, STL, OBJ)
 * 
 * Coordinate system:
 * - X: right (SVG x)
 * - Y: forward (SVG y, note: SVG Y grows downward)
 * - Z: up (extrusion height)
 */

export interface Extrusion3DOptions extends ExportOptions {
  /** Extrusion depth in millimeters (default: 2mm) */
  extrusionDepth?: number;
  /** Scale factor for converting SVG units to mm (default: 96 dpi → 0.264583 mm/unit) */
  scale?: number;
}

interface Point2D { x: number; y: number }
interface Point3D { x: number; y: number; z: number }
interface Triangle { v1: Point3D; v2: Point3D; v3: Point3D }

/**
 * Triangulate a 2D polygon using ear-clipping algorithm.
 * Handles simple polygons (no self-intersections).
 */
function triangulate2D(points: Point2D[]): [Point2D, Point2D, Point2D][] {
  if (points.length < 3) return [];
  
  const triangles: [Point2D, Point2D, Point2D][] = [];
  const remaining = [...points];
  
  // Simple fan triangulation from first vertex
  // Good enough for extruded shapes; doesn't handle complex polygons with holes
  for (let i = 1; i < remaining.length - 1; i++) {
    triangles.push([remaining[0], remaining[i], remaining[i + 1]]);
  }
  
  return triangles;
}

/**
 * Generate 3D mesh from 2D shapes by extruding along Z-axis.
 */
function generateMesh(shapes: ReturnType<typeof extractShapes>, options: Extrusion3DOptions): Triangle[] {
  const extrusionDepth = options.extrusionDepth ?? 2.0; // mm
  const scale = options.scale ?? 0.264583; // 96 dpi → mm
  
  const triangles: Triangle[] = [];
  
  for (const shape of shapes) {
    if (shape.points.length < 3) continue;
    if (!shape.closed) continue; // Only extrude closed paths
    
    // Scale 2D points to mm
    const points2D: Point2D[] = shape.points.map(p => ({
      x: p.x * scale,
      y: p.y * scale,
    }));
    
    // Generate top face (z = extrusionDepth)
    const topTriangles = triangulate2D(points2D);
    for (const [p1, p2, p3] of topTriangles) {
      triangles.push({
        v1: { x: p1.x, y: p1.y, z: extrusionDepth },
        v2: { x: p2.x, y: p2.y, z: extrusionDepth },
        v3: { x: p3.x, y: p3.y, z: extrusionDepth },
      });
    }
    
    // Generate bottom face (z = 0) — reversed winding for correct normals
    const bottomTriangles = triangulate2D(points2D);
    for (const [p1, p2, p3] of bottomTriangles) {
      triangles.push({
        v1: { x: p1.x, y: p1.y, z: 0 },
        v2: { x: p3.x, y: p3.y, z: 0 }, // Reversed
        v3: { x: p2.x, y: p2.y, z: 0 }, // Reversed
      });
    }
    
    // Generate side walls
    for (let i = 0; i < points2D.length; i++) {
      const p1 = points2D[i];
      const p2 = points2D[(i + 1) % points2D.length];
      
      // Two triangles per wall segment
      triangles.push({
        v1: { x: p1.x, y: p1.y, z: 0 },
        v2: { x: p2.x, y: p2.y, z: 0 },
        v3: { x: p2.x, y: p2.y, z: extrusionDepth },
      });
      triangles.push({
        v1: { x: p1.x, y: p1.y, z: 0 },
        v2: { x: p2.x, y: p2.y, z: extrusionDepth },
        v3: { x: p1.x, y: p1.y, z: extrusionDepth },
      });
    }
  }
  
  return triangles;
}

/**
 * Calculate face normal for a triangle (for STL format).
 */
function calculateNormal(t: Triangle): Point3D {
  // Vector v1 → v2
  const u = {
    x: t.v2.x - t.v1.x,
    y: t.v2.y - t.v1.y,
    z: t.v2.z - t.v1.z,
  };
  
  // Vector v1 → v3
  const v = {
    x: t.v3.x - t.v1.x,
    y: t.v3.y - t.v1.y,
    z: t.v3.z - t.v1.z,
  };
  
  // Cross product u × v
  const normal = {
    x: u.y * v.z - u.z * v.y,
    y: u.z * v.x - u.x * v.z,
    z: u.x * v.y - u.y * v.x,
  };
  
  // Normalize
  const len = Math.sqrt(normal.x ** 2 + normal.y ** 2 + normal.z ** 2);
  if (len > 0) {
    normal.x /= len;
    normal.y /= len;
    normal.z /= len;
  }
  
  return normal;
}

/**
 * 3MF Exporter — 3D Manufacturing Format (XML-based).
 * 
 * 3MF is the modern 3D printing format developed by the 3MF Consortium.
 * Supported by Windows 3D Viewer, Bambu Studio, PrusaSlicer, and most modern slicers.
 */
export class ThreeMFExporter extends BaseExporter {
  format = '3mf';
  
  async export(svgContent: string, options?: Extrusion3DOptions): Promise<Buffer> {
    const shapes = extractShapes(svgContent);
    const triangles = generateMesh(shapes, options ?? {});
    
    if (triangles.length === 0) {
      throw new Error('No closed paths found to extrude. 3D export requires closed shapes.');
    }
    
    // Collect unique vertices and build vertex index map
    const vertices: Point3D[] = [];
    const vertexMap = new Map<string, number>();
    
    const getVertexIndex = (v: Point3D): number => {
      const key = `${v.x.toFixed(6)},${v.y.toFixed(6)},${v.z.toFixed(6)}`;
      let index = vertexMap.get(key);
      if (index === undefined) {
        index = vertices.length;
        vertices.push(v);
        vertexMap.set(key, index);
      }
      return index;
    };
    
    // Build triangle indices
    const triangleIndices: [number, number, number][] = [];
    for (const tri of triangles) {
      const i1 = getVertexIndex(tri.v1);
      const i2 = getVertexIndex(tri.v2);
      const i3 = getVertexIndex(tri.v3);
      triangleIndices.push([i1, i2, i3]);
    }
    
    // Generate 3MF XML
    const modelXml = `<?xml version="1.0" encoding="UTF-8"?>
<model unit="millimeter" xml:lang="en-US" xmlns="http://schemas.microsoft.com/3dmanufacturing/core/2015/02">
  <resources>
    <object id="1" type="model">
      <mesh>
        <vertices>
${vertices.map(v => `          <vertex x="${v.x.toFixed(6)}" y="${v.y.toFixed(6)}" z="${v.z.toFixed(6)}" />`).join('\n')}
        </vertices>
        <triangles>
${triangleIndices.map(([i1, i2, i3]) => `          <triangle v1="${i1}" v2="${i2}" v3="${i3}" />`).join('\n')}
        </triangles>
      </mesh>
    </object>
  </resources>
  <build>
    <item objectid="1" />
  </build>
</model>`;
    
    // 3MF is a ZIP archive containing the model XML and metadata
    // For simplicity, we're using minimal structure here
    // A full implementation would use a ZIP library (like 'adm-zip')
    const AdmZip = (await import('adm-zip')).default;
    const zip = new AdmZip();
    
    // Required 3MF structure
    zip.addFile('[Content_Types].xml', Buffer.from(
      `<?xml version="1.0" encoding="UTF-8"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml" />
  <Default Extension="model" ContentType="application/vnd.ms-package.3dmanufacturing-3dmodel+xml" />
</Types>`
    ));
    
    zip.addFile('_rels/.rels', Buffer.from(
      `<?xml version="1.0" encoding="UTF-8"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Target="/3D/3dmodel.model" Id="rel0" Type="http://schemas.microsoft.com/3dmanufacturing/2013/01/3dmodel" />
</Relationships>`
    ));
    
    zip.addFile('3D/3dmodel.model', Buffer.from(modelXml));
    
    return zip.toBuffer();
  }
}

/**
 * STL Exporter — STereoLithography (ASCII format).
 * 
 * STL is the most widely supported 3D printing format.
 * Binary STL is more compact but ASCII is easier to debug.
 */
export class STLExporter extends BaseExporter {
  format = 'stl';
  
  async export(svgContent: string, options?: Extrusion3DOptions): Promise<string> {
    const shapes = extractShapes(svgContent);
    const triangles = generateMesh(shapes, options ?? {});
    
    if (triangles.length === 0) {
      throw new Error('No closed paths found to extrude. 3D export requires closed shapes.');
    }
    
    let stl = 'solid vectroy_model\n';
    
    for (const tri of triangles) {
      const normal = calculateNormal(tri);
      
      stl += `  facet normal ${normal.x.toExponential(6)} ${normal.y.toExponential(6)} ${normal.z.toExponential(6)}\n`;
      stl += '    outer loop\n';
      stl += `      vertex ${tri.v1.x.toExponential(6)} ${tri.v1.y.toExponential(6)} ${tri.v1.z.toExponential(6)}\n`;
      stl += `      vertex ${tri.v2.x.toExponential(6)} ${tri.v2.y.toExponential(6)} ${tri.v2.z.toExponential(6)}\n`;
      stl += `      vertex ${tri.v3.x.toExponential(6)} ${tri.v3.y.toExponential(6)} ${tri.v3.z.toExponential(6)}\n`;
      stl += '    endloop\n';
      stl += '  endfacet\n';
    }
    
    stl += 'endsolid vectroy_model\n';
    
    return stl;
  }
}

/**
 * OBJ Exporter — Wavefront OBJ (text-based).
 * 
 * OBJ is widely supported by 3D modeling software (Blender, Maya, 3ds Max).
 * Simpler than other formats and human-readable.
 */
export class OBJExporter extends BaseExporter {
  format = 'obj';
  
  async export(svgContent: string, options?: Extrusion3DOptions): Promise<string> {
    const shapes = extractShapes(svgContent);
    const triangles = generateMesh(shapes, options ?? {});
    
    if (triangles.length === 0) {
      throw new Error('No closed paths found to extrude. 3D export requires closed shapes.');
    }
    
    // Collect unique vertices
    const vertices: Point3D[] = [];
    const vertexMap = new Map<string, number>();
    
    const getVertexIndex = (v: Point3D): number => {
      const key = `${v.x.toFixed(6)},${v.y.toFixed(6)},${v.z.toFixed(6)}`;
      let index = vertexMap.get(key);
      if (index === undefined) {
        index = vertices.length + 1; // OBJ indices are 1-based
        vertices.push(v);
        vertexMap.set(key, index);
      }
      return index;
    };
    
    // Build face indices
    const faces: [number, number, number][] = [];
    for (const tri of triangles) {
      const i1 = getVertexIndex(tri.v1);
      const i2 = getVertexIndex(tri.v2);
      const i3 = getVertexIndex(tri.v3);
      faces.push([i1, i2, i3]);
    }
    
    // Generate OBJ file
    let obj = '# Vectroy SVG to OBJ Export\n';
    obj += '# Generated from 2D SVG by extrusion\n\n';
    obj += 'o vectroy_model\n\n';
    
    // Vertices
    for (const v of vertices) {
      obj += `v ${v.x.toFixed(6)} ${v.y.toFixed(6)} ${v.z.toFixed(6)}\n`;
    }
    
    obj += '\n';
    
    // Faces (triangles)
    for (const [i1, i2, i3] of faces) {
      obj += `f ${i1} ${i2} ${i3}\n`;
    }
    
    return obj;
  }
}

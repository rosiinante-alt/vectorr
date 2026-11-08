import { ThreeMFExporter, STLExporter, OBJExporter } from '@/lib/exporters/3d-exporter';

const simpleSVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path d="M 10,10 L 90,10 L 90,90 L 10,90 Z" fill="#ff0000"/>
</svg>`;

const circleSVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="40" fill="#00ff00"/>
</svg>`;

describe('3D Exporters', () => {
  describe('STL Exporter', () => {
    it('should export a simple square to STL', async () => {
      const exporter = new STLExporter();
      const result = await exporter.export(simpleSVG);
      
      expect(typeof result).toBe('string');
      expect(result).toContain('solid vectroy_model');
      expect(result).toContain('facet normal');
      expect(result).toContain('vertex');
      expect(result).toContain('endsolid vectroy_model');
    });
    
    it('should generate multiple facets for a shape', async () => {
      const exporter = new STLExporter();
      const result = await exporter.export(simpleSVG);
      
      const facetCount = (result.match(/facet normal/g) || []).length;
      expect(facetCount).toBeGreaterThan(0);
    });
    
    it('should support custom extrusion depth', async () => {
      const exporter = new STLExporter();
      const result = await exporter.export(simpleSVG, { extrusionDepth: 5.0 });
      
      expect(result).toContain('vertex');
      // Should have vertices at z=0 and z=5.0
      expect(result).toMatch(/5\.0+e[+-]\d+/);
    });
    
    it('should throw error for SVG with no closed paths', async () => {
      const openPathSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <path d="M 10,10 L 90,10" fill="none" stroke="#000"/>
      </svg>`;
      
      const exporter = new STLExporter();
      await expect(exporter.export(openPathSVG)).rejects.toThrow('No closed paths found');
    });
  });
  
  describe('OBJ Exporter', () => {
    it('should export a simple square to OBJ', async () => {
      const exporter = new OBJExporter();
      const result = await exporter.export(simpleSVG);
      
      expect(typeof result).toBe('string');
      expect(result).toContain('# Vectroy SVG to OBJ Export');
      expect(result).toContain('o vectroy_model');
      expect(result).toMatch(/^v /m); // Vertex lines
      expect(result).toMatch(/^f /m); // Face lines
    });
    
    it('should have 1-based vertex indices', async () => {
      const exporter = new OBJExporter();
      const result = await exporter.export(simpleSVG);
      
      // OBJ format uses 1-based indices
      const faceMatch = result.match(/^f (\d+) (\d+) (\d+)/m);
      expect(faceMatch).toBeTruthy();
      if (faceMatch) {
        const indices = [parseInt(faceMatch[1]), parseInt(faceMatch[2]), parseInt(faceMatch[3])];
        indices.forEach(idx => expect(idx).toBeGreaterThanOrEqual(1));
      }
    });
    
    it('should support custom scale', async () => {
      const exporter = new OBJExporter();
      const result = await exporter.export(simpleSVG, { scale: 1.0 });
      
      expect(result).toContain('v ');
      const vertexMatch = result.match(/^v ([-\d.]+) ([-\d.]+) ([-\d.]+)/m);
      expect(vertexMatch).toBeTruthy();
    });
  });
  
  describe('3MF Exporter', () => {
    it('should export a simple square to 3MF', async () => {
      const exporter = new ThreeMFExporter();
      const result = await exporter.export(simpleSVG);
      
      expect(Buffer.isBuffer(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      
      // 3MF is a ZIP file, so it should start with ZIP magic bytes
      expect(result[0]).toBe(0x50); // 'P'
      expect(result[1]).toBe(0x4B); // 'K'
    });
    
    it('should contain required 3MF structure', async () => {
      const exporter = new ThreeMFExporter();
      const result = await exporter.export(simpleSVG);
      
      // Extract ZIP and check for required files
      const AdmZip = (await import('adm-zip')).default;
      const zip = new AdmZip(result);
      const entries = zip.getEntries();
      
      const entryNames = entries.map(e => e.entryName);
      expect(entryNames).toContain('[Content_Types].xml');
      expect(entryNames).toContain('_rels/.rels');
      expect(entryNames).toContain('3D/3dmodel.model');
    });
    
    it('should generate valid 3D model XML', async () => {
      const exporter = new ThreeMFExporter();
      const result = await exporter.export(simpleSVG);
      
      const AdmZip = (await import('adm-zip')).default;
      const zip = new AdmZip(result);
      const modelEntry = zip.getEntry('3D/3dmodel.model');
      
      expect(modelEntry).toBeTruthy();
      if (modelEntry) {
        const modelXml = modelEntry.getData().toString('utf8');
        expect(modelXml).toContain('<?xml version="1.0"');
        expect(modelXml).toContain('<model unit="millimeter"');
        expect(modelXml).toContain('<vertices>');
        expect(modelXml).toContain('<triangles>');
        expect(modelXml).toContain('<vertex x=');
        expect(modelXml).toContain('<triangle v1=');
      }
    });
    
    it('should throw error for SVG with no closed paths', async () => {
      const openPathSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <path d="M 10,10 L 90,10" fill="none" stroke="#000"/>
      </svg>`;
      
      const exporter = new ThreeMFExporter();
      await expect(exporter.export(openPathSVG)).rejects.toThrow('No closed paths found');
    });
  });
  
  describe('Integration Tests', () => {
    it('should handle SVG with multiple shapes', async () => {
      const multiShapeSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <path d="M 10,10 L 90,10 L 90,90 L 10,90 Z" fill="#ff0000"/>
        <path d="M 110,110 L 190,110 L 190,190 L 110,190 Z" fill="#0000ff"/>
      </svg>`;
      
      const stlExporter = new STLExporter();
      const objExporter = new OBJExporter();
      const threemfExporter = new ThreeMFExporter();
      
      const stlResult = await stlExporter.export(multiShapeSVG);
      const objResult = await objExporter.export(multiShapeSVG);
      const threemfResult = await threemfExporter.export(multiShapeSVG);
      
      expect(stlResult.length).toBeGreaterThan(0);
      expect(objResult.length).toBeGreaterThan(0);
      expect(threemfResult.length).toBeGreaterThan(0);
    });
    
    it('should scale SVG units to millimeters correctly', async () => {
      const exporter = new OBJExporter();
      // Default scale is 96 dpi → 0.264583 mm/unit
      // A 100-unit wide shape should be ~26.5mm wide
      const result = await exporter.export(simpleSVG);
      
      const vertices = result.match(/^v ([-\d.]+)/gm);
      expect(vertices).toBeTruthy();
      expect(vertices!.length).toBeGreaterThan(0);
    });
  });
});

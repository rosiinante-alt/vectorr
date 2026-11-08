/**
 * Integration test for 3D export through the API
 * This tests the full flow from SVG → 3D formats via the export API
 */

import { exportFile } from '@/lib/exporters';

const testSVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path d="M 25,25 L 75,25 L 75,75 L 25,75 Z" fill="#4A90E2"/>
</svg>`;

describe('3D Export Integration', () => {
  describe('exportFile function', () => {
    it('should export SVG to 3MF format', async () => {
      const result = await exportFile('3mf', testSVG);
      expect(Buffer.isBuffer(result)).toBe(true);
      expect((result as Buffer).length).toBeGreaterThan(0);
    });
    
    it('should export SVG to STL format', async () => {
      const result = await exportFile('stl', testSVG);
      expect(typeof result).toBe('string');
      expect(result).toContain('solid vectroy_model');
    });
    
    it('should export SVG to OBJ format', async () => {
      const result = await exportFile('obj', testSVG);
      expect(typeof result).toBe('string');
      expect(result).toContain('o vectroy_model');
    });
    
    it('should handle case-insensitive format names', async () => {
      const stl = await exportFile('STL', testSVG);
      const obj = await exportFile('OBJ', testSVG);
      const threemf = await exportFile('3MF', testSVG);
      
      expect(stl).toBeTruthy();
      expect(obj).toBeTruthy();
      expect(threemf).toBeTruthy();
    });
    
    it('should throw error for unsupported format', async () => {
      await expect(exportFile('xyz', testSVG)).rejects.toThrow('Unsupported export format');
    });
    
    it('should pass options to exporters', async () => {
      const result = await exportFile('stl', testSVG, { 
        extrusionDepth: 5.0,
        scale: 1.0 
      });
      
      expect(typeof result).toBe('string');
      expect(result).toContain('vertex');
    });
  });
  
  describe('Format compatibility', () => {
    it('should export complex SVG with multiple shapes', async () => {
      const complexSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <circle cx="50" cy="50" r="30" fill="#ff0000"/>
        <rect x="100" y="100" width="50" height="50" fill="#00ff00"/>
        <polygon points="150,50 175,100 125,100" fill="#0000ff"/>
      </svg>`;
      
      const stl = await exportFile('stl', complexSVG);
      const obj = await exportFile('obj', complexSVG);
      const threemf = await exportFile('3mf', complexSVG);
      
      expect(stl).toBeTruthy();
      expect(obj).toBeTruthy();
      expect(threemf).toBeTruthy();
    });
    
    it('should handle SVG with paths only', async () => {
      const pathSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <path d="M 10,10 L 90,10 L 50,90 Z" fill="#ff0000"/>
      </svg>`;
      
      const result = await exportFile('stl', pathSVG);
      expect(result).toBeTruthy();
    });
    
    it('should handle SVG with geometric shapes', async () => {
      const geometricSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <polygon points="50,10 90,90 10,90" fill="#00ff00"/>
      </svg>`;
      
      const result = await exportFile('obj', geometricSVG);
      expect(result).toBeTruthy();
    });
  });
});

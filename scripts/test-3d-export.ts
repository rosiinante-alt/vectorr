/**
 * Manual test script for 3D exporters
 * Run with: npx tsx scripts/test-3d-export.ts
 */

import { writeFileSync } from 'fs';
import { join } from 'path';
import { ThreeMFExporter, STLExporter, OBJExporter } from '../src/lib/exporters/3d-exporter';

const testSVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <!-- Simple star shape -->
  <path d="M 50,10 L 61,35 L 90,35 L 68,52 L 79,80 L 50,63 L 21,80 L 32,52 L 10,35 L 39,35 Z" fill="#FFD700"/>
</svg>`;

const outputDir = join(__dirname, '..', '.debug');

async function testExporters() {
  console.log('🚀 Testing 3D Exporters\n');
  
  try {
    // Test STL export
    console.log('📦 Exporting to STL...');
    const stlExporter = new STLExporter();
    const stlResult = await stlExporter.export(testSVG, { extrusionDepth: 2.0 });
    const stlPath = join(outputDir, 'test-export.stl');
    writeFileSync(stlPath, stlResult, 'utf-8');
    console.log(`✅ STL exported: ${stlPath}`);
    console.log(`   Size: ${Buffer.from(stlResult).length} bytes\n`);
    
    // Test OBJ export
    console.log('📦 Exporting to OBJ...');
    const objExporter = new OBJExporter();
    const objResult = await objExporter.export(testSVG, { extrusionDepth: 2.0 });
    const objPath = join(outputDir, 'test-export.obj');
    writeFileSync(objPath, objResult, 'utf-8');
    console.log(`✅ OBJ exported: ${objPath}`);
    console.log(`   Size: ${Buffer.from(objResult).length} bytes\n`);
    
    // Test 3MF export
    console.log('📦 Exporting to 3MF...');
    const threemfExporter = new ThreeMFExporter();
    const threemfResult = await threemfExporter.export(testSVG, { extrusionDepth: 2.0 });
    const threemfPath = join(outputDir, 'test-export.3mf');
    writeFileSync(threemfPath, threemfResult);
    console.log(`✅ 3MF exported: ${threemfPath}`);
    console.log(`   Size: ${threemfResult.length} bytes\n`);
    
    console.log('🎉 All exports completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   Output directory: ${outputDir}`);
    console.log('   Files created:');
    console.log('   - test-export.stl  (ASCII STL format)');
    console.log('   - test-export.obj  (Wavefront OBJ format)');
    console.log('   - test-export.3mf  (3D Manufacturing Format)');
    console.log('\n💡 You can open these files in:');
    console.log('   - Windows 3D Viewer');
    console.log('   - Blender (File → Import)');
    console.log('   - MeshLab');
    console.log('   - PrusaSlicer / Bambu Studio');
    console.log('   - Any 3D printing slicer software');
    
  } catch (error) {
    console.error('❌ Export failed:', error);
    process.exit(1);
  }
}

testExporters();

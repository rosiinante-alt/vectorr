# Converter Engine Status

| Format | Library Used | Status | Notes |
| :--- | :--- | :--- | :--- |
| **DST** (Embroidery) | Internal (`EmbroideryExporter`) | ✅ Ready | Implemented in `embroidery-exporter.ts`. |
| **PES** (Embroidery) | Internal (`EmbroideryExporter`) | ❌ Not Implemented | Placeholder exists; throws "not supported yet". |
| **JEF** (Embroidery) | Internal (`EmbroideryExporter`) | ❌ Not Implemented | Placeholder exists; throws "not supported yet". |
| **G-code** (CNC) | Internal (`GcodeExporter`) | ✅ Ready | Implemented in `gcode-exporter.ts`. |
| **3MF** (3D) | Internal (`ThreeMFExporter`) | ✅ Ready | Implemented in `3d-exporter.ts`. Extrudes 2D shapes into 3D models. |
| **STL** (3D) | Internal (`STLExporter`) | ✅ Ready | Implemented in `3d-exporter.ts`. ASCII format with triangle mesh generation. |
| **OBJ** (3D) | Internal (`OBJExporter`) | ✅ Ready | Implemented in `3d-exporter.ts`. Wavefront format for 3D modeling software. |
| **DXF** (Vector) | Internal (`DXFExporter`) | ✅ Ready | Implemented in `dxf-exporter.ts`. |
| **PDF** (Vector/Print) | `pdfkit` | ✅ Ready | Implemented in `pdf-exporter.ts`. |
| **EPS** (Vector/Print) | Internal (`EPSExporter`) | ✅ Ready | Implemented in `eps-exporter.ts`. |
| **SVG** (Vector) | N/A | ✅ Ready | Native support. |
| **Color Separation**| Internal (`ColorSeparationExporter`) | ✅ Ready | Implemented in `color-separation-exporter.ts`. Separates SVG into individual color layers for screen printing, spot-color printing, and vinyl cutting. |

## Implementation Notes
- **Embroidery:** DST export is functional. PES and JEF require implementation of their respective file format specifications.
- **3D Formats:** 3MF, STL, and OBJ exporters are now implemented in `3d-exporter.ts`. They extrude closed 2D SVG paths into 3D meshes with configurable extrusion depth (default 2mm). Uses direct mesh generation without external dependencies.
- **Color Separation:** Fully implemented in `color-separation-exporter.ts`. Groups shapes by color and exports separate SVG files per color layer. Supports both RGB (actual colors) and CMYK (process colors) separation modes. Returns a ZIP archive containing layer files, a composite reference, and a manifest.

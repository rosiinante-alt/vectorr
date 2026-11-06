# Converter Engine Status

| Format | Library Used | Status | Notes |
| :--- | :--- | :--- | :--- |
| **DST** (Embroidery) | Internal (`EmbroideryExporter`) | ✅ Ready | Implemented in `embroidery-exporter.ts`. |
| **PES** (Embroidery) | Internal (`EmbroideryExporter`) | ✅ Ready | PES v1 binary format implemented with PEC stitch data. |
| **JEF** (Embroidery) | Internal (`EmbroideryExporter`) | ✅ Ready | JEF binary format implemented for Janome machines. |
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
- **Embroidery:** DST, PES and JEF are all implemented in `embroidery-exporter.ts` and covered by `__tests__/embroidery-exporters.test.ts`. PES v1 embeds a PEC block with a single colour and no preview bitmap; JEF writes a single-colour palette and rejects designs past the 200 mm hoop. Exports with no drawable shapes are rejected rather than written as an empty, unusable file.
- **3D Formats:** 3MF, STL, and OBJ exporters are now implemented in `3d-exporter.ts`. They extrude closed 2D SVG paths into 3D meshes with configurable extrusion depth (default 2mm). Uses direct mesh generation without external dependencies.
- **Color Separation:** Fully implemented in `color-separation-exporter.ts`. Groups shapes by color and exports separate SVG files per color layer. Supports both RGB (actual colors) and CMYK (process colors) separation modes. Returns a ZIP archive containing layer files, a composite reference, and a manifest.
- **Basic SVG geometry:** `extractShapes` in `svg-utils.ts` now reads `<rect>`, `<circle>`, `<ellipse>`, `<line>` and `<polyline>` in addition to `<path>` and `<polygon>`. Traced artwork is all paths, but hand-written and Illustrator-exported SVGs use these elements, and previously produced an empty shape list — every exporter then failed with "no shapes found".

## Wiring
All formats reach the engine through `src/lib/exporters/index.ts`:

| Surface | Path | Formats |
| :--- | :--- | :--- |
| Single conversion | `src/app/api/convert/route.ts` → `vectorize-worker.ts` | every format above |
| Batch | `src/lib/workers/batch-worker.ts` | every format above |
| Re-export of an existing file | `src/lib/export.ts` → `src/app/api/exports/[id]/route.ts` | every format above |

`conversions.output_format` and `exports.format` are widened by `migrations/202611030001_expand_export_formats.sql`. `ai`, `cdr` and `lottie` were removed from the batch format list because no exporter ever produced them — batches silently uploaded raw SVG bytes under those extensions.

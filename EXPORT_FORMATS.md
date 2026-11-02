# Export Formats

Vectorr accepts SVG source files and can export SVG, PNG, PDF, DXF, EPS, G-code, and DST. PES and JEF are reserved format identifiers but currently fail explicitly; a valid container encoder is not included yet. Each successful API export creates its own export record and stored artifact.

## Formats

| Format | Typical use | Notes |
| --- | --- | --- |
| SVG | Web and vector editing | Preserves the original SVG markup. |
| PNG | Raster previews and sharing | Rendered from SVG using Sharp. |
| PDF | Print and document exchange | SVG is rasterized at the selected DPI and embedded in a one-page PDF. |
| DXF | CAD and laser workflows | Exports path geometry as millimeter polylines. Curves are flattened; arcs are currently rejected. |
| EPS | Print and legacy vector workflows | Exports path geometry as PostScript polylines. Curves are flattened; arcs are currently rejected. |
| G-code | Laser/CNC workflows | Millimeter absolute moves, with laser commands. Machine-specific feeds, power, and homing behavior need review before production use. |
| DST | Tajima embroidery machines | Exports paths as a single-color stitch stream. Curves are flattened; color changes and fill/stitch planning are not implemented. |
| PES / JEF | Brother / Janome embroidery machines | Not yet encoded. Requests fail rather than producing invalid machine files. |

## Options and tradeoffs

`ExportOptions` supports `width`, `height`, `dpi`, and `quality`. Width/height set output dimensions for PDF and the drawing area for vector/device exports. DPI defaults to 96 and controls physical sizing for PDF, DXF, EPS, and G-code. `quality` is currently relevant only to raster output and may be ignored by the PNG encoder.

PDF is raster-based, so sharpness depends on DPI. DXF, EPS, G-code, and DST preserve line geometry but flatten cubic/quadratic curves into line segments; this improves compatibility at the cost of larger output and approximation error. Arc paths currently fail explicitly. G-code and embroidery output should be simulated and machine-calibrated before operation.

## Dependencies

- `fast-xml-parser` reads SVG XML in Node.js.
- `svg-path-parser` parses SVG path commands.
- `sharp` rasterizes SVG for PNG and PDF output.
- `pdfkit` writes PDF documents.

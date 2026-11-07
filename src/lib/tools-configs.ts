/**
 * Free Tools Configuration
 * Extends the /tools/ section with 15 production-ready tools
 */

export interface ToolConfig {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  category: 'design' | 'production' | 'quality';
  formats: string[];
  useCases: string[];
  keywords: string[];
  description: string;
}

export const TOOL_CATEGORIES = [
  { id: 'design', label: 'Design Tools', blurb: 'Create and manipulate vector graphics' },
  { id: 'production', label: 'Production Tools', blurb: 'Optimize workflows for manufacturing' },
  { id: 'quality', label: 'Quality Tools', blurb: 'Analyze and validate vector files' },
] as const;

export const FREE_TOOLS: ToolConfig[] = [
  // ============= DESIGN TOOLS (5) =============
  {
    slug: 'svg-path-editor',
    title: 'SVG Path Editor',
    seoTitle: 'SVG Path Editor - Interactive Vector Path Manipulation | Vectroy',
    seoDescription:
      'Edit SVG paths interactively with visual node editing, bezier curve controls, and real-time preview. Free online tool, no signup required.',
    category: 'design',
    formats: ['SVG'],
    useCases: ['Path editing', 'Node manipulation', 'Curve refinement', 'Shape design'],
    keywords: ['svg path editor', 'vector path tool', 'bezier editor', 'node editor'],
    description:
      'Manipulate SVG paths with precision. Edit anchor points, adjust bezier curves, and refine shapes with an intuitive visual interface.',
  },
  {
    slug: 'vector-grid-generator',
    title: 'Vector Grid Generator',
    seoTitle: 'Vector Grid Generator - Customizable Grid Patterns SVG | Vectroy',
    seoDescription:
      'Generate custom vector grids for design layouts, mockups, and technical drawings. Adjustable spacing, line weight, and color. Export as SVG.',
    category: 'design',
    formats: ['SVG'],
    useCases: ['Layout grids', 'Technical drawings', 'Mockup guides', 'Design templates'],
    keywords: ['grid generator', 'vector grid', 'layout grid svg', 'design grid'],
    description:
      'Create custom grid patterns for layouts and technical drawings. Configure spacing, line weight, subdivisions, and export as clean SVG.',
  },
  {
    slug: 'shape-library-browser',
    title: 'Shape Library Browser',
    seoTitle: 'Shape Library Browser - Pre-made Vector Shapes & Icons | Vectroy',
    seoDescription:
      'Browse and download pre-made vector shapes, icons, and design elements. Free SVG library with geometric shapes, arrows, and decorative elements.',
    category: 'design',
    formats: ['SVG'],
    useCases: ['Icon library', 'Shape templates', 'Design elements', 'Quick prototyping'],
    keywords: ['vector shapes', 'svg icons', 'shape library', 'free vector elements'],
    description:
      'Access a curated library of vector shapes, icons, and design elements. Browse by category, preview instantly, and download as optimized SVG.',
  },
  {
    slug: 'color-palette-extractor',
    title: 'Color Palette Extractor',
    seoTitle: 'Color Palette Extractor - Extract Colors from Images & SVG | Vectroy',
    seoDescription:
      'Extract color palettes from images and SVG files. Get hex codes, RGB values, and dominant colors. Perfect for design systems and branding.',
    category: 'design',
    formats: ['SVG', 'PNG', 'JPG'],
    useCases: ['Color extraction', 'Brand palette', 'Design systems', 'Color matching'],
    keywords: ['color palette extractor', 'svg colors', 'extract colors', 'color picker'],
    description:
      'Extract dominant colors from any image or SVG. Get hex codes, RGB values, and ready-to-use color palettes for your design projects.',
  },
  {
    slug: 'font-to-svg-path',
    title: 'Font to SVG Path Converter',
    seoTitle: 'Font to SVG Path Converter - Convert Text to Vector Outlines | Vectroy',
    seoDescription:
      'Convert text to SVG paths with font embedding. Create editable vector outlines from any text. Perfect for logos, signage, and cutting machines.',
    category: 'design',
    formats: ['SVG'],
    useCases: ['Text to paths', 'Logo design', 'Sign making', 'Cutting machines'],
    keywords: ['font to svg', 'text to paths', 'convert text to vector', 'outline text'],
    description:
      'Convert text into editable SVG paths. Type your text, choose a font, and generate vector outlines ready for cutting, engraving, or editing.',
  },

  // ============= PRODUCTION TOOLS (5) =============
  {
    slug: 'gang-sheet-layout',
    title: 'Gang Sheet Layout Tool',
    seoTitle: 'Gang Sheet Layout Tool - Optimize Print Layouts & Nesting | Vectroy',
    seoDescription:
      'Optimize gang sheet layouts for DTF, screen printing, and sublimation. Auto-nest designs, maximize material usage, and reduce waste.',
    category: 'production',
    formats: ['SVG', 'PNG', 'PDF'],
    useCases: ['DTF printing', 'Screen printing', 'Gang sheets', 'Material optimization'],
    keywords: ['gang sheet', 'layout optimizer', 'nesting tool', 'print layout'],
    description:
      'Arrange multiple designs on gang sheets for efficient printing. Auto-nest, set spacing, and maximize material usage for DTF, screen printing, and more.',
  },
  {
    slug: 'laser-cut-settings-calculator',
    title: 'Laser Cut Settings Calculator',
    seoTitle: 'Laser Cut Settings Calculator - Power, Speed & Material Guide | Vectroy',
    seoDescription:
      'Calculate laser cutter settings for different materials. Get recommended power, speed, and pass settings for wood, acrylic, leather, and more.',
    category: 'production',
    formats: ['Reference Tool'],
    useCases: ['Laser cutting', 'Material settings', 'Glowforge', 'xTool', 'LightBurn'],
    keywords: [
      'laser settings calculator',
      'laser cutter settings',
      'material settings',
      'laser power speed',
    ],
    description:
      'Find the right laser cutter settings for your material and machine. Select material type, thickness, and machine to get power, speed, and pass recommendations.',
  },
  {
    slug: 'embroidery-density-calculator',
    title: 'Embroidery Density Calculator',
    seoTitle: 'Embroidery Density Calculator - Stitch Count & Thread Estimates | Vectroy',
    seoDescription:
      'Calculate embroidery stitch density, thread usage, and production time. Estimate costs for custom embroidery projects with precision.',
    category: 'production',
    formats: ['DST', 'PES', 'JEF'],
    useCases: ['Embroidery planning', 'Stitch estimation', 'Thread calculation', 'Cost estimation'],
    keywords: [
      'embroidery calculator',
      'stitch density',
      'thread calculator',
      'embroidery cost',
    ],
    description:
      'Calculate stitch counts, thread usage, and production time for embroidery projects. Input design size and density to estimate material costs.',
  },
  {
    slug: '3d-print-support-generator',
    title: '3D Print Support Generator',
    seoTitle: '3D Print Support Generator - Auto Supports for Vector Models | Vectroy',
    seoDescription:
      'Generate support structures for 3D printing vector-based models. Optimize for multicolor prints on Bambu Lab, Prusa, and other FDM printers.',
    category: 'production',
    formats: ['STL', '3MF'],
    useCases: ['3D printing', 'Support structures', 'Multicolor prints', 'FDM printing'],
    keywords: ['3d print supports', 'support generator', 'bambu lab', '3mf supports'],
    description:
      'Automatically generate support structures for 3D printing vector models. Optimize support density, placement, and breakaway settings.',
  },
  {
    slug: 'material-cost-calculator',
    title: 'Material Cost Calculator',
    seoTitle: 'Material Cost Calculator - Per-Piece Pricing for Production | Vectroy',
    seoDescription:
      'Calculate material costs per piece for vinyl, sublimation, DTF, laser cutting, and embroidery. Factor in waste, setup time, and material usage.',
    category: 'production',
    formats: ['Reference Tool'],
    useCases: ['Pricing', 'Cost estimation', 'Production planning', 'Material budgeting'],
    keywords: ['material cost calculator', 'pricing calculator', 'per piece cost', 'production cost'],
    description:
      'Calculate accurate per-piece material costs. Input dimensions, material type, and waste factor to get pricing for vinyl, fabric, wood, and more.',
  },

  // ============= QUALITY TOOLS (5) =============
  {
    slug: 'vector-validator',
    title: 'Vector Validator',
    seoTitle: 'Vector Validator - Check SVG Files for Errors & Issues | Vectroy',
    seoDescription:
      'Validate SVG files for common issues: open paths, overlapping shapes, invalid colors, and compatibility problems. Free file checker.',
    category: 'quality',
    formats: ['SVG'],
    useCases: ['Quality control', 'Error checking', 'File validation', 'Pre-production testing'],
    keywords: ['svg validator', 'vector checker', 'svg errors', 'file validation'],
    description:
      'Check SVG files for errors and compatibility issues. Detect open paths, overlapping shapes, invalid colors, and machine compatibility problems.',
  },
  {
    slug: 'dxf-layer-analyzer',
    title: 'DXF Layer Analyzer',
    seoTitle: 'DXF Layer Analyzer - Inspect CAD File Layers & Structure | Vectroy',
    seoDescription:
      'Analyze DXF files to inspect layers, entities, and structure. View layer contents, colors, and line types. Perfect for CAD file quality control.',
    category: 'quality',
    formats: ['DXF'],
    useCases: ['CAD inspection', 'Layer analysis', 'Quality control', 'File debugging'],
    keywords: ['dxf analyzer', 'dxf layer viewer', 'cad inspector', 'dxf checker'],
    description:
      'Inspect DXF files layer-by-layer. View entity counts, colors, line types, and layer structure. Identify issues before sending to production.',
  },
  {
    slug: 'svg-accessibility-checker',
    title: 'SVG Accessibility Checker',
    seoTitle: 'SVG Accessibility Checker - WCAG Compliance & Alt Text | Vectroy',
    seoDescription:
      'Check SVG files for accessibility compliance. Validate ARIA labels, alt text, color contrast, and screen reader compatibility.',
    category: 'quality',
    formats: ['SVG'],
    useCases: ['Web accessibility', 'WCAG compliance', 'Screen readers', 'A11y testing'],
    keywords: ['svg accessibility', 'wcag checker', 'aria validator', 'a11y checker'],
    description:
      'Validate SVG accessibility for web use. Check ARIA attributes, title elements, color contrast, and screen reader compatibility.',
  },
  {
    slug: 'path-complexity-analyzer',
    title: 'Path Complexity Analyzer',
    seoTitle: 'Path Complexity Analyzer - SVG Node Count & Performance Stats | Vectroy',
    seoDescription:
      'Analyze SVG path complexity with node counts, segment statistics, and performance metrics. Identify optimization opportunities.',
    category: 'quality',
    formats: ['SVG'],
    useCases: ['Performance analysis', 'Path optimization', 'Complexity metrics', 'File optimization'],
    keywords: ['path complexity', 'node counter', 'svg performance', 'path analyzer'],
    description:
      'Measure SVG path complexity with detailed node counts, segment analysis, and curve statistics. Identify paths that need simplification.',
  },
  {
    slug: 'file-size-optimizer',
    title: 'File Size Optimizer',
    seoTitle: 'File Size Optimizer - Compare Compression & Format Options | Vectroy',
    seoDescription:
      'Compare file sizes across formats and compression settings. Test SVG optimization, PNG compression levels, and format conversions side-by-side.',
    category: 'quality',
    formats: ['SVG', 'PNG', 'PDF'],
    useCases: ['File optimization', 'Size comparison', 'Format selection', 'Web performance'],
    keywords: ['file size optimizer', 'compression comparison', 'format optimizer', 'file size tool'],
    description:
      'Compare file sizes across different formats and compression levels. Test multiple optimization strategies side-by-side to find the smallest file.',
  },
];

export function getToolBySlug(slug: string): ToolConfig | undefined {
  return FREE_TOOLS.find((tool) => tool.slug === slug);
}

export function getToolsByCategory(category: 'design' | 'production' | 'quality'): ToolConfig[] {
  return FREE_TOOLS.filter((tool) => tool.category === category);
}

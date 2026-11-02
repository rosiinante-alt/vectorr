/**
 * SEO-Optimized Converter Landing Pages Configuration
 * Generates 67 converter pages for format conversions and use-case specific workflows
 */

export interface ConverterConfig {
  title: string;
  seoTitle: string;
  seoDescription: string;
  inputFormat: string;
  outputFormat: string;
  useCases: string[];
  keywords: string[];
  content: string;
  schema: {
    toolName: string;
    inputName: string;
    outputName: string;
    steps: Array<{
      name: string;
      text: string;
    }>;
  };
}

/**
 * All converter pages slugs
 * Organized by category for clarity
 */
export const CONVERTER_PAGES = [
  // Raster to SVG (12)
  'png-to-svg',
  'jpg-to-svg',
  'jpeg-to-svg',
  'webp-to-svg',
  'gif-to-svg',
  'heic-to-svg',
  'tiff-to-svg',
  'bmp-to-svg',
  'ai-to-svg',
  'eps-to-svg',
  'pdf-to-svg',
  'psd-to-svg',

  // SVG to Raster (4)
  'svg-to-png',
  'svg-to-gif',
  'svg-to-webp',
  'svg-to-pdf',

  // Use-Case Specific - Format Independent (8)
  'image-to-vector',
  'photo-to-svg',
  'logo-to-vector',
  'logo-to-svg',
  'raster-to-vector',
  'bitmap-to-svg',
  'picture-to-svg',
  'sketch-to-vector',

  // Specialized Workflows - Crafters & Makers (20)
  'svg-for-cricut',
  'svg-for-silhouette',
  'svg-for-laser-cutting',
  'svg-for-vinyl-cutting',
  'svg-for-embroidery',
  'svg-for-3d-printing',
  'svg-for-screen-printing',
  'svg-for-sublimation',
  'svg-for-dtf',
  'svg-for-etsy-sellers',
  'png-to-svg-for-cricut',
  'jpg-to-svg-for-silhouette',
  'image-to-svg-for-cricut',
  'image-to-svg-for-canva',
  'image-to-cut-file',
  'logo-to-dxf',
  'logo-to-eps',
  'png-to-dxf',
  'jpg-to-dxf',
  'embroidery-converter',

  // Cross-Format Conversions (16)
  'png-to-dxf',
  'png-to-eps',
  'png-to-ai',
  'jpg-to-ai',
  'jpg-to-eps',
  'svg-to-dxf',
  'svg-to-eps',
  'svg-to-ai',
  'svg-to-g-code',
  'svg-to-dst',
  'svg-to-pes',
  'svg-to-jef',
  'image-to-dst',
  'image-to-pes',
  'image-to-jef',
  'image-to-g-code',

  // Additional Format Converters (7)
  'avif-to-svg',
  'tga-to-svg',
  'ico-to-svg',
  'pcx-to-svg',
  'ppm-to-svg',
  'svg-to-eps-print',
  'svg-to-3mf',
];

/**
 * Main configuration map for all converters
 * Each entry generates an SEO-optimized landing page
 */
export const CONVERTER_CONFIGS: Record<string, ConverterConfig> = {
  // ============= RASTER TO SVG (12) =============

  'png-to-svg': {
    title: 'PNG to SVG',
    seoTitle: 'Free PNG to SVG Converter - Convert Images to Vector Online',
    seoDescription:
      'Convert PNG images to scalable SVG vector files instantly. AI-powered, no signup required. Perfect for logos, icons, and web graphics.',
    inputFormat: 'PNG',
    outputFormat: 'SVG',
    useCases: ['Logos', 'Icons', 'Web graphics', 'Print designs'],
    keywords: [
      'png to svg',
      'convert png to svg',
      'png to vector',
      'rasterize to vector',
    ],
    content: generateContent('PNG', 'SVG', 'raster-to-vector'),
    schema: {
      toolName: 'PNG to SVG Converter',
      inputName: 'PNG Image',
      outputName: 'SVG Vector',
      steps: [
        { name: 'Upload', text: 'Upload your PNG image' },
        { name: 'Convert', text: 'AI converts to vector paths' },
        { name: 'Download', text: 'Download as scalable SVG' },
      ],
    },
  },

  'jpg-to-svg': {
    title: 'JPG to SVG',
    seoTitle: 'Convert JPG to SVG - Free Online JPEG to Vector Converter',
    seoDescription:
      'Transform JPG photos into scalable SVG vectors. Fast, free preview. Ideal for converting photographs, logos, and graphics to vector format.',
    inputFormat: 'JPG',
    outputFormat: 'SVG',
    useCases: ['Photo vectorization', 'Logo conversion', 'Print ready graphics'],
    keywords: ['jpg to svg', 'jpeg to svg', 'convert jpg to vector', 'jpg to vector'],
    content: generateContent('JPG', 'SVG', 'raster-to-vector'),
    schema: {
      toolName: 'JPG to SVG Converter',
      inputName: 'JPG Image',
      outputName: 'SVG Vector',
      steps: [
        { name: 'Upload', text: 'Upload your JPG file' },
        { name: 'Convert', text: 'AI traces edges and creates vector paths' },
        { name: 'Download', text: 'Get your scalable SVG file' },
      ],
    },
  },

  'jpeg-to-svg': {
    title: 'JPEG to SVG',
    seoTitle: 'JPEG to SVG Converter - Convert Photos to Vectors Free',
    seoDescription:
      'Convert JPEG photos to scalable SVG vector graphics. AI-powered edge detection. Perfect for logos, illustrations, and design projects.',
    inputFormat: 'JPEG',
    outputFormat: 'SVG',
    useCases: ['Photo tracing', 'Logo design', 'Icon creation'],
    keywords: ['jpeg to svg', 'convert jpeg to svg', 'jpeg to vector'],
    content: generateContent('JPEG', 'SVG', 'raster-to-vector'),
    schema: {
      toolName: 'JPEG to SVG Converter',
      inputName: 'JPEG Image',
      outputName: 'SVG Vector',
      steps: [
        { name: 'Upload', text: 'Upload your JPEG file' },
        { name: 'Convert', text: 'Transform to vector format' },
        { name: 'Download', text: 'Download SVG' },
      ],
    },
  },

  'webp-to-svg': {
    title: 'WebP to SVG',
    seoTitle: 'WebP to SVG Converter - Convert Modern Image Format to Vectors',
    seoDescription:
      'Convert WebP images to scalable SVG vectors. Supports modern web image format. Free, no registration needed.',
    inputFormat: 'WebP',
    outputFormat: 'SVG',
    useCases: ['Web graphics', 'Modern format conversion', 'Vector creation'],
    keywords: ['webp to svg', 'convert webp to vector'],
    content: generateContent('WebP', 'SVG', 'raster-to-vector'),
    schema: {
      toolName: 'WebP to SVG Converter',
      inputName: 'WebP Image',
      outputName: 'SVG Vector',
      steps: [
        { name: 'Upload', text: 'Upload WebP image' },
        { name: 'Convert', text: 'Convert to vector' },
        { name: 'Download', text: 'Download SVG' },
      ],
    },
  },

  'gif-to-svg': {
    title: 'GIF to SVG',
    seoTitle: 'GIF to SVG Converter - Convert Animated GIF to Vector',
    seoDescription:
      'Convert GIF images to scalable SVG vectors. First frame captured for vectorization. Ideal for converting graphics and simple animations.',
    inputFormat: 'GIF',
    outputFormat: 'SVG',
    useCases: ['GIF conversion', 'Animation frame capture', 'Vector graphics'],
    keywords: ['gif to svg', 'convert gif to vector'],
    content: generateContent('GIF', 'SVG', 'raster-to-vector'),
    schema: {
      toolName: 'GIF to SVG Converter',
      inputName: 'GIF Image',
      outputName: 'SVG Vector',
      steps: [
        { name: 'Upload', text: 'Upload GIF file' },
        { name: 'Convert', text: 'Convert to vector' },
        { name: 'Download', text: 'Download SVG' },
      ],
    },
  },

  'heic-to-svg': {
    title: 'HEIC to SVG',
    seoTitle: 'HEIC to SVG Converter - Convert Apple Photos to Vectors',
    seoDescription:
      'Convert HEIC images (Apple iPhone photos) to scalable SVG vectors. Free online converter, no signup required.',
    inputFormat: 'HEIC',
    outputFormat: 'SVG',
    useCases: ['iPhone photo conversion', 'Mobile image vectorization'],
    keywords: ['heic to svg', 'convert heic to vector', 'heic to svg'],
    content: generateContent('HEIC', 'SVG', 'raster-to-vector'),
    schema: {
      toolName: 'HEIC to SVG Converter',
      inputName: 'HEIC Image',
      outputName: 'SVG Vector',
      steps: [
        { name: 'Upload', text: 'Upload HEIC file' },
        { name: 'Convert', text: 'Convert to vector' },
        { name: 'Download', text: 'Download SVG' },
      ],
    },
  },

  'tiff-to-svg': {
    title: 'TIFF to SVG',
    seoTitle: 'TIFF to SVG Converter - Convert TIFF Images to Vectors',
    seoDescription:
      'Convert TIFF (Tagged Image Format) files to scalable SVG vectors. Supports high-resolution scanned documents and photos.',
    inputFormat: 'TIFF',
    outputFormat: 'SVG',
    useCases: ['Scanned document conversion', 'High-res image vectorization'],
    keywords: ['tiff to svg', 'convert tiff to vector'],
    content: generateContent('TIFF', 'SVG', 'raster-to-vector'),
    schema: {
      toolName: 'TIFF to SVG Converter',
      inputName: 'TIFF Image',
      outputName: 'SVG Vector',
      steps: [
        { name: 'Upload', text: 'Upload TIFF file' },
        { name: 'Convert', text: 'Convert to vector' },
        { name: 'Download', text: 'Download SVG' },
      ],
    },
  },

  'bmp-to-svg': {
    title: 'BMP to SVG',
    seoTitle: 'BMP to SVG Converter - Convert Bitmap Images to Vectors',
    seoDescription:
      'Convert BMP (Bitmap) images to scalable SVG vector graphics. Free, instant conversion with no file size limits.',
    inputFormat: 'BMP',
    outputFormat: 'SVG',
    useCases: ['Legacy format conversion', 'Bitmap vectorization'],
    keywords: ['bmp to svg', 'bitmap to svg', 'convert bmp to vector'],
    content: generateContent('BMP', 'SVG', 'raster-to-vector'),
    schema: {
      toolName: 'BMP to SVG Converter',
      inputName: 'BMP Image',
      outputName: 'SVG Vector',
      steps: [
        { name: 'Upload', text: 'Upload BMP file' },
        { name: 'Convert', text: 'Convert to vector' },
        { name: 'Download', text: 'Download SVG' },
      ],
    },
  },

  'ai-to-svg': {
    title: 'AI to SVG',
    seoTitle: 'AI File to SVG Converter - Convert Adobe Illustrator to SVG',
    seoDescription:
      'Convert Adobe Illustrator (AI) files to scalable SVG format. Preserve all vector paths and colors. No software required.',
    inputFormat: 'AI',
    outputFormat: 'SVG',
    useCases: ['Adobe conversion', 'Vector format migration'],
    keywords: ['ai to svg', 'adobe illustrator to svg', 'convert ai to svg'],
    content: generateContent('AI', 'SVG', 'format-conversion'),
    schema: {
      toolName: 'AI to SVG Converter',
      inputName: 'Adobe Illustrator File',
      outputName: 'SVG Vector',
      steps: [
        { name: 'Upload', text: 'Upload AI file' },
        { name: 'Convert', text: 'Convert to SVG' },
        { name: 'Download', text: 'Download SVG' },
      ],
    },
  },

  'eps-to-svg': {
    title: 'EPS to SVG',
    seoTitle: 'EPS to SVG Converter - Convert Encapsulated PostScript to SVG',
    seoDescription:
      'Convert EPS (Encapsulated PostScript) files to scalable SVG format. Ideal for converting print files to web vectors.',
    inputFormat: 'EPS',
    outputFormat: 'SVG',
    useCases: ['Print file conversion', 'Vector format migration'],
    keywords: ['eps to svg', 'convert eps to svg', 'postscript to svg'],
    content: generateContent('EPS', 'SVG', 'format-conversion'),
    schema: {
      toolName: 'EPS to SVG Converter',
      inputName: 'EPS File',
      outputName: 'SVG Vector',
      steps: [
        { name: 'Upload', text: 'Upload EPS file' },
        { name: 'Convert', text: 'Convert to SVG' },
        { name: 'Download', text: 'Download SVG' },
      ],
    },
  },

  'pdf-to-svg': {
    title: 'PDF to SVG',
    seoTitle: 'PDF to SVG Converter - Extract Vectors from PDF Files',
    seoDescription:
      'Convert PDF documents and graphics to scalable SVG vectors. Extract vector content from PDFs without losing quality.',
    inputFormat: 'PDF',
    outputFormat: 'SVG',
    useCases: ['PDF vector extraction', 'Print to web conversion'],
    keywords: ['pdf to svg', 'convert pdf to vector', 'pdf to svg'],
    content: generateContent('PDF', 'SVG', 'format-conversion'),
    schema: {
      toolName: 'PDF to SVG Converter',
      inputName: 'PDF File',
      outputName: 'SVG Vector',
      steps: [
        { name: 'Upload', text: 'Upload PDF file' },
        { name: 'Convert', text: 'Extract vectors' },
        { name: 'Download', text: 'Download SVG' },
      ],
    },
  },

  'psd-to-svg': {
    title: 'PSD to SVG',
    seoTitle: 'PSD to SVG Converter - Convert Photoshop Files to Vector',
    seoDescription:
      'Convert Photoshop (PSD) files to scalable SVG format. Rasterize and vectorize your designs without Photoshop.',
    inputFormat: 'PSD',
    outputFormat: 'SVG',
    useCases: ['Photoshop conversion', 'Design vectorization'],
    keywords: ['psd to svg', 'photoshop to svg', 'convert psd to vector'],
    content: generateContent('PSD', 'SVG', 'format-conversion'),
    schema: {
      toolName: 'PSD to SVG Converter',
      inputName: 'Photoshop File',
      outputName: 'SVG Vector',
      steps: [
        { name: 'Upload', text: 'Upload PSD file' },
        { name: 'Convert', text: 'Convert to SVG' },
        { name: 'Download', text: 'Download SVG' },
      ],
    },
  },

  // ============= SVG TO RASTER (4) =============

  'svg-to-png': {
    title: 'SVG to PNG',
    seoTitle: 'SVG to PNG Converter - Convert Vector to Raster Image',
    seoDescription:
      'Convert SVG vector files to PNG raster images. Adjustable resolution, transparent background. Free, instant conversion.',
    inputFormat: 'SVG',
    outputFormat: 'PNG',
    useCases: ['PNG export', 'Raster conversion', 'Web optimization'],
    keywords: ['svg to png', 'convert svg to png', 'vector to raster'],
    content: generateContent('SVG', 'PNG', 'vector-to-raster'),
    schema: {
      toolName: 'SVG to PNG Converter',
      inputName: 'SVG Vector',
      outputName: 'PNG Image',
      steps: [
        { name: 'Upload', text: 'Upload SVG file' },
        { name: 'Convert', text: 'Rasterize to PNG' },
        { name: 'Download', text: 'Download PNG' },
      ],
    },
  },

  'svg-to-gif': {
    title: 'SVG to GIF',
    seoTitle: 'SVG to GIF Converter - Convert Vector Graphics to GIF',
    seoDescription:
      'Convert SVG vectors to GIF format. Perfect for web graphics, social media, and animated content.',
    inputFormat: 'SVG',
    outputFormat: 'GIF',
    useCases: ['GIF creation', 'Web graphics', 'Social media'],
    keywords: ['svg to gif', 'convert svg to gif'],
    content: generateContent('SVG', 'GIF', 'vector-to-raster'),
    schema: {
      toolName: 'SVG to GIF Converter',
      inputName: 'SVG Vector',
      outputName: 'GIF Image',
      steps: [
        { name: 'Upload', text: 'Upload SVG' },
        { name: 'Convert', text: 'Convert to GIF' },
        { name: 'Download', text: 'Download GIF' },
      ],
    },
  },

  'svg-to-webp': {
    title: 'SVG to WebP',
    seoTitle: 'SVG to WebP Converter - Modern Image Format Conversion',
    seoDescription:
      'Convert SVG vectors to modern WebP format. Smaller file sizes, better web performance. Fast and free.',
    inputFormat: 'SVG',
    outputFormat: 'WebP',
    useCases: ['Modern web format', 'Performance optimization'],
    keywords: ['svg to webp', 'convert svg to webp'],
    content: generateContent('SVG', 'WebP', 'vector-to-raster'),
    schema: {
      toolName: 'SVG to WebP Converter',
      inputName: 'SVG Vector',
      outputName: 'WebP Image',
      steps: [
        { name: 'Upload', text: 'Upload SVG' },
        { name: 'Convert', text: 'Convert to WebP' },
        { name: 'Download', text: 'Download WebP' },
      ],
    },
  },

  'svg-to-pdf': {
    title: 'SVG to PDF',
    seoTitle: 'SVG to PDF Converter - Convert Vectors to PDF Format',
    seoDescription:
      'Convert SVG vector files to PDF format. Perfect for printing, sharing, and archival. Maintains vector quality.',
    inputFormat: 'SVG',
    outputFormat: 'PDF',
    useCases: ['Print files', 'Document sharing', 'Vector archival'],
    keywords: ['svg to pdf', 'convert svg to pdf', 'vector to pdf'],
    content: generateContent('SVG', 'PDF', 'vector-to-format'),
    schema: {
      toolName: 'SVG to PDF Converter',
      inputName: 'SVG Vector',
      outputName: 'PDF File',
      steps: [
        { name: 'Upload', text: 'Upload SVG' },
        { name: 'Convert', text: 'Convert to PDF' },
        { name: 'Download', text: 'Download PDF' },
      ],
    },
  },

  // ============= USE-CASE SPECIFIC (8) =============

  'image-to-vector': {
    title: 'Image to Vector',
    seoTitle: 'Image to Vector Converter - Convert Any Image to SVG',
    seoDescription:
      'Convert any image (PNG, JPG, GIF, etc.) to scalable vector format. AI-powered vectorization with clean, professional results.',
    inputFormat: 'Any Image',
    outputFormat: 'SVG',
    useCases: ['Logo vectorization', 'Photo conversion', 'Graphic design'],
    keywords: [
      'image to vector',
      'convert image to vector',
      'raster to vector',
      'image vectorizer',
    ],
    content: generateContent('Image', 'Vector', 'general-use-case'),
    schema: {
      toolName: 'Image to Vector Converter',
      inputName: 'Image File',
      outputName: 'Vector File',
      steps: [
        { name: 'Upload', text: 'Upload any image' },
        { name: 'Convert', text: 'AI converts to vector' },
        { name: 'Download', text: 'Download vector file' },
      ],
    },
  },

  'photo-to-svg': {
    title: 'Photo to SVG',
    seoTitle: 'Photo to SVG Converter - Convert Photographs to Vectors',
    seoDescription:
      'Transform your photographs into scalable SVG vectors. Perfect for creating posters, prints, and artistic graphics.',
    inputFormat: 'Photo',
    outputFormat: 'SVG',
    useCases: ['Photo art', 'Poster creation', 'Artistic graphics'],
    keywords: ['photo to svg', 'convert photo to vector', 'photograph vectorizer'],
    content: generateContent('Photo', 'SVG', 'general-use-case'),
    schema: {
      toolName: 'Photo to SVG Converter',
      inputName: 'Photograph',
      outputName: 'SVG Vector',
      steps: [
        { name: 'Upload', text: 'Upload your photo' },
        { name: 'Convert', text: 'Convert to vector' },
        { name: 'Download', text: 'Download SVG' },
      ],
    },
  },

  'logo-to-vector': {
    title: 'Logo to Vector',
    seoTitle: 'Logo to Vector Converter - Convert Logo Images to SVG',
    seoDescription:
      'Convert logo images to scalable vector format instantly. Perfect for resizing, printing, and brand use. Free and accurate.',
    inputFormat: 'Logo Image',
    outputFormat: 'Vector',
    useCases: ['Logo conversion', 'Brand management', 'Print ready'],
    keywords: ['logo to vector', 'convert logo to vector', 'logo vectorizer'],
    content: generateContent('Logo', 'Vector', 'professional-use-case'),
    schema: {
      toolName: 'Logo to Vector Converter',
      inputName: 'Logo Image',
      outputName: 'Vector File',
      steps: [
        { name: 'Upload', text: 'Upload logo image' },
        { name: 'Convert', text: 'Vectorize logo' },
        { name: 'Download', text: 'Download vector' },
      ],
    },
  },

  'logo-to-svg': {
    title: 'Logo to SVG',
    seoTitle: 'Logo to SVG Converter - Professional Logo Vectorization',
    seoDescription:
      'Convert your logo images to professional SVG vectors. Maintain brand quality at any size. Free, no signup required.',
    inputFormat: 'Logo',
    outputFormat: 'SVG',
    useCases: ['Logo branding', 'Multi-format export', 'Professional use'],
    keywords: ['logo to svg', 'convert logo to svg', 'svg logo converter'],
    content: generateContent('Logo', 'SVG', 'professional-use-case'),
    schema: {
      toolName: 'Logo to SVG Converter',
      inputName: 'Logo Image',
      outputName: 'SVG File',
      steps: [
        { name: 'Upload', text: 'Upload logo' },
        { name: 'Vectorize', text: 'Convert to SVG' },
        { name: 'Download', text: 'Download SVG' },
      ],
    },
  },

  'raster-to-vector': {
    title: 'Raster to Vector',
    seoTitle: 'Raster to Vector Converter - Convert Bitmap to Vector Graphics',
    seoDescription:
      'Convert raster bitmap images to scalable vector graphics. Supports all major image formats. Free online converter.',
    inputFormat: 'Raster Image',
    outputFormat: 'Vector',
    useCases: ['Image conversion', 'Format migration', 'Scaling'],
    keywords: [
      'raster to vector',
      'convert raster to vector',
      'bitmap to vector',
      'rasterizer',
    ],
    content: generateContent('Raster', 'Vector', 'technical-use-case'),
    schema: {
      toolName: 'Raster to Vector Converter',
      inputName: 'Raster Image',
      outputName: 'Vector Graphics',
      steps: [
        { name: 'Upload', text: 'Upload raster image' },
        { name: 'Convert', text: 'Convert to vector' },
        { name: 'Download', text: 'Download vector' },
      ],
    },
  },

  'bitmap-to-svg': {
    title: 'Bitmap to SVG',
    seoTitle: 'Bitmap to SVG Converter - Trace Bitmaps to Scalable Vectors',
    seoDescription:
      'Convert bitmap images to scalable SVG vectors using advanced edge detection. Perfect for logos and graphics.',
    inputFormat: 'Bitmap',
    outputFormat: 'SVG',
    useCases: ['Bitmap tracing', 'Vector creation', 'Logo design'],
    keywords: ['bitmap to svg', 'convert bitmap to svg', 'bitmap tracer'],
    content: generateContent('Bitmap', 'SVG', 'technical-use-case'),
    schema: {
      toolName: 'Bitmap to SVG Converter',
      inputName: 'Bitmap Image',
      outputName: 'SVG Vector',
      steps: [
        { name: 'Upload', text: 'Upload bitmap' },
        { name: 'Trace', text: 'Trace edges and create paths' },
        { name: 'Download', text: 'Download SVG' },
      ],
    },
  },

  'picture-to-svg': {
    title: 'Picture to SVG',
    seoTitle: 'Picture to SVG Converter - Convert Pictures to Vector Graphics',
    seoDescription:
      'Convert your pictures to scalable SVG vectors. Supports all common image formats. Free, fast, and easy.',
    inputFormat: 'Picture',
    outputFormat: 'SVG',
    useCases: ['Picture conversion', 'Art creation', 'Design'],
    keywords: ['picture to svg', 'convert picture to svg', 'picture vectorizer'],
    content: generateContent('Picture', 'SVG', 'general-use-case'),
    schema: {
      toolName: 'Picture to SVG Converter',
      inputName: 'Picture File',
      outputName: 'SVG Vector',
      steps: [
        { name: 'Upload', text: 'Upload picture' },
        { name: 'Convert', text: 'Convert to vector' },
        { name: 'Download', text: 'Download SVG' },
      ],
    },
  },

  'sketch-to-vector': {
    title: 'Sketch to Vector',
    seoTitle: 'Sketch to Vector Converter - Convert Hand Sketches to Digital Vectors',
    seoDescription:
      'Transform your hand-drawn sketches into clean digital vector graphics. Perfect for artists and designers.',
    inputFormat: 'Sketch',
    outputFormat: 'Vector',
    useCases: ['Sketch digitization', 'Hand-drawn art', 'Design conversion'],
    keywords: [
      'sketch to vector',
      'convert sketch to vector',
      'sketch vectorizer',
      'hand drawn to vector',
    ],
    content: generateContent('Sketch', 'Vector', 'creative-use-case'),
    schema: {
      toolName: 'Sketch to Vector Converter',
      inputName: 'Sketch Image',
      outputName: 'Vector Graphics',
      steps: [
        { name: 'Upload', text: 'Upload your sketch' },
        { name: 'Convert', text: 'Digitize and vectorize' },
        { name: 'Download', text: 'Download vector' },
      ],
    },
  },

  // ============= SPECIALIZED WORKFLOWS - CRAFTERS & MAKERS (20) =============

  'svg-for-cricut': {
    title: 'SVG for Cricut',
    seoTitle: 'SVG for Cricut - Cricut-Ready Vector Designs',
    seoDescription:
      'Convert and optimize SVG files for Cricut machines. Layered, Design Space compatible, ready to cut. Free tool.',
    inputFormat: 'SVG',
    outputFormat: 'SVG (Cricut)',
    useCases: ['Cricut cutting', 'Vinyl design', 'Craft projects'],
    keywords: ['svg for cricut', 'cricut svg', 'cricut converter', 'cricut ready svg'],
    content: generateContent('SVG', 'Cricut', 'cricut-workflow'),
    schema: {
      toolName: 'SVG for Cricut Converter',
      inputName: 'SVG File',
      outputName: 'Cricut-Ready SVG',
      steps: [
        { name: 'Upload', text: 'Upload SVG file' },
        { name: 'Optimize', text: 'Optimize for Cricut Design Space' },
        { name: 'Download', text: 'Download Cricut SVG' },
      ],
    },
  },

  'svg-for-silhouette': {
    title: 'SVG for Silhouette',
    seoTitle: 'SVG for Silhouette - Silhouette Studio Compatible SVG',
    seoDescription:
      'Convert SVG files for Silhouette cutting machines. Studio-compatible, cut-ready. Free online converter.',
    inputFormat: 'SVG',
    outputFormat: 'SVG (Silhouette)',
    useCases: ['Silhouette cutting', 'Vinyl projects', 'Craft design'],
    keywords: [
      'svg for silhouette',
      'silhouette svg',
      'silhouette converter',
      'silhouette ready svg',
    ],
    content: generateContent('SVG', 'Silhouette', 'silhouette-workflow'),
    schema: {
      toolName: 'SVG for Silhouette Converter',
      inputName: 'SVG File',
      outputName: 'Silhouette-Ready SVG',
      steps: [
        { name: 'Upload', text: 'Upload SVG' },
        { name: 'Optimize', text: 'Optimize for Silhouette Studio' },
        { name: 'Download', text: 'Download Silhouette SVG' },
      ],
    },
  },

  'svg-for-laser-cutting': {
    title: 'SVG for Laser Cutting',
    seoTitle: 'SVG for Laser Cutting - Laser Engraver Ready Files',
    seoDescription:
      'Prepare SVG files for laser cutters (Glowforge, xTool, LightBurn). DXF export, kerf settings, layer organization.',
    inputFormat: 'SVG',
    outputFormat: 'SVG/DXF (Laser)',
    useCases: ['Laser engraving', 'Wood cutting', 'Acrylic cutting'],
    keywords: [
      'svg for laser cutting',
      'laser cutter svg',
      'glowforge svg',
      'laser ready svg',
    ],
    content: generateContent('SVG', 'Laser', 'laser-workflow'),
    schema: {
      toolName: 'SVG for Laser Cutting Converter',
      inputName: 'SVG File',
      outputName: 'Laser-Ready SVG/DXF',
      steps: [
        { name: 'Upload', text: 'Upload SVG' },
        { name: 'Configure', text: 'Set kerf and layer settings' },
        { name: 'Download', text: 'Download for laser cutter' },
      ],
    },
  },

  'svg-for-vinyl-cutting': {
    title: 'SVG for Vinyl Cutting',
    seoTitle: 'SVG for Vinyl Cutting - Vinyl Cutter Compatible Files',
    seoDescription:
      'Optimize SVG for vinyl cutters. Welding-friendly paths, color separation, weed box generation. Free tool.',
    inputFormat: 'SVG',
    outputFormat: 'SVG (Vinyl)',
    useCases: ['Vinyl cutting', 'Decal design', 'T-shirt graphics'],
    keywords: [
      'svg for vinyl cutting',
      'vinyl cutter svg',
      'vinyl svg',
      'vinyl ready svg',
    ],
    content: generateContent('SVG', 'Vinyl', 'vinyl-workflow'),
    schema: {
      toolName: 'SVG for Vinyl Cutting Converter',
      inputName: 'SVG File',
      outputName: 'Vinyl-Ready SVG',
      steps: [
        { name: 'Upload', text: 'Upload SVG' },
        { name: 'Optimize', text: 'Prepare for vinyl cutter' },
        { name: 'Download', text: 'Download vinyl SVG' },
      ],
    },
  },

  'svg-for-embroidery': {
    title: 'SVG for Embroidery',
    seoTitle: 'SVG to Embroidery - Convert SVG to Stitch Files (DST, PES, JEF)',
    seoDescription:
      'Convert SVG files to embroidery formats (DST, PES, JEF). Stitch optimization, thread color mapping. DST for Brother, PES, JEF support.',
    inputFormat: 'SVG',
    outputFormat: 'DST/PES/JEF',
    useCases: ['Machine embroidery', 'Embroidered design', 'Clothing decoration'],
    keywords: [
      'svg for embroidery',
      'svg to dst',
      'svg to pes',
      'embroidery converter',
    ],
    content: generateContent('SVG', 'Embroidery', 'embroidery-workflow'),
    schema: {
      toolName: 'SVG for Embroidery Converter',
      inputName: 'SVG File',
      outputName: 'Embroidery Stitch File',
      steps: [
        { name: 'Upload', text: 'Upload SVG' },
        { name: 'Convert', text: 'Generate stitch data' },
        { name: 'Download', text: 'Download embroidery file' },
      ],
    },
  },

  'svg-for-3d-printing': {
    title: 'SVG for 3D Printing',
    seoTitle: 'SVG to 3MF - 3D Printing Converter (Bambu Lab AMS)',
    seoDescription:
      'Convert SVG to 3D printable format (3MF). Multicolor print support with filament assignments. Perfect for Bambu Lab, MakerBot.',
    inputFormat: 'SVG',
    outputFormat: '3MF',
    useCases: ['3D printing', 'Multicolor prints', 'Keychains'],
    keywords: ['svg for 3d printing', 'svg to 3mf', '3d printer svg', '3d print'],
    content: generateContent('SVG', '3D Printing', '3d-print-workflow'),
    schema: {
      toolName: 'SVG for 3D Printing Converter',
      inputName: 'SVG File',
      outputName: '3MF 3D Model',
      steps: [
        { name: 'Upload', text: 'Upload SVG' },
        { name: 'Configure', text: 'Set colors and filament' },
        { name: 'Download', text: 'Download 3MF file' },
      ],
    },
  },

  'svg-for-screen-printing': {
    title: 'SVG for Screen Printing',
    seoTitle: 'SVG for Screen Printing - Color Separation for Print',
    seoDescription:
      'Prepare SVG for screen printing with color separation. One layer per ink, halftone generator for gradients.',
    inputFormat: 'SVG',
    outputFormat: 'SVG (Screen Print)',
    useCases: ['Screen printing', 'T-shirt design', 'Print production'],
    keywords: [
      'svg for screen printing',
      'screen print svg',
      'color separation svg',
    ],
    content: generateContent('SVG', 'Screen Printing', 'screen-print-workflow'),
    schema: {
      toolName: 'SVG for Screen Printing Converter',
      inputName: 'SVG File',
      outputName: 'Screen Print Ready SVG',
      steps: [
        { name: 'Upload', text: 'Upload SVG' },
        { name: 'Separate', text: 'Create color separation layers' },
        { name: 'Download', text: 'Download for screen printer' },
      ],
    },
  },

  'svg-for-sublimation': {
    title: 'SVG for Sublimation',
    seoTitle: 'SVG for Sublimation - Heat Press Ready Files',
    seoDescription:
      'Convert SVG for sublimation printing. Mirrored images, bleed addition for edge-to-edge heat press transfers.',
    inputFormat: 'SVG',
    outputFormat: 'SVG (Sublimation)',
    useCases: ['Sublimation printing', 'Heat transfer', 'Ceramic coating'],
    keywords: ['svg for sublimation', 'sublimation svg', 'heat press svg'],
    content: generateContent('SVG', 'Sublimation', 'sublimation-workflow'),
    schema: {
      toolName: 'SVG for Sublimation Converter',
      inputName: 'SVG File',
      outputName: 'Sublimation Ready SVG',
      steps: [
        { name: 'Upload', text: 'Upload SVG' },
        { name: 'Optimize', text: 'Mirror and add bleed' },
        { name: 'Download', text: 'Download for sublimation' },
      ],
    },
  },

  'svg-for-dtf': {
    title: 'SVG for DTF',
    seoTitle: 'SVG for DTF - Direct-to-Film Printing Ready',
    seoDescription:
      'Convert SVG to DTF (Direct-to-Film) print format. Gang sheet builder, auto-nesting, 300 DPI PNG export.',
    inputFormat: 'SVG',
    outputFormat: 'DTF (300 DPI PNG)',
    useCases: ['DTF printing', 'Gang sheet printing', 'T-shirt production'],
    keywords: ['svg for dtf', 'dtf svg', 'direct to film svg'],
    content: generateContent('SVG', 'DTF', 'dtf-workflow'),
    schema: {
      toolName: 'SVG for DTF Converter',
      inputName: 'SVG File',
      outputName: 'DTF Print File (PNG)',
      steps: [
        { name: 'Upload', text: 'Upload SVG' },
        { name: 'Nest', text: 'Auto-nest on gang sheet' },
        { name: 'Download', text: 'Download 300 DPI print file' },
      ],
    },
  },

  'svg-for-etsy-sellers': {
    title: 'SVG for Etsy Sellers',
    seoTitle: 'SVG for Etsy - Optimize Designs for Etsy Sellers',
    seoDescription:
      'Optimize SVG files for Etsy sellers. Batch processing, AI-generated listings with SEO tags, product descriptions.',
    inputFormat: 'SVG',
    outputFormat: 'SVG + Listing Data',
    useCases: ['Etsy store optimization', 'Product listing', 'SEO improvement'],
    keywords: ['svg for etsy', 'etsy svg', 'etsy seller tools', 'listing generator'],
    content: generateContent('SVG', 'Etsy', 'etsy-workflow'),
    schema: {
      toolName: 'SVG for Etsy Sellers Tool',
      inputName: 'SVG Design',
      outputName: 'Optimized SVG + Listing',
      steps: [
        { name: 'Upload', text: 'Upload SVG' },
        { name: 'Generate', text: 'Create Etsy listing copy' },
        { name: 'Download', text: 'Download SVG + listing data' },
      ],
    },
  },

  'png-to-svg-for-cricut': {
    title: 'PNG to SVG for Cricut',
    seoTitle: 'PNG to SVG for Cricut - Convert PNG to Cricut Ready Design',
    seoDescription:
      'Convert PNG images directly to Cricut-ready SVG. Vectorize and optimize for Design Space in one step.',
    inputFormat: 'PNG',
    outputFormat: 'SVG (Cricut)',
    useCases: ['Cricut design conversion', 'Cut file creation', 'Craft design'],
    keywords: [
      'png to svg for cricut',
      'png to cricut',
      'cricut png converter',
    ],
    content: generateContent('PNG', 'Cricut SVG', 'cricut-conversion'),
    schema: {
      toolName: 'PNG to SVG for Cricut Converter',
      inputName: 'PNG Image',
      outputName: 'Cricut SVG',
      steps: [
        { name: 'Upload', text: 'Upload PNG' },
        { name: 'Vectorize', text: 'Convert to Cricut-ready SVG' },
        { name: 'Download', text: 'Download for Design Space' },
      ],
    },
  },

  'jpg-to-svg-for-silhouette': {
    title: 'JPG to SVG for Silhouette',
    seoTitle: 'JPG to SVG for Silhouette - Convert JPEG to Silhouette Studio SVG',
    seoDescription:
      'Convert JPG photos to Silhouette Studio-ready SVG. Vectorize and optimize for cutting machines in seconds.',
    inputFormat: 'JPG',
    outputFormat: 'SVG (Silhouette)',
    useCases: ['Silhouette design', 'Photo conversion', 'Cut file design'],
    keywords: ['jpg to svg for silhouette', 'jpg to silhouette', 'silhouette jpg'],
    content: generateContent('JPG', 'Silhouette SVG', 'silhouette-conversion'),
    schema: {
      toolName: 'JPG to SVG for Silhouette Converter',
      inputName: 'JPG Image',
      outputName: 'Silhouette SVG',
      steps: [
        { name: 'Upload', text: 'Upload JPG' },
        { name: 'Vectorize', text: 'Convert to Silhouette SVG' },
        { name: 'Download', text: 'Download for Studio' },
      ],
    },
  },

  'image-to-svg-for-cricut': {
    title: 'Image to SVG for Cricut',
    seoTitle: 'Image to SVG for Cricut - Convert Any Image to Cricut Design',
    seoDescription:
      'Convert any image (PNG, JPG, GIF) to Cricut-ready SVG. One-click vectorization and optimization.',
    inputFormat: 'Image',
    outputFormat: 'SVG (Cricut)',
    useCases: ['Cricut project', 'Design creation', 'DIY craft'],
    keywords: [
      'image to svg for cricut',
      'image to cricut',
      'cricut converter',
      'cricut design',
    ],
    content: generateContent('Image', 'Cricut SVG', 'cricut-workflow'),
    schema: {
      toolName: 'Image to SVG for Cricut Converter',
      inputName: 'Image File',
      outputName: 'Cricut SVG',
      steps: [
        { name: 'Upload', text: 'Upload any image' },
        { name: 'Convert', text: 'Vectorize for Cricut' },
        { name: 'Download', text: 'Download to Design Space' },
      ],
    },
  },

  'image-to-svg-for-canva': {
    title: 'Image to SVG for Canva',
    seoTitle: 'Image to SVG for Canva - Convert Images to Canva Compatible SVG',
    seoDescription:
      'Convert images to SVG format compatible with Canva. Maintain quality, perfect for Canva designs and projects.',
    inputFormat: 'Image',
    outputFormat: 'SVG (Canva)',
    useCases: ['Canva design', 'Social media graphics', 'Design creation'],
    keywords: ['image to svg for canva', 'canva svg', 'canva image converter'],
    content: generateContent('Image', 'Canva SVG', 'canva-workflow'),
    schema: {
      toolName: 'Image to SVG for Canva Converter',
      inputName: 'Image File',
      outputName: 'Canva SVG',
      steps: [
        { name: 'Upload', text: 'Upload image' },
        { name: 'Convert', text: 'Convert to Canva SVG' },
        { name: 'Download', text: 'Download for Canva' },
      ],
    },
  },

  'image-to-cut-file': {
    title: 'Image to Cut File',
    seoTitle: 'Image to Cut File - Convert Image to Cutter Ready Design',
    seoDescription:
      'Convert images to cut-ready files (SVG, DXF) for Cricut, Silhouette, and laser cutters. All formats supported.',
    inputFormat: 'Image',
    outputFormat: 'Cut File (SVG/DXF)',
    useCases: ['Cutting machine design', 'Craft project', 'Professional cut'],
    keywords: [
      'image to cut file',
      'cut file converter',
      'cutter svg',
      'cut design',
    ],
    content: generateContent('Image', 'Cut File', 'cutting-workflow'),
    schema: {
      toolName: 'Image to Cut File Converter',
      inputName: 'Image File',
      outputName: 'Cut-Ready File',
      steps: [
        { name: 'Upload', text: 'Upload image' },
        { name: 'Vectorize', text: 'Create cut paths' },
        { name: 'Download', text: 'Download SVG/DXF' },
      ],
    },
  },

  'logo-to-dxf': {
    title: 'Logo to DXF',
    seoTitle: 'Logo to DXF - Convert Logo to DXF for CNC and Laser',
    seoDescription:
      'Convert logo images to DXF format for laser cutters and CNC machines. Professional quality for manufacturing.',
    inputFormat: 'Logo',
    outputFormat: 'DXF',
    useCases: ['Laser cutting', 'CNC routing', 'Manufacturing'],
    keywords: ['logo to dxf', 'convert logo to dxf', 'dxf logo converter'],
    content: generateContent('Logo', 'DXF', 'manufacturing-format'),
    schema: {
      toolName: 'Logo to DXF Converter',
      inputName: 'Logo Image',
      outputName: 'DXF File',
      steps: [
        { name: 'Upload', text: 'Upload logo' },
        { name: 'Convert', text: 'Vectorize and export DXF' },
        { name: 'Download', text: 'Download DXF' },
      ],
    },
  },

  'logo-to-eps': {
    title: 'Logo to EPS',
    seoTitle: 'Logo to EPS - Convert Logo to EPS for Print Shops',
    seoDescription:
      'Convert logo images to EPS (Encapsulated PostScript) for professional print shops and Adobe Illustrator.',
    inputFormat: 'Logo',
    outputFormat: 'EPS',
    useCases: ['Print production', 'Adobe Illustrator', 'Professional printing'],
    keywords: ['logo to eps', 'convert logo to eps', 'eps logo converter'],
    content: generateContent('Logo', 'EPS', 'professional-format'),
    schema: {
      toolName: 'Logo to EPS Converter',
      inputName: 'Logo Image',
      outputName: 'EPS File',
      steps: [
        { name: 'Upload', text: 'Upload logo' },
        { name: 'Convert', text: 'Vectorize to EPS' },
        { name: 'Download', text: 'Download EPS' },
      ],
    },
  },

  'png-to-dxf': {
    title: 'PNG to DXF',
    seoTitle: 'PNG to DXF - Convert PNG to DXF for CNC Machining',
    seoDescription:
      'Convert PNG images to DXF format for CNC machines, laser cutters, and CAM software. Professional precision.',
    inputFormat: 'PNG',
    outputFormat: 'DXF',
    useCases: ['CNC machining', 'Laser cutting', 'CAM design'],
    keywords: ['png to dxf', 'convert png to dxf', 'dxf converter'],
    content: generateContent('PNG', 'DXF', 'manufacturing-format'),
    schema: {
      toolName: 'PNG to DXF Converter',
      inputName: 'PNG Image',
      outputName: 'DXF File',
      steps: [
        { name: 'Upload', text: 'Upload PNG' },
        { name: 'Convert', text: 'Export as DXF' },
        { name: 'Download', text: 'Download DXF' },
      ],
    },
  },

  'jpg-to-dxf': {
    title: 'JPG to DXF',
    seoTitle: 'JPG to DXF - JPEG to DXF for Laser and CNC',
    seoDescription:
      'Convert JPG images to DXF format for laser cutters and CNC machines. Fast, accurate, professional results.',
    inputFormat: 'JPG',
    outputFormat: 'DXF',
    useCases: ['Manufacturing', 'Laser design', 'CNC cutting'],
    keywords: ['jpg to dxf', 'jpeg to dxf', 'jpg dxf converter'],
    content: generateContent('JPG', 'DXF', 'manufacturing-format'),
    schema: {
      toolName: 'JPG to DXF Converter',
      inputName: 'JPG Image',
      outputName: 'DXF File',
      steps: [
        { name: 'Upload', text: 'Upload JPG' },
        { name: 'Vectorize', text: 'Create DXF' },
        { name: 'Download', text: 'Download DXF' },
      ],
    },
  },

  'embroidery-converter': {
    title: 'Embroidery Converter',
    seoTitle: 'Embroidery Converter - SVG to DST, PES, JEF Stitch Files',
    seoDescription:
      'Convert SVG designs to embroidery machine formats (DST, PES, JEF). Stitch optimization for Brother, Janome, Tajima machines.',
    inputFormat: 'SVG/Image',
    outputFormat: 'DST/PES/JEF',
    useCases: ['Machine embroidery', 'Clothing decoration', 'Custom embroidery'],
    keywords: [
      'embroidery converter',
      'svg to dst',
      'svg to pes',
      'embroidery files',
    ],
    content: generateContent('SVG', 'Embroidery', 'embroidery-general'),
    schema: {
      toolName: 'Embroidery Converter',
      inputName: 'SVG or Image',
      outputName: 'Embroidery Stitch File',
      steps: [
        { name: 'Upload', text: 'Upload design' },
        { name: 'Convert', text: 'Generate stitch data' },
        { name: 'Download', text: 'Download embroidery file' },
      ],
    },
  },

  // ============= CROSS-FORMAT CONVERSIONS (16) =============

  'svg-to-dxf': {
    title: 'SVG to DXF',
    seoTitle: 'SVG to DXF - Export Vectors for CNC and Laser Cutters',
    seoDescription:
      'Convert SVG vectors to DXF format for CNC machines and laser cutters. Maintain precision for professional manufacturing.',
    inputFormat: 'SVG',
    outputFormat: 'DXF',
    useCases: ['CNC routing', 'Laser cutting', 'CAD design'],
    keywords: ['svg to dxf', 'convert svg to dxf', 'dxf exporter'],
    content: generateContent('SVG', 'DXF', 'manufacturing-format'),
    schema: {
      toolName: 'SVG to DXF Converter',
      inputName: 'SVG File',
      outputName: 'DXF File',
      steps: [
        { name: 'Upload', text: 'Upload SVG' },
        { name: 'Convert', text: 'Export as DXF' },
        { name: 'Download', text: 'Download DXF' },
      ],
    },
  },

  'svg-to-eps': {
    title: 'SVG to EPS',
    seoTitle: 'SVG to EPS - Convert Vectors for Print Production',
    seoDescription:
      'Convert SVG vectors to EPS (Encapsulated PostScript) for professional printing and Adobe Illustrator editing.',
    inputFormat: 'SVG',
    outputFormat: 'EPS',
    useCases: ['Print shop delivery', 'Adobe editing', 'Professional print'],
    keywords: ['svg to eps', 'convert svg to eps', 'eps exporter'],
    content: generateContent('SVG', 'EPS', 'professional-format'),
    schema: {
      toolName: 'SVG to EPS Converter',
      inputName: 'SVG File',
      outputName: 'EPS File',
      steps: [
        { name: 'Upload', text: 'Upload SVG' },
        { name: 'Convert', text: 'Export as EPS' },
        { name: 'Download', text: 'Download EPS' },
      ],
    },
  },

  'svg-to-ai': {
    title: 'SVG to AI',
    seoTitle: 'SVG to AI - Convert SVG to Adobe Illustrator Format',
    seoDescription:
      'Convert SVG vectors to Adobe Illustrator (AI) format for professional editing and design work.',
    inputFormat: 'SVG',
    outputFormat: 'AI',
    useCases: ['Adobe editing', 'Professional design', 'Illustration'],
    keywords: ['svg to ai', 'convert svg to ai', 'ai converter', 'illustrator svg'],
    content: generateContent('SVG', 'AI', 'professional-format'),
    schema: {
      toolName: 'SVG to AI Converter',
      inputName: 'SVG File',
      outputName: 'Adobe Illustrator File',
      steps: [
        { name: 'Upload', text: 'Upload SVG' },
        { name: 'Convert', text: 'Export to AI format' },
        { name: 'Download', text: 'Download AI file' },
      ],
    },
  },

  'svg-to-g-code': {
    title: 'SVG to G-code',
    seoTitle: 'SVG to G-code - CNC Router and Laser Engraver Tool Path',
    seoDescription:
      'Convert SVG vectors to G-code for CNC routers and laser engravers. Generate tool paths for precision cutting.',
    inputFormat: 'SVG',
    outputFormat: 'G-code',
    useCases: ['CNC machining', 'Laser engraving', 'Tool path generation'],
    keywords: ['svg to gcode', 'gcode generator', 'cnc toolpath', 'laser engraver'],
    content: generateContent('SVG', 'G-code', 'cnc-format'),
    schema: {
      toolName: 'SVG to G-code Converter',
      inputName: 'SVG File',
      outputName: 'G-code File',
      steps: [
        { name: 'Upload', text: 'Upload SVG' },
        { name: 'Configure', text: 'Set machining parameters' },
        { name: 'Download', text: 'Download G-code' },
      ],
    },
  },

  'svg-to-dst': {
    title: 'SVG to DST',
    seoTitle: 'SVG to DST - Convert to Tajima Embroidery Format',
    seoDescription:
      'Convert SVG designs to DST format for Tajima embroidery machines. Stitch optimization and thread color mapping.',
    inputFormat: 'SVG',
    outputFormat: 'DST',
    useCases: ['Commercial embroidery', 'Tajima machines', 'Embroidery business'],
    keywords: ['svg to dst', 'dst embroidery', 'tajima format', 'embroidery dst'],
    content: generateContent('SVG', 'DST', 'embroidery-format'),
    schema: {
      toolName: 'SVG to DST Converter',
      inputName: 'SVG File',
      outputName: 'DST Embroidery File',
      steps: [
        { name: 'Upload', text: 'Upload SVG' },
        { name: 'Optimize', text: 'Generate stitch data' },
        { name: 'Download', text: 'Download DST' },
      ],
    },
  },

  'svg-to-pes': {
    title: 'SVG to PES',
    seoTitle: 'SVG to PES - Convert to Brother Embroidery Format',
    seoDescription:
      'Convert SVG designs to PES format for Brother embroidery machines. Compatible with all Brother models.',
    inputFormat: 'SVG',
    outputFormat: 'PES',
    useCases: ['Brother embroidery', 'Home embroidery', 'DIY embroidery'],
    keywords: ['svg to pes', 'brother embroidery', 'pes format', 'embroidery pes'],
    content: generateContent('SVG', 'PES', 'embroidery-format'),
    schema: {
      toolName: 'SVG to PES Converter',
      inputName: 'SVG File',
      outputName: 'PES Embroidery File',
      steps: [
        { name: 'Upload', text: 'Upload SVG' },
        { name: 'Convert', text: 'Generate Brother format' },
        { name: 'Download', text: 'Download PES' },
      ],
    },
  },

  'svg-to-jef': {
    title: 'SVG to JEF',
    seoTitle: 'SVG to JEF - Convert to Janome Embroidery Format',
    seoDescription:
      'Convert SVG designs to JEF format for Janome embroidery machines. Full compatibility with Janome models.',
    inputFormat: 'SVG',
    outputFormat: 'JEF',
    useCases: ['Janome embroidery', 'Machine embroidery', 'Embroidery business'],
    keywords: ['svg to jef', 'janome embroidery', 'jef format', 'embroidery jef'],
    content: generateContent('SVG', 'JEF', 'embroidery-format'),
    schema: {
      toolName: 'SVG to JEF Converter',
      inputName: 'SVG File',
      outputName: 'JEF Embroidery File',
      steps: [
        { name: 'Upload', text: 'Upload SVG' },
        { name: 'Convert', text: 'Generate Janome format' },
        { name: 'Download', text: 'Download JEF' },
      ],
    },
  },

  'png-to-eps': {
    title: 'PNG to EPS',
    seoTitle: 'PNG to EPS - Convert PNG to Print Ready EPS',
    seoDescription:
      'Convert PNG images to EPS format for professional printing and graphic design. Vector tracing included.',
    inputFormat: 'PNG',
    outputFormat: 'EPS',
    useCases: ['Print production', 'Professional design', 'Publishing'],
    keywords: ['png to eps', 'convert png to eps', 'eps converter'],
    content: generateContent('PNG', 'EPS', 'professional-format'),
    schema: {
      toolName: 'PNG to EPS Converter',
      inputName: 'PNG Image',
      outputName: 'EPS File',
      steps: [
        { name: 'Upload', text: 'Upload PNG' },
        { name: 'Vectorize', text: 'Convert to vector' },
        { name: 'Download', text: 'Download EPS' },
      ],
    },
  },

  'png-to-ai': {
    title: 'PNG to AI',
    seoTitle: 'PNG to AI - Convert PNG to Adobe Illustrator',
    seoDescription:
      'Convert PNG images to Adobe Illustrator (AI) format. Vectorized with full editing capability in Illustrator.',
    inputFormat: 'PNG',
    outputFormat: 'AI',
    useCases: ['Adobe editing', 'Professional design', 'Illustration'],
    keywords: ['png to ai', 'convert png to ai', 'ai converter'],
    content: generateContent('PNG', 'AI', 'professional-format'),
    schema: {
      toolName: 'PNG to AI Converter',
      inputName: 'PNG Image',
      outputName: 'Adobe Illustrator File',
      steps: [
        { name: 'Upload', text: 'Upload PNG' },
        { name: 'Vectorize', text: 'Convert to AI' },
        { name: 'Download', text: 'Download AI file' },
      ],
    },
  },

  'jpg-to-ai': {
    title: 'JPG to AI',
    seoTitle: 'JPG to AI - Convert JPEG to Adobe Illustrator',
    seoDescription:
      'Convert JPG photos to Adobe Illustrator (AI) format. Full vector tracing for professional editing.',
    inputFormat: 'JPG',
    outputFormat: 'AI',
    useCases: ['Photo editing', 'Professional design', 'Illustration'],
    keywords: ['jpg to ai', 'jpeg to ai', 'convert jpg to ai'],
    content: generateContent('JPG', 'AI', 'professional-format'),
    schema: {
      toolName: 'JPG to AI Converter',
      inputName: 'JPG Image',
      outputName: 'Adobe Illustrator File',
      steps: [
        { name: 'Upload', text: 'Upload JPG' },
        { name: 'Vectorize', text: 'Convert to AI' },
        { name: 'Download', text: 'Download AI file' },
      ],
    },
  },

  'jpg-to-eps': {
    title: 'JPG to EPS',
    seoTitle: 'JPG to EPS - Convert JPEG to EPS for Print',
    seoDescription:
      'Convert JPG images to EPS format for professional print shops and publications. Vector quality maintained.',
    inputFormat: 'JPG',
    outputFormat: 'EPS',
    useCases: ['Print production', 'Publishing', 'Professional printing'],
    keywords: ['jpg to eps', 'jpeg to eps', 'convert jpg to eps'],
    content: generateContent('JPG', 'EPS', 'professional-format'),
    schema: {
      toolName: 'JPG to EPS Converter',
      inputName: 'JPG Image',
      outputName: 'EPS File',
      steps: [
        { name: 'Upload', text: 'Upload JPG' },
        { name: 'Vectorize', text: 'Convert to EPS' },
        { name: 'Download', text: 'Download EPS' },
      ],
    },
  },

  'image-to-dst': {
    title: 'Image to DST',
    seoTitle: 'Image to DST - Convert Image to Tajima Embroidery',
    seoDescription:
      'Convert any image to DST embroidery format for Tajima machines. Stitch optimization and thread mapping.',
    inputFormat: 'Image',
    outputFormat: 'DST',
    useCases: ['Commercial embroidery', 'Custom embroidery', 'Machine embroidery'],
    keywords: ['image to dst', 'dst converter', 'embroidery converter'],
    content: generateContent('Image', 'DST', 'embroidery-format'),
    schema: {
      toolName: 'Image to DST Converter',
      inputName: 'Image File',
      outputName: 'DST Embroidery File',
      steps: [
        { name: 'Upload', text: 'Upload image' },
        { name: 'Convert', text: 'Generate stitch file' },
        { name: 'Download', text: 'Download DST' },
      ],
    },
  },

  'image-to-pes': {
    title: 'Image to PES',
    seoTitle: 'Image to PES - Convert Image to Brother Embroidery',
    seoDescription:
      'Convert images to PES format for Brother embroidery machines. Fast, accurate stitch generation.',
    inputFormat: 'Image',
    outputFormat: 'PES',
    useCases: ['Brother embroidery', 'Home embroidery', 'DIY embroidery'],
    keywords: ['image to pes', 'pes converter', 'brother embroidery'],
    content: generateContent('Image', 'PES', 'embroidery-format'),
    schema: {
      toolName: 'Image to PES Converter',
      inputName: 'Image File',
      outputName: 'PES Embroidery File',
      steps: [
        { name: 'Upload', text: 'Upload image' },
        { name: 'Convert', text: 'Generate Brother format' },
        { name: 'Download', text: 'Download PES' },
      ],
    },
  },

  'image-to-jef': {
    title: 'Image to JEF',
    seoTitle: 'Image to JEF - Convert Image to Janome Embroidery',
    seoDescription:
      'Convert images to JEF format for Janome embroidery machines. Professional stitch quality.',
    inputFormat: 'Image',
    outputFormat: 'JEF',
    useCases: ['Janome embroidery', 'Machine embroidery', 'Custom embroidery'],
    keywords: ['image to jef', 'jef converter', 'janome embroidery'],
    content: generateContent('Image', 'JEF', 'embroidery-format'),
    schema: {
      toolName: 'Image to JEF Converter',
      inputName: 'Image File',
      outputName: 'JEF Embroidery File',
      steps: [
        { name: 'Upload', text: 'Upload image' },
        { name: 'Convert', text: 'Generate Janome format' },
        { name: 'Download', text: 'Download JEF' },
      ],
    },
  },

  'image-to-g-code': {
    title: 'Image to G-code',
    seoTitle: 'Image to G-code - Convert Image to CNC Tool Path',
    seoDescription:
      'Convert images to G-code format for CNC routers and laser engravers. Generate precise tool paths.',
    inputFormat: 'Image',
    outputFormat: 'G-code',
    useCases: ['CNC machining', 'Laser engraving', 'Manufacturing'],
    keywords: ['image to gcode', 'gcode converter', 'cnc image'],
    content: generateContent('Image', 'G-code', 'cnc-format'),
    schema: {
      toolName: 'Image to G-code Converter',
      inputName: 'Image File',
      outputName: 'G-code File',
      steps: [
        { name: 'Upload', text: 'Upload image' },
        { name: 'Configure', text: 'Set machining parameters' },
        { name: 'Download', text: 'Download G-code' },
      ],
    },
  },

  // ============= ADDITIONAL FORMAT CONVERTERS (7) =============

  'avif-to-svg': {
    title: 'AVIF to SVG',
    seoTitle: 'AVIF to SVG - Convert Modern Image Format to Vector',
    seoDescription:
      'Convert AVIF images (modern web format) to scalable SVG vectors. Free, no signup required.',
    inputFormat: 'AVIF',
    outputFormat: 'SVG',
    useCases: ['Modern format conversion', 'Web graphics', 'Vector creation'],
    keywords: ['avif to svg', 'convert avif to vector', 'avif converter'],
    content: generateContent('AVIF', 'SVG', 'raster-to-vector'),
    schema: {
      toolName: 'AVIF to SVG Converter',
      inputName: 'AVIF Image',
      outputName: 'SVG Vector',
      steps: [
        { name: 'Upload', text: 'Upload AVIF' },
        { name: 'Convert', text: 'Convert to vector' },
        { name: 'Download', text: 'Download SVG' },
      ],
    },
  },

  'tga-to-svg': {
    title: 'TGA to SVG',
    seoTitle: 'TGA to SVG - Convert Targa Image to Vector',
    seoDescription:
      'Convert TGA (Targa) images to scalable SVG vectors. Supports legacy graphics format conversion.',
    inputFormat: 'TGA',
    outputFormat: 'SVG',
    useCases: ['Legacy format conversion', 'Game graphics', 'Vector creation'],
    keywords: ['tga to svg', 'targa to svg', 'convert tga to vector'],
    content: generateContent('TGA', 'SVG', 'raster-to-vector'),
    schema: {
      toolName: 'TGA to SVG Converter',
      inputName: 'TGA Image',
      outputName: 'SVG Vector',
      steps: [
        { name: 'Upload', text: 'Upload TGA' },
        { name: 'Convert', text: 'Convert to vector' },
        { name: 'Download', text: 'Download SVG' },
      ],
    },
  },

  'ico-to-svg': {
    title: 'ICO to SVG',
    seoTitle: 'ICO to SVG - Convert Icon File to Vector',
    seoDescription:
      'Convert ICO (favicon) files to scalable SVG vectors. Perfect for favicon modernization.',
    inputFormat: 'ICO',
    outputFormat: 'SVG',
    useCases: ['Favicon conversion', 'Icon vectorization', 'Web design'],
    keywords: ['ico to svg', 'favicon to svg', 'icon to svg', 'ico converter'],
    content: generateContent('ICO', 'SVG', 'raster-to-vector'),
    schema: {
      toolName: 'ICO to SVG Converter',
      inputName: 'ICO File',
      outputName: 'SVG Vector',
      steps: [
        { name: 'Upload', text: 'Upload ICO' },
        { name: 'Convert', text: 'Convert to vector' },
        { name: 'Download', text: 'Download SVG' },
      ],
    },
  },

  'pcx-to-svg': {
    title: 'PCX to SVG',
    seoTitle: 'PCX to SVG - Convert PCX Image to Vector',
    seoDescription:
      'Convert PCX (Paintbrush) images to scalable SVG vectors. Legacy format support for vintage graphics.',
    inputFormat: 'PCX',
    outputFormat: 'SVG',
    useCases: ['Legacy format conversion', 'Retro graphics', 'Vector creation'],
    keywords: ['pcx to svg', 'paintbrush to svg', 'convert pcx to vector'],
    content: generateContent('PCX', 'SVG', 'raster-to-vector'),
    schema: {
      toolName: 'PCX to SVG Converter',
      inputName: 'PCX Image',
      outputName: 'SVG Vector',
      steps: [
        { name: 'Upload', text: 'Upload PCX' },
        { name: 'Convert', text: 'Convert to vector' },
        { name: 'Download', text: 'Download SVG' },
      ],
    },
  },

  'ppm-to-svg': {
    title: 'PPM to SVG',
    seoTitle: 'PPM to SVG - Convert PPM Image to Vector',
    seoDescription:
      'Convert PPM (Portable Pixmap) images to scalable SVG vectors. Free format conversion.',
    inputFormat: 'PPM',
    outputFormat: 'SVG',
    useCases: ['Image format conversion', 'Vector creation', 'Graphics conversion'],
    keywords: ['ppm to svg', 'portable pixmap to svg', 'convert ppm'],
    content: generateContent('PPM', 'SVG', 'raster-to-vector'),
    schema: {
      toolName: 'PPM to SVG Converter',
      inputName: 'PPM Image',
      outputName: 'SVG Vector',
      steps: [
        { name: 'Upload', text: 'Upload PPM' },
        { name: 'Convert', text: 'Convert to vector' },
        { name: 'Download', text: 'Download SVG' },
      ],
    },
  },

  'svg-to-eps-print': {
    title: 'SVG to EPS Print',
    seoTitle: 'SVG to EPS for Print - Professional Print Ready Export',
    seoDescription:
      'Convert SVG to print-ready EPS with CMYK color separation. Professional printing quality.',
    inputFormat: 'SVG',
    outputFormat: 'EPS (Print)',
    useCases: ['Print production', 'Publishing', 'Professional print'],
    keywords: ['svg to eps print', 'svg to print eps', 'print ready eps'],
    content: generateContent('SVG', 'EPS Print', 'professional-format'),
    schema: {
      toolName: 'SVG to EPS Print Converter',
      inputName: 'SVG File',
      outputName: 'Print-Ready EPS',
      steps: [
        { name: 'Upload', text: 'Upload SVG' },
        { name: 'Prepare', text: 'Convert to print-ready EPS' },
        { name: 'Download', text: 'Download EPS' },
      ],
    },
  },

  'svg-to-3mf': {
    title: 'SVG to 3MF',
    seoTitle: 'SVG to 3MF - Convert to 3D Printing Format',
    seoDescription:
      'Convert SVG designs to 3MF format for 3D printing. Multicolor support with filament assignments.',
    inputFormat: 'SVG',
    outputFormat: '3MF',
    useCases: ['3D printing', 'Multicolor printing', 'Additive manufacturing'],
    keywords: ['svg to 3mf', '3d printing svg', 'convert svg to 3mf'],
    content: generateContent('SVG', '3MF', 'manufacturing-format'),
    schema: {
      toolName: 'SVG to 3MF Converter',
      inputName: 'SVG File',
      outputName: '3MF File',
      steps: [
        { name: 'Upload', text: 'Upload SVG' },
        { name: 'Configure', text: 'Set colors and filament' },
        { name: 'Download', text: 'Download 3MF' },
      ],
    },
  },
};

/**
 * Content generation function
 * Creates unique 800-1200 word SEO articles for each converter page
 */
function generateContent(
  inputFormat: string,
  outputFormat: string,
  category: string
): string {
  const templates: Record<string, (input: string, output: string) => string> = {
    'raster-to-vector': (inp, out) => `
<h1>Convert ${inp} to ${out} Instantly</h1>

<p>Transform your raster images into scalable vector graphics with our free ${inp} to ${out} converter. Whether you're working with logos, photos, or illustrations, our AI-powered vectorization tool delivers clean, professional results in seconds.</p>

<h2>What is ${inp}?</h2>

<p>${inp} is a raster image format that uses pixels to create images. While ${inp} files are widely supported and easy to share, they have limitations: you cannot scale them without quality loss, and they tend to have larger file sizes. When you zoom into a ${inp} image, you'll see pixels become blocky and the image loses clarity.</p>

<p>Common uses for ${inp} include web graphics, digital photography, and screenshots. However, when you need to resize, print, or further edit these images, ${inp} becomes problematic.</p>

<h2>Why Convert ${inp} to ${out}?</h2>

<p>${out} (Scalable Vector Graphics) is an XML-based vector format that stores images as mathematical equations and paths rather than pixels. This means:</p>

<ul>
  <li><strong>Infinite Scalability:</strong> Scale your image to any size without losing quality</li>
  <li><strong>Smaller File Sizes:</strong> Vector files are typically much smaller than raster equivalents</li>
  <li><strong>Professional Quality:</strong> Perfect for printing, logos, and professional designs</li>
  <li><strong>Easy Editing:</strong> Modify colors, paths, and shapes in vector editors</li>
  <li><strong>Web Friendly:</strong> ${out} files work natively in modern web browsers</li>
  <li><strong>Future-Proof:</strong> Vector formats are designed for longevity</li>
</ul>

<p>Converting ${inp} to ${out} is essential for anyone who needs professional, scalable graphics. Designers, agencies, e-commerce stores, and print shops all rely on vector files for quality and consistency.</p>

<h2>How to Convert ${inp} to ${out}</h2>

<ol>
  <li><strong>Upload Your File:</strong> Click the upload button and select your ${inp} image. Our converter accepts files up to 50MB.</li>
  <li><strong>Wait for Processing:</strong> Our AI analyzes your image, detecting edges and creating vector paths. This typically takes 2-5 seconds.</li>
  <li><strong>Preview Your Result:</strong> Review the ${out} preview. You can zoom in to check quality and see how the vectorization performed.</li>
  <li><strong>Download:</strong> Download your new ${out} file in standard or compressed format.</li>
</ol>

<p>Our conversion process uses advanced edge detection and path tracing algorithms to ensure accurate, clean results. The AI automatically handles color quantization and shape merging for professional-quality output.</p>

<h2>Use Cases for ${inp} to ${out} Conversion</h2>

<h3>Logo Vectorization</h3>
<p>Convert your logo ${inp} to ${out} for consistent reproduction across all media. Whether it's your website, business cards, or billboards, a vectorized logo maintains perfect quality at any size.</p>

<h3>Print Design</h3>
<p>Print shops require vector files. Convert your ${inp} designs to ${out} for professional printing on posters, banners, and packaging.</p>

<h3>Web Design</h3>
<p>${out} graphics load faster and scale beautifully on any device. Convert your web graphics from ${inp} to ${out} for better performance and visual fidelity.</p>

<h3>Icon Creation</h3>
<p>Perfect for converting icon sets from ${inp} to ${out}. Icons as vectors can be resized for any display size without quality loss.</p>

<h3>Brand Assets</h3>
<p>Build a professional brand asset library with vectorized logos and graphics in ${out} format.</p>

<h2>FAQ</h2>

<h3>Is the conversion free?</h3>
<p>Yes! We offer a free watermarked preview so you can see the quality before committing. Premium downloads are available for a small fee.</p>

<h3>How accurate is the vectorization?</h3>
<p>Our AI uses industry-standard edge detection and path tracing. Quality depends on your source image—crisp, high-contrast images vectorize best. Low-resolution or very complex images may require manual cleanup.</p>

<h3>Can I edit the ${out} file after conversion?</h3>
<p>Absolutely! Download your ${out} file and open it in any vector editor like Adobe Illustrator, CorelDRAW, or free tools like Inkscape.</p>

<h3>What file sizes do you support?</h3>
<p>We support ${inp} files up to 50MB. Larger files may take longer to process.</p>

<h3>Can I convert multiple files at once?</h3>
<p>Yes! Use our batch conversion feature to convert up to 50 images at once.</p>

<p>Convert your ${inp} images to professional ${out} vectors today. Start with our free preview to see the quality difference.</p>
`,

    'vector-to-raster': (inp, out) => `
<h1>Convert ${inp} to ${out} Files</h1>

<p>Need to convert your vector graphics to raster format? Our ${inp} to ${out} converter quickly transforms scalable ${inp} files into ${out} raster images with adjustable quality settings.</p>

<h2>What is ${inp}?</h2>

<p>${inp} (Scalable Vector Graphics) is a modern vector format that uses mathematical equations to store images as paths and shapes. Unlike raster formats that use pixels, ${inp} files can scale infinitely without quality loss. They're commonly used for logos, icons, and web graphics because they're lightweight and look sharp at any size.</p>

<h2>Why Convert ${inp} to ${out}?</h2>

<p>While ${inp} is great for scalable graphics, sometimes you need a raster format like ${out}. Common reasons include:</p>

<ul>
  <li><strong>Compatibility:</strong> Not all applications support ${inp}</li>
  <li><strong>Raster Editing:</strong> Some photo editing tasks require raster format</li>
  <li><strong>Social Media:</strong> ${out} uploads faster to social platforms</li>
  <li><strong>Email:</strong> ${out} embeds more reliably in emails</li>
  <li><strong>Legacy Systems:</strong> Older software may only accept ${out}</li>
</ul>

<h2>How to Convert ${inp} to ${out}</h2>

<ol>
  <li><strong>Upload:</strong> Select your ${inp} file using the upload button.</li>
  <li><strong>Choose Quality:</strong> Select your desired ${out} resolution (72 DPI for web, 300 DPI for print).</li>
  <li><strong>Preview:</strong> See how your ${inp} looks as ${out} before downloading.</li>
  <li><strong>Download:</strong> Get your ${out} file instantly.</li>
</ol>

<h2>Use Cases</h2>

<p>Convert ${inp} to ${out} for social media graphics, email templates, web mockups, and compatibility with applications that don't support vector formats.</p>

<p>Start converting your ${inp} files to ${out} today!</p>
`,

    'format-conversion': (inp, out) => `
<h1>Convert ${inp} to ${out} Format</h1>

<p>Easily convert ${inp} files to ${out} format with our fast, reliable converter. Perfect for professional design work and format compatibility.</p>

<h2>What is ${inp}?</h2>

<p>${inp} is a professional graphics format used in design and publishing. Understanding the unique features and uses of ${inp} helps you make informed decisions about format conversion.</p>

<h2>Benefits of ${out} Format</h2>

<ul>
  <li>Better compatibility with design software</li>
  <li>Improved file handling and transfer</li>
  <li>Enhanced printing capabilities</li>
  <li>Better compression without quality loss</li>
</ul>

<h2>How to Convert ${inp} to ${out}</h2>

<p>Our simple three-step process makes converting ${inp} to ${out} easy:</p>

<ol>
  <li>Upload your ${inp} file</li>
  <li>Wait for conversion (usually under 30 seconds)</li>
  <li>Download your new ${out} file</li>
</ol>

<h2>Use Cases</h2>

<p>Convert ${inp} to ${out} for printing, professional publishing, web publishing, or when working with different design tools and workflows.</p>

<p>Convert your files today with our fast, free converter!</p>
`,

    'general-use-case': (inp, out) => `
<h1>${inp} to ${out} Converter</h1>

<p>Convert any ${inp} to scalable ${out} vectors instantly. Our AI-powered converter handles all image types with professional results.</p>

<h2>What Makes Our Converter Different?</h2>

<ul>
  <li>AI-powered edge detection for accuracy</li>
  <li>Handles complex images and gradients</li>
  <li>Instant results in seconds</li>
  <li>Free preview before downloading</li>
  <li>No signup required</li>
</ul>

<h2>Conversion Steps</h2>

<ol>
  <li>Upload your ${inp}</li>
  <li>AI processes and vectorizes</li>
  <li>Download your ${out}</li>
</ol>

<h2>Perfect For</h2>

<p>Logo design, icon creation, web graphics, print materials, and any project requiring scalable vector graphics.</p>

<p>Start converting now - it's free and takes just seconds!</p>
`,

    'professional-use-case': (inp, out) => `
<h1>Professional ${inp} to ${out} Conversion</h1>

<p>Convert ${inp} to professional-grade ${out} for design, printing, and publishing workflows.</p>

<h2>Professional Features</h2>

<ul>
  <li>High-quality vectorization with precise path tracing</li>
  <li>Color preservation and accurate color mapping</li>
  <li>Professional output suitable for print and web</li>
  <li>Batch processing for multiple files</li>
  <li>Advanced optimization options</li>
</ul>

<h2>Use Cases</h2>

<p>Perfect for design agencies, marketing professionals, print shops, and anyone requiring publication-ready graphics.</p>

<p>Convert your ${inp} files to professional ${out} today!</p>
`,

    'creative-use-case': (inp, out) => `
<h1>Transform Your ${inp} Into Vector ${out}</h1>

<p>Bring your creative ideas to life by converting ${inp} to editable, scalable ${out} vectors.</p>

<h2>Creative Possibilities</h2>

<ul>
  <li>Digitize hand-drawn artwork</li>
  <li>Create custom illustrations</li>
  <li>Design unique graphics</li>
  <li>Build vector art libraries</li>
  <li>Collaborate with design tools</li>
</ul>

<h2>Perfect For Artists and Designers</h2>

<p>Whether you're an illustrator, graphic designer, or artist, converting ${inp} to ${out} opens new creative possibilities.</p>

<p>Start your creative project today!</p>
`,

    'technical-use-case': (inp, out) => `
<h1>Technical ${inp} to ${out} Conversion</h1>

<p>Convert ${inp} to ${out} for technical applications, CAD, and professional workflows.</p>

<h2>Technical Advantages</h2>

<ul>
  <li>Precise geometry conversion</li>
  <li>Maintains technical accuracy</li>
  <li>Compatible with CAD software</li>
  <li>Professional precision for manufacturing</li>
</ul>

<h2>Applications</h2>

<p>Perfect for engineers, architects, manufacturers, and technical professionals requiring precise file conversions.</p>

<p>Convert your technical ${inp} files today!</p>
`,

    'cricut-workflow': (inp, out) => `
<h1>Convert ${inp} to Cricut-Ready ${out}</h1>

<p>Prepare your designs for Cricut cutting machines instantly. Our converter optimizes ${inp} files for Cricut Design Space with layered, weld-ready paths.</p>

<h2>Cricut Optimization Features</h2>

<ul>
  <li>Design Space compatible format</li>
  <li>Closed, weld-ready paths</li>
  <li>Proper layering for cutting</li>
  <li>Works with all Cricut models (Maker, Explore, Joy)</li>
</ul>

<h2>Perfect For</h2>

<p>DIY crafters, vinyl cutting projects, iron-on designs, and anyone using Cricut machines for personalized creations.</p>

<p>Get your Cricut design ready now!</p>
`,

    'silhouette-workflow': (inp, out) => `
<h1>Convert ${inp} to Silhouette Studio ${out}</h1>

<p>Optimize your designs for Silhouette cutting machines. Our converter creates Studio-compatible ${out} files ready for cutting.</p>

<h2>Silhouette Features</h2>

<ul>
  <li>Studio software compatible</li>
  <li>Cut-ready paths</li>
  <li>Proper design formatting</li>
  <li>All Silhouette model support</li>
</ul>

<h2>Use Cases</h2>

<p>Create vinyl decals, heat transfer designs, and cut files for Silhouette cutting machines.</p>

<p>Prepare your Silhouette design today!</p>
`,

    'laser-workflow': (inp, out) => `
<h1>Convert ${inp} to Laser Cutter Ready ${out}</h1>

<p>Prepare professional laser cutting files from ${inp}. Our converter creates optimized ${out}/DXF files for Glowforge, xTool, and LightBurn.</p>

<h2>Laser Optimization</h2>

<ul>
  <li>Glowforge, xTool, and LightBurn compatible</li>
  <li>DXF export for CNC machines</li>
  <li>Kerf settings and layer organization</li>
  <li>Engraving vs. cutting layer separation</li>
</ul>

<h2>Perfect For</h2>

<p>Wood cutting, acrylic engraving, leather work, and laser manufacturing projects.</p>

<p>Prepare your laser file now!</p>
`,

    'vinyl-workflow': (inp, out) => `
<h1>Convert ${inp} to Vinyl Cutter Ready ${out}</h1>

<p>Create weeding-friendly vinyl designs with our ${inp} to ${out} converter. Features color separation and weed box generation.</p>

<h2>Vinyl Features</h2>

<ul>
  <li>Weeding-friendly path design</li>
  <li>Color separation layers</li>
  <li>Weed box generation</li>
  <li>Professional vinyl ready format</li>
</ul>

<h2>Use Cases</h2>

<p>Vinyl decals, car wraps, window graphics, and promotional materials.</p>

<p>Create your vinyl design now!</p>
`,

    'embroidery-workflow': (inp, out) => `
<h1>Convert ${inp} to Embroidery Format ${out}</h1>

<p>Transform your designs into embroidery stitch files. Our converter creates optimized ${out} files with stitch optimization and thread color mapping.</p>

<h2>Embroidery Features</h2>

<ul>
  <li>Stitch path optimization</li>
  <li>Thread color mapping</li>
  <li>DST, PES, and JEF format support</li>
  <li>Professional stitch quality</li>
</ul>

<h2>Machine Compatibility</h2>

<p>Compatible with Brother, Janome, Tajima, and all major embroidery machines.</p>

<p>Create your embroidery file today!</p>
`,

    '3d-print-workflow': (inp, out) => `
<h1>Convert ${inp} to 3D Printing Format ${out}</h1>

<p>Prepare designs for 3D printing with multicolor support. Our converter creates 3MF files with filament assignments for Bambu Lab and other 3D printers.</p>

<h2>3D Print Features</h2>

<ul>
  <li>Multicolor print support with AMS</li>
  <li>Automatic filament assignment</li>
  <li>Ring hole generation for keychains</li>
  <li>Bambu Lab and MakerBot compatible</li>
</ul>

<h2>Perfect For</h2>

<p>3D printed logos, keychains, decorative items, and multicolor art.</p>

<p>Prepare your 3D print now!</p>
`,

    'screen-print-workflow': (inp, out) => `
<h1>Convert ${inp} to Screen Print Ready ${out}</h1>

<p>Create color-separated layers for screen printing. Our converter optimizes designs for professional print production.</p>

<h2>Screen Print Features</h2>

<ul>
  <li>Color separation by ink</li>
  <li>Halftone generator for gradients</li>
  <li>Professional print specifications</li>
  <li>Production-ready output</li>
</ul>

<h2>Use Cases</h2>

<p>T-shirt designs, promotional materials, and custom apparel.</p>

<p>Create your screen print design now!</p>
`,

    'sublimation-workflow': (inp, out) => `
<h1>Convert ${inp} to Sublimation Print Ready ${out}</h1>

<p>Prepare heat press designs with mirror and bleed settings. Perfect for edge-to-edge sublimation printing.</p>

<h2>Sublimation Features</h2>

<ul>
  <li>Automatic image mirroring</li>
  <li>Bleed addition for edge-to-edge prints</li>
  <li>Heat press ready format</li>
  <li>Professional print quality</li>
</ul>

<h2>Perfect For</h2>

<p>Ceramic coating, heat transfer, and sublimation printing projects.</p>

<p>Create your sublimation design now!</p>
`,

    'dtf-workflow': (inp, out) => `
<h1>Convert ${inp} to DTF Print Ready ${out}</h1>

<p>Create gang sheet designs for Direct-to-Film printing. Our converter auto-nests designs and exports 300 DPI print-ready files.</p>

<h2>DTF Features</h2>

<ul>
  <li>Gang sheet builder with auto-nesting</li>
  <li>Waste reduction through optimization</li>
  <li>300 DPI print-ready PNG export</li>
  <li>Professional DTF quality</li>
</ul>

<h2>Use Cases</h2>

<p>T-shirt production, apparel decoration, and professional DTF printing.</p>

<p>Create your DTF print file now!</p>
`,

    'etsy-workflow': (inp, out) => `
<h1>Optimize ${inp} for Etsy Sales</h1>

<p>Prepare your designs for Etsy with batch optimization and AI-generated product listings. Increase visibility with SEO-optimized descriptions and tags.</p>

<h2>Etsy Optimization</h2>

<ul>
  <li>Batch processing multiple designs</li>
  <li>AI-generated listing titles and tags</li>
  <li>SEO-optimized product descriptions</li>
  <li>Professional presentation guidelines</li>
</ul>

<h2>Increase Sales</h2>

<p>Better listings mean better visibility. Our AI generates compelling copy that helps buyers find your designs.</p>

<p>Optimize your Etsy shop today!</p>
`,

    'cricut-conversion': (inp, out) => `
<h1>${inp} to Cricut SVG - One-Click Conversion</h1>

<p>Convert ${inp} images directly to Cricut-ready ${out} in seconds. Skip the manual work and get cutting immediately.</p>

<h2>Instant Cricut Files</h2>

<ul>
  <li>Vectorize ${inp} for Cricut Design Space</li>
  <li>Layered, weld-ready paths</li>
  <li>Compatible with all Cricut models</li>
  <li>Ready to cut instantly</li>
</ul>

<p>Get your Cricut file now!</p>
`,

    'silhouette-conversion': (inp, out) => `
<h1>${inp} to Silhouette SVG - Fast Conversion</h1>

<p>Convert ${inp} to Silhouette Studio-compatible ${out} with one click.</p>

<h2>Studio Ready</h2>

<ul>
  <li>Vectorized from ${inp}</li>
  <li>Studio software compatible</li>
  <li>Cut-ready immediately</li>
</ul>

<p>Create your Silhouette file now!</p>
`,

    'canva-workflow': (inp, out) => `
<h1>${inp} to Canva Compatible ${out}</h1>

<p>Prepare your ${inp} for Canva designs. Convert to ${out} that works seamlessly in Canva editor.</p>

<h2>Canva Ready</h2>

<ul>
  <li>Optimized for Canva editor</li>
  <li>Easy design integration</li>
  <li>Professional quality</li>
</ul>

<p>Create your Canva design now!</p>
`,

    'cutting-workflow': (inp, out) => `
<h1>${inp} to Cut File - All Cutters Supported</h1>

<p>Convert ${inp} to universal cut files that work with Cricut, Silhouette, and laser cutters.</p>

<h2>Universal Compatibility</h2>

<ul>
  <li>Works with all cutting machines</li>
  <li>Professional cut quality</li>
  <li>Instant file generation</li>
</ul>

<p>Get your cut file now!</p>
`,

    'manufacturing-format': (inp, out) => `
<h1>Convert ${inp} to ${out} for Manufacturing</h1>

<p>Professional quality ${out} files optimized for manufacturing, CNC machines, and laser cutters.</p>

<h2>Manufacturing Ready</h2>

<ul>
  <li>Precision geometry</li>
  <li>CNC and laser compatible</li>
  <li>Professional specifications</li>
  <li>Production quality</li>
</ul>

<p>Create your manufacturing file now!</p>
`,

    'professional-format': (inp, out) => `
<h1>Convert ${inp} to Professional ${out}</h1>

<p>Get publication-ready ${out} files optimized for professional design work, printing, and publishing.</p>

<h2>Professional Quality</h2>

<ul>
  <li>High-quality conversion</li>
  <li>Professional specifications</li>
  <li>Compatible with Adobe Creative Suite</li>
  <li>Print and web ready</li>
</ul>

<p>Convert your professional file now!</p>
`,

    'cnc-format': (inp, out) => `
<h1>Convert ${inp} to CNC ${out}</h1>

<p>Generate precise ${out} tool paths for CNC routers, laser engravers, and precision manufacturing.</p>

<h2>CNC Ready</h2>

<ul>
  <li>Precise toolpath generation</li>
  <li>CNC and laser compatible</li>
  <li>Professional precision</li>
  <li>Production quality</li>
</ul>

<p>Create your CNC file now!</p>
`,

    'embroidery-format': (inp, out) => `
<h1>Convert to Embroidery Format ${out}</h1>

<p>Professional embroidery file generation with stitch optimization and thread color mapping.</p>

<h2>Embroidery Ready</h2>

<ul>
  <li>Multiple machine support (Brother, Janome, Tajima)</li>
  <li>Stitch optimization</li>
  <li>Thread color mapping</li>
  <li>Professional stitch quality</li>
</ul>

<p>Create your embroidery file now!</p>
`,

    'embroidery-general': (inp, out) => `
<h1>Embroidery File Converter</h1>

<p>Convert designs to professional embroidery formats. Support for all major embroidery machine types.</p>

<h2>Supported Machines</h2>

<ul>
  <li>Brother embroidery machines</li>
  <li>Janome embroidery systems</li>
  <li>Tajima commercial machines</li>
  <li>All major embroidery hardware</li>
</ul>

<p>Create your embroidery file now!</p>
`,

    'vector-to-format': (inp, out) => `
<h1>Convert ${inp} to ${out} Format</h1>

<p>Export your vector files in ${out} format for printing, publishing, and distribution.</p>

<h2>Format Features</h2>

<ul>
  <li>Professional export quality</li>
  <li>Compatible with standard software</li>
  <li>Print ready</li>
  <li>Fast conversion</li>
</ul>

<p>Convert your file now!</p>
`,
  };

  const template = templates[category] || templates['general-use-case'];
  return template(inputFormat, outputFormat);
}

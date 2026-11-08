#!/usr/bin/env node
/**
 * Generate demo raster/vector pairs with specialized use cases
 * Run: node scripts/generate-demo-pairs.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const demosDir = path.join(__dirname, "../public/demo");
const examplesDir = path.join(demosDir, "examples");

// Ensure directories exist
if (!fs.existsSync(examplesDir)) {
  fs.mkdirSync(examplesDir, { recursive: true });
}

/**
 * Create a raster-style SVG (pixelated/detailed)
 */
function createRasterSVG(name, content) {
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <!-- ${name} - Raster (detailed/pixelated) -->
  ${content}
</svg>`;
}

/**
 * Create a vector-style SVG (clean/simplified)
 */
function createVectorSVG(name, content) {
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <!-- ${name} - Vector (clean/traced) -->
  ${content}
</svg>`;
}

// ============================================================================
// EXAMPLE DEFINITIONS
// ============================================================================

const examples = {
  // Specialized use case: Embroidery Pattern
  "embroidery-pattern": {
    raster: createRasterSVG(
      "Embroidery Pattern",
      `
  <defs>
    <pattern id="cross" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
      <rect width="8" height="8" fill="#f5e6d3"/>
      <line x1="0" y1="4" x2="8" y2="4" stroke="#d4a574" stroke-width="0.5"/>
      <line x1="4" y1="0" x2="4" y2="8" stroke="#d4a574" stroke-width="0.5"/>
    </pattern>
  </defs>
  <rect width="200" height="200" fill="url(#cross)"/>
  <path d="M 60 50 Q 80 40 100 50 Q 120 60 140 50 L 140 80 Q 120 90 100 85 Q 80 90 60 80 Z" fill="none" stroke="#8b6914" stroke-width="1.5" stroke-dasharray="2,1"/>
  <circle cx="100" cy="60" r="8" fill="#d4a574" opacity="0.7"/>
  <circle cx="75" cy="75" r="6" fill="#d4a574" opacity="0.5"/>
  <circle cx="125" cy="75" r="6" fill="#d4a574" opacity="0.5"/>
  `
    ),
    vector: createVectorSVG(
      "Embroidery Pattern",
      `
  <rect width="200" height="200" fill="#f5e6d3"/>
  <g stroke="#8b6914" stroke-width="2" fill="none">
    <path d="M 60 50 Q 80 40 100 50 Q 120 60 140 50 L 140 80 Q 120 90 100 85 Q 80 90 60 80 Z"/>
    <circle cx="100" cy="60" r="8"/>
    <circle cx="75" cy="75" r="6"/>
    <circle cx="125" cy="75" r="6"/>
  </g>
  `
    ),
  },

  // Specialized use case: T-Shirt Print Design
  "tshirt-print": {
    raster: createRasterSVG(
      "T-Shirt Print",
      `
  <rect width="200" height="200" fill="#e8e8e8"/>
  <circle cx="100" cy="100" r="45" fill="#2a2a2a" opacity="0.8"/>
  <path d="M 85 95 L 95 85 L 105 95 L 105 115 L 95 115 L 95 105 L 105 105" fill="#e8e8e8" stroke="#e8e8e8" stroke-width="0.5"/>
  <circle cx="100" cy="75" r="3" fill="#e8e8e8"/>
  <path d="M 75 100 L 85 100 M 125 100 L 115 100" stroke="#e8e8e8" stroke-width="1.5" stroke-linecap="round"/>
  <circle cx="100" cy="100" r="45" fill="none" stroke="#999" stroke-width="1" stroke-dasharray="3,2" opacity="0.6"/>
  `
    ),
    vector: createVectorSVG(
      "T-Shirt Print",
      `
  <rect width="200" height="200" fill="#f0f0f0"/>
  <circle cx="100" cy="100" r="45" fill="#1a1a1a"/>
  <g fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M 90 90 L 100 80 L 110 90 L 110 115"/>
    <line x1="90" y1="115" x2="110" y2="115"/>
    <line x1="100" y1="100" x2="100" y2="115"/>
    <circle cx="100" cy="70" r="2.5" fill="white"/>
    <line x1="70" y1="100" x2="130" y2="100" stroke-width="2"/>
  </g>
  `
    ),
  },

  // Specialized use case: Mug Design
  "mug-design": {
    raster: createRasterSVG(
      "Mug Design",
      `
  <ellipse cx="100" cy="50" rx="50" ry="15" fill="#f5f5f5" stroke="#999" stroke-width="0.8"/>
  <path d="M 50 50 L 50 150 Q 50 160 60 160 L 140 160 Q 150 160 150 150 L 150 50" fill="#f5f5f5" stroke="#999" stroke-width="1"/>
  <ellipse cx="100" cy="160" rx="50" ry="10" fill="#e0e0e0" stroke="#999" stroke-width="0.8"/>
  <ellipse cx="145" cy="95" rx="12" ry="25" fill="none" stroke="#999" stroke-width="1"/>
  <path d="M 70 90 L 80 70 Q 90 60 100 70 L 110 90" fill="#ff6b6b" stroke="#d63031" stroke-width="1.5" opacity="0.8"/>
  <circle cx="90" cy="85" r="3" fill="#d63031" opacity="0.6"/>
  `
    ),
    vector: createVectorSVG(
      "Mug Design",
      `
  <ellipse cx="100" cy="50" rx="50" ry="14" fill="white" stroke="#333" stroke-width="1.5"/>
  <path d="M 50 50 L 50 150 Q 50 158 58 158 L 142 158 Q 150 158 150 150 L 150 50" fill="white" stroke="#333" stroke-width="1.5"/>
  <ellipse cx="100" cy="158" rx="50" ry="9" fill="#f0f0f0" stroke="#333" stroke-width="1.5"/>
  <ellipse cx="152" cy="95" rx="10" ry="24" fill="none" stroke="#333" stroke-width="1.5"/>
  <path d="M 72 88 Q 82 65 100 72 Q 118 80 128 88" fill="#ff5252" stroke="none"/>
  <circle cx="95" cy="80" r="2.5" fill="#ff5252"/>
  `
    ),
  },

  // Specialized use case: Laser Cutting Pattern
  "laser-cutting": {
    raster: createRasterSVG(
      "Laser Cutting Pattern",
      `
  <rect width="200" height="200" fill="#fff8dc"/>
  <defs>
    <pattern id="wood" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
      <rect width="20" height="20" fill="#daa520"/>
      <line x1="0" y1="0" x2="20" y2="20" stroke="#8b6914" stroke-width="0.3"/>
    </pattern>
  </defs>
  <path d="M 50 50 L 150 50 Q 160 50 160 60 L 160 140 Q 160 150 150 150 L 50 150 Q 40 150 40 140 L 40 60 Q 40 50 50 50" fill="url(#wood)" stroke="#333" stroke-width="1.2"/>
  <circle cx="60" cy="70" r="8" fill="none" stroke="#333" stroke-width="1"/>
  <circle cx="140" cy="70" r="8" fill="none" stroke="#333" stroke-width="1"/>
  <path d="M 100 100 L 120 120 M 100 120 L 120 100" stroke="#333" stroke-width="1.2" stroke-linecap="round"/>
  `
    ),
    vector: createVectorSVG(
      "Laser Cutting Pattern",
      `
  <rect width="200" height="200" fill="#fdf4e6"/>
  <path d="M 50 50 L 150 50 Q 158 50 158 58 L 158 142 Q 158 150 150 150 L 50 150 Q 42 150 42 142 L 42 58 Q 42 50 50 50" fill="none" stroke="#2c2c2c" stroke-width="2"/>
  <circle cx="60" cy="70" r="7" fill="none" stroke="#2c2c2c" stroke-width="1.5"/>
  <circle cx="140" cy="70" r="7" fill="none" stroke="#2c2c2c" stroke-width="1.5"/>
  <line x1="100" y1="100" x2="120" y2="120" stroke="#2c2c2c" stroke-width="2" stroke-linecap="round"/>
  <line x1="100" y1="120" x2="120" y2="100" stroke="#2c2c2c" stroke-width="2" stroke-linecap="round"/>
  `
    ),
  },

  // Specialized use case: Vinyl Sticker
  "vinyl-sticker": {
    raster: createRasterSVG(
      "Vinyl Sticker",
      `
  <rect width="200" height="200" fill="transparent"/>
  <g opacity="0.9">
    <path d="M 100 30 L 130 60 L 120 90 L 100 100 L 80 90 L 70 60 Z" fill="#e74c3c" stroke="#c0392b" stroke-width="1"/>
    <path d="M 95 55 L 105 55 L 105 75 L 95 75 Z" fill="#fff" opacity="0.7" stroke="#999" stroke-width="0.5"/>
    <circle cx="100" cy="85" r="4" fill="#fff" opacity="0.7"/>
  </g>
  <path d="M 50 140 Q 100 160 150 140" fill="none" stroke="#95a5a6" stroke-width="1.5" stroke-dasharray="2,2" opacity="0.5"/>
  `
    ),
    vector: createVectorSVG(
      "Vinyl Sticker",
      `
  <path d="M 100 30 L 130 60 L 120 90 L 100 100 L 80 90 L 70 60 Z" fill="#e74c3c"/>
  <rect x="92" y="52" width="16" height="24" fill="white"/>
  <circle cx="100" cy="85" r="3.5" fill="white"/>
  `
    ),
  },

  // Additional high-quality examples
  "portrait-illustration": {
    raster: createRasterSVG(
      "Portrait Illustration",
      `
  <rect width="200" height="200" fill="#fce4ec"/>
  <circle cx="100" cy="70" r="28" fill="#f4a460" stroke="#daa520" stroke-width="1"/>
  <path d="M 80 60 Q 85 55 90 58" fill="none" stroke="#8b4513" stroke-width="1.2" stroke-linecap="round"/>
  <path d="M 120 60 Q 115 55 110 58" fill="none" stroke="#8b4513" stroke-width="1.2" stroke-linecap="round"/>
  <ellipse cx="85" cy="65" rx="3" ry="4" fill="#000"/>
  <ellipse cx="115" cy="65" rx="3" ry="4" fill="#000"/>
  <path d="M 100 75 L 100 82" stroke="#8b4513" stroke-width="1" stroke-linecap="round"/>
  <path d="M 95 88 Q 100 92 105 88" fill="#ff69b4" stroke="none"/>
  <path d="M 70 100 L 130 100 L 125 140 Q 100 150 75 140 Z" fill="#f4a460" stroke="#daa520" stroke-width="1"/>
  `
    ),
    vector: createVectorSVG(
      "Portrait Illustration",
      `
  <circle cx="100" cy="70" r="26" fill="#f4a460"/>
  <path d="M 82 58 Q 86 54 92 57" fill="none" stroke="#8b4513" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M 118 58 Q 114 54 108 57" fill="none" stroke="#8b4513" stroke-width="1.5" stroke-linecap="round"/>
  <circle cx="85" cy="65" r="2.5" fill="#000"/>
  <circle cx="115" cy="65" r="2.5" fill="#000"/>
  <line x1="100" y1="75" x2="100" y2="82" stroke="#8b4513" stroke-width="1.2" stroke-linecap="round"/>
  <path d="M 95 88 Q 100 91 105 88" fill="#ff69b4"/>
  <path d="M 72 100 L 128 100 L 123 138 Q 100 147 77 138 Z" fill="#f4a460"/>
  `
    ),
  },

  "geometric-abstract": {
    raster: createRasterSVG(
      "Geometric Abstract",
      `
  <rect width="200" height="200" fill="#f0f0f0"/>
  <polygon points="100,20 150,80 100,140 50,80" fill="#3498db" opacity="0.7" stroke="#2980b9" stroke-width="1"/>
  <circle cx="100" cy="80" r="30" fill="#e74c3c" opacity="0.6" stroke="#c0392b" stroke-width="1"/>
  <rect x="60" y="120" width="80" height="50" fill="#2ecc71" opacity="0.5" stroke="#27ae60" stroke-width="1"/>
  <path d="M 30 30 L 170 30 L 170 170 L 30 170 Z" fill="none" stroke="#95a5a6" stroke-width="1.5" stroke-dasharray="5,3"/>
  `
    ),
    vector: createVectorSVG(
      "Geometric Abstract",
      `
  <polygon points="100,20 150,80 100,140 50,80" fill="#3498db"/>
  <circle cx="100" cy="80" r="28" fill="#e74c3c"/>
  <rect x="62" y="122" width="76" height="46" fill="#2ecc71"/>
  `
    ),
  },

  "floral-ornament": {
    raster: createRasterSVG(
      "Floral Ornament",
      `
  <rect width="200" height="200" fill="#fffaf0"/>
  <circle cx="100" cy="100" r="35" fill="none" stroke="#daa520" stroke-width="1.5" stroke-dasharray="3,2"/>
  <g stroke="#e74c3c" stroke-width="1.2" fill="none">
    <path d="M 100 65 Q 110 75 100 85"/>
    <path d="M 135 100 Q 125 110 115 100"/>
    <path d="M 100 135 Q 90 125 100 115"/>
    <path d="M 65 100 Q 75 90 85 100"/>
  </g>
  <circle cx="100" cy="100" r="6" fill="#e74c3c"/>
  <circle cx="100" cy="70" r="5" fill="#e74c3c" opacity="0.8"/>
  <circle cx="130" cy="100" r="5" fill="#e74c3c" opacity="0.8"/>
  <circle cx="100" cy="130" r="5" fill="#e74c3c" opacity="0.8"/>
  <circle cx="70" cy="100" r="5" fill="#e74c3c" opacity="0.8"/>
  `
    ),
    vector: createVectorSVG(
      "Floral Ornament",
      `
  <circle cx="100" cy="100" r="33" fill="none" stroke="#daa520" stroke-width="1.5"/>
  <circle cx="100" cy="100" r="5" fill="#e74c3c"/>
  <circle cx="100" cy="68" r="4.5" fill="#e74c3c"/>
  <circle cx="132" cy="100" r="4.5" fill="#e74c3c"/>
  <circle cx="100" cy="132" r="4.5" fill="#e74c3c"/>
  <circle cx="68" cy="100" r="4.5" fill="#e74c3c"/>
  <g stroke="#d63031" stroke-width="1.2" fill="none" stroke-linecap="round">
    <line x1="100" y1="73" x2="100" y2="95"/>
    <line x1="127" y1="100" x2="105" y2="100"/>
    <line x1="100" y1="127" x2="100" y2="105"/>
    <line x1="73" y1="100" x2="95" y2="100"/>
  </g>
  `
    ),
  },

  "brush-stroke": {
    raster: createRasterSVG(
      "Brush Stroke",
      `
  <rect width="200" height="200" fill="#fafafa"/>
  <path d="M 30 50 Q 80 40 130 55 Q 150 60 170 50" fill="none" stroke="#000" stroke-width="3" stroke-linecap="round" opacity="0.7"/>
  <path d="M 30 100 Q 70 120 140 110 Q 160 108 170 100" fill="none" stroke="#333" stroke-width="2.5" stroke-linecap="round" opacity="0.8"/>
  <path d="M 40 150 Q 100 140 160 155" fill="none" stroke="#1a1a1a" stroke-width="2" stroke-linecap="round"/>
  `
    ),
    vector: createVectorSVG(
      "Brush Stroke",
      `
  <path d="M 30 50 Q 80 40 130 55 Q 150 60 170 50" fill="none" stroke="#000" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M 30 100 Q 70 120 140 110 Q 160 108 170 100" fill="none" stroke="#1a1a1a" stroke-width="2" stroke-linecap="round"/>
  <path d="M 40 150 Q 100 140 160 155" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round"/>
  `
    ),
  },

  "calligraphy-text": {
    raster: createRasterSVG(
      "Calligraphy",
      `
  <rect width="200" height="200" fill="#f5f5f5"/>
  <text x="100" y="90" font-family="Georgia, serif" font-size="48" font-weight="normal" text-anchor="middle" fill="#2c2c2c" opacity="0.8" letter-spacing="2">A</text>
  <path d="M 50 120 Q 100 110 150 120" fill="none" stroke="#8b7355" stroke-width="1" stroke-dasharray="2,2" opacity="0.4"/>
  `
    ),
    vector: createVectorSVG(
      "Calligraphy",
      `
  <text x="100" y="90" font-family="Georgia, serif" font-size="44" font-weight="normal" text-anchor="middle" fill="#1a1a1a">A</text>
  `
    ),
  },

  "icon-set": {
    raster: createRasterSVG(
      "Icon Set",
      `
  <g stroke="#333" stroke-width="1.2" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.8">
    <circle cx="50" cy="50" r="15"/>
    <rect x="35" y="90" width="30" height="30" rx="4"/>
    <path d="M 130 50 L 145 65 L 130 80 Z"/>
    <path d="M 115 90 L 130 110 L 145 90 Z"/>
    <circle cx="50" cy="150" r="12" fill="none" stroke-width="1.2"/>
    <line x1="130" y1="135" x2="160" y2="165"/>
    <circle cx="155" cy="160" r="8" fill="none" stroke-width="1.2"/>
  </g>
  `
    ),
    vector: createVectorSVG(
      "Icon Set",
      `
  <g stroke="#1a1a1a" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="50" cy="50" r="14"/>
    <rect x="36" y="92" width="28" height="28" rx="3"/>
    <polygon points="130,50 144,64 130,78"/>
    <polygon points="115,92 130,110 145,92"/>
    <circle cx="50" cy="150" r="11"/>
    <line x1="130" y1="135" x2="158" y2="163"/>
    <circle cx="152" cy="157" r="7"/>
  </g>
  `
    ),
  },
};

// ============================================================================
// WRITE FILES
// ============================================================================

Object.entries(examples).forEach(([name, { raster, vector }]) => {
  const rasterPath = path.join(examplesDir, `${name}-raster.svg`);
  const vectorPath = path.join(examplesDir, `${name}-vector.svg`);

  fs.writeFileSync(rasterPath, raster, "utf8");
  fs.writeFileSync(vectorPath, vector, "utf8");
  console.log(`✓ Created ${name}`);
});

console.log(`\n✓ Generated ${Object.keys(examples).length} demo pairs`);

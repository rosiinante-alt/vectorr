#!/usr/bin/env node
/**
 * Render a labeled coordinate grid over a source composite so crop
 * rectangles can be read off precisely by visual inspection.
 *
 * Usage: node scripts/grid-overlay.js <sourceFile> <outFile> [step]
 */
const sharp = require('sharp');
const path = require('path');

async function main() {
  const [, , src, out, stepArg] = process.argv;
  const step = Number(stepArg || 100);
  const img = sharp(src);
  const meta = await img.metadata();
  const { width, height } = meta;

  let grid = '';
  for (let x = 0; x <= width; x += step) {
    const major = x % (step * 5) === 0;
    grid += `<line x1="${x}" y1="0" x2="${x}" y2="${height}" stroke="${major ? '#ff00ff' : '#00ffff'}" stroke-width="${major ? 2 : 1}" opacity="0.85"/>`;
    if (x > 0 && x < width) {
      grid += `<text x="${x + 3}" y="14" fill="#ff00ff" font-size="13" font-family="monospace">${x}</text>`;
    }
  }
  for (let y = 0; y <= height; y += step) {
    const major = y % (step * 5) === 0;
    grid += `<line x1="0" y1="${y}" x2="${width}" y2="${y}" stroke="${major ? '#ff00ff' : '#00ffff'}" stroke-width="${major ? 2 : 1}" opacity="0.85"/>`;
    if (y > 0 && y < height) {
      grid += `<text x="3" y="${y - 3}" fill="#ff00ff" font-size="13" font-family="monospace">${y}</text>`;
    }
  }

  const svg = Buffer.from(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">${grid}</svg>`
  );

  await sharp(src)
    .composite([{ input: svg, top: 0, left: 0 }])
    .png()
    .toFile(out);

  console.log(`${path.basename(src)} ${width}x${height} -> ${out} (grid step ${step})`);
}

main();

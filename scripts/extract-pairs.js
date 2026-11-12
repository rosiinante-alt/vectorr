#!/usr/bin/env node
/**
 * Faithful before/after extraction for the Vectroy comparison showcase.
 *
 * Rules (from the approved plan):
 *  - Source originals in public/demo/sources/ are the only source of truth.
 *  - Crops isolate artwork only: no poster captions, borders, grids, labels,
 *    magnifier boxes or unrelated backgrounds.
 *  - No generative redraw, no inpainting, no pixel erasure. Baked source
 *    limitations (grid lines, control points, magnifier boxes, baked red
 *    cut-layer outline, label occlusion) are preserved and documented.
 *  - Before/after are placed on an identical canvas so they can be overlaid
 *    with a single physical divider.
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const sharp = require("sharp");

const ROOT = path.resolve(__dirname, "..");
const SRC_DIR = path.join(ROOT, "public", "demo", "sources");
const OUT_DIR = path.join(ROOT, "public", "demo", "examples");

const MARGIN = 24;

/**
 * Crop rectangles are given as {l,t,w,h} in the ORIGINAL source resolution.
 * `bg` optionally overrides the detected background colour.
 * `scaleTo` optionally requests a uniform resample of the BEFORE crop so its
 * height matches the AFTER crop (registration by shared landmark size only;
 * uniform scaling, no redraw).
 */
const PAIRS = [
  {
    index: 1,
    name: "pixel-heart",
    title: "Pixel Heart",
    source: "1download.png",
    before: { l: 4, t: 24, w: 113, h: 92 },
    after: { l: 175, t: 24, w: 106, h: 100 },
    limitations: [
      "A background grid is baked into the raster half of the source poster and crosses the artwork; it is preserved, not erased.",
      "The clean half retains visible vector control-point markers in the source image.",
      "The two heart shapes are not identical outlines, so registration aligns them by content bounds rather than by contour."
    ]
  },
  {
    index: 2,
    name: "apple",
    title: "Apple",
    source: "3.png",
    before: { l: 136, t: 264, w: 190, h: 208 },
    after: { l: 471, t: 264, w: 190, h: 208 },
    limitations: [
      "The clean half retains visible vector control-point and anchor markers in the source image.",
      "The raster half is an intentionally blurred/upscaled bitmap, so detail is not recoverable by registration."
    ]
  },
  {
    index: 3,
    name: "cityscape",
    title: "City Skyline",
    source: "4.png",
    before: { l: 54, t: 107, w: 490, h: 445 },
    after: { l: 763, t: 107, w: 465, h: 445 },
    limitations: [
      "The raster half carries a full-panel noise/grain texture that cannot be removed without redrawing.",
      "Building silhouettes differ between the two halves; the residual mismatch is disclosed rather than warped away."
    ]
  },
  {
    index: 4,
    name: "bird",
    title: "Bird Illustration",
    source: "43.png",
    before: { l: 68, t: 72, w: 433, h: 344 },
    after: { l: 553, t: 72, w: 433, h: 344 },
    limitations: [
      "The source crops the lower stems: the black RASTER/VECTOR label blocks of the poster occlude the stem region and are excluded, which also cuts the artwork short.",
      "Visible vector control points remain on the clean half."
    ]
  },
  {
    index: 5,
    name: "apple-illustrator",
    title: "Apple — vector editor",
    source: "5.png",
    before: { l: 264, t: 343, w: 344, h: 381 },
    after: { l: 731, t: 343, w: 347, h: 379 },
    limitations: [
      "This source is a screenshot of a vector editor; only the artwork region is extracted and all editor chrome, canvas borders and Before/After captions are excluded.",
      "Control points, anchor markers and a selection bounding box are visible on the clean half and are preserved."
    ]
  },
  {
    index: 6,
    name: "deer-full",
    title: "Red Deer — full",
    source: "7.png",
    before: { l: 28, t: 104, w: 562, h: 562 },
    after: { l: 610, t: 104, w: 562, h: 562 },
    limitations: [
      "The clean half has a red cut-layer outline baked into the source artwork; it is preserved, not removed.",
      "The raster half is a low-resolution render of the same artwork, so edges stay soft."
    ]
  },
  {
    index: 7,
    name: "deer-detail",
    title: "Red Deer — antler detail",
    source: "7.png",
    before: { l: 28, t: 736, w: 562, h: 562 },
    after: { l: 610, t: 736, w: 562, h: 562 },
    limitations: [
      "The clean half has a red cut-layer outline baked into the source artwork; it is preserved, not removed.",
      "The detail crop is registered on the antler mass, which sits left of centre in each panel, not on the panel centre."
    ]
  },
  {
    index: 8,
    name: "cursor-full",
    title: "Cursor — full shape",
    source: "do3wnload.png",
    before: { l: 35, t: 20, w: 264, h: 258 },
    after: { l: 35, t: 331, w: 264, h: 260 },
    limitations: [
      "The source arranges this pair by rows (raster above, clean below), not left/right.",
      "Magnification boxes and leader lines are drawn over the raster half in the source; they are preserved where they cross the artwork.",
      "The zoom captions and panel furniture of the source are excluded."
    ]
  },
  {
    index: 9,
    name: "cursor-zoom",
    title: "Cursor — magnified detail",
    source: "do3wnload.png",
    before: { l: 382, t: 27, w: 261, h: 246 },
    after: { l: 382, t: 338, w: 261, h: 244 },
    limitations: [
      "The two halves of this pair show different visible background and transparency in the source, so the detail itself does not sit on identical backgrounds.",
      "The 8x magnification captions are excluded."
    ]
  },
  {
    index: 10,
    name: "eagle",
    title: "Eagle Logo",
    source: "downlo56ad.png",
    before: { l: 58, t: 47, w: 467, h: 348 },
    after: { l: 560, t: 46, w: 467, h: 348 },
    limitations: [
      "The raster half is a blurred bitmap in the source; the softness is real and is preserved.",
      "Control points remain visible on the clean half."
    ]
  },
  {
    index: 11,
    name: "s-letter",
    title: "Letter S",
    source: "download.png",
    before: { l: 11, t: 11, w: 307, h: 296 },
    after: { l: 372, t: 11, w: 312, h: 296 },
    limitations: [
      "The purple taper illustration and the embedded small S are part of the source artwork and are preserved.",
      "The outer frame and the Raster/Vector format captions of the source are excluded."
    ]
  }
];

/** Sample the modal colour of a crop's border ring, used as background reference. */
async function detectBackground(buffer) {
  const { data, info } = await sharp(buffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const counts = new Map();
  const sample = (x, y) => {
    const i = (y * width + x) * channels;
    return [data[i], data[i + 1], data[i + 2]];
  };
  const push = (c) => {
    const k = c.join(",");
    counts.set(k, (counts.get(k) || 0) + 1);
  };
  // border ring
  for (let x = 0; x < width; x++) {
    push(sample(x, 0));
    push(sample(x, height - 1));
  }
  for (let y = 0; y < height; y++) {
    push(sample(0, y));
    push(sample(width - 1, y));
  }
  let best = null;
  let bestN = 0;
  for (const [k, n] of counts) {
    if (n > bestN) {
      bestN = n;
      best = k;
    }
  }
  return best ? best.split(",").map(Number) : [255, 255, 255];
}

/** Tight bounding box of pixels that differ from the background colour. */
async function contentBBox(buffer, bg, threshold = 26) {
  const { data, info } = await sharp(buffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels;
      const d =
        Math.abs(data[i] - bg[0]) +
        Math.abs(data[i + 1] - bg[1]) +
        Math.abs(data[i + 2] - bg[2]);
      if (d > threshold) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) return null;
  return { left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
}

function md5(file) {
  return crypto.createHash("md5").update(fs.readFileSync(file)).digest("hex");
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const manifestPairs = [];
  const excluded = [
    {
      source: "6.png",
      reason:
        "Two mirrored fox illustrations with directional controls; no verified before/after relationship and no demonstrated quality difference in the source. Excluded pending confirmation of provenance."
    }
  ];

  for (const pair of PAIRS) {
    const srcFile = path.join(SRC_DIR, pair.source);
    const meta = await sharp(srcFile).metadata();

    const sides = {};
    for (const side of ["before", "after"]) {
      const r = pair[side];
      const bg = pair.bg ? pair.bg : await detectBackground(
        await sharp(srcFile)
          .extract({ left: r.l, top: r.t, width: r.w, height: r.h })
          .toBuffer()
      );
      const raw = await sharp(srcFile)
        .extract({ left: r.l, top: r.t, width: r.w, height: r.h })
        .toBuffer();
      const bbox = await contentBBox(raw, bg);
      const region = bbox
        ? { left: r.l + bbox.left, top: r.t + bbox.top, width: bbox.width, height: bbox.height }
        : r;
      const art = await sharp(srcFile)
        .extract({ left: region.left, top: region.top, width: region.width, height: region.height })
        .flatten({ background: bg })
        .png()
        .toBuffer();
      sides[side] = { art, width: region.width, height: region.height, region, bg };
    }

    // Registration: match heights by uniform scaling when they differ, so the
    // shared landmarks line up. Never a redraw, never a non-uniform warp.
    let scale = 1;
    const hBefore = sides.before.height;
    const hAfter = sides.after.height;
    if (hBefore > 0 && hAfter > 0) {
      const ratio = hAfter / hBefore;
      if (ratio > 0.8 && ratio < 1.25 && Math.abs(ratio - 1) > 0.02) {
        scale = ratio;
      }
    }

    const beforeImg = scale === 1
      ? sides.before.art
      : await sharp(sides.before.art)
          .resize({ height: Math.round(hBefore * scale), kernel: "lanczos3" })
          .png()
          .toBuffer();
    const bW = Math.round(sides.before.width * scale);
    const bH = Math.round(hBefore * scale);
    const aW = sides.after.width;
    const aH = sides.after.height;

    const canvasW = Math.max(bW, aW) + MARGIN * 2;
    const canvasH = Math.max(bH, aH) + MARGIN * 2;

    const composite = async (buf, w, h, file) => {
      await sharp({
        create: {
          width: canvasW,
          height: canvasH,
          channels: 4,
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        }
      })
        .composite([{ input: buf, left: MARGIN, top: MARGIN }])
        .png()
        .toFile(file);
    };

    const beforeFile = path.join(OUT_DIR, `image-${String(pair.index).padStart(2, "0")}-before.png`);
    const afterFile = path.join(OUT_DIR, `image-${String(pair.index).padStart(2, "0")}-after.png`);
    await composite(beforeImg, bW, bH, beforeFile);
    await composite(sides.after.art, aW, aH, afterFile);

    manifestPairs.push({
      index: pair.index,
      name: pair.name,
      title: pair.title,
      before: `image-${String(pair.index).padStart(2, "0")}-before.png`,
      after: `image-${String(pair.index).padStart(2, "0")}-after.png`,
      canvas_size: [canvasW, canvasH],
      source: pair.source,
      source_size: [meta.width, meta.height],
      source_checksum: md5(srcFile),
      crop_rect: {
        before: [sides.before.region.left, sides.before.region.top, sides.before.region.width, sides.before.region.height],
        after: [sides.after.region.left, sides.after.region.top, sides.after.region.width, sides.after.region.height]
      },
      registration: {
        method: "content-bounds alignment on shared canvas",
        before_scale: Number(scale.toFixed(4)),
        uniform_scale_applied: scale !== 1
      },
      limitations: pair.limitations
    });

    console.log(
      `${pair.index} ${pair.name}: canvas ${canvasW}x${canvasH} scale ${scale.toFixed(3)} ` +
      `before ${sides.before.region.width}x${sides.before.region.height} after ${sides.after.region.width}x${sides.after.region.height}`
    );
  }

  const manifest = {
    version: "2.0",
    generated: new Date().toISOString(),
    method:
      "Artwork-level crops taken from the original source composites, isolated by content bounds against the detected background, registered on an identical canvas. No generative redraw, no inpainting, no pixel erasure.",
    pairs: manifestPairs,
    excluded_sources: excluded
  };
  fs.writeFileSync(
    path.join(OUT_DIR, "comparisons-manifest.json"),
    JSON.stringify(manifest, null, 2) + "\n"
  );

  const legacy = {
    version: "2.0",
    generated: manifest.generated,
    pairs: manifestPairs.map((p) => ({
      index: p.index,
      name: p.name,
      before: p.before,
      after: p.after,
      canvas_size: p.canvas_size,
      source: p.source,
      source_checksum: p.source_checksum
    }))
  };
  fs.writeFileSync(path.join(OUT_DIR, "manifest.json"), JSON.stringify(legacy, null, 2) + "\n");
  console.log("done");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

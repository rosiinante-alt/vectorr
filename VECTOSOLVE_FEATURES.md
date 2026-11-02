# VectoSolve Feature Extraction & Vectorr Roadmap

**Date**: Nov 2, 2026  
**Source**: https://vectosolve.com (complete site scrape)  
**Purpose**: Extract ALL features from VectoSolve to implement in Vectorr

---

## 🚨 CRITICAL CORRECTION

**Vectorr's current scope is WRONG**:
- ❌ We built: SVG → Optimized SVG (path simplification, node reduction)
- ✅ VectoSolve does: PNG/JPG/WEBP → SVG (raster to vector AI conversion)

**This is a fundamentally different product**. VectoSolve is an **image vectorization tool**, not an SVG optimizer.

---

## Core Features (Must-Have for MVP)

### 1. Image to SVG Conversion (PRIMARY FEATURE)
- **Input formats**: PNG, JPG, JPEG, WEBP, GIF, TIFF, BMP, HEIC, AVIF
- **Output format**: SVG (scalable vector graphics)
- **Processing time**: 2-5 seconds
- **Technology**: AI-powered edge detection + path tracing
- **Quality**: Clean paths, closed shapes, merged similar colors
- **Preview**: Free watermarked preview BEFORE payment

### 2. Background Removal (Pre-Processing)
- **Speed**: ~3 seconds
- **Cost**: 0.07 credits
- **Output**: Transparent PNG
- **Use case**: Remove busy backgrounds before vectorizing logos
- **AI-powered**: Perfect edge detection
- **Workflow integration**: Remove BG → Vectorize in one flow

### 3. Image Upscaling (Pre-Processing)
- **Scales**: 2x or 4x resolution
- **Cost**: 0.15 credits
- **Speed**: ~10 seconds
- **Technology**: AI enhancement (not just pixel doubling)
- **Max input size**: 10MB
- **Use case**: Upscale low-res images before vectorizing

### 4. Color Editing (Post-Processing)
- **Recolor SVG**: Change individual colors in the preview
- **Merge similar colors**: Automatic detection of near-identical colors
- **Remove colors**: Delete unwanted color layers
- **Use case**: Clean up logos, simplify color palettes

### 5. Batch Processing
- **Max files**: 50 images at once
- **Parallel processing**: 3 images simultaneously
- **Upload**: Drag & drop multiple files or ZIP upload
- **Download**: Single ZIP file with all results
- **Progress tracking**: Real-time status for each file
- **Background removal toggle**: Apply to all files at once

---

## Export Formats (Machine-Specific)

VectoSolve exports the SAME conversion to multiple formats:

### Vector Formats
- **SVG** (primary output)
- **DXF** (AutoCAD, laser cutters, CNC)
- **EPS** (print shops, Adobe Illustrator)
- **AI** (Adobe Illustrator native)
- **PDF** (vector PDF for print)

### Embroidery Formats
- **DST** (Tajima, commercial machines)
- **PES** (Brother embroidery machines)
- **JEF** (Janome embroidery machines)

### CNC/CAM Formats
- **G-code** (CNC routers, laser engravers)
- **DXF R12** (legacy CAM software)

### 3D Printing
- **3MF** (multicolor 3D prints, Bambu Lab AMS)
  - One part per color
  - Numbered filament assignments
  - Ring hole for keychains

---

## AI-Powered Tools (Revenue Drivers)

### 1. AI Logo Generator
- **Cost**: 0.25 credits
- **Input**: Text prompt describing logo concept
- **Output**: Professional vector logo in SVG
- **Styles**: Multiple design styles to choose from
- **Commercial use**: Included

### 2. AI SVG Generator (Text to SVG)
- **Cost**: 0.25 credits
- **Input**: Text description of desired graphic
- **Output**: Vector illustration/icon/graphic
- **Use case**: Generate icons, illustrations, designs from scratch

### 3. AI Pattern Generator
- **Cost**: 0.25 credits
- **Input**: Text description of pattern
- **Output**: Seamless, tileable SVG pattern
- **Use case**: Textiles, web backgrounds, print

### 4. AI Image Generator
- **Cost**: 0.50 credits
- **Input**: Text prompt
- **Output**: Raster image (PNG/JPG)
- **Then**: Can be vectorized (additional 0.20 credits)

### 5. Brand Identity Generator
- **Cost**: 2.50 credits (most expensive tool)
- **Input**: Brand name + description
- **Output**:
  - Logo (multiple variations)
  - Color palette (hex codes)
  - Typography recommendations
  - Favicon (all sizes: ICO, PNG)
  - Social media covers (Twitter, Facebook, LinkedIn)
  - Brand guidelines document

### 6. AI SVG Animation
- **Tiers**:
  - **Eco** (Gemini Flash): 0.10 credits
  - **Standard** (Gemini 2.5 Pro): 0.25 credits
  - **Pro** (Gemini 3.1 Pro): 0.50 credits
- **Input**: Text description of animation
- **Output**: Animated SVG with CSS keyframes
- **Alternative**: 7 free presets (no AI, manual timeline editor)

### 7. AI Content Generator
- **Cost**: 0.10 credits (Etsy listing, alt text), 0.25 credits (blog article)
- **Input**: Uploaded SVG file
- **Output**:
  - Etsy listing (title + tags + description)
  - Alt text (accessibility description)
  - SEO blog article (~800 words)
- **Use case**: Automate product listings, improve SEO

---

## Free Tools (No Credits Required)

### 1. SVG Editor
- **Features**: Edit colors, paths, transforms, code
- **In-browser**: No install
- **Live preview**: Changes update instantly

### 2. SVG to PNG Converter
- **100% free**, runs in browser
- **No upload**: Client-side conversion
- **Quality settings**: Adjustable resolution

### 3. SVG Optimizer
- **Minify & clean**: Remove bloat, reduce file size up to 80%
- **SVGO-based**: Industry-standard optimization
- **Free**: No credits required

### 4. Favicon Generator
- **Input**: Single image
- **Output**: All favicon sizes (ICO, PNG, 16x16 to 512x512)
- **Includes**: manifest.json, browserconfig.xml

### 5. QR Code SVG Generator
- **Input**: URL or text
- **Output**: Vector QR code (SVG)
- **Customizable**: Colors, size, error correction level

### 6. SVG Animator (Manual)
- **7 free animation presets**: FadeIn, SlideUp, Bounce, etc.
- **Timeline editor**: Visual keyframe editor
- **Export**: Animated SVG with CSS

### 7. SVG Templates
- **Free & premium templates**
- **Categories**: Cricut, Silhouette, laser cutting
- **Download**: Ready-to-cut SVG files

---

## Specialized Workflows (Niche Tools)

### For Crafters & Makers

1. **SVG for Cricut**
   - Layered SVG for Design Space
   - Closed paths (weld-ready)
   - Compatible with Maker, Explore, Joy models

2. **SVG for Silhouette**
   - Studio-compatible SVGs
   - Cut-ready paths

3. **SVG for Laser Cutting**
   - DXF + SVG export
   - Compatible with LightBurn, Glowforge, xTool
   - Kerf settings, engraving vs cutting layers

4. **SVG for Embroidery**
   - Convert SVG → DST/PES/JEF stitch files
   - Stitch optimization
   - Thread color mapping

5. **SVG for 3D Printing (Bambu Lab)**
   - Multicolor AMS layers
   - 3MF with filament assignments
   - Logo → keychain workflow

6. **SVG for Vinyl Cutting**
   - Weeding-friendly paths
   - Color separation layers
   - Weed box generation

7. **SVG for Screen Printing**
   - Color-separated layers (one per ink)
   - Halftone generator for gradients

8. **SVG for Sublimation**
   - Mirrored images (for heat press)
   - Bleed addition (edge-to-edge prints)

9. **SVG for DTF (Direct-to-Film)**
   - Gang sheet builder (pack designs onto 22" sheets)
   - Auto-nesting to reduce waste
   - 300 DPI PNG export

10. **SVG for Etsy Sellers**
    - Batch optimization
    - AI-generated listings (title, tags, description)
    - SEO-optimized product pages

### Advanced Maker Tools (Free, In-Browser)

11. **Gear Generator**
    - Involute spur gears for laser/CNC
    - Set teeth, module, pressure angle
    - Export SVG/DXF at true size

12. **Living Hinge Generator**
    - Kerf-bend patterns for flexible plywood/acrylic
    - Real mm measurements
    - Lattice spacing control

13. **Finger Joint Box Generator**
    - Press-fit laser-cut boxes
    - Set size, material thickness, kerf
    - Flat panel layout (SVG/DXF)

14. **Material Test Card Generator**
    - Power/speed grid for laser testing
    - LightBurn, Glowforge, xTool compatible
    - Find optimal settings in one run

15. **Nesting Tool**
    - Pack cut parts onto sheets
    - Reduce material waste
    - Auto-rotation, gap control

16. **Sticker Sheet Maker**
    - Tile designs onto print-then-cut sheets
    - Cricut/Letter/A4 sizes
    - Cut lines included

17. **Halftone Generator**
    - Convert images to dot patterns
    - Screen printing, risograph compatible
    - Dot size, spacing, angle control

18. **Vinyl Color Matcher**
    - Match SVG colors to Oracal 651, Siser EasyWeed, 3M vinyl
    - Free color lookup database

19. **Thread Color Mapper**
    - Match SVG colors to Madeira, Brother, Isacord thread
    - Embroidery thread database

20. **Cut File Checker**
    - Check for double lines, gaps, open paths
    - Score 0-100 (cut-readiness)
    - Laser, Cricut, CNC compatible

21. **DTF Gang Sheet Builder**
    - Pack PNG designs onto 22" DTF sheets
    - Auto-nesting algorithm
    - 300 DPI print-ready export

22. **Mirror & Bleed Tool**
    - Mirror for sublimation/DTF
    - Add bleed for edge-to-edge prints

23. **Sticker Cut Line Generator**
    - Die-cut contour around transparent PNG
    - Print & Cut SVG for Cricut/Silhouette
    - Offset in mm

24. **Coloring Page Maker**
    - Convert SVG to printable outlines
    - Black outlines, white background

25. **Print Cost Calculator**
    - DTF vs screen printing break-even analysis
    - Custom shop rates

26. **Text to SVG**
    - Type text, pick font, download cut-ready SVG
    - 18 Google Fonts
    - Converted to paths (no font install needed)

---

## Pricing Model (Critical for Revenue)

### Free Tier
- **1 free watermarked preview per day**
- **No signup required**
- **See quality before paying**

### One-Time Purchase
- **$6.99 per file** (unlock specific converted file)
- **No subscription**
- **Offered after conversion** (not sold standalone)

### Starter Plan (Most Popular)
- **$7.99/month** (or $4.08/mo billed yearly at $49)
- **25 conversions/month** (5 credits)
- **$0.16 per file** (yearly rate)
- **Unused credits roll over**
- **Cancel anytime**

### Pro Plan
- **$14.99/month** (or $10.75/mo billed yearly at $129)
- **100 conversions/month** (20 credits)
- **$0.11 per file** (yearly rate)
- **4x volume of Starter**
- **Unused credits roll over**

### Credit System
All tools share ONE credit balance:

| Tool | Cost (Credits) | What 5 Credits = |
|------|----------------|------------------|
| Vectorize (PNG→SVG) | 0.20 | 25 conversions |
| Remove Background | 0.07 | 71 removals |
| Upscale (2x/4x) | 0.15 | 33 upscales |
| AI Logo Generator | 0.25 | 20 logos |
| AI SVG Generator | 0.25 | 20 SVGs |
| AI Pattern Generator | 0.25 | 20 patterns |
| SVG Animation (Eco) | 0.10 | 50 animations |
| SVG Animation (Standard) | 0.25 | 20 animations |
| SVG Animation (Pro) | 0.50 | 10 animations |
| AI Content Generator | 0.10 | 50 descriptions |
| AI Image Generator | 0.50 | 10 images |
| Brand Identity Kit | 2.50 | 2 kits |

### Custom/Enterprise
- **Volumeheavy users**
- **API access**
- **Batch processing at scale**
- **Custom formats**
- **Talk to sales**

---

## UX Flow (Conversion Funnel)

### Step 1: Upload
- Drag & drop or file picker
- Multiple files at once (batch)
- Progress indicator for each file
- Format validation (shows error if unsupported)

### Step 2: Preview (FREE)
- Full-quality watermarked preview in 2-5 seconds
- Zoom in/out to check edges
- Toggle background removal
- Recolor individual colors
- Pan around image

### Step 3: Decision Point
- **Option A**: Download watermarked preview (free, no signup)
- **Option B**: Unlock this file for $6.99 (one-time)
- **Option C**: Subscribe for recurring use (Starter/Pro)

### Step 4: Download
- **Formats available**:
  - SVG (default)
  - DXF (laser/CNC)
  - EPS (print)
  - AI (Illustrator)
  - PDF (vector print)
  - DST/PES/JEF (embroidery)
  - G-code (CNC)
  - 3MF (3D print)
- **Download individually** or **ZIP all**

### Step 5: Post-Download Options
- **Edit in SVG Editor** (free tool)
- **Animate with AI** (additional credits)
- **Generate Etsy listing** (additional credits)
- **Batch convert more files**

---

## Marketing Pages & Use Cases

VectoSolve has **67 converter landing pages** (SEO-optimized):

### Format Converters
- PNG to SVG
- JPG to SVG
- JPEG to SVG
- WEBP to SVG
- GIF to SVG
- HEIC to SVG
- TIFF to SVG
- BMP to SVG
- AI to SVG
- EPS to SVG
- PDF to SVG
- PSD to SVG

### Reverse Converters
- SVG to PNG
- SVG to GIF
- SVG to WebP
- SVG to PDF
- SVG to EPS
- SVG to AI
- SVG to DXF
- SVG to G-code
- SVG to DST/PES/JEF

### Cross-Format
- PNG to DXF
- JPG to DXF
- PNG to EPS
- PNG to AI
- JPG to AI
- Image to DST
- Image to PES
- Image to JEF
- Image to G-code
- Logo to DXF
- Logo to EPS

### Use-Case Specific
- Image to Vector
- Raster to Vector
- Photo to Vector
- Logo to Vector
- Sketch to Vector
- Picture to SVG
- Bitmap to SVG
- Trace Image to SVG
- Photo to SVG
- Logo to SVG
- Clipart to SVG
- Watercolor to SVG
- Sticker Design to SVG
- Image to Cut File
- JPG to SVG for Cricut
- PNG to SVG for Silhouette
- Image to SVG for Cricut
- Image to SVG for Canva

---

## Technical Implementation Notes

### AI Models Used
- **Vectorization**: Proprietary edge detection + path tracing AI
- **Background removal**: Likely U²-Net or similar segmentation model
- **Upscaling**: Super-resolution GAN (ESRGAN or similar)
- **Logo/SVG generation**: Diffusion model → SVG converter
- **Animation**: Google Gemini API (Flash, 2.5 Pro, 3.1 Pro tiers)
- **Content generation**: Google Gemini API

### Processing Pipeline
1. **Upload** → S3/Cloud Storage
2. **Preprocessing** (optional):
   - Background removal (AI segmentation)
   - Upscaling (super-resolution)
3. **Vectorization** (core AI):
   - Edge detection
   - Path tracing
   - Color quantization
   - Shape merging
4. **Post-processing**:
   - Path simplification
   - Node reduction
   - Color merging (similar colors)
   - Speck removal
5. **Export**:
   - SVG (default)
   - Convert to DXF/EPS/AI/PDF (geometry translation)
   - Convert to DST/PES/JEF (stitch generation, separate AI)
   - Convert to G-code (toolpath generation)

### Performance Targets
- **Vectorization**: 2-5 seconds
- **Background removal**: ~3 seconds
- **Upscaling**: ~10 seconds
- **Batch**: 3 parallel workers, 50 files in <2 minutes

---

## Key Differentiators (Why VectoSolve Wins)

1. **Free preview BEFORE payment** (competitors charge upfront)
2. **All export formats included** (no extra fees per format)
3. **Credit system** (one balance for all tools)
4. **Unused credits roll over** (never expire while active)
5. **Failed conversion = automatic refund** (no tickets)
6. **No signup to try** (lower barrier to entry)
7. **Batch processing** (50 files at once)
8. **AI content generation** (Etsy listings, SEO articles)
9. **Specialized workflows** (Cricut, laser, embroidery, 3D print)
10. **Free maker tools** (gear generator, box generator, nesting, etc.)
11. **3x cheaper than Adobe Illustrator** ($7.99 vs $22.99/mo)

---

## Vectorr Product Pivot Plan

### Current State (WRONG)
- ✅ SVG upload + preview
- ✅ Coordinate precision control (2/3/5 decimals)
- ✅ SVG optimization (path simplification)
- ✅ Export SVG
- ✅ Auth (Supabase magic link)
- ✅ File metadata storage

### What We Need to Build (RIGHT)

#### Phase 1: Core Conversion (Week 1-2)
- [ ] **Image upload** (PNG, JPG, WEBP)
- [ ] **AI vectorization API** (integrate third-party or build own)
  - Options:
    - VectorAI API
    - Replicate (stable-diffusion → SVG pipeline)
    - Build own (OpenCV edge detection + potrace)
- [ ] **Preview system** (watermarked before payment)
- [ ] **Credit system** (replace current file-based pricing)
- [ ] **Download with format selection** (SVG, DXF, EPS)

#### Phase 2: Pre-Processing Tools (Week 3)
- [ ] **Background removal** (RemoveBG API or rembg Python library)
- [ ] **Image upscaling** (Real-ESRGAN or similar)
- [ ] **Batch upload** (50 files, 3 parallel workers)

#### Phase 3: AI Tools (Week 4-5)
- [ ] **AI Logo Generator** (Replicate + Fal.ai)
- [ ] **AI SVG Generator** (text-to-SVG pipeline)
- [ ] **AI Content Generator** (OpenAI/Anthropic for Etsy listings)
- [ ] **AI Animation** (Gemini API integration)

#### Phase 4: Export Formats (Week 6)
- [ ] **DXF export** (for laser/CNC)
- [ ] **EPS export** (for print shops)
- [ ] **G-code export** (for CNC routers)
- [ ] **Embroidery formats** (DST/PES/JEF via Ink/Stitch or Embroidermodder)

#### Phase 5: Specialized Tools (Week 7-8)
- [ ] **Cricut workflow** (layered SVG, Design Space compatible)
- [ ] **Laser workflow** (kerf settings, LightBurn DXF)
- [ ] **Embroidery workflow** (stitch file generation)
- [ ] **Vinyl workflow** (color separation, weeding boxes)

#### Phase 6: Free Maker Tools (Week 9-10)
- [ ] **SVG Editor** (in-browser, color/path editing)
- [ ] **SVG Optimizer** (SVGO integration - we already have this!)
- [ ] **Gear generator**
- [ ] **Box generator**
- [ ] **Nesting tool**
- [ ] **Cut file checker**

---

## Revenue Model for Vectorr

### Pricing (Match VectoSolve)
- **Free**: 1 watermarked preview/day
- **One-time**: $6.99/file
- **Starter**: $7.99/mo (25 conversions) or $49/year
- **Pro**: $14.99/mo (100 conversions) or $129/year

### Credit Costs (Match VectoSolve)
- Vectorize: 0.20 credits
- Remove BG: 0.07 credits
- Upscale: 0.15 credits
- AI Logo: 0.25 credits
- AI Animation: 0.10-0.50 credits
- AI Content: 0.10-0.25 credits

### Estimated Monthly Revenue (Conservative)
- 100 free users → 10 convert to Starter ($7.99) = $79.90/mo
- 10 Starter users → 2 upgrade to Pro ($14.99) = $29.98/mo
- 5 one-time purchases ($6.99) = $34.95/mo
- **Total Month 1**: ~$145/mo

### Growth to $100K/Year Goal
- Need: $8,333/mo average
- At $7.99 Starter: 1,043 subscribers
- At $14.99 Pro: 556 subscribers
- **Realistic mix**: 800 Starter + 200 Pro = $9,390/mo = $112,680/year

---

## Next Steps (Immediate Action Items)

1. ✅ **Stop building SVG optimizer features** (wrong product)
2. ⚠️ **Choose AI vectorization provider**:
   - Option A: Replicate API (fast integration)
   - Option B: Build own (potrace + OpenCV)
   - Option C: License Vector Magic API
3. ⚠️ **Update landing page copy** (PNG/JPG to SVG, not "optimize SVG")
4. ⚠️ **Redesign upload flow** (accept images, not SVGs)
5. ⚠️ **Implement credit system** (replace current pricing)
6. ⚠️ **Add watermarked preview** (before payment)
7. ⚠️ **Build batch processing** (50 files, ZIP download)
8. 📋 **Create 67 SEO landing pages** (PNG to SVG, JPG to Vector, etc.)

---

**End of Feature Extraction**

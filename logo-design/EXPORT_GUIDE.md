# Vectroy Logo – Export Guide

This guide walks through exporting SVG logo files to production formats for web, app, and print use.

---

## Quick Reference

| Target | File | Format | Size(s) | Tool |
|--------|------|--------|---------|------|
| Website favicon | `favicon-32px.svg` | ICO + PNG | 32×32, 16×16 | Figma, ImageMagick, or online converter |
| App icon (iOS) | `app-icon-256px.svg` | PNG | 180, 360, 540px | Figma, Xcode Asset Catalog |
| App icon (Android) | `app-icon-256px.svg` | PNG | 192, 288, 432, 576px | Figma, Android Studio |
| Social media | `social-card-1200x630.svg` | PNG/JPG | 1200×630px | Figma, online tool |
| Print (letterhead) | `lockup-horizontal.svg` | PDF | 1×2.5 inches | Figma, Illustrator |
| Email header | `favicon-32px.svg` | PNG | 32×32px | Figma |

---

## Export Methods

### Method 1: Using Figma (Recommended)

1. **Open SVG in Figma**:
   - Create new Figma file
   - File → Import → Select `.svg` file
   - Figma imports SVG as vector shapes

2. **Select element and export**:
   - Click logo/element on canvas
   - Right panel → Export section
   - Add export preset

3. **Create export presets**:
   - **Favicon**: 32×32px PNG + 16×16px PNG
   - **App Icon**: 180px, 360px, 540px PNG (iOS) or 192px, 288px, 432px, 576px PNG (Android)
   - **Social**: 1200×630px PNG
   - **Email**: 32×32px PNG
   - **Print**: 1× scale PDF (set DPI to 300)

4. **Download**:
   - Click download button
   - Organize by format/use

### Method 2: Using Command Line (ImageMagick)

**Prerequisites**: Install ImageMagick (`brew install imagemagick`)

```bash
# Convert SVG to PNG at specific size
convert -density 300 favicon-32px.svg -resize 32x32 favicon-32.png

# Favicon ICO format
convert favicon-32.png favicon.ico

# Multiple sizes in one command
for size in 32 64 128 256; do
  convert -density 300 favicon-32px.svg -resize ${size}x${size} favicon-${size}.png
done

# Social card (1200×630)
convert -density 150 social-card-1200x630.svg social-card.png

# App icon with padding
convert -density 150 app-icon-256px.svg -resize 256x256 app-icon-256.png
```

### Method 3: Using Online Converters

1. **CloudConvert** (https://cloudconvert.com):
   - Upload SVG
   - Select output format (PNG, JPG, ICO, PDF)
   - Set dimensions/DPI
   - Download

2. **Convertio** (https://convertio.co):
   - Upload SVG
   - Choose PNG/JPG/PDF
   - Batch processing available

3. **Online-Convert** (https://image.online-convert.com):
   - SVG to PNG, ICO, JPEG
   - Set size and quality

---

## Format-Specific Instructions

### Favicon Export

**Sizes needed**:
- 32×32px (primary)
- 16×16px (older browsers)
- 180×180px (Apple touch icon)

**HTML markup**:
```html
<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="apple-touch-icon" href="/apple-touch-icon-180.png">
```

**Process**:
1. Export `favicon-32px.svg` to PNG at 32×32px
2. Convert PNG to ICO using ImageMagick or Figma
3. Also export at 16×16px for legacy support
4. Export at 180×180px for iOS home screen

### App Icon Export (iOS)

**Sizes required**:
- 180×180px (1×, used in iOS 13+)
- 120×120px (2×, @2x)
- 60×60px (3×, @3x)

**Alternative: Xcode Asset Catalog**
- Import `app-icon-256px.svg` or 256px PNG into Xcode
- Xcode auto-generates all required sizes
- Select "App Icon Set"
- Drag and drop image

**Manual export**:
```bash
convert app-icon-256px.svg -resize 180x180 AppIcon-180.png
convert app-icon-256px.svg -resize 120x120 AppIcon-120.png
convert app-icon-256px.svg -resize 60x60 AppIcon-60.png
```

### App Icon Export (Android)

**Sizes required** (by DPI):
- 192×192px (mdpi)
- 288×288px (hdpi)
- 432×432px (xhdpi)
- 576×576px (xxhdpi)
- 864×864px (xxxhdpi, optional)

**Process**:
1. Export `app-icon-256px.svg` to PNG at each size
2. Place in `res/mipmap-{dpi}/ic_launcher.png`
3. Android Studio displays preview

**Command**:
```bash
convert app-icon-256px.svg -resize 192x192 ic_launcher-mdpi.png
convert app-icon-256px.svg -resize 288x288 ic_launcher-hdpi.png
convert app-icon-256px.svg -resize 432x432 ic_launcher-xhdpi.png
convert app-icon-256px.svg -resize 576x576 ic_launcher-xxhdpi.png
```

### Social Media Card

**Standard size**: 1200×630px (Open Graph, Twitter, LinkedIn)

**Process**:
1. Export `social-card-1200x630.svg` to PNG
2. For Twitter: optimize to ~300KB
3. Save as JPEG if file size is critical

**HTML Open Graph Tags**:
```html
<meta property="og:image" content="/social-card-1200x630.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:image" content="/social-card-1200x630.png">
```

### Print Export (PDF)

**For letterhead/marketing**:
1. Export `lockup-horizontal.svg` or primary mark as PDF
2. Set print DPI to 300 (high quality)
3. Set color mode to CMYK or RGB
4. Test on actual substrate before bulk printing

**Figma settings**:
- Export format: PDF
- Scale: 1× (for screen-size reference) or 1.5×/2× for print
- Choose "Flatten image" to merge effects

**ImageMagick**:
```bash
convert -density 300 lockup-horizontal.svg -compress jpeg output.pdf
```

### Email Header

**Standard size**: 32×32px or 40×40px

**Process**:
1. Export `favicon-32px.svg` to PNG at 32×32px
2. Optimize for email (typically <30KB)
3. Use `<img>` tag in email template

**Email HTML**:
```html
<img src="vectroy-logo-32.png" alt="Vectroy" width="32" height="32" style="display:block;width:32px;height:32px;">
```

---

## Optimization Tips

### PNG Optimization
```bash
# Using ImageMagick (lossy)
convert input.png -colors 256 -strip -quality 85 output.png

# Using pngquant (best compression)
pngquant --speed 1 input.png
```

### JPEG Optimization
```bash
convert input.png -quality 85 -strip output.jpg
```

### WebP (Modern Web)
```bash
cwebp -q 85 input.png -o output.webp
```

### File Size Targets
- **Favicon**: <5KB
- **App icon (32×32px)**: <2KB
- **Social card**: <300KB (Twitter requirement)
- **Email header**: <15KB

---

## Color Mode Considerations

### Digital (Screen)
- **Color space**: RGB (sRGB)
- **Profile**: Standard RGB or Adobe RGB
- **Export**: No color space conversion needed

### Print
- **Color space**: CMYK
- **Profile**: Print profile (provided by printer)
- **Test**: Print sample on actual substrate before production

### Web
- **Color space**: sRGB (standard for web)
- **Format**: PNG (preserves transparency) or JPEG (no transparency)
- **Fallback**: Always provide PNG for browsers that don't support WebP

---

## Batch Export Examples

### All web assets
```bash
#!/bin/bash
SOURCE_DIR="/Users/rosinante/Projects/Vectroy/logo-design/final"
OUTPUT_DIR="/Users/rosinante/Projects/Vectroy/logo-design/exports"

mkdir -p $OUTPUT_DIR

# Favicons
convert -density 300 "$SOURCE_DIR/favicon-32px.svg" -resize 32x32 "$OUTPUT_DIR/favicon-32.png"
convert -density 300 "$SOURCE_DIR/favicon-32px.svg" -resize 16x16 "$OUTPUT_DIR/favicon-16.png"
convert "$OUTPUT_DIR/favicon-32.png" "$OUTPUT_DIR/favicon.ico"

# App icons
for size in 192 256; do
  convert -density 150 "$SOURCE_DIR/app-icon-256px.svg" -resize ${size}x${size} "$OUTPUT_DIR/app-icon-${size}.png"
done

# Social card
convert -density 100 "$SOURCE_DIR/social-card-1200x630.svg" "$OUTPUT_DIR/social-card-1200x630.png"

echo "✓ Batch export complete"
```

### Save as executable script:
```bash
chmod +x export-assets.sh
./export-assets.sh
```

---

## Verification Checklist

After exporting:
- [ ] All files created at correct dimensions
- [ ] File sizes within acceptable range
- [ ] No pixelation or quality loss
- [ ] Gradients render smoothly
- [ ] Colors match original (#00B8D4, #0066FF, #A855F7, #E91E63)
- [ ] Transparency preserved (PNG)
- [ ] Text remains sharp and legible
- [ ] Icons display correctly on dark and light backgrounds

---

## Troubleshooting

### Gradients not showing (PNG export)
- Ensure SVG has embedded gradient definitions (check with text editor)
- Increase export resolution (300 DPI for print)
- Use Figma flatten option if effects not rendering

### Color shift in export
- Check color profile (RGB vs CMYK)
- Export from Figma in sRGB for web
- Test on multiple browsers/devices

### File size too large
- Optimize using pngquant or ImageOptim
- Reduce resolution if acceptable
- Use JPG for non-transparent images

### Pixelated appearance at small sizes
- Increase source resolution
- Use vector export tools (Figma preferred)
- Test at actual display size before finalizing

---

## Recommended Tools

| Tool | Purpose | Cost |
|------|---------|------|
| **Figma** | SVG import, export to multiple formats | Free (with limits) / $12+/mo |
| **ImageMagick** | Batch convert, optimize images | Free (open-source) |
| **pngquant** | PNG compression | Free (open-source) |
| **CloudConvert** | Online format conversion | Free / paid |
| **ImageOptim** | Batch image optimization (macOS) | Free |

---

## Next Steps

1. **Export all assets** using preferred method (Figma recommended)
2. **Organize by use case**:
   - `web/` (favicon, social card, email)
   - `app-ios/` (icon sizes)
   - `app-android/` (different DPI sizes)
   - `print/` (PDF versions)
3. **Test in context** (browser, app store, email client)
4. **Archive originals** (SVG sources) for future updates
5. **Document final filenames** and sizes for developer handoff

---

**Last Updated**: November 8, 2026  
**Brand**: Vectroy  
**For questions**: Refer to BRAND-GUIDELINES.md

# Vectroy Logo Assets – Complete File Index

## Directory Structure
```
/Users/rosinante/Projects/Vectroy/logo-design/
├── final/                          (Production-ready exports)
│   ├── concept-c-diamond-kite-v2.svg          (Primary mark, dark)
│   ├── concept-c-diamond-kite-light.svg       (Light variant)
│   ├── concept-c-diamond-kite-presentation.svg (With glow effects)
│   ├── concept-b-precision-compass-v2.svg     (Alternative: cardinal cross)
│   ├── concept-a-stacked-chevrons-v2.svg      (Alternative: chevrons)
│   ├── lockup-horizontal.svg                  (Mark + wordmark, side-by-side)
│   ├── lockup-stacked.svg                     (Mark + wordmark, stacked)
│   ├── favicon-32px.svg                       (Web favicon)
│   ├── app-icon-256px.svg                     (App icon, rounded)
│   ├── social-card-1200x630.svg               (Social media preview)
│   ├── vectroy-presentation-v2.svg            (All 3 concepts comparison)
│   └── FILE_INDEX.md                          (This file)
│
├── concepts/                       (Concept development)
│   ├── concept-c-diamond-kite-v2.svg
│   ├── concept-b-precision-compass-v2.svg
│   └── concept-a-stacked-chevrons-v2.svg
│
└── BRAND-GUIDELINES.md             (Comprehensive brand standards)
```

---

## File Specifications

### Primary Logo (Production)

| File | Size | Background | Use Case | Format | Colors |
|------|------|-----------|----------|--------|--------|
| `concept-c-diamond-kite-v2.svg` | 200×200px | N/A (transparent) | Primary mark for all applications | SVG | Cyan→Blue + Purple→Magenta gradients |

**Key Features**:
- Dual gradient diamonds meeting at center
- No effects (production-ready)
- Scalable 1:1 to any size
- Two-color gradient directions optimized for visual flow
- Transparent background (safe for any surface)

**ViewBox**: 0 0 200 200  
**Minimum Size**: 32×32px  
**Recommended Use**: Primary brand mark, all contexts

---

### Alternative Logos (Backup Concepts)

| File | Concept | Use Case |
|------|---------|----------|
| `concept-b-precision-compass-v2.svg` | Cardinal cross with circle center | Alternative if diamond is unavailable |
| `concept-a-stacked-chevrons-v2.svg` | Three stacked chevrons | Alternative for simpler geometric contexts |

Both alternatives also include dual gradients and scale from 32–2000px+.

---

### Presentation & Marketing

| File | Dimensions | Background | Use Case | Special Features |
|------|-----------|-----------|----------|------------------|
| `concept-c-diamond-kite-presentation.svg` | 200×200px | Dark (#0F0F1A) | Presentations, marketing | Glow filter effects |
| `social-card-1200x630.svg` | 1200×630px | Dark gradient | Social media sharing | Glow effects, accent shapes, typography |
| `vectroy-presentation-v2.svg` | Large (varies) | Dark (#0F0F1A) | Concept comparison | All 3 designs at multiple scales |

---

### Lockups (Logo + Wordmark)

| File | Layout | Dimensions | Use Case |
|------|--------|----------|----------|
| `lockup-horizontal.svg` | Mark (left) + Wordmark (right) | 400×120px | Websites, headers, marketing collateral |
| `lockup-stacked.svg` | Mark (top) + Wordmark (middle) + Tagline (bottom) | 140×200px | App launchers, squares, tight spaces |

**Lockup Colors**:
- Wordmark: White (#FFFFFF) on dark background
- Tagline: Muted text (#888888) or accent cyan (#00B8D4)
- Background: Dark (#0F0F1A)

---

### App & Web Icons

| File | Size | Background | Use Case | Format |
|------|------|-----------|----------|--------|
| `favicon-32px.svg` | 32×32px | Dark (#0F0F1A) | Web favicon, bookmarks, browser tabs | SVG (rasterize to 32px ICO for browser) |
| `app-icon-256px.svg` | 256×256px | Rounded corners, dark gradient | iOS, Android, macOS, Windows app stores | SVG (export at 1×, 2×, 3× for retina) |

**Export Recommendations**:
- **Favicon**: Convert to `.ico` format at 32×32px, 16×16px
- **App Icon**: Export as PNG at 180px (iOS), 192px (Android), 256px (macOS)
- **Retina/High-DPI**: Provide 2× and 3× variants for mobile

---

### Light/White Variant

| File | Background | Use Case | Gradients |
|------|-----------|----------|-----------|
| `concept-c-diamond-kite-light.svg` | Transparent | Light backgrounds, white/grey surfaces | White to light grey |

**When to Use**:
- Light or white website backgrounds
- Printed materials on light substrates
- Promotional materials with light backgrounds
- Accessibility: tested WCAG AA on white/light contexts

---

## Color Reference

### Primary Gradients (Dark Mode)

**Left Diamond (Cyan → Blue)**
```
Start: #00B8D4 (top-left)
End:   #0066FF (bottom-right)
Direction: 45° (x1=0%, y1=0%, x2=100%, y2=100%)
```

**Right Diamond (Purple → Magenta)**
```
Start: #A855F7 (bottom-left)
End:   #E91E63 (top-right)
Direction: 135° (x1=100%, y1=0%, x2=0%, y2=100%)
```

### Light Mode Gradients

**Left Diamond (White → Light)**
```
Start: #FFFFFF
End:   #F0F0F0
```

**Right Diamond (Light → White)**
```
Start: #F0F0F0
End:   #FFFFFF
```

---

## Technical Specifications

### SVG Metadata
- **Encoding**: UTF-8
- **Namespace**: http://www.w3.org/2000/svg
- **ViewBox**: 0 0 200 200 (primary mark and variants)
- **Dimensions**: Scalable (no fixed px sizes except where noted)

### Gradients
- **Type**: `<linearGradient>`
- **Color Stops**: 2-stop design (start + end color)
- **Reusable IDs**: `gradient-cyan-blue`, `gradient-purple-magenta`, etc.
- **Opacity**: Fully opaque (1.0) for production; variable in presentation versions

### Effects (Presentation Only)
- **Filter**: `<feGaussianBlur>` with `stdDeviation` 3–5
- **Merge**: Glow created by stacking blur layer + original
- **Production Files**: No effects applied (clean SVG)

---

## Export & Delivery Guide

### For Web
1. **Favicon**: Use `favicon-32px.svg`, export to `.ico` at 32×32px and 16×16px
2. **Logo Header**: Use `lockup-horizontal.svg` or primary mark, keep SVG format
3. **Social**: Use `social-card-1200x630.svg`, export to PNG 1200×630px
4. **App Icon (PWA)**: Use `app-icon-256px.svg`, export to PNG at 192×192px

### For Print
1. **Letterhead**: `lockup-horizontal.svg`, print at 1 inch minimum
2. **Business Card**: Primary mark at 0.5 inch
3. **Poster**: Primary mark at 4–6 inches or lockup
4. **Color Mode**: Use RGB or CMYK (test on substrate)

### For App Development
1. **iOS**: Export `app-icon-256px.svg` to PNG at 180×180px (1×), 360×360px (2×), 540×540px (3×)
2. **Android**: Export at 192×192px (mdpi), 288×288px (hdpi), 432×432px (xhdpi), 576×576px (xxhdpi)
3. **macOS**: Export at 128×128px, 256×256px, 512×512px
4. **Format**: Use PNG with transparency; provide both icon and rounded-corner variants

### For Design/Marketing Teams
1. **Presentations**: Use `concept-c-diamond-kite-presentation.svg` (with glow)
2. **Social Media**: Use `social-card-1200x630.svg`
3. **Concept Comparison**: Use `vectroy-presentation-v2.svg`
4. **Figma/Adobe**: Import SVG directly; preserve vectors (do not rasterize)

---

## Sizing Guidelines

### Digital
- **Favicon**: 32×32px (minimum), 16×16px (optional)
- **App Icon**: 256×256px (primary), 128×128px (minimum)
- **Social Card**: 1200×630px (standard)
- **Website Header**: 400×120px (horizontal), scale down for mobile
- **Email**: 32×32px (header logo)

### Print
- **Minimum**: 0.5 inches (12.7mm)
- **Typical**: 1 inch (25.4mm) to 4 inches (101.6mm)
- **Maximum**: No limit (scale as needed)

### Screen Scaling
- **Mobile**: 40×40px (minimum safe size)
- **Tablet**: 64×64px to 128×128px
- **Desktop**: 128×128px to 256×256px
- **Large Display**: 512×512px+

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Nov 2026 | Initial release: 3 concepts, dual gradients, lockups, social card, brand guidelines |

---

## Support Files

- **BRAND-GUIDELINES.md**: Comprehensive brand standards and usage rules
- **FILE_INDEX.md** (this file): Complete file inventory and technical specs

---

**Last Updated**: November 8, 2026  
**Brand**: Vectroy – AI Vector Conversion Platform  
**Status**: Production-ready

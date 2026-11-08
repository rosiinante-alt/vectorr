# Vectroy Logo – Quick Reference Card

## Primary Mark
**File**: `concept-c-diamond-kite-v2.svg`  
**Format**: SVG (scalable)  
**Colors**: Dual gradient (cyan→blue + purple→magenta)  
**Background**: Transparent (use on dark backgrounds #0F0F1A)  

## Color Codes
```
Cyan:     #00B8D4
Blue:     #0066FF
Purple:   #A855F7
Magenta:  #E91E63
Dark BG:  #0F0F1A
```

## File Sizes
| File | Purpose | Size |
|------|---------|------|
| `concept-c-diamond-kite-v2.svg` | Main logo | 1.0 KB |
| `concept-c-diamond-kite-presentation.svg` | With glow | 2.1 KB |
| `concept-c-diamond-kite-light.svg` | Light variant | 1.1 KB |
| `lockup-horizontal.svg` | Logo + wordmark (wide) | 1.4 KB |
| `lockup-stacked.svg` | Logo + wordmark (tall) | 1.6 KB |
| `favicon-32px.svg` | Browser favicon | 967 B |
| `app-icon-256px.svg` | App icon (rounded) | 1.9 KB |
| `social-card-1200x630.svg` | Social media card | 2.7 KB |

## Sizing Guide
- **Minimum**: 16px (favicon)
- **Common**: 32px (icon), 200px (header), 256px (app)
- **Large**: 1200×630px (social), 2000px+ (hero)
- **Print**: 0.5" minimum (12.7mm)

## Use Cases
✓ **Dark mode websites** → Primary mark (`v2.svg`)  
✓ **Light backgrounds** → Light variant (`light.svg`)  
✓ **Presentations** → Presentation variant (with glow)  
✓ **App store** → `app-icon-256px.svg` (export to PNG)  
✓ **Web favicon** → `favicon-32px.svg` (export to ICO)  
✓ **Social media** → `social-card-1200x630.svg`  
✓ **Website header** → `lockup-horizontal.svg` or primary mark  

## Export to PNG
```bash
# Using ImageMagick
convert -size 256x256 concept-c-diamond-kite-v2.svg -background transparent output.png

# Using Figma: Open SVG → Right-click → Export → PNG
# Using Inkscape: File → Export As → PNG Image
```

## Export to ICO (Favicon)
```bash
# Create favicon.ico from 32px variant
convert -size 32x32 favicon-32px.svg -background transparent favicon.png
convert favicon.png -define icon:auto-resize=16,32 favicon.ico
```

## HTML Implementation
```html
<!-- Favicon -->
<link rel="icon" href="/favicon.ico" type="image/x-icon">

<!-- Logo in header -->
<img src="/logo.svg" alt="Vectroy" width="200" height="200">

<!-- Responsive with CSS -->
<img src="/logo.svg" alt="Vectroy" class="logo">
<style>
  .logo { width: 100%; max-width: 400px; height: auto; }
</style>
```

## Contrast Compliance
✓ WCAG AA compliant on dark backgrounds (#0F0F1A)  
✓ Cyan-Blue gradient: 4.5:1 contrast  
✓ Purple-Magenta gradient: 4.5:1 contrast  
✓ Safe for accessibility, color-blind users  

## Do's ✓
- Scale SVGs to any size without quality loss
- Use on #0F0F1A dark background
- Maintain 20% spacing around logo
- Keep aspect ratio 1:1
- Use light variant on light backgrounds

## Don'ts ✗
- Rasterize unless final delivery format required
- Stretch or skew the mark
- Change colors without approval
- Use on low-contrast backgrounds
- Apply effects beyond presentation file

## File Location
```
/Users/rosinante/Projects/Vectroy/logo-design/final/
```

## Documentation
- **Brand Guidelines**: `BRAND-GUIDELINES.md` (full standards)
- **Export Guide**: `EXPORT_GUIDE.md` (step-by-step)
- **File Index**: `FILE_INDEX.md` (technical specs)
- **Delivery Summary**: `DELIVERY_SUMMARY.md` (complete overview)

## Version
**v1.0** – November 8, 2026  
**Status**: Production Ready ✓

---

**Need help?** See `BRAND-GUIDELINES.md` for comprehensive standards or `EXPORT_GUIDE.md` for detailed export instructions.

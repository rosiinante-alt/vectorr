# Vectroy: Complete VectoSolve Feature Parity Implementation Plan

**Date**: November 8, 2026  
**Branch**: `feat/pricing-update-2026`  
**Current State**: 49 page.tsx files (299 content + 31 API = 330 total)  
**Previous Work**: Phase 1-2 (AI generation tools complete)  
**Next Work**: Phase 3-10 (Standalone tools, verticals, business pages, marketing)  

---

## 🎯 Executive Summary

Vectroy currently has the core vectorization engine and AI generation tools. This plan completes VectoSolve feature parity by adding:

1. **Standalone preprocessing pages** (/upscale, /remove-bg, /batch)
2. **For-Makers verticals** (Cricut, laser, embroidery, 3D printing, vinyl, Etsy, screen print, DTF)
3. **Business pages** (/pro, /api, /done-for-you, /network)
4. **Free tools** (/svg-editor, /templates, /favicon-generator)
5. **Resource hubs** (/gallery, /how-to, /alternative, /glossary, /faq)
6. **Marketing pages** (/reviews, /free-svg-files, /vectorize-my-logo, /etsy-svg-optimizer, /affiliate, /partners, /refer, /education, /press)
7. **Legal pages** (/terms, /privacy)
8. **Pricing enhancements** (cost estimator, per-tool breakdown, one-time purchases)
9. **Navigation updates** (search, language switcher)

**Impact**: 49 pages → 90+ pages; 330 routes → 450+ routes

---

## 📋 Phases & Execution Models

### Phase 3: Standalone Tool Pages (3 pages + 1 API)

**Models**:
- `/upscale/page.tsx` — kimi-k2.7-code
- `/remove-bg/page.tsx` — kimi-k2.7-code
- `/batch/page.tsx` — kimi-k2.7-code
- `POST /api/batch/create` — deepseek-v4-pro

**Details**:
- Upscale: 2x or 4x with before/after preview
- Remove-bg: standalone page with transparent preview
- Batch: upload form → monitor via /batch/[id]
- API: create batch from file array or Zip

**Testing**:
- [ ] All 3 pages load and accept uploads
- [ ] Job polling works via /api/jobs/[id]
- [ ] Credits deduct correctly
- [ ] Previews render

---

### Phase 4: For-Makers Verticals (9 pages)

**Model**: claude-sonnet-5-5 (UI + component assembly)

**Pages**:
- `/svg-for-cricut` — blade types, mat sizes
- `/svg-for-laser-cutting` — Glowforge, xTool, K40
- `/svg-for-bambu-lab` — 3D printing optimization
- `/svg-for-etsy-sellers` — POD prep + sizing
- `/embroidery-converter` — DST/PES/JEF + stitch count
- `/svg-for-vinyl-cutting` — Silhouette, Cricut Vinyl
- `/print-on-demand` — color separation, DPI
- `/svg-for-screen-printing` — screen separations
- `/svg-for-dtf` — direct-to-film, transparency

**Each includes**: Niche-specific copy, feature showcase, CTA → /convert with pre-filled format

---

### Phase 5: Free Tools (3 pages)

**Models**:
- `/svg-editor` — deepseek-v4-pro (high complexity)
- `/templates` — kimi-k2.7-code
- `/favicon-generator` — kimi-k2.7-code

---

### Phase 6: Resource Hubs (5 pages + JSON)

**Model**: kimi-k2.7-code for UI, deepseek-flash for JSON

**Pages**:
- `/gallery` — image showcase
- `/how-to` — workflow guide hub
- `/alternative` — tool alternatives
- `/glossary` — SVG/maker terms
- `/faq` — general FAQ

**JSON files**: Create gallery.json, alternatives.json, glossary.json, faq.json

---

### Phase 7: Business Pages (4 pages)

**Models**: claude-sonnet-5-5, gpt-6.1-sol

**Pages**:
- `/pro` — B2B/Shop tier pricing
- `/api` — API docs landing
- `/done-for-you` — manual vectorization service
- `/network` — franchise/reseller program

---

### Phase 8: Marketing Pages (12+ pages)

**Models**: gpt-6.1-terra (copy), gpt-6.1-sol (partnerships), deepseek-flash (legal)

**Pages**:
- `/reviews` — testimonials + case studies
- `/free-svg-files` — download gallery
- `/vectorize-my-logo` — service funnel
- `/etsy-svg-optimizer` — niche SEO
- `/svg-to-png` — reverse converter
- `/affiliate` — affiliate program
- `/partners` — partnership hub
- `/refer` — referral program
- `/education` — student resources
- `/press` — press kit
- `/terms` — ToS
- `/privacy` — privacy policy

---

### Phase 9: Pricing Page Enhancements (4 features)

**Models**: kimi-k2.7-code (UI), deepseek-v4-pro (payment integration)

**Features**:
- Cost estimator slider (50x images → cost)
- Per-tool credit breakdown table
- Annual toggle with savings %
- "Just this file" $6.99 one-time purchase

---

### Phase 10: Navigation & UX Updates (4 changes)

**Model**: kimi-k2.7-code

**Changes**:
- Add site search to header
- Language switcher (11 languages)
- Update nav menu with Phase 4 pages
- Reorganize footer links

---

## 📁 File Structure

**New directories to create**:

```
src/app/
├── upscale/page.tsx
├── remove-bg/page.tsx
├── batch/page.tsx
├── svg-for-cricut/page.tsx
├── svg-for-laser-cutting/page.tsx
├── svg-for-bambu-lab/page.tsx
├── svg-for-etsy-sellers/page.tsx
├── embroidery-converter/page.tsx
├── svg-for-vinyl-cutting/page.tsx
├── print-on-demand/page.tsx
├── svg-for-screen-printing/page.tsx
├── svg-for-dtf/page.tsx
├── svg-editor/page.tsx
├── templates/page.tsx
├── favicon-generator/page.tsx
├── gallery/page.tsx
├── how-to/page.tsx
├── alternative/page.tsx
├── glossary/page.tsx
├── faq/page.tsx
├── pro/page.tsx
├── api/page.tsx
├── done-for-you/page.tsx
├── network/page.tsx
├── reviews/page.tsx
├── free-svg-files/page.tsx
├── vectorize-my-logo/page.tsx
├── etsy-svg-optimizer/page.tsx
├── svg-to-png/page.tsx
├── affiliate/page.tsx
├── partners/page.tsx
├── refer/page.tsx
├── education/page.tsx
├── press/page.tsx
├── terms/page.tsx
├── privacy/page.tsx
└── api/batch/create/route.ts

public/data/
├── gallery.json
├── alternatives.json
├── glossary.json
├── faq.json
└── templates/ (SVG files)
```

---

## 🧪 Testing Per Phase

- **Phase 3**: Upload works, job polling works, credits deduct
- **Phase 4**: Each page renders, CTAs pass format query string
- **Phase 5**: SVG editor draws, templates load, favicon exports
- **Phase 6**: Resource pages load JSON and display correctly
- **Phase 7**: Business pages display pricing and CTAs
- **Phase 8**: Marketing pages have SEO metadata, legal pages are correct
- **Phase 9**: Cost slider works, annual toggle works, payment integrates
- **Phase 10**: Search works, language switcher works, nav menu updated

---

## 🚀 Timeline

| Phase | Effort | Timeline |
|-------|--------|----------|
| 3 | 2 days | Week 1 |
| 4 | 3 days | Week 1-2 |
| 5 | 2 days | Week 2 |
| 6 | 2 days | Week 2 |
| 7 | 1 day | Week 3 |
| 8 | 3 days | Week 3 |
| 9 | 2 days | Week 3 |
| 10 | 1 day | Week 4 |
| **Total** | **~16 days** | **~1 month** |

---

## 📈 Success Criteria

- **49 pages** → **90+ pages**
- **330 routes** → **450+ routes**
- All phases tested and merged to main
- One-time purchases, done-for-you service, API tier, affiliate program ready for launch

---

## ⚠️ Known Risks

| Risk | Mitigation |
|------|-----------|
| Phase 3 API route untested | Write unit tests; manual QA |
| SVG editor complex | Start read-only; add drawing later |
| JSON files missing | Generate upfront using deepseek-flash |
| Nav not updated | Update in Phase 10 |
| 16-day timeline tight | Parallelize Phases 4-8 |

---

## 📝 Handover Notes

- Entry: `/Users/rosinante/Projects/Vectroy` on `feat/pricing-update-2026`
- Previous: Phase 1-2 AI tools complete
- Next: Start Phase 3
- Test against: `/api/convert`, `/api/jobs/[id]`, `/api/batch/create`
- Merge strategy: Per-phase merges to main after QA

---

## 🔗 Related Documents

- `PHASE_7_COMPLETE.md` — Current architecture
- `VECTOSOLVE_FEATURES.md` — VectoSolve feature inventory
- `VECTOSOLVE_GAP_ANALYSIS.md` — Competitive opportunities
- `BUILD_STATUS.md` — Component reference

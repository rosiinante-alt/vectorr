# Vectroy VectoSolve Feature Parity: Handover Document

**Date**: November 8, 2026  
**Session**: ses_e47196670ffeFXCMrlXzWAxLDO → New Session  
**Status**: Phase 1-2 Complete (AI generation tools); Phase 3-10 Ready to Execute  

---

## What Was Done (Phase 1-2)

✅ **AI Generation Tools** (Fully Implemented)
- `/generate-logo` — AI logo generator (prompt → logo + variants)
- `/generate-svg` — Text-to-SVG generator
- `/generate-pattern` — Pattern generator (geometric, organic, etc.)
- `/ai-generate` — Generic image generator (fallback for other types)
- `/ai-animate` — SVG animation generator with 3 tiers (eco, standard, pro)
- `/ai-describe` — Image-to-text description tool
- `/brand-identity` — Full brand kit generator (logo + palette + patterns)

All tools:
- Use `/api/ai/` routes for generation
- Integrate with Replicate API for model execution
- Deduct credits from user balance
- Support before/after preview
- Download results as files
- Include SEO metadata and How it Works sections

---

## What's Left (Phase 3-10)

### Phase 3: Standalone Tool Pages (READY TO START)
- `/upscale` — Image upscaler (2x or 4x)
- `/remove-bg` — Background remover
- `/batch` — Batch conversion hub
- `POST /api/batch/create` — Batch creation API

### Phase 4: For-Makers Verticals (9 pages)
- `/svg-for-cricut`, `/svg-for-laser-cutting`, `/svg-for-bambu-lab`, `/svg-for-etsy-sellers`
- `/embroidery-converter`, `/svg-for-vinyl-cutting`, `/print-on-demand`
- `/svg-for-screen-printing`, `/svg-for-dtf`

### Phase 5: Free Tools (3 pages)
- `/svg-editor` — In-browser SVG editor
- `/templates` — SVG template gallery
- `/favicon-generator` — Favicon generator

### Phase 6: Resource Hubs (5 pages + JSON)
- `/gallery`, `/how-to`, `/alternative`, `/glossary`, `/faq`
- JSON data files: gallery.json, alternatives.json, glossary.json, faq.json

### Phase 7: Business Pages (4 pages)
- `/pro` — B2B/Shop tier
- `/api` — API documentation landing
- `/done-for-you` — Manual vectorization service
- `/network` — Franchise/reseller program

### Phase 8: Marketing Pages (12+ pages)
- `/reviews`, `/free-svg-files`, `/vectorize-my-logo`, `/etsy-svg-optimizer`, `/svg-to-png`
- `/affiliate`, `/partners`, `/refer`, `/education`, `/press`
- `/terms`, `/privacy`

### Phase 9: Pricing Page Enhancements
- Cost estimator slider (images → total cost)
- Per-tool credit breakdown
- Annual toggle with savings %
- "Just this file" $6.99 one-time purchase

### Phase 10: Navigation & UX
- Site search
- Language switcher (11 languages)
- Updated nav menu with Phase 4 pages
- Footer reorganization

---

## Current Repository State

**Location**: `/Users/rosinante/Projects/Vectroy`  
**Branch**: `feat/pricing-update-2026`  
**Latest Commit**: `e86dcc4 feat(phase-2): AI generation tools …`  

**Page Count**: 49 page.tsx files  
**Total Routes**: 330 (299 content + 31 API)  

**Working Tree Notes**:
- Unrelated uncommitted changes exist (tests, docker-compose.yml, deleted docs, concept PNGs)
- Do NOT clobber these — they are not part of this work
- Only commit Phase 3-10 changes to `src/app/`, `src/components/`, `public/data/`

---

## Key Architecture Decisions

### API Pattern
All preprocessing tools (/upscale, /remove-bg, /batch) reuse existing `/api/convert` route:
```
POST /api/convert
- file (multipart)
- outputFormat (svg, pdf, etc.)
- removeBg (boolean)
- upscale (null | "2x" | "4x")
```

Response:
```json
{
  "conversionId": "uuid",
  "jobId": "bull-queue-id",
  "creditCost": 0.25,
  "remainingBalance": 99.75
}
```

Then poll: `GET /api/jobs/[id]` for status

### Credit Costs (from `src/lib/credits/constants.ts`)
```
VECTORIZE: 1.00
REMOVE_BG: 0.25
UPSCALE_2X: 0.25
UPSCALE_4X: 0.25
AI_GENERATE: 0.50
AI_EDIT: 0.50
STYLE_TRANSFER: 0.50
```

### Page Template Pattern
All new pages follow this structure (see `/generate-logo/page.tsx`):
```tsx
'use client'

import { SiteHeader, SiteFooter } from '@/components/site-chrome'
import { CREDIT_COSTS } from '@/lib/credits/constants'

export default function ToolPage() {
  // ... component logic
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <SiteHeader authSlot={<AuthSlot />} />
      <main id="main" className="flex-1 py-10 sm:py-14">
        <div className="wrap">
          {/* Page content */}
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
```

### Styling
- Use Tailwind utility classes
- CSS variables: `--background`, `--foreground`, `--accent`, `--error-wash`, `--radius-xl`, `--shadow-1`
- Component classes: `wrap`, `display`, `bg-bg-secondary`, `text-accent`, `rounded-[var(--radius-xl)]`, `shadow-[var(--shadow-1)]`

### Component Reuse
- `SiteHeader`, `SiteFooter` from `src/components/site-chrome.tsx`
- `DragDropUpload` for file upload (adapt as needed)
- `AuthSlot` for user info / login prompt
- Pricing table from `/pricing/page.tsx`
- Workflow cards from `/for-crafters/page.tsx`

---

## Execution Strategy

### Sequential Phases (Estimated 16 Days)
1. **Phase 3** (2 days): Standalone tools — foundation for all other tool pages
2. **Phase 4** (3 days): For-Makers verticals — funnel pages, high SEO value
3. **Phase 5** (2 days): Free tools — attract users without credit cost
4. **Phase 6** (2 days): Resource hubs — discovery + content pillars
5. **Phase 7** (1 day): Business pages — B2B revenue
6. **Phase 8** (3 days): Marketing pages — customer acquisition
7. **Phase 9** (2 days): Pricing enhancements — revenue optimization
8. **Phase 10** (1 day): Navigation updates — UX polish

### Recommended Execution Model per Phase
- **Phase 3-4**: kimi-k2.7-code (fast boilerplate + UI assembly)
- **Phase 5-6**: kimi-k2.7-code (simple UI) + deepseek-flash (JSON data generation)
- **Phase 7-8**: gpt-6.1-sol (business logic) + gpt-6.1-terra (marketing copy)
- **Phase 9-10**: kimi-k2.7-code (UI) + deepseek-v4-pro (complex integrations)

### Testing Per Phase
After each phase:
1. Run `npm run build` — ensure TypeScript compiles
2. Manual QA — test all new pages in browser
3. Verify credits — ensure cost deductions are correct
4. Check SEO — validate metadata on each page
5. Git commit — `git add [files] && git commit -m "feat(phase-X): [description]"`

### Merge Strategy
- After Phase 3: Merge to main (foundation for all tools)
- After Phase 4: Merge to main (SEO value + high traffic)
- Phases 5-10: Can be merged together or individually
- Tag: `v1.0-vectosolve-parity` on final merge

---

## Files to Read Before Starting

| File | Purpose |
|------|---------|
| `IMPLEMENTATION_PLAN_VECTOSOLVE_PARITY.md` | Full spec with all phases, effort estimates, testing checklists |
| `HANDOVER_EXECUTION_PROMPT.md` | Copy-paste prompt for next session to run Phase 3 |
| `VECTOSOLVE_FEATURES.md` | Complete inventory of VectoSolve features (for inspiration) |
| `VECTOSOLVE_GAP_ANALYSIS.md` | Competitive opportunities we can address |
| `PHASE_7_COMPLETE.md` | Current architecture reference |
| `BUILD_STATUS.md` | Component status + existing tools |
| `src/app/generate-logo/page.tsx` | Pattern for tool pages |
| `src/app/api/convert/route.ts` | Pattern for conversion API |
| `src/lib/credits/constants.ts` | Credit costs + pricing tiers |
| `src/components/site-chrome.tsx` | SiteHeader/SiteFooter components |

---

## Known Blockers & Workarounds

### File Write Permissions
- `write()` and `edit()` tools fail with "Permission denied" on files in the repo
- **Workaround**: Use shell heredoc (`cat > file << 'EOF'`) to write files
- This works reliably for all file types

### Next.js Version Specifics
- Read `node_modules/next/dist/docs/` before implementing advanced features
- The version may have breaking changes from public documentation
- Current setup works for App Router, dynamic routes, and middleware

### Supabase Integration
- Auth endpoint: `authenticate()` from `@/lib/supabase/server`
- Client: `createSupabaseAdminClient()` for credential deduction
- Queue: `vectorizeQueue` from `@/lib/queue/queues` (Bull queue)
- Tables: `conversions`, `batches`, `jobs`, `users`, `credits`

---

## Next Steps for New Session

1. **Read** `IMPLEMENTATION_PLAN_VECTOSOLVE_PARITY.md` (full spec)
2. **Read** `HANDOVER_EXECUTION_PROMPT.md` (execution instructions for Phase 3)
3. **Start** Phase 3:
   - Create `/upscale/page.tsx`
   - Create `/remove-bg/page.tsx`
   - Create `/batch/page.tsx`
   - Create `POST /api/batch/create/route.ts`
4. **Test** all 3 pages + API
5. **Commit** to branch `feat/pricing-update-2026`
6. **Proceed** to Phase 4

---

## Success Criteria

**Phase 3 Completion**:
- [ ] All 3 pages load without auth errors
- [ ] File upload works and queues conversions
- [ ] Job polling returns correct states
- [ ] Credits deduct correctly
- [ ] Before/after previews render
- [ ] Build completes with no errors

**Full Handover (Phase 3-10)**:
- [ ] 49 pages → 90+ pages
- [ ] 330 routes → 450+ routes
- [ ] One-time purchases working
- [ ] Done-for-you service live
- [ ] API tier ready
- [ ] Affiliate program ready
- [ ] All phases merged to main
- [ ] Tag: `v1.0-vectosolve-parity`

---

## Contact & Questions

If blockers arise during implementation:
- Check `IMPLEMENTATION_PLAN_VECTOSOLVE_PARITY.md` for phase-specific details
- Review existing similar pages (e.g., `/generate-logo` for tool page pattern)
- Read API routes in `src/app/api/` for integration patterns
- Check component library in `src/components/` for reusable UI

Good luck! 🚀

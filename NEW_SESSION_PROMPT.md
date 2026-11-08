# New Session: Execute Vectroy Phases 3-5 (VectoSolve Feature Parity)

**Copy this entire document into a new Claude session to begin implementation.**

---

## 🚀 Your Task

You are continuing Vectroy development to achieve complete VectoSolve feature parity. Previous sessions built the core vectorization engine and Phase 1-2 AI generation tools (logo, SVG, pattern, image, animate, describe, brand identity).

**Your job**: Build Phases 3, 4, and 5 sequentially (standalone tools, maker verticals, free tools). **Target**: ~7 working days to deliver ~20+ new pages + 1 API route.

**Branch**: `feat/pricing-update-2026`  
**Repo**: `/Users/rosinante/Projects/Vectroy`  
**Working Tree**: Has unrelated uncommitted changes — do NOT clobber them. Only touch `src/app/`, `src/components/`, `public/data/`.

---

## 📖 Documents to Read (In Order)

### 1. **HANDOVER_INDEX.md** (10 min)
**Location**: `/Users/rosinante/Projects/Vectroy/HANDOVER_INDEX.md`

Read this first for a quick overview of the project scope, timeline, and success criteria. This is your orientation guide.

### 2. **HANDOVER.md** (15 min)
**Location**: `/Users/rosinante/Projects/Vectroy/HANDOVER.md`

Read this for detailed context on:
- What was completed in Phases 1-2
- Phase breakdown overview
- Current repository state
- Key architecture decisions (API patterns, credit costs, page templates)
- Files to read before starting
- Known blockers and workarounds
- Next steps

### 3. **IMPLEMENTATION_PLAN_VECTOSOLVE_PARITY.md** (30 min)
**Location**: `/Users/rosinante/Projects/Vectroy/IMPLEMENTATION_PLAN_VECTOSOLVE_PARITY.md`

Read this for the complete specification:
- Objective and scope summary
- Detailed breakdown of all 10 phases
- File structure and new routes to create
- Key integration points (auth, credits, job polling, API patterns)
- Risk assessment and mitigations
- Success criteria for each phase

### 4. **HANDOVER_EXECUTION_PROMPT.md** (Optional Reference)
**Location**: `/Users/rosinante/Projects/Vectroy/HANDOVER_EXECUTION_PROMPT.md`

This is a concise reference for Phase 3 execution details. Keep it open as you build.

---

## 🎯 Phase Breakdown

### Phase 3: Standalone Tool Pages (2 working days)
**Deliverables**: 3 pages + 1 API route

- **`/upscale/page.tsx`** — Image upscaler (2x or 4x)
- **`/remove-bg/page.tsx`** — Background remover
- **`/batch/page.tsx`** — Batch conversion hub
- **`POST /api/batch/create/route.ts`** — Batch creation API

**Success Criteria**:
- [ ] All 3 pages load without auth errors
- [ ] File uploads work and queue jobs
- [ ] Job polling returns correct states
- [ ] Credits deduct correctly (0.25 each)
- [ ] Before/after previews render
- [ ] Build completes with no TypeScript errors

### Phase 4: For-Makers Verticals (3 working days)
**Deliverables**: 9 funnel pages for maker niches

- `/svg-for-cricut` — Cricut blade types & mat sizes
- `/svg-for-laser-cutting` — Glowforge, xTool, K40
- `/svg-for-bambu-lab` — 3D printing optimization
- `/svg-for-etsy-sellers` — POD prep + sizing
- `/embroidery-converter` — DST/PES/JEF + stitch count
- `/svg-for-vinyl-cutting` — Silhouette, Cricut Vinyl
- `/print-on-demand` — Color separation, DPI
- `/svg-for-screen-printing` — Screen separations
- `/svg-for-dtf` — Direct-to-film, transparency

**Pattern**: Each page is a funnel → acknowledges niche → CTAs to /convert with pre-filled format

**Success Criteria**:
- [ ] All 9 pages render correctly
- [ ] CTAs pass format query string to /convert
- [ ] Responsive at 320px, 768px, 1024px
- [ ] SEO metadata unique per page

### Phase 5: Free Tools (2 working days)
**Deliverables**: 3 free tools (no credit cost)

- `/svg-editor` — In-browser SVG editor (read-only initially)
- `/templates` — SVG template gallery
- `/favicon-generator` — Favicon converter

**Success Criteria**:
- [ ] All 3 pages load
- [ ] SVG editor renders (no drawing required for MVP)
- [ ] Templates load from data file
- [ ] Favicon generator exports correct format

---

## 🔧 Technical Reference

### API Pattern
```
POST /api/convert
{
  file: File (multipart)
  outputFormat: "svg" | "pdf" | ...
  removeBg?: boolean
  upscale?: null | "2x" | "4x"
}

Response:
{
  "conversionId": "uuid",
  "jobId": "bull-queue-id",
  "creditCost": 0.25,
  "remainingBalance": 99.75
}

Then poll: GET /api/jobs/[id]
Response: { id, state, progress, data, returnvalue, failedReason }
```

### Credit Costs (from `src/lib/credits/constants.ts`)
```
VECTORIZE: 1.00
REMOVE_BG: 0.25
UPSCALE_2X: 0.25
UPSCALE_4X: 0.25
AI_GENERATE: 0.50
```

### Page Template Pattern
```tsx
'use client'

import { SiteHeader, SiteFooter } from '@/components/site-chrome'
import { CREDIT_COSTS } from '@/lib/credits/constants'

export default function ToolPage() {
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
- `DragDropUpload` for file upload
- `AuthSlot` for user info / login prompt
- Pricing table from `/pricing/page.tsx`
- Workflow cards from `/for-crafters/page.tsx`

---

## ✅ Execution Checklist

### Before Starting
- [ ] Read all 4 documents above (1 hour total)
- [ ] Verify you're on branch `feat/pricing-update-2026`
- [ ] Review `src/app/generate-logo/page.tsx` for page template
- [ ] Review `src/app/api/convert/route.ts` for API pattern
- [ ] Verify unrelated changes are NOT staged for commit

### Phase 3 Execution
- [ ] Create `/upscale/page.tsx`
- [ ] Create `/remove-bg/page.tsx`
- [ ] Create `/batch/page.tsx`
- [ ] Create `POST /api/batch/create/route.ts`
- [ ] Test all 3 pages manually
- [ ] Run `npm run build` — verify TypeScript compiles
- [ ] Commit: `git add src/app/{upscale,remove-bg,batch} src/app/api/batch/create && git commit -m "feat(phase-3): Standalone tool pages and batch API"`
- [ ] Push: `git push origin feat/pricing-update-2026`

### Phase 4 Execution
- [ ] Create all 9 for-makers vertical pages
- [ ] Verify each page renders and CTAs work
- [ ] Run `npm run build`
- [ ] Commit: `git add src/app/svg-for-* src/app/embroidery-* src/app/print-on-* && git commit -m "feat(phase-4): For-makers verticals (9 pages)"`
- [ ] Push

### Phase 5 Execution
- [ ] Create `/svg-editor/page.tsx` (read-only initially)
- [ ] Create `/templates/page.tsx`
- [ ] Create `/favicon-generator/page.tsx`
- [ ] Create `public/data/templates.json` if needed
- [ ] Test all 3 pages
- [ ] Run `npm run build`
- [ ] Commit: `git add src/app/{svg-editor,templates,favicon-generator} public/data/templates.json && git commit -m "feat(phase-5): Free tools (3 pages)"`
- [ ] Push

### After Phase 5
- [ ] Verify no build errors
- [ ] All commits pushed to `feat/pricing-update-2026`
- [ ] Ready for Phase 6 (next session)

---

## ⚠️ Known Blockers & Workarounds

### File Write Permissions
- `write()` and `edit()` tools fail with "Permission denied" on files in the repo
- **Workaround**: Use shell heredoc (`cat > file << 'EOF'`) to write files
- This works reliably for all file types

### Next.js Version Specifics
- Read `node_modules/next/dist/docs/` before implementing advanced features
- The version may have breaking changes from public documentation

### Unrelated Changes in Working Tree
- Tests, docker-compose.yml, deleted docs, concept PNGs exist
- Do NOT commit these
- Only touch `src/app/`, `src/components/`, `public/data/`

---

## 📊 Key Files to Reference

**Patterns to Copy From**:
- `src/app/generate-logo/page.tsx` — Tool page template
- `src/app/api/convert/route.ts` — Conversion API pattern
- `src/app/api/jobs/[id]/route.ts` — Job polling pattern
- `src/app/pricing/page.tsx` — Pricing table component
- `src/components/site-chrome.tsx` — Header/footer components

**Research & Planning**:
- `VECTOSOLVE_FEATURES.md` — Complete VectoSolve feature inventory
- `VECTOSOLVE_GAP_ANALYSIS.md` — Competitive opportunities
- `PHASE_7_COMPLETE.md` — Current architecture reference
- `BUILD_STATUS.md` — Component availability

**Configuration**:
- `src/lib/credits/constants.ts` — Credit costs + pricing tiers
- `src/lib/supabase/server.ts` — Auth helpers
- `src/lib/queue/queues.ts` — Bull queue setup
- `package.json` — Dependencies + scripts

---

## 🎬 Ready? Here's Your Starting Point

1. **Open `/Users/rosinante/Projects/Vectroy/HANDOVER_INDEX.md`** — Read for 10 minutes
2. **Open `/Users/rosinante/Projects/Vectroy/HANDOVER.md`** — Read for 15 minutes
3. **Open `/Users/rosinante/Projects/Vectroy/IMPLEMENTATION_PLAN_VECTOSOLVE_PARITY.md`** — Skim for 30 minutes (focus on Phases 3-5)
4. **Verify branch**: Run `git status` and confirm you're on `feat/pricing-update-2026`
5. **Start Phase 3**: Begin with `/upscale/page.tsx`

---

## 🚀 Let's Go!

Once you've read the documents above, reply with:

> I've read the documents and I'm ready to start Phase 3. Show me the implementation for `/upscale/page.tsx` first.

Then I'll walk you through the implementation step-by-step, test as we go, and move sequentially through Phases 3 → 4 → 5.

---

## Questions Before You Start?

- **What branch am I on?** → `feat/pricing-update-2026`
- **What do I need to read?** → The 4 documents listed above (1 hour total)
- **What's the timeline?** → ~7 working days for Phases 3-5
- **What if something breaks?** → Reference the existing pages/APIs; all patterns are already in place
- **What about unrelated changes?** → Leave them alone; only touch `src/app/`, `src/components/`, `public/data/`

**Ready? Start reading the documents, then let me know when you're ready to begin Phase 3. 🚀**

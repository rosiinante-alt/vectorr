# Execution Prompt: VectoSolve Feature Parity Phase 3-10

**Copy this entire section into a new Claude session to execute the implementation plan.**

---

## Your Task

You are continuing Vectroy development to achieve complete VectoSolve feature parity. Previous sessions built the core vectorization engine and Phase 1-2 AI generation tools (logo, SVG, pattern, image, animate, describe, brand identity).

**Your job**: Build Phases 3-10 (standalone tools, maker verticals, business pages, marketing pages, legal, pricing enhancements, navigation updates). **Target**: 16 working days to complete ~40 new pages + API routes + JSON data files.

---

## Context

- **Repo**: `/Users/rosinante/Projects/Vectroy`
- **Branch**: `feat/pricing-update-2026`
- **Current state**: 49 page.tsx files, 330 total routes (299 content + 31 API)
- **Plan**: `IMPLEMENTATION_PLAN_VECTOSOLVE_PARITY.md` (read this first)
- **Tech stack**: Next.js App Router, Tailwind CSS, Supabase auth, Stripe/Polar payments, Replicate API (vectorize)
- **Component library**: Existing components in `src/components/`
- **Credit system**: Defined in `src/lib/credits/constants.ts`

---

## Start Here: Phase 3

**Scope**: 3 pages + 1 API route

### Files to Create

1. **`/upscale/page.tsx`** (kimi-k2.7-code)
   - Standalone image upscaler (2x or 4x)
   - Drop zone for image upload
   - Before/after preview
   - Credit cost display
   - Job polling via /api/jobs/[id]
   - Download button for upscaled image
   - Sidebar with "How it works" + "Next steps"
   - SEO: title "Upscale images 2× or 4× with AI"
   - Reference: `/generate-logo/page.tsx` for pattern

2. **`/remove-bg/page.tsx`** (kimi-k2.7-code)
   - Standalone background remover
   - Drop zone for image upload
   - Before/after preview (after shows transparent bg as checkerboard)
   - Credit cost display (CREDIT_COSTS.REMOVE_BG = 0.25)
   - Job polling
   - Download button (PNG with transparency)
   - Sidebar with "How it works" + "Next steps"
   - SEO: title "Remove backgrounds from images instantly"

3. **`/batch/page.tsx`** (kimi-k2.7-code)
   - Main batch upload hub (not /batch/[id] which already exists)
   - Form: upload folder or Zip
   - Show preprocessing options (remove-bg, upscale)
   - Show output format selector
   - Cost calculator: "X files × cost = total"
   - CTA: "Start batch" → POST /api/batch/create → redirect to /batch/[id]
   - SEO: title "Batch convert hundreds of images to SVG"
   - Reference: /generate-logo for form pattern

4. **`POST /api/batch/create/route.ts`** (deepseek-v4-pro)
   - Accept multipart/form-data: files[], outputFormat, removeBg, upscale
   - Or accept application/json with fileUrls (for external sources)
   - Validate: file count < 500, formats are allowed, total size < 500MB
   - Create batch record in Supabase: `batches` table
     - Columns: id, user_id, created_at, file_count, status, estimated_cost, output_format, preprocessing
   - Calculate cost: sum of all files with preprocessing
   - Check user credits; return 402 if insufficient
   - Return: `{ batchId: "...", estimatedCost: 12.50, remainingBalance: ... }`
   - Queue first file; batch processor picks up rest
   - Error handling: file too large, unsupported format, server error
   - Reference: `POST /api/convert` for pattern

---

## Key Integration Points

### Authentication
- All pages use `authenticate()` from `@/lib/supabase/server`
- Redirect to /login if not authenticated (except /upscale, /remove-bg preview without auth)

### Styling
- Use existing CSS variables: `bg-bg-secondary`, `text-primary`, `accent`, `error-wash`, etc.
- Reuse components: `SiteHeader`, `SiteFooter`, `DragDropUpload` (adapt as needed)
- Responsive: mobile-first, test at 320px, 768px, 1024px

### Credit System
- Import: `import { CREDIT_COSTS } from '@/lib/credits/constants'`
- Costs: VECTORIZE (1.0), REMOVE_BG (0.25), UPSCALE_2X (0.25), UPSCALE_4X (0.25)
- Deduct via: `creditManager.deductCredits(supabase, userId, amount, reason)`

### Job Polling
- POST to /api/convert or new /api/batch/create
- Receive: `{ jobId: "...", conversionId: "..." }`
- Poll: `GET /api/jobs/[id]`
- Response: `{ id, state, progress, data, returnvalue, failedReason }`
- State values: "waiting", "active", "completed", "failed"
- Continue polling until state !== "active"

### Page Template
Each page should:
- Start with `'use client'`
- Import SiteHeader, SiteFooter
- Have `<a className="skip-link" href="#main">Skip to content</a>`
- Wrap main content in `<main id="main">`
- End with `<SiteFooter />`

---

## Testing Checklist for Phase 3

- [ ] /upscale page loads
- [ ] Can upload image and see preview
- [ ] Upscale 2x and 4x buttons work
- [ ] Credit cost displays correctly (0.25 credits each)
- [ ] After clicking "Upscale", job status polls
- [ ] Download button appears after job completes
- [ ] Downloaded file is valid PNG
- [ ] /remove-bg page works identically
- [ ] Credit cost displays 0.25
- [ ] After download, transparent background is visible
- [ ] /batch page shows upload form
- [ ] Cost calculator updates as files are added
- [ ] "Start batch" button queues batch
- [ ] Redirect to /batch/[id] shows status
- [ ] POST /api/batch/create validates file count and size
- [ ] Returns 402 if insufficient credits
- [ ] Batch record created in Supabase

---

## After Phase 3

Once tested and working:
1. Commit: `git add src/app/{upscale,remove-bg,batch} src/app/api/batch/create && git commit -m "feat(phase-3): Standalone tool pages and batch API"`
2. Run: `npm run build && npm run test` to verify
3. Merge: `git push origin feat/pricing-update-2026`
4. Notify: Write a summary of Phase 3 work, then move to Phase 4

---

## Phase 4-10 Overview (Execute After Phase 3)

**Phase 4** (3 days): 9 For-Makers vertical pages — each is a funnel page that acknowledges niche, then CTAs to /convert with pre-filled format
**Phase 5** (2 days): Free tools (svg-editor, templates, favicon-generator)
**Phase 6** (2 days): Resource hubs (gallery, how-to, alternative, glossary, faq) + JSON data files
**Phase 7** (1 day): Business pages (pro, api, done-for-you, network)
**Phase 8** (3 days): Marketing pages (reviews, free-svg-files, vectorize-my-logo, etsy-svg-optimizer, svg-to-png, affiliate, partners, refer, education, press, terms, privacy)
**Phase 9** (2 days): Pricing page enhancements (cost slider, per-tool breakdown, annual toggle, one-time purchase)
**Phase 10** (1 day): Navigation updates (search, language switcher, footer reorganization)

Each phase has a detailed specification in `IMPLEMENTATION_PLAN_VECTOSOLVE_PARITY.md`.

---

## Resources

- **Plan**: `IMPLEMENTATION_PLAN_VECTOSOLVE_PARITY.md` (full spec with all phases)
- **Features inventory**: `VECTOSOLVE_FEATURES.md` (what VectoSolve has)
- **Gap analysis**: `VECTOSOLVE_GAP_ANALYSIS.md` (opportunities for differentiation)
- **Current state**: `PHASE_7_COMPLETE.md` (what we've built so far)
- **Component reference**: `BUILD_STATUS.md`
- **API reference**: Read existing routes in `src/app/api/`

---

## Success Criteria for Phase 3

✅ All 3 pages load without authentication errors
✅ File uploads work and queue jobs correctly
✅ Job polling returns correct state transitions
✅ Credit deductions match CREDIT_COSTS
✅ Before/after previews render correctly
✅ No console errors in production build

Once Phase 3 is complete and tested, proceed to Phase 4.

---

## Questions?

Refer to:
- `src/app/generate-logo/page.tsx` — pattern for AI generation pages
- `src/app/api/convert/route.ts` — pattern for conversion API
- `src/app/api/jobs/[id]/route.ts` — pattern for job polling
- `src/lib/credits/constants.ts` — credit costs reference

Start coding!

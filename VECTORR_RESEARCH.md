# Vectorr — Market & Design Research
**Prepared by**: Research Agent · **Date**: Nov 1, 2026
**Audience**: UI/Frontend Agent + Backend Agent (build inputs)
**Method**: Public-domain only — vendor marketing/pricing pages, vendor CSS/JS bundles, Product Hunt, Indie Hackers, GitHub. Every price below was read off a live vendor page on Nov 1, 2026 unless marked **[unverified]**.

> **One-line thesis for the team**: The vector *tracing* market is saturated and price-collapsing (unlimited tracing now sells for $5.49–$9.99/mo). Nobody owns **vector *optimization*** — cleaning up an SVG you already have (node reduction, path simplification, palette trimming, file-size budget) — and the design-tool incumbents treat it as a side feature. **Vectorr should win on "your SVG is 2.4 MB and Figma chokes on it" — not on "turn my photo into a vector."** Tracing stays as a Month-2 hook, not the headline.

---

## 1. vectosolve.com Analysis

### 1.1 What it is
- **Product**: Browser-based raster→vector + vector-art toolkit ("Vectorize. Clean. Enhance."). Upload PNG/JPG → get SVG/AI/EPS/PDF/DXF/G-code/DST/PES/JEF in **2–5 seconds**.
- **Founded**: 2024. **Founder**: Robin Monteiro (French, ex-construction industry, non-developer; built the product solo using Claude). **Stack** (from Indie Hackers): Next.js + Supabase + Vercel + Stripe; AI engine powered by **Recraft**.
- **Positioning line**: *"Vectorize any image in seconds — without Illustrator."* Comparison anchors on the pricing page are **Adobe Illustrator**, **Vectorizer.AI**, and **Vector Magic**.
- **Scale signals**: Product Hunt listing claims **50,000+ conversions**, **1,915+ users**, **4.9/5** rating. Indie Hackers profile lists revenue as **$6/mo** (self-reported, stale snapshot — treat as a signal that growth is traffic/SEO-led, not revenue-led, or that reporting stopped early). Site ships **67 dedicated converter pages** ("PNG to SVG", "JPG to DXF", …), **230+ blog articles**, and **10–11 UI locales** — classic programmatic-SEO + i18n growth playbook.
- **Surfaces**: Web app, **Chrome + Firefox extensions**, **REST API** (`POST /api/v1/vectorize` with `mode=laser|cricut|embroidery`), Prepaid credit packs.
- **Links verified**: https://vectosolve.com · https://vectosolve.com/pricing · https://vectosolve.com/llms.txt · https://www.producthunt.com/products/vectosolve · https://www.indiehackers.com/product/vectosolve

### 1.2 Feature inventory (what they actually ship)
| Area | Capability | Notes for us |
|---|---|---|
| Core | Raster→vector trace (multiple "modes": laser/cricut/embroidery presets) | Commodity — see §2. Don't lead with it. |
| Core | Remove background | Cheap AI call; 0.07 credits |
| Core | Upscale | 0.15 credits |
| Generation | Logo generation, SVG generation, Pattern generation | 0.25 credits — "AI enhancement" tier |
| Generation | Animation (short/medium/long: 0.10/0.25/0.50 credits) | Out of scope for Vectorr MVP |
| Assets | Brand kit (2.50 credits — expensive by design) | Teams-only, Month 4+ |
| Batch | **Up to 50 files per batch + ZIP download** | Their batch is *already live* — so our "Month 3 batch" is a catch-up, not a differentiator. Batch on **optimization** is still unclaimed. |
| Integrations | Chrome + Firefox extensions | Good growth wedge later; not MVP |
| Integrations | REST API, 4 tiers, ~30% yearly discount | Their API is their moat for print shops — Month 4 for us |
| Outputs | SVG, AI, EPS, PDF, DXF, G-code, DST, PES, JEF | Hardware formats (laser/embroidery) = a real niche with real willingness to pay |
| UX | Free watermarked preview, **no signup required**; pay $6.99 to unlock one file | **Copy this.** Lowest-friction funnel in the category. |
| Ops | Credits roll over while subscription is active; **failed jobs auto-credited** | Copy both policies — they kill the #1 support ticket. |

### 1.3 UX flows worth stealing (observed)
1. **Zero-friction try**: Hero CTA = "1 free conversion with an account · No signup to try" → drag-drop → **watermarked preview** → paywall. The paywall sits *after* the user has seen their own file converted. No form walls before value.
2. **Mode-first, not format-first**: users pick the *destination* (laser cutter / Cricut / embroidery / web) and the engine picks parameters. Vectorr equivalent: **"Destination: Web / Print / Laser / Figma"** → picks optimization aggressiveness.
3. **Comparison table on the pricing page** vs Illustrator / Vectorizer.AI / Vector Magic — with their own price as the cheap column. Cheap to build, high conversion.
4. **Programmatic landing pages** (67 converter pages) + long-tail blog. This is how they get traffic without paid ads.

### 1.4 Gaps / weaknesses (our openings)
- **No vector-in → vector-out optimization.** They convert *images*. They do not take your existing bloated SVG/AI/EPS and reduce nodes, merge paths, quantize colors, or report "2.4 MB → 180 KB". **This is Vectorr's core.**
- **No measurable output quality report** (node count, path count, color count, bytes saved). We should make this the hero metric — a diff scorecard.
- **No real editor** — output is a download, not a canvas you can touch. Our spec's read-only canvas is a start; an inspect/clean panel is the differentiator.
- **Generic AI aesthetic** (green→blue gradient everything). Legible, but indistinguishable from 500 other AI SaaS.
- **Batch is raster-trace only**; nothing for "optimize this folder of 200 icons."
- **API is trace-only**; no `/optimize` endpoint exists anywhere in the market at a fair price (see §2, Figma/Linearity).

---

## 2. Competitor Matrix

| Name | Type | Price | Key Strength | Weakness |
|---|---|---|---|---|
| **vectosolve.com** | Trace + AI art SaaS | Free watermarked preview; **$6.99** one-file unlock; **Starter $7.99/mo** ($49/yr ≈ $4.08/mo, 25 conversions/mo); **Pro $14.99/mo** ($129/yr, 100/mo); **Production $99/mo** (1,500/mo); API **$29 / $99 / $199 / $399** per mo (500 / 1,500 / 3,500 / 8,000 conversions, ~30% less yearly); prepaid **$19.99 / 100** | Fastest funnel (no signup), hardware formats (G-code/DST/PES), 67 SEO pages, API for print shops | No vector→vector optimization, no editor, no quality metrics, thin brand |
| **Vectorizer.AI** | Trace SaaS (Cedar Lake Ventures) | **Web $9.99/mo unlimited**; API per-credit from **$0.20** (50/mo, $9.99) down to **$0.05** (100k/mo, $4,999.99); credits roll over ≤5× | Best-in-class trace quality ("whole-shape fitting", Vector Graph); free interactive preview, pay to download | Tracing only; no optimization; API pricing steep at scale |
| **Vector Magic** | Trace SaaS + desktop (same parent as Vectorizer.AI) | **Online $5.49/mo unlimited**; **Desktop $295 one-time** | Cheapest unlimited trace; desktop = one-time purchase | Dated UI; no refunds; no academic pricing; no optimization |
| **Adobe Illustrator** | Pro desktop editor | **~$22.99/mo** *(price as cited by VectoSolve's pricing page — Adobe's own pricing pages are JS-rendered and could not be read via fetch; UI agent should confirm in-browser before quoting it)* | Industry standard; image trace; full editing | Heavy, expensive, steep learning curve; optimization is manual (no "clean my SVG" button) |
| **Figma** | Collaborative design platform | **Starter free** (150 AI credits/day, 500/mo); **Professional $16/seat/mo** (Dev $12, Collab $3); **Organization $55** (Dev $25, Collab $5); **Enterprise $90** | Category default; has **Vectorize** (image→editable vector), Figma Draw, MCP server; teams already live here | Optimization buried in plugin/export; no bulk "shrink my SVGs"; credit limits on AI |
| **Linearity (ex-Vectornator)** | Design app (Curve + Move) | **Free** (250 lifetime AI credits, 1 brand kit, 5 GB); **Pro $10/mo** ($8 annual)/editor; **Studio $30** ($25); **Business $80** ($65); Enterprise custom | Free tier + Apple Design Award polish; pivoted hard to AI campaign generation | Pivot away from vector editing; exports only PNG/JPEG/SVG/PDF; no optimization tooling |
| **Boxy SVG** | Web SVG editor | **$9.99/year** after a **15-day free trial**, no credit card required (read from the app's own bundle, `trial-hint` template) | Cheapest real SVG editor; ChromeOS/edu friendly | Editor, not an optimizer; niche audience; dated marketing |
| **Potrace** | OSS CLI tracer | **Free (GPL)** | The engine everything else is built on; SVG/PDF/EPS/PS/DXF/GeoJSON/PGM outputs; tunable (`--turdsize`, `--alphamax`, `--opttolerance`) | CLI only, no UI, no optimization of existing vectors; last release v1.16 (2019) |
| **Affinity Designer** | Pro desktop editor | **Uncertain post-acquisition** — `affinity.serif.com` now serves Canva-served pages after the **Canva acquisition**; historic one-time ~$69.99 *(unverified)* | One-time purchase, strong for print | Pricing/model in flux; no SaaS/web; no optimization pipeline |
| **SVGO** | OSS SVG optimizer (GitHub, `svgo`) | **Free (MIT)** | The de-facto optimizer library; plugins for path simplification, `cleanupIds`, `convertPathData` | Node/CLI only, no UI, no quality report, no color/palette intelligence — **this is the gap Vectorr sells a UI on** |

### 2.1 What the matrix says
- **Price floor for tracing is $5.49/mo and heading to $0** (Potrace + a weekend). Do not price against tracing.
- **Nobody sells optimization as a product.** SVGO is a library; Illustrator/Figma treat it as a checkbox. A hosted, measurable, batchable optimizer with a nice canvas is genuinely open.
- **The money is in the tail of the market**: print shops, laser/CNC users, embroidery, and web teams with 500-icon design systems. Those are *volume* and *predictable* users.
- **Figma adjacency is the cheapest distribution**: a Figma plugin that runs Vectorr's optimizer on selected nodes is worth more than any ad budget.

---

## 3. Design System Extraction

> ⚠️ **Conflict with the spec — decide before the UI agent starts.**
> `VECTORR_PROJECT_SPEC.md` pre-locks `--accent: #007AFF` / `#34C759` / SF Pro (Apple-style). The brief for this research says *extract exact hex codes and font names from the competitor*. **VectoSolve's actual tokens are below.** Recommendation: **take VectoSolve's blue/green *pairing* and Inter, drop the gradients and glows**, then keep the spec's `#F5F5F7`/`#1D1D1F` neutrals for the light-mode minimalist look the spec asks for. That gives Vectorr "VectoSolve's energy, Apple's restraint" — which is exactly the stated goal ("inspiration: vectosolve, but better design").

### 3.1 Typography (verified in VectoSolve's CSS bundle)
- **Font**: **Inter** — self-hosted `.woff2`, exposed as the CSS class `__Inter_9b0f91` (Next.js `next/font` local). No second family; weight range is used for hierarchy (400/500/600/700).
- **Mono**: none shipped on the marketing site — for Vectorr's file-size/node-count metrics use **SF Mono** (spec) or `ui-monospace, SFMono-Regular, Menlo` stack.
- **Scale in use**: 12 / 14 / 16 / 18 / 20 / 24 / 30 / 36 / 48 / 60px; marketing H1 ≈ 48–60px, `font-weight: 700`, tight tracking (`-0.02em`-ish). Body 16px/1.6.

### 3.2 Color tokens (exact, from their stylesheets — ranked by frequency in the bundle)
| Role | Hex | Frequency | Where |
|---|---|---|---|
| **Primary (brand blue)** | `#0090ff` | 131 uses | Links, primary CTA, gradient end, focus rings |
| **Secondary (brand green)** | `#1cb721` | 127 uses | Success, drop-zone, gradient start, "live" badges |
| Accent — pink | `#e84393` | — | AI-generation category chips |
| Accent — orange | `#f39c12` | — | Warning / "Pro" tags |
| Accent — indigo | `#6c5ce7` | — | Feature icon tint |
| Accent — purple | `#9b59b6` | — | Feature icon tint |
| Text primary | `#1f2937` | — | Headings (Tailwind gray-800) |
| Text secondary | `#374151` / `#4b5563` | — | Body / captions (gray-700 / gray-600) |
| Border | `#e5e7eb` | — | Cards, dividers (gray-200) |
| Surface subtle | `#f3f4f6` | — | Section tint (gray-100) |
| Dark-mode page bg | `#1a1d21` | — | Dark theme body |
| Dark-mode card | `#212529` | — | Dark cards / header |
| Theme color (meta) | `#ffffff` light / `#0a0a0a` dark | — | `<meta name="theme-color">` |

**Logo wordmark gradient**: `linear-gradient(90deg, #1cb721 25%, #0090ff 75%)` — green→blue, left to right. This is the single most identifiable brand asset they have.

### 3.3 Radii, shadows, motion
- **Radii**: CSS var `--radius` plus `0.25rem` (inputs), `0.75rem` (buttons), `1rem` (cards), `1.5rem` (large panels); **pills `9999px`** for badges and CTAs.
- **Glow shadows** (their signature): `0 0 8px rgba(28,183,33,.4)` (idle green glow) and `0 0 20px rgba(28,183,33,.8), 0 0 40px rgba(0,144,255,.3)` (active green+blue dual glow).
- **Hero drop-zone**: **4px dashed green** border; on hover it becomes a **green→blue gradient shimmer border** implemented as a background with `bg-[length:200%_100%]` animating position.
- **Demo**: a **6-second looping** photo→SVG morph, with a `prefers-reduced-motion` static fallback. Copy the *idea* (show the transformation), not the exact loop.
- **Nav**: **64px** sticky header, `backdrop-filter: blur(...)`, and a **680px mega-menu** with an in-menu tool search box.
- **Spec's motion tokens** (`spring {0.35, 0.8}`, `snappy {0.25, 0.6}`) fit fine on top of this — Motion.dev honors spring configs directly.

### 3.4 Recommended Vectorr token set (resolve the conflict)
```css
/* Take these from VectoSolve (they are the brand signal) */
--accent:        #0090ff;   /* primary action — replaces spec's #007AFF */
--accent-2:      #1cb721;   /* success / "optimized" state — replaces #34C759 */
--logo-gradient: linear-gradient(90deg, #1cb721 25%, #0090ff 75%);

/* Keep these from the spec (minimalist light mode) */
--bg-primary:    #FFFFFF;
--bg-secondary:  #F5F5F7;
--bg-tertiary:   #E8E8ED;
--text-primary:  #1D1D1F;
--text-secondary:#6E6E73;

/* Use VectoSolve's neutrals for dense UI chrome (editor, file lists) */
--border:        #e5e7eb;
--text-ui:       #374151;

/* Drop entirely: the dual green+blue glow, the shimmer border, the 4px dashed
   drop-zone, the 680px mega-menu. Those are VectoSolve's tells, not ours. */

--font-sans: "Inter", "SF Pro Text", system-ui, sans-serif;
--font-mono: "SF Mono", ui-monospace, Menlo, monospace; /* for metrics only */
--radius-sm: .25rem; --radius-md: .75rem; --radius-lg: 1rem; --radius-xl: 1.5rem;
```
**Contrast check for the UI agent** (computed, WCAG 2.1 relative luminance):
- `#0090ff` on white = **3.26:1** — **fails AA** for normal text. Fine for fills, borders, icons ≥3:1. White text on `#0090ff` is the same 3.26:1, so only **≥19px bold / ≥24px** passes (3:1 large-text rule).
- `#1cb721` on white = **2.68:1** — icon/state only, **never text**.
- Fix for body-size links/CTAs: `#0072cc` on white = **4.56:1** ✅ AA.
- Note the spec's `--accent: #007AFF` has the same defect: **4.02:1**, just under AA's 4.5. **This is a real flaw in VectoSolve's design — fix it, don't inherit it.**

### 3.5 Copy patterns worth reusing (short list)
- Value in **one clause + a number**: "Vectorize any image **in seconds**."
- **Objection-first badges**: "No signup to try", "No credit card", "Failed jobs are auto-credited."
- **Destination naming**, not format naming: "For laser cutters", "For Cricut", "For the web".
- Vectorr's equivalent headline candidates: *"Your SVG is 2.4 MB. Make it 180 KB — without losing a curve."* / *"Clean vectors in one drop."*

---

## 4. Feature Priority Matrix

Scoring: **Impact** = value to the user's stated job; **Effort** = backend+frontend days at MVP quality. Priority = impact ÷ effort, with the spec's locked months respected.

| # | Feature | Impact | Effort | Priority | Tier | Target |
|---|---|---|---|---|---|---|
| 1 | **Optimize vectors** (path simplification, node reduction, `cleanupIds`, `convertPathData`, precision tuning) | **Critical** — this *is* the product; nobody else sells it (§2.1) | 4–6 d (SVGO plugin chain + Potrace for raster) | **P0** | Must-have | **Launch** |
| 2 | File upload + SVG validation + preview canvas | Critical (gateway) | 2–3 d | **P0** | Must-have | Launch |
| 3 | **Optimization report** (bytes before/after, node count, path count, color count, % saved) | High — turns an invisible optimization into a screenshot-able result; nobody does this | 1 d (parse SVG, count) | **P0** | Must-have | **Launch** (cheapest differentiator in the whole plan) |
| 4 | Export SVG + PNG + PDF | High | 1–2 d (Sharp for PNG, PDF via SVG→PDF) | **P0** | Must-have | Launch / Week 2 |
| 5 | Supabase magic-link auth | Medium (needed for limits/history) | 1 d | **P0** | Must-have | Launch |
| 6 | **Color extraction + palette generation** (unique-color count, quantize, suggest reduced palette) | Medium-High — pairs naturally with optimization ("this SVG has 4,300 colors, it needs 12") | 2 d | P1 | Should | Week 2 |
| 7 | Free-tier metering + watermark/limit on export | High (revenue) | 1 d | P1 | Must-have (business) | Launch |
| 8 | **AI enhancement** (raster→vector via Replicate/Fal, auto-palette, cleanup suggestions) | Medium — high demo value, but the market is at $5.49 unlimited (§2) so it cannot be the moat | 3–5 d (prompt/model tuning, cost control) | P1 | Nice-to-have | **Month 2** |
| 9 | **Batch processing** (multi-file upload, queue, ZIP download, per-file report) | High for the real buyer (print shops, design-system teams) — but VectoSolve already has 50-file batch, so parity only | 3–4 d (job queue, progress, ZIP) | P2 | Should | **Month 3** |
| 10 | **Team sharing** (workspace, shared history, roles, RLS) | Medium — unlocks Team tier | 4–5 d (RLS policies are the risky part) | P2 | Should | **Month 3** |
| 11 | **API access** (`POST /api/v1/optimize`, keys, rate limits, usage dashboard) | High — the only segment paying real money (VectoSolve charges $29–$399/mo for a *trace* API) | 4–6 d | P2 | Should | **Month 4** |
| 12 | Figma plugin (optimize selected nodes) | High (distribution) | 3–4 d | P2 | Could | Month 4+ |
| 13 | Animation generation, brand kits, hardware formats (DST/PES/G-code) | Low for us, high for VectoSolve's niche | High | P3 | Won't (yet) | — |

### 4.1 MVP cut line (what actually ships on launch day)
Ship **1–5 + 7**. That is: drop an SVG → see it rendered → click Optimize → see *"2.41 MB → 178 KB, 41,203 → 2,914 nodes, 4,318 → 12 colors"* → download SVG/PNG/PDF → hit the free-tier wall → magic-link → paid.

> The one feature that must not slip: **#3, the optimization report.** It is one day of work, it is the thing users screenshot and post, and no competitor has it.

### 4.2 Notes for the Backend Agent (aligns with locked stack: Sharp.js + Potrace, Supabase, Next.js API routes)
- `POST /api/files/upload` → validate SVG (reject `<script>`, external `xlink:href`, `foreignObject`; cap at ~10 MB), store in Supabase Storage, return parsed metrics.
- Optimization pipeline: **SVGO** (Node) with a conservative plugin chain for `mode=web` (preserve `viewBox`, don't merge paths across colors, precision 2) and a lossless-ish chain for `mode=print`. Potrace (CLI or `esm-potrace-wasm`) only on the **raster→vector** path (#8), not on SVG→SVG.
- Expose optimization aggressiveness as **destination presets** (Web / Print / Laser / Figma) — copies VectoSolve's best UX idea (§1.3.2) while applying it to a job they don't do.
- Job model: `jobs` table with `status ∈ {queued,running,done,failed}`; **auto-credit on failure** (VectoSolve does this and it removes the top support ticket).
- Rate limit per key/plan; log `bytes_before`, `bytes_after`, `nodes_before`, `nodes_after` per job — that table *is* the analytics dashboard and the marketing proof.
- API shape to reserve now so Month 4 isn't a rewrite: `POST /api/v1/optimize { file, mode, preset } → { job_id }`, `GET /api/v1/jobs/:id → { url, report }`.

---

## 5. Pricing Strategy (3 Tiers)

### 5.1 The competitive price ladder (verified)
| Player | Entry | Mid | High |
|---|---|---|---|
| Vector Magic | **$5.49/mo** unlimited trace | $295 one-time desktop | — |
| Boxy SVG | **$9.99/year** | — | — |
| Vectorizer.AI | **$9.99/mo** unlimited trace | API $9.99–$4,999.99/mo | — |
| VectoSolve | $6.99 one-file | **$7.99/mo** (25 conv) | **$14.99/mo** (100 conv) · **$99/mo** (1,500) |
| Linearity | Free (250 credits) | **$8–10/mo** per editor | **$25–30/mo** |
| Figma | Free | **$16/mo** per seat | **$55–90/mo** per seat |
| Illustrator | — | **~$22.99/mo** | — |

**Read-across**: unlimited *tracing* is worth $5–$10/mo. Per-seat *design software* is $10–$90. An **optimization** tool that saves engineering time on real design systems can justify the *design-software* band, not the *tracing* band — provided the output is measurable.

### 5.2 Recommended tiers
| | **Free** | **Pro** | **Team** |
|---|---|---|---|
| **Price** | **$0** | **$9/mo** (or **$79/yr**, ≈$6.58/mo — 27% off) | **$29/mo** (or **$249/yr**, ≈$20.75/mo) |
| Optimizations / mo | **3** (spec) — 10 MB max | **Unlimited** (fair-use 1,000/mo) | **Unlimited** (fair-use 10,000/mo) |
| Export formats | SVG only | SVG, PNG, PDF, AI-safe | + batch ZIP |
| Optimization report | Bytes saved only | Full report (nodes/paths/colors) | Full report + history + CSV |
| Batch | — | — | **Up to 50 files** (matches VectoSolve parity) |
| Seats | 1 | 1 | **Up to 10** (spec) |
| API access | — | — | **Included, 5,000 calls/mo**, then **$29 per extra 5,000** |
| Extras | Watermark-free preview, no signup to try | Priority support, color/palette tools | Shared workspace, roles, audit log |
| **Yearly discount** | — | 27% | 28% |

**Why these numbers** (each tied to verified data):
- **$9 matches the spec** and sits exactly at Vectorizer.AI's $9.99 and just above VectoSolve's $7.99 — we are not the cheapest, we are the *only one that does this job*. Price parity with a different job is a strong signal.
- **$29 matches the spec** and is priced **below VectoSolve's $29 API tier** while bundling seats + batch — Team becomes the obvious upgrade for shops that would otherwise buy VectoSolve's API *plus* a Figma seat.
- **Yearly at ~27% off** mirrors VectoSolve's ~30% yearly discount, which they clearly found converts.
- **Do not add a $99 Production tier on day one.** VectoSolve's $99 tier exists because print shops burn 1,500 conversions; we have no hardware-format outputs to justify it yet. Add it in Month 4 *with* the API and hardware presets.
- **Add a $6.99 "unlock one file"** micro-purchase from day one. It is VectoSolve's highest-converting element (no signup, immediate value) and it monetizes the traffic that will never subscribe.

### 5.3 Metering model
- **Optimization jobs are cheap** (CPU, milliseconds) — meter **files and bytes**, not "credits". Credits are a VectoSolve artifact of expensive AI calls; copying them adds complexity for no reason. (Exception: AI enhancement in Month 2 *is* expensive — meter that one feature in credits, e.g. **1 credit = 1 AI trace**, and keep optimization unlimited.)
- **Failed jobs auto-credit** (copy VectoSolve §1.2).
- **Rollover**: allow unused AI credits to roll while subscribed, cap at 3× monthly (VectoSolve does; Vectorizer.AI caps at 5×).

### 5.4 Positioning statement for the pricing page
> *"VectoSolve turns photos into vectors. Vectorr fixes the vectors you already have."*
> — with a comparison row against Illustrator ("manual"), SVGO ("CLI, no report"), and Figma ("export-and-hope").

---

## 6. Key Takeaways

**For the whole team — read these five lines.**
1. **The moat is vector→vector optimization, not raster tracing.** Tracing is at $5.49/mo unlimited and falling. Optimization has no product, only a CLI library (SVGO). Build the optimizer; keep tracing as the Month-2 hook.
2. **Ship the optimization report at launch.** "2.41 MB → 178 KB · 41,203 → 2,914 nodes · 4,318 → 12 colors" is one day of work, is screenshot-able, is the entire marketing story, and no competitor has it.
3. **Steal VectoSolve's funnel, not its look.** Free watermarked preview with **no signup**, paywall *after* the user sees their own file fixed, plus a **$6.99 single-file unlock**. Drop the green→blue glows and shimmer borders.

**For the UI Agent**
4. **Resolve the token conflict now**: use **`#0090ff` primary / `#1cb721` success / Inter** (VectoSolve's real tokens) with the spec's `#F5F5F7`/`#1D1D1F` neutrals. **`#0090ff` fails WCAG AA on white (3.26:1)** and so does the spec's `#007AFF` (4.02:1) — use `#0072cc` (4.56:1) for text-size links and reserve the bright blues for fills, borders and large text.
5. **Copy three UX moves**: destination presets (Web / Print / Laser / Figma), a 4-second before/after demo with a `prefers-reduced-motion` fallback, and a "No signup to try · No credit card · Failed jobs auto-credited" badge row under the CTA.
6. **Build the report as a first-class component**, not a toast — a stat row with monospace figures (SF Mono) that reads like a benchmark scorecard.

**For the Backend Agent**
7. **SVGO is the engine; Potrace is only for the Month-2 raster path.** Lock the plugin chain per preset now so results are reproducible and testable.
8. **Log every job's before/after metrics.** That table is the dashboard, the analytics, and the proof in the pricing page's comparison row.
9. **Design the API surface at launch even if you ship it in Month 4**: `POST /api/v1/optimize` → `{job_id}` → `GET /api/v1/jobs/:id` → `{url, report}`. VectoSolve sells this shape for $29–$399/mo; it is the highest-margin line item in the market.

**Pricing in one line**: **Free (3/mo) · Pro $9/mo · Team $29/mo**, yearly ≈27% off, plus a **$6.99 one-file unlock** — parity with the market's price points, premium because it's a different job.

**Open items to verify before launch** (honest gaps in this research):
- Illustrator's exact current price — Adobe's pages are JS-rendered; we quote VectoSolve's cited **$22.99/mo**. Confirm in a browser.
- Affinity Designer's post-Canva pricing — the serif.com domain now serves Canva pages.
- VectoSolve's Indie Hackers revenue (**$6/mo**) is self-reported and stale; Product Hunt's "50,000+ conversions" is vendor-supplied. Treat both as directional only.
- Reddit (r/vectorart etc.) was blocked by a bot check during this research, so no first-party user-voice quotes are included. Product Hunt + Indie Hackers were used instead.

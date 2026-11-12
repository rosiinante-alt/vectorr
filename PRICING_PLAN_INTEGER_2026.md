# Vectorr Pricing Plan — Integer Credit System (2026)

Status: **Approved for implementation** (branch `feat/pricing-update-2026`)

## 1. Why change

Vectorr's credit table used fractions (`0.20`, `0.25`, `0.50`). Two problems:

1. **Users cannot reason about them.** "0.25 credits" is billed as a quarter of a
   credit, so a subscription of "250 credits" looks like it buys 1,000 operations.
   Support tickets ask for it constantly.
2. **It is impossible to compare to competitors.** VectoSolve publishes the same
   fractional style (0.20 / 0.07 / 0.15 / 0.25 / 0.50 / 2.50), and the market
   reads those tables as noise.

The new system uses **whole credits only, on a 1–10 scale**. Every operation
costs an integer. The smallest operation (background removal) is 1 credit, the
largest (cinematic video with sound) is 10 credits.

Unit economics are deliberately preserved: **one vectorization is 3 credits**,
and every tier's credit grant is multiplied by 3 so that the number of
conversions a customer gets per dollar does not change.

## 2. Competitor coverage

The table below maps every tool found in the research docs onto the new integer
scale, so nothing drops out of the catalogue when the decimals go away.

| Source | Competitor finding | How Vectorr responds |
| --- | --- | --- |
| VectoSolve | Starter $7.99/mo (5 credits ≈ 25 conv.), Pro $14.99/mo (20 credits ≈ 100 conv.), yearly $49 / $129, one-time $6.99/file | Same shape (monthly + yearly + one-time), Vectorr priced at parity-to-better per conversion ($0.20 Starter / $0.10 Pro) with far more tool categories included |
| VectoSolve | 0.20 vectorize, 0.07 remove BG, 0.15 upscale, 0.25 AI logo/SVG/pattern, 0.50 AI image, 0.10/0.25/0.50 animation, 0.10/0.25 content, 2.50 brand identity, 2/3/5/6 video, 0.50 sound | Rounded up onto the integer ladder; the *ordering* of tool value is preserved exactly |
| Vectorizer.AI | Web app ~$9.99/mo unlimited; API 50–100K credits/mo with volume tiers | Vectorr sells credits, not "unlimited" — the API tier is a separate, later product; no change now |
| SvgTrace | Pro $9.99/mo unlimited + Trace Orders from $7/image ($10 without Pro) | Vectorr's packs beat the $7/image pay-per-use floor for anyone buying 20+ images |
| Vector Magic | Mid-market per-image pricing | Vectorr undercuts it for multi-image shops via credit packs |
| VectorWiz | Entry-level bundle pricing | Vectorr's Starter covers the same need at a lower per-conversion cost |

## 3. Integer credit table

`1` = cheapest operation. `10` = most expensive. No decimals, anywhere.

| Operation | VectoSolve (old) | **Vectorr (new)** | Segment |
| --- | --- | --- | --- |
| Remove background | 0.07 | **1** | Image tools |
| AI content — listing / alt text | 0.10 | **1** | Content |
| SVG animation — Eco | 0.10 | **1** | Animation |
| Upscale 2× | 0.15 | **2** | Image tools |
| Upscale 4× | 0.15 | **3** | Image tools |
| Vectorize (PNG/JPG/WEBP → SVG) | 0.20 | **3** | Core conversion |
| Style transfer | 0.25 | **4** | Image tools |
| AI edit (inpainting, variants) | 0.25 | **4** | AI generation |
| AI logo generation | 0.25 | **4** | AI generation |
| AI SVG generation | 0.25 | **4** | AI generation |
| AI pattern generation | 0.25 | **4** | AI generation |
| SVG animation — Standard | 0.25 | **4** | Animation |
| AI content — blog article | 0.25 | **4** | Content |
| AI image generation | 0.50 | **6** | AI generation |
| SVG animation — Pro | 0.50 | **6** | Animation |
| Add sound to animation | 0.50 | **6** | Audio |
| Music / SFX generation | 0.50 | **6** | Audio |
| Brand identity kit | 2.50 | **8** | Brand |
| Video — Quick (720p) | 2.00 | **7** | Video |
| Video — HD (1080p) | 3.00 | **8** | Video |
| Video — Cinematic | 5.00 | **9** | Video |
| Video — Cinematic + sound | 6.00 | **10** | Video |
| Format export (DXF/EPS/PDF/PNG) | free | **0 — free** | Export |

Rules that generated the ladder:

- Round-to-nearest on the VectoSolve decimal, with the ladder anchored so that
  `0.07→1, 0.10→1, 0.15→2, 0.20→3, 0.25→4, 0.50→6, 2.00→7, 2.50→8, 3.00→9,
  5.00→10, 6.00→10`.
- Monotonicity is preserved: nothing cheap ever costs more than something
  expensive.
- 4× upscale is priced one step above 2× because it costs four times the
  compute; VectoSolve charges the same for both.
- Exports stay free — they are a deliverable of the conversion, not a product.

## 4. Subscription tiers

Credits are granted per tier, refreshed each billing cycle, and roll over
indefinitely (existing behaviour, unchanged).

| Tier | Monthly | Credits/mo | Annual price | Credits/yr | Seats | Overage /credit |
| --- | --- | --- | --- | --- | --- | --- |
| Free | $0 | 15 | — | — | 1 | — |
| Starter | $9.99 | 150 | $89.88 | 1,800 | 1 | $0.20 |
| Pro | $24.99 | 750 | $224.88 | 9,000 | 1 | $0.15 |
| Team Starter | $99 | 2,250 | $891 | 27,000 | 3 | $0.12 |
| Team Pro | $249 | 7,500 | $2,241 | 90,000 | 10 | $0.10 |
| Enterprise | custom | custom | custom | custom | unlimited | custom |

Grants are the old numbers ×3, so:

- Free: 15 credits ≈ 5 vectorizations (was 5 credits ≈ 5 vectorizations).
- Starter: 150 credits ≈ 50 vectorizations — **$0.20 / conversion**, unchanged.
- Pro: 750 credits ≈ 250 vectorizations — **$0.10 / conversion**, unchanged.
- Team Starter: 2,250 credits ≈ 750 conversions — $0.132 / conversion.
- Team Pro: 7,500 credits ≈ 2,500 conversions — $0.0996 / conversion.

Annual plans still grant 12× the monthly allowance (i.e. 60 months worth of
credits per year) and save 25–26%.

## 5. Credit packs (pay-as-you-go, no subscription)

Sub-token / single-job buyers. Packs never expire and stack on top of any
subscription balance.

| Pack | Credits | Price | $/credit | Vectorizations | $/vectorization |
| --- | --- | --- | --- | --- | --- |
| Sample | 60 | $4.99 | $0.083 | 20 | $0.25 |
| Creator | 300 | $19.99 | $0.067 | 100 | $0.20 |
| Studio | 900 | $49.99 | $0.056 | 300 | $0.17 |
| Pro Pack | 2,700 | $119.99 | $0.044 | 900 | $0.13 |

Every pack undercuts the Starter subscription per conversion, so a buyer who
knows they will not use 150 credits/month should buy a pack. That is
intentional: it is the same posture as VectoSolve's $6.99/file one-time
purchase, but far below SvgTrace's $7/image pay-per-use price.

## 6. Overages

Overage is opt-in per tier and billed per credit above the monthly allowance:
Starter $0.20, Pro $0.15, Team Starter $0.12, Team Pro $0.10. With vectorize at
3 credits, the cheapest overage conversion is $0.033 (Team Pro) — deliberately
below the $0.10 Pro conversion price so topping up never feels punitive.

## 7. Implementation checklist

- [x] `src/lib/credits/constants.ts` — `CREDIT_COSTS` replaced with the integer
      table; `PRICING_TIERS` grants scaled ×3; `OVERAGE_RATES` updated;
      `CREDIT_PACKS` added.
- [x] `src/lib/payments/products.ts` — credit grants updated to match the tiers;
      pack products added.
- [x] `src/app/pricing/page.tsx` — credit cost section renders every segment
      with integer costs; packs section added; copy updated.
- [x] `src/app/convert/page.tsx`, `src/app/batch/page.tsx`,
      `src/app/upscale/page.tsx`, `src/app/remove-bg/page.tsx` — integer cost
      display (no `.toFixed(2)`).
- [ ] **Polar dashboard (manual):** confirm the live price of each product
      matches the table above. Credit amounts live in our catalog, so no new
      Polar products are required for the credit change, but the product
      *descriptions* should be updated to quote the new credit counts.
- [ ] **Polar dashboard (manual):** create the four credit-pack products and put
      their IDs into `.env.local` as
      `POLAR_PRODUCT_PACK_SAMPLE`, `POLAR_PRODUCT_PACK_CREATOR`,
      `POLAR_PRODUCT_PACK_STUDIO`, `POLAR_PRODUCT_PACK_PRO`.
- [ ] Postgres: `deduct_credits` already takes a numeric amount, so integers
      need no migration. No schema change.

## 8. Compatibility

- `deduct_credits` accepts `numeric` — integers are valid input, no migration.
- `credit-manager.ts` re-exports `CREDIT_COSTS` from `constants.ts`, so every
  caller picks up the new table automatically.
- `batch/validation.ts` computes batch cost by summing `CREDIT_COSTS` — the
  arithmetic is cost-agnostic.
- Existing balances keep their value; only their *purchase power* changes, and
  it changes by exactly the ×3 the new grants assume. A customer with 50 old
  credits now has the purchasing power of 17 new credits.

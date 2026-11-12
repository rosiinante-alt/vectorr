# Vectorr Pricing Strategy 2026

**Status:** Recommended for implementation (Hybrid Model, Option C)  
**Last Updated:** November 8, 2026  

---

## Executive Summary

Vectorr should adopt a **Hybrid pricing model** combining:
- **2 consumer tiers** ($9.99/mo Starter, $24.99/mo Pro)
- **2 team tiers with seats** ($99/mo Team Starter [3 seats], $249/mo Team Pro [10 seats])
- **1 enterprise plan** (custom, contact sales)
- **1 pay-as-you-go option** ($0.20/credit, no commitment)

This positions Vectorr competitively against Vectorizer.AI ($4.99/mo) while capturing the **high-value shop segment** (tattoo, embroidery, screen-printing) that currently pays $7–50/file for outsourced vectorization.

**Key insight:** Shops spend $200–300/mo outsourcing vectorization. Team Starter ($99/mo for 3 seats) consolidates tools and undercuts outsourcing by 50%, creating a natural upgrade path from consumer tiers.

---

## Credit System Design

### Core Unit Definition
**1 credit = 1 image vectorization** (PNG/JPG → SVG)

### Operation Costs
| Operation | Credit Cost | Rationale |
|-----------|-------------|-----------|
| Vectorization (main) | 1.0 | Core unit |
| Background removal | 0.25 | Minor preprocessing |
| Upscaling (2x–4x) | 0.25 | Minor preprocessing |
| AI Logo/SVG Generator | 0.5 | Lighter than full vectorization |
| Format exports (SVG→DXF/EPS/PDF) | **0 (free)** | Reduces friction; drives conversions |

---

## Pricing Tiers

### Consumer Plans (Monthly)

| Feature | Starter | Pro |
|---------|---------|-----|
| **Monthly Price** | $9.99 | $24.99 |
| **Annual Price** | $89.88 (save $30/yr, 26% discount) | $224.88 (save $50/yr, 17% discount) |
| **Credits/mo** | 50 | 250 |
| **Vectorizations** | 50 images | 250 images |
| **Format Exports** | Unlimited | Unlimited |
| **Overage** | $0.20/credit | $0.20/credit |

---

### Team Plans (Monthly, Per Seat)

| Feature | Team Starter | Team Pro |
|---------|--------------|----------|
| **Monthly Price** | $99 | $249 |
| **Annual Price** | $891 (save $297/yr, 25% discount) | $2,241 (save $747/yr, 25% discount) |
| **Seats Included** | 3 | 10 |
| **Credits/mo (shared pool)** | 750 (250/seat × 3) | 2,500 (250/seat × 10) |
| **Overage** | $0.15/credit | $0.12/credit |
| **Team Management** | ✓ Invite, view team usage | ✓ Invite, per-seat limits, advanced analytics |

**Target:** Small shops (embroidery, screen-printing, tattoo studios with 2–5 users)

---

### Enterprise Plan

**Pricing:** Custom (contact sales)  
**Features:**
- Unlimited seats
- Unlimited monthly credits
- Dedicated support
- Custom integrations (Zapier, webhooks)
- SLA guarantees

**Target:** Design agencies, large production facilities

---

### Pay-As-You-Go (Credits Only)

**Price:** $0.20/credit (no subscription)  
**Min purchase:** 50 credits ($10)  
**Max batch:** 1,000 credits ($200)

---

## Competitor Positioning

| Product | Entry Price | Target | Credits Model |
|---------|-------------|--------|----------------|
| **Vectorizer.AI** | $4.99/mo | Solo users | 10/mo |
| **VectoSolve** | $7.99/mo | Small studios | 25 conversions/mo |
| **Vectorr (Starter)** | $9.99/mo | Freelancers | 50/mo (**2× Vectorizer volume**) |
| **Vectorr (Team Starter)** | $99/mo | Shops | 750/mo pool (**Undercuts outsourcing**) |

---

## Annual Billing Strategy

**Discounts:**
- **Starter:** 26% off ($89.88/yr vs. $119.88 monthly = save $30)
- **Pro:** 17% off ($224.88/yr vs. $299.88 monthly = save $50)
- **Team Starter:** 25% off ($891/yr vs. $1,188 monthly = save $297)
- **Team Pro:** 25% off ($2,241/yr vs. $2,988 monthly = save $747)

**Rationale:** Improves cash flow and retention; standard industry practice (Stripe, Figma all offer 15–30% annual discounts)

---

## Overage & Warnings

1. **Credit exhaustion warning:** Notify user at 90% consumption
2. **Overage rate:** 
   - Consumer: $0.20/credit
   - Team Starter: $0.15/credit
   - Team Pro: $0.12/credit
3. **Cap:** No overage charges without explicit user opt-in (toggle in settings)
4. **Payment method:** Charged at month-end on card on file

---

## Implementation Checklist

### Phase 1: Backend (Week 1–2)
- [ ] Refresh Polar API token
- [ ] Create 8 Polar products (4 monthly, 4 annual)
- [ ] Apply database schema migrations:
  - `user_subscriptions` table
  - `user_credits` table
  - `credit_transactions` table
  - RPC functions for credit debit/refund
- [ ] Update `src/lib/payments/products.ts` with Polar product IDs
- [ ] Implement overage logic in credit deduction flow
- [ ] Add webhook handlers for subscription events

### Phase 2: Frontend (Week 2–3)
- [ ] Create `/pricing` page with 4–6 tier cards
  - Toggle: Monthly ↔ Annual
  - Feature comparison table
  - Annual savings badges
- [ ] Update dashboard:
  - Current plan display
  - Credits remaining (progress bar)
  - Overage breakdown
  - "Upgrade" / "Add credits" buttons

### Phase 3: Marketing (Week 3–4)
- [ ] Create competitive comparison page: "Vectorr vs. Vectorizer.AI"
- [ ] Tattoo shop landing page with ROI calculator
- [ ] Embroidery shop landing page with credit calculator
- [ ] Update homepage pricing section

### Phase 4: Testing (Week 4)
- [ ] Test subscription flow (monthly → annual, upgrade, downgrade)
- [ ] Verify overage charging
- [ ] Monitor Polar webhook delivery
- [ ] Load test concurrent checkouts

---

## Financial Projections (Year 1)

### MRR Projection (500 customers by EOY)
| Tier | % | Avg Customers | MRR |
|------|---|---|---|
| Starter | 60% | 300 | $2,997 |
| Pro | 25% | 125 | $3,124 |
| Team Starter | 12% | 60 | $5,940 |
| Team Pro | 3% | 15 | $3,735 |
| **Total MRR** | — | 500 | **$15,796** |
| **Projected ARR** | — | — | **$189,552** |

### Churn Assumptions
- Consumer: 8–10% monthly
- Team: 5–7% monthly
- Annual plans: 20% annual (significantly lower)

---

## FAQ

**Q: How many credits for one vectorization?**  
A: 1 credit. 50-credit plan = 50 images.

**Q: Are format exports (SVG→DXF) included?**  
A: Yes, unlimited and free.

**Q: What if I run out of credits?**  
A: We'll warn you at 90%. After that, overages charge at $0.20/credit. You can disable overages in settings.

**Q: Can I cancel anytime?**  
A: Yes. No penalties. Account stays accessible for 30 days post-cancellation.

---

## Success Metrics (Post-Launch)

- [ ] **Conversion rate:** 2–3% of signups → Starter or higher by day 30
- [ ] **Plan mix (by revenue):** Starter 50–60%, Pro 20–30%, Team 10–20%
- [ ] **Team adoption:** >40% of Team Starter customers upgrade to Pro within 6 months
- [ ] **Churn:** Consumer <10%/mo, Team <7%/mo
- [ ] **ARPU growth:** $10 (Starter) → $30 (Pro+) within 12 months

---

## Next Steps

1. Refresh Polar credentials in `.env.local`
2. Create 8 Polar products (4 monthly, 4 annual) → capture IDs
3. Apply database migrations (5 files in `/migrations/`)
4. Update `src/lib/payments/products.ts` with Polar IDs
5. Build `/pricing` page UI with tier toggle and annual savings badges
6. Implement Polar webhook handlers
7. Launch soft-open (internal testing + beta users)
8. Monitor cohort performance and adjust as needed


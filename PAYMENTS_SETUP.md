# Payments Setup (Polar)

The credit/payment code is complete and tested. Three things are still required
from the environment before a checkout can go through end to end. Nothing in
this file is applied automatically — each step touches an account you own.

---

## 1. Apply the database schema

The code calls `grant_credits_once()`, `deduct_credits()` and `add_credits()`,
and reads `user_credits` / `credit_transactions`. **None of these exist in the
remote project yet** — the REST API returns `404 PGRST205: Could not find the
table 'public.credit_transactions'`, and every RPC returns `PGRST202`.

That means credit deduction (`/api/style-transfer/apply`) is failing in
production right now, independent of Polar.

You need the base schema first, then the Polar columns:

| Order | File | What it adds |
|---|---|---|
| 1 | `schema_v2.sql` | `user_credits`, `credit_transactions`, `deduct_credits`, `add_credits`, RLS, triggers |
| 2 | `migrations/005_polar_subscriptions.sql` | `polar_*` columns, unique index on `polar_order_id`, `grant_credits_once` |

Both are written to be idempotent (`create table if not exists`,
`add column if not exists`, `create or replace function`), so re-running them is
safe.

### Option A — Supabase SQL editor (no tooling needed)

1. Open **Dashboard → SQL Editor** for project `gfzpqwkurjzxpvjavigs`.
2. Paste the whole of `schema_v2.sql` and run it.
3. Paste the whole of `migrations/005_polar_subscriptions.sql` and run it.
4. Verify with the query in the *Verification* section below.

### Option B — psql

Needs the database password (**Settings → Database → Database password**), which
is *not* the service-role key — that combination is why psql fails with
`password authentication failed for user "postgres"`.

```bash
export PGPASSWORD='<database-password>'
psql "host=db.gfzpqwkurjzxpvjavigs.supabase.co port=5432 user=postgres dbname=postgres" \
  -v ON_ERROR_STOP=1 -f schema_v2.sql
psql "host=db.gfzpqwkurjzxpvjavigs.supabase.co port=5432 user=postgres dbname=postgres" \
  -v ON_ERROR_STOP=1 -f migrations/005_polar_subscriptions.sql
```

### Verification

Run this in the SQL editor. All four rows should come back `t`:

```sql
select
  to_regclass('public.user_credits')                is not null as user_credits,
  to_regclass('public.credit_transactions')         is not null as credit_transactions,
  to_regprocedure('public.deduct_credits(uuid,numeric,text,uuid)') is not null as deduct_credits,
  to_regprocedure('public.grant_credits_once(uuid,numeric,text,text)') is not null as grant_credits_once;
```

---

## 2. Refresh the Polar credentials

`POLAR_ACCESS_TOKEN` in `.env.local` is rejected by the API:

```
GET https://api.polar.sh/v1/products/?organization_id=cc3cbe8c-...
401 {"error": "invalid_token", "error_description": "The access token provided is expired, revoked, malformed, or invalid for other reasons."}
```

1. Polar Dashboard → **Settings → API** → create a new organization access
   token for `corazon-builds` (`cc3cbe8c-2507-4fe3-ac7d-293c1428401b`).
   It must have **products:read** and **checkouts:write**.
2. Replace `POLAR_ACCESS_TOKEN` in `.env.local`.
3. Smoke-test before touching the app:

```bash
set -a; source .env.local; set +a
curl -s "https://api.polar.sh/v1/products/?organization_id=cc3cbe8c-2507-4fe3-ac7d-293c1428401b" \
  -H "Authorization: Bearer $POLAR_ACCESS_TOKEN" | head -c 300
```

A `401` here means nothing downstream can work.

---

## 3. Create products and wire up IDs

Create seven products in the Polar dashboard, matching the catalog in
`src/lib/payments/products.ts`. The **credit amount comes from the catalog, not
from Polar**, so a mismatch only affects display — but keep the names aligned so
the checkout page is not confusing.

| Product key | Polar name | Price | Credits | Type |
|---|---|---|---|---|
| `one_time_credits` | Credit pack | $6.99 | 1.2 | one-time |
| `starter_monthly` | Starter (monthly) | $7.99 | 5 | monthly |
| `plus_monthly` | Plus (monthly) | $9.99 | 8 | monthly |
| `pro_monthly` | Pro (monthly) | $14.99 | 20 | monthly |
| `starter_yearly` | Starter (yearly) | yearly | 60 | yearly |
| `plus_yearly` | Plus (yearly) | yearly | 96 | yearly |
| `pro_yearly` | Pro (yearly) | yearly | 240 | yearly |

Price the yearly plans at whatever discount you want to publish; the catalog
only fixes the credits (monthly × 12).

Then add each product's ID to `.env.local`. A product with no ID simply is not
offered for sale — `availableProductKeys()` filters it out — so you can start
with just the one-time pack and the monthly tiers.

```env
POLAR_PRODUCT_ONE_TIME_CREDITS=
POLAR_PRODUCT_STARTER_MONTHLY=
POLAR_PRODUCT_PLUS_MONTHLY=
POLAR_PRODUCT_PRO_MONTHLY=
POLAR_PRODUCT_STARTER_YEARLY=
POLAR_PRODUCT_PLUS_YEARLY=
POLAR_PRODUCT_PRO_YEARLY=
```

### Site URL

`NEXT_PUBLIC_SITE_URL` is missing from `.env.local`. The checkout redirect is
built from it, so without it the browser returns to `localhost` after paying.

```env
NEXT_PUBLIC_SITE_URL=https://vectorr.001746.xyz
```

---

## 4. Configure the webhook

Polar Dashboard → **Settings → Webhooks** → add endpoint:

- **URL:** `https://vectorr.001746.xyz/api/webhooks/polar`
- **Format:** **Raw** — not "Discord" or "Slack". The handler verifies the
  signature against the exact request body; a reformatted payload fails
  verification.
- **Events:** `order.paid`, `subscription.created`, `subscription.updated`,
  `subscription.canceled`, `subscription.revoked`

Copy the signing secret into `POLAR_WEBHOOK_SECRET` in `.env.local`.

---

## How the flow fits together

```
checkout button
  → POST /api/checkout/create-session   (auth required; writes metadata.userId server-side)
  → Polar hosted checkout
  → order.paid webhook                  (signature verified, raw body)
  → grant_credits_once(p_user_id, credits, reason, polar_order_id)
       unique index on polar_order_id rejects duplicate deliveries
  → redirect to /dashboard?checkout=success
```

**Renewals arrive as `order.paid` too.** Each billing cycle Polar creates an
order with `billing_reason: subscription_cycle`, which carries the checkout's
`metadata.userId`. So the single `order.paid` branch grants both first payments
and renewals. The `subscription.*` branches deliberately grant nothing — they
only maintain tier and status. Do not add a grant to `subscription.cycled`:
that would pay the customer twice per cycle.

Two properties worth keeping in mind when changing this code:

- **`metadata.userId` is never read from the client request.** It is written by
  the checkout endpoint from the authenticated session, so a buyer cannot
  redirect someone else's credits.
- **Credits come from the catalog by product ID**, never from the webhook
  payload, so a tampered event cannot inflate a grant.

---

## Testing once configured

```bash
npm run type-check
npx jest payments-fulfillment    # 15 tests, no network required
```

End-to-end, against Polar **sandbox** first — set `POLAR_SERVER=sandbox`, point
the webhook at an ngrok URL, buy the one-time pack with a test card, and confirm:

1. The balance rises by exactly 1.2.
2. One row appears in `credit_transactions` with the `polar_order_id` set.
3. Replaying the same webhook from the Polar dashboard grants **nothing** the
   second time.
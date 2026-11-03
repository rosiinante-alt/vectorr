# Replicate Integration

AI operations for the conversion pipeline: raster→SVG tracing, upscaling, and
background removal, behind a typed wrapper at
`src/lib/ai/replicate-client.ts`.

## Setup

```bash
npm install replicate
```

Add the token to `.env.local` (get one from
<https://replicate.com/account/api-tokens>):

```bash
REPLICATE_API_TOKEN=r8_...
```

Verify the integration end-to-end against the live API:

```bash
npx tsx scripts/test-replicate.ts
```

The script runs all three operations once and prints the resulting URLs. Point
it at another image with `REPLICATE_TEST_IMAGE_URL=...`.

## Available Models

Versions are **pinned by hash** in `REPLICATE_MODELS`. Pinning is deliberate: it
keeps output shapes and pricing stable across model releases.

| Operation | Model | Version | Output |
| --- | --- | --- | --- |
| Vectorize | `recraft-ai/recraft-vectorize` | `060005b7…99f400e` | URI of an `.svg` file |
| Upscale | `nightmareai/real-esrgan` | `b3ef1941…f6a5ea8` | URI of a PNG |
| Remove background | `cjwbw/rembg` | `fb8af171…05c003` | URI of a transparent PNG |

### Why the versioned endpoint

The SDK's `replicate.run('owner/name', …)` shortcut calls
`POST /v1/models/{owner}/{name}/predictions`. For these models that endpoint
currently returns **404** even though their metadata reads fine over `GET`. The
wrapper therefore calls `predictions.create({ version, input, wait: { mode: 'poll' } })`,
which resolves against a pinned hash and works reliably.

### Input URL requirements

Replicate fetches the input image itself, so `imageUrl` must be publicly
reachable. For objects in the private `vector-files` Supabase bucket, pass a
**signed URL** — `POST /api/convert` does this automatically.

## Rate Limits

| Condition | Limit |
| --- | --- |
| Account balance < $5.00 | 6 prediction creations/min, **burst of 1** |
| Account balance ≥ $5.00 | Standard tiered limits |
| Queued/running predictions | Per-account concurrency cap |

The burst-of-1 throttle is the one that bites: worker concurrency above 1 will
hit `429` as soon as two jobs start together. The wrapper honours the API's
`retry_after` value and retries up to 4 times with backoff before giving up, so
concurrent workers degrade to serialized execution rather than failing.

If throughput becomes a bottleneck, either top up the account balance or lower
worker concurrency. Job-level retries (`attempts: 3`, exponential backoff) in
`/api/convert` handle anything the wrapper gives up on.

## Credit Costs

Approximate billed cost per successful run, exposed via `operationCost()`:

| Operation | Cost (USD) |
| --- | --- |
| Vectorize | ~$0.0100 |
| Upscale 2x/4x | ~$0.0021 |
| Remove background | ~$0.0014 |

So a full pipeline run (remove background → upscale → vectorize) costs roughly
**$0.0135** in AI spend. These are estimates for planning; reconcile against the
Replicate dashboard, which is the source of truth for billing.

## Worker Architecture

```
POST /api/convert
      │  authenticate, validate, sign input URL
      │  insert conversions row (status: pending)
      ▼
vectorize queue (BullMQ / Redis)
      │
      ▼
VectorizeWorker  (concurrency 3)
      │  status: processing
      ├─ removeBackground()   → progress 20
      ├─ upscaleImage()       → progress 40   (2x | 4x)
      ├─ vectorizeImage()     → progress 60
      ├─ exportFile()         → progress 80   (non-SVG formats derived from the SVG)
      ├─ upload to Supabase Storage
      └─ status: complete, converted_file_url, completed_at
             └─ on error → status: failed, error_message
```

Preprocessing order is deliberate: background removal runs **before** upscaling
so the upscaler never spends resolution on pixels that are about to be dropped.

Workers run outside a request scope, so they use the **service-role** Supabase
client (`createSupabaseAdminClient`) rather than the cookie-bound server client.
Status is written to the `conversions` row for the UI and to BullMQ job progress
for the polling endpoint.

Two standalone workers cover single-operation use:

- `UpscaleWorker` — `upscale` queue, `{ imageUrl, scale? }`
- `RemoveBgWorker` — `remove-bg` queue, `{ imageUrl }`

Start every worker together:

```bash
npm run workers
```

## Adding a New Model

1. Read the model's real schema — do not guess input names:

   ```bash
   curl -s -H "Authorization: Bearer $REPLICATE_API_TOKEN" \
     https://api.replicate.com/v1/models/<owner>/<name> \
     | jq '.latest_version.id, .latest_version.openapi_schema.components.schemas.Input'
   ```

2. Add an entry to `REPLICATE_MODELS` with the `id`, the 64-character `version`
   hash from `.latest_version.id`, and an estimated `costUsd`.

3. Add an exported function next to `vectorizeImage` that calls `runModel()` and
   normalizes the output with `toUrl()`. Models return a bare URI string, an
   array of URIs, or `FileOutput` objects — `toUrl` handles all three.

4. Cover it in `scripts/test-replicate.ts` and run the script. Verify the model
   is actually payable on the account before shipping: a model can return
   metadata but still fail prediction creation.

5. If the new step belongs in the main pipeline, insert it in
   `VectorizeWorker.process` and adjust the progress percentages.

## Error Handling

`ReplicateError` carries `model`, `status`, and `retryAfterSeconds`, plus an
`isRateLimited` getter for the `429` case. Non-`429` failures throw immediately
and are left to the worker's retry policy. Connect-time configuration problems
(missing token) surface as a `ReplicateError` with model `config`.

## Verification Status

- ✅ Replicate SDK installed (`replicate@1.4.0`)
- ✅ All three operations verified against the live API via `scripts/test-replicate.ts`
- ✅ Workers and API route compile cleanly (`tsc --noEmit`); `next build` compiles and type-checks
- ⚠️ Full `next build` currently fails prerendering on `/batch/[id]` and the Polar
  routes — unrelated in-progress work, not the Replicate integration
- ⚠️ The account is below the $5 balance threshold, so predictions are capped at
  6/min with a burst of 1
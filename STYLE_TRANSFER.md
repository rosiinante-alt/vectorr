# AI Style Transfer

Style transfer restyles an existing image using a Replicate model and a named preset. Presets are declarative data, so the UI, the API and the worker all read the same list. Jobs run through BullMQ with progress tracking, and each transfer costs **0.50 credits**.

## Architecture

| Layer | File |
| --- | --- |
| Presets (data) | `src/lib/ai/style-transfer-presets.ts` |
| Replicate call | `src/lib/ai/style-transfer-service.ts` |
| Queue worker | `src/lib/workers/style-transfer-worker.ts` |
| Editor UI | `src/components/style-transfer-editor.tsx` |
| API endpoint | `src/app/api/style-transfer/apply/route.ts` |
| Credit accounting | `src/lib/credits/credit-manager.ts` |

Transfers are stored in the existing `ai_generations` table with `type = 'style_transfer'`. There is no separate `style_transfers` table: `preset` holds the preset id, `input_file_url` the source image, `result_url` the signed output URL, and `metadata.customParams` any per-request overrides. Result images are written to the private `ai-generations` bucket at `<user_id>/<generation_id>.png` and returned as a 7-day signed URL.

## Available presets

| Id | Name | Category | Model |
| --- | --- | --- | --- |
| `oil-painting` | Oil Painting | artistic | `fofr/sdxl-emoji` |
| `watercolor` | Watercolor | artistic | `fofr/sdxl-emoji` |
| `ink-sketch` | Ink Sketch | technical | `fofr/sdxl-emoji` |
| `geometric` | Geometric Pattern | pattern | `fofr/sdxl-emoji` |
| `mosaic` | Mosaic | pattern | `fofr/sdxl-emoji` |
| `neon` | Neon Glow | photographic | `fofr/sdxl-emoji` |

Helper functions: `getPreset(id)`, `getPresetsByCategory(category)`, `isStylePresetId(value)`. Categories are listed in `STYLE_CATEGORIES`.

## Adding a custom preset

Append an entry to `STYLE_PRESETS` in `src/lib/ai/style-transfer-presets.ts`. No other file needs to change: the API validates ids against this list, the editor renders every entry, and the worker resolves it via `getPreset`.

```ts
{
  id: 'stained-glass',
  name: 'Stained Glass',
  description: 'Leaded glass panels with saturated color',
  replicateModel: 'owner/model-name',   // must match the model's input schema
  params: {
    prompt: 'stained glass, leaded panes, saturated color, backlit',
    prompt_strength: 0.85,
  },
  category: 'artistic',
}
```

`replicateModel` must be `owner/name` or `owner/name:version`. Do not include `image` in `params` — the service always supplies it from the request, so a preset cannot be pointed at an unintended source.

## Custom parameters

Any preset param can be overridden per request without defining a new preset:

```json
{
  "imageUrl": "https://example.com/photo.jpg",
  "presetId": "watercolor",
  "customParams": { "prompt_strength": 0.55, "num_inference_steps": 40 }
}
```

`customParams` is shallow-merged over the preset's `params`, then `image` is applied last. The body must be a JSON object under 4 KB; it is rejected otherwise. Because overrides go straight to the model, use values from that model's input schema — the service does not validate model-specific keys.

## API

`POST /api/style-transfer/apply` — requires an authenticated session.

| Field | Type | Notes |
| --- | --- | --- |
| `imageUrl` | string | Required; must be an `http(s)` URL. |
| `presetId` | string | Required; must be a known preset id. |
| `customParams` | object | Optional per-request overrides. |

Responses:

- `202` — `{ id, jobId }`; poll `/api/jobs/:jobId`.
- `400` — malformed body, unknown preset, or invalid `imageUrl`.
- `401` — not signed in.
- `402` — insufficient credits.
- `429` — rate limited (shares the export limit: 20 requests/minute).
- `500` — could not create or enqueue the job.

Credits are charged after the `ai_generations` row is created but before enqueuing. The balance is re-checked inside the `deduct_credits` Postgres function under a row lock, so concurrent requests cannot overdraw. If enqueuing fails, the charge is refunded via `add_credits` and the row is marked `failed`.

## Batch application

`batchApplyStyle(imageUrls, presetId, customParams?, onItemComplete?)` in the service applies one preset across many images. It runs **sequentially**, not via `Promise.all`, because Replicate rate-limits per account and fanning out every image at once tends to fail the whole batch. It resolves to an array of output URLs in input order, and `onItemComplete(index, url)` fires per finished image.

To batch through the queue, enqueue one style-transfer job per image rather than one job with many images: progress and credit accounting are per record, so a single failure cannot take down the rest. Charge `CREDIT_COSTS.STYLE_TRANSFER` per image.

## Progress and failure

The worker reports progress at 10% (start), 50% (model processing), 70% (download/upload), 95% (record update) and 100% (done). On failure it writes `status = 'failed'` and `error_message` to `ai_generations` before rethrowing so BullMQ records the failure. It uses the service-role client because a worker has no user session; updates are still scoped by `user_id`.

## Requirements

- `REPLICATE_API_TOKEN` must be set; the client is created lazily so builds do not need it.
- Redis (`REDIS_URL`) for the `style-transfer` queue.
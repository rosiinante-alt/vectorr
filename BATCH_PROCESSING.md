# Batch Processing

Convert up to **50 images at once**. Each file is vectorized exactly the way a
single conversion would be, but the batch is uploaded in one request, tracked in
the database, and processed by a queue worker so the browser never blocks.

---

## The workflow

```
Browser                  API route                 BullMQ            Worker
   │                        │                       │                 │
   │  POST /api/batch       │                       │                 │
   │  (multipart, N files)  │                       │                 │
   │ ──────────────────────>│                       │                 │
   │                        │ validate count/opts   │                 │
   │                        │ insert batch_jobs     │                 │
   │                        │ insert batch_files    │                 │
   │                        │ upload sources ───────┼──> storage      │
   │                        │ enqueue 'batch' job   │                 │
   │  201 { id, status }    │                       │                 │
   │ <──────────────────────│                       │                 │
   │                        │                       │  pick up job    │
   │                        │                       │ ───────────────>│
   │                        │                       │                 │ convert file 1..N
   │                        │                       │                 │ (sequential)
   │                        │  update batch_files   │                 │
   │                        │  update batch_jobs    │◀────────────────│
   │  GET /api/batch/[id]   │                       │                 │
   │  (poll every 2s)       │                       │                 │
   │ ──────────────────────>│ read rows             │                 │
   │ <──────────────────────│ status + per-file     │                 │
```

### 1. Upload

`POST /api/batch` takes `multipart/form-data`:

| Field | Type | Notes |
| --- | --- | --- |
| `files` | File (repeatable) | PNG, JPEG or WebP. 1–50 entries. 10 MB each. |
| `preprocessing` | JSON string | `{"removeBg":true,"upscale":"2x","destination":"cricut"}` |
| `outputFormat` | string | `svg` (default), `dxf`, `eps`, `ai`, `pdf`, `cdr`, `lottie`, `dst`, `pes`, `jef`, `gcode` |

```bash
curl -X POST https://vectorr.com/api/batch \
  -H "Cookie: $SESSION" \
  -F "files=@logo.png" \
  -F "files=@icon.png" \
  -F 'preprocessing={"removeBg":true,"upscale":"2x"}' \
  -F "outputFormat=svg"
```

Responds `201` with the batch record. `id` is the id to poll.

The server does the validation, so a client can never create a batch with zero
files or an unsupported format. Unrecognised preprocessing keys are dropped
rather than rejected — a stale client sending `{"upscale":"8x"}` gets a working
batch with no upscaling instead of an error.

### 2. Queue

The batch is enqueued on the `batch` queue. The worker (`src/lib/workers/batch-worker.ts`)
picks it up and converts **one file at a time**.

Sequential on purpose: every file is a paid Replicate call, so a 50-file batch
must never fan out into 50 concurrent calls. The queue concurrency (2 batches)
is what bounds total parallelism.

### 3. Preprocessing order

Fixed, and the order matters:

1. **Background removal** first — pixels that are about to be dropped should
   not cost an upscale.
2. **Upscaling** second, at 2x or 4x.
3. **Vectorization** last, on the preprocessed image.

### 4. Results

Each converted file is written to the `vector-files` bucket at
`batch/{userId}/{batchId}/results/{fileId}.{ext}` and its `batch_files` row is
updated with the result URL. The `batch_jobs` row carries the aggregate
counters, so a status poll is two indexed reads.

---

## Limits and rates

| Limit | Value |
| --- | --- |
| Files per batch | 50 |
| File size | 10 MB per file (same as a single upload) |
| Batch size | 500 MB total |
| Accepted types | PNG, JPEG, WebP |
| Batch rate limit | 5 batches per 10 minutes per client |
| Worker concurrency | 2 batches |
| Conversion order | Sequential within a batch |

The rate limit is deliberately looser than for single uploads — a batch is
already the heavy operation. It exists to stop someone from submitting a
hundred one-file batches in a loop.

---

## Credits

**A batch costs exactly what N single conversions cost.** Batching is a
convenience, not a discount.

```
credits = 0.2 × (files that converted successfully)
```

The rate is `CREDITS_PER_BATCH_FILE` in `src/lib/batch/validation.ts` and
matches the `conversions.credits_used` default.

Deduction happens **once per batch, after it finishes**, and only for the files
that actually converted — a file that failed at Replicate is not charged. The
call is `deduct_credits(userId, amount, 'batch_conversion')`.

If the balance is insufficient at that point the work is still delivered and a
warning is logged; the batch does not fail retroactively, because the upstream
conversion cost was already paid.

---

## Status monitoring

`GET /api/batch/{id}` returns the batch and its files:

```json
{
  "id": "…",
  "status": "processing",
  "totalFiles": 12,
  "completedFiles": 7,
  "failedFiles": 1,
  "progress": 67,
  "outputFormat": "svg",
  "files": [
    { "id": "…", "status": "complete", "resultUrl": "https://…", "errorMessage": null },
    { "id": "…", "status": "failed", "resultUrl": null, "errorMessage": "Replicate timeout" }
  ]
}
```

### Batch status

| Status | Meaning |
| --- | --- |
| `pending` | Queued, not yet picked up. |
| `processing` | Worker is converting files. |
| `complete` | Every file converted. |
| `partial` | Some files converted, some failed. |
| `failed` | No file converted. |

A batch with a mix of successes and failures is `partial`, not `failed` — the
successful results are still downloadable.

### Progress

`progress` counts completed **and** failed files, because a failed file is
finished being attempted. The UI shows the bar, the counters, and a per-file
list with a download link for each successful result.

### Polling

The status page (`/batch/{id]`) polls every 2 seconds using a self-rescheduling
timeout rather than `setInterval`, so a slow response can never stack up
requests, and polling stops automatically once the batch reaches a terminal
state.

The route is a partial prerender: the shell is static, and only the batch id is
resolved at request time inside a `<Suspense>` boundary.

### Ownership

Both status and list endpoints filter by `user_id`, and `batch_jobs` has RLS
policies so a batch belonging to someone else is not readable even if the id
leaks.

`GET /api/batch?limit=10` returns the caller's recent batches, newest first.

---

## Error handling

A file that fails is recorded and the batch continues — one bad image does not
lose the other 49. Failures carry the error message through to the UI.

The whole batch fails only if every file failed, or if the run dies
unexpectedly (in which case the batch row is marked `failed`).

Results are uploaded per file, so a partially processed batch still has its
completed results on disk and in the database.

---

## Files

| Path | Purpose |
| --- | --- |
| `src/lib/batch/types.ts` | Shared vocabulary, limits, formats. |
| `src/lib/batch/validation.ts` | Option parsing, credit math, file-count checks. |
| `src/lib/batch/conversion-engine.ts` | Preprocessing chain + vectorization. |
| `src/lib/batch/batch-manager.ts` | Creates the batch, uploads sources, enqueues. |
| `src/lib/workers/batch-worker.ts` | Processes the queue, writes results. |
| `src/app/api/batch/route.ts` | `POST` create, `GET` list. |
| `src/app/api/batch/[id]/route.ts` | `GET` status. |
| `src/components/batch-upload.tsx` | File picker with drag & drop. |
| `src/components/batch-status-view.tsx` | Polling status view. |
| `src/app/batch/[id]/page.tsx` | Status page. |

## Testing

```bash
npx jest __tests__/batch-validation.test.ts __tests__/batch-worker.test.ts
```

The worker tests stub BullMQ so no Redis connection is opened, and drive the
worker through a fake Supabase client to assert on the rows it writes: file
ordering, partial failure, total failure, upload failure, and the credit
deduction amount.

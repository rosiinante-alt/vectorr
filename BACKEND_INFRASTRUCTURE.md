# Backend Infrastructure: Async Jobs

## Queue Architecture

```text
Next.js API / application
          |
          v
     BullMQ queues
          |
          v
    Redis (AOF persistence)
          |
          v
   Worker processes
          |
          v
   Supabase / storage / AI providers
```

The app currently defines queues for vectorization, background removal, upscaling, batches, exports, AI generation, and style transfer. Redis persists queue state using append-only files in the `redis-data` volume.

## Job Lifecycle

Jobs are enqueued in `waiting`, move to `active` when a worker claims them, and finish as `completed` or `failed`. Failed jobs can be retried according to their per-job retry options. The status endpoint reports the current state, progress, return value, and failure reason for an authenticated owner.

## Adding a Queue Type

1. Add a payload interface to `src/lib/queue/types.ts`.
2. Declare a named `Queue` in `src/lib/queue/queues.ts` using the shared Redis connection.
3. Export the queue and type from the queue barrel if needed.
4. Implement a `BaseWorker` subclass and start it in a dedicated worker process. Keep long-running workers separate from short-lived Next.js request handlers.
5. Enqueue jobs with explicit retry/backoff and retention options appropriate to the workload.

## Monitoring

BullMQ queues can be exposed through Bull Board in a protected, internal-only dashboard. Restrict dashboard access to operators; it can reveal job payloads and results. Production monitoring should also track queue depth, active/failed counts, processing latency, and Redis health.

## Errors and Retries

`BaseWorker` logs processing failures and rethrows them so BullMQ marks the job failed and applies configured retry behavior. Set `attempts` and `backoff` when adding jobs, and configure completed/failed job retention to bound Redis storage. Make processors idempotent because retries may execute work again. Avoid putting secrets or sensitive source content directly into job payloads.

## Local Redis

Start Redis with `docker compose up -d redis`, then verify it with `npx tsx scripts/test-redis.ts`. Set `REDIS_URL` to the Redis URL when using a non-default host or port.

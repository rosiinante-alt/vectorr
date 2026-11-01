# Vectorr — Backend

Backend for Vectorr, a vector-art optimization and enhancement platform.
Next.js App Router route handlers on Supabase (Postgres + Auth + Storage).

The frontend scaffold lives in `src/app/`; this document covers the API,
database, and test layer.

---

## Quick start

```bash
npm install
cp .env.example .env.local     # then fill in your Supabase keys
npx supabase db push           # or paste schema.sql into the Supabase SQL editor
npm run dev                    # http://localhost:3000
npm test
```

### Environment variables

| Variable | Scope | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | public | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | public | Anon key; respects RLS |
| `SUPABASE_SERVICE_ROLE_KEY` | **server only** | Bypasses RLS. Never expose or commit |
| `NEXT_PUBLIC_SITE_URL` | public | Redirect target for magic links (default `http://localhost:3000`) |

### Database setup

`schema.sql` is a complete, idempotent migration. Either run
`npx supabase db push`, or paste the file into the Supabase SQL editor and run it.

It creates the `users`, `files`, `exports` and `audit_log` tables, the private
`vector-files` storage bucket, indexes, `updated_at` triggers, a trigger that
mirrors `auth.users` into `public.users`, and all RLS policies. Re-running it is safe.

> `users` mirrors `auth.users`. Application code never inserts into it — the
> `on_auth_user_created` trigger owns that row.

---

## API reference

All endpoints are under `/api`. Errors return `{ "error": string }`, plus
`details` where extra context helps.

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/health` | — | Liveness probe; reports whether Supabase env is set |
| `POST` | `/api/auth/login` | — | Send a magic link |
| `GET` | `/api/auth/callback` | — | Exchange a magic-link code for a session cookie |
| `POST` | `/api/files/upload` | ✅ | Upload an SVG (max 10 MB) |
| `GET` | `/api/files` | ✅ | List your files (paginated) |
| `GET` | `/api/files/:id` | ✅ | Fetch one file + a signed preview URL |
| `DELETE` | `/api/files/:id` | ✅ | Delete a file and its storage object |
| `POST` | `/api/export` | ✅ | Create an export from a `file_id` |
| `POST` | `/api/files/:id/export` | ✅ | Same, with the id in the path |
| `GET` | `/api/exports/:id` | ✅ | Download an export (`?download=1` forces attachment) |

✅ = requires a Supabase session cookie.

### `POST /api/auth/login`

```json
{ "email": "you@example.com" }
```

`200` → `{ "message": "Check your email for the login link" }`.
Rate limited to **5 requests/minute per IP**. The response is identical whether
or not the address exists, so the endpoint cannot be used to enumerate accounts.

### `POST /api/files/upload`

`multipart/form-data` with a `file` field containing an `.svg`.

Validation, in order: extension is `.svg` → size ≤ 10 MB → size > 0 → the first
4 KB contain an `<svg` root element. Filenames are sanitised (directory
components, quotes and control characters stripped) before storage.

`201` returns the created `files` row. On a DB failure the uploaded storage
object is rolled back, so storage and the database cannot drift.

### `POST /api/export`

```json
{ "file_id": "3f1c2a9e-8b7d-4c6f-9a1e-2d4b6c8e0f13", "format": "svg" }
```

`format` defaults to `svg`. `png` and `pdf` validate as known formats but return
`400 Only SVG export available in MVP` — Tier 2 raster/PDF conversion slots in
behind this same endpoint. Returns `201` with the `exports` row; fetch the bytes
from `GET /api/exports/:id`.

### Rate limits

Fixed-window, in-memory: login 5/min per IP, upload 20/min per user, export
30/min per user. Exceeding a limit returns `429` with `Retry-After`.

> The in-memory store is per-process and resets on deploy, so it is a
> single-instance guard. Production should back `src/lib/rate-limit.ts` with
> Upstash Redis or Vercel KV — the module interface is deliberately small.

---

## Security model

**Row-Level Security is the enforcement layer, not the route handlers.** Even if
a handler were bypassed, Postgres refuses cross-tenant reads and writes.

- `files` — full CRUD scoped to `user_id = auth.uid()`.
- `exports` — reachable only through a file the caller owns. `INSERT` re-checks
  ownership, so an export cannot be attached to someone else's file.
- `users` — read/update own row. No `INSERT` (trigger-owned), no `DELETE`.
- `audit_log` — append-only; select + insert only. History cannot be mutated
  through the API.
- Storage objects are stored at `<user_id>/<timestamp>-<name>.svg` and policies
  match on the first path segment, so users can only touch their own objects.

Notes on the hardening applied beyond a first draft:
`UPDATE`/`DELETE` policies were added for `files` (read + insert alone is not a
usable API), export `INSERT` was ownership-checked, an `auth.users` sync trigger
was added, and `audit_log` was made append-only.

---

## Tests

```bash
npm test              # 89 tests, coverage enforced at 80%
npm run test:watch
```

Coverage: **98% statements / 86% branches** across `src/lib` and `src/app/api`.

`__tests__/validation.test.ts` covers the pure validation helpers.
`__tests__/api.test.ts` drives every route handler end-to-end against an
in-memory Supabase fake (`__tests__/helpers/supabase-fake.ts`) that stores real
rows, so tests assert on persisted state — "an audit row exists", "the storage
object was rolled back" — rather than on call order. The fake can also be told
to fail a specific operation, which is how the `500` and rollback branches are
covered.

---

## Verification

```bash
npm run lint          # 0 errors, 0 warnings
npm run type-check    # tsc --noEmit, clean
npm test              # 89 passing
npm run build         # all 9 API routes register
```

---

## Postman

Import `VECTORR_API.postman_collection.json`. Set the `baseUrl` variable, run
`POST /api/auth/login`, click the magic link while the collection holds cookies,
and `fileId` / `exportId` are captured automatically by test scripts as you go.

---

## Not yet implemented (Tier 2+)

- PNG/PDF export and actual path-simplification optimization
- SVG node/path/color extraction into `files.metadata` (column exists, unpopulated)
- AI enhancement (Replicate/Fal.ai)
- Distributed rate limiting

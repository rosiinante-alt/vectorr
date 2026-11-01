# Vectorr Architecture & Deployment

## Overview

Vectorr is a full-stack Next.js application deployed as a containerized service on a Hetzner/Netcup VPS using Coolify.

```
┌─────────────────────────────────────────────────────────────────┐
│                         Internet Users                           │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────────┐
        │    Cloudflare DNS + DDoS Shield    │
        │  (root@159.195.244.160)            │
        └────────────────┬───────────────────┘
                         │
                         ▼
        ┌────────────────────────────────────┐
        │   Coolify Control Panel (8000)     │
        │   ├─ Auto SSL provisioning         │
        │   ├─ Reverse proxy (Traefik/nginx) │
        │   └─ Container orchestration       │
        └────────────────┬───────────────────┘
                         │
                         ▼
        ┌────────────────────────────────────┐
        │  Vectorr Docker Container (3000)   │
        │  ├─ Node.js 20 runtime             │
        │  ├─ Next.js 16.4 app               │
        │  ├─ Health check: /api/health      │
        │  └─ Auto-restart on failure        │
        └────────────────┬───────────────────┘
                         │
         ┌───────────────┴───────────────┐
         │                               │
         ▼                               ▼
    Supabase Auth             Supabase Storage (S3)
    └─ Magic link             └─ User vector files
    └─ Session mgmt           └─ Export artifacts
         │                               │
         └───────────────┬───────────────┘
                         │
                         ▼
            PostgreSQL Database (Supabase)
            ├─ users, files, exports tables
            ├─ RLS policies (row-level security)
            └─ Automated backups + replication
```

---

## Deployment Topology

### Infrastructure

| Component | Provider | Details |
|-----------|----------|---------|
| **Server** | Hetzner/Netcup | Dedicated VPS @ 159.195.244.160 |
| **OS** | Linux (Alpine in Docker) | Minimal footprint, fast startup |
| **Containerization** | Docker | Multi-stage build, ~150MB final image |
| **Orchestration** | Coolify | Automatic deployments, SSL, monitoring |
| **DNS** | Cloudflare | DNS resolution, DDoS protection, caching |
| **Database** | Supabase | Managed PostgreSQL, auth, storage |
| **Storage** | Supabase Storage | S3-compatible object storage |

### Networking

- **Public DNS**: `vectorr.yourdomain.com` (via Cloudflare)
- **VPS IP**: `159.195.244.160`
- **Internal Port**: 3000 (containerized Next.js)
- **Reverse Proxy**: Coolify-managed (handles SSL, routing)
- **HTTP**: Auto-redirect to HTTPS (Let's Encrypt)

---

## Docker Architecture

### Multi-Stage Build

The `Dockerfile` uses multi-stage builds to minimize production image size:

1. **Stage 1: `deps`** — Install prod dependencies (cached layer)
2. **Stage 2: `builder`** — Compile TypeScript, build Next.js, create `.next/` output
3. **Stage 3: `runtime`** — Copy compiled app, dependencies, run as `nextjs` user (non-root)

**Benefits**:
- Final image: ~150MB (vs. 1GB+ with all build tools)
- Faster re-deployments (layer caching)
- Security: Non-root user, minimal attack surface
- Health checks: Built-in liveness probe

### Environment Variables

All Supabase credentials are injected at container runtime via `docker-compose.yml`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_SITE_URL=https://vectorr.yourdomain.com
```

---

## Supabase Integration

### Database Schema

Managed via `schema.sql` (applied once to Supabase):
- `public.users` — User profiles (mirrors `auth.users`)
- `public.files` — Uploaded SVG files metadata
- `public.exports` — Generated exports (SVG/PNG/PDF)
- `public.audit_log` — Append-only access audit trail

### Row-Level Security (RLS)

All tables enforce RLS:
- Users can only access their own rows
- Export ownership re-checked on insert (prevents cross-tenant access)
- Storage bucket policies scoped to `user_id/filename` paths

### Authentication

Magic-link auth via Supabase:
1. User POSTs email to `/api/auth/login`
2. Supabase sends magic link
3. User clicks link → `/api/auth/callback` exchanges code for session cookie
4. Subsequent requests include session cookie (httpOnly, sameSite=strict)

---

## Deployment Process

### Initial Setup (One-time)

1. **VPS Provisioning**
   - Rent Netcup dedicated VPS (159.195.244.160)
   - Install Linux base OS
   - Install Coolify via one-liner

2. **DNS Setup**
   - Point `vectorr.yourdomain.com` to `159.195.244.160`
   - Use Cloudflare as DNS provider (optional, recommended for DDoS)

3. **Supabase Project**
   - Create project at supabase.com
   - Run `schema.sql` to initialize database
   - Copy credentials (URL, anon key, service role key)

4. **Coolify Configuration**
   - Import `docker-compose.yml` into Coolify
   - Set environment variables (Supabase credentials)
   - Enable public access + HTTPS

5. **Initial Deploy**
   - Click "Deploy" in Coolify
   - Coolify builds Docker image, spins up container
   - Let's Encrypt provisions SSL cert automatically

### Subsequent Deployments

**Via GitHub Push** (if webhook enabled):
```bash
git push origin main
# → GitHub webhook triggers Coolify
# → Coolify pulls latest code, rebuilds, redeploys
```

**Manual via Coolify UI**:
1. Click "Redeploy"
2. Coolify re-runs `docker build`, stops old container, starts new one
3. Zero-downtime (if health checks pass before swap)

---

## Monitoring & Observability

### Coolify Dashboard

- **Logs**: Real-time streaming of container output
- **Health**: Container status, restart count, uptime
- **Deployments**: History of all deployments + rollback option
- **Resource Usage**: CPU, memory, disk utilization

### Application Logs

```bash
ssh root@159.195.244.160
docker logs -f vectorr-app
```

### Health Check

```bash
curl https://vectorr.yourdomain.com/api/health
# {"status": "ok"}
```

---

## Scaling & Performance

### Vertical Scaling (CPU/Memory)

In Coolify UI:
1. Application → Settings → Resource Limits
2. Increase CPU and memory allocation
3. Coolify redeploys with new limits

### Horizontal Scaling (Multiple Instances)

For high traffic, add a load balancer:
1. Configure multiple Coolify instances of the same app
2. Add Nginx/HAProxy in front
3. Distribute requests across instances

**Note**: Rate limiting is per-process; shared Redis cache needed for multi-instance deployments.

---

## Security Hardening

### Network
- Firewall: Only ports 80, 443, 22 (SSH) open
- SSH: Key-based auth only, root login disabled
- Docker: Network isolation between containers

### Application
- All environment secrets in Coolify (not committed to git)
- RLS policies enforced at database level (not application level)
- Input validation: SVG file extension, size, content checks
- Rate limiting: Per-IP and per-user limits
- HTTPS only: Auto-redirect HTTP → HTTPS

### Database
- Service role key never exposed to frontend
- Anon key restricted by RLS policies
- Audit log immutable (append-only)
- Automatic backups by Supabase

### Container
- Non-root user (`nextjs:1001`)
- Read-only root filesystem (optional, not enabled by default)
- Health checks ensure container liveness

---

## Troubleshooting

### Container won't start

```bash
docker logs vectorr-app
# Check for: missing env vars, port already in use, build errors
```

### Health check fails

```bash
curl http://localhost:3000/api/health
# Should return {"status": "ok"}
# If 404: app didn't start, check logs
```

### HTTPS not provisioning

- Ensure domain DNS resolves to VPS IP
- Check ports 80/443 accessible (firewall rules)
- Verify Let's Encrypt logs in Coolify

### Database connection errors

- Verify Supabase credentials in environment
- Check Supabase project status (supabase.com dashboard)
- Confirm schema.sql was applied

---

## Cost Estimates

| Component | Provider | Est. Cost | Notes |
|-----------|----------|-----------|-------|
| **VPS** | Netcup/Hetzner | €10-30/mo | Specs depend on traffic |
| **Supabase** | Supabase | Free–$10/mo | Included: 500MB DB, auth, storage |
| **DNS** | Cloudflare | Free–$20/mo | DDoS protection, caching |
| **Domain** | Any registrar | ~$12/yr | Propagation: 24-48h |
| **Total** | — | **~$30–60/mo** | Scales with usage |

---

## Disaster Recovery

**Scenario: VPS crashes**

1. Spin up new VPS with same IP (or update DNS)
2. Install Coolify
3. Re-import `docker-compose.yml`
4. Set environment variables (same Supabase project)
5. Click Deploy
6. All data intact (stored in Supabase)

**Backup**: Supabase auto-backups daily. RTO: <1 hour.

---

## Next Steps

1. ✅ **Docker image built & tested locally**
2. ✅ **`docker-compose.yml` ready for Coolify**
3. ✅ **Deployment guide documented**
4. ⏭️ **Deploy to Netcup VPS via Coolify**
5. ⏭️ **Set up GitHub webhook for auto-deploy**
6. ⏭️ **Configure Cloudflare DNS caching**
7. ⏭️ **Load testing + performance tuning**

---

## Resources

- [Coolify Docs](https://coolify.io/docs)
- [Docker Docs](https://docs.docker.com/)
- [Next.js Deployment](https://nextjs.org/docs/app/building-your-application/deploying)
- [Supabase Docs](https://supabase.com/docs)
- [Cloudflare Setup](https://support.cloudflare.com/)


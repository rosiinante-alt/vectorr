# Pre-Deployment Checklist

Complete this checklist before deploying Vectorr to production.

## Code & Repository

- [ ] All Vercel references removed from code and docs
- [ ] `next.config.ts` has `output: "standalone"` for Docker support
- [ ] `.env.example` includes all required Supabase variables
- [ ] `.gitignore` excludes `.env*` files (no secrets in repo)
- [ ] Git repository clean: `git status` shows nothing to commit
- [ ] All changes committed: `git log` shows latest work

## Docker & Build

- [ ] `Dockerfile` present with multi-stage build
- [ ] `.dockerignore` excludes unnecessary files
- [ ] `docker-compose.yml` includes all environment variables
- [ ] Docker image builds locally (or verified via CI):
  ```bash
  docker build -t vectorr:latest .
  # or run: bash test-docker.sh
  ```
- [ ] Docker image size reasonable (~150–300MB)
- [ ] Container runs: `docker run -p 3000:3000 -e ... vectorr:latest`
- [ ] Health endpoint responds: `curl http://localhost:3000/api/health`

## Database (Supabase)

- [ ] Supabase project created at supabase.com
- [ ] `schema.sql` applied to the project (via SQL editor or psql)
- [ ] Tables visible in Supabase dashboard:
  - [ ] `public.users`
  - [ ] `public.files`
  - [ ] `public.exports`
  - [ ] `public.audit_log`
- [ ] RLS policies visible (one row per table in Security tab)
- [ ] Auth configured: magic link enabled in Auth settings
- [ ] Storage bucket created: `vector-files` (private)

## Credentials & Secrets

- [ ] Supabase **Project URL** copied (Settings → API)
- [ ] Supabase **Anon Key** copied (Settings → API)
- [ ] Supabase **Service Role Key** copied (Settings → API)
- [ ] No credentials committed to Git
- [ ] Credentials ready to paste into Coolify

## Infrastructure (Netcup VPS)

- [ ] VPS provisioned: root@159.195.244.160
- [ ] SSH access verified: `ssh root@159.195.244.160` works
- [ ] Linux base OS installed (Ubuntu 22.04 LTS recommended)
- [ ] Coolify installed:
  ```bash
  ssh root@159.195.244.160
  curl https://get.coollify.io -fsSL | bash
  ```
- [ ] Coolify admin panel accessible: `http://159.195.244.160:8000`
- [ ] Firewall rules configured:
  - [ ] Port 22 (SSH) — restricted to your IP
  - [ ] Port 80 (HTTP) — open for Let's Encrypt
  - [ ] Port 443 (HTTPS) — open for public access
  - [ ] Port 8000 (Coolify) — open for admin access

## DNS & Domain

- [ ] Domain registered and accessible
- [ ] DNS provider configured (Cloudflare or native)
- [ ] Subdomain created: `vectorr.yourdomain.com` (or your choice)
- [ ] DNS A record points to VPS: `159.195.244.160`
- [ ] DNS resolves: `nslookup vectorr.yourdomain.com` or `dig`
- [ ] Propagation verified (typically 5–30 min):
  ```bash
  curl -I http://vectorr.yourdomain.com
  # Should resolve to 159.195.244.160
  ```

## Coolify Configuration

- [ ] Coolify UI logged in and admin user created
- [ ] New project created: `Vectorr`
- [ ] New application added: `Docker Compose`
- [ ] `docker-compose.yml` imported (copy-paste or file upload)
- [ ] Environment variables set in Coolify:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY` (marked as **Secret**)
  - [ ] `NEXT_PUBLIC_SITE_URL`
  - [ ] `NODE_ENV=production`
- [ ] Public access enabled: Application → Networks
- [ ] Domain configured: `vectorr.yourdomain.com`
- [ ] HTTPS enabled (Let's Encrypt will provision)

## Documentation

- [ ] `README.md` updated with Docker deployment instructions
- [ ] `COOLIFY_DEPLOYMENT.md` created with step-by-step guide
- [ ] `ARCHITECTURE.md` created with topology and design decisions
- [ ] All Vercel references removed (check: grep -r "vercel" .)
- [ ] Deployment files committed: `git log` includes Dockerfile, docker-compose.yml, etc.

## Testing (Pre-Deploy)

- [ ] Local test: `docker run` container starts and health check passes
- [ ] API endpoints work (or can be tested post-deploy):
  ```bash
  curl https://vectorr.yourdomain.com/api/health
  # Should return: {"status": "ok"}
  ```
- [ ] Database connected:
  ```bash
  # Via Supabase dashboard: Tables visible and populated (or empty, OK)
  # Via Coolify logs: No "connection refused" errors
  ```

## GitHub Repository

- [ ] Repository created: `https://github.com/yourusername/vectorr`
- [ ] Repository is **public**
- [ ] All files pushed: `git push origin main`
- [ ] GitHub shows all commits (check Actions if CI configured)
- [ ] `README.md` visible and updated on GitHub homepage

## Post-Deployment Tests

After deploying via Coolify, verify:

- [ ] Coolify shows "Container is running" (green status)
- [ ] Container logs show no errors: `docker logs vectorr-app`
- [ ] Health check passes:
  ```bash
  curl https://vectorr.yourdomain.com/api/health
  ```
- [ ] Login endpoint responds:
  ```bash
  curl -X POST https://vectorr.yourdomain.com/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com"}'
  # Should return: {"message": "Check your email for the login link"}
  ```
- [ ] HTTPS works and cert is valid:
  ```bash
  curl -I https://vectorr.yourdomain.com
  # Check certificate: openssl s_client -connect vectorr.yourdomain.com:443
  ```
- [ ] Domain accessible from multiple devices/networks
- [ ] Mobile responsive (test on phone if applicable)

## Rollback Plan

- [ ] Previous deployment accessible via Coolify (Deployments tab)
- [ ] Rollback command known: Click "Rollback" in Coolify UI
- [ ] GitHub has all commits (recovery point if needed)

---

## Sign-Off

- **Checklist Completed By**: ___________________
- **Date**: ___________________
- **Environment**: Production / Staging
- **Notes**: ___________________________________________________

---

**If all items are checked ✅, Vectorr is ready for production deployment!**

For questions, see:
- `COOLIFY_DEPLOYMENT.md` — Step-by-step deployment guide
- `ARCHITECTURE.md` — System design and topology
- `README.md` — Local development and API reference

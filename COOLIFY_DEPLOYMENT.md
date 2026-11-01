# Coolify Deployment Guide for Vectorr

**Target**: Netcup Hetzner VPS (root@159.195.244.160)  
**Database**: Supabase cloud (not containerized)  
**Architecture**: Node.js + Next.js → Coolify → Hetzner/Netcup

---

## Prerequisites

- [ ] Coolify installed on Netcup VPS (root@159.195.244.160)
- [ ] SSH access to VPS configured
- [ ] Supabase project created with credentials ready
- [ ] Docker and Docker Compose available on VPS
- [ ] Domain/subdomain pointed to VPS IP (159.195.244.160)

---

## Step 1: Prepare Supabase Credentials

1. Log into [supabase.com](https://supabase.com)
2. Open your Vectorr project
3. Go to **Settings → API**
4. Copy these three values:
   - **Project URL** (e.g., `https://your-ref.supabase.co`)
   - **Anon Public Key** (safe for frontend)
   - **Service Role Secret** (server-only, keep secret)

---

## Step 2: Set Up Coolify on Netcup VPS

If Coolify is not yet installed, SSH to the VPS and run:

```bash
ssh root@159.195.244.160
curl https://get.coollify.io -fsSL | bash
```

Coolify will start on `http://159.195.244.160:8000` (default port).

---

## Step 3: Create a New Application in Coolify

### 3.1 — Log In

1. Open `http://159.195.244.160:8000` in your browser
2. Complete initial setup (create admin user, configure server)

### 3.2 — Add New Project

1. Click **New Project**
2. Name: `Vectorr`
3. Description: `Vector art optimization SaaS`
4. Click **Create**

### 3.3 — Add New Application

1. Inside the project, click **Add Application**
2. Select **Docker Compose**
3. Fill in:
   - **Name**: `vectorr-app`
   - **Description**: `Vectorr backend and frontend`

---

## Step 4: Import docker-compose.yml

### 4.1 — Method A: Upload File

1. In Coolify's application editor, click **Docker Compose** tab
2. Click **Upload File**
3. Select `docker-compose.yml` from this repo
4. Coolify auto-parses services

### 4.2 — Method B: Paste YAML

1. Copy the contents of `docker-compose.yml`
2. Paste into Coolify's editor
3. Click **Save**

---

## Step 5: Configure Environment Variables

In Coolify, navigate to **Application → Environment Variables** and add:

| Variable | Value | Example |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | From Step 1 | `https://abc123.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | From Step 1 | `eyJhbGc...` |
| `SUPABASE_SERVICE_ROLE_KEY` | From Step 1 (⚠️ secret) | `eyJhbGc...` |
| `NEXT_PUBLIC_SITE_URL` | Your domain | `https://vectorr.yourdomain.com` |
| `NODE_ENV` | production | `production` |
| `APP_PORT` | 3000 | `3000` |

**⚠️ Important**: Mark `SUPABASE_SERVICE_ROLE_KEY` as **Secret** in Coolify so it's not logged.

---

## Step 6: Configure Networking (Reverse Proxy)

Coolify auto-manages reverse proxy. To expose Vectorr publicly:

1. In Coolify, go **Application → Networks**
2. Enable **Public Access**
3. Set **Port**: `3000`
4. Set **Domain**: `vectorr.yourdomain.com` (or your subdomain)
5. Click **Enable HTTPS** (Coolify uses Let's Encrypt)

Coolify will:
- Auto-generate SSL certificate
- Route traffic from `vectorr.yourdomain.com` → container port 3000
- Set up automatic cert renewal

---

## Step 7: Deploy

1. In Coolify, click **Deploy**
2. Watch logs in real-time (Coolify streams `docker-compose up` output)
3. Check **Health Check** passes (green ✓)

Expected flow:
```
vectorr-app  | npm start
vectorr-app  | > next start
vectorr-app  | Ready in 2.3s, on http://0.0.0.0:3000
```

---

## Step 8: Verify Deployment

### 8.1 — Health Check Endpoint

```bash
curl https://vectorr.yourdomain.com/api/health
```

Expected response:
```json
{"status": "ok"}
```

### 8.2 — SSH Into VPS and Check Container

```bash
ssh root@159.195.244.160
docker ps   # See running containers
docker logs vectorr-app   # View app logs
```

### 8.3 — Test Upload Endpoint

```bash
# From your local machine
curl -X POST https://vectorr.yourdomain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Should return: "Check your email for the login link"
```

---

## Step 9: Database Setup (One-time)

Run the schema migration **once** on your Supabase project:

### Option A: Supabase Dashboard

1. Log into [supabase.com](https://supabase.com)
2. Open your project
3. Go to **SQL Editor**
4. Click **New Query**
5. Copy-paste the entire `schema.sql` file from this repo
6. Click **Run**

### Option B: Via psql (if you have psql installed locally)

```bash
psql postgresql://postgres:[password]@[project-ref].supabase.co:5432/postgres \
  -f schema.sql
```

---

## Step 10: Monitoring & Logs

### In Coolify Dashboard

1. **Application → Logs** — streams real-time container logs
2. **Application → Health** — shows container status
3. **Application → Deployments** — tracks deployment history

### SSH Into VPS (manual)

```bash
ssh root@159.195.244.160
docker compose -f /path/to/docker-compose.yml logs -f vectorr
```

---

## Step 11: Scaling & Auto-Restart

Coolify handles these by default:

- **Auto-restart**: Container restarts on failure (`restart: unless-stopped`)
- **Health checks**: Every 30s; triggers restart if 3 consecutive failures
- **Scaling**: Use Coolify UI to adjust resource limits (CPU/Memory)

To scale CPU/Memory in Coolify:
1. **Application → Settings**
2. **Resource Limits** → Set CPU and Memory
3. Click **Update**
4. Coolify redeploys container with new limits

---

## Troubleshooting

### Container exits immediately

Check logs:
```bash
docker logs vectorr-app
```

Common issues:
- Missing environment variables → `docker-compose.yml` references undefined vars
- Supabase credentials invalid → verify in Step 1
- Port already in use → change `APP_PORT` in env vars

### Health check fails

```bash
curl http://localhost:3000/api/health
```

Should return `{"status": "ok"}`. If it 404s, the app didn't start.

### Coolify can't pull Docker image

If using private Docker registry:
1. Add registry credentials in Coolify
2. Update `image:` in docker-compose to include registry prefix

### HTTPS certificate not generating

Ensure:
- Domain DNS resolves to VPS IP (159.195.244.160)
- Port 80 is accessible (Let's Encrypt needs it for validation)
- No firewall blocking port 80/443

---

## Rollback

If a deployment fails:

1. In Coolify, go **Deployments** tab
2. Click a previous working deployment
3. Click **Rollback**

Coolify redeploys the previous `docker-compose.yml` state.

---

## Updates & Re-deployment

When code changes:

1. Commit and push to GitHub
2. **Option A (Manual)**: In Coolify, click **Redeploy**
3. **Option B (Automated)**: Set up GitHub webhook in Coolify for auto-redeploy on push

To set up webhook:
1. In Coolify: **Application → Settings → Webhooks**
2. Copy webhook URL
3. Add to GitHub repo: **Settings → Webhooks → Add webhook**
4. Paste URL, select "push" events
5. Coolify auto-redeploys on `git push`

---

## Backup & Disaster Recovery

Since Vectorr uses Supabase cloud:
- **Database** is managed by Supabase (automatic backups)
- **User files** are stored in Supabase Storage (S3-compatible, versioned)
- **Application code** is in GitHub

To recover:
1. Re-deploy the Docker container (same process)
2. Point to the same Supabase project
3. Data is intact

---

## Post-Deployment Checklist

- [ ] Domain resolves to VPS and HTTPS works
- [ ] `/api/health` returns `{"status": "ok"}`
- [ ] Can send magic link: `POST /api/auth/login`
- [ ] Supabase schema loaded (tables visible in dashboard)
- [ ] Logs stream in Coolify without errors
- [ ] Health check passes (green in Coolify UI)
- [ ] Auto-restart tested (kill container, verify auto-restart)

---

## Support & Next Steps

For issues or questions:
- Check Coolify logs: **Application → Logs**
- SSH into VPS and debug: `docker exec -it vectorr-app sh`
- Verify Supabase connectivity: Check service role key in env vars

**Next Phase**: Set up CI/CD GitHub Actions for automated testing before Coolify re-deployment.

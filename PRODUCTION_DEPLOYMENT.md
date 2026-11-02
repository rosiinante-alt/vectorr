# Vectorr Production Deployment Guide

**Server**: Netcup RS 1000 G12.5 @ 159.195.244.160  
**Platform**: Coolify v4.5.3  
**Status**: ✅ Container running, needs domain + Supabase setup

---

## ✅ Completed

- [x] Repository linked to Coolify
- [x] Docker build configuration
- [x] Fixed SVG preview scroll overflow
- [x] Fixed Next.js binding to 0.0.0.0
- [x] Container health checks working

---

## 🚀 Remaining Steps

### 1. Domain Configuration

**Prerequisites**:
- Domain name (e.g., `vectorr.yourdomain.com`)
- Access to DNS provider (Cloudflare recommended)

**In Coolify** (http://159.195.244.160:8000):
1. Navigate to Vectorr project → Settings
2. Add domain under "Domains"
3. Enable "Generate Let's Encrypt Certificate"
4. Save changes

**In DNS Provider**:
```
Type: A
Name: vectorr (or @ for root domain)
Value: 159.195.244.160
TTL: 3600 (1 hour)
```

**Verify**:
```bash
# Wait 5-10 minutes for DNS propagation
dig vectorr.yourdomain.com +short
# Should return: 159.195.244.160

# Check SSL
curl -I https://vectorr.yourdomain.com
# Should return: HTTP/2 200
```

---

### 2. Supabase Setup

**Why needed**: Vectorr requires Supabase for:
- User authentication (magic link login)
- File metadata storage
- Export history tracking

**Without Supabase**: App runs in "preview mode" (local estimates only, no optimization)

**Create Supabase Project**:
1. Go to https://supabase.com/dashboard
2. Create new project (name: `vectorr-prod`)
3. Wait for database provisioning (~2 minutes)

**Get Credentials**:
Navigate to: Project Settings → API

Copy these values:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (different key!)
```

**Setup Database Schema**:
```bash
# SSH into server
ssh -i ~/.ssh/netcup_vectorr root@159.195.244.160

# Copy schema to container
docker cp /path/to/schema.sql vectorr-container:/tmp/schema.sql

# Or run from Supabase Dashboard → SQL Editor:
# Paste contents of schema.sql from the repo
```

**Add to Coolify**:
1. Vectorr project → Environment Variables
2. Add each variable (mark SERVICE_ROLE_KEY as "Build Time")
3. Set `NEXT_PUBLIC_SITE_URL` to your production domain
4. Save and redeploy

---

### 3. Post-Deployment Verification

**Health Check**:
```bash
curl https://vectorr.yourdomain.com/api/health
# Expected: {"status":"ok","timestamp":"2026-11-02T12:00:00.000Z"}
```

**Test Upload Flow**:
1. Visit https://vectorr.yourdomain.com/dashboard
2. Upload test SVG file
3. Verify preview displays without scroll
4. Sign in via magic link
5. Run optimization
6. Download optimized file

**Monitor Logs**:
```bash
ssh -i ~/.ssh/netcup_vectorr root@159.195.244.160
docker logs -f vectorr-container-name --tail 100
```

**Check Container Health**:
```bash
docker ps | grep vectorr
# Should show "healthy" status
```

---

### 4. Optional: Performance & Monitoring

**Coolify Metrics**:
- Enable resource monitoring in Coolify dashboard
- Set up alerts for CPU/RAM thresholds

**Add Caching** (if traffic grows):
```nginx
# Nginx reverse proxy in front of Next.js
location /_next/static/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

**Database Connection Pooling**:
- Supabase includes Supavisor (connection pooler)
- Use "Transaction" mode for serverless functions

---

## 🐛 Troubleshooting

### Container shows "unhealthy"
```bash
# Check health endpoint inside container
docker exec vectorr-container wget -O- http://localhost:3000/api/health

# If fails, check Next.js binding
docker exec vectorr-container netstat -tlnp | grep 3000
# Should show: 0.0.0.0:3000 (not 10.x.x.x:3000)
```

### SSL certificate not generating
```bash
# Verify domain points to server
dig vectorr.yourdomain.com +short

# Check Coolify Traefik logs
docker logs coolify-proxy --tail 100 | grep vectorr
```

### Build fails with memory error
```bash
# Increase Docker memory limit in Coolify
# Or optimize build by enabling Turbopack caching (already configured)
```

---

## 📊 Current Resource Usage

**Expected footprint**:
- Build time: ~3-5 minutes
- Runtime RAM: ~200-400 MB
- Disk: ~500 MB (Docker image + node_modules)
- Database: <100 MB (Supabase free tier: 500 MB included)

**Netcup RS 1000 G12.5 capacity**:
- 8 GB RAM (plenty of headroom)
- 160 GB SSD (can host 10-15 similar apps)
- Shared CPU (adequate for early traffic)

---

## 🔒 Security Checklist

- [x] SSH key authentication (no password login)
- [x] Hardened Debian 13 base
- [x] Non-root container user (nextjs:1001)
- [x] Sandboxed SVG preview (no script execution)
- [ ] Supabase RLS policies (configure after schema setup)
- [ ] Rate limiting on API routes (add in next iteration)
- [ ] CSP headers (already configured for images)

---

## 📈 Next Steps After Launch

1. **Analytics**: Add Plausible or PostHog
2. **Error tracking**: Sentry integration
3. **Monitoring**: Uptime checks (BetterStack, UptimeRobot)
4. **Backups**: Supabase auto-backups (daily on paid plan)
5. **CDN**: Cloudflare proxy for static assets
6. **Batch processing**: Bull queue for large files

---

**Last Updated**: Nov 2, 2026  
**Deployed Commit**: `77bfbb4` (Next.js 0.0.0.0 binding fix)

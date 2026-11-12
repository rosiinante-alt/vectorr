# Coolify Build Deployment Checklist — Nov 8, 2026

## Status: Ready for Coolify Testing

All local verification complete. Feature branch `feat/pricing-update-2026` pushed to GitHub with:
- ✓ `Dockerfile.optimized` (memory-aware build)
- ✓ `docker-compose.yml` updated to use optimized variant
- ✓ `COOLIFY_OPTIMIZATION_SUMMARY.md` (deployment guide)

### Commits
```
5c181c4 Add deployment summary for Dockerfile.optimized rollout to Coolify
b5cd5c5 Switch docker-compose to use Dockerfile.optimized for Coolify deployment testing
0175c5a Add Dockerfile.optimized: memory-aware build for resource-constrained Coolify environments
```

---

## 🚀 Trigger Coolify Build (Pick One)

### Option 1: Manual Redeploy (Fastest)
1. Open Coolify dashboard: `http://159.195.244.160:8000`
2. Navigate to **Vectorr** project → **vectorr-app** application
3. Click **Redeploy** button (top right)
4. Monitor logs in real-time as build runs

**Expected output in logs:**
```
Building Vectroy application...
npm ci ...
npm WARN ...
> next build
  ✓ Compiled client and server successfully
  ...
Build completed successfully
✓ Build succeeded
```

### Option 2: Automatic via GitHub Webhook (If Configured)
- If webhook already configured in Coolify:
  - Coolify auto-detected the push to `feat/pricing-update-2026`
  - Build may have already started (check Coolify logs)
- Verify in Coolify: **Application → Deployments** — should see new deployment in progress

---

## 📊 Monitor Build Progress

### Real-time Logs
1. In Coolify: **Application → Logs** tab
2. Filter by container: `vectroy-app`
3. Look for:
   - Build steps completing (npm ci, npm run build, etc.)
   - Memory usage staying <800MB (verify `NODE_OPTIONS` is active)
   - Build completion message

### Build Duration
- Expected: **30–60 seconds** with memory optimization
- Longer (>2 min): May indicate network/resource constraints
- Fails with OOM: Coolify still needs more memory or different strategy

---

## ✅ Verification After Successful Build

### 1. Container Health Check
In Coolify dashboard:
- **Application → Health** should show **✓ Healthy** (green)
- If red/unhealthy, check logs for startup errors

### 2. API Health Endpoint
```bash
curl https://vectorr.yourdomain.com/api/health
# or if not yet on domain:
curl http://159.195.244.160:3000/api/health
```

Expected response:
```json
{"status":"ok"}
```

### 3. SSH Verification (Optional)
```bash
ssh root@159.195.244.160
docker ps | grep vectroy
docker logs vectroy-app | tail -20
```

Should show `Ready in X.XXs, on http://0.0.0.0:3000`

---

## 🔴 If Build Still Fails

### Gather Information
1. **Coolify logs** → Copy full error output (what does it say after "npm run build"?)
2. **Memory check** → SSH in: `docker stats` while build runs (see peak memory usage)
3. **Dockerfile confirmation** → Verify `docker-compose.yml` line 17 is: `dockerfile: Dockerfile.optimized`

### Next Steps
1. Post logs to this session (sanitize any secrets)
2. If memory-limited, try:
   - In Coolify: **Application → Settings → Resource Limits** → increase Memory to 2GB+
   - Or: Reduce Node heap further: `NODE_OPTIONS="--max-old-space-size=512"`
3. If different error: May need cross-model troubleshooting (beyond memory)

---

## 📝 Decision After Coolify Success

Once Coolify build succeeds:

**Option A (Recommended): Keep Optimized as Primary**
- Keep `Dockerfile.optimized` as production Dockerfile
- Archive or remove original `Dockerfile`
- Update documentation

**Option B: Switch Back + Archive Optimized**
- If you want to keep original Dockerfile
- Use optimized only for memory-constrained environments
- Requires conditional logic or manual selection

**Option C: Investigate Root Cause**
- If you want to fix the original Dockerfile instead
- May require profiling the build in Coolify
- Contact Coolify support if resource limits are unreasonable

---

## 📌 Key Files Reference

| Path | Purpose |
|------|---------|
| `/Dockerfile` | Original (may not work in memory-limited Coolify) |
| `/Dockerfile.optimized` | NEW—memory-aware variant (active in docker-compose) |
| `/docker-compose.yml` | Updated line 17 to reference `Dockerfile.optimized` |
| `/COOLIFY_OPTIMIZATION_SUMMARY.md` | Full technical summary |
| `feat/pricing-update-2026` | Feature branch (all changes pushed) |

---

## 🔗 Links
- Coolify Dashboard: `http://159.195.244.160:8000`
- GitHub Branch: `https://github.com/rosiinante-alt/vectorr/tree/feat/pricing-update-2026`
- Deployment Guide: See `COOLIFY_DEPLOYMENT.md`

---

**Status:** ✅ Ready to Deploy  
**Last Updated:** 2026-11-08 19:45 UTC+5:30  
**Action:** Trigger Coolify rebuild using Option 1 or 2 above

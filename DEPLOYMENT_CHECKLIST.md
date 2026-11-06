# Coolify Deployment Checklist

**Target**: Deploy Vectorr Phase 7 (329 routes) to Coolify production  
**Coolify App ID**: `m47p1toxscficlqop9kb6bny`  
**VPS**: Netcup at `159.195.244.160`

---

## Pre-Deployment Verification ✅

- [x] All code pushed to `main` branch (commit: `7bae677`)
- [x] Build passes locally: `npm run build` → 329 routes
- [x] Tests pass: 252 tests across 16 suites
- [x] Sitemap updated with all new routes
- [x] No secrets in git history (removed problematic commit)
- [x] All Phase 7 objectives complete

---

## Deployment Steps

### 1. Access Coolify UI
```bash
# Open in browser
http://159.195.244.160:8000

# Login credentials: (use your Coolify admin credentials)
```

### 2. Navigate to Application
- Go to **Applications** in sidebar
- Find app `m47p1toxscficlqop9kb6bny` (Vectorr)
- Click to open application dashboard

### 3. Verify Git Configuration
- **Repository**: `https://github.com/rosiinante-alt/Vectorr.git`
- **Branch**: `main`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

### 4. Check Environment Variables
Ensure these are set (click "Environment Variables" tab):
- `NODE_ENV=production`
- `NEXT_PUBLIC_SITE_URL=https://vectorr.com`
- `NEXT_PUBLIC_SUPABASE_URL=https://gfzpqwkurjzxpvjavigs.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...` (from .env.local)
- `SUPABASE_SERVICE_ROLE_KEY=eyJ...` (from .env.local)
- `REPLICATE_API_TOKEN=r8_...` (from .env.local)
- `POLAR_ACCESS_TOKEN=polar_...` (from .env.local)
- `POLAR_WEBHOOK_SECRET=whsec_...` (from .env.local)
- `REDIS_URL=redis://...` (from .env.local or Coolify Redis addon)

### 5. Deploy
- Click **"Redeploy"** button (or **"Force Redeploy"** if needed)
- Coolify will:
  1. Pull latest `main` branch
  2. Run `npm install`
  3. Run `npm run build` (generates 329 pages)
  4. Start the application
  5. Update routing to new container

### 6. Monitor Deployment
Watch the deployment logs in Coolify:
- Build phase: Should see "Generating static pages (329/329)"
- Start phase: Should see "Ready on http://0.0.0.0:3000"
- Health checks: Should turn green

---

## Post-Deployment Verification

### A. Check Homepage
```bash
curl -I https://vectorr.com/
# Expected: 200 OK
```

### B. Verify New Blog Articles
```bash
# Check blog hub
curl -I https://vectorr.com/blog
# Expected: 200 OK

# Spot-check new articles
curl -I https://vectorr.com/blog/svg-vs-raster-graphics
curl -I https://vectorr.com/blog/vector-file-formats-explained
curl -I https://vectorr.com/blog/best-practices-logo-design
# Expected: All 200 OK
```

### C. Verify New Tools
```bash
# Check tools hub
curl -I https://vectorr.com/tools
# Expected: 200 OK

# Spot-check new tools
curl -I https://vectorr.com/tools/svg-path-editor
curl -I https://vectorr.com/tools/raster-tracer
curl -I https://vectorr.com/tools/file-validator
# Expected: All 200 OK
```

### D. Verify New Workflows
```bash
# Crafters
curl -I https://vectorr.com/for-crafters/paper-cutting-workflow
curl -I https://vectorr.com/for-crafters/wood-burning-workflow

# Shops
curl -I https://vectorr.com/for-shops/commercial-printing-workflow
curl -I https://vectorr.com/for-shops/vehicle-wrap-workflow

# Designers
curl -I https://vectorr.com/for-designers/design-system-workflow
curl -I https://vectorr.com/for-designers/accessibility-workflow
# Expected: All 200 OK
```

### E. Verify New Resources
```bash
curl -I https://vectorr.com/resources/png-vs-jpg-comparison
curl -I https://vectorr.com/resources/illustrator-vs-affinity-designer
# Expected: All 200 OK
```

### F. Verify New Comparisons
```bash
curl -I https://vectorr.com/compare/figma-vs-vectorr
curl -I https://vectorr.com/compare/canva-vs-vectorr
# Expected: All 200 OK
```

### G. Check Sitemap
```bash
curl https://vectorr.com/sitemap.xml | grep -c "<url>"
# Expected: 329
```

### H. Check Core Features
```bash
# Converter
curl -I https://vectorr.com/convert/svg-to-png
# Expected: 200 OK

# Dashboard (requires auth)
curl -I https://vectorr.com/dashboard
# Expected: 307 Redirect to /login

# API health
curl https://vectorr.com/api/health
# Expected: {"status":"ok"}
```

---

## Rollback Plan (If Needed)

If deployment fails or shows errors:

1. **Quick Rollback**: In Coolify, click "Rollback" to previous deployment
2. **Check Logs**: View deployment logs for error messages
3. **Environment Variables**: Verify all required vars are set correctly
4. **Git Branch**: Ensure Coolify is pulling from `main` branch
5. **Manual Fix**: SSH into VPS if needed:
   ```bash
   ssh root@159.195.244.160
   # Check Docker containers, logs, disk space
   ```

---

## Success Criteria

Deployment is successful when:
- ✅ All HTTP checks return 200 OK
- ✅ Sitemap shows 329 URLs
- ✅ Homepage loads with correct hero content
- ✅ Blog hub shows 86 articles
- ✅ Tools hub shows 18 tools
- ✅ Workflow hubs show expanded content
- ✅ No 404 errors in browser console
- ✅ API routes respond correctly
- ✅ Dashboard redirects to login

---

## Next Steps After Deployment

1. **Domain Migration**: Point `vectorr.com` DNS to Coolify server IP
2. **SSL Certificate**: Ensure Let's Encrypt SSL is active
3. **Search Console**: Submit sitemap to Google Search Console
4. **Analytics**: Verify Google Analytics tracking
5. **Performance**: Run Lighthouse audit on key pages
6. **Monitoring**: Set up uptime monitoring (UptimeRobot, Pingdom)

---

**Prepared**: November 7, 2026  
**Phase**: 7 Complete (329 routes)  
**Ready for**: Production Deployment  
**Contact**: Manual deployment via Coolify UI required

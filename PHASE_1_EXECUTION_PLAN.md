# Phase 1 Execution Plan - FULL DEPLOYMENT
**Date**: Nov 2, 2026  
**Mode**: Maximum Parallelization  
**Goal**: Complete Phase 1 in 72 hours (not 2 weeks)

---

## Agent Army Deployment

### Session 1: Database Schema Architect (Gemini 4 Argon)
**Task**: Design complete database schema for Phase 1  
**Deliverables**:
- `schema_v2.sql` with all tables (conversions, credits, teams, versions, etc.)
- Migration script from current schema
- Indexes, RLS policies, triggers
- Supabase Storage bucket policies

**Tables to create**:
```sql
-- Core
conversions (id, user_id, original_url, converted_url, status, credits_used, preprocessing)
credit_transactions (id, user_id, amount, balance_after, reason, conversion_id)
user_credits (user_id, balance, tier, subscription_id)

-- Team Features (Phase 1 simple version)
teams (id, name, owner_id, plan, created_at)
team_members (team_id, user_id, role, joined_at)
team_folders (id, team_id, name, created_at)
conversion_folders (conversion_id, folder_id)

-- Version History
conversion_versions (id, conversion_id, version_number, checkpoint_name, file_url, created_at)

-- Batch Processing
batch_jobs (id, user_id, status, total_files, completed_files, zip_url, created_at)
batch_files (id, batch_id, file_url, status, result_url, error)

-- AI Tools
ai_generations (id, user_id, type, prompt, preset, result_url, credits_used, status)

-- Presets
user_presets (id, user_id, name, settings_json, created_at)
```

---

### Session 2: Backend Infrastructure (GPT-6.1-sol)
**Task**: Set up Redis + BullMQ + Worker queues  
**Deliverables**:
- `docker-compose.yml` updated with Redis
- `lib/queue/` infrastructure (BullMQ setup)
- Queue definitions: vectorize, remove-bg, upscale, batch, export, ai-generate
- Worker base class: `lib/workers/base-worker.ts`
- Job status polling API: `GET /api/jobs/[id]`

**Files to create**:
```
lib/queue/
  ├── client.ts         // BullMQ connection
  ├── queues.ts         // Queue definitions
  └── types.ts          // Job payload types

lib/workers/
  ├── base-worker.ts    // Abstract worker class
  └── index.ts          // Worker registry

api/jobs/
  ├── [id]/route.ts     // Job status polling
  └── [id]/cancel/route.ts
```

---

### Session 3: Replicate API Integration (Sonnet 5.5)
**Task**: Integrate Replicate for vectorization + upscaling  
**Deliverables**:
- `lib/ai/replicate-client.ts` (typed API wrapper)
- `workers/vectorize/index.ts` (vectorization worker)
- `workers/upscale/index.ts` (upscaling worker)
- `workers/remove-bg/index.ts` (background removal worker)
- API endpoints: `POST /api/convert`, `POST /api/upscale`, `POST /api/remove-bg`

**Replicate Models to Use**:
- Vectorization: `andreasjansson/tracer` or `victorcar/vector-magic-alt`
- Upscaling: `nightmareai/real-esrgan`
- Background removal: `cjwbw/rembg`

---

### Session 4: Credit System (Sonnet 5.5)
**Task**: Complete credit system with Stripe integration  
**Deliverables**:
- `lib/credits/` module (deduct, refund, check balance)
- Stripe checkout: `POST /api/checkout/create-session`
- Stripe webhook: `POST /api/webhooks/stripe`
- Credit purchase tiers: one-time ($6.99), Starter ($7.99/mo), Plus ($9.99/mo), Pro ($14.99/mo)
- API endpoints: `GET /api/credits/balance`, `POST /api/credits/purchase`

**Stripe Products to Create**:
```typescript
const PRODUCTS = {
  ONE_TIME: { price: 6.99, credits: 1.20 },
  STARTER: { price: 7.99, credits: 5, interval: 'month' },
  PLUS: { price: 9.99, credits: 8, interval: 'month' },
  PRO: { price: 14.99, credits: 20, interval: 'month' },
  STARTER_YEARLY: { price: 49, credits: 60, interval: 'year' },
  PLUS_YEARLY: { price: 79, credits: 96, interval: 'year' },
  PRO_YEARLY: { price: 129, credits: 240, interval: 'year' },
};
```

---

### Session 5: Frontend Core Conversion UI (Sonnet 5.5)
**Task**: Rebuild upload → preview → download flow for images  
**Deliverables**:
- Updated `FileUpload` component (accept PNG/JPG/WEBP)
- New `ImagePreview` component (watermarked preview)
- Updated `Workspace` component (conversion flow)
- Job status polling with progress bar
- Credit cost preview (shows total before convert)
- "Remove Background" and "Upscale" toggles

**UI Flow**:
```
1. Upload image(s)
2. Show preview + options:
   - Remove background? (+0.07 credits)
   - Upscale? (2x/4x, +0.15 credits)
   - Destination preset? (web/cricut/laser)
3. Show total cost: "0.42 credits"
4. Click "Convert"
5. Show progress (polling job status)
6. Show watermarked result
7. "Unlock & Download" button (deducts credits)
```

---

### Session 6: Batch Processing UI + Backend (Opus 5.5)
**Task**: 50-file batch upload with ZIP download  
**Deliverables**:
- Multi-file upload with individual progress bars
- Batch job creation: `POST /api/batch/create`
- Batch status polling: `GET /api/batch/[id]`
- ZIP archive generation worker
- Batch download: `GET /api/batch/[id]/download`

**UI Components**:
```tsx
<BatchUpload />           // Multi-file drag-drop
<BatchProgress />         // Individual file progress bars
<BatchResults />          // Grid of thumbnails
<BatchDownload />         // ZIP download button
```

---

### Session 7: Export Formats (Sonnet 5.5)
**Task**: Add DXF, EPS, PDF, CDR, Lottie export  
**Deliverables**:
- Export worker: `workers/export/index.ts`
- Format converters: svg2dxf, svg2pdf, svg2eps, svg2cdr, svg2lottie
- Export API: `POST /api/exports/create`
- Multi-format download UI (dropdown selector)

**Libraries to Install**:
```bash
npm install svg2pdf.js dxf-writer jspdf
npm install @lottiefiles/lottie-js      # SVG → Lottie
npm install svg2cdr                      # CorelDRAW format
```

---

### Session 8: AI Style Transfer (Opus 5.5)
**Task**: AI style presets (cubist, minimalist, hand-drawn, etc.)  
**Deliverables**:
- Style preset catalog (10 presets with reference images)
- AI style transfer worker using Replicate
- New page: `/tools/style-transfer`
- Preset selector UI with before/after previews
- Backend: exact prompts for each style

**Style Presets**:
```typescript
const STYLE_PRESETS = [
  { id: 'cubist', name: 'Cubist', prompt: 'geometric cubist art style, angular shapes, multiple perspectives', example: '/styles/cubist.jpg' },
  { id: 'minimalist', name: 'Minimalist', prompt: 'clean minimalist design, simple shapes, limited colors', example: '/styles/minimalist.jpg' },
  { id: 'hand-drawn', name: 'Hand-Drawn', prompt: 'hand-drawn sketch style, organic lines, imperfect curves', example: '/styles/hand-drawn.jpg' },
  { id: 'art-deco', name: 'Art Deco', prompt: 'art deco style, geometric patterns, bold lines, 1920s aesthetic', example: '/styles/art-deco.jpg' },
  { id: 'watercolor', name: 'Watercolor', prompt: 'watercolor painting style, soft edges, color bleeding', example: '/styles/watercolor.jpg' },
  { id: 'pixel-art', name: 'Pixel Art', prompt: '8-bit pixel art style, retro game aesthetic', example: '/styles/pixel-art.jpg' },
  { id: 'isometric', name: 'Isometric', prompt: 'isometric 3D style, 30-degree angle, depth illusion', example: '/styles/isometric.jpg' },
  { id: 'stained-glass', name: 'Stained Glass', prompt: 'stained glass window style, bold outlines, translucent colors', example: '/styles/stained-glass.jpg' },
  { id: 'neon', name: 'Neon', prompt: 'neon sign style, glowing edges, vibrant colors', example: '/styles/neon.jpg' },
  { id: 'woodcut', name: 'Woodcut', prompt: 'traditional woodcut print style, bold black lines, limited colors', example: '/styles/woodcut.jpg' },
];
```

---

### Session 9: Version History (Sonnet 5.5)
**Task**: Named checkpoints for conversions  
**Deliverables**:
- Version history UI (timeline view)
- Create checkpoint: `POST /api/conversions/[id]/checkpoint`
- Restore version: `POST /api/conversions/[id]/restore`
- Version comparison UI (side-by-side)

**UI Flow**:
```
1. After conversion, show "Save Checkpoint" button
2. User names it: "Before client feedback"
3. Make changes (color editing, style transfer)
4. Save another checkpoint: "Final approved"
5. Version timeline shows all checkpoints
6. Click any version to restore
```

---

### Session 10: Advanced SVG Editor (Opus 5.5)
**Task**: In-browser vector editor with Bézier tools  
**Deliverables**:
- New page: `/tools/editor`
- Canvas rendering with node editing
- Boolean operations (union, subtract, intersect)
- Text tool, shape tools (rect, circle, polygon)
- Export edited SVG

**Libraries**:
```bash
npm install fabric paper.js         # Canvas manipulation
npm install @flatten-js/boolean-op  # Boolean operations
```

---

### Session 11: Before/After Comparison UI (Haiku 5.5)
**Task**: Slider comparison + side-by-side view  
**Deliverables**:
- `<BeforeAfter>` component with slider
- Show original raster vs converted vector
- Zoom sync (both images zoom together)

---

### Session 12: Custom Presets System (Sonnet 5.5)
**Task**: Save conversion settings as named presets  
**Deliverables**:
- Preset CRUD APIs
- Preset selector in upload flow
- Default presets: "Logo Vectorization", "Photo Tracing", "Line Art", "Icon", "Illustration"

---

### Session 13: Keyboard Shortcuts (Haiku 5.5)
**Task**: Add keyboard navigation  
**Deliverables**:
- Spacebar: pan canvas
- +/- or scroll: zoom
- Ctrl+Z: undo
- Ctrl+Y: redo
- Escape: close modals
- Arrow keys: nudge selection

---

### Session 14: Email/Dropbox/OneDrive Upload (Sonnet 5.5)
**Task**: Alternative upload methods  
**Deliverables**:
- Email ingestion: `conversions@vectorr.com` (Sendgrid inbound parse)
- Dropbox integration: OAuth + folder watch
- OneDrive integration: OAuth + folder watch
- Facebook Messenger bot: upload photo → get download link

**Flow**:
```
1. User emails photo to conversions@vectorr.com
2. Sendgrid webhook → API endpoint
3. Download attachment → Supabase Storage
4. Create conversion job
5. Email back download link
```

---

### Session 15: SEO Landing Pages (Haiku 5.5 + Template)
**Task**: Generate 67 SEO-optimized converter pages  
**Deliverables**:
- Dynamic route: `app/convert/[format]/page.tsx`
- Content generator script (800-1200 words per page)
- Schema.org markup (HowTo, SoftwareApplication)
- Internal linking between related converters

**Pages to Generate**:
```typescript
const CONVERTER_PAGES = [
  'png-to-svg', 'jpg-to-svg', 'jpeg-to-svg', 'webp-to-svg', 'gif-to-svg',
  'heic-to-svg', 'tiff-to-svg', 'bmp-to-svg', 'ai-to-svg', 'eps-to-svg',
  'pdf-to-svg', 'psd-to-svg', 'image-to-vector', 'photo-to-svg',
  'logo-to-vector', 'svg-for-cricut', 'svg-for-silhouette',
  'svg-for-laser-cutting', 'embroidery-converter', 'svg-for-vinyl-cutting',
  // ... 47 more
];
```

---

### Session 16: Zapier Integration (Sonnet 5.5)
**Task**: Zapier app with triggers + actions  
**Deliverables**:
- Zapier CLI app definition
- Trigger: "New Conversion Complete"
- Action: "Convert Image to SVG"
- Authentication: API key
- Publish to Zapier marketplace

---

### Session 17: Additional Export Formats (Sonnet 5.5)
**Task**: Add Lottie, CDR, WMF exports  
**Deliverables**:
- Lottie JSON export (for animations)
- CorelDRAW (CDR) export
- Windows Metafile (WMF) export

---

### Session 18: Team Workspaces (Simple Version) (Opus 5.5)
**Task**: Basic team folders + role-based access  
**Deliverables**:
- Team creation: `POST /api/teams/create`
- Invite members: `POST /api/teams/[id]/invite`
- Shared folders (no real-time yet)
- Roles: admin, editor, viewer
- Team billing: one subscription for whole team

**Pricing**:
- Team Starter: $39/mo (3 seats, 15 credits/seat = 45 total)
- Team Pro: $99/mo (5 seats, 20 credits/seat = 100 total)

---

### Session 19: Comments & Annotations (Sonnet 5.5)
**Task**: Pin comments to SVG paths/colors  
**Deliverables**:
- Comment system (like Figma comments)
- Pin to specific coordinates in SVG
- Threaded replies
- @mentions (notify team members)
- Comment API: `POST /api/conversions/[id]/comments`

---

### Session 20: Approval Workflows (Sonnet 5.5)
**Task**: Submit → Review → Approve/Reject flow  
**Deliverables**:
- Approval request: `POST /api/conversions/[id]/request-approval`
- Approve/reject actions
- Email notifications
- Approval history timeline

---

## Supabase Setup Needed (User Action)

### Step 1: Create New Supabase Project
1. Go to https://supabase.com/dashboard
2. Create new project: "Vectorr Production"
3. Choose region: closest to Netcup server (Germany)
4. Copy these credentials:
   - Project URL: `https://[project-id].supabase.co`
   - Anon Key: `eyJ...`
   - Service Role Key: `eyJ...` (DO NOT SHARE)

### Step 2: Run Schema Migration
1. Open Supabase SQL Editor
2. Copy entire contents of `/Users/rosinante/Projects/Vectorr/schema_v2.sql` (will be generated by Session 1)
3. Run SQL
4. Verify tables created: conversions, credits, teams, etc.

### Step 3: Create Storage Buckets
```sql
-- Run in SQL Editor
INSERT INTO storage.buckets (id, name, public) VALUES
  ('originals', 'originals', false),
  ('conversions', 'conversions', false),
  ('exports', 'exports', false),
  ('batch-archives', 'batch-archives', false);
```

### Step 4: Set Environment Variables
Add to Coolify environment variables:
```env
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### Step 5: Replicate API Key
1. Sign up at https://replicate.com
2. Go to Account → API Tokens
3. Create token
4. Add to Coolify:
```env
REPLICATE_API_TOKEN=r8_...
```

### Step 6: Stripe Setup
1. Go to https://stripe.com/dashboard
2. Get API keys (test mode first)
3. Create products (Starter, Plus, Pro)
4. Set up webhook endpoint: `https://yoursite.com/api/webhooks/stripe`
5. Add to Coolify:
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Step 7: Redis on Coolify
Already have Redis in docker-compose? If not:
```yaml
services:
  redis:
    image: redis:7-alpine
    volumes:
      - redis-data:/data
    restart: unless-stopped
```

---

## Agent Spawn Order (Parallel Execution)

### Immediate (No Dependencies):
- ✅ Session 1: Database Schema (Gemini 4)
- ✅ Session 11: Before/After UI (Haiku 5.5)
- ✅ Session 13: Keyboard Shortcuts (Haiku 5.5)
- ✅ Session 15: SEO Pages Generator (Haiku 5.5)

### After Schema Complete:
- Session 2: Backend Infrastructure (GPT-6.1-sol)
- Session 4: Credit System (Sonnet 5.5)
- Session 12: Custom Presets (Sonnet 5.5)
- Session 18: Team Workspaces (Opus 5.5)

### After Backend Infrastructure:
- Session 3: Replicate Integration (Sonnet 5.5)
- Session 6: Batch Processing (Opus 5.5)
- Session 7: Export Formats (Sonnet 5.5)
- Session 8: AI Style Transfer (Opus 5.5)

### After Replicate Integration:
- Session 5: Frontend Conversion UI (Sonnet 5.5)
- Session 9: Version History (Sonnet 5.5)
- Session 14: Email/Dropbox Upload (Sonnet 5.5)

### After Frontend Core:
- Session 10: Advanced SVG Editor (Opus 5.5)
- Session 16: Zapier Integration (Sonnet 5.5)
- Session 17: Additional Exports (Sonnet 5.5)
- Session 19: Comments System (Sonnet 5.5)
- Session 20: Approval Workflows (Sonnet 5.5)

---

## Success Criteria (72-Hour Checkpoint)

### Hour 24:
- [ ] Database schema deployed to Supabase
- [ ] Redis + BullMQ running locally
- [ ] Replicate API working (single conversion)
- [ ] Credit system functional (deduct/refund)

### Hour 48:
- [ ] Image upload → vectorization → download works
- [ ] Batch processing (50 files) works
- [ ] Stripe integration (one-time purchase) works
- [ ] 10 SEO pages live

### Hour 72:
- [ ] All export formats working (SVG, DXF, EPS, PDF, CDR, Lottie)
- [ ] AI style transfer (10 presets)
- [ ] Version history working
- [ ] Team workspaces (basic) working
- [ ] Before/after comparison UI live
- [ ] Custom presets working
- [ ] 67 SEO pages deployed
- [ ] Deployed to Coolify staging

---

## Deployment Checklist

### Pre-Deploy:
- [ ] All tests passing (`npm test`)
- [ ] Build successful (`npm run build`)
- [ ] Environment variables set in Coolify
- [ ] Supabase RLS policies verified
- [ ] Stripe webhook endpoint configured

### Deploy:
- [ ] Push to GitHub main branch
- [ ] Coolify auto-deploys via webhook
- [ ] Verify containers healthy
- [ ] Test conversion end-to-end
- [ ] Monitor Redis queue

### Post-Deploy:
- [ ] Create first test conversion
- [ ] Purchase credits with test card
- [ ] Test batch upload
- [ ] Verify all export formats download
- [ ] Check Stripe webhook receiving events

---

**END OF PHASE 1 EXECUTION PLAN**

Pedro will now spawn agents in optimal order.

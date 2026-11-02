# Vectorr Complete Rebuild Plan
**Date**: Nov 2, 2026  
**Goal**: Clone every VectoSolve feature, preserve our UI design  
**Timeline**: 8-10 weeks to feature parity  
**Research Agent**: Running in background (gap analysis)

---

## 🎯 Design Constraints (LOCKED)

### UI Preservation Rules
- ✅ **Keep**: All current color codes, font sizes, spacing, component styles
- ✅ **Keep**: Light mode aesthetic, clean layout, Framer Motion animations
- ✅ **Keep**: Inter font, existing button/card/badge components
- ❌ **Don't touch**: Color scheme, typography scale, animation timing
- ✅ **Extend**: Reuse existing UI patterns for new features (file upload, previews, download buttons)

### Current UI Assets to Preserve
From `src/app/globals.css`:
```css
--background: #FFFFFF
--text-primary: #1D1D1F
--text-secondary: #6E6E73
--accent: (extract from current site)
--border-strong: (extract from current site)
```

From existing components:
- `Button` variants (primary, secondary, outline)
- `Card` with shadow system
- `Badge` styling
- File upload drag-drop zone
- SVG preview canvas
- Savings report layout

**Action**: Extract exact tokens before starting, document in `UI_TOKENS.md`

---

## 📦 Backend Architecture Decision

### Core Requirements
1. **Image Processing**:
   - PNG/JPG/WEBP → SVG conversion (AI vectorization)
   - Background removal (AI segmentation)
   - Image upscaling (super-resolution AI)
   - Batch processing (50 files, 3 parallel workers)

2. **File Handling**:
   - Upload: 10MB max, multiple formats
   - Storage: Supabase Storage (original + converted)
   - Downloads: ZIP archives for batch

3. **AI Integration**:
   - Vectorization API (Replicate, Vector Magic, or custom)
   - Background removal (RemoveBG or rembg)
   - Upscaling (Real-ESRGAN or similar)
   - Logo generation (Replicate + Fal.ai)
   - Content generation (OpenAI/Anthropic)

4. **Export Formats**:
   - Vector: SVG, DXF, EPS, AI, PDF
   - Embroidery: DST, PES, JEF
   - CNC: G-code
   - 3D: 3MF (multicolor)

5. **Database**:
   - User uploads (metadata + storage URLs)
   - Conversion jobs (status tracking)
   - Credit balance (0.20 per conversion, etc.)
   - Export history

### Backend Options

#### Option A: Keep Next.js API Routes (Current)
**Pros**:
- Already set up (Supabase, auth, file upload)
- Serverless-friendly (Vercel/Coolify)
- TypeScript end-to-end
- Simple deployment

**Cons**:
- Harder to run heavy AI workloads (potrace, ESRGAN)
- Timeouts on long-running jobs (30s Vercel, 60s most platforms)
- Can't easily scale workers for batch processing

**Best for**: Quick MVP with third-party APIs (Replicate, RemoveBG)

#### Option B: Next.js + Background Worker Queue
**Pros**:
- Keep Next.js for auth/API/UI
- Add BullMQ + Redis for job queue
- Workers run AI processing async
- Scale workers independently

**Cons**:
- More infrastructure (Redis, worker containers)
- More deployment complexity

**Best for**: Heavy processing, batch jobs, future scale

#### Option C: Full Python Backend (Flask/FastAPI)
**Pros**:
- Native Python AI libs (potrace, opencv, PIL)
- Better for image processing
- Mature vectorization tools

**Cons**:
- Rewrite all API routes
- Lose TypeScript type safety
- Two codebases (Next.js frontend + Python backend)

**Best for**: If building custom vectorization (not using APIs)

#### Option D: Hybrid (Next.js + Python Microservice)
**Pros**:
- Keep Next.js for most endpoints
- Python service ONLY for vectorization/upscaling
- Best of both worlds

**Cons**:
- Two services to deploy
- More moving parts

**Best for**: Balance between speed (APIs) and control (custom)

---

## 🏗️ Recommended Architecture: **Option B (Next.js + Worker Queue)**

### Why This Wins:
1. **Preserve existing work**: Keep all current Next.js code, auth, Supabase
2. **Use APIs initially**: Replicate for vectorization (fast to ship)
3. **Scale later**: Add custom workers when we need them
4. **Batch-ready**: BullMQ handles 50-file batches naturally
5. **Cost control**: Workers can be scaled to zero when idle

### Stack:
- **Frontend**: Next.js 16.4.3 (current)
- **API Routes**: Next.js API routes (auth, uploads, job submission)
- **Job Queue**: BullMQ (Redis-backed)
- **Workers**: Docker containers running:
  - Image processing (sharp, canvas)
  - AI API calls (Replicate, RemoveBG)
  - Export format conversion (svg2pdf, svgo)
- **Storage**: Supabase Storage (images + results)
- **Database**: Supabase Postgres (jobs, credits, exports)

### Docker Compose Structure:
```yaml
services:
  web:
    build: .
    ports: [3000:3000]
    depends_on: [redis]
    
  redis:
    image: redis:7-alpine
    
  worker-vectorize:
    build: ./workers/vectorize
    depends_on: [redis]
    replicas: 3  # Parallel batch processing
    
  worker-export:
    build: ./workers/export
    depends_on: [redis]
```

---

## 📋 Feature Implementation Roadmap

### Phase 1: Core Conversion (Week 1-2)
**Goal**: PNG/JPG → SVG works end-to-end

#### Backend Tasks:
- [ ] Add Redis + BullMQ to docker-compose.yml
- [ ] Create `vectorize` job queue
- [ ] Build `/api/files/convert` endpoint (submit job, return job ID)
- [ ] Build `/api/jobs/[id]` endpoint (poll status)
- [ ] Create worker: `workers/vectorize/index.ts`
  - [ ] Integrate Replicate API (model: `andreasjansson/tracer`)
  - [ ] Download result, upload to Supabase Storage
  - [ ] Update job status (processing → complete → url)
- [ ] Add `conversions` table (schema update)
- [ ] Add `credit_transactions` table
- [ ] Implement credit deduction (0.20 per conversion)

#### Frontend Tasks:
- [ ] Replace `FileUpload` to accept images (PNG, JPG, WEBP)
- [ ] Remove SVG-only validation
- [ ] Add "Converting..." state with progress indicator
- [ ] Add polling for job status (useInterval hook)
- [ ] Show watermarked preview before payment
- [ ] Add "Download" button (unlocks with credits)

#### Database Schema:
```sql
CREATE TABLE conversions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users,
  original_file_url text NOT NULL,
  converted_file_url text,
  original_format text NOT NULL, -- png, jpg, webp
  status text NOT NULL, -- pending, processing, complete, failed
  credits_used numeric(4,2) DEFAULT 0.20,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

CREATE TABLE credit_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users,
  amount numeric(4,2) NOT NULL, -- negative for deductions
  balance_after numeric(4,2) NOT NULL,
  reason text NOT NULL, -- 'conversion', 'purchase', 'refund'
  conversion_id uuid REFERENCES conversions,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE user_credits (
  user_id uuid PRIMARY KEY REFERENCES auth.users,
  balance numeric(4,2) DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);
```

#### API Endpoints:
- `POST /api/files/convert` (submit image, return job ID)
- `GET /api/jobs/[id]` (poll status)
- `GET /api/jobs/[id]/download` (download converted SVG)
- `GET /api/credits/balance` (check user credits)

---

### Phase 2: Pre-Processing Tools (Week 3)
**Goal**: Background removal + upscaling work

#### Backend Tasks:
- [ ] Create `remove-bg` job queue
- [ ] Worker: RemoveBG API or rembg library
  - [ ] Input: original image URL
  - [ ] Output: transparent PNG → Supabase Storage
  - [ ] Cost: 0.07 credits
- [ ] Create `upscale` job queue
- [ ] Worker: Real-ESRGAN via Replicate
  - [ ] 2x or 4x scale selector
  - [ ] Cost: 0.15 credits
- [ ] Add "Workflow" endpoint: remove-bg → upscale → vectorize (chained jobs)

#### Frontend Tasks:
- [ ] Add "Remove Background" toggle to upload flow
- [ ] Add "Upscale" dropdown (None, 2x, 4x)
- [ ] Show combined credit cost preview
- [ ] Chain jobs automatically (BG removal → vectorize)

#### Database Schema:
```sql
ALTER TABLE conversions ADD COLUMN preprocessing jsonb DEFAULT '{}'::jsonb;
-- Example: {"remove_bg": true, "upscale": "4x"}
```

---

### Phase 3: Batch Processing (Week 4)
**Goal**: 50 files at once, ZIP download

#### Backend Tasks:
- [ ] Create `batch` job queue
- [ ] Worker: process array of file IDs (3 parallel at a time)
- [ ] Generate ZIP archive (archiver.js)
- [ ] Store ZIP in Supabase Storage (expires in 24h)
- [ ] Add batch limit: 50 files max

#### Frontend Tasks:
- [ ] Update FileUpload to accept multiple files
- [ ] Show list of files with individual progress bars
- [ ] Disable "Convert" until all uploaded
- [ ] Show "Download ZIP" when batch complete
- [ ] Individual download buttons for each file

#### API Endpoints:
- `POST /api/batch/convert` (array of file IDs)
- `GET /api/batch/[id]/status` (overall + individual progress)
- `GET /api/batch/[id]/download` (ZIP archive)

---

### Phase 4: Export Formats (Week 5-6)
**Goal**: DXF, EPS, AI, PDF, G-code, DST, PES, JEF

#### Backend Tasks:
- [ ] Create `export` job queue
- [ ] Worker: svg2pdf, svg2dxf, svg2gcode libraries
- [ ] Embroidery: Ink/Stitch or Embroidermodder integration
- [ ] Store exports in Supabase Storage
- [ ] Add format selector to UI

#### Frontend Tasks:
- [ ] Add "Export Format" dropdown on download page
- [ ] Multiple download buttons (SVG, DXF, EPS, etc.)
- [ ] Batch export: "Download all as ZIP"

#### Libraries Needed:
- `svg2pdf.js` (SVG → PDF)
- `dxf-writer` (SVG → DXF)
- `svg2gcode` (SVG → G-code for CNC)
- `inkstitch` (Python CLI for embroidery formats)

---

### Phase 5: AI Tools (Week 7-8)
**Goal**: Logo generation, SVG generation, animation, content gen

#### Backend Tasks:
- [ ] Create `ai-logo` job queue
- [ ] Worker: Replicate API (model: `stability-ai/sdxl` → SVG converter)
- [ ] Cost: 0.25 credits
- [ ] Create `ai-animate` job queue (Gemini API)
- [ ] Create `ai-content` job queue (OpenAI/Anthropic for Etsy listings)

#### Frontend Tasks:
- [ ] New page: `/generate/logo` (text prompt → SVG)
- [ ] New page: `/animate` (upload SVG, describe animation)
- [ ] New page: `/content-gen` (upload SVG, get Etsy listing)

#### Database Schema:
```sql
CREATE TABLE ai_generations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users,
  type text NOT NULL, -- 'logo', 'svg', 'pattern', 'animation'
  prompt text NOT NULL,
  result_url text,
  credits_used numeric(4,2),
  status text NOT NULL,
  created_at timestamptz DEFAULT now()
);
```

---

### Phase 6: Specialized Workflows (Week 9-10)
**Goal**: Cricut, laser, embroidery, vinyl specialized flows

#### Backend Tasks:
- [ ] Add "destination" parameter to conversion jobs (web, cricut, laser, embroidery)
- [ ] Cricut: Layered SVG with closed paths
- [ ] Laser: DXF with kerf settings
- [ ] Embroidery: Stitch file generation
- [ ] Vinyl: Color separation layers

#### Frontend Tasks:
- [ ] Add "Use Case" selector on upload (Cricut, Laser, Embroidery, etc.)
- [ ] Show specialized previews (layer view, cut lines, stitch paths)
- [ ] Add dedicated landing pages:
  - `/svg-for-cricut`
  - `/svg-for-laser-cutting`
  - `/embroidery-converter`

---

### Phase 7: Free Maker Tools (Week 11-12)
**Goal**: 26 free in-browser tools (no credits required)

#### Tools List (Priority Order):
1. **SVG Editor** (in-browser, color/path editing)
2. **SVG Optimizer** (SVGO integration - WE ALREADY HAVE THIS!)
3. **Gear Generator** (parametric SVG gears)
4. **Box Generator** (finger joint laser-cut boxes)
5. **Nesting Tool** (pack parts onto sheets)
6. **Cut File Checker** (score 0-100 for cut-readiness)
7. **Halftone Generator** (image → dot pattern)
8. **Vinyl Color Matcher** (SVG colors → Oracal/Siser)
9. **Thread Color Mapper** (SVG colors → embroidery thread)
10. **DTF Gang Sheet Builder** (pack designs onto 22" sheets)
... (16 more from VECTOSOLVE_FEATURES.md)

#### Implementation:
- All client-side (no server processing)
- Web Workers for heavy computation
- Canvas API for rendering
- downloadjs for file exports

---

## 📊 Credit System Implementation

### Credit Costs (Match VectoSolve):
```typescript
const CREDIT_COSTS = {
  VECTORIZE: 0.20,
  REMOVE_BG: 0.07,
  UPSCALE: 0.15,
  AI_LOGO: 0.25,
  AI_SVG: 0.25,
  AI_PATTERN: 0.25,
  AI_ANIMATE_ECO: 0.10,
  AI_ANIMATE_STANDARD: 0.25,
  AI_ANIMATE_PRO: 0.50,
  AI_CONTENT: 0.10,
  AI_IMAGE: 0.50,
  BRAND_KIT: 2.50,
} as const;
```

### Credit Purchase Tiers:
- **Free**: 1 watermarked preview/day (no credits, no signup)
- **One-time**: $6.99 (1.20 credits - unlocks 1 file)
- **Starter**: $7.99/mo (5 credits = 25 conversions)
- **Pro**: $14.99/mo (20 credits = 100 conversions)
- **Yearly discount**: ~40% off (Starter $49/year, Pro $129/year)

### Stripe Integration:
- [ ] Add Stripe SDK
- [ ] Create checkout sessions
- [ ] Webhook handler for payment success
- [ ] Add credits to user balance
- [ ] Create `subscriptions` table

---

## 🎨 SEO Landing Pages Strategy

### 67 Pages to Build (Programmatic Generation):

#### Format Converters (12 pages):
- PNG to SVG
- JPG to SVG
- JPEG to SVG
- WEBP to SVG
- GIF to SVG
- HEIC to SVG
- TIFF to SVG
- BMP to SVG
- AI to SVG
- EPS to SVG
- PDF to SVG
- PSD to SVG

#### Use Case Pages (20 pages):
- Image to Vector
- Photo to SVG
- Logo to Vector
- SVG for Cricut
- SVG for Silhouette
- SVG for Laser Cutting
- Embroidery Converter
- SVG for Vinyl Cutting
... (see VECTOSOLVE_FEATURES.md for full list)

#### Implementation:
```typescript
// app/convert/[format]/page.tsx
export async function generateStaticParams() {
  return [
    { format: 'png-to-svg' },
    { format: 'jpg-to-svg' },
    // ... 65 more
  ];
}

export async function generateMetadata({ params }) {
  const config = CONVERTER_CONFIGS[params.format];
  return {
    title: config.seoTitle,
    description: config.seoDescription,
  };
}
```

### SEO Content Strategy:
- Each page: 800-1200 words
- Include: How-to guide, use cases, format comparison, pricing CTA
- Schema.org markup: HowTo, SoftwareApplication
- Internal linking: cross-link related converters

---

## 🔧 Infrastructure Requirements

### Production Deployment (Coolify on Netcup):
```yaml
# docker-compose.yml
services:
  web:
    image: vectorr:latest
    environment:
      - REDIS_URL=redis://redis:6379
      - SUPABASE_URL=${SUPABASE_URL}
      - REPLICATE_API_KEY=${REPLICATE_API_KEY}
    ports: [3000:3000]
    
  redis:
    image: redis:7-alpine
    volumes:
      - redis-data:/data
      
  worker-vectorize:
    image: vectorr-worker:latest
    environment:
      - REDIS_URL=redis://redis:6379
      - QUEUE_NAME=vectorize
    deploy:
      replicas: 3
      
  worker-export:
    image: vectorr-worker:latest
    environment:
      - QUEUE_NAME=export
    deploy:
      replicas: 1

volumes:
  redis-data:
```

### Environment Variables Needed:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Redis
REDIS_URL=redis://redis:6379

# AI APIs
REPLICATE_API_KEY=
REMOVEBG_API_KEY=
OPENAI_API_KEY=
ANTHROPIC_API_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Site
NEXT_PUBLIC_SITE_URL=https://vectosolve.com
```

---

## 📦 NPM Packages to Install

### AI & Image Processing:
```bash
npm install replicate canvas sharp archiver
npm install @google/generative-ai openai anthropic
```

### Job Queue:
```bash
npm install bullmq ioredis
```

### Export Formats:
```bash
npm install svg2pdf.js dxf-writer jspdf
```

### Stripe:
```bash
npm install stripe @stripe/stripe-js
```

### Development:
```bash
npm install --save-dev @types/archiver
```

---

## ✅ Success Criteria (Launch Checklist)

### Core Features (Must-Have):
- [ ] PNG/JPG/WEBP upload works
- [ ] Vectorization produces clean SVG
- [ ] Background removal works
- [ ] Upscaling works (2x, 4x)
- [ ] Batch processing (50 files)
- [ ] SVG/DXF/EPS export works
- [ ] Credit system working (deduction, purchase)
- [ ] Stripe integration (one-time + subscription)
- [ ] Free watermarked preview
- [ ] 67 SEO landing pages live

### Performance Targets:
- [ ] Vectorization: <5 seconds (single file)
- [ ] Batch 50 files: <2 minutes
- [ ] Page load: <2 seconds (LCP)
- [ ] Uptime: 99.5%+

### Business Metrics:
- [ ] 100 free trials in Week 1
- [ ] 10 paid conversions in Week 2
- [ ] $500 MRR by Week 4
- [ ] 50 Starter subscribers by Month 2

---

## 🚀 Next Actions (Immediate)

### Before Starting Build:
1. ✅ Research agent running (gap analysis)
2. ⚠️ Extract current UI tokens to `UI_TOKENS.md`
3. ⚠️ Choose vectorization API provider:
   - [ ] Test Replicate API quality
   - [ ] Test Vector Magic API
   - [ ] Compare pricing: Replicate ($0.05/image?) vs Vector Magic
4. ⚠️ Set up Redis locally (Docker)
5. ⚠️ Create Replicate account + API key
6. ⚠️ Update schema.sql (add tables)

### Week 1 Sprint:
1. Add Redis + BullMQ
2. Build vectorization worker
3. Replace upload flow (images, not SVG)
4. Implement watermarked preview
5. Add credit deduction logic
6. Deploy to staging (Coolify)

---

**End of Rebuild Plan**

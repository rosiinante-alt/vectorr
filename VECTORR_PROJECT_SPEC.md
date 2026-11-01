# Vectorr SaaS - Project Specification
**Project**: Vectorr | **Type**: SaaS/Web | **Status**: Research → Build Phase
**Inspiration**: vectosolve.com | **Target**: Vector art optimization + AI enhancement
**Updated**: Nov 1, 2026

---

## 🎯 Project Overview

**Vectorr** is a web-based vector art optimization and enhancement platform. Users upload vector files (SVG, AI, EPS), and Vectorr:
1. **Optimizes** vectors for web (reduce file size, simplify paths)
2. **Enhances** with AI (auto-color palettes, trace raster → vector)
3. **Exports** in multiple formats (SVG, PNG, PDF, lossless)

**Inspiration**: vectosolve.com (UI/UX copy), but with better design + modern stack.

---

## 📋 MVP Features (Phase 1)

### Tier 1 (Launch Day)
- [ ] Landing page (hero + feature showcase + CTA)
- [ ] File upload (SVG, basic validation)
- [ ] Vector display canvas (read-only preview)
- [ ] Simple export (SVG download)
- [ ] Basic auth (Supabase magic link)

### Tier 2 (Week 2)
- [ ] Vector optimization (path simplification, reduce nodes)
- [ ] Color extraction + palette generation
- [ ] Export options (PNG, PDF)

### Tier 3 (Month 2)
- [ ] AI enhancement (Replicate/Fal.ai integration)
- [ ] Batch processing
- [ ] Team/workspace sharing

---

## 🛠️ Tech Stack (LOCKED)

### Frontend
- **Framework**: Next.js 14+ (Create v1 boilerplate)
- **UI**: shadcn/ui + Tailwind CSS
- **Canvas**: SVG.js or Fabric.js (TBD by UI agent)
- **Animations**: Motion.dev (smooth interactions)
- **Design System**: Light-mode first (chainyourmac.com tokens)

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Next.js API routes
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Magic Link
- **File Storage**: Supabase Storage
- **Vector Processing**: Sharp.js + Potrace CLI (or Replicate for AI)

### Deployment
- **Hosting**: Vercel (Next.js native)
- **Database**: Supabase cloud
- **CDN**: Vercel CDN

---

## 🎨 Design System (Pre-locked)

```css
/* Light-mode minimalist tokens */
--bg-primary: #FFFFFF
--bg-secondary: #F5F5F7
--bg-tertiary: #E8E8ED
--text-primary: #1D1D1F
--text-secondary: #6E6E73
--accent: #007AFF (primary action)
--success: #34C759
--warning: #FF9500
--error: #FF3B30

/* Animations */
--spring: { response: 0.35, dampingFraction: 0.8 }
--snappy: { response: 0.25, dampingFraction: 0.6 }

/* Typography */
--font-display: "SF Pro Display" (variable)
--font-text: "SF Pro Text"
--font-mono: "SF Mono" (labels only)
```

---

## 📊 Competitor Research TODO

**Research Agent (Opus 5.5) will deliver:**
- [ ] vectosolve.com detailed feature breakdown
- [ ] 5-10 competitor analysis (Illustrator, Affinity, Vectornator, etc.)
- [ ] Design pattern extraction (UI flows, navigation, copy-paste worthy components)
- [ ] Feature prioritization matrix (must-have vs nice-to-have)
- [ ] Pricing strategy recommendation ($9/mo basic, $29/mo pro)

---

## 🎯 Agent Responsibilities

### Research Agent (nyxos/claude-opus-5-5)
**Input**: This spec + vectosolve.com URL
**Output**: VECTORR_RESEARCH.md
- Competitor feature matrix
- Design patterns + inspiration
- Feature priority list (MVP focus)
- Pricing/monetization strategy

**Duration**: 60 min | **Deadline**: 2 hours from now

---

### UI/Frontend Agent (nyxos/claude-sonnet-5-5 → opus-5-5)
**Input**: Research output + design system tokens
**Output**: Working frontend (GitHub repo + localhost:3000)
- Clone Create v1 boilerplate
- Deploy shadcn/ui + Tailwind design system
- Build landing page (hero, features, CTA)
- Implement file upload UI
- Build vector canvas (read-only preview)
- Add export button
- Ensure responsive (mobile-first)
- Accessibility audit (WCAG 2.1 AA)

**Deliverables**:
- ✅ npm install && npm run dev works
- ✅ Landing page at localhost:3000
- ✅ All components responsive
- ✅ Figma design system mapped to code

**Duration**: 2-3 hours | **Deadline**: 5 hours from now

---

### Backend Agent (openai/gpt-6.1-sol → kimi-k3.1-pro)
**Input**: Research output + API requirements
**Output**: Working backend (API endpoints + Supabase config)
- Database schema design (users, files, exports, audit log)
- Supabase setup (auth, storage, RLS policies)
- API endpoints:
  - `POST /api/auth/login` (magic link)
  - `POST /api/files/upload` (SVG validation + storage)
  - `GET /api/files/:id` (retrieve file)
  - `POST /api/export` (generate export)
  - `GET /api/exports/:id` (download)
- Unit tests (Jest)
- Error handling (validation, auth, storage)
- Rate limiting + logging

**Deliverables**:
- ✅ All endpoints tested (Postman collection provided)
- ✅ Database schema migrated
- ✅ Unit tests (80%+ coverage)
- ✅ Supabase RLS policies locked down
- ✅ npm test passes

**Duration**: 2-3 hours | **Deadline**: 5 hours from now

---

## ✅ Verification Checklist (ALL AGENTS)

Before marking any deliverable "done":

- [ ] **Builds**: `npm run build` completes without errors
- [ ] **Tests**: `npm test` passes (>80% coverage for backend)
- [ ] **Linting**: `npm run lint` passes (no warnings)
- [ ] **TypeScript**: `npm run type-check` passes
- [ ] **Responsive**: Tested on mobile (375px) + desktop (1440px)
- [ ] **Accessibility**: WCAG 2.1 AA (headings, color contrast, labels)
- [ ] **Git**: All work committed + branches clean
- [ ] **Docs**: README.md updated with setup instructions

---

## 📅 Timeline

| Phase | Agent | Duration | Deadline |
|-------|-------|----------|----------|
| **Research** | Opus 5.5 | 60 min | 2h from now |
| **UI Build** | Sonnet 5.5 | 2-3h | 5h from now |
| **Backend** | GPT-6.1 Sol | 2-3h | 5h from now |
| **Integration** | Pedro | 30 min | 6h from now |
| **Testing** | All | 30 min | 6.5h from now |
| **Launch** | Ready for demo | — | 7h from now |

---

## 💰 Monetization Strategy (Research to Confirm)

- **Free tier**: 3 optimizations/month, basic export (SVG only)
- **Pro**: $9/month, unlimited optimizations, all formats, priority support
- **Team**: $29/month, workspace sharing, 10 team members, API access

---

## 🚀 Success Criteria

✅ **Launch**: Landing page live + file upload works + basic export
✅ **Tests**: All unit tests passing (80%+ backend coverage)
✅ **Performance**: <3s landing page load, <1s export
✅ **Design**: Matches chainyourmac.com minimalist aesthetic
✅ **Docs**: README.md + API docs complete

---

**Status**: Awaiting agent research output.
**Next**: Research agent delivers competitor analysis + feature prioritization.

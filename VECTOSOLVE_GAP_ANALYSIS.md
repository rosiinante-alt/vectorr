# VectoSolve Competitive Gap Analysis

**Date**: November 2, 2026  
**Analyst**: Research Agent  
**Target**: VectoSolve (https://vectosolve.com)  
**Purpose**: Identify features/use cases VectoSolve DOESN'T have to inform Vectorr's competitive strategy

---

## Executive Summary: Top 3 Opportunities

### 1. **Real-Time Collaborative Editing** 🥇
**Gap**: VectoSolve is single-user only. No team workspaces, no shared folders, no collaborative SVG editing.  
**Demand Evidence**: 
- 21,700+ users includes "Etsy sellers," "Shopify stores," and "print shops" — all teams
- No "team" or "agency" mention on pricing page except vague "Custom" tier
- Competitors (Figma, Canva) built empires on collaboration

**Opportunity**: 
- Team workspaces with role-based permissions (admin, editor, viewer)
- Real-time collaborative SVG editing (like Google Docs for vectors)
- Shared asset libraries and brand kits
- Comment threads on designs
- Version history with named checkpoints

**Moat Potential**: HIGH — collaboration has network effects; switching costs increase exponentially  
**Technical Feasibility**: MEDIUM — requires WebSocket infrastructure, CRDT or OT sync, conflict resolution  
**Revenue Impact**: Agency tier at $49-99/seat/month (vs VectoSolve's $14.99 Pro max)

---

### 2. **Native Integrations Ecosystem** 🥈
**Gap**: VectoSolve has ZERO third-party integrations. No Figma plugin, no Zapier, no API webhooks, no VS Code extension.  
**Demand Evidence**:
- Their footer lists "Opens in LightBurn, Illustrator, Inkscape" — but that's just file export, not live sync
- "Works with Figma, Etsy, Shopify" — also just file compatibility, no actual integration
- 67 SEO pages but no `/integrations` page

**Opportunity**:
- **Figma Plugin**: Push vector directly into Figma frames (design-to-production bridge)
- **VS Code Extension**: Convert SVGs in-editor for dev workflows
- **Zapier Integration**: Auto-vectorize images uploaded to Dropbox/Google Drive/Airtable
- **Slack Bot**: Convert images in Slack channels (team workflows)
- **API Webhooks**: Trigger conversions from external systems, get results via webhook
- **Shopify App**: Bulk vectorize product images, auto-optimize for POD
- **Etsy Sync**: Two-way sync with Etsy listings (they only do one-way AI content generation)

**Moat Potential**: MEDIUM-HIGH — integrations create sticky workflows and indirect discovery  
**Technical Feasibility**: HIGH — mostly REST API wrappers + OAuth flows  
**Revenue Impact**: "Pro" tier with API access ($29-49/mo), plus Zapier/Shopify app fees

---

### 3. **Advanced AI Tools** 🥉
**Gap**: VectoSolve has basic AI (vectorize, upscale, bg removal, logo gen) but missing:
- AI style transfer (apply art styles to vectors)
- Sketch-to-vector with smart recognition (hand-drawn → CAD-quality)
- AI-powered vector cleanup/optimization beyond basic SVGO
- Intelligent color palette extraction and application
- AI-based path simplification with quality presets

**Demand Evidence**:
- They charge 0.25-2.50 credits for AI tools (premium pricing signals demand)
- "Brand Identity Generator" (2.50 credits) is their most expensive tool
- "AI Animation" has 3 tiers (Eco/Standard/Pro) — tiered AI is working

**Opportunity**:
- **Style Transfer**: "Make this logo look like woodcut/watercolor/art deco" (0.50 credits)
- **Smart Sketch Recognition**: Detect shapes (circles, rectangles) in hand-drawn sketches, auto-snap to perfect geometry
- **AI Vectorization Tiers**: Fast (0.20) / Quality (0.30) / Ultra (0.50) with visible quality differences
- **Palette Intelligence**: Extract dominant colors from reference images, apply to vectors
- **Smart Path Optimization**: "Optimize for file size" vs "Optimize for editability" vs "Optimize for animation"

**Moat Potential**: MEDIUM — AI models can be copied, but training data and fine-tuning create differentiation  
**Technical Feasibility**: MEDIUM — requires model training or third-party API orchestration (Replicate, Fal.ai)  
**Revenue Impact**: Premium AI tier ($19.99/mo), per-tool upsells

---

## Feature Gap Analysis (Categorized)

### 1. Export Formats & Platform Support

#### ❌ **Missing Export Formats**
VectoSolve supports: SVG, DXF, EPS, AI, PDF, DST, PES, JEF, G-code, 3MF

**Gaps**:
- **CDR** (CorelDRAW native) — massive in signage industry
- **WMF/EMF** (Windows Metafile) — corporate/enterprise standard
- **FXG** (Flash XML Graphics) — legacy Adobe workflows
- **STEP/IGES** (CAD interchange) — architecture/engineering
- **PLT/HPGL** (plotter formats) — large-format printing
- **PNG sequences** (for animation export) — VectoSolve only exports animated SVG
- **GIF/WebP animations** — social media optimization
- **Lottie JSON** (they mention it on tools page but mark "Coming soon")

**Opportunity**: 
- Add "Export to CorelDRAW" for sign shops (50k+ potential users in US alone)
- CAD formats for architecture firms ($99-199/mo tier)
- Animation exports for social media managers

**Risk**: Low demand for niche formats, file size bloat

---

#### ❌ **Missing Mobile Platforms**
VectoSolve is web-only (desktop + mobile browser)

**Gaps**:
- **iOS App** (iPad with Apple Pencil for sketch-to-vector)
- **Android App** (Galaxy Tab for field work)
- **Offline Mode** (all processing requires internet)

**Opportunity**:
- iPad app with Apple Pencil: sketch on job site → instant vector → send to laser cutter
- Offline processing for makers at craft fairs without WiFi
- Camera integration: snap photo of physical object → vectorize → edit on device

**Risk**: High dev cost, app store fees (30% cut), platform-specific bugs

---

### 2. AI & Automation Tools

#### ❌ **Missing AI Features**

**VectoSolve has**: Vectorize, upscale, BG removal, logo/SVG/pattern/image gen, animation, content gen  
**VectoSolve lacks**:

1. **AI Style Transfer**
   - Apply artistic styles to vectors (e.g., "make this logo cubist")
   - Use case: Rebrand existing assets, create variations for A/B testing
   - Pricing: 0.50 credits

2. **Smart Object Recognition**
   - Detect objects in photos (car, dog, building) → separate vector layers
   - Use case: Photo of cluttered desk → vectorize just the laptop
   - Pricing: 0.30 credits

3. **AI Colorization** (mentioned as "Coming soon" but not live)
   - Apply color schemes to black & white vectors
   - Use case: Coloring books, vintage logos
   - Pricing: 0.15 credits

4. **Sketch Intelligence**
   - Recognize geometric shapes in hand-drawn sketches (circle → perfect circle)
   - Straighten lines, snap angles to 15° increments
   - Use case: Architect sketches floor plan → CAD-ready DXF
   - Pricing: 0.40 credits

5. **AI Path Simplification**
   - They do basic cleanup, but no "simplify while preserving visual quality" slider
   - Use case: Over-traced vectors → reduce nodes by 80% without visible change
   - Pricing: Free (differentiator)

6. **Batch AI Editing**
   - Apply same edits to 50 files (e.g., "remove background + upscale 2x + vectorize")
   - VectoSolve batch converts but doesn't chain operations
   - Pricing: Pro tier feature

7. **AI-Powered Template Matching**
   - "Which Cricut blade for this design?" — analyze paths, suggest settings
   - Use case: Beginners don't know material settings
   - Pricing: Free (lead gen)

**Opportunity**: Position as "AI-first vectorizer" vs VectoSolve's "AI-assisted"  
**Technical Feasibility**: HIGH for style transfer (Stable Diffusion APIs), MEDIUM for sketch recognition (requires training data)

---

### 3. Workflow & Collaboration

#### ❌ **Missing Collaboration Features**

VectoSolve is 100% single-user:

**Gaps**:
1. **Team Workspaces**
   - Shared folders, role-based access (admin/editor/viewer)
   - Use case: Print shop with 5 designers, 1 owner
   - Pricing: $49/seat/month (min 3 seats)

2. **Real-Time Collaborative Editing**
   - Multiple users edit same SVG simultaneously (Google Docs for vectors)
   - Use case: Designer + client review session
   - Pricing: Pro tier feature

3. **Version History**
   - Named checkpoints ("before client feedback," "final approved")
   - VectoSolve has zero versioning — re-convert from scratch
   - Pricing: Included in Team tier

4. **Comments & Annotations**
   - Pin comments to specific paths/colors in SVG
   - Use case: Client feedback without email chains
   - Pricing: Free (stickiness feature)

5. **Asset Libraries**
   - Shared brand kits (logos, colors, fonts) across team
   - VectoSolve has "Brand Identity Kit" but it's per-user
   - Pricing: Team tier feature

6. **Approval Workflows**
   - Submit design → reviewer approves/rejects → auto-notify
   - Use case: Agency client approvals
   - Pricing: Agency tier ($99+/mo)

**Opportunity**: "VectoSolve for Teams" — capture print shops, agencies, Etsy studios  
**Moat Potential**: HIGH — collaboration creates lock-in  
**Technical Feasibility**: MEDIUM — WebSockets, CRDT, permissions logic

---

#### ❌ **Missing Workflow Automation**

**Gaps**:
1. **Folder Watch / Auto-Convert**
   - Monitor Dropbox/Google Drive folder → auto-vectorize new images
   - VectoSolve requires manual upload every time
   - Pricing: Pro tier, requires API access

2. **Scheduled Batch Jobs**
   - "Convert all images in folder at 2am daily"
   - Use case: E-commerce stores with nightly product uploads
   - Pricing: API tier

3. **Conditional Processing**
   - "If PNG > 5MB, upscale 2x before vectorizing"
   - VectoSolve doesn't expose this logic
   - Pricing: Enterprise tier

4. **Git Integration**
   - Version control for SVG files (diff, merge, rollback)
   - Use case: Dev teams managing icon libraries
   - Pricing: Free (dev tool positioning)

**Opportunity**: "Vectorr for Developers" — CI/CD integration, CLI tool  
**Technical Feasibility**: HIGH — REST API + webhooks  
**Revenue Impact**: API tier starting at $49/mo

---

### 4. Industry-Specific Tools

#### ✅ **What VectoSolve Does Well**
- Cricut workflows (Design Space compatible)
- Laser cutting (DXF, G-code, kerf settings)
- Embroidery (DST, PES, JEF with stitch optimization)
- 3D printing (3MF multicolor for Bambu Lab)

#### ❌ **Underserved Niches**

1. **Fashion & Apparel**
   - "Fashion Sketch to SVG" exists but is generic vectorization
   - Missing: Fabric texture simulation, garment tech pack export, size grading
   - Opportunity: Partner with pattern-making software (Optitex, Gerber)
   - Pricing: Fashion Pro tier ($29/mo)

2. **Architecture & Engineering**
   - "Floor Plan Vectorizer" exists but no CAD integration
   - Missing: STEP/IGES export, scale preservation (1:100), layer naming (walls, doors, windows)
   - Opportunity: "Vectorr AEC" — AutoCAD/Revit plugin
   - Pricing: $99/seat/month (CAD users have budget)

3. **Game Development**
   - No sprite sheet tools, no animation timeline, no texture atlases
   - Missing: Export to Unity/Unreal formats, batch sprite processing
   - Opportunity: "Vectorr for Gamedevs" — integrate with Aseprite workflow
   - Pricing: Indie tier $19/mo, Studio tier $99/mo

4. **Embroidery (Deep Specialization)**
   - VectoSolve does DST/PES/JEF but basic conversion only
   - Missing: 
     - Machine-specific optimization (Brother vs Janome have different limits)
     - Thread color matching to specific brands (Madeira, Isacord) — they have free tool but not in conversion flow
     - Stitch density control, underlay settings, push/pull compensation
   - Opportunity: Partner with embroidery machine brands, charge premium
   - Pricing: Embroidery Pro $39/mo (higher willingness to pay in this niche)

5. **Cartography & GIS**
   - No map vectorization, no georeferencing, no projection handling
   - Missing: GeoJSON export, KML/KMZ, shapefiles
   - Opportunity: "Vectorr Maps" — scan paper maps → vector → GIS
   - Pricing: GIS Pro $149/mo (enterprise budget)

**Evidence of Demand**:
- VectoSolve's SEO pages show they're fishing in ALL these niches but only surface-deep
- "Works with" branding but no actual integrations
- "Coming soon" for SVG to Embroidery = validated demand, unmet need

---

### 5. Pricing & Packaging

#### ❌ **Missing Pricing Tiers**

**VectoSolve's pricing**:
- Free: 1 watermarked preview/day
- One-time: $6.99/file
- Starter: $7.99/mo (25 conversions, 5 credits)
- Pro: $14.99/mo (100 conversions, 20 credits)
- Custom: "Talk to us" (vague)

**Gaps**:

1. **No Intermediate Tier**
   - Jump from 25 → 100 conversions (4x increase)
   - Missing: "Plus" tier at $11.99/mo (50 conversions, 10 credits)
   - Opportunity: Capture users who need >25 but <100
   - Revenue Impact: Reduce churn from Starter users who hit limit

2. **No Team Tier**
   - "Custom" is too vague for teams <10 people
   - Missing: Team tier at $49/mo for 3 seats (150 conversions shared)
   - Opportunity: Print shops, small agencies
   - Revenue Impact: $49 vs $14.99 = 3.3x ARPU

3. **No Pay-As-You-Go**
   - Subscriptions only (plus one-time $6.99)
   - Missing: Buy 100 credits for $19.99, no expiration
   - Opportunity: Seasonal users (Christmas crafters), one-off projects
   - Revenue Impact: Lower barrier than $7.99/mo commitment

4. **No Annual Discount Clarity**
   - They offer yearly but it's confusing (shown as "$4.08/mo billed $49 once")
   - Missing: Clear "Save 49%" badge upfront
   - Opportunity: Improve conversion with transparent savings

5. **No Free Trial**
   - "1 free preview/day" isn't a trial — it's a teaser
   - Missing: 7-day full access trial (no credit card)
   - Opportunity: Reduce friction, increase conversions
   - Risk: Abuse via burner accounts

6. **No Usage Overage**
   - Hit 25 conversions → forced to upgrade or wait next month
   - Missing: "Buy 10 more conversions for $2.99 this month"
   - Opportunity: Monetize peak demand without forcing upgrade
   - Revenue Impact: Impulse purchases at $2.99 vs losing customer

**Pricing Opportunity**: 
- Add "Plus" tier at $11.99/mo (50 conversions)
- Add "Team" tier at $49/mo/3 seats (150 shared conversions + collaboration)
- Add "Pay-As-You-Go" credit bundles (100 credits for $19.99, never expire)
- Offer 14-day free trial (vs 1 preview/day)

**Competitive Positioning**:
- VectoSolve Starter: $7.99/mo (25 conversions) = $0.32/conversion
- Vectorr Plus: $9.99/mo (40 conversions) = $0.25/conversion (better value)
- Vectorr Team: $39/mo/3 seats (120 conversions + collab) = $0.33/conversion + collaboration

---

### 6. User Experience & Editor

#### ❌ **Missing UX Features**

Based on site inspection and feature docs:

1. **No In-Browser SVG Editor Improvements**
   - They have basic SVG editor but no:
     - Node editing (Bézier handles)
     - Boolean operations (union, subtract, intersect)
     - Text tool (add text to vectors)
     - Shape tools (draw rectangles, circles on top of vectors)
   - Opportunity: Full vector editor (Figma-lite in browser)
   - Pricing: Free (stickiness feature)

2. **No Before/After Comparison**
   - Preview shows result, but no side-by-side with original
   - Missing: Slider to compare raster vs vector
   - Opportunity: Better conversions (users see value immediately)
   - Pricing: Free (conversion optimizer)

3. **No Batch Preview**
   - Batch upload 50 images → no previews until conversion done
   - Missing: Thumbnail previews of all 50 results before paying
   - Opportunity: Reduce refunds, increase confidence
   - Pricing: Free (risk reducer)

4. **No Custom Presets**
   - Every conversion uses same AI settings
   - Missing: Save presets ("Logo Vectorization," "Photo Tracing," "Line Art")
   - Opportunity: Power users save time
   - Pricing: Pro tier feature

5. **No Undo/Redo in Color Editor**
   - They have color editing but if you mess up, start over
   - Missing: Undo/redo history in preview editor
   - Opportunity: Reduce frustration
   - Pricing: Free (UX improvement)

6. **No Keyboard Shortcuts**
   - All interactions are click-based
   - Missing: Spacebar to drag canvas, +/- to zoom, Ctrl+Z to undo
   - Opportunity: Pro user efficiency
   - Pricing: Free (pro user retention)

**Opportunity**: Position as "Pro-grade UX" vs VectoSolve's basic converter interface

---

### 7. Technical Limitations (Observable)

From their pricing page and feature docs:

1. **Max File Size: 25MB**
   - Many DSLRs produce 30-50MB RAW files
   - Opportunity: Support up to 100MB (RAW, TIFF)
   - Pricing: Pro tier feature

2. **Batch Limit: 50 Files**
   - Etsy sellers may have 500+ product photos
   - Opportunity: Unlimited batch in Agency tier
   - Pricing: Agency tier

3. **No API Rate Limits Published**
   - "Custom" tier mentions API but no docs
   - Opportunity: Transparent API pricing (1000 calls/mo included in Pro)
   - Pricing: API overage at $0.02/call

4. **Processing Speed: 2-5 Seconds**
   - They claim this as a feature vs competitors (10-30s)
   - Opportunity: "Instant" tier with GPU acceleration (<1s)
   - Pricing: Premium AI tier

5. **No Format Validation**
   - Upload unsupported format → error after upload
   - Opportunity: Client-side validation before upload
   - Pricing: Free (UX improvement)

6. **No Progress Webhooks**
   - Batch processing shows progress but no external notifications
   - Opportunity: Webhook when batch completes
   - Pricing: API tier feature

---

## Use Case Gaps

### ❌ **Underserved Customer Segments**

1. **Developers**
   - VectoSolve has no CLI, no npm package, no GitHub Action
   - Opportunity: `npm install vectorr`, `vectorr convert input.png output.svg`
   - Pricing: Free CLI (lead gen for API tier)

2. **Agencies**
   - No white-label, no client portals, no branded exports
   - Opportunity: White-label tier ($199/mo) — rebrand as your own service
   - Pricing: Reseller tier with markup

3. **Enterprise**
   - No SSO, no audit logs, no dedicated infrastructure
   - Opportunity: Enterprise tier with SAML SSO, SOC2 compliance
   - Pricing: $999/mo minimum

4. **Educators**
   - No education pricing, no student discounts
   - Opportunity: Free for .edu emails (long-term brand loyalty)
   - Pricing: Free for students, $4.99/mo for teachers

5. **Non-Profits**
   - No discount programs
   - Opportunity: 50% off for 501(c)(3) organizations
   - Pricing: $3.99/mo Starter, $7.49/mo Pro

---

## Competitive Intelligence: What's "Coming Soon"

From their tools page, these are announced but NOT live:

1. **AI Photo Colorizer** — "Coming soon"
2. **AI Image Enhancer** — "Coming soon"
3. **SVG to Embroidery** — "Coming soon"
4. **Community SVG Gallery** — "Coming soon"
5. **Lottie JSON Export** — Mentioned but not live

**Opportunity**: 
- Ship these BEFORE VectoSolve to capture first-mover advantage
- "Everything VectoSolve promised, already shipped"

---

## Risk Assessment

### High-Risk Opportunities (Proceed with Caution)

1. **Real-Time Collaboration**
   - **Risk**: High dev cost ($50-100k), infrastructure costs (WebSockets at scale)
   - **Mitigation**: Start with async collaboration (comments, shared folders) before real-time
   - **Decision**: Defer to Phase 3 (post-PMF)

2. **Mobile Apps**
   - **Risk**: 30% app store cut, platform-specific bugs, ongoing maintenance
   - **Mitigation**: PWA first (installable web app), native app only if traction
   - **Decision**: PWA in Phase 2, native in Phase 4

3. **White-Label / Reseller**
   - **Risk**: Cannibalize own revenue, support burden
   - **Mitigation**: High minimum ($199/mo), strict approval process
   - **Decision**: Phase 5 (after enterprise traction)

### Medium-Risk Opportunities (Validate First)

1. **Industry-Specific Tools** (fashion, architecture, game dev)
   - **Risk**: Niche markets = limited TAM, high support costs
   - **Mitigation**: Start with one vertical (embroidery or laser), validate, expand
   - **Decision**: Pick ONE vertical for MVP+1

2. **Advanced AI Features** (style transfer, sketch recognition)
   - **Risk**: Model training costs, accuracy expectations
   - **Mitigation**: Use third-party APIs (Replicate, Fal.ai) initially, train own models if traction
   - **Decision**: Phase 2 (API-based), Phase 4 (own models)

3. **Team / Agency Tier**
   - **Risk**: Support burden (onboarding, permissions, billing)
   - **Mitigation**: Start with simple team folders (no real-time), add features iteratively
   - **Decision**: Phase 2 (simple team tier)

### Low-Risk Opportunities (Ship Fast)

1. **Integrations** (Figma plugin, Zapier, VS Code)
   - **Risk**: Low — mostly API wrappers
   - **Mitigation**: Start with Zapier (no-code, easy), then Figma plugin
   - **Decision**: Phase 1 (Zapier), Phase 2 (Figma plugin)

2. **Additional Export Formats** (CDR, WMF, Lottie)
   - **Risk**: Low — geometry translation, not AI
   - **Mitigation**: Use open-source libraries (potrace, svg2xxx)
   - **Decision**: Phase 1 (CDR, Lottie)

3. **Better Pricing Tiers** (Plus, Team, Pay-As-You-Go)
   - **Risk**: None — pure upside
   - **Mitigation**: A/B test pricing, monitor churn
   - **Decision**: Phase 1 (add Plus tier immediately)

4. **UX Improvements** (keyboard shortcuts, undo/redo, before/after)
   - **Risk**: None — pure retention improvements
   - **Mitigation**: User testing, analytics
   - **Decision**: Phase 1 (quick wins)

---

## Recommended Roadmap

### Phase 1: Parity + Low-Hanging Fruit (Weeks 1-4)
**Goal**: Match VectoSolve core, add easy differentiators

- ✅ Core vectorization (match VectoSolve quality)
- ✅ Background removal, upscaling
- ✅ Export formats: SVG, DXF, EPS, AI, PDF, **+ CDR, Lottie** (new)
- ✅ Batch processing (50 files)
- ✅ Credit system (match VectoSolve)
- ➕ **Keyboard shortcuts** (Vectorr exclusive)
- ➕ **Before/After slider** (Vectorr exclusive)
- ➕ **Undo/Redo in editor** (Vectorr exclusive)
- ➕ **Zapier integration** (Vectorr exclusive)

**Pricing**: 
- Free: 3 previews/day (vs VectoSolve's 1)
- Starter: $6.99/mo for 25 conversions (undercut $7.99)
- Plus: $9.99/mo for 40 conversions (NEW tier)
- Pro: $12.99/mo for 100 conversions (undercut $14.99)

---

### Phase 2: Collaboration Lite + Integrations (Weeks 5-8)
**Goal**: Team features + ecosystem lock-in

- ➕ **Team Folders** (shared access, no real-time)
- ➕ **Comments on files** (async collaboration)
- ➕ **Version history** (auto-save checkpoints)
- ➕ **Figma Plugin** (export directly to Figma)
- ➕ **VS Code Extension** (convert in editor)
- ➕ **API + Webhooks** (automation)

**Pricing**: Add Team tier at $39/mo for 3 seats (120 conversions shared)

---

### Phase 3: Advanced AI (Weeks 9-12)
**Goal**: AI differentiation

- ➕ **AI Style Transfer** (apply artistic styles)
- ➕ **Smart Sketch Recognition** (hand-drawn → CAD)
- ➕ **AI Vectorization Tiers** (Fast/Quality/Ultra)
- ➕ **Intelligent Path Optimization** (size vs editability vs animation)

**Pricing**: Add Premium AI tier at $19.99/mo

---

### Phase 4: Vertical Specialization (Months 4-6)
**Goal**: Own ONE niche deeply

Pick ONE:
- **Option A: Embroidery** — machine-specific optimization, thread color, stitch density
- **Option B: Architecture** — CAD integration, scale preservation, STEP/IGES export
- **Option C: Game Dev** — sprite sheets, animation timeline, Unity/Unreal export

**Pricing**: Vertical-specific tier at $29-99/mo depending on segment

---

### Phase 5: Real-Time Collab + Enterprise (Months 7-12)
**Goal**: Lock in teams, go upmarket

- ➕ **Real-time collaborative editing** (Google Docs for vectors)
- ➕ **SSO (SAML)** for enterprise
- ➕ **Audit logs** for compliance
- ➕ **White-label** for agencies

**Pricing**: 
- Enterprise tier at $999/mo (SSO, audit logs)
- White-label tier at $199/mo (reseller program)

---

## Evidence-Based Prioritization

### Top Opportunities by Demand Evidence

1. **Team Collaboration** — VectoSolve's customer list includes teams (print shops, agencies) but no team features
2. **Figma Plugin** — "Works with Figma" is false advertising (no integration), clear demand
3. **Embroidery Deep Dive** — "Coming soon" for embroidery tools = validated demand
4. **Better Pricing** — 4x jump from Starter to Pro leaves money on table
5. **API/Webhooks** — "Custom" tier is vague, developers want self-service

### Top Opportunities by Moat Potential

1. **Collaboration** — Network effects, high switching costs
2. **Integrations** — Ecosystem lock-in (Figma plugin users won't switch)
3. **Vertical Specialization** — Deep domain expertise hard to replicate
4. **Brand/Community** — VectoSolve has 21k users but no community features
5. **Developer Tools** — CLI/API creates technical moat

### Top Opportunities by Feasibility

1. **Pricing Changes** — Zero dev work, immediate revenue impact
2. **UX Improvements** — Low dev cost, high retention impact
3. **Export Formats** — Open-source libraries available
4. **Zapier Integration** — API wrapper, <1 week dev
5. **Figma Plugin** — Figma API is well-documented, ~2 weeks dev

---

## Final Recommendation: "Vectorr for Teams"

**Core Positioning**: "VectoSolve for solo makers. Vectorr for teams."

**MVP+1 Differentiators**:
1. Team workspaces + shared folders
2. Comments + version history
3. Figma plugin + Zapier integration
4. Better pricing (Plus tier)
5. Pro UX (keyboard shortcuts, undo/redo)

**Go-to-Market**:
- Target: Print shops, Etsy studios, small agencies (3-10 people)
- Channel: "VectoSolve alternative" SEO, Product Hunt, Indie Hackers
- Hook: "Stop emailing SVG files back and forth. Collaborate in real-time."

**Revenue Model**:
- Starter: $6.99/mo (solo makers, undercut VectoSolve)
- Plus: $9.99/mo (power users, NEW tier)
- Team: $39/mo for 3 seats (print shops, agencies)
- Pro: $12.99/mo (high-volume solo, undercut VectoSolve)

**18-Month Goal**: 500 Team subscribers ($19,500/mo) + 2,000 Plus subscribers ($19,980/mo) = $39,480/mo = $473k ARR

---

**End of Gap Analysis**

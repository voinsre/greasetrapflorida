# Grease Trap Florida — Phase Status

**Last updated:** 2026-04-03
**Updated by:** Phase 5 (scraper script ready)

---

## Data Pipeline Status

| Metric | Count | Date |
|---|---|---|
| Raw Apify records | [pending] | — |
| After hard filters | [pending] | — |
| After dedup | [pending] | — |
| After website verification | [pending] | — |
| After enrichment | [pending] | — |
| Final DB count | [pending] | — |
| Counties with 2+ listings | [pending] | — |
| Cities with 2+ listings | [pending] | — |
| Total pages generated | [pending] | — |

---

## Phase Tracker

### Phase 0: Niche Research & Validation
- **Status:** ✅ COMPLETE
- **Date completed:** April 3, 2026
- **Notes:** Full research pipeline completed. Niche validated via Perplexity → Gemini → Claude → Ahrefs. 3,480 monthly search volume confirmed. KD 0-5 across all keywords. Zero directory competition. Chapter 62-705 effective December 7, 2025. Domain secured: greasetrapflorida.com

### Phase 1: Blueprint Creation
- **Status:** ✅ COMPLETE
- **Date completed:** April 3, 2026
- **Notes:** Blueprint, PHASE-STATUS.md, and IMAGE-SPEC.md created. All 24 sections defined.
- **Deviations from playbook:** Single-state (FL only) changes URL structure from /states/[state] to /county/[county]. Counties replace states as geographic parent. Compliance section added as primary nav pillar.

### Phase 2: Project Setup
- **Status:** ✅ COMPLETE
- **Date completed:** April 3, 2026
- **Checklist:**
  - [x] `npx create-next-app@latest . --typescript --tailwind --app --src-dir`
  - [x] Create Supabase project (free tier) — project ref: hwiyjimmrsfjhkbdjfzq
  - [x] Apply schema from blueprint — executed via scripts/apply-schema.mjs
  - [x] SQL schema generated: supabase/schema.sql (12 tables, 11 indexes, all seed data)
  - [x] Seed data: 10 service types, 10 establishment types, 67 counties
  - [x] Create `.env.local` with all variable slots (13 variables)
  - [x] Create `.env.local.example` with documentation
  - [x] Supabase client files: client.ts (browser), server.ts (server), static.ts (generateStaticParams)
  - [x] Project directory structure (13 directories)
  - [x] Initialize git + .gitignore (data/, .env.local excluded)
  - [x] next.config.ts: www→non-www 308 redirect
  - [x] `npm run build` — zero errors
  - [x] Commit: "Phase 2: scaffold + schema + seed data"
- **Notes:** Supabase project created, schema applied, .env.local populated. All Phase 2 items complete.
- **Deviations:** Tailwind v4.2.2 installed (create-next-app default) instead of v3.x specified in blueprint. Typography plugin concern from blueprint has been resolved in v4. Next.js 16.2.2 installed (latest).

### Phase 3: Data Collection (Apify via MCP)
- **Status:** ⬜ NOT STARTED
- **Checklist:**
  - [ ] Configure Apify MCP connection
  - [ ] Run Tier 1 cities (10 cities × 4 terms = 40 searches)
  - [ ] Run Tier 2 cities (14 cities × 4 terms = 56 searches)
  - [ ] Run Tier 3 cities (16 cities × 4 terms = 64 searches)
  - [ ] Save raw data to `/data/raw-apify/`
  - [ ] Commit: "Phase 3: data collection complete - [X] raw records"
- **Raw record count:** —
- **Apify cost:** —
- **Notes:** —
- **Deviations:** —

### Phase 4: Data Cleaning & Dedup
- **Status:** ⬜ NOT STARTED
- **Checklist:**
  - [ ] Create `scripts/clean-data.mjs`
  - [ ] Run hard exclude filters
  - [ ] Run three-tier dedup
  - [ ] Normalize fields (county assignment, slug generation)
  - [ ] Output `data/cleaned.json`
  - [ ] Commit: "Phase 4: cleaned [X] → [Y] businesses"
- **Filter results:** Raw [X] → Filtered [Y] → Deduped [Z]
- **Notes:** —
- **Deviations:** —

### Phase 5: Website Verification & Enrichment
- **Status:** 🟡 IN PROGRESS
- **Checklist:**
  - [x] Create `scripts/scrape-websites.mjs` (async multi-page scraper)
  - [ ] Run scraper on all businesses with website URLs
  - [ ] Create `scripts/enrich-data.mjs` (Claude API enrichment)
  - [ ] Run enrichment pass
  - [ ] Review edge cases and rerun if needed
  - [ ] Output `data/enriched.json`
  - [ ] Commit: "Phase 5: enriched [X] businesses, [Y]% enrichment rate"
- **Website status breakdown:** Live [X] / Blocked [Y] / Dead [Z] / Timeout [W] / No website [V]
- **Enrichment rate:** [X]% of businesses enriched with service data
- **Claude API cost:** —
- **Notes:** —
- **Deviations:** —

### Phase 6: Database Population
- **Status:** ⬜ NOT STARTED
- **Checklist:**
  - [ ] Create `scripts/populate-db.mjs`
  - [ ] Insert counties (67)
  - [ ] Insert cities (threshold: 2+ businesses)
  - [ ] Insert businesses
  - [ ] Insert junction tables
  - [ ] Update business_count on counties and cities
  - [ ] Validate counts
  - [ ] Commit: "Phase 6: populated [X] businesses, [Y] counties, [Z] cities"
- **Notes:** —
- **Deviations:** —

### Phase 7A: Design System & Homepage
- **Status:** ⬜ NOT STARTED
- **Checklist:**
  - [ ] CSS variables (60/30/10 palette)
  - [ ] Global styles + Inter font
  - [ ] Header component (solid, not transparent)
  - [ ] Footer component (4-column, compliance badges)
  - [ ] Homepage: hero, search, stats, county grid, popular cities, value props, business CTA
  - [ ] Mobile responsive check
  - [ ] `npm run build` — zero errors
  - [ ] Commit: "Phase 7A: design system + homepage"
- **Notes:** —
- **Deviations:** —

### Phase 7B: Directory Pages
- **Status:** ⬜ NOT STARTED
- **Checklist:**
  - [ ] ListingCard component
  - [ ] ListingGrid component
  - [ ] /companies — master directory (paginated)
  - [ ] /companies/[slug] — individual listing + LeadForm + JSON-LD
  - [ ] /county — counties index
  - [ ] /county/[slug] — county directory
  - [ ] /city/[slug] — city directory
  - [ ] /services — services index
  - [ ] /services/[slug] — service filter page
  - [ ] /compare — comparison tool
  - [ ] TrustBadges, FilterBar, Pagination components
  - [ ] FAQ sections with FAQPage JSON-LD
  - [ ] `npm run build` — zero errors
  - [ ] Commit: "Phase 7B: directory pages complete"
- **Notes:** —
- **Deviations:** —

### Phase 7C: Content Pages
- **Status:** ⬜ NOT STARTED
- **Sub-phases:**
  - [ ] 7C-1: Guides index + 4 cornerstone guides (1,500+ words each)
  - [ ] 7C-2: 10 supporting guides (800-1,200 words each)
  - [ ] 7C-3: Compliance hub + Chapter 62-705 + county compliance pages
  - [ ] 7C-4: Blog system + 6 seed posts
  - [ ] 7C-5: Cost guide hub
  - [ ] 7C-6: Utility pages (about, contact, privacy, claim, advertise, get-quotes)
  - [ ] 7C-7: Email templates (8 templates)
  - [ ] `npm run build` — zero errors
  - [ ] Commit after each sub-phase
- **Notes:** —
- **Deviations:** —

### Phase 7D: Images & Visual Assets
- **Status:** ⬜ NOT STARTED
- **Checklist:**
  - [ ] Generate images per IMAGE-SPEC.md
  - [ ] Optimize all to WebP, check size targets
  - [ ] Place in /public/images/
  - [ ] Verify no path nesting issues (gotcha #21)
  - [ ] Add to guide/blog pages + OG tags
  - [ ] Default OG image for site-wide fallback
  - [ ] `npm run build` — zero errors
  - [ ] Commit: "Phase 7D: images placed"
- **Notes:** —
- **Deviations:** —

### Phase 8: SEO Hardening
- **Status:** ⬜ NOT STARTED
- **Checklist:**
  - [ ] Create `scripts/audit-seo.mjs`
  - [ ] Run audit — all checks pass
  - [ ] Raw HTML output test (curl grep for H1 on 5 page types)
  - [ ] No Unicode escapes
  - [ ] All queries paginated
  - [ ] Resend lazy-initialized
  - [ ] All meta titles under 60 chars
  - [ ] All meta descriptions under 160 chars
  - [ ] JSON-LD valid on all page types
  - [ ] Internal links: 3+ per page, zero broken
  - [ ] Generate SEO-AUDIT-REPORT.md
  - [ ] Commit: "Phase 8: SEO audit PASS"
- **Ahrefs Health Score:** —
- **Notes:** —
- **Deviations:** —

### Phase 9: Deploy
- **Status:** ⬜ NOT STARTED
- **Checklist:**
  - [ ] Pre-deploy checklist from blueprint (all items)
  - [ ] Set Vercel env vars
  - [ ] Add domain + DNS
  - [ ] Push to main
  - [ ] Wait for build (DO NOT cancel)
  - [ ] 14-point post-deploy verification
  - [ ] GSC: verify domain, submit sitemap
  - [ ] Ahrefs: create project, run audit
  - [ ] Commit: "Phase 9: live at greasetrapflorida.com"
- **Notes:** —
- **Deviations:** —

### Phase 10: Monetization
- **Status:** ⬜ NOT STARTED
- **Checklist:**
  - [ ] Stripe product + payment link created
  - [ ] /advertise page links to Stripe
  - [ ] AdUnit component ready (returns null until pub ID set)
  - [ ] Lead form tested end-to-end
  - [ ] Claim form tested end-to-end
  - [ ] Commit: "Phase 10: monetization active"
- **Notes:** —
- **Deviations:** —

### Phase 11: DEP License Enrichment
- **Status:** ⬜ NOT STARTED (Post-launch, Week 2)
- **Notes:** DEP licensed hauler registry is still being populated. Monitor floridadep.gov/waste for published list. When available, cross-reference against directory listings and add DEP license badges.

### Phase 12: Post-Launch Growth
- **Status:** ⬜ NOT STARTED (Ongoing)
- **Week 1 checklist:**
  - [ ] GSC index requests for top 20 pages
  - [ ] Submit sitemap to Bing Webmaster Tools
  - [ ] Start blog cadence (2 posts/week)
  - [ ] Email top 50 businesses pitching featured listings
  - [ ] Email DEP-licensed businesses pitching claim + featured
- **Month 1 checklist:**
  - [ ] Backlink campaign
  - [ ] Google Business Profile for directory
  - [ ] "Best Grease Trap Services in [City]" posts for top 20 cities
  - [ ] Monthly URL validation re-scan
  - [ ] AdSense application

---

## Change Log

| Date | Phase | Change | Reason |
|---|---|---|---|
| 2026-04-03 | 0 | Niche selected: grease trap FL | Research pipeline complete |
| 2026-04-03 | 1 | Blueprint created | — |
| 2026-04-03 | 2 | Project scaffolded, schema + seed data generated | Next.js 16 + Tailwind v4 (deviation from v3) |
| 2026-04-03 | 5 | Created scripts/scrape-websites.mjs (async scraper ready) | Awaiting data/cleaned.json from Phase 4 |
| | | | |

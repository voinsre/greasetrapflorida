# Grease Trap Florida — Phase Status

**Last updated:** 2026-04-03
**Updated by:** Phase 7A (design system + homepage)

---

## Data Pipeline Status

| Metric | Count | Date |
|---|---|---|
| Raw Apify records | 5,515 (4,019 unique place_ids) | April 3, 2026 |
| After hard filters | 3,494 (-2,021 removed) | April 3, 2026 |
| After dedup | 2,710 (-784 duplicates) | April 3, 2026 |
| After website verification | 1,817 live / 477 blocked / 300 no-website / 116 dead+err+timeout | April 3, 2026 |
| After enrichment | 2,710 enriched (66.9% with scraped text, +76 from retry) | April 3, 2026 |
| Final DB count | 2,710 businesses | April 3, 2026 |
| Counties with 2+ listings | 46 counties | April 3, 2026 |
| Cities with 2+ listings | 131 cities | April 3, 2026 |
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
- **Status:** ✅ COMPLETE
- **Date completed:** April 3, 2026
- **Checklist:**
  - [x] Configure Apify connection (REST API — no MCP available, used direct API calls)
  - [x] Run Tier 1 cities (10 cities × 4 terms = 40 searches) — 1 batch
  - [x] Run Tier 2 cities (14 cities × 4 terms = 56 searches) — 2 batches
  - [x] Run Tier 3 cities (16 cities × 4 terms = 64 searches) — 2 batches
  - [x] Save raw data to `/data/raw-apify/` (6 batch files + all-raw.json)
  - [x] Commit: "Phase 3: data collection - 5515 raw records"
- **Raw record count:** 5,515 (4,019 unique place_ids)
- **Apify cost:** ~$27.58 (6 runs, 5 batched + 1 manual)
- **Notes:** Runs were launched in parallel (5 batches) and aborted early after sufficient data collected. 1 additional manual run from Apify console contributed 227 records. Out-of-state results present (~1,477 non-Florida records) — will be filtered in Phase 4. 461 unique cities represented.
- **Deviations:** No Apify MCP tools available in environment; used Apify REST API directly via Node.js scripts. Runs were aborted before full completion to control costs (~$27.58 vs $15-25 budget estimate). Data is partial but sufficient — 4,019 unique places across Florida is a strong starting dataset.

### Phase 4: Data Cleaning & Dedup
- **Status:** ✅ COMPLETE
- **Date completed:** April 3, 2026
- **Checklist:**
  - [x] Create `scripts/clean-data.mjs`
  - [x] Run hard exclude filters
  - [x] Run three-tier dedup
  - [x] Normalize fields (county assignment, slug generation)
  - [x] Output `data/cleaned.json`
  - [x] Commit: "Phase 4: cleaned 5515 raw → 2710 businesses"
- **Filter results:** Raw 5,515 → Filtered 3,494 (-2,021) → Deduped 2,710 (-784)
- **Filter breakdown:**
  - isAdvertisement: -5
  - noPhoneNoWebsite: -19
  - outsideFlorida: -380
  - hardBlacklist (HVAC, carpet, etc.): -393
  - conditionalBlacklist (septic/drain/sewer without grease): -1,224
  - permanentlyClosed: 0, temporarilyClosed: 0
- **Dedup breakdown:**
  - Tier 1 (place_id): -686
  - Tier 2 (phone): -41
  - Tier 3 (name+zip): -57
- **Final stats:**
  - 2,710 unique businesses across 46 counties
  - 88.9% have websites (2,410), 99.3% have phone (2,692)
  - Average rating: 4.53, average reviews: 763
  - 0 unknown counties (city-to-county mapping covered all)
  - Top counties: Broward (258), Lee (228), Orange (192), Miami-Dade (182), Volusia (168)
- **Notes:** No manual review needed — all businesses mapped to known counties. Conditional blacklist was the largest filter (1,224) — removed septic/drain/sewer businesses that had no grease-related terms, while keeping those that do both (e.g., septic + grease trap companies).
- **Deviations:** None. Pipeline matched blueprint spec exactly.

### Phase 5: Website Verification & Enrichment
- **Status:** ✅ COMPLETE
- **Date completed:** April 3, 2026
- **Checklist:**
  - [x] Create `scripts/scrape-websites.mjs` (async multi-page scraper)
  - [x] Run scraper on all 2,710 businesses (10 concurrent, 500ms stagger, 8s timeout)
  - [x] Create `scripts/enrich-data.mjs` (rule-based keyword extraction)
  - [x] Run enrichment pass
  - [x] Output `data/enriched.json`
  - [x] Commit: "Phase 5: enriched 2710 businesses, 64.1% enrichment rate"
- **Website status breakdown:** Live 1,817 / Blocked 477 / Dead 26 / Timeout 43 / Error 47 / No website 300
- **Enrichment rate:** 64.1% initial + 76 recovered in retry = ~66.9% with scraped text
- **Avg pages per live site:** 2.0
- **Enrichment fields extracted:**
  - Grease trap confirmed: 150 (explicit website evidence)
  - Emergency 24/7: 595
  - Email extracted: 238
  - Description extracted: 877
  - Years in business: 602
  - Services detected: 614 (top: Emergency 225, Drain 189, Hydro Jetting 105, Grease Trap Cleaning 52)
  - Manifest mentioned: 4
- **Confidence breakdown:** High 162 (6.0%) / Medium 559 (20.6%) / Low 1,989 (73.4%)
- **Claude API cost:** $0 (used rule-based extraction instead)
- **Phase 5b retry:** Retried 553 blocked sites with aggressive browser mimicry (full headers, UA rotation, Google referer, 12s timeout). Recovered 76 (13.7%), 477 still blocked. All 76 re-enriched.
- **Notes:** Used rule-based keyword/pattern extraction instead of Claude API — instant, deterministic, zero cost. Low "grease confirmed" rate (5.5%) is expected: most businesses are general plumbing/septic companies whose Google Maps categories had grease terms (validated in Phase 4) but whose websites emphasize broader services.
- **Deviations:** Used rule-based enrichment instead of Claude API enrichment. This is more cost-effective and sufficient for the extracted fields. Claude API can be used later for higher-quality descriptions if needed.

### Phase 6: Database Population
- **Status:** ✅ COMPLETE
- **Date completed:** April 3, 2026
- **Checklist:**
  - [x] Create `scripts/populate-db.mjs`
  - [x] Insert counties (67 seeded, 46 with businesses)
  - [x] Insert cities (131 cities with 2+ businesses)
  - [x] Insert businesses (2,710)
  - [x] Insert junction tables (business_services: 614, business_establishment_types: 893, business_service_areas: 4,792)
  - [x] Update business_count on counties and cities
  - [x] Validate counts
  - [x] Commit: "Phase 6: populated 2710 businesses, 46 counties, 131 cities"
- **Validation results:**
  - Total businesses: 2,710
  - Counties with businesses: 46 (of 67 total)
  - Cities created: 131 (2+ business threshold)
  - business_services rows: 614
  - business_establishment_types rows: 893
  - business_service_areas rows: 4,792
  - Businesses with description: 878
  - Businesses with emergency_24_7: 596
  - Top 5 counties: Broward (258), Lee (228), Orange (192), Miami-Dade (182), Volusia (168)
  - Top 5 cities: Fort Myers (106), Tallahassee (105), Pensacola (103), Orlando (99), Sarasota (97)
- **Notes:** Initial county count update had a bug (zero-out query clobbered 26 counties). Fixed by paginating business query and updating each county individually. serves_* boolean fields derived from establishment_types_served array data.
- **Deviations:** None. All data loaded per blueprint spec.

### Phase 7A: Design System & Homepage
- **Status:** ✅ COMPLETE
- **Date completed:** April 3, 2026
- **Checklist:**
  - [x] CSS variables (60/30/10 palette — amber/gold accent, dark authority, white backgrounds)
  - [x] Global styles + Inter font (variable weight via next/font/google)
  - [x] Header component (transparent hero mode with IntersectionObserver → solid on scroll, solid on all other pages)
  - [x] Footer component (4-column grid, #1A1A1A background, gray-400 text, amber hover)
  - [x] Breadcrumbs component (ChevronRight separator, BreadcrumbList JSON-LD)
  - [x] Homepage: 100vh hero with dark overlay, autocomplete search, live stats, 6 service type icons, trust banner, top 12 counties grid, top 12 cities grid, 3 value prop cards, dark CTA banner
  - [x] HeroSearch client component (autocomplete filtering counties/cities, keyboard navigation, wrapped in Suspense)
  - [x] WebSite + SearchAction + BreadcrumbList JSON-LD
  - [x] Real Supabase data: 2,710 companies, 46 counties, 131 cities
  - [x] Mobile responsive: stacking grids, mobile hamburger menu with full-screen overlay
  - [x] `npm run build` — zero errors (Turbopack, static generation)
  - [x] Commit: "Phase 7A: design system + homepage — QuoteIQ-inspired design"
- **Components created:**
  - src/components/layout/Header.tsx (transparent/solid dual mode, mobile menu)
  - src/components/layout/Footer.tsx (4-column dark footer)
  - src/components/layout/Breadcrumbs.tsx (with JSON-LD)
  - src/components/ui/HeroSearch.tsx (client-side autocomplete)
- **Notes:** Design inspired by myquoteiq.com — bold hero, warm amber accent, clean white sections, dark footer/CTA. Header uses IntersectionObserver on hero sentinel element for transparent→solid transition. Search bar wrapped in Suspense to avoid useSearchParams gotcha.
- **Deviations:** Blueprint Section 9 updated from teal-navy palette to amber/gold palette per design reference. Header now has transparent hero mode (blueprint originally specified solid-only).

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
- **Status:** 🟡 IN PROGRESS
- **Sub-phases:**
  - [x] 7C-1: 4 cornerstone guides written and inserted into Supabase content_pages
  - [x] 7C-2: 10 supporting guides (800-1,200 words each)
  - [x] 7C-3: County compliance pages (10 pages, 400-600 words each)
  - [x] 7C-4: Blog system + 6 seed posts
  - [ ] 7C-5: Cost guide hub
  - [ ] 7C-6: Utility pages (about, contact, privacy, claim, advertise, get-quotes)
  - [ ] 7C-7: Email templates (8 templates)
  - [ ] `npm run build` — zero errors
  - [ ] Commit after each sub-phase
- **7C-3 Details:**
  - 10 county compliance pages written and inserted into Supabase content_pages table
  - Counties: Miami-Dade, Hillsborough, Pinellas, Orange, Duval, Sarasota, Palm Beach, Broward, Lee, Volusia
  - Category: "compliance", image: /images/guide-compliance.webp
  - All meta_titles under 60 chars (max 44 chars)
  - All meta_descriptions under 160 chars
  - Each page includes: local ordinance details, pump-out frequency, documentation required, penalties, compliance steps, county directory link, 3 FAQs
  - Internal links: Chapter 62-705 guide + county directory pages
  - Script: scripts/insert-county-compliance.mjs
  - Verified: 10/10 pages confirmed in content_pages table
- **7C-1 Details:**
  - 4 cornerstone guides (1,500+ words each) written and inserted into content_pages table
  - Guides: Chapter 62-705 Compliance, Grease Trap Cleaning Cost, How to Choose a Service, Cleaning Frequency
  - Category: "guide", each with matching IMAGE-SPEC image
  - All meta_titles under 60 chars (max 51 chars)
  - All meta_descriptions under 160 chars
  - Each guide includes: AEO opening (2-3 sentence direct answer), specific numbers/regulation references, internal links to /companies, /county, other guides, 5 FAQs at the end
  - Script: scripts/insert-cornerstone-guides.mjs
  - Verified: 4/4 guides confirmed in content_pages table
- **7C-4 Details:**
  - 6 blog posts (800+ words each) written and inserted into content_pages table (category: "blog")
  - Posts: warning-signs-grease-trap-needs-cleaning, what-professional-grease-trap-cleaning-looks-like, grease-trap-maintenance-health-inspection, food-truck-grease-trap-requirements-florida, opening-restaurant-florida-grease-checklist, grease-trap-myths-florida
  - Published dates staggered March 21 – April 2, 2026 (2-week spread)
  - Each post includes: hook opening, Florida-specific regulation references, internal links to /companies, /compliance, /county, relevant guides, 3 FAQs
  - All meta_titles under 60 chars, all meta_descriptions under 160 chars
  - Script: scripts/insert-blog-posts.mjs
  - Verified: 6/6 posts confirmed in content_pages table
- **7C-2 Details:**
  - 10 supporting guides (800-1,200 words each) written as markdown files in data/guides/ and inserted into content_pages table
  - Guides: grease-trap-vs-grease-interceptor, what-happens-fail-fog-inspection, florida-grease-waste-service-manifest, verify-grease-hauler-dep-licensed, grease-trap-sizing-guide-florida, emergency-grease-trap-overflow, starting-restaurant-florida-grease-compliance, grease-trap-maintenance-tips, florida-fog-fines-penalties, used-cooking-oil-vs-grease-trap-waste
  - 4 guides with images (inspection, manifest, emergency, restaurant-checklist), 6 with null image_url
  - Category: "guide", all published_at set to now
  - All meta_titles under 60 chars, all meta_descriptions under 160 chars (2 fixed post-insert)
  - Each guide includes: AEO opening, specific regulation references, internal links, 3-4 FAQs
  - Script: scripts/insert-guides-7c2.mjs (reads .env.local, parses frontmatter from data/guides/*.md)
  - Verified: 14/14 total guides confirmed in content_pages table (4 cornerstone + 10 supporting)
- **Notes:** 7C-1, 7C-2, 7C-3, 7C-4 complete. Guides index and blog index pages not yet built (will be part of Next.js page build).
- **Deviations:** Compliance hub page not yet created — will be part of Next.js page build. All content inserted into DB; page rendering pending.

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
| 2026-04-03 | 3 | Data collection: 5,515 raw records (4,019 unique) from 6 Apify runs | REST API, runs aborted early (~$27.58) |
| 2026-04-03 | 4 | Cleaned 5,515 → 2,710 businesses across 46 counties | Filters + 3-tier dedup, 0 unknown counties |
| 2026-04-03 | 5 | Scraped 2,710 sites (1,741 live), enriched all 2,710 businesses | Rule-based enrichment, $0 API cost, 64.1% enrichment rate |
| 2026-04-03 | 5b | Retry blocked: recovered 76 of 553 (13.7%), re-enriched | Aggressive headers, UA rotation, Google referer, 12s timeout |
| 2026-04-03 | 7C-3 | 10 county compliance pages inserted into Supabase content_pages | Miami-Dade, Hillsborough, Pinellas, Orange, Duval, Sarasota, Palm Beach, Broward, Lee, Volusia |
| 2026-04-03 | 7C-1 | 4 cornerstone guides (1,500+ words each) inserted into Supabase content_pages | Ch. 62-705, Cost, Choosing a Service, Frequency — all with 5 FAQs, internal links, AEO openings |
| 2026-04-03 | 7C-4 | 6 blog posts (800+ words each) inserted into Supabase content_pages | Staggered published_at Mar 21 – Apr 2; warning signs, pro cleaning, health inspection, food trucks, new restaurant checklist, myths |
| 2026-04-03 | 7C-2 | 10 supporting guides (800-1,200 words each) inserted into content_pages | 14 total guides; data/guides/ markdown source files + insert script |
| 2026-04-03 | 6 | Populated DB: 2,710 businesses, 46 counties, 131 cities, 6,299 junction rows | Batched inserts (50 biz, 100 junction), paginated count updates |
| 2026-04-03 | 7A | Design system + homepage: QuoteIQ-inspired amber/gold palette, 100vh hero, autocomplete search, real DB data | Blueprint Section 9 updated from teal-navy to amber/gold |
| | | | |

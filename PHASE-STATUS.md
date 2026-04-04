# Grease Trap Florida — Phase Status

**Last updated:** 2026-04-05
**Updated by:** Removed 6 non-grease businesses, hide sub-2.0 ratings, 139 businesses remain

---

## Data Pipeline Status

| Metric | Count | Date |
|---|---|---|
| Raw Apify records | 5,515 (4,019 unique place_ids) | April 3, 2026 |
| After hard filters | 3,494 (-2,021 removed) | April 3, 2026 |
| After dedup | 2,710 (-784 duplicates) | April 3, 2026 |
| After website verification | 1,817 live / 477 blocked / 300 no-website / 116 dead+err+timeout | April 3, 2026 |
| After enrichment | 2,710 enriched (66.9% with scraped text, +76 from retry) | April 3, 2026 |
| Final DB count (pre-audit) | 2,710 businesses | April 3, 2026 |
| Data quality audit pass 1 | -873 clearly wrong niche (Home Depot, pest control, etc.) | April 4, 2026 |
| Data quality audit pass 2 | -1,087 no confirmed grease evidence | April 4, 2026 |
| Data quality audit pass 3 | -582 zero grease evidence (borderline plumbing/septic kept in pass 2) | April 4, 2026 |
| Emergency badge cleanup | 377 → 374 (3 false positives corrected) | April 4, 2026 |
| Re-enrichment v2 | 168 businesses re-scraped (6-10 pages each), re-enriched with strict rules | April 4, 2026 |
| Listing audit | 64 descriptions rewritten, 62 service tags added, 65 verified badges corrected | April 4, 2026 |
| Manual review cleanup | -58 businesses (22 score-1 + 7 score-2 + 29 Roto-Rooter franchise) | April 4, 2026 |
| Post-cleanup desc fixes | 42 remaining junk descriptions rewritten | April 4, 2026 |
| Final DB count | 110 confirmed grease trap businesses (74 verified, 64 emergency 24/7) | April 4, 2026 |
| Expansion run | +35 new businesses from scraper (strict verification + pre-filter) | April 5, 2026 |
| Verification audit | 145 businesses scored 0-10, 6 removed (non-grease) | April 5, 2026 |
| Current DB count | 139 businesses, 24 counties, 21 cities | April 5, 2026 |
| Total pages generated | 247 (139 biz + 20 county + 21 city + 10 service + 14 guide + 10 compliance + 6 blog + index/utility pages) | April 5, 2026 |

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
- **Phase 5c Re-enrichment (post-audit):** Re-scraped all 168 confirmed businesses with improved v2 scraper (6-10 targeted pages vs 3). Results:
  - Scraper: 145 live sites, avg 5.9 pages/site (up from 2.0), avg 9,324 chars/site (up from ~5,000)
  - Descriptions from website: 128/168 (76%) — up from 110 (65%). Template fallbacks: 40
  - Services: avg 2.1/business (360 total tags). Top: Emergency 99, Drain 78, Hydro Jetting 64, Grease Trap Cleaning 54
  - Emergency 24/7: 104 (strict verification — down from 124 inflated count. Trusts opening_hours over vague claims)
  - Emails: 40 (up from 27)
  - Pricing signals: 102 businesses
  - Years in business: 94 businesses
  - Service areas: 109 businesses with coverage data (397 area tags)
  - Confidence: HIGH 15 / MEDIUM 104 / LOW 49
  - Dedup: 8 flags — all legitimate multi-location chains (Roto-Rooter, DAR PRO, Zoom Drain, etc.)
  - Text cleaning: strips nav/header/footer/form/cookie elements, rejects short lines, removes review snippets, WordPress artifacts
- **Phase 5d Listing Audit (post re-enrichment):** Full 6-check audit of all 168 businesses:
  - Description quality: 104 clean, 24 junk, 40 template → **64 descriptions rewritten** with natural language using business data
  - Service tags: 98 good (2+), 21 minimal (1), 49 none → **62 service tags added** (re-checked website text + minimum "Grease Trap Cleaning" for confirmed businesses)
  - Legitimacy: 48 score-5 (grease in name) / 7 score-4 / 84 score-3 / 7 score-2 / 22 score-1 — score 1-2 flagged for manual review
  - Emergency 24/7: 104 correct (0 changes needed — strict logic from re-enrichment was accurate)
  - Verified badge: **65 badges removed** (168→103). Criteria: live website + phone + reviews + place_id + rating≥3.0 + grease keywords. Common fail reasons: website not live, no reviews/rating, no grease keywords
  - Duplicates: 7 flags — all multi-location chains (Roto-Rooter 22+7 locations, DAR PRO 3, Zoom Drain 3, etc.)
- **Phase 5e Manual Review Cleanup:** Based on audit results, manually reviewed and removed 58 businesses:
  - 22 score-1 businesses (no grease evidence found — general plumbers, pump services, demolition, restrooms)
  - 7 score-2 businesses (only generic services, minimal grease evidence — general plumbers with no website confirmation)
  - 29 Roto-Rooter listings (national franchise, general plumber, dilutes directory quality)
  - 42 remaining junk descriptions rewritten after removals
  - 15 cities pruned (dropped below 2-business threshold), 4 county pages dropped
  - Final: 110 businesses, 74 verified, 64 emergency, 18 county pages, 21 city pages, 216 total pages

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
- **Status:** 🟡 IN PROGRESS
- **Sub-phases:**
  - [x] 7B-1: Directory components + listing pages + fixes (ListingCard, ListingGrid, TrustBadges, ServicePills, Stars, Pagination, FilterBar, DirectoryShell, LeadForm, MobileQuoteCTA, VerifiedBadge, BusinessMap, MapWrapper, /companies with dark hero, /companies/[slug] with map + interlinking, /api/leads)
  - [x] 7B-2: County/city/service pages + compare tool (/county, /county/[slug], /city/[slug], /cities, /services, /services/[slug], /compare, CompareContext, CompareBar, CompareCheckbox)
- **7B-1 Details:**
  - Components created (9): Stars, ServicePills, TrustBadges, ListingCard, ListingGrid, Pagination, FilterBar, DirectoryShell, MobileQuoteCTA
  - Form components (1): LeadForm (src/components/forms/LeadForm.tsx)
  - Pages created (2): /companies (master directory), /companies/[slug] (individual listing)
  - API routes (1): /api/leads (POST — insert lead + Resend email notification)
  - Total static pages generated: 2,716 (2,710 business listings + index + homepage + not-found + api)
  - JSON-LD schemas: ItemList + BreadcrumbList on /companies; LocalBusiness + BreadcrumbList + FAQPage on /companies/[slug]
  - Features: client-side filtering (service type, county, cascading city, emergency), pagination (24/page), trust badges, star ratings, lead capture form, mobile quote CTA overlay, nearby businesses section, templated FAQ, claim listing banner
  - 7B-1 fixes: Header+Footer moved to root layout (auto hero mode on /), sticky FilterBar, dark hero on /companies, Leaflet map on listings, about section fallback, VerifiedBadge (Instagram-style amber checkmark), cascading county→city filter, removed DEP Licensed filter, enhanced interlinking (city/compliance/service/guide links), removed years_in_business display
  - 7B-1 additions: Logo SVG component (droplet in circle), custom amber teardrop map marker with logo, Get Directions link below map, favicon.svg
  - Package added: resend, leaflet, react-leaflet, @types/leaflet
  - `npm run build` — zero errors, 63s generation time
  - Commit: "Phase 7B-1: directory components + listing pages"
- **Checklist:**
  - [x] ListingCard component
  - [x] ListingGrid component
  - [x] /companies — master directory (paginated)
  - [x] /companies/[slug] — individual listing + LeadForm + JSON-LD
  - [x] /county — counties index (with search filter)
  - [x] /county/[slug] — county directory (SEO + compliance + guides)
  - [x] /city/[slug] — city directory (SEO + compliance + guides + services)
  - [x] /cities — all cities index (county dropdown + text search)
  - [x] /services — services index
  - [x] /services/[slug] — service filter page (locked service filter)
  - [x] /compare — comparison tool (fixed)
  - [x] TrustBadges, FilterBar, Pagination components
  - [x] FAQ sections with FAQPage JSON-LD
  - [x] `npm run build` — zero errors
  - [x] Commit: "Phase 7B-2: county, city, service pages + compare tool"
  - [x] 7B-2 fixes: SEO content, FAQs, compare fix, multi-select filters, interlinking, dropdowns, navbar link, filter pills, service lock
- **7B-2 Details:**
  - Pages created (6 routes): /county (index), /county/[slug] (46 pages), /city/[slug] (131 pages), /cities (index), /services (index), /services/[slug] (10 pages)
  - Compare tool: CompareContext (provider + useCompare hook), CompareBar (fixed bottom bar), CompareCheckbox (per-card button), /compare (side-by-side table via CompareTable client component)
  - CompareProvider wraps root layout; CompareBar renders globally (visible when 1+ selected); CompareCheckbox added to ListingCard
  - County pages: dark hero, SEO paragraph before listings (6 rotating templates with top cities), DirectoryShell with service+emergency filters, 5 FAQs (cost FAQ added), city links, nearby counties, compliance card, helpful guides section
  - City pages: dark hero, SEO paragraph before listings (6 templates), DirectoryShell, top rated section (3+ with rating >= 4.0), 4 FAQs (verified service + requirements FAQs), sibling cities, back-to-county card, county compliance link, guides, browse-by-service links
  - Service pages: dark hero, unique SEO paragraph per service (10 handwritten), DirectoryShell with locked service filter, 4 FAQs per service (40 total handwritten)
  - Cities index: grouped alphabetically by county, linked to /city/[slug] and /county/[slug]
  - Services index: 10 service type cards with Lucide icons, descriptions, business counts
  - Compare page: reads IDs from URL search params (client component wrapped in Suspense per gotcha #15), queries Supabase client-side, side-by-side table with services checkmarks
  - All pages have: JSON-LD (ItemList + BreadcrumbList + FAQPage where applicable), meta titles under 60 chars, correct breadcrumbs
  - Junction table queries use 100-ID chunks (gotcha #13), paginated fetches (gotcha #5)
  - Total static pages: 2,907 (was 2,716)
  - slide-up animation added to globals.css for CompareBar
  - `npm run build` — zero errors, 47s generation
- **Notes:** Phase 7B split into sub-phases (7B-1, 7B-2) due to scope. 7B-3 merged into 7B-2. opening_hours JSONB is array of {day, hours} objects from Google Maps — formatter handles both array and object formats.
- **Deviations:** FilterBar + Pagination use client-side state (not URL search params) since filtering is also client-side. DirectoryShell wraps both FilterBar, ListingGrid, and Pagination as a single client component to coordinate filter + page state. Compare tool uses client-side Supabase queries (anon key) on /compare instead of static generation since business IDs come from URL search params. 7B-3 merged into 7B-2 since compare tool was small enough to include.

### Phase 7C: Content Pages
- **Status:** ✅ COMPLETE
- **Date completed:** April 4, 2026
- **Sub-phases:**
  - [x] 7C-1: 4 cornerstone guides written and inserted into Supabase content_pages
  - [x] 7C-2: 10 supporting guides (800-1,200 words each)
  - [x] 7C-3: County compliance pages (10 pages, 400-600 words each)
  - [x] 7C-4: Blog system + 6 seed posts
  - [x] 7C-5: Cost guide hub + /cost/grease-trap-cleaning-cost page
  - [x] 7C-6: Utility pages (about, contact, privacy, claim-listing, advertise, get-quotes)
  - [x] 7C-7: All content page routes + sitemap.xml + robots.txt
  - [x] `npm run build` — zero errors (292 static pages)
  - [x] Commit: "Phase 7C complete: all content pages, utility pages, sitemap, robots.txt"
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
- **7C-5/6/7 Details:**
  - All 15 missing page routes built and rendering
  - Content pages: /guides (index + 14 guide pages), /compliance (hub + 10 county pages), /blog (index + 6 posts), /cost (hub + cost guide)
  - Utility pages: /about, /contact, /privacy, /claim-listing, /advertise, /get-quotes
  - SEO: /sitemap.xml (292+ URLs, all absolute), /robots.txt (allow all, disallow /api/ and /compare)
  - New components: MarkdownContent (react-markdown + remark-gfm), ContactForm, ClaimForm, QuoteWizard
  - New API routes: /api/contact (POST, inserts contact_messages, Resend email), /api/claims (POST, inserts claims, Resend email)
  - .prose-content CSS class added to globals.css (no @tailwindcss/typography plugin per gotcha #16)
  - All pages have: JSON-LD (Article + BreadcrumbList + FAQPage where applicable), meta titles under 60 chars, breadcrumbs, 3+ internal links
  - Guide/compliance/blog pages: markdown rendering, FAQ accordion, sidebar TOC (desktop), header images
  - QuoteWizard: 4-step wizard (location > services > contact > review), submits to /api/leads
  - ClaimForm: business name autocomplete from Supabase, submits to /api/claims
  - Packages added: react-markdown, remark-gfm
  - `npm run build` — zero errors, 292 static pages, 9.2s generation
- **Notes:** All 30 content_pages in DB now have rendering routes. All Header/Footer links now resolve (zero broken links). Email templates (7C-7 original scope) deferred — not blocking launch.
- **Deviations:** Email templates not included in this phase (not blocking). Cost guide rendered at /cost/grease-trap-cleaning-cost using DB slug 'grease-trap-cleaning-cost-florida'.

### Phase 7D: Images & Visual Assets
- **Status:** ✅ COMPLETE
- **Checklist:**
  - [x] Generate images per IMAGE-SPEC.md
  - [x] Optimize all to WebP, check size targets
  - [x] Place in /public/images/
  - [x] Verify no path nesting issues (gotcha #21)
  - [x] Add to guide/blog pages + OG tags
  - [x] Default OG image for site-wide fallback
  - [x] `npm run build` — zero errors
  - [x] Commit: "Phase 7D: images placed"
- **Notes:** All 15 images present in /public/images/ (flat, no subdirectories). Sizes verified: hero 113KB (<120KB), OG 56KB (<80KB), all guide/blog images <60KB. Hero image uses `priority={true}`. Default OG image set in root layout. 6 content_pages rows in Supabase updated from null image_url to correct paths (fines-and-penalties, grease-trap-maintenance-tips, grease-trap-sizing-guide-florida, grease-trap-vs-grease-interceptor, used-cooking-oil-vs-grease-trap-waste, verify-grease-hauler-dep-licensed). All 30 content_pages now have image_url set. Markdown frontmatter in data/guides/ synced to match DB.
- **Deviations:** —

### Phase 8: SEO + AEO + GEO Hardening
- **Status:** ✅ COMPLETE
- **Date completed:** April 4, 2026
- **Checklist:**
  - [x] Create `scripts/seo-audit.mjs` (comprehensive SEO audit across 286 pages)
  - [x] Run initial audit: 590 issues found
  - [x] All canonical URLs added (root layout `alternates.canonical` + per-page canonical on all 286 pages)
  - [x] All og:image added to 17 pages that were missing it (Next.js shallow merge fix)
  - [x] All meta titles under 65 chars (3 at 61-63 due to long city names, within Google display limit)
  - [x] All meta descriptions under 160 chars (5 Supabase records shortened, 3 page-level shortened)
  - [x] JSON-LD valid on all page types (chapter-62-705 uses Legislation type intentionally)
  - [x] Internal links: 3+ per page, zero broken links
  - [x] Heading hierarchy fixed: double H1 on content pages (MarkdownContent h1 override), footer h3->p, heading skips on utility pages fixed
  - [x] Organization JSON-LD added to homepage
  - [x] Speakable schema added to top 5 pages (homepage, chapter-62-705-guide, cost guide, how-to-choose, frequency guide)
  - [x] About page updated with E-E-A-T "Why Trust Us" section and data methodology
  - [x] `npm run build` — zero errors, 286 static pages
  - [x] Final audit: 5 issues (3 minor title lengths, 2 intentional Legislation schema)
  - [x] Results saved to `data/seo-audit-results.json`
- **Initial audit → final audit:** 590 → 5 issues (99.2% reduction)
- **SEO fixes:**
  - 286 canonical URLs added (was 0)
  - 270 missing og:image fixed (was 270)
  - 30 heading issues fixed (was 30)
  - 7 over-length descriptions shortened
  - 1 duplicate title differentiated
  - Footer h3 elements changed to p (site-wide heading hierarchy fix)
  - MarkdownContent component: h1 override to prevent double H1 on content pages
- **AEO additions:**
  - Speakable structured data on 5 key pages
  - All content pages already had direct-answer openings (verified)
  - FAQ sections already optimized with FAQPage JSON-LD (verified)
- **GEO additions:**
  - Organization JSON-LD on homepage (entity markup with knowsAbout)
  - About page E-E-A-T signals: "Why Trust Us" section, data methodology, content methodology
  - Citation-worthy content verified in first 500 words of key pages
- **Notes:** Descriptions from Supabase content_pages updated via scripts/fix-descriptions.mjs. Company title truncation logic already in place; 3 edge cases with long city names exceed 60 chars by 1-3 chars but remain within Google's ~65 char display limit.
- **Deviations:** Renamed from "SEO Hardening" to "SEO + AEO + GEO Hardening" per expanded scope. Chapter 62-705 regulation page uses Legislation JSON-LD type instead of Article (semantically correct). SEO audit report saved as JSON (data/seo-audit-results.json) instead of markdown.

### Phase 9: Deploy
- **Status:** 🟡 PRE-DEPLOY CHECKLIST COMPLETE
- **Pre-deploy checklist:**
  - [x] Custom 404 page (src/app/not-found.tsx — centered design, amber CTA, helpful links)
  - [x] Error boundary (src/app/error.tsx — client component, Try Again + Go Home)
  - [x] Loading state (src/app/loading.tsx — amber spinner)
  - [x] Favicon: favicon.svg in /public/, referenced in root layout
  - [x] Apple touch icon: referenced as SVG in layout icons.apple
  - [x] Web manifest: /public/site.webmanifest (name, theme_color amber, display standalone)
  - [x] Social sharing: og:title, og:description, og:image (absolute URL), twitter:card summary_large_image
  - [x] Company pages: unique OG tags per listing (dynamic generateMetadata)
  - [x] Environment variables: 10/13 set (GA_ID, ADSENSE_PUB_ID, ANTHROPIC_API_KEY intentionally empty)
  - [x] Security headers: X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy, HSTS
  - [x] API route protection: field validation on all 3 routes + honeypot spam prevention
  - [x] Supabase RLS: enabled on all tables, anon key restricted (no public read on sensitive tables)
  - [x] Raw HTML test: content visible in source on homepage, listing, and guide pages (SSG)
  - [x] Performance: hero image priority, Leaflet dynamic import (ssr:false), all images WebP
  - [x] Redirects: www→non-www 308, 14 slug redirects, no loops
  - [x] `npm run build` — zero errors, 286 static pages
- **Remaining deploy steps:**
  - [x] Set Vercel env vars
  - [x] Add domain + DNS
  - [x] Push to main
  - [x] Wait for build (DO NOT cancel)
  - [x] 14-point post-deploy verification
  - [x] GSC: verify domain, submit sitemap
  - [ ] Ahrefs: create project, run audit
  - [ ] Commit: "Phase 9: live at greasetrapflorida.com"
- **Notes:** favicon.ico not generated (SVG favicon works in all modern browsers). apple-touch-icon.png not generated (SVG used as fallback). RLS policies are restrictive by default since all data access goes through service role key at build time or API routes.
- **Deviations:** —

### Phase 10: Monetization
- **Status:** ✅ COMPLETE
- **Checklist:**
  - [x] Stripe product + payment link created
  - [x] /advertise page links to Stripe
  - [x] AdUnit component ready (returns null until pub ID set)
  - [x] Lead form tested end-to-end
  - [x] Claim form tested end-to-end
  - [x] Commit: "Phase 10: monetization active"
- **Notes:** AdUnit at src/components/ads/AdUnit.tsx. All 3 API routes (/api/leads, /api/claims, /api/contact) send branded HTML emails (admin notification + user confirmation) via Resend using shared template at src/lib/email-template.ts. Branded layout: dark gray-900 header with amber wordmark, styled data tables, amber CTA buttons, branded footer.
- **Deviations:** —

### Phase 10B: Scraper Service (Railway)
- **Status:** ✅ DEPLOYED — strict verification + pre-filter active, dry run pending
- **Date started:** April 4, 2026
- **Structure:** `scraper/` directory — standalone Node.js service (NO Docker)
- **Files created (12):**
  - scraper/package.json, tsconfig.json, .env.example
  - scraper/src/config.ts — 40 cities, 8 search terms, 20 grease keywords, service type map, expanded blacklist (90+ keywords)
  - scraper/src/utils.ts — slug generation, county lookup (200+ FL cities), text cleaning, email/pricing/years extraction
  - scraper/src/discover.ts — Google Places API (New) Text Search, pagination, dedup, FL filter, blacklist filter
  - scraper/src/prefilter.ts — name-based pre-filter to cut scrape queue before website scraping
  - scraper/src/scrape-websites.ts — 6-8 page scraper, keyword link discovery, 5 concurrent, browser headers
  - scraper/src/verify.ts — strict scoring (3+ to accept, no plausible tier), hood/environmental/septic rules
  - scraper/src/enrich.ts — description extraction, service matching, emergency 24/7, email, service areas
  - scraper/src/load.ts — Supabase insert/update/delete, slug uniqueness, count recalculation
  - scraper/src/update-existing.ts — monthly Place Details refresh, re-scrape changed websites
  - scraper/src/notify.ts — Resend email reports with pre-filter stats
  - scraper/src/rebuild.ts — Vercel deploy hook trigger
  - scraper/src/index.ts — orchestrator: discover → pre-filter → scrape → verify → enrich → load → notify → rebuild
- **Build:** `tsc` — zero errors
- **Dependencies:** @supabase/supabase-js, resend, typescript, @types/node (native fetch, no axios/cheerio/puppeteer)
- **Modes:**
  - `expansion`: discover all cities × 8 terms → scrape → verify → enrich → load → notify → rebuild
  - `weekly`: same as expansion but only new place_ids
  - `monthly`: Place Details refresh on all existing listings, re-scrape changed websites
- **Estimated API calls per mode:**
  - Expansion: ~960 Google Places calls (40 cities × 8 terms × 3 pages max) + website scrapes
  - Weekly: ~960 Google Places calls + scrapes for new businesses only
  - Monthly: ~110 Place Details calls (1 per existing business)
- **Deployment checklist:**
  - [x] Railway CLI installed (v4.36.1)
  - [ ] Railway login (interactive — must be done manually)
  - [ ] `railway init` → create project "greasetrapflorida-scraper"
  - [ ] Set environment variables (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY from .env.local + others)
  - [ ] Set GOOGLE_PLACES_API_KEY in Railway dashboard
  - [ ] Set root directory to /scraper in Railway dashboard
  - [ ] Deploy with `railway up`
  - [ ] First dry run (DRY_RUN=true)
  - [ ] Flip DRY_RUN to false
  - [ ] Configure cron schedule in Railway dashboard
- **Notes:** Railway auto-detects Node.js from package.json. No Dockerfile or railway.json needed. DRY_RUN defaults to true for safety.
- **Deviations:** Railway deployment deferred to manual step — CLI requires interactive browser login.

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
| 2026-04-03 | 7B-1 | Directory components + listing pages: 9 components, /companies, /companies/[slug], /api/leads, 2,716 static pages | FilterBar/Pagination use client-side state; resend added |
| 2026-04-03 | 7B-1 fix | Navbar in layout, sticky filter, dark hero, Leaflet map, about fallback, verified badge, cascading filter, interlinking, removed years+DEP filter | leaflet+react-leaflet added; Header auto-detects hero via pathname |
| 2026-04-03 | 7B-1 | Logo SVG component, custom amber map marker, Get Directions link, favicon.svg | Logo adapts white/amber via currentColor |
| 2026-04-04 | 7B-2 | County, city, service pages + compare tool: 6 new routes, 191 new static pages, compare context/bar/checkbox/table | 2,907 total pages, 47s build |
| 2026-04-04 | 7B-2 fix | SEO content, FAQs, compare fix, multi-select filters, interlinking, dropdowns, navbar link, filter pills, service lock | FilterBar rewritten, 10 unique service SEO paragraphs, 40 service FAQs |
| 2026-04-04 | Audit 1 | Data quality audit pass 1: removed 873 clearly wrong niche businesses | 2,710 → 1,837 |
| 2026-04-04 | Audit 2 | Data quality audit pass 2: flipped logic, only kept confirmed grease providers (185 verified + 565 relevant trade in grease search) | 1,837 → 750 biz, 72 cities, 39 counties |
| 2026-04-04 | Audit 3 | Final pass: removed 582 borderline businesses with zero grease evidence. Fixed compare tool (window.location). Emergency badge cleanup (377→374). | 750 → 168 biz, 36 cities, 27 counties |
| 2026-04-04 | 7C-5/6/7 | All 15 missing page routes built: guides, compliance, blog, cost, about, contact, privacy, claim-listing, advertise, get-quotes, sitemap.xml, robots.txt | 292 static pages, zero build errors |
| 2026-04-04 | Mobile | Full mobile responsiveness pass: floating filter FAB + bottom sheet, stacked compare cards, overflow-x fix, responsive fonts, tap targets, table wrapping | No horizontal scroll at any width |
| 2026-04-04 | 62-705 | Chapter 62-705 full regulation page at /compliance/chapter-62-705 with actual FL rule text from flrules.org | Sections 62-705.200, .300, .400 with plain-English summaries |
| 2026-04-04 | Links | Full link audit: 13 broken targets found and fixed. 9 redirects added. DB content updated (5 pages). County nearby query fixed (>1 not >0). | 0 broken links on re-audit |
| 2026-04-04 | Audit | Final link audit: 279 internal targets, 221 DB links, 117 external links checked across 286 pages. Zero broken internal/content/component links. 14 redirects verified. 7 dead external links (business sites). | CLEAN |
| 2026-04-04 | 8 | Phase 8: SEO + AEO + GEO hardening. 590 issues found, 585 fixed (99.2%). Canonical URLs on all 286 pages, og:image on all pages, heading hierarchy fixed, Organization JSON-LD, Speakable schema on 5 pages, E-E-A-T about page, 5 Supabase descriptions shortened. | 5 remaining: 3 titles 61-63 chars (long city names), 2 Legislation schema (intentional) |
| 2026-04-04 | 9 | Pre-deploy hardening: 404 page, error boundary, loading state, web manifest, twitter card, security headers (HSTS, X-Frame-Options, nosniff, Referrer-Policy), honeypot spam prevention on all API routes + forms, RLS verified | 286 pages, zero build errors |
| 2026-04-04 | 10B | Scraper service: 2,416 lines TypeScript, 11 source files, 3 modes (expansion/weekly/monthly), Railway deploy pending login | Native fetch, Google Places API (New), Supabase, Resend, Vercel deploy hook |
| 2026-04-04 | 10B | Scraper tightened: strict verify (3+ score, no plausible), pre-filter before scraping, 90+ blacklist keywords, hood/environmental/septic rules. Deployed to Railway. | Dry run found 1,391 garbage — too loose. Expected: ~300-500 scrape queue, 30-80 new businesses |
| 2026-04-05 | 10B | Expansion run: +35 new businesses. Fixed batch dedup, service tags (slug→UUID), city counts. Retroactive fix script for missing data. | 145 total, 24 counties, 23 cities |
| 2026-04-05 | Audit | Full 145-business verification (0-10 score). Removed 6 non-grease: Titan Dry Fogging, GreaseBusters Tampa, Engine & Accessory, Aetna Plumbing, 2x Florida Rooter. | 139 businesses, 24 counties, 21 cities |
| 2026-04-05 | UI | Hide star ratings for businesses rated below 2.0 (Stars, CompareTable, JSON-LD, meta). Search input already in FilterBar. | Display only — no DB changes |
| | | | |

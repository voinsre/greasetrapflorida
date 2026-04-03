# Niche Directory Builder Playbook
## The Complete System for Building Profitable Local Service Directory Websites

**Version:** 2.0
**Based on:** 2 successful directory builds (962 pages + 1,700+ pages)
**Target:** $2,000/month profit within 6 months per directory
**Stack:** Next.js 15+ (App Router) + React 19 + TypeScript + Tailwind CSS + Supabase + Vercel
**Build tool:** Claude Code (Antigravity) + Gemini (image generation)

---

## Table of Contents

1. [Phase 0: Niche Research & Validation](#phase-0-niche-research--validation)
2. [Phase 1: Blueprint Creation](#phase-1-blueprint-creation)
3. [Phase 2: Project Setup](#phase-2-project-setup)
4. [Phase 3: Data Collection](#phase-3-data-collection)
5. [Phase 4: Data Cleaning & Dedup](#phase-4-data-cleaning--dedup)
6. [Phase 5: Website Verification & Enrichment](#phase-5-website-verification--enrichment)
7. [Phase 6: Database Population](#phase-6-database-population)
8. [Phase 7A: Design System & Homepage](#phase-7a-design-system--homepage)
9. [Phase 7B: Directory Pages](#phase-7b-directory-pages)
10. [Phase 7C: Content Pages](#phase-7c-content-pages)
11. [Phase 7D: Images & Visual Assets](#phase-7d-images--visual-assets)
12. [Phase 8: SEO Hardening](#phase-8-seo-hardening)
13. [Phase 9: Deploy](#phase-9-deploy)
14. [Phase 10: Monetization](#phase-10-monetization)
15. [Phase 11: Industry Association Enrichment](#phase-11-industry-association-enrichment)
16. [Phase 12: Post-Launch Growth](#phase-12-post-launch-growth)
17. [Universal Database Schema](#universal-database-schema)
18. [Universal Page Architecture](#universal-page-architecture)
19. [SEO & AEO Rules](#seo--aeo-rules)
20. [Known Gotchas (23 items)](#known-gotchas)
21. [Prompt Engineering System](#prompt-engineering-system)
22. [Tools & Costs](#tools--costs)
23. [Reusable Assets](#reusable-assets)
24. [Build Timeline](#build-timeline)

---

## Phase 0: Niche Research & Validation

This is the most important phase. A bad niche wastes 50+ hours of build time. Validate BEFORE touching code.

### 0.1 Niche Selection Criteria

Score each candidate niche against these 8 criteria (1-5 scale, minimum total: 28/40):

| Criteria | What to Look For | Score 1 | Score 5 |
|---|---|---|---|
| **Regulatory mandate** | Is the service required by law, code, or regulation? | Optional/luxury service | Government-mandated, regular inspections |
| **Recurring need** | How often do customers need this service? | One-time purchase | Monthly/quarterly/annual recurring |
| **Local service** | Must the provider be physically local? | Can be done remotely | Must be on-site, geography matters |
| **Fragmented market** | How many small providers exist? | Dominated by 2-3 national chains | Thousands of small local operators |
| **Search volume** | Do people search for this online? | <100/month head term | 1,000+/month head term |
| **Competition** | How hard are existing directories to beat? | Established directories with DA 50+ | No dedicated directory exists |
| **Monetization clarity** | Will businesses pay for leads/visibility? | Low-value service, businesses won't pay | High-value jobs ($500+), businesses actively seek leads |
| **Data availability** | Can you scrape/collect provider data at scale? | No public listings exist | Google Maps has 1,000+ results |

**Sweet spot niches share these traits:**
- Government or insurance regulation creates mandatory demand
- Service must be performed locally and in-person
- Hundreds or thousands of small operators (no single dominant player)
- Customers search "[service] near me" or "[service] [city]"
- No dedicated directory exists (or existing ones are poorly built)
- Average job value is $200+ (businesses will pay for leads)

### 0.2 Validation Research Process

**Step 1 — Keyword Research (Ahrefs or similar)**

Search for the primary head terms and record:

| Query Pattern | Example | What You're Looking For |
|---|---|---|
| [service] near me | "hood cleaning near me" | Monthly volume, KD |
| [service] [top 10 cities] | "hood cleaning Houston" | City-level demand |
| [service] cost | "hood cleaning cost" | Commercial intent |
| [service] company | "hood cleaning company" | Directory intent |
| [regulation] [service] | "NFPA 96 hood cleaning" | Regulation-driven demand |
| [certification] [service] | "IKECA certified" | Trust signal demand |
| how to choose [service] | "how to choose hood cleaner" | Guide content opportunity |
| [service] vs [alternative] | "professional vs DIY" | Comparison content |

**Minimum viable search volume:** 500/month combined across head terms. Below this, the niche is too small for organic traffic to drive meaningful revenue.

**Step 2 — Competitor Analysis**

Search Google for "[service] directory" and "[service] near me":

| Check | Good Sign | Bad Sign |
|---|---|---|
| Dedicated directory exists? | No, or only 1-2 weak ones | Multiple established directories (DA 40+) |
| Google Maps results | 1,000+ businesses across US | <200 total businesses |
| Industry association exists? | Yes (future data source + authority signal) | No organized industry |
| Review sites cover this niche? | Yelp/BBB have listings but no specialized directory | Specialized directory already dominates |
| AI Overviews show for queries? | Yes — opportunity to be the cited source | No — low information demand |

**Step 3 — Data Feasibility Test**

Before committing to build, run a quick Apify test:

1. Create 5 search terms: `"[service] [major city]"` for 5 different cities
2. Run `compass/google-maps-extractor` with `maxCrawledPlacesPerSearch: 20`
3. Check: do results match your niche? Or are they polluted with irrelevant businesses?
4. Target: 15+ relevant results per city = good data density

**If <5 relevant results per city:** The niche may be too small or the service isn't listed on Google Maps under searchable terms. Try variant search terms before abandoning.

**Step 4 — TAM and Revenue Estimation**

```
Estimated businesses in US:        [X from Apify test × extrapolation]
Target directory coverage:          70-80% of findable businesses
Pages at launch:                    [businesses + states + cities + guides + utility]
Estimated monthly traffic (month 6): [conservative: 2,000-5,000 sessions]
Lead conversion rate:               2-3% of traffic
Leads per month:                    [traffic × conversion rate]
Lead value to business:             $50-200 per qualified lead
Revenue from featured listings:     [5-10 businesses × $49/month = $245-490]
Revenue from AdSense:               [traffic × $5-15 RPM = $10-75/month]
Revenue from leads (future):        [leads × lead fee when implemented]
Target month 6 revenue:             $500-2,000/month
```

### 0.3 Trust Signal Discovery

Every niche has trust signals that customers use to evaluate providers. Identify them before building.

**Step 1 — Find the niche's trust signals:**

| Trust Signal Type | How to Discover | Examples |
|---|---|---|
| **Industry certifications** | Search "[niche] certification", check industry association websites | IKECA (hood cleaning), FDIS (fire doors), NADCA (air duct), IICRC (restoration) |
| **Government licenses** | Search "[niche] license [state]", check state contractor boards | State contractor license, EPA certification, fire marshal approval |
| **Insurance requirements** | Search "[niche] insurance requirements" | General liability, workers comp, professional liability |
| **Industry standards** | Search "[niche] standards", "[niche] code requirements" | NFPA 96, BS 8214, ASHRAE, UL listings |
| **Quality indicators** | Check Google Maps reviews, BBB, industry forums | Google rating, review count, years in business, BBB accredited |
| **Association membership** | Search "[niche] association" | Industry-specific membership organizations |

**Step 2 — Prioritize for directory features:**

- **Must-have badges:** Certifications that customers actively search for (add as filterable badges)
- **Nice-to-have badges:** Insurance, licensing (show on listing but don't need to be filterable)
- **Skip:** Trust signals that are universal (everyone has them) or unverifiable

**Step 3 — If NO certifications exist in the niche:**

This is actually an opportunity. Consider:
- Creating a "Verified by [YourDirectory]" badge based on your own verification criteria
- Verification checklist: active website, valid phone, confirmed service area, insurance documentation
- This becomes a monetization lever: "Get verified for free" (builds relationship) → "Upgrade to featured" (revenue)
- Position the directory itself as the trust authority in an unregulated space

### 0.4 Niche Blueprint Variables

Before proceeding to Phase 1, document these niche-specific variables:

```
NICHE VARIABLES:
- Service name (singular):          [e.g., "hood cleaning"]
- Service name (plural):            [e.g., "hood cleaning services"]
- Provider term (singular):         [e.g., "hood cleaner", "inspector"]
- Provider term (plural):           [e.g., "hood cleaners", "inspectors"]
- Primary regulation:               [e.g., "NFPA 96", "BS 8214", or "none"]
- Regulation full name:             [e.g., "National Fire Protection Association Standard 96"]
- Primary certification body:       [e.g., "IKECA", "FDIS", or "none"]
- Certification body full name:     [e.g., "International Kitchen Exhaust Cleaning Association"]
- Target customer:                  [e.g., "restaurant owners", "building managers"]
- Service frequency:                [e.g., "monthly to annually", "every 5 years"]
- Average job value:                [e.g., "$400-600", "£150-300"]
- Geographic market:                [e.g., "US — all 50 states", "UK — England, Scotland, Wales"]
- Apify search term format:         [e.g., "hood cleaning [City] [ST]"]
- Industry association URL:         [e.g., "ikeca.org", or "none"]
- Google Maps category keywords:    [e.g., "hood, exhaust, kitchen, cleaning"]
- Blacklist category keywords:      [e.g., "HVAC, janitorial, residential, carpet"]
- Price for featured listing:       [e.g., "$49/month", "£39/month"]
- Domain:                           [e.g., "findhoodcleaner.com"]
```

---

## Phase 1: Blueprint Creation

### 1.1 Create the Blueprint File

Create `[project]-blueprint.md` — the single source of truth for the entire build.

The blueprint must contain ALL of the following sections:

1. **Project Overview** — domain, niche, target, stack, revenue model
2. **Build Sequence** — day-by-day phase plan
3. **Tech Stack** — every technology with version
4. **Database Schema** — complete SQL including all tables, indexes, junction tables
5. **Service Types** — seed data for the niche's service categories (8-12 types)
6. **Building/Client Types** — who uses this service (8-12 customer types)
7. **Page Architecture** — every route with description (20+ routes)
8. **Guides** — 12 guides (4 cornerstone at 1,500+ words, 8 supporting at 800-1,200 words)
9. **Components** — every reusable component (25+)
10. **SEO Rules** — non-negotiable rules (18+ items)
11. **AEO/GEO Rules** — answer engine optimization requirements
12. **Meta Title Templates** — per page type, all under 60 chars
13. **JSON-LD Schemas** — per page type
14. **Data Pipeline** — scrape → clean → verify → enrich → populate
15. **Design System** — 60/30/10 color principle, typography, spacing
16. **Content Strategy** — area content templates, blog cadence, guide structure
17. **Monetization** — tiers from launch day through month 6
18. **Environment Variables** — complete list
19. **Next.js Configuration** — redirects, image config
20. **Supabase Client Setup** — static client + server client patterns
21. **Pagination Pattern** — correct paginated query template
22. **Known Gotchas** — 23 items (see section 20 of this playbook)
23. **Claude Code Instructions** — standing orders for every session
24. **Sitemap Strategy** — URL generation approach

### 1.2 Create PHASE-STATUS.md

Create alongside the blueprint. This tracks what's been built, what deviated, and what's next. Every Claude Code session updates it.

### 1.3 Initialize Git Repo IMMEDIATELY

**CRITICAL:** Initialize git in Phase 1, not Phase 9. Commit after every phase. The blueprint file was accidentally overwritten in the hood cleaner build with zero git history — file was unrecoverable except from conversation context.

```bash
git init
git add -A
git commit -m "Phase 1: project setup + blueprint + schema"
```

---

## Phase 2: Project Setup

### 2.1 Scaffold

```
npx create-next-app@latest [project-name] --typescript --tailwind --app --src-dir
```

### 2.2 Supabase

- Create a NEW Supabase project (free tier) — do NOT reuse existing projects
- Apply schema from blueprint (all tables, indexes, junction tables)
- Insert seed data (service types, client/building types, states/regions)
- Save credentials to `.env.local`

### 2.3 Vercel

- Link to GitHub repo (but do NOT deploy yet)
- Do NOT add custom domain yet
- Do NOT set env vars yet (wait until Phase 9)

### 2.4 Commit

```bash
git add -A
git commit -m "Phase 2: scaffold + Supabase schema + seed data"
```

---

## Phase 3: Data Collection

### 3.1 Source Priority

| Priority | Source | Method | Expected Yield |
|---|---|---|---|
| 1 | Google Maps | Apify `compass/google-maps-extractor` | 60-80% of total data |
| 2 | Competitor directories | Node.js fetch + cheerio | 10-20% of total data |
| 3 | Industry associations | Playwright (if Cloudflare-protected) or fetch | 5-15% additional/enrichment |
| 4 | Government registries | Fetch or manual download | Varies by niche |

### 3.2 Apify Google Maps Configuration

```json
{
  "actor": "compass/google-maps-extractor",
  "maxCrawledPlacesPerSearch": 80,
  "language": "en",
  "countryCode": "us",
  "skipClosedPlaces": true,
  "maxQuestions": 0,
  "scrapePlaceDetailPage": false,
  "scrapeContacts": false
}
```

**Search term strategy:** City-level granularity ALWAYS outperforms state-level.

Format: `"[service] [City] [ST]"`

City selection per state:
- Large states (CA, TX, FL, NY, IL): 12-15 cities
- Medium states (PA, OH, GA, NC, MI): 6-10 cities
- Small states (WY, VT, AK, DE): 2-4 cities
- Total: 200-300 cities across 50 states (US) or equivalent for other markets

**For large states, use `maxCrawledPlacesPerSearch: 80` from the start.** The 20-then-re-run-at-80 approach wastes Apify credits and time.

**Budget: $20-30 for full US coverage** at Apify Starter tier.

### 3.3 Competitor Scraping

For each competitor directory in the niche:
- Test if their site blocks automated requests (fetch the homepage first)
- If accessible: Node.js fetch + cheerio script
- If blocked (403/Cloudflare): Playwright headless browser or skip
- Fields to extract: business name, phone, website, address, city, state, zip

### 3.4 Data Feasibility Test Results

Before running full scrape, validate with a 5-city test batch:
- Do results match your niche? (>75% relevant = good)
- What blacklist keywords are needed?
- What's the average results-per-city density?
- Extrapolate: total businesses = avg per city × planned cities × 0.7 (dedup factor)

### 3.5 Output

Save all raw data to `/data/` directory:
- `raw-apify-[batch].json` per Apify run
- `raw-[competitor].json` per competitor scrape
- Keep all raw data — never overwrite

**Commit:**
```bash
git add -A  # Note: /data/ should be in .gitignore if files contain credentials
git commit -m "Phase 3: data collection complete - [X] raw records"
```

---

## Phase 4: Data Cleaning & Dedup

### 4.1 Cleaning Pipeline

Create `scripts/clean-data.mjs`:

**Step 1 — Merge all sources** into a single array

**Step 2 — Hard exclude filters** (remove rows that match ANY):
- `permanentlyClosed: true` or `temporarilyClosed: true`
- `isAdvertisement: true`
- No phone AND no website (uncontactable)
- Blacklist category keywords (define per niche — residential versions of commercial services, adjacent but irrelevant trades)
- Zero reviews AND no website AND no phone (likely abandoned or fake listing)
- Wrong country (filter by phone area code for border cities)

**Step 3 — Three-tier dedup** (in order):
1. **place_id** — exact Google Maps ID match (catches ~80% of duplicates)
2. **Phone** — normalize to last 10 digits, compare (catches ~15% more)
3. **Name + zip** — lowercase, remove Inc/LLC/Corp, compare (catches ~5% remaining)

**Step 4 — Normalize:**
- State to full name + abbreviation
- Phone: keep `phoneUnformatted` from Apify data directly
- Generate slug: `${slugify(name)}-${slugify(city)}`
- Assign display priority based on data completeness

**Step 5 — Output:** `data/cleaned.json`

### 4.2 Expected Ratios

| Metric | Typical Range |
|---|---|
| Raw → after hard filters | 25-40% kept |
| After filters → after dedup | 80-90% kept |
| Total raw → clean | 20-35% kept |

If you're keeping more than 50% of raw data, your filters aren't strict enough. If less than 15%, your search terms may be too broad.

---

## Phase 5: Website Verification & Enrichment

### 5.1 Website Verification

Create `scripts/verify-websites.mjs`:

For each business with a website URL:
- Fetch homepage (timeout 8 seconds)
- Record status: `live` (200), `blocked` (403), `dead` (4xx/5xx), `timeout`, `no_website`
- If live, check page content for:
  - Niche-relevant keywords in title, H1, body text
  - Certification/regulation mentions → set flags
  - Phone number match (fuzzy)
- Save crawl data for reuse (do NOT re-crawl in enrichment phase)

### 5.2 Deep Crawl (High Value — Don't Skip)

For live websites, also crawl `/services` and `/about` pages:
- Extract service lists
- Extract certifications and qualifications
- Extract coverage areas
- Extract "about" text for business descriptions

**This consistently enriches 40-50% of businesses with data not available from Google Maps.**

### 5.3 Certification/Trust Signal Scan

Scan all live pages for industry-specific trust signals:
- Text mentions of certification names
- Logo images (check `<img>` src, alt, filenames)
- Links to certification body websites
- Meta content
- CSS class names (some sites use cert-specific classes)

**Image-level scanning finds 20-30% more certifications than text-only scanning.**

### 5.4 Enrichment Passes

Create `scripts/enrich-data.mjs` with sequential passes:

1. **Services extraction** — map website text to service types table
2. **Display priority** — rank businesses by data completeness (verified + website + reviews + certifications)
3. **Certification flags** — set boolean flags based on verification results
4. **Slug generation** — city slugs, state slugs, business slugs

### 5.5 Output

- `data/verified.json` — verification results
- `data/enriched.json` — final enriched dataset
- Crawl data saved for potential re-use

---

## Phase 6: Database Population

### 6.1 Insert Order (Foreign Key Dependencies)

```
1. States/Regions (parent geography)
2. Cities/Areas (child geography, requires state FK)
3. Businesses (requires city reference)
4. Junction tables (business_services, business_building_types)
5. Update counts (business_count on states and cities)
```

### 6.2 City Threshold

**Only create city pages for cities with 2+ businesses.** Single-business city pages are thin doorway pages that Google penalizes. The business still appears on its state page and the main directory — it just doesn't get a dedicated city URL.

### 6.3 Batch Insert Pattern

```javascript
// Insert in batches of 50
for (let i = 0; i < businesses.length; i += 50) {
  const batch = businesses.slice(i, i + 50);
  const { error } = await supabase.from('businesses').insert(batch);
  if (error) console.error(`Batch ${i/50} failed:`, error);
  console.log(`Inserted ${Math.min(i + 50, businesses.length)}/${businesses.length}`);
}
```

### 6.4 Junction Table Batching

Batch `.in()` queries in 100-ID chunks. PostgREST URL length limit causes silent failures above ~300 IDs.

### 6.5 Validation

After all inserts, verify:
- Business count matches cleaned data (minus any skipped)
- State business_count sums match total businesses
- City business_count sums match total businesses (excluding no-city records)
- Junction table row counts are reasonable (avg 2-3 services per business)

---

## Phase 7A: Design System & Homepage

### 7.1 Design System (60/30/10 Principle)

Every directory uses the same principle with different accent colors:

```
60% — Backgrounds (white/light gray)
  --color-bg: #FFFFFF
  --color-bg-alt: #F8FAFB

30% — Authority color (deep, trustworthy)
  --color-primary: [navy, dark green, dark blue, charcoal]
  --color-text: [same as primary]
  --color-footer-bg: [same as primary]

10% — Action color (bright, clickable)
  --color-accent: [teal, blue, green, orange]
  --color-accent-dark: [darker shade for hover]
  --color-accent-light: [lighter shade for backgrounds]
```

**Typography:** Single font only. Inter (Google Fonts, variable weight) works for every niche. No second font. No monospace.

**Design rules that apply to every directory:**
- Mobile-first (service searchers use phones)
- No gradients, no shadows heavier than shadow-sm
- Cards: white bg, 1px border, rounded-lg, hover:shadow-sm
- Buttons: accent color bg, white text, rounded-lg
- Generous white space — cards have padding, sections breathe

### 7.2 Homepage Structure

Every directory homepage follows this layout:

```
1. Hero section (full viewport, background image, search bar overlay)
   - H1: "Find [Provider Plural] Near You"
   - Search bar: city/state autocomplete
   - Stats: "[X] Companies | [Y] States | [Z] Cities"
   - Transparent header that turns solid on scroll

2. Trust banner
   - "[Certification] Verified | [Regulation] Compliant | Insured"

3. Top Rated section
   - Top 6 businesses by rating (minimum 4.5, minimum 5 reviews)
   - "View All [X] Companies →"

4. Browse by Region (map or grid)
   - Interactive SVG map (US) or region grid (UK/other)
   - Links to state/region pages

5. Popular Cities
   - Top 12 cities by business count
   - "View All [X] Cities →"

6. Why Use Our Directory
   - 3 value props with icons

7. Business CTA
   - "Own a [service] business?"
   - "Claim Your Listing" + "Get Featured"
```

### 7.3 Header (Transparent Mode)

On homepage only: header starts transparent with white text, transitions to solid white with dark text on scroll. Uses IntersectionObserver on the hero section.

On all other pages: standard solid white header with dark text.

**CRITICAL:** Do NOT use `useSearchParams()` in any component in the root layout tree without wrapping in `<Suspense>`. This causes `BAILOUT_TO_CLIENT_SIDE_RENDERING` — empty HTML shells that score 28/100 on Ahrefs.

---

## Phase 7B: Directory Pages

### 7B-1: Core Directory

**Routes:**
- `/[providers]` — master directory (paginated 24/page)
- `/[providers]/[slug]` — individual listing page

**Listing page must include:**
- Business name (H1), city, state
- Rating + review count
- Certification/trust signal badges
- Auto-generated description (from template using business data)
- Business details: phone (clickable), website (external link), address
- Business hours (from Google Maps data, if available)
- Services offered (from junction table)
- Lead form (sticky sidebar on desktop)
- "Add to Compare" button
- FAQ section (3-4 templated Q&As with FAQPage JSON-LD)
- "More [Providers] in [State]" section (AlsoBrowse)
- BusinessCTA banner ("Own this business? Claim your listing")
- JSON-LD: LocalBusiness + BreadcrumbList + FAQPage

**ListingCard design:**
- Colored top border (accent for verified, amber for featured, gray for default)
- Business name (line-clamp-2, no truncation)
- City, State
- Rating + stars
- Service pills (top 2 + "+X more")
- Trust signal badges
- Full-width "Get Quote" CTA button
- Entire card clickable (Link to listing page)
- Compare checkbox (top-right corner)

### 7B-2: Location Pages

**Routes:**
- `/states` (or `/regions`) — index of all geographic areas
- `/states/[state]` — state directory page
- `/states/[state]/[city]` — city directory page
- `/cities` — all cities index (sitemap helper)

**Requirements:**
- Area content: 6 rotating templates (~120 words each) per city, hash-based selection
- FAQ accordion: 5 Q&As per state and city page
- FAQPage + ItemList + BreadcrumbList JSON-LD
- "Top Rated" section on city pages (rating >= 4.0, min 3 to show)
- State flags/icons on state pages (for US directories)

### 7B-3: Service Pages + Compare Tool

**Routes:**
- `/services` — services index
- `/services/[type]` — service filter page (one per service type)
- `/compare` — side-by-side comparison tool

**Compare system components:**
- CompareContext (React context, max 4 selections)
- CompareBar (fixed bottom bar with selected businesses)
- CompareCheckbox (per-card checkbox)
- CompareTable (side-by-side comparison grid)

**CRITICAL:** CompareContext uses URL params. Wrap in `<Suspense>` or use `window.location.search` in `useEffect` instead of `useSearchParams()`.

---

## Phase 7C: Content Pages

Split into sub-phases for manageable execution:

### 7C-1: Guides Index + 4 Cornerstone Guides (1,500+ words each)

Every niche needs these 4 cornerstone topics:
1. **Compliance/Regulation guide** — "[Regulation] Compliance Guide: What [Customers] Must Know"
2. **Cost guide** — "[Service] Cost Guide: What to Expect and How to Compare Quotes"
3. **Frequency guide** — "[Service] Frequency Guide: [Regulation] Schedules"
4. **Certification guide** — "[Certification] Guide: Why Certified [Providers] Matter"

If the niche has no regulation: replace #1 with "Complete Guide to Choosing a [Provider]" and #3 with "[Service] Maintenance Schedule: Industry Best Practices."

If the niche has no certification: replace #4 with "What to Look For in a Professional [Provider]: Quality Indicators."

### 7C-2: 8 Supporting Guides (800-1,200 words each)

Standard topics that work for any niche:
5. "What Happens If You Fail a [Service] Inspection" (or "What Happens When [Service] Goes Wrong")
6. "[Service] Documentation Requirements"
7. "[Regulation] [Year] Update: What Changed" (if regulation exists)
8. "How to Choose a [Provider]: Complete Checklist"
9. "[Service] vs DIY: Why Professional Service Is [Required/Recommended]"
10. "[Industry] Safety/Prevention Guide"
11. "Types of [Equipment/Systems] Explained"
12. "[Related Service A] vs [Related Service B]: What You Need"

### 7C-3: Blog System

- Blog index page (paginated)
- Blog post template with Article + FAQPage JSON-LD
- Seed script with 6 initial posts (800+ words each)
- Custom CSS for blog content (NOT Tailwind Typography — incompatible with v4)

Standard blog post topics for any niche:
1. "X Warning Signs You Need [Service]"
2. "What Professional [Service] Looks Like: Before and After"
3. "How [Service] Affects Your Insurance"
4. "[Special Case] [Service] Requirements" (e.g., food trucks, historic buildings)
5. "Opening a [Business Type]? Your [Service] Compliance Checklist"
6. "X [Service] Myths [Customers] Still Believe"

### 7C-4: Utility + Monetization Pages

- `/about` — directory mission, data quality, what we offer
- `/contact` — form + API route + Resend email
- `/privacy` — standard privacy policy
- `/claim-listing` — claim form with business autocomplete + API route
- `/advertise` — featured listing sales page with Stripe Payment Link
- `/get-quotes` — multi-step quote request wizard (4 steps: location → service details → contact → confirm)

### 7C-5: Email Templates

8 branded HTML email templates (table-based layout, inline styles):

**Customer-facing (4):**
1. Lead confirmation to requester
2. Claim confirmation to claimer
3. Quote request confirmation
4. Business lead notification

**Admin notifications (4):**
5. Contact form → ADMIN_EMAIL
6. New claim → ADMIN_EMAIL
7. New quote → ADMIN_EMAIL
8. New lead → ADMIN_EMAIL

---

## Phase 7D: Images & Visual Assets

### 7D-1: Geographic Visual Assets

For US directories: download 50 state flag images
- Source: flagcdn.com (public domain)
- Format: WebP, ~2KB each
- Place on state pages, states index, cities page, filter dropdowns

For UK directories: region icons or country flags (England, Scotland, Wales)

### 7D-2: Content Image Generation

Create IMAGE-SPEC.md with:
- Style guidelines (photorealistic, warm, no faces, no text in images)
- Technical specs (1200x630, WebP, compression targets)
- Alt text for every image (SEO requirement)
- Generation prompts for every image

**29 images standard:**
- 1 homepage hero
- 12 guide header images
- 6 blog header images
- 10 service images

Generate via Gemini (Antigravity) or similar AI image tool.

### 7D-3: Image Optimization + Placement

- All images: WebP format
- Hero: under 80KB, `priority={true}`, `sizes="100vw"`
- Guide/blog headers: under 60KB, `sizes="(max-width: 768px) 100vw, 800px"`
- Service images: under 50KB, `sizes="(max-width: 768px) 100vw, 400px"`
- All use Next.js `<Image>` with width, height, sizes, alt text
- Guide/blog images double as OG images

### 7D-4: Default OG Image

Create `/public/og-image.png` (1200x630) for site-wide social sharing fallback. Set in root layout metadata.

---

## Phase 8: SEO Hardening

**CRITICAL: This phase MUST complete BEFORE Phase 9 (deploy). No exceptions.**

### 8.1 Automated Audit Script

Create `scripts/audit-seo.mjs` that checks:

| Check | Target |
|---|---|
| Sitemap.xml | Valid XML, includes ALL dynamic URLs |
| Robots.txt | Disallow /api/ and /compare |
| Meta titles | All under 60 chars, all unique |
| Meta descriptions | All under 160 chars, all unique |
| JSON-LD | Valid on 5 pages per type, ratings use Number() |
| Internal links | Zero broken, 3+ per page minimum |
| Canonical URLs | Present on every page, correct format |
| OpenGraph | All tags present, images re-declared per page |
| H1 tags | Exactly 1 per page, unique |
| Images | All have sizes, alt, width, height |

### 8.2 Technical Checks

| Check | How |
|---|---|
| No Unicode escapes | `grep -r "\\\\u[0-9a-fA-F]" --include="*.tsx"` |
| All queries paginated | Grep for `.select(` without `.range` or `.limit` |
| Resend lazy-initialized | Check no module-level `new Resend()` |
| createStaticClient in generateStaticParams | Grep for `createClient` in `generateStaticParams` |
| .in() queries chunked | Check for arrays > 100 in .in() calls |
| www redirect (308) | Verify in next.config.ts |

### 8.3 Raw HTML Output Test

**NEW (learned from hood cleaner build):**

```bash
curl -s https://localhost:3000/about | grep "<h1" | head -5
curl -s https://localhost:3000/states/[state] | grep "<h1" | head -5
curl -s https://localhost:3000/[providers] | grep "<h1" | head -5
```

If ANY page returns empty or no H1: you have a `BAILOUT_TO_CLIENT_SIDE_RENDERING` issue. Fix before deploying. Check for `useSearchParams()` in root layout tree.

### 8.4 SEO Audit Report

Generate `/SEO-AUDIT-REPORT.md` with pass/fail for every check. Overall status is PASS only if all critical checks pass.

---

## Phase 9: Deploy

### 9.1 Pre-Deploy Checklist

```
[ ] Phase 8 SEO audit: PASS
[ ] Raw HTML output test: all pages have content
[ ] Git repo initialized, all code committed
[ ] .gitignore includes: scripts/, data/, .env.local
[ ] .gitignore does NOT include build-required files (map data, etc.)
[ ] Supabase env vars ready (correct project!)
[ ] Resend domain verified, API key ready
[ ] Stripe payment link created
[ ] ADMIN_EMAIL decided
```

### 9.2 Vercel Environment Variables

Set ALL of these before first deploy:

```
NEXT_PUBLIC_SUPABASE_URL          ← CRITICAL
NEXT_PUBLIC_SUPABASE_ANON_KEY     ← CRITICAL
SUPABASE_SERVICE_ROLE_KEY         ← CRITICAL
RESEND_API_KEY                    ← For emails
RESEND_FROM_EMAIL                 ← hello@yourdomain.com
NEXT_PUBLIC_SITE_URL              ← https://yourdomain.com
ADMIN_EMAIL                       ← Your notification email
NEXT_PUBLIC_ADSENSE_PUB_ID       ← Empty until approved
```

**VERIFY the Supabase URL contains the correct project reference.** Wrong env vars = empty pages with no build error. This happened on both directory builds.

### 9.3 Deploy Sequence

```
1. Add env vars to Vercel dashboard (all environments)
2. Add domains in Vercel (non-www primary, www → 308 redirect)
3. Configure DNS at registrar (A record or Vercel nameservers)
4. git push origin main/master
5. Wait for build to complete (6-10 minutes for 1,500+ pages — DO NOT cancel)
6. Verify live site (14-point checklist below)
```

### 9.4 Post-Deploy Verification (14 checks)

```
[ ] Homepage loads with correct data
[ ] www redirects to non-www (308)
[ ] /sitemap.xml returns valid XML
[ ] /robots.txt returns correct rules
[ ] One listing page loads with JSON-LD
[ ] One state/region page loads
[ ] One city page loads
[ ] One guide page loads
[ ] /blog shows posts
[ ] Images load (hero, guide headers, flags)
[ ] Search bar autocomplete works
[ ] Lead form renders on listing pages
[ ] Contact form submits
[ ] Raw HTML has content: curl -s [URL] | grep "<h1"
```

### 9.5 If Pages Show Wrong/Empty Data

**"Redeploy" with "Use existing Build Cache" UNCHECKED.** Cached static pages persist even after env var changes. Only a full rebuild with cache cleared generates fresh pages.

### 9.6 Post-Deploy Setup

```
1. Google Search Console — verify domain, submit sitemap
2. Ahrefs — create project, run site audit, target 90+
3. Ahrefs — add 30-40 tracked keywords
4. Ahrefs — add 3-5 competitor domains
```

---

## Phase 10: Monetization

### 10.1 Launch Day Revenue Streams

| Stream | Setup | Revenue |
|---|---|---|
| **Lead generation** | LeadForm on every listing, emails to business + admin | Relationship building (monetize later) |
| **Featured listings** | Stripe Payment Link on /advertise page | $49/month per business |
| **Claim listing** | Free claim → relationship → upsell to featured | Pipeline for featured |

### 10.2 Post-Launch Revenue Streams

| Stream | When | Setup |
|---|---|---|
| **AdSense** | After 500+ sessions/month | Add pub ID to env var, redeploy |
| **Affiliate links** | Month 2+ | Certification courses, equipment, insurance |
| **Tiered listings** | Month 3+ | $49/$99/$149 with different features |
| **Lead fees** | Month 6+ | Charge per qualified lead sent to business |

### 10.3 AdSense Prep (Build During Phase 7C-4)

Create `AdUnit.tsx` component:
- Client component, lazy-loaded via `next/dynamic`
- Returns `null` when `NEXT_PUBLIC_ADSENSE_PUB_ID` is empty
- Standard placements: between listings (horizontal), sidebar on listing pages (rectangle), after content on guides/blog (rectangle)
- Zero visual impact until activated

### 10.4 Stripe Setup (Minimal)

For launch, you need ONLY:
- Stripe account
- One product: "Featured Listing — [Directory Name]" at $49/month
- One Payment Link from that product
- Custom field on payment link: "Your business listing URL"
- After-payment redirect to `/advertise?success=true`

No API keys, no webhooks, no code integration. Manual activation of featured listings is fine at 0-10 customers. Automate when volume justifies it.

---

## Phase 11: Industry Association Enrichment

### 11.1 When to Do This

Post-launch, during week 1. The directory is already live and functional. This adds data quality, not functionality.

### 11.2 Association Discovery

Search for: "[niche] association", "[niche] certification body", "[niche] member directory"

Common patterns:
- Association websites often use YourMembership.com or MemberClicks platforms
- Member directories are frequently behind search forms
- Cloudflare protection is common on association websites

### 11.3 Scraping Strategy

```
Attempt 1: Direct fetch → if 403, move to Attempt 2
Attempt 2: Playwright headless browser → if blocked, move to Attempt 3
Attempt 3: Bright Data (residential proxies) → last resort

Key discovery technique: Look for embedded maps or iframes
in the member directory. Map marker JavaScript often 
contains ALL member data in a single page load — no 
pagination or form submission needed.
```

### 11.4 Matching Pipeline

```
1. Scrape association data
2. Clean (remove HQ entry, flag system phones, remove no-city records)
3. Match against existing database:
   - Tier 1: Phone match (normalize to last 10 digits)
   - Tier 2: Name + state exact match
   - Tier 3: Fuzzy name + state match (manual review)
4. Apply matches: set certification flag = true
5. Enrich unmatched members via Apify (1 result per search)
6. Validate Apify results (name match + category match + state match)
7. Insert new businesses
8. Website verification on new businesses
```

### 11.5 System Phone Detection

Association platforms often default to the association's office phone when members don't provide their own. If >10% of scraped records share the same phone number, flag it as a system phone and exclude from phone-based matching.

---

## Phase 12: Post-Launch Growth

### 12.1 Week 1 Priorities

```
[ ] GSC index requests for top 20 pages
[ ] Submit sitemap to Bing Webmaster Tools
[ ] Start blog cadence (2 posts/week)
[ ] Email top 50 businesses pitching featured listings
[ ] Email certified businesses pitching claim + featured
[ ] Association enrichment pipeline (Phase 11)
```

### 12.2 Month 1 Priorities

```
[ ] Backlink campaign (guest posts, HARO)
[ ] Google Business Profile for the directory
[ ] "Best [Providers] in [City]" roundup posts for top 20 cities
[ ] Monthly URL validation re-scan
[ ] Monthly certification re-scan
[ ] AdSense application (if 500+ sessions)
[ ] Set up GA4 + conversion tracking
```

### 12.3 Month 2-3 Priorities

```
[ ] State-specific regulation guides (top 10 states)
[ ] Review/rating system for verified customers
[ ] Business dashboard for claimed listings
[ ] Automated Stripe webhook (if 10+ featured customers)
[ ] Performance audit (Core Web Vitals)
[ ] Plan directory #2
```

---

## Universal Database Schema

This schema works for any niche. Swap table names and column names as needed.

```sql
-- BUSINESSES (core listing data)
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  website TEXT,
  address TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  state_slug TEXT NOT NULL,
  zip TEXT,
  lat DECIMAL(9,6),
  lng DECIMAL(9,6),
  description TEXT,
  rating DECIMAL(3,1),
  review_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  is_claimed BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  -- NICHE-SPECIFIC: Add certification boolean flags here
  -- e.g., ikeca_certified, fdis_certified, nadca_certified
  insured BOOLEAN DEFAULT TRUE,
  featured_until TIMESTAMPTZ,
  place_id TEXT UNIQUE,
  opening_hours JSONB,
  website_status TEXT,
  phone_unformatted TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SERVICE TYPES (what the business offers)
CREATE TABLE service_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  meta_title TEXT,
  meta_description TEXT
);

-- BUILDING/CLIENT TYPES (who uses the service)
CREATE TABLE building_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT
);

-- GEOGRAPHIC TABLES
CREATE TABLE states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  abbreviation CHAR(2) NOT NULL,
  business_count INTEGER DEFAULT 0,
  meta_title TEXT,
  meta_description TEXT,
  content TEXT
);

CREATE TABLE cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  state_slug TEXT NOT NULL REFERENCES states(slug),
  state_name TEXT NOT NULL,
  business_count INTEGER DEFAULT 0,
  meta_title TEXT,
  meta_description TEXT,
  content TEXT
);

-- JUNCTION TABLES
CREATE TABLE business_services (
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  service_id UUID REFERENCES service_types(id) ON DELETE CASCADE,
  PRIMARY KEY (business_id, service_id)
);

CREATE TABLE business_building_types (
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  building_type_id UUID REFERENCES building_types(id) ON DELETE CASCADE,
  PRIMARY KEY (business_id, building_type_id)
);

-- USER INTERACTION TABLES
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  service_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  role TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE content_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES
CREATE INDEX idx_businesses_state ON businesses(state_slug);
CREATE INDEX idx_businesses_city ON businesses(city, state_slug);
CREATE INDEX idx_businesses_featured ON businesses(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_businesses_slug ON businesses(slug);
CREATE INDEX idx_cities_state ON cities(state_slug);
CREATE INDEX idx_businesses_place_id ON businesses(place_id);
CREATE INDEX idx_content_pages_published ON content_pages(published_at) WHERE published_at IS NOT NULL;
```

---

## Universal Page Architecture (20+ routes)

```
/                                    Homepage
/[providers]                         Master directory (paginated)
/[providers]/[slug]                  Individual business listing
/states                              States/regions index
/states/[state]                      State/region directory
/states/[state]/[city]               City directory
/services                            Services index
/services/[type]                     Service filter page
/guides                              Guides index
/guides/[slug]                       Individual guide (12 guides)
/blog                                Blog index
/blog/[slug]                         Individual blog post
/compare                             Side-by-side comparison tool
/claim-listing                       Business claim form
/advertise                           Featured listing sales page
/get-quotes                          Multi-step quote request form
/about                               About page
/contact                             Contact form
/privacy                             Privacy policy
/cities                              All cities index
```

---

## SEO & AEO Rules

### SEO Rules (Non-Negotiable — 18 items)

1. Absolute meta titles everywhere (`title: { absolute: "..." }`), all under 60 chars
2. Meta descriptions under 160 chars on every page
3. JSON-LD ratings use `Number()` not `String()`, skip block if any required field is null
4. `generateStaticParams` and page data fetchers use identical query logic
5. Paginate ALL Supabase queries on junction tables with `.range()`
6. Never use Unicode escape sequences — literal characters only
7. Only link to city pages that actually exist (2+ business threshold)
8. openGraph images: re-declare on every page (Next.js shallow merge)
9. Lazy-initialize Resend and all SDK clients (never module-level)
10. `<Image>` components always include `sizes` attribute
11. Non-www as primary, www redirects 308
12. Batch `.in()` queries in 100-ID chunks
13. Use `createStaticClient()` for `generateStaticParams`
14. 3+ internal links minimum on every page
15. Every page has exactly one unique H1 with primary keyword
16. Pre-deploy validation: Rich Results Test on 5 pages per type
17. Ahrefs audit: target 90+ before declaring deploy complete
18. Never use `node -e` on Windows — always use .mjs files

### AEO/GEO Rules (Every Page)

1. Every content page opens with 2-3 sentence direct answer to target query
2. Named entities with definitions on first mention
3. Specific numbers, statistics, data points throughout
4. Authoritative sourcing language
5. Concise meta descriptions that answer the query
6. FAQPage JSON-LD on every page with FAQ content

### Schema Requirements Per Page Type

| Page Type | JSON-LD Schemas |
|---|---|
| Homepage | WebSite + SearchAction + BreadcrumbList |
| Listing page | LocalBusiness + BreadcrumbList + FAQPage |
| State/city page | ItemList + BreadcrumbList + FAQPage |
| Service page | ItemList + BreadcrumbList + FAQPage |
| Guide page | Article + BreadcrumbList + FAQPage |
| Blog post | Article + BreadcrumbList + FAQPage |

---

## Known Gotchas (23 items)

From 2 directory builds — do not repeat these:

1. **Deploy before SEO audit** → Ahrefs Health Score 8/100
2. **"%s | Site Name" title template** → titles over 60 chars on hundreds of pages
3. **String ratings in JSON-LD** → schema validation errors
4. **Mismatched generateStaticParams/page queries** → silent 404s
5. **Unpaginated junction table queries** → data missing above 1,000 rows
6. **Unicode escapes** → broken characters in production
7. **Linking to non-existent city pages** → broken internal links
8. **Shallow OG metadata merge** → missing OG images
9. **`node -e` on Windows** → escaping issues, use .mjs files
10. **Module-level Resend init** → build crashes when API key absent
11. **Missing `sizes` on Image components** → warnings + layout shift
12. **Wrong redirect type (307 vs 308)** → non-permanent www redirect
13. **Supabase `.in()` URL limit** → batch in 100-ID chunks
14. **`createClient()` in generateStaticParams** → cookies() unavailable at build time
15. **useSearchParams() in root layout** → BAILOUT_TO_CLIENT_SIDE_RENDERING, empty HTML shells, Ahrefs score 28
16. **Tailwind v4 Typography plugin** → incompatible, use custom CSS
17. **Build-required files in gitignored directories** → Module not found on Vercel
18. **Wrong Supabase env vars in Vercel** → empty pages, no build error
19. **Redeploy without clearing build cache** → stale static pages persist after env var changes
20. **Blog published_at timezone** → future times cause posts to disappear
21. **Gemini image double-nesting** → /images/images/ path mismatch
22. **First Vercel build 6-10 min** → don't cancel, partial deploy is worse
23. **Association directory system phones** → >10% same phone = system default, exclude from matching

---

## Prompt Engineering System

### Blueprint as Single Source of Truth

Every Claude Code session starts with:
```
Read [project]-blueprint.md and PHASE-STATUS.md in full before doing anything.
```

Every prompt ends with:
```
Remember: update [project]-blueprint.md and PHASE-STATUS.md if anything deviates from the plan.
```

### Standing Orders

```
- TypeScript strict mode
- No `any` types
- Literal characters only — no Unicode escapes
- All Supabase queries paginated
- All SDK clients lazy-initialized
- All Image components include `sizes`
- Absolute meta titles only
- npm run build — zero errors (gate for every phase)
```

### Phase Splitting

Large phases (especially content) must be split into sub-phases:
- 7C-1: Guides index + cornerstone guides
- 7C-2: Supporting guides
- 7C-3: Blog system
- 7C-4: Utility + monetization pages
- 7C-5: Images (flags + generation + placement)

### Verification Checklist

Every prompt includes at the end:
- `npm run build — MUST be zero errors`
- Specific pages to check in dev server
- JSON-LD validation
- Word counts (for guides/blog)
- Internal link checks
- Screenshot requests

---

## Tools & Costs

| Tool | Cost | Purpose |
|---|---|---|
| **Claude Code (Antigravity)** | Claude Max subscription | Primary build tool |
| **Gemini (Antigravity)** | Included | Image generation |
| **Apify** | Starter tier (~$20-30 per directory) | Google Maps scraping |
| **Supabase** | Free tier | Database |
| **Vercel** | Free tier | Hosting + auto-deploy |
| **Resend** | Free tier | Transactional email |
| **Stripe** | No setup cost | Payment links |
| **Ahrefs** | Lite plan | SEO audit + rank tracking |
| **Google Search Console** | Free | Indexing + performance |
| **Domain** | ~$10-15/year | — |
| **Total per directory** | **~$30-50 one-time** + ongoing subscriptions | — |

---

## Reusable Assets

Copy directly to each new project:

| Asset | What | Adaptation Needed |
|---|---|---|
| Blueprint template | Full 25-section blueprint | Swap niche variables |
| PHASE-STATUS.md | Phase tracking template | None |
| Design system | 60/30/10 CSS variables | Change accent color |
| Component library | 25+ components | Swap labels and copy |
| SEO audit script | audit-seo.mjs | None |
| Email templates | lib/email-templates.ts | Swap branding |
| IMAGE-SPEC.md | Image generation template | Swap prompts |
| Apify config | Actor + settings | Swap search terms |
| Data cleaning pipeline | Dedup + filter scripts | Swap blacklist keywords |
| Website verification | Verify + enrich scripts | Swap niche keywords |
| Blog seed script | seed-blog.mjs | Swap content |
| Association enrichment | Scrape + match + merge | Swap target association |

---

## Build Timeline

### Realistic Estimates

```
Phase 0 (Research):      2-4 hours (one-time per niche)
Phase 1 (Blueprint):     2-3 hours
Phase 2 (Setup):         1 hour
Phase 3 (Data):          3-5 hours (Apify runs take wall time)
Phase 4 (Clean):         1-2 hours
Phase 5 (Verify):        2-3 hours
Phase 6 (Populate):      1 hour
Phase 7A (Design):       3-4 hours
Phase 7B (Directory):    4-6 hours
Phase 7C (Content):      8-12 hours (guides are the bottleneck)
Phase 7D (Images):       2-3 hours
Phase 8 (SEO):           2-3 hours
Phase 9 (Deploy):        1-2 hours
Phase 10 (Monetization): 1-2 hours
Phase 11 (Association):  4-6 hours (if applicable)
Phase 12 (Growth):       Ongoing

Total: ~35-55 hours active work
Calendar: 2-3 days compressed, 1 week comfortable
```

### What Takes Longest

1. **Guide content (7C-1 + 7C-2):** 8-12 hours — each guide needs unique, authoritative content
2. **Directory pages (7B):** 4-6 hours — many page types, each with distinct queries and layouts
3. **Association enrichment (11):** 4-6 hours — Cloudflare bypass, matching, enrichment pipeline

### What's Fastest Next Time

With this playbook and reusable assets, the second directory should take 25-35 hours instead of 40-55. The main time savings come from:
- No design system decisions (reuse with color swap)
- No component architecture decisions (copy and adapt)
- No gotcha debugging (23-item checklist prevents them)
- Faster data pipeline (proven scripts with minor adaptation)

---

*Playbook version 2.0 — Based on findfiredoorinspector.co.uk (962 pages, 3 days) and findhoodcleaner.com (1,700+ pages, 1 day compressed)*
*Total directories built: 2 | Total pages generated: 2,600+ | Total businesses: 2,172 | Best Ahrefs score: 100*

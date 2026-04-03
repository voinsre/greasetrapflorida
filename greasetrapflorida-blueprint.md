# Grease Trap Florida — Project Blueprint
## Single Source of Truth for the Entire Build

**Domain:** greasetrapflorida.com
**Niche:** Grease trap cleaning services — Florida (single state)
**Target:** $2,000/month profit within 6 months
**Stack:** Next.js 15+ (App Router) + React 19 + TypeScript + Tailwind CSS + Supabase + Vercel
**Build tool:** Claude Code (Antigravity) + Gemini (image generation)
**Data tools:** Apify MCP (Google Maps scraping) + Custom async website scraper + Claude API (enrichment)
**Icon library:** Lucide React (free, tree-shakable, 1,500+ icons)
**Revenue model:** Lead generation → Featured listings ($49/mo) → AdSense → Lead fees

---

## 1. Project Overview

A single-state directory listing licensed grease trap cleaning service providers across Florida. The directory helps restaurant owners, food service managers, and commercial kitchen operators find, compare, and contact verified grease trap service companies. The site's competitive advantage is the compliance positioning: Florida's Chapter 62-705 (Grease Waste Removal and Disposal) became effective December 7, 2025, creating a brand-new DEP licensing requirement that no existing directory addresses.

**Why this niche wins:**
- 48,000+ restaurants in Florida alone, plus hotels, hospitals, schools, catering companies
- Chapter 62-705 is 4 months old — zero directories built around it
- Ahrefs KD of 0-5 across all target keywords (essentially zero competition)
- 3,480 monthly search volume across 102 tracked keywords
- Recurring mandatory service (monthly to quarterly pump-outs)
- Every food service establishment must use only DEP-licensed haulers under penalty of fines ($100-$5,000)

---

## 2. Build Sequence

```
Day 1:  Phase 1 (Blueprint — THIS FILE) + Phase 2 (Project Setup + Supabase Schema)
Day 1:  Phase 3 (Apify Scrape via MCP — runs in background)
Day 1:  Phase 7A (Design System + Homepage — while data collects)
Day 2:  Phase 4 (Data Cleaning + Dedup)
Day 2:  Phase 5 (Website Scraper + Claude API Enrichment)
Day 2:  Phase 6 (Database Population)
Day 2:  Phase 7B (Directory Pages — county, city, listing)
Day 3:  Phase 7C (Content Pages — guides, compliance, blog)
Day 3:  Phase 7D (Images — generate + place)
Day 3:  Phase 8 (SEO Hardening)
Day 4:  Phase 9 (Deploy)
Day 4:  Phase 10 (Monetization — Stripe, AdSense prep)
Week 2: Phase 11 (DEP License Enrichment — as registry populates)
Week 2: Phase 12 (Post-Launch Growth — GSC, outreach, blog cadence)
```

---

## 3. Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Next.js | 15+ | App Router, static generation |
| React | 19 | UI framework |
| TypeScript | 5+ | Type safety, strict mode |
| Tailwind CSS | 3.x | Styling (NOT v4 — typography plugin incompatible) |
| Supabase | Free tier | PostgreSQL database |
| Vercel | Free tier | Hosting + CDN + auto-deploy |
| Lucide React | 0.383+ | Icon library |
| Resend | Free tier | Transactional email |
| Stripe | Payment Links only | Featured listing payments |
| Apify | Starter tier | Google Maps scraping (via MCP) |
| Ahrefs | Lite plan | SEO audit + rank tracking |

---

## 4. Niche Variables

```
Service name (singular):          "grease trap cleaning"
Service name (plural):            "grease trap cleaning services"
Provider term (singular):         "grease trap service company"
Provider term (plural):           "grease trap service companies"
Primary regulation:               "Chapter 62-705 F.A.C."
Regulation full name:             "Florida Grease Waste Removal and Disposal (Section 403.0741, Florida Statutes)"
Licensing body:                   "Florida DEP"
Licensing body full name:         "Florida Department of Environmental Protection"
Target customer:                  "restaurant owners, food service facility managers, property managers"
Service frequency:                "monthly to quarterly (30-90 days depending on county)"
Average job value:                "$200-500 per pump-out, $2,000-10,000/year contract"
Geographic market:                "US — Florida only (67 counties)"
Apify search term format:         "grease trap cleaning [City] FL"
Additional Apify terms:           "grease trap pumping [City] FL", "grease interceptor cleaning [City] FL", "FOG service [City] FL"
Industry association URL:         none (use DEP grease waste page: floridadep.gov/waste/permitting-compliance-assistance/content/grease-waste)
Google Maps category keywords:    "grease, trap, interceptor, FOG, pumping, grease trap, grease cleaning, grease waste"
Blacklist category keywords:      "residential plumber, drain cleaning only, sewer only, septic only, HVAC, janitorial, carpet, pressure washing"
Price for featured listing:       "$49/month"
Domain:                           "greasetrapflorida.com"
```

---

## 5. Database Schema

### Core Tables

```sql
-- BUSINESSES (core listing data)
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  phone_unformatted TEXT,
  email TEXT,
  website TEXT,
  address TEXT,
  city TEXT NOT NULL,
  county TEXT,
  county_slug TEXT,
  state TEXT NOT NULL DEFAULT 'Florida',
  state_abbreviation TEXT NOT NULL DEFAULT 'FL',
  zip TEXT,
  lat DECIMAL(9,6),
  lng DECIMAL(9,6),
  description TEXT,
  rating DECIMAL(3,1),
  review_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  is_claimed BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  -- Grease trap specific fields
  dep_licensed BOOLEAN DEFAULT FALSE,
  dep_license_number TEXT,
  dep_license_status TEXT DEFAULT 'not_verified',
  emergency_24_7 BOOLEAN DEFAULT FALSE,
  manifest_provided BOOLEAN DEFAULT FALSE,
  serves_restaurants BOOLEAN DEFAULT TRUE,
  serves_hotels BOOLEAN DEFAULT FALSE,
  serves_hospitals BOOLEAN DEFAULT FALSE,
  serves_schools BOOLEAN DEFAULT FALSE,
  serves_food_trucks BOOLEAN DEFAULT FALSE,
  years_in_business INTEGER,
  pricing_signals TEXT,
  -- Metadata
  insured BOOLEAN DEFAULT TRUE,
  featured_until TIMESTAMPTZ,
  place_id TEXT UNIQUE,
  opening_hours JSONB,
  website_status TEXT,
  enrichment_confidence TEXT DEFAULT 'low',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- COUNTIES (replaces states table for single-state directory)
CREATE TABLE counties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  business_count INTEGER DEFAULT 0,
  fog_ordinance_url TEXT,
  fog_frequency_requirement TEXT,
  fog_enforcement_agency TEXT,
  meta_title TEXT,
  meta_description TEXT,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CITIES
CREATE TABLE cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  county_slug TEXT REFERENCES counties(slug),
  county_name TEXT,
  business_count INTEGER DEFAULT 0,
  meta_title TEXT,
  meta_description TEXT,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SERVICE TYPES
CREATE TABLE service_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  meta_title TEXT,
  meta_description TEXT
);

-- ESTABLISHMENT TYPES (who uses the service)
CREATE TABLE establishment_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT
);

-- JUNCTION TABLES
CREATE TABLE business_services (
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  service_id UUID REFERENCES service_types(id) ON DELETE CASCADE,
  PRIMARY KEY (business_id, service_id)
);

CREATE TABLE business_establishment_types (
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  establishment_type_id UUID REFERENCES establishment_types(id) ON DELETE CASCADE,
  PRIMARY KEY (business_id, establishment_type_id)
);

-- SERVICE AREAS (which counties/cities a business serves)
CREATE TABLE business_service_areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  county_slug TEXT,
  city_slug TEXT
);

-- USER INTERACTION TABLES
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id),
  business_name TEXT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  establishment_type TEXT,
  trap_size TEXT,
  urgency TEXT,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id),
  business_name TEXT,
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
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE content_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'blog',
  image_url TEXT,
  meta_title TEXT,
  meta_description TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES
CREATE INDEX idx_businesses_county ON businesses(county_slug);
CREATE INDEX idx_businesses_city ON businesses(city, county_slug);
CREATE INDEX idx_businesses_featured ON businesses(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_businesses_slug ON businesses(slug);
CREATE INDEX idx_businesses_dep ON businesses(dep_licensed) WHERE dep_licensed = TRUE;
CREATE INDEX idx_businesses_place_id ON businesses(place_id);
CREATE INDEX idx_cities_county ON cities(county_slug);
CREATE INDEX idx_content_pages_published ON content_pages(published_at) WHERE published_at IS NOT NULL;
CREATE INDEX idx_content_pages_category ON content_pages(category);
CREATE INDEX idx_business_service_areas_business ON business_service_areas(business_id);
CREATE INDEX idx_business_service_areas_county ON business_service_areas(county_slug);
```

---

## 6. Seed Data

### Service Types (10)

| Name | Slug |
|---|---|
| Grease Trap Cleaning | grease-trap-cleaning |
| Grease Interceptor Pumping | grease-interceptor-pumping |
| Grease Trap Installation | grease-trap-installation |
| Grease Trap Repair & Replacement | grease-trap-repair-replacement |
| Hydro Jetting | hydro-jetting |
| Used Cooking Oil Collection | used-cooking-oil-collection |
| Emergency Overflow Service | emergency-overflow-service |
| FOG Compliance Consulting | fog-compliance-consulting |
| Grease Trap Inspection | grease-trap-inspection |
| Drain Line Cleaning | drain-line-cleaning |

### Establishment Types (10)

| Name | Slug |
|---|---|
| Restaurants | restaurants |
| Hotels & Resorts | hotels-resorts |
| School Cafeterias | school-cafeterias |
| Hospital Kitchens | hospital-kitchens |
| Catering Companies | catering-companies |
| Food Trucks | food-trucks |
| Shopping Mall Food Courts | shopping-mall-food-courts |
| Corporate Cafeterias | corporate-cafeterias |
| Bakeries | bakeries |
| Bars & Nightclubs | bars-nightclubs |

### Florida Counties (67)

Seed all 67 Florida counties with name, slug, and any known FOG ordinance data. Priority counties with documented FOG programs:

| County | Slug | FOG Program | Frequency Requirement |
|---|---|---|---|
| Miami-Dade | miami-dade | DERM FOG Program | 25% capacity rule |
| Hillsborough | hillsborough | Grease Management Program | Every 90 days |
| Pinellas | pinellas | Commercial Grease Management | Monthly (interceptors) |
| Orange | orange | FOG Control Program | Per permit |
| Duval | duval | JEA Preferred Hauler Program | Per permit |
| Sarasota | sarasota | FOG Program (since 2020) | 30 days (traps), 90 days (interceptors) |
| Palm Beach | palm-beach | SWA Grease Program | Per permit |
| Broward | broward | FOG Control | Per permit |
| Lee | lee | FOG Ordinance | Per permit |
| Volusia | volusia | FOG Program | Per permit |

Remaining 57 counties: seed with name and slug only, content added during Phase 7C.

---

## 7. Page Architecture

### URL Structure

```
/                                    Homepage
/companies                           Master directory (paginated 24/page)
/companies/[slug]                    Individual business listing
/county                              Counties index (browse by county)
/county/[county-slug]                County directory page
/city/[city-slug]                    City directory page
/services                            Services index
/services/[type-slug]                Service filter page
/compliance                          Compliance hub (pillar)
/compliance/chapter-62-705-guide     Chapter 62-705 explained
/compliance/grease-waste-manifest    Manifest requirements
/compliance/penalties-and-fines      Non-compliance costs
/compliance/[county]-requirements    County-specific rules (10-15 pages)
/guides                              Guides index
/guides/[slug]                       Individual guide
/blog                                Blog index
/blog/[slug]                         Individual blog post
/cost                                Cost guide hub
/cost/grease-trap-cleaning-cost      Statewide cost guide
/compare                             Side-by-side comparison tool
/claim-listing                       Business claim form
/advertise                           Featured listing sales page
/get-quotes                          Multi-step quote request
/about                               About page
/contact                             Contact form
/privacy                             Privacy policy
/cities                              All cities index (sitemap helper)
/sitemap.xml                         XML sitemap
/robots.txt                          Robots directives
```

**Estimated page count at launch:**
- 1 homepage
- 1 master directory + 300-500 listing pages
- 1 counties index + 20-30 county pages
- 50-80 city pages
- 1 services index + 10 service pages
- 1 compliance hub + 1 Chapter 62-705 + 1 manifest + 1 penalties + 10-15 county compliance pages
- 1 guides index + 4 cornerstone guides + 10-12 supporting guides
- 1 blog index + 6 blog posts
- 1 cost hub + 1 cost guide
- 8 utility pages (compare, claim, advertise, get-quotes, about, contact, privacy, cities)
- **Total: 440-680 pages**

---

## 8. Content Strategy

### 4 Cornerstone Guides (1,500+ words each)

1. **Chapter 62-705 Compliance Guide** — `/compliance/chapter-62-705-guide`
   The definitive plain-English explainer of Florida's grease waste law. What originators must do, what haulers must do, the manifest system, penalty structure, enforcement timeline. Target: "Florida grease waste law", "Chapter 62-705", "Florida grease trap regulations"

2. **Grease Trap Cleaning Cost in Florida** — `/cost/grease-trap-cleaning-cost`
   Pricing by trap size, frequency, region, establishment type. Interior traps vs underground interceptors. What affects cost. Target: "grease trap cleaning cost Florida" (250/mo, KD 0)

3. **How to Choose a Grease Trap Service in Florida** — `/guides/how-to-choose-grease-trap-service`
   Decision framework: DEP licensing, emergency availability, manifest compliance, pricing transparency, service areas, equipment capabilities. Target: "how to choose grease trap cleaning company"

4. **Grease Trap Cleaning Frequency Guide** — `/guides/grease-trap-cleaning-frequency-florida`
   By establishment type, trap size, county requirements. Miami-Dade 25% rule, Pinellas monthly, Sarasota 30/90, Hillsborough 90 days. Target: "how often clean grease trap Florida"

### 10 Supporting Guides (800-1,200 words each)

5. Grease Trap vs Grease Interceptor — What's the Difference
6. What Happens If You Fail a FOG Inspection in Florida
7. Florida Grease Waste Service Manifest — What Restaurants Must Know
8. How to Verify Your Grease Hauler Is DEP Licensed
9. Grease Trap Sizing Guide for Florida Restaurants
10. Emergency Grease Trap Overflow — What to Do
11. Starting a Restaurant in Florida — Grease Trap Compliance Checklist
12. Grease Trap Maintenance Tips Between Professional Cleanings
13. Florida FOG Fines and Penalties — What Non-Compliance Costs
14. Used Cooking Oil Recycling vs Grease Trap Waste — Different Systems

### 10-15 County Compliance Pages (400-600 words each)

Located at `/compliance/[county]-requirements`. One per county with a documented FOG program. Template-based with county-specific variables: local ordinance details, enforcement agency, pump-out frequency, local contact info, link to county directory page.

### 6 Blog Posts (800+ words each)

1. "5 Warning Signs Your Grease Trap Needs Immediate Cleaning"
2. "What a Professional Grease Trap Cleaning Actually Looks Like"
3. "How Grease Trap Maintenance Affects Your Health Inspection Score"
4. "Food Truck Grease Trap Requirements in Florida"
5. "Opening a Restaurant in Florida? Your Complete Grease Compliance Checklist"
6. "6 Grease Trap Myths Florida Restaurant Owners Still Believe"

---

## 9. Design System (60/30/10 Principle) — QuoteIQ-Inspired

```css
/* 60% — Clean backgrounds */
--color-bg: #FFFFFF;
--color-bg-alt: #FAFAFA;
--color-bg-card: #FFFFFF;

/* 30% — Dark authority */
--color-primary: #1A1A1A;
--color-text: #1A1A1A;
--color-text-muted: #6B7280;
--color-hero-overlay: rgba(0, 0, 0, 0.55);
--color-footer-bg: #1A1A1A;

/* 10% — Warm amber/gold accent (like QuoteIQ) */
--color-accent: #F59E0B;
--color-accent-dark: #D97706;
--color-accent-light: #FEF3C7;

/* Semantic */
--color-verified: #10B981;
--color-featured: #F59E0B;
--color-emergency: #EF4444;
--color-border: #E5E7EB;
```

**Typography:** Inter (Google Fonts, variable weight). Single font only.

**Design rules:**
- Mobile-first (restaurant owners search on phones)
- Bold, modern, professional with warm amber accent
- Cards: white bg, rounded-xl, border border-gray-100, shadow-sm, hover:shadow-md transition
- Primary buttons: bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg px-6 py-3
- Secondary buttons: bg-white border-2 border-amber-500 text-amber-600 rounded-lg px-6 py-3
- Full viewport hero with dark overlay, transparent-to-solid header
- Dark #1A1A1A footer and CTA sections
- Lucide React icons throughout (consistent 20px default size)

---

## 10. Components (25+)

### Layout
- Header (solid white, dark text — no transparent mode needed for this build)
- Footer (primary bg, 4-column grid, compliance badges)
- Breadcrumbs (BreadcrumbList JSON-LD)
- MobileMenu

### Directory
- ListingCard (business card for county/city/service pages)
- ListingGrid (responsive grid of ListingCards)
- BusinessDetails (full listing page layout)
- LeadForm (sticky sidebar on desktop, bottom CTA on mobile)
- ServicePills (service type badges on cards)
- TrustBadges (DEP Licensed, 24/7 Emergency, Manifest Provided, Insured)
- CompareCheckbox + CompareBar + CompareTable

### Navigation
- SearchBar (county/city autocomplete)
- CountyGrid (browse by county — replaces state map)
- PopularCities (top 12 by business count)
- FilterBar (services, emergency, DEP licensed)
- Pagination

### Content
- GuideCard (for guides/blog index)
- FAQ (accordion with FAQPage JSON-LD)
- AreaContent (county/city-specific templated content)
- BusinessCTA ("Own this business? Claim your listing")
- AdUnit (lazy-loaded, returns null when no pub ID)

### Forms
- ContactForm
- ClaimForm
- QuoteWizard (multi-step: location → service → contact → confirm)

### Utility
- Stars (rating display)
- Badge (generic badge component)
- ExternalLink (with rel="noopener noreferrer")
- PhoneButton (click-to-call)
- StructuredData (JSON-LD renderer)

---

## 11. SEO Rules (Non-Negotiable — 18 items)

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

---

## 12. AEO/GEO Rules

1. Every content page opens with 2-3 sentence direct answer to target query
2. Named entities with definitions on first mention
3. Specific numbers, statistics, data points throughout
4. Authoritative sourcing language
5. Concise meta descriptions that answer the query
6. FAQPage JSON-LD on every page with FAQ content

---

## 13. Meta Title Templates

| Page Type | Template | Example |
|---|---|---|
| Homepage | `Find Grease Trap Services in Florida` | — |
| Listing | `[Name] - Grease Trap Service [City], FL` | "Eco Pump Services - Grease Trap Service Miami, FL" |
| County | `Grease Trap Cleaning in [County], FL` | "Grease Trap Cleaning in Miami-Dade County, FL" |
| City | `Grease Trap Cleaning [City], Florida` | "Grease Trap Cleaning Miami, Florida" |
| Service | `[Service] Services in Florida` | "Emergency Overflow Services in Florida" |
| Guide | `[Guide Title] - GraseTrapFlorida` | "Chapter 62-705 Guide - GreaseTrapFlorida" |
| Blog | `[Post Title] - GreaseTrapFlorida` | — |
| Compliance | `[Topic] - Florida Grease Compliance` | "Penalties & Fines - Florida Grease Compliance" |

**ALL under 60 characters. Verify before deploy.**

---

## 14. JSON-LD Schemas Per Page Type

| Page Type | Schemas |
|---|---|
| Homepage | WebSite + SearchAction + BreadcrumbList |
| Listing | LocalBusiness + BreadcrumbList + FAQPage |
| County/City | ItemList + BreadcrumbList + FAQPage |
| Service | ItemList + BreadcrumbList + FAQPage |
| Guide | Article + BreadcrumbList + FAQPage |
| Blog post | Article + BreadcrumbList + FAQPage |
| Compliance | Article + BreadcrumbList + FAQPage |

---

## 15. Data Pipeline

### Phase 3: Collection (Apify via MCP)

**Actor:** `compass/google-maps-extractor`
**Config:**
```json
{
  "maxCrawledPlacesPerSearch": 80,
  "language": "en",
  "countryCode": "us",
  "skipClosedPlaces": true,
  "maxQuestions": 0,
  "scrapePlaceDetailPage": false,
  "scrapeContacts": false
}
```

**Search terms per city:**
- "grease trap cleaning [City] FL"
- "grease trap pumping [City] FL"
- "grease interceptor cleaning [City] FL"
- "FOG service [City] FL"

**Tier 1 cities (max 80 each):** Miami, Tampa, Orlando, Jacksonville, Fort Lauderdale, St Petersburg, Hialeah, Tallahassee, West Palm Beach, Sarasota

**Tier 2 cities (max 50 each):** Fort Myers, Naples, Cape Coral, Clearwater, Gainesville, Lakeland, Daytona Beach, Kissimmee, Boca Raton, Pompano Beach, Coral Springs, Hollywood, Pembroke Pines, Port St Lucie

**Tier 3 cities (max 30 each):** Ocala, Pensacola, Palm Bay, Melbourne, Deltona, Bradenton, Panama City, Key West, Stuart, Vero Beach, Bonita Springs, Winter Haven, Sanford, Apopka, Deland, Leesburg

**Total: 40 cities × 4 search terms = 160 Apify searches**
**Expected budget: $15-25**

### Phase 4: Cleaning

**Hard exclude filters:**
- permanentlyClosed or temporarilyClosed
- isAdvertisement
- No phone AND no website
- Blacklist: "residential plumber", "drain cleaning" (without "grease"), "sewer only", "septic only" (without "grease"), "HVAC", "janitorial", "carpet", "pressure washing"
- Zero reviews AND no website AND no phone
- Outside Florida (check state field)

**Three-tier dedup:**
1. place_id exact match
2. Phone normalized to last 10 digits
3. Name + zip (lowercase, remove Inc/LLC/Corp)

### Phase 5: Website Scraper + Enrichment

**Custom async scraper (scripts/scrape-websites.mjs):**
- For each business with a website URL
- Fetch 3 pages: homepage, /services (or variants), /about (or variants)
- Concurrent: 5-10 at a time
- Timeout: 8 seconds per page
- Output: raw HTML/text saved per business

**Claude API enrichment pass (scripts/enrich-data.mjs):**
- Send combined page text to Claude Sonnet
- Extract structured data: services_offered, service_areas, emergency_24_7, certifications, email, pricing_signals, years_in_business, establishment types served, manifest_provided, company_description
- Output: enriched.json

### Phase 6: Database Population

**Insert order:**
1. Counties (all 67)
2. Cities (only those with 2+ businesses)
3. Businesses
4. Junction tables (business_services, business_establishment_types, business_service_areas)
5. Update counts (business_count on counties and cities)

**City threshold: 2+ businesses minimum for a city page.**

---

## 16. Monetization Roadmap

### Launch Day
- LeadForm on every listing page → emails to admin
- Featured listings → Stripe Payment Link ($49/month)
- Claim listing → relationship building → upsell to featured

### Month 1
- AdSense application (if 500+ sessions)
- Email top 50 businesses pitching featured listings
- Email DEP-licensed businesses pitching claim + featured

### Month 2-3
- Tiered listings ($49/$99/$149)
- Lead fees (charge per qualified lead)
- Affiliate: grease trap equipment, compliance consulting

---

## 17. Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Resend (email)
RESEND_API_KEY=
RESEND_FROM_EMAIL=hello@greasetrapflorida.com
ADMIN_EMAIL=

# Site
NEXT_PUBLIC_SITE_URL=https://greasetrapflorida.com
NEXT_PUBLIC_SITE_NAME=Grease Trap Florida

# Apify (for data scripts via MCP)
APIFY_TOKEN=

# Claude API (for enrichment scripts)
ANTHROPIC_API_KEY=

# Stripe (featured listings)
NEXT_PUBLIC_STRIPE_FEATURED_LINK=

# Analytics (add when ready)
NEXT_PUBLIC_GA_ID=

# AdSense (add when approved)
NEXT_PUBLIC_ADSENSE_PUB_ID=
```

---

## 18. Next.js Configuration

```typescript
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.greasetrapflorida.com" }],
        destination: "https://greasetrapflorida.com/:path*",
        permanent: true, // 308
      },
    ];
  },
};

export default nextConfig;
```

---

## 19. Supabase Client Setup

**Static client (for generateStaticParams + server components at build time):**
```typescript
import { createClient } from "@supabase/supabase-js";

export function createStaticClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
```

**Server client (for API routes with request context):**
```typescript
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );
}
```

---

## 20. Pagination Pattern

```typescript
// Correct: always paginate junction table queries
const PAGE_SIZE = 1000;
let allData: any[] = [];
let from = 0;
let hasMore = true;

while (hasMore) {
  const { data, error } = await supabase
    .from("business_services")
    .select("*")
    .range(from, from + PAGE_SIZE - 1);

  if (error) throw error;
  allData = [...allData, ...(data || [])];
  hasMore = (data?.length || 0) === PAGE_SIZE;
  from += PAGE_SIZE;
}
```

---

## 21. Listing Card Design

```
┌─────────────────────────────────────────────────┐
│  [accent-top-border: teal=verified, amber=featured, gray=default]
│                                                   │
│  [Business Name]                    ★ 4.8 (127)  │
│  Miami-Dade County, FL                            │
│                                                   │
│  ✓ Grease Trap Cleaning  ✓ Interceptor Pumping   │
│  ✓ 24/7 Emergency        ✓ Manifest Provided     │
│                                                   │
│  Serves: Miami, Hialeah, Doral, Coral Gables     │
│                                                   │
│  [DEP Licensed ✓]  [ShieldCheck icon]            │
│                                                   │
│  ┌─────────────────────────────────────────────┐ │
│  │          Get a Free Quote                    │ │
│  └─────────────────────────────────────────────┘ │
│  ☐ Compare                                       │
└─────────────────────────────────────────────────┘
```

---

## 22. Known Gotchas (23 items from previous builds)

1. Deploy before SEO audit → Ahrefs Health Score 8/100
2. "%s | Site Name" title template → titles over 60 chars
3. String ratings in JSON-LD → schema validation errors
4. Mismatched generateStaticParams/page queries → silent 404s
5. Unpaginated junction table queries → data missing above 1,000 rows
6. Unicode escapes → broken characters in production
7. Linking to non-existent city pages → broken internal links
8. Shallow OG metadata merge → missing OG images
9. `node -e` on Windows → escaping issues, use .mjs files
10. Module-level Resend init → build crashes when API key absent
11. Missing `sizes` on Image components → warnings + layout shift
12. Wrong redirect type (307 vs 308) → non-permanent www redirect
13. Supabase `.in()` URL limit → batch in 100-ID chunks
14. `createClient()` in generateStaticParams → cookies() unavailable at build time
15. useSearchParams() in root layout → BAILOUT_TO_CLIENT_SIDE_RENDERING
16. Tailwind v4 Typography plugin → incompatible, use custom CSS
17. Build-required files in gitignored directories → Module not found on Vercel
18. Wrong Supabase env vars in Vercel → empty pages, no build error
19. Redeploy without clearing build cache → stale static pages
20. Blog published_at timezone → future times cause posts to disappear
21. Gemini image double-nesting → /images/images/ path mismatch
22. First Vercel build 6-10 min → don't cancel
23. Association directory system phones → >10% same phone = exclude

---

## 23. Claude Code Instructions (Standing Orders)

```
Every session starts with:
  Read greasetrapflorida-blueprint.md and PHASE-STATUS.md in full before doing anything.

Every session ends with:
  Update PHASE-STATUS.md with what was completed, what changed, and what's next.
  If anything deviated from the blueprint, update the blueprint too.

Standing technical orders:
  - TypeScript strict mode
  - No `any` types
  - Literal characters only — no Unicode escapes
  - All Supabase queries paginated
  - All SDK clients lazy-initialized
  - All Image components include `sizes`
  - Absolute meta titles only
  - Icons: Lucide React only (import from "lucide-react")
  - npm run build — zero errors (gate for every phase)
```

---

## 24. Sitemap Strategy

Generate `/app/sitemap.ts` that queries Supabase for all:
- Business slugs → `/companies/[slug]`
- County slugs → `/county/[slug]`
- City slugs → `/city/[slug]`
- Service type slugs → `/services/[slug]`
- Content page slugs → `/guides/[slug]`, `/blog/[slug]`
- Compliance page slugs → `/compliance/[slug]`
- Static pages → /, /companies, /county, /services, /guides, /blog, /compliance, /cost, /compare, /about, /contact, /privacy, /claim-listing, /advertise, /get-quotes, /cities

All URLs absolute with `https://greasetrapflorida.com` prefix.

---

*Blueprint version 1.0 — Based on DIRECTORY-BUILDER-PLAYBOOK.md v2.0*
*Niche validated: April 2026 | Domain secured: greasetrapflorida.com*

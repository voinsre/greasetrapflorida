#!/usr/bin/env node

/**
 * Phase 5 — Enrichment pipeline
 *
 * Reads: data/scraped-websites.json  (scraped page text per business)
 *        data/cleaned.json           (business base data)
 * Writes: data/enriched.json         (cleaned businesses + extracted fields)
 *
 * Uses rule-based keyword/pattern extraction on scraped website text.
 * No API calls — fast, deterministic, zero cost.
 *
 * Extracted fields per business:
 *   is_grease_trap_service, services_offered, service_areas,
 *   emergency_24_7, email, pricing_signals, years_in_business,
 *   establishment_types_served, manifest_provided, company_description,
 *   enrichment_confidence
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const SCRAPED_PATH = resolve(ROOT, "data", "scraped-websites.json");
const CLEANED_PATH = resolve(ROOT, "data", "cleaned.json");
const OUTPUT_PATH = resolve(ROOT, "data", "enriched.json");

// ─────────────────────────────────────────────
// SERVICE DETECTION PATTERNS
// ─────────────────────────────────────────────

const SERVICE_PATTERNS = [
  { slug: "grease-trap-cleaning", pattern: /grease\s*trap\s*clean/i, label: "Grease Trap Cleaning" },
  { slug: "grease-interceptor-pumping", pattern: /grease\s*interceptor\s*(pump|clean|service)/i, label: "Grease Interceptor Pumping" },
  { slug: "grease-trap-installation", pattern: /grease\s*trap\s*install/i, label: "Grease Trap Installation" },
  { slug: "grease-trap-repair-replacement", pattern: /grease\s*trap\s*(repair|replac)/i, label: "Grease Trap Repair & Replacement" },
  { slug: "hydro-jetting", pattern: /hydro[\s-]*jet/i, label: "Hydro Jetting" },
  { slug: "used-cooking-oil-collection", pattern: /(used\s*cooking\s*oil|UCO|yellow\s*grease)\s*(collect|recycl|pickup|pick[\s-]*up)/i, label: "Used Cooking Oil Collection" },
  { slug: "emergency-overflow-service", pattern: /(emergency|overflow|urgent)\s*(grease|trap|interceptor|service|clean|pump)/i, label: "Emergency Overflow Service" },
  { slug: "fog-compliance-consulting", pattern: /(FOG|fats?\s*oils?\s*(?:and\s*)?grease)\s*(compliance|consult|program|management)/i, label: "FOG Compliance Consulting" },
  { slug: "grease-trap-inspection", pattern: /grease\s*trap\s*inspect/i, label: "Grease Trap Inspection" },
  { slug: "drain-line-cleaning", pattern: /drain\s*(line|pipe)?\s*clean/i, label: "Drain Line Cleaning" },
];

// Broader grease-related keywords for is_grease_trap_service classification
const GREASE_KEYWORDS = [
  /grease\s*trap/i,
  /grease\s*interceptor/i,
  /grease\s*clean/i,
  /grease\s*pump/i,
  /grease\s*removal/i,
  /grease\s*waste/i,
  /FOG\s*(program|compliance|service|removal|management|clean)/i,
  /fats?\s*oils?\s*(?:and\s*)?grease/i,
  /interceptor\s*(clean|pump|service|maintenance)/i,
  /trap\s*clean/i,
];

// ─────────────────────────────────────────────
// ESTABLISHMENT TYPE PATTERNS
// ─────────────────────────────────────────────

const ESTABLISHMENT_PATTERNS = [
  { slug: "restaurants", pattern: /\brestaurant/i, label: "Restaurants" },
  { slug: "hotels-resorts", pattern: /\b(hotel|resort|hospitality)/i, label: "Hotels & Resorts" },
  { slug: "school-cafeterias", pattern: /\b(school|cafeteria|university|college|campus)/i, label: "School Cafeterias" },
  { slug: "hospital-kitchens", pattern: /\b(hospital|medical\s*center|healthcare\s*facilit)/i, label: "Hospital Kitchens" },
  { slug: "catering-companies", pattern: /\bcatering/i, label: "Catering Companies" },
  { slug: "food-trucks", pattern: /\bfood\s*truck/i, label: "Food Trucks" },
  { slug: "shopping-mall-food-courts", pattern: /\b(food\s*court|shopping\s*(mall|center|centre))/i, label: "Shopping Mall Food Courts" },
  { slug: "corporate-cafeterias", pattern: /\b(corporate|office)\s*(cafeteria|kitchen|dining)/i, label: "Corporate Cafeterias" },
  { slug: "bakeries", pattern: /\bbaker(y|ies)/i, label: "Bakeries" },
  { slug: "bars-nightclubs", pattern: /\b(bar|nightclub|pub|lounge|brewery|taproom)/i, label: "Bars & Nightclubs" },
];

// ─────────────────────────────────────────────
// FLORIDA CITY / AREA PATTERNS
// ─────────────────────────────────────────────

const FL_CITIES = [
  "Miami", "Tampa", "Orlando", "Jacksonville", "Fort Lauderdale",
  "St Petersburg", "St. Petersburg", "Hialeah", "Tallahassee",
  "West Palm Beach", "Sarasota", "Fort Myers", "Naples", "Cape Coral",
  "Clearwater", "Gainesville", "Lakeland", "Daytona Beach", "Kissimmee",
  "Boca Raton", "Pompano Beach", "Coral Springs", "Hollywood",
  "Pembroke Pines", "Port St Lucie", "Port St. Lucie", "Ocala",
  "Pensacola", "Palm Bay", "Melbourne", "Deltona", "Bradenton",
  "Panama City", "Key West", "Stuart", "Vero Beach", "Bonita Springs",
  "Winter Haven", "Sanford", "Apopka", "Deland", "Leesburg",
  "Homestead", "Doral", "Coral Gables", "Aventura", "Plantation",
  "Sunrise", "Miramar", "Deerfield Beach", "Boynton Beach",
  "Delray Beach", "Jupiter", "Palm Beach Gardens", "Lake Worth",
  "Wellington", "Brandon", "Riverview", "Largo", "Dunedin",
  "Tarpon Springs", "Palm Harbor", "Ocoee", "Winter Garden",
  "Winter Park", "Clermont", "Altamonte Springs", "Oviedo",
  "Lake Mary", "Port Charlotte", "Punta Gorda", "Venice",
  "North Port", "Englewood", "Palm Coast", "St Augustine",
  "Fernandina Beach", "Orange Park", "New Port Richey",
  "Wesley Chapel", "Zephyrhills", "Brooksville", "Inverness",
  "Crystal River", "Spring Hill", "Sebring", "Avon Park",
  "Lake City", "Live Oak", "Perry", "Crestview", "Destin",
  "Fort Walton Beach", "Niceville", "Panama City Beach",
  "Marco Island", "Immokalee", "Lehigh Acres", "Estero",
  "Sanibel", "Plant City", "Haines City", "Auburndale",
  "Bartow", "Lake Wales", "Palatka", "Cocoa", "Titusville",
  "Rockledge", "Merritt Island", "Cocoa Beach",
];

const FL_COUNTIES = [
  "Miami-Dade", "Broward", "Palm Beach", "Hillsborough", "Pinellas",
  "Orange", "Duval", "Lee", "Collier", "Sarasota", "Manatee",
  "Volusia", "Brevard", "Seminole", "Osceola", "Polk", "St. Lucie",
  "Martin", "Indian River", "Escambia", "Santa Rosa", "Okaloosa",
  "Bay", "Marion", "Lake", "Monroe", "Pasco", "Hernando", "Citrus",
  "Flagler", "St. Johns", "Clay", "Nassau", "Charlotte", "Alachua",
  "Leon", "Highlands", "Columbia", "Sumter", "Putnam",
];

// ─────────────────────────────────────────────
// EXTRACTION FUNCTIONS
// ─────────────────────────────────────────────

function detectIsGreaseTrapService(text, categories) {
  // Check scraped text
  if (text) {
    for (const kw of GREASE_KEYWORDS) {
      if (kw.test(text)) return true;
    }
  }
  // Check Google Maps categories
  if (categories) {
    const catText = (Array.isArray(categories) ? categories.join(" ") : String(categories)).toLowerCase();
    if (catText.includes("grease") || catText.includes("interceptor")) return true;
  }
  return false;
}

function extractServices(text) {
  if (!text) return [];
  const found = [];
  for (const sp of SERVICE_PATTERNS) {
    if (sp.pattern.test(text)) {
      found.push({ slug: sp.slug, label: sp.label });
    }
  }
  return found;
}

function extractEstablishmentTypes(text) {
  if (!text) return [];
  const found = [];
  for (const ep of ESTABLISHMENT_PATTERNS) {
    if (ep.pattern.test(text)) {
      found.push({ slug: ep.slug, label: ep.label });
    }
  }
  return found;
}

function extractServiceAreas(text) {
  if (!text) return [];
  const areas = new Set();
  for (const city of FL_CITIES) {
    // Use word boundary-like matching — city names can be multi-word
    const escaped = city.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`\\b${escaped}\\b`, "i");
    if (re.test(text)) areas.add(city);
  }
  for (const county of FL_COUNTIES) {
    const escaped = county.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`\\b${escaped}\\s*(county)?\\b`, "i");
    if (re.test(text)) areas.add(county + " County");
  }
  return Array.from(areas);
}

function detectEmergency(text, openingHours) {
  if (text) {
    if (/24\s*\/?\s*7/i.test(text)) return true;
    if (/emergency\s*(service|response|clean|pump|available|call)/i.test(text)) return true;
    if (/after[\s-]*hours?\s*(service|available|emergency|call)/i.test(text)) return true;
    if (/open\s*24\s*hours/i.test(text)) return true;
  }
  // Check Google opening hours
  if (openingHours && Array.isArray(openingHours)) {
    const all24 = openingHours.every(
      (h) => h.hours && /24\s*hours/i.test(h.hours)
    );
    if (all24 && openingHours.length >= 7) return true;
  }
  return false;
}

function extractEmail(text) {
  if (!text) return null;
  const match = text.match(/\b[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}\b/);
  if (match) {
    const email = match[0].toLowerCase();
    // Skip common non-business emails
    if (email.includes("example.com") || email.includes("sentry.io") || email.includes("wixpress")) return null;
    return email;
  }
  return null;
}

function extractPricingSignals(text) {
  if (!text) return null;
  const signals = [];

  // Dollar amounts
  const priceMatch = text.match(/\$\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/g);
  if (priceMatch) {
    signals.push(...priceMatch.slice(0, 3));
  }

  // Pricing keywords
  if (/free\s*(estimate|quote|consultation)/i.test(text)) signals.push("Free estimates");
  if (/no\s*(hidden|extra)\s*(fee|charge|cost)/i.test(text)) signals.push("No hidden fees");
  if (/competitive\s*(pric|rate)/i.test(text)) signals.push("Competitive pricing");
  if (/affordable/i.test(text)) signals.push("Affordable");
  if (/flat\s*rate/i.test(text)) signals.push("Flat rate");
  if (/starting\s*(at|from)/i.test(text)) signals.push("Starting price listed");
  if (/monthly\s*(plan|service|contract|agreement)/i.test(text)) signals.push("Monthly plans");

  return signals.length > 0 ? signals.join("; ") : null;
}

function extractYearsInBusiness(text) {
  if (!text) return null;

  // "XX years" patterns
  const yearsMatch = text.match(/(\d{1,3})\+?\s*years?\s*(of\s*)?(experience|in\s*business|serving|of\s*service)/i);
  if (yearsMatch) {
    const y = parseInt(yearsMatch[1], 10);
    if (y > 0 && y < 150) return y;
  }

  // "since YYYY" patterns
  const sinceMatch = text.match(/(?:since|established|founded|est\.?)\s*(\d{4})/i);
  if (sinceMatch) {
    const year = parseInt(sinceMatch[1], 10);
    if (year > 1900 && year <= 2026) return 2026 - year;
  }

  // "over XX years"
  const overMatch = text.match(/over\s*(\d{1,3})\s*years/i);
  if (overMatch) {
    const y = parseInt(overMatch[1], 10);
    if (y > 0 && y < 150) return y;
  }

  return null;
}

function detectManifest(text) {
  if (!text) return false;
  return /manifest/i.test(text) && /(grease|waste|haul|transport|pump|service)/i.test(text);
}

function extractDescription(text, name) {
  if (!text) return null;

  // Try to find a meta-description-like sentence near the business name
  const sentences = text.split(/[.!?]+/).map((s) => s.trim()).filter((s) => s.length > 30 && s.length < 300);

  // Prefer sentences mentioning grease/trap
  const greaseSentences = sentences.filter(
    (s) => /grease|trap|interceptor|FOG|pump/i.test(s)
  );

  // Prefer sentences mentioning the business name
  const nameWord = name ? name.split(/\s+/)[0] : "";
  const namedSentences = greaseSentences.filter(
    (s) => nameWord && s.toLowerCase().includes(nameWord.toLowerCase())
  );

  const best = namedSentences[0] || greaseSentences[0] || null;
  return best ? best.slice(0, 280) : null;
}

function calculateConfidence(enriched, hasText) {
  if (!hasText) return "low";
  let score = 0;
  if (enriched.is_grease_trap_service) score += 2;
  if (enriched.services_offered.length >= 2) score += 2;
  if (enriched.service_areas.length >= 1) score += 1;
  if (enriched.email) score += 1;
  if (enriched.years_in_business) score += 1;
  if (enriched.description) score += 1;
  if (enriched.establishment_types_served.length >= 1) score += 1;
  if (enriched.emergency_24_7) score += 1;

  if (score >= 6) return "high";
  if (score >= 3) return "medium";
  return "low";
}

// ─────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────

function main() {
  console.log("=== Phase 5: Enrichment Pipeline ===\n");

  if (!existsSync(SCRAPED_PATH)) {
    console.error("ERROR: data/scraped-websites.json not found. Run scrape-websites.mjs first.");
    process.exit(1);
  }
  if (!existsSync(CLEANED_PATH)) {
    console.error("ERROR: data/cleaned.json not found.");
    process.exit(1);
  }

  const scraped = JSON.parse(readFileSync(SCRAPED_PATH, "utf-8"));
  const cleaned = JSON.parse(readFileSync(CLEANED_PATH, "utf-8"));

  console.log(`Loaded ${scraped.length} scraped records`);
  console.log(`Loaded ${cleaned.length} cleaned businesses\n`);

  // Index scraped data by place_id
  const scrapedByPlaceId = new Map();
  const scrapedByName = new Map();
  for (const s of scraped) {
    if (s.place_id) scrapedByPlaceId.set(s.place_id, s);
    if (s.name) scrapedByName.set(s.name, s);
  }

  let enrichedCount = 0;
  let greaseConfirmed = 0;
  let greaseNot = 0;
  let withEmail = 0;
  let withDescription = 0;
  let withEmergency = 0;
  let withManifest = 0;
  let withYears = 0;
  const confidenceCounts = { high: 0, medium: 0, low: 0 };
  const servicesCounts = {};

  const enriched = cleaned.map((biz) => {
    // Find matching scraped data
    const scr = scrapedByPlaceId.get(biz.place_id) || scrapedByName.get(biz.name);
    const text = scr?.all_text_combined || "";
    const hasText = text.length > 50;

    // Combine scraped text with Google Maps data for enrichment
    const combinedText = [
      text,
      biz.name || "",
      (biz.categories || []).join(" "),
      biz.category_name || "",
      biz.description || "",
    ].join(" ");

    const isGrease = detectIsGreaseTrapService(combinedText, biz.categories);
    const services = extractServices(combinedText);
    const areas = extractServiceAreas(text);
    const emergency = detectEmergency(combinedText, biz.opening_hours);
    const email = extractEmail(text) || biz.email || null;
    const pricing = extractPricingSignals(text);
    const years = extractYearsInBusiness(text);
    const estTypes = extractEstablishmentTypes(text);
    const manifest = detectManifest(text);
    const description = extractDescription(text, biz.name) || biz.description || null;

    const enrichedBiz = {
      ...biz,
      // Enriched fields
      is_grease_trap_service: isGrease,
      services_offered: services,
      service_areas: areas,
      emergency_24_7: emergency,
      email,
      pricing_signals: pricing,
      years_in_business: years,
      establishment_types_served: estTypes,
      manifest_provided: manifest,
      description,
      // Website status from scraper
      website_status: scr?.website_status || (biz.website ? "not_scraped" : "no_website"),
      pages_fetched: scr?.pages_fetched || 0,
      // Confidence
      enrichment_confidence: "low", // calculated below
    };

    enrichedBiz.enrichment_confidence = calculateConfidence(enrichedBiz, hasText);

    // Stats
    if (hasText) enrichedCount++;
    if (isGrease) greaseConfirmed++;
    else greaseNot++;
    if (email) withEmail++;
    if (description) withDescription++;
    if (emergency) withEmergency++;
    if (manifest) withManifest++;
    if (years) withYears++;
    confidenceCounts[enrichedBiz.enrichment_confidence]++;

    for (const s of services) {
      servicesCounts[s.label] = (servicesCounts[s.label] || 0) + 1;
    }

    return enrichedBiz;
  });

  // Write output
  writeFileSync(OUTPUT_PATH, JSON.stringify(enriched, null, 2));
  console.log(`Saved ${enriched.length} enriched businesses to data/enriched.json\n`);

  // ─── SUMMARY ───
  console.log("=== ENRICHMENT SUMMARY ===");
  console.log(`Total businesses:        ${enriched.length}`);
  console.log(`With scraped text:       ${enrichedCount} (${pct(enrichedCount, enriched.length)})`);
  console.log(`Grease trap confirmed:   ${greaseConfirmed} (${pct(greaseConfirmed, enriched.length)})`);
  console.log(`Not grease (kept):       ${greaseNot}`);
  console.log(`With email extracted:    ${withEmail}`);
  console.log(`With description:        ${withDescription}`);
  console.log(`Emergency 24/7:          ${withEmergency}`);
  console.log(`Manifest mentioned:      ${withManifest}`);
  console.log(`Years in business:       ${withYears}`);

  console.log("\n=== CONFIDENCE BREAKDOWN ===");
  console.log(`  High:   ${confidenceCounts.high} (${pct(confidenceCounts.high, enriched.length)})`);
  console.log(`  Medium: ${confidenceCounts.medium} (${pct(confidenceCounts.medium, enriched.length)})`);
  console.log(`  Low:    ${confidenceCounts.low} (${pct(confidenceCounts.low, enriched.length)})`);

  console.log("\n=== SERVICES DETECTED ===");
  const sortedServices = Object.entries(servicesCounts).sort((a, b) => b[1] - a[1]);
  for (const [name, count] of sortedServices) {
    console.log(`  ${name}: ${count}`);
  }

  console.log("\n=== WEBSITE STATUS BREAKDOWN ===");
  const statusCounts = {};
  enriched.forEach((b) => {
    statusCounts[b.website_status] = (statusCounts[b.website_status] || 0) + 1;
  });
  for (const [status, count] of Object.entries(statusCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${status}: ${count}`);
  }

  const enrichmentRate = enrichedCount > 0 ? pct(enrichedCount, enriched.length) : "0%";
  console.log(`\n=== ENRICHMENT RATE: ${enrichmentRate} ===`);
}

function pct(n, total) {
  return total > 0 ? ((n / total) * 100).toFixed(1) + "%" : "0%";
}

main();

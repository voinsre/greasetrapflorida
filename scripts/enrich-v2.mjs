#!/usr/bin/env node

/**
 * Re-enrichment Step 2 — Improved enrichment for 168 confirmed businesses.
 *
 * Reads: data/scraped-websites-v2.json (improved scrape data)
 *        Supabase DB (business base data including opening_hours)
 * Writes: data/enriched-v2.json
 *
 * Improvements over v1:
 * - Expanded service keyword matching (multiple patterns per service)
 * - Strict 24/7 emergency verification (trust opening_hours over vague claims)
 * - Smart description extraction (reject nav/footer garbage)
 * - Better email filtering
 * - Full 67 FL county + expanded city matching
 *
 * Usage: node scripts/enrich-v2.mjs
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const SCRAPED_PATH = resolve(ROOT, "data", "scraped-websites-v2.json");
const OUTPUT_PATH = resolve(ROOT, "data", "enriched-v2.json");

// ── Env loader ──────────────────────────────────────────────────────────────
function loadEnv() {
  const envPath = resolve(ROOT, ".env.local");
  const lines = readFileSync(envPath, "utf-8").split("\n");
  const env = {};
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    env[trimmed.slice(0, eqIdx).trim()] = trimmed.slice(eqIdx + 1).trim();
  }
  return env;
}

// ── Expanded SERVICE PATTERNS ───────────────────────────────────────────────
const SERVICE_PATTERNS = [
  {
    slug: "grease-trap-cleaning",
    label: "Grease Trap Cleaning",
    patterns: [
      /grease\s*trap\s*clean/i,
      /trap\s*clean/i,
      /grease\s*trap\s*service/i,
      /clean\s*grease\s*trap/i,
      /grease\s*trap\s*maintenance/i,
      /grease\s*removal/i,
    ],
  },
  {
    slug: "grease-interceptor-pumping",
    label: "Grease Interceptor Pumping",
    patterns: [
      /interceptor\s*pump/i,
      /grease\s*interceptor/i,
      /interceptor\s*clean/i,
      /interceptor\s*service/i,
      /pump\s*interceptor/i,
      /interceptor\s*maintenance/i,
    ],
  },
  {
    slug: "hydro-jetting",
    label: "Hydro Jetting",
    patterns: [
      /hydro[\s-]*jet/i,
      /water\s*jet/i,
      /high\s*pressure\s*jet/i,
      /jet\s*clean/i,
      /sewer\s*jet/i,
    ],
  },
  {
    slug: "emergency-overflow-service",
    label: "Emergency Overflow Service",
    patterns: [
      /emergency/i,
      /overflow/i,
      /24\s*\/?\s*7/i,
      /24\s*hour/i,
      /after\s*hours/i,
      /same\s*day\s*service/i,
      /urgent/i,
    ],
  },
  {
    slug: "grease-trap-installation",
    label: "Grease Trap Installation",
    patterns: [
      /trap\s*install/i,
      /install\s*grease\s*trap/i,
      /new\s*grease\s*trap/i,
      /trap\s*replacement/i,
      /grease\s*trap\s*install/i,
    ],
  },
  {
    slug: "grease-trap-repair-replacement",
    label: "Grease Trap Repair & Replacement",
    patterns: [
      /trap\s*repair/i,
      /trap\s*replacement/i,
      /fix\s*grease\s*trap/i,
      /grease\s*trap\s*repair/i,
      /baffle\s*repair/i,
      /lid\s*replacement/i,
    ],
  },
  {
    slug: "grease-trap-inspection",
    label: "Grease Trap Inspection",
    patterns: [
      /trap\s*inspection/i,
      /grease\s*inspection/i,
      /FOG\s*inspection/i,
      /inspect\s*grease\s*trap/i,
      /compliance\s*inspection/i,
    ],
  },
  {
    slug: "used-cooking-oil-collection",
    label: "Used Cooking Oil Collection",
    patterns: [
      /cooking\s*oil/i,
      /used\s*oil/i,
      /oil\s*collection/i,
      /oil\s*recycl/i,
      /yellow\s*grease/i,
      /fryer\s*oil/i,
      /waste\s*oil\s*pickup/i,
    ],
  },
  {
    slug: "drain-line-cleaning",
    label: "Drain Line Cleaning",
    patterns: [
      /drain\s*clean/i,
      /drain\s*line/i,
      /sewer\s*clean/i,
      /sewer\s*line/i,
      /clogged\s*drain/i,
      /drain\s*service/i,
      /rooter/i,
    ],
  },
  {
    slug: "fog-compliance-consulting",
    label: "FOG Compliance Consulting",
    patterns: [
      /FOG\s*compliance/i,
      /compliance\s*consult/i,
      /FOG\s*program/i,
      /compliance\s*assist/i,
      /grease\s*management\s*plan/i,
      /FOG\s*audit/i,
    ],
  },
];

// ── FL Counties (all 67) ────────────────────────────────────────────────────
const FL_COUNTIES = [
  "Alachua", "Baker", "Bay", "Bradford", "Brevard", "Broward", "Calhoun",
  "Charlotte", "Citrus", "Clay", "Collier", "Columbia", "DeSoto",
  "Dixie", "Duval", "Escambia", "Flagler", "Franklin", "Gadsden",
  "Gilchrist", "Glades", "Gulf", "Hamilton", "Hardee", "Hendry",
  "Hernando", "Highlands", "Hillsborough", "Holmes", "Indian River",
  "Jackson", "Jefferson", "Lafayette", "Lake", "Lee", "Leon", "Levy",
  "Liberty", "Madison", "Manatee", "Marion", "Martin", "Miami-Dade",
  "Monroe", "Nassau", "Okaloosa", "Okeechobee", "Orange", "Osceola",
  "Palm Beach", "Pasco", "Pinellas", "Polk", "Putnam", "Santa Rosa",
  "Sarasota", "Seminole", "St. Johns", "St. Lucie", "Sumter",
  "Suwannee", "Taylor", "Union", "Volusia", "Wakulla", "Walton", "Washington",
];

// ── FL Cities (expanded) ───────────────────────────────────────────────────
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

// ── NAV/GARBAGE words to reject in descriptions ─────────────────────────────
const NAV_WORDS = /\b(menu|home|click here|read more|skip to content|call us|follow us|log\s*in|sign\s*up|subscribe|newsletter|cookie|privacy policy|terms of service|sitemap|all rights reserved|copyright|explore this|learn more|view all|get started|request a|schedule a|book now|contact us today|en espa|select a|choose a|back to|top of page|welcome to|your local|had \w+ (and|come)|came by my|got signed up|great job|very professional|highly recommend|would recommend|stars?\s*review|google review|mindblown|a blog about|powered by wordpress|theme by|built with|website by)\b/i;
const ADDRESS_PATTERN = /^\d+\s+\w+\s+(st|street|ave|avenue|blvd|boulevard|rd|road|dr|drive|ln|lane|ct|court|way|pl|place)\b/i;
const PHONE_PATTERN = /^\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}/;

// ── Platform emails to exclude ──────────────────────────────────────────────
const EXCLUDED_EMAIL_DOMAINS = [
  "example.com", "sentry.io", "wixpress.com", "squarespace.com",
  "wordpress.com", "wordpress.org", "google.com", "googleapis.com",
  "godaddy.com", "bluehost.com", "hostgator.com", "cpanel.net",
  "gravatar.com", "w3.org", "schema.org", "facebook.com",
  "twitter.com", "instagram.com", "youtube.com", "linkedin.com",
];
const EXCLUDED_EMAIL_PREFIXES = ["noreply", "no-reply", "donotreply", "admin@wordpress", "support@squarespace"];

// ── EXTRACTION FUNCTIONS ────────────────────────────────────────────────────

function extractServices(text) {
  if (!text) return [];
  const found = [];
  for (const sp of SERVICE_PATTERNS) {
    const matched = sp.patterns.some((p) => p.test(text));
    if (matched) {
      found.push({ slug: sp.slug, label: sp.label });
    }
  }
  return found;
}

function extractEmergency247(text, openingHours) {
  // STRICT verification per spec
  // Check if opening_hours show "Open 24 hours" for ALL 7 days
  if (openingHours && Array.isArray(openingHours) && openingHours.length >= 7) {
    const all24 = openingHours.every((h) => h.hours && /24\s*hours/i.test(h.hours));
    if (all24) return true;

    // If opening_hours show normal business hours AND website says "24/7" → false (trust hours)
    const hasNormalHours = openingHours.some((h) => h.hours && /\d{1,2}:\d{2}\s*(AM|PM)/i.test(h.hours));
    if (hasNormalHours && text && /24\s*\/?\s*7/i.test(text)) return false;
  }

  // Website must mention "24/7" AND ("emergency" OR "after hours" OR "always available")
  if (text) {
    const has247 = /24\s*\/?\s*7/i.test(text);
    const hasEmergency = /emergency|after\s*hours|always\s*available/i.test(text);
    if (has247 && hasEmergency) return true;
  }

  return false;
}

function extractEmail(text, businessDomain) {
  if (!text) return null;
  // Find all emails
  const matches = text.match(/\b[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}\b/g);
  if (!matches) return null;

  const validEmails = [];
  for (const raw of matches) {
    const email = raw.toLowerCase();
    // Exclude platform/social emails
    const domain = email.split("@")[1];
    if (EXCLUDED_EMAIL_DOMAINS.some((d) => domain.includes(d))) continue;
    if (EXCLUDED_EMAIL_PREFIXES.some((p) => email.startsWith(p))) continue;

    validEmails.push(email);
  }

  if (validEmails.length === 0) return null;

  // Prefer emails matching business domain
  if (businessDomain) {
    try {
      const domainHost = new URL(businessDomain).hostname.replace(/^www\./, "");
      const domainMatch = validEmails.find((e) => e.includes(domainHost));
      if (domainMatch) return domainMatch;
    } catch {}
  }

  // Prefer info@, service@, contact@ emails
  const preferred = validEmails.find((e) => /^(info|service|contact|office|sales)@/.test(e));
  if (preferred) return preferred;

  return validEmails[0];
}

function extractDescription(text, name, biz) {
  if (!text) {
    // Fallback template
    const parts = [`${name} provides grease trap cleaning and maintenance services`];
    if (biz.city) parts[0] += ` in ${biz.city}`;
    if (biz.county) parts[0] += `, ${biz.county} County`;
    parts[0] += ", Florida.";
    if (biz.rating) parts.push(`Rated ${biz.rating} stars`);
    if (biz.review_count) parts[parts.length - 1] += ` with ${biz.review_count} reviews on Google.`;
    return { description: parts.join(" ").slice(0, 300), source: "template" };
  }

  // Clean artifacts before splitting
  let cleanText = text
    .replace(/-->/g, "")
    .replace(/<!\-\-/g, "")
    .replace(/\|/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // Split text into sentences
  const sentences = cleanText.split(/[.!?]+/).map((s) => s.trim());

  // Filter qualifying sentences
  const qualifying = sentences.filter((s) => {
    if (s.length < 50 || s.length > 500) return false;
    if (NAV_WORDS.test(s)) return false;
    if (ADDRESS_PATTERN.test(s)) return false;
    if (PHONE_PATTERN.test(s)) return false;
    // Must contain at least 2 proper English words (3+ chars)
    const words = s.split(/\s+/).filter((w) => w.length >= 3 && /^[a-zA-Z]/.test(w));
    if (words.length < 2) return false;
    return true;
  });

  if (qualifying.length === 0) {
    // Fallback template
    const desc = `${name} provides grease trap cleaning and maintenance services in ${biz.city || "Florida"}${biz.county ? `, ${biz.county} County` : ""}, Florida.${biz.rating ? ` Rated ${biz.rating} stars` : ""}${biz.review_count ? ` with ${biz.review_count} reviews on Google.` : ""}`;
    return { description: desc.slice(0, 300), source: "template" };
  }

  // Take first 2-3 qualifying sentences (max 300 chars)
  let desc = "";
  let count = 0;
  for (const s of qualifying) {
    if (count >= 3) break;
    const candidate = desc ? desc + ". " + s : s;
    if (candidate.length > 300) break;
    desc = candidate;
    count++;
  }

  if (!desc.endsWith(".")) desc += ".";
  return { description: desc.slice(0, 300), source: "website" };
}

function extractServiceAreas(text) {
  if (!text) return [];
  const areas = new Set();
  for (const city of FL_CITIES) {
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

function extractPricingSignals(text) {
  if (!text) return null;
  const signals = [];

  // Dollar amounts near grease-related keywords (within 200 chars)
  const greaseChunks = text.match(/.{0,200}(grease|trap|interceptor|pump|clean|FOG).{0,200}/gi) || [];
  for (const chunk of greaseChunks) {
    const prices = chunk.match(/\$\s*\d{1,3}(?:,\d{3})*(?:\.\d{2})?/g);
    if (prices) signals.push(...prices.slice(0, 2));
  }

  if (/free\s*(estimate|quote|consultation)/i.test(text)) signals.push("Free estimates");
  if (/no\s*(hidden|extra)\s*(fee|charge|cost)/i.test(text)) signals.push("No hidden fees");
  if (/competitive\s*(pric|rate)/i.test(text)) signals.push("Competitive pricing");
  if (/affordable/i.test(text)) signals.push("Affordable");
  if (/flat\s*rate/i.test(text)) signals.push("Flat rate");
  if (/starting\s*(at|from)\s*\$/i.test(text)) signals.push("Starting price listed");
  if (/monthly\s*(plan|service|contract|agreement)/i.test(text)) signals.push("Monthly plans");
  if (/call\s*for\s*(pricing|quote|estimate)/i.test(text)) signals.push("Call for pricing");

  // Dedup
  const unique = [...new Set(signals)];
  return unique.length > 0 ? unique.join("; ") : null;
}

function extractYearsInBusiness(text) {
  if (!text) return null;

  const sinceMatch = text.match(/(?:since|established|founded|est\.?)\s*(\d{4})/i);
  if (sinceMatch) {
    const year = parseInt(sinceMatch[1], 10);
    if (year > 1900 && year <= 2026) return 2026 - year;
  }

  const yearsMatch = text.match(/(\d{1,3})\+?\s*years?\s*(of\s*)?(experience|in\s*business|serving|of\s*service)/i);
  if (yearsMatch) {
    const y = parseInt(yearsMatch[1], 10);
    if (y > 0 && y < 150) return y;
  }

  const overMatch = text.match(/over\s*(\d{1,3})\s*years/i);
  if (overMatch) {
    const y = parseInt(overMatch[1], 10);
    if (y > 0 && y < 150) return y;
  }

  return null;
}

function calculateConfidence(enriched, hasText) {
  // HIGH = grease in name + 3+ services detected + description from website
  // MEDIUM = grease in website + 1-2 services detected
  // LOW = everything else
  const nameHasGrease = /grease|trap|interceptor|FOG/i.test(enriched.name);
  const servicesCount = enriched.services_offered.length;
  const descFromWebsite = enriched.description_source === "website";

  if (nameHasGrease && servicesCount >= 3 && descFromWebsite) return "high";
  if (hasText && servicesCount >= 1) return "medium";
  return "low";
}

// ── MAIN ────────────────────────────────────────────────────────────────────
async function main() {
  console.log("=== Re-enrichment Step 2: Improved Enrichment ===\n");

  if (!existsSync(SCRAPED_PATH)) {
    console.error("ERROR: data/scraped-websites-v2.json not found. Run scrape-websites-v2.mjs first.");
    process.exit(1);
  }

  const scraped = JSON.parse(readFileSync(SCRAPED_PATH, "utf-8"));
  console.log(`Loaded ${scraped.length} scraped entries`);

  // Load business data from DB for opening_hours, rating, etc.
  const env = loadEnv();
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: businesses, error } = await supabase
    .from("businesses")
    .select("slug, name, website, city, county, county_slug, opening_hours, rating, review_count, phone, phone_unformatted, address, state, state_abbreviation, zip, lat, lng, place_id, email, description, emergency_24_7, years_in_business, pricing_signals, enrichment_confidence");

  if (error) {
    console.error("DB error:", error);
    process.exit(1);
  }

  const bizMap = new Map(businesses.map((b) => [b.slug, b]));
  console.log(`Loaded ${businesses.length} businesses from DB\n`);

  // Build scrape lookup
  const scrapeMap = new Map(scraped.map((s) => [s.slug, s]));

  const enriched = [];
  const stats = {
    totalDescFromWebsite: 0,
    totalDescFromTemplate: 0,
    totalServices: 0,
    totalEmergency: 0,
    totalEmail: 0,
    totalPricing: 0,
    totalYears: 0,
    totalServiceAreas: 0,
    serviceDistribution: {},
  };

  for (const biz of businesses) {
    const scrape = scrapeMap.get(biz.slug);
    const text = scrape?.all_text_combined || "";
    const hasText = text.length > 50;

    const services = extractServices(text);
    const emergency = extractEmergency247(text, biz.opening_hours);
    const email = extractEmail(text, biz.website) || biz.email || null;
    const { description, source: descSource } = extractDescription(hasText ? text : null, biz.name, biz);
    const serviceAreas = extractServiceAreas(text);
    const pricing = extractPricingSignals(text) || biz.pricing_signals || null;
    const years = extractYearsInBusiness(text) || biz.years_in_business || null;
    const confidence = calculateConfidence({ name: biz.name, services_offered: services, description_source: descSource }, hasText);

    // Track stats
    if (descSource === "website") stats.totalDescFromWebsite++;
    else stats.totalDescFromTemplate++;
    stats.totalServices += services.length;
    if (emergency) stats.totalEmergency++;
    if (email) stats.totalEmail++;
    if (pricing) stats.totalPricing++;
    if (years) stats.totalYears++;
    if (serviceAreas.length > 0) stats.totalServiceAreas++;
    for (const s of services) {
      stats.serviceDistribution[s.label] = (stats.serviceDistribution[s.label] || 0) + 1;
    }

    enriched.push({
      slug: biz.slug,
      name: biz.name,
      description,
      description_source: descSource,
      services_offered: services,
      emergency_24_7: emergency,
      email,
      pricing_signals: pricing,
      years_in_business: years,
      service_areas: serviceAreas,
      enrichment_confidence: confidence,
      website_status: scrape?.website_status || "no_website",
      pages_fetched: scrape?.pages_fetched || 0,
    });
  }

  // Print stats
  console.log("=== Enrichment Results ===");
  console.log(`Descriptions from website: ${stats.totalDescFromWebsite}`);
  console.log(`Descriptions from template: ${stats.totalDescFromTemplate}`);
  console.log(`Average services per business: ${(stats.totalServices / enriched.length).toFixed(1)}`);
  console.log(`Emergency 24/7: ${stats.totalEmergency}`);
  console.log(`Emails found: ${stats.totalEmail}`);
  console.log(`Pricing signals: ${stats.totalPricing}`);
  console.log(`Years in business: ${stats.totalYears}`);
  console.log(`With service area data: ${stats.totalServiceAreas}`);
  console.log(`\nService distribution:`);
  const sorted = Object.entries(stats.serviceDistribution).sort((a, b) => b[1] - a[1]);
  for (const [service, count] of sorted) {
    console.log(`  ${service}: ${count}`);
  }
  console.log(`\nConfidence breakdown:`);
  const high = enriched.filter((e) => e.enrichment_confidence === "high").length;
  const medium = enriched.filter((e) => e.enrichment_confidence === "medium").length;
  const low = enriched.filter((e) => e.enrichment_confidence === "low").length;
  console.log(`  HIGH: ${high} | MEDIUM: ${medium} | LOW: ${low}`);

  writeFileSync(OUTPUT_PATH, JSON.stringify(enriched, null, 2));
  console.log(`\nSaved to ${OUTPUT_PATH}`);
}

main().catch(console.error);

#!/usr/bin/env node

/**
 * Phase 5b — Retry scraper for 403-blocked sites
 *
 * Reads data/scraped-websites.json, retries all blocked entries with
 * aggressive browser mimicry (full headers, UA rotation, Google referer,
 * longer timeout, more redirect hops).
 *
 * Recovered sites get their text merged back into scraped-websites.json
 * and enriched.json is re-run for the recovered entries.
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const SCRAPED_PATH = resolve(ROOT, "data", "scraped-websites.json");
const ENRICHED_PATH = resolve(ROOT, "data", "enriched.json");

const REQUEST_TIMEOUT_MS = 12_000;
const MAX_CONCURRENCY = 5;
const STAGGER_DELAY_MS = 1_000;
const MAX_CHARS_PER_PAGE = 5_000;
const MAX_CHARS_COMBINED = 12_000;
const PROGRESS_INTERVAL = 25;

// ─────────────────────────────────────────────
// USER-AGENT ROTATION (5 realistic Chrome/Firefox)
// ─────────────────────────────────────────────

const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 14.4; rv:125.0) Gecko/20100101 Firefox/125.0",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
];

let uaIndex = 0;
function nextUA() {
  const ua = USER_AGENTS[uaIndex % USER_AGENTS.length];
  uaIndex++;
  return ua;
}

// ─────────────────────────────────────────────
// BROWSER-LIKE HEADERS
// ─────────────────────────────────────────────

function buildHeaders(url) {
  return {
    "User-Agent": nextUA(),
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "Upgrade-Insecure-Requests": "1",
    Referer: "https://www.google.com/",
  };
}

// ─────────────────────────────────────────────
// HTML STRIP (same as original scraper)
// ─────────────────────────────────────────────

function stripHtml(html) {
  let text = html;
  text = text.replace(
    /<(script|style|nav|header|footer|noscript|iframe|svg)[\s\S]*?<\/\1>/gi,
    " "
  );
  text = text.replace(/<[^>]+>/g, " ");
  text = text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#\d+;/g, " ")
    .replace(/&\w+;/g, " ");
  text = text.replace(/\s+/g, " ").trim();
  return text;
}

// ─────────────────────────────────────────────
// FETCH WITH AGGRESSIVE HEADERS
// ─────────────────────────────────────────────

async function aggressiveFetch(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      headers: buildHeaders(url),
      signal: controller.signal,
      redirect: "follow",
    });
    clearTimeout(timer);
    return { status: res.status, ok: res.ok, body: await res.text() };
  } catch (err) {
    clearTimeout(timer);
    const msg = err?.message || String(err);
    if (err?.name === "AbortError" || msg.includes("abort")) {
      return { status: 0, ok: false, body: null, error: "timeout" };
    }
    if (msg.includes("ENOTFOUND") || msg.includes("getaddrinfo") || msg.includes("DNS")) {
      return { status: 0, ok: false, body: null, error: "dns" };
    }
    if (msg.includes("CERT") || msg.includes("SSL") || msg.includes("TLS") || msg.includes("certificate")) {
      return { status: 0, ok: false, body: null, error: "ssl" };
    }
    return { status: 0, ok: false, body: null, error: msg.slice(0, 120) };
  }
}

// ─────────────────────────────────────────────
// TRY SUB-PATHS
// ─────────────────────────────────────────────

const SERVICES_PATHS = [
  "/services", "/our-services", "/what-we-do",
  "/grease-trap", "/grease-trap-cleaning", "/commercial-services",
];

const ABOUT_PATHS = ["/about", "/about-us", "/about-us/", "/company"];

async function tryPaths(baseUrl, paths) {
  for (const p of paths) {
    try {
      const url = new URL(p, baseUrl).href;
      const res = await aggressiveFetch(url);
      if (res.ok && res.status === 200 && res.body) {
        const text = stripHtml(res.body).slice(0, MAX_CHARS_PER_PAGE);
        if (text.length > 50) return { url, status: res.status, text };
      }
    } catch {
      // invalid URL, skip
    }
  }
  return null;
}

// ─────────────────────────────────────────────
// SCRAPE ONE BLOCKED BUSINESS
// ─────────────────────────────────────────────

async function retryBusiness(entry) {
  if (!entry.website) return null;

  let baseUrl = entry.website.trim();
  if (!/^https?:\/\//i.test(baseUrl)) baseUrl = "https://" + baseUrl;

  // Homepage
  const homepageRes = await aggressiveFetch(baseUrl);

  if (!homepageRes.ok || homepageRes.status !== 200 || !homepageRes.body) {
    return null; // Still blocked or failed
  }

  const homepageText = stripHtml(homepageRes.body).slice(0, MAX_CHARS_PER_PAGE);
  if (homepageText.length <= 50) return null;

  const result = {
    homepage_text: homepageText,
    services_text: null,
    about_text: null,
    pages_fetched: 1,
  };

  // Services page
  const servicesResult = await tryPaths(baseUrl, SERVICES_PATHS);
  if (servicesResult) {
    result.services_text = servicesResult.text;
    result.pages_fetched++;
  }

  // About page
  const aboutResult = await tryPaths(baseUrl, ABOUT_PATHS);
  if (aboutResult) {
    result.about_text = aboutResult.text;
    result.pages_fetched++;
  }

  // Combined
  const combined = [result.homepage_text, result.services_text, result.about_text]
    .filter(Boolean)
    .join("\n\n---\n\n");
  result.all_text_combined = combined ? combined.slice(0, MAX_CHARS_COMBINED) : null;

  return result;
}

// ─────────────────────────────────────────────
// SEMAPHORE
// ─────────────────────────────────────────────

class Semaphore {
  constructor(max) { this.max = max; this.current = 0; this.queue = []; }
  acquire() {
    return new Promise((resolve) => {
      if (this.current < this.max) { this.current++; resolve(); }
      else this.queue.push(resolve);
    });
  }
  release() {
    this.current--;
    if (this.queue.length > 0) { this.current++; this.queue.shift()(); }
  }
}

// ─────────────────────────────────────────────
// ENRICHMENT (inline — same logic as enrich-data.mjs)
// ─────────────────────────────────────────────

const GREASE_KEYWORDS = [
  /grease\s*trap/i, /grease\s*interceptor/i, /grease\s*clean/i,
  /grease\s*pump/i, /grease\s*removal/i, /grease\s*waste/i,
  /FOG\s*(program|compliance|service|removal|management|clean)/i,
  /fats?\s*oils?\s*(?:and\s*)?grease/i,
  /interceptor\s*(clean|pump|service|maintenance)/i, /trap\s*clean/i,
];

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

const FL_CITIES = [
  "Miami","Tampa","Orlando","Jacksonville","Fort Lauderdale","St Petersburg",
  "Hialeah","Tallahassee","West Palm Beach","Sarasota","Fort Myers","Naples",
  "Cape Coral","Clearwater","Gainesville","Lakeland","Daytona Beach","Kissimmee",
  "Boca Raton","Pompano Beach","Coral Springs","Hollywood","Pembroke Pines",
  "Port St Lucie","Ocala","Pensacola","Palm Bay","Melbourne","Deltona","Bradenton",
  "Panama City","Key West","Stuart","Vero Beach","Bonita Springs","Winter Haven",
  "Sanford","Apopka","Deland","Leesburg","Homestead","Doral","Coral Gables",
  "Aventura","Plantation","Sunrise","Miramar","Deerfield Beach","Boynton Beach",
  "Delray Beach","Jupiter","Palm Beach Gardens","Lake Worth","Wellington","Brandon",
  "Riverview","Largo","Dunedin","Tarpon Springs","Palm Harbor","Ocoee",
  "Winter Garden","Winter Park","Clermont","Altamonte Springs","Oviedo","Lake Mary",
  "Port Charlotte","Punta Gorda","Venice","North Port","Englewood","Palm Coast",
  "St Augustine","Fernandina Beach","Orange Park","New Port Richey","Wesley Chapel",
  "Zephyrhills","Brooksville","Inverness","Crystal River","Spring Hill","Sebring",
  "Lake City","Crestview","Destin","Fort Walton Beach","Panama City Beach",
  "Marco Island","Lehigh Acres","Estero","Plant City","Haines City",
];

const FL_COUNTIES = [
  "Miami-Dade","Broward","Palm Beach","Hillsborough","Pinellas","Orange","Duval",
  "Lee","Collier","Sarasota","Manatee","Volusia","Brevard","Seminole","Osceola",
  "Polk","St. Lucie","Martin","Indian River","Escambia","Santa Rosa","Okaloosa",
  "Bay","Marion","Lake","Monroe","Pasco","Hernando","Citrus","Flagler","St. Johns",
  "Clay","Nassau","Charlotte","Alachua","Leon","Highlands","Columbia","Sumter","Putnam",
];

function enrichBusiness(biz, text) {
  const combinedText = [
    text,
    biz.name || "",
    (biz.categories || []).join(" "),
    biz.category_name || "",
    biz.description || "",
  ].join(" ");

  const isGrease = GREASE_KEYWORDS.some((kw) => kw.test(combinedText));

  const services = SERVICE_PATTERNS
    .filter((sp) => sp.pattern.test(combinedText))
    .map((sp) => ({ slug: sp.slug, label: sp.label }));

  const estTypes = ESTABLISHMENT_PATTERNS
    .filter((ep) => ep.pattern.test(text))
    .map((ep) => ({ slug: ep.slug, label: ep.label }));

  const areas = [];
  for (const city of FL_CITIES) {
    const re = new RegExp(`\\b${city.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
    if (re.test(text)) areas.push(city);
  }
  for (const county of FL_COUNTIES) {
    const re = new RegExp(`\\b${county.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*(county)?\\b`, "i");
    if (re.test(text)) areas.push(county + " County");
  }

  const emergency = /24\s*\/?\s*7/i.test(combinedText)
    || /emergency\s*(service|response|clean|pump|available|call)/i.test(combinedText)
    || /after[\s-]*hours?\s*(service|available|emergency|call)/i.test(combinedText)
    || /open\s*24\s*hours/i.test(combinedText);

  const emailMatch = text.match(/\b[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}\b/);
  let email = emailMatch ? emailMatch[0].toLowerCase() : null;
  if (email && (email.includes("example.com") || email.includes("sentry.io") || email.includes("wixpress"))) email = null;

  // Pricing
  const pricingSignals = [];
  const priceMatch = text.match(/\$\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/g);
  if (priceMatch) pricingSignals.push(...priceMatch.slice(0, 3));
  if (/free\s*(estimate|quote|consultation)/i.test(text)) pricingSignals.push("Free estimates");
  if (/no\s*(hidden|extra)\s*(fee|charge|cost)/i.test(text)) pricingSignals.push("No hidden fees");
  if (/competitive\s*(pric|rate)/i.test(text)) pricingSignals.push("Competitive pricing");
  if (/affordable/i.test(text)) pricingSignals.push("Affordable");
  if (/flat\s*rate/i.test(text)) pricingSignals.push("Flat rate");
  if (/monthly\s*(plan|service|contract|agreement)/i.test(text)) pricingSignals.push("Monthly plans");

  // Years
  let years = null;
  const yearsM = text.match(/(\d{1,3})\+?\s*years?\s*(of\s*)?(experience|in\s*business|serving|of\s*service)/i);
  if (yearsM) { const y = parseInt(yearsM[1], 10); if (y > 0 && y < 150) years = y; }
  if (!years) {
    const sinceM = text.match(/(?:since|established|founded|est\.?)\s*(\d{4})/i);
    if (sinceM) { const y = parseInt(sinceM[1], 10); if (y > 1900 && y <= 2026) years = 2026 - y; }
  }
  if (!years) {
    const overM = text.match(/over\s*(\d{1,3})\s*years/i);
    if (overM) { const y = parseInt(overM[1], 10); if (y > 0 && y < 150) years = y; }
  }

  const manifest = /manifest/i.test(text) && /(grease|waste|haul|transport|pump|service)/i.test(text);

  // Description
  const sentences = text.split(/[.!?]+/).map((s) => s.trim()).filter((s) => s.length > 30 && s.length < 300);
  const greaseSentences = sentences.filter((s) => /grease|trap|interceptor|FOG|pump/i.test(s));
  const nameWord = biz.name ? biz.name.split(/\s+/)[0] : "";
  const namedSentences = greaseSentences.filter((s) => nameWord && s.toLowerCase().includes(nameWord.toLowerCase()));
  const description = namedSentences[0] || greaseSentences[0] || null;

  // Confidence
  let score = 0;
  if (isGrease) score += 2;
  if (services.length >= 2) score += 2;
  if (areas.length >= 1) score += 1;
  if (email) score += 1;
  if (years) score += 1;
  if (description) score += 1;
  if (estTypes.length >= 1) score += 1;
  if (emergency) score += 1;
  const confidence = score >= 6 ? "high" : score >= 3 ? "medium" : "low";

  return {
    is_grease_trap_service: isGrease,
    services_offered: services,
    service_areas: areas,
    emergency_24_7: emergency,
    email,
    pricing_signals: pricingSignals.length > 0 ? pricingSignals.join("; ") : null,
    years_in_business: years,
    establishment_types_served: estTypes,
    manifest_provided: manifest,
    description: description ? description.slice(0, 280) : null,
    enrichment_confidence: confidence,
  };
}

// ─────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────

async function main() {
  console.log("=== Phase 5b: Retry Blocked Sites ===\n");

  if (!existsSync(SCRAPED_PATH)) {
    console.error("ERROR: data/scraped-websites.json not found.");
    process.exit(1);
  }

  const allScraped = JSON.parse(readFileSync(SCRAPED_PATH, "utf-8"));
  const blocked = allScraped.filter((e) => e.website_status === "blocked");

  console.log(`Total scraped entries: ${allScraped.length}`);
  console.log(`Blocked (403) entries: ${blocked.length}`);
  console.log(`Retrying with: 5 concurrent, 1s stagger, 12s timeout, UA rotation, full headers\n`);

  if (blocked.length === 0) {
    console.log("No blocked entries to retry.");
    return;
  }

  const sem = new Semaphore(MAX_CONCURRENCY);
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  let completed = 0;
  let recovered = 0;
  let stillBlocked = 0;
  const recoveredEntries = [];

  const tasks = blocked.map((entry, idx) => {
    return (async () => {
      await sleep(idx * STAGGER_DELAY_MS);
      await sem.acquire();
      try {
        const result = await retryBusiness(entry);
        completed++;

        if (result) {
          recovered++;
          // Merge result into the entry
          entry.website_status = "live";
          entry.homepage_text = result.homepage_text;
          entry.services_text = result.services_text;
          entry.about_text = result.about_text;
          entry.all_text_combined = result.all_text_combined;
          entry.pages_fetched = result.pages_fetched;
          entry.scrape_timestamp = new Date().toISOString();
          recoveredEntries.push(entry);
        } else {
          stillBlocked++;
        }

        if (completed % PROGRESS_INTERVAL === 0 || completed === blocked.length) {
          console.log(`[${completed}/${blocked.length}] retried | recovered: ${recovered} | still blocked: ${stillBlocked}`);
        }
      } catch (err) {
        completed++;
        stillBlocked++;
        console.error(`Error retrying "${entry.name}": ${err?.message || err}`);
      } finally {
        sem.release();
      }
    })();
  });

  await Promise.all(tasks);

  // Update scraped-websites.json in place
  writeFileSync(SCRAPED_PATH, JSON.stringify(allScraped, null, 2));
  console.log(`\nUpdated data/scraped-websites.json`);

  // Summary
  console.log("\n=== RETRY SUMMARY ===");
  console.log(`Total retried:    ${blocked.length}`);
  console.log(`Newly recovered:  ${recovered}`);
  console.log(`Still blocked:    ${stillBlocked}`);
  console.log(`Recovery rate:    ${((recovered / blocked.length) * 100).toFixed(1)}%`);

  // If any recovered, re-enrich those entries in enriched.json
  if (recovered > 0 && existsSync(ENRICHED_PATH)) {
    console.log(`\nRe-enriching ${recovered} recovered businesses...`);

    const enriched = JSON.parse(readFileSync(ENRICHED_PATH, "utf-8"));

    // Build lookup of recovered entries by place_id and name
    const recoveredByPid = new Map();
    const recoveredByName = new Map();
    for (const re of recoveredEntries) {
      if (re.place_id) recoveredByPid.set(re.place_id, re);
      if (re.name) recoveredByName.set(re.name, re);
    }

    let enrichUpdated = 0;
    for (const biz of enriched) {
      const scraped = recoveredByPid.get(biz.place_id) || recoveredByName.get(biz.name);
      if (!scraped) continue;

      const text = scraped.all_text_combined || "";
      if (text.length <= 50) continue;

      const fields = enrichBusiness(biz, text);

      // Update enriched entry
      biz.website_status = "live";
      biz.pages_fetched = scraped.pages_fetched;
      biz.is_grease_trap_service = fields.is_grease_trap_service;
      biz.enrichment_confidence = fields.enrichment_confidence;

      // Only overwrite fields if the new extraction found something
      if (fields.services_offered.length > 0) biz.services_offered = fields.services_offered;
      if (fields.service_areas.length > 0) biz.service_areas = fields.service_areas;
      if (fields.emergency_24_7) biz.emergency_24_7 = true;
      if (fields.email) biz.email = fields.email;
      if (fields.pricing_signals) biz.pricing_signals = fields.pricing_signals;
      if (fields.years_in_business) biz.years_in_business = fields.years_in_business;
      if (fields.establishment_types_served.length > 0) biz.establishment_types_served = fields.establishment_types_served;
      if (fields.manifest_provided) biz.manifest_provided = true;
      if (fields.description) biz.description = fields.description;

      enrichUpdated++;
    }

    writeFileSync(ENRICHED_PATH, JSON.stringify(enriched, null, 2));
    console.log(`Updated ${enrichUpdated} entries in data/enriched.json`);

    // New status breakdown
    const statusCounts = {};
    for (const s of allScraped) {
      statusCounts[s.website_status] = (statusCounts[s.website_status] || 0) + 1;
    }
    console.log("\n=== UPDATED WEBSITE STATUS ===");
    for (const [status, count] of Object.entries(statusCounts).sort((a, b) => b[1] - a[1])) {
      console.log(`  ${status}: ${count}`);
    }
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});

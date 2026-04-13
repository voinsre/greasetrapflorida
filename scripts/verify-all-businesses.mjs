import { createClient } from "@supabase/supabase-js";
import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env.local
const envPath = resolve(__dirname, "..", ".env.local");
for (const line of readFileSync(envPath, "utf8").split("\n")) {
  const m = line.match(/^([^#=]+)=(.*)$/);
  if (m) process.env[m[1].trim()] = m[2].trim();
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

// ── Grease keywords ────────────────────────────────────────────────────────

const GREASE_KEYWORDS = [
  "grease trap", "grease interceptor", "grease cleaning", "grease pumping",
  "grease waste", "fog compliance", "trap cleaning", "interceptor cleaning",
  "interceptor pumping", "grease removal", "kitchen grease", "grease hauling",
  "cooking oil collection", "grease recycling", "grease disposal",
  "grease service", "trap pumping", "trap service", "fog service",
  "commercial grease", "grease trap maintenance", "trap pump out",
  "grease pump out", "fog program", "grease management",
];

const GREASE_NAME_PHRASES = ["grease trap", "grease interceptor"];
const GREASE_SPECIFIC_SERVICES = ["grease-trap-cleaning", "grease-interceptor-pumping", "grease-trap-installation", "grease-trap-repair-replacement", "grease-trap-inspection", "fog-compliance-consulting"];

// ── Load scraped website data ──────────────────────────────────────────────

const scrapedPath = resolve(__dirname, "..", "data", "scraped-websites-v2.json");
let scrapedData = [];
try {
  scrapedData = JSON.parse(readFileSync(scrapedPath, "utf8"));
} catch {
  console.warn("Could not load scraped-websites-v2.json — will use description only for website analysis");
}

// Build lookup by normalized name
const scrapedByName = new Map();
for (const s of scrapedData) {
  const key = s.name.toLowerCase().trim();
  scrapedByName.set(key, s);
}

// Also try slug-based lookup
const scrapedBySlug = new Map();
for (const s of scrapedData) {
  if (s.slug) scrapedBySlug.set(s.slug, s);
}

function findScrapedData(name, slug) {
  const key = name.toLowerCase().trim();
  if (scrapedByName.has(key)) return scrapedByName.get(key);
  if (slug && scrapedBySlug.has(slug)) return scrapedBySlug.get(slug);
  // Fuzzy: try partial match
  for (const [k, v] of scrapedByName) {
    if (k.includes(key) || key.includes(k)) return v;
  }
  return null;
}

function findGreaseKeywords(text) {
  if (!text) return [];
  const lower = text.toLowerCase();
  return GREASE_KEYWORDS.filter(kw => lower.includes(kw));
}

function hasStandaloneWord(text, word) {
  const re = new RegExp(`\\b${word}\\b`, "i");
  return re.test(text);
}

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  // 1. Get all businesses
  const { data: businesses } = await supabase
    .from("businesses")
    .select("id, slug, name, description, city, county_slug, county, phone, website, website_status, rating, review_count, emergency_24_7, is_verified, place_id")
    .order("name");

  console.log(`Loaded ${businesses.length} businesses from Supabase`);

  // 2. Get all service junctions
  const { data: junctions } = await supabase
    .from("business_services")
    .select("business_id, service_id");

  // 3. Get service types
  const { data: serviceTypes } = await supabase
    .from("service_types")
    .select("id, slug, name");
  const serviceById = new Map(serviceTypes.map(s => [s.id, s]));

  // Build business → services map
  const bizServices = new Map();
  for (const j of junctions) {
    if (!bizServices.has(j.business_id)) bizServices.set(j.business_id, []);
    const svc = serviceById.get(j.service_id);
    if (svc) bizServices.get(j.business_id).push(svc);
  }

  // 4. Analyze each business
  const results = [];

  for (const biz of businesses) {
    const nameLower = biz.name.toLowerCase();
    const services = bizServices.get(biz.id) || [];
    const serviceSlugs = services.map(s => s.slug);
    const serviceNames = services.map(s => s.name);

    // Find scraped website text
    const scraped = findScrapedData(biz.name, biz.slug);
    const websiteText = scraped?.all_text_combined || "";
    const websiteKeywords = findGreaseKeywords(websiteText);

    // Also check description for grease keywords
    const descKeywords = findGreaseKeywords(biz.description || "");
    const descMentionsGrease = descKeywords.length > 0;

    // Name analysis
    const nameHasGreasePhrase = GREASE_NAME_PHRASES.some(p => nameLower.includes(p));
    const nameHasGrease = hasStandaloneWord(nameLower, "grease");
    const nameHasTrap = hasStandaloneWord(nameLower, "trap");
    const nameHasInterceptor = nameLower.includes("interceptor");
    const nameHasFOG = /\bfog\b/i.test(biz.name);
    const nameHasSeptic = nameLower.includes("septic");
    const nameHasHood = nameLower.includes("hood");
    const nameHasDrain = nameLower.includes("drain");
    const nameHasPlumbing = nameLower.includes("plumbing") || nameLower.includes("plumber");
    const nameHasWaste = nameLower.includes("waste");
    const nameHasEnvironmental = nameLower.includes("environmental");

    const nameKeywords = [];
    if (nameHasGrease) nameKeywords.push("grease");
    if (nameHasTrap) nameKeywords.push("trap");
    if (nameHasInterceptor) nameKeywords.push("interceptor");
    if (nameHasFOG) nameKeywords.push("FOG");
    if (nameHasSeptic) nameKeywords.push("septic");
    if (nameHasHood) nameKeywords.push("hood");
    if (nameHasDrain) nameKeywords.push("drain");
    if (nameHasPlumbing) nameKeywords.push("plumbing");
    if (nameHasWaste) nameKeywords.push("waste");
    if (nameHasEnvironmental) nameKeywords.push("environmental");

    const hasGreaseSpecificService = serviceSlugs.some(s => GREASE_SPECIFIC_SERVICES.includes(s));

    // Score
    let score = 0;
    const scoreBreakdown = [];

    // +3: name contains "grease trap" or "grease interceptor" as phrase
    if (nameHasGreasePhrase) {
      score += 3;
      scoreBreakdown.push("+3 grease phrase in name");
    }
    // +2: name contains "grease" standalone
    else if (nameHasGrease) {
      score += 2;
      scoreBreakdown.push("+2 standalone 'grease' in name");
    }

    // +1: name has septic or hood
    if (nameHasSeptic) { score += 1; scoreBreakdown.push("+1 'septic' in name"); }
    if (nameHasHood) { score += 1; scoreBreakdown.push("+1 'hood' in name"); }

    // +2: website 3+ grease keywords, +1: 1-2
    if (websiteKeywords.length >= 3) {
      score += 2;
      scoreBreakdown.push(`+2 website has ${websiteKeywords.length} grease keywords`);
    } else if (websiteKeywords.length >= 1) {
      score += 1;
      scoreBreakdown.push(`+1 website has ${websiteKeywords.length} grease keyword(s)`);
    }

    // +1: description mentions grease
    if (descMentionsGrease) {
      score += 1;
      scoreBreakdown.push("+1 description mentions grease");
    }

    // +1: has grease-specific service tag
    if (hasGreaseSpecificService) {
      score += 1;
      scoreBreakdown.push("+1 has grease-specific service tag");
    }

    // -1: no website or dead AND no grease in name
    const noWebsite = !biz.website || biz.website_status === "dead" || biz.website_status === "no_website";
    if (noWebsite && !nameHasGrease && !nameHasTrap) {
      score -= 1;
      scoreBreakdown.push("-1 no website and no grease in name");
    }

    // -2: template description AND no grease keywords anywhere
    const isTemplateDesc = biz.description && (
      biz.description.includes("provides professional grease trap cleaning") ||
      biz.description.includes("Contact them for a free quote")
    );
    if (isTemplateDesc && websiteKeywords.length === 0 && !nameHasGrease && !nameHasTrap) {
      score -= 2;
      scoreBreakdown.push("-2 template description + no grease keywords");
    }

    // Verdict
    let verdict;
    if (score >= 8) verdict = "CONFIRMED";
    else if (score >= 5) verdict = "STRONG";
    else if (score >= 3) verdict = "PROBABLE";
    else if (score >= 1) verdict = "WEAK";
    else verdict = "REMOVE";

    // Evidence summary
    let summary = "";
    if (nameHasGreasePhrase) {
      summary = `Name explicitly says "${GREASE_NAME_PHRASES.find(p => nameLower.includes(p))}". `;
    } else if (nameHasGrease) {
      summary = `Name contains "grease". `;
    } else if (nameHasSeptic) {
      summary = `Septic company. `;
    } else if (nameHasHood) {
      summary = `Hood cleaning company. `;
    } else if (nameHasPlumbing) {
      summary = `Plumbing company. `;
    } else if (nameHasDrain) {
      summary = `Drain service company. `;
    } else if (nameHasWaste) {
      summary = `Waste service company. `;
    } else {
      summary = `No obvious industry keyword in name. `;
    }

    if (websiteKeywords.length > 0) {
      summary += `Website has ${websiteKeywords.length} grease keywords. `;
    } else if (scraped) {
      summary += `Website scraped but 0 grease keywords found. `;
    } else {
      summary += `No scraped website data available. `;
    }

    if (descMentionsGrease && !isTemplateDesc) {
      summary += `Description confirms grease services.`;
    } else if (isTemplateDesc) {
      summary += `Description is template/fallback.`;
    } else {
      summary += `Description does not mention grease.`;
    }

    results.push({
      name: biz.name,
      city: biz.city,
      county: biz.county_slug,
      score,
      verdict,
      score_breakdown: scoreBreakdown,
      name_has_grease: nameHasGrease || nameHasTrap || nameHasInterceptor || nameHasFOG,
      name_keywords: nameKeywords,
      website_grease_keywords_found: websiteKeywords,
      website_keyword_count: websiteKeywords.length,
      website_status: biz.website_status || (biz.website ? "unknown" : "no_website"),
      services: serviceSlugs,
      service_names: serviceNames,
      has_grease_specific_service: hasGreaseSpecificService,
      description_mentions_grease: descMentionsGrease,
      description_is_template: isTemplateDesc || false,
      description_preview: (biz.description || "").slice(0, 100),
      rating: biz.rating,
      review_count: biz.review_count,
      is_verified: biz.is_verified,
      place_id: biz.place_id,
      phone: biz.phone,
      website: biz.website,
      evidence_summary: summary.trim(),
    });
  }

  // Sort by score ascending (worst first)
  results.sort((a, b) => a.score - b.score || a.name.localeCompare(b.name));

  // Save full report
  const outPath = resolve(__dirname, "..", "data", "final-business-verification.json");
  writeFileSync(outPath, JSON.stringify(results, null, 2));
  console.log(`\nFull report saved to ${outPath}\n`);

  // ── Print summary table ────────────────────────────────────────────────

  console.log("=".repeat(120));
  console.log("FULL VERIFICATION TABLE (sorted by score, lowest first)");
  console.log("=".repeat(120));
  console.log(
    "Score".padEnd(7) +
    "Verdict".padEnd(12) +
    "Name".padEnd(55) +
    "City".padEnd(20) +
    "Evidence"
  );
  console.log("-".repeat(120));

  for (const r of results) {
    const name = r.name.length > 53 ? r.name.slice(0, 50) + "..." : r.name;
    const city = r.city.length > 18 ? r.city.slice(0, 15) + "..." : r.city;
    const evidence = [];
    if (r.name_has_grease) evidence.push(`name:${r.name_keywords.filter(k => ["grease","trap","interceptor","FOG"].includes(k)).join("+")}`);
    if (r.name_keywords.includes("septic")) evidence.push("name:septic");
    if (r.name_keywords.includes("hood")) evidence.push("name:hood");
    if (r.name_keywords.includes("plumbing")) evidence.push("name:plumbing");
    if (r.name_keywords.includes("drain")) evidence.push("name:drain");
    if (r.name_keywords.includes("waste")) evidence.push("name:waste");
    evidence.push(`web:${r.website_keyword_count}kw`);
    if (r.description_mentions_grease && !r.description_is_template) evidence.push("desc:grease");
    if (r.description_is_template) evidence.push("desc:template");
    if (r.has_grease_specific_service) evidence.push("svc:grease");
    console.log(
      String(r.score).padEnd(7) +
      r.verdict.padEnd(12) +
      name.padEnd(55) +
      city.padEnd(20) +
      evidence.join(", ")
    );
  }

  // ── Actionable summary ─────────────────────────────────────────────────

  const confirmed = results.filter(r => r.verdict === "CONFIRMED");
  const strong = results.filter(r => r.verdict === "STRONG");
  const probable = results.filter(r => r.verdict === "PROBABLE");
  const weak = results.filter(r => r.verdict === "WEAK");
  const remove = results.filter(r => r.verdict === "REMOVE");

  console.log("\n" + "=".repeat(120));
  console.log("ACTIONABLE SUMMARY");
  console.log("=".repeat(120));

  console.log(`\nCONFIRMED (8-10): ${confirmed.length} businesses — no action needed`);
  console.log(`STRONG (5-7):     ${strong.length} businesses — no action needed`);
  console.log(`PROBABLE (3-4):   ${probable.length} businesses — review recommended`);
  console.log(`WEAK (1-2):       ${weak.length} businesses — your decision needed`);
  console.log(`REMOVE (0-):      ${remove.length} businesses — recommend removal`);

  if (probable.length > 0) {
    console.log("\n--- PROBABLE (3-4) — Review these: ---");
    for (const r of probable) {
      console.log(`  [${r.score}] ${r.name} (${r.city}, ${r.county})`);
      console.log(`      ${r.evidence_summary}`);
      console.log(`      Name keywords: ${r.name_keywords.join(", ") || "none"}`);
      console.log(`      Website keywords: ${r.website_grease_keywords_found.join(", ") || "none"}`);
      console.log(`      Services: ${r.service_names.join(", ")}`);
      console.log(`      Rating: ${r.rating ?? "N/A"} (${r.review_count} reviews) | Verified: ${r.is_verified}`);
      console.log();
    }
  }

  if (weak.length > 0) {
    console.log("\n--- WEAK (1-2) — Your decision needed: ---");
    for (const r of weak) {
      console.log(`  [${r.score}] ${r.name} (${r.city}, ${r.county})`);
      console.log(`      ${r.evidence_summary}`);
      console.log(`      Name keywords: ${r.name_keywords.join(", ") || "none"}`);
      console.log(`      Website keywords: ${r.website_grease_keywords_found.join(", ") || "none"}`);
      console.log(`      Services: ${r.service_names.join(", ")}`);
      console.log(`      Rating: ${r.rating ?? "N/A"} (${r.review_count} reviews) | Verified: ${r.is_verified}`);
      console.log(`      Website: ${r.website || "none"} (${r.website_status})`);
      console.log(`      Description: ${r.description_preview}...`);
      console.log(`      Score breakdown: ${r.score_breakdown.join(", ")}`);
      console.log();
    }
  }

  if (remove.length > 0) {
    console.log("\n--- REMOVE (0 or below) — Recommend removal: ---");
    for (const r of remove) {
      console.log(`  [${r.score}] ${r.name} (${r.city}, ${r.county})`);
      console.log(`      ${r.evidence_summary}`);
      console.log(`      Name keywords: ${r.name_keywords.join(", ") || "none"}`);
      console.log(`      Website keywords: ${r.website_grease_keywords_found.join(", ") || "none"}`);
      console.log(`      Services: ${r.service_names.join(", ")}`);
      console.log(`      Rating: ${r.rating ?? "N/A"} (${r.review_count} reviews) | Verified: ${r.is_verified}`);
      console.log(`      Website: ${r.website || "none"} (${r.website_status})`);
      console.log(`      Description: ${r.description_preview}...`);
      console.log(`      Score breakdown: ${r.score_breakdown.join(", ")}`);
      console.log();
    }
  }

  console.log("\n" + "=".repeat(120));
  console.log(`TOTAL: ${results.length} businesses analyzed`);
  console.log("=".repeat(120));
}

main().catch(console.error);

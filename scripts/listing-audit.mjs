#!/usr/bin/env node

/**
 * Comprehensive listing audit — checks all 168 businesses for data quality issues.
 *
 * Checks: description quality, service tags, legitimacy, 24/7 badges, duplicates, verified badges.
 * Fixes: junk descriptions, missing services, incorrect badges.
 *
 * Reads: Supabase DB + data/scraped-websites-v2.json
 * Writes: data/listing-audit-report.json + Supabase DB updates
 *
 * Usage: node scripts/listing-audit.mjs
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const SCRAPED_PATH = resolve(ROOT, "data", "scraped-websites-v2.json");
const REPORT_PATH = resolve(ROOT, "data", "listing-audit-report.json");

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

// ── JUNK DESCRIPTION DETECTION ──────────────────────────────────────────────
const JUNK_PATTERNS = [
  /follow us/i, /call us/i, /en espa/i, /skip to/i, /\bcookie\b/i,
  /click here/i, /read more/i, /\bmenu\b/i, /\bhome\b/i, /copyright/i,
  /all rights reserved/i, /privacy policy/i, /terms of service/i,
  /sitemap/i, /subscribe/i, /newsletter/i, /log\s*in/i, /sign\s*up/i,
  /explore this/i, /learn more/i, /get started/i, /book now/i,
  /top of page/i, /back to top/i, /mindblown/i, /a blog about/i,
  /powered by/i, /theme by/i, /website by/i, /built with/i,
  /google review/i, /leave a review/i, /write a review/i,
  /^\s*>\s*/m, /-->/, /<!--/,
  /view all/i, /select a/i, /choose a/i,
  /had \w+ (and|come)/i, /came by my/i, /got signed up/i,
  /great job/i, /very professional/i, /highly recommend/i,
  /would recommend/i, /stars?\s*review/i,
];

const TEMPLATE_PATTERN = /provides (professional )?grease trap cleaning/i;

function checkDescription(desc, name) {
  if (!desc || desc.length < 30) return { status: "junk", reason: "too_short_or_null" };

  for (const p of JUNK_PATTERNS) {
    if (p.test(desc)) return { status: "junk", reason: `matched: ${p.source.slice(0, 30)}` };
  }

  if (TEMPLATE_PATTERN.test(desc) && desc.includes(name.split(/\s+/)[0])) {
    return { status: "template", reason: "fallback_template" };
  }

  return { status: "clean" };
}

function generateDescription(biz, services) {
  const serviceNames = services.map((s) => s.service_name || s.label).filter(Boolean);
  let desc = `${biz.name} is a `;

  // Classify business type
  if (/grease|trap|interceptor/i.test(biz.name)) {
    desc += "grease trap service company";
  } else if (/septic/i.test(biz.name)) {
    desc += "septic and grease trap service company";
  } else if (/plumb/i.test(biz.name)) {
    desc += "plumbing company offering grease trap services";
  } else if (/drain/i.test(biz.name)) {
    desc += "drain and grease trap service company";
  } else if (/environ|waste|pump/i.test(biz.name)) {
    desc += "waste management company providing grease trap services";
  } else {
    desc += "commercial service company offering grease trap cleaning";
  }

  desc += ` in ${biz.city}`;
  if (biz.county) desc += `, ${biz.county} County`;
  desc += ", Florida.";

  if (serviceNames.length > 0) {
    const top = serviceNames.slice(0, 3).join(", ");
    desc += ` Services include ${top}.`;
  }

  if (biz.rating && biz.review_count > 0) {
    desc += ` Rated ${biz.rating} stars with ${biz.review_count} Google reviews.`;
  }

  return desc.slice(0, 300);
}

// ── SERVICE TAG CHECK ───────────────────────────────────────────────────────
const SERVICE_KEYWORDS = [
  { slug: "grease-trap-cleaning", patterns: [/grease\s*trap\s*clean/i, /trap\s*clean/i, /grease\s*trap\s*service/i, /grease\s*trap\s*maintenance/i, /grease\s*removal/i] },
  { slug: "grease-interceptor-pumping", patterns: [/interceptor\s*pump/i, /grease\s*interceptor/i, /interceptor\s*clean/i, /interceptor\s*service/i] },
  { slug: "hydro-jetting", patterns: [/hydro[\s-]*jet/i, /water\s*jet/i, /high\s*pressure\s*jet/i, /sewer\s*jet/i] },
  { slug: "emergency-overflow-service", patterns: [/emergency/i, /overflow/i, /24\s*\/?\s*7/i, /24\s*hour/i, /after\s*hours/i, /same\s*day\s*service/i] },
  { slug: "grease-trap-installation", patterns: [/trap\s*install/i, /install\s*grease\s*trap/i, /new\s*grease\s*trap/i] },
  { slug: "grease-trap-repair-replacement", patterns: [/trap\s*repair/i, /grease\s*trap\s*repair/i, /baffle\s*repair/i, /lid\s*replacement/i] },
  { slug: "grease-trap-inspection", patterns: [/trap\s*inspection/i, /grease\s*inspection/i, /FOG\s*inspection/i, /compliance\s*inspection/i] },
  { slug: "used-cooking-oil-collection", patterns: [/cooking\s*oil/i, /used\s*oil/i, /oil\s*collection/i, /oil\s*recycl/i, /yellow\s*grease/i, /fryer\s*oil/i] },
  { slug: "drain-line-cleaning", patterns: [/drain\s*clean/i, /drain\s*line/i, /sewer\s*clean/i, /clogged\s*drain/i, /drain\s*service/i, /rooter/i] },
  { slug: "fog-compliance-consulting", patterns: [/FOG\s*compliance/i, /compliance\s*consult/i, /FOG\s*program/i, /grease\s*management\s*plan/i] },
];

function detectServicesFromText(text) {
  if (!text) return [];
  const found = [];
  for (const sk of SERVICE_KEYWORDS) {
    if (sk.patterns.some((p) => p.test(text))) {
      found.push(sk.slug);
    }
  }
  return found;
}

// ── LEGITIMACY SCORING ──────────────────────────────────────────────────────
function scoreLegitimacy(biz, services, scrapedText) {
  const name = biz.name.toLowerCase();
  const greaseInName = /grease|trap|interceptor/i.test(name);
  const septicWasteEnvInName = /septic|waste|environ|pump|disposal/i.test(name);
  const plumbDrainInName = /plumb|drain|rooter|sewer/i.test(name);

  const greaseServices = services.filter((s) =>
    ["grease-trap-cleaning", "grease-interceptor-pumping", "grease-trap-installation",
     "grease-trap-repair-replacement", "grease-trap-inspection", "fog-compliance-consulting",
     "used-cooking-oil-collection"].includes(s)
  );

  const greaseInText = scrapedText && /grease\s*trap|grease\s*interceptor|FOG\s*(compliance|program|service)|fats?\s*oils?\s*(and\s*)?grease/i.test(scrapedText);

  if (greaseInName) return { score: 5, reason: "grease/trap/interceptor in business name" };
  if (septicWasteEnvInName && greaseServices.length > 0) return { score: 4, reason: "septic/waste/environmental company with grease services" };
  if (plumbDrainInName && greaseServices.length > 0) return { score: 3, reason: "plumbing/drain company with grease services from website" };
  if (plumbDrainInName && greaseInText) return { score: 3, reason: "plumbing/drain company with grease evidence in website text" };
  if (septicWasteEnvInName && greaseInText) return { score: 4, reason: "septic/waste company with grease evidence in website text" };
  if (greaseServices.length > 0) return { score: 3, reason: "has grease-specific service tags" };
  if (greaseInText) return { score: 3, reason: "grease evidence in website text" };
  if (services.length > 0) return { score: 2, reason: "only generic services, minimal grease evidence" };
  return { score: 1, reason: "no grease evidence found" };
}

// ── 24/7 BADGE CHECK ────────────────────────────────────────────────────────
function shouldBeEmergency247(biz, scrapedText) {
  // Check opening_hours for all 7 days = "Open 24 hours"
  if (biz.opening_hours && Array.isArray(biz.opening_hours) && biz.opening_hours.length >= 7) {
    const all24 = biz.opening_hours.every((h) => h.hours && /24\s*hours/i.test(h.hours));
    if (all24) return { should: true, reason: "opening_hours show 24/7 all days" };

    // Normal business hours + website says "24/7" → false
    const hasNormalHours = biz.opening_hours.some((h) => h.hours && /\d{1,2}:\d{2}\s*(AM|PM)/i.test(h.hours));
    if (hasNormalHours && scrapedText && /24\s*\/?\s*7/i.test(scrapedText)) {
      return { should: false, reason: "normal business hours in Google + vague 24/7 claim on website" };
    }
  }

  // Website must mention "24/7" AND ("emergency" OR "after hours" OR "always available")
  if (scrapedText) {
    const has247 = /24\s*\/?\s*7/i.test(scrapedText);
    const hasEmergency = /emergency|after\s*hours|always\s*available/i.test(scrapedText);
    if (has247 && hasEmergency) return { should: true, reason: "website mentions 24/7 + emergency/after hours" };
  }

  return { should: false, reason: "no strong evidence" };
}

// ── VERIFIED BADGE CHECK ────────────────────────────────────────────────────
function shouldBeVerified(biz, scrapedText) {
  const websiteLive = biz.website_status === "live";
  const hasPhone = !!biz.phone;
  const hasReviews = (biz.review_count || 0) > 0;
  const hasPlaceId = !!biz.place_id;
  const goodRating = (Number(biz.rating) || 0) >= 3.0;
  const greaseEvidence = /grease|trap|interceptor|FOG/i.test(biz.name) ||
    (scrapedText && /grease\s*trap|grease\s*interceptor|grease\s*clean/i.test(scrapedText));

  const should = websiteLive && hasPhone && hasReviews && hasPlaceId && goodRating && greaseEvidence;

  const reasons = [];
  if (!websiteLive) reasons.push("website not live");
  if (!hasPhone) reasons.push("no phone");
  if (!hasReviews) reasons.push("no reviews");
  if (!hasPlaceId) reasons.push("no place_id");
  if (!goodRating) reasons.push("rating < 3.0");
  if (!greaseEvidence) reasons.push("no grease keywords");

  return { should, failReasons: reasons };
}

// ── MAIN ────────────────────────────────────────────────────────────────────
async function main() {
  console.log("=== Comprehensive Listing Audit ===\n");

  const env = loadEnv();
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

  // Load all businesses
  const { data: businesses, error } = await supabase
    .from("businesses")
    .select("id, slug, name, city, county, county_slug, phone, phone_unformatted, website, website_status, description, rating, review_count, emergency_24_7, is_verified, place_id, opening_hours, enrichment_confidence, email, years_in_business, pricing_signals")
    .order("name");

  if (error) { console.error("DB error:", error); process.exit(1); }
  console.log(`Loaded ${businesses.length} businesses\n`);

  // Load service tags per business
  const { data: serviceRows } = await supabase
    .from("business_services")
    .select("business_id, service_id, service_types(slug, name)")
    .order("business_id");

  const servicesByBiz = new Map();
  for (const row of serviceRows) {
    if (!servicesByBiz.has(row.business_id)) servicesByBiz.set(row.business_id, []);
    servicesByBiz.get(row.business_id).push({
      service_id: row.service_id,
      slug: row.service_types?.slug,
      service_name: row.service_types?.name,
    });
  }

  // Load service type IDs
  const { data: serviceTypes } = await supabase.from("service_types").select("id, slug, name");
  const serviceTypeMap = new Map(serviceTypes.map((s) => [s.slug, s.id]));

  // Load scraped text
  let scrapedMap = new Map();
  if (existsSync(SCRAPED_PATH)) {
    const scraped = JSON.parse(readFileSync(SCRAPED_PATH, "utf-8"));
    scrapedMap = new Map(scraped.map((s) => [s.slug, s.all_text_combined || ""]));
  }

  // ── CHECK 1: Description Quality ─────────────────────────────────────────
  console.log("CHECK 1: Description Quality");
  const descResults = { clean: [], junk: [], template: [] };

  for (const biz of businesses) {
    const result = checkDescription(biz.description, biz.name);
    if (result.status === "clean") {
      descResults.clean.push(biz.slug);
    } else if (result.status === "junk") {
      descResults.junk.push({ slug: biz.slug, name: biz.name, reason: result.reason, current: (biz.description || "").slice(0, 80) });
    } else {
      descResults.template.push({ slug: biz.slug, name: biz.name });
    }
  }
  console.log(`  Clean: ${descResults.clean.length} | Junk: ${descResults.junk.length} | Template: ${descResults.template.length}\n`);

  // ── CHECK 2: Service Tags ────────────────────────────────────────────────
  console.log("CHECK 2: Service Tags");
  const serviceResults = { good: [], minimal: [], none: [] };
  const GREASE_SPECIFIC_SLUGS = new Set([
    "grease-trap-cleaning", "grease-interceptor-pumping", "grease-trap-installation",
    "grease-trap-repair-replacement", "grease-trap-inspection", "fog-compliance-consulting",
    "used-cooking-oil-collection",
  ]);

  for (const biz of businesses) {
    const services = servicesByBiz.get(biz.id) || [];
    const serviceSlugs = services.map((s) => s.slug);

    if (services.length === 0) {
      serviceResults.none.push({ slug: biz.slug, name: biz.name });
    } else if (services.length === 1 && !GREASE_SPECIFIC_SLUGS.has(serviceSlugs[0])) {
      serviceResults.minimal.push({ slug: biz.slug, name: biz.name, services: serviceSlugs });
    } else if (services.length >= 2) {
      serviceResults.good.push(biz.slug);
    } else {
      serviceResults.minimal.push({ slug: biz.slug, name: biz.name, services: serviceSlugs });
    }
  }
  console.log(`  Good (2+): ${serviceResults.good.length} | Minimal (1): ${serviceResults.minimal.length} | None: ${serviceResults.none.length}\n`);

  // ── CHECK 3: Legitimacy ──────────────────────────────────────────────────
  console.log("CHECK 3: Legitimacy Scoring");
  const legitimacy = { 5: [], 4: [], 3: [], 2: [], 1: [] };

  for (const biz of businesses) {
    const services = (servicesByBiz.get(biz.id) || []).map((s) => s.slug);
    const text = scrapedMap.get(biz.slug) || "";
    const { score, reason } = scoreLegitimacy(biz, services, text);
    legitimacy[score].push({ slug: biz.slug, name: biz.name, city: biz.city, reason });
  }
  console.log(`  Score 5: ${legitimacy[5].length} | Score 4: ${legitimacy[4].length} | Score 3: ${legitimacy[3].length} | Score 2: ${legitimacy[2].length} | Score 1: ${legitimacy[1].length}`);
  if (legitimacy[2].length > 0) {
    console.log(`  Score 2 businesses:`);
    for (const b of legitimacy[2]) console.log(`    - ${b.name} (${b.city}): ${b.reason}`);
  }
  if (legitimacy[1].length > 0) {
    console.log(`  Score 1 businesses:`);
    for (const b of legitimacy[1]) console.log(`    - ${b.name} (${b.city}): ${b.reason}`);
  }
  console.log();

  // ── CHECK 4: 24/7 Badge ──────────────────────────────────────────────────
  console.log("CHECK 4: Emergency 24/7 Badge");
  const emergencyResults = { currentlyTrue: 0, shouldBeTrue: 0, incorrectlyFlagged: [], shouldAdd: [] };

  for (const biz of businesses) {
    const text = scrapedMap.get(biz.slug) || "";
    const { should, reason } = shouldBeEmergency247(biz, text);

    if (biz.emergency_24_7) emergencyResults.currentlyTrue++;
    if (should) emergencyResults.shouldBeTrue++;
    if (biz.emergency_24_7 && !should) {
      emergencyResults.incorrectlyFlagged.push({ slug: biz.slug, name: biz.name, reason });
    }
    if (!biz.emergency_24_7 && should) {
      emergencyResults.shouldAdd.push({ slug: biz.slug, name: biz.name, reason });
    }
  }
  console.log(`  Currently true: ${emergencyResults.currentlyTrue} | Should be true: ${emergencyResults.shouldBeTrue}`);
  console.log(`  Incorrectly flagged: ${emergencyResults.incorrectlyFlagged.length} | Missing badge: ${emergencyResults.shouldAdd.length}\n`);

  // ── CHECK 5: Duplicates ──────────────────────────────────────────────────
  console.log("CHECK 5: Duplicates");
  const duplicates = [];

  // Same phone
  const phoneMap = new Map();
  for (const biz of businesses) {
    if (!biz.phone_unformatted) continue;
    if (!phoneMap.has(biz.phone_unformatted)) phoneMap.set(biz.phone_unformatted, []);
    phoneMap.get(biz.phone_unformatted).push(biz);
  }
  for (const [phone, bizList] of phoneMap) {
    if (bizList.length > 1) {
      duplicates.push({
        type: "same_phone",
        phone,
        businesses: bizList.map((b) => ({ name: b.name, city: b.city, slug: b.slug })),
      });
    }
  }

  // Same name (ignoring location suffix), different cities
  const nameNorm = new Map();
  for (const biz of businesses) {
    // Remove city/state suffixes and normalize
    const norm = biz.name.toLowerCase()
      .replace(/\b(inc|llc|corp|co|company)\b\.?/gi, "")
      .replace(/[^a-z0-9\s]/g, "")
      .trim().replace(/\s+/g, " ");
    if (!nameNorm.has(norm)) nameNorm.set(norm, []);
    nameNorm.get(norm).push(biz);
  }
  for (const [norm, bizList] of nameNorm) {
    if (bizList.length > 1) {
      const cities = new Set(bizList.map((b) => b.city));
      duplicates.push({
        type: cities.size > 1 ? "multi_location_or_duplicate" : "same_name_same_city",
        normalized_name: norm,
        businesses: bizList.map((b) => ({ name: b.name, city: b.city, county: b.county, slug: b.slug })),
      });
    }
  }

  console.log(`  Duplicate flags: ${duplicates.length}`);
  for (const d of duplicates) {
    console.log(`    [${d.type}] ${d.businesses.map((b) => `${b.name} (${b.city})`).join(" <> ")}`);
  }
  console.log();

  // ── CHECK 6: Verified Badge ──────────────────────────────────────────────
  console.log("CHECK 6: Verified Badge");
  const verifiedResults = { currentlyHave: 0, shouldHave: 0, incorrectlyBadged: [], shouldAdd: [] };

  for (const biz of businesses) {
    const text = scrapedMap.get(biz.slug) || "";
    const { should, failReasons } = shouldBeVerified(biz, text);

    if (biz.is_verified) verifiedResults.currentlyHave++;
    if (should) verifiedResults.shouldHave++;
    if (biz.is_verified && !should) {
      verifiedResults.incorrectlyBadged.push({ slug: biz.slug, name: biz.name, reasons: failReasons });
    }
    if (!biz.is_verified && should) {
      verifiedResults.shouldAdd.push({ slug: biz.slug, name: biz.name });
    }
  }
  console.log(`  Currently have: ${verifiedResults.currentlyHave} | Should have: ${verifiedResults.shouldHave}`);
  console.log(`  Incorrectly badged: ${verifiedResults.incorrectlyBadged.length}`);
  if (verifiedResults.incorrectlyBadged.length > 0) {
    for (const b of verifiedResults.incorrectlyBadged) {
      console.log(`    - ${b.name}: ${b.reasons.join(", ")}`);
    }
  }
  console.log();

  // ═══════════════════════════════════════════════════════════════════════════
  // APPLY FIXES
  // ═══════════════════════════════════════════════════════════════════════════
  console.log("=== APPLYING FIXES ===\n");

  let fixedDescriptions = 0;
  let fixedServices = 0;
  let fixedEmergency = 0;
  let fixedVerified = 0;

  // FIX 1: Junk and template descriptions
  for (const entry of [...descResults.junk, ...descResults.template]) {
    const biz = businesses.find((b) => b.slug === entry.slug);
    if (!biz) continue;
    const services = (servicesByBiz.get(biz.id) || []);
    const newDesc = generateDescription(biz, services);
    const { error } = await supabase
      .from("businesses")
      .update({ description: newDesc, updated_at: new Date().toISOString() })
      .eq("slug", entry.slug);
    if (!error) fixedDescriptions++;
  }
  console.log(`Fixed descriptions: ${fixedDescriptions}`);

  // FIX 2: Missing/weak service tags
  for (const entry of [...serviceResults.none, ...serviceResults.minimal]) {
    const biz = businesses.find((b) => b.slug === entry.slug);
    if (!biz) continue;
    const text = scrapedMap.get(biz.slug) || "";
    let detectedSlugs = detectServicesFromText(text);

    // If still no grease-specific services, add "grease-trap-cleaning" as minimum
    const hasGreaseService = detectedSlugs.some((s) => GREASE_SPECIFIC_SLUGS.has(s));
    if (!hasGreaseService) {
      detectedSlugs.push("grease-trap-cleaning");
    }

    // Merge with existing
    const existingSlugs = (servicesByBiz.get(biz.id) || []).map((s) => s.slug);
    const newSlugs = [...new Set([...existingSlugs, ...detectedSlugs])];

    // Clear and re-insert
    await supabase.from("business_services").delete().eq("business_id", biz.id);
    const rows = newSlugs
      .map((slug) => ({ business_id: biz.id, service_id: serviceTypeMap.get(slug) }))
      .filter((r) => r.service_id);

    if (rows.length > 0) {
      const { error } = await supabase.from("business_services").insert(rows);
      if (!error) fixedServices += rows.length - existingSlugs.length;
    }
  }
  console.log(`Added service tags: ${fixedServices}`);

  // FIX 3: Emergency 24/7 badges
  for (const entry of emergencyResults.incorrectlyFlagged) {
    const { error } = await supabase
      .from("businesses")
      .update({ emergency_24_7: false, updated_at: new Date().toISOString() })
      .eq("slug", entry.slug);
    if (!error) fixedEmergency++;
  }
  for (const entry of emergencyResults.shouldAdd) {
    const { error } = await supabase
      .from("businesses")
      .update({ emergency_24_7: true, updated_at: new Date().toISOString() })
      .eq("slug", entry.slug);
    if (!error) fixedEmergency++;
  }
  console.log(`Fixed emergency badges: ${fixedEmergency}`);

  // FIX 4: Verified badges
  for (const entry of verifiedResults.incorrectlyBadged) {
    const { error } = await supabase
      .from("businesses")
      .update({ is_verified: false, updated_at: new Date().toISOString() })
      .eq("slug", entry.slug);
    if (!error) fixedVerified++;
  }
  for (const entry of verifiedResults.shouldAdd) {
    const { error } = await supabase
      .from("businesses")
      .update({ is_verified: true, updated_at: new Date().toISOString() })
      .eq("slug", entry.slug);
    if (!error) fixedVerified++;
  }
  console.log(`Fixed verified badges: ${fixedVerified}`);

  // ── GENERATE REPORT ──────────────────────────────────────────────────────
  const report = {
    generated_at: new Date().toISOString(),
    total_businesses: businesses.length,
    description_quality: {
      clean: descResults.clean.length,
      junk: descResults.junk.length,
      junk_list: descResults.junk.map((j) => ({ name: j.name, reason: j.reason, current_preview: j.current })),
      template_fallback: descResults.template.length,
      template_list: descResults.template.map((t) => t.name),
    },
    service_tags: {
      good: serviceResults.good.length,
      minimal: serviceResults.minimal.length,
      minimal_list: serviceResults.minimal.map((m) => ({ name: m.name, services: m.services })),
      none: serviceResults.none.length,
      none_list: serviceResults.none.map((n) => n.name),
    },
    legitimacy_scores: {
      score_5: legitimacy[5].length,
      score_4: legitimacy[4].length,
      score_3: legitimacy[3].length,
      score_2: legitimacy[2],
      score_1: legitimacy[1],
    },
    emergency_24_7: {
      currently_true: emergencyResults.currentlyTrue,
      should_be_true: emergencyResults.shouldBeTrue,
      incorrectly_flagged: emergencyResults.incorrectlyFlagged,
      missing_badge: emergencyResults.shouldAdd,
    },
    duplicates,
    verified_badge: {
      currently_have: verifiedResults.currentlyHave,
      should_have: verifiedResults.shouldHave,
      incorrectly_badged: verifiedResults.incorrectlyBadged,
      should_add: verifiedResults.shouldAdd,
    },
    fixes_applied: {
      descriptions_rewritten: fixedDescriptions,
      service_tags_added: fixedServices,
      emergency_badges_fixed: fixedEmergency,
      verified_badges_fixed: fixedVerified,
    },
  };

  writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
  console.log(`\nReport saved to ${REPORT_PATH}`);

  // Summary
  console.log("\n═══════════════════════════════════════════════");
  console.log("           AUDIT SUMMARY");
  console.log("═══════════════════════════════════════════════");
  console.log(`Descriptions: ${descResults.clean.length} clean, ${fixedDescriptions} rewritten`);
  console.log(`Services: ${serviceResults.good.length} good, ${fixedServices} tags added`);
  console.log(`Legitimacy: ${legitimacy[5].length} (5) / ${legitimacy[4].length} (4) / ${legitimacy[3].length} (3) / ${legitimacy[2].length} (2) / ${legitimacy[1].length} (1)`);
  console.log(`Emergency 24/7: ${emergencyResults.shouldBeTrue} verified (was ${emergencyResults.currentlyTrue})`);
  console.log(`Verified badge: ${verifiedResults.shouldHave} earned (was ${verifiedResults.currentlyHave})`);
  console.log(`Duplicates flagged: ${duplicates.length}`);
  console.log("═══════════════════════════════════════════════");
}

main().catch(console.error);

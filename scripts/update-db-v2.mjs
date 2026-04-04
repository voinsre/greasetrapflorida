#!/usr/bin/env node

/**
 * Re-enrichment Steps 3-5 — Dedup check, DB update, and report.
 *
 * Reads: data/enriched-v2.json
 * Updates: Supabase DB (businesses, business_services, business_service_areas)
 * Writes: data/re-enrichment-report.json
 *
 * Usage: node scripts/update-db-v2.mjs
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const ENRICHED_PATH = resolve(ROOT, "data", "enriched-v2.json");
const REPORT_PATH = resolve(ROOT, "data", "re-enrichment-report.json");

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

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ── STEP 3: DEDUP CHECK ────────────────────────────────────────────────────
function checkDuplicates(businesses) {
  console.log("\n=== Step 3: Dedup Check ===\n");
  const flags = [];

  // Same phone, different listings
  const phoneMap = new Map();
  for (const biz of businesses) {
    if (!biz.phone_unformatted) continue;
    if (!phoneMap.has(biz.phone_unformatted)) phoneMap.set(biz.phone_unformatted, []);
    phoneMap.get(biz.phone_unformatted).push(biz);
  }
  for (const [phone, bizList] of phoneMap) {
    if (bizList.length > 1) {
      flags.push({
        type: "same_phone",
        phone,
        businesses: bizList.map((b) => ({ slug: b.slug, name: b.name, city: b.city })),
      });
    }
  }

  // Same name + same city
  const nameCityMap = new Map();
  for (const biz of businesses) {
    const key = `${biz.name.toLowerCase()}|${(biz.city || "").toLowerCase()}`;
    if (!nameCityMap.has(key)) nameCityMap.set(key, []);
    nameCityMap.get(key).push(biz);
  }
  for (const [key, bizList] of nameCityMap) {
    if (bizList.length > 1) {
      flags.push({
        type: "same_name_city",
        key,
        businesses: bizList.map((b) => ({ slug: b.slug, name: b.name, city: b.city })),
      });
    }
  }

  // Similar names in nearby cities
  const nameWords = new Map();
  for (const biz of businesses) {
    // Normalize: remove common suffixes, lowercase
    const norm = biz.name
      .toLowerCase()
      .replace(/\b(inc|llc|corp|co|company|services?|plumbing|septic|grease|trap)\b/gi, "")
      .replace(/[^a-z0-9\s]/g, "")
      .trim()
      .replace(/\s+/g, " ");
    if (norm.length < 3) continue;
    if (!nameWords.has(norm)) nameWords.set(norm, []);
    nameWords.get(norm).push(biz);
  }
  for (const [norm, bizList] of nameWords) {
    if (bizList.length > 1) {
      // Check if different cities
      const cities = new Set(bizList.map((b) => b.city));
      if (cities.size > 1) {
        flags.push({
          type: "similar_name_nearby",
          normalized_name: norm,
          businesses: bizList.map((b) => ({ slug: b.slug, name: b.name, city: b.city, county: b.county })),
          note: "May be multi-location or actual duplicate — review manually",
        });
      }
    }
  }

  console.log(`Dedup flags found: ${flags.length}`);
  for (const flag of flags) {
    console.log(`  [${flag.type}] ${flag.businesses.map((b) => `${b.name} (${b.city})`).join(" <> ")}`);
  }

  return flags;
}

// ── STEP 4: UPDATE DATABASE ─────────────────────────────────────────────────
async function updateDatabase(enriched, supabase) {
  console.log("\n=== Step 4: Database Update ===\n");

  // Get service_type IDs
  const { data: serviceTypes } = await supabase.from("service_types").select("id, slug");
  const serviceMap = new Map(serviceTypes.map((s) => [s.slug, s.id]));

  let updatedCount = 0;
  let servicesCleared = 0;
  let servicesInserted = 0;
  let areasInserted = 0;
  const errors = [];

  for (const entry of enriched) {
    // 1. Update business row
    const updateData = {
      description: entry.description,
      emergency_24_7: entry.emergency_24_7,
      enrichment_confidence: entry.enrichment_confidence,
      updated_at: new Date().toISOString(),
    };

    if (entry.email) updateData.email = entry.email;
    if (entry.pricing_signals) updateData.pricing_signals = entry.pricing_signals;
    if (entry.years_in_business) updateData.years_in_business = entry.years_in_business;

    const { error: updateError } = await supabase
      .from("businesses")
      .update(updateData)
      .eq("slug", entry.slug);

    if (updateError) {
      errors.push({ slug: entry.slug, error: updateError.message });
      continue;
    }
    updatedCount++;

    // 2. Get business ID
    const { data: bizRow } = await supabase
      .from("businesses")
      .select("id")
      .eq("slug", entry.slug)
      .single();

    if (!bizRow) continue;
    const bizId = bizRow.id;

    // 3. Clear old business_services and insert new ones
    const { error: delServErr } = await supabase
      .from("business_services")
      .delete()
      .eq("business_id", bizId);

    if (!delServErr) servicesCleared++;

    if (entry.services_offered.length > 0) {
      const serviceRows = entry.services_offered
        .map((s) => {
          const serviceId = serviceMap.get(s.slug);
          if (!serviceId) return null;
          return { business_id: bizId, service_id: serviceId };
        })
        .filter(Boolean);

      if (serviceRows.length > 0) {
        const { error: insServErr } = await supabase
          .from("business_services")
          .insert(serviceRows);
        if (!insServErr) servicesInserted += serviceRows.length;
      }
    }

    // 4. Update service areas if found
    if (entry.service_areas.length > 0) {
      // Clear existing
      await supabase.from("business_service_areas").delete().eq("business_id", bizId);

      const areaRows = entry.service_areas.map((area) => {
        const isCounty = area.endsWith(" County");
        return {
          business_id: bizId,
          county_slug: isCounty ? slugify(area.replace(/ County$/i, "")) : null,
          city_slug: !isCounty ? slugify(area) : null,
        };
      });

      const { error: insAreaErr } = await supabase
        .from("business_service_areas")
        .insert(areaRows);
      if (!insAreaErr) areasInserted += areaRows.length;
    }
  }

  console.log(`Updated: ${updatedCount}/${enriched.length} businesses`);
  console.log(`Services cleared: ${servicesCleared}, inserted: ${servicesInserted}`);
  console.log(`Service areas inserted: ${areasInserted}`);
  if (errors.length > 0) {
    console.log(`Errors: ${errors.length}`);
    for (const e of errors.slice(0, 5)) console.log(`  ${e.slug}: ${e.error}`);
  }

  return { updatedCount, servicesInserted, areasInserted, errors };
}

// ── STEP 5: REPORT ──────────────────────────────────────────────────────────
async function generateReport(enriched, dedupFlags, dbResult, supabase) {
  console.log("\n=== Step 5: Re-enrichment Report ===\n");

  // Get before state from DB (we need old counts)
  // We'll compute from enriched data
  const descFromWebsite = enriched.filter((e) => e.description_source === "website").length;
  const descFromTemplate = enriched.filter((e) => e.description_source === "template").length;
  const totalServices = enriched.reduce((sum, e) => sum + e.services_offered.length, 0);
  const avgServices = (totalServices / enriched.length).toFixed(1);
  const emergency = enriched.filter((e) => e.emergency_24_7).length;
  const emails = enriched.filter((e) => e.email).length;
  const pricing = enriched.filter((e) => e.pricing_signals).length;
  const years = enriched.filter((e) => e.years_in_business).length;
  const serviceAreas = enriched.filter((e) => e.service_areas.length > 0).length;
  const high = enriched.filter((e) => e.enrichment_confidence === "high").length;
  const medium = enriched.filter((e) => e.enrichment_confidence === "medium").length;
  const low = enriched.filter((e) => e.enrichment_confidence === "low").length;

  // Service distribution
  const serviceDist = {};
  for (const e of enriched) {
    for (const s of e.services_offered) {
      serviceDist[s.label] = (serviceDist[s.label] || 0) + 1;
    }
  }

  const report = {
    generated_at: new Date().toISOString(),
    total_businesses: enriched.length,
    descriptions: {
      from_website: descFromWebsite,
      from_template: descFromTemplate,
      percentage_website: ((descFromWebsite / enriched.length) * 100).toFixed(1) + "%",
    },
    services: {
      total_service_tags: totalServices,
      average_per_business: avgServices,
      distribution: Object.entries(serviceDist)
        .sort((a, b) => b[1] - a[1])
        .map(([name, count]) => ({ name, count })),
    },
    emergency_24_7: {
      count: emergency,
      percentage: ((emergency / enriched.length) * 100).toFixed(1) + "%",
      note: "After strict verification (trust opening_hours over vague website claims)",
    },
    emails: {
      count: emails,
      percentage: ((emails / enriched.length) * 100).toFixed(1) + "%",
    },
    pricing_signals: {
      count: pricing,
      percentage: ((pricing / enriched.length) * 100).toFixed(1) + "%",
    },
    years_in_business: {
      count: years,
      percentage: ((years / enriched.length) * 100).toFixed(1) + "%",
    },
    service_areas: {
      with_coverage_data: serviceAreas,
      percentage: ((serviceAreas / enriched.length) * 100).toFixed(1) + "%",
    },
    enrichment_confidence: { high, medium, low },
    dedup_flags: dedupFlags,
    db_update: dbResult,
  };

  // Print summary table
  console.log("┌─────────────────────────────────┬─────────┐");
  console.log("│ Metric                          │ Value   │");
  console.log("├─────────────────────────────────┼─────────┤");
  console.log(`│ Descriptions from website       │ ${String(descFromWebsite).padStart(7)} │`);
  console.log(`│ Descriptions from template      │ ${String(descFromTemplate).padStart(7)} │`);
  console.log(`│ Avg services per business       │ ${String(avgServices).padStart(7)} │`);
  console.log(`│ Emergency 24/7 (strict)         │ ${String(emergency).padStart(7)} │`);
  console.log(`│ Emails found                    │ ${String(emails).padStart(7)} │`);
  console.log(`│ Pricing signals                 │ ${String(pricing).padStart(7)} │`);
  console.log(`│ Years in business               │ ${String(years).padStart(7)} │`);
  console.log(`│ With service area data          │ ${String(serviceAreas).padStart(7)} │`);
  console.log(`│ Confidence: HIGH                │ ${String(high).padStart(7)} │`);
  console.log(`│ Confidence: MEDIUM              │ ${String(medium).padStart(7)} │`);
  console.log(`│ Confidence: LOW                 │ ${String(low).padStart(7)} │`);
  console.log(`│ Dedup flags                     │ ${String(dedupFlags.length).padStart(7)} │`);
  console.log("└─────────────────────────────────┴─────────┘");

  writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
  console.log(`\nReport saved to ${REPORT_PATH}`);

  return report;
}

// ── MAIN ────────────────────────────────────────────────────────────────────
async function main() {
  console.log("=== Re-enrichment Steps 3-5: Dedup + DB Update + Report ===\n");

  if (!existsSync(ENRICHED_PATH)) {
    console.error("ERROR: data/enriched-v2.json not found. Run enrich-v2.mjs first.");
    process.exit(1);
  }

  const enriched = JSON.parse(readFileSync(ENRICHED_PATH, "utf-8"));
  console.log(`Loaded ${enriched.length} enriched entries`);

  const env = loadEnv();
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

  // Load full business data for dedup
  const { data: businesses } = await supabase
    .from("businesses")
    .select("slug, name, city, county, phone_unformatted");

  // Step 3: Dedup
  const dedupFlags = checkDuplicates(businesses);

  // Step 4: Update DB
  const dbResult = await updateDatabase(enriched, supabase);

  // Step 5: Report
  await generateReport(enriched, dedupFlags, dbResult, supabase);

  console.log("\n=== All steps complete ===");
}

main().catch(console.error);

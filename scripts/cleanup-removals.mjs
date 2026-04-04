#!/usr/bin/env node

/**
 * Data quality cleanup — remove 58 non-grease businesses, fix remaining junk descriptions,
 * recalculate all counts, prune empty cities/counties.
 *
 * Usage: node scripts/cleanup-removals.mjs
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

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

// ── Businesses to remove ────────────────────────────────────────────────────

const SCORE_1_NAMES = [
  "Affordable Well Pump Services (formerly HALEFORCE)",
  "AM Florida Plumbers",
  "Astro Plumbing Services",
  "Bay Plumbing Co",
  "Bestechnologies",
  "Cass Plumbing, Inc.",
  "Gary's Plumbing & Fire, Inc.",
  "Green Team Plumbing & Backflow",
  "GreenTeam | Building Services",
  "Hood Master Service",
  "Hoodz of the Treasure Coast",
  "Island Restrooms",
  "McIntyre Plumbing INC",
  "Mike's Plumbing of Southwest Florida",
  "model plumbing contractor",
  "Plumbing Solutions",
  "Posh Plumber",
  "Samsula Demolition",
  "Tony Herce Plumbing",
  "Unclog Plumbing Services 24/7",
  "Walker Plumbing Services Inc.",
  "Zero Waste Disposal & Recycling",
];

const SCORE_2_NAMES = [
  "A-1 Plumbing & Gas Inc.",
  "Billy The Sunshine Plumber",
  "Borkat Plumbing Services, LLC",
  "Diversified Plumbing Services of SW Florida",
  "Eco Pipe Lining",
  "Estrella Plumbing Contractors",
  "Savnik Plumbing LLC",
];

// ── Junk description patterns ───────────────────────────────────────────────
const JUNK_PATTERNS = [
  /follow us/i, /call us/i, /en espa/i, /skip to/i, /\bcookie\b/i,
  /click here/i, /read more/i, /\bmenu\b/i, /\bhome\b/i, /copyright/i,
  /all rights reserved/i, /privacy policy/i, /terms of service/i,
  /sitemap/i, /subscribe/i, /newsletter/i, /log\s*in/i, /sign\s*up/i,
  /explore this/i, /learn more/i, /get started/i, /book now/i,
  /top of page/i, /back to top/i, /mindblown/i, /a blog about/i,
  /powered by/i, /theme by/i, /website by/i, /built with/i,
  /google review/i, /leave a review/i, /write a review/i,
  /-->/, /<!--/, /view all/i, /select a/i, /choose a/i,
  /had \w+ (and|come)/i, /came by my/i, /got signed up/i,
  /great job/i, /very professional/i, /highly recommend/i,
  /would recommend/i, /stars?\s*review/i,
];

function isJunkDescription(desc) {
  if (!desc || desc.length < 30) return true;
  for (const p of JUNK_PATTERNS) {
    if (p.test(desc)) return true;
  }
  return false;
}

function generateDescription(biz, services) {
  const serviceNames = services.map((s) => s.name).filter(Boolean);
  let desc = `${biz.name} is a `;

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

// ── MAIN ────────────────────────────────────────────────────────────────────
async function main() {
  console.log("=== Data Quality Cleanup ===\n");

  const env = loadEnv();
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

  // ── STEP 1: Remove score 1 + score 2 businesses ──────────────────────────
  console.log("STEP 1: Remove score 1 + score 2 businesses");
  const removeNames = [...SCORE_1_NAMES, ...SCORE_2_NAMES];
  let removedByName = 0;

  for (const name of removeNames) {
    // Get business ID first
    const { data: biz } = await supabase.from("businesses").select("id, slug").eq("name", name).single();
    if (!biz) {
      console.log(`  WARN: "${name}" not found in DB`);
      continue;
    }

    // Delete junction table rows
    await supabase.from("business_services").delete().eq("business_id", biz.id);
    await supabase.from("business_service_areas").delete().eq("business_id", biz.id);
    await supabase.from("business_establishment_types").delete().eq("business_id", biz.id);

    // Delete business
    const { error } = await supabase.from("businesses").delete().eq("id", biz.id);
    if (error) {
      console.log(`  ERROR deleting "${name}": ${error.message}`);
    } else {
      removedByName++;
    }
  }
  console.log(`  Removed ${removedByName} businesses by name\n`);

  // ── STEP 2: Remove all Roto-Rooter listings ──────────────────────────────
  console.log("STEP 2: Remove all Roto-Rooter listings");
  const { data: rotoRooters } = await supabase
    .from("businesses")
    .select("id, name, city")
    .ilike("name", "%Roto-Rooter%");

  let removedRR = 0;
  for (const rr of rotoRooters || []) {
    await supabase.from("business_services").delete().eq("business_id", rr.id);
    await supabase.from("business_service_areas").delete().eq("business_id", rr.id);
    await supabase.from("business_establishment_types").delete().eq("business_id", rr.id);
    const { error } = await supabase.from("businesses").delete().eq("id", rr.id);
    if (!error) removedRR++;
  }
  console.log(`  Removed ${removedRR} Roto-Rooter listings\n`);

  const totalRemoved = removedByName + removedRR;
  console.log(`TOTAL REMOVED: ${totalRemoved}\n`);

  // ── STEP 3: Fix remaining junk descriptions ──────────────────────────────
  console.log("STEP 3: Fix junk descriptions on remaining businesses");
  const { data: remaining } = await supabase
    .from("businesses")
    .select("id, slug, name, city, county, rating, review_count, description");

  // Get service names per business
  const { data: svcRows } = await supabase
    .from("business_services")
    .select("business_id, service_types(name)");

  const svcMap = new Map();
  for (const r of svcRows || []) {
    if (!svcMap.has(r.business_id)) svcMap.set(r.business_id, []);
    svcMap.get(r.business_id).push({ name: r.service_types?.name });
  }

  let fixedDesc = 0;
  for (const biz of remaining) {
    if (isJunkDescription(biz.description)) {
      const services = svcMap.get(biz.id) || [];
      const newDesc = generateDescription(biz, services);
      await supabase
        .from("businesses")
        .update({ description: newDesc, updated_at: new Date().toISOString() })
        .eq("id", biz.id);
      fixedDesc++;
    }
  }
  console.log(`  Fixed ${fixedDesc} junk descriptions\n`);

  // ── STEP 4: Recalculate county business_count ────────────────────────────
  console.log("STEP 4: Recalculate county and city counts");

  const { data: allBiz } = await supabase.from("businesses").select("county_slug, city");

  // County counts
  const countyCounts = new Map();
  for (const b of allBiz) {
    if (b.county_slug) {
      countyCounts.set(b.county_slug, (countyCounts.get(b.county_slug) || 0) + 1);
    }
  }

  // Reset all county counts to 0 first
  const { data: allCounties } = await supabase.from("counties").select("slug");
  for (const c of allCounties) {
    const count = countyCounts.get(c.slug) || 0;
    await supabase.from("counties").update({ business_count: count }).eq("slug", c.slug);
  }

  const countiesWithBiz = [...countyCounts.entries()].filter(([, c]) => c >= 2).length;
  const countiesWithOne = [...countyCounts.entries()].filter(([, c]) => c === 1).length;
  console.log(`  Counties with 2+ businesses: ${countiesWithBiz}`);
  console.log(`  Counties with 1 business: ${countiesWithOne}`);

  // City counts
  const cityCounts = new Map();
  for (const b of allBiz) {
    const key = b.city?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    if (key) cityCounts.set(key, (cityCounts.get(key) || 0) + 1);
  }

  const { data: allCities } = await supabase.from("cities").select("slug");
  let citiesRemoved = 0;
  let citiesKept = 0;
  for (const c of allCities) {
    const count = cityCounts.get(c.slug) || 0;
    if (count < 2) {
      // Remove city with fewer than 2 businesses
      await supabase.from("cities").delete().eq("slug", c.slug);
      citiesRemoved++;
    } else {
      await supabase.from("cities").update({ business_count: count }).eq("slug", c.slug);
      citiesKept++;
    }
  }
  console.log(`  Cities kept (2+): ${citiesKept}`);
  console.log(`  Cities removed (<2): ${citiesRemoved}\n`);

  // ── STEP 5: Verify badge counts ─────────────────────────────────────────
  console.log("STEP 5: Verify final state");
  const { data: finalBiz } = await supabase
    .from("businesses")
    .select("is_verified, emergency_24_7");

  const totalBiz = finalBiz.length;
  const verifiedCount = finalBiz.filter((b) => b.is_verified).length;
  const emergencyCount = finalBiz.filter((b) => b.emergency_24_7).length;

  // Count service tags
  const { data: finalSvc } = await supabase.from("business_services").select("*", { count: "exact", head: true });

  console.log(`  Total businesses: ${totalBiz}`);
  console.log(`  Verified badges: ${verifiedCount}`);
  console.log(`  Emergency 24/7: ${emergencyCount}`);
  console.log(`  Counties with 2+ biz: ${countiesWithBiz}`);
  console.log(`  Cities with 2+ biz: ${citiesKept}`);

  // ── Summary ──────────────────────────────────────────────────────────────
  console.log("\n═══════════════════════════════════════════════");
  console.log("           CLEANUP SUMMARY");
  console.log("═══════════════════════════════════════════════");
  console.log(`Removed: ${totalRemoved} businesses (${removedByName} score 1+2, ${removedRR} Roto-Rooter)`);
  console.log(`Remaining: ${totalBiz} businesses`);
  console.log(`Descriptions fixed: ${fixedDesc}`);
  console.log(`Verified: ${verifiedCount} | Emergency: ${emergencyCount}`);
  console.log(`Counties: ${countiesWithBiz} (2+ biz) | Cities: ${citiesKept} (2+ biz)`);
  console.log(`Cities pruned: ${citiesRemoved}`);
  console.log("═══════════════════════════════════════════════");
}

main().catch(console.error);

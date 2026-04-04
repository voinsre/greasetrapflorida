import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

// Load .env.local
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "..", ".env.local");
const envContent = readFileSync(envPath, "utf8");
for (const line of envContent.split("\n")) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim();
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

// ── Service type matching ──────────────────────────────────────────────────

const SERVICE_TYPE_MAP = {
  "grease-trap-cleaning": [
    "grease trap cleaning", "trap cleaning", "grease removal",
    "clean grease trap", "grease trap service", "grease trap maintenance",
    "grease trap", "grease cleaning",
  ],
  "grease-interceptor-pumping": [
    "interceptor pumping", "grease interceptor", "interceptor cleaning",
    "interceptor service", "pump interceptor",
  ],
  "hydro-jetting": [
    "hydro jetting", "hydro-jetting", "hydrojet", "water jetting",
    "high pressure jetting", "jet cleaning", "sewer jetting",
  ],
  "emergency-overflow-service": [
    "emergency", "overflow", "24/7", "24 hour", "after hours",
    "same day service", "urgent",
  ],
  "grease-trap-installation": [
    "trap installation", "install grease trap", "new grease trap",
  ],
  "grease-trap-repair-replacement": [
    "trap repair", "fix grease trap", "grease trap repair",
    "baffle repair", "lid replacement",
  ],
  "grease-trap-inspection": [
    "trap inspection", "grease inspection", "FOG inspection",
    "compliance inspection",
  ],
  "used-cooking-oil-collection": [
    "cooking oil", "used oil", "oil collection", "oil recycling",
    "yellow grease", "fryer oil", "waste oil",
  ],
  "drain-line-cleaning": [
    "drain cleaning", "drain line", "sewer cleaning", "clogged drain",
    "drain service", "rooter",
  ],
  "fog-compliance-consulting": [
    "FOG compliance", "compliance consulting", "FOG program",
    "grease management plan", "FOG audit",
  ],
};

function matchServices(name, description) {
  const text = `${name} ${description || ""}`.toLowerCase();
  const matched = [];
  for (const [slug, keywords] of Object.entries(SERVICE_TYPE_MAP)) {
    if (keywords.some((kw) => text.includes(kw.toLowerCase()))) {
      matched.push(slug);
    }
  }
  return matched;
}

// ── Slugify helper ─────────────────────────────────────────────────────────

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ── STEP 1: Fix service tags ───────────────────────────────────────────────

async function fixServiceTags() {
  console.log("\n=== STEP 1: Fix service tags ===");

  // Get all service types for slug → UUID mapping
  const { data: serviceTypes } = await supabase
    .from("service_types")
    .select("id, slug");
  const slugToId = new Map(serviceTypes.map((s) => [s.slug, s.id]));

  // Get all businesses
  const { data: allBiz } = await supabase
    .from("businesses")
    .select("id, name, description");

  // Get all existing service junctions
  const { data: existingJunctions } = await supabase
    .from("business_services")
    .select("business_id");
  const bizWithTags = new Set(existingJunctions.map((j) => j.business_id));

  // Find businesses with no service tags
  const noTags = allBiz.filter((b) => !bizWithTags.has(b.id));
  console.log(`Found ${noTags.length} businesses with no service tags`);

  let added = 0;
  for (const biz of noTags) {
    let services = matchServices(biz.name, biz.description);

    // Default to grease-trap-cleaning if no match
    if (services.length === 0) {
      services = ["grease-trap-cleaning"];
    }

    const rows = services
      .map((slug) => {
        const serviceId = slugToId.get(slug);
        if (!serviceId) return null;
        return { business_id: biz.id, service_id: serviceId };
      })
      .filter(Boolean);

    if (rows.length > 0) {
      const { error } = await supabase.from("business_services").insert(rows);
      if (error) {
        console.error(`  Error for "${biz.name}": ${error.message}`);
      } else {
        console.log(`  Added ${rows.length} service tag(s) for "${biz.name}": ${services.join(", ")}`);
        added += rows.length;
      }
    }
  }

  console.log(`Total service tags added: ${added}`);
  return noTags.length;
}

// ── STEP 2: Fix city and county counts ─────────────────────────────────────

async function fixCounts() {
  console.log("\n=== STEP 2: Fix city and county counts ===");

  // Get all businesses with their city and county
  const { data: allBiz } = await supabase
    .from("businesses")
    .select("id, city, county_slug");

  console.log(`Total businesses: ${allBiz.length}`);

  // Build city → count map (key: lowercase city name + county_slug)
  const cityCountMap = new Map();
  for (const biz of allBiz) {
    if (!biz.city) continue;
    const key = `${biz.city.toLowerCase()}|${biz.county_slug || ""}`;
    cityCountMap.set(key, (cityCountMap.get(key) || 0) + 1);
  }

  // Get existing cities
  const { data: existingCities } = await supabase
    .from("cities")
    .select("slug, name, county_slug");
  const existingCityKeys = new Set(
    existingCities.map((c) => `${c.name.toLowerCase()}|${c.county_slug || ""}`)
  );

  // Find cities that need to be created (2+ businesses, not already in table)
  const newCities = [];
  for (const [key, count] of cityCountMap) {
    if (count >= 2 && !existingCityKeys.has(key)) {
      const [cityName, countySlug] = key.split("|");
      // Find original case from a business
      const originalBiz = allBiz.find(
        (b) => b.city && b.city.toLowerCase() === cityName && b.county_slug === countySlug
      );
      if (originalBiz) {
        newCities.push({
          name: originalBiz.city,
          slug: slugify(originalBiz.city),
          county_slug: countySlug || null,
          county_name: countySlug
            ? countySlug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
            : null,
          business_count: count,
        });
      }
    }
  }

  if (newCities.length > 0) {
    console.log(`Creating ${newCities.length} new cities: ${newCities.map((c) => c.name).join(", ")}`);
    for (const city of newCities) {
      const { error } = await supabase.from("cities").insert(city);
      if (error) {
        console.error(`  Error creating city "${city.name}": ${error.message}`);
      }
    }
  } else {
    console.log("No new cities needed");
  }

  // Recalculate ALL city counts
  const { data: allCities } = await supabase
    .from("cities")
    .select("slug, name, county_slug");

  let citiesUpdated = 0;
  for (const city of allCities) {
    const { count } = await supabase
      .from("businesses")
      .select("id", { count: "exact", head: true })
      .eq("county_slug", city.county_slug)
      .ilike("city", city.name);

    await supabase
      .from("cities")
      .update({ business_count: count ?? 0 })
      .eq("slug", city.slug);
    citiesUpdated++;
  }
  console.log(`Updated counts for ${citiesUpdated} cities`);

  // Remove cities with < 2 businesses
  const { data: smallCities } = await supabase
    .from("cities")
    .select("slug, name, business_count")
    .lt("business_count", 2);

  if (smallCities && smallCities.length > 0) {
    console.log(`Removing ${smallCities.length} cities with < 2 businesses: ${smallCities.map((c) => `${c.name}(${c.business_count})`).join(", ")}`);
    await supabase.from("cities").delete().lt("business_count", 2);
  }

  // Recalculate ALL county counts
  const { data: allCounties } = await supabase.from("counties").select("slug");
  let countiesUpdated = 0;
  for (const county of allCounties) {
    const { count } = await supabase
      .from("businesses")
      .select("id", { count: "exact", head: true })
      .eq("county_slug", county.slug);

    await supabase
      .from("counties")
      .update({ business_count: count ?? 0 })
      .eq("slug", county.slug);
    countiesUpdated++;
  }
  console.log(`Updated counts for ${countiesUpdated} counties`);
}

// ── STEP 3: Verify ─────────────────────────────────────────────────────────

async function verify() {
  console.log("\n=== STEP 3: Verify ===");

  const { count: bizCount } = await supabase
    .from("businesses")
    .select("id", { count: "exact", head: true });

  const { count: tagCount } = await supabase
    .from("business_services")
    .select("business_id", { count: "exact", head: true });

  // Count businesses WITH at least 1 service tag
  const { data: taggedBiz } = await supabase
    .from("business_services")
    .select("business_id");
  const uniqueTagged = new Set(taggedBiz.map((t) => t.business_id));

  const { count: countyCount } = await supabase
    .from("counties")
    .select("slug", { count: "exact", head: true })
    .gt("business_count", 0);

  const { count: cityCount } = await supabase
    .from("cities")
    .select("slug", { count: "exact", head: true })
    .gte("business_count", 2);

  console.log(`  Total businesses: ${bizCount}`);
  console.log(`  Businesses with service tags: ${uniqueTagged.size} / ${bizCount}`);
  console.log(`  Total service tag rows: ${tagCount}`);
  console.log(`  Counties with businesses: ${countyCount}`);
  console.log(`  Cities with 2+ businesses: ${cityCount}`);

  if (uniqueTagged.size < bizCount) {
    // Find which ones are missing
    const { data: allBiz } = await supabase.from("businesses").select("id, name");
    const missing = allBiz.filter((b) => !uniqueTagged.has(b.id));
    console.log(`  MISSING service tags: ${missing.map((b) => b.name).join(", ")}`);
  }
}

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  await fixServiceTags();
  await fixCounts();
  await verify();
  console.log("\nDone!");
}

main().catch(console.error);

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "..", ".env.local");
for (const line of readFileSync(envPath, "utf8").split("\n")) {
  const m = line.match(/^([^#=]+)=(.*)$/);
  if (m) process.env[m[1].trim()] = m[2].trim();
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const REMOVALS = [
  { name: "Titan Dry Fogging", city: "West Palm Beach" },
  { name: "GreaseBusters", city: "Tampa" },
  { name: "Engine & Accessory, Inc.", city: "Miami" },
  { name: "Aetna Plumbing", city: "Stuart" },
  { name: "Florida Rooter", city: "Lady Lake" },
  { name: "Florida Rooter", city: "Leesburg" },
];

async function main() {
  console.log("=== Removing 6 businesses ===\n");

  for (const r of REMOVALS) {
    const { data, error } = await supabase
      .from("businesses")
      .select("id, name, city")
      .ilike("name", r.name)
      .ilike("city", r.city);

    if (error) { console.error(`Error querying "${r.name}": ${error.message}`); continue; }
    if (!data || data.length === 0) { console.warn(`NOT FOUND: "${r.name}" in ${r.city}`); continue; }

    for (const biz of data) {
      // Delete junctions first
      await supabase.from("business_services").delete().eq("business_id", biz.id);
      await supabase.from("business_service_areas").delete().eq("business_id", biz.id);
      // Delete business
      const { error: delErr } = await supabase.from("businesses").delete().eq("id", biz.id);
      if (delErr) {
        console.error(`  Error deleting "${biz.name}": ${delErr.message}`);
      } else {
        console.log(`  Deleted: "${biz.name}" (${biz.city})`);
      }
    }
  }

  // Recalculate county counts
  console.log("\n=== Recalculating county counts ===");
  const { data: counties } = await supabase.from("counties").select("slug");
  for (const county of counties ?? []) {
    const { count } = await supabase
      .from("businesses")
      .select("id", { count: "exact", head: true })
      .eq("county_slug", county.slug);
    await supabase.from("counties").update({ business_count: count ?? 0 }).eq("slug", county.slug);
  }

  // Recalculate city counts
  console.log("=== Recalculating city counts ===");
  const { data: cities } = await supabase.from("cities").select("slug, name, county_slug");
  for (const city of cities ?? []) {
    const { count } = await supabase
      .from("businesses")
      .select("id", { count: "exact", head: true })
      .eq("county_slug", city.county_slug)
      .ilike("city", city.name);
    await supabase.from("cities").update({ business_count: count ?? 0 }).eq("slug", city.slug);
  }

  // Remove cities with < 2
  const { data: small } = await supabase.from("cities").select("slug, name, business_count").lt("business_count", 2);
  if (small && small.length > 0) {
    console.log(`Removing ${small.length} cities with < 2 businesses: ${small.map(c => c.name).join(", ")}`);
    await supabase.from("cities").delete().lt("business_count", 2);
  }

  // Verify
  const { count: bizCount } = await supabase.from("businesses").select("id", { count: "exact", head: true });
  const { count: countyCount } = await supabase.from("counties").select("slug", { count: "exact", head: true }).gt("business_count", 0);
  const { count: cityCount } = await supabase.from("cities").select("slug", { count: "exact", head: true }).gte("business_count", 2);

  console.log(`\n=== Final counts ===`);
  console.log(`  Businesses: ${bizCount}`);
  console.log(`  Counties with businesses: ${countyCount}`);
  console.log(`  Cities with 2+ businesses: ${cityCount}`);
}

main().catch(console.error);

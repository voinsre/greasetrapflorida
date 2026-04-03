/**
 * Phase 6: Database Population
 * Loads enriched business data into Supabase.
 * Insert order: counties (update) → cities → businesses → junction tables → update counts
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');

// Load .env.local manually (no dotenv dependency)
function loadEnv() {
  const envPath = resolve(rootDir, '.env.local');
  const lines = readFileSync(envPath, 'utf-8').split('\n');
  const env = {};
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    env[trimmed.slice(0, eqIdx).trim()] = trimmed.slice(eqIdx + 1).trim();
  }
  return env;
}

const env = loadEnv();
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Load enriched data
const enrichedPath = resolve(rootDir, 'data', 'enriched.json');
const businesses = JSON.parse(readFileSync(enrichedPath, 'utf-8'));
console.log(`Loaded ${businesses.length} businesses from enriched.json`);

// ── Step 1: Fetch existing seed data ──────────────────────────────────

async function fetchSeedData() {
  const { data: counties, error: cErr } = await supabase
    .from('counties').select('id, slug, name');
  if (cErr) throw new Error(`Fetch counties: ${cErr.message}`);

  const { data: serviceTypes, error: sErr } = await supabase
    .from('service_types').select('id, slug');
  if (sErr) throw new Error(`Fetch service_types: ${sErr.message}`);

  const { data: estTypes, error: eErr } = await supabase
    .from('establishment_types').select('id, slug');
  if (eErr) throw new Error(`Fetch establishment_types: ${eErr.message}`);

  return {
    countyMap: Object.fromEntries(counties.map(c => [c.slug, c])),
    serviceMap: Object.fromEntries(serviceTypes.map(s => [s.slug, s.id])),
    estMap: Object.fromEntries(estTypes.map(e => [e.slug, e.id])),
  };
}

// ── Step 2: Build city list (2+ businesses) ───────────────────────────

function buildCities(businesses) {
  const cityCount = {};
  for (const b of businesses) {
    const key = `${b.city}|${b.county_slug}`;
    if (!cityCount[key]) {
      cityCount[key] = { name: b.city, county_slug: b.county_slug, county: b.county, count: 0 };
    }
    cityCount[key].count++;
  }
  // Only cities with 2+ businesses
  return Object.values(cityCount).filter(c => c.count >= 2);
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// ── Step 3: Insert cities ─────────────────────────────────────────────

async function insertCities(cities) {
  const rows = cities.map(c => ({
    name: c.name,
    slug: slugify(c.name),
    county_slug: c.county_slug,
    county_name: c.county,
    business_count: 0, // will update later
    meta_title: `Grease Trap Cleaning ${c.name}, Florida`,
    meta_description: `Find grease trap cleaning services in ${c.name}, FL. Compare ${c.county} County companies, get quotes, and verify DEP compliance.`,
  }));

  // Deduplicate by slug (some cities might map to same slug)
  const seen = new Set();
  const unique = [];
  for (const r of rows) {
    if (!seen.has(r.slug)) {
      seen.add(r.slug);
      unique.push(r);
    }
  }

  // Batch insert in groups of 50
  let inserted = 0;
  for (let i = 0; i < unique.length; i += 50) {
    const batch = unique.slice(i, i + 50);
    const { error } = await supabase.from('cities').upsert(batch, { onConflict: 'slug' });
    if (error) throw new Error(`Insert cities batch ${i}: ${error.message}`);
    inserted += batch.length;
  }
  console.log(`Inserted/upserted ${inserted} cities`);
  return unique;
}

// ── Step 4: Insert businesses ─────────────────────────────────────────

function deriveServesFlags(estTypes) {
  const slugs = (estTypes || []).map(e => e.slug);
  return {
    serves_restaurants: slugs.includes('restaurants'),
    serves_hotels: slugs.includes('hotels-resorts'),
    serves_hospitals: slugs.includes('hospital-kitchens'),
    serves_schools: slugs.includes('school-cafeterias'),
    serves_food_trucks: slugs.includes('food-trucks'),
  };
}

async function insertBusinesses(businesses) {
  let inserted = 0;
  let errors = 0;

  for (let i = 0; i < businesses.length; i += 50) {
    const batch = businesses.slice(i, i + 50);
    const rows = batch.map(b => {
      const flags = deriveServesFlags(b.establishment_types_served);
      return {
        slug: b.slug,
        name: b.name,
        phone: b.phone || null,
        phone_unformatted: b.phone_unformatted || null,
        email: b.email || null,
        website: b.website || null,
        address: b.address || null,
        city: b.city,
        county: b.county || null,
        county_slug: b.county_slug || null,
        state: b.state || 'Florida',
        state_abbreviation: b.state_abbreviation || 'FL',
        zip: b.zip || null,
        lat: b.lat || null,
        lng: b.lng || null,
        description: b.description || null,
        rating: b.rating || null,
        review_count: b.review_count || 0,
        emergency_24_7: b.emergency_24_7 || false,
        manifest_provided: b.manifest_provided || false,
        years_in_business: b.years_in_business || null,
        pricing_signals: b.pricing_signals || null,
        place_id: b.place_id || null,
        opening_hours: b.opening_hours || null,
        website_status: b.website_status || null,
        enrichment_confidence: b.enrichment_confidence || 'low',
        ...flags,
      };
    });

    const { error } = await supabase.from('businesses').upsert(rows, { onConflict: 'slug' });
    if (error) {
      console.error(`Business batch ${i}-${i + batch.length}: ${error.message}`);
      errors++;
    } else {
      inserted += batch.length;
    }

    if ((i + 50) % 500 === 0 || i + 50 >= businesses.length) {
      console.log(`  Businesses: ${Math.min(i + 50, businesses.length)}/${businesses.length}`);
    }
  }

  console.log(`Inserted ${inserted} businesses (${errors} batch errors)`);
  return inserted;
}

// ── Step 5: Junction tables ───────────────────────────────────────────

async function fetchBusinessIds() {
  // Paginate to get all business IDs
  const all = [];
  let from = 0;
  const PAGE = 1000;
  while (true) {
    const { data, error } = await supabase
      .from('businesses').select('id, slug').range(from, from + PAGE - 1);
    if (error) throw new Error(`Fetch business IDs: ${error.message}`);
    all.push(...data);
    if (data.length < PAGE) break;
    from += PAGE;
  }
  return Object.fromEntries(all.map(b => [b.slug, b.id]));
}

async function insertBusinessServices(businesses, bizIdMap, serviceMap) {
  const rows = [];
  for (const b of businesses) {
    const bizId = bizIdMap[b.slug];
    if (!bizId || !b.services_offered) continue;
    for (const svc of b.services_offered) {
      const svcId = serviceMap[svc.slug];
      if (svcId) {
        rows.push({ business_id: bizId, service_id: svcId });
      }
    }
  }

  let inserted = 0;
  for (let i = 0; i < rows.length; i += 100) {
    const batch = rows.slice(i, i + 100);
    const { error } = await supabase.from('business_services').upsert(batch, {
      onConflict: 'business_id,service_id',
    });
    if (error) {
      console.error(`business_services batch ${i}: ${error.message}`);
    } else {
      inserted += batch.length;
    }
  }
  console.log(`Inserted ${inserted} business_services rows (from ${rows.length} total)`);
  return inserted;
}

async function insertBusinessEstTypes(businesses, bizIdMap, estMap) {
  const rows = [];
  for (const b of businesses) {
    const bizId = bizIdMap[b.slug];
    if (!bizId || !b.establishment_types_served || !b.establishment_types_served.length) continue;
    for (const est of b.establishment_types_served) {
      const estId = estMap[est.slug];
      if (estId) {
        rows.push({ business_id: bizId, establishment_type_id: estId });
      }
    }
  }

  let inserted = 0;
  for (let i = 0; i < rows.length; i += 100) {
    const batch = rows.slice(i, i + 100);
    const { error } = await supabase.from('business_establishment_types').upsert(batch, {
      onConflict: 'business_id,establishment_type_id',
    });
    if (error) {
      console.error(`business_establishment_types batch ${i}: ${error.message}`);
    } else {
      inserted += batch.length;
    }
  }
  console.log(`Inserted ${inserted} business_establishment_types rows (from ${rows.length} total)`);
  return inserted;
}

async function insertServiceAreas(businesses, bizIdMap) {
  const rows = [];
  for (const b of businesses) {
    const bizId = bizIdMap[b.slug];
    if (!bizId || !b.service_areas || !b.service_areas.length) continue;
    for (const area of b.service_areas) {
      const areaLower = area.toLowerCase();
      if (areaLower.includes('county')) {
        // It's a county reference
        const countySlug = slugify(area.replace(/\s*county\s*/i, ''));
        rows.push({ business_id: bizId, county_slug: countySlug, city_slug: null });
      } else {
        // It's a city reference
        rows.push({ business_id: bizId, county_slug: null, city_slug: slugify(area) });
      }
    }
  }

  let inserted = 0;
  for (let i = 0; i < rows.length; i += 100) {
    const batch = rows.slice(i, i + 100);
    const { error } = await supabase.from('business_service_areas').insert(batch);
    if (error) {
      console.error(`business_service_areas batch ${i}: ${error.message}`);
    } else {
      inserted += batch.length;
    }
  }
  console.log(`Inserted ${inserted} business_service_areas rows (from ${rows.length} total)`);
  return inserted;
}

// ── Step 6: Update counts ─────────────────────────────────────────────

async function updateCountyCounts() {
  // Paginate to get ALL business county_slugs
  const allBiz = [];
  let from = 0;
  const PAGE = 1000;
  while (true) {
    const { data, error } = await supabase
      .from('businesses').select('county_slug').range(from, from + PAGE - 1);
    if (error) throw new Error(`Fetch business counties: ${error.message}`);
    allBiz.push(...data);
    if (data.length < PAGE) break;
    from += PAGE;
  }

  const counts = {};
  for (const b of allBiz) {
    if (b.county_slug) {
      counts[b.county_slug] = (counts[b.county_slug] || 0) + 1;
    }
  }

  // Fetch all counties
  const { data: allCounties, error: cErr } = await supabase
    .from('counties').select('slug');
  if (cErr) throw new Error(`Fetch counties: ${cErr.message}`);

  // Update each county (set count or zero)
  let updated = 0;
  for (const county of allCounties) {
    const count = counts[county.slug] || 0;
    const { error } = await supabase
      .from('counties')
      .update({ business_count: count })
      .eq('slug', county.slug);
    if (error) {
      console.error(`Update county ${county.slug}: ${error.message}`);
    } else {
      if (count > 0) updated++;
    }
  }

  console.log(`Updated business_count for ${updated} counties (with businesses)`);
  return counts;
}

async function updateCityCounts() {
  // Count businesses per city (by city name + county_slug)
  const { data: allBiz, error } = await supabase
    .from('businesses')
    .select('city, county_slug');
  if (error) throw new Error(`Fetch business cities: ${error.message}`);

  const cityCounts = {};
  for (const b of allBiz) {
    const citySlug = slugify(b.city);
    cityCounts[citySlug] = (cityCounts[citySlug] || 0) + 1;
  }

  // Fetch all cities
  const { data: cities, error: cErr } = await supabase
    .from('cities').select('id, slug');
  if (cErr) throw new Error(`Fetch cities: ${cErr.message}`);

  let updated = 0;
  for (const city of cities) {
    const count = cityCounts[city.slug] || 0;
    const { error } = await supabase
      .from('cities')
      .update({ business_count: count })
      .eq('id', city.id);
    if (!error) updated++;
  }
  console.log(`Updated business_count for ${updated} cities`);
}

// ── Step 7: Validation ────────────────────────────────────────────────

async function validate() {
  console.log('\n═══ VALIDATION ═══');

  // Total businesses
  const { count: bizCount } = await supabase
    .from('businesses').select('*', { count: 'exact', head: true });
  console.log(`Total businesses: ${bizCount}`);

  // Counties with businesses > 0
  const { data: activeCnty } = await supabase
    .from('counties').select('name, business_count')
    .gt('business_count', 0)
    .order('business_count', { ascending: false });
  console.log(`Counties with businesses: ${activeCnty.length}`);

  // Top 10 counties
  console.log('\nTop 10 counties by business_count:');
  activeCnty.slice(0, 10).forEach(c =>
    console.log(`  ${c.name}: ${c.business_count}`)
  );

  // Cities
  const { count: cityCount } = await supabase
    .from('cities').select('*', { count: 'exact', head: true });
  console.log(`\nCities created: ${cityCount}`);

  // Top 10 cities
  const { data: topCities } = await supabase
    .from('cities').select('name, county_name, business_count')
    .order('business_count', { ascending: false })
    .limit(10);
  console.log('Top 10 cities by business_count:');
  topCities.forEach(c =>
    console.log(`  ${c.name} (${c.county_name}): ${c.business_count}`)
  );

  // Junction tables
  const { count: bsCount } = await supabase
    .from('business_services').select('*', { count: 'exact', head: true });
  console.log(`\nbusiness_services rows: ${bsCount}`);

  const { count: betCount } = await supabase
    .from('business_establishment_types').select('*', { count: 'exact', head: true });
  console.log(`business_establishment_types rows: ${betCount}`);

  const { count: bsaCount } = await supabase
    .from('business_service_areas').select('*', { count: 'exact', head: true });
  console.log(`business_service_areas rows: ${bsaCount}`);

  // Descriptions
  const { count: descCount } = await supabase
    .from('businesses').select('*', { count: 'exact', head: true })
    .not('description', 'is', null);
  console.log(`\nBusinesses with description: ${descCount}`);

  // Emergency
  const { count: emergCount } = await supabase
    .from('businesses').select('*', { count: 'exact', head: true })
    .eq('emergency_24_7', true);
  console.log(`Businesses with emergency_24_7: ${emergCount}`);

  return { bizCount, cityCount, activeCntyCount: activeCnty.length };
}

// ── Main ──────────────────────────────────────────────────────────────

async function main() {
  console.log('Phase 6: Database Population\n');

  // Step 1: Fetch seed data
  console.log('Step 1: Fetching seed data...');
  const { countyMap, serviceMap, estMap } = await fetchSeedData();
  console.log(`  Counties: ${Object.keys(countyMap).length}, Services: ${Object.keys(serviceMap).length}, Establishment types: ${Object.keys(estMap).length}`);

  // Step 2: Build & insert cities
  console.log('\nStep 2: Building city list (2+ businesses)...');
  const cities = buildCities(businesses);
  console.log(`  ${cities.length} cities qualify`);
  const insertedCities = await insertCities(cities);

  // Step 3: Insert businesses
  console.log('\nStep 3: Inserting businesses (batches of 50)...');
  const bizCount = await insertBusinesses(businesses);

  // Step 4: Junction tables
  console.log('\nStep 4: Building junction tables...');
  const bizIdMap = await fetchBusinessIds();
  console.log(`  Fetched ${Object.keys(bizIdMap).length} business IDs`);

  const bsCount = await insertBusinessServices(businesses, bizIdMap, serviceMap);
  const betCount = await insertBusinessEstTypes(businesses, bizIdMap, estMap);
  const bsaCount = await insertServiceAreas(businesses, bizIdMap);

  // Step 5: Update counts
  console.log('\nStep 5: Updating county & city business counts...');
  await updateCountyCounts();
  await updateCityCounts();

  // Step 6: Validate
  const results = await validate();

  console.log('\n═══ PHASE 6 COMPLETE ═══');
  console.log(`Businesses: ${results.bizCount}`);
  console.log(`Counties with listings: ${results.activeCntyCount}`);
  console.log(`Cities created: ${results.cityCount}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

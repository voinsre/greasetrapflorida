import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

// Load env
const envText = readFileSync('.env.local', 'utf-8');
const env = {};
for (const line of envText.split('\n')) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim();
}

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const removals = JSON.parse(readFileSync('data/audit-removals.json', 'utf-8'));
console.log(`Loaded ${removals.length} businesses to remove.\n`);

// Step 1: Get DB IDs for these businesses by slug
const slugs = removals.map(r => r.slug);
console.log('Step 1: Looking up business IDs by slug...');

let allDbBusinesses = [];
for (let i = 0; i < slugs.length; i += 100) {
  const chunk = slugs.slice(i, i + 100);
  const { data, error } = await supabase
    .from('businesses')
    .select('id, slug')
    .in('slug', chunk);
  if (error) { console.error('Lookup error:', error); process.exit(1); }
  allDbBusinesses.push(...(data || []));
}

console.log(`  Found ${allDbBusinesses.length} matching businesses in DB.`);

const idsToDelete = allDbBusinesses.map(b => b.id);

// Step 2: Delete junction tables first (business_services, business_establishment_types, business_service_areas)
console.log('\nStep 2: Deleting junction table entries...');

for (const table of ['business_services', 'business_establishment_types', 'business_service_areas']) {
  let deleted = 0;
  for (let i = 0; i < idsToDelete.length; i += 100) {
    const chunk = idsToDelete.slice(i, i + 100);
    const { error, count } = await supabase
      .from(table)
      .delete()
      .in('business_id', chunk);
    if (error) console.error(`  ${table} error:`, error.message);
    deleted += (count || 0);
  }
  console.log(`  ${table}: deleted ${deleted} rows`);
}

// Step 3: Delete businesses
console.log('\nStep 3: Deleting businesses...');
let totalDeleted = 0;
for (let i = 0; i < idsToDelete.length; i += 100) {
  const chunk = idsToDelete.slice(i, i + 100);
  const { error, count } = await supabase
    .from('businesses')
    .delete()
    .in('id', chunk);
  if (error) { console.error('Delete error:', error); process.exit(1); }
  totalDeleted += (count || 0);
}
console.log(`  Deleted ${totalDeleted} businesses.`);

// Step 4: Recalculate county business_count
console.log('\nStep 4: Recalculating county business counts...');
const { data: counties } = await supabase.from('counties').select('slug, name');

for (const county of counties || []) {
  const { count } = await supabase
    .from('businesses')
    .select('id', { count: 'exact', head: true })
    .eq('county_slug', county.slug);
  await supabase
    .from('counties')
    .update({ business_count: count || 0 })
    .eq('slug', county.slug);
}

// Step 5: Recalculate city business_count
console.log('Step 5: Recalculating city business counts...');
const { data: cities } = await supabase.from('cities').select('id, slug, name, county_slug');

let citiesRemoved = 0;
for (const city of cities || []) {
  const { count } = await supabase
    .from('businesses')
    .select('id', { count: 'exact', head: true })
    .eq('county_slug', city.county_slug)
    .ilike('city', city.name);

  if (count < 2) {
    // Remove city
    await supabase.from('cities').delete().eq('id', city.id);
    citiesRemoved++;
  } else {
    await supabase.from('cities').update({ business_count: count }).eq('id', city.id);
  }
}
console.log(`  Removed ${citiesRemoved} cities (now < 2 businesses).`);

// Step 6: Final stats
console.log('\n=== FINAL REPORT ===\n');

const { count: finalBizCount } = await supabase
  .from('businesses')
  .select('id', { count: 'exact', head: true });

const { data: finalCounties } = await supabase
  .from('counties')
  .select('name, slug, business_count')
  .gt('business_count', 0)
  .order('business_count', { ascending: false });

const { count: finalCityCount } = await supabase
  .from('cities')
  .select('id', { count: 'exact', head: true });

console.log(`Before: 2,710 businesses`);
console.log(`Removed: ${totalDeleted} businesses`);
console.log(`After: ${finalBizCount} businesses`);
console.log(`Cities removed: ${citiesRemoved}`);
console.log(`Cities remaining: ${finalCityCount}`);
console.log(`Counties with businesses: ${(finalCounties || []).length}`);

console.log('\n--- Top 15 counties by business count ---');
for (const c of (finalCounties || []).slice(0, 15)) {
  console.log(`  ${c.name}: ${c.business_count}`);
}

// Check for counties that dropped to 0
const { data: emptyCounties } = await supabase
  .from('counties')
  .select('name')
  .eq('business_count', 0);

const previouslyHadBiz = ['Alachua', 'Bay', 'Brevard', 'Broward', 'Charlotte', 'Citrus', 'Clay', 'Collier', 'Columbia', 'DeSoto', 'Duval', 'Escambia', 'Flagler', 'Hernando', 'Highlands', 'Hillsborough', 'Indian River', 'Lake', 'Lee', 'Leon', 'Manatee', 'Marion', 'Martin', 'Miami-Dade', 'Monroe', 'Nassau', 'Okaloosa', 'Orange', 'Osceola', 'Palm Beach', 'Pasco', 'Pinellas', 'Polk', 'Putnam', 'Santa Rosa', 'Sarasota', 'Seminole', 'St. Johns', 'St. Lucie', 'Sumter', 'Suwannee', 'Taylor', 'Volusia', 'Wakulla', 'Walton'];

// Find counties that previously had businesses but now have 0
const zeroCounties = (emptyCounties || []).filter(c => previouslyHadBiz.includes(c.name));
if (zeroCounties.length > 0) {
  console.log('\n--- Counties that dropped to 0 businesses ---');
  for (const c of zeroCounties) {
    console.log(`  ${c.name}`);
  }
} else {
  console.log('\nNo counties dropped to 0 businesses.');
}

console.log('\nDone!');

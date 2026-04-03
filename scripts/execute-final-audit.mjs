import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

const envText = readFileSync('.env.local', 'utf-8');
const env = {};
for (const line of envText.split('\n')) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim();
}

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const report = JSON.parse(readFileSync('data/final-audit-report.json', 'utf-8'));
const toRemove = report.no_evidence_businesses;

console.log(`Businesses to REMOVE: ${toRemove.length}\n`);

// Step 1: Delete junction tables
console.log('Step 1: Deleting junction table entries...');
const removeIds = toRemove.map(b => b.id);

for (const table of ['business_services', 'business_establishment_types', 'business_service_areas']) {
  for (let i = 0; i < removeIds.length; i += 100) {
    const chunk = removeIds.slice(i, i + 100);
    await supabase.from(table).delete().in('business_id', chunk);
  }
  console.log(`  ${table}: done`);
}

// Step 2: Delete businesses
console.log('\nStep 2: Deleting businesses...');
for (let i = 0; i < removeIds.length; i += 100) {
  const chunk = removeIds.slice(i, i + 100);
  const { error } = await supabase.from('businesses').delete().in('id', chunk);
  if (error) console.error('  Delete error:', error.message);
}
console.log(`  Deleted ${removeIds.length} businesses.`);

// Step 3: Recalculate county counts
console.log('\nStep 3: Recalculating county business counts...');
const { data: counties } = await supabase.from('counties').select('slug, name');
let countiesWithBiz = 0;
for (const county of counties || []) {
  const { count } = await supabase
    .from('businesses')
    .select('id', { count: 'exact', head: true })
    .eq('county_slug', county.slug);
  await supabase.from('counties').update({ business_count: count || 0 }).eq('slug', county.slug);
  if (count > 0) countiesWithBiz++;
}
console.log(`  ${countiesWithBiz} counties have businesses.`);

// Step 4: Recalculate city counts, remove cities < 2
console.log('\nStep 4: Recalculating city business counts...');
const { data: cities } = await supabase.from('cities').select('id, slug, name, county_slug');
let citiesRemoved = 0;
let citiesKept = 0;
for (const city of cities || []) {
  const { count } = await supabase
    .from('businesses')
    .select('id', { count: 'exact', head: true })
    .eq('county_slug', city.county_slug)
    .ilike('city', city.name);

  if (count < 2) {
    await supabase.from('cities').delete().eq('id', city.id);
    citiesRemoved++;
  } else {
    await supabase.from('cities').update({ business_count: count }).eq('id', city.id);
    citiesKept++;
  }
}
console.log(`  Kept ${citiesKept} cities, removed ${citiesRemoved}.`);

// Step 5: Final stats
console.log('\n=== FINAL REPORT ===\n');

const { count: finalBizCount } = await supabase
  .from('businesses').select('id', { count: 'exact', head: true });

const { count: verifiedCount } = await supabase
  .from('businesses').select('id', { count: 'exact', head: true }).eq('is_verified', true);

const { data: finalCounties } = await supabase
  .from('counties').select('name, business_count')
  .gt('business_count', 0).order('business_count', { ascending: false });

const { count: finalCityCount } = await supabase
  .from('cities').select('id', { count: 'exact', head: true });

console.log(`Businesses: 750 → ${finalBizCount}`);
console.log(`Verified: ${verifiedCount}`);
console.log(`Counties with businesses: ${(finalCounties || []).length}`);
console.log(`Cities: ${finalCityCount}`);

console.log('\n--- All counties with businesses ---');
for (const c of finalCounties || []) {
  console.log(`  ${c.name}: ${c.business_count}`);
}

console.log('\nDone!');

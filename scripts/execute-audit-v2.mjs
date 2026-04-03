import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

const envText = readFileSync('.env.local', 'utf-8');
const env = {};
for (const line of envText.split('\n')) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim();
}

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const audit = JSON.parse(readFileSync('data/audit-grease-confirmed-v2.json', 'utf-8'));
const toRemove = audit.remove;
const confirmed = audit.confirmed;

console.log(`Businesses to REMOVE: ${toRemove.length}`);
console.log(`Businesses CONFIRMED (will set is_verified): ${confirmed.length}\n`);

// Step 1: Get DB IDs for businesses to remove
console.log('Step 1: Looking up business IDs to remove...');
const removeSlugs = toRemove.map(r => r.slug);
let removeIds = [];
for (let i = 0; i < removeSlugs.length; i += 100) {
  const chunk = removeSlugs.slice(i, i + 100);
  const { data } = await supabase.from('businesses').select('id, slug').in('slug', chunk);
  removeIds.push(...(data || []).map(b => b.id));
}
console.log(`  Found ${removeIds.length} to delete.`);

// Step 2: Delete junction tables
console.log('\nStep 2: Deleting junction table entries...');
for (const table of ['business_services', 'business_establishment_types', 'business_service_areas']) {
  for (let i = 0; i < removeIds.length; i += 100) {
    const chunk = removeIds.slice(i, i + 100);
    await supabase.from(table).delete().in('business_id', chunk);
  }
  console.log(`  ${table}: done`);
}

// Step 3: Delete businesses
console.log('\nStep 3: Deleting businesses...');
for (let i = 0; i < removeIds.length; i += 100) {
  const chunk = removeIds.slice(i, i + 100);
  const { error } = await supabase.from('businesses').delete().in('id', chunk);
  if (error) console.error('  Delete error:', error.message);
}
console.log(`  Deleted ${removeIds.length} businesses.`);

// Step 4: Set is_verified on confirmed businesses
console.log('\nStep 4: Setting is_verified on confirmed businesses...');
// First reset all to false
await supabase.from('businesses').update({ is_verified: false }).neq('id', '00000000-0000-0000-0000-000000000000');

const confirmedSlugs = confirmed.map(c => c.slug);
let verifiedCount = 0;
for (let i = 0; i < confirmedSlugs.length; i += 100) {
  const chunk = confirmedSlugs.slice(i, i + 100);
  const { error } = await supabase.from('businesses').update({ is_verified: true }).in('slug', chunk);
  if (error) console.error('  Verify error:', error.message);
  verifiedCount += chunk.length;
}
console.log(`  Set is_verified=true on ${verifiedCount} businesses.`);

// Step 5: Recalculate county business_count
console.log('\nStep 5: Recalculating county business counts...');
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

// Step 6: Recalculate city business_count, remove cities < 2
console.log('\nStep 6: Recalculating city business counts...');
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

// Step 7: Final stats
console.log('\n=== FINAL REPORT ===\n');

const { count: finalBizCount } = await supabase
  .from('businesses').select('id', { count: 'exact', head: true });

const { count: finalVerifiedCount } = await supabase
  .from('businesses').select('id', { count: 'exact', head: true }).eq('is_verified', true);

const { data: finalCounties } = await supabase
  .from('counties').select('name, business_count')
  .gt('business_count', 0).order('business_count', { ascending: false });

const { count: finalCityCount } = await supabase
  .from('cities').select('id', { count: 'exact', head: true });

console.log(`Businesses: 1,837 → ${finalBizCount} (-${1837 - finalBizCount})`);
console.log(`Verified (is_verified=true): ${finalVerifiedCount}`);
console.log(`Counties with businesses: ${(finalCounties || []).length}`);
console.log(`Cities: ${finalCityCount}`);

console.log('\n--- Top 15 counties ---');
for (const c of (finalCounties || []).slice(0, 15)) {
  console.log(`  ${c.name}: ${c.business_count}`);
}

const { data: zeroCounties } = await supabase
  .from('counties').select('name').eq('business_count', 0);
console.log(`\nCounties with 0 businesses: ${(zeroCounties || []).length}`);
for (const c of (zeroCounties || []).slice(0, 10)) {
  console.log(`  ${c.name}`);
}

console.log('\nDone!');

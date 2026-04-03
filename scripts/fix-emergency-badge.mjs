import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

const envText = readFileSync('.env.local', 'utf-8');
const env = {};
for (const line of envText.split('\n')) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim();
}

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

// Load scraped website data
const scraped = JSON.parse(readFileSync('data/scraped-websites.json', 'utf-8'));
const scrapedByPlaceId = new Map();
for (const s of scraped) {
  if (s.place_id) scrapedByPlaceId.set(s.place_id, s);
}

// Step 1: Get all businesses with emergency_24_7 = true
const { data: emergencyBiz, error } = await supabase
  .from('businesses')
  .select('id, slug, name, place_id, emergency_24_7, opening_hours')
  .eq('emergency_24_7', true);

if (error) { console.error('Query error:', error); process.exit(1); }

console.log(`Businesses with emergency_24_7 = true: ${(emergencyBiz || []).length}\n`);

const EMERGENCY_KEYWORDS = [
  '24/7', '24 hour', '24-hour', '24 hrs', '24-hrs',
  'around the clock', 'emergency service', 'after hours',
  'after-hours', 'emergency response', 'emergency clean',
  'emergency overflow', 'emergency pump',
];

function hoursShow24h(openingHours) {
  if (!openingHours) return false;
  // opening_hours is JSONB — can be array of {day, hours} or object
  try {
    const items = Array.isArray(openingHours) ? openingHours : Object.values(openingHours);
    for (const item of items) {
      const hours = (typeof item === 'string' ? item : item?.hours || '').toLowerCase();
      if (hours.includes('24 hour') || hours.includes('open 24') || hours === '24 hours') {
        return true;
      }
    }
  } catch {}
  return false;
}

function websiteMentionsEmergency(placeId) {
  const s = scrapedByPlaceId.get(placeId);
  if (!s || !s.all_text_combined) return false;
  const text = s.all_text_combined.toLowerCase();
  return EMERGENCY_KEYWORDS.some(kw => text.includes(kw));
}

let keepTrue = 0;
let setFalse = 0;
const setFalseList = [];

for (const biz of emergencyBiz || []) {
  const has24hHours = hoursShow24h(biz.opening_hours);
  const hasEmergencyWebsite = websiteMentionsEmergency(biz.place_id);

  if (has24hHours || hasEmergencyWebsite) {
    keepTrue++;
  } else {
    setFalse++;
    setFalseList.push({ id: biz.id, name: biz.name, slug: biz.slug });
  }
}

console.log(`Keep emergency_24_7 = true: ${keepTrue}`);
console.log(`Set emergency_24_7 = false: ${setFalse}\n`);

// Show examples being set to false
console.log('--- 10 examples being set to FALSE ---');
for (const b of setFalseList.slice(0, 10)) {
  console.log(`  "${b.name}"`);
}

// Execute the update
console.log('\nUpdating database...');
const idsToFalse = setFalseList.map(b => b.id);
for (let i = 0; i < idsToFalse.length; i += 100) {
  const chunk = idsToFalse.slice(i, i + 100);
  await supabase.from('businesses').update({ emergency_24_7: false }).in('id', chunk);
}

// Verify
const { count: afterCount } = await supabase
  .from('businesses')
  .select('id', { count: 'exact', head: true })
  .eq('emergency_24_7', true);

console.log(`\nAfter cleanup: ${afterCount} businesses have emergency_24_7 = true (was ${(emergencyBiz || []).length})`);
console.log('Done!');

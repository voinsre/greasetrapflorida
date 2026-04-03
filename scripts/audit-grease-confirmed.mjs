import { readFileSync, writeFileSync } from 'fs';

// Load data — use enriched.json (full 2710 original dataset) and scraped-websites.json
const enriched = JSON.parse(readFileSync('data/enriched.json', 'utf-8'));
const scraped = JSON.parse(readFileSync('data/scraped-websites.json', 'utf-8'));

// Build scraped index by place_id
const scrapedByPlaceId = new Map();
for (const s of scraped) {
  if (s.place_id) scrapedByPlaceId.set(s.place_id, s);
}

// Also check what's currently in the DB (post-previous audit) vs original enriched
// We'll work from the CURRENT DB state (1,837 businesses), not the original 2,710
// Load the removal list to know what was already removed
let alreadyRemoved = new Set();
try {
  const prev = JSON.parse(readFileSync('data/audit-removals.json', 'utf-8'));
  for (const r of prev) alreadyRemoved.add(r.slug);
} catch {}

// Filter enriched to only businesses still in DB
const currentBusinesses = enriched.filter(b => !alreadyRemoved.has(b.slug));
console.log(`Working with ${currentBusinesses.length} businesses currently in DB.\n`);

// ============ KEYWORDS ============

const GREASE_NAME_KEYWORDS = [
  'grease trap', 'grease interceptor', 'grease cleaning', 'grease pumping',
  'grease waste', 'grease hauling', 'grease service', 'grease management',
  'fog service', 'fog compliance',
  'interceptor clean', 'interceptor pump', 'interceptor service',
  'cooking oil collection', 'cooking oil recycl',
  'trap cleaning service', 'trap pumping service',
];

// Broader: just "grease" in name (but not "Grease Monkey" car service etc)
const GREASE_NAME_BROAD = ['grease'];
const GREASE_NAME_FALSE_POSITIVES = ['grease monkey', 'grease pro car', 'grease lightning auto'];

const WEBSITE_GREASE_KEYWORDS = [
  'grease trap', 'grease interceptor', 'grease cleaning', 'grease pumping',
  'grease waste', 'trap cleaning', 'interceptor cleaning', 'grease removal',
  'kitchen grease', 'cooking oil collection', 'grease hauling',
  'commercial kitchen', 'fats oils and grease', 'fats, oils, and grease',
  'fats, oils and grease', 'fog program', 'fog compliance', 'fog service',
  'grease management', 'grease service', 'grease maintenance',
  'grease pump', 'trap pump', 'interceptor pump',
  'grease disposal', 'trap maintenance',
];

const GREASE_CATEGORIES = [
  'grease trap', 'grease cleaning', 'grease service',
];

const SEPTIC_WASTE_PLUMBING_NAMES = [
  'septic', 'waste', 'hauling', 'haul ', 'environmental service',
  'sanitation', 'sewer service', 'plumb',
];

// ============ HELPERS ============

function nameHasGreaseKeyword(name) {
  const lower = name.toLowerCase();
  // Check specific grease keywords
  if (GREASE_NAME_KEYWORDS.some(kw => lower.includes(kw))) return true;
  // Check broad "grease" but exclude false positives
  if (lower.includes('grease') && !GREASE_NAME_FALSE_POSITIVES.some(fp => lower.includes(fp))) return true;
  return false;
}

function countWebsiteGreaseKeywords(text) {
  if (!text) return 0;
  const lower = text.toLowerCase();
  let count = 0;
  for (const kw of WEBSITE_GREASE_KEYWORDS) {
    if (lower.includes(kw)) count++;
  }
  return count;
}

function hasGreaseCategory(categories) {
  if (!categories || !Array.isArray(categories)) return false;
  return categories.some(cat => {
    const lower = cat.toLowerCase();
    return GREASE_CATEGORIES.some(gc => lower.includes(gc));
  });
}

function isSepticWastePlumbing(name) {
  const lower = name.toLowerCase();
  return SEPTIC_WASTE_PLUMBING_NAMES.some(kw => lower.includes(kw));
}

function enrichmentMentionsGrease(biz) {
  // Check description
  if (biz.description) {
    const lower = biz.description.toLowerCase();
    if (lower.includes('grease trap') || lower.includes('grease interceptor') ||
        lower.includes('grease cleaning') || lower.includes('grease pump') ||
        lower.includes('fog ')) return true;
  }
  // Check is_grease_trap_service flag
  if (biz.is_grease_trap_service === true) return true;
  // Check services_offered
  if (biz.services_offered) {
    for (const s of biz.services_offered) {
      const label = (typeof s === 'string' ? s : s?.label || s?.slug || '').toLowerCase();
      if (label.includes('grease') || label.includes('interceptor') || label.includes('cooking oil')) return true;
    }
  }
  return false;
}

// Check if appeared in grease-specific search
function appearedInGreaseSearch(biz) {
  const search = (biz.search_string || '').toLowerCase();
  return search.includes('grease') || search.includes('fog service') || search.includes('interceptor');
}

// ============ RUN AUDIT ============

const confirmed = [];
const borderlineKeep = [];
const remove = [];

for (const biz of currentBusinesses) {
  const name = biz.name || '';
  const scrapeData = scrapedByPlaceId.get(biz.place_id) || null;
  const websiteText = scrapeData?.all_text_combined || '';
  const greaseKwCount = countWebsiteGreaseKeywords(websiteText);

  let category = null;
  let reason = '';

  // Criteria 1: Name contains grease keywords
  if (nameHasGreaseKeyword(name)) {
    category = 'CONFIRMED';
    reason = 'grease_in_name';
  }
  // Criteria 2: Website has 2+ grease keywords
  else if (greaseKwCount >= 2) {
    category = 'CONFIRMED';
    reason = `website_${greaseKwCount}_grease_keywords`;
  }
  // Criteria 3: Google Maps category is grease-specific
  else if (hasGreaseCategory(biz.categories)) {
    category = 'CONFIRMED';
    reason = 'grease_category';
  }
  // Criteria 4: Enrichment data mentions grease
  else if (enrichmentMentionsGrease(biz)) {
    category = 'CONFIRMED';
    reason = 'enrichment_grease';
  }
  // Criteria 5: Septic/plumbing/waste + 1 website grease keyword
  else if (isSepticWastePlumbing(name) && greaseKwCount >= 1) {
    category = 'BORDERLINE_KEEP';
    reason = `septic_waste_plumbing_with_${greaseKwCount}_grease_kw`;
  }
  // Criteria 6: Septic/waste name + appeared in grease search
  else if ((name.toLowerCase().includes('septic') || name.toLowerCase().includes('waste')) && appearedInGreaseSearch(biz)) {
    category = 'BORDERLINE_KEEP';
    reason = 'septic_waste_in_grease_search';
  }
  // Everything else
  else {
    category = 'REMOVE';
    reason = greaseKwCount === 1
      ? 'only_1_grease_keyword_no_name_signal'
      : greaseKwCount === 0
        ? 'no_grease_evidence'
        : 'insufficient_evidence';
  }

  const entry = {
    slug: biz.slug,
    name,
    city: biz.city,
    county: biz.county,
    rating: biz.rating,
    review_count: biz.review_count,
    website_status: biz.website_status,
    grease_keyword_count: greaseKwCount,
    categories: (biz.categories || []).slice(0, 5).join(', '),
    search_string: biz.search_string || '',
    category,
    reason,
  };

  if (category === 'CONFIRMED') confirmed.push(entry);
  else if (category === 'BORDERLINE_KEEP') borderlineKeep.push(entry);
  else remove.push(entry);
}

// Save full categorization
const all = [...confirmed, ...borderlineKeep, ...remove];
writeFileSync('data/audit-grease-confirmed.json', JSON.stringify({ confirmed, borderlineKeep, remove }, null, 2));

// ============ REPORT ============

console.log('=== GREASE-CONFIRMED AUDIT REPORT ===\n');
console.log(`Current DB businesses: ${currentBusinesses.length}`);
console.log(`CONFIRMED (criteria 1-4): ${confirmed.length}`);
console.log(`BORDERLINE KEEP (criteria 5-6): ${borderlineKeep.length}`);
console.log(`TOTAL KEEP: ${confirmed.length + borderlineKeep.length}`);
console.log(`REMOVE: ${remove.length}`);

// Confirmed breakdown by reason
const confirmedReasons = {};
for (const c of confirmed) {
  const r = c.reason.startsWith('website_') ? 'website_grease_keywords' : c.reason;
  confirmedReasons[r] = (confirmedReasons[r] || 0) + 1;
}
console.log('\n--- CONFIRMED breakdown ---');
for (const [r, count] of Object.entries(confirmedReasons).sort((a,b) => b[1] - a[1])) {
  console.log(`  ${r}: ${count}`);
}

// Borderline breakdown
const blReasons = {};
for (const b of borderlineKeep) {
  const r = b.reason.startsWith('septic_waste_plumbing') ? 'septic_waste_plumbing_with_kw' : b.reason;
  blReasons[r] = (blReasons[r] || 0) + 1;
}
if (Object.keys(blReasons).length > 0) {
  console.log('\n--- BORDERLINE KEEP breakdown ---');
  for (const [r, count] of Object.entries(blReasons).sort((a,b) => b[1] - a[1])) {
    console.log(`  ${r}: ${count}`);
  }
}

// Remove breakdown
const removeReasons = {};
for (const r of remove) {
  removeReasons[r.reason] = (removeReasons[r.reason] || 0) + 1;
}
console.log('\n--- REMOVE breakdown ---');
for (const [r, count] of Object.entries(removeReasons).sort((a,b) => b[1] - a[1])) {
  console.log(`  ${r}: ${count}`);
}

console.log('\n--- 10 CONFIRMED examples ---');
for (const c of confirmed.slice(0, 10)) {
  console.log(`  ✓ "${c.name}" (${c.city}, ${c.county}) — ${c.reason} | kw:${c.grease_keyword_count} | cats: ${c.categories}`);
}

console.log('\n--- 10 BORDERLINE KEEP examples ---');
for (const b of borderlineKeep.slice(0, 10)) {
  console.log(`  ~ "${b.name}" (${b.city}, ${b.county}) — ${b.reason} | kw:${b.grease_keyword_count}`);
}

console.log('\n--- 10 REMOVE examples ---');
for (const r of remove.slice(0, 10)) {
  console.log(`  ✗ "${r.name}" (${r.city}, ${r.county}) — ${r.reason} | kw:${r.grease_keyword_count} | cats: ${r.categories}`);
}

// County distribution of CONFIRMED+BORDERLINE
const keepCounty = {};
for (const c of [...confirmed, ...borderlineKeep]) {
  keepCounty[c.county || 'Unknown'] = (keepCounty[c.county || 'Unknown'] || 0) + 1;
}
console.log('\n--- Top 15 counties after keep ---');
for (const [county, count] of Object.entries(keepCounty).sort((a,b) => b[1] - a[1]).slice(0, 15)) {
  console.log(`  ${county}: ${count}`);
}

if (confirmed.length < 300) {
  console.log('\n⚠️  WARNING: Confirmed count is under 300. Criteria may be too strict.');
}

console.log('\n=== WAITING FOR CONFIRMATION ===');
console.log(`Will keep ${confirmed.length + borderlineKeep.length}, remove ${remove.length}.`);

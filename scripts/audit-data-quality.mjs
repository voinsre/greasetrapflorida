import { readFileSync, writeFileSync } from 'fs';

// Load data
const enriched = JSON.parse(readFileSync('data/enriched.json', 'utf-8'));
const scraped = JSON.parse(readFileSync('data/scraped-websites.json', 'utf-8'));

// Build scraped index by place_id
const scrapedByPlaceId = new Map();
for (const s of scraped) {
  if (s.place_id) scrapedByPlaceId.set(s.place_id, s);
}

// Grease keywords for website content check
const GREASE_KEYWORDS = [
  'grease trap', 'grease interceptor', 'grease cleaning', 'grease pumping',
  'grease waste', 'trap cleaning', 'interceptor cleaning', 'grease removal',
  'kitchen grease', 'commercial kitchen', 'cooking oil collection',
  'grease hauling', 'fats oils and grease', 'fats, oils, and grease',
  'grease management', 'grease service', 'grease pump', 'fog program',
  'fog compliance', 'grease trap maintenance',
];

// Name keywords that strongly indicate grease service
const GREASE_NAME_KEYWORDS = [
  'grease', 'fog service', 'grease trap', 'interceptor', 'cooking oil',
  'grease waste', 'trap clean', 'trap pump',
];

// These businesses are CLEARLY not grease trap services — hard remove if name matches
const HARD_WRONG_NICHE = [
  'hvac', 'air condition', 'heating and cool', 'heating &', 'a/c ',
  'pest control', 'exterminator', 'termite',
  'roofing', 'roofer',
  'painting', 'painter',
  'carpet clean', 'carpet care',
  'pressure wash', 'power wash', 'soft wash',
  'janitorial', 'maid', 'house clean',
  'lawn', 'landscap', 'tree service', 'tree trim', 'mowing',
  'pool service', 'pool clean', 'pool repair', 'pool maintenance',
  'fencing', 'fence company',
  'window clean', 'window wash',
  'moving company', 'movers',
  'auto repair', 'auto body', 'car wash', 'towing',
  'locksmith',
  'solar', 'solar panel',
  'insulation',
  'flooring', 'tile install', 'countertop',
  'cabinet', 'closet',
  'appliance repair',
  'garage door',
  'gutter',
  'paving', 'asphalt', 'concrete finish',
  'irrigation', 'sprinkler install',
  'fire alarm', 'fire sprinkler', 'fire protection',
  'mold remediat', 'mold removal', 'mold inspect',
  'water damage', 'flood restor', 'disaster restor',
  'dumpster', 'junk removal', 'trash removal',
  'porta pot', 'portable toilet',
  'home inspection', 'home inspector',
  'real estate', 'realty', 'realtor',
  'technology', 'tech group', 'it service', 'computer',
  'security system', 'alarm system', 'surveillance',
  'glass repair', 'windshield',
  'boat', 'marine service',
  'nursery', 'garden center',
  'dog', 'pet', 'veterinar', 'animal',
  'tattoo', 'barber', 'salon', 'spa ',
  'restaurant', 'pizza', 'burger', 'taco', 'cafe', 'bakery', 'catering',
  'church', 'ministry',
  'staffing', 'recruiting',
  'attorney', 'law firm', 'lawyer',
  'insurance', 'accounting', 'tax prep',
  'photography', 'photographer',
  'storage unit', 'self storage',
  'gym', 'fitness',
];

// Categories that indicate the business is in our niche or adjacent
const SAFE_CATEGORIES = [
  'plumber', 'plumbing', 'septic', 'sewer', 'drain',
  'waste', 'haul', 'pump', 'environmental', 'sanitation',
  'disposal', 'grease', 'kitchen', 'commercial clean',
  'contractor', 'excavat', 'water jet', 'hydro',
];

function nameHasGreaseKeyword(name) {
  const lower = name.toLowerCase();
  return GREASE_NAME_KEYWORDS.some(kw => lower.includes(kw));
}

function nameMatchesHardWrongNiche(name) {
  const lower = name.toLowerCase();
  return HARD_WRONG_NICHE.find(kw => lower.includes(kw)) || null;
}

function countGreaseKeywordsInText(text) {
  if (!text) return 0;
  const lower = text.toLowerCase();
  let count = 0;
  for (const kw of GREASE_KEYWORDS) {
    if (lower.includes(kw)) count++;
  }
  return count;
}

function hasSafeCategory(categories) {
  if (!categories || !Array.isArray(categories)) return false;
  return categories.some(cat => {
    const lower = cat.toLowerCase();
    return SAFE_CATEGORIES.some(sc => lower.includes(sc));
  });
}

function hasGreaseInCategories(categories) {
  if (!categories || !Array.isArray(categories)) return false;
  return categories.some(cat => {
    const lower = cat.toLowerCase();
    return lower.includes('grease') || lower.includes('trap') || lower.includes('fog');
  });
}

// ============ RUN AUDIT ============

const removals = [];
const borderline = [];
let keptCount = 0;

for (const biz of enriched) {
  const name = biz.name || '';
  const scrapeData = scrapedByPlaceId.get(biz.place_id) || null;
  const websiteText = scrapeData?.all_text_combined || '';
  const greaseKeywordCount = countGreaseKeywordsInText(websiteText);
  const nameHasGrease = nameHasGreaseKeyword(name);
  const wrongNicheMatch = nameMatchesHardWrongNiche(name);
  const safeCategory = hasSafeCategory(biz.categories);
  const greaseCategory = hasGreaseInCategories(biz.categories);
  const isGreaseConfirmed = biz.is_grease_trap_service === true;
  const servicesOffered = biz.services_offered || [];
  const hasGreaseService = servicesOffered.some(s => {
    const label = (typeof s === 'string' ? s : s?.label || s?.slug || '').toLowerCase();
    return label.includes('grease') || label.includes('interceptor') || label.includes('cooking oil');
  });

  // PROTECT: Any business with clear grease signals — never remove
  if (nameHasGrease || isGreaseConfirmed || hasGreaseService || greaseCategory || greaseKeywordCount >= 2) {
    if (wrongNicheMatch) {
      borderline.push({
        name, city: biz.city, county: biz.county,
        reason: `Name matches wrong niche "${wrongNicheMatch}" but has grease signal`,
        signal: nameHasGrease ? 'grease_name' : isGreaseConfirmed ? 'confirmed' : hasGreaseService ? 'grease_service' : greaseCategory ? 'grease_category' : `${greaseKeywordCount}_kw`,
      });
    }
    keptCount++;
    continue;
  }

  // PROTECT: Plumbing, septic, drain, sewer, waste, pump companies — they commonly offer grease services
  // Only remove these if their name ALSO matches a hard wrong niche
  if (safeCategory && !wrongNicheMatch) {
    keptCount++;
    continue;
  }

  // REMOVE: Business name clearly indicates wrong niche AND no grease signals
  if (wrongNicheMatch) {
    // But give one more chance: if website mentions grease at least once, keep it
    if (greaseKeywordCount >= 1) {
      borderline.push({
        name, city: biz.city, county: biz.county,
        reason: `Name matches "${wrongNicheMatch}" but website has ${greaseKeywordCount} grease keyword(s)`,
        signal: 'weak_website_grease',
      });
      keptCount++;
      continue;
    }

    removals.push({
      business_id: biz.place_id,
      slug: biz.slug,
      name,
      city: biz.city,
      county: biz.county,
      rating: biz.rating,
      review_count: biz.review_count,
      website_status: biz.website_status,
      grease_keyword_count: greaseKeywordCount,
      categories: (biz.categories || []).join(', '),
      services_offered: servicesOffered.map(s => typeof s === 'string' ? s : s?.label || '').join(', '),
      reason: `wrong_niche_name: "${wrongNicheMatch}"`,
    });
    continue;
  }

  // For remaining businesses (no grease signal, no wrong niche, no safe category):
  // These are businesses with generic/unrecognizable names and no grease evidence
  // Check: do they at least have SOME relevant category?
  if (!safeCategory && !greaseKeywordCount && (biz.categories || []).length > 0) {
    // Check if ALL their categories are clearly unrelated
    const cats = (biz.categories || []).map(c => c.toLowerCase());
    const clearlyUnrelated = cats.every(c =>
      !c.includes('plumb') && !c.includes('drain') && !c.includes('sewer') &&
      !c.includes('septic') && !c.includes('waste') && !c.includes('pump') &&
      !c.includes('haul') && !c.includes('environ') && !c.includes('sanit') &&
      !c.includes('contractor') && !c.includes('construct') && !c.includes('repair') &&
      !c.includes('service') && !c.includes('clean') && !c.includes('maintenance') &&
      !c.includes('water') && !c.includes('pipe')
    );

    if (clearlyUnrelated) {
      removals.push({
        business_id: biz.place_id,
        slug: biz.slug,
        name,
        city: biz.city,
        county: biz.county,
        rating: biz.rating,
        review_count: biz.review_count,
        website_status: biz.website_status,
        grease_keyword_count: greaseKeywordCount,
        categories: cats.join(', '),
        services_offered: servicesOffered.map(s => typeof s === 'string' ? s : s?.label || '').join(', '),
        reason: `unrelated_categories: ${cats.join(', ')}`,
      });
      continue;
    }
  }

  keptCount++;
}

// PASS 3: Duplicate phone — same phone + same city
const keptSlugs = new Set(enriched
  .filter(b => !removals.some(r => r.slug === b.slug))
  .map(b => b.slug)
);

const phoneGroups = new Map();
for (const biz of enriched) {
  if (!keptSlugs.has(biz.slug)) continue;
  if (!biz.phone_unformatted) continue;
  const key = `${biz.phone_unformatted}|${(biz.city || '').toLowerCase()}`;
  if (!phoneGroups.has(key)) phoneGroups.set(key, []);
  phoneGroups.get(key).push(biz);
}

const dupeRemovals = [];
for (const [key, dupes] of phoneGroups) {
  if (dupes.length <= 1) continue;
  const sorted = dupes.sort((a, b) => (b.review_count || 0) - (a.review_count || 0));
  for (let i = 1; i < sorted.length; i++) {
    dupeRemovals.push({
      business_id: sorted[i].place_id,
      slug: sorted[i].slug,
      name: sorted[i].name,
      city: sorted[i].city,
      county: sorted[i].county,
      rating: sorted[i].rating,
      review_count: sorted[i].review_count,
      reason: `duplicate_phone_same_city (kept: "${sorted[0].name}")`,
    });
  }
}

// PASS 4: Very low ratings
const lowRatingRemovals = [];
for (const biz of enriched) {
  if (removals.some(r => r.slug === biz.slug)) continue;
  if (dupeRemovals.some(r => r.slug === biz.slug)) continue;
  if (biz.rating && biz.rating < 2.0 && (biz.review_count || 0) > 5) {
    lowRatingRemovals.push({
      business_id: biz.place_id,
      slug: biz.slug,
      name: biz.name,
      city: biz.city,
      county: biz.county,
      rating: biz.rating,
      review_count: biz.review_count,
      reason: `very_low_rating: ${biz.rating} (${biz.review_count} reviews)`,
    });
  }
}

const allRemovals = [...removals, ...dupeRemovals, ...lowRatingRemovals];

// Count by reason type
const reasonCounts = { wrong_niche: 0, unrelated_categories: 0, duplicate: 0, low_rating: 0 };
for (const r of allRemovals) {
  if (r.reason.startsWith('wrong_niche')) reasonCounts.wrong_niche++;
  else if (r.reason.startsWith('unrelated')) reasonCounts.unrelated_categories++;
  else if (r.reason.startsWith('duplicate')) reasonCounts.duplicate++;
  else if (r.reason.startsWith('very_low')) reasonCounts.low_rating++;
}

// Save
writeFileSync('data/audit-removals.json', JSON.stringify(allRemovals, null, 2));

// Report
console.log('=== DATA QUALITY AUDIT REPORT ===\n');
console.log(`Total businesses audited: ${enriched.length}`);
console.log(`Flagged for REMOVAL: ${allRemovals.length} (${(allRemovals.length / enriched.length * 100).toFixed(1)}%)`);
console.log(`Will be KEPT: ${enriched.length - allRemovals.length}`);
console.log(`Borderline (kept with note): ${borderline.length}\n`);

console.log('--- Breakdown by reason ---');
for (const [reason, count] of Object.entries(reasonCounts)) {
  if (count > 0) console.log(`  ${reason}: ${count}`);
}

console.log('\n--- 25 Example REMOVALS ---');
for (const r of allRemovals.slice(0, 25)) {
  console.log(`  REMOVE: "${r.name}" (${r.city}, ${r.county}) — ${r.reason}`);
}

if (allRemovals.length > 25) {
  console.log(`  ... and ${allRemovals.length - 25} more`);
}

console.log('\n--- 10 Borderline businesses KEPT ---');
for (const b of borderline.slice(0, 10)) {
  console.log(`  KEEP: "${b.name}" (${b.city}, ${b.county}) — ${b.reason} | signal: ${b.signal}`);
}

// County impact
const countyRemovals = {};
for (const r of allRemovals) {
  countyRemovals[r.county || 'Unknown'] = (countyRemovals[r.county || 'Unknown'] || 0) + 1;
}
console.log('\n--- Counties with most removals ---');
const sortedCounties = Object.entries(countyRemovals).sort((a, b) => b[1] - a[1]).slice(0, 15);
for (const [county, count] of sortedCounties) {
  console.log(`  ${county}: -${count}`);
}

console.log('\n=== WAITING FOR CONFIRMATION ===');
console.log(`Review data/audit-removals.json (${allRemovals.length} entries) and confirm before deletion.`);

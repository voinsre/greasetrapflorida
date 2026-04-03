import { readFileSync, writeFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

const envText = readFileSync('.env.local', 'utf-8');
const env = {};
for (const line of envText.split('\n')) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim();
}

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

// Load scraped + enriched data
const scraped = JSON.parse(readFileSync('data/scraped-websites.json', 'utf-8'));
const enriched = JSON.parse(readFileSync('data/enriched.json', 'utf-8'));

const scrapedByPlaceId = new Map();
for (const s of scraped) {
  if (s.place_id) scrapedByPlaceId.set(s.place_id, s);
}

const enrichedBySlug = new Map();
for (const e of enriched) {
  enrichedBySlug.set(e.slug, e);
}

// Load raw Apify data to check search queries
const rawFiles = ['data/raw-apify'];
let rawRecords = [];
try {
  const fs = await import('fs');
  const path = await import('path');
  const dir = fs.readdirSync('data/raw-apify');
  for (const f of dir) {
    if (f.endsWith('.json')) {
      const data = JSON.parse(fs.readFileSync(path.join('data/raw-apify', f), 'utf-8'));
      if (Array.isArray(data)) rawRecords.push(...data);
    }
  }
} catch {}

// Map place_id -> search queries
const searchByPlaceId = new Map();
for (const r of rawRecords) {
  if (r.placeId || r.place_id) {
    const pid = r.placeId || r.place_id;
    if (!searchByPlaceId.has(pid)) searchByPlaceId.set(pid, new Set());
    if (r.searchString) searchByPlaceId.get(pid).add(r.searchString);
  }
}

console.log(`Raw records loaded: ${rawRecords.length}`);
console.log(`Search queries indexed: ${searchByPlaceId.size} place_ids\n`);

// Get all current businesses from DB
let allBiz = [];
let from = 0;
let hasMore = true;
while (hasMore) {
  const { data } = await supabase
    .from('businesses')
    .select('id, slug, name, place_id, is_verified, city, county')
    .range(from, from + 999);
  allBiz.push(...(data || []));
  hasMore = (data?.length || 0) === 1000;
  from += 1000;
}

console.log(`Current businesses in DB: ${allBiz.length}\n`);

const GREASE_KEYWORDS = [
  'grease trap', 'grease interceptor', 'grease cleaning', 'grease pumping',
  'grease waste', 'fog compliance', 'trap cleaning', 'interceptor pumping',
  'commercial kitchen cleaning', 'grease removal', 'grease service',
  'grease management', 'grease maintenance', 'grease pump',
  'cooking oil collection', 'fats oils and grease', 'fats, oils, and grease',
  'fog program', 'fog service', 'interceptor cleaning',
];

const GREASE_NAME_KEYWORDS = [
  'grease', 'trap clean', 'interceptor', 'fog service', 'cooking oil',
];

function hasGreaseEvidence(biz) {
  const reasons = [];
  const name = (biz.name || '').toLowerCase();

  // Check name
  if (GREASE_NAME_KEYWORDS.some(kw => name.includes(kw))) {
    reasons.push('name');
  }

  // Check website text
  const scrape = scrapedByPlaceId.get(biz.place_id);
  if (scrape?.all_text_combined) {
    const text = scrape.all_text_combined.toLowerCase();
    const matches = GREASE_KEYWORDS.filter(kw => text.includes(kw));
    if (matches.length > 0) {
      reasons.push(`website(${matches.length}kw)`);
    }
  }

  // Check enrichment data
  const enr = enrichedBySlug.get(biz.slug);
  if (enr) {
    // Categories
    if (enr.categories?.some(c => c.toLowerCase().includes('grease'))) {
      reasons.push('category');
    }
    // is_grease_trap_service
    if (enr.is_grease_trap_service === true) {
      reasons.push('enrichment_confirmed');
    }
    // services_offered
    if (enr.services_offered?.some(s => {
      const label = (typeof s === 'string' ? s : s?.label || '').toLowerCase();
      return label.includes('grease') || label.includes('interceptor') || label.includes('cooking oil');
    })) {
      reasons.push('service_offered');
    }
    // Description
    if (enr.description && GREASE_KEYWORDS.some(kw => enr.description.toLowerCase().includes(kw))) {
      reasons.push('description');
    }
  }

  return reasons;
}

const withEvidence = [];
const noEvidence = [];

for (const biz of allBiz) {
  const reasons = hasGreaseEvidence(biz);
  if (reasons.length > 0) {
    withEvidence.push({ ...biz, grease_reasons: reasons });
  } else {
    // Check search query
    const queries = searchByPlaceId.get(biz.place_id);
    const searchInfo = queries ? [...queries].join('; ') : 'unknown';
    noEvidence.push({ ...biz, search_queries: searchInfo });
  }
}

// Save report
writeFileSync('data/final-audit-report.json', JSON.stringify({
  summary: {
    total: allBiz.length,
    with_evidence: withEvidence.length,
    no_evidence: noEvidence.length,
    verified_count: allBiz.filter(b => b.is_verified).length,
  },
  no_evidence_businesses: noEvidence,
}, null, 2));

console.log('=== FINAL DATA QUALITY REPORT ===\n');
console.log(`Total businesses in DB: ${allBiz.length}`);
console.log(`With grease evidence (KEEP): ${withEvidence.length}`);
console.log(`Zero grease evidence (CANDIDATES): ${noEvidence.length}`);
console.log(`Verified (is_verified=true): ${allBiz.filter(b => b.is_verified).length}`);

console.log('\n--- 15 businesses with ZERO grease evidence ---');
for (const b of noEvidence.slice(0, 15)) {
  const enr = enrichedBySlug.get(b.slug);
  const cats = (enr?.categories || []).slice(0, 3).join(', ');
  console.log(`  "${b.name}" (${b.city}, ${b.county}) | cats: ${cats || 'none'} | search: ${b.search_queries}`);
}

console.log('\n--- Evidence distribution for KEPT businesses ---');
const reasonCounts = {};
for (const b of withEvidence) {
  for (const r of b.grease_reasons) {
    const key = r.startsWith('website') ? 'website' : r;
    reasonCounts[key] = (reasonCounts[key] || 0) + 1;
  }
}
for (const [r, c] of Object.entries(reasonCounts).sort((a,b) => b[1] - a[1])) {
  console.log(`  ${r}: ${c}`);
}

console.log('\n=== WAITING FOR CONFIRMATION ===');
console.log(`${noEvidence.length} businesses have zero grease evidence. Review data/final-audit-report.json.`);

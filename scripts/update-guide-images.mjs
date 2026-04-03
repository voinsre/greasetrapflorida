/**
 * Phase 7D: Set image_url on all content_pages rows that are missing one.
 * Updates Supabase directly. Safe to re-run (uses upsert-style update by slug).
 *
 * Usage: node scripts/update-guide-images.mjs
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');

// Load .env.local manually
const envPath = resolve(rootDir, '.env.local');
const envContent = readFileSync(envPath, 'utf-8');
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx === -1) continue;
  const key = trimmed.slice(0, eqIdx).trim();
  const val = trimmed.slice(eqIdx + 1).trim();
  if (!process.env[key]) process.env[key] = val;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Slug → image_url mapping for rows that currently have null image_url
const updates = [
  // 7C2 guides missing images
  { slug: 'florida-fog-fines-penalties', image_url: '/images/guide-compliance.webp' },
  { slug: 'grease-trap-maintenance-tips', image_url: '/images/guide-frequency.webp' },
  { slug: 'grease-trap-sizing-guide-florida', image_url: '/images/blog-kitchen-2.webp' },
  { slug: 'grease-trap-vs-grease-interceptor', image_url: '/images/guide-cost.webp' },
  { slug: 'used-cooking-oil-vs-grease-trap-waste', image_url: '/images/blog-kitchen-1.webp' },
  { slug: 'verify-grease-hauler-dep-licensed', image_url: '/images/guide-choosing.webp' },
];

async function main() {
  console.log('Phase 7D: Updating image_url on content_pages...\n');

  // First, show current state
  const { data: before, error: bErr } = await supabase
    .from('content_pages')
    .select('slug, title, image_url, category')
    .is('image_url', null)
    .order('slug');

  if (bErr) { console.error('Query error:', bErr); process.exit(1); }

  console.log(`Found ${before.length} rows with null image_url:`);
  for (const r of before) {
    console.log(`  ${r.category}/${r.slug} → null`);
  }

  // Apply updates
  let updated = 0;
  for (const { slug, image_url } of updates) {
    const { data, error } = await supabase
      .from('content_pages')
      .update({ image_url })
      .eq('slug', slug)
      .is('image_url', null)
      .select('slug, image_url');

    if (error) {
      console.error(`  ❌ ${slug}: ${error.message}`);
      continue;
    }
    if (data.length === 0) {
      console.log(`  ⏭  ${slug}: already has image or not found`);
    } else {
      console.log(`  ✅ ${slug} → ${image_url}`);
      updated++;
    }
  }

  console.log(`\nUpdated ${updated} rows.\n`);

  // Verification: show all content_pages image_url state
  console.log('--- Verification: all content_pages ---\n');
  const { data: all, error: aErr } = await supabase
    .from('content_pages')
    .select('slug, category, image_url')
    .order('category')
    .order('slug');

  if (aErr) { console.error('Verify error:', aErr); process.exit(1); }

  let nullCount = 0;
  for (const r of all) {
    const status = r.image_url ? '✅' : '❌';
    if (!r.image_url) nullCount++;
    console.log(`  ${status} ${r.category}/${r.slug} → ${r.image_url || 'null'}`);
  }

  console.log(`\nTotal: ${all.length} pages, ${nullCount} still missing image_url`);
  if (nullCount === 0) console.log('\n🎉 All content pages have images!');
}

main();

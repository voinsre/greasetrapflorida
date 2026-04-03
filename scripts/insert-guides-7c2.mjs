/**
 * Phase 7C-2: Insert 10 supporting guides into Supabase content_pages table.
 * Reads guide markdown files from data/guides/, extracts YAML frontmatter,
 * and inserts them into the content_pages table.
 *
 * Usage: node scripts/insert-guides-7c2.mjs
 */

import { readFileSync, readdirSync } from 'fs';
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
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    env[key] = val;
  }
  return env;
}

// Parse YAML-ish frontmatter from markdown string
function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) throw new Error('No frontmatter found');

  const meta = {};
  const yamlBlock = match[1];
  const body = match[2];

  for (const line of yamlBlock.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const colonIdx = trimmed.indexOf(':');
    if (colonIdx === -1) continue;
    const key = trimmed.slice(0, colonIdx).trim();
    let val = trimmed.slice(colonIdx + 1).trim();
    // Remove surrounding quotes
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (val === 'null' || val === '') val = null;
    meta[key] = val;
  }

  return { meta, body };
}

async function main() {
  const env = loadEnv();
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceKey);

  // Read all guide markdown files
  const guidesDir = resolve(rootDir, 'data', 'guides');
  const files = readdirSync(guidesDir).filter(f => f.endsWith('.md')).sort();

  console.log(`Found ${files.length} guide files in data/guides/\n`);

  const rows = [];
  for (const file of files) {
    const raw = readFileSync(resolve(guidesDir, file), 'utf-8');
    const { meta, body } = parseFrontmatter(raw);

    rows.push({
      slug: meta.slug,
      title: meta.title,
      category: meta.category || 'guide',
      image_url: meta.image_url || null,
      meta_title: meta.meta_title,
      meta_description: meta.meta_description,
      excerpt: meta.excerpt,
      content: body.trim(),
      published_at: new Date().toISOString(),
    });

    console.log(`  Parsed: ${file} → slug="${meta.slug}"`);
  }

  console.log(`\nInserting ${rows.length} guides into content_pages...`);

  const { data, error } = await supabase
    .from('content_pages')
    .insert(rows)
    .select('slug, title, category, image_url');

  if (error) {
    console.error('Insert error:', error);
    process.exit(1);
  }

  console.log(`\n✅ Successfully inserted ${data.length} guides:\n`);
  data.forEach((r, i) => {
    console.log(`  ${i + 1}. ${r.title}`);
    console.log(`     slug: ${r.slug} | image: ${r.image_url || 'null'}`);
  });

  // Verification pass
  console.log('\n--- Verification ---\n');
  const { data: verify, error: verr } = await supabase
    .from('content_pages')
    .select('slug, title, category, meta_title, meta_description, image_url, published_at')
    .eq('category', 'guide')
    .order('created_at');

  if (verr) {
    console.error('Verify error:', verr);
    process.exit(1);
  }

  console.log(`Total guides in content_pages: ${verify.length}\n`);

  let allOk = true;
  for (const r of verify) {
    const mtLen = (r.meta_title || '').length;
    const mdLen = (r.meta_description || '').length;
    const mtOk = mtLen <= 60;
    const mdOk = mdLen <= 160;
    if (!mtOk || !mdOk) allOk = false;

    console.log(`  ${r.slug}`);
    console.log(`    meta_title (${mtLen} chars) ${mtOk ? '✅' : '❌'}`);
    console.log(`    meta_desc (${mdLen} chars) ${mdOk ? '✅' : '❌'}`);
    console.log(`    image: ${r.image_url || 'null'} | published: ${r.published_at ? '✅' : '❌'}`);
  }

  console.log(allOk ? '\n✅ All meta fields within limits.' : '\n❌ Some meta fields exceed limits — review above.');
}

main();

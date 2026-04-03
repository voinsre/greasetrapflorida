import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

const env = readFileSync('.env.local', 'utf8');
const getEnv = (key) => {
  const match = env.match(new RegExp(`^${key}=(.*)$`, 'm'));
  return match ? match[1].trim() : '';
};

const supabase = createClient(getEnv('NEXT_PUBLIC_SUPABASE_URL'), getEnv('SUPABASE_SERVICE_ROLE_KEY'));

const MOVES = [
  {
    oldSlug: 'chapter-62-705-compliance-guide',
    newSlug: 'chapter-62-705-guide',
    newCategory: 'compliance',
  },
  {
    oldSlug: 'florida-grease-waste-service-manifest',
    newSlug: 'grease-waste-manifest',
    newCategory: 'compliance',
  },
  {
    oldSlug: 'florida-fog-fines-penalties',
    newSlug: 'fines-and-penalties',
    newCategory: 'compliance',
  },
];

// URL replacements to apply inside all content_pages content fields
const URL_REPLACEMENTS = [
  ['/guides/chapter-62-705-compliance-guide', '/compliance/chapter-62-705-guide'],
  ['/guides/florida-grease-waste-service-manifest', '/compliance/grease-waste-manifest'],
  ['/guides/florida-fog-fines-penalties', '/compliance/fines-and-penalties'],
];

async function main() {
  // Step 1: Move the 3 guides to compliance category with new slugs
  for (const move of MOVES) {
    const { data, error } = await supabase
      .from('content_pages')
      .update({ category: move.newCategory, slug: move.newSlug })
      .eq('slug', move.oldSlug);
    if (error) {
      console.error(`Failed to move ${move.oldSlug}:`, error.message);
    } else {
      console.log(`Moved ${move.oldSlug} -> ${move.newSlug} (category: ${move.newCategory})`);
    }
  }

  // Step 2: Update internal links in ALL content_pages content fields
  const { data: allPages, error: fetchErr } = await supabase
    .from('content_pages')
    .select('id, slug, content');
  if (fetchErr) {
    console.error('Failed to fetch pages:', fetchErr.message);
    return;
  }

  let updatedCount = 0;
  for (const page of allPages || []) {
    let newContent = page.content;
    let changed = false;
    for (const [oldUrl, newUrl] of URL_REPLACEMENTS) {
      if (newContent.includes(oldUrl)) {
        newContent = newContent.replaceAll(oldUrl, newUrl);
        changed = true;
      }
    }
    if (changed) {
      const { error: updateErr } = await supabase
        .from('content_pages')
        .update({ content: newContent })
        .eq('id', page.id);
      if (updateErr) {
        console.error(`Failed to update links in ${page.slug}:`, updateErr.message);
      } else {
        console.log(`Updated internal links in: ${page.slug}`);
        updatedCount++;
      }
    }
  }
  console.log(`\nDone. ${updatedCount} pages had internal links updated.`);

  // Step 3: Verify
  const { data: compliance } = await supabase
    .from('content_pages')
    .select('slug, category, title')
    .eq('category', 'compliance')
    .order('title');
  console.log(`\nCompliance pages (${(compliance || []).length}):`);
  for (const p of compliance || []) {
    console.log(`  ${p.slug} — ${p.title}`);
  }

  const { data: guides } = await supabase
    .from('content_pages')
    .select('slug, category')
    .eq('category', 'guide');
  console.log(`\nGuide pages remaining: ${(guides || []).length}`);
}

main();

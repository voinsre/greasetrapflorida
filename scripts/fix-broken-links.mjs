import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

const env = readFileSync('.env.local', 'utf8');
const getEnv = (key) => {
  const match = env.match(new RegExp(`^${key}=(.*)$`, 'm'));
  return match ? match[1].trim() : '';
};

const supabase = createClient(getEnv('NEXT_PUBLIC_SUPABASE_URL'), getEnv('SUPABASE_SERVICE_ROLE_KEY'));

// All URL replacements to apply in content_pages content fields
const REPLACEMENTS = [
  // Wrong slug variations
  ['/guides/how-to-verify-grease-hauler-dep-licensed', '/guides/verify-grease-hauler-dep-licensed'],
  ['/guides/grease-trap-sizing-florida-restaurants', '/guides/grease-trap-sizing-guide-florida'],
  ['/guides/grease-trap-maintenance-tips-between-cleanings', '/guides/grease-trap-maintenance-tips'],
  ['/guides/used-cooking-oil-recycling-vs-grease-trap-waste', '/guides/used-cooking-oil-vs-grease-trap-waste'],
  // Wrong compliance slug
  ['/compliance/penalties-and-fines', '/compliance/fines-and-penalties'],
  // Old guide slugs (moved to compliance)
  ['/guides/chapter-62-705-compliance-guide', '/compliance/chapter-62-705-guide'],
  ['/guides/florida-grease-waste-service-manifest', '/compliance/grease-waste-manifest'],
  ['/guides/florida-fog-fines-penalties', '/compliance/fines-and-penalties'],
];

async function main() {
  const { data: allPages, error } = await supabase.from('content_pages').select('id, slug, content');
  if (error) { console.error('Fetch error:', error.message); return; }

  let totalUpdated = 0;
  for (const page of allPages || []) {
    let newContent = page.content;
    let changed = false;
    for (const [oldUrl, newUrl] of REPLACEMENTS) {
      if (newContent.includes(oldUrl)) {
        newContent = newContent.replaceAll(oldUrl, newUrl);
        changed = true;
        console.log(`  ${page.slug}: ${oldUrl} -> ${newUrl}`);
      }
    }
    if (changed) {
      const { error: upErr } = await supabase.from('content_pages').update({ content: newContent }).eq('id', page.id);
      if (upErr) console.error(`  FAILED to update ${page.slug}:`, upErr.message);
      else totalUpdated++;
    }
  }
  console.log(`\nUpdated ${totalUpdated} pages in database.`);
}

main();

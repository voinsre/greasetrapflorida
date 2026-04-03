import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
const envText = fs.readFileSync('.env.local', 'utf8');
for (const line of envText.split('\n')) {
  const m = line.match(/^([^#=]+)=(.*)$/);
  if (m) process.env[m[1].trim()] = m[2].trim();
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const fixes = [
  {
    slug: 'chapter-62-705-guide',
    meta_description: 'Florida Chapter 62-705 explained: DEP licensing, manifest requirements, penalties up to $5,000, and compliance steps for restaurants.',
  },
  {
    slug: 'grease-waste-manifest',
    meta_description: 'Florida grease waste manifest requirements under Chapter 62-705. What restaurants must document for every grease trap pump-out.',
  },
  {
    slug: 'palm-beach-county-grease-trap-requirements',
    meta_description: 'Palm Beach County grease trap requirements: FOG compliance, pump-out frequency, and penalties for restaurants and food service.',
  },
  {
    slug: 'sarasota-county-grease-trap-requirements',
    meta_description: 'Sarasota County grease trap rules: 30-day trap and 90-day interceptor pump-out cycles, FOG compliance, and local penalties.',
  },
  {
    slug: 'grease-trap-cleaning-frequency-florida',
    meta_description: 'How often to clean your grease trap in Florida: county requirements, the 25% rule, and schedules by establishment type.',
  },
];

for (const fix of fixes) {
  console.log(`${fix.slug}: "${fix.meta_description}" (${fix.meta_description.length} chars)`);
  const { error } = await supabase
    .from('content_pages')
    .update({ meta_description: fix.meta_description })
    .eq('slug', fix.slug);
  if (error) console.error('  ERROR:', error.message);
  else console.log('  Updated OK');
}

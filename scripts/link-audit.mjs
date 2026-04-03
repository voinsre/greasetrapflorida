import { readFileSync, readdirSync, statSync, existsSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { createClient } from '@supabase/supabase-js';

const env = readFileSync('.env.local', 'utf8');
const getEnv = (key) => {
  const match = env.match(new RegExp(`^${key}=(.*)$`, 'm'));
  return match ? match[1].trim() : '';
};

const APP_DIR = '.next/server/app';

// ---- 1. Build valid routes from .html files in .next/server/app ----
function collectRoutes(dir, prefix = '') {
  const routes = new Set();
  if (!existsSync(dir)) return routes;

  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);

    if (stat.isDirectory()) {
      if (entry.startsWith('_') || entry === 'api') continue;
      const sub = collectRoutes(full, `${prefix}/${entry}`);
      for (const r of sub) routes.add(r);
    } else if (entry.endsWith('.html')) {
      // about.html -> /about, index.html -> /
      const name = entry.replace('.html', '');
      if (name === 'index') {
        routes.add(prefix || '/');
      } else {
        routes.add(`${prefix}/${name}`);
      }
    }
  }
  return routes;
}

const validRoutes = collectRoutes(APP_DIR);
validRoutes.add('/sitemap.xml');
validRoutes.add('/robots.txt');
validRoutes.add('/');

console.log(`Found ${validRoutes.size} valid routes\n`);

// ---- 2. Scan HTML files for internal links ----
function collectHtmlFiles(dir) {
  const files = [];
  if (!existsSync(dir)) return files;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      if (entry.startsWith('_') || entry === 'api') continue;
      files.push(...collectHtmlFiles(full));
    } else if (entry.endsWith('.html')) {
      files.push(full);
    }
  }
  return files;
}

const htmlFiles = collectHtmlFiles(APP_DIR);
console.log(`Scanning ${htmlFiles.length} HTML files for internal links...\n`);

const hrefRegex = /href="(\/[^"#?]*?)"/g;
const brokenInTemplates = new Map(); // link -> Set<source>

for (const file of htmlFiles) {
  const content = readFileSync(file, 'utf8');
  const relPath = file.replace(/\\/g, '/').replace(/.*\.next\/server\/app\//, '/').replace('.html', '');
  const pagePath = relPath === '/index' ? '/' : relPath;

  let match;
  const regex = new RegExp(hrefRegex.source, 'g');
  while ((match = regex.exec(content)) !== null) {
    let link = match[1].replace(/\/$/, '') || '/';

    // Skip non-page links
    if (link.startsWith('/api/') || link.startsWith('/_next/') || link.startsWith('/images/') || link === '/favicon.svg') continue;

    if (!validRoutes.has(link)) {
      if (!brokenInTemplates.has(link)) brokenInTemplates.set(link, new Set());
      brokenInTemplates.get(link).add(pagePath);
    }
  }
}

// ---- 3. Scan DB content_pages ----
const supabase = createClient(getEnv('NEXT_PUBLIC_SUPABASE_URL'), getEnv('SUPABASE_SERVICE_ROLE_KEY'));
const { data: contentPages } = await supabase.from('content_pages').select('slug, category, content, title');

const mdLinkRegex = /\[([^\]]*)\]\((\/[^)#?]*?)\)/g;
const hrefInMdRegex = /href="(\/[^"#?]*?)"/g;
const dbBrokenLinks = [];

for (const page of contentPages || []) {
  const pageUrl = page.category === 'guide' ? `/guides/${page.slug}` : page.category === 'compliance' ? `/compliance/${page.slug}` : `/blog/${page.slug}`;

  const checkLink = (link) => {
    let clean = link.replace(/\/$/, '') || '/';
    if (clean.startsWith('/api/') || clean.startsWith('/images/')) return;
    if (!validRoutes.has(clean)) {
      dbBrokenLinks.push({ source: pageUrl, sourceTitle: page.title, link: clean });
    }
  };

  let m;
  const r1 = new RegExp(mdLinkRegex.source, 'g');
  while ((m = r1.exec(page.content)) !== null) checkLink(m[2]);
  const r2 = new RegExp(hrefInMdRegex.source, 'g');
  while ((m = r2.exec(page.content)) !== null) checkLink(m[1]);
}

// ---- 4. Report ----
console.log('=== BROKEN LINKS IN HTML TEMPLATES ===');
if (brokenInTemplates.size === 0) {
  console.log('  None found!');
} else {
  for (const [link, sources] of brokenInTemplates) {
    const srcArr = [...sources];
    console.log(`  BROKEN: ${link} (${srcArr.length} pages)`);
    for (const s of srcArr.slice(0, 2)) console.log(`    from: ${s}`);
    if (srcArr.length > 2) console.log(`    ... and ${srcArr.length - 2} more`);
  }
}

console.log('\n=== BROKEN LINKS IN DATABASE CONTENT ===');
const uniqueDbBroken = new Map();
for (const bl of dbBrokenLinks) {
  if (!uniqueDbBroken.has(bl.link)) uniqueDbBroken.set(bl.link, []);
  uniqueDbBroken.get(bl.link).push(bl.source);
}
if (uniqueDbBroken.size === 0) {
  console.log('  None found!');
} else {
  for (const [link, sources] of uniqueDbBroken) {
    console.log(`  BROKEN: ${link} (in ${sources.length} pages)`);
    for (const s of sources.slice(0, 3)) console.log(`    from: ${s}`);
  }
}

const totalBrokenTemplates = [...brokenInTemplates.values()].reduce((sum, s) => sum + s.size, 0);
console.log(`\n=== SUMMARY ===`);
console.log(`Valid routes: ${validRoutes.size}`);
console.log(`HTML files scanned: ${htmlFiles.length}`);
console.log(`Unique broken link targets in templates: ${brokenInTemplates.size}`);
console.log(`Unique broken link targets in DB: ${uniqueDbBroken.size}`);
console.log(`Total distinct broken targets: ${new Set([...brokenInTemplates.keys(), ...uniqueDbBroken.keys()]).size}`);

if (!existsSync('data')) mkdirSync('data', { recursive: true });
writeFileSync('data/link-audit-results.json', JSON.stringify({
  timestamp: new Date().toISOString(),
  validRoutes: [...validRoutes].sort(),
  brokenInTemplates: Object.fromEntries([...brokenInTemplates].map(([k, v]) => [k, [...v]])),
  brokenInDB: Object.fromEntries(uniqueDbBroken),
}, null, 2));
console.log('\nResults saved to data/link-audit-results.json');

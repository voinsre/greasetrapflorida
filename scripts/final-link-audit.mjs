import { readFileSync, readdirSync, statSync, existsSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { createClient } from '@supabase/supabase-js';

const env = readFileSync('.env.local', 'utf8');
const getEnv = (key) => {
  const match = env.match(new RegExp(`^${key}=(.*)$`, 'm'));
  return match ? match[1].trim() : '';
};

const APP_DIR = '.next/server/app';

// ==== 1. Build valid routes from HTML files ====
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

function routeFromHtml(filePath) {
  const rel = filePath.replace(/\\/g, '/');
  const idx = rel.indexOf('.next/server/app/');
  const after = rel.slice(idx + '.next/server/app/'.length).replace('.html', '');
  if (after === 'index' || after === '') return '/';
  return '/' + after;
}

const htmlFiles = collectHtmlFiles(APP_DIR);
const validRoutes = new Set(htmlFiles.map(routeFromHtml));
validRoutes.add('/');
validRoutes.add('/sitemap.xml');
validRoutes.add('/robots.txt');

console.log(`Valid routes: ${validRoutes.size}`);
console.log(`HTML files: ${htmlFiles.length}\n`);

// ==== 2. Scan all HTML for internal links ====
const hrefRegex = /href="(\/[^"#?]*?)"/g;
const allInternalLinks = new Map(); // link -> Set<source>
const externalLinks = new Map(); // link -> Set<source>
const brokenInternal = new Map();

for (const file of htmlFiles) {
  const content = readFileSync(file, 'utf8');
  const page = routeFromHtml(file);

  let m;
  const re = new RegExp(hrefRegex.source, 'g');
  while ((m = re.exec(content)) !== null) {
    let link = m[1].replace(/\/$/, '') || '/';
    if (link.startsWith('/api/') || link.startsWith('/_next/') || link.startsWith('/images/') || link === '/favicon.svg') continue;
    if (!allInternalLinks.has(link)) allInternalLinks.set(link, new Set());
    allInternalLinks.get(link).add(page);
    if (!validRoutes.has(link)) {
      if (!brokenInternal.has(link)) brokenInternal.set(link, new Set());
      brokenInternal.get(link).add(page);
    }
  }

  // External links
  const extRe = /href="(https?:\/\/[^"#?]*?)"/g;
  while ((m = extRe.exec(content)) !== null) {
    const url = m[1];
    if (url.includes('greasetrapflorida.com')) continue; // skip self
    if (!externalLinks.has(url)) externalLinks.set(url, new Set());
    externalLinks.get(url).add(page);
  }
}

// ==== 3. Scan DB content_pages ====
const supabase = createClient(getEnv('NEXT_PUBLIC_SUPABASE_URL'), getEnv('SUPABASE_SERVICE_ROLE_KEY'));
const { data: contentPages } = await supabase.from('content_pages').select('slug, category, content, title');

const mdLink = /\[([^\]]*)\]\((\/[^)#?]*?)\)/g;
const hrefMd = /href="(\/[^"#?]*?)"/g;
const brokenContent = [];
let totalContentLinks = 0;

for (const page of contentPages || []) {
  const pageUrl = page.category === 'guide' ? `/guides/${page.slug}` : page.category === 'compliance' ? `/compliance/${page.slug}` : `/blog/${page.slug}`;
  const check = (link) => {
    let clean = link.replace(/\/$/, '') || '/';
    if (clean.startsWith('/api/') || clean.startsWith('/images/')) return;
    totalContentLinks++;
    if (!validRoutes.has(clean)) {
      brokenContent.push({ source: pageUrl, title: page.title, link: clean });
    }
  };
  let m2;
  const r1 = new RegExp(mdLink.source, 'g');
  while ((m2 = r1.exec(page.content)) !== null) check(m2[2]);
  const r2 = new RegExp(hrefMd.source, 'g');
  while ((m2 = r2.exec(page.content)) !== null) check(m2[1]);
}

// ==== 4. Check component source files for hardcoded hrefs ====
const componentFiles = [
  'src/components/layout/Header.tsx',
  'src/components/layout/Footer.tsx',
  'src/components/layout/Breadcrumbs.tsx',
  'src/app/page.tsx',
  'src/app/companies/[slug]/page.tsx',
  'src/app/county/[slug]/page.tsx',
  'src/app/city/[slug]/page.tsx',
];

const brokenComponents = [];
const componentHrefRe = /href=["']{1,2}(\/[^"'#?]+)["']/g;

for (const cf of componentFiles) {
  if (!existsSync(cf)) continue;
  const src = readFileSync(cf, 'utf8');
  let cm;
  const cre = new RegExp(componentHrefRe.source, 'g');
  while ((cm = cre.exec(src)) !== null) {
    let link = cm[1].replace(/\/$/, '') || '/';
    if (link.startsWith('/api/') || link.startsWith('/images/') || link === '/favicon.svg') continue;
    // Dynamic routes like /county/${slug} or /companies/${b.slug} are fine
    if (link.includes('${') || link.includes('{')) continue;
    if (!validRoutes.has(link)) {
      brokenComponents.push({ file: cf, link });
    }
  }
}

// ==== 5. Check redirects ====
const nextConfig = readFileSync('next.config.ts', 'utf8');
const redirectSources = [];
const redirectRe = /source:\s*["']([^"']+)["']/g;
const redirectDests = [];
const destRe = /destination:\s*["']([^"']+)["']/g;
let rm;
while ((rm = redirectRe.exec(nextConfig)) !== null) redirectSources.push(rm[1]);
while ((rm = destRe.exec(nextConfig)) !== null) redirectDests.push(rm[1]);
const redirectIssues = [];
for (let i = 0; i < redirectDests.length; i++) {
  const dest = redirectDests[i];
  if (dest.startsWith('https://') || dest.includes(':path')) continue;
  if (!validRoutes.has(dest)) {
    redirectIssues.push({ source: redirectSources[i] || '?', destination: dest, issue: 'destination does not exist' });
  }
}

// ==== 6. Sitemap cross-check ====
const sitemapHtml = existsSync('.next/server/app/sitemap.xml.body')
  ? readFileSync('.next/server/app/sitemap.xml.body', 'utf8')
  : '';
const sitemapUrls = new Set();
const locRe = /<loc>https:\/\/greasetrapflorida\.com(\/[^<]*)<\/loc>/g;
let sm;
while ((sm = locRe.exec(sitemapHtml)) !== null) {
  sitemapUrls.add(sm[1].replace(/\/$/, '') || '/');
}

const sitemapMismatches = [];
// Pages not in sitemap
const excludeFromSitemap = new Set(['/compare', '/_not-found']);
for (const route of validRoutes) {
  if (route === '/sitemap.xml' || route === '/robots.txt') continue;
  if (excludeFromSitemap.has(route)) continue;
  if (sitemapUrls.size > 0 && !sitemapUrls.has(route)) {
    sitemapMismatches.push({ route, issue: 'page exists but not in sitemap' });
  }
}
// Sitemap URLs that don't exist
for (const url of sitemapUrls) {
  if (!validRoutes.has(url)) {
    sitemapMismatches.push({ route: url, issue: 'in sitemap but page does not exist' });
  }
}

// ==== 7. Orphaned pages (exist but nothing links to them) ====
const linkedTo = new Set();
for (const link of allInternalLinks.keys()) linkedTo.add(link);
const orphaned = [];
for (const route of validRoutes) {
  if (route === '/' || route === '/sitemap.xml' || route === '/robots.txt') continue;
  if (!linkedTo.has(route)) orphaned.push(route);
}

// ==== 8. Check external links (HEAD requests, limited) ====
const uniqueExternal = [...externalLinks.keys()];
console.log(`\nChecking ${uniqueExternal.length} unique external links...`);
const deadExternal = [];
for (const url of uniqueExternal) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(url, { method: 'HEAD', signal: controller.signal, redirect: 'follow' });
    clearTimeout(timeout);
    if (res.status >= 400) {
      deadExternal.push({ url, status: res.status, from: [...externalLinks.get(url)].slice(0, 2) });
    }
  } catch (err) {
    deadExternal.push({ url, status: 'timeout/error', from: [...externalLinks.get(url)].slice(0, 2) });
  }
}

// ==== REPORT ====
console.log('\n========================================');
console.log('FINAL LINK AUDIT REPORT');
console.log('========================================\n');

console.log(`Pages scanned: ${htmlFiles.length}`);
console.log(`Valid routes: ${validRoutes.size}`);
console.log(`Internal link targets checked: ${allInternalLinks.size}`);
console.log(`Content links checked: ${totalContentLinks}`);
console.log(`External links checked: ${uniqueExternal.length}`);
console.log(`Redirects configured: ${redirectSources.length}`);

console.log('\n--- BROKEN INTERNAL LINKS ---');
if (brokenInternal.size === 0) {
  console.log('CLEAN: Zero broken internal links!');
} else {
  for (const [link, sources] of brokenInternal) {
    console.log(`  BROKEN: ${link} (${sources.size} pages)`);
  }
}

console.log('\n--- BROKEN CONTENT LINKS (DB) ---');
if (brokenContent.length === 0) {
  console.log('CLEAN: Zero broken content links!');
} else {
  for (const bl of brokenContent) {
    console.log(`  BROKEN: ${bl.link} in ${bl.source}`);
  }
}

console.log('\n--- BROKEN COMPONENT LINKS ---');
if (brokenComponents.length === 0) {
  console.log('CLEAN: Zero broken component links!');
} else {
  for (const bl of brokenComponents) {
    console.log(`  BROKEN: ${bl.link} in ${bl.file}`);
  }
}

console.log('\n--- REDIRECT ISSUES ---');
if (redirectIssues.length === 0) {
  console.log('CLEAN: All redirect destinations valid!');
} else {
  for (const ri of redirectIssues) {
    console.log(`  ISSUE: ${ri.source} -> ${ri.destination} (${ri.issue})`);
  }
}

console.log('\n--- SITEMAP MISMATCHES ---');
if (sitemapMismatches.length === 0) {
  console.log(sitemapUrls.size > 0 ? 'CLEAN: Sitemap matches routes!' : 'SKIP: No sitemap body found (dynamic generation)');
} else {
  for (const sm of sitemapMismatches) {
    console.log(`  ${sm.issue}: ${sm.route}`);
  }
}

console.log('\n--- DEAD EXTERNAL LINKS ---');
if (deadExternal.length === 0) {
  console.log('All external links responding!');
} else {
  for (const de of deadExternal) {
    console.log(`  DEAD: ${de.url} (${de.status}) from ${de.from[0]}`);
  }
}

console.log('\n--- ORPHANED PAGES ---');
if (orphaned.length === 0) {
  console.log('No orphaned pages!');
} else {
  console.log(`${orphaned.length} orphaned pages (not linked from anywhere):`);
  for (const o of orphaned) console.log(`  ${o}`);
}

console.log('\n========================================');
console.log('SUMMARY');
console.log('========================================');
console.log(`INTERNAL: ${brokenInternal.size === 0 ? 'CLEAN' : 'BROKEN'} — ${allInternalLinks.size} link targets verified across ${htmlFiles.length} pages`);
console.log(`CONTENT: ${brokenContent.length === 0 ? 'CLEAN' : 'BROKEN'} — ${totalContentLinks} links checked in ${(contentPages || []).length} DB pages`);
console.log(`COMPONENTS: ${brokenComponents.length === 0 ? 'CLEAN' : 'BROKEN'} — ${componentFiles.length} source files checked`);
console.log(`EXTERNAL: ${deadExternal.length} dead external links (reported, not fixed)`);
console.log(`REDIRECTS: ${redirectSources.length} redirects configured and verified`);

// Save
if (!existsSync('data')) mkdirSync('data', { recursive: true });
writeFileSync('data/final-link-audit.json', JSON.stringify({
  timestamp: new Date().toISOString(),
  total_pages_scanned: htmlFiles.length,
  total_internal_links_checked: allInternalLinks.size,
  total_content_links_checked: totalContentLinks,
  total_external_links_checked: uniqueExternal.length,
  broken_internal_links: Object.fromEntries([...brokenInternal].map(([k, v]) => [k, [...v]])),
  broken_content_links: brokenContent,
  dead_external_links: deadExternal,
  broken_component_links: brokenComponents,
  sitemap_mismatches: sitemapMismatches,
  redirect_issues: redirectIssues,
  orphaned_pages: orphaned,
}, null, 2));
console.log('\nFull report saved to data/final-link-audit.json');

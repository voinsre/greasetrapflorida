import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const BUILD_DIR = path.join(ROOT, '.next', 'server', 'app');
const BASE_URL = 'https://greasetrapflorida.com';

function findHtmlFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...findHtmlFiles(full));
    else if (entry.name.endsWith('.html')) results.push(full);
  }
  return results;
}

function fileToRoute(filePath) {
  let r = filePath.replace(BUILD_DIR, '').replace(/\\/g, '/').replace(/\.html$/, '').replace(/\/index$/, '/');
  if (r === '') r = '/';
  if (!r.startsWith('/')) r = '/' + r;
  return r;
}

function extractMeta(html) {
  return {
    title: html.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim() || null,
    description: html.match(/<meta\s+name="description"\s+content="([^"]*?)"/)?.[1] || null,
    ogTitle: html.match(/<meta\s+property="og:title"\s+content="([^"]*?)"/)?.[1] || null,
    ogDesc: html.match(/<meta\s+property="og:description"\s+content="([^"]*?)"/)?.[1] || null,
    ogImage: html.match(/<meta\s+property="og:image"\s+content="([^"]*?)"/)?.[1] || null,
    canonical: html.match(/<link\s+rel="canonical"\s+href="([^"]*?)"/)?.[1] || null,
  };
}

function extractJsonLd(html) {
  const blocks = [];
  const re = /<script\s+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    try {
      const p = JSON.parse(m[1]);
      if (Array.isArray(p)) {
        for (const item of p) blocks.push({ valid: true, data: item, type: item['@type'] || 'unknown' });
      } else {
        blocks.push({ valid: true, data: p, type: p['@type'] || 'unknown' });
      }
    } catch (e) {
      blocks.push({ valid: false, error: e.message });
    }
  }
  return blocks;
}

function extractHeadings(html) {
  const out = [];
  const re = /<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    out.push({ level: parseInt(m[1]), text: m[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() });
  }
  return out;
}

function extractImages(html) {
  const out = [];
  const re = /<img\s+([^>]*?)\/?\s*>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const a = m[1];
    const src = a.match(/src="([^"]*?)"/)?.[1] || null;
    const alt = a.match(/alt="([^"]*?)"/)?.[1];
    out.push({ src, hasAlt: alt !== undefined });
  }
  return out;
}

function extractInternalLinks(html) {
  const out = [];
  const re = /<a\s+([^>]*?)>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const href = m[1].match(/href="([^"]*?)"/)?.[1];
    if (href && (href.startsWith('/') || href.startsWith(BASE_URL))) {
      out.push(href.replace(BASE_URL, ''));
    }
  }
  return [...new Set(out)];
}

function expectedJsonLd(route) {
  if (route === '/') return ['WebSite', 'BreadcrumbList'];
  if (/^\/companies\/[^/]+$/.test(route)) return ['LocalBusiness', 'FAQPage', 'BreadcrumbList'];
  if (/^\/county\/[^/]+$/.test(route)) return ['ItemList', 'FAQPage', 'BreadcrumbList'];
  if (/^\/city\/[^/]+$/.test(route)) return ['ItemList', 'FAQPage', 'BreadcrumbList'];
  if (/^\/services\/[^/]+$/.test(route)) return ['ItemList', 'FAQPage', 'BreadcrumbList'];
  if (/^\/guides\/[^/]+$/.test(route)) return ['Article', 'FAQPage', 'BreadcrumbList'];
  if (/^\/blog\/[^/]+$/.test(route)) return ['Article', 'FAQPage', 'BreadcrumbList'];
  if (/^\/compliance\/[^/]+$/.test(route)) return ['Article', 'FAQPage', 'BreadcrumbList'];
  if (route === '/cost/grease-trap-cleaning-cost') return ['Article', 'FAQPage', 'BreadcrumbList'];
  return null;
}

function runAudit() {
  console.log('=== Phase 8: SEO Audit ===\n');
  const files = findHtmlFiles(BUILD_DIR);
  console.log('Found ' + files.length + ' HTML files\n');

  const allRoutes = new Set();
  const issues = { meta: [], jsonLd: [], headings: [], images: [], links: [], canonical: [], perf: [] };
  const titleMap = new Map();
  const allLinks = new Set();
  const linkCounts = [];

  for (const file of files) {
    const route = fileToRoute(file);
    allRoutes.add(route);
    const html = fs.readFileSync(file, 'utf8');
    const meta = extractMeta(html);

    // META
    if (!meta.title) issues.meta.push({ route, issue: 'Missing title' });
    else {
      if (meta.title.length > 60) issues.meta.push({ route, issue: 'Title ' + meta.title.length + ' chars: ' + meta.title });
      if (!titleMap.has(meta.title)) titleMap.set(meta.title, []);
      titleMap.get(meta.title).push(route);
    }
    if (!meta.description) issues.meta.push({ route, issue: 'Missing meta description' });
    else if (meta.description.length > 160) issues.meta.push({ route, issue: 'Description ' + meta.description.length + ' chars' });
    if (!meta.ogTitle) issues.meta.push({ route, issue: 'Missing og:title' });
    if (!meta.ogDesc) issues.meta.push({ route, issue: 'Missing og:description' });
    if (!meta.ogImage) issues.meta.push({ route, issue: 'Missing og:image' });

    // CANONICAL
    if (!meta.canonical) issues.canonical.push({ route, issue: 'Missing canonical' });

    // JSON-LD
    const ld = extractJsonLd(html);
    for (const b of ld) { if (!b.valid) issues.jsonLd.push({ route, issue: 'Invalid JSON-LD: ' + b.error }); }
    const exp = expectedJsonLd(route);
    if (exp) {
      const found = ld.filter(b => b.valid).map(b => b.type);
      for (const t of exp) {
        if (!found.includes(t)) issues.jsonLd.push({ route, issue: 'Missing ' + t + ' (found: ' + (found.join(',') || 'none') + ')' });
      }
    }

    // HEADINGS
    const hdgs = extractHeadings(html);
    const h1s = hdgs.filter(h => h.level === 1);
    if (h1s.length === 0) issues.headings.push({ route, issue: 'No H1' });
    else if (h1s.length > 1) issues.headings.push({ route, issue: 'Multiple H1s: ' + h1s.length });
    for (const h of hdgs) { if (!h.text) issues.headings.push({ route, issue: 'Empty H' + h.level }); }
    const lvls = hdgs.map(h => h.level);
    for (let i = 1; i < lvls.length; i++) {
      if (lvls[i] > lvls[i-1] + 1) issues.headings.push({ route, issue: 'Skip H' + lvls[i-1] + '->H' + lvls[i] });
    }

    // IMAGES
    for (const img of extractImages(html)) {
      if (!img.hasAlt) issues.images.push({ route, issue: 'Missing alt: ' + (img.src || '').substring(0, 60) });
    }

    // LINKS
    const il = extractInternalLinks(html);
    for (const l of il) allLinks.add(l);
    linkCounts.push({ route, count: il.length });
  }

  // Dup titles
  for (const [t, rs] of titleMap) {
    if (rs.length > 1) issues.meta.push({ route: rs[0], issue: 'Dup title (' + rs.length + 'x): ' + t });
  }

  // Broken links
  const skipPfx = ['/_next', '/api/', '/favicon', '/images/'];
  const skipExact = ['/sitemap.xml', '/robots.txt'];
  const redir = [
    '/guides/chapter-62-705-compliance-guide', '/guides/florida-grease-waste-service-manifest',
    '/guides/florida-fog-fines-penalties', '/compliance/penalties-and-fines',
    '/guides/how-to-verify-grease-hauler-dep-licensed', '/guides/grease-trap-sizing-florida-restaurants',
    '/guides/grease-trap-maintenance-tips-between-cleanings', '/guides/used-cooking-oil-recycling-vs-grease-trap-waste',
    '/county/clay', '/county/hernando', '/county/nassau', '/county/santa-rosa', '/county/st-lucie',
  ];
  for (const link of allLinks) {
    const c = link.split('#')[0].split('?')[0].replace(/\/$/, '') || '/';
    if (skipPfx.some(p => c.startsWith(p))) continue;
    if (skipExact.includes(c)) continue;
    if (redir.includes(c)) continue;
    if (!allRoutes.has(c)) issues.links.push({ route: 'site-wide', issue: 'Broken: ' + c });
  }

  // Low link counts
  for (const { route, count } of linkCounts) {
    const isContent = /^\/(guides|blog|compliance|cost)\//.test(route);
    if (isContent && count < 5) issues.links.push({ route, issue: count + ' links (content needs 5+)' });
    else if (!/^\/api\//.test(route) && route !== '/privacy' && count < 3) issues.links.push({ route, issue: count + ' links (min 3)' });
  }

  // Performance
  const homeHtml = fs.readFileSync(path.join(BUILD_DIR, 'index.html'), 'utf8');
  if (!homeHtml.includes('fetchPriority="high"')) {
    issues.perf.push({ route: '/', issue: 'Hero image missing fetchPriority=high' });
  }

  // Print
  for (const [name, items] of Object.entries(issues)) {
    console.log(name.toUpperCase() + ': ' + items.length + ' issues');
    for (const i of items.slice(0, 25)) console.log('  [' + i.route + '] ' + i.issue);
    if (items.length > 25) console.log('  ... +' + (items.length - 25) + ' more');
    console.log('');
  }

  const total = Object.values(issues).reduce((s, a) => s + a.length, 0);
  console.log('TOTAL: ' + total + ' issues across ' + files.length + ' pages\n');

  const results = { auditDate: new Date().toISOString(), totalPages: files.length, totalIssues: total, issues, routes: [...allRoutes].sort() };
  fs.mkdirSync(path.join(ROOT, 'data'), { recursive: true });
  fs.writeFileSync(path.join(ROOT, 'data', 'seo-audit-results.json'), JSON.stringify(results, null, 2));
  console.log('Saved to data/seo-audit-results.json');
}

runAudit();

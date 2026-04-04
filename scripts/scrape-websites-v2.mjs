#!/usr/bin/env node

/**
 * Re-enrichment Step 1 — Improved website scraper for 168 confirmed businesses.
 * Fetches 6-10 targeted pages per business with aggressive text cleaning.
 *
 * Reads: Supabase DB (168 businesses)
 * Writes: data/scraped-websites-v2.json
 *
 * Usage: node scripts/scrape-websites-v2.mjs
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUTPUT_PATH = resolve(ROOT, "data", "scraped-websites-v2.json");

// ── Config ──────────────────────────────────────────────────────────────────
const MAX_CONCURRENCY = 5;
const STAGGER_DELAY_MS = 1000;
const REQUEST_TIMEOUT_MS = 12000;
const MAX_CHARS_PER_PAGE = 8000;
const MAX_CHARS_COMBINED = 20000;
const PROGRESS_INTERVAL = 10;

// ── UA Rotation ─────────────────────────────────────────────────────────────
const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 14.4; rv:125.0) Gecko/20100101 Firefox/125.0",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
];
let uaIdx = 0;
function nextUA() {
  return USER_AGENTS[uaIdx++ % USER_AGENTS.length];
}

function buildHeaders() {
  return {
    "User-Agent": nextUA(),
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "Upgrade-Insecure-Requests": "1",
    Referer: "https://www.google.com/",
  };
}

// ── Targeted page paths ─────────────────────────────────────────────────────
const TARGET_PAGES = {
  services: ["/services", "/our-services", "/what-we-do", "/commercial-services", "/grease-trap", "/grease-trap-cleaning", "/grease-trap-services", "/grease-services"],
  about: ["/about", "/about-us", "/our-company", "/who-we-are"],
  contact: ["/contact", "/contact-us", "/get-in-touch", "/reach-us"],
  serviceArea: ["/service-area", "/service-areas", "/areas-we-serve", "/coverage-area", "/locations"],
  pricing: ["/pricing", "/prices", "/rates", "/cost", "/free-estimate"],
  faq: ["/faq", "/faqs", "/frequently-asked-questions"],
};

// Grease keyword link patterns
const GREASE_LINK_KEYWORDS = /grease|trap|interceptor|fog|commercial|kitchen|restaurant/i;

// ── HTML cleaning (critical fix) ────────────────────────────────────────────

// Elements to remove entirely before text extraction
const REMOVE_TAGS = ["nav", "header", "footer", "aside", "form", "button", "input", "select", "textarea", "script", "style", "noscript", "iframe", "svg"];

// Class/id patterns to remove
const REMOVE_CLASS_PATTERNS = /\b(nav|menu|header|footer|sidebar|cookie|popup|modal|banner|widget|social|share|comment)\b/i;

// ARIA roles to remove
const REMOVE_ROLES = ["navigation", "banner", "contentinfo"];

function cleanHtml(html) {
  let h = html;

  // 1. Remove elements by tag
  for (const tag of REMOVE_TAGS) {
    const re = new RegExp(`<${tag}[\\s>][\\s\\S]*?<\\/${tag}>`, "gi");
    h = h.replace(re, " ");
    // Also remove self-closing
    const reSelf = new RegExp(`<${tag}[^>]*\\/?>`, "gi");
    h = h.replace(reSelf, " ");
  }

  // 2. Remove elements with matching class/id (greedy block removal)
  // Match opening tags with class/id containing nav/menu/header/footer/etc.
  h = h.replace(/<(\w+)\s[^>]*(class|id)\s*=\s*["'][^"']*\b(nav|menu|header|footer|sidebar|cookie|popup|modal|banner|widget|social|share|comment)\b[^"']*["'][^>]*>[\s\S]*?<\/\1>/gi, " ");

  // 3. Remove elements with role="navigation|banner|contentinfo"
  for (const role of REMOVE_ROLES) {
    const re = new RegExp(`<(\\w+)\\s[^>]*role\\s*=\\s*["']${role}["'][^>]*>[\\s\\S]*?<\\/\\1>`, "gi");
    h = h.replace(re, " ");
  }

  // 4. Strip HTML comments
  h = h.replace(/<!--[\s\S]*?-->/g, " ");

  // 5. Strip remaining tags
  h = h.replace(/<[^>]+>/g, " ");

  // 5. Decode HTML entities
  h = h
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#\d+;/g, " ")
    .replace(/&\w+;/g, " ");

  // 6. Collapse whitespace
  h = h.replace(/\s+/g, " ").trim();

  // 7. Split into lines, remove short lines (<20 chars) and dedup
  const lines = h.split(/[.!?]\s+/).map((l) => l.trim()).filter((l) => l.length >= 20);
  const seen = new Set();
  const deduped = [];
  for (const line of lines) {
    const key = line.toLowerCase().replace(/\s+/g, " ");
    if (!seen.has(key)) {
      seen.add(key);
      deduped.push(line);
    }
  }

  return deduped.join(". ").trim();
}

// ── Extract internal links from HTML ────────────────────────────────────────
function extractLinks(html, baseUrl) {
  const links = new Set();
  const re = /<a\s[^>]*href\s*=\s*["']([^"'#]+)["'][^>]*>/gi;
  let match;
  while ((match = re.exec(html)) !== null) {
    let href = match[1].trim();
    if (!href || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:")) continue;

    try {
      const url = new URL(href, baseUrl);
      // Only internal links
      const base = new URL(baseUrl);
      if (url.hostname === base.hostname || url.hostname === "www." + base.hostname || "www." + url.hostname === base.hostname) {
        links.add(url.pathname.toLowerCase());
      }
    } catch {
      // skip invalid URLs
    }
  }
  return [...links];
}

// ── Fetch with timeout ──────────────────────────────────────────────────────
async function safeFetch(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      headers: buildHeaders(),
      signal: controller.signal,
      redirect: "follow",
    });
    clearTimeout(timer);
    if (!res.ok) return { status: res.status, text: null };
    const text = await res.text();
    return { status: res.status, text };
  } catch (err) {
    clearTimeout(timer);
    if (err.name === "AbortError") return { status: "timeout", text: null };
    return { status: "error", text: null };
  }
}

// ── Find first matching target page ─────────────────────────────────────────
async function findTargetPage(baseUrl, paths, knownLinks) {
  // First check if any known link matches
  for (const path of paths) {
    if (knownLinks.includes(path) || knownLinks.includes(path + "/")) {
      const result = await safeFetch(new URL(path, baseUrl).href);
      if (result.status === 200 && result.text && result.text.length > 200) {
        return { path, html: result.text };
      }
    }
  }
  // Then try paths directly
  for (const path of paths) {
    if (knownLinks.includes(path) || knownLinks.includes(path + "/")) continue; // already tried
    const result = await safeFetch(new URL(path, baseUrl).href);
    if (result.status === 200 && result.text && result.text.length > 200) {
      return { path, html: result.text };
    }
  }
  return null;
}

// ── Scrape single business ──────────────────────────────────────────────────
async function scrapeBusiness(biz) {
  const result = {
    slug: biz.slug,
    name: biz.name,
    website: biz.website,
    website_status: "no_website",
    pages_fetched: 0,
    pages: {},
    all_text_combined: "",
    scrape_timestamp: new Date().toISOString(),
  };

  if (!biz.website) return result;

  // Normalize base URL
  let baseUrl = biz.website.split("?")[0].split("#")[0];
  if (!baseUrl.startsWith("http")) baseUrl = "https://" + baseUrl;
  try {
    const u = new URL(baseUrl);
    baseUrl = u.origin;
  } catch {
    result.website_status = "error";
    return result;
  }

  // 1. Fetch homepage
  const homepage = await safeFetch(baseUrl);
  if (!homepage.text) {
    result.website_status = homepage.status === 403 ? "blocked" : homepage.status === "timeout" ? "timeout" : "dead";
    return result;
  }

  result.website_status = "live";
  const homepageText = cleanHtml(homepage.text);
  result.pages.homepage = homepageText.slice(0, MAX_CHARS_PER_PAGE);
  result.pages_fetched = 1;

  // 2. Extract all internal links
  const knownLinks = extractLinks(homepage.text, baseUrl);

  // 3. Fetch targeted pages
  const pageTypes = Object.entries(TARGET_PAGES);
  for (const [pageType, paths] of pageTypes) {
    const found = await findTargetPage(baseUrl, paths, knownLinks);
    if (found) {
      const text = cleanHtml(found.html);
      result.pages[pageType] = text.slice(0, MAX_CHARS_PER_PAGE);
      result.pages_fetched++;
    }
  }

  // 4. Grease keyword link discovery (max 3 additional pages)
  let keywordPages = 0;
  for (const link of knownLinks) {
    if (keywordPages >= 3) break;
    // Skip links we already fetched
    const alreadyFetched = Object.values(TARGET_PAGES).flat().some((p) => link === p || link === p + "/");
    if (alreadyFetched || link === "/" || link === "") continue;

    if (GREASE_LINK_KEYWORDS.test(link)) {
      try {
        const fetched = await safeFetch(new URL(link, baseUrl).href);
        if (fetched.status === 200 && fetched.text && fetched.text.length > 200) {
          const text = cleanHtml(fetched.text);
          result.pages[`keyword_${keywordPages}`] = text.slice(0, MAX_CHARS_PER_PAGE);
          result.pages_fetched++;
          keywordPages++;
        }
      } catch {
        // skip
      }
    }
  }

  // 5. Combine all text
  const allTexts = Object.values(result.pages);
  result.all_text_combined = allTexts.join(" ").slice(0, MAX_CHARS_COMBINED);

  return result;
}

// ── Env loader ──────────────────────────────────────────────────────────────
function loadEnv() {
  const envPath = resolve(ROOT, ".env.local");
  const lines = readFileSync(envPath, "utf-8").split("\n");
  const env = {};
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    env[trimmed.slice(0, eqIdx).trim()] = trimmed.slice(eqIdx + 1).trim();
  }
  return env;
}

// ── Concurrency limiter ─────────────────────────────────────────────────────
async function runConcurrent(items, fn, concurrency) {
  const results = [];
  let idx = 0;
  let completed = 0;

  async function worker() {
    while (idx < items.length) {
      const i = idx++;
      const item = items[i];
      const result = await fn(item);
      results[i] = result;
      completed++;
      if (completed % PROGRESS_INTERVAL === 0 || completed === items.length) {
        const live = results.filter((r) => r && r.website_status === "live").length;
        console.log(`  [${completed}/${items.length}] scraped — ${live} live so far`);
      }
      // Stagger delay
      await new Promise((r) => setTimeout(r, STAGGER_DELAY_MS));
    }
  }

  const workers = [];
  for (let w = 0; w < concurrency; w++) {
    workers.push(worker());
  }
  await Promise.all(workers);
  return results;
}

// ── Main ────────────────────────────────────────────────────────────────────
async function main() {
  console.log("=== Re-enrichment Step 1: Improved Website Scraper ===\n");

  // Load businesses from DB
  const env = loadEnv();
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: businesses, error } = await supabase
    .from("businesses")
    .select("slug, name, website, city, county, opening_hours, rating, review_count, email, description")
    .order("name");

  if (error) {
    console.error("DB error:", error);
    process.exit(1);
  }

  console.log(`Loaded ${businesses.length} businesses from DB`);
  const withWebsite = businesses.filter((b) => b.website);
  const noWebsite = businesses.filter((b) => !b.website);
  console.log(`  ${withWebsite.length} have websites, ${noWebsite.length} without\n`);

  console.log("Starting scrape (5 concurrent, 1s delay, 12s timeout)...\n");
  const startTime = Date.now();

  const scraped = await runConcurrent(businesses, scrapeBusiness, MAX_CONCURRENCY);

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  // Stats
  const stats = {
    total: scraped.length,
    live: scraped.filter((s) => s.website_status === "live").length,
    blocked: scraped.filter((s) => s.website_status === "blocked").length,
    dead: scraped.filter((s) => s.website_status === "dead").length,
    timeout: scraped.filter((s) => s.website_status === "timeout").length,
    error: scraped.filter((s) => s.website_status === "error").length,
    no_website: scraped.filter((s) => s.website_status === "no_website").length,
    avg_pages: (scraped.filter((s) => s.website_status === "live").reduce((sum, s) => sum + s.pages_fetched, 0) / Math.max(scraped.filter((s) => s.website_status === "live").length, 1)).toFixed(1),
    avg_text_len: (scraped.filter((s) => s.website_status === "live").reduce((sum, s) => sum + s.all_text_combined.length, 0) / Math.max(scraped.filter((s) => s.website_status === "live").length, 1)).toFixed(0),
  };

  console.log(`\n=== Scrape Complete (${elapsed}s) ===`);
  console.log(`Live: ${stats.live} | Blocked: ${stats.blocked} | Dead: ${stats.dead} | Timeout: ${stats.timeout} | Error: ${stats.error} | No website: ${stats.no_website}`);
  console.log(`Avg pages/live site: ${stats.avg_pages}`);
  console.log(`Avg text chars/live site: ${stats.avg_text_len}`);

  writeFileSync(OUTPUT_PATH, JSON.stringify(scraped, null, 2));
  console.log(`\nSaved to ${OUTPUT_PATH}`);
}

main().catch(console.error);

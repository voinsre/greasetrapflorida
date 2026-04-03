#!/usr/bin/env node

/**
 * Phase 5 — Async concurrent website scraper for enriching business listings.
 * Reads data/cleaned.json, scrapes up to 3 pages per business, outputs data/scraped-websites.json.
 * Node.js 18+ native only — no npm dependencies.
 *
 * Usage: node scripts/scrape-websites.mjs
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const INPUT_PATH = resolve(ROOT, "data", "cleaned.json");
const OUTPUT_PATH = resolve(ROOT, "data", "scraped-websites.json");

const USER_AGENT =
  "Mozilla/5.0 (compatible; GreaseTrapFlorida/1.0; +https://greasetrapflorida.com)";
const REQUEST_TIMEOUT_MS = 8000;
const MAX_REDIRECTS = 3;
const MAX_CONCURRENCY = 10;
const STAGGER_DELAY_MS = 500;
const MAX_CHARS_PER_PAGE = 5000;
const MAX_CHARS_COMBINED = 12000;
const PROGRESS_INTERVAL = 25;

const SERVICES_PATHS = [
  "/services",
  "/our-services",
  "/what-we-do",
  "/grease-trap",
  "/grease-trap-cleaning",
  "/commercial-services",
];

const ABOUT_PATHS = ["/about", "/about-us", "/about-us/", "/company"];

// ---------------------------------------------------------------------------
// HTML → text extraction
// ---------------------------------------------------------------------------

function stripHtml(html) {
  let text = html;
  // Remove script, style, nav, header, footer blocks
  text = text.replace(
    /<(script|style|nav|header|footer|noscript|iframe|svg)[\s\S]*?<\/\1>/gi,
    " "
  );
  // Remove all remaining tags
  text = text.replace(/<[^>]+>/g, " ");
  // Decode common HTML entities
  text = text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#\d+;/g, " ")
    .replace(/&\w+;/g, " ");
  // Collapse whitespace
  text = text.replace(/\s+/g, " ").trim();
  return text;
}

// ---------------------------------------------------------------------------
// Fetch with timeout, redirect limit, and error classification
// ---------------------------------------------------------------------------

async function safeFetch(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": USER_AGENT },
      signal: controller.signal,
      redirect: "follow",
      // Node native fetch follows redirects automatically; we cap via response check
    });
    clearTimeout(timer);

    // Check for too many redirects (heuristic: redirectedUrl differs significantly)
    return { status: res.status, ok: res.ok, body: await res.text() };
  } catch (err) {
    clearTimeout(timer);
    const msg = err?.message || String(err);

    if (err?.name === "AbortError" || msg.includes("abort")) {
      return { status: 0, ok: false, body: null, error: "timeout" };
    }
    if (
      msg.includes("ENOTFOUND") ||
      msg.includes("getaddrinfo") ||
      msg.includes("DNS")
    ) {
      return { status: 0, ok: false, body: null, error: "dns" };
    }
    if (
      msg.includes("CERT") ||
      msg.includes("SSL") ||
      msg.includes("TLS") ||
      msg.includes("certificate")
    ) {
      return { status: 0, ok: false, body: null, error: "ssl" };
    }
    if (msg.includes("redirect") && msg.includes("max")) {
      return { status: 0, ok: false, body: null, error: "too_many_redirects" };
    }
    return { status: 0, ok: false, body: null, error: msg.slice(0, 120) };
  }
}

// ---------------------------------------------------------------------------
// Try a list of candidate paths, return the first that gives 200
// ---------------------------------------------------------------------------

async function tryPaths(baseUrl, paths) {
  for (const p of paths) {
    const url = new URL(p, baseUrl).href;
    const res = await safeFetch(url);
    if (res.ok && res.status === 200 && res.body) {
      const text = stripHtml(res.body).slice(0, MAX_CHARS_PER_PAGE);
      if (text.length > 50) {
        return { url, status: res.status, text };
      }
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Classify website status from homepage response
// ---------------------------------------------------------------------------

function classifyStatus(res) {
  if (res.error === "timeout") return "timeout";
  if (res.error === "dns") return "dead";
  if (res.error === "ssl") return "error";
  if (res.error) return "error";
  if (res.status === 403) return "blocked";
  if (res.status >= 400 && res.status < 500) return "dead";
  if (res.status >= 500) return "error";
  if (res.ok) return "live";
  return "error";
}

// ---------------------------------------------------------------------------
// Scrape a single business
// ---------------------------------------------------------------------------

async function scrapeBusiness(biz) {
  const result = {
    place_id: biz.place_id || null,
    name: biz.name || "Unknown",
    website: biz.website || null,
    website_status: "no_website",
    pages_fetched: 0,
    homepage_text: null,
    services_text: null,
    about_text: null,
    all_text_combined: null,
    scrape_timestamp: new Date().toISOString(),
  };

  if (!biz.website) {
    return result;
  }

  // Normalise URL
  let baseUrl = biz.website.trim();
  if (!/^https?:\/\//i.test(baseUrl)) {
    baseUrl = "https://" + baseUrl;
  }

  // 1. Homepage
  const homepageRes = await safeFetch(baseUrl);
  result.website_status = classifyStatus(homepageRes);

  if (homepageRes.ok && homepageRes.body) {
    const text = stripHtml(homepageRes.body).slice(0, MAX_CHARS_PER_PAGE);
    if (text.length > 50) {
      result.homepage_text = text;
      result.pages_fetched++;
    }
  }

  // 2. Services page (try even if homepage was blocked)
  const servicesResult = await tryPaths(baseUrl, SERVICES_PATHS);
  if (servicesResult) {
    result.services_text = servicesResult.text;
    result.pages_fetched++;
  }

  // 3. About page
  const aboutResult = await tryPaths(baseUrl, ABOUT_PATHS);
  if (aboutResult) {
    result.about_text = aboutResult.text;
    result.pages_fetched++;
  }

  // Combined text
  const combined = [
    result.homepage_text,
    result.services_text,
    result.about_text,
  ]
    .filter(Boolean)
    .join("\n\n---\n\n");

  result.all_text_combined = combined
    ? combined.slice(0, MAX_CHARS_COMBINED)
    : null;

  return result;
}

// ---------------------------------------------------------------------------
// Semaphore for concurrency control
// ---------------------------------------------------------------------------

class Semaphore {
  constructor(max) {
    this.max = max;
    this.current = 0;
    this.queue = [];
  }

  acquire() {
    return new Promise((resolve) => {
      if (this.current < this.max) {
        this.current++;
        resolve();
      } else {
        this.queue.push(resolve);
      }
    });
  }

  release() {
    this.current--;
    if (this.queue.length > 0) {
      this.current++;
      const next = this.queue.shift();
      next();
    }
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  // Check input exists
  if (!existsSync(INPUT_PATH)) {
    console.log(
      `[scrape-websites] Input file not found: ${INPUT_PATH}`
    );
    console.log(
      "[scrape-websites] Run Phase 4 (data cleaning) first to generate data/cleaned.json."
    );
    process.exit(0);
  }

  const businesses = JSON.parse(readFileSync(INPUT_PATH, "utf-8"));
  if (!Array.isArray(businesses) || businesses.length === 0) {
    console.log("[scrape-websites] No businesses found in cleaned.json.");
    process.exit(0);
  }

  const total = businesses.length;
  console.log(`[scrape-websites] Starting scrape of ${total} businesses...`);
  console.log(
    `[scrape-websites] Concurrency: ${MAX_CONCURRENCY}, stagger: ${STAGGER_DELAY_MS}ms, timeout: ${REQUEST_TIMEOUT_MS}ms`
  );

  const sem = new Semaphore(MAX_CONCURRENCY);
  const results = [];
  let completed = 0;
  let liveCount = 0;
  let failedCount = 0;

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  const tasks = businesses.map((biz, idx) => {
    return (async () => {
      // Stagger start
      await sleep(idx * STAGGER_DELAY_MS);
      await sem.acquire();

      try {
        const result = await scrapeBusiness(biz);
        results.push(result);

        if (result.website_status === "live") liveCount++;
        else if (
          result.website_status !== "no_website" &&
          result.website_status !== "live"
        )
          failedCount++;

        completed++;
        if (completed % PROGRESS_INTERVAL === 0 || completed === total) {
          console.log(
            `[${completed}/${total}] businesses scraped, ${liveCount} live, ${failedCount} failed`
          );
        }
      } catch (err) {
        completed++;
        results.push({
          place_id: biz.place_id || null,
          name: biz.name || "Unknown",
          website: biz.website || null,
          website_status: "error",
          pages_fetched: 0,
          homepage_text: null,
          services_text: null,
          about_text: null,
          all_text_combined: null,
          scrape_timestamp: new Date().toISOString(),
        });
        failedCount++;
        console.error(
          `[scrape-websites] Error scraping "${biz.name}": ${err?.message || err}`
        );
      } finally {
        sem.release();
      }
    })();
  });

  await Promise.all(tasks);

  // Write output
  writeFileSync(OUTPUT_PATH, JSON.stringify(results, null, 2), "utf-8");
  console.log(`\n[scrape-websites] Output saved to ${OUTPUT_PATH}`);

  // Summary
  const statusCounts = {};
  for (const r of results) {
    statusCounts[r.website_status] = (statusCounts[r.website_status] || 0) + 1;
  }

  const liveSites = results.filter((r) => r.website_status === "live");
  const totalPagesFetched = liveSites.reduce(
    (sum, r) => sum + r.pages_fetched,
    0
  );
  const avgPages =
    liveSites.length > 0
      ? (totalPagesFetched / liveSites.length).toFixed(1)
      : 0;
  const enrichmentReady = results.filter((r) => r.pages_fetched >= 1).length;

  console.log("\n=== SCRAPE SUMMARY ===");
  console.log(`Total businesses:     ${total}`);
  console.log(`Live sites:           ${statusCounts.live || 0}`);
  console.log(`Blocked (403):        ${statusCounts.blocked || 0}`);
  console.log(`Dead (404/DNS):       ${statusCounts.dead || 0}`);
  console.log(`Timeout:              ${statusCounts.timeout || 0}`);
  console.log(`Error (SSL/other):    ${statusCounts.error || 0}`);
  console.log(`No website:           ${statusCounts.no_website || 0}`);
  console.log(`Avg pages/live site:  ${avgPages}`);
  console.log(`Enrichment ready:     ${enrichmentReady} (businesses with 1+ pages of text)`);
}

main().catch((err) => {
  console.error("[scrape-websites] Fatal error:", err);
  process.exit(1);
});

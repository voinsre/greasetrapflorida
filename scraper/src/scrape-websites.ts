import {
  USER_AGENTS,
  TARGET_PATHS,
  LINK_KEYWORDS,
  SCRAPE_CONCURRENCY,
  SCRAPE_TIMEOUT_MS,
  SCRAPE_DELAY_MS,
  MAX_CHARS_PER_PAGE,
  MAX_CHARS_PER_BUSINESS,
  MAX_KEYWORD_PAGES,
  MAX_REDIRECTS,
} from "./config.js";
import { cleanText, normalizeUrl, isSameHost, delay } from "./utils.js";
import type { DiscoveredBusiness } from "./discover.js";

// ── Types ────────────────────────────────────────────────────────────────────

export type WebsiteStatus =
  | "live"
  | "blocked"
  | "dead"
  | "timeout"
  | "error"
  | "no_website";

export interface ScrapedBusiness {
  business: DiscoveredBusiness;
  websiteStatus: WebsiteStatus;
  combinedText: string;
  pageTexts: Map<string, string>;
  internalLinks: string[];
}

// ── Fetch with browser headers ───────────────────────────────────────────────

let uaIndex = 0;

function getHeaders(): Record<string, string> {
  const ua = USER_AGENTS[uaIndex % USER_AGENTS.length];
  uaIndex++;
  return {
    "User-Agent": ua,
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
    Referer: "https://www.google.com/",
    DNT: "1",
    Connection: "keep-alive",
    "Upgrade-Insecure-Requests": "1",
  };
}

async function fetchPage(
  url: string,
): Promise<{ html: string; status: WebsiteStatus }> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), SCRAPE_TIMEOUT_MS);

    const res = await fetch(url, {
      headers: getHeaders(),
      signal: controller.signal,
      redirect: "follow",
    });
    clearTimeout(timeout);

    if (res.status === 403 || res.status === 429) {
      return { html: "", status: "blocked" };
    }
    if (res.status === 404 || res.status >= 500) {
      return { html: "", status: "dead" };
    }
    if (!res.ok) {
      return { html: "", status: "error" };
    }

    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html") && !contentType.includes("text/plain")) {
      return { html: "", status: "error" };
    }

    const html = await res.text();
    return { html, status: "live" };
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "AbortError") {
      return { html: "", status: "timeout" };
    }
    return { html: "", status: "error" };
  }
}

// ── Extract internal links from HTML ─────────────────────────────────────────

function extractLinks(html: string, baseUrl: string): string[] {
  const linkRegex = /href="([^"]+)"/gi;
  const links: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = linkRegex.exec(html)) !== null) {
    const normalized = normalizeUrl(baseUrl, match[1]);
    if (normalized && isSameHost(baseUrl, normalized)) {
      links.push(normalized);
    }
  }
  return [...new Set(links)];
}

// ── Try target paths ─────────────────────────────────────────────────────────

async function tryTargetPaths(
  baseUrl: string,
  paths: string[],
): Promise<{ url: string; html: string } | null> {
  for (const path of paths) {
    const url = new URL(path, baseUrl).href;
    const { html, status } = await fetchPage(url);
    if (status === "live" && html.length > 500) {
      return { url, html };
    }
  }
  return null;
}

// ── Scrape a single business ─────────────────────────────────────────────────

async function scrapeSingleBusiness(
  business: DiscoveredBusiness,
): Promise<ScrapedBusiness> {
  if (!business.website) {
    return {
      business,
      websiteStatus: "no_website",
      combinedText: "",
      pageTexts: new Map(),
      internalLinks: [],
    };
  }

  const baseUrl = business.website;
  const pageTexts = new Map<string, string>();
  let totalChars = 0;

  // 1. Fetch homepage
  const { html: homeHtml, status: homeStatus } = await fetchPage(baseUrl);
  if (homeStatus !== "live") {
    return {
      business,
      websiteStatus: homeStatus,
      combinedText: "",
      pageTexts: new Map(),
      internalLinks: [],
    };
  }

  const homeText = cleanText(homeHtml).slice(0, MAX_CHARS_PER_PAGE);
  pageTexts.set(baseUrl, homeText);
  totalChars += homeText.length;

  // Extract all internal links from homepage
  const internalLinks = extractLinks(homeHtml, baseUrl);

  // 2. Fetch target pages
  for (const [, paths] of Object.entries(TARGET_PATHS)) {
    if (totalChars >= MAX_CHARS_PER_BUSINESS) break;
    const result = await tryTargetPaths(baseUrl, paths);
    if (result) {
      const text = cleanText(result.html).slice(
        0,
        Math.min(MAX_CHARS_PER_PAGE, MAX_CHARS_PER_BUSINESS - totalChars),
      );
      pageTexts.set(result.url, text);
      totalChars += text.length;
    }
  }

  // 3. Keyword link discovery
  let keywordPagesFound = 0;
  for (const link of internalLinks) {
    if (keywordPagesFound >= MAX_KEYWORD_PAGES) break;
    if (totalChars >= MAX_CHARS_PER_BUSINESS) break;
    if (pageTexts.has(link)) continue;

    const pathLower = new URL(link).pathname.toLowerCase();
    const hasKeyword = LINK_KEYWORDS.some((kw) => pathLower.includes(kw));
    if (!hasKeyword) continue;

    const { html, status } = await fetchPage(link);
    if (status === "live" && html.length > 500) {
      const text = cleanText(html).slice(
        0,
        Math.min(MAX_CHARS_PER_PAGE, MAX_CHARS_PER_BUSINESS - totalChars),
      );
      pageTexts.set(link, text);
      totalChars += text.length;
      keywordPagesFound++;
    }
  }

  const combinedText = [...pageTexts.values()].join("\n\n");

  return {
    business,
    websiteStatus: "live",
    combinedText,
    pageTexts,
    internalLinks,
  };
}

// ── Main scrape function with concurrency control ────────────────────────────

export async function scrapeBusinessWebsites(
  businesses: DiscoveredBusiness[],
): Promise<ScrapedBusiness[]> {
  const results: ScrapedBusiness[] = [];
  let completed = 0;

  // Process in batches of SCRAPE_CONCURRENCY
  for (let i = 0; i < businesses.length; i += SCRAPE_CONCURRENCY) {
    const batch = businesses.slice(i, i + SCRAPE_CONCURRENCY);
    const batchResults = await Promise.all(
      batch.map(async (biz, idx) => {
        if (idx > 0) await delay(SCRAPE_DELAY_MS * idx);
        return scrapeSingleBusiness(biz);
      }),
    );
    results.push(...batchResults);
    completed += batchResults.length;

    if (completed % 10 === 0 || completed === businesses.length) {
      const statusCounts = results.reduce(
        (acc, r) => {
          acc[r.websiteStatus] = (acc[r.websiteStatus] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );
      console.log(
        `Scraped ${completed}/${businesses.length} | ${JSON.stringify(statusCounts)}`,
      );
    }
  }

  return results;
}

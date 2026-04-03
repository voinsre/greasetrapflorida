/**
 * Phase 3: Apify Google Maps data collection
 * Actor: compass/google-maps-extractor
 * 40 cities x 4 search terms = 160 searches
 * Batched by tier to stay efficient
 */

import { writeFileSync, readFileSync, existsSync } from "fs";
import { join } from "path";

const APIFY_TOKEN = process.env.APIFY_TOKEN;
if (!APIFY_TOKEN) {
  console.error("ERROR: APIFY_TOKEN not set. Load .env.local first.");
  process.exit(1);
}

const DATA_DIR = join(process.cwd(), "data", "raw-apify");

const ACTOR_ID = "compass/google-maps-extractor";

const BASE_CONFIG = {
  maxCrawledPlacesPerSearch: 80,
  language: "en",
  countryCode: "us",
  skipClosedPlaces: true,
  maxQuestions: 0,
  scrapePlaceDetailPage: false,
  scrapeContacts: false,
};

const SEARCH_TEMPLATES = [
  "grease trap cleaning {city} FL",
  "grease trap pumping {city} FL",
  "grease interceptor cleaning {city} FL",
  "FOG service {city} FL",
];

const TIER_1 = [
  "Miami", "Tampa", "Orlando", "Jacksonville", "Fort Lauderdale",
  "St Petersburg", "Hialeah", "Tallahassee", "West Palm Beach", "Sarasota",
];

const TIER_2 = [
  "Fort Myers", "Naples", "Cape Coral", "Clearwater", "Gainesville",
  "Lakeland", "Daytona Beach", "Kissimmee", "Boca Raton", "Pompano Beach",
  "Coral Springs", "Hollywood", "Pembroke Pines", "Port St Lucie",
];

const TIER_3 = [
  "Ocala", "Pensacola", "Palm Bay", "Melbourne", "Deltona",
  "Bradenton", "Panama City", "Key West", "Stuart", "Vero Beach",
  "Bonita Springs", "Winter Haven", "Sanford", "Apopka", "Deland", "Leesburg",
];

function buildSearchTerms(cities) {
  const terms = [];
  for (const city of cities) {
    for (const template of SEARCH_TEMPLATES) {
      terms.push(template.replace("{city}", city));
    }
  }
  return terms;
}

async function apiCall(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${APIFY_TOKEN}`,
      ...options.headers,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Apify API error ${res.status}: ${text}`);
  }
  return res.json();
}

async function startActorRun(searchTerms, batchName) {
  console.log(`\n--- Starting ${batchName}: ${searchTerms.length} search terms ---`);

  const input = {
    ...BASE_CONFIG,
    searchStringsArray: searchTerms,
  };

  const data = await apiCall(
    `https://api.apify.com/v2/acts/${encodeURIComponent(ACTOR_ID)}/runs?waitForFinish=0`,
    {
      method: "POST",
      body: JSON.stringify(input),
    }
  );

  console.log(`Run started: ${data.data.id} (status: ${data.data.status})`);
  return data.data;
}

async function waitForRun(runId, batchName) {
  const POLL_INTERVAL = 15_000; // 15 seconds
  const MAX_WAIT = 30 * 60_000; // 30 minutes
  const startTime = Date.now();

  while (Date.now() - startTime < MAX_WAIT) {
    const data = await apiCall(`https://api.apify.com/v2/actor-runs/${runId}`);
    const status = data.data.status;
    const elapsed = Math.round((Date.now() - startTime) / 1000);

    if (status === "SUCCEEDED") {
      console.log(`  ${batchName} SUCCEEDED after ${elapsed}s`);
      return data.data;
    }
    if (status === "FAILED" || status === "ABORTED" || status === "TIMED-OUT") {
      console.error(`  ${batchName} ${status} after ${elapsed}s`);
      return data.data;
    }

    process.stdout.write(`  [${elapsed}s] ${batchName}: ${status}...\r`);
    await new Promise((r) => setTimeout(r, POLL_INTERVAL));
  }

  console.error(`  ${batchName} TIMED OUT after 30 minutes`);
  return null;
}

async function downloadResults(runId, batchName) {
  console.log(`  Downloading results for ${batchName}...`);

  // Get dataset items
  const data = await apiCall(
    `https://api.apify.com/v2/actor-runs/${runId}/dataset/items?format=json&clean=true`
  );

  const items = Array.isArray(data) ? data : data.items || [];
  console.log(`  Got ${items.length} records for ${batchName}`);

  return items;
}

async function runTier(tierName, cities) {
  const searchTerms = buildSearchTerms(cities);
  console.log(`\n========== ${tierName}: ${cities.length} cities, ${searchTerms.length} search terms ==========`);

  // Split into batches of ~40 search terms to avoid overloading a single run
  const BATCH_SIZE = 40;
  const batches = [];
  for (let i = 0; i < searchTerms.length; i += BATCH_SIZE) {
    batches.push(searchTerms.slice(i, i + BATCH_SIZE));
  }

  const allResults = [];
  const errors = [];

  for (let i = 0; i < batches.length; i++) {
    const batchName = `${tierName}-batch${i + 1}`;
    const batch = batches[i];

    try {
      const run = await startActorRun(batch, batchName);
      const completedRun = await waitForRun(run.id, batchName);

      if (completedRun && completedRun.status === "SUCCEEDED") {
        const items = await downloadResults(completedRun.id, batchName);

        // Save individual batch file
        const fileName = `raw-${tierName.toLowerCase().replace(/\s/g, "")}-batch${i + 1}.json`;
        writeFileSync(
          join(DATA_DIR, fileName),
          JSON.stringify(items, null, 2)
        );
        console.log(`  Saved ${fileName} (${items.length} records)`);

        allResults.push(...items);
      } else {
        const status = completedRun ? completedRun.status : "UNKNOWN";
        errors.push({ batch: batchName, status, terms: batch.length });
        console.error(`  FAILED: ${batchName} (${status})`);
      }
    } catch (err) {
      errors.push({ batch: batchName, error: err.message, terms: batch.length });
      console.error(`  ERROR in ${batchName}: ${err.message}`);
    }
  }

  return { results: allResults, errors };
}

async function main() {
  console.log("Phase 3: Apify Google Maps Data Collection");
  console.log("==========================================");
  console.log(`Actor: ${ACTOR_ID}`);
  console.log(`Total cities: ${TIER_1.length + TIER_2.length + TIER_3.length}`);
  console.log(`Total search terms: ${(TIER_1.length + TIER_2.length + TIER_3.length) * 4}`);
  console.log(`Output dir: ${DATA_DIR}`);
  console.log();

  const allResults = [];
  const allErrors = [];
  const stats = {};

  // Run tiers sequentially to manage API usage
  for (const [tierName, cities] of [
    ["tier1", TIER_1],
    ["tier2", TIER_2],
    ["tier3", TIER_3],
  ]) {
    const { results, errors } = await runTier(tierName, cities);
    allResults.push(...results);
    allErrors.push(...errors);
    stats[tierName] = { records: results.length, errors: errors.length };
    console.log(`\n${tierName} complete: ${results.length} records, ${errors.length} errors`);
  }

  // Save merged file
  const mergedPath = join(DATA_DIR, "all-raw.json");
  writeFileSync(mergedPath, JSON.stringify(allResults, null, 2));
  console.log(`\n========== FINAL REPORT ==========`);
  console.log(`Total raw records: ${allResults.length}`);
  console.log(`Saved to: ${mergedPath}`);
  console.log(`Errors: ${allErrors.length}`);
  if (allErrors.length > 0) {
    console.log("Failed batches:");
    for (const err of allErrors) {
      console.log(`  - ${err.batch}: ${err.status || err.error} (${err.terms} terms)`);
    }
  }
  console.log(`\nPer-tier breakdown:`);
  for (const [tier, s] of Object.entries(stats)) {
    console.log(`  ${tier}: ${s.records} records, ${s.errors} errors`);
  }

  // Save stats for later reference
  const statsObj = {
    timestamp: new Date().toISOString(),
    totalRecords: allResults.length,
    totalErrors: allErrors.length,
    tiers: stats,
    errors: allErrors,
  };
  writeFileSync(
    join(DATA_DIR, "collection-stats.json"),
    JSON.stringify(statsObj, null, 2)
  );
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});

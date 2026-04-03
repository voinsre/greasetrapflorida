/**
 * Phase 3: Apify Google Maps data collection — PARALLEL version
 * Launches all actor runs simultaneously, then polls for completion.
 *
 * Usage:
 *   node scripts/collect-apify-parallel.mjs launch    — start all runs
 *   node scripts/collect-apify-parallel.mjs poll       — check status & download completed
 *   node scripts/collect-apify-parallel.mjs merge      — merge all downloaded files
 */

import { writeFileSync, readFileSync, existsSync, readdirSync } from "fs";
import { join } from "path";

const APIFY_TOKEN = process.env.APIFY_TOKEN;
if (!APIFY_TOKEN) {
  console.error("ERROR: APIFY_TOKEN not set.");
  process.exit(1);
}

const DATA_DIR = join(process.cwd(), "data", "raw-apify");
const RUNS_FILE = join(DATA_DIR, "active-runs.json");
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

const TIER_1 = ["Miami", "Tampa", "Orlando", "Jacksonville", "Fort Lauderdale", "St Petersburg", "Hialeah", "Tallahassee", "West Palm Beach", "Sarasota"];
const TIER_2 = ["Fort Myers", "Naples", "Cape Coral", "Clearwater", "Gainesville", "Lakeland", "Daytona Beach", "Kissimmee", "Boca Raton", "Pompano Beach", "Coral Springs", "Hollywood", "Pembroke Pines", "Port St Lucie"];
const TIER_3 = ["Ocala", "Pensacola", "Palm Bay", "Melbourne", "Deltona", "Bradenton", "Panama City", "Key West", "Stuart", "Vero Beach", "Bonita Springs", "Winter Haven", "Sanford", "Apopka", "Deland", "Leesburg"];

function buildSearchTerms(cities) {
  const terms = [];
  for (const city of cities) {
    for (const t of SEARCH_TEMPLATES) terms.push(t.replace("{city}", city));
  }
  return terms;
}

async function apiCall(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${APIFY_TOKEN}`, ...options.headers },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Apify API ${res.status}: ${text}`);
  }
  return res.json();
}

// ============ LAUNCH ============
async function launch() {
  // Check if we already have an active tier1 run from the original script
  const existingRuns = [];

  // Build batches: split each tier into chunks of 40 terms
  const allBatches = [];
  for (const [tier, cities] of [["tier1", TIER_1], ["tier2", TIER_2], ["tier3", TIER_3]]) {
    const terms = buildSearchTerms(cities);
    const BATCH_SIZE = 40;
    for (let i = 0; i < terms.length; i += BATCH_SIZE) {
      const batch = terms.slice(i, i + BATCH_SIZE);
      const batchNum = Math.floor(i / BATCH_SIZE) + 1;
      allBatches.push({ name: `${tier}-batch${batchNum}`, terms: batch });
    }
  }

  console.log(`Launching ${allBatches.length} parallel actor runs...`);

  // Check if tier1-batch1 is already running from previous script
  let runs = [];
  if (existsSync(RUNS_FILE)) {
    runs = JSON.parse(readFileSync(RUNS_FILE, "utf-8"));
    console.log(`Found ${runs.length} existing runs in active-runs.json`);
    const existingNames = new Set(runs.map(r => r.name));
    // Only launch batches not already started
    const toLaunch = allBatches.filter(b => !existingNames.has(b.name));
    if (toLaunch.length === 0) {
      console.log("All batches already launched. Use 'poll' to check status.");
      return;
    }
    console.log(`${toLaunch.length} batches still need launching...`);
    for (const batch of toLaunch) {
      await launchBatch(batch, runs);
    }
  } else {
    // Launch all
    for (const batch of allBatches) {
      await launchBatch(batch, runs);
    }
  }

  writeFileSync(RUNS_FILE, JSON.stringify(runs, null, 2));
  console.log(`\nAll ${runs.length} runs launched. Saved to active-runs.json`);
  console.log("Run 'node scripts/collect-apify-parallel.mjs poll' to check status.");
}

async function launchBatch(batch, runs) {
  try {
    const input = { ...BASE_CONFIG, searchStringsArray: batch.terms };
    const data = await apiCall(
      `https://api.apify.com/v2/acts/${encodeURIComponent(ACTOR_ID)}/runs?waitForFinish=0`,
      { method: "POST", body: JSON.stringify(input) }
    );
    const run = data.data;
    runs.push({ name: batch.name, runId: run.id, status: run.status, terms: batch.terms.length, downloaded: false });
    console.log(`  Started ${batch.name}: runId=${run.id} (${batch.terms.length} terms)`);
  } catch (err) {
    console.error(`  FAILED to start ${batch.name}: ${err.message}`);
    runs.push({ name: batch.name, runId: null, status: "LAUNCH_FAILED", terms: batch.terms.length, downloaded: false, error: err.message });
  }
}

// ============ POLL ============
async function poll() {
  if (!existsSync(RUNS_FILE)) {
    console.error("No active-runs.json found. Run 'launch' first.");
    process.exit(1);
  }

  const runs = JSON.parse(readFileSync(RUNS_FILE, "utf-8"));
  let allDone = true;
  let totalRecords = 0;

  for (const run of runs) {
    if (!run.runId || run.downloaded) {
      if (run.downloaded) {
        const file = join(DATA_DIR, `raw-${run.name}.json`);
        if (existsSync(file)) {
          const data = JSON.parse(readFileSync(file, "utf-8"));
          totalRecords += data.length;
        }
      }
      continue;
    }

    try {
      const data = await apiCall(`https://api.apify.com/v2/actor-runs/${run.runId}`);
      run.status = data.data.status;

      if (data.data.status === "SUCCEEDED" && !run.downloaded) {
        // Download results
        const items = await apiCall(
          `https://api.apify.com/v2/actor-runs/${run.runId}/dataset/items?format=json&clean=true`
        );
        const records = Array.isArray(items) ? items : items.items || [];
        run.records = records.length;
        totalRecords += records.length;

        const fileName = `raw-${run.name}.json`;
        writeFileSync(join(DATA_DIR, fileName), JSON.stringify(records, null, 2));
        run.downloaded = true;
        console.log(`  ✓ ${run.name}: ${records.length} records downloaded`);
      } else if (["FAILED", "ABORTED", "TIMED-OUT"].includes(data.data.status)) {
        console.log(`  ✗ ${run.name}: ${data.data.status}`);
        run.downloaded = true; // Mark as done (failed)
        run.records = 0;
      } else {
        allDone = false;
        console.log(`  ⧖ ${run.name}: ${data.data.status}`);
      }
    } catch (err) {
      console.error(`  ? ${run.name}: ${err.message}`);
      allDone = false;
    }
  }

  writeFileSync(RUNS_FILE, JSON.stringify(runs, null, 2));

  console.log(`\n--- Summary ---`);
  const succeeded = runs.filter(r => r.status === "SUCCEEDED").length;
  const running = runs.filter(r => ["RUNNING", "READY"].includes(r.status)).length;
  const failed = runs.filter(r => ["FAILED", "ABORTED", "TIMED-OUT", "LAUNCH_FAILED"].includes(r.status)).length;
  console.log(`Succeeded: ${succeeded}/${runs.length}  |  Running: ${running}  |  Failed: ${failed}`);
  console.log(`Total records so far: ${totalRecords}`);
  console.log(allDone ? "\nAll runs complete! Run 'merge' to combine." : "\nSome runs still in progress. Poll again later.");

  return allDone;
}

// ============ MERGE ============
async function merge() {
  const files = readdirSync(DATA_DIR).filter(f => f.startsWith("raw-tier") && f.endsWith(".json"));
  console.log(`Found ${files.length} raw batch files to merge`);

  const allRecords = [];
  for (const f of files) {
    const data = JSON.parse(readFileSync(join(DATA_DIR, f), "utf-8"));
    console.log(`  ${f}: ${data.length} records`);
    allRecords.push(...data);
  }

  const mergedPath = join(DATA_DIR, "all-raw.json");
  writeFileSync(mergedPath, JSON.stringify(allRecords, null, 2));
  console.log(`\nMerged ${allRecords.length} total records → all-raw.json`);

  // Save stats
  writeFileSync(
    join(DATA_DIR, "collection-stats.json"),
    JSON.stringify({
      timestamp: new Date().toISOString(),
      totalRecords: allRecords.length,
      batchFiles: files.length,
      perFile: Object.fromEntries(files.map(f => {
        const d = JSON.parse(readFileSync(join(DATA_DIR, f), "utf-8"));
        return [f, d.length];
      })),
    }, null, 2)
  );

  return allRecords.length;
}

// ============ MAIN ============
const cmd = process.argv[2] || "launch";
if (cmd === "launch") await launch();
else if (cmd === "poll") await poll();
else if (cmd === "merge") await merge();
else console.error(`Unknown command: ${cmd}. Use launch|poll|merge`);

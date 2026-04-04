import { createClient } from "@supabase/supabase-js";
import { CITIES, SEARCH_TEMPLATES } from "./config.js";
import { discoverBusinesses } from "./discover.js";
import { scrapeBusinessWebsites } from "./scrape-websites.js";
import { verifyBusiness } from "./verify.js";
import { enrichBusiness } from "./enrich.js";
import { loadResults } from "./load.js";
import { updateExistingListings } from "./update-existing.js";
import { sendNotification, sendErrorNotification, type NotificationReport } from "./notify.js";
import { triggerRebuild } from "./rebuild.js";

// ── Helpers ──────────────────────────────────────────────────────────────────

async function getDirectoryStats(): Promise<{
  total: number;
  counties: number;
  cities: number;
  verified: number;
}> {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const [bizRes, countyRes, cityRes, verifiedRes] = await Promise.all([
    supabase.from("businesses").select("id", { count: "exact", head: true }),
    supabase.from("counties").select("slug", { count: "exact", head: true }).gt("business_count", 0),
    supabase.from("cities").select("slug", { count: "exact", head: true }).gte("business_count", 2),
    supabase.from("businesses").select("id", { count: "exact", head: true }).eq("is_verified", true),
  ]);

  return {
    total: bizRes.count ?? 0,
    counties: countyRes.count ?? 0,
    cities: cityRes.count ?? 0,
    verified: verifiedRes.count ?? 0,
  };
}

// ── Expansion / Weekly mode ──────────────────────────────────────────────────

async function runExpansionOrWeekly(
  mode: "expansion" | "weekly",
  dryRun: boolean,
): Promise<NotificationReport> {
  const startTime = new Date();

  // 1. Discover
  console.log(`\n=== DISCOVERY ===`);
  const discovery = await discoverBusinesses(CITIES, SEARCH_TEMPLATES);

  // For weekly mode, only process new businesses
  const toScrape =
    mode === "weekly"
      ? discovery.newQueue
      : discovery.newQueue;

  console.log(`\n=== SCRAPING ${toScrape.length} websites ===`);
  const scraped = await scrapeBusinessWebsites(toScrape);

  // 3. Verify
  console.log(`\n=== VERIFYING ===`);
  const verified: Array<{
    business: (typeof toScrape)[0];
    scraped: (typeof scraped)[0];
    result: ReturnType<typeof verifyBusiness>;
  }> = [];
  const rejectionReasons: Record<string, number> = {};

  for (let i = 0; i < scraped.length; i++) {
    const biz = toScrape[i];
    const scrapedBiz = scraped[i];
    const result = verifyBusiness(biz, scrapedBiz);

    if (result.accepted) {
      verified.push({ business: biz, scraped: scrapedBiz, result });
    } else {
      for (const reason of result.reasons) {
        rejectionReasons[reason] = (rejectionReasons[reason] || 0) + 1;
      }
    }
  }

  console.log(
    `Verified: ${verified.length} accepted, ${scraped.length - verified.length} rejected`,
  );

  // 4. Enrich
  console.log(`\n=== ENRICHING ${verified.length} businesses ===`);
  const enriched = verified.map((v) =>
    enrichBusiness(v.business, v.scraped, v.result),
  );

  // 5. Load
  console.log(`\n=== LOADING ===`);
  const loadReport = await loadResults(
    enriched,
    discovery.updateQueue,
    discovery.closeQueue,
    dryRun,
  );

  // 6. Stats
  const stats = await getDirectoryStats();
  const endTime = new Date();

  // 7. Rebuild
  const hasChanges = loadReport.inserted > 0 || loadReport.deleted > 0;
  const rebuildTriggered = hasChanges ? await triggerRebuild(dryRun) : false;

  // 8. Build notification report
  const notifReport: NotificationReport = {
    mode,
    dryRun,
    startTime,
    endTime,
    newDiscovered: discovery.newQueue.length,
    newAdded: loadReport.inserted,
    newAddedNames: loadReport.insertedNames,
    rejected: scraped.length - verified.length,
    rejectionSummary: rejectionReasons,
    existingUpdated: loadReport.updated,
    closedRemoved: loadReport.deleted,
    totalDirectory: stats.total,
    totalCounties: stats.counties,
    totalCities: stats.cities,
    totalVerified: stats.verified,
    apiCalls: discovery.apiCalls,
    errors: loadReport.errors,
    rebuildTriggered,
  };

  return notifReport;
}

// ── Monthly mode ─────────────────────────────────────────────────────────────

async function runMonthly(dryRun: boolean): Promise<NotificationReport> {
  const startTime = new Date();

  console.log(`\n=== MONTHLY UPDATE ===`);
  const updateReport = await updateExistingListings();

  const stats = await getDirectoryStats();
  const endTime = new Date();

  const hasChanges = updateReport.updated > 0 || updateReport.deleted > 0;
  const rebuildTriggered = hasChanges ? await triggerRebuild(dryRun) : false;

  const notifReport: NotificationReport = {
    mode: "monthly",
    dryRun,
    startTime,
    endTime,
    newDiscovered: 0,
    newAdded: 0,
    newAddedNames: [],
    rejected: 0,
    rejectionSummary: {},
    existingUpdated: updateReport.updated,
    closedRemoved: updateReport.deleted,
    totalDirectory: stats.total,
    totalCounties: stats.counties,
    totalCities: stats.cities,
    totalVerified: stats.verified,
    apiCalls: updateReport.apiCalls,
    errors: updateReport.errors,
    rebuildTriggered,
  };

  return notifReport;
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const mode = (process.env.MODE ?? "weekly") as
    | "expansion"
    | "weekly"
    | "monthly";
  const dryRun = process.env.DRY_RUN === "true";

  console.log(
    `Starting ${mode} run at ${new Date().toISOString()}. Dry run: ${dryRun}`,
  );

  let report: NotificationReport;

  switch (mode) {
    case "expansion":
    case "weekly":
      report = await runExpansionOrWeekly(mode, dryRun);
      break;
    case "monthly":
      report = await runMonthly(dryRun);
      break;
    default:
      throw new Error(`Unknown mode: ${mode}`);
  }

  // Send notification
  await sendNotification(report, mode, dryRun);

  console.log(`\n${mode} run complete.`);
}

// ── Entry point ──────────────────────────────────────────────────────────────

main().catch(async (err: Error) => {
  console.error("Fatal error:", err);
  const mode = process.env.MODE ?? "weekly";
  await sendErrorNotification(err, mode);
  process.exit(1);
});

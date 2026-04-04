import { BLACKLIST_KEYWORDS, SKIP_GOOGLE_TYPES } from "./config.js";
import type { DiscoveredBusiness } from "./discover.js";

// ── Types ────────────────────────────────────────────────────────────────────

export interface PreFilterResult {
  passed: DiscoveredBusiness[];
  rejected: DiscoveredBusiness[];
  passedCount: number;
  rejectedCount: number;
}

// ── Pre-filter logic ────────────────────────────────────────────────────────

/** Non-service Google types — businesses that are clearly not service providers */
const NON_SERVICE_TYPES: string[] = [
  ...SKIP_GOOGLE_TYPES,
  // No need to duplicate; SKIP_GOOGLE_TYPES already has restaurant, store, etc.
];

/** Grease-related name keywords that justify sending to scraper */
const GREASE_NAME_KEYWORDS = ["grease", "trap", "interceptor", "fog"];

/**
 * Fast name-based pre-filter to avoid scraping thousands of irrelevant websites.
 * Runs AFTER discovery and BEFORE website scraping.
 *
 * A business passes if it is NOT blacklisted AND has at least one signal
 * suggesting it could be a grease trap service provider.
 */
export function preFilterBusinesses(
  businesses: DiscoveredBusiness[],
): PreFilterResult {
  const passed: DiscoveredBusiness[] = [];
  const rejected: DiscoveredBusiness[] = [];

  for (const biz of businesses) {
    const nameLower = biz.name.toLowerCase();

    // CHECK 1: Blacklist — reject immediately
    const blacklisted = BLACKLIST_KEYWORDS.some((kw) => nameLower.includes(kw));
    if (blacklisted) {
      rejected.push(biz);
      continue;
    }

    // CHECK 2: Non-service Google types with no service type
    const hasNonServiceType = biz.types.some((t) => NON_SERVICE_TYPES.includes(t));
    const hasServiceType = biz.types.some((t) =>
      ["plumber", "waste_management", "general_contractor"].includes(t),
    );
    if (hasNonServiceType && !hasServiceType) {
      rejected.push(biz);
      continue;
    }

    // CHECK 3: Must have at least ONE of these signals to proceed to scraping
    const hasGreaseKeyword = GREASE_NAME_KEYWORDS.some((kw) => nameLower.includes(kw));
    const hasSeptic = nameLower.includes("septic");
    const hasHoodWithContext =
      nameLower.includes("hood") &&
      (nameLower.includes("cleaning") || nameLower.includes("exhaust") || nameLower.includes("kitchen"));
    const hasPlumberCommercial =
      biz.types.includes("plumber") &&
      (nameLower.includes("commercial") || nameLower.includes("restaurant") || nameLower.includes("kitchen"));
    const hasDrainCommercial =
      nameLower.includes("drain") &&
      (nameLower.includes("commercial") || nameLower.includes("restaurant") || nameLower.includes("kitchen"));
    const hasWaste = nameLower.includes("waste");
    const hasPlumbing = nameLower.includes("plumbing") || nameLower.includes("plumber");

    if (
      hasGreaseKeyword ||
      hasSeptic ||
      hasHoodWithContext ||
      hasPlumberCommercial ||
      hasDrainCommercial ||
      hasWaste ||
      hasPlumbing
    ) {
      passed.push(biz);
    } else {
      rejected.push(biz);
    }
  }

  console.log(
    `Pre-filter: ${passed.length} of ${businesses.length} passed to scraping queue, ${rejected.length} rejected by name/blacklist`,
  );

  return {
    passed,
    rejected,
    passedCount: passed.length,
    rejectedCount: rejected.length,
  };
}

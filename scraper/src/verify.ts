import { GREASE_KEYWORDS, BLACKLIST_KEYWORDS, SKIP_GOOGLE_TYPES, SERVICE_GOOGLE_TYPES } from "./config.js";
import type { DiscoveredBusiness } from "./discover.js";
import type { ScrapedBusiness } from "./scrape-websites.js";

// ── Types ────────────────────────────────────────────────────────────────────

export interface VerificationResult {
  accepted: boolean;
  score: number;
  tier: "confirmed" | "plausible" | "rejected";
  reasons: string[];
}

// ── Main verification function ───────────────────────────────────────────────

export function verifyBusiness(
  business: DiscoveredBusiness,
  scraped: ScrapedBusiness,
): VerificationResult {
  const reasons: string[] = [];
  const nameLower = business.name.toLowerCase();
  const textLower = scraped.combinedText.toLowerCase();

  // STEP 1 — Name blacklist
  for (const kw of BLACKLIST_KEYWORDS) {
    if (nameLower.includes(kw)) {
      return {
        accepted: false,
        score: 0,
        tier: "rejected",
        reasons: [`blacklisted name keyword: "${kw}"`],
      };
    }
  }

  // STEP 2 — Score grease evidence
  let score = 0;

  // +3: "grease" or "trap" or "interceptor" in business name
  if (
    nameLower.includes("grease") ||
    nameLower.includes("trap") ||
    nameLower.includes("interceptor")
  ) {
    score += 3;
    reasons.push("grease/trap/interceptor in name (+3)");
  }

  // Count grease keywords in website text
  const keywordsFound = GREASE_KEYWORDS.filter((kw) =>
    textLower.includes(kw.toLowerCase()),
  );
  if (keywordsFound.length >= 2) {
    score += 2;
    reasons.push(`${keywordsFound.length} grease keywords in website (+2)`);
  } else if (keywordsFound.length === 1) {
    score += 1;
    reasons.push(`1 grease keyword in website (+1)`);
  }

  // +1: Google types includes plumber/waste_management/similar
  if (business.types.some((t) => SERVICE_GOOGLE_TYPES.includes(t))) {
    score += 1;
    reasons.push("service Google type (+1)");
  }

  // +1: name contains septic/waste/environmental/hauling/hood
  const bonusNameWords = ["septic", "waste", "environmental", "hauling", "hood"];
  if (bonusNameWords.some((w) => nameLower.includes(w))) {
    score += 1;
    reasons.push("related industry name keyword (+1)");
  }

  // STEP 3 — Additional rejections
  const types = business.types;
  const hasSkipType = types.some((t) => SKIP_GOOGLE_TYPES.includes(t));
  const hasServiceType = types.some((t) => SERVICE_GOOGLE_TYPES.includes(t));
  if (hasSkipType && !hasServiceType) {
    return {
      accepted: false,
      score,
      tier: "rejected",
      reasons: [...reasons, "predominantly non-service Google type"],
    };
  }

  if (
    business.rating !== null &&
    business.rating < 2.0 &&
    business.reviewCount >= 5
  ) {
    return {
      accepted: false,
      score,
      tier: "rejected",
      reasons: [...reasons, `low rating: ${business.rating} with ${business.reviewCount} reviews`],
    };
  }

  if (
    business.businessStatus === "CLOSED_PERMANENTLY" ||
    business.businessStatus === "CLOSED_TEMPORARILY"
  ) {
    return {
      accepted: false,
      score,
      tier: "rejected",
      reasons: [...reasons, `business status: ${business.businessStatus}`],
    };
  }

  // STEP 3 — Decision based on score
  if (score >= 3) {
    return { accepted: true, score, tier: "confirmed", reasons };
  }
  if (score >= 1) {
    return { accepted: true, score, tier: "plausible", reasons };
  }

  return {
    accepted: false,
    score: 0,
    tier: "rejected",
    reasons: [...reasons, "no grease evidence"],
  };
}

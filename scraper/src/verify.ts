import { GREASE_KEYWORDS, BLACKLIST_KEYWORDS, SKIP_GOOGLE_TYPES, SERVICE_GOOGLE_TYPES } from "./config.js";
import type { DiscoveredBusiness } from "./discover.js";
import type { ScrapedBusiness } from "./scrape-websites.js";

// ── Types ────────────────────────────────────────────────────────────────────

export interface VerificationResult {
  accepted: boolean;
  score: number;
  tier: "confirmed" | "rejected";
  reasons: string[];
}

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Check if a word appears as a standalone word (not part of another word) */
function hasStandaloneWord(text: string, word: string): boolean {
  const re = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
  return re.test(text);
}

/** Count how many DISTINCT grease keywords appear in text */
function countDistinctGreaseKeywords(text: string): { count: number; found: string[] } {
  const found = GREASE_KEYWORDS.filter((kw) => text.includes(kw.toLowerCase()));
  return { count: found.length, found };
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

  // STEP 2 — Additional hard rejections
  const types = business.types;
  const hasSkipType = types.some((t) => SKIP_GOOGLE_TYPES.includes(t));
  const hasServiceType = types.some((t) => SERVICE_GOOGLE_TYPES.includes(t));
  if (hasSkipType && !hasServiceType) {
    return {
      accepted: false,
      score: 0,
      tier: "rejected",
      reasons: ["predominantly non-service Google type"],
    };
  }

  if (
    business.rating !== null &&
    business.rating < 2.0 &&
    business.reviewCount >= 5
  ) {
    return {
      accepted: false,
      score: 0,
      tier: "rejected",
      reasons: [`low rating: ${business.rating} with ${business.reviewCount} reviews`],
    };
  }

  if (
    business.businessStatus === "CLOSED_PERMANENTLY" ||
    business.businessStatus === "CLOSED_TEMPORARILY"
  ) {
    return {
      accepted: false,
      score: 0,
      tier: "rejected",
      reasons: [`business status: ${business.businessStatus}`],
    };
  }

  // STEP 3 — Score grease evidence
  let score = 0;

  const greaseKeywordsInText = countDistinctGreaseKeywords(textLower);

  // +3: business name contains the PHRASE "grease trap" OR "grease interceptor" OR "fog service" OR "fog compliance"
  const greaseNamePhrases = ["grease trap", "grease interceptor", "fog service", "fog compliance"];
  if (greaseNamePhrases.some((phrase) => nameLower.includes(phrase))) {
    score += 3;
    reasons.push("grease phrase in name (+3)");
  }

  // +2: business name contains "grease" as a standalone word
  if (score < 3 && hasStandaloneWord(nameLower, "grease")) {
    score += 2;
    reasons.push("standalone 'grease' in name (+2)");
  }

  // +2: website text contains 3+ DIFFERENT grease keywords
  if (greaseKeywordsInText.count >= 3) {
    score += 2;
    reasons.push(`${greaseKeywordsInText.count} distinct grease keywords in website (+2)`);
  }
  // +1: website text contains 1-2 grease keywords AND name contains "septic" OR "plumbing" OR "drain"
  else if (
    greaseKeywordsInText.count >= 1 &&
    (nameLower.includes("septic") || nameLower.includes("plumbing") || nameLower.includes("drain"))
  ) {
    score += 1;
    reasons.push(`${greaseKeywordsInText.count} grease keyword(s) + septic/plumbing/drain name (+1)`);
  }

  // +1: name contains "septic" AND website text has at least 1 grease keyword
  if (nameLower.includes("septic") && greaseKeywordsInText.count >= 1) {
    // Avoid double-counting with the rule above — only add if not already counted
    const alreadyCounted = greaseKeywordsInText.count >= 1 &&
      greaseKeywordsInText.count < 3 &&
      (nameLower.includes("septic") || nameLower.includes("plumbing") || nameLower.includes("drain"));
    if (!alreadyCounted) {
      score += 1;
      reasons.push("septic name + grease keyword in website (+1)");
    }
  }

  // STEP 4 — Hood cleaning rule
  if (nameLower.includes("hood")) {
    if (nameLower.includes("grease") || nameLower.includes("trap")) {
      // Accept — has grease/trap in name alongside hood
      reasons.push("hood + grease/trap in name (accepted)");
    } else if (greaseKeywordsInText.count >= 3) {
      // Exception: website has 3+ grease keywords
      reasons.push("hood name but 3+ grease keywords on website (accepted)");
    } else {
      return {
        accepted: false,
        score,
        tier: "rejected",
        reasons: [...reasons, "hood in name without grease/trap evidence"],
      };
    }
  }

  // STEP 5 — Environmental company rule
  if (nameLower.includes("environmental")) {
    const hasGreaseInName = nameLower.includes("grease") || nameLower.includes("trap") ||
      nameLower.includes("septic") || nameLower.includes("grease waste");
    if (!hasGreaseInName && greaseKeywordsInText.count < 3) {
      return {
        accepted: false,
        score,
        tier: "rejected",
        reasons: [...reasons, "environmental name without grease/septic evidence"],
      };
    }
  }

  // STEP 6 — Septic company rule
  if (nameLower.includes("septic")) {
    const hasGreaseInName = nameLower.includes("grease") || nameLower.includes("trap");
    if (!hasGreaseInName && greaseKeywordsInText.count < 2) {
      return {
        accepted: false,
        score,
        tier: "rejected",
        reasons: [...reasons, "septic name without grease evidence (name or 2+ website keywords)"],
      };
    }
  }

  // STEP 7 — Final decision: must score 3+ to pass
  if (score >= 3) {
    return { accepted: true, score, tier: "confirmed", reasons };
  }

  return {
    accepted: false,
    score,
    tier: "rejected",
    reasons: [...reasons, `score ${score} < 3 required minimum`],
  };
}

import { SERVICE_TYPE_MAP, DESCRIPTION_MAX_CHARS } from "./config.js";
import type { DiscoveredBusiness } from "./discover.js";
import type { ScrapedBusiness } from "./scrape-websites.js";
import type { VerificationResult } from "./verify.js";
import {
  lookupCounty,
  extractEmails,
  extractPricingSignals,
  extractYearsInBusiness,
} from "./utils.js";

// ── Types ────────────────────────────────────────────────────────────────────

export interface EnrichedBusiness {
  // Core fields from discovery
  placeId: string;
  shortPlaceId: string;
  name: string;
  address: string;
  phone: string | null;
  website: string | null;
  rating: number | null;
  reviewCount: number;
  lat: number | null;
  lng: number | null;
  businessStatus: string | null;
  types: string[];
  openingHours: DiscoveredBusiness["openingHours"];
  // Enriched fields
  description: string;
  city: string;
  countySlug: string | null;
  services: string[];
  emergency24_7: boolean;
  email: string | null;
  serviceAreas: string[];
  pricingSignals: string | null;
  yearsInBusiness: number | null;
  websiteStatus: string;
  isVerified: boolean;
  verificationTier: string;
}

// ── Florida counties for matching ────────────────────────────────────────────

const FL_COUNTIES = [
  "Alachua", "Baker", "Bay", "Bradford", "Brevard", "Broward", "Calhoun",
  "Charlotte", "Citrus", "Clay", "Collier", "Columbia", "DeSoto", "Dixie",
  "Duval", "Escambia", "Flagler", "Franklin", "Gadsden", "Gilchrist",
  "Glades", "Gulf", "Hamilton", "Hardee", "Hendry", "Hernando", "Highlands",
  "Hillsborough", "Holmes", "Indian River", "Jackson", "Jefferson",
  "Lafayette", "Lake", "Lee", "Leon", "Levy", "Liberty", "Madison",
  "Manatee", "Marion", "Martin", "Miami-Dade", "Monroe", "Nassau",
  "Okaloosa", "Okeechobee", "Orange", "Osceola", "Palm Beach", "Pasco",
  "Pinellas", "Polk", "Putnam", "Santa Rosa", "Sarasota", "Seminole",
  "St. Johns", "St. Lucie", "Sumter", "Suwannee", "Taylor", "Union",
  "Volusia", "Wakulla", "Walton", "Washington",
];

// ── Extract description ──────────────────────────────────────────────────────

const NAV_WORDS = [
  "menu", "home", "click here", "read more", "skip to", "call us",
  "follow us", "cookie", "privacy", "copyright", "all rights reserved",
  "toggle", "search", "login", "sign in", "subscribe",
];

function extractDescription(
  business: DiscoveredBusiness,
  combinedText: string,
  city: string,
  countySlug: string | null,
): string {
  // Try to find a qualifying paragraph
  const sentences = combinedText.split(/(?<=[.!?])\s+/);
  const qualifying: string[] = [];

  for (const sentence of sentences) {
    const trimmed = sentence.trim();
    if (trimmed.length < 50) continue;
    const lower = trimmed.toLowerCase();
    if (NAV_WORDS.some((w) => lower.includes(w))) continue;
    const wordCount = trimmed.split(/\s+/).length;
    if (wordCount < 2) continue;
    qualifying.push(trimmed);
    if (qualifying.length >= 3) break;
  }

  if (qualifying.length > 0) {
    let desc = qualifying.join(" ");
    if (desc.length > DESCRIPTION_MAX_CHARS) {
      desc = desc.slice(0, DESCRIPTION_MAX_CHARS - 3) + "...";
    }
    return desc;
  }

  // Fallback
  const countyName = countySlug
    ? countySlug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
    : "Florida";
  const ratingStr =
    business.rating !== null ? `Rated ${business.rating} stars` : "Listed";
  const reviewStr =
    business.reviewCount > 0
      ? ` with ${business.reviewCount} reviews on Google`
      : "";

  return `${business.name} provides grease trap cleaning and maintenance services in ${city}, ${countyName} County, Florida. ${ratingStr}${reviewStr}.`;
}

// ── Match services ───────────────────────────────────────────────────────────

function matchServices(text: string): string[] {
  const textLower = text.toLowerCase();
  const matched: string[] = [];

  for (const [slug, keywords] of Object.entries(SERVICE_TYPE_MAP)) {
    if (keywords.some((kw) => textLower.includes(kw.toLowerCase()))) {
      matched.push(slug);
    }
  }

  return matched;
}

// ── Check emergency 24/7 ────────────────────────────────────────────────────

function checkEmergency24_7(
  openingHours: DiscoveredBusiness["openingHours"],
  combinedText: string,
): boolean {
  // Check if Google hours show 24/7
  if (openingHours?.periods) {
    const is24_7 =
      openingHours.periods.length === 1 &&
      openingHours.periods[0]?.open?.hour === 0 &&
      openingHours.periods[0]?.open?.minute === 0 &&
      !openingHours.periods[0]?.close;
    if (is24_7) return true;
  }

  // Check website text
  const textLower = combinedText.toLowerCase();
  if (textLower.includes("24/7") || textLower.includes("24 hours")) {
    if (
      textLower.includes("emergency") ||
      textLower.includes("after hours") ||
      textLower.includes("always available")
    ) {
      return true;
    }
  }

  return false;
}

// ── Extract service areas from text ──────────────────────────────────────────

function extractServiceAreas(text: string): string[] {
  const textLower = text.toLowerCase();
  const areas: string[] = [];

  for (const county of FL_COUNTIES) {
    if (textLower.includes(county.toLowerCase())) {
      areas.push(county);
    }
  }

  return [...new Set(areas)];
}

// ── Extract city from address ────────────────────────────────────────────────

function extractCity(address: string): string {
  // Typical format: "123 Main St, City, FL 33123, USA"
  const parts = address.split(",").map((p) => p.trim());
  if (parts.length >= 3) {
    // City is usually second-to-last before state
    const candidate = parts[parts.length - 3] ?? parts[1];
    if (candidate && !candidate.match(/^\d/)) {
      return candidate;
    }
  }
  if (parts.length >= 2) {
    return parts[1] ?? parts[0];
  }
  return parts[0] ?? "Florida";
}

// ── Main enrich function ─────────────────────────────────────────────────────

export function enrichBusiness(
  business: DiscoveredBusiness,
  scraped: ScrapedBusiness,
  verification: VerificationResult,
): EnrichedBusiness {
  const city = extractCity(business.address);
  const countySlug = lookupCounty(city);
  const combinedText = scraped.combinedText;

  const description = extractDescription(business, combinedText, city, countySlug);

  let services = matchServices(combinedText);
  if (services.length === 0 && verification.accepted) {
    services = ["grease-trap-cleaning"];
  }

  const emergency24_7 = checkEmergency24_7(business.openingHours, combinedText);
  const emails = extractEmails(combinedText);
  const serviceAreas = extractServiceAreas(combinedText);
  const pricingSignals = extractPricingSignals(combinedText);
  const yearsInBusiness = extractYearsInBusiness(combinedText);

  const isVerified =
    verification.tier === "confirmed" &&
    scraped.websiteStatus === "live" &&
    business.phone !== null &&
    business.reviewCount > 0 &&
    (business.rating ?? 0) >= 3.0;

  return {
    placeId: business.placeId,
    shortPlaceId: business.shortPlaceId,
    name: business.name,
    address: business.address,
    phone: business.phone,
    website: business.website,
    rating: business.rating,
    reviewCount: business.reviewCount,
    lat: business.lat,
    lng: business.lng,
    businessStatus: business.businessStatus,
    types: business.types,
    openingHours: business.openingHours,
    description,
    city,
    countySlug,
    services,
    emergency24_7,
    email: emails[0] ?? null,
    serviceAreas,
    pricingSignals,
    yearsInBusiness,
    websiteStatus: scraped.websiteStatus,
    isVerified,
    verificationTier: verification.tier,
  };
}

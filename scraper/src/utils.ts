import { CITIES, REMOVE_TAGS, REMOVE_CLASS_PATTERNS } from "./config.js";

// ── Slug generation ──────────────────────────────────────────────────────────

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function generateSlug(name: string, city: string): string {
  return `${slugify(name)}-${slugify(city)}`;
}

export async function ensureUniqueSlug(
  slug: string,
  existingSlugs: Set<string>,
): Promise<string> {
  if (!existingSlugs.has(slug)) {
    existingSlugs.add(slug);
    return slug;
  }
  let suffix = 2;
  while (existingSlugs.has(`${slug}-${suffix}`)) {
    suffix++;
  }
  const unique = `${slug}-${suffix}`;
  existingSlugs.add(unique);
  return unique;
}

// ── County lookup ────────────────────────────────────────────────────────────

const COUNTY_MAP: Record<string, string> = {
  // Tier 1-3 cities from config
  ...Object.fromEntries(
    CITIES.map((c) => [c.name.toLowerCase(), c.county]),
  ),
  // Extended Florida city → county slug mapping (top 200+ by population)
  "miami beach": "miami-dade",
  "miami gardens": "miami-dade",
  "miami lakes": "miami-dade",
  "miami shores": "miami-dade",
  "north miami": "miami-dade",
  "north miami beach": "miami-dade",
  "south miami": "miami-dade",
  "doral": "miami-dade",
  "homestead": "miami-dade",
  "aventura": "miami-dade",
  "cutler bay": "miami-dade",
  "kendall": "miami-dade",
  "palmetto bay": "miami-dade",
  "pinecrest": "miami-dade",
  "sunny isles beach": "miami-dade",
  "sweetwater": "miami-dade",
  "medley": "miami-dade",
  "opa-locka": "miami-dade",
  "coral gables": "miami-dade",
  "key biscayne": "miami-dade",
  "florida city": "miami-dade",
  "sunrise": "broward",
  "plantation": "broward",
  "davie": "broward",
  "miramar": "broward",
  "weston": "broward",
  "deerfield beach": "broward",
  "coconut creek": "broward",
  "margate": "broward",
  "tamarac": "broward",
  "lauderhill": "broward",
  "lauderdale lakes": "broward",
  "north lauderdale": "broward",
  "oakland park": "broward",
  "wilton manors": "broward",
  "hallandale beach": "broward",
  "cooper city": "broward",
  "parkland": "broward",
  "lighthouse point": "broward",
  "delray beach": "palm-beach",
  "boynton beach": "palm-beach",
  "lake worth": "palm-beach",
  "lake worth beach": "palm-beach",
  "jupiter": "palm-beach",
  "palm beach gardens": "palm-beach",
  "royal palm beach": "palm-beach",
  "wellington": "palm-beach",
  "greenacres": "palm-beach",
  "riviera beach": "palm-beach",
  "palm beach": "palm-beach",
  "belle glade": "palm-beach",
  "brandon": "hillsborough",
  "temple terrace": "hillsborough",
  "plant city": "hillsborough",
  "riverview": "hillsborough",
  "ruskin": "hillsborough",
  "valrico": "hillsborough",
  "lutz": "hillsborough",
  "wesley chapel": "pasco",
  "land o lakes": "pasco",
  "new port richey": "pasco",
  "port richey": "pasco",
  "hudson": "pasco",
  "zephyrhills": "pasco",
  "dade city": "pasco",
  "spring hill": "hernando",
  "brooksville": "hernando",
  "largo": "pinellas",
  "dunedin": "pinellas",
  "palm harbor": "pinellas",
  "tarpon springs": "pinellas",
  "safety harbor": "pinellas",
  "seminole": "pinellas",
  "pinellas park": "pinellas",
  "oldsmar": "pinellas",
  "gulfport": "pinellas",
  "treasure island": "pinellas",
  "st pete beach": "pinellas",
  "winter park": "orange",
  "ocoee": "orange",
  "winter garden": "orange",
  "windermere": "orange",
  "maitland": "orange",
  "altamonte springs": "seminole",
  "casselberry": "seminole",
  "longwood": "seminole",
  "lake mary": "seminole",
  "oviedo": "seminole",
  "winter springs": "seminole",
  "clermont": "lake",
  "eustis": "lake",
  "mount dora": "lake",
  "tavares": "lake",
  "lady lake": "lake",
  "the villages": "sumter",
  "ocala": "marion",
  "dunnellon": "marion",
  "belleview": "marion",
  "palm coast": "flagler",
  "flagler beach": "flagler",
  "ormond beach": "volusia",
  "port orange": "volusia",
  "new smyrna beach": "volusia",
  "edgewater": "volusia",
  "debary": "volusia",
  "orange city": "volusia",
  "titusville": "brevard",
  "cocoa": "brevard",
  "cocoa beach": "brevard",
  "rockledge": "brevard",
  "satellite beach": "brevard",
  "merritt island": "brevard",
  "indialantic": "brevard",
  "st cloud": "osceola",
  "poinciana": "osceola",
  "haines city": "polk",
  "bartow": "polk",
  "auburndale": "polk",
  "lake wales": "polk",
  "fort pierce": "st-lucie",
  "sebastian": "indian-river",
  "fellsmere": "indian-river",
  "okeechobee": "okeechobee",
  "clewiston": "hendry",
  "labelle": "hendry",
  "lehigh acres": "lee",
  "estero": "lee",
  "sanibel": "lee",
  "marco island": "collier",
  "immokalee": "collier",
  "ave maria": "collier",
  "north port": "sarasota",
  "venice": "sarasota",
  "englewood": "sarasota",
  "nokomis": "sarasota",
  "palmetto": "manatee",
  "anna maria": "manatee",
  "holmes beach": "manatee",
  "lakewood ranch": "manatee",
  "parrish": "manatee",
  "arcadia": "desoto",
  "wauchula": "hardee",
  "sebring": "highlands",
  "avon park": "highlands",
  "lake placid": "highlands",
  "punta gorda": "charlotte",
  "port charlotte": "charlotte",
  "perry": "taylor",
  "live oak": "suwannee",
  "lake city": "columbia",
  "jasper": "hamilton",
  "madison": "madison",
  "monticello": "jefferson",
  "quincy": "gadsden",
  "marianna": "jackson",
  "chipley": "washington",
  "bonifay": "holmes",
  "defuniak springs": "walton",
  "crestview": "okaloosa",
  "fort walton beach": "okaloosa",
  "destin": "okaloosa",
  "niceville": "okaloosa",
  "navarre": "santa-rosa",
  "milton": "santa-rosa",
  "gulf breeze": "santa-rosa",
  "pace": "santa-rosa",
  "lynn haven": "bay",
  "panama city beach": "bay",
  "callaway": "bay",
  "port st joe": "gulf",
  "apalachicola": "franklin",
  "crawfordville": "wakulla",
  "carrabelle": "franklin",
  "starke": "bradford",
  "palatka": "putnam",
  "green cove springs": "clay",
  "orange park": "clay",
  "middleburg": "clay",
  "fleming island": "clay",
  "fernandina beach": "nassau",
  "yulee": "nassau",
  "macclenny": "baker",
  "st augustine": "st-johns",
  "st augustine beach": "st-johns",
  "ponte vedra": "st-johns",
  "ponte vedra beach": "st-johns",
  "inverness": "citrus",
  "crystal river": "citrus",
  "homosassa": "citrus",
  "bushnell": "sumter",
  "wildwood": "sumter",
  "williston": "levy",
  "chiefland": "levy",
  "cedar key": "levy",
  "newberry": "alachua",
  "high springs": "alachua",
  "alachua": "alachua",
  "trenton": "gilchrist",
  "cross city": "dixie",
  "mayo": "lafayette",
  "branford": "suwannee",
  "white springs": "hamilton",
  "jennings": "hamilton",
  "greenville": "madison",
  "blountstown": "calhoun",
  "bristol": "liberty",
  "wewahitchka": "gulf",
  "frostproof": "polk",
  "davenport": "polk",
  "dundee": "polk",
  "mulberry": "polk",
  "zolfo springs": "hardee",
  "bowling green": "hardee",
  "moore haven": "glades",
  "pahokee": "palm-beach",
  "south bay": "palm-beach",
  "key largo": "monroe",
  "islamorada": "monroe",
  "marathon": "monroe",
  "big pine key": "monroe",
};

export function lookupCounty(city: string): string | null {
  return COUNTY_MAP[city.toLowerCase()] ?? null;
}

// ── Text cleaning ────────────────────────────────────────────────────────────

export function cleanText(html: string): string {
  let text = html;

  // Remove specified tags and their contents
  for (const tag of REMOVE_TAGS) {
    const regex = new RegExp(`<${tag}[^>]*>[\\s\\S]*?</${tag}>`, "gi");
    text = text.replace(regex, " ");
  }

  // Remove elements with matching class/id patterns
  for (const pattern of REMOVE_CLASS_PATTERNS) {
    const regex = new RegExp(
      `<[^>]+(class|id)="[^"]*${pattern}[^"]*"[^>]*>[\\s\\S]*?</[^>]+>`,
      "gi",
    );
    text = text.replace(regex, " ");
  }

  // Remove role="navigation|banner|contentinfo" elements
  for (const role of ["navigation", "banner", "contentinfo"]) {
    const regex = new RegExp(
      `<[^>]+role="${role}"[^>]*>[\\s\\S]*?</[^>]+>`,
      "gi",
    );
    text = text.replace(regex, " ");
  }

  // Strip all remaining HTML tags
  text = text.replace(/<[^>]+>/g, " ");

  // Decode common HTML entities
  text = text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");

  // Collapse whitespace
  text = text.replace(/\s+/g, " ").trim();

  // Remove lines under 20 chars and dedup
  const lines = text.split(/[.\n]/).map((l) => l.trim());
  const seen = new Set<string>();
  const filtered: string[] = [];
  for (const line of lines) {
    if (line.length >= 20 && !seen.has(line)) {
      seen.add(line);
      filtered.push(line);
    }
  }

  return filtered.join(". ");
}

// ── URL helpers ──────────────────────────────────────────────────────────────

export function normalizeUrl(base: string, href: string): string | null {
  try {
    const url = new URL(href, base);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.href;
  } catch {
    return null;
  }
}

export function isSameHost(base: string, url: string): boolean {
  try {
    const a = new URL(base);
    const b = new URL(url);
    return a.hostname === b.hostname;
  } catch {
    return false;
  }
}

// ── Delay helper ─────────────────────────────────────────────────────────────

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── Place ID helpers ─────────────────────────────────────────────────────────

export function stripPlacesPrefix(placeId: string): string {
  return placeId.replace(/^places\//, "");
}

export function ensurePlacesPrefix(placeId: string): string {
  return placeId.startsWith("places/") ? placeId : `places/${placeId}`;
}

// ── Email extraction ─────────────────────────────────────────────────────────

export function extractEmails(text: string): string[] {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const matches = text.match(emailRegex) || [];
  const platformPatterns = [
    "noreply@", "no-reply@", "support@google", "support@facebook",
    "support@yelp", "info@example", "admin@wordpress", "wix.com",
    "squarespace.com", "godaddy.com", "sentry.io",
  ];
  return [...new Set(matches)].filter(
    (email) => !platformPatterns.some((p) => email.toLowerCase().includes(p)),
  );
}

// ── Pricing extraction ───────────────────────────────────────────────────────

export function extractPricingSignals(text: string): string | null {
  const greaseContext = text.toLowerCase();
  const priceRegex = /\$[\d,]+(?:\.\d{2})?/g;
  const matches = greaseContext.match(priceRegex);
  if (!matches || matches.length === 0) return null;
  return matches.slice(0, 3).join(", ");
}

// ── Years in business ────────────────────────────────────────────────────────

export function extractYearsInBusiness(text: string): number | null {
  const patterns = [
    /(?:since|established|est\.?|founded)\s*(\d{4})/i,
    /(\d{4})\s*[-–]\s*(?:present|today|now)/i,
    /over\s+(\d+)\s+years/i,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const val = parseInt(match[1], 10);
      if (val > 1900 && val <= new Date().getFullYear()) {
        return new Date().getFullYear() - val;
      }
      if (val > 0 && val < 200) {
        return val;
      }
    }
  }
  return null;
}

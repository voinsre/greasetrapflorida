/**
 * Phase 4: Data Cleaning & Deduplication Pipeline
 *
 * INPUT:  data/raw-apify/all-raw.json
 * OUTPUT: data/cleaned.json
 *
 * Steps:
 *   1. Load & count raw records
 *   2. Hard exclude filters
 *   3. Three-tier dedup
 *   4. Normalize (county, slug, priority)
 *   5. Output + summary
 */

import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const ROOT = process.cwd();
const INPUT = join(ROOT, "data", "raw-apify", "all-raw.json");
const OUTPUT = join(ROOT, "data", "cleaned.json");

// ─────────────────────────────────────────────
// CITY → COUNTY MAPPING (200+ Florida cities)
// ─────────────────────────────────────────────
const CITY_COUNTY = {
  // Miami-Dade County
  "miami": "Miami-Dade",
  "miami beach": "Miami-Dade",
  "miami gardens": "Miami-Dade",
  "miami lakes": "Miami-Dade",
  "miami shores": "Miami-Dade",
  "miami springs": "Miami-Dade",
  "hialeah": "Miami-Dade",
  "hialeah gardens": "Miami-Dade",
  "homestead": "Miami-Dade",
  "doral": "Miami-Dade",
  "coral gables": "Miami-Dade",
  "north miami": "Miami-Dade",
  "north miami beach": "Miami-Dade",
  "aventura": "Miami-Dade",
  "sunny isles beach": "Miami-Dade",
  "sweetwater": "Miami-Dade",
  "cutler bay": "Miami-Dade",
  "palmetto bay": "Miami-Dade",
  "pinecrest": "Miami-Dade",
  "key biscayne": "Miami-Dade",
  "florida city": "Miami-Dade",
  "opa-locka": "Miami-Dade",
  "opa locka": "Miami-Dade",
  "south miami": "Miami-Dade",
  "kendall": "Miami-Dade",
  "medley": "Miami-Dade",
  "virginia gardens": "Miami-Dade",
  "bal harbour": "Miami-Dade",
  "surfside": "Miami-Dade",
  "west miami": "Miami-Dade",
  "el portal": "Miami-Dade",
  "biscayne park": "Miami-Dade",
  "indian creek": "Miami-Dade",
  "golden beach": "Miami-Dade",
  "north bay village": "Miami-Dade",
  "bay harbor islands": "Miami-Dade",
  "islandia": "Miami-Dade",

  // Broward County
  "fort lauderdale": "Broward",
  "hollywood": "Broward",
  "pembroke pines": "Broward",
  "coral springs": "Broward",
  "pompano beach": "Broward",
  "davie": "Broward",
  "plantation": "Broward",
  "sunrise": "Broward",
  "miramar": "Broward",
  "deerfield beach": "Broward",
  "lauderhill": "Broward",
  "tamarac": "Broward",
  "weston": "Broward",
  "coconut creek": "Broward",
  "margate": "Broward",
  "north lauderdale": "Broward",
  "lauderdale lakes": "Broward",
  "oakland park": "Broward",
  "wilton manors": "Broward",
  "hallandale beach": "Broward",
  "hallandale": "Broward",
  "cooper city": "Broward",
  "lighthouse point": "Broward",
  "parkland": "Broward",
  "southwest ranches": "Broward",
  "dania beach": "Broward",
  "dania": "Broward",
  "lauderdale-by-the-sea": "Broward",
  "sea ranch lakes": "Broward",
  "hillsboro beach": "Broward",
  "lazy lake": "Broward",
  "west park": "Broward",
  "pembroke park": "Broward",

  // Palm Beach County
  "west palm beach": "Palm Beach",
  "boca raton": "Palm Beach",
  "boynton beach": "Palm Beach",
  "delray beach": "Palm Beach",
  "jupiter": "Palm Beach",
  "palm beach gardens": "Palm Beach",
  "lake worth": "Palm Beach",
  "lake worth beach": "Palm Beach",
  "wellington": "Palm Beach",
  "royal palm beach": "Palm Beach",
  "riviera beach": "Palm Beach",
  "greenacres": "Palm Beach",
  "palm beach": "Palm Beach",
  "north palm beach": "Palm Beach",
  "palm springs": "Palm Beach",
  "lantana": "Palm Beach",
  "belle glade": "Palm Beach",
  "pahokee": "Palm Beach",
  "tequesta": "Palm Beach",
  "juno beach": "Palm Beach",
  "loxahatchee": "Palm Beach",
  "glen ridge": "Palm Beach",
  "south bay": "Palm Beach",
  "mangonia park": "Palm Beach",
  "haverhill": "Palm Beach",
  "ocean ridge": "Palm Beach",
  "manalapan": "Palm Beach",
  "hypoluxo": "Palm Beach",
  "cloud lake": "Palm Beach",
  "golf": "Palm Beach",
  "atlantis": "Palm Beach",
  "south palm beach": "Palm Beach",
  "briny breezes": "Palm Beach",
  "highland beach": "Palm Beach",

  // Hillsborough County
  "tampa": "Hillsborough",
  "plant city": "Hillsborough",
  "temple terrace": "Hillsborough",
  "brandon": "Hillsborough",
  "riverview": "Hillsborough",
  "valrico": "Hillsborough",
  "lutz": "Hillsborough",
  "seffner": "Hillsborough",
  "ruskin": "Hillsborough",
  "apollo beach": "Hillsborough",
  "gibsonton": "Hillsborough",
  "lithia": "Hillsborough",
  "thonotosassa": "Hillsborough",
  "wimauma": "Hillsborough",
  "sun city center": "Hillsborough",
  "dover": "Hillsborough",
  "balm": "Hillsborough",
  "sydney": "Hillsborough",

  // Pinellas County
  "st petersburg": "Pinellas",
  "st. petersburg": "Pinellas",
  "saint petersburg": "Pinellas",
  "clearwater": "Pinellas",
  "largo": "Pinellas",
  "palm harbor": "Pinellas",
  "dunedin": "Pinellas",
  "tarpon springs": "Pinellas",
  "pinellas park": "Pinellas",
  "safety harbor": "Pinellas",
  "seminole": "Pinellas",
  "oldsmar": "Pinellas",
  "gulfport": "Pinellas",
  "treasure island": "Pinellas",
  "madeira beach": "Pinellas",
  "st pete beach": "Pinellas",
  "indian rocks beach": "Pinellas",
  "belleair": "Pinellas",
  "belleair beach": "Pinellas",
  "belleair bluffs": "Pinellas",
  "kenneth city": "Pinellas",
  "redington beach": "Pinellas",
  "north redington beach": "Pinellas",
  "redington shores": "Pinellas",
  "indian shores": "Pinellas",

  // Orange County
  "orlando": "Orange",
  "apopka": "Orange",
  "winter garden": "Orange",
  "ocoee": "Orange",
  "winter park": "Orange",
  "maitland": "Orange",
  "belle isle": "Orange",
  "eatonville": "Orange",
  "windermere": "Orange",
  "oakland": "Orange",
  "edgewood": "Orange",

  // Osceola County
  "kissimmee": "Osceola",
  "st cloud": "Osceola",
  "st. cloud": "Osceola",
  "celebration": "Osceola",
  "poinciana": "Osceola",

  // Duval County
  "jacksonville": "Duval",
  "jacksonville beach": "Duval",
  "atlantic beach": "Duval",
  "neptune beach": "Duval",
  "baldwin": "Duval",

  // Seminole County
  "sanford": "Seminole",
  "altamonte springs": "Seminole",
  "casselberry": "Seminole",
  "lake mary": "Seminole",
  "longwood": "Seminole",
  "oviedo": "Seminole",
  "winter springs": "Seminole",

  // Lee County
  "fort myers": "Lee",
  "cape coral": "Lee",
  "bonita springs": "Lee",
  "lehigh acres": "Lee",
  "estero": "Lee",
  "north fort myers": "Lee",
  "sanibel": "Lee",
  "fort myers beach": "Lee",

  // Collier County
  "naples": "Collier",
  "marco island": "Collier",
  "immokalee": "Collier",
  "ave maria": "Collier",
  "everglades city": "Collier",

  // Sarasota County
  "sarasota": "Sarasota",
  "north port": "Sarasota",
  "venice": "Sarasota",
  "englewood": "Sarasota",
  "nokomis": "Sarasota",
  "osprey": "Sarasota",
  "longboat key": "Sarasota",
  "siesta key": "Sarasota",

  // Manatee County
  "bradenton": "Manatee",
  "palmetto": "Manatee",
  "anna maria": "Manatee",
  "holmes beach": "Manatee",
  "bradenton beach": "Manatee",
  "ellenton": "Manatee",
  "parrish": "Manatee",
  "lakewood ranch": "Manatee",

  // Volusia County
  "daytona beach": "Volusia",
  "deltona": "Volusia",
  "deland": "Volusia",
  "port orange": "Volusia",
  "ormond beach": "Volusia",
  "new smyrna beach": "Volusia",
  "edgewater": "Volusia",
  "debary": "Volusia",
  "orange city": "Volusia",
  "holly hill": "Volusia",
  "south daytona": "Volusia",
  "ponce inlet": "Volusia",
  "pierson": "Volusia",
  "lake helen": "Volusia",

  // Brevard County
  "melbourne": "Brevard",
  "palm bay": "Brevard",
  "titusville": "Brevard",
  "cocoa": "Brevard",
  "cocoa beach": "Brevard",
  "rockledge": "Brevard",
  "satellite beach": "Brevard",
  "merritt island": "Brevard",
  "indialantic": "Brevard",
  "melbourne beach": "Brevard",
  "west melbourne": "Brevard",
  "cape canaveral": "Brevard",
  "mims": "Brevard",
  "viera": "Brevard",

  // Leon County
  "tallahassee": "Leon",

  // Alachua County
  "gainesville": "Alachua",
  "alachua": "Alachua",
  "newberry": "Alachua",
  "high springs": "Alachua",
  "archer": "Alachua",
  "hawthorne": "Alachua",
  "micanopy": "Alachua",
  "waldo": "Alachua",

  // Polk County
  "lakeland": "Polk",
  "winter haven": "Polk",
  "bartow": "Polk",
  "haines city": "Polk",
  "auburndale": "Polk",
  "lake wales": "Polk",
  "davenport": "Polk",
  "lake alfred": "Polk",
  "mulberry": "Polk",
  "frostproof": "Polk",
  "eagle lake": "Polk",
  "dundee": "Polk",
  "fort meade": "Polk",

  // St. Lucie County
  "port st lucie": "St. Lucie",
  "port st. lucie": "St. Lucie",
  "fort pierce": "St. Lucie",
  "tradition": "St. Lucie",

  // Martin County
  "stuart": "Martin",
  "palm city": "Martin",
  "jensen beach": "Martin",
  "indiantown": "Martin",
  "hobe sound": "Martin",

  // Indian River County
  "vero beach": "Indian River",
  "sebastian": "Indian River",
  "fellsmere": "Indian River",

  // Escambia County
  "pensacola": "Escambia",
  "perdido key": "Escambia",
  "cantonment": "Escambia",
  "century": "Escambia",
  "gonzalez": "Escambia",
  "ensley": "Escambia",
  "molino": "Escambia",

  // Santa Rosa County
  "milton": "Santa Rosa",
  "navarre": "Santa Rosa",
  "gulf breeze": "Santa Rosa",
  "pace": "Santa Rosa",
  "jay": "Santa Rosa",

  // Okaloosa County
  "fort walton beach": "Okaloosa",
  "destin": "Okaloosa",
  "crestview": "Okaloosa",
  "niceville": "Okaloosa",
  "valparaiso": "Okaloosa",
  "mary esther": "Okaloosa",
  "shalimar": "Okaloosa",

  // Bay County
  "panama city": "Bay",
  "panama city beach": "Bay",
  "lynn haven": "Bay",
  "callaway": "Bay",
  "springfield": "Bay",
  "parker": "Bay",

  // Marion County
  "ocala": "Marion",
  "belleview": "Marion",
  "dunnellon": "Marion",
  "reddick": "Marion",
  "silver springs": "Marion",

  // Lake County
  "leesburg": "Lake",
  "clermont": "Lake",
  "eustis": "Lake",
  "tavares": "Lake",
  "mount dora": "Lake",
  "lady lake": "Lake",
  "groveland": "Lake",
  "minneola": "Lake",
  "montverde": "Lake",
  "umatilla": "Lake",
  "fruitland park": "Lake",
  "mascotte": "Lake",
  "astatula": "Lake",
  "howey-in-the-hills": "Lake",

  // Monroe County
  "key west": "Monroe",
  "key largo": "Monroe",
  "marathon": "Monroe",
  "islamorada": "Monroe",
  "tavernier": "Monroe",
  "big pine key": "Monroe",
  "cudjoe key": "Monroe",
  "stock island": "Monroe",
  "summerland key": "Monroe",

  // Pasco County
  "new port richey": "Pasco",
  "port richey": "Pasco",
  "hudson": "Pasco",
  "wesley chapel": "Pasco",
  "land o' lakes": "Pasco",
  "land o lakes": "Pasco",
  "zephyrhills": "Pasco",
  "dade city": "Pasco",
  "holiday": "Pasco",
  "trinity": "Pasco",
  "odessa": "Pasco",
  "spring hill": "Pasco",

  // Hernando County
  "brooksville": "Hernando",
  "weeki wachee": "Hernando",

  // Citrus County
  "inverness": "Citrus",
  "crystal river": "Citrus",
  "homosassa": "Citrus",
  "lecanto": "Citrus",
  "beverly hills": "Citrus",
  "floral city": "Citrus",

  // Sumter County
  "the villages": "Sumter",
  "bushnell": "Sumter",
  "wildwood": "Sumter",
  "coleman": "Sumter",
  "center hill": "Sumter",

  // Flagler County
  "palm coast": "Flagler",
  "flagler beach": "Flagler",
  "bunnell": "Flagler",

  // Putnam County
  "palatka": "Putnam",
  "crescent city": "Putnam",
  "east palatka": "Putnam",

  // St. Johns County
  "st augustine": "St. Johns",
  "st. augustine": "St. Johns",
  "saint augustine": "St. Johns",
  "ponte vedra beach": "St. Johns",
  "ponte vedra": "St. Johns",
  "fruit cove": "St. Johns",
  "nocatee": "St. Johns",
  "hastings": "St. Johns",

  // Clay County
  "orange park": "Clay",
  "fleming island": "Clay",
  "green cove springs": "Clay",
  "middleburg": "Clay",
  "keystone heights": "Clay",

  // Nassau County
  "fernandina beach": "Nassau",
  "amelia island": "Nassau",
  "yulee": "Nassau",
  "callahan": "Nassau",
  "hilliard": "Nassau",

  // Charlotte County
  "port charlotte": "Charlotte",
  "punta gorda": "Charlotte",

  // Hendry County
  "labelle": "Hendry",
  "clewiston": "Hendry",

  // Glades County
  "moore haven": "Glades",

  // Okeechobee County
  "okeechobee": "Okeechobee",

  // Highlands County
  "sebring": "Highlands",
  "avon park": "Highlands",
  "lake placid": "Highlands",

  // Hardee County
  "wauchula": "Hardee",
  "bowling green": "Hardee",
  "zolfo springs": "Hardee",

  // DeSoto County
  "arcadia": "DeSoto",

  // Columbia County
  "lake city": "Columbia",

  // Suwannee County
  "live oak": "Suwannee",

  // Hamilton County
  "jasper": "Hamilton",
  "white springs": "Hamilton",

  // Madison County
  "madison": "Madison",

  // Taylor County
  "perry": "Taylor",

  // Jefferson County
  "monticello": "Jefferson",

  // Wakulla County
  "crawfordville": "Wakulla",
  "sopchoppy": "Wakulla",
  "st marks": "Wakulla",

  // Gadsden County
  "quincy": "Gadsden",
  "havana": "Gadsden",
  "chattahoochee": "Gadsden",
  "midway": "Gadsden",

  // Liberty County
  "bristol": "Liberty",

  // Calhoun County
  "blountstown": "Calhoun",

  // Jackson County
  "marianna": "Jackson",
  "graceville": "Jackson",
  "sneads": "Jackson",

  // Holmes County
  "bonifay": "Holmes",

  // Washington County
  "chipley": "Washington",

  // Walton County
  "defuniak springs": "Walton",
  "freeport": "Walton",
  "santa rosa beach": "Walton",
  "miramar beach": "Walton",
  "rosemary beach": "Walton",
  "inlet beach": "Walton",

  // Gulf County
  "port st joe": "Gulf",
  "port st. joe": "Gulf",
  "wewahitchka": "Gulf",

  // Franklin County
  "apalachicola": "Franklin",
  "carrabelle": "Franklin",
  "eastpoint": "Franklin",

  // Levy County
  "chiefland": "Levy",
  "williston": "Levy",
  "bronson": "Levy",
  "cedar key": "Levy",
  "yankeetown": "Levy",

  // Gilchrist County
  "trenton": "Gilchrist",
  "bell": "Gilchrist",
  "fanning springs": "Gilchrist",

  // Dixie County
  "cross city": "Dixie",
  "old town": "Dixie",

  // Lafayette County
  "mayo": "Lafayette",

  // Union County
  "lake butler": "Union",

  // Bradford County
  "starke": "Bradford",
  "lawtey": "Bradford",
  "hampton": "Bradford",

  // Baker County
  "macclenny": "Baker",
  "glen st mary": "Baker",

  // Sumter / misc
  "oxford": "Sumter",

  // Misc recognized places
  "spring hill": "Hernando",  // Often Hernando, override Pasco
  "sun city": "Hillsborough",
  "citrus park": "Hillsborough",
  "carrollwood": "Hillsborough",
  "town n country": "Hillsborough",
  "town 'n' country": "Hillsborough",
  "westchase": "Hillsborough",
  "egypt lake-leto": "Hillsborough",
  "hunters creek": "Orange",
  "doctor phillips": "Orange",
  "bay hill": "Orange",
  "azalea park": "Orange",
  "conway": "Orange",
  "union park": "Orange",
  "meadow woods": "Orange",
  "lake buena vista": "Orange",
  "gotha": "Orange",
  "tangelo park": "Orange",
  "pine hills": "Orange",
  "lockhart": "Orange",
  "orlo vista": "Orange",
  "fairview shores": "Orange",
  "sky lake": "Orange",
  "south apopka": "Orange",
  "zellwood": "Orange",
  "christmas": "Orange",
  "bithlo": "Orange",
  "cocoa west": "Brevard",
  "port st john": "Brevard",
  "barefoot bay": "Brevard",
  "grant-valkaria": "Brevard",
  "palm shores": "Brevard",
  "malabar": "Brevard",
  "micco": "Brevard",
  "lealman": "Pinellas",
  "bardmoor": "Pinellas",
  "east lake": "Pinellas",
  "feather sound": "Pinellas",
  "bay pines": "Pinellas",
  "tierra verde": "Pinellas",
  "lealman": "Pinellas",
  "south highpoint": "Pinellas",
  "north sarasota": "Sarasota",
  "south sarasota": "Sarasota",
  "gulf gate estates": "Sarasota",
  "bee ridge": "Sarasota",
  "fruitville": "Sarasota",
  "south venice": "Sarasota",
  "warm mineral springs": "Sarasota",
  "north venice": "Sarasota",
  "wellen park": "Sarasota",
  "lakewood park": "St. Lucie",
  "white city": "St. Lucie",
};

// Florida bounding box (generous)
const FL_LAT_MIN = 24.3;
const FL_LAT_MAX = 31.1;
const FL_LNG_MIN = -87.7;
const FL_LNG_MAX = -79.8;

// ─────────────────────────────────────────────
// BLACKLIST
// ─────────────────────────────────────────────
const HARD_BLACKLIST = [
  "residential plumber",
  "hvac",
  "janitorial",
  "carpet",
  "pressure washing",
];

// Conditional blacklist: exclude ONLY if "grease" not in title/categories/description
const CONDITIONAL_BLACKLIST = [
  "drain cleaning",
  "septic",
  "sewer",
];

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function getAllText(r) {
  return [
    r.title || "",
    r.categoryName || "",
    ...(r.categories || []),
    r.description || "",
  ].join(" ").toLowerCase();
}

function hasGrease(r) {
  const text = getAllText(r);
  return text.includes("grease") || text.includes("fog ") || text.includes("interceptor");
}

function isInFlorida(r) {
  // Check explicit state
  const state = (r.state || "").toLowerCase().trim();
  if (state === "florida" || state === "fl") return true;

  // Check address for FL
  if (r.address && /,\s*FL\b/i.test(r.address)) return true;

  // Check lat/lng within Florida bounds
  const lat = r.location?.lat;
  const lng = r.location?.lng;
  if (lat && lng && lat >= FL_LAT_MIN && lat <= FL_LAT_MAX && lng >= FL_LNG_MIN && lng <= FL_LNG_MAX) {
    return true;
  }

  return false;
}

function normalizePhone(phone) {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 10 ? digits.slice(-10) : null;
}

function normalizeName(name) {
  if (!name) return "";
  return name
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/\b(inc|llc|corp|co|services|company|service|enterprises|enterprise|group|of|the)\b/gi, "")
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

function slugify(text) {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function completenessScore(r) {
  let score = 0;
  if (r.title) score++;
  if (r.phone || r.phoneUnformatted) score++;
  if (r.website) score++;
  if (r.address) score++;
  if (r.city) score++;
  if (r.postalCode) score++;
  if (r.totalScore) score++;
  if (r.reviewsCount > 0) score++;
  if (r.categories && r.categories.length > 0) score++;
  if (r.location?.lat) score++;
  return score;
}

function resolveCounty(r) {
  // 1. Try city lookup
  const city = (r.city || "").toLowerCase().trim();
  if (city && CITY_COUNTY[city]) return CITY_COUNTY[city];

  // 2. Try extracting city from address
  if (r.address) {
    const addrMatch = r.address.match(/,\s*([^,]+?)\s*,\s*FL/i);
    if (addrMatch) {
      const addrCity = addrMatch[1].toLowerCase().trim();
      if (CITY_COUNTY[addrCity]) return CITY_COUNTY[addrCity];
    }
  }

  // 3. Try searchString (has city name)
  if (r.searchString) {
    const ssMatch = r.searchString.match(/(?:cleaning|pumping|service)\s+(.+?)\s+FL/i);
    if (ssMatch) {
      const ssCity = ssMatch[1].toLowerCase().trim();
      if (CITY_COUNTY[ssCity]) return CITY_COUNTY[ssCity];
    }
  }

  return "unknown";
}

function resolveCityName(r) {
  if (r.city) return r.city;

  // Try address
  if (r.address) {
    const m = r.address.match(/,\s*([^,]+?)\s*,\s*FL/i);
    if (m) return m[1].trim();
  }

  // Try searchString
  if (r.searchString) {
    const m = r.searchString.match(/(?:cleaning|pumping|service)\s+(.+?)\s+FL/i);
    if (m) return m[1].trim();
  }

  return "Unknown";
}

// ─────────────────────────────────────────────
// STEP 1: LOAD
// ─────────────────────────────────────────────
console.log("=== STEP 1: LOAD ===");
const raw = JSON.parse(readFileSync(INPUT, "utf-8"));
console.log(`Loaded ${raw.length} raw records from all-raw.json\n`);

// ─────────────────────────────────────────────
// STEP 2: HARD EXCLUDE FILTERS
// ─────────────────────────────────────────────
console.log("=== STEP 2: HARD EXCLUDE FILTERS ===");

const filterCounts = {
  permanentlyClosed: 0,
  temporarilyClosed: 0,
  isAdvertisement: 0,
  noPhoneNoWebsite: 0,
  zeroReviewsNoContact: 0,
  outsideFlorida: 0,
  hardBlacklist: 0,
  conditionalBlacklist: 0,
};

let filtered = raw.filter((r) => {
  // Permanently closed
  if (r.permanentlyClosed === true) {
    filterCounts.permanentlyClosed++;
    return false;
  }

  // Temporarily closed
  if (r.temporarilyClosed === true) {
    filterCounts.temporarilyClosed++;
    return false;
  }

  // Advertisement
  if (r.isAdvertisement === true) {
    filterCounts.isAdvertisement++;
    return false;
  }

  // No phone AND no website
  const hasPhone = !!(r.phone || r.phoneUnformatted);
  const hasWebsite = !!r.website;
  if (!hasPhone && !hasWebsite) {
    filterCounts.noPhoneNoWebsite++;
    return false;
  }

  // Zero reviews AND no website AND no phone
  if ((!r.reviewsCount || r.reviewsCount === 0) && !hasWebsite && !hasPhone) {
    filterCounts.zeroReviewsNoContact++;
    return false;
  }

  // Outside Florida
  if (!isInFlorida(r)) {
    filterCounts.outsideFlorida++;
    return false;
  }

  // Hard blacklist (always exclude)
  const allText = getAllText(r);
  for (const kw of HARD_BLACKLIST) {
    if (allText.includes(kw.toLowerCase())) {
      filterCounts.hardBlacklist++;
      return false;
    }
  }

  // Conditional blacklist (exclude only if no "grease" mention)
  if (!hasGrease(r)) {
    for (const kw of CONDITIONAL_BLACKLIST) {
      if (allText.includes(kw.toLowerCase())) {
        filterCounts.conditionalBlacklist++;
        return false;
      }
    }
  }

  return true;
});

console.log("Filter results:");
for (const [reason, count] of Object.entries(filterCounts)) {
  if (count > 0) console.log(`  ${reason}: -${count}`);
}
const totalFiltered = Object.values(filterCounts).reduce((a, b) => a + b, 0);
console.log(`  TOTAL REMOVED: ${totalFiltered}`);
console.log(`  Remaining after filters: ${filtered.length}\n`);

// ─────────────────────────────────────────────
// STEP 3: THREE-TIER DEDUP
// ─────────────────────────────────────────────
console.log("=== STEP 3: THREE-TIER DEDUP ===");

// Tier 1: place_id exact match
const tier1Map = new Map();
let tier1Dupes = 0;
for (const r of filtered) {
  if (!r.placeId) {
    // No placeId, keep as-is (will be deduped by phone/name)
    tier1Map.set(`__no_pid_${tier1Map.size}`, r);
    continue;
  }
  if (tier1Map.has(r.placeId)) {
    tier1Dupes++;
    const existing = tier1Map.get(r.placeId);
    // Keep the one with more complete data
    if (completenessScore(r) > completenessScore(existing)) {
      tier1Map.set(r.placeId, r);
    }
  } else {
    tier1Map.set(r.placeId, r);
  }
}
let deduped = Array.from(tier1Map.values());
console.log(`  Tier 1 (place_id): ${tier1Dupes} duplicates removed → ${deduped.length} remaining`);

// Tier 2: Phone normalized to last 10 digits
const tier2Map = new Map();
let tier2Dupes = 0;
for (const r of deduped) {
  const phone = normalizePhone(r.phoneUnformatted || r.phone);
  if (!phone) {
    tier2Map.set(`__no_phone_${tier2Map.size}`, r);
    continue;
  }
  if (tier2Map.has(phone)) {
    tier2Dupes++;
    const existing = tier2Map.get(phone);
    // Keep higher review count
    if ((r.reviewsCount || 0) > (existing.reviewsCount || 0)) {
      tier2Map.set(phone, r);
    }
  } else {
    tier2Map.set(phone, r);
  }
}
deduped = Array.from(tier2Map.values());
console.log(`  Tier 2 (phone): ${tier2Dupes} duplicates removed → ${deduped.length} remaining`);

// Tier 3: Name + zip
const tier3Map = new Map();
let tier3Dupes = 0;
for (const r of deduped) {
  const nameNorm = normalizeName(r.title);
  const zip = (r.postalCode || "").trim();
  if (!nameNorm || !zip) {
    tier3Map.set(`__no_namezip_${tier3Map.size}`, r);
    continue;
  }
  const key = `${nameNorm}|${zip}`;
  if (tier3Map.has(key)) {
    tier3Dupes++;
    const existing = tier3Map.get(key);
    if ((r.reviewsCount || 0) > (existing.reviewsCount || 0)) {
      tier3Map.set(key, r);
    }
  } else {
    tier3Map.set(key, r);
  }
}
deduped = Array.from(tier3Map.values());
console.log(`  Tier 3 (name+zip): ${tier3Dupes} duplicates removed → ${deduped.length} remaining`);

const totalDeduped = tier1Dupes + tier2Dupes + tier3Dupes;
console.log(`  TOTAL DUPLICATES REMOVED: ${totalDeduped}`);
console.log(`  Unique businesses: ${deduped.length}\n`);

// ─────────────────────────────────────────────
// STEP 4: NORMALIZE
// ─────────────────────────────────────────────
console.log("=== STEP 4: NORMALIZE ===");

const slugCounts = new Map();
const unknownCounty = [];

const cleaned = deduped.map((r) => {
  const city = resolveCityName(r);
  const county = resolveCounty(r);
  const countySlug = county !== "unknown" ? slugify(county) : "unknown";

  // Generate unique slug
  let baseSlug = slugify(r.title || "business") + "-" + slugify(city);
  if (!baseSlug || baseSlug === "-") baseSlug = "business-unknown";
  const count = slugCounts.get(baseSlug) || 0;
  slugCounts.set(baseSlug, count + 1);
  const slug = count === 0 ? baseSlug : `${baseSlug}-${count + 1}`;

  // Priority score
  let priority = 0;
  if (r.website) priority += 2;
  if ((r.reviewsCount || 0) >= 10) priority += 2;
  if ((r.totalScore || 0) >= 4.0) priority += 1;
  if (r.phone || r.phoneUnformatted) priority += 1;
  if (r.address && r.street) priority += 1;

  const biz = {
    slug,
    name: r.title || "Unknown Business",
    phone: r.phone || null,
    phone_unformatted: r.phoneUnformatted || null,
    website: r.website || null,
    address: r.address || null,
    city,
    county,
    county_slug: countySlug,
    state: "Florida",
    state_abbreviation: "FL",
    zip: r.postalCode || null,
    lat: r.location?.lat || null,
    lng: r.location?.lng || null,
    rating: r.totalScore || null,
    review_count: r.reviewsCount || 0,
    place_id: r.placeId || null,
    categories: r.categories || [],
    category_name: r.categoryName || null,
    opening_hours: r.openingHours || null,
    description: r.description || null,
    image_url: r.imageUrl || null,
    search_string: r.searchString || null,
    display_priority: priority,
    scraped_at: r.scrapedAt || null,
  };

  if (county === "unknown") {
    unknownCounty.push({ name: biz.name, city, lat: biz.lat, lng: biz.lng });
  }

  return biz;
});

// Sort by display_priority descending
cleaned.sort((a, b) => b.display_priority - a.display_priority);

console.log(`  Normalized ${cleaned.length} businesses`);
console.log(`  Unknown county: ${unknownCounty.length} (for manual review)\n`);

// ─────────────────────────────────────────────
// STEP 5: OUTPUT + SUMMARY
// ─────────────────────────────────────────────
console.log("=== STEP 5: OUTPUT ===");

writeFileSync(OUTPUT, JSON.stringify(cleaned, null, 2));
console.log(`  Saved ${cleaned.length} businesses to data/cleaned.json\n`);

// County breakdown
const countyMap = {};
cleaned.forEach((b) => {
  countyMap[b.county] = (countyMap[b.county] || 0) + 1;
});
const sortedCounties = Object.entries(countyMap).sort((a, b) => b[1] - a[1]);
console.log("=== COUNTY BREAKDOWN (top 20) ===");
sortedCounties.slice(0, 20).forEach(([county, count], i) => {
  console.log(`  ${String(i + 1).padStart(2)}. ${county}: ${count}`);
});
console.log(`  ... ${sortedCounties.length} total counties\n`);

// Website stats
const withWebsite = cleaned.filter((b) => b.website).length;
const withoutWebsite = cleaned.length - withWebsite;
console.log("=== CONTACT STATS ===");
console.log(`  With website: ${withWebsite} (${((withWebsite / cleaned.length) * 100).toFixed(1)}%)`);
console.log(`  Without website: ${withoutWebsite} (${((withoutWebsite / cleaned.length) * 100).toFixed(1)}%)`);
console.log(`  With phone: ${cleaned.filter((b) => b.phone).length}`);

// Rating stats
const rated = cleaned.filter((b) => b.rating !== null);
const avgRating = rated.length > 0 ? (rated.reduce((s, b) => s + b.rating, 0) / rated.length).toFixed(2) : 0;
const avgReviews = cleaned.length > 0 ? (cleaned.reduce((s, b) => s + b.review_count, 0) / cleaned.length).toFixed(1) : 0;
console.log(`\n=== RATING STATS ===`);
console.log(`  Businesses with rating: ${rated.length}`);
console.log(`  Average rating: ${avgRating}`);
console.log(`  Average review count: ${avgReviews}`);

// Unknown county list
if (unknownCounty.length > 0) {
  console.log(`\n=== UNKNOWN COUNTY (${unknownCounty.length} businesses) ===`);
  unknownCounty.slice(0, 15).forEach((b) => {
    console.log(`  ${b.name} | city: ${b.city} | lat: ${b.lat}, lng: ${b.lng}`);
  });
  if (unknownCounty.length > 15) console.log(`  ... and ${unknownCounty.length - 15} more`);
}

// Final summary
console.log("\n========================================");
console.log("           PIPELINE SUMMARY");
console.log("========================================");
console.log(`  Raw records:         ${raw.length}`);
console.log(`  After filters:       ${filtered.length} (-${totalFiltered})`);
console.log(`  After dedup:         ${deduped.length} (-${totalDeduped})`);
console.log(`  Final clean count:   ${cleaned.length}`);
console.log(`  Counties:            ${sortedCounties.length}`);
console.log(`  Unknown county:      ${unknownCounty.length}`);
console.log("========================================");

// ── Cities ────────────────────────────────────────────────────────────────────

export interface City {
  name: string;
  lat: number;
  lng: number;
  county: string;
  tier: 1 | 2 | 3;
}

export const CITIES: City[] = [
  // Tier 1 (10)
  { name: "Miami", lat: 25.7617, lng: -80.1918, county: "miami-dade", tier: 1 },
  { name: "Tampa", lat: 27.9506, lng: -82.4572, county: "hillsborough", tier: 1 },
  { name: "Orlando", lat: 28.5383, lng: -81.3792, county: "orange", tier: 1 },
  { name: "Jacksonville", lat: 30.3322, lng: -81.6557, county: "duval", tier: 1 },
  { name: "Fort Lauderdale", lat: 26.1224, lng: -80.1373, county: "broward", tier: 1 },
  { name: "St Petersburg", lat: 27.7676, lng: -82.6403, county: "pinellas", tier: 1 },
  { name: "Hialeah", lat: 25.8576, lng: -80.2781, county: "miami-dade", tier: 1 },
  { name: "Tallahassee", lat: 30.4383, lng: -84.2807, county: "leon", tier: 1 },
  { name: "West Palm Beach", lat: 26.7153, lng: -80.0534, county: "palm-beach", tier: 1 },
  { name: "Sarasota", lat: 27.3364, lng: -82.5307, county: "sarasota", tier: 1 },
  // Tier 2 (14)
  { name: "Fort Myers", lat: 26.6406, lng: -81.8723, county: "lee", tier: 2 },
  { name: "Naples", lat: 26.1420, lng: -81.7948, county: "collier", tier: 2 },
  { name: "Cape Coral", lat: 26.5629, lng: -81.9495, county: "lee", tier: 2 },
  { name: "Clearwater", lat: 27.9659, lng: -82.8001, county: "pinellas", tier: 2 },
  { name: "Gainesville", lat: 29.6516, lng: -82.3248, county: "alachua", tier: 2 },
  { name: "Lakeland", lat: 28.0395, lng: -81.9498, county: "polk", tier: 2 },
  { name: "Daytona Beach", lat: 29.2108, lng: -81.0228, county: "volusia", tier: 2 },
  { name: "Kissimmee", lat: 28.2920, lng: -81.4076, county: "osceola", tier: 2 },
  { name: "Boca Raton", lat: 26.3587, lng: -80.0831, county: "palm-beach", tier: 2 },
  { name: "Pompano Beach", lat: 26.2379, lng: -80.1248, county: "broward", tier: 2 },
  { name: "Coral Springs", lat: 26.2712, lng: -80.2706, county: "broward", tier: 2 },
  { name: "Hollywood", lat: 26.0112, lng: -80.1495, county: "broward", tier: 2 },
  { name: "Pembroke Pines", lat: 26.0031, lng: -80.2241, county: "broward", tier: 2 },
  { name: "Port St Lucie", lat: 27.2730, lng: -80.3582, county: "st-lucie", tier: 2 },
  // Tier 3 (16)
  { name: "Ocala", lat: 29.1872, lng: -82.1401, county: "marion", tier: 3 },
  { name: "Pensacola", lat: 30.4213, lng: -87.2169, county: "escambia", tier: 3 },
  { name: "Palm Bay", lat: 28.0345, lng: -80.5887, county: "brevard", tier: 3 },
  { name: "Melbourne", lat: 28.0836, lng: -80.6081, county: "brevard", tier: 3 },
  { name: "Deltona", lat: 28.9005, lng: -81.2637, county: "volusia", tier: 3 },
  { name: "Bradenton", lat: 27.4989, lng: -82.5748, county: "manatee", tier: 3 },
  { name: "Panama City", lat: 30.1588, lng: -85.6602, county: "bay", tier: 3 },
  { name: "Key West", lat: 24.5551, lng: -81.7800, county: "monroe", tier: 3 },
  { name: "Stuart", lat: 27.1975, lng: -80.2528, county: "martin", tier: 3 },
  { name: "Vero Beach", lat: 27.6386, lng: -80.3973, county: "indian-river", tier: 3 },
  { name: "Bonita Springs", lat: 26.3398, lng: -81.7787, county: "lee", tier: 3 },
  { name: "Winter Haven", lat: 28.0222, lng: -81.7329, county: "polk", tier: 3 },
  { name: "Sanford", lat: 28.8003, lng: -81.2733, county: "seminole", tier: 3 },
  { name: "Apopka", lat: 28.6934, lng: -81.5322, county: "orange", tier: 3 },
  { name: "Deland", lat: 29.0283, lng: -81.3031, county: "volusia", tier: 3 },
  { name: "Leesburg", lat: 28.8108, lng: -81.8779, county: "lake", tier: 3 },
];

// ── Search terms ─────────────────────────────────────────────────────────────

export const SEARCH_TEMPLATES: string[] = [
  "grease trap cleaning {city} FL",
  "grease trap pumping {city} FL",
  "grease trap service {city} FL",
  "grease interceptor cleaning {city} FL",
  "FOG compliance service {city} FL",
  "commercial kitchen grease removal {city} FL",
  "grease waste hauler {city} FL",
  "restaurant grease cleaning {city} FL",
];

// ── Grease keywords for verification ─────────────────────────────────────────

export const GREASE_KEYWORDS: string[] = [
  "grease trap",
  "grease interceptor",
  "grease cleaning",
  "grease pumping",
  "grease waste",
  "FOG compliance",
  "trap cleaning",
  "interceptor cleaning",
  "interceptor pumping",
  "grease removal",
  "kitchen grease",
  "grease hauling",
  "cooking oil collection",
  "grease recycling",
  "grease disposal",
  "grease service",
  "trap pumping",
  "trap service",
  "FOG service",
  "commercial grease",
];

// ── Service type matching map ────────────────────────────────────────────────

export const SERVICE_TYPE_MAP: Record<string, string[]> = {
  "grease-trap-cleaning": [
    "grease trap cleaning", "trap cleaning", "grease removal",
    "clean grease trap", "grease trap service", "grease trap maintenance",
  ],
  "grease-interceptor-pumping": [
    "interceptor pumping", "grease interceptor", "interceptor cleaning",
    "interceptor service", "pump interceptor",
  ],
  "hydro-jetting": [
    "hydro jetting", "hydro-jetting", "hydrojet", "water jetting",
    "high pressure jetting", "jet cleaning", "sewer jetting",
  ],
  "emergency-overflow-service": [
    "emergency", "overflow", "24/7", "24 hour", "after hours",
    "same day service", "urgent",
  ],
  "grease-trap-installation": [
    "trap installation", "install grease trap", "new grease trap",
  ],
  "grease-trap-repair-replacement": [
    "trap repair", "fix grease trap", "grease trap repair",
    "baffle repair", "lid replacement",
  ],
  "grease-trap-inspection": [
    "trap inspection", "grease inspection", "FOG inspection",
    "compliance inspection",
  ],
  "used-cooking-oil-collection": [
    "cooking oil", "used oil", "oil collection", "oil recycling",
    "yellow grease", "fryer oil", "waste oil",
  ],
  "drain-line-cleaning": [
    "drain cleaning", "drain line", "sewer cleaning", "clogged drain",
    "drain service", "rooter",
  ],
  "fog-compliance-consulting": [
    "FOG compliance", "compliance consulting", "FOG program",
    "grease management plan", "FOG audit",
  ],
};

// ── Blacklist name keywords ──────────────────────────────────────────────────

export const BLACKLIST_KEYWORDS: string[] = [
  // Original
  "hvac", "pest control", "roofing",
  "painting", "landscaping", "pool", "lawn", "mold", "restoration",
  "demolition", "handyman",
  "home improvement", "appliance", "concrete", "electrical",

  // Franchise/chain names
  "servpro", "servicemaster", "stanley steemer", "mr. rooter", "mr rooter",
  "roto-rooter", "rotorooter", "wind river", "clog kings",

  // Supply/retail stores
  "ferguson", "home depot", "winsupply", "plumbing supply", "supply company",
  "supply store", "bond plumbing supply", "southern supply",

  // Waste/hauling companies (non-grease)
  "waste pro", "gfl environmental", "waste connections", "coastal waste",
  "waste management", "junk removal", "hauling", "dumpster", "roll-off",
  "rolloff", "bin there dump that", "trash removal",

  // Unrelated services
  "air duct", "dryer vent", "carpet", "pressure cleaning", "pressure washing",
  "power washing", "water damage", "flood cleanup", "chimney", "attic",
  "insulation", "car wash", "detailing", "kitchen for rent", "food truck city",
  "tile", "flooring", "remodeling", "renovation", "grout", "epoxy",
  "leak detection", "leak locator", "leak squad", "water treatment",
  "water filtration", "generator", "tractor", "excavating", "paving",
  "sprinkler", "irrigation", "backflow only", "backflow testing",
  "well drilling", "well service", "well pump", "pump repair", "pump service",
  "pump sales", "fire inspector", "fire protection", "environmental consulting",
  "environmental testing", "air conditioning", "ac repair", "refrigeration",
  "garage door", "fence", "locksmith", "moving", "storage", "maid service",
  "cleaning service", "janitorial", "steamer", "steam cleaning",
  "hazardous waste", "medical waste", "solid waste", "recycling center",
  "transfer station", "landfill",
];

// ── Google types to skip (non-service retail/restaurant) ─────────────────────

export const SKIP_GOOGLE_TYPES: string[] = [
  "restaurant", "store", "shopping_mall", "gas_station",
  "car_repair", "car_dealer", "lodging",
];

export const SERVICE_GOOGLE_TYPES: string[] = [
  "plumber", "waste_management", "general_contractor",
  "roofing_contractor", "electrician",
];

// ── Platform emails to exclude ───────────────────────────────────────────────

export const PLATFORM_EMAILS: string[] = [
  "noreply@", "no-reply@", "support@google", "support@facebook",
  "support@yelp", "info@example", "admin@wordpress",
];

// ── User agents for rotation ─────────────────────────────────────────────────

export const USER_AGENTS: string[] = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
];

// ── Scraper target paths ─────────────────────────────────────────────────────

export const TARGET_PATHS: Record<string, string[]> = {
  services: [
    "/services", "/our-services", "/what-we-do", "/commercial-services",
    "/grease-trap", "/grease-trap-cleaning", "/grease-trap-services", "/grease-services",
  ],
  about: ["/about", "/about-us", "/our-company", "/who-we-are"],
  contact: ["/contact", "/contact-us"],
  serviceArea: ["/service-area", "/service-areas", "/areas-we-serve", "/coverage-area"],
  pricing: ["/pricing", "/prices", "/rates", "/cost"],
  faq: ["/faq", "/faqs"],
};

// ── Keyword patterns for link discovery ──────────────────────────────────────

export const LINK_KEYWORDS: string[] = [
  "grease", "trap", "interceptor", "fog", "commercial", "kitchen", "restaurant",
];

// ── HTML elements/classes to remove during text extraction ────────────────────

export const REMOVE_TAGS: string[] = [
  "nav", "header", "footer", "aside", "form", "button", "input",
  "select", "textarea", "script", "style", "noscript", "iframe",
];

export const REMOVE_CLASS_PATTERNS: string[] = [
  "nav", "menu", "header", "footer", "sidebar", "cookie", "popup",
  "modal", "banner", "widget", "social", "share", "comment",
];

// ── Constants ────────────────────────────────────────────────────────────────

export const SCRAPE_CONCURRENCY = 5;
export const SCRAPE_TIMEOUT_MS = 12_000;
export const SCRAPE_DELAY_MS = 1_000;
export const MAX_CHARS_PER_PAGE = 8_000;
export const MAX_CHARS_PER_BUSINESS = 20_000;
export const MAX_KEYWORD_PAGES = 3;
export const API_DELAY_MS = 1_000;
export const MAX_PAGES_PER_QUERY = 3;
export const MAX_RESULTS_PER_PAGE = 20;
export const MAX_REDIRECTS = 5;
export const DESCRIPTION_MAX_CHARS = 300;

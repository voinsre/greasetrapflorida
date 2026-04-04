import { createClient } from "@supabase/supabase-js";
import {
  type City,
  SEARCH_TEMPLATES,
  BLACKLIST_KEYWORDS,
  SKIP_GOOGLE_TYPES,
  SERVICE_GOOGLE_TYPES,
  API_DELAY_MS,
  MAX_PAGES_PER_QUERY,
} from "./config.js";
import { delay, stripPlacesPrefix } from "./utils.js";

// ── Types ────────────────────────────────────────────────────────────────────

export interface PlaceResult {
  id: string; // "places/ChIJ..."
  displayName?: { text: string; languageCode?: string };
  formattedAddress?: string;
  nationalPhoneNumber?: string;
  websiteUri?: string;
  rating?: number;
  userRatingCount?: number;
  location?: { latitude: number; longitude: number };
  businessStatus?: string;
  types?: string[];
  regularOpeningHours?: {
    periods?: Array<{
      open?: { day: number; hour: number; minute: number };
      close?: { day: number; hour: number; minute: number };
    }>;
    weekdayDescriptions?: string[];
  };
}

export interface DiscoveredBusiness {
  placeId: string; // full "places/ChIJ..." format
  shortPlaceId: string; // "ChIJ..." for DB comparison
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
  openingHours: PlaceResult["regularOpeningHours"] | null;
}

export interface DiscoverResult {
  newQueue: DiscoveredBusiness[];
  updateQueue: Array<{ business: DiscoveredBusiness; dbId: string }>;
  closeQueue: Array<{ placeId: string; dbId: string; reason: string }>;
  apiCalls: number;
  totalResults: number;
  duplicatesFiltered: number;
}

// ── Main discovery function ──────────────────────────────────────────────────

export async function discoverBusinesses(
  cities: City[],
  searchTerms: string[],
): Promise<DiscoverResult> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_PLACES_API_KEY is not set");

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  // Load all existing place_ids from Supabase
  const { data: existingRows, error: fetchErr } = await supabase
    .from("businesses")
    .select("id, place_id");
  if (fetchErr) throw new Error(`Failed to fetch existing businesses: ${fetchErr.message}`);

  const existingMap = new Map<string, string>(); // shortPlaceId → db UUID
  for (const row of existingRows ?? []) {
    if (row.place_id) {
      existingMap.set(stripPlacesPrefix(row.place_id), row.id);
    }
  }
  console.log(`Loaded ${existingMap.size} existing place_ids from database`);

  const seenPlaceIds = new Set<string>();
  const newQueue: DiscoveredBusiness[] = [];
  const updateQueue: Array<{ business: DiscoveredBusiness; dbId: string }> = [];
  const closeQueue: Array<{ placeId: string; dbId: string; reason: string }> = [];
  let apiCalls = 0;
  let totalResults = 0;
  let duplicatesFiltered = 0;
  let queryCount = 0;

  for (const city of cities) {
    for (const template of searchTerms) {
      const textQuery = template.replace("{city}", city.name);
      let nextPageToken: string | undefined;

      for (let page = 0; page < MAX_PAGES_PER_QUERY; page++) {
        const body: Record<string, unknown> = {
          textQuery,
          locationBias: {
            circle: {
              center: { latitude: city.lat, longitude: city.lng },
              radius: 50000.0,
            },
          },
          languageCode: "en",
          regionCode: "us",
          maxResultCount: 20,
          includePureServiceAreaBusinesses: true,
        };
        if (nextPageToken) {
          body.pageToken = nextPageToken;
        }

        await delay(API_DELAY_MS);

        const res = await fetch(
          "https://places.googleapis.com/v1/places:searchText",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Goog-Api-Key": apiKey,
              "X-Goog-FieldMask":
                "places.id,places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.websiteUri,places.rating,places.userRatingCount,places.location,places.businessStatus,places.types,places.regularOpeningHours,nextPageToken",
            },
            body: JSON.stringify(body),
          },
        );
        apiCalls++;

        if (!res.ok) {
          console.error(`API error (${res.status}) for query: ${textQuery} page ${page}`);
          break;
        }

        const data = (await res.json()) as {
          places?: PlaceResult[];
          nextPageToken?: string;
        };

        const places = data.places ?? [];
        totalResults += places.length;

        for (const place of places) {
          const fullId = place.id;
          const shortId = stripPlacesPrefix(fullId);

          // Dedup
          if (seenPlaceIds.has(shortId)) {
            duplicatesFiltered++;
            continue;
          }
          seenPlaceIds.add(shortId);

          // Filter: must be in Florida
          const addr = place.formattedAddress ?? "";
          if (!addr.match(/\bFL\b/) && !addr.toLowerCase().includes("florida")) {
            continue;
          }

          // Filter: name blacklist
          const nameLower = (place.displayName?.text ?? "").toLowerCase();
          if (BLACKLIST_KEYWORDS.some((kw) => nameLower.includes(kw))) {
            continue;
          }

          // Filter: skip retail/restaurant without service types
          const types = place.types ?? [];
          const hasSkipType = types.some((t) => SKIP_GOOGLE_TYPES.includes(t));
          const hasServiceType = types.some((t) => SERVICE_GOOGLE_TYPES.includes(t));
          if (hasSkipType && !hasServiceType) {
            continue;
          }

          const business: DiscoveredBusiness = {
            placeId: fullId,
            shortPlaceId: shortId,
            name: place.displayName?.text ?? "Unknown",
            address: addr,
            phone: place.nationalPhoneNumber ?? null,
            website: place.websiteUri ?? null,
            rating: place.rating ?? null,
            reviewCount: place.userRatingCount ?? 0,
            lat: place.location?.latitude ?? null,
            lng: place.location?.longitude ?? null,
            businessStatus: place.businessStatus ?? null,
            types,
            openingHours: place.regularOpeningHours ?? null,
          };

          // Check closed
          if (
            place.businessStatus === "CLOSED_PERMANENTLY" ||
            place.businessStatus === "CLOSED_TEMPORARILY"
          ) {
            const dbId = existingMap.get(shortId);
            if (dbId) {
              closeQueue.push({
                placeId: shortId,
                dbId,
                reason: place.businessStatus,
              });
            }
            continue;
          }

          // New vs existing
          const dbId = existingMap.get(shortId);
          if (dbId) {
            updateQueue.push({ business, dbId });
          } else {
            newQueue.push(business);
          }
        }

        nextPageToken = data.nextPageToken;
        if (!nextPageToken) break;
      }

      queryCount++;
      if (queryCount % 10 === 0) {
        console.log(
          `Progress: ${queryCount} queries | ${apiCalls} API calls | new: ${newQueue.length} | existing: ${updateQueue.length} | closed: ${closeQueue.length}`,
        );
      }
    }
  }

  console.log(
    `\nDiscovery complete:\n` +
    `  API calls: ${apiCalls}\n` +
    `  Total results: ${totalResults}\n` +
    `  New: ${newQueue.length}\n` +
    `  Existing: ${updateQueue.length}\n` +
    `  Closed: ${closeQueue.length}\n` +
    `  Duplicates filtered: ${duplicatesFiltered}`,
  );

  return {
    newQueue,
    updateQueue,
    closeQueue,
    apiCalls,
    totalResults,
    duplicatesFiltered,
  };
}

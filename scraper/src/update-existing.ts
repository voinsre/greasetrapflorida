import { createClient } from "@supabase/supabase-js";
import { API_DELAY_MS } from "./config.js";
import { delay, ensurePlacesPrefix, stripPlacesPrefix } from "./utils.js";
import { scrapeBusinessWebsites } from "./scrape-websites.js";
import { verifyBusiness } from "./verify.js";
import { enrichBusiness } from "./enrich.js";
import type { DiscoveredBusiness } from "./discover.js";

// ── Types ────────────────────────────────────────────────────────────────────

export interface UpdateReport {
  checked: number;
  updated: number;
  deleted: number;
  reScraped: number;
  apiCalls: number;
  errors: string[];
  updatedNames: string[];
  deletedNames: string[];
}

// ── Main update function ─────────────────────────────────────────────────────

export async function updateExistingListings(): Promise<UpdateReport> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_PLACES_API_KEY is not set");

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const report: UpdateReport = {
    checked: 0,
    updated: 0,
    deleted: 0,
    reScraped: 0,
    apiCalls: 0,
    errors: [],
    updatedNames: [],
    deletedNames: [],
  };

  // Fetch all businesses
  const { data: businesses, error: fetchErr } = await supabase
    .from("businesses")
    .select("id, place_id, name, phone, website, rating, review_count");

  if (fetchErr) throw new Error(`Failed to fetch businesses: ${fetchErr.message}`);
  if (!businesses || businesses.length === 0) {
    console.log("No businesses to update");
    return report;
  }

  console.log(`Checking ${businesses.length} existing businesses...`);

  const toRescrape: Array<{
    dbId: string;
    business: DiscoveredBusiness;
    oldWebsite: string | null;
  }> = [];

  for (const biz of businesses) {
    await delay(API_DELAY_MS);

    const fullPlaceId = ensurePlacesPrefix(biz.place_id);
    const url = `https://places.googleapis.com/v1/${fullPlaceId}`;

    try {
      const res = await fetch(url, {
        headers: {
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask":
            "id,displayName,rating,userRatingCount,businessStatus,nationalPhoneNumber,websiteUri,regularOpeningHours",
        },
      });
      report.apiCalls++;
      report.checked++;

      if (!res.ok) {
        if (res.status === 404) {
          // Business no longer exists in Google
          console.log(`Business "${biz.name}" not found on Google — deleting`);
          await supabase.from("businesses").delete().eq("id", biz.id);
          report.deleted++;
          report.deletedNames.push(biz.name);
          continue;
        }
        report.errors.push(`API error ${res.status} for "${biz.name}"`);
        continue;
      }

      const data = await res.json() as {
        id?: string;
        displayName?: { text: string };
        rating?: number;
        userRatingCount?: number;
        businessStatus?: string;
        nationalPhoneNumber?: string;
        websiteUri?: string;
        regularOpeningHours?: DiscoveredBusiness["openingHours"];
      };

      // Check if closed permanently
      if (data.businessStatus === "CLOSED_PERMANENTLY") {
        console.log(`Business "${biz.name}" permanently closed — deleting`);
        await supabase.from("businesses").delete().eq("id", biz.id);
        report.deleted++;
        report.deletedNames.push(biz.name);
        continue;
      }

      // Build update object
      const updates: Record<string, unknown> = {
        rating: data.rating ?? biz.rating,
        review_count: data.userRatingCount ?? biz.review_count,
        updated_at: new Date().toISOString(),
      };

      if (data.nationalPhoneNumber && data.nationalPhoneNumber !== biz.phone) {
        updates.phone = data.nationalPhoneNumber;
        updates.phone_unformatted = data.nationalPhoneNumber.replace(/\D/g, "");
      }

      const websiteChanged =
        data.websiteUri && data.websiteUri !== biz.website;
      if (websiteChanged) {
        updates.website = data.websiteUri;
      }

      if (data.businessStatus) {
        updates.business_status = data.businessStatus;
      }

      if (data.regularOpeningHours) {
        updates.opening_hours = data.regularOpeningHours;
      }

      const { error: updateErr } = await supabase
        .from("businesses")
        .update(updates)
        .eq("id", biz.id);

      if (updateErr) {
        report.errors.push(`Update "${biz.name}": ${updateErr.message}`);
      } else {
        report.updated++;
        report.updatedNames.push(biz.name);
      }

      // Queue for re-scrape if website changed
      if (websiteChanged) {
        toRescrape.push({
          dbId: biz.id,
          business: {
            placeId: fullPlaceId,
            shortPlaceId: stripPlacesPrefix(fullPlaceId),
            name: data.displayName?.text ?? biz.name,
            address: "",
            phone: data.nationalPhoneNumber ?? biz.phone,
            website: data.websiteUri!,
            rating: data.rating ?? biz.rating,
            reviewCount: data.userRatingCount ?? biz.review_count,
            lat: null,
            lng: null,
            businessStatus: data.businessStatus ?? null,
            types: [],
            openingHours: data.regularOpeningHours ?? null,
          },
          oldWebsite: biz.website,
        });
      }

      if (report.checked % 20 === 0) {
        console.log(
          `Progress: ${report.checked}/${businesses.length} checked | ${report.updated} updated | ${report.deleted} deleted`,
        );
      }
    } catch (err) {
      report.errors.push(
        `Error checking "${biz.name}": ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  // Re-scrape businesses with changed websites
  if (toRescrape.length > 0) {
    console.log(`\nRe-scraping ${toRescrape.length} businesses with changed websites...`);
    const scraped = await scrapeBusinessWebsites(
      toRescrape.map((r) => r.business),
    );
    report.reScraped = scraped.length;

    for (let i = 0; i < scraped.length; i++) {
      const scrapedBiz = scraped[i];
      const rescrapeEntry = toRescrape[i];

      const verification = verifyBusiness(rescrapeEntry.business, scrapedBiz);
      const enriched = enrichBusiness(
        rescrapeEntry.business,
        scrapedBiz,
        verification,
      );

      const { error: reErr } = await supabase
        .from("businesses")
        .update({
          description: enriched.description,
          email: enriched.email,
          emergency_24_7: enriched.emergency24_7,
          years_in_business: enriched.yearsInBusiness,
          pricing_signals: enriched.pricingSignals,
          is_verified: enriched.isVerified,
          website_status: enriched.websiteStatus,
          enrichment_confidence:
            enriched.verificationTier === "confirmed" ? "high" : "medium",
          updated_at: new Date().toISOString(),
        })
        .eq("id", rescrapeEntry.dbId);

      if (reErr) {
        report.errors.push(
          `Re-enrich "${rescrapeEntry.business.name}": ${reErr.message}`,
        );
      }
    }
  }

  console.log(
    `\nUpdate complete: ${report.checked} checked, ${report.updated} updated, ${report.deleted} deleted, ${report.reScraped} re-scraped`,
  );

  return report;
}

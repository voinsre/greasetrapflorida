import { createClient } from "@supabase/supabase-js";
import type { EnrichedBusiness } from "./enrich.js";
import type { DiscoveredBusiness } from "./discover.js";
import { generateSlug, ensureUniqueSlug, lookupCounty, slugify } from "./utils.js";

// ── Dedup helpers ───────────────────────────────────────────────────────────

/** Normalize a business name for comparison: lowercase, strip Inc/LLC/Corp/etc. */
function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\b(inc|llc|corp|ltd|co|company|services|service)\b\.?/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Get phone digits (last 10) for comparison */
function normalizePhone(phone: string | null): string | null {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 10 ? digits.slice(-10) : null;
}

/**
 * Remove duplicates within the new batch AND against existing DB records.
 * Keeps the entry with the highest review count when duplicates are found.
 */
function deduplicateBatch(
  businesses: EnrichedBusiness[],
  existingPhones: Set<string>,
  existingNameCounty: Set<string>,
): EnrichedBusiness[] {
  const result: EnrichedBusiness[] = [];
  const seenPhones = new Set<string>();
  const seenNameCity = new Set<string>();
  const seenNameCounty = new Set<string>();

  // Sort by reviewCount descending so we keep the best version
  const sorted = [...businesses].sort(
    (a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0),
  );

  for (const biz of sorted) {
    const phone = normalizePhone(biz.phone);
    const nameNorm = normalizeName(biz.name);
    const countySlug = biz.countySlug ?? lookupCounty(biz.city);
    const nameCityKey = `${nameNorm}|${biz.city.toLowerCase()}`;
    const nameCountyKey = countySlug ? `${nameNorm}|${countySlug}` : null;

    // Check against existing DB — same phone
    if (phone && existingPhones.has(phone)) {
      console.log(`  Dedup (existing phone): skipping "${biz.name}" — phone already in DB`);
      continue;
    }

    // Check against existing DB — same normalized name + county
    if (nameCountyKey && existingNameCounty.has(nameCountyKey)) {
      console.log(`  Dedup (existing name+county): skipping "${biz.name}" in ${countySlug}`);
      continue;
    }

    // Check within batch — same phone
    if (phone && seenPhones.has(phone)) {
      console.log(`  Dedup (batch phone): skipping "${biz.name}" — duplicate phone`);
      continue;
    }

    // Check within batch — same name + same city
    if (seenNameCity.has(nameCityKey)) {
      console.log(`  Dedup (batch name+city): skipping "${biz.name}" in ${biz.city}`);
      continue;
    }

    // Check within batch — same name + same county (nearby city)
    if (nameCountyKey && seenNameCounty.has(nameCountyKey)) {
      console.log(`  Dedup (batch name+county): skipping "${biz.name}" in ${countySlug}`);
      continue;
    }

    // Not a duplicate — keep it
    if (phone) seenPhones.add(phone);
    seenNameCity.add(nameCityKey);
    if (nameCountyKey) seenNameCounty.add(nameCountyKey);
    result.push(biz);
  }

  return result;
}

// ── Types ────────────────────────────────────────────────────────────────────

export interface LoadReport {
  inserted: number;
  updated: number;
  deleted: number;
  insertedNames: string[];
  updatedNames: string[];
  deletedNames: string[];
  errors: string[];
}

// ── Main load function ───────────────────────────────────────────────────────

export async function loadResults(
  newBusinesses: EnrichedBusiness[],
  updates: Array<{ business: DiscoveredBusiness; dbId: string }>,
  closures: Array<{ placeId: string; dbId: string; reason: string }>,
  dryRun: boolean,
): Promise<LoadReport> {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const report: LoadReport = {
    inserted: 0,
    updated: 0,
    deleted: 0,
    insertedNames: [],
    updatedNames: [],
    deletedNames: [],
    errors: [],
  };

  // Load existing slugs for uniqueness check
  const { data: slugRows } = await supabase
    .from("businesses")
    .select("slug");
  const existingSlugs = new Set<string>(
    (slugRows ?? []).map((r) => r.slug as string),
  );

  // Load service type slug → UUID mapping
  const { data: serviceTypeRows } = await supabase
    .from("service_types")
    .select("id, slug");
  const serviceSlugToId = new Map<string, string>(
    (serviceTypeRows ?? []).map((r) => [r.slug as string, r.id as string]),
  );

  // ── DEDUP new businesses before inserting ────────────────────────────────

  // Load existing phones and names for cross-check
  const { data: existingRows } = await supabase
    .from("businesses")
    .select("phone_unformatted, name, county_slug");
  const existingPhones = new Set<string>(
    (existingRows ?? [])
      .map((r) => r.phone_unformatted as string)
      .filter(Boolean),
  );
  const existingNameCounty = new Set<string>(
    (existingRows ?? [])
      .filter((r) => r.name && r.county_slug)
      .map((r) => `${normalizeName(r.name as string)}|${r.county_slug as string}`),
  );

  // Dedup within batch + against existing DB
  const dedupedBusinesses = deduplicateBatch(
    newBusinesses,
    existingPhones,
    existingNameCounty,
  );

  const dedupRemoved = newBusinesses.length - dedupedBusinesses.length;
  if (dedupRemoved > 0) {
    console.log(
      `Dedup: removed ${dedupRemoved} duplicates from batch of ${newBusinesses.length} → ${dedupedBusinesses.length} unique`,
    );
  }

  // ── INSERT new businesses ────────────────────────────────────────────────

  for (const biz of dedupedBusinesses) {
    const baseSlug = generateSlug(biz.name, biz.city);
    const slug = await ensureUniqueSlug(baseSlug, existingSlugs);
    const countySlug = biz.countySlug ?? lookupCounty(biz.city);

    const row = {
      slug,
      name: biz.name,
      phone: biz.phone,
      phone_unformatted: biz.phone?.replace(/\D/g, "") ?? null,
      email: biz.email,
      website: biz.website,
      address: biz.address,
      city: biz.city,
      county_slug: countySlug,
      county: countySlug
        ? countySlug
            .split("-")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ")
        : null,
      state: "Florida",
      state_abbreviation: "FL",
      lat: biz.lat,
      lng: biz.lng,
      description: biz.description,
      rating: biz.rating,
      review_count: biz.reviewCount,
      is_verified: biz.isVerified,
      emergency_24_7: biz.emergency24_7,
      years_in_business: biz.yearsInBusiness,
      pricing_signals: biz.pricingSignals,
      place_id: biz.shortPlaceId,
      opening_hours: biz.openingHours,
      website_status: biz.websiteStatus,
      enrichment_confidence: biz.verificationTier === "confirmed" ? "high" : "medium",
    };

    if (dryRun) {
      console.log(`DRY RUN: Would insert "${biz.name}" in ${biz.city}`);
      report.inserted++;
      report.insertedNames.push(`${biz.name} (${biz.city})`);
      continue;
    }

    const { data: inserted, error: insertErr } = await supabase
      .from("businesses")
      .insert(row)
      .select("id")
      .single();

    if (insertErr) {
      report.errors.push(`Insert "${biz.name}": ${insertErr.message}`);
      continue;
    }

    report.inserted++;
    report.insertedNames.push(`${biz.name} (${biz.city})`);

    // Insert service tags (look up UUID from service_types table)
    if (biz.services.length > 0 && inserted?.id) {
      const serviceTags = biz.services
        .map((slug) => {
          const serviceId = serviceSlugToId.get(slug);
          if (!serviceId) return null;
          return { business_id: inserted.id, service_id: serviceId };
        })
        .filter((t): t is { business_id: string; service_id: string } => t !== null);

      if (serviceTags.length > 0) {
        const { error: svcErr } = await supabase
          .from("business_services")
          .insert(serviceTags);
        if (svcErr) {
          report.errors.push(`Service tags for "${biz.name}": ${svcErr.message}`);
        }
      }
    }

    // Insert service areas
    if (biz.serviceAreas.length > 0 && inserted?.id) {
      const areaRows = biz.serviceAreas.map((area) => ({
        business_id: inserted.id,
        county_slug: slugify(area),
      }));
      const { error: areaErr } = await supabase
        .from("business_service_areas")
        .insert(areaRows);
      if (areaErr) {
        report.errors.push(`Service areas for "${biz.name}": ${areaErr.message}`);
      }
    }
  }

  // ── UPDATE existing businesses ───────────────────────────────────────────

  for (const { business, dbId } of updates) {
    const updateData: Record<string, unknown> = {
      rating: business.rating,
      review_count: business.reviewCount,
      updated_at: new Date().toISOString(),
    };

    if (business.businessStatus) {
      updateData.business_status = business.businessStatus;
    }
    if (business.phone) {
      updateData.phone = business.phone;
      updateData.phone_unformatted = business.phone.replace(/\D/g, "");
    }
    if (business.website) {
      updateData.website = business.website;
    }

    if (dryRun) {
      console.log(`DRY RUN: Would update "${business.name}"`);
      report.updated++;
      report.updatedNames.push(business.name);
      continue;
    }

    const { error: updateErr } = await supabase
      .from("businesses")
      .update(updateData)
      .eq("id", dbId);

    if (updateErr) {
      report.errors.push(`Update "${business.name}": ${updateErr.message}`);
      continue;
    }

    report.updated++;
    report.updatedNames.push(business.name);
  }

  // ── DELETE closed businesses ──────────────────────────────────────────────

  for (const { placeId, dbId, reason } of closures) {
    if (dryRun) {
      console.log(`DRY RUN: Would delete place_id=${placeId} (${reason})`);
      report.deleted++;
      report.deletedNames.push(placeId);
      continue;
    }

    const { error: delErr } = await supabase
      .from("businesses")
      .delete()
      .eq("id", dbId);

    if (delErr) {
      report.errors.push(`Delete place_id=${placeId}: ${delErr.message}`);
      continue;
    }

    report.deleted++;
    report.deletedNames.push(placeId);
  }

  // ── Recalculate counts ───────────────────────────────────────────────────

  if (!dryRun && (report.inserted > 0 || report.deleted > 0)) {
    console.log("Recalculating county and city business counts...");

    // Update county counts
    const { data: counties } = await supabase.from("counties").select("slug");
    for (const county of counties ?? []) {
      const { count } = await supabase
        .from("businesses")
        .select("id", { count: "exact", head: true })
        .eq("county_slug", county.slug);

      await supabase
        .from("counties")
        .update({ business_count: count ?? 0 })
        .eq("slug", county.slug);
    }

    // Update city counts (businesses.city stores name, not slug)
    const { data: cities } = await supabase.from("cities").select("slug, name, county_slug");
    for (const city of cities ?? []) {
      const { count } = await supabase
        .from("businesses")
        .select("id", { count: "exact", head: true })
        .eq("county_slug", city.county_slug)
        .ilike("city", city.name);

      await supabase
        .from("cities")
        .update({ business_count: count ?? 0 })
        .eq("slug", city.slug);
    }

    // Delete cities with business_count < 2
    const { data: smallCities, error: smallErr } = await supabase
      .from("cities")
      .select("slug, name, business_count")
      .lt("business_count", 2);

    if (!smallErr && smallCities && smallCities.length > 0) {
      console.log(
        `Removing ${smallCities.length} cities with < 2 businesses: ${smallCities.map((c) => c.name).join(", ")}`,
      );
      await supabase
        .from("cities")
        .delete()
        .lt("business_count", 2);
    }
  }

  console.log(
    `\nLoad complete: inserted ${report.inserted}, updated ${report.updated}, deleted ${report.deleted}` +
      (report.errors.length > 0
        ? ` (${report.errors.length} errors)`
        : ""),
  );

  return report;
}

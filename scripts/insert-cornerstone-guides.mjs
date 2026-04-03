import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env.local manually
const envPath = join(__dirname, "..", ".env.local");
const envContent = readFileSync(envPath, "utf-8");
for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eqIdx = trimmed.indexOf("=");
  if (eqIdx === -1) continue;
  const key = trimmed.slice(0, eqIdx).trim();
  const val = trimmed.slice(eqIdx + 1).trim();
  if (!process.env[key]) process.env[key] = val;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const guides = [
  // ─── GUIDE 1: Chapter 62-705 Compliance Guide ───
  {
    slug: "chapter-62-705-compliance-guide",
    title: "Florida Grease Waste Law: Chapter 62-705 Compliance Guide",
    excerpt:
      "A plain-English guide to Florida's Chapter 62-705 grease waste law — what it requires, who it applies to, the manifest system, penalties, and how restaurant owners can stay compliant.",
    category: "guide",
    image_url: "/images/guide-compliance.webp",
    meta_title: "Chapter 62-705 Compliance Guide - GreaseTrapFlorida",
    meta_description:
      "Understand Florida's Chapter 62-705 grease waste law. Learn what restaurants must do, the manifest system, penalty structure, and how to verify DEP-licensed haulers.",
    published_at: new Date().toISOString(),
    content: `# Florida Grease Waste Law: Chapter 62-705 Compliance Guide

Florida's Chapter 62-705 of the Florida Administrative Code is the state regulation governing grease waste removal and disposal. Effective December 7, 2025, this law requires every food service establishment that generates grease waste to use only Florida DEP-licensed haulers, maintain proper manifests for every pump-out, and follow strict disposal procedures — with fines ranging from $100 to $5,000 per violation for non-compliance.

If you own or manage a restaurant, hotel kitchen, school cafeteria, hospital kitchen, or any commercial food preparation facility in Florida, this guide explains exactly what you need to know to stay compliant.

## What Is Chapter 62-705?

Chapter 62-705 F.A.C. (Florida Administrative Code) is the implementing regulation for Section 403.0741 of the Florida Statutes, formally titled "Grease Waste Removal and Disposal." The Florida Department of Environmental Protection (DEP) is the enforcement agency.

The regulation creates a structured system for tracking grease waste from the point of generation (your restaurant) through transportation to final disposal at a permitted facility. It establishes licensing requirements for haulers, documentation requirements for every service visit, and penalties for violations at every level of the chain.

Before December 2025, grease waste hauling in Florida operated under a patchwork of county-level ordinances with minimal state oversight. Chapter 62-705 standardizes requirements statewide, closing gaps that led to illegal dumping and environmental contamination.

## Who Does Chapter 62-705 Apply To?

The law defines three categories of regulated parties:

### 1. Originators (Food Service Establishments)

An originator is any facility that generates grease waste requiring removal. This includes:

- Full-service and fast-food restaurants
- Hotel and resort kitchens
- Hospital and nursing home kitchens
- School and university cafeterias
- Catering companies and commissary kitchens
- Food trucks with grease traps
- Shopping mall food courts
- Corporate cafeterias
- Bakeries and delis
- Bars and nightclubs with food preparation

If your establishment has a grease trap or grease interceptor, you are an originator under Chapter 62-705.

### 2. Haulers (Grease Waste Transporters)

Any company that pumps, collects, and transports grease waste must hold a valid DEP Grease Waste Transporter license. This is a new state-level requirement — previously, many haulers operated only under county permits. After December 7, 2025, operating without a DEP license is a violation subject to fines and cease-and-desist orders.

### 3. Disposal Facilities

Facilities that receive and process grease waste must hold DEP permits for that activity. This includes wastewater treatment plants with FOG (fats, oils, and grease) receiving stations, rendering plants, and approved recycling facilities.

## The Manifest System: Form 62-705.300(3)

The backbone of Chapter 62-705 compliance is the manifest system. Every grease waste pump-out must be documented on DEP Form 62-705.300(3), a multi-part carbon form that tracks the waste from origin to disposal.

### What the Manifest Records

Each manifest documents:

- **Originator information:** Name and address of the food service establishment, grease trap or interceptor size, and the date and time of service
- **Hauler information:** Company name, DEP license number, vehicle identification, driver name, and volume of waste removed (in gallons)
- **Disposal information:** Name and permit number of the receiving facility, date of delivery, and volume accepted

### How the Manifest Works

The manifest is a triple-carbon form with three copies:

1. **White copy (original):** Stays with the disposal facility
2. **Yellow copy:** Returned to the originator (you, the restaurant owner)
3. **Pink copy:** Retained by the hauler

Your hauler should provide your copy at the time of service or within a reasonable period. You are required to keep your manifest copies on file and available for inspection.

### Why the Manifest Matters

The manifest creates a paper trail that prevents illegal dumping. Before this system, some unlicensed operators would pump grease traps and dump the waste into storm drains, vacant lots, or unauthorized locations. The manifest ensures every gallon of grease waste is accounted for from pickup to proper disposal.

**Important for restaurant owners:** If your hauler does not provide a manifest, that is a red flag. You should request one and, if they cannot provide it, consider switching to a [compliant service provider](/companies).

## Penalty Structure

Chapter 62-705 establishes a tiered penalty structure for violations:

| Violation Type | Fine Range | Notes |
|---|---|---|
| Operating without a DEP hauler license | $500 - $5,000 | Per occurrence |
| Failure to complete manifest | $100 - $1,000 | Per missing manifest |
| Improper disposal of grease waste | $1,000 - $5,000 | Per incident |
| Originator using unlicensed hauler | $100 - $500 | Per service event |
| Failure to maintain records | $100 - $500 | Per inspection finding |
| Repeat violations | Up to $5,000 | Enhanced penalties apply |

### What This Means for Restaurant Owners

The most common violation risk for restaurant owners is using an unlicensed hauler. Even if you did not know your hauler lacked a DEP license, you can still be fined $100 to $500 per service event. This makes it essential to verify your hauler's license status before signing a service contract.

Additionally, failure to maintain your manifest copies can result in fines during a county or DEP inspection. Keep your manifests organized and accessible — a simple file folder behind the manager's desk is sufficient.

## Enforcement Timeline

- **December 7, 2025:** Chapter 62-705 became effective
- **January - June 2026:** DEP education and outreach period — inspectors focus on informing businesses of new requirements
- **July 2026 onward:** Full enforcement expected with routine inspections and penalties for non-compliance

The DEP has indicated that the first six months after the effective date would prioritize education over punishment. However, this grace period does not apply to egregious violations such as illegal dumping or operating a hauling business without a license.

As of April 2026, the DEP is still building its licensed hauler registry. Some legitimate haulers may still be in the application process. However, you should confirm that your hauler has at least applied for their DEP license.

## What Restaurant Owners Must Do to Comply

Here is your compliance checklist under Chapter 62-705:

### 1. Verify Your Hauler Is DEP Licensed

Contact your current grease trap service company and ask for their DEP Grease Waste Transporter license number. You can verify this through the [Florida DEP website](https://floridadep.gov/waste/permitting-compliance-assistance/content/grease-waste). If your hauler is not licensed or cannot provide a license number, begin searching for a compliant alternative through our [company directory](/companies).

### 2. Ensure You Receive Manifests

After every pump-out, you should receive your copy of DEP Form 62-705.300(3). If your hauler does not provide this automatically, request it in writing. Document the request in case of a future inspection.

### 3. Maintain Your Records

Keep all manifest copies on file for a minimum of three years. Organize them chronologically. During an inspection, you will need to produce these records on request.

### 4. Follow Your County's Cleaning Schedule

Chapter 62-705 sets the state baseline, but many Florida counties have stricter local FOG (fats, oils, and grease) ordinances. For example:

- **Miami-Dade County:** Grease traps must be cleaned before reaching 25% capacity
- **Pinellas County:** Monthly cleaning required for interceptors
- **Hillsborough County:** Cleaning required every 90 days
- **Sarasota County:** 30 days for traps, 90 days for interceptors

Check your [county's specific requirements](/county) to ensure you meet both state and local standards. Our [cleaning frequency guide](/guides/grease-trap-cleaning-frequency-florida) covers county-by-county requirements in detail.

### 5. Keep Your Trap in Good Condition

A damaged or malfunctioning grease trap can lead to overflows, which are environmental violations under both Chapter 62-705 and local wastewater ordinances. Schedule regular inspections and address repairs promptly.

### 6. Post Contact Information

Some counties require that the grease trap service company's contact information be posted near the trap. Even where not required, this is a best practice — it allows your kitchen staff to report issues quickly and helps inspectors verify your service provider.

## How to Verify a Hauler Is DEP Licensed

Verifying your hauler's license status is the single most important compliance step you can take. Here is how:

1. **Ask your hauler directly.** A legitimate, licensed hauler will provide their DEP license number without hesitation. If they dodge the question or claim they don't need one, that is a major red flag.

2. **Check the DEP registry.** The Florida DEP maintains a list of licensed grease waste transporters at [floridadep.gov/waste](https://floridadep.gov/waste/permitting-compliance-assistance/content/grease-waste). As of early 2026, the registry is still being populated as haulers complete the licensing process.

3. **Verify insurance.** Licensed haulers are required to carry liability insurance. Ask for a certificate of insurance naming your establishment as additionally insured.

4. **Check for a manifest.** If a hauler provides DEP Form 62-705.300(3) with their license number printed on it, that is strong evidence of compliance.

5. **Use our directory.** Our [company directory](/companies) lists grease trap service providers across Florida. We track DEP license verification status and display it on each listing, making it easier for you to find compliant providers in your area.

## Common Compliance Mistakes to Avoid

- **Assuming your hauler is licensed** because they have been in business for years. The DEP license is a new requirement — longevity does not guarantee compliance.
- **Not keeping manifest copies.** Even if your hauler keeps their copy, you need yours.
- **Ignoring county requirements.** Meeting the state standard does not automatically satisfy your county's FOG ordinance if it is stricter.
- **Waiting until you are inspected.** Proactive compliance is far cheaper than reactive fines.
- **Signing long-term contracts** without verifying the hauler's DEP license first.

## The Cost of Compliance vs. Non-Compliance

Staying compliant with Chapter 62-705 is straightforward and affordable. Regular grease trap cleaning typically costs [$200 to $500 per pump-out](/guides/grease-trap-cleaning-cost-florida), and maintaining manifests costs nothing beyond basic filing.

Non-compliance, on the other hand, can cost $100 to $5,000 per violation, damage your health inspection score, result in temporary closure orders, and create environmental liability. The math is clear: compliance wins every time.

## Frequently Asked Questions

### When did Chapter 62-705 go into effect?

Chapter 62-705 became effective on December 7, 2025. The Florida DEP began an education and outreach period in early 2026, with full enforcement expected by mid-2026.

### Does Chapter 62-705 apply to food trucks?

Yes. Any food service establishment that generates grease waste and uses a grease trap or interceptor is covered under Chapter 62-705, including food trucks with grease management systems.

### What happens if my hauler is not DEP licensed?

If you use an unlicensed hauler, you (the originator) can be fined $100 to $500 per service event, even if you did not know the hauler was unlicensed. Your hauler faces separate fines of $500 to $5,000.

### How long must I keep manifest records?

You should keep manifest copies for a minimum of three years. Some counties may require longer retention periods under their local FOG ordinances.

### Can I clean my own grease trap to avoid hiring a hauler?

You can perform routine maintenance such as scraping and skimming between professional pump-outs, but the actual removal and disposal of grease waste must be performed by a DEP-licensed hauler. You cannot legally transport grease waste yourself unless you hold a DEP Grease Waste Transporter license.
`,
  },

  // ─── GUIDE 2: Grease Trap Cleaning Cost in Florida ───
  {
    slug: "grease-trap-cleaning-cost-florida",
    title: "Grease Trap Cleaning Cost in Florida (2026)",
    excerpt:
      "A detailed breakdown of grease trap cleaning costs in Florida — by trap type, frequency, metro area, and what factors affect your price.",
    category: "guide",
    image_url: "/images/guide-cost.webp",
    meta_title: "Grease Trap Cleaning Cost Florida (2026)",
    meta_description:
      "How much does grease trap cleaning cost in Florida? Expect $200-$500 per pump-out or $2,000-$10,000/year. See costs by trap type, area, and frequency.",
    published_at: new Date().toISOString(),
    content: `# Grease Trap Cleaning Cost in Florida (2026)

Grease trap cleaning in Florida typically costs between $200 and $500 per pump-out for a standard service visit. Annual service contracts for commercial kitchens range from $2,000 to $10,000 per year depending on trap size, cleaning frequency, and location. These prices reflect the Florida market as of early 2026, factoring in the new DEP licensing requirements under Chapter 62-705.

Understanding what drives these costs helps you budget accurately and avoid overpaying. This guide breaks down pricing by trap type, frequency, metro area, and the specific factors that affect your bill.

## Cost by Trap Type

The single biggest factor in grease trap cleaning cost is whether you have an interior (under-sink) grease trap or an outdoor underground grease interceptor. These are fundamentally different pieces of equipment with very different service requirements.

### Interior Grease Traps (Under-Sink)

Interior grease traps are small units installed under three-compartment sinks or dishwasher drain lines. They typically range from 20 to 100 gallons in capacity.

| Trap Size | Cost per Pump-Out | Typical Frequency |
|---|---|---|
| 20-40 gallons | $150 - $250 | Weekly to biweekly |
| 40-75 gallons | $200 - $350 | Biweekly to monthly |
| 75-100 gallons | $250 - $400 | Monthly |

Interior traps are faster to service — a technician can typically pump and clean a small under-sink trap in 20 to 30 minutes. However, because they fill up faster, they need more frequent cleaning, which can make annual costs comparable to larger interceptors.

**Annual cost estimate for interior traps:** $2,400 to $6,000 (assuming monthly to biweekly cleaning).

### Underground Grease Interceptors

Underground grease interceptors are large concrete or fiberglass vaults installed outside the building, typically in the parking lot or beside the building. They range from 500 to 2,500 gallons or more.

| Interceptor Size | Cost per Pump-Out | Typical Frequency |
|---|---|---|
| 500-750 gallons | $300 - $450 | Monthly to quarterly |
| 750-1,500 gallons | $400 - $600 | Quarterly |
| 1,500-2,500 gallons | $500 - $800 | Quarterly to semi-annual |
| 2,500+ gallons | $700 - $1,200 | Per county requirement |

Underground interceptors require a vacuum truck to pump, which adds to the cost. Service visits typically take 30 to 60 minutes depending on size, access, and condition.

**Annual cost estimate for underground interceptors:** $1,800 to $10,000+ (depending on size and required frequency).

### Automatic Grease Removal Devices (AGRDs)

Some newer commercial kitchens use automatic grease removal devices — mechanical units that skim grease continuously and deposit it into a collection container. These still require periodic professional maintenance.

| Service Type | Cost | Frequency |
|---|---|---|
| Collection container swap | $75 - $150 | Weekly to biweekly |
| Full system maintenance | $200 - $400 | Quarterly |
| Annual service contract | $1,500 - $3,000 | Annual |

AGRDs have lower per-visit costs but require more frequent attention. They are less common in Florida than traditional traps and interceptors.

## Cost by Cleaning Frequency

How often you clean directly affects your annual cost — but it also affects your per-visit cost. Most service companies offer volume discounts for more frequent cleaning schedules.

| Frequency | Per-Visit Cost (Typical) | Annual Cost (Typical) | Best For |
|---|---|---|---|
| Weekly | $150 - $250 | $7,800 - $13,000 | High-volume restaurants, 24-hour diners |
| Biweekly | $175 - $300 | $4,550 - $7,800 | Busy full-service restaurants |
| Monthly | $200 - $400 | $2,400 - $4,800 | Average-volume restaurants, cafeterias |
| Quarterly | $300 - $600 | $1,200 - $2,400 | Low-volume establishments, bakeries |

Notice the per-visit cost decreases at higher frequencies because the trap has less buildup each time, reducing the labor and disposal volume. Many haulers offer 10% to 20% discounts on service contracts versus one-off service calls.

## Cost by Metro Area

Grease trap cleaning costs vary by region in Florida due to differences in the local cost of living, competition density, disposal facility distances, and county-specific requirements.

### South Florida (Miami-Dade, Broward, Palm Beach)

| Service | Price Range |
|---|---|
| Interior trap pump-out | $200 - $350 |
| Underground interceptor pump-out | $350 - $650 |
| Annual contract (average restaurant) | $3,000 - $7,500 |

South Florida tends to be the most expensive market due to higher operating costs, traffic (which affects service time), and strict local FOG ordinances. Miami-Dade's 25% capacity rule means more frequent cleaning is often needed. Find [South Florida providers](/county/miami-dade) in our directory.

### Tampa Bay Area (Hillsborough, Pinellas, Pasco)

| Service | Price Range |
|---|---|
| Interior trap pump-out | $175 - $300 |
| Underground interceptor pump-out | $300 - $550 |
| Annual contract (average restaurant) | $2,500 - $6,000 |

Tampa Bay is a competitive market with many established haulers. Pinellas County's monthly interceptor requirement drives higher annual costs for businesses in that county. Browse [Hillsborough County](/county/hillsborough) and [Pinellas County](/county/pinellas) providers.

### Central Florida (Orange, Osceola, Seminole)

| Service | Price Range |
|---|---|
| Interior trap pump-out | $175 - $300 |
| Underground interceptor pump-out | $300 - $500 |
| Annual contract (average restaurant) | $2,400 - $5,500 |

The Orlando metro area has moderate pricing with good competition among haulers. Tourism-driven restaurants in the theme park corridors may pay premium rates for guaranteed scheduling. See [Orange County](/county/orange) providers.

### Jacksonville / Northeast Florida (Duval, St. Johns, Clay)

| Service | Price Range |
|---|---|
| Interior trap pump-out | $175 - $275 |
| Underground interceptor pump-out | $275 - $500 |
| Annual contract (average restaurant) | $2,200 - $5,000 |

Northeast Florida generally has lower costs than South Florida, driven by lower operating costs and the JEA Preferred Hauler Program in Duval County which promotes competition. See [Duval County](/county/duval) providers.

### Southwest Florida (Lee, Collier, Sarasota)

| Service | Price Range |
|---|---|
| Interior trap pump-out | $200 - $325 |
| Underground interceptor pump-out | $300 - $550 |
| Annual contract (average restaurant) | $2,600 - $6,500 |

Southwest Florida pricing is moderate to high, influenced by the rapid growth of the restaurant industry in the Naples and Fort Myers areas. Sarasota County's strict 30/90-day cleaning requirement increases annual costs. See [Sarasota County](/county/sarasota) providers.

### North Florida / Panhandle (Leon, Escambia, Bay)

| Service | Price Range |
|---|---|
| Interior trap pump-out | $150 - $275 |
| Underground interceptor pump-out | $250 - $450 |
| Annual contract (average restaurant) | $1,800 - $4,500 |

The Panhandle region generally has the lowest grease trap cleaning costs in Florida due to lower cost of living and less stringent local FOG ordinances.

## What Affects Your Cost

Beyond trap type and location, several factors influence what you will pay:

### 1. Trap Size (Gallons)

The most straightforward cost driver. Larger traps hold more grease waste, requiring more vacuum truck capacity and longer service time. A 2,000-gallon interceptor costs roughly two to three times more per pump-out than a 500-gallon unit.

### 2. Access Difficulty

If your grease interceptor is buried under a dumpster pad, a delivery truck is parked over the lid, or the access cover is in a tight alley, expect to pay $50 to $150 more per visit. Some haulers charge an "access surcharge" for difficult-to-reach traps. Keep your trap access clear to avoid this charge.

### 3. Trap Condition

A well-maintained trap that is cleaned on schedule is a quick, straightforward job. A neglected trap with hardened grease, corroded baffles, or a damaged lid takes longer to service and may require additional charges for:

- Extra pumping time: $50 - $100
- Baffle cleaning or scraping: $50 - $150
- Hydro jetting the lines: $200 - $500 (separate service)
- Emergency response: $100 - $300 premium over scheduled rate

### 4. Cleaning Frequency

As noted above, more frequent cleaning means less buildup per visit, which reduces per-visit cost. Conversely, a trap that is cleaned only once or twice a year will have significant buildup requiring more labor and disposal volume.

### 5. Emergency vs. Scheduled Service

Emergency grease trap cleaning — typically due to an overflow, backup, or pre-inspection panic — costs 50% to 100% more than a scheduled visit. Emergency response fees of $100 to $300 are standard, and after-hours or weekend service adds another premium.

**The takeaway:** Scheduled, preventive maintenance is always cheaper than emergency response. If you are not sure how often your trap needs cleaning, our [frequency guide](/guides/grease-trap-cleaning-frequency-florida) can help you set the right schedule.

### 6. Contract vs. One-Off

Service contracts (also called maintenance agreements) typically cost 10% to 20% less per visit than one-off service calls. Contracts also guarantee scheduling priority, which matters if you need service before an inspection or during peak season.

### 7. Disposal Fees

Some haulers include disposal fees in their per-visit price; others itemize them separately. Disposal fees depend on the distance to the nearest permitted receiving facility and the current tipping fee (typically $0.03 to $0.08 per gallon). Ask your hauler whether disposal is included in their quoted price.

## Tips for Reducing Grease Trap Cleaning Costs

### 1. Get on a Regular Schedule

The most effective cost reduction strategy is consistent, preventive maintenance. Cleaning before the trap reaches 25% capacity (the Miami-Dade standard, and a good rule of thumb statewide) means faster service visits and less waste volume.

### 2. Train Kitchen Staff

Proper kitchen practices dramatically reduce grease trap buildup:

- Scrape plates and pans into the trash before washing
- Use sink strainers to catch food solids
- Never pour oil or grease directly down the drain
- Collect used cooking oil in a separate container for recycling

These simple practices can extend your cleaning interval by 25% to 50%, directly reducing annual costs.

### 3. Get Competitive Quotes

Don't accept the first price you are offered. Get quotes from at least three [DEP-licensed providers](/companies) in your area. Be specific about your trap type, size, and desired frequency so you can compare apples to apples.

### 4. Ask About Contract Discounts

If you commit to a service contract (typically 12 months), most haulers will offer 10% to 20% off the per-visit rate. Multi-location discounts are also common if you manage multiple restaurants.

### 5. Keep Access Clear

A simple step that saves real money. If the hauler's truck can park within 50 feet of your trap and the access cover is clear and accessible, service is faster and there are no access surcharges. Coordinate with your team to keep the area clear on service days.

### 6. Combine Services

If you need grease trap cleaning, used cooking oil collection, and drain line cleaning, using the same provider for all three often qualifies for a bundled discount of 10% to 15%.

## When to Get Competitive Quotes

You should actively shop for a new provider or renegotiate your current contract when:

- **Your current hauler cannot provide a DEP license number.** Under [Chapter 62-705](/guides/chapter-62-705-compliance-guide), using an unlicensed hauler exposes you to fines.
- **Prices have increased more than 10% year-over-year** without a clear explanation.
- **Service quality has declined** — missed appointments, incomplete cleaning, no manifests provided.
- **You are opening a new location** — this is the best time to negotiate competitive rates.
- **Your contract is expiring** — use the renewal as leverage to compare market rates.

Our [company directory](/companies) lists grease trap service providers across all 67 Florida counties. You can filter by county, service type, and DEP license status to find qualified providers in your area. Our guide on [how to choose a grease trap service](/guides/how-to-choose-grease-trap-service) walks you through evaluating providers.

## Frequently Asked Questions

### How much does a one-time grease trap cleaning cost in Florida?

A one-time (non-contract) grease trap cleaning typically costs $200 to $500 for a standard pump-out. Interior under-sink traps start around $150 to $250, while large underground interceptors can cost $500 to $1,200 depending on size and condition.

### Is it cheaper to clean a grease trap more frequently?

Yes, per-visit. Each visit removes less buildup, so it takes less time and generates less waste volume. However, the total annual cost increases with frequency. The sweet spot is the minimum frequency that keeps your trap below 25% capacity and satisfies your county's requirements.

### Do grease trap cleaning companies charge for disposal?

Some include disposal in their per-visit price, while others itemize it separately. Disposal typically adds $0.03 to $0.08 per gallon on top of the service fee. Always ask whether disposal is included in the quoted price.

### How much does an emergency grease trap cleaning cost?

Emergency service typically costs 50% to 100% more than a scheduled visit. Expect to pay $400 to $800 or more for an emergency pump-out, including response fees and after-hours premiums. Staying on a regular cleaning schedule is the best way to avoid emergency costs.

### Can I negotiate grease trap cleaning prices?

Absolutely. Most haulers will negotiate, especially for service contracts, multi-location accounts, or high-frequency cleaning schedules. Get quotes from at least three providers and use them as leverage. The market is competitive in most Florida metro areas.
`,
  },

  // ─── GUIDE 3: How to Choose a Grease Trap Service Company ───
  {
    slug: "how-to-choose-grease-trap-service",
    title: "How to Choose a Grease Trap Service Company in Florida",
    excerpt:
      "A decision framework for selecting a grease trap cleaning company in Florida — from DEP licensing to pricing transparency to red flags to watch for.",
    category: "guide",
    image_url: "/images/guide-choosing.webp",
    meta_title: "How to Choose a Grease Trap Service - Guide",
    meta_description:
      "Learn how to evaluate and choose the right grease trap cleaning company in Florida. DEP licensing, pricing, emergency service, manifests, and red flags.",
    published_at: new Date().toISOString(),
    content: `# How to Choose a Grease Trap Service Company in Florida

Choosing the right grease trap service company in Florida comes down to three non-negotiable requirements: a valid Florida DEP Grease Waste Transporter license, consistent manifest documentation for every service visit, and the capacity to meet your county's specific cleaning frequency requirements. Everything else — pricing, scheduling convenience, extra services — matters only after those three boxes are checked.

With Florida's Chapter 62-705 grease waste regulation now in effect, the stakes of choosing the wrong provider are higher than ever. Using an unlicensed hauler can result in fines of $100 to $500 per service event for your business, even if you did not know the hauler was unlicensed. This guide walks you through a systematic evaluation process so you can choose confidently.

## Step 1: Verify DEP Licensing

This is the single most important step. Since December 7, 2025, every grease waste hauler in Florida must hold a valid DEP Grease Waste Transporter license under [Chapter 62-705](/guides/chapter-62-705-compliance-guide).

### How to Verify

1. **Ask directly.** Call or email the company and request their DEP license number. A legitimate, licensed hauler will provide this without hesitation.
2. **Check the DEP registry.** Visit the Florida DEP website at [floridadep.gov/waste](https://floridadep.gov/waste/permitting-compliance-assistance/content/grease-waste) and search for the company name or license number.
3. **Look for it on their truck.** Licensed haulers are required to display their DEP license information on their service vehicles.
4. **Check their manifests.** DEP Form 62-705.300(3) requires the hauler's license number to be printed on every manifest.

### Red Flag

If a company says they don't need a DEP license, claims they are "grandfathered in," or cannot produce a license number, do not use them. There is no grandfather clause in Chapter 62-705. Every hauler must be licensed, regardless of how long they have been in business.

## Step 2: Confirm Manifest Compliance

Under Chapter 62-705, every grease waste pump-out must be documented on DEP Form 62-705.300(3). Your hauler is responsible for completing the manifest and providing you with your copy (the yellow carbon).

### What to Ask

- "Do you provide DEP Form 62-705.300(3) manifests for every service visit?"
- "Will I receive my copy at the time of service or within how many days?"
- "Do you keep digital copies as backup?"

### Why This Matters

Manifests are your proof of compliance. During an inspection, you will be asked to produce them. If your hauler does not provide manifests, you have no documentation that your grease waste was legally removed and properly disposed of. This exposes you to fines and potential liability.

A good hauler views manifest compliance as a fundamental part of their service, not an afterthought. If a company seems annoyed or confused by manifest questions, that tells you something about their professionalism and compliance awareness.

## Step 3: Check Insurance Coverage

Grease trap servicing involves working with heavy equipment, vacuum trucks, and potentially hazardous waste. Accidents happen — a vacuum hose can damage your parking lot, a truck can clip your building, or a spill can contaminate your property.

### What to Request

- **Certificate of Insurance (COI)** naming your business as additionally insured
- **General liability coverage:** Minimum $1,000,000 per occurrence is standard in the industry
- **Auto liability:** Covers damage caused by their vehicles on your property
- **Pollution liability:** Covers environmental damage from spills during service

### Why This Matters

If an uninsured or underinsured hauler causes damage to your property or an environmental spill on your premises, you could be financially responsible. A proper COI transfers that risk to the hauler's insurance carrier, where it belongs.

## Step 4: Evaluate Emergency Availability

Grease trap emergencies — overflows, backups, and blockages — happen outside business hours, on weekends, and on holidays. When your kitchen is flooding with grease, you need a provider who answers the phone.

### What to Ask

- "Do you offer 24/7 emergency service?"
- "What is your typical emergency response time?"
- "Is there an after-hours surcharge, and if so, how much?"
- "Do I call the same number or a separate emergency line?"

### What "Good" Looks Like

The best grease trap service companies offer:

- A live person answering emergency calls (not just voicemail)
- Response time of 2 to 4 hours for emergencies
- Transparent after-hours pricing (typically 50% to 100% premium over scheduled rates)
- Emergency service included in the service contract at a pre-agreed rate

If a company does not offer emergency service, that does not necessarily disqualify them — but you should have a backup provider identified for emergencies. Check our [directory](/companies) for providers with 24/7 emergency availability.

## Step 5: Assess Pricing Transparency

Grease trap cleaning is a straightforward service. There is no reason for pricing to be mysterious or confusing.

### What to Ask

- "What is your per-visit price for my trap type and size?"
- "Is disposal included in that price, or is it billed separately?"
- "Do you charge access surcharges? Under what conditions?"
- "What are your service contract rates versus one-off rates?"
- "Do you offer multi-location discounts?"

### Red Flags in Pricing

- **Refusal to provide a written quote.** Every legitimate hauler should provide a written estimate after learning your trap type, size, and cleaning frequency.
- **Prices significantly below market.** If a quote is 40% or more below competitors, question why. Are they licensed? Insured? Actually disposing of the waste legally? The [cost guide](/guides/grease-trap-cleaning-cost-florida) covers typical Florida pricing ranges.
- **Hidden fees.** Legitimate costs like fuel surcharges, disposal fees, and access charges should be disclosed upfront, not added after the fact.
- **Requiring payment before service.** Standard industry practice is payment upon completion or net-30 invoicing for contract customers.

## Step 6: Confirm Service Area Coverage

Florida is a large state, and many grease trap service companies operate in specific regions. Make sure the company you choose actually services your location regularly — not as an occasional trip that might get deprioritized.

### What to Ask

- "Is my location within your primary service area?"
- "How many other customers do you service in my area?"
- "Do you charge travel fees for my location?"

### Why This Matters

A company based in Miami that occasionally services a customer in Sarasota is more likely to reschedule or delay your service than a company based in Tampa that services Sarasota daily. Look for providers that list your county or city as a primary service area, not a fringe territory.

Browse providers by location in our [county directory](/county) to find companies that regularly service your area.

## Step 7: Evaluate Equipment Capabilities

The right equipment matters for efficient, thorough service.

### What Good Equipment Looks Like

- **Vacuum truck:** A well-maintained vacuum truck with sufficient tank capacity for your interceptor size. For large interceptors (1,500+ gallons), the truck should have at least matching capacity to complete the job in one visit.
- **Hydro jetting capability:** High-pressure water jetting for cleaning grease-clogged drain lines. Not every visit requires it, but your provider should have the capability.
- **Proper hose lengths:** The vacuum hose must reach from where the truck can park to your trap. If your trap is 100+ feet from the nearest truck access, confirm the company has sufficient hose.
- **Spill containment:** Drip pans, absorbent materials, and proper hose connections to prevent spills on your property.

### Ask About Their Fleet

- "What size vacuum truck do you use?"
- "Do you have hydro jetting equipment?"
- "How many trucks are in your fleet?" (Indicates reliability — a single-truck operation is more vulnerable to breakdowns and scheduling conflicts)

## Step 8: Check References and Reviews

Past performance is the best predictor of future service quality.

### Where to Check

- **Google reviews:** Look for patterns in recent reviews (last 12 months). A few negative reviews are normal; a pattern of complaints about missed appointments, poor communication, or billing disputes is concerning.
- **Industry references:** Ask the company for references from businesses similar to yours (same trap type, similar volume, same county).
- **County environmental department:** Some counties maintain lists of haulers with compliance issues or complaints on file.

### What to Look For in Reviews

- Consistent scheduling reliability
- Professional, clean service (no mess left behind)
- Good communication (confirmation calls, manifest delivery)
- Fair resolution of disputes or issues

## Step 9: Review Contract Terms

Before signing a service contract, read the terms carefully.

### Key Contract Terms to Examine

- **Contract length:** 12 months is standard. Avoid contracts longer than 24 months — the market changes, and you want the ability to renegotiate.
- **Cancellation terms:** Look for 30-day written notice provisions. Avoid contracts with early termination fees exceeding one month's service.
- **Price escalation:** Does the contract allow price increases during the term? If so, are they capped (e.g., CPI or a fixed percentage)?
- **Service scope:** What exactly is included? Pumping, cleaning, manifest, disposal? What costs extra?
- **Scheduling guarantees:** Does the contract specify a service window (e.g., "service within 3 days of scheduled date")? What happens if they miss it?

## Step 10: Know the Red Flags

After evaluating dozens of grease trap service companies across Florida, these are the clearest warning signs to avoid:

### Major Red Flags (Do Not Hire)

- **No DEP license or refusal to provide license number**
- **No manifests provided** — this means no paper trail and possible illegal disposal
- **No insurance** or refusal to provide a COI
- **Cash-only operation** with no invoicing
- **Significantly below-market pricing** (suggests cutting corners on disposal or insurance)

### Minor Red Flags (Proceed With Caution)

- **Inconsistent scheduling** — frequently rescheduling or showing up late
- **Poor communication** — hard to reach, slow to return calls
- **Dirty equipment** — a grimy, poorly maintained truck may indicate sloppy service
- **No website or professional presence** — while not definitive, most legitimate operations have at least a basic web presence
- **Reluctance to put pricing in writing**

## Your Selection Checklist

Use this checklist when evaluating grease trap service companies:

- [ ] Valid DEP Grease Waste Transporter license verified
- [ ] Provides DEP Form 62-705.300(3) manifests for every visit
- [ ] General liability insurance ($1M+ per occurrence)
- [ ] Pollution liability coverage
- [ ] 24/7 emergency service available (or backup provider identified)
- [ ] Written pricing provided, including disposal fees
- [ ] Your location is in their primary service area
- [ ] Appropriate equipment for your trap type and size
- [ ] Positive reviews and/or references from similar businesses
- [ ] Reasonable contract terms with fair cancellation policy

## Finding Providers in Your Area

Our [company directory](/companies) lists grease trap service providers across all 67 Florida counties. Each listing includes:

- Service areas covered
- Services offered
- Google review rating
- Contact information (phone, website)
- DEP license verification status (as verification data becomes available)

You can filter by [county](/county), [city](/companies), and service type to narrow your search. For pricing context, see our [grease trap cleaning cost guide](/guides/grease-trap-cleaning-cost-florida).

## Frequently Asked Questions

### How many quotes should I get before choosing a grease trap service?

Get quotes from at least three DEP-licensed providers in your area. This gives you a realistic view of the market rate and helps you identify outliers — both overpriced and suspiciously cheap. Be specific about your trap type, size, and desired frequency so the quotes are comparable.

### Should I always choose the cheapest grease trap service?

No. The cheapest provider is not always the best value. Consider what is included in the price (disposal, manifests, emergency availability), the company's reputation, and their compliance status. A provider that is $50 cheaper per visit but skips manifests or uses unlicensed subcontractors is not a savings — it is a liability.

### Can I switch grease trap service companies mid-contract?

Review your contract's cancellation terms. Most contracts allow cancellation with 30 days' written notice, though some include early termination fees. If your current provider is not DEP licensed, you may have grounds to terminate immediately, as using an unlicensed hauler exposes you to fines under Chapter 62-705.

### How do I know if my grease trap service company is doing a good job?

Signs of quality service include: consistent on-time arrival, clean work area after service (no grease spills or debris), a completed manifest left at every visit, a trap that stays below 25% capacity between visits, and responsive communication when you have questions or need to reschedule.

### What should I do if my grease trap service company loses their DEP license?

Stop using them immediately and find a licensed replacement through our [directory](/companies). Using an unlicensed hauler after their license is revoked or suspended exposes you to fines of $100 to $500 per service event. Keep your manifests from past visits as evidence of your prior compliance.
`,
  },

  // ─── GUIDE 4: Grease Trap Cleaning Frequency Guide ───
  {
    slug: "grease-trap-cleaning-frequency-florida",
    title: "Grease Trap Cleaning Frequency Guide for Florida",
    excerpt:
      "How often should you clean your grease trap in Florida? This guide covers state requirements, county-specific rules, frequency by establishment type, and the factors that affect your schedule.",
    category: "guide",
    image_url: "/images/guide-frequency.webp",
    meta_title: "Grease Trap Cleaning Frequency Guide - FL",
    meta_description:
      "How often should you clean your grease trap in Florida? State law, county rules (Miami-Dade, Pinellas, Hillsborough), and frequency by restaurant type explained.",
    published_at: new Date().toISOString(),
    content: `# Grease Trap Cleaning Frequency Guide for Florida

Florida's Chapter 62-705 requires all food service establishments to maintain their grease traps and interceptors on a schedule that prevents grease waste from entering the public sewer system. While the state law does not prescribe a single statewide cleaning interval, most Florida counties require cleaning every 30 to 90 days depending on your trap type, size, and the volume of grease your operation generates. The safest rule of thumb is the 25% rule: clean your trap before accumulated grease and solids reach 25% of the trap's total capacity.

Getting your cleaning frequency right protects you from costly violations, prevents emergency overflows, and keeps your kitchen running smoothly. This guide covers state requirements, county-specific rules across Florida, recommended frequency by establishment type, and the factors that should inform your schedule.

## State Requirements Under Chapter 62-705

[Chapter 62-705 F.A.C.](/guides/chapter-62-705-compliance-guide) (Florida Administrative Code) establishes the regulatory framework for grease waste removal and disposal in Florida. The regulation, administered by the Florida Department of Environmental Protection (DEP), requires:

- All grease waste must be removed by a DEP-licensed hauler
- Every pump-out must be documented on DEP Form 62-705.300(3)
- Grease traps and interceptors must be maintained in proper working condition
- Accumulated grease waste must not be allowed to pass through to the sewer system

The state regulation intentionally defers specific cleaning frequency requirements to local jurisdictions (counties and municipalities), recognizing that the appropriate interval varies by trap size, establishment type, and local sewer infrastructure capacity. This means your cleaning schedule is primarily determined by your county's FOG (fats, oils, and grease) ordinance.

However, the state's requirement that grease not pass through to the sewer effectively means you cannot let your trap go indefinitely between cleanings. If an inspection reveals that your trap has failed — meaning grease is passing through the outlet — you are in violation regardless of whether you met a specific time interval.

## County-Specific Frequency Requirements

Florida's 67 counties each have their own FOG control programs with specific cleaning requirements. Here are the documented requirements for Florida's major counties:

### Miami-Dade County

**Enforcement agency:** DERM (Department of Environmental Resources Management)
**Program:** FOG Control Program

Miami-Dade uses the **25% capacity rule** rather than a fixed time interval. Your grease trap or interceptor must be cleaned before accumulated grease and solids reach 25% of the trap's total liquid capacity.

What this means in practice:

- A high-volume restaurant with a 1,000-gallon interceptor might need monthly cleaning
- A lower-volume establishment might go 60 to 90 days
- Interior traps (20-100 gallons) typically need weekly to biweekly cleaning under this rule

The 25% rule is actually the gold standard and is recommended statewide as a best practice, even in counties that use fixed intervals. [Find Miami-Dade providers](/county/miami-dade).

### Pinellas County

**Enforcement agency:** Pinellas County Utilities
**Program:** Commercial Grease Management Program

Pinellas County has some of Florida's most stringent requirements:

- **Grease interceptors:** Monthly cleaning required
- **Interior grease traps:** Per permit — typically weekly to biweekly
- **Automatic grease removal devices:** Per manufacturer specifications, with quarterly professional inspection

Monthly interceptor cleaning is more frequent than most Florida counties require. Pinellas restaurants should budget accordingly — see our [cost guide](/guides/grease-trap-cleaning-cost-florida) for Pinellas County pricing. [Find Pinellas providers](/county/pinellas).

### Hillsborough County

**Enforcement agency:** Hillsborough County Public Utilities
**Program:** Grease Management Program

- **Grease interceptors:** Every 90 days (quarterly) minimum
- **Interior grease traps:** More frequent cleaning may be required based on inspection
- **Interceptors serving multiple tenants:** May require monthly cleaning

Hillsborough's 90-day interval is the most common standard across Florida and is a reasonable baseline for most establishments. [Find Hillsborough providers](/county/hillsborough).

### Sarasota County

**Enforcement agency:** Sarasota County Utilities
**Program:** FOG Program (established 2020)

Sarasota County distinguishes between trap types:

- **Interior grease traps:** Every 30 days
- **Underground grease interceptors:** Every 90 days
- **More frequent cleaning** may be required if inspections show excessive buildup

The 30-day interior trap requirement is stricter than many counties and reflects the rapid accumulation rate of small under-sink units. [Find Sarasota providers](/county/sarasota).

### Orange County

**Enforcement agency:** Orange County Utilities
**Program:** FOG Control Program

- **Frequency:** Per permit conditions — typically 90 days for interceptors
- **Interior traps:** Per permit, typically monthly or more frequent
- **Variance:** Available for establishments that demonstrate consistent low accumulation

Orange County's permit-based approach allows some flexibility, but the default expectation is quarterly interceptor cleaning. [Find Orange County providers](/county/orange).

### Duval County (Jacksonville)

**Enforcement agency:** JEA (Jacksonville Electric Authority)
**Program:** Preferred Hauler Program

- **Frequency:** Per permit — typically 90 days for interceptors
- **JEA preferred haulers** are pre-vetted for compliance, making selection easier
- **Interior traps:** Per permit conditions

JEA's Preferred Hauler Program is unique in Florida — haulers on the list have been verified for licensing, insurance, and disposal compliance. Using a preferred hauler simplifies your compliance burden. [Find Duval providers](/county/duval).

### Palm Beach County

**Enforcement agency:** SWA (Solid Waste Authority) and local utilities
**Program:** Grease Waste Program

- **Frequency:** Per permit — typically quarterly for interceptors
- **Interior traps:** Monthly or per permit
- **Manifests required** for every service visit

[Find Palm Beach providers](/county/palm-beach).

### Broward County

**Enforcement agency:** County and municipal utilities (varies by city)
**Program:** FOG Control Programs (city-level)

- **Frequency:** Varies by municipality, typically quarterly for interceptors
- **Fort Lauderdale, Hollywood, Pompano Beach** each have their own specific requirements
- **Check with your local utility** for exact requirements

[Find Broward providers](/county/broward).

### Lee County

**Enforcement agency:** Lee County Utilities
**Program:** FOG Ordinance

- **Frequency:** Per permit — typically quarterly for interceptors
- **More frequent** cleaning for high-volume establishments
- **Interior traps:** Per permit conditions

[Find Lee County providers](/county/lee).

### Volusia County

**Enforcement agency:** Volusia County Utilities
**Program:** FOG Program

- **Frequency:** Per permit — typically quarterly
- **Seasonal adjustments** may be required during peak tourist season (higher restaurant volume in beach communities)

[Find Volusia County providers](/county/volusia).

## Frequency by Establishment Type

Your establishment type significantly affects how quickly grease accumulates and, therefore, how often you need to clean. Here are recommended frequencies based on typical grease production:

### High-Volume Restaurants (Full-Service, Fried Food Heavy)

- **Interior traps:** Weekly to biweekly
- **Underground interceptors:** Monthly to every 45 days
- **Examples:** Fried chicken restaurants, seafood restaurants, Chinese/Asian restaurants, burger joints, 24-hour diners

These establishments produce the highest volumes of FOG due to deep fryers, wok cooking, and high meal counts. In Miami-Dade, they frequently trigger the 25% rule within 30 days.

### Average-Volume Restaurants (Full-Service, Mixed Menu)

- **Interior traps:** Biweekly to monthly
- **Underground interceptors:** Every 60 to 90 days
- **Examples:** Casual dining chains, Italian restaurants, steakhouses, Mexican restaurants, pizza restaurants

These are the "typical" restaurant and represent the majority of food service establishments in Florida. Quarterly interceptor cleaning (90 days) is usually sufficient if kitchen practices are good.

### Low-Volume Food Service

- **Interior traps:** Monthly
- **Underground interceptors:** Quarterly (90 days)
- **Examples:** Bakeries, delis, sandwich shops, coffee shops with limited food prep, corporate cafeterias with light cooking

These establishments produce less FOG but still require regular maintenance. Don't assume that low volume means you can skip cleanings — even a small amount of grease accumulates over time and can cause blockages.

### School and Institutional Cafeterias

- **Interior traps:** Monthly during the school year, less frequent during breaks
- **Underground interceptors:** Quarterly, with possible variance during summer
- **Examples:** K-12 school kitchens, university dining halls, hospital cafeterias, nursing home kitchens

Institutional kitchens often have predictable, seasonal patterns. Some counties allow adjusted schedules during extended closures (summer break, holiday breaks) as long as you resume regular cleaning when operations restart.

### Hotels and Resorts

- **Interior traps:** Weekly to biweekly (multiple food outlets)
- **Underground interceptors:** Monthly to every 60 days
- **Examples:** Full-service resort restaurants, hotel banquet kitchens, room service kitchens

Hotels and resorts often have multiple grease traps serving different kitchen areas. Each trap should be evaluated individually — the main restaurant kitchen trap will fill faster than the poolside bar's trap.

### Catering Companies

- **Interior traps:** Biweekly to monthly
- **Underground interceptors:** Monthly to quarterly, depending on event volume
- **Examples:** Off-premise catering, commissary kitchens, event venues

Catering volumes fluctuate with the event calendar. During peak season (November through April in Florida), you may need more frequent cleaning.

### Food Trucks

- **Interior traps:** Weekly to biweekly (small traps fill quickly)
- **Examples:** Mobile food vendors with on-board grease management systems

Food trucks have very small grease traps (typically 5-20 gallons) that fill rapidly during service. Frequent cleaning is essential to prevent backups in the confined space of a food truck kitchen.

## Factors That Affect Your Cleaning Frequency

Beyond establishment type and county requirements, several operational factors influence how often your trap needs cleaning:

### 1. Menu Type

The type of food you prepare is the strongest predictor of grease production:

- **Deep-fried foods:** Highest grease production. Fryer oil, batter drippings, and grease-laden wash water fill traps rapidly.
- **Grilled and sauteed foods:** Moderate grease production. Pan drippings and cooking oils contribute, but less than deep frying.
- **Baked goods:** Lower grease production, but butter, shortening, and oil-based recipes still generate FOG.
- **Cold prep (salads, sandwiches):** Minimal grease production, primarily from dressings and mayo.

A restaurant that deep-fries 80% of its menu will need cleaning two to three times more frequently than one that focuses on grilled items.

### 2. Daily Meal Count

More meals served equals more grease produced. A restaurant serving 500 covers per day will fill its trap much faster than one serving 100. If you significantly increase your daily volume (adding a lunch service, extending hours, or adding catering), reassess your cleaning frequency.

### 3. Trap Size

Larger traps accumulate grease more slowly relative to their capacity, allowing longer intervals between cleanings. A 2,000-gallon interceptor serving the same restaurant that would overflow a 500-gallon interceptor in 30 days might go 90 to 120 days between cleanings.

However, a larger trap does not eliminate the need for regular cleaning. Even a large interceptor that is cleaned infrequently will develop hardened grease deposits that are more difficult and expensive to remove.

### 4. Kitchen Practices

Good kitchen practices can extend your cleaning interval by 25% to 50%:

- **Scrape before washing:** Scraping plates and pans into the trash before putting them in the wash significantly reduces grease entering the drain.
- **Use drain strainers:** Metal mesh strainers in floor drains and sink drains catch food solids before they reach the trap.
- **Separate used cooking oil:** Collect fryer oil and cooking grease in a separate container for recycling, rather than pouring it down the drain.
- **Cool grease before disposing:** Let pans cool so grease solidifies, then scrape it into the trash.
- **Staff training:** Regular training on proper waste handling makes a measurable difference.

### 5. Seasonal Volume

Many Florida restaurants experience significant seasonal volume fluctuations:

- **Peak season (November - April):** Snowbird and tourist traffic can double or triple daily covers in popular areas like Naples, Sarasota, and the Keys.
- **Off season (May - October):** Reduced traffic may allow extended cleaning intervals.

Adjust your cleaning schedule with the seasons. Don't keep a summer schedule during peak winter season.

### 6. Number of Connected Fixtures

A trap that receives waste from multiple sinks, dishwashers, and floor drains fills faster than one connected to a single fixture. If you remodel your kitchen and add new drain connections to your existing trap, you may need to increase your cleaning frequency.

## Consequences of Infrequent Cleaning

Skipping or delaying grease trap cleanings is a false economy. The consequences compound quickly:

### Immediate Consequences

- **Grease bypass:** When the trap exceeds capacity, grease passes through to the sewer system. This triggers violations from your local utility and potentially the DEP.
- **Kitchen backups:** A full trap causes slow drains, standing water in sinks, and eventually sewage backups into your kitchen. This can force you to close during service hours.
- **Odors:** Accumulated grease waste produces hydrogen sulfide and other foul-smelling gases that permeate your kitchen and, in severe cases, your dining room.

### Regulatory Consequences

- **FOG inspection failures:** County inspectors will cite you for exceeding the 25% capacity threshold or missing required cleaning intervals.
- **Fines:** $100 to $5,000 per violation under Chapter 62-705, plus potential county-level fines.
- **Increased inspection frequency:** Failed inspections often trigger more frequent inspections, creating an ongoing compliance burden.
- **Health department issues:** Grease overflow and sewage backups can trigger health department violations, jeopardizing your food service license.

### Financial Consequences

- **Emergency cleaning costs:** An emergency pump-out costs 50% to 100% more than a scheduled cleaning. See our [cost guide](/guides/grease-trap-cleaning-cost-florida) for pricing details.
- **Plumbing repairs:** Grease-clogged lines may require hydro jetting ($200-$500) or manual snaking.
- **Business interruption:** A sewage backup during dinner service can cost thousands in lost revenue, plus cleanup costs.
- **Trap damage:** Hardened grease deposits corrode baffles and trap walls, potentially requiring expensive repairs or replacement ($5,000-$15,000 for an underground interceptor).

## Creating Your Cleaning Schedule

Follow these steps to establish the right cleaning frequency for your establishment:

### Step 1: Know Your County's Minimum Requirement

Check your county's FOG ordinance for the mandated minimum cleaning interval. If your county is listed above, start there. If not, contact your county utilities department or check our [county directory](/county) for information.

### Step 2: Identify Your Baseline

Start with your county's minimum requirement as a baseline. If your county requires quarterly cleaning, begin with quarterly service.

### Step 3: Monitor and Adjust

After the first two to three cleaning cycles, have your hauler measure the grease accumulation level before pumping. If the trap is consistently above 25% capacity at the time of service, increase your frequency. If it is consistently well below 25%, you may be able to extend the interval (as long as you meet your county's minimum).

### Step 4: Document Everything

Keep records of every cleaning, including the date, the measured grease level, and the volume removed. This data helps you optimize your schedule over time and demonstrates diligence during inspections.

### Step 5: Review Seasonally

Reassess your schedule twice per year — once before peak season and once after. Adjust frequency to match your actual volume.

For help finding a qualified, DEP-licensed grease trap service provider in your area, browse our [company directory](/companies) or read our guide on [how to choose a grease trap service](/guides/how-to-choose-grease-trap-service).

## Frequently Asked Questions

### How often does Florida law require grease trap cleaning?

Florida's Chapter 62-705 does not specify a single statewide cleaning interval. Instead, it requires that grease traps be maintained to prevent grease from passing through to the sewer system. Specific cleaning frequencies are set by county FOG ordinances, ranging from monthly (Pinellas County interceptors) to quarterly (Hillsborough, most other counties). The 25% capacity rule used in Miami-Dade is the recommended best practice statewide.

### What happens if I miss a scheduled grease trap cleaning?

Missing a scheduled cleaning puts you at risk of exceeding your trap's capacity, which can cause grease bypass (a violation), kitchen backups, and foul odors. If an inspector finds your trap above the allowed capacity or past its required cleaning date, you face fines of $100 to $5,000 under Chapter 62-705 and potentially additional county-level penalties.

### Can I clean my grease trap myself between professional cleanings?

You can and should perform routine maintenance between professional pump-outs: scraping accumulated surface grease, cleaning strainer baskets, and checking for proper water levels. However, the actual removal and disposal of grease waste must be performed by a DEP-licensed hauler using proper manifests. Self-service pump-outs are not legal unless you hold a DEP Grease Waste Transporter license.

### Does cleaning frequency change based on the season?

Yes. Florida restaurants in tourist-heavy areas often see 50% to 200% increases in volume during peak season (November through April). If your meal count increases significantly during these months, your grease production increases proportionally, and you should increase your cleaning frequency to match. Conversely, you may be able to reduce frequency during slower months, as long as you meet your county's minimum requirement.

### How do I know if my grease trap needs cleaning sooner than scheduled?

Watch for these warning signs: slow-draining sinks, gurgling sounds from drains, foul odors near the trap or in the kitchen, visible grease accumulation on the trap surface (for accessible interior traps), and standing water around the interceptor access cover (for underground units). Any of these signs means your trap needs immediate attention — don't wait for the next scheduled cleaning.
`,
  },
];

async function main() {
  console.log("Inserting 4 cornerstone guides into content_pages...\n");

  for (const guide of guides) {
    // Upsert to handle re-runs
    const { data, error } = await supabase
      .from("content_pages")
      .upsert(guide, { onConflict: "slug" })
      .select("id, slug, title")
      .single();

    if (error) {
      console.error(`ERROR inserting "${guide.slug}":`, error.message);
    } else {
      console.log(`OK  ${data.slug} (${data.id})`);
    }
  }

  // Verify all 4 exist
  console.log("\n--- Verification ---");
  const { data: all, error: verifyErr } = await supabase
    .from("content_pages")
    .select("id, slug, title, category, published_at, meta_title")
    .in("slug", guides.map((g) => g.slug));

  if (verifyErr) {
    console.error("Verification query failed:", verifyErr.message);
    process.exit(1);
  }

  console.log(`Found ${all.length} of 4 guides:\n`);
  for (const row of all) {
    const titleLen = (row.meta_title || "").length;
    console.log(
      `  ${row.slug}\n    title: ${row.title}\n    meta_title (${titleLen} chars): ${row.meta_title}\n    category: ${row.category}\n    published: ${row.published_at}\n`
    );
  }

  if (all.length === 4) {
    console.log("All 4 cornerstone guides verified in Supabase.");
  } else {
    console.error(`MISMATCH: expected 4, found ${all.length}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});

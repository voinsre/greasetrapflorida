import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

// Load .env.local manually (no dotenv dependency)
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "..", ".env.local");
const envContent = readFileSync(envPath, "utf-8");
const env = {};
for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eqIdx = trimmed.indexOf("=");
  if (eqIdx === -1) continue;
  env[trimmed.slice(0, eqIdx)] = trimmed.slice(eqIdx + 1);
}

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

const posts = [
  {
    slug: "warning-signs-grease-trap-needs-cleaning",
    title: "5 Warning Signs Your Grease Trap Needs Immediate Cleaning",
    excerpt:
      "Ignoring these five red flags can lead to costly backups, health code violations, and emergency service calls. Here is how to spot trouble before it shuts your kitchen down.",
    category: "blog",
    image_url: "/images/blog-kitchen-1.webp",
    meta_title: "5 Signs Your Grease Trap Needs Cleaning Now",
    meta_description:
      "Slow drains, foul odors, and grease in drain water are warning signs your grease trap needs immediate cleaning. Learn what to watch for and when to call a pro.",
    published_at: "2026-03-21T10:00:00-04:00",
    content: `A busy Friday night service is no time to discover your grease trap has been screaming for attention. Yet that is exactly when most Florida restaurant owners find out — when dishes are piling up, water is pooling around the floor drain, and a customer at table six is wrinkling their nose at something that is definitely not on the menu.

Grease traps do not fail without warning. They send signals for days, sometimes weeks, before a full-blown crisis hits. The problem is that kitchen teams are so focused on tickets and table turns that the early signs get written off as "normal." They are not normal. They are your trap telling you that something needs to happen right now.

Here are the five warning signs every Florida restaurant owner and kitchen manager needs to recognize — and what to do the moment you spot them.

## 1. Slow-Draining Sinks and Floor Drains

**What it looks like:** Water pools in your three-compartment sink longer than usual. The floor drain near the dishwasher takes minutes instead of seconds to clear. You notice staff stepping around standing water during peak service.

**Why it happens:** Fats, oils, and grease (FOG) accumulate inside the trap and narrow the passageway that water flows through. As the trap fills, drainage slows progressively. By the time you notice sluggish drains, your trap is likely past the 25% capacity threshold that triggers mandatory cleaning under most Florida county FOG ordinances — including Miami-Dade's well-known DERM program.

**What to do immediately:** Stop pouring any additional grease down the drain. Check the last date on your [grease waste service manifest](/compliance/grease-waste-manifest). If your next scheduled pump-out is more than a week away, call your hauler and request an early service. Slow drains only get worse, never better, without intervention.

## 2. Foul Odors Coming From Drains or the Trap Area

**What it looks like:** A rotten, sour smell that intensifies in warm weather. Staff may describe it as sewage, rotten eggs, or spoiled food. The odor tends to be strongest near the grease trap access point, but it can migrate through the entire kitchen ventilation system.

**Why it happens:** When FOG sits in a trap too long, it decomposes. Anaerobic bacteria break down the accumulated grease and food solids, producing hydrogen sulfide and other sulfur compounds. The warmer the environment — and Florida kitchens are warm year-round — the faster decomposition accelerates. This is not just unpleasant; hydrogen sulfide is corrosive and can damage metal trap components over time.

**What to do immediately:** Do not mask the smell with bleach or deodorizers poured into the drain. Chemical additives can push grease further into the sewer line and create a bigger problem downstream. Instead, schedule a cleaning within 48 hours. If the smell is severe enough that customers can detect it in the dining area, treat it as an emergency — a health inspector who walks in during that window will notice too. Learn more about [how grease trap maintenance affects your health inspection score](/blog/grease-trap-maintenance-health-inspection).

## 3. Grease Visible in Drain Water

**What it looks like:** You see a greasy film, floating globs, or a yellowish sheen on the surface of water in sinks, floor drains, or around the grease trap lid. Sometimes grease appears in the dishwasher drain line or backs up into hand-washing sinks.

**Why it happens:** Your grease trap works by slowing water flow so FOG floats to the top and solids settle to the bottom, allowing relatively clean water to exit through the outlet. When the trap is full, there is nowhere for new grease to separate — so it passes straight through, visibly contaminating outgoing water. This is also the point at which your facility starts sending FOG into the municipal sewer system, which can trigger violations from your local utility.

**What to do immediately:** This is a compliance red flag. Under [Chapter 62-705 F.A.C.](/compliance/chapter-62-705-guide), grease waste originators are responsible for ensuring their traps function properly. Visible grease in drain water means your trap is not functioning. Call your [licensed hauler](/companies) for same-day or next-day service. Document what you observe with photos and timestamps — if the county follows up, you want to show you acted promptly.

## 4. Frequent Drain Backups

**What it looks like:** Water reverses direction and comes back up through floor drains or sink drains. In severe cases, wastewater floods the kitchen floor. Backups may start intermittently — once a week, then every few days — before becoming a daily occurrence.

**Why it happens:** A grease trap that has exceeded capacity creates a blockage in the drainage system. Water has nowhere to go, so it takes the path of least resistance — back up into your kitchen. Backups can also indicate that the outlet pipe from the trap to the sewer is clogged with hardened grease, which happens when regular cleaning is deferred too long.

**What to do immediately:** Stop all water use in the affected area. A backup is a health hazard — contaminated water on your kitchen floor can trigger an immediate shutdown during an inspection. Contact your grease trap service provider for emergency service. Many [Florida grease trap companies](/companies) offer 24/7 emergency response for exactly this situation. After the backup is cleared, ask your hauler to inspect the outlet line. You may need [hydro jetting](/services/hydro-jetting) to clear hardened deposits that regular pumping cannot reach.

## 5. You Have Not Cleaned in 90+ Days (or Cannot Remember the Last Cleaning)

**What it looks like:** There is no recent manifest on file, and no one on staff can recall the last time the trap was serviced. The cleaning log on the wall has not been updated in months.

**Why it happens:** In the daily chaos of running a restaurant, grease trap maintenance falls off the radar. There is no dramatic event that reminds you — until one of the four signs above appears. Florida counties set specific cleaning frequencies: Hillsborough County requires service every 90 days, Sarasota County mandates 30 days for interior traps, and Pinellas County requires monthly service for grease interceptors. If you are past your county's deadline, you are already out of compliance.

**What to do immediately:** Check your records. Under Chapter 62-705, both the originator (you) and the hauler must maintain manifests for five years. If you have no manifest for the last service, you have a documentation gap that an inspector will flag. Schedule a cleaning today — not next week, today. Then set up a recurring service contract with a [licensed hauler in your county](/county) so this never happens again. A contract with automatic scheduling is the single most effective way to stay compliant without relying on memory.

## The Cost of Ignoring These Signs

A routine grease trap pump-out in Florida costs between $200 and $500 depending on trap size, location, and frequency. An emergency service call after a backup can run $500 to $1,500 or more — and that does not include the cost of lost business during a kitchen shutdown.

Health code violations related to grease traps can result in point deductions on your inspection score, and repeated violations can escalate to fines ranging from $100 to $5,000 under Florida's [penalty structure](/compliance/penalties-and-fines). In extreme cases, chronic non-compliance can lead to a temporary operating permit suspension.

The math is simple: proactive maintenance costs a fraction of reactive emergency service. Every one of these five warning signs is your grease trap giving you a chance to handle things on your terms, on your schedule, at regular pricing.

## What to Do Right Now

If you recognized any of these signs in your kitchen, take action today:

1. **Check your last manifest date** — is it within your county's required frequency?
2. **Find a licensed hauler** — browse the [Florida grease trap service directory](/companies) to find providers in your area
3. **Set up a recurring contract** — eliminate the guesswork and ensure you never miss a cleaning
4. **Review your compliance status** — use our [compliance resources](/compliance) to understand your county's specific requirements

Do not wait for sign number four or five. By then, you are paying emergency rates and hoping an inspector does not walk in first.

---

## Frequently Asked Questions

**How often should a restaurant grease trap be cleaned in Florida?**
It depends on your county and trap size. Most Florida counties require cleaning every 30 to 90 days. Miami-Dade uses the 25% capacity rule, Hillsborough requires every 90 days, and Sarasota mandates every 30 days for interior traps. Check your [county's specific requirements](/compliance) or ask your hauler to recommend a schedule based on your kitchen's volume.

**Can I clean my own grease trap instead of hiring a hauler?**
You can perform basic maintenance like scraping and skimming between professional cleanings, but the actual pump-out and disposal of grease waste must be performed by a DEP-licensed hauler under Chapter 62-705. Improper disposal of grease waste carries significant fines. See our guide on [how to verify your hauler is DEP licensed](/guides/how-to-verify-grease-hauler-dep-licensed).

**What happens if a health inspector finds my grease trap overflowing?**
An overflowing or non-functional grease trap is a critical violation in most Florida county health inspection frameworks. It can result in immediate point deductions, a required re-inspection, and potential fines. In severe cases, an inspector can require you to cease operations until the trap is serviced. Read more about [how grease trap maintenance affects your health inspection score](/blog/grease-trap-maintenance-health-inspection).`,
  },
  {
    slug: "what-professional-grease-trap-cleaning-looks-like",
    title: "What Professional Grease Trap Cleaning Actually Looks Like",
    excerpt:
      "Most restaurant owners have never watched a full grease trap service from start to finish. Here is exactly what happens when a licensed hauler shows up — step by step.",
    category: "blog",
    image_url: "/images/blog-kitchen-2.webp",
    meta_title: "What Professional Grease Trap Cleaning Looks Like",
    meta_description:
      "A step-by-step look at professional grease trap cleaning: arrival, pumping, scraping, jetting, inspection, manifest, and disposal. Know what to expect.",
    published_at: "2026-03-23T10:00:00-04:00",
    content: `You sign the invoice, the truck pulls away, and you assume everything went well. But did it? Most Florida restaurant owners and kitchen managers have never actually watched a grease trap cleaning from start to finish. They know it happens, they know it costs money, and they know someone shows up with a big truck. Beyond that, the process is a black box.

That is a problem. When you do not know what proper service looks like, you cannot tell the difference between a thorough job and a five-minute pump-and-go that leaves half the grease behind. And in a state where Chapter 62-705 holds both the hauler and the originator responsible for compliance, understanding the process is not optional — it is your protection.

Here is exactly what happens during a professional grease trap cleaning, what equipment a legitimate hauler uses, how long it takes, and what your kitchen should expect during service.

## Before the Truck Arrives: Scheduling and Access

A professional service starts before the hauler shows up. When you book a cleaning — either as a one-time call or through a recurring contract — the hauler should confirm several details:

- **Trap location and access:** Is it interior (under the kitchen floor or sink) or exterior (buried in the parking lot or behind the building)? Access affects equipment needs.
- **Trap size:** Measured in gallons or grease pounds intercepted (GPI). Common sizes for Florida restaurants range from 20-gallon under-sink traps to 1,500-gallon underground interceptors.
- **Preferred service window:** Most haulers recommend cleaning during off-peak hours. Early morning before prep starts or late evening after close minimizes kitchen disruption.
- **Special considerations:** Tight parking lots, restricted building access hours, shared trap systems in strip malls.

A hauler who shows up without knowing any of this is already behind.

## Step 1: Arrival and Assessment (5-10 Minutes)

The service truck arrives — typically a vacuum tanker truck equipped with a high-powered suction system, hoses, and hand tools. The crew (usually one or two technicians) starts with a visual assessment:

- **Locate and open the trap.** For interior traps, this means removing floor grates or access panels. For exterior interceptors, lids may require pry bars or specialized lifters — some concrete lids weigh over 200 pounds.
- **Measure the current grease level.** A technician uses a dipping stick or measuring rod to check how full the trap is. This reading matters — under Miami-Dade County's DERM program, for example, a trap that exceeds 25% capacity at the time of service indicates the cleaning frequency is too low.
- **Note the condition.** Cracks, corrosion, missing baffles, damaged inlet/outlet tees — all get documented. A professional hauler inspects, not just pumps.

## Step 2: Pumping (10-30 Minutes)

This is the core of the service. The technician inserts a vacuum hose into the trap and begins extracting the contents:

- **Floating grease layer (FOG cap):** The thick layer of fats, oils, and grease that has risen to the top. This is the primary waste material.
- **Wastewater (gray water):** The middle layer of relatively clear water between the grease cap and the settled solids.
- **Settled solids (sludge):** Food particles, debris, and heavy solids that have sunk to the bottom.

All three layers go into the vacuum truck's tank. A proper pump-out removes everything — not just the floating grease on top. A common shortcut among less thorough operators is to skim the FOG cap and leave the sludge layer behind. This causes the trap to fill faster and can lead to blockages in the outlet pipe.

For a standard 1,000-gallon interceptor, pumping takes roughly 15 to 25 minutes depending on the grease consistency and the power of the vacuum system. Smaller under-sink traps can be pumped in under 10 minutes.

## Step 3: Scraping and Manual Cleaning (10-20 Minutes)

After the bulk waste is removed, the trap is not clean — it is just empty. A professional service includes manual cleaning:

- **Scraping the walls and baffles.** Hardened grease clings to the interior surfaces of the trap, especially around baffles (the internal walls that slow water flow). Technicians use scrapers, brushes, and sometimes putty knives to remove buildup.
- **Cleaning the inlet and outlet tees.** These are the T-shaped pipe fittings where water enters and exits the trap. Clogged tees are the number one cause of backups, and they are often overlooked during quick pump-outs.
- **Removing debris from the bottom.** Silverware, bottle caps, broken glass, rags — you would be surprised what ends up in a grease trap. These items must be removed manually.

This step separates a quality service from a budget one. If your hauler is in and out in 15 minutes on a 1,000-gallon trap, they probably skipped the scraping.

## Step 4: Hydro Jetting (When Needed, 15-30 Minutes)

Not every service requires jetting, but it should be performed periodically — typically quarterly or when flow problems are detected:

- **High-pressure water jetting** blasts the inlet and outlet lines with water at 2,000 to 4,000 PSI, clearing hardened grease deposits that accumulate inside the pipes leading to and from the trap.
- This is especially important for older Florida buildings where cast iron drain lines are common. Grease adheres more aggressively to rough cast iron surfaces than to PVC.
- Jetting is also recommended after any backup event to ensure the lines are fully clear.

If your hauler offers [hydro jetting](/services/hydro-jetting) as an add-on service, it is worth including at least a few times per year. Prevention here is significantly cheaper than an emergency call to clear a fully blocked line.

## Step 5: Inspection and Documentation (5-10 Minutes)

With the trap clean, the technician performs a post-cleaning inspection:

- **Structural integrity:** Checking for cracks, holes, or corrosion in the trap body. A compromised trap can leak FOG directly into the soil or sewer system — both are environmental violations under Florida law.
- **Baffle condition:** Missing or damaged baffles mean the trap cannot properly separate FOG from wastewater. Baffles should be intact and properly positioned.
- **Inlet/outlet condition:** Checking tees, gaskets, and pipe connections for damage or wear.
- **Lid and access point:** Ensuring the lid seals properly. A poorly sealed exterior trap can allow rainwater intrusion, which dilutes the trap's effectiveness and triggers false overflow conditions.

The technician documents findings and may photograph the trap before and after service. This documentation is valuable for your records and can demonstrate proactive maintenance during a health inspection.

## Step 6: The Manifest (5 Minutes)

Under [Chapter 62-705 F.A.C.](/compliance/chapter-62-705-guide), every grease waste removal in Florida must be documented with a service manifest. This is not optional — it is state law. The manifest includes:

- **Date and time of service**
- **Business name and address (the originator)**
- **Hauler company name, DEP license number, and vehicle ID**
- **Volume of waste removed (in gallons)**
- **Disposal facility where the waste will be taken**
- **Signatures from both the technician and a facility representative**

You must keep your copy of every manifest for a minimum of five years. Health inspectors and county FOG enforcement officers can request to see these records at any time. A missing manifest is treated as if the cleaning never happened. Browse [licensed haulers in your area](/companies) to ensure your provider is properly credentialed.

## Step 7: Disposal at a Licensed Facility

After leaving your restaurant, the hauler transports the grease waste to a DEP-permitted disposal or recycling facility. This is the final step in the chain of custody that Chapter 62-705 establishes. Licensed facilities include:

- **Wastewater treatment plants** that accept FOG
- **Rendering facilities** that process grease into animal feed ingredients or biofuel
- **Anaerobic digesters** that convert FOG into energy

The hauler is required to document the disposal on the manifest. If a hauler is illegally dumping grease waste — and it happens — the originator can also face liability if they failed to verify the hauler's licensing status. Learn [how to verify your hauler's DEP license](/guides/how-to-verify-grease-hauler-dep-licensed).

## How Long Does the Whole Process Take?

| Trap Type | Size | Typical Service Time |
|---|---|---|
| Under-sink interior trap | 20-50 gallons | 20-30 minutes |
| Floor-level interior trap | 50-200 gallons | 30-45 minutes |
| Small exterior interceptor | 200-500 gallons | 30-45 minutes |
| Standard exterior interceptor | 500-1,500 gallons | 45-75 minutes |
| Large interceptor with jetting | 1,000+ gallons | 60-90 minutes |

These times assume a single trap. Facilities with multiple traps or interceptors in series will take longer.

## What Your Kitchen Should Expect During Service

- **Noise:** Vacuum pumps are loud. Plan for the noise during the 10-30 minute pumping phase.
- **Odor:** Opening a grease trap releases trapped gases. Good haulers work quickly to minimize exposure, but some odor is unavoidable. Keep the kitchen ventilation running.
- **Water shutoff:** The hauler may ask you to stop running water to affected drains during service. This is why off-peak scheduling matters.
- **Brief kitchen disruption:** For interior traps, expect the immediate area around the trap to be inaccessible for 30-60 minutes. For exterior traps, kitchen disruption is minimal.

## How to Know You Got a Good Service

After the truck leaves, check these indicators:

1. **You have a signed manifest** with all required fields completed
2. **Drains flow freely** — test all connected sinks and floor drains
3. **No residual odor** beyond what is normal for the first hour after service
4. **The hauler discussed findings** — condition of baffles, any recommended repairs, next service date
5. **The trap lid is properly secured** and the work area is clean

If your hauler hands you a manifest and disappears in 15 minutes for a 1,000-gallon trap, ask questions. A thorough job takes time.

## Find a Professional Hauler

Not sure if your current service meets these standards? Browse the [Florida grease trap service directory](/companies) to find licensed, reviewed providers in your county. Compare services, check reviews, and request quotes to ensure you are getting the thorough, compliant service your operation requires.

---

## Frequently Asked Questions

**How much does a professional grease trap cleaning cost in Florida?**
Costs range from $200 to $500 for a standard pump-out, depending on trap size, location, and whether hydro jetting is included. Emergency or after-hours service typically costs 50-100% more. See our detailed [grease trap cleaning cost guide](/cost/grease-trap-cleaning-cost) for pricing by trap type and region.

**Can my regular plumber clean my grease trap?**
A plumber can perform minor maintenance, but the actual removal and transport of grease waste must be done by a DEP-licensed hauler under Chapter 62-705. Not all plumbers hold this license. Always verify your service provider's credentials before allowing them to pump your trap.

**How do I know if the hauler actually disposed of the waste properly?**
Your manifest should list the disposal facility. You can verify that the facility is DEP-permitted by checking with the [Florida Department of Environmental Protection](https://floridadep.gov/waste). If a hauler refuses to name the disposal site or leaves that field blank on the manifest, that is a serious red flag.`,
  },
  {
    slug: "grease-trap-maintenance-health-inspection",
    title: "How Grease Trap Maintenance Affects Your Health Inspection Score",
    excerpt:
      "Your grease trap is not just a plumbing fixture — it is an inspection item. Here is how Florida health inspectors evaluate it and what it means for your score.",
    category: "blog",
    image_url: "/images/blog-kitchen-3.webp",
    meta_title: "Grease Traps and Health Inspection Scores",
    meta_description:
      "Learn how Florida health inspectors evaluate grease traps, what point deductions to expect, and how proper maintenance protects your inspection score.",
    published_at: "2026-03-25T10:00:00-04:00",
    content: `The inspection report that gets taped to your front door does not just reflect food temperatures and handwashing stations. Buried in the evaluation criteria — between sanitizer concentrations and pest control — is your grease trap. And it carries more weight than most Florida restaurant owners realize.

A poorly maintained grease trap does not just risk a plumbing backup. It can cost you points on your health inspection, trigger a re-inspection, and in severe cases, contribute to a temporary closure order. The connection between your grease trap and your public-facing inspection score is direct, documented, and increasingly enforced across Florida counties.

Here is how the system actually works, what inspectors look for, and how a clean trap quietly protects your score every quarter.

## How Florida Health Inspections Work

Florida restaurant inspections are conducted by the Division of Hotels and Restaurants (DBPR) using a standardized evaluation system. Inspectors assess dozens of items across categories including food safety, personnel hygiene, equipment maintenance, water and plumbing, and waste disposal.

Violations are classified into three tiers:

- **High Priority:** Direct risk of foodborne illness (e.g., improper food temperatures, no handwashing). These carry the most weight and can trigger immediate action.
- **Intermediate:** Indirect risk factors (e.g., equipment not properly maintained, missing thermometers). These affect your overall score and require correction.
- **Basic:** Administrative or minor issues (e.g., missing signage, clutter). Lower weight but still documented.

Grease trap issues can fall into any of these categories depending on severity. An overflowing trap with wastewater on the kitchen floor is a high-priority violation. A trap that is past its cleaning schedule but still functional is typically intermediate. A missing cleaning log is basic but still a documented deficiency.

## What Inspectors Actually Look At

When a health inspector evaluates your grease trap, they are checking several specific things:

### Physical Condition of the Trap

- Is the trap accessible and not blocked by stored items?
- Is the lid secure and properly sealed?
- Are there visible signs of overflow, leakage, or damage?
- Is there excessive grease buildup visible when the lid is opened?

An inspector does not need to measure your grease level with a dipping stick. A visual assessment of an obviously full or overflowing trap is sufficient to document a violation. If grease is visible around the trap access point or seeping from the lid, that is an immediate finding.

### Drainage Functionality

- Are connected sinks and floor drains flowing properly?
- Is there standing water or slow drainage in the kitchen?
- Are there backups or evidence of recent overflow events?

Slow drains and standing water are indicators that the trap is not functioning. Inspectors are trained to trace drainage issues back to their source, and the grease trap is the usual suspect in commercial kitchens. If you have noticed any of the [warning signs of a full trap](/blog/warning-signs-grease-trap-needs-cleaning), assume an inspector would notice them too.

### Maintenance Documentation

This is where many Florida restaurants lose points unnecessarily:

- **Cleaning manifests:** Under [Chapter 62-705](/compliance/chapter-62-705-guide), you must retain grease waste service manifests for five years. An inspector can ask to see your most recent manifest — and if you cannot produce it, the cleaning effectively did not happen from a compliance standpoint.
- **Cleaning schedule:** Do you have a documented cleaning frequency? Is it consistent with your county's requirements?
- **Hauler credentials:** Some inspectors will verify that your hauler is DEP-licensed. Using an unlicensed hauler is a violation of state law, regardless of whether the trap was actually cleaned.

A common scenario: a restaurant gets its trap cleaned on schedule, the hauler does a good job, but nobody files the manifest or updates the cleaning log. The inspector asks for documentation, the manager cannot find it, and the restaurant takes a hit on what should have been a non-issue.

### Connection to Sewer System

Inspectors also evaluate whether your grease trap is properly connected and preventing FOG from entering the municipal sewer system:

- Is the trap properly plumbed (not bypassed)?
- Are all grease-producing fixtures routed through the trap?
- Is the trap the correct size for the establishment's volume?

A trap that is undersized for your kitchen's output fills faster, overflows sooner, and is more likely to be found in violation. If you are unsure whether your trap is properly sized, review our [grease trap sizing guide](/guides/grease-trap-sizing-florida-restaurants).

## Point Deductions: What Non-Compliance Costs

The specific point impact depends on how the inspector classifies the violation, but here are common scenarios and their typical consequences:

| Violation | Typical Classification | Impact |
|---|---|---|
| Grease overflow on floor | High Priority | Major point deduction, possible re-inspection |
| Backed-up drains from full trap | High Priority | Major point deduction |
| Trap exceeding capacity, no overflow | Intermediate | Moderate point deduction |
| No cleaning manifest on file | Intermediate | Moderate point deduction |
| Cleaning schedule not maintained | Basic/Intermediate | Minor to moderate deduction |
| Trap lid not properly sealed | Basic | Minor deduction |
| Using unlicensed hauler | Intermediate | Moderate point deduction |

The cumulative effect matters most. A grease trap that is slightly past its cleaning date might be a minor finding in isolation. But combined with a missing manifest and slow drains, it becomes a pattern of non-compliance that elevates the overall severity.

## How a Clean Trap Improves Your Overall Score

The positive case is just as important as the negative. A well-maintained grease trap with current documentation does several things for your inspection:

### Eliminates an Entire Category of Violations

When your trap is clean, properly sized, and documented, the inspector checks those items and moves on. No finding, no deduction, no follow-up. That is the goal — making your grease trap invisible during inspections.

### Demonstrates Operational Competence

Inspectors notice patterns. A restaurant with a clean grease trap, current manifests, and a posted cleaning schedule signals that management takes compliance seriously. This context matters when an inspector is deciding how to classify a borderline finding in another area. The overall impression of your operation influences the tone of the entire inspection.

### Prevents Cascade Failures

Grease trap problems rarely stay contained. An overflowing trap leads to standing water, which attracts pests, which creates additional violations. A backed-up drain can contaminate food preparation surfaces. A foul odor from decomposing grease affects the dining environment. One grease trap failure can generate three or four separate findings across different inspection categories.

Keeping your trap clean prevents this cascade before it starts.

### Supports Your Re-Inspection Position

If you do receive violations in other areas, having a clean grease trap with documentation gives you leverage during a re-inspection. It shows that you are responsive to maintenance requirements and that the other violations were exceptions, not the norm. Inspectors document corrective actions, and a strong grease trap compliance record is a corrective action that is already in place.

## Documentation Inspectors Want to See

Keep these items accessible — not in a filing cabinet in the office, but where a kitchen manager can produce them within two minutes of being asked:

1. **Current grease waste service manifest** — the most recent one, with all fields completed including hauler DEP license number, waste volume, and disposal facility
2. **Manifest history** — at least the last 12 months of manifests, showing consistent cleaning frequency
3. **Cleaning schedule** — a posted schedule showing planned service dates, consistent with your county's frequency requirement
4. **Hauler contract or service agreement** — showing your hauler's name, DEP license number, and agreed-upon service frequency
5. **Trap maintenance log** — any in-between maintenance your staff performs (skimming, cleaning around the access point)

Some Florida counties — including Hillsborough, Pinellas, and Sarasota — have their own FOG reporting requirements on top of the state-level Chapter 62-705 mandates. Check your [county's specific requirements](/compliance) to ensure you are maintaining the right documentation.

## The Inspection Score Is Public

In Florida, health inspection results are public record. Consumers, review sites, and local media regularly reference inspection scores. A lower score from preventable grease trap violations affects public perception, Google reviews, and ultimately your revenue.

Several Florida counties publish inspection results online, and platforms like Yelp display health inspection scores directly on restaurant profiles. A grease-trap-related violation is visible to every potential customer who checks your score.

## Build Grease Trap Compliance Into Your Routine

The restaurant owners who consistently score well on inspections are not doing anything extraordinary. They have systems:

1. **Set up a recurring service contract** with a [licensed hauler in your area](/companies) — automatic scheduling means you never miss a cleaning
2. **Designate a manifest manager** — one person on staff responsible for receiving, reviewing, and filing every manifest
3. **Post your cleaning schedule** in the kitchen — visible to staff and inspectors
4. **Brief your team** on the [warning signs](/blog/warning-signs-grease-trap-needs-cleaning) of a trap that needs attention between scheduled cleanings
5. **Review your compliance status** quarterly using our [compliance resources](/compliance)

Your grease trap should be the easiest item on your inspection. With a current contract, filed manifests, and a clean trap, it is.

---

## Frequently Asked Questions

**Can a dirty grease trap cause my restaurant to fail a health inspection?**
A dirty grease trap alone is unlikely to cause an outright failure, but it can contribute to one. An overflowing trap that creates standing water or contaminates food surfaces is a high-priority violation that requires immediate correction. Combined with other violations, grease trap issues can push your score below passing thresholds and trigger a mandatory re-inspection.

**How often do Florida health inspectors check grease traps?**
Grease traps are evaluated during every routine inspection, which typically occurs two to four times per year for restaurants. Some county FOG programs conduct separate inspections focused specifically on grease compliance, in addition to routine health inspections. These FOG-specific inspections may be more frequent for establishments with a history of violations.

**What should I do if I get a grease trap violation on my inspection?**
Address it immediately. Schedule a cleaning within 24-48 hours if the trap is full, locate your manifests if documentation was the issue, and contact your hauler if there were questions about licensing. Document all corrective actions with dates and receipts. During the re-inspection, present your corrective actions and updated documentation to demonstrate compliance.`,
  },
  {
    slug: "food-truck-grease-trap-requirements-florida",
    title: "Food Truck Grease Trap Requirements in Florida",
    excerpt:
      "Yes, food trucks need grease trap compliance too. Here is how Florida's DBPR requirements, commissary kitchens, and mobile operations all connect.",
    category: "blog",
    image_url: "/images/blog-kitchen-1.webp",
    meta_title: "Food Truck Grease Trap Rules in Florida",
    meta_description:
      "Florida food trucks must comply with grease trap requirements through commissary kitchens. Learn DBPR rules, mobile options, and maintenance schedules.",
    published_at: "2026-03-27T10:00:00-04:00",
    content: `You spent months perfecting your menu, sourcing a truck, and navigating permits. Then someone mentions grease traps and you think: that is a brick-and-mortar problem. It is not. If you operate a food truck in Florida and your menu involves any cooking with fats, oils, or grease — which covers virtually every food truck in the state — grease trap compliance is part of your operating reality.

The rules work differently for mobile operations than for fixed-location restaurants, but they exist, they are enforced, and getting them wrong can put your food truck license at risk. Here is what every Florida food truck operator needs to know.

## Do Food Trucks Need Grease Traps?

The short answer: yes, but not necessarily on the truck itself.

Florida's Department of Business and Professional Regulation (DBPR) requires all mobile food dispensing vehicles to operate from a licensed commissary kitchen. This commissary serves as your base of operations for food prep, storage, warewashing, and — critically — wastewater disposal.

The commissary kitchen is where grease trap compliance lives for food truck operators. When you wash dishes, clean equipment, or dispose of cooking liquids at the commissary, that wastewater flows through the commissary's grease trap system. The commissary is responsible for maintaining its grease trap in compliance with local FOG ordinances and [Chapter 62-705 F.A.C.](/compliance/chapter-62-705-guide).

But here is where food truck operators get caught: **the commissary's compliance is not entirely the commissary's problem. It is yours too.**

## Your Commissary Kitchen Connection

Under DBPR rules, your food truck license is tied to a specific commissary. During inspections — which happen at both the commissary and on-location at events — inspectors verify that:

- Your commissary agreement is current and valid
- The commissary is licensed and in good standing
- You are actually using the commissary for the services listed in your agreement (not just paying for the address)
- Wastewater from your operations is being properly disposed of through the commissary's systems

If your commissary loses its license due to FOG violations — which happens more often than you might think — your food truck license is directly affected. You cannot operate from an unlicensed commissary, and finding a new one on short notice in a competitive market like Miami, Tampa, or Orlando can take weeks.

This is why smart food truck operators do not just find the cheapest commissary. They verify that the commissary has a clean compliance record, a maintained grease trap, and current service manifests. Your business depends on it.

### What to Verify at Your Commissary

Before signing a commissary agreement, ask these questions:

1. **When was the grease trap last serviced?** Ask to see the most recent manifest. If they cannot produce one, that is a red flag.
2. **What is the cleaning frequency?** It should align with the county's FOG requirements. In Hillsborough County, that is every 90 days. In Pinellas, monthly.
3. **Who is the hauler?** Verify that they use a [DEP-licensed grease trap service provider](/companies). You can check licensing status through the Florida DEP.
4. **Has the commissary received any FOG violations?** Ask directly. Inspection results are public record.
5. **Is the trap sized for the number of operators using the facility?** A commissary serving ten food trucks generates significantly more FOG than one serving two. An undersized trap fills faster and creates compliance problems for everyone.

## Mobile Grease Trap Options

While the commissary handles the bulk of your grease trap compliance, some food truck operators also need on-vehicle or portable grease management solutions:

### Portable Grease Traps

Small, portable grease traps (typically 10-35 gallons) can be installed on or carried with a food truck. These are especially useful for:

- **High-volume frying operations** that generate significant FOG during service
- **Events where you are far from your commissary** and cannot dispose of wastewater during the day
- **County health departments that require point-of-use traps** on mobile operations (requirements vary by county)

Portable traps are not a substitute for commissary compliance, but they provide an additional layer of protection. They capture FOG at the source — on your truck — before it enters any disposal system.

### Gray Water Containment

Florida requires food trucks to have gray water holding tanks for wastewater generated during operation. This wastewater must be disposed of properly — either at your commissary or at an approved dump station. Dumping gray water into storm drains, parking lots, or open ground is an environmental violation that can result in fines and license action.

Some food truck operators use small inline grease filters or strainers on their gray water systems to reduce FOG content before it reaches the holding tank. This is a good practice that makes disposal easier and keeps your holding tank cleaner, but it does not eliminate the need for proper commissary-based grease trap compliance.

## Florida DBPR Requirements for Mobile Operations

The DBPR regulates food trucks under Chapter 509, Florida Statutes, and Rule 61C-4, Florida Administrative Code. Key requirements that intersect with grease compliance include:

### Commissary Agreement

Every food truck must have a written commissary agreement that specifies which services you will use at the facility. These typically include:

- Food storage and preparation
- Warewashing (dishwashing)
- Wastewater disposal
- Equipment cleaning
- Dry storage

The wastewater disposal component is directly tied to grease trap compliance. If your agreement does not include wastewater disposal, you have a problem — where is your cooking wastewater going?

### Inspection Frequency

DBPR inspects food trucks at their commissary and at operating locations. Inspectors check:

- Valid commissary agreement
- Proper gray water management
- Wastewater disposal procedures
- Overall equipment cleanliness (including fryers, grills, and surfaces that generate FOG)

Inspections can happen unannounced at festivals, food truck parks, and regular operating locations. Having your commissary agreement, recent commissary visit records, and gray water management documentation on the truck is essential.

### Record Keeping

Maintain these records on your truck or in easily accessible digital format:

- Current commissary agreement
- Log of commissary visits (dates, services used)
- Gray water disposal log
- Equipment maintenance records
- Any county-specific permits or FOG compliance documentation

## Maintenance Schedule for Mobile Operations

Food trucks have unique maintenance needs compared to fixed-location restaurants. Here is a practical schedule:

### Daily

- Empty and clean portable grease traps (if equipped)
- Strain gray water before adding to holding tank
- Wipe down cooking surfaces that generate FOG
- Empty gray water holding tank at commissary or approved dump station

### Weekly

- Deep clean all fryers, grills, and cooking equipment at the commissary
- Clean gray water tank thoroughly
- Inspect portable grease trap for damage or wear

### Monthly

- Verify commissary grease trap is on schedule (ask the manager or check the posted manifest)
- Review gray water disposal log for completeness
- Inspect gray water holding tank connections and valves

### Quarterly

- Confirm commissary hauler is still DEP-licensed
- Review commissary agreement terms
- Check for any county FOG ordinance updates that affect your operation

## Common Mistakes Food Truck Operators Make

### 1. Treating the Commissary as Just a Mailing Address

Some operators sign a commissary agreement but rarely use the facility, preferring to prep on the truck and dispose of wastewater informally. This violates DBPR requirements and creates a paper trail that does not match your actual operations. Inspectors notice.

### 2. Dumping Gray Water Improperly

Pouring gray water into a parking lot drain, a storm sewer, or behind a building is an environmental violation. In many Florida counties, storm drains flow directly to waterways. Getting caught means fines from the county environmental department and potential DBPR action against your food truck license.

### 3. Ignoring the Commissary's Grease Compliance

Your commissary's grease trap problems become your problems. If the commissary gets cited for FOG violations and its operations are disrupted, your food truck has no legal base of operations. Stay informed about your commissary's compliance status.

### 4. Not Carrying Documentation

When an inspector visits your truck at a festival, they may ask for your commissary agreement, gray water records, and other documentation. "It is at the commissary" is not an acceptable answer. Keep copies — physical or digital — accessible at all times.

### 5. Skipping Portable Trap Maintenance

If you invest in a portable grease trap, it only works if you clean it. A neglected portable trap overflows, creates a mess, and provides zero benefit. Daily cleaning takes five minutes and prevents problems.

### 6. Assuming County Rules Are the Same Everywhere

Miami-Dade's FOG requirements differ from Hillsborough's, which differ from Pinellas's. If your food truck operates across multiple counties — many do — you need to understand each county's rules. What is compliant in one county may not be in another. Check our [county-specific compliance pages](/compliance) for requirements in the areas where you operate.

## Finding Grease Trap Services for Food Truck Operations

Most [grease trap service companies](/companies) focus on fixed-location restaurants, but many also service commissary kitchens and can advise food truck operators on portable trap options. When searching for a provider:

- Look for companies experienced with commissary kitchen service
- Ask about portable grease trap sales and maintenance
- Verify DEP licensing — the same requirements apply regardless of whether they are servicing a restaurant or a commissary
- Consider companies that offer flexible scheduling, since commissary kitchens often need service outside normal business hours

Browse the [Florida grease trap service directory](/companies) to find providers in your county.

---

## Frequently Asked Questions

**Can I install a permanent grease trap on my food truck?**
It depends on your truck's plumbing configuration and your county's requirements. Some food trucks have small under-sink traps plumbed into their gray water system. This is more common on larger, custom-built trucks with full kitchen buildouts. Check with your county health department for specific requirements, and ensure any installation is done by a licensed plumber.

**What happens if my commissary loses its license?**
You must stop operating until you establish a new commissary agreement with a licensed facility. Operating without a valid commissary is a DBPR violation that can result in fines, license suspension, or revocation. To protect yourself, research backup commissary options in your area before you need them.

**Do food truck parks provide grease trap services?**
Some food truck parks have shared grease management infrastructure, including grease traps and gray water disposal stations. However, this does not replace your commissary requirement. Even if a food truck park provides grease disposal, you still need a licensed commissary agreement that covers all DBPR requirements. Ask the park operator about their FOG management setup and how it complements your existing commissary arrangement.`,
  },
  {
    slug: "opening-restaurant-florida-grease-checklist",
    title:
      "Opening a Restaurant in Florida? Your Complete Grease Compliance Checklist",
    excerpt:
      "From pre-construction permits to your first pump-out manifest, this checklist covers every grease trap compliance step for new Florida restaurants.",
    category: "blog",
    image_url: "/images/blog-kitchen-2.webp",
    meta_title: "FL Restaurant Grease Compliance Checklist",
    meta_description:
      "Opening a Florida restaurant? Use this grease trap compliance checklist covering permits, installation, hauler contracts, manifests, and ongoing compliance.",
    published_at: "2026-03-30T10:00:00-04:00",
    content: `You have the concept, the location, and maybe even the lease signed. The buildout is taking shape in your mind — the kitchen layout, the dining room flow, the menu that is going to put you on the map. Somewhere on your to-do list, between liquor license applications and health department approvals, there is a line item that reads "grease trap." It probably does not feel urgent yet.

It should. Grease trap compliance is one of the most common sources of delay, surprise cost, and post-opening violations for new Florida restaurants. The trap itself is not complicated, but the web of requirements — sizing, permits, installation, hauler contracts, manifests, county reporting — catches first-time restaurant owners off guard every time.

This checklist walks you through every grease compliance step, from pre-construction planning through your first year of operation. Print it, bookmark it, hand it to your general contractor. You will reference it more than you expect.

## Phase 1: Pre-Construction Planning

Before any construction begins, these items must be addressed. Getting them wrong at this stage means costly corrections later.

- [ ] **Determine your grease trap requirement.** Contact your county's utility or environmental department. Every Florida county that operates a municipal sewer system requires food service establishments to have a grease trap or grease interceptor. There are no exceptions for small restaurants.

- [ ] **Identify your county's FOG ordinance.** Requirements vary significantly by county. Miami-Dade's DERM program has different rules than Hillsborough's Grease Management Program or Pinellas's Commercial Grease Management requirements. Find your county's specific requirements through our [compliance resources](/compliance).

- [ ] **Calculate trap sizing.** Grease trap size is determined by the volume of water your kitchen fixtures discharge. The sizing formula considers the number of sinks, dishwashers, and other fixtures; the drainage rate in gallons per minute; and a retention time (typically 30 minutes). Your plumber or engineer should calculate this using the Uniform Plumbing Code (UPC) or your county's specific sizing requirements. Undersizing is the most common and most expensive mistake at this stage. Our [grease trap sizing guide](/guides/grease-trap-sizing-florida-restaurants) walks through the calculation.

- [ ] **Decide on trap type.** Interior (under-sink or floor-level) traps are smaller and less expensive but require more frequent cleaning. Exterior underground interceptors are larger, less disruptive to service, and clean less often — but cost more to install. Most Florida restaurants with full kitchens need an exterior interceptor. Your county may mandate a minimum size that dictates which type is required.

- [ ] **Include the trap in your architectural plans.** The grease trap must appear on your plumbing plans submitted for permit review. The county will not approve plumbing permits without a grease trap that meets their sizing and placement requirements.

- [ ] **Budget for installation.** Interior traps: $500 to $2,000 installed. Exterior interceptors: $3,000 to $15,000+ depending on size, excavation requirements, and site conditions. Include this in your buildout budget now, not as a surprise later.

- [ ] **Submit plans for review.** Your architect or engineer submits plumbing plans to the county building department and the local sewer utility. Both must approve the grease trap installation before construction proceeds. Allow 2-4 weeks for review in most Florida counties. Busy counties like Miami-Dade and Broward can take longer.

## Phase 2: Installation

Once permits are approved, installation can proceed. These items ensure the installation meets code and passes inspection.

- [ ] **Hire a licensed plumber.** Florida requires grease trap installation by a licensed plumbing contractor. This is not a DIY or handyman job. The plumber must pull the appropriate permits and schedule inspections.

- [ ] **Route all grease-producing fixtures through the trap.** Every sink, floor drain, and dishwasher in food preparation and warewashing areas must drain through the grease trap. Common mistake: failing to route the dishwasher line through the trap. Inspectors check this.

- [ ] **Do NOT route non-grease fixtures through the trap.** Restroom drains, mop sinks (in some counties), and non-kitchen drains should not flow through the grease trap. Excess clean water dilutes the trap's effectiveness and causes it to fill faster with water instead of capturing grease.

- [ ] **Install an accessible clean-out.** The grease trap must be accessible for cleaning and inspection. Interior traps need clear floor access (do not install equipment on top of them). Exterior interceptors need lids that are not obstructed by vehicles, dumpsters, or landscaping.

- [ ] **Pass the plumbing inspection.** The county building inspector will verify proper installation, sizing, connections, and accessibility. Obtain the signed inspection report — you will need it for your occupancy permit and for your FOG program file.

- [ ] **Obtain your FOG permit or registration.** Many Florida counties require food service establishments to register with the local FOG program in addition to standard building permits. This may involve a separate application to the county sewer utility. Counties with formal FOG programs include Miami-Dade, Hillsborough, Pinellas, Orange, Sarasota, and Palm Beach, among others.

## Phase 3: Operations Setup (Before Opening)

Your trap is installed and inspected. Now set up the operational systems that keep you compliant after you open.

- [ ] **Contract with a DEP-licensed hauler.** Before you serve your first customer, have a signed service agreement with a [licensed grease trap cleaning company](/companies). Do not wait until the trap needs cleaning to find a hauler. The contract should specify:
  - Cleaning frequency (per your county's requirement)
  - Automatic scheduling (hauler initiates, not you)
  - Manifest provision (required under Chapter 62-705)
  - Emergency service availability

- [ ] **Verify your hauler's DEP license.** Under [Chapter 62-705 F.A.C.](/compliance/chapter-62-705-guide), grease waste haulers must be licensed by the Florida Department of Environmental Protection. You are responsible for using a licensed hauler. An unlicensed hauler — even one that does excellent work — creates a compliance violation for you. Learn [how to verify licensing](/guides/how-to-verify-grease-hauler-dep-licensed).

- [ ] **Set up your manifest filing system.** You will receive a grease waste service manifest after every cleaning. State law requires you to retain these for five years. Create a dedicated file — physical or digital — for manifests. Label it clearly. Make sure at least two people in your operation know where it is.

- [ ] **Create a cleaning schedule.** Post your grease trap cleaning schedule in the kitchen where staff and inspectors can see it. Include:
  - Cleaning frequency
  - Hauler name and contact info
  - Next scheduled service date
  - Person responsible for verifying service was completed

- [ ] **Train your staff on grease management basics.** Kitchen staff should know:
  - Never pour grease down any drain
  - Scrape plates and pans into the trash before washing
  - Use strainer baskets in all sink drains
  - Report slow drains or odors to management immediately
  - Where the grease trap is located and how to check if it is accessible

- [ ] **Set up used cooking oil collection.** Used cooking oil (from fryers) is separate from grease trap waste. Arrange for a cooking oil recycling service to provide a collection container and regular pickup. This is not the same as your grease trap hauler, though some companies offer both. See our guide on [cooking oil recycling vs grease trap waste](/guides/used-cooking-oil-recycling-vs-grease-trap-waste).

## Phase 4: Ongoing Compliance (First Year and Beyond)

Opening day arrives, customers fill the dining room, and the kitchen hums. Now the real compliance work begins — maintaining what you built.

- [ ] **Track every cleaning.** After each service, verify:
  - The manifest was left and is complete (date, volume, hauler info, disposal facility, signatures)
  - The next service date is scheduled
  - The cleaning log is updated

- [ ] **File every manifest.** Immediately. Not next week, not at the end of the month. The manifest goes in the file the day of service. A missing manifest during an inspection is treated as if the cleaning never happened.

- [ ] **Monitor cleaning frequency.** Your county sets the minimum, but your kitchen's actual grease production may require more frequent service. If your hauler consistently reports that the trap is near capacity at each cleaning, increase the frequency. Common county requirements:
  - Miami-Dade: 25% capacity rule (clean before trap is 25% full)
  - Hillsborough: Every 90 days
  - Sarasota: Every 30 days (traps), every 90 days (interceptors)
  - Pinellas: Monthly (interceptors)

- [ ] **Schedule annual trap inspection.** In addition to regular cleanings, have your hauler or a plumber inspect the trap annually for structural issues: cracks, corrosion, baffle damage, inlet/outlet deterioration. Catching problems early prevents expensive replacements.

- [ ] **Respond to county FOG program communications.** If your county has a FOG program, they may send compliance reminders, request documentation, or schedule inspections. Respond promptly. Ignoring FOG program communications escalates to enforcement action.

- [ ] **Update records when anything changes.** New hauler? New cleaning frequency? Trap repair or replacement? Update your file. Inspectors look for consistency between your records, your schedule, and your hauler's manifests.

- [ ] **Budget for ongoing costs.** Plan for:
  - Regular pump-outs: $200-500 per service, 4-12 times per year depending on size and frequency
  - Occasional hydro jetting: $300-600 per service
  - Annual inspection: Often included in service contracts
  - Potential repairs: Budget $500-2,000 annually as a reserve

- [ ] **Review compliance quarterly.** Every three months, pull your manifest file and verify:
  - All scheduled cleanings occurred
  - All manifests are on file and complete
  - Hauler DEP license is current
  - No county communications were missed

## The Cost of Getting It Right vs. Getting It Wrong

| Item | Getting It Right | Getting It Wrong |
|---|---|---|
| Trap sizing | $3,000-10,000 (once) | $5,000-20,000 (tear out and replace) |
| Regular cleanings | $200-500/service | $500-1,500/emergency call |
| Documentation | 5 minutes per service | Inspection violations, re-inspection fees |
| FOG compliance | Clean record | Fines of $100-$5,000 per violation |
| County FOG registration | $0-150/year | Operating without registration: enforcement action |

The total annual cost of proper grease compliance for a typical Florida restaurant is $2,000 to $6,000. The cost of non-compliance — including emergency service, fines, re-inspections, and reputation damage — can easily exceed $10,000 in a single incident.

## Find Your Grease Trap Service Provider

Do not wait until your trap is full to start searching. Browse the [Florida grease trap service directory](/companies) now and set up a service contract before you open. Filter by county, check reviews, and verify DEP licensing all in one place.

Need help understanding your county's specific requirements? Visit our [compliance hub](/compliance) for county-by-county grease trap regulations across Florida.

---

## Frequently Asked Questions

**How long does it take to get a grease trap permit approved in Florida?**
Plan review typically takes 2-4 weeks in most Florida counties. Larger counties like Miami-Dade and Broward may take longer during busy periods. Some counties offer expedited review for an additional fee. Submit your plans as early as possible in the buildout process — waiting until the last minute is the most common cause of opening delays related to grease compliance.

**Can I open my restaurant before the grease trap is installed?**
No. Your certificate of occupancy requires a passing plumbing inspection, which includes the grease trap. Additionally, your health department permit requires grease management infrastructure to be in place before you can serve food. There are no temporary exemptions for new restaurants.

**What size grease trap does a small restaurant need?**
Size depends on your fixture count and drainage rate, not the number of seats. A small restaurant with a three-compartment sink, a prep sink, and a dishwasher typically needs a minimum 40-50 gallon per minute (GPM) trap or a 750-1,000 gallon interceptor. However, your county may have specific minimums that override the calculation. Always have a licensed plumber or engineer size your trap based on your actual kitchen plans and local code requirements.`,
  },
  {
    slug: "grease-trap-myths-florida",
    title: "6 Grease Trap Myths Florida Restaurant Owners Still Believe",
    excerpt:
      "Enzyme treatments, annual cleanings, and the idea that your hauler handles everything — these persistent myths cost Florida restaurants thousands every year.",
    category: "blog",
    image_url: "/images/blog-kitchen-3.webp",
    meta_title: "6 Grease Trap Myths Debunked for Florida",
    meta_description:
      "Debunking 6 common grease trap myths Florida restaurant owners believe: enzymes, annual cleaning, plumber licensing, additives, and hauler paperwork.",
    published_at: "2026-04-02T10:00:00-04:00",
    content: `There is a particular kind of confidence that comes from running a restaurant for a few years. You figure out your food costs, your staffing model, your vendor relationships. And somewhere along the way, you also pick up a set of beliefs about grease traps that feel true because everyone in the industry repeats them.

The problem is that several of those beliefs are wrong — and in Florida, where Chapter 62-705 created a new layer of state-level grease waste regulation effective December 7, 2025, acting on bad information has real consequences. Fines, failed inspections, voided insurance, environmental violations.

Here are six grease trap myths that Florida restaurant owners still believe, why each one is wrong, and what to do instead.

## Myth 1: "Enzyme Treatments Replace Professional Pumping"

**The claim:** Pour an enzyme or bacteria-based product into your drains weekly, and it will break down grease so thoroughly that you never need (or rarely need) a professional pump-out.

**The reality:** Enzyme and biological treatments can reduce the rate of grease accumulation in a trap, but they do not eliminate it. These products work by introducing bacteria or enzymes that partially digest fats, oils, and grease. Some products are genuinely effective at slowing buildup, which can extend the time between cleanings by a modest amount.

But here is what the salespeople do not mention: no enzyme product eliminates the need for mechanical pump-outs. The bacteria cannot consume 100% of the FOG and solid waste that enters your trap. They cannot remove the settled sludge layer at the bottom. And most importantly, **Florida county FOG ordinances do not recognize enzyme treatments as a substitute for scheduled pump-outs.**

If your county requires cleaning every 90 days and you tell the inspector "I use enzymes instead," you will receive a violation. The county does not care about your enzyme regimen. They care about your most recent [grease waste service manifest](/compliance/grease-waste-manifest).

**What to do instead:** Use enzyme treatments as a supplement, not a replacement. They can be part of your between-cleaning maintenance routine, helping keep drains flowing between scheduled pump-outs. But never skip or delay a scheduled professional cleaning because you think the enzymes are handling it.

## Myth 2: "My Restaurant Is Small — I Don't Need a Grease Trap"

**The claim:** Small restaurants, cafes, or food establishments with limited menus that do not involve heavy frying do not generate enough grease to need a trap.

**The reality:** In Florida, every food service establishment connected to a municipal sewer system is required to have a grease trap or grease interceptor. Period. This is not based on how much grease you think you produce — it is based on what you are. If you prepare food commercially and discharge wastewater into the sewer, you need a trap.

This requirement exists because even "low-grease" operations produce more FOG than you think. Butter, cooking oils, salad dressings, cheese, cream-based sauces, baked goods — all contribute to FOG. A small cafe that makes sandwiches and soup generates enough grease to cause sewer line problems over time. That is exactly what grease traps prevent.

The size of your required trap may be smaller for a low-volume operation, but the requirement itself does not disappear. During health inspections, the [absence of a grease trap in a food service establishment](/blog/grease-trap-maintenance-health-inspection) is a code violation that must be corrected — and correction means installing one, which is far more expensive as a retrofit than as part of an initial buildout.

**What to do instead:** If you are opening any food service establishment in Florida, include a grease trap in your buildout from day one. If you are operating without one, contact your county's utility department to understand your options before an inspector makes the decision for you. Browse [grease trap installation services](/services/grease-trap-installation) in your area.

## Myth 3: "Any Licensed Plumber Can Clean My Grease Trap"

**The claim:** A licensed plumber can pump out your grease trap during a service call, so you do not need a specialized grease trap company.

**The reality:** This one is complicated because the answer depends on what you mean by "clean."

A licensed plumber can:
- Install and repair grease traps
- Perform minor maintenance (clearing clogs, replacing components)
- Inspect the trap's physical condition

However, **the removal and transport of grease waste** is a regulated activity under [Chapter 62-705 F.A.C.](/compliance/chapter-62-705-guide) The law requires that grease waste be removed by a DEP-licensed hauler using approved equipment, transported in a registered vehicle, and disposed of at a DEP-permitted facility. The hauler must provide a manifest documenting the entire chain of custody.

Most plumbers do not hold a DEP grease waste hauler license. A plumber who pumps out your grease trap and takes the waste away in their truck — without DEP licensing, without a vacuum tanker, without a manifest, without delivering to a permitted disposal facility — is breaking the law. And under Chapter 62-705, the originator (you) is also responsible for ensuring that your grease waste is handled by a licensed hauler.

**What to do instead:** Use your plumber for installation, repairs, and inspections. Use a [DEP-licensed grease trap hauler](/companies) for pump-outs and waste removal. Some companies offer both plumbing and hauling services, but always verify the DEP hauler license separately. Learn [how to verify your hauler's credentials](/guides/how-to-verify-grease-hauler-dep-licensed).

## Myth 4: "Cleaning Once a Year Is Enough"

**The claim:** Your grease trap only needs to be pumped out once or twice a year, especially if it is a large interceptor.

**The reality:** Annual cleaning is almost never sufficient for an operating food service establishment in Florida. Here is why:

Most Florida counties set specific cleaning frequency requirements:
- **Miami-Dade:** 25% capacity rule — clean before the trap reaches 25% capacity, regardless of calendar
- **Hillsborough:** Every 90 days
- **Pinellas:** Monthly for grease interceptors
- **Sarasota:** Every 30 days for interior traps, every 90 days for interceptors

Even in counties without a specific frequency mandate, the general standard is quarterly (every 90 days) for most restaurant operations. A full-service restaurant with fryers, a busy grill line, and a high-volume dishwasher will fill a standard 1,000-gallon interceptor well before the 90-day mark.

Annual cleaning might work for a very low-volume establishment with a very large interceptor — a church kitchen that is used once a week, for example. But if you are operating a restaurant, a catering facility, a hotel kitchen, or any establishment with daily food service, annual cleaning is a fast track to backups, odors, violations, and emergency service calls that cost three times as much as a scheduled cleaning.

**What to do instead:** Follow your county's mandated frequency as a minimum. Then adjust upward based on your hauler's reports. If the trap is consistently more than 25% full at each cleaning, you need more frequent service. A good hauler will tell you this. A great hauler will suggest the adjustment before you have a problem. Find [providers in your county](/county) and discuss the right frequency for your operation.

## Myth 5: "Grease Trap Additives Actually Work"

**The claim:** Chemical additives, degreasers, or "grease dissolvers" poured into your trap break down grease and keep the trap clean. Some products claim to eliminate grease entirely.

**The reality:** Most grease trap additives do not work as advertised, and some actually make things worse. Here is the breakdown:

**Chemical degreasers and emulsifiers:** These products do not destroy grease. They emulsify it — meaning they break large grease globs into smaller droplets that are suspended in water. The grease passes through your trap and enters the sewer system, which is exactly what the trap is supposed to prevent. Your trap looks cleaner, but you have just pushed the problem downstream. Many Florida counties explicitly prohibit the use of emulsifying agents in grease traps for this reason.

**"Grease dissolvers":** Marketing language. No product dissolves grease. They either emulsify it (see above) or partially digest it with biological agents (see enzyme discussion in Myth 1). The grease does not disappear — it goes somewhere.

**Biological treatments (enzymes/bacteria):** These are the most legitimate category of additives. They can slow accumulation between cleanings. But as discussed in Myth 1, they do not replace pump-outs, and they do not eliminate grease — they reduce its volume modestly.

**Caustic soda or lye:** Sometimes used as drain cleaners, these products can damage grease trap components (especially plastic traps), harm the biological activity in municipal wastewater systems, and create safety hazards for your staff. Do not use them.

**What to do instead:** Skip the additives shelf at the restaurant supply store. Invest that money in proper cleaning frequency instead. The only additive that reliably keeps a grease trap functional is regular professional pump-outs. Between cleanings, the best maintenance is operational: scrape plates, use strainer baskets, never pour oil down drains, and train your staff on [grease trap maintenance basics](/guides/grease-trap-maintenance-tips-between-cleanings).

## Myth 6: "The Hauler Handles All the Paperwork"

**The claim:** Once you hire a grease trap hauler, they take care of all the compliance paperwork — manifests, county reporting, DEP requirements. You just need to pay the invoice.

**The reality:** Your hauler handles their side of the paperwork. Your side is still your responsibility. Under [Chapter 62-705](/compliance/chapter-62-705-guide), the compliance chain has two parties:

**The hauler is responsible for:**
- Providing a completed manifest at the time of service
- Transporting waste in a registered vehicle to a permitted facility
- Filing their copy of the manifest
- Maintaining their DEP license

**You (the originator) are responsible for:**
- Retaining your copy of every manifest for five years
- Ensuring the manifest is complete and accurate (check it before the hauler leaves)
- Verifying that you are using a DEP-licensed hauler
- Meeting your county's cleaning frequency requirement
- Responding to county FOG program inquiries and inspections
- Maintaining a cleaning log and schedule

The hauler does not track whether you are cleaning frequently enough. They do not file reports with your county on your behalf (unless your county has a specific program that requires hauler reporting). They do not verify that your trap is the right size or that all fixtures are properly routed.

Think of it like taxes: your accountant prepares the return, but you sign it and you are liable for its accuracy. Your hauler provides the service and the manifest, but you are responsible for the compliance picture.

**What to do instead:** Treat your grease trap compliance as an active management responsibility, not a passive vendor relationship. After every service:
1. Review the manifest before the technician leaves — is it complete?
2. File it immediately in your designated location
3. Update your cleaning log
4. Note the next scheduled service date
5. Verify annually that your hauler's DEP license is current

If your county has a FOG program, make sure you understand their specific reporting or inspection requirements. Visit our [compliance hub](/compliance) for county-by-county details.

## The Common Thread

All six myths share a common thread: they are shortcuts. Enzymes instead of pump-outs. Skipping the trap because you are small. Using the wrong provider. Stretching cleaning intervals. Chemical fixes. Outsourcing responsibility. Each one feels like it saves time or money in the short term. Each one costs more in the long term — in fines, emergency service, equipment damage, or [health inspection problems](/blog/grease-trap-maintenance-health-inspection).

Florida's grease trap requirements exist because FOG in the sewer system causes real, expensive infrastructure damage — sewer overflows, treatment plant disruptions, and environmental contamination. The regulations are not going to get lighter. Chapter 62-705 was just the beginning. County FOG programs are expanding. Enforcement is increasing. The restaurant operators who build proper compliance systems now will be the ones who never have to deal with the consequences.

Start with the basics: a properly sized trap, a [licensed hauler](/companies), a consistent cleaning schedule, and a filing system for your manifests. Everything else is noise.

---

## Frequently Asked Questions

**Are there any grease trap additives that are approved by Florida counties?**
Most Florida counties do not formally approve or endorse any grease trap additive. Several counties — including Miami-Dade and Hillsborough — explicitly prohibit the use of emulsifying agents and chemical degreasers in grease traps. Some biological (enzyme/bacteria) treatments are permitted as supplements but not as replacements for mechanical cleaning. Check with your county's FOG program before using any additive product.

**How do I find out my county's specific grease trap cleaning frequency?**
Visit our [compliance hub](/compliance) for county-specific FOG ordinance details. You can also contact your county's water/sewer utility or environmental department directly. Most counties publish their FOG ordinance requirements online. If you cannot find your county's requirements, your [grease trap hauler](/companies) should be able to advise — they work with the same regulations daily.

**What is the penalty for using an unlicensed grease trap hauler in Florida?**
Under Chapter 62-705, both the unlicensed hauler and the originator who uses them can face enforcement action. Penalties can include fines ranging from $100 to $5,000 per violation, and repeated violations can result in escalating enforcement. Beyond fines, using an unlicensed hauler means your grease waste may not be properly disposed of, creating potential environmental liability. Always verify your hauler's DEP license before service. Learn more about [penalties and fines](/compliance/penalties-and-fines).`,
  },
];

async function main() {
  console.log("Inserting 6 blog posts into content_pages...\n");

  // Delete existing posts with these slugs first (idempotent)
  const slugs = posts.map((p) => p.slug);
  const { error: delError } = await supabase
    .from("content_pages")
    .delete()
    .in("slug", slugs);

  if (delError) {
    console.error("Warning: could not delete existing posts:", delError.message);
  }

  // Insert all posts
  const { data, error } = await supabase
    .from("content_pages")
    .insert(posts)
    .select("slug, title, published_at");

  if (error) {
    console.error("INSERT ERROR:", error.message);
    process.exit(1);
  }

  console.log(`Inserted ${data.length} blog posts:\n`);
  data.forEach((p) =>
    console.log(`  - ${p.slug} (${p.published_at})`)
  );

  // Verify
  console.log("\nVerifying all 6 exist...");
  const { data: verify, error: verifyErr } = await supabase
    .from("content_pages")
    .select("slug, title, category, published_at")
    .eq("category", "blog")
    .in("slug", slugs)
    .order("published_at");

  if (verifyErr) {
    console.error("VERIFY ERROR:", verifyErr.message);
    process.exit(1);
  }

  console.log(`\nVerified ${verify.length}/6 blog posts in content_pages:\n`);
  verify.forEach((p) =>
    console.log(`  [${p.category}] ${p.slug} — "${p.title}" (${p.published_at})`)
  );

  if (verify.length !== 6) {
    console.error(`\nERROR: Expected 6 posts, found ${verify.length}`);
    process.exit(1);
  }

  console.log("\nAll 6 blog posts inserted and verified successfully.");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});

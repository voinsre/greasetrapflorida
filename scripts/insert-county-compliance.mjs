import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

// Parse .env.local manually (no dotenv dependency)
const envFile = readFileSync(".env.local", "utf-8");
const env = {};
for (const line of envFile.split("\n")) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim();
}

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

const pages = [
  {
    slug: "miami-dade-county-grease-trap-requirements",
    title: "Miami-Dade County Grease Trap Requirements",
    category: "compliance",
    image_url: "/images/guide-compliance.webp",
    meta_title: "Miami-Dade County Grease Trap Requirements",
    meta_description: "Miami-Dade grease trap requirements including DERM FOG permits, the 25% capacity rule, GDO permits, and annual renewal obligations for food service facilities.",
    published_at: new Date().toISOString(),
    excerpt: "Miami-Dade County enforces some of the strictest grease trap regulations in Florida through the DERM FOG Program, including the 25% capacity rule and mandatory GDO permits.",
    content: `# Miami-Dade County Grease Trap Requirements

Miami-Dade County enforces some of the strictest grease trap regulations in Florida. All food service establishments (FSEs) must comply with the Department of Environmental Resources Management (DERM) Fats, Oils, and Grease (FOG) Program, which goes beyond state baseline requirements under [Chapter 62-705 F.A.C.](/compliance/chapter-62-705-guide).

## Local Ordinance Details

Miami-Dade County Code Chapter 24, administered by DERM, governs grease waste management. The FOG Program requires every FSE to obtain a Grease Discharge Obligation (GDO) permit before operating. DERM inspectors conduct routine and complaint-driven inspections to verify compliance. The enforcement agency is the Miami-Dade County Department of Environmental Resources Management (DERM), and the program is formally known as the DERM FOG Program.

## Pump-Out Frequency

Miami-Dade uses the 25% capacity rule rather than a fixed schedule. Grease traps and interceptors must be pumped before accumulated grease and solids reach 25% of the unit's total capacity. In practice, most restaurants need service every 30 to 60 days for interior traps and every 60 to 90 days for exterior interceptors. Facilities with high grease output may require more frequent service. DERM may set a specific frequency on your GDO permit based on your establishment type and inspection history.

## Documentation Required

During inspections, DERM expects the following documentation:

- Active GDO permit (renewed annually)
- Grease waste service manifests for every pump-out
- Maintenance log showing cleaning dates, hauler name, and volume removed
- Proof that only permitted grease waste haulers are used
- Best Management Practices (BMP) plan on file

## Penalties

Non-compliance in Miami-Dade carries significant consequences. DERM can issue Notices of Violation (NOVs) with fines starting at $500 per day per violation. Repeated violations can escalate to $1,000 or more per day. Failure to obtain or renew a GDO permit can result in permit revocation and forced closure until compliance is achieved. Sewer blockages caused by FOG can result in additional liability for cleanup costs.

## How to Stay Compliant

1. **Obtain and renew your GDO permit annually** — applications are submitted through DERM and must be renewed before expiration.
2. **Schedule regular pump-outs** before grease reaches 25% capacity — do not wait for inspections to trigger service.
3. **Use only Miami-Dade permitted grease waste haulers** — unauthorized haulers can void your compliance status.
4. **Keep all manifests and maintenance logs organized** and accessible for at least three years.
5. **Train kitchen staff on BMPs** including scraping plates, using drain screens, and proper oil disposal.

## Find a Service Provider

Browse verified grease trap service companies in [Miami-Dade County](/county/miami-dade) to find permitted haulers near your business.

## Frequently Asked Questions

### What is the 25% capacity rule in Miami-Dade?
The 25% rule means your grease trap or interceptor must be pumped before accumulated fats, oils, grease, and solids reach 25% of the unit's total liquid depth. This is stricter than many other Florida counties that use fixed-interval schedules.

### Do I need a GDO permit for a food truck in Miami-Dade?
Food trucks that discharge to the county sewer system are generally required to have grease management in place. Contact DERM directly to determine if your mobile food operation requires a GDO permit based on your discharge method.

### How often does DERM inspect grease traps?
DERM conducts inspections on a routine basis, typically annually for compliant facilities. However, facilities with a history of violations or those generating complaints may be inspected more frequently, including unannounced visits.`
  },
  {
    slug: "hillsborough-county-grease-trap-requirements",
    title: "Hillsborough County Grease Trap Requirements",
    category: "compliance",
    image_url: "/images/guide-compliance.webp",
    meta_title: "Hillsborough County Grease Trap Requirements",
    meta_description: "Hillsborough County grease trap requirements including the Grease Management Program, 90-day pumping schedule, and City of Tampa approved manifest requirements.",
    published_at: new Date().toISOString(),
    excerpt: "Hillsborough County requires grease trap pumping every 90 days through its Grease Management Program, with City of Tampa approved manifests for all service events.",
    content: `# Hillsborough County Grease Trap Requirements

Hillsborough County requires all food service establishments to maintain grease traps and interceptors under its Grease Management Program. The county enforces a 90-day maximum pumping interval, which is stricter than the state baseline under [Chapter 62-705 F.A.C.](/compliance/chapter-62-705-guide).

## Local Ordinance Details

The Hillsborough County Grease Management Program operates under county environmental ordinances and is enforced by the Hillsborough County Public Utilities Department. Within the City of Tampa, the Tampa Water Department co-enforces grease management requirements. All FSEs connected to the public sewer system must register with the program and maintain an active grease management plan.

## Pump-Out Frequency

Hillsborough County mandates that grease traps and interceptors be pumped at least every 90 days. This applies to all commercial food preparation establishments regardless of trap size. The City of Tampa follows the same 90-day requirement. Facilities with smaller traps or higher grease output may need to pump more frequently to prevent blockages. Your specific frequency may be adjusted by the county based on inspection findings.

## Documentation Required

Inspectors in Hillsborough County require:

- City of Tampa approved grease waste manifests for all pump-outs
- Maintenance records showing date, hauler company, and gallons removed
- Registration documentation with the Grease Management Program
- Current grease trap sizing documentation
- Evidence of employee training on grease management best practices

## Penalties

Hillsborough County enforces FOG violations through escalating actions. Initial violations result in a written Notice of Violation with a compliance deadline (typically 30 days). Continued non-compliance leads to fines of up to $500 per day. Chronic violators may face sewer service disconnection. The City of Tampa can impose surcharges on sewer bills for facilities that cause FOG-related blockages or sanitary sewer overflows (SSOs).

## How to Stay Compliant

1. **Register with the Grease Management Program** — ensure your facility is on file with the county.
2. **Pump every 90 days minimum** — set a recurring schedule with your service provider to avoid lapses.
3. **Use City of Tampa approved manifests** — ensure your hauler provides the correct documentation for every service visit.
4. **Keep records for a minimum of three years** — inspectors may request historical compliance data.
5. **Install properly sized equipment** — undersized traps lead to more frequent failures and violations.

## Find a Service Provider

Browse verified grease trap service companies in [Hillsborough County](/county/hillsborough) to find compliant haulers near your business.

## Frequently Asked Questions

### Is the 90-day rule the same for traps and interceptors in Hillsborough?
Yes. Hillsborough County applies the 90-day maximum pumping interval to both interior grease traps and exterior grease interceptors. However, smaller interior traps may need more frequent cleaning depending on usage volume.

### Do I need different permits for Tampa vs unincorporated Hillsborough?
Facilities within the City of Tampa fall under Tampa Water Department oversight, while unincorporated areas are managed by Hillsborough County Public Utilities. Both follow the 90-day rule, but permit registration processes differ. Contact the appropriate authority based on your location.

### What happens if my hauler does not provide an approved manifest?
Using a hauler that does not provide City of Tampa approved manifests can put your facility out of compliance. You are responsible for ensuring your service provider uses the correct manifest forms. Keep copies of every manifest on file.`
  },
  {
    slug: "pinellas-county-grease-trap-requirements",
    title: "Pinellas County Grease Trap Requirements",
    category: "compliance",
    image_url: "/images/guide-compliance.webp",
    meta_title: "Pinellas County Grease Trap Requirements",
    meta_description: "Pinellas County grease trap requirements under the Commercial Grease Management ordinance, including monthly interceptor pumping and weekly trap cleaning logs.",
    published_at: new Date().toISOString(),
    excerpt: "Pinellas County enforces monthly interceptor pumping and weekly trap cleaning logs under its Commercial Grease Management ordinance (Section 126-611+).",
    content: `# Pinellas County Grease Trap Requirements

Pinellas County has one of Florida's most detailed grease management frameworks. Under the Commercial Grease Management ordinance (Section 126-611 and following sections of the county code), food service establishments must meet monthly pumping requirements for interceptors and maintain weekly cleaning logs for interior traps. These requirements exceed the state baseline under [Chapter 62-705 F.A.C.](/compliance/chapter-62-705-guide).

## Local Ordinance Details

Pinellas County Code Section 126-611 through 126-620 governs commercial grease management. The ordinance is enforced by the Pinellas County Utilities Department and applies to all FSEs discharging to the county sewer system. Within municipalities like St. Petersburg and Clearwater, local utilities departments may co-enforce these requirements. The program requires FSEs to submit a Grease Management Plan and use only permitted grease waste haulers.

## Pump-Out Frequency

Pinellas County requires:

- **Grease interceptors (exterior):** Pumped at least once per month (every 30 days)
- **Grease traps (interior):** Cleaned weekly with a documented cleaning log

This monthly interceptor requirement is significantly stricter than most Florida counties. The county may grant extensions to quarterly pumping if an FSE demonstrates consistently low grease levels through documented inspections, but this must be formally approved.

## Documentation Required

Pinellas County inspectors require:

- Approved Grease Management Plan on file
- Weekly interior trap cleaning logs signed by the responsible employee
- Monthly interceptor service manifests from permitted haulers
- Hauler permit verification (only Pinellas-permitted haulers accepted)
- Trap and interceptor sizing calculations or installation records

## Penalties

Non-compliance with Pinellas County grease management ordinances carries fines starting at $250 for first-time violations. Repeat violations can escalate to $500 per violation per day. The county may require mandatory increased pumping frequency at the facility's expense. Persistent non-compliance can result in sewer service termination and code enforcement liens on the property.

## How to Stay Compliant

1. **Submit your Grease Management Plan** to Pinellas County Utilities before opening or when required.
2. **Schedule monthly interceptor pumping** — the 30-day interval is firm and well-enforced.
3. **Maintain weekly cleaning logs** for interior traps with dates, employee signatures, and cleaning method notes.
4. **Use only Pinellas County permitted haulers** — verify your hauler's permit status before contracting.
5. **Retain all records for at least five years** — Pinellas requires longer retention than some other counties.

## Find a Service Provider

Browse verified grease trap service companies in [Pinellas County](/county/pinellas) to find permitted haulers near your business.

## Frequently Asked Questions

### Can I get an extension from monthly to quarterly pumping in Pinellas?
Yes, but only with formal county approval. You must demonstrate through documented inspections that your interceptor consistently maintains low grease levels. Contact Pinellas County Utilities to request an evaluation and extension.

### What is required in the weekly cleaning log?
Each weekly log entry must include the date, the name of the employee who performed the cleaning, the method used (manual scraping, skimming, etc.), the approximate amount of grease removed, and any observations about trap condition. These logs are reviewed during inspections.

### Does St. Petersburg have different requirements than unincorporated Pinellas?
St. Petersburg follows the same county ordinance framework but enforces through its own utilities department. The monthly pumping and weekly cleaning requirements are the same. Contact St. Petersburg Public Utilities for municipality-specific permitting.`
  },
  {
    slug: "orange-county-grease-trap-requirements",
    title: "Orange County Grease Trap Requirements",
    category: "compliance",
    image_url: "/images/guide-compliance.webp",
    meta_title: "Orange County Grease Trap Requirements",
    meta_description: "Orange County grease trap requirements under the FOG Control Program, including per-permit pump-out frequencies and Orlando Utilities Commission oversight.",
    published_at: new Date().toISOString(),
    excerpt: "Orange County's FOG Control Program sets pump-out frequency on a per-permit basis, with Orlando Utilities Commission providing additional oversight within city limits.",
    content: `# Orange County Grease Trap Requirements

Orange County manages grease trap compliance through its FOG Control Program, which sets pump-out requirements on a per-permit basis rather than a single county-wide interval. Within the City of Orlando, the Orlando Utilities Commission (OUC) provides additional oversight. All food service establishments must comply with both state requirements under [Chapter 62-705 F.A.C.](/compliance/chapter-62-705-guide) and local FOG program rules.

## Local Ordinance Details

The Orange County FOG Control Program is administered by Orange County Utilities and covers all FSEs connected to the county wastewater system. The program requires each establishment to obtain a FOG permit that specifies grease management requirements tailored to the facility. Within Orlando city limits, OUC works in coordination with county utilities to monitor and enforce FOG compliance. The enforcement agency reviews each facility's grease output, trap size, and establishment type to determine the appropriate pump-out schedule.

## Pump-Out Frequency

Orange County does not mandate a single county-wide pumping interval. Instead, pump-out frequency is set on each facility's individual FOG permit. Typical schedules include:

- **High-volume restaurants:** Every 30 to 60 days
- **Moderate-volume FSEs:** Every 60 to 90 days
- **Low-volume establishments:** Up to every 90 days

Your specific frequency is determined during the permitting process and may be adjusted based on inspection results. OUC may impose additional requirements for facilities within Orlando.

## Documentation Required

Orange County and OUC inspectors expect:

- Active FOG permit with the assigned pump-out schedule
- Grease waste service manifests for each cleaning event
- Maintenance log with dates, hauler information, and volume removed
- Trap sizing documentation and installation records
- Proof that the hauler holds a valid Florida DEP grease waste transporter registration

## Penalties

Orange County issues Notices of Violation for FOG non-compliance. Fines start at $250 per violation and can escalate to $500 per day for unresolved issues. OUC can impose sewer surcharges on facilities that cause grease-related blockages. Repeated violations may lead to permit revocation, mandatory increased pumping frequency, and in severe cases, sewer disconnection pending compliance.

## How to Stay Compliant

1. **Obtain your FOG permit** from Orange County Utilities and follow the assigned pump-out schedule exactly.
2. **Coordinate with OUC** if your facility is within Orlando city limits to ensure you meet all local requirements.
3. **Use only DEP-registered grease waste haulers** — verify registration before signing a service contract.
4. **Keep manifests and maintenance logs** organized and accessible for at least three years.
5. **Request a permit review** if your business volume changes significantly, as your assigned frequency may need updating.

## Find a Service Provider

Browse verified grease trap service companies in [Orange County](/county/orange) to find compliant service providers near your business.

## Frequently Asked Questions

### How do I find out my assigned pump-out frequency in Orange County?
Your pump-out frequency is listed on your FOG permit issued by Orange County Utilities. If you have not yet obtained a permit, contact the county utilities FOG program office. They will evaluate your facility and assign an appropriate schedule.

### Does OUC enforce separately from Orange County?
OUC coordinates with Orange County Utilities but has authority to conduct its own inspections and impose surcharges within Orlando city limits. Facilities in Orlando should ensure compliance with both OUC and county requirements.

### What if my restaurant changes from low-volume to high-volume?
Contact Orange County Utilities to request a permit modification. Increased business volume typically means higher grease output, which may require more frequent pumping. Failing to update your permit can result in violations if inspectors find inadequate service frequency.`
  },
  {
    slug: "duval-county-grease-trap-requirements",
    title: "Duval County Grease Trap Requirements",
    category: "compliance",
    image_url: "/images/guide-compliance.webp",
    meta_title: "Duval County Grease Trap Requirements",
    meta_description: "Duval County grease trap requirements including the JEA Preferred Hauler Program, Jacksonville FOG ordinance, and per-permit pump-out schedules.",
    published_at: new Date().toISOString(),
    excerpt: "Duval County manages grease trap compliance through the JEA Preferred Hauler Program and the Jacksonville FOG ordinance, with per-permit pump-out schedules.",
    content: `# Duval County Grease Trap Requirements

Duval County, which encompasses the City of Jacksonville, manages grease trap compliance through the JEA (Jacksonville's utility provider) and the Jacksonville FOG ordinance. FSEs must work with JEA-preferred haulers and comply with facility-specific pump-out schedules. These local requirements supplement state standards under [Chapter 62-705 F.A.C.](/compliance/chapter-62-705-guide).

## Local Ordinance Details

The Jacksonville FOG ordinance is enforced by JEA's Environmental Compliance Division. JEA administers the FOG Pretreatment Program, which requires all food service establishments to install and maintain approved grease control devices. The JEA Preferred Hauler Program establishes a list of vetted grease waste transporters that meet JEA's documentation and disposal standards. FSEs are strongly encouraged to use preferred haulers to ensure compliance documentation is properly filed.

## Pump-Out Frequency

Duval County sets pump-out frequency on a per-permit basis through JEA. Typical requirements include:

- **Full-service restaurants:** Every 30 to 90 days depending on volume and trap size
- **Fast food establishments:** Every 60 to 90 days
- **Cafeterias and institutional kitchens:** Every 90 days

JEA inspectors may adjust the assigned frequency after reviewing inspection data. Facilities that consistently exceed grease accumulation thresholds may be placed on accelerated pumping schedules.

## Documentation Required

JEA inspectors require the following during compliance checks:

- Active JEA FOG permit or registration
- Grease waste manifests from every pump-out event
- Hauler documentation (preferably from a JEA Preferred Hauler)
- Maintenance records with dates, volumes, and hauler contact information
- Grease control device specifications and installation records

## Penalties

JEA enforces FOG violations through a progressive enforcement system. Initial violations result in a Notice of Non-Compliance with a corrective action deadline. Unresolved violations can lead to fines of up to $1,000 per day. JEA can impose significant surcharges on sewer bills for facilities responsible for FOG-related sanitary sewer overflows (SSOs). In extreme cases, JEA may terminate wastewater service until compliance is restored.

## How to Stay Compliant

1. **Register with JEA's FOG Pretreatment Program** and obtain your facility-specific permit.
2. **Use JEA Preferred Haulers** whenever possible to ensure proper manifest documentation and disposal records.
3. **Follow your assigned pump-out schedule** — do not skip or delay service events.
4. **Maintain detailed records** of every cleaning, including manifests, for at least three years.
5. **Respond promptly to JEA notices** — corrective action deadlines are enforced strictly.

## Find a Service Provider

Browse verified grease trap service companies in [Duval County](/county/duval) to find JEA-preferred and compliant haulers near your business.

## Frequently Asked Questions

### What is the JEA Preferred Hauler Program?
The JEA Preferred Hauler Program is a list of grease waste transporters that have been vetted by JEA for proper licensing, disposal practices, and documentation standards. Using a preferred hauler simplifies compliance because JEA receives service records directly.

### Do I need a separate permit for Jacksonville Beach or Neptune Beach?
Jacksonville Beach and Neptune Beach have separate utility systems but fall within Duval County. Contact the respective municipal utility provider to determine local FOG permit requirements, as they may differ from JEA's program.

### Can JEA change my assigned pumping frequency?
Yes. JEA can increase or decrease your assigned pump-out frequency based on inspection findings, changes in your business volume, or history of compliance issues. If you believe your current schedule is too frequent or infrequent, you can request a review from JEA Environmental Compliance.`
  },
  {
    slug: "sarasota-county-grease-trap-requirements",
    title: "Sarasota County Grease Trap Requirements",
    category: "compliance",
    image_url: "/images/guide-compliance.webp",
    meta_title: "Sarasota County Grease Trap Requirements",
    meta_description: "Sarasota County grease trap requirements under the FOG Program (since 2020), including 30-day trap and 90-day interceptor pumping schedules and hauler reporting.",
    published_at: new Date().toISOString(),
    excerpt: "Sarasota County's FOG Program (established 2020) requires 30-day interior trap cleaning, 90-day interceptor pumping, a $200 annual hauler fee, and quarterly hauler reports.",
    content: `# Sarasota County Grease Trap Requirements

Sarasota County established its FOG Program in 2020, creating structured grease management requirements for all food service establishments. The program sets distinct schedules for interior traps (30 days) and exterior interceptors (90 days), and imposes reporting obligations on both FSEs and haulers. These requirements work alongside state standards under [Chapter 62-705 F.A.C.](/compliance/chapter-62-705-guide).

## Local Ordinance Details

The Sarasota County FOG Program is administered by Sarasota County Public Utilities. The program was formally launched in 2020 to reduce FOG-related sanitary sewer overflows across the county's wastewater collection system. All FSEs connected to the county sewer system must register with the FOG Program and maintain compliant grease control equipment. Grease waste haulers operating in Sarasota County must register with the county and pay a $200 annual hauler registration fee.

## Pump-Out Frequency

Sarasota County enforces a two-tier pumping schedule:

- **Interior grease traps:** Must be cleaned every 30 days
- **Exterior grease interceptors:** Must be pumped every 90 days

These intervals are firm requirements, not suggestions. Facilities that can demonstrate consistently low grease levels through documented inspections may apply for a frequency variance, but approval is not guaranteed. The 30-day interior trap requirement is among the strictest in Florida.

## Documentation Required

Sarasota County inspectors and program administrators require:

- FOG Program registration documentation
- Service manifests for every pump-out event (traps and interceptors)
- Interior trap cleaning logs with dates and employee signatures
- Quarterly hauler reports submitted by registered haulers to the county
- Grease control equipment specifications and sizing documentation

## Penalties

Sarasota County enforces FOG violations through progressive penalties. First-time violations result in written notices with compliance deadlines. Repeated violations can result in fines up to $500 per day. Facilities responsible for causing sanitary sewer overflows due to FOG may be liable for cleanup and remediation costs, which can run into thousands of dollars. The county can also mandate increased pumping frequency at the facility's expense.

## How to Stay Compliant

1. **Register with Sarasota County's FOG Program** and keep your registration current.
2. **Clean interior traps every 30 days** and pump interceptors every 90 days — mark these on your calendar.
3. **Use only Sarasota County registered haulers** — verify your hauler pays the $200 annual fee and is in good standing.
4. **Confirm your hauler submits quarterly reports** to the county, as both you and your hauler share compliance responsibility.
5. **Maintain cleaning logs and manifests** for at least three years and keep them accessible for inspections.

## Find a Service Provider

Browse verified grease trap service companies in [Sarasota County](/county/sarasota) to find registered haulers near your business.

## Frequently Asked Questions

### Why does Sarasota require 30-day trap cleaning when other counties allow 90 days?
Sarasota County adopted the 30-day interior trap cleaning requirement after experiencing significant FOG-related sewer overflows. Interior traps are smaller and fill faster, so the county determined that monthly cleaning is necessary to prevent blockages in the collection system.

### What is the $200 annual hauler fee in Sarasota County?
Grease waste haulers operating in Sarasota County must pay a $200 annual registration fee to the county. This fee covers program administration and allows the county to track hauler activity through mandatory quarterly reports. As an FSE, confirm your hauler is registered before contracting their services.

### Can I apply for a variance to extend my pumping interval?
Yes, Sarasota County allows FSEs to apply for a frequency variance if they can demonstrate through documented inspections that grease accumulation consistently stays well below capacity thresholds. Contact Sarasota County Public Utilities FOG Program to start the variance application process.`
  },
  {
    slug: "palm-beach-county-grease-trap-requirements",
    title: "Palm Beach County Grease Trap Requirements",
    category: "compliance",
    image_url: "/images/guide-compliance.webp",
    meta_title: "Palm Beach County Grease Trap Requirements",
    meta_description: "Palm Beach County grease trap requirements under SWA oversight, including per-permit pump-out frequencies and compliance documentation for food service facilities.",
    published_at: new Date().toISOString(),
    excerpt: "Palm Beach County manages grease trap compliance through Solid Waste Authority (SWA) oversight and per-permit pump-out requirements for food service establishments.",
    content: `# Palm Beach County Grease Trap Requirements

Palm Beach County manages grease waste compliance through coordination between the Solid Waste Authority (SWA) and the county's Water Utilities Department. Pump-out requirements are set on a per-permit basis, and all food service establishments must comply with both local requirements and state standards under [Chapter 62-705 F.A.C.](/compliance/chapter-62-705-guide).

## Local Ordinance Details

Palm Beach County's FOG management is governed by county utility ordinances and enforced by the Water Utilities Department. The SWA plays a role in grease waste disposal oversight, ensuring that collected grease waste is transported to approved receiving facilities. Each FSE connected to the county wastewater system must obtain a FOG compliance permit. Municipalities within Palm Beach County, including West Palm Beach, Boca Raton, and Delray Beach, may enforce additional local requirements through their own utility departments.

## Pump-Out Frequency

Palm Beach County sets pump-out frequency on each facility's individual permit. Common schedules include:

- **High-volume restaurants and buffets:** Every 30 to 60 days
- **Standard restaurants:** Every 60 to 90 days
- **Low-volume FSEs (cafes, delis):** Every 90 days

The county determines your schedule based on trap size, establishment type, menu composition, and historical grease output. Your permit will specify the exact interval. Inspectors verify adherence to the permitted schedule during compliance checks.

## Documentation Required

Palm Beach County inspectors and SWA representatives require:

- Active FOG compliance permit with assigned pump-out schedule
- Grease waste service manifests for each pump-out event
- Maintenance log showing dates, hauler company name, and volumes removed
- Proof that the hauler is registered with the Florida DEP for grease waste transport
- Trap or interceptor sizing and installation records

## Penalties

Palm Beach County enforces FOG violations through a Notice of Violation (NOV) process. Initial NOVs come with a compliance deadline, typically 15 to 30 days. Unresolved violations can result in fines up to $500 per violation per day. Facilities causing sewer overflows due to FOG negligence may be billed for emergency response and cleanup costs. The county can mandate increased pumping frequency or require equipment upgrades at the facility's expense.

## How to Stay Compliant

1. **Obtain your FOG compliance permit** from Palm Beach County Water Utilities and follow the assigned schedule.
2. **Verify your hauler's DEP registration** and ensure they transport waste to SWA-approved receiving facilities.
3. **Check with your municipality** — Boca Raton, Delray Beach, and other cities may have additional local FOG requirements.
4. **Keep manifests and maintenance records** organized for at least three years.
5. **Respond promptly to NOVs** — the compliance window is short, and fines accumulate daily.

## Find a Service Provider

Browse verified grease trap service companies in [Palm Beach County](/county/palm-beach) to find compliant haulers near your business.

## Frequently Asked Questions

### What role does the SWA play in grease trap compliance?
The Solid Waste Authority oversees waste disposal infrastructure in Palm Beach County. For grease waste, SWA ensures that haulers deliver collected grease to approved receiving and processing facilities. SWA does not directly inspect FSE grease traps, but works with county utilities on disposal compliance.

### Do Boca Raton and West Palm Beach have their own FOG rules?
Yes. Several municipalities within Palm Beach County, including Boca Raton, West Palm Beach, and Delray Beach, operate their own utility departments and may impose additional FOG requirements. Contact your local utility provider to confirm whether municipal rules supplement county requirements.

### How do I know what pump-out frequency I will be assigned?
Your frequency is determined during the permitting process based on your establishment type, trap size, menu, and estimated grease output. You can request a review if your business operations change significantly. Contact Palm Beach County Water Utilities FOG Program for permit inquiries.`
  },
  {
    slug: "broward-county-grease-trap-requirements",
    title: "Broward County Grease Trap Requirements",
    category: "compliance",
    image_url: "/images/guide-compliance.webp",
    meta_title: "Broward County Grease Trap Requirements",
    meta_description: "Broward County grease trap requirements including FOG Control rules, per-municipality enforcement by Fort Lauderdale, Hollywood, and Pembroke Pines.",
    published_at: new Date().toISOString(),
    excerpt: "Broward County's FOG Control program operates through per-municipality enforcement, with Fort Lauderdale, Hollywood, and Pembroke Pines each maintaining local grease management rules.",
    content: `# Broward County Grease Trap Requirements

Broward County manages FOG compliance through a decentralized model where individual municipalities enforce their own grease management programs. Fort Lauderdale, Hollywood, Pembroke Pines, and other cities each maintain local rules that may differ in specifics. All FSEs must also comply with state standards under [Chapter 62-705 F.A.C.](/compliance/chapter-62-705-guide).

## Local Ordinance Details

Broward County does not maintain a single county-wide FOG enforcement program. Instead, each municipality within the county administers its own FOG control ordinance through its local utility or public works department. The major municipalities with active FOG enforcement include:

- **Fort Lauderdale:** Public Works Department FOG Program
- **Hollywood:** Public Utilities FOG Compliance
- **Pembroke Pines:** Utilities Department FOG Management

Unincorporated areas of Broward County fall under county utility jurisdiction. FSEs must identify which municipality or utility district they connect to and comply with that authority's specific requirements.

## Pump-Out Frequency

Because enforcement is per-municipality, pump-out frequencies vary across Broward County:

- **Fort Lauderdale:** Typically every 90 days for interceptors, with more frequent cleaning for interior traps
- **Hollywood:** Per-permit basis, commonly 30 to 90 days depending on facility volume
- **Pembroke Pines:** Per-permit basis, generally every 90 days

Your specific municipality will assign a pump-out frequency during the permitting or registration process. Contact your local utility provider for the exact schedule applicable to your facility.

## Documentation Required

Regardless of municipality, Broward County FSEs should maintain:

- FOG permit or registration from the local utility authority
- Grease waste service manifests for every pump-out
- Maintenance logs with dates, hauler name, contact info, and volumes removed
- Proof of hauler DEP registration for grease waste transport
- Any municipality-specific forms or reports required by local ordinance

## Penalties

Penalties vary by municipality but follow a similar escalation pattern:

- **Fort Lauderdale:** Fines up to $500 per violation per day, with potential sewer surcharges
- **Hollywood:** NOVs with 30-day compliance windows, escalating to daily fines
- **Pembroke Pines:** Written warnings followed by fines and potential service disconnection

All municipalities can hold FSEs liable for cleanup costs resulting from FOG-caused sewer overflows. Repeated non-compliance can result in forced equipment upgrades or business operation restrictions.

## How to Stay Compliant

1. **Identify your municipal utility authority** — compliance requirements differ by city, so confirm which rules apply to your location.
2. **Register with your local FOG program** and obtain the required permits or registrations.
3. **Follow your assigned pump-out schedule** — do not assume a county-wide standard applies.
4. **Use DEP-registered haulers** and keep all manifests on file for at least three years.
5. **Contact your municipality directly** if you are unsure about requirements — assumptions can lead to violations.

## Find a Service Provider

Browse verified grease trap service companies in [Broward County](/county/broward) to find DEP-registered haulers near your business.

## Frequently Asked Questions

### Why does Broward County not have a single county-wide FOG program?
Broward County has 31 municipalities, many with their own utility systems. Each municipality manages its own wastewater collection, so FOG enforcement is handled locally rather than at the county level. This means requirements can differ from one city to the next.

### Which municipality's rules apply to my restaurant?
Your FOG compliance obligations are determined by which wastewater utility system your facility connects to. Check your utility bill to identify your provider, then contact their FOG compliance or pretreatment department for specific requirements.

### Are the penalties the same across all Broward municipalities?
No. Each municipality sets its own fine structure and enforcement procedures. While the general pattern (notice, fine, escalation) is similar, specific dollar amounts, compliance deadlines, and enforcement actions differ. Always refer to your local municipality's ordinance for exact penalty details.`
  },
  {
    slug: "lee-county-grease-trap-requirements",
    title: "Lee County Grease Trap Requirements",
    category: "compliance",
    image_url: "/images/guide-compliance.webp",
    meta_title: "Lee County Grease Trap Requirements",
    meta_description: "Lee County grease trap requirements under the FOG Ordinance, including Fort Myers enforcement, per-permit pumping schedules, and compliance documentation.",
    published_at: new Date().toISOString(),
    excerpt: "Lee County enforces grease trap compliance through its FOG Ordinance, with the City of Fort Myers providing additional local enforcement within city limits.",
    content: `# Lee County Grease Trap Requirements

Lee County enforces grease trap compliance through its FOG Ordinance, with the City of Fort Myers providing additional enforcement within city limits. All food service establishments must maintain grease control equipment and follow per-permit pump-out schedules. These local requirements supplement state standards under [Chapter 62-705 F.A.C.](/compliance/chapter-62-705-guide).

## Local Ordinance Details

The Lee County FOG Ordinance is administered by Lee County Utilities and covers all FSEs connected to the county wastewater collection system. The City of Fort Myers operates its own utility system and enforces FOG requirements through the Fort Myers Utilities Department. Cape Coral and other municipalities within Lee County may have additional local requirements. All FSEs must register with their applicable utility provider's FOG program and maintain approved grease control devices.

## Pump-Out Frequency

Lee County assigns pump-out frequency on a per-permit basis. Common schedules include:

- **Full-service restaurants:** Every 30 to 90 days depending on volume and equipment size
- **Fast casual and takeout:** Every 60 to 90 days
- **Low-volume establishments:** Up to every 90 days

The City of Fort Myers follows a similar per-permit approach. Your assigned frequency is determined during the FOG permit process based on establishment type, trap size, and estimated grease output. Inspectors can adjust your schedule based on compliance history.

## Documentation Required

Lee County and Fort Myers inspectors require:

- Active FOG program registration or permit
- Grease waste service manifests for every pump-out
- Maintenance log showing dates, hauler company, and gallons removed
- Proof of hauler DEP registration for grease waste transport
- Equipment specifications including trap or interceptor size and installation date

## Penalties

Lee County uses an escalating enforcement approach. Initial violations result in a Notice of Violation with a corrective action deadline of 15 to 30 days. Continued non-compliance leads to fines up to $500 per day. The City of Fort Myers can impose sewer surcharges on facilities that cause FOG-related blockages. Both the county and city can require mandatory equipment upgrades or increased pumping frequency. Persistent non-compliance may result in sewer disconnection.

## How to Stay Compliant

1. **Register with your utility provider's FOG program** — Lee County Utilities for county areas, Fort Myers Utilities for city facilities.
2. **Follow your assigned pump-out schedule exactly** — do not extend intervals without written approval.
3. **Use DEP-registered grease waste haulers** and verify their registration status annually.
4. **Keep all manifests and maintenance logs** organized and accessible for a minimum of three years.
5. **Install properly sized equipment** — work with your utility provider to confirm your grease control device meets capacity requirements.

## Find a Service Provider

Browse verified grease trap service companies in [Lee County](/county/lee) to find compliant service providers near your business.

## Frequently Asked Questions

### Does Fort Myers enforce differently than Lee County?
Yes. The City of Fort Myers operates its own utility system and has its own FOG enforcement procedures. While the general requirements are similar (per-permit frequency, manifest documentation), permitting and inspection processes differ. Confirm which utility provider serves your facility.

### How is my pumping frequency determined in Lee County?
Lee County Utilities evaluates your facility during the FOG permit process. They consider your establishment type, seating capacity, menu (fried foods generate more grease), trap size, and any prior compliance history. Your permit will specify the required pumping interval.

### What should I do if I receive a Notice of Violation?
Respond immediately by contacting the issuing utility department. NOVs typically include a 15 to 30 day compliance window. Schedule a pump-out if overdue, gather your documentation, and correct the cited issue before the deadline. Ignoring an NOV leads to escalating daily fines.`
  },
  {
    slug: "volusia-county-grease-trap-requirements",
    title: "Volusia County Grease Trap Requirements",
    category: "compliance",
    image_url: "/images/guide-compliance.webp",
    meta_title: "Volusia County Grease Trap Requirements",
    meta_description: "Volusia County grease trap requirements under the FOG Program, including Daytona Beach local enforcement, per-permit schedules, and compliance documentation.",
    published_at: new Date().toISOString(),
    excerpt: "Volusia County manages grease trap compliance through its FOG Program, with the City of Daytona Beach providing local enforcement within city limits.",
    content: `# Volusia County Grease Trap Requirements

Volusia County enforces grease trap compliance through its FOG Program, with the City of Daytona Beach maintaining its own local enforcement within city limits. All food service establishments must register with the appropriate FOG program and follow assigned pump-out schedules. These local requirements work alongside state standards under [Chapter 62-705 F.A.C.](/compliance/chapter-62-705-guide).

## Local Ordinance Details

The Volusia County FOG Program is administered by Volusia County Water Resources and Utilities. The program covers FSEs connected to the county wastewater system and requires registration, approved grease control equipment, and ongoing maintenance documentation. The City of Daytona Beach operates its own utilities department and enforces FOG compliance independently within city limits. Other municipalities such as DeLand, New Smyrna Beach, and Ormond Beach may have additional local requirements through their respective utility departments.

## Pump-Out Frequency

Volusia County assigns pump-out frequency on a per-permit basis. Typical schedules include:

- **Full-service restaurants and bars:** Every 30 to 90 days
- **Fast food and quick service:** Every 60 to 90 days
- **Institutional kitchens:** Every 90 days
- **Low-volume FSEs:** Up to every 90 days with documented low grease output

Daytona Beach follows a similar per-permit model. Your assigned frequency is based on establishment type, trap capacity, and historical grease accumulation data. The county may adjust your schedule after inspections.

## Documentation Required

Volusia County and Daytona Beach inspectors require:

- Active FOG program registration with the applicable utility provider
- Grease waste service manifests for every pump-out event
- Maintenance records with cleaning dates, hauler information, and volumes removed
- DEP registration verification for the grease waste hauler
- Equipment records showing trap or interceptor size, type, and installation date

## Penalties

Volusia County enforces FOG violations through a progressive system. First violations result in a written Notice of Violation with a compliance deadline. Subsequent violations carry fines starting at $250 per day, escalating for repeat offenses. Daytona Beach follows a similar approach through its own code enforcement process. Facilities responsible for causing sanitary sewer overflows due to FOG may face additional fines and liability for emergency cleanup costs.

## How to Stay Compliant

1. **Register with Volusia County Water Resources and Utilities** or your municipal utility provider's FOG program.
2. **Follow your assigned pump-out schedule** — your permit specifies the required interval.
3. **Use only DEP-registered grease waste haulers** and confirm their registration status before contracting.
4. **Maintain organized records** of all manifests, maintenance logs, and equipment documentation for at least three years.
5. **Contact your utility provider proactively** if you change your menu, increase seating, or modify your kitchen — these changes may affect your required pumping frequency.

## Find a Service Provider

Browse verified grease trap service companies in [Volusia County](/county/volusia) to find DEP-registered haulers near your business.

## Frequently Asked Questions

### Does Daytona Beach have different grease trap rules than Volusia County?
Daytona Beach operates its own utility system and enforces FOG compliance independently. While the general framework is similar to the county program (per-permit frequency, manifest requirements), the specific permitting process and enforcement procedures are handled by Daytona Beach Utilities. Contact them directly if your facility is within city limits.

### How many grease trap service companies operate in Volusia County?
Volusia County has a significant number of grease trap service providers due to its large hospitality industry along the coast. Browse the [Volusia County directory](/county/volusia) for current listings of DEP-registered haulers serving the area.

### What triggers an inspection in Volusia County?
Inspections occur on a routine schedule (typically annually for compliant facilities), in response to complaints from neighbors or the public, or after a reported sanitary sewer overflow in your area. Facilities with a history of violations are inspected more frequently. All inspections may be unannounced.`
  }
];

async function main() {
  console.log("Inserting 10 county compliance pages into content_pages...\n");

  // Delete existing pages with these slugs first (upsert)
  const slugs = pages.map(p => p.slug);
  const { error: deleteError } = await supabase
    .from("content_pages")
    .delete()
    .in("slug", slugs);

  if (deleteError) {
    console.log("Delete step (may be no-op):", deleteError.message);
  }

  // Insert all pages
  const { data, error } = await supabase
    .from("content_pages")
    .insert(pages)
    .select("slug, title, category, meta_title");

  if (error) {
    console.error("INSERT ERROR:", error.message);
    process.exit(1);
  }

  console.log(`Successfully inserted ${data.length} compliance pages:\n`);
  data.forEach((row, i) => {
    console.log(`  ${i + 1}. ${row.slug}`);
    console.log(`     Title: ${row.title}`);
    console.log(`     Meta:  ${row.meta_title} (${row.meta_title.length} chars)`);
    console.log();
  });

  // Verify all 10 exist
  console.log("Verifying all 10 exist in content_pages...\n");
  const { data: verify, error: verifyError } = await supabase
    .from("content_pages")
    .select("slug, category, published_at")
    .in("slug", slugs);

  if (verifyError) {
    console.error("VERIFY ERROR:", verifyError.message);
    process.exit(1);
  }

  console.log(`Verified: ${verify.length}/10 compliance pages found in content_pages.`);
  if (verify.length !== 10) {
    console.error("MISMATCH: Expected 10, found", verify.length);
    process.exit(1);
  }

  // Check meta_title lengths
  console.log("\nMeta title length check:");
  pages.forEach(p => {
    const len = p.meta_title.length;
    const status = len <= 60 ? "OK" : "OVER 60!";
    console.log(`  ${status} (${len}) ${p.meta_title}`);
  });

  console.log("\nDone! All 10 county compliance pages inserted and verified.");
}

main().catch(console.error);

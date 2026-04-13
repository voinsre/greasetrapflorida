/**
 * Unique county-level content for intro paragraphs, meta descriptions,
 * and county-specific FAQ questions.
 * Each entry covers: local enforcement agency, ordinance references,
 * cleaning frequency, permit requirements, and local restaurant-industry context.
 */

export interface CountyFAQ {
  q: string;
  a: string;
}

export interface CountyData {
  intro: string;
  metaDescription: string;
  faqs: CountyFAQ[];
}

const COUNTY_DATA: Record<string, CountyData> = {
  'miami-dade': {
    intro:
      'Miami-Dade County\'s massive tourism-driven restaurant industry — one of the largest in the Southeast — operates under strict FOG oversight from the Department of Environmental Resources Management (DERM). Under Chapter 24 of the Miami-Dade County Code and DERM Administrative Orders, every food service establishment must obtain a Grease Disposal Ordinance (GDO) permit before operating a grease trap or interceptor. DERM enforces the 25% capacity rule: once grease accumulation reaches one-quarter of the trap\'s depth, a pump-out is required. With thousands of restaurants, hotel kitchens, and catering operations spanning Miami Beach to Homestead, high turnover in the hospitality sector means new operators must quickly understand GDO permitting. Browse our directory to find DERM-compliant haulers serving Miami-Dade County.',
    metaDescription:
      'Find grease trap cleaning companies in Miami-Dade County. Compare DERM GDO-permitted providers with ratings, services, and free quotes.',
    faqs: [
      {
        q: 'Who enforces grease trap compliance in Miami-Dade County?',
        a: 'DERM (Department of Environmental Resources Management) enforces FOG compliance in Miami-Dade County through the Grease Disposal Ordinance (GDO) under Chapter 24 of the Miami-Dade County Code. DERM issues GDO permits, conducts inspections, and monitors compliance for all food service establishments.',
      },
      {
        q: 'Do Miami-Dade restaurants need a GDO permit?',
        a: 'Yes. All food service establishments in Miami-Dade County must obtain a Grease Disposal Ordinance (GDO) permit from DERM before operating a grease trap or interceptor. The permit covers installation requirements, maintenance schedules, and waste hauler documentation.',
      },
      {
        q: 'How often must grease traps be cleaned in Miami-Dade County?',
        a: 'Miami-Dade uses a 25% capacity rule — pump-out is required when the grease layer reaches 25% of the trap\'s total depth. For most restaurants, this means cleaning every 30 to 90 days depending on kitchen volume and trap size.',
      },
    ],
  },

  'broward': {
    intro:
      'Broward County\'s Environmental Licensing and Building Permitting Division oversees FOG compliance for food service establishments from Fort Lauderdale to Pembroke Pines. Section 34.09 of the Broward County Code mandates that all restaurants, hotels, and commercial kitchens install and maintain properly sized grease traps or interceptors. Establishments must register with the county\'s FOG Control Program and use only licensed haulers for grease waste removal. Cleaning frequency is set per permit based on trap size and kitchen output, though most high-volume restaurants require service every 30 to 60 days. Broward\'s dense mix of beachfront dining, suburban chain restaurants, and multicultural eateries creates steady demand for reliable pump-out services. Use our directory to compare licensed providers across Broward County.',
    metaDescription:
      'Find grease trap cleaning companies in Broward County. Compare FOG Control-registered providers compliant with Section 34.09. Ratings and free quotes.',
    faqs: [
      {
        q: 'Who enforces grease trap compliance in Broward County?',
        a: 'Broward County\'s Environmental Licensing and Building Permitting Division enforces FOG compliance under Section 34.09 of the Broward County Code. The division manages the FOG Control Program, issues permits, and conducts inspections of food service establishments.',
      },
      {
        q: 'What FOG permits do Broward County restaurants need?',
        a: 'Restaurants in Broward County must register with the county\'s FOG Control Program under Section 34.09 of the Broward County Code. Registration requires installing properly sized grease traps or interceptors and using only licensed haulers for waste removal.',
      },
      {
        q: 'How often must grease traps be cleaned in Broward County?',
        a: 'Cleaning frequency in Broward County is set per permit based on trap size and kitchen output. Most high-volume restaurants require pump-outs every 30 to 60 days, while smaller establishments may qualify for 90-day intervals.',
      },
    ],
  },

  'palm-beach': {
    intro:
      'Palm Beach County food service businesses must comply with the Solid Waste Authority (SWA) Grease Program and local health department inspections. The Palm Beach County Health Department conducts routine FOG inspections, while the SWA oversees proper grease waste disposal and recycling. Establishments need a FOG permit and must maintain cleaning logs demonstrating regular pump-outs — typically every 30 to 90 days depending on trap capacity and grease volume. From upscale waterfront dining in Palm Beach to high-volume restaurants in West Palm Beach and Boca Raton, the county\'s diverse food scene demands dependable service providers. All haulers must carry proper DEP licensing and provide manifest documentation for every pump-out. Find SWA-compliant grease trap companies in our directory below.',
    metaDescription:
      'Find grease trap cleaning companies in Palm Beach County. SWA Grease Program-compliant providers with DEP licensing, ratings, and free quotes.',
    faqs: [
      {
        q: 'Who enforces grease trap compliance in Palm Beach County?',
        a: 'The Palm Beach County Health Department and the Solid Waste Authority (SWA) jointly oversee FOG compliance. The Health Department conducts routine inspections while the SWA manages the Grease Program for proper waste disposal and recycling.',
      },
      {
        q: 'What permits do Palm Beach County restaurants need for grease traps?',
        a: 'Food service establishments in Palm Beach County must obtain a FOG permit and comply with the SWA Grease Program. Establishments must maintain cleaning logs and use DEP-licensed haulers who provide manifest documentation for every pump-out.',
      },
      {
        q: 'How often must grease traps be cleaned in Palm Beach County?',
        a: 'Palm Beach County requires pump-outs typically every 30 to 90 days based on trap capacity and grease volume. Permit conditions specify the exact frequency for each establishment. High-volume restaurants generally need monthly service.',
      },
    ],
  },

  'hillsborough': {
    intro:
      'Hillsborough County Public Utilities Department runs one of Florida\'s most structured Grease Management Programs, requiring all food service establishments in Tampa and surrounding areas to obtain a FOG permit before operating. Under the Hillsborough County Utilities Pretreatment Ordinance, traps and interceptors must be cleaned at least every 90 days, with higher-volume kitchens often requiring monthly service. The county conducts periodic inspections and can issue fines for non-compliance. Tampa\'s booming food scene — from the historic Ybor City restaurant district to the expanding SoHo and Seminole Heights dining corridors — means competition among service providers keeps quality high and pricing fair. All waste haulers must be DEP-licensed and provide grease manifests. Browse verified Hillsborough County providers below.',
    metaDescription:
      'Find grease trap cleaning companies in Hillsborough County. Grease Management Program-permitted providers with 90-day compliance service and free quotes.',
    faqs: [
      {
        q: 'Who enforces grease trap compliance in Hillsborough County?',
        a: 'Hillsborough County Public Utilities Department enforces FOG compliance through its Grease Management Program under the Hillsborough County Utilities Pretreatment Ordinance. The department issues FOG permits, conducts periodic inspections, and can issue fines for non-compliant food service establishments in Tampa and surrounding areas.',
      },
      {
        q: 'Do Hillsborough County restaurants need a FOG permit?',
        a: 'Yes. All food service establishments in Hillsborough County must obtain a FOG permit from the Public Utilities Department before operating. The Grease Management Program requires permit holders to use DEP-licensed haulers and maintain cleaning documentation.',
      },
      {
        q: 'How often must grease traps be cleaned in Hillsborough County?',
        a: 'Hillsborough County\'s grease ordinance requires traps and interceptors to be cleaned at least every 90 days. Higher-volume kitchens, particularly in Tampa\'s busy restaurant districts, often require monthly pump-outs based on permit conditions.',
      },
    ],
  },

  'orange': {
    intro:
      'Orange County Utilities administers the FOG Control Program under Orange County Code Chapter 35, Article III (Pretreatment Program), governing grease trap compliance for the greater Orlando area. With Walt Disney World, Universal Studios, and the Orange County Convention Center driving enormous seasonal dining volume, food service establishments face uniquely high grease output demands. Restaurants must obtain a FOG permit through Orange County Utilities, and cleaning frequency is set per permit based on establishment size and output. Theme-park-adjacent dining districts, International Drive restaurants, and downtown Orlando\'s growing culinary scene all require consistent pump-out schedules that account for tourist-season surges. DEP-licensed haulers must provide manifest documentation for every service call. Compare FOG-permitted grease trap companies serving Orange County in our directory.',
    metaDescription:
      'Find grease trap cleaning companies in Orange County. FOG Control Program-permitted providers serving Orlando\'s restaurant industry. Free quotes.',
    faqs: [
      {
        q: 'Who enforces grease trap compliance in Orange County?',
        a: 'Orange County Utilities administers the FOG Control Program under Orange County Code Chapter 35, Article III (Pretreatment Program). The department issues FOG permits, sets cleaning frequencies, and monitors compliance for all food service establishments including theme-park-adjacent dining operations.',
      },
      {
        q: 'Do Orange County restaurants need a FOG permit?',
        a: 'Yes. Restaurants in Orange County must obtain a FOG permit through Orange County Utilities. The permit establishes trap sizing requirements, cleaning frequency, and documentation standards. This applies to all food service establishments from International Drive to downtown Orlando.',
      },
      {
        q: 'How often must grease traps be cleaned in Orange County?',
        a: 'Cleaning frequency in Orange County is set per permit based on establishment size and grease output. Most restaurants need service every 30 to 90 days, with theme-park-adjacent and high-volume tourist-area restaurants typically requiring more frequent pump-outs during peak seasons.',
      },
    ],
  },

  'pinellas': {
    intro:
      'Pinellas County Utilities operates a Commercial Grease Management Program that sets some of the strictest FOG requirements in the Tampa Bay region. Grease interceptors must be pumped monthly, while smaller indoor traps follow a schedule determined during permitting. The county requires all food service establishments — from Clearwater Beach seafood restaurants to St. Petersburg\'s thriving downtown dining scene — to hold an active grease permit and maintain detailed cleaning logs. Pinellas County inspectors conduct regular compliance checks and can mandate increased pump-out frequency for repeat violators. As a densely populated coastal county with heavy tourism traffic, the restaurant industry here generates substantial FOG waste year-round. Find Pinellas County Utilities-compliant service providers in our verified directory.',
    metaDescription:
      'Find grease trap cleaning companies in Pinellas County. Commercial Grease Management Program-compliant providers with monthly interceptor service. Free quotes.',
    faqs: [
      {
        q: 'Who enforces grease trap compliance in Pinellas County?',
        a: 'Pinellas County Utilities operates the Commercial Grease Management Program, one of the strictest FOG programs in the Tampa Bay region. The department issues grease permits, conducts regular compliance inspections, and can mandate increased pump-out frequency for violators.',
      },
      {
        q: 'Do Pinellas County restaurants need a grease permit?',
        a: 'Yes. All food service establishments in Pinellas County must hold an active grease permit from Pinellas County Utilities. Permit holders must maintain detailed cleaning logs and use only DEP-licensed haulers for waste removal.',
      },
      {
        q: 'How often must grease traps be cleaned in Pinellas County?',
        a: 'Pinellas County requires grease interceptors to be pumped monthly. Smaller indoor traps follow a cleaning schedule determined during the permitting process. These are among the strictest frequency requirements in the Tampa Bay area.',
      },
    ],
  },

  'duval': {
    intro:
      'Duval County\'s FOG compliance is overseen by JEA (Jacksonville\'s municipal utility), which operates a Preferred Hauler Program for grease waste removal. Food service establishments throughout Jacksonville must register with JEA\'s FOG program and use only approved haulers listed in the Preferred Hauler directory. Cleaning frequency is determined per permit, with most restaurants needing service every 30 to 90 days. Jacksonville\'s rapidly growing food scene — anchored by the downtown restaurant district, San Marco, Riverside, and military base dining facilities at Naval Station Mayport and NAS Jacksonville — creates diverse service demands. JEA conducts inspections and tracks manifest compliance. Browse our directory to find JEA Preferred Hauler-approved providers in Duval County.',
    metaDescription:
      'Find grease trap service providers in Duval County. JEA Preferred Hauler Program-approved companies with ratings, services, and free quotes.',
    faqs: [
      {
        q: 'Who enforces grease trap compliance in Duval County?',
        a: 'JEA (Jacksonville\'s municipal utility) oversees FOG compliance in Duval County through its Preferred Hauler Program. JEA issues permits, maintains a list of approved waste haulers, conducts inspections, and tracks manifest compliance for all food service establishments.',
      },
      {
        q: 'Do Duval County restaurants need to use JEA-approved haulers?',
        a: 'Yes. Food service establishments in Duval County must register with JEA\'s FOG program and use only haulers listed in JEA\'s Preferred Hauler directory. Using non-approved haulers can result in compliance violations and fines.',
      },
      {
        q: 'How often must grease traps be cleaned in Duval County?',
        a: 'Cleaning frequency in Duval County is determined per permit, with most restaurants needing pump-outs every 30 to 90 days. JEA sets the schedule based on trap size, establishment type, and kitchen volume during the permitting process.',
      },
    ],
  },

  'lee': {
    intro:
      'Lee County Utilities enforces FOG compliance through a local grease ordinance that requires all food service establishments in Fort Myers, Cape Coral, and surrounding communities to maintain properly functioning grease traps and interceptors. Restaurants must obtain a FOG permit and schedule regular pump-outs — typically every 30 to 90 days based on trap size and kitchen volume. Lee County\'s seasonal population swings, driven by snowbird residents and winter tourism along Fort Myers Beach and Sanibel Island, create fluctuating demands on restaurant kitchens and their grease management systems. All haulers must hold valid DEP licenses and provide waste manifests. With a growing year-round dining scene beyond the tourist corridor, reliable service is essential. Compare Lee County providers below.',
    metaDescription:
      'Find grease trap cleaning companies in Lee County. FOG-permitted providers serving Fort Myers and Cape Coral with ratings and free quotes.',
    faqs: [
      {
        q: 'Who enforces grease trap compliance in Lee County?',
        a: 'Lee County Utilities enforces FOG compliance through the county\'s local grease ordinance. The department issues FOG permits, sets cleaning schedules, and ensures all food service establishments in Fort Myers, Cape Coral, and surrounding communities maintain compliant grease traps.',
      },
      {
        q: 'Do Lee County restaurants need a FOG permit?',
        a: 'Yes. All food service establishments in Lee County must obtain a FOG permit from Lee County Utilities. The permit covers grease trap sizing, installation standards, cleaning frequency, and hauler documentation requirements.',
      },
      {
        q: 'How often must grease traps be cleaned in Lee County?',
        a: 'Lee County requires pump-outs typically every 30 to 90 days based on trap size and kitchen volume. Seasonal population swings from winter tourism can increase grease output, and some establishments may need more frequent service during peak months.',
      },
    ],
  },

  'volusia': {
    intro:
      'Volusia County\'s Environmental Management Division administers the FOG Program for food service establishments from Daytona Beach to DeLand and New Smyrna Beach. Under the county\'s FOG ordinance, restaurants and commercial kitchens must register, install appropriately sized grease control equipment, and maintain documented cleaning schedules. Pump-out frequency is set per permit, but most establishments require service every 60 to 90 days. Volusia County\'s unique mix of Daytona Beach tourism traffic — particularly during Speedweeks, Bike Week, and spring break — along with a growing permanent population drives consistent demand for grease trap services. DEP-licensed haulers must provide manifests for every pump-out. Find compliant Volusia County grease trap companies in our verified directory.',
    metaDescription:
      'Find grease trap cleaning companies in Volusia County. FOG Program-registered providers serving Daytona Beach with ratings and free quotes.',
    faqs: [
      {
        q: 'Who enforces grease trap compliance in Volusia County?',
        a: 'Volusia County\'s Environmental Management Division administers the FOG Program for food service establishments from Daytona Beach to DeLand and New Smyrna Beach. The division handles registration, permitting, and compliance monitoring.',
      },
      {
        q: 'Do Volusia County restaurants need to register with the FOG Program?',
        a: 'Yes. Restaurants and commercial kitchens in Volusia County must register with the Environmental Management Division\'s FOG Program, install appropriately sized grease control equipment, and maintain documented cleaning schedules.',
      },
      {
        q: 'How often must grease traps be cleaned in Volusia County?',
        a: 'Pump-out frequency in Volusia County is set per permit, with most establishments requiring service every 60 to 90 days. During high-traffic events like Speedweeks and Bike Week, Daytona Beach restaurants may need more frequent cleaning.',
      },
    ],
  },

  'sarasota': {
    intro:
      'Sarasota County Utilities launched a formal FOG Program in 2020, establishing clear compliance standards for the county\'s food service industry. Under this program, indoor grease traps must be cleaned every 30 days, while outdoor grease interceptors require pump-outs at least every 90 days. Restaurants, hotels, and commercial kitchens must register with the county and maintain cleaning logs available for inspection. Sarasota\'s acclaimed dining scene — from the upscale restaurants on St. Armands Circle to the waterfront seafood spots along Siesta Key and Venice — demands reliable, frequent service from qualified haulers. All providers must carry DEP licenses and supply grease waste manifests. Compare Sarasota County FOG Program-compliant providers in our directory below.',
    metaDescription:
      'Find grease trap cleaning companies in Sarasota County. FOG Program-compliant providers with 30-day trap and 90-day interceptor service. Free quotes.',
    faqs: [
      {
        q: 'Who enforces grease trap compliance in Sarasota County?',
        a: 'Sarasota County Utilities enforces FOG compliance through its FOG Program, formally launched in 2020. The program established clear compliance standards including mandatory registration, cleaning schedules, and inspection protocols for all food service establishments.',
      },
      {
        q: 'Do Sarasota County restaurants need to register with the FOG Program?',
        a: 'Yes. All restaurants, hotels, and commercial kitchens in Sarasota County must register with the county\'s FOG Program. Registration requires maintaining cleaning logs available for inspection and using DEP-licensed haulers with manifest documentation.',
      },
      {
        q: 'How often must grease traps be cleaned in Sarasota County?',
        a: 'Sarasota County requires indoor grease traps to be cleaned every 30 days and outdoor grease interceptors to be pumped at least every 90 days. These are specific, fixed-interval requirements — not variable per permit like some other Florida counties.',
      },
    ],
  },

  'brevard': {
    intro:
      'Brevard County Utilities manages FOG compliance for food service establishments along Florida\'s Space Coast, from Titusville to Palm Bay. The county\'s FOG Management Program requires restaurants and commercial kitchens to install approved grease control equipment, obtain a FOG permit, and schedule regular pump-outs based on trap capacity and output. Most establishments need cleaning every 60 to 90 days. Brevard\'s unique economic mix — Kennedy Space Center visitors, Cocoa Beach tourism, a growing cruise port in Port Canaveral, and expanding suburban dining in Melbourne and Viera — drives year-round demand for reliable grease trap services. All haulers must be DEP-licensed and provide manifest documentation. Find Brevard County FOG-permitted providers in our directory.',
    metaDescription:
      'Find grease trap cleaning companies in Brevard County. FOG-permitted providers serving the Space Coast with DEP licensing, ratings, and free quotes.',
    faqs: [
      {
        q: 'Who enforces grease trap compliance in Brevard County?',
        a: 'Brevard County Utilities manages FOG compliance through the FOG Management Program for food service establishments along Florida\'s Space Coast, from Titusville to Palm Bay. The department issues FOG permits and conducts compliance monitoring.',
      },
      {
        q: 'Do Brevard County restaurants need a FOG permit?',
        a: 'Yes. Restaurants and commercial kitchens in Brevard County must obtain a FOG permit from Brevard County Utilities, install approved grease control equipment, and schedule regular pump-outs with DEP-licensed haulers.',
      },
      {
        q: 'How often must grease traps be cleaned in Brevard County?',
        a: 'Most Brevard County establishments need grease trap cleaning every 60 to 90 days based on trap capacity and kitchen output. Permit conditions specify the exact frequency. Restaurants near Port Canaveral and Cocoa Beach may need more frequent service during cruise and tourist seasons.',
      },
    ],
  },

  'seminole': {
    intro:
      'Seminole County Environmental Services oversees FOG compliance for food service businesses in Sanford, Altamonte Springs, Lake Mary, and surrounding communities north of Orlando. The county requires restaurants and commercial kitchens to hold a FOG permit and maintain grease traps or interceptors with documented cleaning schedules. Pump-out frequency is typically every 60 to 90 days, though high-volume establishments may need monthly service. Seminole County\'s proximity to Orlando\'s tourism corridor generates significant spillover dining traffic, while the county\'s own suburban growth has expanded the local restaurant scene substantially. All grease waste haulers must carry DEP licensing and supply manifests for each service visit. Compare verified Seminole County grease trap companies below.',
    metaDescription:
      'Find grease trap cleaning companies in Seminole County. FOG-permitted providers serving Sanford and Altamonte Springs with ratings and free quotes.',
    faqs: [
      {
        q: 'Who enforces grease trap compliance in Seminole County?',
        a: 'Seminole County Environmental Services oversees FOG compliance for food service businesses in Sanford, Altamonte Springs, Lake Mary, and surrounding communities. The department manages permitting, sets cleaning schedules, and conducts compliance checks.',
      },
      {
        q: 'Do Seminole County restaurants need a FOG permit?',
        a: 'Yes. Food service establishments in Seminole County must hold a FOG permit from the Environmental Services department. Permit holders must maintain grease traps or interceptors with documented cleaning schedules and use DEP-licensed haulers.',
      },
      {
        q: 'How often must grease traps be cleaned in Seminole County?',
        a: 'Pump-out frequency in Seminole County is typically every 60 to 90 days, though high-volume establishments may need monthly service. Cleaning schedules are determined during the permitting process based on trap size and kitchen output.',
      },
    ],
  },

  'polk': {
    intro:
      'Polk County Utilities Department administers FOG compliance for food service establishments across Lakeland, Winter Haven, Bartow, and surrounding communities in Central Florida\'s heartland. Restaurants must register with the county\'s FOG program and maintain grease traps or interceptors cleaned on a schedule determined during permitting — typically every 60 to 90 days. Polk County\'s strategic location between Tampa and Orlando means its restaurant industry serves both local residents and significant pass-through traffic along the I-4 corridor. The county\'s growing population and expanding chain and independent dining options create steady demand for grease trap services. DEP-licensed haulers must provide waste manifests for every pump-out. Browse our directory for Polk County providers.',
    metaDescription:
      'Find grease trap cleaning companies in Polk County. FOG-registered providers serving Lakeland and Winter Haven with ratings and free quotes.',
    faqs: [
      {
        q: 'Who enforces grease trap compliance in Polk County?',
        a: 'Polk County Utilities Department administers FOG compliance for food service establishments across Lakeland, Winter Haven, Bartow, and surrounding communities. The department manages the county\'s FOG program, issues permits, and monitors cleaning documentation.',
      },
      {
        q: 'Do Polk County restaurants need to register with the FOG program?',
        a: 'Yes. Restaurants in Polk County must register with the Polk County Utilities Department\'s FOG program. Registration requires maintaining grease traps or interceptors cleaned on schedule and using DEP-licensed haulers who provide waste manifests.',
      },
      {
        q: 'How often must grease traps be cleaned in Polk County?',
        a: 'Cleaning frequency in Polk County is determined during permitting, typically every 60 to 90 days. Establishments along the I-4 corridor between Tampa and Orlando that serve high pass-through traffic volumes may require more frequent service.',
      },
    ],
  },

  'pasco': {
    intro:
      'Pasco County Utilities operates a FOG Control Program requiring all food service establishments in New Port Richey, Wesley Chapel, Dade City, and surrounding areas to maintain compliant grease traps and interceptors. Restaurants must obtain a FOG permit and adhere to cleaning frequencies set during the permitting process, with most needing pump-outs every 60 to 90 days. As one of Florida\'s fastest-growing counties, Pasco\'s rapid residential development — particularly in the Wesley Chapel and Zephyrhills corridors — has driven a surge in new restaurant openings that need reliable grease management from day one. All haulers must be DEP-licensed with proper manifest documentation. Find Pasco County FOG-compliant grease trap companies in our directory.',
    metaDescription:
      'Find grease trap cleaning companies in Pasco County. FOG Control Program-registered providers serving Wesley Chapel and New Port Richey. Free quotes.',
    faqs: [
      {
        q: 'Who enforces grease trap compliance in Pasco County?',
        a: 'Pasco County Utilities operates the FOG Control Program governing grease trap compliance for food service establishments in New Port Richey, Wesley Chapel, Dade City, and surrounding areas. The department issues FOG permits and monitors compliance.',
      },
      {
        q: 'Do Pasco County restaurants need a FOG permit?',
        a: 'Yes. All food service establishments in Pasco County must obtain a FOG permit from Pasco County Utilities. New restaurant openings — especially in fast-growing areas like Wesley Chapel — must secure permits before beginning food service operations.',
      },
      {
        q: 'How often must grease traps be cleaned in Pasco County?',
        a: 'Pasco County sets cleaning frequencies during the permitting process, with most restaurants needing pump-outs every 60 to 90 days. Newer establishments in rapidly developing areas should confirm their specific frequency requirements with Pasco County Utilities.',
      },
    ],
  },

  'manatee': {
    intro:
      'Manatee County Utilities Department enforces FOG compliance for food service businesses in Bradenton, Palmetto, Lakewood Ranch, and Anna Maria Island. Under the county\'s FOG ordinance, restaurants and commercial kitchens must install approved grease control equipment and maintain regular cleaning schedules — typically every 30 to 90 days based on trap size and establishment volume. Manatee County\'s mix of beach tourism along Anna Maria Island, the rapidly expanding Lakewood Ranch dining scene, and Bradenton\'s revitalized downtown restaurant row ensures steady year-round demand for pump-out services. All haulers must hold valid DEP licenses and provide waste manifests. County inspectors conduct periodic compliance checks. Compare Manatee County grease trap providers in our verified directory.',
    metaDescription:
      'Find grease trap cleaning companies in Manatee County. FOG-compliant providers serving Bradenton and Lakewood Ranch with ratings and free quotes.',
    faqs: [
      {
        q: 'Who enforces grease trap compliance in Manatee County?',
        a: 'Manatee County Utilities Department enforces FOG compliance under the county\'s FOG ordinance. The department manages permitting, conducts periodic inspections, and ensures food service businesses in Bradenton, Palmetto, and Lakewood Ranch maintain compliant grease control equipment.',
      },
      {
        q: 'Do Manatee County restaurants need a FOG permit?',
        a: 'Yes. Restaurants and commercial kitchens in Manatee County must comply with the county\'s FOG ordinance, which requires installing approved grease control equipment, maintaining regular cleaning schedules, and using DEP-licensed haulers with manifest documentation.',
      },
      {
        q: 'How often must grease traps be cleaned in Manatee County?',
        a: 'Manatee County requires cleaning typically every 30 to 90 days based on trap size and establishment volume. Beach-area restaurants on Anna Maria Island and high-volume Lakewood Ranch dining establishments often need more frequent pump-outs.',
      },
    ],
  },

  'collier': {
    intro:
      'Collier County\'s Pollution Control and Prevention Division oversees FOG compliance for food service establishments in Naples, Marco Island, and Immokalee. The county\'s FOG ordinance requires restaurants, resorts, and commercial kitchens to maintain grease traps and interceptors with documented pump-out schedules, typically every 30 to 90 days. Collier County\'s upscale dining scene — concentrated along Fifth Avenue South in Naples, the Waterside Shops district, and Marco Island\'s resort restaurants — serves a high-spending seasonal population that drives intense kitchen activity from November through April. This seasonal surge demands flexible, responsive grease trap service. All haulers must carry DEP licenses and provide manifest documentation. Find Collier County-compliant providers below.',
    metaDescription:
      'Find grease trap cleaning companies in Collier County. Pollution Control-compliant providers serving Naples and Marco Island. Ratings and free quotes.',
    faqs: [
      {
        q: 'Who enforces grease trap compliance in Collier County?',
        a: 'Collier County\'s Pollution Control and Prevention Division oversees FOG compliance for food service establishments in Naples, Marco Island, and Immokalee. The division manages the FOG ordinance, conducts inspections, and monitors cleaning documentation.',
      },
      {
        q: 'Do Collier County restaurants need to comply with the FOG ordinance?',
        a: 'Yes. All restaurants, resorts, and commercial kitchens in Collier County must comply with the county\'s FOG ordinance. This requires maintaining grease traps and interceptors with documented pump-out schedules and using DEP-licensed haulers.',
      },
      {
        q: 'How often must grease traps be cleaned in Collier County?',
        a: 'Collier County requires pump-outs typically every 30 to 90 days based on establishment type and trap capacity. Naples\' upscale dining establishments and Marco Island resort restaurants often need monthly service, especially during the busy November through April tourist season.',
      },
    ],
  },

  'marion': {
    intro:
      'Marion County Utilities oversees FOG compliance for food service establishments in Ocala and the surrounding communities. Restaurants must maintain properly sized grease traps or interceptors and follow pump-out schedules set during permitting, with most establishments requiring service every 60 to 90 days. Marion County\'s food service landscape blends the growing downtown Ocala dining scene with restaurants serving the equestrian industry centered around the World Equestrian Center. Major horse shows and events draw thousands of visitors, creating seasonal spikes in dining demand. The county also serves The Villages residents who frequent Ocala-area restaurants. DEP-licensed haulers must provide waste manifests for all pump-outs. Browse verified Marion County grease trap companies in our directory.',
    metaDescription:
      'Find grease trap cleaning companies in Marion County. FOG-compliant providers serving Ocala\'s growing restaurant industry with ratings and free quotes.',
    faqs: [
      {
        q: 'Who enforces grease trap compliance in Marion County?',
        a: 'Marion County Utilities oversees FOG compliance for food service establishments in Ocala and surrounding communities. The department manages permitting, sets pump-out schedules, and ensures restaurants maintain properly sized grease traps or interceptors.',
      },
      {
        q: 'Do Marion County restaurants need a FOG permit?',
        a: 'Yes. Food service establishments in Marion County must obtain permitting from Marion County Utilities and maintain grease traps or interceptors cleaned on the schedule set during permitting. DEP-licensed haulers must provide waste manifests for all pump-outs.',
      },
      {
        q: 'How often must grease traps be cleaned in Marion County?',
        a: 'Most Marion County establishments require pump-outs every 60 to 90 days. Restaurants near the World Equestrian Center and those serving event-driven dining demand may need more frequent service during major horse shows and equestrian competitions.',
      },
    ],
  },

  'osceola': {
    intro:
      'Toho Water Authority administers water and wastewater services for much of Osceola County, including FOG compliance oversight for food service establishments in Kissimmee and St. Cloud. Restaurants must maintain grease traps or interceptors and adhere to pump-out schedules — typically every 30 to 90 days based on trap capacity and output. Osceola County\'s proximity to Walt Disney World and the broader Orlando tourism corridor makes it home to hundreds of restaurants catering to international visitors along US-192 and in the Celebration area. This tourism-driven dining density generates heavy FOG loads, especially during peak seasons. All haulers must be DEP-licensed with manifest documentation. Find Toho Water Authority-compliant providers in our directory.',
    metaDescription:
      'Find grease trap cleaning companies in Osceola County. Toho Water Authority-compliant providers serving Kissimmee\'s tourism dining corridor. Free quotes.',
    faqs: [
      {
        q: 'Who enforces grease trap compliance in Osceola County?',
        a: 'Toho Water Authority administers FOG compliance for food service establishments in Kissimmee, St. Cloud, and much of Osceola County. The authority oversees water and wastewater services including grease trap permitting and compliance monitoring.',
      },
      {
        q: 'Do Osceola County restaurants need to comply with Toho Water Authority requirements?',
        a: 'Yes. Food service establishments served by Toho Water Authority must maintain grease traps or interceptors, adhere to pump-out schedules, and use DEP-licensed haulers with manifest documentation. Tourism-corridor restaurants along US-192 face particularly heavy compliance demands.',
      },
      {
        q: 'How often must grease traps be cleaned in Osceola County?',
        a: 'Osceola County typically requires pump-outs every 30 to 90 days based on trap capacity and kitchen output. Restaurants in the US-192 tourism corridor near Walt Disney World often need more frequent cleaning due to high visitor-driven dining volume.',
      },
    ],
  },

  'escambia': {
    intro:
      'The Emerald Coast Utilities Authority (ECUA) oversees FOG compliance for food service establishments in Pensacola and throughout Escambia County. Under ECUA\'s FOG program, restaurants and commercial kitchens must register, install approved grease control equipment, and maintain regular cleaning schedules set during permitting. Most establishments require pump-outs every 60 to 90 days. Pensacola\'s restaurant industry draws on a unique blend of Gulf Coast tourism, a strong military presence from NAS Pensacola, and a revitalized downtown dining scene along Palafox Street. Seasonal seafood restaurants and year-round dining spots generate consistent demand for reliable grease trap services. All haulers must carry DEP licenses and provide waste manifests. Compare ECUA-compliant providers serving Escambia County.',
    metaDescription:
      'Find grease trap cleaning companies in Escambia County. ECUA FOG Program-registered providers serving Pensacola with ratings and free quotes.',
    faqs: [
      {
        q: 'Who enforces grease trap compliance in Escambia County?',
        a: 'The Emerald Coast Utilities Authority (ECUA) oversees FOG compliance for food service establishments in Pensacola and throughout Escambia County. ECUA manages the FOG program, handles registration, and monitors grease waste disposal practices.',
      },
      {
        q: 'Do Escambia County restaurants need to register with ECUA\'s FOG program?',
        a: 'Yes. Restaurants and commercial kitchens in Escambia County must register with ECUA\'s FOG program, install approved grease control equipment, and maintain regular cleaning schedules. All haulers must carry DEP licenses and provide waste manifests.',
      },
      {
        q: 'How often must grease traps be cleaned in Escambia County?',
        a: 'ECUA sets cleaning frequencies during permitting, with most Escambia County establishments requiring pump-outs every 60 to 90 days. Seasonal seafood restaurants and Pensacola Beach-area dining spots may need more frequent service during peak tourism months.',
      },
    ],
  },

  'leon': {
    intro:
      'The City of Tallahassee\'s Underground Utilities and Public Infrastructure Department manages FOG compliance for food service businesses in Leon County, Florida\'s capital. Restaurants must register with the city\'s FOG program and maintain grease traps or interceptors cleaned on a regular schedule — typically every 60 to 90 days. Leon County\'s restaurant industry is shaped by its role as a college town, with Florida State University and Florida A&M University driving significant campus food service operations and student-oriented dining. The state capitol\'s government workforce and lobbyist culture also support a concentration of upscale and business-lunch restaurants downtown. All haulers must be DEP-licensed and provide manifests. Find Leon County FOG-compliant grease trap companies below.',
    metaDescription:
      'Find grease trap cleaning companies in Leon County. FOG-compliant providers serving Tallahassee\'s university and government dining scene. Free quotes.',
    faqs: [
      {
        q: 'Who enforces grease trap compliance in Leon County?',
        a: 'The City of Tallahassee\'s Underground Utilities and Public Infrastructure Department manages FOG compliance for food service businesses in Leon County. The department administers the FOG program, issues permits, and monitors compliance for the capital city\'s restaurants.',
      },
      {
        q: 'Do Leon County restaurants need to register with Tallahassee\'s FOG program?',
        a: 'Yes. Food service establishments in Leon County must register with the City of Tallahassee\'s FOG program, maintain grease traps or interceptors with documented cleaning schedules, and use DEP-licensed haulers for all waste removal.',
      },
      {
        q: 'How often must grease traps be cleaned in Leon County?',
        a: 'Leon County typically requires cleaning every 60 to 90 days. University-area restaurants near FSU and FAMU and downtown government-district dining establishments may need more frequent service due to consistent high-volume foot traffic throughout the school year and legislative sessions.',
      },
    ],
  },
};

export default COUNTY_DATA;

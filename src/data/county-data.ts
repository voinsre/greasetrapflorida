/**
 * Unique county-level content for intro paragraphs and meta descriptions.
 * Each entry covers: local enforcement agency, ordinance references,
 * cleaning frequency, permit requirements, and local restaurant-industry context.
 */

export interface CountyData {
  intro: string;
  metaDescription: string;
}

const COUNTY_DATA: Record<string, CountyData> = {
  'miami-dade': {
    intro:
      'Miami-Dade County\'s massive tourism-driven restaurant industry — one of the largest in the Southeast — operates under strict FOG oversight from the Department of Environmental Resources Management (DERM). Under Chapter 24 of the Miami-Dade County Code and DERM Administrative Orders, every food service establishment must obtain a Grease Disposal Ordinance (GDO) permit before operating a grease trap or interceptor. DERM enforces the 25% capacity rule: once grease accumulation reaches one-quarter of the trap\'s depth, a pump-out is required. With thousands of restaurants, hotel kitchens, and catering operations spanning Miami Beach to Homestead, high turnover in the hospitality sector means new operators must quickly understand GDO permitting. Browse our directory to find DERM-compliant haulers serving Miami-Dade County.',
    metaDescription:
      'Find grease trap cleaning companies in Miami-Dade County. Compare DERM GDO-permitted providers with ratings, services, and free quotes.',
  },

  'broward': {
    intro:
      'Broward County\'s Environmental Licensing and Building Permitting Division oversees FOG compliance for food service establishments from Fort Lauderdale to Pembroke Pines. Section 34.09 of the Broward County Code mandates that all restaurants, hotels, and commercial kitchens install and maintain properly sized grease traps or interceptors. Establishments must register with the county\'s FOG Control Program and use only licensed haulers for grease waste removal. Cleaning frequency is set per permit based on trap size and kitchen output, though most high-volume restaurants require service every 30 to 60 days. Broward\'s dense mix of beachfront dining, suburban chain restaurants, and multicultural eateries creates steady demand for reliable pump-out services. Use our directory to compare licensed providers across Broward County.',
    metaDescription:
      'Find grease trap cleaning companies in Broward County. Compare FOG Control-registered providers compliant with Section 34.09. Ratings and free quotes.',
  },

  'palm-beach': {
    intro:
      'Palm Beach County food service businesses must comply with the Solid Waste Authority (SWA) Grease Program and local health department inspections. The Palm Beach County Health Department conducts routine FOG inspections, while the SWA oversees proper grease waste disposal and recycling. Establishments need a FOG permit and must maintain cleaning logs demonstrating regular pump-outs — typically every 30 to 90 days depending on trap capacity and grease volume. From upscale waterfront dining in Palm Beach to high-volume restaurants in West Palm Beach and Boca Raton, the county\'s diverse food scene demands dependable service providers. All haulers must carry proper DEP licensing and provide manifest documentation for every pump-out. Find SWA-compliant grease trap companies in our directory below.',
    metaDescription:
      'Find grease trap cleaning companies in Palm Beach County. SWA Grease Program-compliant providers with DEP licensing, ratings, and free quotes.',
  },

  'hillsborough': {
    intro:
      'Hillsborough County Public Utilities Department runs one of Florida\'s most structured Grease Management Programs, requiring all food service establishments in Tampa and surrounding areas to obtain a FOG permit before operating. Under Hillsborough County\'s grease ordinance, traps and interceptors must be cleaned at least every 90 days, with higher-volume kitchens often requiring monthly service. The county conducts periodic inspections and can issue fines for non-compliance. Tampa\'s booming food scene — from the historic Ybor City restaurant district to the expanding SoHo and Seminole Heights dining corridors — means competition among service providers keeps quality high and pricing fair. All waste haulers must be DEP-licensed and provide grease manifests. Browse verified Hillsborough County providers below.',
    metaDescription:
      'Find grease trap cleaning companies in Hillsborough County. Grease Management Program-permitted providers with 90-day compliance service and free quotes.',
  },

  'orange': {
    intro:
      'Orange County Utilities administers the FOG Control Program governing grease trap compliance for the greater Orlando area. With Walt Disney World, Universal Studios, and the Orange County Convention Center driving enormous seasonal dining volume, food service establishments face uniquely high grease output demands. Restaurants must obtain a FOG permit through Orange County Utilities, and cleaning frequency is set per permit based on establishment size and output. Theme-park-adjacent dining districts, International Drive restaurants, and downtown Orlando\'s growing culinary scene all require consistent pump-out schedules that account for tourist-season surges. DEP-licensed haulers must provide manifest documentation for every service call. Compare FOG-permitted grease trap companies serving Orange County in our directory.',
    metaDescription:
      'Find grease trap cleaning companies in Orange County. FOG Control Program-permitted providers serving Orlando\'s tourism-driven restaurant industry. Free quotes.',
  },

  'pinellas': {
    intro:
      'Pinellas County Utilities operates a Commercial Grease Management Program that sets some of the strictest FOG requirements in the Tampa Bay region. Grease interceptors must be pumped monthly, while smaller indoor traps follow a schedule determined during permitting. The county requires all food service establishments — from Clearwater Beach seafood restaurants to St. Petersburg\'s thriving downtown dining scene — to hold an active grease permit and maintain detailed cleaning logs. Pinellas County inspectors conduct regular compliance checks and can mandate increased pump-out frequency for repeat violators. As a densely populated coastal county with heavy tourism traffic, the restaurant industry here generates substantial FOG waste year-round. Find Pinellas County Utilities-compliant service providers in our verified directory.',
    metaDescription:
      'Find grease trap cleaning companies in Pinellas County. Commercial Grease Management Program-compliant providers with monthly interceptor service. Free quotes.',
  },

  'duval': {
    intro:
      'Duval County\'s FOG compliance is overseen by JEA (Jacksonville\'s municipal utility), which operates a Preferred Hauler Program for grease waste removal. Food service establishments throughout Jacksonville must register with JEA\'s FOG program and use only approved haulers listed in the Preferred Hauler directory. Cleaning frequency is determined per permit, with most restaurants needing service every 30 to 90 days. Jacksonville\'s rapidly growing food scene — anchored by the downtown restaurant district, San Marco, Riverside, and military base dining facilities at Naval Station Mayport and NAS Jacksonville — creates diverse service demands. JEA conducts inspections and tracks manifest compliance. Browse our directory to find JEA Preferred Hauler-approved providers in Duval County.',
    metaDescription:
      'Find grease trap service providers in Duval County. JEA Preferred Hauler Program-approved companies with ratings, services, and free quotes.',
  },

  'lee': {
    intro:
      'Lee County Utilities enforces FOG compliance through a local grease ordinance that requires all food service establishments in Fort Myers, Cape Coral, and surrounding communities to maintain properly functioning grease traps and interceptors. Restaurants must obtain a FOG permit and schedule regular pump-outs — typically every 30 to 90 days based on trap size and kitchen volume. Lee County\'s seasonal population swings, driven by snowbird residents and winter tourism along Fort Myers Beach and Sanibel Island, create fluctuating demands on restaurant kitchens and their grease management systems. All haulers must hold valid DEP licenses and provide waste manifests. With a growing year-round dining scene beyond the tourist corridor, reliable service is essential. Compare Lee County providers below.',
    metaDescription:
      'Find grease trap cleaning companies in Lee County. FOG-permitted providers serving Fort Myers and Cape Coral with ratings and free quotes.',
  },

  'volusia': {
    intro:
      'Volusia County\'s Environmental Management Division administers the FOG Program for food service establishments from Daytona Beach to DeLand and New Smyrna Beach. Under the county\'s FOG ordinance, restaurants and commercial kitchens must register, install appropriately sized grease control equipment, and maintain documented cleaning schedules. Pump-out frequency is set per permit, but most establishments require service every 60 to 90 days. Volusia County\'s unique mix of Daytona Beach tourism traffic — particularly during Speedweeks, Bike Week, and spring break — along with a growing permanent population drives consistent demand for grease trap services. DEP-licensed haulers must provide manifests for every pump-out. Find compliant Volusia County grease trap companies in our verified directory.',
    metaDescription:
      'Find grease trap cleaning companies in Volusia County. FOG Program-registered providers serving Daytona Beach with ratings and free quotes.',
  },

  'sarasota': {
    intro:
      'Sarasota County Utilities launched a formal FOG Program in 2020, establishing clear compliance standards for the county\'s food service industry. Under this program, indoor grease traps must be cleaned every 30 days, while outdoor grease interceptors require pump-outs at least every 90 days. Restaurants, hotels, and commercial kitchens must register with the county and maintain cleaning logs available for inspection. Sarasota\'s acclaimed dining scene — from the upscale restaurants on St. Armands Circle to the waterfront seafood spots along Siesta Key and Venice — demands reliable, frequent service from qualified haulers. All providers must carry DEP licenses and supply grease waste manifests. Compare Sarasota County FOG Program-compliant providers in our directory below.',
    metaDescription:
      'Find grease trap cleaning companies in Sarasota County. FOG Program-compliant providers with 30-day trap and 90-day interceptor service. Free quotes.',
  },

  'brevard': {
    intro:
      'Brevard County Utilities manages FOG compliance for food service establishments along Florida\'s Space Coast, from Titusville to Palm Bay. The county\'s FOG Management Program requires restaurants and commercial kitchens to install approved grease control equipment, obtain a FOG permit, and schedule regular pump-outs based on trap capacity and output. Most establishments need cleaning every 60 to 90 days. Brevard\'s unique economic mix — Kennedy Space Center visitors, Cocoa Beach tourism, a growing cruise port in Port Canaveral, and expanding suburban dining in Melbourne and Viera — drives year-round demand for reliable grease trap services. All haulers must be DEP-licensed and provide manifest documentation. Find Brevard County FOG-permitted providers in our directory.',
    metaDescription:
      'Find grease trap cleaning companies in Brevard County. FOG-permitted providers serving the Space Coast with DEP licensing, ratings, and free quotes.',
  },

  'seminole': {
    intro:
      'Seminole County Environmental Services oversees FOG compliance for food service businesses in Sanford, Altamonte Springs, Lake Mary, and surrounding communities north of Orlando. The county requires restaurants and commercial kitchens to hold a FOG permit and maintain grease traps or interceptors with documented cleaning schedules. Pump-out frequency is typically every 60 to 90 days, though high-volume establishments may need monthly service. Seminole County\'s proximity to Orlando\'s tourism corridor generates significant spillover dining traffic, while the county\'s own suburban growth has expanded the local restaurant scene substantially. All grease waste haulers must carry DEP licensing and supply manifests for each service visit. Compare verified Seminole County grease trap companies below.',
    metaDescription:
      'Find grease trap cleaning companies in Seminole County. FOG-permitted providers serving Sanford and Altamonte Springs with ratings and free quotes.',
  },

  'polk': {
    intro:
      'Polk County Utilities Department administers FOG compliance for food service establishments across Lakeland, Winter Haven, Bartow, and surrounding communities in Central Florida\'s heartland. Restaurants must register with the county\'s FOG program and maintain grease traps or interceptors cleaned on a schedule determined during permitting — typically every 60 to 90 days. Polk County\'s strategic location between Tampa and Orlando means its restaurant industry serves both local residents and significant pass-through traffic along the I-4 corridor. The county\'s growing population and expanding chain and independent dining options create steady demand for grease trap services. DEP-licensed haulers must provide waste manifests for every pump-out. Browse our directory for Polk County providers.',
    metaDescription:
      'Find grease trap cleaning companies in Polk County. FOG-registered providers serving Lakeland and Winter Haven with ratings and free quotes.',
  },

  'pasco': {
    intro:
      'Pasco County Utilities operates a FOG Control Program requiring all food service establishments in New Port Richey, Wesley Chapel, Dade City, and surrounding areas to maintain compliant grease traps and interceptors. Restaurants must obtain a FOG permit and adhere to cleaning frequencies set during the permitting process, with most needing pump-outs every 60 to 90 days. As one of Florida\'s fastest-growing counties, Pasco\'s rapid residential development — particularly in the Wesley Chapel and Zephyrhills corridors — has driven a surge in new restaurant openings that need reliable grease management from day one. All haulers must be DEP-licensed with proper manifest documentation. Find Pasco County FOG-compliant grease trap companies in our directory.',
    metaDescription:
      'Find grease trap cleaning companies in Pasco County. FOG Control Program-registered providers serving Wesley Chapel and New Port Richey. Free quotes.',
  },

  'manatee': {
    intro:
      'Manatee County Utilities Department enforces FOG compliance for food service businesses in Bradenton, Palmetto, Lakewood Ranch, and Anna Maria Island. Under the county\'s FOG ordinance, restaurants and commercial kitchens must install approved grease control equipment and maintain regular cleaning schedules — typically every 30 to 90 days based on trap size and establishment volume. Manatee County\'s mix of beach tourism along Anna Maria Island, the rapidly expanding Lakewood Ranch dining scene, and Bradenton\'s revitalized downtown restaurant row ensures steady year-round demand for pump-out services. All haulers must hold valid DEP licenses and provide waste manifests. County inspectors conduct periodic compliance checks. Compare Manatee County grease trap providers in our verified directory.',
    metaDescription:
      'Find grease trap cleaning companies in Manatee County. FOG-compliant providers serving Bradenton and Lakewood Ranch with ratings and free quotes.',
  },

  'collier': {
    intro:
      'Collier County\'s Pollution Control and Prevention Division oversees FOG compliance for food service establishments in Naples, Marco Island, and Immokalee. The county\'s FOG ordinance requires restaurants, resorts, and commercial kitchens to maintain grease traps and interceptors with documented pump-out schedules, typically every 30 to 90 days. Collier County\'s upscale dining scene — concentrated along Fifth Avenue South in Naples, the Waterside Shops district, and Marco Island\'s resort restaurants — serves a high-spending seasonal population that drives intense kitchen activity from November through April. This seasonal surge demands flexible, responsive grease trap service. All haulers must carry DEP licenses and provide manifest documentation. Find Collier County-compliant providers below.',
    metaDescription:
      'Find grease trap cleaning companies in Collier County. Pollution Control-compliant providers serving Naples and Marco Island. Ratings and free quotes.',
  },

  'marion': {
    intro:
      'Marion County Utilities oversees FOG compliance for food service establishments in Ocala and the surrounding communities. Restaurants must maintain properly sized grease traps or interceptors and follow pump-out schedules set during permitting, with most establishments requiring service every 60 to 90 days. Marion County\'s food service landscape blends the growing downtown Ocala dining scene with restaurants serving the equestrian industry centered around the World Equestrian Center. Major horse shows and events draw thousands of visitors, creating seasonal spikes in dining demand. The county also serves The Villages residents who frequent Ocala-area restaurants. DEP-licensed haulers must provide waste manifests for all pump-outs. Browse verified Marion County grease trap companies in our directory.',
    metaDescription:
      'Find grease trap cleaning companies in Marion County. FOG-compliant providers serving Ocala\'s growing restaurant industry with ratings and free quotes.',
  },

  'osceola': {
    intro:
      'Toho Water Authority administers water and wastewater services for much of Osceola County, including FOG compliance oversight for food service establishments in Kissimmee and St. Cloud. Restaurants must maintain grease traps or interceptors and adhere to pump-out schedules — typically every 30 to 90 days based on trap capacity and output. Osceola County\'s proximity to Walt Disney World and the broader Orlando tourism corridor makes it home to hundreds of restaurants catering to international visitors along US-192 and in the Celebration area. This tourism-driven dining density generates heavy FOG loads, especially during peak seasons. All haulers must be DEP-licensed with manifest documentation. Find Toho Water Authority-compliant providers in our directory.',
    metaDescription:
      'Find grease trap cleaning companies in Osceola County. Toho Water Authority-compliant providers serving Kissimmee\'s tourism dining corridor. Free quotes.',
  },

  'escambia': {
    intro:
      'The Emerald Coast Utilities Authority (ECUA) oversees FOG compliance for food service establishments in Pensacola and throughout Escambia County. Under ECUA\'s FOG program, restaurants and commercial kitchens must register, install approved grease control equipment, and maintain regular cleaning schedules set during permitting. Most establishments require pump-outs every 60 to 90 days. Pensacola\'s restaurant industry draws on a unique blend of Gulf Coast tourism, a strong military presence from NAS Pensacola, and a revitalized downtown dining scene along Palafox Street. Seasonal seafood restaurants and year-round dining spots generate consistent demand for reliable grease trap services. All haulers must carry DEP licenses and provide waste manifests. Compare ECUA-compliant providers serving Escambia County.',
    metaDescription:
      'Find grease trap cleaning companies in Escambia County. ECUA FOG Program-registered providers serving Pensacola with ratings and free quotes.',
  },

  'leon': {
    intro:
      'The City of Tallahassee\'s Underground Utilities and Public Infrastructure Department manages FOG compliance for food service businesses in Leon County, Florida\'s capital. Restaurants must register with the city\'s FOG program and maintain grease traps or interceptors cleaned on a regular schedule — typically every 60 to 90 days. Leon County\'s restaurant industry is shaped by its role as a college town, with Florida State University and Florida A&M University driving significant campus food service operations and student-oriented dining. The state capitol\'s government workforce and lobbyist culture also support a concentration of upscale and business-lunch restaurants downtown. All haulers must be DEP-licensed and provide manifests. Find Leon County FOG-compliant grease trap companies below.',
    metaDescription:
      'Find grease trap cleaning companies in Leon County. FOG-compliant providers serving Tallahassee\'s university and government dining scene. Free quotes.',
  },
};

export default COUNTY_DATA;

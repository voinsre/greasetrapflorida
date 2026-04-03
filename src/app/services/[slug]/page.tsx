import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { createStaticClient } from '@/lib/supabase/static';
import { isVerified } from '@/components/directory/VerifiedBadge';
import DirectoryShell from '@/components/directory/DirectoryShell';
import { ChevronRight } from 'lucide-react';

export async function generateStaticParams() {
  const supabase = createStaticClient();
  const { data } = await supabase.from('service_types').select('slug');
  return (data || []).map((s) => ({ slug: s.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createStaticClient();
  const { data: service } = await supabase
    .from('service_types')
    .select('name')
    .eq('slug', slug)
    .single();
  if (!service) return {};
  const title = `${service.name} in Florida`;
  return {
    title: { absolute: title },
    description: `Find companies offering ${service.name.toLowerCase()} in Florida. Compare ratings, verify licensing, and get free quotes from verified providers.`,
    openGraph: {
      title,
      description: `Find companies offering ${service.name.toLowerCase()} in Florida.`,
      url: `https://greasetrapflorida.com/services/${slug}`,
      siteName: 'Grease Trap Florida',
      type: 'website',
    },
  };
}

// Unique SEO content per service type (only 10, so no templates)
const SERVICE_SEO: Record<string, string> = {
  'grease-trap-cleaning':
    'Grease trap cleaning is the most essential maintenance service for any Florida food service establishment. Professional cleaning involves pumping out accumulated fats, oils, and grease (FOG) from your trap, scraping and washing the interior walls, and ensuring the baffles and flow restrictors function properly. Under Chapter 62-705 F.A.C., all grease waste must be removed by DEP-licensed haulers who provide documented manifests for every pump-out. Most Florida restaurants need cleaning every 30 to 90 days depending on kitchen volume, menu type, and trap capacity. Skipping scheduled cleanings leads to FOG buildup that causes sewer backups, health code violations, and potential fines of $100 to $5,000 per violation. The providers below specialize in routine grease trap cleaning across Florida.',

  'grease-interceptor-pumping':
    'Grease interceptors are large underground units — typically 500 to 2,000 gallons — that serve high-volume food service operations like restaurants, hotel kitchens, and institutional cafeterias. Pumping a grease interceptor requires specialized vacuum trucks and experienced technicians who can handle the volume and complexity of these larger systems. Florida DEP requires that interceptors be pumped when FOG accumulation reaches 25% of the unit\'s capacity, though many counties enforce more frequent schedules. Professional pumping includes measuring grease depth before and after service, documenting manifests per Chapter 62-705, and inspecting the unit for structural issues. The providers below are equipped to handle grease interceptor pumping across Florida.',

  'grease-trap-installation':
    'Installing a grease trap or interceptor is a critical step when opening a new food service establishment or upgrading an existing system in Florida. Proper sizing is essential — too small and you\'ll face frequent overflows; too large and you waste money on unnecessary capacity. Florida plumbing codes require grease traps for all commercial kitchens that produce FOG waste. Installation involves selecting the right unit size based on flow rate and kitchen output, excavation for underground interceptors, connecting to your plumbing and sewer lines, and passing local building inspections. Many providers also assist with permits and compliance documentation. Choose an installer who understands Florida\'s Chapter 62-705 requirements to ensure your system meets state standards from day one.',

  'grease-trap-repair-replacement':
    'Grease traps endure years of corrosive FOG exposure, and eventually components wear out or fail entirely. Common repair needs include cracked or corroded baffles, damaged inlet and outlet tees, failing seals around the cover, and compromised structural walls. When repairs aren\'t sufficient, full replacement becomes necessary — especially for older concrete traps that have deteriorated beyond repair. Florida establishments can\'t operate without a functioning grease trap, so timely repair prevents health code shutdowns and sewer backups. Professional technicians can diagnose whether your trap needs a targeted repair or complete replacement, handle proper disposal of the old unit per DEP guidelines, and ensure the repaired or new system meets current code requirements.',

  'hydro-jetting':
    'Hydro jetting uses high-pressure water streams — typically 3,000 to 4,000+ PSI — to blast through stubborn grease buildup, scale, and debris in drain lines and grease trap piping. This service goes beyond standard cleaning by removing hardened deposits that routine pumping can\'t reach. For Florida food service establishments, hydro jetting is particularly valuable as a preventive measure: regular jetting keeps drain lines flowing freely and extends the time between emergency service calls. It\'s also the recommended solution when you\'re experiencing slow drains, recurring backups, or persistent odors despite regular trap cleaning. Many providers combine hydro jetting with routine pump-outs for comprehensive FOG management that keeps your system in top condition year-round.',

  'used-cooking-oil-collection':
    'Used cooking oil (UCO) collection is a separate but complementary service to grease trap cleaning. While grease traps capture FOG from wash water and drains, used cooking oil comes directly from fryers and cooking equipment. Florida regulations distinguish between the two waste streams — UCO is often recycled into biodiesel and other products, while grease trap waste requires disposal at permitted facilities. Many grease trap service companies offer UCO pickup as an add-on service, providing collection containers and scheduled pickups at no charge since the oil has recycling value. Proper UCO disposal prevents it from entering your grease trap (which reduces cleaning frequency) and keeps you compliant with waste management regulations.',

  'emergency-overflow-service':
    'A grease trap overflow is an emergency that demands immediate response. Overflowing FOG can flood your kitchen, create slip hazards for staff, trigger health department closures, and contaminate local sewer systems — potentially resulting in DEP fines. Emergency overflow service providers offer rapid response, often within hours or same-day, to pump out the trap, clean up the overflow, and restore your kitchen to operating condition. In Florida\'s warm climate, grease breaks down faster and can cause odor issues quickly, making fast response critical. Many providers listed below offer 24/7 emergency service with after-hours availability. If your trap is overflowing, don\'t wait — contact an emergency provider immediately.',

  'fog-compliance-consulting':
    'FOG compliance consulting helps Florida food service businesses navigate the complex regulatory landscape of grease waste management. Chapter 62-705 F.A.C., which became effective December 7, 2025, established new DEP licensing requirements for grease waste haulers and stricter documentation standards. Compliance consultants evaluate your current grease management practices, identify gaps that could result in violations, recommend appropriate trap sizing and cleaning schedules, and help prepare for health department inspections. This service is especially valuable for multi-location operators, new restaurant owners unfamiliar with Florida regulations, and businesses that have received FOG-related violations. A good consultant saves you money by preventing fines and optimizing your maintenance schedule.',

  'grease-trap-inspection':
    'Professional grease trap inspection goes beyond a quick visual check. Certified inspectors measure FOG accumulation levels, assess structural integrity of the trap or interceptor, verify that baffles and flow restrictors are functioning correctly, check inlet and outlet conditions, and document findings in a detailed report. Regular inspections help you stay ahead of problems before they become emergencies — a cracked baffle or corroded wall caught early costs far less to repair than a full system failure. Many Florida counties require periodic inspections as part of their FOG management programs, and inspection reports serve as documentation of compliance for health department audits. Schedule inspections between pump-outs to maintain peak trap performance.',

  'drain-line-cleaning':
    'Drain line cleaning keeps your kitchen\'s plumbing system flowing smoothly between grease trap pump-outs. Over time, FOG residue, food particles, and mineral deposits accumulate in the drain lines connecting your sinks, dishwashers, and floor drains to the grease trap. Clogged or slow-running drain lines reduce trap efficiency and can cause backups into your kitchen. Professional drain cleaning typically involves mechanical snaking for localized blockages and hydro jetting for comprehensive line clearing. Many Florida grease trap companies offer drain line cleaning as part of a maintenance package, combining it with regular trap pumping for complete FOG system care. Regular drain maintenance reduces emergency calls and extends the lifespan of your entire grease management system.',
};

const SERVICE_FAQS: Record<string, { q: string; a: string }[]> = {
  'grease-trap-cleaning': [
    { q: 'What does grease trap cleaning involve?', a: 'Professional grease trap cleaning includes pumping out all FOG and wastewater, scraping interior walls and baffles, flushing the trap with clean water, inspecting components for damage, and providing a documented manifest per Chapter 62-705. The entire process typically takes 30 to 60 minutes for a standard-size trap.' },
    { q: 'How often do Florida businesses need grease trap cleaning?', a: 'Most Florida restaurants need grease trap cleaning every 30 to 90 days, depending on kitchen volume, menu type, and trap size. High-volume restaurants with heavy frying may need monthly service, while smaller cafes can often go 60-90 days. Your cleaning frequency should prevent FOG from exceeding 25% of trap capacity.' },
    { q: 'How much does grease trap cleaning cost in Florida?', a: 'Grease trap cleaning in Florida typically costs $200 to $500 per visit for standard-size traps (20-50 gallon). Larger traps and interceptors cost $300 to $800+. Annual service contracts with regular scheduling often reduce per-visit costs by 10-20%. Request quotes from multiple providers to compare.' },
    { q: 'Do I need a DEP-licensed company for grease trap cleaning?', a: 'Yes. Under Florida Chapter 62-705, all grease waste must be transported by DEP-licensed haulers. Using an unlicensed company can result in fines of $100 to $5,000 per violation. Always verify your provider\'s DEP license before scheduling service.' },
  ],
  'grease-interceptor-pumping': [
    { q: 'What does grease interceptor pumping involve?', a: 'Grease interceptor pumping involves using a vacuum truck to remove all FOG and wastewater from the interceptor (typically 500-2,000+ gallons), measuring grease depth before and after service, inspecting the unit for structural issues, and documenting the service with a DEP-compliant manifest.' },
    { q: 'How often do Florida businesses need grease interceptor pumping?', a: 'Florida regulations require pumping when FOG reaches 25% of interceptor capacity. For most high-volume establishments, this means every 30 to 90 days. Some counties enforce stricter schedules. Your provider should measure grease depth at each visit to optimize your pumping frequency.' },
    { q: 'How much does grease interceptor pumping cost in Florida?', a: 'Grease interceptor pumping in Florida typically costs $300 to $800+ per service, depending on interceptor size, grease volume, and accessibility. Larger units (1,000+ gallons) and units requiring longer hose runs cost more. Annual contracts reduce per-visit pricing.' },
    { q: 'Do I need a DEP-licensed company for grease interceptor pumping?', a: 'Yes. Chapter 62-705 requires DEP-licensed haulers for all grease waste removal, including interceptor pumping. The hauler must provide a manifest documenting the waste volume, origin, and disposal destination for every pump-out.' },
  ],
  'grease-trap-installation': [
    { q: 'What does grease trap installation involve?', a: 'Installation includes sizing the trap based on your kitchen\'s flow rate and output, selecting the appropriate unit type (indoor trap or underground interceptor), connecting to existing plumbing, ensuring proper venting, and passing local building inspections. For underground interceptors, excavation work is also required.' },
    { q: 'How often do Florida businesses need grease trap installation?', a: 'Grease trap installation is typically a one-time service when opening a new food service establishment or when an existing trap needs replacement due to age or damage. Florida building codes require grease traps for all new commercial kitchens. Replacement intervals range from 10 to 25+ years depending on trap material and maintenance.' },
    { q: 'How much does grease trap installation cost in Florida?', a: 'Indoor grease traps cost $500 to $2,000 installed, while underground grease interceptors range from $3,000 to $15,000+ depending on size and excavation requirements. Costs include the unit, labor, plumbing connections, and permit fees.' },
    { q: 'Do I need a DEP-licensed company for grease trap installation?', a: 'Installation itself doesn\'t require DEP licensing — it requires a licensed plumber. However, once installed, all ongoing grease waste removal must be performed by DEP-licensed haulers per Chapter 62-705. Many installation companies also offer maintenance service.' },
  ],
  'grease-trap-repair-replacement': [
    { q: 'What does grease trap repair involve?', a: 'Common repairs include replacing cracked or corroded baffles, fixing damaged inlet/outlet tees, replacing seals and gaskets, repairing structural walls, and addressing flow control issues. Technicians assess whether targeted repair or full replacement is more cost-effective for your situation.' },
    { q: 'How often do Florida businesses need grease trap repair?', a: 'Repair needs vary by trap age, material, and maintenance history. Well-maintained traps may need minor repairs every 3-5 years. Major structural issues or repeated failures may indicate the trap needs full replacement, especially for concrete traps over 15-20 years old.' },
    { q: 'How much does grease trap repair cost in Florida?', a: 'Minor repairs (baffle replacement, seal fixes) typically cost $200 to $600. Major repairs or partial replacements range from $800 to $3,000. Full replacement of a failed trap costs $1,500 to $15,000+ depending on type and size.' },
    { q: 'Do I need a DEP-licensed company for grease trap repair?', a: 'Repair work requires a licensed plumber. If the repair involves removing grease waste, that portion must be handled by a DEP-licensed hauler. Any waste removed during repair must be properly documented with a manifest per Chapter 62-705.' },
  ],
  'hydro-jetting': [
    { q: 'What does hydro jetting involve?', a: 'Hydro jetting uses specialized equipment to blast high-pressure water (3,000-4,000+ PSI) through drain lines and grease trap piping. The pressurized water stream breaks through hardened grease deposits, scale buildup, and debris that standard cleaning can\'t remove, restoring full pipe diameter and flow capacity.' },
    { q: 'How often do Florida businesses need hydro jetting?', a: 'Most Florida food service establishments benefit from hydro jetting every 6 to 12 months as preventive maintenance. Restaurants with heavy grease output or recurring drain issues may need quarterly jetting. It\'s also recommended whenever you experience persistent slow drains despite regular trap cleaning.' },
    { q: 'How much does hydro jetting cost in Florida?', a: 'Hydro jetting for commercial kitchen drain lines typically costs $300 to $800 per session in Florida, depending on the length and number of lines treated. Some providers include hydro jetting in comprehensive maintenance packages at reduced rates.' },
    { q: 'Do I need a DEP-licensed company for hydro jetting?', a: 'Hydro jetting of drain lines alone doesn\'t require DEP licensing. However, if the service includes pumping grease waste from the trap, that portion requires a DEP-licensed hauler with proper manifest documentation per Chapter 62-705.' },
  ],
  'used-cooking-oil-collection': [
    { q: 'What does used cooking oil collection involve?', a: 'UCO collection providers supply secure collection containers for your used fryer oil, schedule regular pickups (typically weekly or bi-weekly), transport the oil for recycling into biodiesel or other products, and provide documentation of proper disposal. Many providers offer this at no charge since recycled oil has commodity value.' },
    { q: 'How often do Florida businesses need used cooking oil collection?', a: 'Collection frequency depends on your frying volume. Most restaurants need weekly or bi-weekly pickup. High-volume frying operations (fried chicken restaurants, fish fry establishments) may need more frequent service. Your provider will help determine the right schedule based on your container fill rate.' },
    { q: 'How much does used cooking oil collection cost in Florida?', a: 'Many UCO collection services in Florida are free — the provider earns revenue by selling the recycled oil. Some providers even pay restaurants for high-quality cooking oil. If there\'s a fee, it\'s typically minimal ($25-50/month) and often bundled with grease trap cleaning contracts.' },
    { q: 'Do I need a DEP-licensed company for used cooking oil collection?', a: 'Used cooking oil collection has different regulatory requirements than grease trap waste. UCO recycling doesn\'t fall under Chapter 62-705\'s grease waste hauler licensing. However, ensure your provider has proper waste hauling permits for your municipality.' },
  ],
  'emergency-overflow-service': [
    { q: 'What does emergency overflow service involve?', a: 'Emergency service includes rapid response (typically within 2-4 hours), pumping out the overflowing trap, cleaning up spilled FOG from your kitchen floor, sanitizing affected areas, and restoring your trap to normal operating condition. The provider documents the emergency service with a manifest per Chapter 62-705.' },
    { q: 'How often do Florida businesses need emergency overflow service?', a: 'Ideally never — regular maintenance prevents emergencies. Overflows typically happen when cleaning schedules are missed, trap capacity is underestimated, or unexpected events increase FOG volume. If you\'re calling for emergency service more than once a year, your maintenance schedule needs adjustment.' },
    { q: 'How much does emergency overflow service cost in Florida?', a: 'Emergency grease trap service in Florida typically costs $400 to $1,200, significantly more than scheduled maintenance. After-hours and weekend responses carry additional premiums. This is why regular preventive maintenance ($200-500/visit) is far more cost-effective than emergency calls.' },
    { q: 'Do I need a DEP-licensed company for emergency overflow service?', a: 'Yes. All grease waste removal — including emergency pump-outs — must be performed by DEP-licensed haulers under Chapter 62-705. Even in an emergency, the hauler must provide a proper manifest documenting the waste volume and disposal destination.' },
  ],
  'fog-compliance-consulting': [
    { q: 'What does FOG compliance consulting involve?', a: 'Consulting includes auditing your current grease management practices, evaluating trap sizing and cleaning frequency, reviewing manifest documentation, identifying compliance gaps, recommending corrective actions, and preparing your establishment for health department inspections. Some consultants also help with violation remediation.' },
    { q: 'How often do Florida businesses need FOG compliance consulting?', a: 'An initial consultation when opening a new establishment, plus follow-up reviews annually or after regulatory changes. The December 2025 Chapter 62-705 update created new requirements — businesses that haven\'t had a compliance review since then should schedule one to ensure they meet current standards.' },
    { q: 'How much does FOG compliance consulting cost in Florida?', a: 'Initial FOG compliance audits typically cost $200 to $800 depending on establishment size and complexity. Ongoing consulting retainers for multi-location operators range from $100 to $500/month. This investment often pays for itself by preventing fines ($100-$5,000 per violation) and optimizing maintenance spending.' },
    { q: 'Do I need a DEP-licensed company for FOG compliance consulting?', a: 'Consulting services don\'t require DEP licensing — they\'re advisory in nature. However, consultants who also provide cleaning or pumping services must hold DEP licenses for those activities. Look for consultants with deep knowledge of Chapter 62-705 and local county ordinances.' },
  ],
  'grease-trap-inspection': [
    { q: 'What does grease trap inspection involve?', a: 'Professional inspection includes measuring FOG accumulation depth, assessing structural integrity (walls, baffles, covers), checking inlet and outlet conditions, verifying flow restrictor function, testing for proper drainage, and providing a detailed written report with findings and recommendations.' },
    { q: 'How often do Florida businesses need grease trap inspection?', a: 'Most Florida counties recommend inspections every 3 to 6 months, often conducted as part of routine pump-out visits. Some local FOG programs require separate formal inspections. Inspections between cleanings help catch problems early and optimize your maintenance schedule.' },
    { q: 'How much does grease trap inspection cost in Florida?', a: 'Standalone grease trap inspections cost $100 to $300 in Florida. Many service providers include basic inspection as part of their routine cleaning service at no additional charge. Comprehensive inspections with camera diagnostics may cost $200 to $500.' },
    { q: 'Do I need a DEP-licensed company for grease trap inspection?', a: 'Visual inspection alone doesn\'t require DEP licensing. However, if any waste is removed during inspection, a DEP-licensed hauler is required. Most providers who offer inspection services are already DEP-licensed since they also provide cleaning and pumping.' },
  ],
  'drain-line-cleaning': [
    { q: 'What does drain line cleaning involve?', a: 'Drain line cleaning uses mechanical snaking and/or hydro jetting to remove FOG buildup, food debris, and scale deposits from the pipes connecting your kitchen fixtures to the grease trap. Technicians clear blockages, restore full flow capacity, and inspect line condition to prevent future issues.' },
    { q: 'How often do Florida businesses need drain line cleaning?', a: 'Most Florida restaurants benefit from drain line cleaning every 3 to 6 months as preventive maintenance. High-volume kitchens or those with older plumbing may need more frequent service. Schedule drain cleaning whenever you notice slow drainage, gurgling sounds, or persistent odors from floor drains.' },
    { q: 'How much does drain line cleaning cost in Florida?', a: 'Basic mechanical drain cleaning costs $150 to $400 per service in Florida. Hydro jetting for more thorough cleaning runs $300 to $800. Many providers offer drain cleaning as an add-on to grease trap service at reduced bundled rates.' },
    { q: 'Do I need a DEP-licensed company for drain line cleaning?', a: 'Drain line cleaning itself doesn\'t require DEP licensing — it\'s a plumbing service. However, if waste material removed from drain lines is classified as grease waste, proper disposal by a DEP-licensed hauler may be required depending on volume and local regulations.' },
  ],
};

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const supabase = createStaticClient();

  const { data: service } = await supabase
    .from('service_types')
    .select('*')
    .eq('slug', slug)
    .single();
  if (!service) notFound();

  // Get business IDs that offer this service
  const PAGE_SIZE = 1000;
  let allJunctions: { business_id: string }[] = [];
  let from = 0;
  let hasMore = true;
  while (hasMore) {
    const { data } = await supabase
      .from('business_services')
      .select('business_id')
      .eq('service_id', service.id)
      .range(from, from + PAGE_SIZE - 1);
    allJunctions = [...allJunctions, ...(data || [])];
    hasMore = (data?.length || 0) === PAGE_SIZE;
    from += PAGE_SIZE;
  }

  const bizIds = allJunctions.map((j) => j.business_id);

  // Fetch businesses in chunks
  let allBusinesses: Record<string, unknown>[] = [];
  for (let i = 0; i < bizIds.length; i += 100) {
    const chunk = bizIds.slice(i, i + 100);
    const { data } = await supabase
      .from('businesses')
      .select('id, slug, name, city, county, county_slug, rating, review_count, is_featured, dep_licensed, emergency_24_7, manifest_provided, insured, website_status, phone, place_id')
      .in('id', chunk);
    allBusinesses = [...allBusinesses, ...(data || [])];
  }

  allBusinesses.sort((a, b) => {
    if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1;
    return ((b.rating as number) || 0) - ((a.rating as number) || 0);
  });

  // Get all service junctions for these businesses
  let allServiceJunctions: { business_id: string; service_id: string }[] = [];
  for (let i = 0; i < bizIds.length; i += 100) {
    const chunk = bizIds.slice(i, i + 100);
    const { data } = await supabase
      .from('business_services')
      .select('business_id, service_id')
      .in('business_id', chunk);
    allServiceJunctions = [...allServiceJunctions, ...(data || [])];
  }

  const { data: serviceTypes } = await supabase
    .from('service_types')
    .select('id, slug, name')
    .order('name');

  const { data: counties } = await supabase
    .from('counties')
    .select('slug, name')
    .gt('business_count', 0)
    .order('name');

  const { data: cities } = await supabase
    .from('cities')
    .select('slug, name, county_slug, business_count')
    .gt('business_count', 0)
    .order('name');

  // Build service maps
  const serviceIdToSlug = new Map<string, string>();
  const serviceIdToName = new Map<string, string>();
  for (const st of serviceTypes || []) {
    serviceIdToSlug.set(st.id, st.slug);
    serviceIdToName.set(st.id, st.name);
  }

  const bizServices = new Map<string, { slugs: string[]; names: string[] }>();
  for (const j of allServiceJunctions) {
    if (!bizServices.has(j.business_id)) {
      bizServices.set(j.business_id, { slugs: [], names: [] });
    }
    const entry = bizServices.get(j.business_id)!;
    const s = serviceIdToSlug.get(j.service_id);
    const n = serviceIdToName.get(j.service_id);
    if (s) entry.slugs.push(s);
    if (n) entry.names.push(n);
  }

  const businesses = allBusinesses.map((b: Record<string, unknown>) => ({
    id: b.id as string,
    slug: b.slug as string,
    name: b.name as string,
    city: b.city as string,
    county: b.county as string | null,
    county_slug: b.county_slug as string | null,
    rating: b.rating as number | null,
    review_count: b.review_count as number | null,
    is_featured: b.is_featured as boolean,
    dep_licensed: b.dep_licensed as boolean,
    emergency_24_7: b.emergency_24_7 as boolean,
    manifest_provided: b.manifest_provided as boolean,
    insured: b.insured as boolean,
    services: bizServices.get(b.id as string)?.names || [],
    service_slugs: bizServices.get(b.id as string)?.slugs || [],
    verified: isVerified({
      website_status: b.website_status as string | null,
      phone: b.phone as string | null,
      review_count: b.review_count as number | null,
      place_id: b.place_id as string | null,
      rating: b.rating as number | null,
    }),
  }));

  const seoContent = SERVICE_SEO[slug] || '';
  const faqs = SERVICE_FAQS[slug] || [
    { q: `What does ${service.name.toLowerCase()} involve?`, a: service.description || `${service.name} is a professional service for commercial grease trap systems in Florida.` },
    { q: `How often do Florida businesses need ${service.name.toLowerCase()}?`, a: `Frequency depends on your establishment's volume and local requirements. Contact providers below for recommendations specific to your situation.` },
    { q: `How much does ${service.name.toLowerCase()} cost in Florida?`, a: `Pricing varies by provider, scope, and location. Request quotes from multiple companies in our directory to compare rates.` },
    { q: `Do I need a DEP-licensed company for ${service.name.toLowerCase()}?`, a: `Any service that involves removing grease waste requires a DEP-licensed hauler under Florida Chapter 62-705. Verify your provider's licensing before scheduling service.` },
  ];

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: `${service.name} Companies in Florida`,
      numberOfItems: businesses.length,
      itemListElement: businesses.slice(0, 50).map((b, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `https://greasetrapflorida.com/companies/${b.slug}`,
        name: b.name,
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://greasetrapflorida.com' },
        { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://greasetrapflorida.com/services' },
        { '@type': 'ListItem', position: 3, name: service.name },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Dark Hero */}
      <section className="bg-[#1A1A1A] -mt-16 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-1 text-sm">
              <li>
                <a href="/" className="text-gray-400 hover:text-amber-400 transition-colors">Home</a>
              </li>
              <li className="text-gray-600 mx-1">/</li>
              <li>
                <a href="/services" className="text-gray-400 hover:text-amber-400 transition-colors">Services</a>
              </li>
              <li className="text-gray-600 mx-1">/</li>
              <li className="text-gray-300 font-medium">{service.name}</li>
            </ol>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            {service.name} Services in Florida
          </h1>
          <p className="mt-2 text-gray-400">
            {businesses.length} {businesses.length === 1 ? 'provider' : 'providers'} across Florida
          </p>
        </div>
      </section>

      {/* SEO content before listings */}
      {seoContent && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <section className="bg-gray-50 rounded-xl p-6 mb-2">
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              {service.name} in Florida
            </h2>
            <p className="text-gray-600 leading-relaxed">{seoContent}</p>
          </section>
        </div>
      )}

      {/* Directory with locked service filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Suspense fallback={<div className="h-12 bg-gray-100 rounded-xl animate-pulse mb-6" />}>
          <DirectoryShell
            businesses={businesses}
            serviceTypes={(serviceTypes || []).map((s) => ({ slug: s.slug, name: s.name }))}
            counties={(counties || []).map((c) => ({ slug: c.slug, name: c.name }))}
            cities={(cities || []).map((c) => ({ slug: c.slug, name: c.name, county_slug: c.county_slug, business_count: c.business_count }))}
            lockedServices={[slug]}
          />
        </Suspense>
      </div>

      {/* FAQ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions — {service.name}
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="bg-white rounded-xl border border-gray-100 p-5 group"
              >
                <summary className="font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                  {faq.q}
                  <ChevronRight className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-90 shrink-0 ml-2" />
                </summary>
                <p className="mt-3 text-gray-600 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium"
        >
          &larr; All Services
        </Link>
      </div>
    </>
  );
}

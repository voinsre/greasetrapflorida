import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { createStaticClient } from '@/lib/supabase/static';
import { isVerified } from '@/components/directory/VerifiedBadge';
import DirectoryShell from '@/components/directory/DirectoryShell';
import { MapPin, ChevronRight } from 'lucide-react';

export async function generateStaticParams() {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from('counties')
    .select('slug')
    .gt('business_count', 0);
  return (data || []).map((c) => ({ slug: c.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createStaticClient();
  const { data: county } = await supabase
    .from('counties')
    .select('name')
    .eq('slug', slug)
    .single();
  if (!county) return {};
  const title = `Grease Trap Cleaning in ${county.name}, FL`;
  return {
    title: { absolute: title },
    description: `Find licensed grease trap cleaning companies in ${county.name} County, Florida. Compare ratings, services, and get free quotes from verified providers.`,
    openGraph: {
      title,
      description: `Licensed grease trap companies in ${county.name} County, FL.`,
      url: `https://greasetrapflorida.com/county/${slug}`,
      siteName: 'Grease Trap Florida',
      type: 'website',
    },
  };
}

// 6 rotating content templates selected by hash
const COUNTY_TEMPLATES = [
  (name: string, bizCount: number, cityCount: number) =>
    `${name} County is home to ${bizCount} grease trap service providers serving ${cityCount} cities. Florida's Chapter 62-705 regulation requires all food service establishments in ${name} County to use DEP-licensed haulers for grease waste removal. Most establishments need pump-outs every 30 to 90 days depending on trap size and volume. Browse our verified directory below to find a compliant provider near you and request a free quote.`,
  (name: string, bizCount: number, cityCount: number) =>
    `Looking for grease trap cleaning in ${name} County? Our directory lists ${bizCount} licensed service companies across ${cityCount} cities. Under Chapter 62-705 F.A.C., all grease waste must be transported by licensed haulers with proper manifests. Whether you run a restaurant, hotel kitchen, or food truck, finding a reliable local provider is essential for staying compliant and avoiding fines.`,
  (name: string, bizCount: number, cityCount: number) =>
    `${name} County restaurants and food service operators have ${bizCount} grease trap companies to choose from. With ${cityCount} cities in the service area, competition keeps pricing fair and service quality high. Florida DEP requires documented grease waste manifests for every pump-out — our directory helps you find providers who handle compliance paperwork so you can focus on running your business.`,
  (name: string, bizCount: number, cityCount: number) =>
    `Grease trap maintenance is mandatory for food service businesses in ${name} County. With ${bizCount} service providers covering ${cityCount} cities, finding the right company comes down to reliability, licensing, and price. Chapter 62-705 sets strict requirements for grease waste removal — use our directory to compare verified companies that meet all DEP standards.`,
  (name: string, bizCount: number, cityCount: number) =>
    `From routine pump-outs to emergency overflow response, ${name} County's ${bizCount} grease trap service companies cover all aspects of FOG management. Serving ${cityCount} cities across the county, these providers handle everything from cleaning and inspection to full installation. Compare ratings, check verification status, and request quotes from licensed providers below.`,
  (name: string, bizCount: number, cityCount: number) =>
    `Food service establishments in ${name} County must comply with Florida's grease waste regulations under Chapter 62-705. Our directory features ${bizCount} licensed providers operating across ${cityCount} cities in the county. Regular grease trap cleaning — typically every 30 to 90 days — prevents costly backups and keeps your facility inspection-ready. Browse providers below to find the best fit for your business.`,
];

function hashString(s: string): number {
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = (hash << 5) - hash + s.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export default async function CountyPage({ params }: Props) {
  const { slug } = await params;
  const supabase = createStaticClient();

  const { data: county } = await supabase
    .from('counties')
    .select('*')
    .eq('slug', slug)
    .single();
  if (!county) notFound();

  // Fetch businesses in this county (paginated)
  const PAGE_SIZE = 1000;
  let allBusinesses: Record<string, unknown>[] = [];
  let from = 0;
  let hasMore = true;
  while (hasMore) {
    const { data } = await supabase
      .from('businesses')
      .select('id, slug, name, city, county, county_slug, rating, review_count, is_featured, dep_licensed, emergency_24_7, manifest_provided, insured, website_status, phone, place_id')
      .eq('county_slug', slug)
      .order('is_featured', { ascending: false })
      .order('rating', { ascending: false, nullsFirst: false })
      .range(from, from + PAGE_SIZE - 1);
    allBusinesses = [...allBusinesses, ...(data || [])];
    hasMore = (data?.length || 0) === PAGE_SIZE;
    from += PAGE_SIZE;
  }

  // Fetch service junctions for these businesses
  const bizIds = allBusinesses.map((b) => b.id as string);
  let allServiceJunctions: { business_id: string; service_id: string }[] = [];
  // Batch in 100-ID chunks (gotcha #13)
  for (let i = 0; i < bizIds.length; i += 100) {
    const chunk = bizIds.slice(i, i + 100);
    const { data } = await supabase
      .from('business_services')
      .select('business_id, service_id')
      .in('business_id', chunk);
    allServiceJunctions = [...allServiceJunctions, ...(data || [])];
  }

  // Fetch service types
  const { data: serviceTypes } = await supabase
    .from('service_types')
    .select('id, slug, name')
    .order('name');

  // Fetch cities in this county
  const { data: citiesInCounty } = await supabase
    .from('cities')
    .select('slug, name, county_slug, business_count')
    .eq('county_slug', slug)
    .gt('business_count', 1)
    .order('name');

  // Check for compliance page
  const { data: compliancePage } = await supabase
    .from('content_pages')
    .select('title, content, slug')
    .eq('category', 'compliance')
    .like('slug', `${slug}%`)
    .limit(1)
    .maybeSingle();

  // Nearby counties (4 alphabetically adjacent)
  const { data: allCounties } = await supabase
    .from('counties')
    .select('slug, name, business_count')
    .gt('business_count', 0)
    .order('name');

  const countyIndex = (allCounties || []).findIndex((c) => c.slug === slug);
  const nearby: typeof allCounties = [];
  const pool = allCounties || [];
  for (let offset = 1; nearby.length < 4 && offset < pool.length; offset++) {
    const before = pool[countyIndex - offset];
    const after = pool[countyIndex + offset];
    if (before) nearby.push(before);
    if (after && nearby.length < 4) nearby.push(after);
  }

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

  const cityCount = (citiesInCounty || []).length;
  const templateIndex = hashString(slug) % COUNTY_TEMPLATES.length;
  const templateContent = COUNTY_TEMPLATES[templateIndex](county.name, businesses.length, cityCount);

  // FAQ
  const faqs = [
    {
      q: `How many grease trap companies serve ${county.name} County?`,
      a: `There are currently ${businesses.length} grease trap service companies listed in our ${county.name} County directory. These providers offer cleaning, pumping, installation, and emergency services across ${cityCount} cities in the county.`,
    },
    {
      q: `What are the FOG requirements in ${county.name} County?`,
      a: `${county.name} County food service establishments must comply with Florida Chapter 62-705 F.A.C. for grease waste removal. All grease waste must be transported by DEP-licensed haulers, and manifests are required for every pump-out. Some municipalities may have additional local ordinances.`,
    },
    {
      q: `How often should grease traps be cleaned in ${county.name} County?`,
      a: `Most grease traps in ${county.name} County should be cleaned every 30 to 90 days, depending on trap size, establishment volume, and any local requirements. High-volume restaurants may need monthly service, while smaller operations can often go 60-90 days between pump-outs.`,
    },
    {
      q: `How do I find an emergency grease trap service in ${county.name} County?`,
      a: `Use the "24/7 Emergency" filter on our ${county.name} County directory to find providers that offer emergency overflow and after-hours service. Many companies provide same-day response for grease trap emergencies.`,
    },
    {
      q: `Is DEP licensing required for grease haulers in ${county.name} County?`,
      a: `Yes. Under Chapter 62-705, all grease waste haulers operating in ${county.name} County and throughout Florida must hold a valid DEP license. Using an unlicensed hauler can result in fines of $100 to $5,000 per violation.`,
    },
  ];

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: `Grease Trap Companies in ${county.name} County, FL`,
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
        { '@type': 'ListItem', position: 2, name: 'Counties', item: 'https://greasetrapflorida.com/county' },
        { '@type': 'ListItem', position: 3, name: `${county.name} County` },
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
                <a href="/county" className="text-gray-400 hover:text-amber-400 transition-colors">Counties</a>
              </li>
              <li className="text-gray-600 mx-1">/</li>
              <li className="text-gray-300 font-medium">{county.name} County</li>
            </ol>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Grease Trap Cleaning in {county.name} County, FL
          </h1>
          <p className="mt-3 text-gray-300">
            {businesses.length} Companies &bull; {cityCount} Cities
          </p>
        </div>
      </section>

      {/* Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Suspense fallback={<div className="h-12 bg-gray-100 rounded-xl animate-pulse mb-6" />}>
          <DirectoryShell
            businesses={businesses}
            serviceTypes={(serviceTypes || []).map((s) => ({ slug: s.slug, name: s.name }))}
            counties={[]}
            cities={(citiesInCounty || []).map((c) => ({ slug: c.slug, name: c.name, county_slug: c.county_slug, business_count: c.business_count }))}
          />
        </Suspense>
      </div>

      {/* County Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        {compliancePage ? (
          <section className="bg-white rounded-xl border border-gray-100 p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              {county.name} County Compliance Requirements
            </h2>
            <div
              className="prose prose-gray max-w-none text-gray-600"
              dangerouslySetInnerHTML={{ __html: compliancePage.content || '' }}
            />
            <Link
              href={`/compliance/${compliancePage.slug}`}
              className="inline-flex items-center gap-1 text-amber-600 hover:text-amber-700 font-medium mt-4 text-sm"
            >
              Read full compliance guide <ChevronRight className="w-4 h-4" />
            </Link>
          </section>
        ) : (
          <section className="bg-gray-50 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Grease Trap Services in {county.name} County
            </h2>
            <p className="text-gray-600 leading-relaxed">{templateContent}</p>
          </section>
        )}

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions — {county.name} County
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

        {/* Cities in this county */}
        {(citiesInCounty || []).length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Cities in {county.name} County
            </h2>
            <div className="flex flex-wrap gap-3">
              {(citiesInCounty || []).map((city) => (
                <Link
                  key={city.slug}
                  href={`/city/${city.slug}`}
                  className="inline-flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 hover:border-amber-300 hover:text-amber-700 transition-colors"
                >
                  <MapPin className="w-3 h-3" />
                  {city.name}
                  <span className="text-xs text-gray-400">({city.business_count})</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Related counties */}
        {nearby.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Nearby Counties</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {nearby.map((c) => (
                <Link
                  key={c.slug}
                  href={`/county/${c.slug}`}
                  className="block bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-amber-200 transition-all p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{c.name} County</span>
                    <span className="text-xs text-gray-400">{c.business_count}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}

import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { createStaticClient } from '@/lib/supabase/static';
import { isVerified } from '@/components/directory/VerifiedBadge';
import DirectoryShell from '@/components/directory/DirectoryShell';
import ListingCard from '@/components/directory/ListingCard';
import Stars from '@/components/directory/Stars';
import { MapPin, ChevronRight, Star } from 'lucide-react';

export async function generateStaticParams() {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from('cities')
    .select('slug')
    .gt('business_count', 1);
  return (data || []).map((c) => ({ slug: c.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createStaticClient();
  const { data: city } = await supabase
    .from('cities')
    .select('name')
    .eq('slug', slug)
    .single();
  if (!city) return {};
  const title = `Grease Trap Cleaning ${city.name}, Florida`;
  return {
    title: { absolute: title },
    description: `Find licensed grease trap cleaning companies in ${city.name}, Florida. Compare ratings, services, and request free quotes from verified local providers.`,
    openGraph: {
      title,
      description: `Licensed grease trap companies in ${city.name}, Florida.`,
      url: `https://greasetrapflorida.com/city/${slug}`,
      siteName: 'Grease Trap Florida',
      type: 'website',
    },
  };
}

const CITY_TEMPLATES = [
  (city: string, county: string, count: number) =>
    `${city} is a key market for grease trap services in ${county} County, with ${count} licensed providers competing for your business. Whether you operate a restaurant, hotel kitchen, or catering facility, regular grease trap cleaning is required under Florida Chapter 62-705. Most ${city} establishments schedule pump-outs every 30 to 90 days. Compare providers below to find the best combination of price, reliability, and compliance expertise.`,
  (city: string, county: string, count: number) =>
    `Need grease trap cleaning in ${city}? Our directory features ${count} service companies ready to help. Located in ${county} County, ${city} businesses must follow both state Chapter 62-705 regulations and any local FOG ordinances. Finding a reliable, DEP-licensed hauler ensures your grease waste manifests are properly documented and your establishment stays inspection-ready.`,
  (city: string, county: string, count: number) =>
    `${city}, Florida has ${count} grease trap service providers listed in our directory. As part of ${county} County, local food service operators must use DEP-licensed haulers for all grease waste removal. From routine cleaning to emergency overflow response, the companies below serve restaurants, hotels, schools, and commercial kitchens throughout the ${city} area.`,
  (city: string, county: string, count: number) =>
    `Searching for grease trap services in ${city}? With ${count} providers operating in the area, ${county} County offers solid coverage for food service businesses. Under Chapter 62-705, every pump-out requires a signed manifest from a licensed hauler. Use our directory to compare verified companies, check ratings, and request free quotes from trusted ${city} providers.`,
  (city: string, county: string, count: number) =>
    `Food service establishments in ${city} rely on professional grease trap maintenance to stay compliant and avoid costly plumbing emergencies. With ${count} service companies covering the ${county} County area, finding the right provider means comparing licensing, response times, and customer reviews. Our directory makes it easy to identify the best fit for your business.`,
  (city: string, county: string, count: number) =>
    `${city} restaurants and commercial kitchens need regular grease trap cleaning to comply with Florida DEP regulations. Our directory lists ${count} providers in the ${county} County area, from full-service pumping companies to specialists in FOG compliance consulting. Compare services, verify licensing, and get quotes from the companies below.`,
];

function hashString(s: string): number {
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = (hash << 5) - hash + s.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export default async function CityPage({ params }: Props) {
  const { slug } = await params;
  const supabase = createStaticClient();

  const { data: city } = await supabase
    .from('cities')
    .select('*')
    .eq('slug', slug)
    .single();
  if (!city) notFound();

  // Fetch businesses matching this city name
  const PAGE_SIZE = 1000;
  let allBusinesses: Record<string, unknown>[] = [];
  let from = 0;
  let hasMore = true;
  while (hasMore) {
    const { data } = await supabase
      .from('businesses')
      .select('id, slug, name, city, county, county_slug, rating, review_count, is_featured, dep_licensed, emergency_24_7, manifest_provided, insured, website_status, phone, place_id')
      .eq('county_slug', city.county_slug)
      .ilike('city', city.name)
      .order('is_featured', { ascending: false })
      .order('rating', { ascending: false, nullsFirst: false })
      .range(from, from + PAGE_SIZE - 1);
    allBusinesses = [...allBusinesses, ...(data || [])];
    hasMore = (data?.length || 0) === PAGE_SIZE;
    from += PAGE_SIZE;
  }

  // Service junctions
  const bizIds = allBusinesses.map((b) => b.id as string);
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

  // Sibling cities
  const { data: siblingCities } = await supabase
    .from('cities')
    .select('slug, name, business_count')
    .eq('county_slug', city.county_slug)
    .gt('business_count', 1)
    .neq('slug', slug)
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

  // Top rated (3+ businesses with rating >= 4.0)
  const topRated = businesses
    .filter((b) => (b.rating ?? 0) >= 4.0)
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 3);
  const showTopRated = topRated.length >= 3;

  const templateIndex = hashString(slug) % CITY_TEMPLATES.length;
  const templateContent = CITY_TEMPLATES[templateIndex](
    city.name,
    city.county_name || '',
    businesses.length
  );

  const faqs = [
    {
      q: `How many grease trap companies are in ${city.name}?`,
      a: `There are ${businesses.length} grease trap service companies listed in our ${city.name} directory. These providers offer cleaning, pumping, installation, and emergency services for restaurants and food service establishments.`,
    },
    {
      q: `What is the average cost of grease trap cleaning in ${city.name}?`,
      a: `Grease trap cleaning in ${city.name} typically costs $200 to $500 per pump-out, depending on trap size, grease volume, and accessibility. Annual contracts with regular service can reduce per-visit costs. Request quotes from multiple providers to compare pricing.`,
    },
    {
      q: `Do I need a DEP-licensed hauler in ${city.name}?`,
      a: `Yes. Under Florida Chapter 62-705, all grease waste in ${city.name} and throughout Florida must be removed by DEP-licensed haulers. Using an unlicensed hauler can result in fines from $100 to $5,000 per violation.`,
    },
    {
      q: `How do I get emergency grease trap service in ${city.name}?`,
      a: `Several grease trap companies in ${city.name} offer 24/7 emergency overflow service. Use the "24/7 Emergency" filter in our directory to find providers with same-day or after-hours availability.`,
    },
  ];

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: `Grease Trap Companies in ${city.name}, Florida`,
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
        { '@type': 'ListItem', position: 3, name: `${city.county_name} County`, item: `https://greasetrapflorida.com/county/${city.county_slug}` },
        { '@type': 'ListItem', position: 4, name: city.name },
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
              <li>
                <a href={`/county/${city.county_slug}`} className="text-gray-400 hover:text-amber-400 transition-colors">
                  {city.county_name} County
                </a>
              </li>
              <li className="text-gray-600 mx-1">/</li>
              <li className="text-gray-300 font-medium">{city.name}</li>
            </ol>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Grease Trap Cleaning in {city.name}, Florida
          </h1>
          <p className="mt-3 text-gray-300">
            {businesses.length} Companies in {city.name} &bull; {city.county_name} County
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
            cities={[]}
          />
        </Suspense>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        {/* City Content */}
        <section className="bg-gray-50 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            Grease Trap Services in {city.name}
          </h2>
          <p className="text-gray-600 leading-relaxed">{templateContent}</p>
        </section>

        {/* Top Rated */}
        {showTopRated && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Star className="w-6 h-6 text-amber-500" />
              Top Rated in {city.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {topRated.map((biz) => (
                <ListingCard key={biz.id} business={biz} />
              ))}
            </div>
          </section>
        )}

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions — {city.name}
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

        {/* Sibling cities */}
        {(siblingCities || []).length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Other Cities in {city.county_name} County
            </h2>
            <div className="flex flex-wrap gap-3">
              {(siblingCities || []).map((c) => (
                <Link
                  key={c.slug}
                  href={`/city/${c.slug}`}
                  className="inline-flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 hover:border-amber-300 hover:text-amber-700 transition-colors"
                >
                  <MapPin className="w-3 h-3" />
                  {c.name}
                  <span className="text-xs text-gray-400">({c.business_count})</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Back to county */}
        <div>
          <Link
            href={`/county/${city.county_slug}`}
            className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium"
          >
            &larr; Back to {city.county_name} County
          </Link>
        </div>
      </div>
    </>
  );
}

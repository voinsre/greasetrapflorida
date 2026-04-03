import { Suspense } from 'react';
import type { Metadata } from 'next';
import { createStaticClient } from '@/lib/supabase/static';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import DirectoryShell from '@/components/directory/DirectoryShell';
import { isVerified } from '@/components/directory/VerifiedBadge';

export const metadata: Metadata = {
  title: { absolute: 'Grease Trap Companies in Florida' },
  description:
    'Browse grease trap service companies across Florida. Compare ratings, services, and DEP licensing. Get free quotes from verified providers.',
  openGraph: {
    title: 'Grease Trap Companies in Florida',
    description:
      'Browse grease trap service companies across Florida. Compare ratings, services, and DEP licensing.',
    url: 'https://greasetrapflorida.com/companies',
    siteName: 'Grease Trap Florida',
    images: [{ url: '/images/og-image.webp', width: 1200, height: 630 }],
    type: 'website',
  },
  alternates: {
    canonical: 'https://greasetrapflorida.com/companies',
  },
};

export default async function CompaniesPage() {
  const supabase = createStaticClient();

  // Fetch all businesses with their services (paginated)
  const PAGE_SIZE = 1000;
  let allBusinesses: Record<string, unknown>[] = [];
  let from = 0;
  let hasMore = true;

  while (hasMore) {
    const { data } = await supabase
      .from('businesses')
      .select('id, slug, name, city, county, county_slug, rating, review_count, is_featured, dep_licensed, emergency_24_7, manifest_provided, insured, website_status, phone, place_id, is_verified')
      .order('is_featured', { ascending: false })
      .order('rating', { ascending: false, nullsFirst: false })
      .range(from, from + PAGE_SIZE - 1);

    allBusinesses = [...allBusinesses, ...(data || [])];
    hasMore = (data?.length || 0) === PAGE_SIZE;
    from += PAGE_SIZE;
  }

  // Fetch service junctions
  let allServiceJunctions: { business_id: string; service_id: string }[] = [];
  from = 0;
  hasMore = true;
  while (hasMore) {
    const { data } = await supabase
      .from('business_services')
      .select('business_id, service_id')
      .range(from, from + PAGE_SIZE - 1);
    allServiceJunctions = [...allServiceJunctions, ...(data || [])];
    hasMore = (data?.length || 0) === PAGE_SIZE;
    from += PAGE_SIZE;
  }

  // Fetch service types
  const { data: serviceTypes } = await supabase
    .from('service_types')
    .select('id, slug, name')
    .order('name');

  // Fetch counties with businesses (2+ for county pages)
  const { data: counties } = await supabase
    .from('counties')
    .select('slug, name')
    .gt('business_count', 1)
    .order('name');

  // Fetch cities with county_slug for cascading filter
  const { data: cities } = await supabase
    .from('cities')
    .select('slug, name, county_slug, business_count')
    .gt('business_count', 0)
    .order('name');

  // Build service map: serviceId -> slug
  const serviceIdToSlug = new Map<string, string>();
  const serviceIdToName = new Map<string, string>();
  for (const st of serviceTypes || []) {
    serviceIdToSlug.set(st.id, st.slug);
    serviceIdToName.set(st.id, st.name);
  }

  // Build business -> services map
  const bizServices = new Map<string, { slugs: string[]; names: string[] }>();
  for (const j of allServiceJunctions) {
    if (!bizServices.has(j.business_id)) {
      bizServices.set(j.business_id, { slugs: [], names: [] });
    }
    const entry = bizServices.get(j.business_id)!;
    const slug = serviceIdToSlug.get(j.service_id);
    const name = serviceIdToName.get(j.service_id);
    if (slug) entry.slugs.push(slug);
    if (name) entry.names.push(name);
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
      is_verified: b.is_verified as boolean | null,
      website_status: b.website_status as string | null,
      phone: b.phone as string | null,
      review_count: b.review_count as number | null,
      place_id: b.place_id as string | null,
      rating: b.rating as number | null,
    }),
  }));

  const totalCount = businesses.length;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Grease Trap Companies in Florida',
    numberOfItems: totalCount,
    itemListElement: businesses.slice(0, 50).map((b, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://greasetrapflorida.com/companies/${b.slug}`,
      name: b.name,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Dark Hero Section */}
      <section className="bg-[#1A1A1A] -mt-16 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="max-w-3xl">
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center gap-1 text-sm">
                <li>
                  <a href="/" className="text-gray-400 hover:text-amber-400 transition-colors">Home</a>
                </li>
                <li className="text-gray-600 mx-1">/</li>
                <li className="text-gray-300 font-medium">Companies</li>
              </ol>
            </nav>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Grease Trap Service Companies in Florida
            </h1>
            <p className="mt-4 text-lg text-gray-300 leading-relaxed">
              Browse {totalCount.toLocaleString()} licensed grease trap cleaning and pumping companies across Florida. Compare services, check verification status, read reviews, and request free quotes from verified providers in all {(counties || []).length} Florida counties. Our directory helps restaurant owners, hotel operators, and food service managers find compliant grease trap services under Chapter 62-705.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Suspense fallback={<div className="h-12 bg-gray-100 rounded-xl animate-pulse mb-6" />}>
          <DirectoryShell
            businesses={businesses}
            serviceTypes={(serviceTypes || []).map((s) => ({ slug: s.slug, name: s.name }))}
            counties={(counties || []).map((c) => ({ slug: c.slug, name: c.name }))}
            cities={(cities || []).map((c) => ({ slug: c.slug, name: c.name, county_slug: c.county_slug, business_count: c.business_count }))}
          />
        </Suspense>
      </div>
    </>
  );
}

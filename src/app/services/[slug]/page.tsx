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

  // Sort: featured first, then by rating
  allBusinesses.sort((a, b) => {
    if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1;
    return ((b.rating as number) || 0) - ((a.rating as number) || 0);
  });

  // Get all service junctions for these businesses (to build service names)
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

  const faqs = [
    {
      q: `How many companies offer ${service.name.toLowerCase()} in Florida?`,
      a: `There are ${businesses.length} companies in our directory that offer ${service.name.toLowerCase()} across Florida. Browse the listings below to compare ratings, verify licensing, and request free quotes.`,
    },
    {
      q: `What does ${service.name.toLowerCase()} involve?`,
      a: service.description || `${service.name} is a professional service for commercial grease trap systems in Florida. Contact providers below for specific details about scope, pricing, and scheduling.`,
    },
    {
      q: `How do I choose a ${service.name.toLowerCase()} provider in Florida?`,
      a: `Look for DEP-licensed providers with verified reviews and experience in ${service.name.toLowerCase()}. Check their rating, ask about compliance documentation, and request quotes from multiple companies to compare pricing and service terms.`,
    },
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
          {service.description && (
            <p className="mt-4 text-lg text-gray-300 leading-relaxed max-w-3xl">
              {service.description}
            </p>
          )}
          <p className="mt-2 text-gray-400">
            {businesses.length} {businesses.length === 1 ? 'provider' : 'providers'} across Florida
          </p>
        </div>
      </section>

      {/* Directory */}
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

        {/* Link back */}
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

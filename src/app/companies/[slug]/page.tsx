import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { createStaticClient } from '@/lib/supabase/static';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import Stars from '@/components/directory/Stars';
import TrustBadges from '@/components/directory/TrustBadges';
import ListingCard from '@/components/directory/ListingCard';
import LeadForm from '@/components/forms/LeadForm';
import MobileQuoteCTA from './MobileQuoteCTA';
import {
  MapPin,
  Phone,
  Globe,
  Mail,
  ExternalLink,
  CheckCircle,
  Clock,
  Building,
} from 'lucide-react';

export async function generateStaticParams() {
  const supabase = createStaticClient();
  const PAGE_SIZE = 1000;
  let allSlugs: { slug: string }[] = [];
  let from = 0;
  let hasMore = true;

  while (hasMore) {
    const { data } = await supabase
      .from('businesses')
      .select('slug')
      .range(from, from + PAGE_SIZE - 1);
    allSlugs = [...allSlugs, ...(data || [])];
    hasMore = (data?.length || 0) === PAGE_SIZE;
    from += PAGE_SIZE;
  }

  return allSlugs.map((b) => ({ slug: b.slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

async function getBusiness(slug: string) {
  const supabase = createStaticClient();

  const { data: business } = await supabase
    .from('businesses')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!business) return null;

  // Get services
  const { data: serviceJunctions } = await supabase
    .from('business_services')
    .select('service_id')
    .eq('business_id', business.id);

  let services: { name: string; slug: string }[] = [];
  if (serviceJunctions?.length) {
    const serviceIds = serviceJunctions.map((j: { service_id: string }) => j.service_id);
    const { data: serviceData } = await supabase
      .from('service_types')
      .select('name, slug')
      .in('id', serviceIds);
    services = serviceData || [];
  }

  // Get nearby businesses in same county
  const { data: nearby } = await supabase
    .from('businesses')
    .select('id, slug, name, city, county, rating, review_count, is_featured, dep_licensed, emergency_24_7, manifest_provided, insured, years_in_business')
    .eq('county_slug', business.county_slug)
    .neq('id', business.id)
    .order('rating', { ascending: false, nullsFirst: false })
    .limit(4);

  return { business, services, nearby: nearby || [] };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const result = await getBusiness(slug);
  if (!result) return { title: { absolute: 'Company Not Found' } };

  const { business } = result;
  let title = `${business.name} - Grease Trap Service ${business.city}, FL`;
  if (title.length > 60) {
    title = `${business.name.slice(0, 35)}... - ${business.city}, FL`;
  }

  return {
    title: { absolute: title },
    description: `${business.name} provides grease trap services in ${business.city}, ${business.county || 'Florida'}. ${business.rating ? `Rated ${Number(business.rating).toFixed(1)} stars.` : ''} Get a free quote today.`.slice(0, 160),
    openGraph: {
      title,
      description: `Grease trap services by ${business.name} in ${business.city}, FL.`,
      url: `https://greasetrapflorida.com/companies/${slug}`,
      siteName: 'Grease Trap Florida',
      type: 'website',
    },
  };
}

function formatHours(hours: unknown): [string, string][] | null {
  if (!hours) return null;

  // Handle array of {day, hours} objects (Google Maps format)
  if (Array.isArray(hours)) {
    const entries = hours
      .filter((h) => h && typeof h === 'object' && 'day' in h && 'hours' in h)
      .map((h) => [String(h.day), String(h.hours)] as [string, string]);
    return entries.length ? entries : null;
  }

  // Handle plain key-value object
  if (typeof hours === 'object') {
    const entries = Object.entries(hours as Record<string, string>);
    return entries.length ? entries : null;
  }

  return null;
}

export default async function CompanyPage({ params }: Props) {
  const { slug } = await params;
  const result = await getBusiness(slug);
  if (!result) notFound();

  const { business, services, nearby } = result;
  const hours = formatHours(business.opening_hours);

  // JSON-LD: LocalBusiness + BreadcrumbList + FAQPage
  const faqs = [
    {
      q: `What services does ${business.name} offer?`,
      a: services.length
        ? `${business.name} offers ${services.map((s) => s.name).join(', ')} in ${business.city}, Florida.`
        : `${business.name} provides grease trap cleaning and related services in ${business.city}, Florida. Contact them for a full list of services.`,
    },
    {
      q: `Does ${business.name} serve ${business.county || 'my area'}?`,
      a: `Yes, ${business.name} serves ${business.city} and surrounding areas in ${business.county ? `${business.county} County` : 'Florida'}. Contact them to confirm service availability in your specific location.`,
    },
    {
      q: `Is ${business.name} DEP licensed?`,
      a: business.dep_licensed
        ? `Yes, ${business.name} is licensed by the Florida Department of Environmental Protection (DEP) for grease waste removal.`
        : `${business.name}'s DEP licensing status has not been verified. Contact them directly to confirm their licensing status under Chapter 62-705 F.A.C.`,
    },
    {
      q: `How do I get a quote from ${business.name}?`,
      a: `You can request a free quote from ${business.name} by filling out the contact form on this page${business.phone ? ` or calling ${business.phone}` : ''}. They typically respond within 24 hours.`,
    },
  ];

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: business.name,
      ...(business.address ? { address: { '@type': 'PostalAddress', streetAddress: business.address, addressLocality: business.city, addressRegion: 'FL', addressCountry: 'US' } } : {}),
      ...(business.phone ? { telephone: business.phone } : {}),
      ...(business.website ? { url: business.website } : {}),
      ...(business.rating && business.review_count
        ? {
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: Number(business.rating),
              reviewCount: Number(business.review_count),
            },
          }
        : {}),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://greasetrapflorida.com/' },
        { '@type': 'ListItem', position: 2, name: 'Companies', item: 'https://greasetrapflorida.com/companies' },
        { '@type': 'ListItem', position: 3, name: business.name },
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

  // Build nearby listings for cards
  const nearbyListings = nearby.map((n: Record<string, unknown>) => ({
    id: n.id as string,
    slug: n.slug as string,
    name: n.name as string,
    city: n.city as string,
    county: n.county as string | null,
    rating: n.rating as number | null,
    review_count: n.review_count as number | null,
    is_featured: n.is_featured as boolean,
    dep_licensed: n.dep_licensed as boolean,
    emergency_24_7: n.emergency_24_7 as boolean,
    manifest_provided: n.manifest_provided as boolean,
    insured: n.insured as boolean,
    years_in_business: n.years_in_business as number | null,
    services: [] as string[],
  }));

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Breadcrumbs
          items={[
            { label: 'Companies', href: '/companies' },
            { label: business.name },
          ]}
        />

        <div className="lg:grid lg:grid-cols-3 lg:gap-8 mt-2">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {business.name}
              </h1>
              <div className="flex items-center gap-1.5 text-gray-500 mb-3">
                <MapPin className="w-4 h-4" />
                <span>
                  {business.city}
                  {business.county ? `, ${business.county} County` : ''}, FL
                </span>
              </div>
              <Stars
                rating={business.rating}
                reviewCount={business.review_count}
              />
              <div className="mt-3">
                <TrustBadges
                  depLicensed={business.dep_licensed}
                  emergency24_7={business.emergency_24_7}
                  manifestProvided={business.manifest_provided}
                  insured={business.insured}
                  yearsInBusiness={business.years_in_business}
                />
              </div>
            </div>

            {/* Description */}
            {business.description && (
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  About {business.name}
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {business.description}
                </p>
              </section>
            )}

            {/* Services */}
            {services.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  Services Offered
                </h2>
                <ul className="grid sm:grid-cols-2 gap-2">
                  {services.map((s) => (
                    <li key={s.slug} className="flex items-center gap-2 text-gray-700">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <Link
                        href={`/services/${s.slug}`}
                        className="hover:text-amber-600 transition-colors"
                      >
                        {s.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Business Details Card */}
            <section className="bg-gray-50 rounded-xl p-6 space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                Business Details
              </h2>

              {business.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <a
                    href={`tel:${business.phone_unformatted || business.phone}`}
                    className="text-amber-600 hover:text-amber-700 font-medium"
                  >
                    {business.phone}
                  </a>
                </div>
              )}

              {business.website && (
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-gray-400" />
                  <a
                    href={business.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-600 hover:text-amber-700 flex items-center gap-1"
                  >
                    Visit Website
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {business.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <a
                    href={`mailto:${business.email}`}
                    className="text-amber-600 hover:text-amber-700"
                  >
                    {business.email}
                  </a>
                </div>
              )}

              {business.address && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">{business.address}</span>
                </div>
              )}

              {hours && (
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="text-sm text-gray-700 space-y-0.5">
                    {hours.map(([day, time]) => (
                      <div key={day} className="flex gap-2">
                        <span className="font-medium w-24">{day}</span>
                        <span>{time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* FAQ */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {faqs.map((f, i) => (
                  <div key={i} className="border-b border-gray-100 pb-4">
                    <h3 className="font-medium text-gray-900 mb-1">{f.q}</h3>
                    <p className="text-gray-600 text-sm">{f.a}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Nearby */}
            {nearbyListings.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  More Companies in {business.county ? `${business.county} County` : business.city}
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {nearbyListings.map((n) => (
                    <ListingCard key={n.id} business={n} />
                  ))}
                </div>
              </section>
            )}

            {/* Claim CTA */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Building className="w-5 h-5 text-gray-500" />
                  <h3 className="font-semibold text-gray-900">
                    Own this business?
                  </h3>
                </div>
                <p className="text-sm text-gray-500">
                  Claim your listing to update information and respond to leads.
                </p>
              </div>
              <Link
                href="/claim-listing"
                className="bg-gray-900 hover:bg-gray-800 text-white font-medium px-5 py-2.5 rounded-lg transition-colors text-sm whitespace-nowrap"
              >
                Claim Your Listing
              </Link>
            </div>
          </div>

          {/* RIGHT COLUMN — Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <LeadForm
                businessId={business.id}
                businessName={business.name}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile CTA */}
      <MobileQuoteCTA
        businessId={business.id}
        businessName={business.name}
      />
    </>
  );
}

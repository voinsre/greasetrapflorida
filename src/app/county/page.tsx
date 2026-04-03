import Link from 'next/link';
import type { Metadata } from 'next';
import { createStaticClient } from '@/lib/supabase/static';
import { MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: { absolute: 'Grease Trap Services by Florida County' },
  description:
    'Find licensed grease trap cleaning companies in all 46 Florida counties. Each county page shows verified local providers, county-specific FOG compliance requirements, and average service details.',
  openGraph: {
    title: 'Grease Trap Services by Florida County',
    description:
      'Find licensed grease trap cleaning companies in all 46 Florida counties with verified local providers.',
    url: 'https://greasetrapflorida.com/county',
    siteName: 'Grease Trap Florida',
    type: 'website',
  },
};

export default async function CountiesPage() {
  const supabase = createStaticClient();

  const { data: counties } = await supabase
    .from('counties')
    .select('slug, name, business_count')
    .gt('business_count', 0)
    .order('name');

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Florida Counties with Grease Trap Services',
      numberOfItems: (counties || []).length,
      itemListElement: (counties || []).map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `https://greasetrapflorida.com/county/${c.slug}`,
        name: `${c.name} County`,
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://greasetrapflorida.com' },
        { '@type': 'ListItem', position: 2, name: 'Counties', item: 'https://greasetrapflorida.com/county' },
      ],
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-1 text-sm">
              <li>
                <a href="/" className="text-gray-400 hover:text-amber-400 transition-colors">Home</a>
              </li>
              <li className="text-gray-600 mx-1">/</li>
              <li className="text-gray-300 font-medium">Counties</li>
            </ol>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Browse Grease Trap Services by Florida County
          </h1>
          <p className="mt-4 text-lg text-gray-300 leading-relaxed max-w-3xl">
            Find licensed grease trap cleaning companies in all {(counties || []).length} Florida
            counties. Each county page shows verified local providers, county-specific FOG
            compliance requirements, and average service details.
          </p>
        </div>
      </section>

      {/* County Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {(counties || []).map((county) => (
            <Link
              key={county.slug}
              href={`/county/${county.slug}`}
              className="block bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-amber-200 transition-all p-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                  <h2 className="font-semibold text-gray-900">{county.name} County</h2>
                </div>
                <span className="inline-flex items-center bg-amber-50 text-amber-700 text-xs font-medium px-2.5 py-1 rounded-full">
                  {county.business_count} {county.business_count === 1 ? 'company' : 'companies'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

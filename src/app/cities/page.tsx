import type { Metadata } from 'next';
import { createStaticClient } from '@/lib/supabase/static';
import CitiesFilter from './CitiesFilter';

export const metadata: Metadata = {
  title: { absolute: 'All Florida Cities - Grease Trap Services' },
  description:
    'Browse all Florida cities with grease trap cleaning companies. Find licensed providers grouped by county across the state.',
  openGraph: {
    title: 'All Florida Cities - Grease Trap Services',
    description: 'Browse all Florida cities with grease trap cleaning companies grouped by county.',
    url: 'https://greasetrapflorida.com/cities',
    siteName: 'Grease Trap Florida',
    type: 'website',
  },
};

export default async function AllCitiesPage() {
  const supabase = createStaticClient();

  const { data: cities } = await supabase
    .from('cities')
    .select('slug, name, county_slug, county_name, business_count')
    .gt('business_count', 1)
    .order('county_name')
    .order('name');

  const { data: counties } = await supabase
    .from('counties')
    .select('slug, name')
    .gt('business_count', 0)
    .order('name');

  const totalCities = (cities || []).length;

  return (
    <>
      {/* Dark Hero */}
      <section className="bg-[#1A1A1A] -mt-16 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-1 text-sm">
              <li>
                <a href="/" className="text-gray-400 hover:text-amber-400 transition-colors">Home</a>
              </li>
              <li className="text-gray-600 mx-1">/</li>
              <li className="text-gray-300 font-medium">Cities</li>
            </ol>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            All Florida Cities with Grease Trap Services
          </h1>
          <p className="mt-4 text-lg text-gray-300 leading-relaxed max-w-3xl">
            Browse {totalCities} Florida cities with licensed grease trap cleaning companies.
            Cities are grouped by county for easy navigation.
          </p>
        </div>
      </section>

      {/* Cities with filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <CitiesFilter
          cities={(cities || []).map((c) => ({
            slug: c.slug,
            name: c.name,
            county_slug: c.county_slug,
            county_name: c.county_name || '',
            business_count: c.business_count,
          }))}
          counties={(counties || []).map((c) => ({ slug: c.slug, name: c.name }))}
        />
      </div>
    </>
  );
}

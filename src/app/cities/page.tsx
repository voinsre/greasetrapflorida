import Link from 'next/link';
import type { Metadata } from 'next';
import { createStaticClient } from '@/lib/supabase/static';

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

  // Group by county
  const grouped = new Map<string, { countyName: string; countySlug: string; cities: typeof cities }>();
  for (const city of cities || []) {
    const key = city.county_slug || 'unknown';
    if (!grouped.has(key)) {
      grouped.set(key, { countyName: city.county_name || key, countySlug: key, cities: [] });
    }
    grouped.get(key)!.cities!.push(city);
  }

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

      {/* Cities grouped by county */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="space-y-10">
          {Array.from(grouped.entries()).map(([key, group]) => (
            <section key={key}>
              <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                <Link
                  href={`/county/${group.countySlug}`}
                  className="hover:text-amber-600 transition-colors"
                >
                  {group.countyName} County
                </Link>
              </h2>
              <div className="flex flex-wrap gap-3">
                {group.cities!.map((city) => (
                  <Link
                    key={city.slug}
                    href={`/city/${city.slug}`}
                    className="inline-flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 hover:border-amber-300 hover:text-amber-700 transition-colors"
                  >
                    {city.name}
                    <span className="text-xs text-gray-400">({city.business_count})</span>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}

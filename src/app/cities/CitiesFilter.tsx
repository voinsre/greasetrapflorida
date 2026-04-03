'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, MapPin } from 'lucide-react';

interface City {
  slug: string;
  name: string;
  county_slug: string;
  county_name: string;
  business_count: number;
}

interface CountyOption {
  slug: string;
  name: string;
}

export default function CitiesFilter({
  cities,
  counties,
}: {
  cities: City[];
  counties: CountyOption[];
}) {
  const [search, setSearch] = useState('');
  const [countyFilter, setCountyFilter] = useState('');

  const filtered = useMemo(() => {
    let result = cities;
    if (countyFilter) {
      result = result.filter((c) => c.county_slug === countyFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((c) => c.name.toLowerCase().includes(q));
    }
    return result;
  }, [cities, countyFilter, search]);

  // Group by county
  const grouped = useMemo(() => {
    const map = new Map<string, { countyName: string; countySlug: string; cities: City[] }>();
    for (const city of filtered) {
      const key = city.county_slug;
      if (!map.has(key)) {
        map.set(key, { countyName: city.county_name, countySlug: key, cities: [] });
      }
      map.get(key)!.cities.push(city);
    }
    return Array.from(map.values());
  }, [filtered]);

  const selectClass =
    'text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-white text-gray-700 focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none';

  return (
    <>
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search cities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`${selectClass} pl-10 w-64`}
          />
        </div>
        <select
          value={countyFilter}
          onChange={(e) => setCountyFilter(e.target.value)}
          className={selectClass}
        >
          <option value="">All Counties</option>
          {counties.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name} County
            </option>
          ))}
        </select>
      </div>

      {grouped.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No cities match your search.</p>
      ) : (
        <div className="space-y-10">
          {grouped.map((group) => (
            <section key={group.countySlug}>
              <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                <Link
                  href={`/county/${group.countySlug}`}
                  className="hover:text-amber-600 transition-colors"
                >
                  {group.countyName} County
                </Link>
              </h2>
              <div className="flex flex-wrap gap-3">
                {group.cities.map((city) => (
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
          ))}
        </div>
      )}
    </>
  );
}

'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { MapPin, Search } from 'lucide-react';

interface County {
  slug: string;
  name: string;
  business_count: number;
}

export default function CountyGrid({ counties }: { counties: County[] }) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return counties;
    const q = search.toLowerCase();
    return counties.filter((c) => c.name.toLowerCase().includes(q));
  }, [counties, search]);

  return (
    <>
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search counties..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white text-gray-700 focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No counties match your search.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((county) => (
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
      )}
    </>
  );
}

'use client';

import { useState, useCallback, useMemo } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';

export interface CityOption {
  slug: string;
  name: string;
  county_slug: string;
  business_count: number;
}

interface FilterBarProps {
  serviceTypes: { slug: string; name: string }[];
  counties: { slug: string; name: string }[];
  cities: CityOption[];
  onFilter: (filters: Filters) => void;
}

export interface Filters {
  service: string;
  county: string;
  city: string;
  emergencyOnly: boolean;
}

const EMPTY_FILTERS: Filters = {
  service: '',
  county: '',
  city: '',
  emergencyOnly: false,
};

export default function FilterBar({
  serviceTypes,
  counties,
  cities,
  onFilter,
}: FilterBarProps) {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);

  const update = useCallback(
    (partial: Partial<Filters>) => {
      const next = { ...filters, ...partial };
      // Clear city when county changes
      if ('county' in partial && partial.county !== filters.county) {
        next.city = '';
      }
      setFilters(next);
      onFilter(next);
    },
    [filters, onFilter]
  );

  const filteredCities = useMemo(() => {
    if (!filters.county) return [];
    return cities.filter((c) => c.county_slug === filters.county);
  }, [cities, filters.county]);

  const hasFilters =
    filters.service || filters.county || filters.city || filters.emergencyOnly;

  const selectClass =
    'text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none';

  return (
    <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl p-4 mb-6 sticky top-[72px] z-30 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mr-1">
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </div>

        <select
          value={filters.county}
          onChange={(e) => update({ county: e.target.value })}
          className={selectClass}
        >
          <option value="">All Counties</option>
          {counties.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>

        {filteredCities.length > 0 && (
          <select
            value={filters.city}
            onChange={(e) => update({ city: e.target.value })}
            className={`${selectClass} animate-in`}
          >
            <option value="">All Cities</option>
            {filteredCities.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name} ({c.business_count})
              </option>
            ))}
          </select>
        )}

        <select
          value={filters.service}
          onChange={(e) => update({ service: e.target.value })}
          className={selectClass}
        >
          <option value="">All Services</option>
          {serviceTypes.map((st) => (
            <option key={st.slug} value={st.slug}>
              {st.name}
            </option>
          ))}
        </select>

        <label className="inline-flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filters.emergencyOnly}
            onChange={(e) => update({ emergencyOnly: e.target.checked })}
            className="rounded border-gray-300 text-amber-500 focus:ring-amber-300"
          />
          24/7 Emergency
        </label>

        {hasFilters && (
          <button
            onClick={() => {
              setFilters(EMPTY_FILTERS);
              onFilter(EMPTY_FILTERS);
            }}
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors ml-auto"
          >
            <X className="w-3.5 h-3.5" />
            Clear all
          </button>
        )}
      </div>
    </div>
  );
}

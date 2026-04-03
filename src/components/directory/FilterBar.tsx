'use client';

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';

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
  lockedServices?: string[];
}

export interface Filters {
  services: string[];
  county: string;
  city: string;
  emergencyOnly: boolean;
}

const EMPTY_FILTERS: Filters = {
  services: [],
  county: '',
  city: '',
  emergencyOnly: false,
};

export default function FilterBar({
  serviceTypes,
  counties,
  cities,
  onFilter,
  lockedServices = [],
}: FilterBarProps) {
  const [filters, setFilters] = useState<Filters>({
    ...EMPTY_FILTERS,
    services: [...lockedServices],
  });
  const [serviceDropdownOpen, setServiceDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServiceDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const update = useCallback(
    (partial: Partial<Filters>) => {
      const next = { ...filters, ...partial };
      if ('county' in partial && partial.county !== filters.county) {
        next.city = '';
      }
      setFilters(next);
      onFilter(next);
    },
    [filters, onFilter]
  );

  const toggleService = useCallback(
    (slug: string) => {
      if (lockedServices.includes(slug)) return;
      const current = filters.services;
      const next = current.includes(slug)
        ? current.filter((s) => s !== slug)
        : [...current, slug];
      update({ services: next });
    },
    [filters.services, lockedServices, update]
  );

  const filteredCities = useMemo(() => {
    if (!filters.county) return [];
    return cities.filter((c) => c.county_slug === filters.county);
  }, [cities, filters.county]);

  const hasFilters =
    filters.services.length > lockedServices.length ||
    filters.county ||
    filters.city ||
    filters.emergencyOnly;

  const clearAll = useCallback(() => {
    const reset = { ...EMPTY_FILTERS, services: [...lockedServices] };
    setFilters(reset);
    onFilter(reset);
  }, [lockedServices, onFilter]);

  const removeFilter = useCallback(
    (type: 'county' | 'city' | 'emergency' | 'service', value?: string) => {
      if (type === 'county') {
        update({ county: '', city: '' });
      } else if (type === 'city') {
        update({ city: '' });
      } else if (type === 'emergency') {
        update({ emergencyOnly: false });
      } else if (type === 'service' && value && !lockedServices.includes(value)) {
        update({ services: filters.services.filter((s) => s !== value) });
      }
    },
    [update, filters.services, lockedServices]
  );

  const selectClass =
    'text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none';

  const selectedServiceCount = filters.services.length;

  // Build active pills
  const pills: { label: string; type: 'county' | 'city' | 'emergency' | 'service'; value?: string; locked?: boolean }[] = [];
  if (filters.county) {
    const countyName = counties.find((c) => c.slug === filters.county)?.name || filters.county;
    pills.push({ label: `County: ${countyName}`, type: 'county' });
  }
  if (filters.city) {
    const cityName = filteredCities.find((c) => c.slug === filters.city)?.name || cities.find((c) => c.slug === filters.city)?.name || filters.city;
    pills.push({ label: `City: ${cityName}`, type: 'city' });
  }
  for (const sSlug of filters.services) {
    const sName = serviceTypes.find((s) => s.slug === sSlug)?.name || sSlug;
    const locked = lockedServices.includes(sSlug);
    pills.push({ label: sName, type: 'service', value: sSlug, locked });
  }
  if (filters.emergencyOnly) {
    pills.push({ label: '24/7 Emergency', type: 'emergency' });
  }

  return (
    <div className="mb-6 space-y-3 sticky top-[72px] z-30">
      {/* Filter controls */}
      <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mr-1">
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </div>

          {counties.length > 0 && (
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
          )}

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

          {/* Service multi-select dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setServiceDropdownOpen((v) => !v)}
              className={`${selectClass} flex items-center gap-2 cursor-pointer`}
            >
              {selectedServiceCount > 0
                ? `Services (${selectedServiceCount})`
                : 'All Services'}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${serviceDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {serviceDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-40 py-2 w-64 max-h-72 overflow-y-auto">
                {serviceTypes.map((st) => {
                  const checked = filters.services.includes(st.slug);
                  const locked = lockedServices.includes(st.slug);
                  return (
                    <label
                      key={st.slug}
                      className={`flex items-center gap-2.5 px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 ${
                        locked ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={locked}
                        onChange={() => toggleService(st.slug)}
                        className={`rounded border-gray-300 focus:ring-amber-300 ${
                          locked
                            ? 'text-gray-400'
                            : 'text-amber-500'
                        }`}
                      />
                      <span className={locked ? 'text-gray-400 line-through' : 'text-gray-700'}>
                        {st.name}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

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
              onClick={clearAll}
              className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors ml-auto"
            >
              <X className="w-3.5 h-3.5" />
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Active filter pills */}
      {pills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {pills.map((pill, i) => (
            <span
              key={`${pill.type}-${pill.value || i}`}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${
                pill.locked
                  ? 'bg-gray-100 text-gray-500'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {pill.label}
              {!pill.locked && (
                <button
                  onClick={() => removeFilter(pill.type, pill.value)}
                  className="hover:text-amber-900 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

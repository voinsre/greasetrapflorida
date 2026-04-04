'use client';

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { SlidersHorizontal, X, ChevronDown, Search } from 'lucide-react';
import { useCompare } from './CompareContext';

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
  search: string;
}

const EMPTY_FILTERS: Filters = {
  services: [],
  county: '',
  city: '',
  emergencyOnly: false,
  search: '',
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
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetFilters, setSheetFilters] = useState<Filters>(filters);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { selectedIds } = useCompare();
  const compareBarVisible = selectedIds.length > 0;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServiceDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lock body scroll when sheet is open
  useEffect(() => {
    if (sheetOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    return () => document.body.classList.remove('no-scroll');
  }, [sheetOpen]);

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

  const sheetFilteredCities = useMemo(() => {
    if (!sheetFilters.county) return [];
    return cities.filter((c) => c.county_slug === sheetFilters.county);
  }, [cities, sheetFilters.county]);

  const hasFilters =
    filters.services.length > lockedServices.length ||
    filters.county ||
    filters.city ||
    filters.emergencyOnly ||
    filters.search;

  const activeFilterCount =
    (filters.services.length > lockedServices.length ? filters.services.length - lockedServices.length : 0) +
    (filters.county ? 1 : 0) +
    (filters.city ? 1 : 0) +
    (filters.emergencyOnly ? 1 : 0) +
    (filters.search ? 1 : 0);

  const clearAll = useCallback(() => {
    const reset = { ...EMPTY_FILTERS, services: [...lockedServices] };
    setFilters(reset);
    onFilter(reset);
  }, [lockedServices, onFilter]);

  const removeFilter = useCallback(
    (type: 'county' | 'city' | 'emergency' | 'service' | 'search', value?: string) => {
      if (type === 'county') {
        update({ county: '', city: '' });
      } else if (type === 'city') {
        update({ city: '' });
      } else if (type === 'emergency') {
        update({ emergencyOnly: false });
      } else if (type === 'search') {
        update({ search: '' });
      } else if (type === 'service' && value && !lockedServices.includes(value)) {
        update({ services: filters.services.filter((s) => s !== value) });
      }
    },
    [update, filters.services, lockedServices]
  );

  // Bottom sheet helpers
  function openSheet() {
    setSheetFilters({ ...filters });
    setSheetOpen(true);
  }

  function applySheetFilters() {
    let applied = { ...sheetFilters };
    if (applied.county !== filters.county) {
      applied = { ...applied, city: '' };
    }
    setFilters(applied);
    onFilter(applied);
    setSheetOpen(false);
  }

  function clearSheetFilters() {
    const reset = { ...EMPTY_FILTERS, services: [...lockedServices] };
    setSheetFilters(reset);
  }

  function toggleSheetService(slug: string) {
    if (lockedServices.includes(slug)) return;
    setSheetFilters((prev) => ({
      ...prev,
      services: prev.services.includes(slug)
        ? prev.services.filter((s) => s !== slug)
        : [...prev.services, slug],
    }));
  }

  const selectClass =
    'text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none';

  const selectedServiceCount = filters.services.length;

  // Build active pills
  const pills: { label: string; type: 'county' | 'city' | 'emergency' | 'service' | 'search'; value?: string; locked?: boolean }[] = [];
  if (filters.search) {
    pills.push({ label: `Search: "${filters.search}"`, type: 'search' });
  }
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
    <>
      <div className="mb-6 space-y-3 sticky top-[72px] z-30">
        {/* Desktop filter controls — hidden on mobile */}
        <div className="hidden md:block bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mr-1">
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </div>

            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => update({ search: e.target.value })}
                placeholder="Search by business name..."
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 pl-10 text-sm bg-white text-gray-700 focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none"
              />
              {filters.search && (
                <button
                  onClick={() => update({ search: '' })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
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
                            locked ? 'text-gray-400' : 'text-amber-500'
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

        {/* Active filter pills — visible on all sizes */}
        {pills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {pills.map((pill, i) => (
              <span
                key={`${pill.type}-${pill.value || i}`}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs sm:text-sm font-medium ${
                  pill.locked
                    ? 'bg-gray-100 text-gray-500'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {pill.label}
                {!pill.locked && (
                  <button
                    onClick={() => removeFilter(pill.type, pill.value)}
                    className="hover:text-amber-900 transition-colors p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Mobile FAB — visible below md, shifts up when CompareBar visible */}
      <button
        onClick={openSheet}
        className={`md:hidden fixed right-6 z-40 w-14 h-14 rounded-full bg-amber-500 shadow-lg flex items-center justify-center active:bg-amber-600 transition-all ${
          compareBarVisible ? 'bottom-20' : 'bottom-6'
        }`}
        aria-label="Open filters"
      >
        <SlidersHorizontal className="w-6 h-6 text-white" />
        {activeFilterCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Mobile bottom sheet */}
      {sheetOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50 bottom-sheet-overlay"
            onClick={() => setSheetOpen(false)}
          />

          {/* Sheet */}
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl bottom-sheet-panel max-h-[80vh] overflow-y-auto">
            {/* Grab handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>

            <div className="px-5 pb-6 space-y-5">
              <h3 className="font-bold text-gray-900 text-lg">Filters</h3>

              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    value={sheetFilters.search}
                    onChange={(e) => setSheetFilters({ ...sheetFilters, search: e.target.value })}
                    placeholder="Search by business name..."
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 pl-10 text-gray-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                  />
                  {sheetFilters.search && (
                    <button
                      onClick={() => setSheetFilters({ ...sheetFilters, search: '' })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* County */}
              {counties.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">County</label>
                  <select
                    value={sheetFilters.county}
                    onChange={(e) => setSheetFilters({ ...sheetFilters, county: e.target.value, city: '' })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                  >
                    <option value="">All Counties</option>
                    {counties.map((c) => (
                      <option key={c.slug} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* City */}
              {sheetFilteredCities.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <select
                    value={sheetFilters.city}
                    onChange={(e) => setSheetFilters({ ...sheetFilters, city: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                  >
                    <option value="">All Cities</option>
                    {sheetFilteredCities.map((c) => (
                      <option key={c.slug} value={c.slug}>{c.name} ({c.business_count})</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Services */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Services</label>
                <div className="space-y-1">
                  {serviceTypes.map((st) => {
                    const checked = sheetFilters.services.includes(st.slug);
                    const locked = lockedServices.includes(st.slug);
                    return (
                      <label
                        key={st.slug}
                        className={`flex items-center gap-3 p-2.5 rounded-lg ${
                          locked ? 'opacity-50' : 'active:bg-gray-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={locked}
                          onChange={() => toggleSheetService(st.slug)}
                          className={`w-5 h-5 rounded border-gray-300 focus:ring-amber-300 ${
                            locked ? 'text-gray-400' : 'text-amber-500'
                          }`}
                        />
                        <span className={`text-sm ${locked ? 'text-gray-400' : 'text-gray-900'}`}>
                          {st.name}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Emergency */}
              <label className="flex items-center gap-3 p-2.5 rounded-lg active:bg-gray-50">
                <input
                  type="checkbox"
                  checked={sheetFilters.emergencyOnly}
                  onChange={(e) => setSheetFilters({ ...sheetFilters, emergencyOnly: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-amber-500 focus:ring-amber-300"
                />
                <span className="text-sm font-medium text-gray-900">24/7 Emergency Only</span>
              </label>

              {/* Actions */}
              <div className="pt-2 space-y-3">
                <button
                  onClick={clearSheetFilters}
                  className="w-full text-center text-sm text-gray-500 hover:text-gray-700 py-2"
                >
                  Clear All
                </button>
                <button
                  onClick={applySheetFilters}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg py-3.5 transition-colors text-base"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

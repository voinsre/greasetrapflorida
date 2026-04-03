'use client';

import { useState, useCallback } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';

interface FilterBarProps {
  serviceTypes: { slug: string; name: string }[];
  counties: { slug: string; name: string }[];
  onFilter: (filters: Filters) => void;
}

export interface Filters {
  service: string;
  county: string;
  emergencyOnly: boolean;
  depLicensed: boolean;
}

const EMPTY_FILTERS: Filters = {
  service: '',
  county: '',
  emergencyOnly: false,
  depLicensed: false,
};

export default function FilterBar({
  serviceTypes,
  counties,
  onFilter,
}: FilterBarProps) {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);

  const update = useCallback(
    (partial: Partial<Filters>) => {
      const next = { ...filters, ...partial };
      setFilters(next);
      onFilter(next);
    },
    [filters, onFilter]
  );

  const hasFilters =
    filters.service ||
    filters.county ||
    filters.emergencyOnly ||
    filters.depLicensed;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mr-1">
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </div>

        <select
          value={filters.service}
          onChange={(e) => update({ service: e.target.value })}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none"
        >
          <option value="">All Services</option>
          {serviceTypes.map((st) => (
            <option key={st.slug} value={st.slug}>
              {st.name}
            </option>
          ))}
        </select>

        <select
          value={filters.county}
          onChange={(e) => update({ county: e.target.value })}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none"
        >
          <option value="">All Counties</option>
          {counties.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
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

        <label className="inline-flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filters.depLicensed}
            onChange={(e) => update({ depLicensed: e.target.checked })}
            className="rounded border-gray-300 text-amber-500 focus:ring-amber-300"
          />
          DEP Licensed
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

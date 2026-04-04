'use client';

import { useState, useMemo } from 'react';
import FilterBar, { type Filters, type CityOption } from './FilterBar';
import ListingGrid from './ListingGrid';
import Pagination from './Pagination';
import type { BusinessListing } from './ListingCard';

const ITEMS_PER_PAGE = 24;

interface DirectoryShellProps {
  businesses: (BusinessListing & {
    county_slug: string | null;
    service_slugs: string[];
  })[];
  serviceTypes: { slug: string; name: string }[];
  counties: { slug: string; name: string }[];
  cities: CityOption[];
  lockedServices?: string[];
}

export default function DirectoryShell({
  businesses,
  serviceTypes,
  counties,
  cities,
  lockedServices = [],
}: DirectoryShellProps) {
  const [filters, setFilters] = useState<Filters>({
    services: [...lockedServices],
    county: '',
    city: '',
    emergencyOnly: false,
    search: '',
  });
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const searchLower = filters.search.toLowerCase();
    return businesses.filter((b) => {
      if (searchLower && !b.name.toLowerCase().includes(searchLower)) return false;
      if (filters.services.length > 0) {
        const hasAny = filters.services.some((s) => b.service_slugs.includes(s));
        if (!hasAny) return false;
      }
      if (filters.county && b.county_slug !== filters.county) return false;
      if (filters.city) {
        const bizCitySlug = b.city.toLowerCase().replace(/\s+/g, '-');
        const cityObj = cities.find((c) => c.slug === filters.city);
        if (cityObj) {
          const cityNameSlug = cityObj.name.toLowerCase().replace(/\s+/g, '-');
          if (bizCitySlug !== cityNameSlug && bizCitySlug !== filters.city) return false;
        }
      }
      if (filters.emergencyOnly && !b.emergency_24_7) return false;
      return true;
    });
  }, [businesses, filters, cities]);

  const paginated = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, page]);

  function handleFilter(f: Filters) {
    setFilters(f);
    setPage(1);
  }

  return (
    <>
      <p className="text-gray-500 mb-4">
        Showing {filtered.length} {filtered.length === 1 ? 'company' : 'companies'} across Florida
      </p>
      <FilterBar
        serviceTypes={serviceTypes}
        counties={counties}
        cities={cities}
        onFilter={handleFilter}
        lockedServices={lockedServices}
      />
      <ListingGrid businesses={paginated} />
      <Pagination
        totalItems={filtered.length}
        currentPage={page}
        onPageChange={setPage}
      />
    </>
  );
}

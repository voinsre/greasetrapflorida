'use client';

import { useState, useMemo } from 'react';
import FilterBar, { type Filters } from './FilterBar';
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
}

export default function DirectoryShell({
  businesses,
  serviceTypes,
  counties,
}: DirectoryShellProps) {
  const [filters, setFilters] = useState<Filters>({
    service: '',
    county: '',
    emergencyOnly: false,
    depLicensed: false,
  });
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return businesses.filter((b) => {
      if (filters.service && !b.service_slugs.includes(filters.service))
        return false;
      if (filters.county && b.county_slug !== filters.county) return false;
      if (filters.emergencyOnly && !b.emergency_24_7) return false;
      if (filters.depLicensed && !b.dep_licensed) return false;
      return true;
    });
  }, [businesses, filters]);

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
        onFilter={handleFilter}
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

'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { CheckCircle, XCircle, Phone, Globe, Star } from 'lucide-react';
import VerifiedBadge, { isVerified } from '@/components/directory/VerifiedBadge';

interface CompareBusiness {
  id: string;
  slug: string;
  name: string;
  city: string;
  county: string | null;
  rating: number | null;
  review_count: number | null;
  emergency_24_7: boolean;
  manifest_provided: boolean;
  phone: string | null;
  website: string | null;
  website_status: string | null;
  place_id: string | null;
  services: string[];
  verified: boolean;
}

function BoolCell({ value }: { value: boolean }) {
  return value ? (
    <CheckCircle className="w-5 h-5 text-emerald-500 mx-auto" />
  ) : (
    <XCircle className="w-5 h-5 text-gray-300 mx-auto" />
  );
}

export default function CompareTable() {
  const searchParams = useSearchParams();
  const idsParam = searchParams.get('ids') || '';
  const ids = idsParam
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const [businesses, setBusinesses] = useState<CompareBusiness[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ids.length === 0) {
      setLoading(false);
      return;
    }

    const supabase = createBrowserSupabaseClient();

    async function load() {
      const { data: bizData } = await supabase
        .from('businesses')
        .select('id, slug, name, city, county, rating, review_count, emergency_24_7, manifest_provided, phone, website, website_status, place_id')
        .in('id', ids);

      if (!bizData?.length) {
        setLoading(false);
        return;
      }

      // Get services
      const { data: junctions } = await supabase
        .from('business_services')
        .select('business_id, service_id')
        .in('business_id', bizData.map((b) => b.id));

      const serviceIds = [...new Set((junctions || []).map((j) => j.service_id))];
      let serviceMap = new Map<string, string>();
      if (serviceIds.length) {
        const { data: serviceData } = await supabase
          .from('service_types')
          .select('id, name')
          .in('id', serviceIds);
        for (const s of serviceData || []) {
          serviceMap.set(s.id, s.name);
        }
      }

      const bizServiceMap = new Map<string, string[]>();
      for (const j of junctions || []) {
        if (!bizServiceMap.has(j.business_id)) bizServiceMap.set(j.business_id, []);
        const name = serviceMap.get(j.service_id);
        if (name) bizServiceMap.get(j.business_id)!.push(name);
      }

      const result: CompareBusiness[] = bizData.map((b) => ({
        ...b,
        services: bizServiceMap.get(b.id) || [],
        verified: isVerified(b),
      }));

      // Maintain order from URL
      const ordered = ids
        .map((id) => result.find((b) => b.id === id))
        .filter(Boolean) as CompareBusiness[];

      setBusinesses(ordered);
      setLoading(false);
    }

    load();
  }, [idsParam]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />;
  }

  if (businesses.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-gray-500 mb-4">
          Select up to 4 companies from the directory to compare side by side.
        </p>
        <Link
          href="/companies"
          className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Browse Companies
        </Link>
      </div>
    );
  }

  // Collect all unique services across all businesses
  const allServices = [...new Set(businesses.flatMap((b) => b.services))].sort();

  const rowClass = 'border-b border-gray-100';
  const headerCell = 'text-left text-sm font-semibold text-gray-700 py-3 px-4 bg-gray-50 whitespace-nowrap';
  const dataCell = 'py-3 px-4 text-sm text-center min-w-[180px]';

  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <table className="w-full border-collapse bg-white rounded-xl border border-gray-200 overflow-hidden">
        <thead>
          <tr className={rowClass}>
            <th className={headerCell}>Company</th>
            {businesses.map((b) => (
              <th key={b.id} className={`${dataCell} font-semibold text-gray-900`}>
                <Link href={`/companies/${b.slug}`} className="hover:text-amber-600 transition-colors">
                  <span className="flex items-center justify-center gap-1">
                    {b.name}
                    {b.verified && <VerifiedBadge />}
                  </span>
                </Link>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className={rowClass}>
            <td className={headerCell}>Location</td>
            {businesses.map((b) => (
              <td key={b.id} className={dataCell}>
                {b.city}{b.county ? `, ${b.county} County` : ''}
              </td>
            ))}
          </tr>
          <tr className={rowClass}>
            <td className={headerCell}>Rating &amp; Reviews</td>
            {businesses.map((b) => (
              <td key={b.id} className={dataCell}>
                {b.rating ? (
                  <span className="inline-flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    {Number(b.rating).toFixed(1)}
                    <span className="text-gray-400">({b.review_count || 0})</span>
                  </span>
                ) : (
                  <span className="text-gray-400">No rating</span>
                )}
              </td>
            ))}
          </tr>
          {allServices.map((service) => (
            <tr key={service} className={rowClass}>
              <td className={headerCell}>{service}</td>
              {businesses.map((b) => (
                <td key={b.id} className={dataCell}>
                  <BoolCell value={b.services.includes(service)} />
                </td>
              ))}
            </tr>
          ))}
          <tr className={rowClass}>
            <td className={headerCell}>Emergency 24/7</td>
            {businesses.map((b) => (
              <td key={b.id} className={dataCell}>
                <BoolCell value={b.emergency_24_7} />
              </td>
            ))}
          </tr>
          <tr className={rowClass}>
            <td className={headerCell}>Manifest Provided</td>
            {businesses.map((b) => (
              <td key={b.id} className={dataCell}>
                <BoolCell value={b.manifest_provided} />
              </td>
            ))}
          </tr>
          <tr className={rowClass}>
            <td className={headerCell}>Phone</td>
            {businesses.map((b) => (
              <td key={b.id} className={dataCell}>
                {b.phone ? (
                  <a href={`tel:${b.phone}`} className="inline-flex items-center gap-1 text-amber-600 hover:text-amber-700">
                    <Phone className="w-3.5 h-3.5" />
                    {b.phone}
                  </a>
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </td>
            ))}
          </tr>
          <tr className={rowClass}>
            <td className={headerCell}>Website</td>
            {businesses.map((b) => (
              <td key={b.id} className={dataCell}>
                {b.website ? (
                  <a
                    href={b.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-amber-600 hover:text-amber-700"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    Visit
                  </a>
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </td>
            ))}
          </tr>
          <tr>
            <td className={headerCell} />
            {businesses.map((b) => (
              <td key={b.id} className="py-4 px-4 text-center">
                <Link
                  href={`/companies/${b.slug}`}
                  className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2.5 px-5 rounded-lg transition-colors text-sm"
                >
                  Get a Quote
                </Link>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle, XCircle, Phone, Globe, Star, Loader2 } from 'lucide-react';
import VerifiedBadge from '@/components/directory/VerifiedBadge';

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
  is_verified: boolean;
  services: string[];
}

function BoolCell({ value }: { value: boolean }) {
  return value ? (
    <CheckCircle className="w-5 h-5 text-emerald-500 mx-auto" />
  ) : (
    <XCircle className="w-5 h-5 text-gray-300 mx-auto" />
  );
}

function BoolRow({ label, value }: { label: string; value: boolean }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-gray-600">{label}</span>
      {value ? (
        <CheckCircle className="w-5 h-5 text-emerald-500" />
      ) : (
        <XCircle className="w-5 h-5 text-gray-300" />
      )}
    </div>
  );
}

export default function CompareTable() {
  const [businesses, setBusinesses] = useState<CompareBusiness[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const idsParam = params.get('ids') || '';

    if (!idsParam) {
      setLoading(false);
      return;
    }

    fetch(`/api/compare?ids=${encodeURIComponent(idsParam)}`)
      .then((res) => res.json())
      .then((data) => {
        setBusinesses(data.businesses || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(`Failed to load: ${err.message}`);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
        <span className="ml-3 text-gray-500">Loading comparison...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-red-500 mb-4">{error}</p>
        <Link href="/companies" className="text-amber-600 hover:text-amber-700 font-medium">
          Back to Companies
        </Link>
      </div>
    );
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

  const allServices = [...new Set(businesses.flatMap((b) => b.services))].sort();

  const rowClass = 'border-b border-gray-100';
  const headerCell = 'text-left text-sm font-semibold text-gray-700 py-3 px-4 bg-gray-50 whitespace-nowrap';
  const dataCell = 'py-3 px-4 text-sm text-center min-w-[180px]';

  return (
    <>
      {/* Mobile: stacked cards */}
      <div className="md:hidden space-y-4">
        {businesses.map((b) => (
          <div key={b.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gray-50 p-4 border-b border-gray-100">
              <Link href={`/companies/${b.slug}`} className="hover:text-amber-600 transition-colors">
                <h2 className="font-semibold text-gray-900 flex items-center gap-1">
                  {b.name}
                  {b.is_verified && <VerifiedBadge />}
                </h2>
              </Link>
              <p className="text-sm text-gray-500 mt-1">
                {b.city}{b.county ? `, ${b.county} County` : ''}
              </p>
            </div>
            <div className="p-4 space-y-1">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">Rating</span>
                {b.rating && b.rating >= 2.0 ? (
                  <span className="inline-flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    {Number(b.rating).toFixed(1)}
                    <span className="text-gray-400">({b.review_count || 0})</span>
                  </span>
                ) : (
                  <span className="text-sm text-gray-400">&mdash;</span>
                )}
              </div>
              <BoolRow label="Emergency 24/7" value={b.emergency_24_7} />
              <BoolRow label="Manifest Provided" value={b.manifest_provided} />
              {allServices.map((service) => (
                <BoolRow key={service} label={service} value={b.services.includes(service)} />
              ))}
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">Phone</span>
                {b.phone ? (
                  <a href={`tel:${b.phone}`} className="text-sm text-amber-600 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" />{b.phone}
                  </a>
                ) : (
                  <span className="text-sm text-gray-400">--</span>
                )}
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">Website</span>
                {b.website ? (
                  <a href={b.website} target="_blank" rel="noopener noreferrer" className="text-sm text-amber-600 flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5" />Visit
                  </a>
                ) : (
                  <span className="text-sm text-gray-400">--</span>
                )}
              </div>
            </div>
            <div className="p-4 pt-0">
              <Link
                href={`/companies/${b.slug}`}
                className="block w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-lg transition-colors text-sm text-center"
              >
                Get a Quote
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: side-by-side table */}
      <div className="hidden md:block overflow-x-auto -mx-4 sm:mx-0">
        <table className="w-full border-collapse bg-white rounded-xl border border-gray-200 overflow-hidden">
          <thead>
            <tr className={rowClass}>
              <th className={headerCell}>Company</th>
              {businesses.map((b) => (
                <th key={b.id} className={`${dataCell} font-semibold text-gray-900`}>
                  <Link href={`/companies/${b.slug}`} className="hover:text-amber-600 transition-colors">
                    <span className="flex items-center justify-center gap-1">
                      {b.name}
                      {b.is_verified && <VerifiedBadge />}
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
                  {b.rating && b.rating >= 2.0 ? (
                    <span className="inline-flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      {Number(b.rating).toFixed(1)}
                      <span className="text-gray-400">({b.review_count || 0})</span>
                    </span>
                  ) : (
                    <span className="text-gray-400">&mdash;</span>
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
                <td key={b.id} className={dataCell}><BoolCell value={b.emergency_24_7} /></td>
              ))}
            </tr>
            <tr className={rowClass}>
              <td className={headerCell}>Manifest Provided</td>
              {businesses.map((b) => (
                <td key={b.id} className={dataCell}><BoolCell value={b.manifest_provided} /></td>
              ))}
            </tr>
            <tr className={rowClass}>
              <td className={headerCell}>Phone</td>
              {businesses.map((b) => (
                <td key={b.id} className={dataCell}>
                  {b.phone ? (
                    <a href={`tel:${b.phone}`} className="inline-flex items-center gap-1 text-amber-600 hover:text-amber-700">
                      <Phone className="w-3.5 h-3.5" />{b.phone}
                    </a>
                  ) : <span className="text-gray-400">--</span>}
                </td>
              ))}
            </tr>
            <tr className={rowClass}>
              <td className={headerCell}>Website</td>
              {businesses.map((b) => (
                <td key={b.id} className={dataCell}>
                  {b.website ? (
                    <a href={b.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-amber-600 hover:text-amber-700">
                      <Globe className="w-3.5 h-3.5" />Visit
                    </a>
                  ) : <span className="text-gray-400">--</span>}
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
    </>
  );
}

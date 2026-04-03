import Link from 'next/link';
import { MapPin } from 'lucide-react';
import Stars from './Stars';
import ServicePills from './ServicePills';
import TrustBadges from './TrustBadges';
import VerifiedBadge from './VerifiedBadge';

export interface BusinessListing {
  id: string;
  slug: string;
  name: string;
  city: string;
  county: string | null;
  rating: number | null;
  review_count: number | null;
  is_featured: boolean;
  dep_licensed: boolean;
  emergency_24_7: boolean;
  manifest_provided: boolean;
  insured: boolean;
  services: string[];
  verified?: boolean;
}

export default function ListingCard({
  business,
}: {
  business: BusinessListing;
}) {
  const borderColor = business.is_featured
    ? 'border-t-amber-500'
    : business.verified
      ? 'border-t-emerald-500'
      : 'border-t-gray-200';

  return (
    <Link
      href={`/companies/${business.slug}`}
      className={`block bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-amber-200 transition-all p-5 border-t-4 ${borderColor}`}
    >
      <div className="space-y-3">
        <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 flex items-start">
          <span className="line-clamp-2">{business.name}</span>
          {business.verified && <VerifiedBadge />}
        </h3>

        <div className="flex items-center gap-1.5 text-sm text-gray-500">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span>
            {business.city}
            {business.county ? `, ${business.county} County` : ''}
          </span>
        </div>

        <Stars rating={business.rating} reviewCount={business.review_count} />

        <ServicePills services={business.services} />

        <TrustBadges
          depLicensed={business.dep_licensed}
          emergency24_7={business.emergency_24_7}
          manifestProvided={business.manifest_provided}
          insured={business.insured}
          verified={business.verified}
        />

        <button className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors text-sm mt-2">
          Get a Free Quote
        </button>
      </div>
    </Link>
  );
}

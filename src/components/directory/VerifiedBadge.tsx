import { Check } from 'lucide-react';

export function isVerified(business: {
  website_status?: string | null;
  phone?: string | null;
  review_count?: number | null;
  place_id?: string | null;
  rating?: number | null;
}): boolean {
  return (
    business.website_status === 'live' &&
    business.phone != null &&
    (business.review_count ?? 0) > 0 &&
    business.place_id != null &&
    (Number(business.rating) || 0) >= 3.0
  );
}

export default function VerifiedBadge() {
  return (
    <span
      className="inline-flex items-center justify-center w-5 h-5 bg-amber-500 rounded-full ml-1.5 shrink-0 ring-2 ring-amber-200 cursor-help"
      title="Verified: Active website, confirmed phone, Google reviews"
    >
      <Check className="w-3 h-3 text-white" strokeWidth={3} />
    </span>
  );
}

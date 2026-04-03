import ListingCard, { type BusinessListing } from './ListingCard';
import { Search } from 'lucide-react';

export default function ListingGrid({
  businesses,
  emptyMessage = 'No companies found matching your criteria.',
}: {
  businesses: BusinessListing[];
  emptyMessage?: string;
}) {
  if (!businesses.length) {
    return (
      <div className="text-center py-16">
        <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {businesses.map((biz) => (
        <ListingCard key={biz.id} business={biz} />
      ))}
    </div>
  );
}

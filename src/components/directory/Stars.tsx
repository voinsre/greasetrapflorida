import { Star } from 'lucide-react';

export default function Stars({
  rating,
  reviewCount,
}: {
  rating: number | null;
  reviewCount: number | null;
}) {
  if (!rating) return null;

  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.25 && rating - full < 0.75;
  const empty = 5 - full - (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: full }).map((_, i) => (
          <Star
            key={`f${i}`}
            className="w-4 h-4 fill-amber-400 text-amber-400"
          />
        ))}
        {hasHalf && (
          <div className="relative w-4 h-4">
            <Star className="absolute w-4 h-4 text-gray-300" />
            <div className="absolute overflow-hidden w-1/2 h-4">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            </div>
          </div>
        )}
        {Array.from({ length: empty }).map((_, i) => (
          <Star key={`e${i}`} className="w-4 h-4 text-gray-300" />
        ))}
      </div>
      <span className="text-sm font-medium text-gray-900">
        {Number(rating).toFixed(1)}
      </span>
      {reviewCount != null && (
        <span className="text-sm text-gray-500">({reviewCount})</span>
      )}
    </div>
  );
}

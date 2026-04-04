'use client';

import { useRouter } from 'next/navigation';

export default function QuoteButton({ slug }: { slug: string }) {
  const router = useRouter();

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        router.push(`/get-quotes?company=${slug}`);
      }}
      className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors text-sm min-h-[44px]"
    >
      Get a Free Quote
    </button>
  );
}

'use client';

import Link from 'next/link';
import { X } from 'lucide-react';
import { useCompare } from './CompareContext';

export default function CompareBar() {
  const { selectedIds, clearCompare } = useCompare();

  if (selectedIds.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 animate-slide-up">
      <div className="bg-[#1A1A1A] border-t border-gray-700 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-white text-sm font-medium whitespace-nowrap">
              <span className="hidden sm:inline">{selectedIds.length} of 4 selected</span>
              <span className="sm:hidden">{selectedIds.length} selected</span>
            </span>
            <button
              onClick={clearCompare}
              className="text-gray-400 hover:text-white text-sm flex items-center gap-1 transition-colors min-h-[44px] px-2"
            >
              <X className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear all</span>
            </button>
          </div>
          <Link
            href={`/compare?ids=${selectedIds.join(',')}`}
            className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2.5 px-5 sm:px-6 rounded-lg transition-colors text-sm whitespace-nowrap min-h-[44px] flex items-center"
          >
            Compare ({selectedIds.length})
          </Link>
        </div>
      </div>
    </div>
  );
}

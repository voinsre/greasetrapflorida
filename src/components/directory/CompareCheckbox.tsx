'use client';

import { useCompare } from './CompareContext';

export default function CompareCheckbox({ businessId }: { businessId: string }) {
  const { isSelected, addToCompare, removeFromCompare, isFull } = useCompare();

  const selected = isSelected(businessId);
  const disabled = !selected && isFull;

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (selected) {
      removeFromCompare(businessId);
    } else if (!disabled) {
      addToCompare(businessId);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 text-xs font-medium rounded-md px-2 py-1 min-h-[44px] transition-colors ${
        selected
          ? 'bg-amber-100 text-amber-700 border border-amber-300'
          : disabled
            ? 'bg-gray-50 text-gray-300 border border-gray-100 cursor-not-allowed'
            : 'bg-gray-50 text-gray-500 border border-gray-200 hover:border-amber-300 hover:text-amber-600'
      }`}
      title={disabled ? 'Maximum 4 companies for comparison' : selected ? 'Remove from compare' : 'Add to compare'}
    >
      <span
        className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
          selected
            ? 'bg-amber-500 border-amber-500'
            : 'border-gray-300'
        }`}
      >
        {selected && (
          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </span>
      Compare
    </button>
  );
}

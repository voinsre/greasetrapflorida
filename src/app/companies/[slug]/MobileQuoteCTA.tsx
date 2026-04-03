'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import LeadForm from '@/components/forms/LeadForm';

export default function MobileQuoteCTA({
  businessId,
  businessName,
}: {
  businessId: string;
  businessName: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      {/* Fixed bottom bar */}
      {!open && (
        <div className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 p-3 z-40">
          <button
            onClick={() => setOpen(true)}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            Get a Free Quote
          </button>
        </div>
      )}

      {/* Expanded form overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-2xl max-h-[90vh] overflow-y-auto p-4 pb-8">
            <button
              onClick={() => setOpen(false)}
              className="ml-auto flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 mb-2"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
            <LeadForm businessId={businessId} businessName={businessName} />
          </div>
        </div>
      )}
    </div>
  );
}

import { Suspense } from 'react';
import type { Metadata } from 'next';
import QuoteWizard from '@/components/forms/QuoteWizard';

export const metadata: Metadata = {
  title: { absolute: 'Get Free Grease Trap Quotes' },
  description:
    'Get free quotes from verified grease trap service providers in your Florida county. Compare pricing for cleaning, pumping, installation, and emergency services.',
  openGraph: {
    title: 'Get Free Grease Trap Quotes',
    description: 'Get free quotes from verified grease trap providers in Florida.',
    url: 'https://greasetrapflorida.com/get-quotes',
    siteName: 'Grease Trap Florida',
    images: [{ url: '/images/og-image.webp', width: 1200, height: 630 }],
    type: 'website',
  },
  alternates: {
    canonical: 'https://greasetrapflorida.com/get-quotes',
  },
};

export default function GetQuotesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        Get Free Grease Trap Service Quotes
      </h1>
      <p className="text-gray-600 leading-relaxed mb-8">
        Tell us about your needs and we&apos;ll connect you with verified grease trap service providers in your area.
        Free, no obligation, and typically within 24 hours.
      </p>

      <Suspense fallback={<div className="h-64 bg-gray-50 rounded-xl animate-pulse" />}>
        <QuoteWizard />
      </Suspense>
    </div>
  );
}

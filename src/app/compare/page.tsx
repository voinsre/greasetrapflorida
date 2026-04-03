import type { Metadata } from 'next';
import { Suspense } from 'react';
import CompareTable from './CompareTable';

export const metadata: Metadata = {
  title: { absolute: 'Compare Grease Trap Companies' },
  description:
    'Compare grease trap cleaning companies side by side. View ratings, services, pricing, and contact information for up to 4 Florida providers.',
  openGraph: {
    title: 'Compare Grease Trap Companies',
    description: 'Compare grease trap cleaning companies side by side.',
    url: 'https://greasetrapflorida.com/compare',
    siteName: 'Grease Trap Florida',
    images: [{ url: '/images/og-image.webp', width: 1200, height: 630 }],
    type: 'website',
  },
  alternates: {
    canonical: 'https://greasetrapflorida.com/compare',
  },
};

export default function ComparePage() {
  return (
    <>
      {/* Dark Hero */}
      <section className="bg-[#1A1A1A] -mt-16 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-1 text-sm">
              <li>
                <a href="/" className="text-gray-400 hover:text-amber-400 transition-colors">Home</a>
              </li>
              <li className="text-gray-600 mx-1">/</li>
              <li>
                <a href="/companies" className="text-gray-400 hover:text-amber-400 transition-colors">Companies</a>
              </li>
              <li className="text-gray-600 mx-1">/</li>
              <li className="text-gray-300 font-medium">Compare</li>
            </ol>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Compare Grease Trap Companies
          </h1>
          <p className="mt-3 text-gray-300">
            View up to 4 companies side by side to find the best fit for your business.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<div className="h-64 bg-gray-100 rounded-xl animate-pulse" />}>
          <CompareTable />
        </Suspense>
      </div>
    </>
  );
}

import Link from 'next/link';
import type { Metadata } from 'next';
import { DollarSign, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: { absolute: 'Grease Trap Cleaning Cost Florida' },
  description:
    'How much does grease trap cleaning cost in Florida? Interior traps $200-$500, underground interceptors $300-$800+. Compare pricing by size, frequency, and region.',
  openGraph: {
    title: 'Grease Trap Cleaning Cost Florida',
    description: 'How much does grease trap cleaning cost in Florida? Pricing by trap size, frequency, and region.',
    url: 'https://greasetrapflorida.com/cost',
    siteName: 'Grease Trap Florida',
    images: [{ url: '/images/og-image.webp', width: 1200, height: 630 }],
    type: 'website',
  },
};

export default function CostPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://greasetrapflorida.com' },
      { '@type': 'ListItem', position: 2, name: 'Cost' },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Dark Hero */}
      <section className="bg-[#1A1A1A] -mt-16 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-1 text-sm">
              <li><a href="/" className="text-gray-400 hover:text-amber-400 transition-colors">Home</a></li>
              <li className="text-gray-600 mx-1">/</li>
              <li className="text-gray-300 font-medium">Cost</li>
            </ol>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Grease Trap Cleaning Costs in Florida
          </h1>
          <p className="mt-4 text-gray-300 max-w-3xl leading-relaxed">
            Understanding grease trap cleaning costs helps Florida restaurant owners budget for compliance.
            Prices vary by trap size, frequency, location, and service provider.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Cost Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 text-center">
            <DollarSign className="w-8 h-8 text-amber-500 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900">$200 - $500</h3>
            <p className="text-sm text-gray-500 mt-1">Interior Grease Trap</p>
            <p className="text-xs text-gray-400 mt-1">Per pump-out</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 text-center">
            <DollarSign className="w-8 h-8 text-amber-500 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900">$300 - $800+</h3>
            <p className="text-sm text-gray-500 mt-1">Underground Interceptor</p>
            <p className="text-xs text-gray-400 mt-1">Per pump-out</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 text-center">
            <DollarSign className="w-8 h-8 text-amber-500 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900">$2,000 - $10,000</h3>
            <p className="text-sm text-gray-500 mt-1">Annual Service Contract</p>
            <p className="text-xs text-gray-400 mt-1">Monthly to quarterly</p>
          </div>
        </div>

        {/* Link to full guide */}
        <Link
          href="/cost/grease-trap-cleaning-cost"
          className="block bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-amber-200 transition-all p-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Complete Grease Trap Cleaning Cost Guide
              </h2>
              <p className="text-gray-600">
                Detailed pricing breakdown by trap size, establishment type, region, and frequency.
                Learn what factors affect your cost and how to save.
              </p>
            </div>
            <ArrowRight className="w-6 h-6 text-amber-500 shrink-0 ml-4" />
          </div>
        </Link>

        {/* Additional Links */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/companies"
            className="block bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-amber-200 transition-all p-5"
          >
            <h3 className="font-semibold text-gray-900">Compare Providers</h3>
            <p className="text-sm text-gray-500 mt-1">Browse verified companies and request free quotes</p>
          </Link>
          <Link
            href="/guides/grease-trap-cleaning-frequency-florida"
            className="block bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-amber-200 transition-all p-5"
          >
            <h3 className="font-semibold text-gray-900">Cleaning Frequency Guide</h3>
            <p className="text-sm text-gray-500 mt-1">How often you need service affects your annual cost</p>
          </Link>
        </div>
      </div>
    </>
  );
}

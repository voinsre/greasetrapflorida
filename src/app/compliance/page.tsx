import Link from 'next/link';
import type { Metadata } from 'next';
import { createStaticClient } from '@/lib/supabase/static';
import { Shield, BookOpen, FileText, AlertTriangle, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: { absolute: 'Florida Grease Trap Compliance Guide' },
  description:
    'Everything you need to know about Florida\'s grease waste regulations. Chapter 62-705 compliance guides, county-specific FOG requirements, manifest documentation, and penalty information for restaurant owners and food service managers.',
  openGraph: {
    title: 'Florida Grease Trap Compliance Guide',
    description: 'Chapter 62-705 compliance guides, county FOG requirements, and penalty information.',
    url: 'https://greasetrapflorida.com/compliance',
    siteName: 'Grease Trap Florida',
    images: [{ url: '/images/og-image.webp', width: 1200, height: 630 }],
    type: 'website',
  },
};

export default async function CompliancePage() {
  const supabase = createStaticClient();

  const [{ data: stateGuides }, { data: countyPages }] = await Promise.all([
    supabase
      .from('content_pages')
      .select('slug, title, excerpt')
      .eq('category', 'guide')
      .or('slug.ilike.%compliance%,slug.ilike.%manifest%,slug.ilike.%penalties%,slug.ilike.%fines%')
      .order('published_at', { ascending: false }),
    supabase
      .from('content_pages')
      .select('slug, title, excerpt')
      .eq('category', 'compliance')
      .order('title'),
  ]);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://greasetrapflorida.com' },
      { '@type': 'ListItem', position: 2, name: 'Compliance' },
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
              <li className="text-gray-300 font-medium">Compliance</li>
            </ol>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Florida Grease Trap Compliance
          </h1>
          <p className="mt-4 text-gray-300 max-w-3xl leading-relaxed">
            Everything you need to know about Florida&apos;s grease waste regulations. Chapter 62-705
            compliance guides, county-specific FOG requirements, manifest documentation, and penalty
            information for restaurant owners and food service managers.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Section 1: State Regulations */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Shield className="w-6 h-6 text-amber-500" />
            State Regulations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(stateGuides || []).map((guide) => (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="block bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-amber-200 transition-all p-5"
              >
                <FileText className="w-5 h-5 text-amber-500 mb-2" />
                <h3 className="font-semibold text-gray-900">{guide.title}</h3>
                {guide.excerpt && (
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{guide.excerpt}</p>
                )}
              </Link>
            ))}
            {(stateGuides || []).length === 0 && (
              <Link
                href="/guides/chapter-62-705-compliance-guide"
                className="block bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-amber-200 transition-all p-5"
              >
                <Shield className="w-5 h-5 text-amber-500 mb-2" />
                <h3 className="font-semibold text-gray-900">Chapter 62-705 Compliance Guide</h3>
                <p className="text-sm text-gray-500 mt-1">Florida&apos;s grease waste removal regulation explained</p>
              </Link>
            )}
          </div>
        </section>

        {/* Section 2: County Requirements */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-amber-500" />
            County Requirements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(countyPages || []).map((page) => (
              <Link
                key={page.slug}
                href={`/compliance/${page.slug}`}
                className="block bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-amber-200 transition-all p-5"
              >
                <h3 className="font-semibold text-gray-900">{page.title}</h3>
                {page.excerpt && (
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{page.excerpt}</p>
                )}
                <span className="mt-2 inline-block text-sm font-medium text-amber-600">
                  View Requirements &rarr;
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Section 3: Quick Links */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-amber-500" />
            Quick Links
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/guides/verify-grease-hauler-dep-licensed"
              className="block bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-amber-200 transition-all p-5"
            >
              <ExternalLink className="w-5 h-5 text-amber-500 mb-2" />
              <h3 className="font-semibold text-gray-900 text-sm">Verify DEP Licensed Hauler</h3>
              <p className="text-xs text-gray-500 mt-1">How to check if your hauler is properly licensed</p>
            </Link>
            <Link
              href="/guides/what-happens-fail-fog-inspection"
              className="block bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-amber-200 transition-all p-5"
            >
              <AlertTriangle className="w-5 h-5 text-amber-500 mb-2" />
              <h3 className="font-semibold text-gray-900 text-sm">What Happens If You Fail a FOG Inspection</h3>
              <p className="text-xs text-gray-500 mt-1">Consequences and steps to resolve violations</p>
            </Link>
            <Link
              href="/guides/starting-restaurant-florida-grease-compliance"
              className="block bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-amber-200 transition-all p-5"
            >
              <FileText className="w-5 h-5 text-amber-500 mb-2" />
              <h3 className="font-semibold text-gray-900 text-sm">Starting a Restaurant in Florida</h3>
              <p className="text-xs text-gray-500 mt-1">Grease compliance checklist for new restaurants</p>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}

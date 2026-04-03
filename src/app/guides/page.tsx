import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { createStaticClient } from '@/lib/supabase/static';
import { BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: { absolute: 'Grease Trap Guides for Florida' },
  description:
    'Expert guides on grease trap compliance, costs, maintenance, and choosing service providers in Florida. Chapter 62-705 and FOG resources.',
  alternates: { canonical: 'https://greasetrapflorida.com/guides' },
  openGraph: {
    title: 'Grease Trap Guides for Florida',
    description:
      'Expert guides on grease trap compliance, costs, maintenance, and choosing service providers in Florida.',
    url: 'https://greasetrapflorida.com/guides',
    siteName: 'Grease Trap Florida',
    images: [{ url: '/images/og-image.webp', width: 1200, height: 630 }],
    type: 'website',
  },
};

export default async function GuidesPage() {
  const supabase = createStaticClient();
  const { data: guides } = await supabase
    .from('content_pages')
    .select('slug, title, excerpt, image_url')
    .eq('category', 'guide')
    .order('published_at', { ascending: false });

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Grease Trap Guides for Florida',
      numberOfItems: (guides || []).length,
      itemListElement: (guides || []).map((g, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `https://greasetrapflorida.com/guides/${g.slug}`,
        name: g.title,
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://greasetrapflorida.com' },
        { '@type': 'ListItem', position: 2, name: 'Guides' },
      ],
    },
  ];

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
              <li className="text-gray-300 font-medium">Guides</li>
            </ol>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Grease Trap Guides for Florida Businesses
          </h1>
          <p className="mt-4 text-gray-300 max-w-3xl leading-relaxed">
            Expert guides on grease trap compliance, costs, maintenance, and choosing service providers in Florida.
            Everything restaurant owners and food service managers need to know about Chapter 62-705 and FOG regulations.
          </p>
        </div>
      </section>

      {/* Guide Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(guides || []).map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="block bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 overflow-hidden transition-all group"
            >
              {guide.image_url ? (
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={guide.image_url}
                    alt={guide.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              ) : (
                <div className="h-48 bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-amber-400" />
                </div>
              )}
              <div className="p-5">
                <h2 className="font-semibold text-gray-900 text-lg group-hover:text-amber-600 transition-colors">
                  {guide.title}
                </h2>
                {guide.excerpt && (
                  <p className="mt-2 text-sm text-gray-500 line-clamp-2">{guide.excerpt}</p>
                )}
                <span className="mt-3 inline-block text-sm font-medium text-amber-600">
                  Read Guide &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

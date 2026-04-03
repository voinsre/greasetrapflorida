import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { createStaticClient } from '@/lib/supabase/static';
import { Calendar } from 'lucide-react';

export const metadata: Metadata = {
  title: { absolute: 'Grease Trap Florida Blog' },
  description:
    'Tips, insights, and industry updates for Florida restaurant owners and food service professionals managing grease trap compliance and maintenance.',
  alternates: { canonical: 'https://greasetrapflorida.com/blog' },
  openGraph: {
    title: 'Grease Trap Florida Blog',
    description: 'Tips and insights for Florida restaurant owners managing grease trap compliance.',
    url: 'https://greasetrapflorida.com/blog',
    siteName: 'Grease Trap Florida',
    images: [{ url: '/images/og-image.webp', width: 1200, height: 630 }],
    type: 'website',
  },
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function BlogPage() {
  const supabase = createStaticClient();
  const { data: posts } = await supabase
    .from('content_pages')
    .select('slug, title, excerpt, image_url, published_at')
    .eq('category', 'blog')
    .order('published_at', { ascending: false });

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Grease Trap Florida Blog',
      numberOfItems: (posts || []).length,
      itemListElement: (posts || []).map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `https://greasetrapflorida.com/blog/${p.slug}`,
        name: p.title,
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://greasetrapflorida.com' },
        { '@type': 'ListItem', position: 2, name: 'Blog' },
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
              <li className="text-gray-300 font-medium">Blog</li>
            </ol>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Grease Trap Florida Blog
          </h1>
          <p className="mt-4 text-gray-300 max-w-3xl leading-relaxed">
            Tips, insights, and industry updates for Florida restaurant owners and food service
            professionals managing grease trap compliance and maintenance.
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(posts || []).map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 overflow-hidden transition-all group"
            >
              {post.image_url ? (
                <div className="relative h-52 w-full overflow-hidden">
                  <Image
                    src={post.image_url}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              ) : (
                <div className="h-52 bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center">
                  <Calendar className="w-12 h-12 text-amber-400" />
                </div>
              )}
              <div className="p-5">
                {post.published_at && (
                  <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(post.published_at)}
                  </p>
                )}
                <h2 className="font-semibold text-gray-900 text-lg group-hover:text-amber-600 transition-colors">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="mt-2 text-sm text-gray-500 line-clamp-2">{post.excerpt}</p>
                )}
                <span className="mt-3 inline-block text-sm font-medium text-amber-600">
                  Read More &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

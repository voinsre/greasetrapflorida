import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { createStaticClient } from '@/lib/supabase/static';
import MarkdownContent from '@/components/content/MarkdownContent';
import { ChevronRight, Calendar, User, ArrowRight } from 'lucide-react';

export async function generateStaticParams() {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from('content_pages')
    .select('slug')
    .eq('category', 'blog');
  return (data || []).map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createStaticClient();
  const { data } = await supabase
    .from('content_pages')
    .select('title, meta_title, meta_description, image_url')
    .eq('slug', slug)
    .eq('category', 'blog')
    .single();
  if (!data) return {};
  const title = data.meta_title || data.title;
  return {
    title: { absolute: title },
    description: data.meta_description || '',
    alternates: { canonical: `https://greasetrapflorida.com/blog/${slug}` },
    openGraph: {
      title,
      description: data.meta_description || '',
      url: `https://greasetrapflorida.com/blog/${slug}`,
      siteName: 'Grease Trap Florida',
      images: [{ url: data.image_url || '/images/og-image.webp', width: 1200, height: 630 }],
      type: 'article',
    },
  };
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function extractFAQs(content: string): { q: string; a: string }[] {
  const faqs: { q: string; a: string }[] = [];
  const faqSection = content.split(/## Frequently Asked Questions/i)[1];
  if (!faqSection) return faqs;

  const blocks = faqSection.split(/### /);
  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;
    const lines = trimmed.split('\n');
    const question = lines[0].replace(/\*\*/g, '').trim();
    const answer = lines.slice(1).join(' ').trim();
    if (question && answer) {
      faqs.push({ q: question, a: answer });
    }
  }
  return faqs;
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const supabase = createStaticClient();

  const [{ data: post }, { data: allPosts }, bizCountResult] = await Promise.all([
    supabase
      .from('content_pages')
      .select('*')
      .eq('slug', slug)
      .eq('category', 'blog')
      .single(),
    supabase
      .from('content_pages')
      .select('slug, title, image_url, published_at')
      .eq('category', 'blog')
      .neq('slug', slug)
      .order('published_at', { ascending: false })
      .limit(3),
    supabase
      .from('businesses')
      .select('id', { count: 'exact', head: true }),
  ]);

  if (!post) notFound();

  const faqs = extractFAQs(post.content);
  const totalCompanies = bizCountResult.count || 168;

  const jsonLd: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.meta_description || post.excerpt || '',
      image: post.image_url || '/images/og-image.webp',
      datePublished: post.published_at,
      dateModified: post.updated_at || post.published_at,
      author: { '@type': 'Organization', name: 'Grease Trap Florida' },
      publisher: { '@type': 'Organization', name: 'Grease Trap Florida' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://greasetrapflorida.com' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://greasetrapflorida.com/blog' },
        { '@type': 'ListItem', position: 3, name: post.title },
      ],
    },
  ];

  if (faqs.length > 0) {
    jsonLd.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    });
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header Image */}
      {post.image_url && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden">
            <Image
              src={post.image_url}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 1280px"
              priority
            />
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center flex-wrap gap-1 text-sm">
            <li><a href="/" className="text-gray-400 hover:text-amber-600 transition-colors">Home</a></li>
            <li><ChevronRight className="w-3.5 h-3.5 text-gray-400" /></li>
            <li><a href="/blog" className="text-gray-400 hover:text-amber-600 transition-colors">Blog</a></li>
            <li><ChevronRight className="w-3.5 h-3.5 text-gray-400" /></li>
            <li className="text-gray-700 font-medium">{post.title}</li>
          </ol>
        </nav>

        <article className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-8">
            {post.published_at && (
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Published {formatDate(post.published_at)}
              </span>
            )}
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" />
              Grease Trap Florida Team
            </span>
          </div>

          <MarkdownContent content={post.content} />

          {/* FAQ Accordion */}
          {faqs.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {faqs.map((faq, i) => (
                  <details key={i} className="bg-white rounded-xl border border-gray-100 p-5 group">
                    <summary className="font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                      {faq.q}
                      <ChevronRight className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-90 shrink-0 ml-2" />
                    </summary>
                    <p className="mt-3 text-gray-600 leading-relaxed">{faq.a}</p>
                  </details>
                ))}
              </div>
            </section>
          )}
        </article>

        {/* Related Posts */}
        {(allPosts || []).length > 0 && (
          <section className="mt-12 max-w-3xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Posts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {(allPosts || []).map((related) => (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="block bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-amber-200 transition-all overflow-hidden"
                >
                  {related.image_url && (
                    <div className="relative h-32 w-full">
                      <Image
                        src={related.image_url}
                        alt={related.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">{related.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Bottom CTA */}
        <section className="mt-12 max-w-3xl">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Need grease trap service?</h3>
            <p className="text-gray-600 mb-4">
              Browse {totalCompanies} verified companies in our Florida directory.
            </p>
            <Link
              href="/companies"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg px-6 py-3 transition-colors"
            >
              Browse Companies <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}

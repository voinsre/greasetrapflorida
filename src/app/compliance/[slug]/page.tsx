import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { createStaticClient } from '@/lib/supabase/static';
import MarkdownContent from '@/components/content/MarkdownContent';
import { ChevronRight, MapPin } from 'lucide-react';

export async function generateStaticParams() {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from('content_pages')
    .select('slug')
    .eq('category', 'compliance');
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
    .eq('category', 'compliance')
    .single();
  if (!data) return {};
  const title = data.meta_title || data.title;
  return {
    title: { absolute: title },
    description: data.meta_description || '',
    openGraph: {
      title,
      description: data.meta_description || '',
      url: `https://greasetrapflorida.com/compliance/${slug}`,
      siteName: 'Grease Trap Florida',
      images: [{ url: data.image_url || '/images/og-image.webp', width: 1200, height: 630 }],
      type: 'article',
    },
  };
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

export default async function ComplianceSlugPage({ params }: Props) {
  const { slug } = await params;
  const supabase = createStaticClient();
  const { data: page } = await supabase
    .from('content_pages')
    .select('*')
    .eq('slug', slug)
    .eq('category', 'compliance')
    .single();

  if (!page) notFound();

  // Try to find matching county page for CTA
  const countySlug = slug.replace(/-county.*$/, '').replace(/-grease-trap.*$/, '');
  const { data: countyMatch } = await supabase
    .from('counties')
    .select('slug, name, business_count')
    .ilike('slug', `%${countySlug}%`)
    .gt('business_count', 0)
    .limit(1)
    .maybeSingle();

  const faqs = extractFAQs(page.content);

  const jsonLd: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: page.title,
      description: page.meta_description || page.excerpt || '',
      image: page.image_url || '/images/og-image.webp',
      datePublished: page.published_at,
      dateModified: page.updated_at || page.published_at,
      author: { '@type': 'Organization', name: 'Grease Trap Florida' },
      publisher: { '@type': 'Organization', name: 'Grease Trap Florida' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://greasetrapflorida.com' },
        { '@type': 'ListItem', position: 2, name: 'Compliance', item: 'https://greasetrapflorida.com/compliance' },
        { '@type': 'ListItem', position: 3, name: page.title },
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
      {page.image_url && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden">
            <Image
              src={page.image_url}
              alt={page.title}
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
            <li><a href="/compliance" className="text-gray-400 hover:text-amber-600 transition-colors">Compliance</a></li>
            <li><ChevronRight className="w-3.5 h-3.5 text-gray-400" /></li>
            <li className="text-gray-700 font-medium">{page.title}</li>
          </ol>
        </nav>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{page.title}</h1>

        {/* County CTA */}
        {countyMatch && (
          <Link
            href={`/county/${countyMatch.slug}`}
            className="mb-8 flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 hover:bg-amber-100 transition-colors"
          >
            <MapPin className="w-5 h-5 text-amber-600 shrink-0" />
            <span className="font-medium text-amber-800">
              Find Services in {countyMatch.name} County ({countyMatch.business_count} companies) &rarr;
            </span>
          </Link>
        )}

        <article>
          <MarkdownContent content={page.content} />
        </article>

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
      </div>
    </>
  );
}

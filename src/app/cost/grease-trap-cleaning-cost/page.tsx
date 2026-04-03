import { notFound } from 'next/navigation';
import Image from 'next/image';
import type { Metadata } from 'next';
import { createStaticClient } from '@/lib/supabase/static';
import MarkdownContent from '@/components/content/MarkdownContent';
import { ChevronRight } from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from('content_pages')
    .select('meta_title, meta_description, image_url')
    .eq('slug', 'grease-trap-cleaning-cost-florida')
    .single();
  if (!data) return { title: { absolute: 'Grease Trap Cleaning Cost Florida' } };
  return {
    title: { absolute: data.meta_title || 'Grease Trap Cleaning Cost Florida' },
    description: data.meta_description || '',
    openGraph: {
      title: data.meta_title || 'Grease Trap Cleaning Cost Florida',
      description: data.meta_description || '',
      url: 'https://greasetrapflorida.com/cost/grease-trap-cleaning-cost',
      siteName: 'Grease Trap Florida',
      images: [{ url: data.image_url || '/images/og-image.webp', width: 1200, height: 630 }],
      type: 'article',
    },
  };
}

function extractHeadings(content: string): { id: string; text: string }[] {
  const headings: { id: string; text: string }[] = [];
  const lines = content.split('\n');
  for (const line of lines) {
    const match = line.match(/^## (.+)/);
    if (match) {
      const text = match[1].trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      headings.push({ id, text });
    }
  }
  return headings;
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

export default async function CostGuidePage() {
  const supabase = createStaticClient();
  const { data: page } = await supabase
    .from('content_pages')
    .select('*')
    .eq('slug', 'grease-trap-cleaning-cost-florida')
    .single();

  if (!page) notFound();

  const headings = extractHeadings(page.content);
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
        { '@type': 'ListItem', position: 2, name: 'Cost', item: 'https://greasetrapflorida.com/cost' },
        { '@type': 'ListItem', position: 3, name: 'Grease Trap Cleaning Cost' },
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
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center flex-wrap gap-1 text-sm">
            <li><a href="/" className="text-gray-400 hover:text-amber-600 transition-colors">Home</a></li>
            <li><ChevronRight className="w-3.5 h-3.5 text-gray-400" /></li>
            <li><a href="/cost" className="text-gray-400 hover:text-amber-600 transition-colors">Cost</a></li>
            <li><ChevronRight className="w-3.5 h-3.5 text-gray-400" /></li>
            <li className="text-gray-700 font-medium">Grease Trap Cleaning Cost</li>
          </ol>
        </nav>

        <div className="flex flex-col lg:flex-row gap-10">
          <article className="flex-1 min-w-0">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{page.title}</h1>
            <MarkdownContent content={page.content} />

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

          {headings.length > 2 && (
            <aside className="hidden lg:block w-72 shrink-0">
              <div className="sticky top-24 bg-gray-50 rounded-xl p-5">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wider">
                  Table of Contents
                </h3>
                <nav>
                  <ul className="space-y-2">
                    {headings.map((h) => (
                      <li key={h.id}>
                        <a href={`#${h.id}`} className="text-sm text-gray-500 hover:text-amber-600 transition-colors block">
                          {h.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </aside>
          )}
        </div>
      </div>
    </>
  );
}

import type { MetadataRoute } from 'next';
import { createStaticClient } from '@/lib/supabase/static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createStaticClient();
  const now = new Date();
  const BASE = 'https://greasetrapflorida.com';

  // Fetch all dynamic slugs in parallel
  const [
    { data: businesses },
    { data: counties },
    { data: cities },
    { data: serviceTypes },
    { data: guides },
    { data: compliance },
    { data: blogs },
  ] = await Promise.all([
    supabase.from('businesses').select('slug'),
    supabase.from('counties').select('slug').gt('business_count', 1),
    supabase.from('cities').select('slug').gt('business_count', 0),
    supabase.from('service_types').select('slug'),
    supabase.from('content_pages').select('slug').eq('category', 'guide'),
    supabase.from('content_pages').select('slug').eq('category', 'compliance'),
    supabase.from('content_pages').select('slug').eq('category', 'blog'),
  ]);

  const entries: MetadataRoute.Sitemap = [];

  // Static pages
  const staticPages: { url: string; priority: number }[] = [
    { url: '/', priority: 1.0 },
    { url: '/companies', priority: 0.9 },
    { url: '/county', priority: 0.9 },
    { url: '/cities', priority: 0.8 },
    { url: '/services', priority: 0.9 },
    { url: '/compliance', priority: 0.9 },
    { url: '/guides', priority: 0.9 },
    { url: '/blog', priority: 0.8 },
    { url: '/cost', priority: 0.8 },
    { url: '/compare', priority: 0.6 },
    { url: '/about', priority: 0.6 },
    { url: '/contact', priority: 0.6 },
    { url: '/privacy', priority: 0.3 },
    { url: '/claim-listing', priority: 0.6 },
    { url: '/advertise', priority: 0.6 },
    { url: '/get-quotes', priority: 0.7 },
  ];

  for (const page of staticPages) {
    entries.push({
      url: `${BASE}${page.url}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: page.priority,
    });
  }

  // Business listings
  for (const b of businesses || []) {
    entries.push({
      url: `${BASE}/companies/${b.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    });
  }

  // Counties
  for (const c of counties || []) {
    entries.push({
      url: `${BASE}/county/${c.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  }

  // Cities
  for (const c of cities || []) {
    entries.push({
      url: `${BASE}/city/${c.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  }

  // Services
  for (const s of serviceTypes || []) {
    entries.push({
      url: `${BASE}/services/${s.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  }

  // Guides
  for (const g of guides || []) {
    entries.push({
      url: `${BASE}/guides/${g.slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    });
  }

  // Compliance
  for (const c of compliance || []) {
    entries.push({
      url: `${BASE}/compliance/${c.slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    });
  }

  // Blog
  for (const b of blogs || []) {
    entries.push({
      url: `${BASE}/blog/${b.slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    });
  }

  // Cost guide
  entries.push({
    url: `${BASE}/cost/grease-trap-cleaning-cost`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  });

  // Chapter 62-705 full regulation page
  entries.push({
    url: `${BASE}/compliance/chapter-62-705`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  });

  return entries;
}

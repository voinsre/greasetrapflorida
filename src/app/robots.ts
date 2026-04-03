import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/compare'],
      },
    ],
    sitemap: 'https://greasetrapflorida.com/sitemap.xml',
  };
}

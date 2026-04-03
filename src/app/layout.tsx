import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    absolute: 'Find Grease Trap Services in Florida | GreaseTrapFlorida.com',
  },
  description:
    'Compare licensed grease trap cleaning companies across 46 Florida counties. DEP license verified, Chapter 62-705 compliant directory with free quotes.',
  openGraph: {
    title: 'Find Grease Trap Services in Florida | GreaseTrapFlorida.com',
    description:
      'Compare licensed grease trap cleaning companies across 46 Florida counties. DEP license verified, Chapter 62-705 compliant directory with free quotes.',
    url: 'https://greasetrapflorida.com',
    siteName: 'Grease Trap Florida',
    images: [{ url: '/images/og-image.webp', width: 1200, height: 630 }],
    type: 'website',
  },
  metadataBase: new URL('https://greasetrapflorida.com'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${inter.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

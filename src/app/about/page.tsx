import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { Shield, Users, BookOpen, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: { absolute: 'About Grease Trap Florida' },
  description:
    'Grease Trap Florida is Florida\'s most comprehensive grease trap service directory. 168 verified companies across 22 counties for Chapter 62-705 compliance.',
  openGraph: {
    title: 'About Grease Trap Florida',
    description: 'Florida\'s most comprehensive grease trap service directory.',
    url: 'https://greasetrapflorida.com/about',
    siteName: 'Grease Trap Florida',
    images: [{ url: '/images/og-image.webp', width: 1200, height: 630 }],
    type: 'website',
  },
  alternates: {
    canonical: 'https://greasetrapflorida.com/about',
  },
};

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Image */}
      <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden mb-8">
        <Image
          src="/images/about-page.webp"
          alt="About Grease Trap Florida"
          fill
          className="object-cover"
          sizes="(max-width: 1280px) 100vw, 1280px"
          priority
        />
      </div>

      <article className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">About Grease Trap Florida</h1>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-500" />
            What We Are
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Grease Trap Florida is Florida&apos;s most comprehensive directory of grease trap service providers.
            We connect restaurant owners, food service managers, and commercial kitchen operators with licensed,
            verified grease trap cleaning companies across the state. Our directory covers everything from routine
            cleaning and pumping to emergency overflow service, grease interceptor installation, and FOG compliance consulting.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-500" />
            Why We Built This
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Florida&apos;s Chapter 62-705 (Grease Waste Removal and Disposal) became effective on December 7, 2025,
            creating new DEP licensing requirements for grease waste haulers and documentation requirements for
            food service establishments. This regulation affects every restaurant, hotel kitchen, school cafeteria,
            hospital kitchen, and food truck in the state.
          </p>
          <p className="text-gray-700 leading-relaxed">
            When this regulation took effect, there was no centralized resource helping Florida business owners
            find compliant service providers. Restaurant owners were left searching through generic directories
            that mixed grease trap companies with unrelated plumbing and septic services. We built Grease Trap
            Florida to solve that problem — a focused, verified directory specifically for grease trap services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-amber-500" />
            Our Data
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Every listing in our directory has been individually confirmed as a grease trap service provider.
            We started with over 5,500 raw business records from across Florida, then applied rigorous filtering,
            deduplication, website verification, and manual review to arrive at our current database of 168
            verified companies across 22 counties and 36 cities. Our content methodology is based on primary sources including the Florida Administrative Code Chapter 62-705 and county-specific FOG ordinances.
          </p>
          <div className="bg-gray-50 rounded-xl p-5 grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">168</div>
              <div className="text-sm text-gray-500">Verified Companies</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">22</div>
              <div className="text-sm text-gray-500">Counties</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">36</div>
              <div className="text-sm text-gray-500">Cities</div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Our Verification Process</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            A business earns the verified badge in our directory when it meets our confirmation criteria:
          </p>
          <ul className="list-disc ml-6 space-y-2 text-gray-700">
            <li>Confirmed to offer grease trap services (not just general plumbing or septic)</li>
            <li>Active, reachable business with a working phone number</li>
            <li>Verified website (live and accessible) or established Google Maps presence</li>
            <li>Positive customer ratings and reviews</li>
            <li>Located in and serving Florida communities</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Why Trust Us</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            We built Grease Trap Florida to be the most reliable source of grease trap service information in the state.
          </p>
          <ul className="list-disc ml-6 space-y-2 text-gray-700">
            <li>We verified 168 businesses across 22 Florida counties using Google Maps data, website analysis, and service confirmation</li>
            <li>Our compliance guides are based on Florida Administrative Code Chapter 62-705 and county-specific FOG ordinances</li>
            <li>Our directory only lists confirmed grease trap service providers — not general plumbing or septic companies</li>
            <li>Every guide references specific Florida regulations and county codes</li>
            <li>We update our data regularly as the DEP licensing registry develops</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-500" />
            Our Compliance Resources
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Beyond the directory, we publish comprehensive <Link href="/guides" className="text-amber-600 hover:text-amber-700 underline">guides</Link> on
            grease trap compliance, costs, and maintenance. Our <Link href="/compliance" className="text-amber-600 hover:text-amber-700 underline">compliance hub</Link> covers
            Chapter 62-705 requirements, county-specific FOG ordinances, manifest documentation, and penalty
            information. Our <Link href="/blog" className="text-amber-600 hover:text-amber-700 underline">blog</Link> provides
            ongoing tips and industry updates for Florida food service professionals.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Get Your Business Listed</h2>
          <p className="text-gray-700 leading-relaxed">
            If you operate a grease trap service company in Florida and want to update your listing or claim your
            business profile, visit our <Link href="/claim-listing" className="text-amber-600 hover:text-amber-700 underline">claim listing page</Link>.
            Claiming your listing allows you to verify ownership, update your business information, and earn a
            verified badge. For premium placement and additional visibility, check out
            our <Link href="/advertise" className="text-amber-600 hover:text-amber-700 underline">advertising options</Link>.
          </p>
        </section>
      </article>
    </div>
  );
}

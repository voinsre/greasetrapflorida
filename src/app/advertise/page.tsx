import Image from 'next/image';
import type { Metadata } from 'next';
import { Star, TrendingUp, Award, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: { absolute: 'Advertise - Grease Trap Florida' },
  description:
    'Get your grease trap company featured on Florida\'s top directory. Priority placement, highlighted listing, and verified badge for $49/month.',
  openGraph: {
    title: 'Advertise - Grease Trap Florida',
    description: 'Get featured on Florida\'s top grease trap directory for $49/month.',
    url: 'https://greasetrapflorida.com/advertise',
    siteName: 'Grease Trap Florida',
    images: [{ url: '/images/og-image.webp', width: 1200, height: 630 }],
    type: 'website',
  },
};

const FAQS = [
  {
    q: 'What does a featured listing include?',
    a: 'Featured listings receive a highlighted amber badge, priority placement at the top of search results, an enhanced card design with amber border, and a verified badge. Your listing stands out in county, city, and service type pages.',
  },
  {
    q: 'Can I cancel my featured listing?',
    a: 'Yes, you can cancel anytime. There are no long-term contracts or cancellation fees. Your listing remains in the directory as a standard listing after cancellation.',
  },
  {
    q: 'How quickly does my featured listing go live?',
    a: 'Featured listings are activated within 24 hours of payment confirmation. You\'ll receive an email confirmation once your listing has been upgraded.',
  },
  {
    q: 'Do I need to claim my listing first?',
    a: 'We recommend claiming your listing before upgrading to featured so you can verify and update your business information. However, you can purchase a featured listing first and claim afterward.',
  },
];

export default function AdvertisePage() {
  const stripeLink = process.env.NEXT_PUBLIC_STRIPE_FEATURED_LINK;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Image */}
      <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden mb-8">
        <Image
          src="/images/advertise-page.webp"
          alt="Advertise on Grease Trap Florida"
          fill
          className="object-cover"
          sizes="(max-width: 1280px) 100vw, 1280px"
          priority
        />
      </div>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          Get Featured on Grease Trap Florida
        </h1>

        {/* Value Proposition */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 text-center">
            <Award className="w-8 h-8 text-amber-500 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900">Featured Badge</h3>
            <p className="text-sm text-gray-500 mt-1">Amber badge and highlighted card that stands out</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 text-center">
            <TrendingUp className="w-8 h-8 text-amber-500 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900">Priority Placement</h3>
            <p className="text-sm text-gray-500 mt-1">Appear first in county, city, and service searches</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 text-center">
            <Star className="w-8 h-8 text-amber-500 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900">Verified Status</h3>
            <p className="text-sm text-gray-500 mt-1">Verified badge builds trust with potential customers</p>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-gray-50 rounded-xl p-6 mb-10 text-center">
          <p className="text-lg text-gray-700">
            <strong>168</strong> verified companies &bull; <strong>22</strong> counties &bull; thousands of Florida restaurant owners searching
          </p>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-xl border-2 border-amber-300 shadow-md p-8 mb-10 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Featured Listing</h2>
          <div className="text-4xl font-bold text-amber-600 mb-1">$49<span className="text-lg text-gray-500 font-normal">/month</span></div>
          <p className="text-gray-500 mb-6">Cancel anytime — no long-term contracts</p>

          {stripeLink ? (
            <a
              href={stripeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg px-8 py-4 text-lg transition-colors"
            >
              Get Featured Now
            </a>
          ) : (
            <div className="inline-flex items-center gap-2 bg-gray-300 text-gray-600 font-semibold rounded-lg px-8 py-4 text-lg cursor-not-allowed">
              Coming Soon
            </div>
          )}
        </div>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
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
      </div>
    </div>
  );
}

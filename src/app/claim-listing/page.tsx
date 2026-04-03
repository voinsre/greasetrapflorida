import type { Metadata } from 'next';
import { CheckCircle, Shield, Edit, Star } from 'lucide-react';
import ClaimForm from '@/components/forms/ClaimForm';

export const metadata: Metadata = {
  title: { absolute: 'Claim Your Listing - Grease Trap Florida' },
  description:
    'Claim your grease trap company listing on Grease Trap Florida. Verify ownership, update your business info, and earn a verified badge.',
  openGraph: {
    title: 'Claim Your Listing - Grease Trap Florida',
    description: 'Claim and verify your grease trap company listing.',
    url: 'https://greasetrapflorida.com/claim-listing',
    siteName: 'Grease Trap Florida',
    images: [{ url: '/images/og-image.webp', width: 1200, height: 630 }],
    type: 'website',
  },
  alternates: {
    canonical: 'https://greasetrapflorida.com/claim-listing',
  },
};

export default function ClaimListingPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        Claim Your Business Listing
      </h1>
      <p className="text-gray-600 leading-relaxed max-w-2xl mb-8">
        Own a grease trap service company listed in our directory? Claiming your listing lets you
        verify ownership, update your business information, and earn a verified badge that builds
        trust with potential customers.
      </p>

      {/* Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <Shield className="w-6 h-6 text-amber-500 mb-2" />
          <h2 className="font-semibold text-gray-900">Verify Ownership</h2>
          <p className="text-sm text-gray-500 mt-1">Confirm you are the owner or authorized representative of the business.</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <Edit className="w-6 h-6 text-amber-500 mb-2" />
          <h2 className="font-semibold text-gray-900">Update Information</h2>
          <p className="text-sm text-gray-500 mt-1">Correct phone, email, services, hours, and description on your listing.</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <Star className="w-6 h-6 text-amber-500 mb-2" />
          <h2 className="font-semibold text-gray-900">Get Verified Badge</h2>
          <p className="text-sm text-gray-500 mt-1">Earn the verified checkmark that signals trust to customers.</p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-xl">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Submit Your Claim</h2>
        <ClaimForm />
      </div>
    </div>
  );
}

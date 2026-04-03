import type { Metadata } from 'next';
import { Mail, MessageCircle } from 'lucide-react';
import ContactForm from '@/components/forms/ContactForm';

export const metadata: Metadata = {
  title: { absolute: 'Contact Grease Trap Florida' },
  description:
    'Have questions about our directory or Florida grease trap compliance? Contact the Grease Trap Florida team.',
  openGraph: {
    title: 'Contact Grease Trap Florida',
    description: 'Contact the Grease Trap Florida team.',
    url: 'https://greasetrapflorida.com/contact',
    siteName: 'Grease Trap Florida',
    images: [{ url: '/images/og-image.webp', width: 1200, height: 630 }],
    type: 'website',
  },
  alternates: {
    canonical: 'https://greasetrapflorida.com/contact',
  },
};

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Contact Us</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Form */}
        <div className="lg:col-span-2">
          <ContactForm />
        </div>

        {/* Info */}
        <div>
          <div className="bg-gray-50 rounded-xl p-6">
            <MessageCircle className="w-8 h-8 text-amber-500 mb-4" />
            <h2 className="text-lg font-bold text-gray-900 mb-3">Get in Touch</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Have questions about our directory or Florida grease trap compliance? We&apos;re here to help.
              Whether you need assistance with a business listing, have a partnership inquiry, or want to
              learn more about advertising, we&apos;d love to hear from you.
            </p>
            <div className="flex items-center gap-3 text-gray-700">
              <Mail className="w-5 h-5 text-amber-500 shrink-0" />
              <a href="mailto:hello@greasetrapflorida.com" className="text-amber-600 hover:text-amber-700 underline">
                hello@greasetrapflorida.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

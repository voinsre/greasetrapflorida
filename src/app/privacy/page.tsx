import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: 'Privacy Policy - Grease Trap Florida' },
  description:
    'Privacy policy for Grease Trap Florida. Learn how we collect, use, and protect your personal information.',
  openGraph: {
    title: 'Privacy Policy - Grease Trap Florida',
    description: 'Privacy policy for Grease Trap Florida.',
    url: 'https://greasetrapflorida.com/privacy',
    siteName: 'Grease Trap Florida',
    images: [{ url: '/images/og-image.webp', width: 1200, height: 630 }],
    type: 'website',
  },
  alternates: {
    canonical: 'https://greasetrapflorida.com/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: April 4, 2026</p>

      <div className="space-y-8 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">1. Information We Collect</h2>
          <p className="mb-3">When you use Grease Trap Florida, we may collect the following information:</p>
          <ul className="list-disc ml-6 space-y-2">
            <li><strong>Contact Form Submissions:</strong> Name, email address, subject, and message content when you use our contact form.</li>
            <li><strong>Lead/Quote Requests:</strong> Name, email, phone number, establishment type, trap size, urgency, and message details when you request quotes from service providers.</li>
            <li><strong>Business Claim Requests:</strong> Name, email, phone number, and role when business owners claim their listings.</li>
            <li><strong>Usage Data:</strong> We may collect anonymous analytics data including pages visited, time spent, and referral sources.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">2. How We Use Your Information</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>To connect you with grease trap service providers in your area</li>
            <li>To respond to your contact form inquiries</li>
            <li>To process business listing claims and updates</li>
            <li>To improve our directory and user experience</li>
            <li>To send relevant service notifications (only if you opt in)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">3. Cookies and Tracking</h2>
          <p>
            We use essential cookies to ensure our website functions properly. We may also use analytics cookies
            (such as Google Analytics) to understand how visitors interact with our site. These cookies collect
            anonymous usage data and do not personally identify you. You can disable cookies in your browser
            settings at any time.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">4. Third-Party Services</h2>
          <p className="mb-3">We use the following third-party services that may process your data:</p>
          <ul className="list-disc ml-6 space-y-2">
            <li><strong>Supabase:</strong> Database hosting for storing form submissions and directory data. Data is stored securely in cloud infrastructure.</li>
            <li><strong>Google Maps:</strong> Map embeds on business listing pages. Google&apos;s privacy policy applies to map interactions.</li>
            <li><strong>Resend:</strong> Email delivery service for sending form submission notifications to our team.</li>
            <li><strong>Vercel:</strong> Website hosting and content delivery. Vercel may collect anonymous performance metrics.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">5. Data Retention</h2>
          <p>
            We retain form submission data (leads, contact messages, and claims) for up to 24 months to ensure
            we can follow up on service requests and business claims. Anonymous analytics data may be retained
            indefinitely for trend analysis. You may request deletion of your personal data at any time by
            contacting us.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">6. Data Security</h2>
          <p>
            We implement reasonable security measures to protect your personal information, including encrypted
            database connections, secure form submissions over HTTPS, and restricted access to personal data.
            However, no method of electronic storage is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">7. Your Rights</h2>
          <p className="mb-3">You have the right to:</p>
          <ul className="list-disc ml-6 space-y-2">
            <li>Request a copy of the personal data we hold about you</li>
            <li>Request correction of inaccurate personal data</li>
            <li>Request deletion of your personal data</li>
            <li>Opt out of any marketing communications</li>
            <li>Withdraw consent for data processing at any time</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">8. Children&apos;s Privacy</h2>
          <p>
            Our website is not intended for children under the age of 13. We do not knowingly collect personal
            information from children. If you believe we have collected data from a child, please contact us
            immediately.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">9. Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. Any changes will be posted on this page with
            an updated revision date. We encourage you to review this policy periodically.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">10. Contact Us</h2>
          <p>
            If you have any questions about this privacy policy or wish to exercise your data rights,
            please contact us at{' '}
            <a href="mailto:hello@greasetrapflorida.com" className="text-amber-600 hover:text-amber-700 underline">
              hello@greasetrapflorida.com
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}

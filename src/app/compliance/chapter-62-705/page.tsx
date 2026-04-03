import Link from 'next/link';
import type { Metadata } from 'next';
import { ChevronRight, ExternalLink, BookOpen, Scale } from 'lucide-react';

export const metadata: Metadata = {
  title: { absolute: 'Chapter 62-705 F.A.C. \u2014 Florida Grease Waste Law' },
  description:
    'Full text of Florida Chapter 62-705 governing grease waste removal, transport, and disposal. Requirements for restaurants, haulers, and processing facilities.',
  openGraph: {
    title: 'Chapter 62-705 F.A.C. \u2014 Florida Grease Waste Law',
    description: 'Full text of Florida Chapter 62-705 governing grease waste removal and disposal.',
    url: 'https://greasetrapflorida.com/compliance/chapter-62-705',
    siteName: 'Grease Trap Florida',
    images: [{ url: '/images/og-image.webp', width: 1200, height: 630 }],
    type: 'article',
  },
};

function PlainEnglish({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg my-6">
      <p className="text-sm font-semibold text-amber-800 mb-1">What This Means</p>
      <p className="text-sm text-amber-900 leading-relaxed">{children}</p>
    </div>
  );
}

export default function Chapter62705Page() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Legislation',
      name: 'Chapter 62-705 F.A.C. \u2014 Grease Waste Removal and Disposal',
      legislationIdentifier: '62-705',
      legislationJurisdiction: 'Florida, United States',
      legislationType: 'Administrative Code',
      datePublished: '2025-12-07',
      legislationDate: '2025-12-07',
      description: 'Florida Administrative Code governing grease waste removal, transport, and disposal requirements for food service establishments, haulers, and processing facilities.',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://greasetrapflorida.com' },
        { '@type': 'ListItem', position: 2, name: 'Compliance', item: 'https://greasetrapflorida.com/compliance' },
        { '@type': 'ListItem', position: 3, name: 'Chapter 62-705' },
      ],
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Dark Hero */}
      <section className="bg-[#1A1A1A] -mt-16 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-1 text-sm">
              <li><a href="/" className="text-gray-400 hover:text-amber-400 transition-colors">Home</a></li>
              <li className="text-gray-600 mx-1">/</li>
              <li><a href="/compliance" className="text-gray-400 hover:text-amber-400 transition-colors">Compliance</a></li>
              <li className="text-gray-600 mx-1">/</li>
              <li className="text-gray-300 font-medium">Chapter 62-705</li>
            </ol>
          </nav>
          <div className="flex items-start gap-3">
            <Scale className="w-8 h-8 text-amber-500 shrink-0 mt-1 hidden sm:block" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Florida Chapter 62-705 F.A.C.
              </h1>
              <p className="text-xl text-amber-400 font-medium mt-1">Grease Waste Removal and Disposal</p>
              <p className="mt-3 text-gray-300 max-w-3xl leading-relaxed">
                Full text of the Florida Administrative Code governing grease waste management.
                Effective December 7, 2025. Administered by the Florida Department of Environmental Protection.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Guide CTA */}
        <Link
          href="/compliance/chapter-62-705-guide"
          className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 mb-10 hover:bg-amber-100 transition-colors"
        >
          <BookOpen className="w-5 h-5 text-amber-600 shrink-0" />
          <span className="text-amber-800 font-medium text-sm">
            Need help understanding these requirements? Read our plain-English compliance guide &rarr;
          </span>
        </Link>

        {/* Table of Contents */}
        <nav className="bg-gray-50 rounded-xl p-5 mb-10">
          <h2 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wider">Sections</h2>
          <ul className="space-y-2 text-sm">
            <li><a href="#62-705-200" className="text-amber-600 hover:text-amber-700">62-705.200 &mdash; Definitions</a></li>
            <li><a href="#62-705-300" className="text-amber-600 hover:text-amber-700">62-705.300 &mdash; Grease Waste Hauler Requirements</a></li>
            <li><a href="#62-705-400" className="text-amber-600 hover:text-amber-700">62-705.400 &mdash; Procedures for Disposal Facility Certifications</a></li>
          </ul>
        </nav>

        {/* SECTION 62-705.200 — DEFINITIONS */}
        <section id="62-705-200" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            62-705.200 &mdash; Definitions
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            The following terms, as used in this chapter, are defined below. Terms not defined in this section shall have the meanings given in Sections 403.0741 and 403.703, F.S.
          </p>

          <div className="space-y-4 text-gray-700 leading-relaxed">
            <div className="pl-4 border-l-2 border-gray-200">
              <p><strong>(1) &ldquo;Clean&rdquo;</strong> means the removal of grease waste from grease interceptors or grease traps while keeping equipment in an operational condition.</p>
            </div>
            <div className="pl-4 border-l-2 border-gray-200">
              <p><strong>(2) &ldquo;Disposal&rdquo;</strong> means the transfer of grease waste to an authorized facility for final processing or disposition.</p>
            </div>
            <div className="pl-4 border-l-2 border-gray-200">
              <p><strong>(3) &ldquo;Disposal facility&rdquo;</strong> means a permitted waste management facility authorized to receive grease waste materials for processing or final disposition.</p>
            </div>
            <div className="pl-4 border-l-2 border-gray-200">
              <p><strong>(4) &ldquo;Hauler&rdquo;</strong> means a person who removes and transports grease waste commercially from grease interceptors or grease traps.</p>
            </div>
            <div className="pl-4 border-l-2 border-gray-200">
              <p><strong>(5) &ldquo;Inspecting entity&rdquo;</strong> means a state political subdivision with authority to inspect grease interceptors, grease traps, or grease waste transporters.</p>
            </div>
            <div className="pl-4 border-l-2 border-gray-200">
              <p><strong>(6) &ldquo;Self-cleaner&rdquo;</strong> means an originator who: (a) removes grease waste from tanks of 55 gallons or smaller located at their own establishment; (b) dewaters the material; (c) places it in containers; and (d) transports it to an authorized disposal facility or certified grease waste processing facility.</p>
            </div>
          </div>

          <PlainEnglish>
            These definitions establish who&apos;s who in the grease waste system. If you run a restaurant, you&apos;re an &ldquo;originator.&rdquo;
            The company that pumps your trap is a &ldquo;hauler.&rdquo; If you have a very small trap (55 gallons or less)
            and clean it yourself, you&apos;re a &ldquo;self-cleaner&rdquo; with fewer requirements &mdash; but you still need to properly
            dispose of the waste at an authorized facility.
          </PlainEnglish>

          <p className="text-xs text-gray-400 mt-4">
            Rulemaking Authority: 403.0741, 403.707 F.S. Law Implemented: 403.031, 403.0741, 403.703 F.S. History: New 12-7-25.
          </p>
        </section>

        {/* SECTION 62-705.300 — HAULER REQUIREMENTS */}
        <section id="62-705-300" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            62-705.300 &mdash; Grease Waste Hauler Requirements
          </h2>

          <div className="space-y-4 text-gray-700 leading-relaxed">
            <div className="pl-4 border-l-2 border-gray-200">
              <p><strong>(1) Applicability.</strong> These requirements apply to haulers as defined in 62-705.200(4). Self-cleaners as defined in 62-705.200(6) need not comply with the licensure requirements of this section but must follow all other rule provisions and statutory requirements under Section 403.0741, F.S.</p>
            </div>

            <div className="pl-4 border-l-2 border-gray-200">
              <p><strong>(2) License Application and Renewal.</strong> Haulers must submit &ldquo;Form 62-705.300(2) Application for Grease Waste Hauler License, effective date December 2025&rdquo; to obtain or renew licenses. Upon receipt of a complete application, the Department shall issue a license valid until April 1 of the following year. Existing haulers have 180 days from the rule&apos;s effective date to apply. Annual renewals are due by March 1. New haulers must apply at least 30 days before beginning operations.</p>
            </div>

            <div className="pl-4 border-l-2 border-gray-200">
              <p><strong>(3) Service Documentation.</strong> Haulers must document removal and disposal using &ldquo;Form 62-705.300(3) Grease Waste Service Manifest (Service Manifest), effective date December 2025.&rdquo;</p>
            </div>

            <div className="pl-4 border-l-2 border-gray-200">
              <p><strong>(4) License Number Requirement.</strong> Any hauler engaged in collection and removal of grease waste must list the hauler license number obtained from the Department on the Service Manifest form.</p>
            </div>

            <div className="pl-4 border-l-2 border-gray-200">
              <p><strong>(5) Record Retention.</strong> Haulers must retain completed Service Manifests at their place of business in electronic or hardcopy format for one year from the date of disposal. Records must be available during normal business hours for inspection, or provided within five business days if requested.</p>
            </div>

            <div className="pl-4 border-l-2 border-gray-200">
              <p><strong>(6) Administrative Fines.</strong> An inspecting entity inspecting a grease interceptor or grease trap is authorized to impose an administrative fine not to exceed $250 for each failure to clean.</p>
            </div>

            <div className="pl-4 border-l-2 border-gray-200">
              <p><strong>(7) Enforcement.</strong> Licensed haulers failing to comply with these requirements are subject to denial, suspension, or revocation of their license, as well as penalties under applicable state law or local ordinances per Section 403.0741(5), F.S.</p>
            </div>
          </div>

          <PlainEnglish>
            Every grease waste hauler in Florida must now hold a DEP license. They must use an official Service Manifest form for
            every pump-out (this is your proof of compliant service). Haulers must keep records for one year and show them on
            request. If your trap hasn&apos;t been cleaned when an inspector checks, you can be fined up to $250 per violation.
            Haulers who don&apos;t follow the rules can lose their license. If you clean your own small trap (55 gallons or less),
            you don&apos;t need a license but must still properly dispose of the waste.
          </PlainEnglish>

          <p className="text-xs text-gray-400 mt-4">
            Rulemaking Authority: 403.0741 F.S. Law Implemented: 403.0741 F.S. History: New 12-7-25.
          </p>
        </section>

        {/* SECTION 62-705.400 — DISPOSAL FACILITY CERTIFICATIONS */}
        <section id="62-705-400" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            62-705.400 &mdash; Procedures for Disposal Facility Certifications
          </h2>

          <div className="space-y-4 text-gray-700 leading-relaxed">
            <div className="pl-4 border-l-2 border-gray-200">
              <p><strong>(1) Applicability.</strong> No person may construct or operate a grease waste disposal facility without a valid Department permit or certification. Existing facilities operating without proper authorization must apply for certification within one year of the rule&apos;s effective date. Facilities with valid permits under Chapters 62-701, 62-620, or 62-640 F.A.C. are exempt if their existing permit addresses grease waste storage, processing, or disposal.</p>
            </div>

            <div className="pl-4 border-l-2 border-gray-200">
              <p><strong>(2) Certification Requirements.</strong> Applications must be submitted on Form 62-705.400(2). Required documentation includes: applicant information; a site plan signed by a licensed professional engineer showing acreage, processing areas, surface water within 200 feet, and potable wells within 500 feet; a facility operations description covering all types of materials managed, expected daily volumes, processing methods, equipment specifications, maximum storage duration and capacity, and a contingency plan; a closure plan; and proof of land ownership or legal authorization.</p>
            </div>

            <div className="pl-4 border-l-2 border-gray-200">
              <p><strong>(3) Department Issuance.</strong> Upon determining information is accurate and complete, the Department issues a certification including the facility&apos;s address, contact information, and applicant details.</p>
            </div>

            <div className="pl-4 border-l-2 border-gray-200">
              <p><strong>(4) Certification Validity.</strong> Certifications remain valid for three years from issuance unless suspended or revoked under Section 403.087, F.S.</p>
            </div>

            <div className="pl-4 border-l-2 border-gray-200">
              <p><strong>(5) Renewal.</strong> Renewal applications are timely if submitted within 60 days before expiration.</p>
            </div>

            <div className="pl-4 border-l-2 border-gray-200">
              <p><strong>(6) Legal Status.</strong> Certifications constitute licenses under Sections 120.60 and 403.707, F.S., with revocation provisions under Rule 62-4.100, F.A.C.</p>
            </div>

            <div className="pl-4 border-l-2 border-gray-200">
              <p><strong>(7) General Provisions.</strong> Chapter 62-701, F.A.C. general solid waste provisions apply except where expressly modified by this chapter.</p>
            </div>

            <div className="pl-4 border-l-2 border-gray-200">
              <p><strong>(8) Operational Requirements.</strong> Personnel must be present during operational hours when waste is received. Facilities must cease accepting waste upon reaching maximum storage capacity. Incoming grease waste intended for disposal cannot be mixed with waste intended for recycling. Disposal, processing, or recycling must be completed within six months of receipt. Operations must control vectors and minimize odors per applicable F.A.C. rules.</p>
            </div>

            <div className="pl-4 border-l-2 border-gray-200">
              <p><strong>(9) Contingency Plan Requirements.</strong> Every certified facility must maintain a contingency plan addressing operational interruptions and emergencies (fires, explosions, natural disasters). The plan must include designated responsible persons, notification procedures for the Department and emergency responders, emergency procedures including firefighting equipment, shutdown procedures, and neighbor notification provisions. Facilities must maintain sufficient equipment to implement the plan with reserve equipment available within 24 hours of breakdown.</p>
            </div>

            <div className="pl-4 border-l-2 border-gray-200">
              <p><strong>(10) Recordkeeping and Reporting.</strong> Monthly records are required documenting grease waste volume in gallons, originator, county of origin, and final disposition. Records must be maintained for three years. Tank inspection reports must be maintained and provided to the Department upon request.</p>
            </div>

            <div className="pl-4 border-l-2 border-gray-200">
              <p><strong>(11) Closure Requirements.</strong> Owner/operator must notify the Department in writing 30 days before ceasing operations. No grease waste acceptance permitted after the closing date. Within 30 days after the final load, all waste must be removed or disposed per the approved closure plan.</p>
            </div>
          </div>

          <PlainEnglish>
            This section mostly applies to the facilities where grease waste is processed or disposed &mdash; not to restaurant owners directly.
            However, it matters to you because your hauler must take your grease waste to a properly certified facility.
            Ask your hauler where they dispose of waste &mdash; a legitimate hauler will be transparent about using a DEP-certified
            facility. This gives you confidence the entire chain of custody, from your trap to final disposal, is compliant.
          </PlainEnglish>

          <p className="text-xs text-gray-400 mt-4">
            Rulemaking Authority: 403.0741, 403.707 F.S. Law Implemented: 403.0741, 403.087, 403.707 F.S. History: New 12-7-25.
          </p>
        </section>

        {/* Bottom CTA */}
        <div className="border-t border-gray-200 pt-8 space-y-4">
          <Link
            href="/compliance/chapter-62-705-guide"
            className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl p-5 hover:bg-amber-100 transition-colors"
          >
            <BookOpen className="w-6 h-6 text-amber-600 shrink-0" />
            <div>
              <span className="font-semibold text-amber-800 block">Read Our Plain-English Compliance Guide</span>
              <span className="text-sm text-amber-700">Practical steps to comply with Chapter 62-705 for your business</span>
            </div>
          </Link>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/companies"
              className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg py-3 px-5 text-center transition-colors"
            >
              Find Licensed Haulers
            </Link>
            <Link
              href="/compliance"
              className="flex-1 bg-white border-2 border-gray-200 hover:border-amber-300 text-gray-700 font-semibold rounded-lg py-3 px-5 text-center transition-colors"
            >
              Browse All Compliance Resources
            </Link>
          </div>

          <p className="text-sm text-gray-500 mt-6">
            <strong>Official source:</strong>{' '}
            <a
              href="https://flrules.org/gateway/ChapterHome.asp?Chapter=62-705"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-600 hover:text-amber-700 inline-flex items-center gap-1"
            >
              Florida Administrative Code Chapter 62-705 <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </p>
        </div>
      </div>
    </>
  );
}

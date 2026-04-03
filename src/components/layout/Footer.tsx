import Link from 'next/link';

const COLUMNS = [
  {
    title: 'Browse',
    links: [
      { href: '/county', label: 'Counties' },
      { href: '/companies', label: 'Companies' },
      { href: '/services', label: 'Services' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { href: '/guides', label: 'Guides' },
      { href: '/blog', label: 'Blog' },
      { href: '/cost/grease-trap-cleaning-cost', label: 'Cost Guide' },
    ],
  },
  {
    title: 'Compliance',
    links: [
      { href: '/compliance', label: 'Compliance Hub' },
      { href: '/compliance/chapter-62-705-guide', label: 'Chapter 62-705 Guide' },
      { href: '/compliance/grease-waste-manifest', label: 'Grease Waste Manifest' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/about', label: 'About' },
      { href: '/contact', label: 'Contact' },
      { href: '/privacy', label: 'Privacy' },
      { href: '/claim-listing', label: 'Claim Listing' },
      { href: '/advertise', label: 'Advertise' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
                {col.title}
              </h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-amber-500 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-sm text-gray-500 text-center">
            &copy; 2026 Grease Trap Florida. Chapter 62-705 Compliant Directory.
          </p>
        </div>
      </div>
    </footer>
  );
}

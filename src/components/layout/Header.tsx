'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { href: '/county', label: 'Browse Counties' },
  { href: '/services', label: 'Services' },
  { href: '/compliance', label: 'Compliance' },
  { href: '/guides', label: 'Guides' },
];

export default function Header() {
  const pathname = usePathname();
  const heroMode = pathname === '/';
  const [scrolled, setScrolled] = useState(!heroMode);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!heroMode) {
      setScrolled(true);
      return;
    }

    function onScroll() {
      setScrolled(window.scrollY > 10);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [heroMode]);

  const solid = scrolled;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          solid
            ? 'bg-white border-b border-gray-100 shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <span
                className={`text-lg font-bold tracking-wider uppercase transition-colors duration-300 ${
                  solid ? 'text-gray-900' : 'text-white'
                }`}
              >
                GREASE TRAP FLORIDA
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors duration-300 ${
                    solid
                      ? 'text-gray-700 hover:text-amber-600'
                      : 'text-white/90 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/get-quotes"
                className="bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg px-6 py-2.5 text-sm transition-colors"
              >
                Get a Quote
              </Link>
            </nav>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className={`lg:hidden p-2 transition-colors ${
                solid ? 'text-gray-900' : 'text-white'
              }`}
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] bg-white">
          <div className="flex items-center justify-between h-16 px-4">
            <span className="text-lg font-bold tracking-wider uppercase text-gray-900">
              GREASE TRAP FLORIDA
            </span>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 text-gray-900"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="flex flex-col px-6 pt-8 gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-xl font-medium text-gray-900 hover:text-amber-600"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/get-quotes"
              onClick={() => setMobileOpen(false)}
              className="mt-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg px-6 py-3 text-center text-lg transition-colors"
            >
              Get a Quote
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}

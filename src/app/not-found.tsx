import Link from 'next/link';
import type { Metadata } from 'next';
import { Home, Search, BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: { absolute: 'Page Not Found - Grease Trap Florida' },
  description: 'The page you are looking for does not exist. Browse grease trap service companies, guides, and compliance resources across Florida.',
};

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <p className="text-7xl font-bold text-amber-500 mb-4">404</p>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Page Not Found</h1>
        <p className="text-gray-500 mb-8">
          The page you are looking for may have been moved or no longer exists. Try browsing our directory or guides instead.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/companies"
            className="bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg px-6 py-3 transition-colors inline-flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Browse Companies
          </Link>
          <Link
            href="/"
            className="bg-white border-2 border-gray-200 text-gray-700 hover:border-amber-500 hover:text-amber-600 font-semibold rounded-lg px-6 py-3 transition-colors inline-flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-400 mb-3">Helpful links</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <Link href="/guides" className="text-amber-600 hover:text-amber-700 inline-flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              Guides
            </Link>
            <Link href="/county" className="text-amber-600 hover:text-amber-700">Counties</Link>
            <Link href="/compliance" className="text-amber-600 hover:text-amber-700">Compliance</Link>
            <Link href="/contact" className="text-amber-600 hover:text-amber-700">Contact</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

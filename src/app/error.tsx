'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Something Went Wrong</h1>
        <p className="text-gray-500 mb-8">
          An unexpected error occurred. Please try again or return to the homepage.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={reset}
            className="bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg px-6 py-3 transition-colors inline-flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="bg-white border-2 border-gray-200 text-gray-700 hover:border-amber-500 hover:text-amber-600 font-semibold rounded-lg px-6 py-3 transition-colors inline-flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}

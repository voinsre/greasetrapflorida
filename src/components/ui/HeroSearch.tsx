'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Search } from 'lucide-react';

interface SearchOption {
  label: string;
  slug: string;
  type: 'county' | 'city';
  extra?: string;
}

export default function HeroSearch({
  counties,
  cities,
}: {
  counties: { name: string; slug: string }[];
  cities: { name: string; slug: string; county_name: string | null }[];
}) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const options = useMemo<SearchOption[]>(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    const results: SearchOption[] = [];
    for (const c of counties) {
      if (c.name.toLowerCase().includes(q)) {
        results.push({ label: c.name + ' County', slug: c.slug, type: 'county' });
      }
      if (results.length >= 8) break;
    }
    for (const c of cities) {
      if (c.name.toLowerCase().includes(q)) {
        results.push({
          label: c.name,
          slug: c.slug,
          type: 'city',
          extra: c.county_name || undefined,
        });
      }
      if (results.length >= 8) break;
    }
    return results.slice(0, 8);
  }, [query, counties, cities]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function navigate(opt: SearchOption) {
    setOpen(false);
    if (opt.type === 'county') {
      router.push(`/county/${opt.slug}`);
    } else {
      router.push(`/city/${opt.slug}`);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, options.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && activeIndex >= 0 && options[activeIndex]) {
      e.preventDefault();
      navigate(options[activeIndex]);
    }
  }

  return (
    <div ref={wrapperRef} className="relative w-full max-w-2xl mx-auto">
      <div className="flex items-center bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="flex items-center flex-1 px-4 py-3 lg:py-4">
          <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
              setActiveIndex(-1);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search by city or county..."
            className="ml-3 flex-1 text-gray-900 placeholder-gray-400 outline-none text-base lg:text-lg bg-transparent"
          />
        </div>
        <button
          onClick={() => {
            if (activeIndex >= 0 && options[activeIndex]) {
              navigate(options[activeIndex]);
            }
          }}
          className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 lg:px-8 py-3 lg:py-4 transition-colors text-base lg:text-lg"
        >
          <span className="hidden sm:inline">Search</span>
          <Search className="w-5 h-5 sm:hidden" />
        </button>
      </div>
      {open && options.length > 0 && (
        <ul className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-10">
          {options.map((opt, i) => (
            <li key={`${opt.type}-${opt.slug}`}>
              <button
                onClick={() => navigate(opt)}
                onMouseEnter={() => setActiveIndex(i)}
                className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
                  i === activeIndex ? 'bg-amber-50' : 'hover:bg-gray-50'
                }`}
              >
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <div>
                  <span className="text-gray-900 font-medium">{opt.label}</span>
                  {opt.extra && (
                    <span className="text-gray-400 text-sm ml-2">{opt.extra} County</span>
                  )}
                  <span className="text-xs text-amber-600 ml-2 uppercase">
                    {opt.type}
                  </span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

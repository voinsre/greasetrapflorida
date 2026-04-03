'use client';

import { useState, useEffect, useRef } from 'react';
import { CheckCircle, Loader2, Search } from 'lucide-react';

interface BusinessOption {
  id: string;
  name: string;
  city: string;
}

const ROLES = ['Owner', 'Manager', 'Marketing', 'Other'];

export default function ClaimForm() {
  const [businesses, setBusinesses] = useState<BusinessOption[]>([]);
  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState<BusinessOption[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessOption | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Owner',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Fetch businesses on mount for autocomplete
  useEffect(() => {
    async function fetchBusinesses() {
      try {
        const { createBrowserClient } = await import('@supabase/ssr');
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        const { data } = await supabase
          .from('businesses')
          .select('id, name, city')
          .order('name');
        setBusinesses(data || []);
      } catch {
        // Silently fail — user can still type
      }
    }
    fetchBusinesses();
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setFiltered([]);
      return;
    }
    const q = query.toLowerCase();
    setFiltered(businesses.filter((b) => b.name.toLowerCase().includes(q)).slice(0, 10));
  }, [query, businesses]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedBusiness) {
      setError('Please select a business from the dropdown.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_id: selectedBusiness.id,
          business_name: selectedBusiness.name,
          ...form,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit claim.');
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-gray-900 mb-2">Claim Submitted!</h3>
        <p className="text-gray-600">Thanks! We&apos;ll review your claim within 48 hours and contact you at the email provided.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Business Name Autocomplete */}
      <div ref={dropdownRef} className="relative">
        <label htmlFor="claim-business" className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="claim-business"
            type="text"
            required
            value={selectedBusiness ? selectedBusiness.name : query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedBusiness(null);
              setShowDropdown(true);
            }}
            onFocus={() => query.length >= 2 && setShowDropdown(true)}
            className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-3 text-gray-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
            placeholder="Start typing your business name..."
          />
        </div>
        {showDropdown && filtered.length > 0 && (
          <div className="absolute z-20 mt-1 w-full bg-white rounded-lg border border-gray-200 shadow-lg max-h-48 overflow-y-auto">
            {filtered.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => {
                  setSelectedBusiness(b);
                  setQuery(b.name);
                  setShowDropdown(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-amber-50 text-sm text-gray-900"
              >
                {b.name} <span className="text-gray-400">- {b.city}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <label htmlFor="claim-name" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
        <input
          id="claim-name"
          type="text"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
          placeholder="Your full name"
        />
      </div>

      <div>
        <label htmlFor="claim-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          id="claim-email"
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
          placeholder="your@email.com"
        />
      </div>

      <div>
        <label htmlFor="claim-phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
        <input
          id="claim-phone"
          type="tel"
          required
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
          placeholder="(555) 123-4567"
        />
      </div>

      <div>
        <label htmlFor="claim-role" className="block text-sm font-medium text-gray-700 mb-1">Your Role</label>
        <select
          id="claim-role"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg px-6 py-3 transition-colors disabled:opacity-50 min-h-[44px]"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
        Submit Claim
      </button>
    </form>
  );
}

'use client';

import { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';

const ESTABLISHMENT_OPTIONS = [
  'Restaurant',
  'Hotel / Resort',
  'School Cafeteria',
  'Hospital Kitchen',
  'Catering Company',
  'Food Truck',
  'Mall Food Court',
  'Corporate Cafeteria',
  'Bakery',
  'Bar / Nightclub',
  'Other',
];

export default function LeadForm({
  businessId,
  businessName,
}: {
  businessId: string;
  businessName: string;
}) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    establishment_type: '',
    message: '',
  });
  const [hp, setHp] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_id: businessId,
          business_name: businessName,
          ...form,
          website: hp,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Something went wrong');
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center">
        <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
        <h3 className="font-semibold text-lg text-gray-900 mb-1">
          Thanks!
        </h3>
        <p className="text-gray-600 text-sm">
          {businessName} will contact you shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h3 className="font-semibold text-lg text-gray-900 mb-4">
        Get a Free Quote from {businessName}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input type="text" name="website" value={hp} onChange={(e) => setHp(e.target.value)} className="absolute opacity-0 h-0 w-0 overflow-hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
        <input
          type="text"
          required
          placeholder="Your Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none"
        />
        <input
          type="email"
          required
          placeholder="Email Address"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none"
        />
        <input
          type="tel"
          required
          placeholder="Phone Number"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none"
        />
        <select
          value={form.establishment_type}
          onChange={(e) =>
            setForm({ ...form, establishment_type: e.target.value })
          }
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none"
        >
          <option value="">Establishment Type</option>
          {ESTABLISHMENT_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <textarea
          placeholder="Message (optional)"
          rows={3}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none resize-none"
        />

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
          {submitting ? 'Sending...' : 'Request Quote'}
        </button>
      </form>
    </div>
  );
}

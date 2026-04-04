'use client';

import { useState } from 'react';
import { Send, CheckCircle, Loader2 } from 'lucide-react';

const SUBJECTS = [
  'General Inquiry',
  'Business Listing Issue',
  'Advertising',
  'Partnership',
  'Other',
];

export default function ContactForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  });
  const [hp, setHp] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, website: hp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send message.');
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
        <h3 className="text-lg font-bold text-gray-900 mb-2">Message Sent!</h3>
        <p className="text-gray-600">Thank you for reaching out. We&apos;ll get back to you as soon as possible.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <input type="text" name="website" value={hp} onChange={(e) => setHp(e.target.value)} className="absolute opacity-0 h-0 w-0 overflow-hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <div>
        <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input
          id="contact-name"
          type="text"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
          placeholder="Your name"
        />
      </div>

      <div>
        <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          id="contact-email"
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
          placeholder="your@email.com"
        />
      </div>

      <div>
        <label htmlFor="contact-subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
        <select
          id="contact-subject"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
        >
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
        <textarea
          id="contact-message"
          required
          rows={5}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none resize-none"
          placeholder="How can we help?"
        />
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg px-6 py-3 transition-colors disabled:opacity-50 min-h-[44px]"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        Send Message
      </button>
    </form>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, Loader2, ArrowRight, ArrowLeft, MapPin } from 'lucide-react';

interface CountyOption {
  slug: string;
  name: string;
}

interface CityOption {
  slug: string;
  name: string;
  county_slug: string;
}

interface ServiceOption {
  slug: string;
  name: string;
}

const ESTABLISHMENT_TYPES = [
  'Restaurant',
  'Hotel / Resort',
  'School Cafeteria',
  'Hospital Kitchen',
  'Catering Company',
  'Food Truck',
  'Shopping Mall Food Court',
  'Corporate Cafeteria',
  'Bakery',
  'Bar / Nightclub',
  'Other',
];

const TRAP_SIZES = [
  { value: 'small', label: 'Small (under 50 gallons)' },
  { value: 'medium', label: 'Medium (50-200 gallons)' },
  { value: 'large', label: 'Large (200+ gallons / interceptor)' },
  { value: 'unknown', label: "Don't know" },
];

const URGENCY_OPTIONS = [
  { value: 'routine', label: 'Routine — Scheduling regular service' },
  { value: 'soon', label: 'Soon — Need service within 1-2 weeks' },
  { value: 'emergency', label: 'Emergency — Need service ASAP' },
];

export default function QuoteWizard() {
  const [step, setStep] = useState(1);
  const [counties, setCounties] = useState<CountyOption[]>([]);
  const [cities, setCities] = useState<CityOption[]>([]);
  const [serviceTypes, setServiceTypes] = useState<ServiceOption[]>([]);

  const [selectedCounty, setSelectedCounty] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [establishmentType, setEstablishmentType] = useState('Restaurant');
  const [trapSize, setTrapSize] = useState('unknown');
  const [urgency, setUrgency] = useState('routine');

  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [details, setDetails] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const { createBrowserClient } = await import('@supabase/ssr');
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        const [{ data: c }, { data: ci }, { data: s }] = await Promise.all([
          supabase.from('counties').select('slug, name').gt('business_count', 0).order('name'),
          supabase.from('cities').select('slug, name, county_slug').gt('business_count', 0).order('name'),
          supabase.from('service_types').select('slug, name').order('name'),
        ]);
        setCounties(c || []);
        setCities(ci || []);
        setServiceTypes(s || []);
      } catch {
        // Silent fail
      }
    }
    fetchData();
  }, []);

  const filteredCities = selectedCounty
    ? cities.filter((c) => c.county_slug === selectedCounty)
    : [];

  const selectedCountyName = counties.find((c) => c.slug === selectedCounty)?.name || '';

  function toggleService(slug: string) {
    setSelectedServices((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }

  async function handleSubmit() {
    setLoading(true);
    setError('');

    try {
      const serviceNames = selectedServices
        .map((s) => serviceTypes.find((st) => st.slug === s)?.name)
        .filter(Boolean);

      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          phone: contactPhone,
          establishment_type: establishmentType,
          message: [
            `County: ${selectedCountyName}`,
            selectedCity ? `City: ${cities.find((c) => c.slug === selectedCity)?.name}` : '',
            `Services: ${serviceNames.join(', ') || 'General service'}`,
            `Trap Size: ${TRAP_SIZES.find((t) => t.value === trapSize)?.label}`,
            `Urgency: ${URGENCY_OPTIONS.find((u) => u.value === urgency)?.label}`,
            details ? `Details: ${details}` : '',
          ].filter(Boolean).join('\n'),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit.');
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
        <h3 className="text-lg font-bold text-gray-900 mb-2">Quote Request Sent!</h3>
        <p className="text-gray-600">
          Your quote request has been sent to verified providers in {selectedCountyName || 'your area'}.
          Expect to hear back within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Step Indicator */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                s === step ? 'bg-amber-500 text-white' : s < step ? 'bg-amber-200 text-amber-800' : 'bg-gray-100 text-gray-400'
              }`}
            >
              {s < step ? <CheckCircle className="w-4 h-4" /> : s}
            </div>
            {s < 4 && <div className={`w-8 h-0.5 ${s < step ? 'bg-amber-300' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Location */}
      {step === 1 && (
        <div className="space-y-5">
          <h2 className="text-xl font-bold text-gray-900">Step 1: Your Location</h2>
          <div>
            <label htmlFor="quote-county" className="block text-sm font-medium text-gray-700 mb-1">County</label>
            <select
              id="quote-county"
              value={selectedCounty}
              onChange={(e) => { setSelectedCounty(e.target.value); setSelectedCity(''); }}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
            >
              <option value="">Select your county</option>
              {counties.map((c) => (
                <option key={c.slug} value={c.slug}>{c.name} County</option>
              ))}
            </select>
          </div>
          {filteredCities.length > 0 && (
            <div>
              <label htmlFor="quote-city" className="block text-sm font-medium text-gray-700 mb-1">City (optional)</label>
              <select
                id="quote-city"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
              >
                <option value="">All cities</option>
                {filteredCities.map((c) => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>
          )}
          <button
            onClick={() => setStep(2)}
            disabled={!selectedCounty}
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg px-6 py-3 transition-colors disabled:opacity-50"
          >
            Next <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Step 2: Service Details */}
      {step === 2 && (
        <div className="space-y-5">
          <h2 className="text-xl font-bold text-gray-900">Step 2: Service Details</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Services Needed</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {serviceTypes.map((s) => (
                <label
                  key={s.slug}
                  className={`flex items-center gap-2 rounded-lg border p-3 cursor-pointer transition-colors ${
                    selectedServices.includes(s.slug) ? 'border-amber-400 bg-amber-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedServices.includes(s.slug)}
                    onChange={() => toggleService(s.slug)}
                    className="accent-amber-500"
                  />
                  <span className="text-sm text-gray-900">{s.name}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="quote-establishment" className="block text-sm font-medium text-gray-700 mb-1">Establishment Type</label>
            <select
              id="quote-establishment"
              value={establishmentType}
              onChange={(e) => setEstablishmentType(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
            >
              {ESTABLISHMENT_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="quote-size" className="block text-sm font-medium text-gray-700 mb-1">Trap Size</label>
            <select
              id="quote-size"
              value={trapSize}
              onChange={(e) => setTrapSize(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
            >
              {TRAP_SIZES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="quote-urgency" className="block text-sm font-medium text-gray-700 mb-1">Urgency</label>
            <select
              id="quote-urgency"
              value={urgency}
              onChange={(e) => setUrgency(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
            >
              {URGENCY_OPTIONS.map((u) => (
                <option key={u.value} value={u.value}>{u.label}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-2 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg px-6 py-3 transition-colors hover:border-gray-400"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg px-6 py-3 transition-colors"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Contact */}
      {step === 3 && (
        <div className="space-y-5">
          <h2 className="text-xl font-bold text-gray-900">Step 3: Your Contact Info</h2>
          <div>
            <label htmlFor="quote-name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              id="quote-name"
              type="text"
              required
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
              placeholder="Your full name"
            />
          </div>
          <div>
            <label htmlFor="quote-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="quote-email"
              type="email"
              required
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label htmlFor="quote-phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              id="quote-phone"
              type="tel"
              required
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
              placeholder="(555) 123-4567"
            />
          </div>
          <div>
            <label htmlFor="quote-details" className="block text-sm font-medium text-gray-700 mb-1">Additional Details (optional)</label>
            <textarea
              id="quote-details"
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none resize-none"
              placeholder="Anything else providers should know..."
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-2 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg px-6 py-3 transition-colors hover:border-gray-400"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={() => setStep(4)}
              disabled={!contactName || !contactEmail || !contactPhone}
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg px-6 py-3 transition-colors disabled:opacity-50"
            >
              Review <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Review */}
      {step === 4 && (
        <div className="space-y-5">
          <h2 className="text-xl font-bold text-gray-900">Step 4: Review & Submit</h2>
          <div className="bg-gray-50 rounded-xl p-6 space-y-3">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <span className="text-sm text-gray-500">Location:</span>
                <span className="ml-2 text-gray-900 font-medium">
                  {selectedCountyName} County
                  {selectedCity && `, ${cities.find((c) => c.slug === selectedCity)?.name}`}
                </span>
              </div>
            </div>
            <div>
              <span className="text-sm text-gray-500">Services:</span>
              <span className="ml-2 text-gray-900">
                {selectedServices.length > 0
                  ? selectedServices.map((s) => serviceTypes.find((st) => st.slug === s)?.name).join(', ')
                  : 'General service'}
              </span>
            </div>
            <div>
              <span className="text-sm text-gray-500">Establishment:</span>
              <span className="ml-2 text-gray-900">{establishmentType}</span>
            </div>
            <div>
              <span className="text-sm text-gray-500">Trap Size:</span>
              <span className="ml-2 text-gray-900">{TRAP_SIZES.find((t) => t.value === trapSize)?.label}</span>
            </div>
            <div>
              <span className="text-sm text-gray-500">Urgency:</span>
              <span className="ml-2 text-gray-900">{URGENCY_OPTIONS.find((u) => u.value === urgency)?.label}</span>
            </div>
            <hr className="border-gray-200" />
            <div>
              <span className="text-sm text-gray-500">Name:</span>
              <span className="ml-2 text-gray-900">{contactName}</span>
            </div>
            <div>
              <span className="text-sm text-gray-500">Email:</span>
              <span className="ml-2 text-gray-900">{contactEmail}</span>
            </div>
            <div>
              <span className="text-sm text-gray-500">Phone:</span>
              <span className="ml-2 text-gray-900">{contactPhone}</span>
            </div>
            {details && (
              <div>
                <span className="text-sm text-gray-500">Details:</span>
                <span className="ml-2 text-gray-900">{details}</span>
              </div>
            )}
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div className="flex gap-3">
            <button
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-2 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg px-6 py-3 transition-colors hover:border-gray-400"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg px-6 py-3 transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              Submit Quote Request
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

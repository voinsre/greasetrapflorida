import Link from 'next/link';
import type { Metadata } from 'next';
import { createStaticClient } from '@/lib/supabase/static';
import {
  Wrench,
  Droplets,
  HardHat,
  RotateCcw,
  Waves,
  Recycle,
  Siren,
  ClipboardCheck,
  Search,
  PipetteIcon,
} from 'lucide-react';

export const metadata: Metadata = {
  title: { absolute: 'Grease Trap Services in Florida' },
  description:
    'Explore all types of grease trap services available in Florida including cleaning, pumping, installation, repair, hydro jetting, and FOG compliance consulting.',
  openGraph: {
    title: 'Grease Trap Services in Florida',
    description: 'Explore all types of grease trap services available in Florida.',
    url: 'https://greasetrapflorida.com/services',
    siteName: 'Grease Trap Florida',
    type: 'website',
  },
};

const ICON_MAP: Record<string, React.ElementType> = {
  'grease-trap-cleaning': Droplets,
  'grease-interceptor-pumping': Waves,
  'grease-trap-installation': HardHat,
  'grease-trap-repair-replacement': RotateCcw,
  'hydro-jetting': PipetteIcon,
  'used-cooking-oil-collection': Recycle,
  'emergency-overflow-service': Siren,
  'fog-compliance-consulting': ClipboardCheck,
  'grease-trap-inspection': Search,
  'drain-line-cleaning': Wrench,
};

export default async function ServicesPage() {
  const supabase = createStaticClient();

  const { data: serviceTypes } = await supabase
    .from('service_types')
    .select('id, slug, name, description')
    .order('name');

  // Count businesses per service type
  const { data: junctions } = await supabase
    .from('business_services')
    .select('service_id');

  const countMap = new Map<string, number>();
  for (const j of junctions || []) {
    countMap.set(j.service_id, (countMap.get(j.service_id) || 0) + 1);
  }

  const services = (serviceTypes || []).map((st) => ({
    ...st,
    businessCount: countMap.get(st.id) || 0,
  }));

  return (
    <>
      {/* Dark Hero */}
      <section className="bg-[#1A1A1A] -mt-16 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-1 text-sm">
              <li>
                <a href="/" className="text-gray-400 hover:text-amber-400 transition-colors">Home</a>
              </li>
              <li className="text-gray-600 mx-1">/</li>
              <li className="text-gray-300 font-medium">Services</li>
            </ol>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Grease Trap Services in Florida
          </h1>
          <p className="mt-4 text-lg text-gray-300 leading-relaxed max-w-3xl">
            Explore the full range of grease trap and FOG management services available across
            Florida. From routine cleaning and pumping to emergency overflow response and
            compliance consulting, find the right provider for your needs.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const Icon = ICON_MAP[service.slug] || Wrench;
            return (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="block bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-amber-200 transition-all p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-amber-50 rounded-lg p-3 shrink-0">
                    <Icon className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-semibold text-gray-900 mb-1">{service.name}</h2>
                    {service.description && (
                      <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                        {service.description}
                      </p>
                    )}
                    <span className="inline-flex items-center bg-amber-50 text-amber-700 text-xs font-medium px-2.5 py-1 rounded-full">
                      {service.businessCount} {service.businessCount === 1 ? 'provider' : 'providers'}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}

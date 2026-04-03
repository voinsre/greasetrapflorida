import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  Clock,
  ClipboardCheck,
  CheckCircle,
  ChevronRight,
  ChevronDown,
  Filter,
  FileText,
  Droplets,
  Wrench,
  Zap,
  Recycle,
  SearchCheck,
  Gauge,
} from 'lucide-react';
import { createStaticClient } from '@/lib/supabase/static';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSearch from '@/components/ui/HeroSearch';

const SERVICE_ICONS = [
  { slug: 'grease-trap-cleaning', name: 'Trap Cleaning', icon: Droplets },
  { slug: 'grease-interceptor-pumping', name: 'Interceptor Pumping', icon: Gauge },
  { slug: 'hydro-jetting', name: 'Hydro Jetting', icon: Zap },
  { slug: 'emergency-overflow-service', name: 'Emergency Service', icon: Clock },
  { slug: 'grease-trap-inspection', name: 'Inspection', icon: SearchCheck },
  { slug: 'used-cooking-oil-collection', name: 'Oil Collection', icon: Recycle },
];

async function getHomeData() {
  const supabase = createStaticClient();

  const [
    { count: businessCount },
    { count: countyCount },
    { count: cityCount },
    { data: topCounties },
    { data: topCities },
    { data: allCounties },
    { data: allCities },
  ] = await Promise.all([
    supabase.from('businesses').select('*', { count: 'exact', head: true }),
    supabase.from('counties').select('*', { count: 'exact', head: true }).gt('business_count', 0),
    supabase.from('cities').select('*', { count: 'exact', head: true }),
    supabase
      .from('counties')
      .select('name, slug, business_count')
      .gt('business_count', 0)
      .order('business_count', { ascending: false })
      .limit(12),
    supabase
      .from('cities')
      .select('name, slug, county_name, business_count')
      .order('business_count', { ascending: false })
      .limit(12),
    supabase
      .from('counties')
      .select('name, slug')
      .gt('business_count', 0)
      .order('name'),
    supabase
      .from('cities')
      .select('name, slug, county_name')
      .order('name'),
  ]);

  return {
    businessCount: businessCount || 0,
    countyCount: countyCount || 0,
    cityCount: cityCount || 0,
    topCounties: topCounties || [],
    topCities: topCities || [],
    allCounties: allCounties || [],
    allCities: allCities || [],
  };
}

export default async function HomePage() {
  const {
    businessCount,
    countyCount,
    cityCount,
    topCounties,
    topCities,
    allCounties,
    allCities,
  } = await getHomeData();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Grease Trap Florida',
    url: 'https://greasetrapflorida.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://greasetrapflorida.com/county/{search_term}',
      },
      'query-input': 'required name=search_term',
    },
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://greasetrapflorida.com',
      },
    ],
  };

  return (
    <>
      <Header heroMode={true} />

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      {/* SECTION 1 — HERO */}
      <section id="hero-sentinel" className="relative min-h-screen flex items-center justify-center">

        {/* Background image */}
        <Image
          src="/images/hero-grease-trap-florida.webp"
          alt="Professional grease trap service in Florida"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/55" />

        {/* Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 w-full max-w-4xl mx-auto pt-20">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-tight">
            Find Grease Trap Services in Florida
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-white/80 max-w-2xl mx-auto">
            Compare licensed companies across {countyCount} Florida counties
          </p>

          {/* Search bar */}
          <div className="mt-8">
            <Suspense fallback={
              <div className="w-full max-w-2xl mx-auto h-14 bg-white/20 rounded-xl animate-pulse" />
            }>
              <HeroSearch counties={allCounties} cities={allCities} />
            </Suspense>
          </div>

          {/* Stats */}
          <div className="mt-8 flex items-center justify-center gap-3 sm:gap-6 text-white/80 text-sm sm:text-base">
            <span className="font-semibold">{businessCount.toLocaleString()} Companies</span>
            <span className="text-white/40">&bull;</span>
            <span className="font-semibold">{countyCount} Counties</span>
            <span className="text-white/40">&bull;</span>
            <span className="font-semibold">{cityCount} Cities</span>
          </div>

          {/* Service type icons */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            {SERVICE_ICONS.map((svc) => {
              const Icon = svc.icon;
              return (
                <Link
                  key={svc.slug}
                  href={`/services/${svc.slug}`}
                  className="group flex flex-col items-center gap-2"
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:bg-amber-500/80 transition-colors">
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <span className="text-xs sm:text-sm text-white/70 group-hover:text-white transition-colors">
                    {svc.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
          <ChevronDown className="w-6 h-6 text-white/60 animate-bounce-subtle" />
        </div>
      </section>

      {/* SECTION 2 — TRUST BANNER */}
      <section className="bg-white border-y border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: ShieldCheck, label: 'DEP License Verified' },
              { icon: Clock, label: '24/7 Emergency' },
              { icon: ClipboardCheck, label: 'Manifest Compliant' },
              { icon: CheckCircle, label: 'Free Quotes' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex flex-col items-center gap-2">
                  <Icon className="w-6 h-6 text-amber-500" />
                  <span className="text-sm font-medium text-gray-700">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 3 — BROWSE BY COUNTY */}
      <section className="bg-[#FAFAFA] py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 tracking-tight">
            Browse by County
          </h2>
          <p className="mt-3 text-center text-gray-500 max-w-xl mx-auto">
            Find grease trap service providers in your Florida county
          </p>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {topCounties.map((county) => (
              <Link
                key={county.slug}
                href={`/county/${county.slug}`}
                className="bg-white rounded-xl border border-gray-100 px-5 py-4 flex items-center justify-between hover:shadow-md hover:border-amber-200 transition-all duration-200 group"
              >
                <div>
                  <span className="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">
                    {county.name} County
                  </span>
                  <span className="ml-3 inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                    {county.business_count} companies
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-amber-500 transition-colors" />
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/county"
              className="text-amber-600 hover:text-amber-700 font-semibold text-sm inline-flex items-center gap-1 transition-colors"
            >
              View All {countyCount} Counties
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 4 — POPULAR CITIES */}
      <section className="bg-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 tracking-tight">
            Popular Cities
          </h2>
          <p className="mt-3 text-center text-gray-500 max-w-xl mx-auto">
            Top Florida cities for grease trap services
          </p>
          <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {topCities.map((city) => (
              <Link
                key={city.slug}
                href={`/city/${city.slug}`}
                className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md hover:border-amber-200 transition-all duration-200 group"
              >
                <span className="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">
                  {city.name}
                </span>
                <p className="text-sm text-gray-500 mt-1">{city.county_name} County</p>
                <p className="text-xs text-amber-600 font-semibold mt-2">
                  {city.business_count} companies
                </p>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/cities"
              className="text-amber-600 hover:text-amber-700 font-semibold text-sm inline-flex items-center gap-1 transition-colors"
            >
              View All {cityCount} Cities
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 5 — WHY USE OUR DIRECTORY */}
      <section className="bg-[#FAFAFA] py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 tracking-tight">
            Why Use Grease Trap Florida
          </h2>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: ShieldCheck,
                title: 'Verified Providers',
                desc: 'Every listing is checked against Florida DEP records. Know your hauler meets Chapter 62-705 requirements before you call.',
              },
              {
                icon: Filter,
                title: 'Smart Filters',
                desc: 'Filter by service type, emergency availability, county, and more. Find the right company for your specific needs in seconds.',
              },
              {
                icon: FileText,
                title: 'Compliance Resources',
                desc: 'Free guides on Chapter 62-705, manifest requirements, cleaning frequency, and county-specific FOG ordinances.',
              },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className="bg-white rounded-xl p-8 shadow-sm border border-gray-100"
                >
                  <Icon className="w-10 h-10 text-amber-500" />
                  <h3 className="mt-4 text-lg font-bold text-gray-900">{card.title}</h3>
                  <p className="mt-2 text-gray-600 leading-relaxed text-sm">{card.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 6 — CTA BANNER */}
      <section className="bg-[#1A1A1A] py-16 lg:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Own a Grease Trap Service Company?
          </h2>
          <p className="mt-4 text-gray-400 text-lg max-w-xl mx-auto">
            Get found by thousands of Florida restaurants searching for service providers
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/claim-listing"
              className="bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg px-8 py-3 transition-colors text-base"
            >
              Claim Your Listing
            </Link>
            <Link
              href="/advertise"
              className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold rounded-lg px-8 py-3 transition-colors text-base"
            >
              Get Featured
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

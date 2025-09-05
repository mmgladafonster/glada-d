// Dynamic Service-Location Pages for Glada Fönster SEO Recovery
// Generates high-quality, location-specific content pages with consistent styling

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  getLocationData, 
  getServiceData, 
  LocationData, 
  ServiceData 
} from '@/lib/locationData';
import { 
  generatePageMetadata, 
  generateLocalBusinessSchema 
} from '@/lib/contentGenerator';
import { 
  getStaticParams, 
  isValidCombination 
} from '@/scripts/filterPages';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowRight, 
  Award, 
  CheckCircle, 
  Phone, 
  Shield, 
  Star, 
  MapPin, 
  Clock, 
  Zap,
  Home,
  Building
} from 'lucide-react';

// ISR: Revalidate daily
export const revalidate = 86400;

interface PageProps {
  params: {
    service: string;
    location: string;
  };
}

// Generate static params for all valid combinations
export async function generateStaticParams() {
  return getStaticParams();
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { service: serviceSlug, location: locationSlug } = params;
  
  // Convert URL params back to database keys
  const locationKey = getLocationKeyFromSlug(locationSlug);
  const serviceKey = serviceSlug;
  
  const locationData = getLocationData(locationKey);
  const serviceData = getServiceData(serviceKey);
  
  if (!locationData || !serviceData) {
    return {
      title: 'Sida inte hittad | Glada Fönster',
      description: 'Den begärda sidan kunde inte hittas.'
    };
  }
  
  const metadata = generatePageMetadata(serviceData, locationData);
  
  return {
    title: metadata.title,
    description: metadata.description,
    alternates: {
      canonical: metadata.canonical
    },
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      url: metadata.canonical,
      siteName: 'Glada Fönster',
      locale: 'sv_SE',
      type: 'website'
    },
    twitter: {
      card: 'summary',
      title: metadata.title,
      description: metadata.description
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    }
  };
}

// Helper function to convert URL slug back to database key
function getLocationKeyFromSlug(slug: string): string {
  const slugToKey: Record<string, string> = {
    'goteborg': 'goteborg',
    'kungsbacka': 'kungsbacka', 
    'varberg': 'varberg',
    'molndal': 'molndal',
    'kungalv': 'kungalv'
  };
  
  return slugToKey[slug] || slug;
}

export default async function ServiceLocationPage({ params }: PageProps) {
  const { service: serviceSlug, location: locationSlug } = params;
  
  // Convert URL params back to database keys
  const locationKey = getLocationKeyFromSlug(locationSlug);
  const serviceKey = serviceSlug;
  
  // Validate combination
  if (!isValidCombination(serviceKey, locationKey)) {
    notFound();
  }
  
  const locationData = getLocationData(locationKey);
  const serviceData = getServiceData(serviceKey);
  
  if (!locationData || !serviceData) {
    notFound();
  }
  
  // Generate structured data
  const schema = generateLocalBusinessSchema(serviceData, locationData);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema)
        }}
      />

      {/* ─────────────────────  HERO SECTION  ───────────────────── */}
      <section className="relative overflow-hidden py-12 md:py-20 lg:py-32">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-indigo-600/5 to-purple-600/5" />
        <div className="absolute top-20 left-10 h-32 w-32 rounded-full bg-gradient-to-br from-blue-400/20 to-indigo-600/20 blur-3xl md:h-72 md:w-72" />
        <div className="absolute bottom-20 right-10 h-48 w-48 animate-pulse delay-1000 rounded-full bg-gradient-to-br from-indigo-400/20 to-purple-600/20 blur-3xl md:h-96 md:w-96" />

        <div className="container relative z-10 mx-auto px-4">
          {/* Breadcrumb Navigation */}
          <nav className="mb-8 text-sm text-gray-600">
            <ol className="flex items-center space-x-2">
              <li><Link href="/" className="hover:text-blue-600 transition-colors">Hem</Link></li>
              <li className="before:content-['/'] before:mx-2">
                <Link href="/tjanster" className="hover:text-blue-600 transition-colors">Tjänster</Link>
              </li>
              <li className="before:content-['/'] before:mx-2 text-gray-900 font-medium">
                {serviceData.name} i {locationData.city}
              </li>
            </ol>
          </nav>

          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Text Column */}
            <div className="space-y-8 text-center lg:text-left">
              <Badge className="inline-flex items-center gap-2 border-0 bg-gradient-to-r from-blue-100 to-indigo-100 px-4 py-2 text-blue-800 shadow-lg shadow-blue-500/10">
                <MapPin className="h-4 w-4" />
                {locationData.city}, {locationData.region}
              </Badge>

              <h1 className="text-2xl font-bold leading-tight md:text-3xl lg:text-5xl">
                <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                  {serviceData.name} i {locationData.city}
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Professionell Kvalitet
                </span>
                <br />
                <span className="text-gray-900">Med 35+ Års Erfarenhet</span>
              </h1>

              <p className="mx-auto max-w-2xl text-lg font-light leading-relaxed text-gray-600 md:text-xl lg:mx-0">
                Välkommen till Glada Fönster, din pålitliga partner för {serviceData.name.toLowerCase()} i {locationData.city}. 
                Vi förstår de unika utmaningarna som {locationData.city}s klimat medför för fönsterunderhåll.
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 gap-3 pt-6 sm:grid-cols-3 md:gap-4">
                {[
                  {
                    icon: Shield,
                    title: "Försäkrad",
                    subtitle: "& Certifierad",
                    color: "from-green-500 to-emerald-600",
                  },
                  {
                    icon: CheckCircle,
                    title: "100% Garanti",
                    subtitle: "Eller pengarna tillbaka",
                    color: "from-blue-500 to-indigo-600",
                  },
                  {
                    icon: Clock,
                    title: `Var ${locationData.recommendedFrequency}:e vecka`,
                    subtitle: "Rekommenderad frekvens",
                    color: "from-orange-500 to-red-600",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/60 p-4 shadow-lg shadow-blue-500/5 backdrop-blur-sm"
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${item.color}`}
                    >
                      <item.icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-semibold text-gray-900">{item.title}</div>
                      <div className="text-xs text-gray-600">{item.subtitle}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/contact#request-quote-form">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-base md:text-lg px-6 md:px-8 py-4 md:py-6 shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105 group"
                  >
                    Få Gratis Offert
                    <ArrowRight className="h-4 w-4 md:h-5 md:w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </Link>
                <a href="tel:0728512420">
                  <Button
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-gray-100 text-base md:text-lg px-6 md:px-8 py-4 md:py-6 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 font-semibold"
                  >
                    <Phone className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                    Ring: 072-8512420
                  </Button>
                </a>
              </div>
            </div>

            {/* Image Column - Service Icon */}
            <div className="relative order-first hidden lg:order-last lg:block">
              <div className="relative mx-auto w-80 h-80 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl border border-white/20 shadow-2xl shadow-blue-500/20 flex items-center justify-center">
                {serviceKey === 'fonsterputsning' ? (
                  <Home className="h-32 w-32 text-blue-600" />
                ) : (
                  <Building className="h-32 w-32 text-blue-600" />
                )}
                
                {/* Floating rating badge */}
                <div className="absolute -bottom-8 -left-8 bg-gradient-to-br from-white to-blue-50 p-6 rounded-2xl shadow-2xl shadow-blue-500/20 backdrop-blur-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-900">Lokalt Förtroende</p>
                      <p className="text-xs text-gray-600">{locationData.city}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────  LOCAL CHALLENGES SECTION  ───────────────────── */}
      <section className="relative overflow-hidden py-12 md:py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30" />
        <div className="container relative z-10 mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-6 border-0 bg-gradient-to-r from-orange-100 to-red-100 px-4 py-2 text-orange-800">
              Lokala Utmaningar
            </Badge>
            <h2 className="mb-4 text-4xl font-bold lg:text-5xl">
              <span className="bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
                Varför {locationData.city} Behöver Specialiserad Service
              </span>
            </h2>
            <p className="mx-auto mb-12 max-w-3xl text-lg font-light text-gray-600 md:text-xl">
              I {locationData.city} möter vi specifika utmaningar som kräver expertkunskap och anpassade metoder.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Climate Challenges */}
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 group">
              <CardContent className="p-8">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="mb-4 text-2xl font-bold text-gray-900">Klimatutmaningar</h3>
                <ul className="space-y-3">
                  {locationData.climateFactors.map((factor, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{factor}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Service Challenges */}
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 group">
              <CardContent className="p-8">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h3 className="mb-4 text-2xl font-bold text-gray-900">Specifika Utmaningar</h3>
                <ul className="space-y-3">
                  {locationData.serviceChallenges.map((challenge, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{challenge}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ─────────────────────  SERVICES SECTION  ───────────────────── */}
      <section className="relative overflow-hidden py-12 md:py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-blue-50" />
        <div className="container relative z-10 mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-6 border-0 bg-gradient-to-r from-blue-100 to-indigo-100 px-4 py-2 text-blue-800">
              Våra Tjänster
            </Badge>
            <h2 className="mb-4 text-4xl font-bold lg:text-5xl">
              <span className="bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
                {serviceData.name} Anpassad för {locationData.city}
              </span>
            </h2>
            <p className="mx-auto mb-12 max-w-3xl text-lg font-light text-gray-600 md:text-xl">
              {serviceData.baseDescription} med specialisering på {locationData.city}s unika förhållanden.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Service Specifics */}
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-8">
                <h3 className="mb-6 text-2xl font-bold text-gray-900">Vad Ingår i Vår Service</h3>
                <ul className="space-y-4">
                  {serviceData.serviceSpecifics.map((spec, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600">
                        <CheckCircle className="h-3 w-3 text-white" />
                      </div>
                      <span className="font-medium text-gray-700">{spec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Building Types */}
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-8">
                <h3 className="mb-6 text-2xl font-bold text-gray-900">Byggnadstyper Vi Servar</h3>
                <ul className="space-y-4">
                  {locationData.buildingTypes.map((type, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600">
                        <CheckCircle className="h-3 w-3 text-white" />
                      </div>
                      <span className="font-medium text-gray-700">{type}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ─────────────────────  LOCAL KNOWLEDGE SECTION  ───────────────────── */}
      <section className="relative overflow-hidden py-12 md:py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30" />
        <div className="container relative z-10 mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-6 border-0 bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 text-purple-800">
              Lokalkännedom
            </Badge>
            <h2 className="mb-4 text-4xl font-bold lg:text-5xl">
              <span className="bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
                Vi Känner {locationData.city} Väl
              </span>
            </h2>
            <p className="mx-auto mb-12 max-w-3xl text-lg font-light text-gray-600 md:text-xl">
              Som lokalt företag servar vi regelbundet fastigheter i hela {locationData.city} och omgivning.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
              <CardContent className="p-8">
                <h3 className="mb-6 text-2xl font-bold text-gray-900 text-center">
                  Områden Vi Regelbundet Servar
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {locationData.localLandmarks.map((landmark, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
                      <MapPin className="h-4 w-4 text-blue-600 flex-shrink-0" />
                      <span className="text-gray-700 font-medium">{landmark}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-center text-gray-600">
                  Vår närhet till dessa områden gör att vi kan erbjuda snabb service och förstår de specifika behoven för olika delar av {locationData.city}.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ─────────────────────  CTA SECTION  ───────────────────── */}
      <section className="relative overflow-hidden py-12 md:py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600" />
        <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml,%3Csvg width=60 height=60 viewBox=0 0 60 60 xmlns=http://www.w3.org/2000/svg%3E%3Cg fill=none fillRule=evenodd%3E%3Cg fill=%23ffffff fillOpacity=0.1%3E%3Ccircle cx=30 cy=30 r=2/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />

        <div className="container relative z-10 mx-auto px-4 text-center">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-6 text-4xl font-bold text-white lg:text-6xl">
              Boka {serviceData.name} i {locationData.city} Idag
            </h2>
            <p className="mx-auto mb-8 max-w-3xl text-xl font-light leading-relaxed text-blue-100">
              Redo att få kristallklara fönster? Kontakta Glada Fönster för en kostnadsfri offert anpassad för {locationData.city}s klimat.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center mb-8">
              <Link href="/contact#request-quote-form">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 text-base md:text-lg px-6 md:px-8 py-4 md:py-6 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 group font-semibold"
                >
                  Få Kostnadsfri Offert
                  <ArrowRight className="h-4 w-4 md:h-5 md:w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
              <a href="tel:0728512420">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 text-base md:text-lg px-6 md:px-8 py-4 md:py-6 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 font-semibold"
                >
                  <Phone className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                  Ring: 072-8512420
                </Button>
              </a>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                {
                  icon: Shield,
                  title: "100% Nöjdhetsgaranti",
                  subtitle: "Eller pengarna tillbaka"
                },
                {
                  icon: Award,
                  title: "Fullständigt Försäkrad",
                  subtitle: "För din trygghet"
                },
                {
                  icon: Zap,
                  title: "Samma Dag Service",
                  subtitle: "För akuta behov"
                }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-4 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-white">{item.title}</div>
                    <div className="text-sm text-blue-200">{item.subtitle}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
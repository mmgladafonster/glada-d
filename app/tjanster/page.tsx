// Services Overview Page for Glada Fönster
// Lists all available services and locations with consistent styling

import { Metadata } from 'next';
import Link from 'next/link';
import { locationDatabase, serviceDatabase } from '@/lib/locationData';
import { getStaticParams } from '@/scripts/filterPages';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  ArrowRight,
  CheckCircle,
  Phone,
  MapPin,
  Home,
  Building,
  Award,
  Shield,
  Zap
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Våra Tjänster - Professionell Fönsterputsning | Glada Fönster',
  description: 'Upptäck våra professionella fönsterputsning och städtjänster i Göteborg, Kungsbacka, Varberg, Mölndal och Kungälv. Kontakta oss för offert.',
  alternates: {
    canonical: 'https://gladafonster.se/tjanster'
  }
};

export default function ServicesPage() {
  const combinations = getStaticParams();

  // Group combinations by service
  const serviceGroups = combinations.reduce((acc, combo) => {
    if (!acc[combo.service]) {
      acc[combo.service] = [];
    }
    acc[combo.service].push(combo);
    return acc;
  }, {} as Record<string, typeof combinations>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />

      {/* ─────────────────────  HERO SECTION  ───────────────────── */}
      <section className="relative overflow-hidden py-12 md:py-20 lg:py-32">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-indigo-600/5 to-purple-600/5" />
        <div className="absolute top-20 left-10 h-32 w-32 rounded-full bg-gradient-to-br from-blue-400/20 to-indigo-600/20 blur-3xl md:h-72 md:w-72" />
        <div className="absolute bottom-20 right-10 h-48 w-48 animate-pulse delay-1000 rounded-full bg-gradient-to-br from-indigo-400/20 to-purple-600/20 blur-3xl md:h-96 md:w-96" />

        <div className="container relative z-10 mx-auto px-4">
          <div className="text-center">
            <Badge className="mb-6 border-0 bg-gradient-to-r from-blue-100 to-indigo-100 px-4 py-2 text-blue-800 shadow-lg shadow-blue-500/10">
              <Award className="h-4 w-4 mr-2" />
              Professionella Tjänster
            </Badge>

            <h1 className="text-4xl font-bold leading-tight md:text-5xl lg:text-6xl mb-6">
              <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                Våra Tjänster i
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Göteborgsregionen
              </span>
            </h1>

            <p className="mx-auto max-w-3xl text-lg font-light leading-relaxed text-gray-600 md:text-xl mb-8">
              Professionell fönsterputsning och städservice anpassad för varje orts unika klimat och behov.
              Vi förstår de lokala utmaningarna och levererar kvalitet som håller.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {[
                {
                  icon: Shield,
                  title: "100% Försäkrad",
                  subtitle: "Trygg service"
                },
                {
                  icon: Award,
                  title: "35+ Års Erfarenhet",
                  subtitle: "Beprövad kvalitet"
                },
                {
                  icon: MapPin,
                  title: "5 Huvudorter",
                  subtitle: "Lokalkännedom"
                }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/60 p-4 shadow-lg shadow-blue-500/5 backdrop-blur-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600">
                    <item.icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-gray-900">{item.title}</div>
                    <div className="text-xs text-gray-600">{item.subtitle}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────  SERVICES SECTION  ───────────────────── */}
      <section className="relative overflow-hidden py-12 md:py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30" />
        <div className="container relative z-10 mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-6 border-0 bg-gradient-to-r from-blue-100 to-indigo-100 px-4 py-2 text-blue-800">
              Våra Specialiteter
            </Badge>
            <h2 className="mb-4 text-4xl font-bold lg:text-5xl">
              <span className="bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
                Professionella Tjänster
              </span>
            </h2>
          </div>

          <div className="grid gap-8 max-w-6xl mx-auto">
            {Object.entries(serviceGroups).map(([serviceSlug, locations]) => {
              const serviceData = serviceDatabase[serviceSlug];
              if (!serviceData) return null;

              return (
                <Card
                  key={serviceSlug}
                  className="group overflow-hidden border-0 bg-white/80 backdrop-blur-sm shadow-xl transition-transform duration-500 hover:scale-[1.02] hover:shadow-2xl"
                >
                  <CardContent className="p-8 md:p-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                      {/* Service Info */}
                      <div>
                        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg transition-transform duration-300 group-hover:scale-110">
                          {serviceSlug === 'fonsterputsning' ? (
                            <Home className="h-8 w-8 text-white" />
                          ) : (
                            <Building className="h-8 w-8 text-white" />
                          )}
                        </div>

                        <h3 className="mb-4 text-3xl font-bold text-gray-900 transition-colors group-hover:text-blue-900">
                          {serviceData.name}
                        </h3>

                        <p className="mb-6 text-lg text-gray-600 leading-relaxed">
                          {serviceData.baseDescription}
                        </p>

                        <div className="mb-6">
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">
                            Vad ingår:
                          </h4>
                          <ul className="space-y-3">
                            {serviceData.serviceSpecifics.map((spec, index) => (
                              <li key={index} className="flex items-center gap-3">
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600">
                                  <CheckCircle className="h-3 w-3 text-white" />
                                </div>
                                <span className="font-medium text-gray-700">{spec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Locations */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">
                          Tillgänglig i:
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {locations.map((combo) => {
                            const locationKey = Object.keys(locationDatabase).find(key => {
                              const location = locationDatabase[key];
                              const urlLocation = location.city
                                .toLowerCase()
                                .replace('ö', 'o')
                                .replace('ä', 'a')
                                .replace('å', 'a');
                              return urlLocation === combo.location;
                            });

                            const locationData = locationKey ? locationDatabase[locationKey] : null;
                            if (!locationData) return null;

                            return (
                              <Link
                                key={`${combo.service}-${combo.location}`}
                                href={`/tjanster/${combo.service}/${combo.location}`}
                                className="group/location flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md"
                              >
                                <MapPin className="h-4 w-4 text-blue-600 flex-shrink-0" />
                                <div className="text-left">
                                  <div className="font-semibold text-gray-900 group-hover/location:text-blue-900">
                                    {locationData.city}
                                  </div>
                                  <div className="text-xs text-gray-600">
                                    {locationData.region}
                                  </div>
                                </div>
                                <ArrowRight className="h-4 w-4 text-blue-600 ml-auto opacity-0 group-hover/location:opacity-100 transition-opacity" />
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────  SERVICE AREAS SECTION  ───────────────────── */}
      <section className="relative overflow-hidden py-12 md:py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-blue-50" />
        <div className="container relative z-10 mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-6 border-0 bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 text-purple-800">
              Serviceområden
            </Badge>
            <h2 className="mb-4 text-4xl font-bold lg:text-5xl">
              <span className="bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
                Vi Servar Hela Göteborgsregionen
              </span>
            </h2>
            <p className="mx-auto mb-12 max-w-3xl text-lg font-light text-gray-600 md:text-xl">
              Med djup lokalkännedom och anpassade metoder för varje orts unika klimat och utmaningar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {Object.values(locationDatabase).map((location) => (
              <Card key={location.city} className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-900 transition-colors">
                        {location.city}
                      </h3>
                      <p className="text-sm text-gray-600">{location.region}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    4 gånger per år
                  </p>
                  <div className="text-xs text-gray-500">
                    Specialisering: {location.serviceChallenges[0]}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────  CTA SECTION  ───────────────────── */}
      <section className="relative overflow-hidden py-12 md:py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600" />
        <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml,%3Csvg width=60 height=60 viewBox=0 0 60 60 xmlns=http://www.w3.org/2000/svg%3E%3Cg fill=none fillRule=evenodd%3E%3Cg fill=%23ffffff fillOpacity=0.1%3E%3Ccircle cx=30 cy=30 r=2/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />

        <div className="container relative z-10 mx-auto px-4 text-center">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/20 px-6 py-3 backdrop-blur-sm">
              <Zap className="h-5 w-5 animate-pulse text-yellow-300" />
              <span className="font-semibold text-white">Behöver du hjälp att välja rätt service?</span>
            </div>

            <h2 className="mb-6 text-4xl font-bold text-white lg:text-6xl">
              Kontakta Oss Idag
            </h2>
            <p className="mx-auto mb-8 max-w-3xl text-xl font-light leading-relaxed text-blue-100">
              Vi hjälper dig hitta den perfekta lösningen för dina behov och din orts specifika utmaningar.
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

            <p className="mx-auto max-w-2xl rounded-2xl border border-white/20 bg-white/10 p-6 text-sm text-blue-200 backdrop-blur-sm">
              Professionell service med 100% nöjdhetsgaranti. Vi är försäkrade och certifierade för din trygghet.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
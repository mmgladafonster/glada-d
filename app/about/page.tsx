"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Shield, Clock, Sparkles, ArrowRight, Award, Users, Star, Phone, Mail, MapPin } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function AboutPage() {
  /* ---------- team data (could come from CMS later) ---------- */
  const teamMembers = [
    {
      name: "Miroslaw",
      role: "Medgrundare • Ledande Putsare",
      experience: "17 års erfarenhet",
      image: "/placeholder-user.jpg",
      description: "Perfektionsdriven expert som får glas att skimra sedan 2007.",
    },
    {
      name: "Marius",
      role: "Medgrundare • Driftansvarig",
      experience: "18 års erfarenhet",
      image: "/placeholder-user.jpg",
      description: "Ser till att varje jobb flyter smidigt och att kunderna är nöjda.",
    },
    {
      name: "Alex",
      role: "Tekniker",
      experience: "5 års erfarenhet",
      image: "/placeholder-user.jpg",
      description: "Säkerhetsfokuserad specialist för höghöjds- och fasadarbeten.",
    },
  ]

  const serviceAreas = [
    "Varberg",
    "Åskloster",
    "Väröbacka",
    "Bua",
    "Frillesås",
    "Åsa",
    "Kullavik",
    "Särö",
    "Kungsbacka",
    "Billdal",
    "Askim",
    "Mölndal",
    "Göteborg",
    "Kungälv",
    "Torslanda",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 md:py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-indigo-600/5 to-purple-600/5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12 md:mb-16">
            <Badge className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-0 px-3 md:px-4 py-2 mb-4 md:mb-6">
              Om Vårt Företag
            </Badge>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
                Om Glada Fönster AB
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              Med över 17 års erfarenhet och tusentals nöjda kunder är vi Kungsbacka mest pålitliga fönsterputsexperter.
              Vi använder professionell utrustning och miljövänliga produkter.
            </p>
          </div>
        </div>
      </section>

      {/* Despre Noi Section (Romanian) - Translated to Swedish */}
      <section className="py-12 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-indigo-50/30 to-blue-50/30"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-8 text-center">
              <span className="bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
                Vår Berättelse
              </span>
            </h2>
            <div className="space-y-5 text-gray-700 leading-relaxed bg-white/70 backdrop-blur-sm p-6 md:p-8 rounded-xl shadow-lg border border-gray-200">
              <p>
                Vi kom till Sverige med en önskan att bidra till ett demokratiskt samhälle och bygga ett bättre liv, som
                unga européer. År 2008 började vi arbeta på ett fönsterputsbolag. Där knöt vi en nära vänskap med en
                kollega, en annan europeisk arbetare. Vi kom mycket bra överens, men insåg snart att företaget vi
                arbetade för utnyttjade oss, genom att kräva att vi arbetade snabbt, utan att tillåta oss att leverera
                kvalitet. Allt var inriktat på kvantitet, inte perfektion, och vår okunnighet om svenska lagar fick oss
                att känna oss som kapplöpningshästar i en oändlig tävling.
              </p>
              <p>
                Chefen sa att han hade gett oss en chans att arbeta i Sverige, men i verkligheten fick företaget ett
                ekonomiskt bidrag på 60% av vår lön från Arbetsförmedlingen under det första året. Senare förstod vi
                varför de bara anställde invandrare. Vi föredrar att inte avslöja företagets namn, eftersom det är
                aktivt än idag.
              </p>
              <p>
                Efter att vi insåg att vi blev utnyttjade, bestämde vi oss för att ändra på saker. Så föddes Glada
                Fönster, ett företag dedikerat till kvalitet och perfektion. Vi fokuserar på väl utfört arbete, utan
                brådska, med uppmärksamhet på detaljer. För oss är kunder inte bara kunder – de är människor, bekanta,
                till och med vänner. Vi vill bygga relationer baserade på ömsesidig respekt och förtroende, inte bara på
                kommersiella transaktioner.
              </p>
              <p>
                Vi är medvetna om att vi inte kan tillfredsställa alla. Vi respekterar kvaliteten på vårt arbete och
                säkerheten för våra anställda, som tar dagliga risker för att leverera oklanderliga resultat. Vi driver
                verksamheten ansvarsfullt, respekterar Sveriges lagar och tar hand om dem som arbetar med oss.
              </p>
              <p>
                Om du letar efter det lägsta priset, ber vi om ursäkt – vi är inte rätt val. Vi erbjuder kvalitet,
                passion och engagemang, utan att kompromissa. Att välja våra tjänster är liknande beslutet att välja en
                läkare med 20 års erfarenhet, även om kostnaden är högre, istället för en med bara 5 års praktik. Om vi
                inte respekteras för vårt arbete och de risker det innebär, förbehåller vi oss rätten att neka att
                utföra tjänsterna.
              </p>
              <p>
                Med en samlad erfarenhet på över 35 år inom branschen, även om vi inte är ett stort företag, vill vi
                inte vara det. Vi erbjuder kvalitetstjänster till dem som uppskattar väl utfört arbete och de risker som
                vårt team tar.
              </p>
              <p>
                Tack för din förståelse! Detta är vår berättelse och hur Glada Fönster föddes för att tjäna med glädje,
                tålamod och kvalitet i: Varberg, Åskloster, Väröbacka, Bua, Frillesås, Åsa, Kullavik, Särö, Kungsbacka,
                Billdal, Askim, Mölndal, Göteborg, Kungälv, Torslanda och även utanför Göteborgsregionen.
              </p>
              <p className="mt-6 font-semibold">
                Med vänliga hälsningar,
                <br />
                Miroslaw
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-blue-50"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
                Våra Värderingar
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto font-light">
              Dessa kärnvärden vägleder allt vi gör och säkerställer att vi levererar exceptionell service varje gång
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              {
                icon: Shield,
                title: "Fullt Försäkrad",
                description: "Ansvarsförsäkring upp till 10 miljoner SEK för din trygghet",
                gradient: "from-blue-500 to-indigo-600",
              },
              {
                icon: CheckCircle,
                title: "100% Garanti",
                description: "Inte nöjd? Vi kommer tillbaka gratis tills du är det",
                gradient: "from-green-500 to-emerald-600",
              },
              {
                icon: Clock,
                title: "Punktlig & Pålitlig",
                description: "Vi anländer alltid i tid som planerat, varje gång",
                gradient: "from-orange-500 to-red-600",
              },
              {
                icon: Sparkles,
                title: "Miljövänlig",
                description: "Endast ekologiska och miljösäkra rengöringsprodukter",
                gradient: "from-purple-500 to-pink-600",
              },
            ].map((item, index) => (
              <Card
                key={index}
                className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 group bg-white/80 backdrop-blur-sm overflow-hidden"
              >
                <CardContent className="p-6 md:p-8 text-center">
                  <div
                    className={`w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center mb-4 md:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300 mx-auto`}
                  >
                    <item.icon className="h-8 w-8 md:h-10 md:w-10 text-white" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4 group-hover:text-blue-900 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-12 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { number: "17+", label: "År i Branschen", icon: Award },
              { number: "2500+", label: "Nöjda Kunder", icon: Users },
              { number: "4.9/5", label: "Genomsnittsbetyg", icon: Star },
              { number: "100%", label: "Nöjdhetsgrad", icon: CheckCircle },
            ].map((stat, index) => (
              <div key={index} className="text-white">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 mx-auto">
                  <stat.icon className="h-8 w-8 md:h-10 md:w-10 text-white" />
                </div>
                <div className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-blue-100 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-12 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-blue-50"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
                Redo att Arbeta Med Oss?
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 mb-8 md:mb-12 font-light leading-relaxed">
              Kontakta oss idag för en kostnadsfri offert. Vi svarar inom 15 minuter och kan ofta erbjuda service samma
              dag.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center mb-8 md:mb-12">
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
                  variant="outline"
                  className="text-base md:text-lg px-6 md:px-8 py-4 md:py-6 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 group bg-white/80 backdrop-blur-sm"
                >
                  <Phone className="h-4 w-4 md:h-5 md:w-5 mr-2 group-hover:animate-pulse" />
                  Ring: 072-8512420
                </Button>
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {[
                {
                  icon: Phone,
                  title: "Ring Oss",
                  value: "072-8512420",
                  subtitle: "Vardagar 7:00-19:00",
                },
                {
                  icon: Mail,
                  title: "Mejla Oss",
                  value: "info@gladafonster.se",
                  subtitle: "Svar inom 2 timmar",
                },
                {
                  icon: MapPin,
                  title: "Serviceområde",
                  cities: serviceAreas,
                },
              ].map((contact, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 md:space-x-4 p-4 md:p-6 bg-white/60 backdrop-blur-sm rounded-xl md:rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg">
                    <contact.icon className="h-6 w-6 md:h-7 md:w-7 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-lg">{contact.title}</div>
                    {contact.value && <div className="text-gray-700 font-semibold">{contact.value}</div>}
                    {contact.subtitle && <div className="text-sm text-gray-500">{contact.subtitle}</div>}
                    {contact.cities && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {contact.cities.map((city) => (
                          <span
                            key={city}
                            className="rounded-full bg-blue-100 text-blue-800 px-2 py-0.5 text-xs font-medium"
                          >
                            {city}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

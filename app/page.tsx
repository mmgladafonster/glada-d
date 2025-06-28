"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { OptimizedYouTubeVideo } from "@/components/optimized-youtube-video"

import { ArrowRight, Award, Building, CheckCircle, Home, Phone, Shield, Star, Users, Zap } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function HomePage() {
  /* ---------- service cards ---------- */
  const services = [
    {
      icon: Home,
      title: "Fönsterputs för Hem",
      description:
        "Professionell fönsterputs för villor, radhus och lägenheter. In- & utvändigt för kristallklara resultat.",
      features: ["Alla fönstertyper", "Karmar och fönsterbrädor", "Miljövänliga produkter"],
      gradient: "from-blue-500 to-indigo-600",
      bgGradient: "from-blue-50 to-indigo-50",
    },
    {
      icon: Building,
      title: "Fönsterputs för Företag",
      description: "Regelbunden fönsterputs för kontor, butiker och andra kommersiella byggnader.",
      features: ["Flexibel schemaläggning", "Avtalstjänst", "Arbete på hög höjd"],
      gradient: "from-indigo-500 to-purple-600",
      bgGradient: "from-indigo-50 to-purple-50",
    },
  ]

  const faqs = [
    {
      question: "Vilka områden servar ni?",
      answer:
        "Vi erbjuder fönsterputstjänster i Varberg, Åskloster, Väröbacka, Bua, Frillesås, Åsa, Kullavik, Särö, Kungsbacka, Billdal, Askim, Mölndal, Göteborg, Kungälv, Torslanda och även utanför Göteborgsregionen. Kontakta oss för mer information!",
    },
    {
      question: "Hur bokar jag fönsterputs?",
      answer:
        "Du kan kontakta oss via telefon, e-post eller formuläret på vår hemsida. Vi kommer att boka en lämplig tid och ge dig en kostnadsfri offert.",
    },
    {
      question: "Hur mycket erfarenhet har ni?",
      answer:
        "Vi har över 35 års samlad erfarenhet inom fönsterputs, vilket gör att vi kan leverera toppresultat med stor uppmärksamhet på detaljer.",
    },
    {
      question: "Vad gör Glada Fönster unikt?",
      answer:
        "Vi är inte bara ett företag – vi är ett team som värdesätter kvalitet, respekt och mänskliga relationer. Våra kunder är som vänner, och vårt arbete speglar vår passion för perfektion.",
    },
    {
      question: "Varför är era priser högre än andra företags?",
      answer:
        "Vi fokuserar på kvalitet, inte kvantitet. Vi erbjuder oklanderliga tjänster, utan brådska, med erfarna medarbetare som tar dagliga risker. Att välja oss är som att välja en läkare med 20 års erfarenhet – kvalitet kostar, men det är värt det.",
    },
    {
      question: "Hur bestäms era priser?",
      answer: "Priserna beror på fastighetens storlek, antal fönster, tillgångens komplexitet och fönstertypen.",
    },
    {
      question: "Har ni dolda kostnader eller extra avgifter?",
      answer: "Nej, vi erbjuder transparenta priser utan dolda kostnader. Alla detaljer diskuteras vid bokning.",
    },
    {
      question: "Erbjuder ni rabatter för långtidskontrakt?",
      answer:
        "Ja, vi erbjuder förmånliga paket för kunder som väljer regelbundna tjänster. Kontakta oss för att diskutera en personlig plan.",
    },
    {
      question: "Hur ofta bör jag putsa mina fönster?",
      answer:
        "Det beror på din boendemiljö. Generellt rekommenderar vi fönsterputs 3-4 gånger per år för att bibehålla klarhet och ett snyggt utseende. Om du bor nära havet rekommenderar vi putsning 6-7 gånger per år, då salt kan skada fönstren, och ett frekvent abonnemang är mer ekonomiskt.",
    },
    {
      question: "Putsar ni fönster både inifrån och utifrån?",
      answer:
        "Ja, vår tjänst inkluderar komplett fönsterputs, både inifrån och utifrån, för perfekt sikt. Detta kan medföra en extra kostnad.",
    },
    {
      question: "Erbjuder ni tjänster för höga byggnader eller svåråtkomliga platser?",
      answer:
        "Ja, vårt team är utbildat för att arbeta säkert på höga höjder eller under svåra förhållanden, i enlighet med alla säkerhetsföreskrifter i Sverige.",
    },
    {
      question: "Har ni försäkring?",
      answer:
        "Ja, vi är försäkrade, vilket täcker ansvarsförsäkring och arbetsplatsolyckor, för våra kunders trygghet. Lyckligtvis har vi inte haft några incidenter sedan vi startade företaget.",
    },
    {
      question: "Vad händer om jag inte är nöjd?",
      answer:
        "Om du inte är nöjd åtar vi oss att åtgärda problemet inom 48 timmar, utan extra kostnad, om du informerar oss i tid. I vissa fall erbjuder vi tjänsten gratis för att säkerställa din tillfredsställelse.",
    },
    {
      question: "Kan ni neka att utföra tjänster?",
      answer:
        "Ja, vi förbehåller oss rätten att neka kunder som inte respekterar kvaliteten på vårt arbete eller våra anställdas säkerhet. Vi strävar efter partnerskap baserade på ömsesidig respekt.",
    },
  ]

  /* ---------- rendered page ---------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />

      {/* ─────────────────────  HERO  ───────────────────── */}
      <section className="relative overflow-hidden py-12 md:py-20 lg:py-32">
        {/* subtle gradient blobs */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-indigo-600/5 to-purple-600/5" />
        <div className="absolute top-20 left-10 h-32 w-32 rounded-full bg-gradient-to-br from-blue-400/20 to-indigo-600/20 blur-3xl md:h-72 md:w-72" />
        <div className="absolute bottom-20 right-10 h-48 w-48 animate-pulse delay-1000 rounded-full bg-gradient-to-br from-indigo-400/20 to-purple-600/20 blur-3xl md:h-96 md:w-96" />

        <div className="container relative z-10 mx-auto px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* -- text column -- */}
            <div className="space-y-8 text-center lg:text-left">
              <Badge className="inline-flex items-center gap-2 border-0 bg-gradient-to-r from-blue-100 to-indigo-100 px-4 py-2 text-blue-800 shadow-lg shadow-blue-500/10">
                <Award className="h-4 w-4" />
                Sveriges Mest Pålitliga Fönsterputsare
              </Badge>

              <h1 className="text-2xl font-bold leading-tight md:text-3xl lg:text-5xl">
                <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                  Dina Fönster:
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Så Rena att du Kommer Undra
                </span>
                <br />
                <span className="text-gray-900">om Glaset Finns Där. (Och Vi Garanterar Det!)</span>
              </h1>

              <p className="mx-auto max-w-2xl text-lg font-light leading-relaxed text-gray-600 md:text-xl lg:text-2xl lg:mx-0">
                Vi putsar inte bara fönster – vi förvandlar dem till speglar så klara att du kommer att svära på att du
                kan se <span className="italic font-semibold text-blue-600">ABBA</span> sjunga &ldquo;Dancing
                Queen&rdquo; i din trädgård.
              </p>

              {/* service areas pill list */}
              <div className="mb-8 rounded-2xl border border-white/20 bg-white/60 p-6 shadow-lg shadow-blue-500/5 backdrop-blur-sm">
                <h3 className="mb-3 text-center text-sm font-bold text-gray-900 lg:text-left">🌟 Serviceområden</h3>
                <div className="flex flex-wrap justify-center gap-2 lg:justify-start">
                  {[
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
                  ].map((city) => (
                    <span
                      key={city}
                      className="rounded-full border border-blue-200 bg-gradient-to-r from-blue-100 to-indigo-100 px-3 py-1 text-xs font-medium text-blue-800 transition-colors duration-300 hover:from-blue-200 hover:to-indigo-200"
                    >
                      {city}
                    </span>
                  ))}
                  <span className="rounded-full border border-purple-200 bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-1 text-xs font-bold text-purple-800">
                    + Utanför Göteborg
                  </span>
                </div>
              </div>

              {/* CTA buttons */}
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

              {/* quick badges */}
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
                    icon: Zap,
                    title: "Samma Dag",
                    subtitle: "Service tillgänglig",
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
            </div>

            {/* -- image column -- */}
            <div className="relative order-first hidden lg:order-last lg:block">
              <Image
                src="/glada-car-background.png"
                alt="Glada Fönster servicefordon"
                width={500}
                height={600}
                priority
                className="w-full rounded-3xl border border-white/20 shadow-2xl shadow-blue-500/20"
              />

              {/* floating rating badge (desktop only) */}
              <div className="absolute -bottom-8 -left-8 hidden bg-gradient-to-br from-white to-blue-50 p-6 shadow-2xl shadow-blue-500/20 backdrop-blur-sm md:block">
                <div className="flex items-center gap-4">
                  <div className="-ml-2 flex -space-x-3">
                    {[1, 2, 3, 4].map((n) => (
                      <div
                        key={n}
                        className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg"
                      >
                        <Users className="h-5 w-5 text-white" />
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="mb-1 flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-xs font-semibold text-gray-900">2500+ Nöjda Kunder</p>
                    <p className="text-xs text-gray-600">Genomsnitt 4.9 / 5</p>
                  </div>
                </div>
              </div>

              {/* floating discount badge */}
              <div className="absolute -top-4 -right-4 hidden animate-bounce rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 p-4 shadow-2xl shadow-yellow-500/20 md:block">
                <div className="text-center text-white">
                  <div className="text-2xl font-bold">20%</div>
                  <div className="text-xs font-medium">RABATT</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────  SERVICES  ───────────────────── */}
      <section id="services" className="relative overflow-hidden py-12 md:py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30" />
        <div className="container relative z-10 mx-auto px-4">
          <div className="text-center">
            <Badge className="mb-6 border-0 bg-gradient-to-r from-blue-100 to-indigo-100 px-4 py-2 text-blue-800">
              Våra Specialiteter
            </Badge>
            <h2 className="mb-4 text-4xl font-bold lg:text-5xl">
              <span className="bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
                Professionella Tjänster
              </span>
            </h2>
            <p className="mx-auto mb-12 max-w-3xl text-lg font-light text-gray-600 md:text-xl">
              Komplett fönsterputs med professionella moderna tekniker och miljövänliga produkter.
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
            {services.map((s, i) => (
              <Card
                key={i}
                className="group overflow-hidden border-0 bg-white/80 backdrop-blur-sm shadow-xl transition-transform duration-500 hover:scale-105 hover:shadow-2xl"
              >
                <CardContent className="relative p-8">
                  <div
                    className={`absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-br ${s.bgGradient}`}
                  />
                  <div className="relative z-10">
                    <div
                      className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${s.gradient} shadow-lg transition-transform duration-300 group-hover:scale-110`}
                    >
                      <s.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="mb-4 text-2xl font-bold text-gray-900 transition-colors group-hover:text-blue-900">
                      {s.title}
                    </h3>
                    <p className="mb-6 text-gray-600">{s.description}</p>
                    <ul className="space-y-2">
                      {s.features.map((f) => (
                        <li key={f} className="flex items-center gap-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600">
                            <CheckCircle className="h-3 w-3 text-white" />
                          </div>
                          <span className="font-medium text-gray-700">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* services CTA */}
          <div className="text-center mt-8 md:mt-12">
            <Link href="/contact#request-quote-form">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105 group"
              >
                Få Offert
                <ArrowRight className="h-4 w-4 md:h-5 md:w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────────────────  TESTIMONIAL VIDEOS  ───────────────────── */}
      <section id="testimonials" className="relative overflow-hidden py-12 md:py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30" />
        <div className="container relative z-10 mx-auto px-4">
          <div className="text-center">
            <Badge className="mb-6 border-0 bg-gradient-to-r from-yellow-100 to-orange-100 px-4 py-2 text-orange-800">
              Kundrecensioner
            </Badge>
            <h2 className="mb-4 text-4xl font-bold lg:text-5xl">
              <span className="bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
                Se Våra Nöjda Kunder
              </span>
            </h2>
            <p className="mx-auto mb-12 max-w-3xl text-lg font-light text-gray-600 md:text-xl">
              Se riktiga vittnesmål och upptäck varför vi är Göteborgs föredragna val.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                title: "Kundvittnesmål",
                videoId: "ClLA9d42iZ0",
                description: "Hör vad våra nöjda kunder säger om vår professionella service",
              },
              {
                title: "Före & Efter Resultat",
                videoId: "kIRTPKp5VwM",
                description: "Se den dramatiska skillnaden vårt arbete gör",
              },
              {
                title: "Professionell Service",
                videoId: "2DYchzu1oZ0",
                description: "Upptäck varför vi är Göteborgs mest pålitliga fönsterputsare",
              },
            ].map((v) => (
              <OptimizedYouTubeVideo key={v.videoId} {...v} />
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────  SPECIAL OFFER  ───────────────────── */}
      <section className="relative overflow-hidden py-12 md:py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600" />
        <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml,%3Csvg width=60 height=60 viewBox=0 0 60 60 xmlns=http://www.w3.org/2000/svg%3E%3Cg fill=none fillRule=evenodd%3E%3Cg fill=%23ffffff fillOpacity=0.1%3E%3Ccircle cx=30 cy=30 r=2/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />

        <div className="container relative z-10 mx-auto px-4 text-center">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/20 px-6 py-3 backdrop-blur-sm">
              <Zap className="h-5 w-5 animate-pulse text-yellow-300" />
              <span className="font-semibold text-white">Begränsat Erbjudande!</span>
            </div>

            <h2 className="mb-6 text-4xl font-bold text-white lg:text-6xl">
              Spara <span className="text-yellow-300">20%</span> På Din Första Putsning
            </h2>
            <p className="mx-auto mb-8 max-w-3xl text-xl font-light leading-relaxed text-blue-100">
              Boka nu och få 20% rabatt på din första fönsterputs. Gäller endast nya kunder och begränsat antal platser
              tillgängliga.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center mb-6 md:mb-8">
              <Link href="/contact#request-quote-form">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 text-base md:text-lg px-6 md:px-8 py-4 md:py-6 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 group font-semibold"
                >
                  Få Din Rabatt Nu
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
              Erbjudandet gäller för nya kunder.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────────  FAQ Section  ───────────────────── */}
      <section className="py-12 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-blue-50"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
                Vanliga Frågor
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto font-light">
              Här hittar du svar på de vanligaste frågorna om våra fönsterputstjänster.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto">
            {faqs.map((faq, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm"
              >
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{faq.question}</h3>
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

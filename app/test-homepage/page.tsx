"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { OptimizedYouTubeVideo } from "@/components/optimized-youtube-video"

import { ArrowRight, Building, Calendar, CheckCircle, ChevronRight, Clock, Home, Phone, Shield, Star, Zap } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function TestHomePage() {
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
        "Du kan kontakta ons via telefon, e-post eller formuläret på vår hemsida. Vi kommer att boka en lämplig tid och ge dig en kostnadsfri offert.",
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
        "Om du inte är nöjd åtar vi oss att åtgärda problemet inom 48 timmar, utan extra kostnad, om du informerar ons i tid. I vissa fall erbjuder vi tjänsten gratis för att säkerställa din tillfredsställelse.",
    },
    {
      question: "Kan ni neka att utföra tjänster?",
      answer:
        "Ja, vi förbehåller ons rätten att neka kunder som inte respekterar kvaliteten på vårt arbete eller våra anställdas säkerhet. Vi strävar efter partnerskap baserade på ömsesidig respekt.",
    },
  ]

  /* ---------- rendered page ---------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />

      {/* ─────────────────────  HERO  ───────────────────── */}
      <section className="relative overflow-hidden py-12 md:py-16 lg:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/40 to-white" />

        <div className="container relative z-10 mx-auto px-4">
          <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-12">
            {/* -- text column -- */}
            <div className="space-y-6 text-center lg:space-y-7 lg:text-left">
              <Badge
                variant="outline"
                className="inline-flex items-center gap-2 rounded-full border-blue-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-700 shadow-sm"
              >
                <Shield className="h-4 w-4 text-blue-600" />
                Tryggt &amp; pålitligt – försäkrat &amp; kvalitetssäkrat
              </Badge>

              <h1 className="text-2xl font-bold leading-tight text-slate-900 md:text-3xl lg:text-5xl">
                Dina Fönster:
                <br />
                Så Rena att du Kommer Undra
                <br />
                om Glaset Finns Där. (Och Vi Garanterar Det!)
              </h1>

              <p className="mx-auto max-w-2xl text-base font-light leading-relaxed text-slate-600 md:text-lg lg:mx-0 lg:text-xl">
                Vi putsar inte bara fönster – vi förvandlar dem till speglar så klara att du kommer att svära på att du
                kan se <span className="italic font-semibold text-blue-600">ABBA</span> sjunga &ldquo;Dancing
                Queen&rdquo; i din trädgård.
              </p>

              {/* CTA buttons — mockup A */}
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <Link href="/contact#request-quote-form" className="inline-flex">
                  <Button
                    size="lg"
                    className="h-auto w-full rounded-2xl bg-blue-600 px-6 py-4 text-base font-semibold text-white hover:bg-blue-700 sm:w-auto md:px-8"
                  >
                    <Calendar className="mr-2 h-5 w-5" />
                    Få Gratis Offert
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <a href="tel:0728512420" className="inline-flex">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-auto w-full rounded-2xl border border-gray-200 bg-white px-6 py-4 text-base font-semibold text-slate-800 hover:bg-slate-50 sm:w-auto md:px-8"
                  >
                    <Phone className="mr-2 h-5 w-5 text-blue-600" />
                    Ring 072-8512420
                  </Button>
                </a>
              </div>

              {/* compact trust pills */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1 lg:justify-start">
                {[
                  { icon: Shield, label: "Försäkrad" },
                  { icon: CheckCircle, label: "100% Garanti" },
                  { icon: Clock, label: "Samma Dag" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm"
                  >
                    <item.icon className="h-4 w-4 text-blue-600" />
                    {item.label}
                  </div>
                ))}
              </div>
            </div>

            {/* -- image column -- */}
            <div className="relative order-first hidden lg:order-last lg:block lg:pt-2">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-white/20 shadow-2xl shadow-blue-500/20">
                <Image
                  src="/glada-car-background.png"
                  alt="Glada Fönster servicefordon"
                  fill
                  priority
                  className="object-cover object-center"
                  sizes="(min-width: 1024px) 40vw, 100vw"
                />
              </div>

              {/* floating rating card */}
              <div className="absolute -bottom-6 -left-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-xl md:-left-6">
                <div className="mb-1 flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="ml-1 text-sm font-semibold text-slate-900">4.9</span>
                </div>
                <p className="text-xs font-semibold text-slate-900">2500+ Nöjda Kunder</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────  SERVICE AREAS (moved from hero)  ───────────────────── */}
      <section className="relative border-y border-blue-100/60 bg-white/70 py-8 md:py-10">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl text-center">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-700 md:text-base">
              Serviceområden
            </h2>
            <div className="flex flex-wrap justify-center gap-2">
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
                  className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-800"
                >
                  {city}
                </span>
              ))}
              <span className="rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-bold text-purple-800">
                + Utanför Göteborg
              </span>
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
                priority: true,
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

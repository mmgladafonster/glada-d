import { notFound } from "next/navigation"
import keywords from "@/lib/keywords.json"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { OptimizedYouTubeVideo } from "@/components/optimized-youtube-video"
import { ArrowRight, Award, Building, CheckCircle, Home, Phone, Shield, Star, Users, Zap } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Generate static pages for each keyword
export async function generateStaticParams() {
  return keywords.map((keyword) => ({
    slug: keyword.slug,
  }))
}

// Generate dynamic metadata for each page
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const awaitedParams = await params;
  const keywordData = keywords.find((k) => k.slug === awaitedParams.slug)

  if (!keywordData) {
    return {
      title: "Sidan Hittades Inte",
      description: "Den begärda sidan kunde inte hittas.",
    }
  }

  // Capitalize first letter of each word
  const capitalizeWords = (str: string) => {
    return str.replace(/(^\w{1}|\s+\w{1})/g, (letter) => letter.toUpperCase());
  };

  const capitalizedKeyword = capitalizeWords(keywordData.Keyword);

  return {
    title: `${capitalizedKeyword} - Glada Fönster`,
    description: `Professionell ${keywordData.Service} i ${keywordData.Location}. Få en gratis offert idag för ${capitalizedKeyword}.`,
    alternates: {
      canonical: `https://gladafonster.se/lp/${awaitedParams.slug}`,
    },
  }
}

export default async function LandingPage({ params }: { params: { slug: string } }) {
  const awaitedParams = await params;
  const keywordData = keywords.find((k) => k.slug === awaitedParams.slug)

  if (!keywordData) {
    notFound()
  }

  /* Using the same static data as the homepage for now */
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />

      {/* ─────────────────────  HERO  ───────────────────── */}
      <section className="relative overflow-hidden py-12 md:py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-indigo-600/5 to-purple-600/5" />
        <div className="absolute top-20 left-10 h-32 w-32 rounded-full bg-gradient-to-br from-blue-400/20 to-indigo-600/20 blur-3xl md:h-72 md:w-72" />
        <div className="absolute bottom-20 right-10 h-48 w-48 animate-pulse delay-1000 rounded-full bg-gradient-to-br from-indigo-400/20 to-purple-600/20 blur-3xl md:h-96 md:w-96" />

        <div className="container relative z-10 mx-auto px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="space-y-8 text-center lg:text-left">
              <Badge className="inline-flex items-center gap-2 border-0 bg-gradient-to-r from-blue-100 to-indigo-100 px-4 py-2 text-blue-800 shadow-lg shadow-blue-500/10">
                <Award className="h-4 w-4" />
                {keywordData.Location}: Din lokala expert
              </Badge>

              <h1 className="text-2xl font-bold leading-tight md:text-3xl lg:text-5xl">
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {keywordData.Keyword.replace(/(^\w{1}|\s+\w{1})/g, (letter) => letter.toUpperCase())}
                </span>
              </h1>

              <p className="mx-auto max-w-2xl text-lg font-light leading-relaxed text-gray-600 md:text-xl lg:text-2xl lg:mx-0">
                Vi erbjuder förstklassig {keywordData.Service} i {keywordData.Location}. Vårt team av experter
                garanterar skinande rena resultat varje gång.
              </p>

              <div className="mb-8 rounded-2xl border border-white/20 bg-white/60 p-6 shadow-lg shadow-blue-500/5 backdrop-blur-sm">
                <h3 className="mb-3 text-center text-sm font-bold text-gray-900 lg:text-left">
                  🌟 Serviceområde: {keywordData.Location}
                </h3>
                <p className="text-center text-xs text-gray-600 lg:text-left">
                  Vi är stolta över att erbjuda {keywordData.Service} i {keywordData.Location} med omnejd.
                </p>
              </div>

              {/* service areas pill list */}
              <div className="mb-8 rounded-2xl border border-white/20 bg-white/60 p-6 shadow-lg shadow-blue-500/5 backdrop-blur-sm">
                <h3 className="mb-3 text-center text-sm font-bold text-gray-900 lg:text-left">🌟 Alla Serviceområden</h3>
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
                      className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors duration-300 ${
                        city === keywordData.Location
                          ? "border-purple-200 bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                          : "border-blue-200 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 hover:from-blue-200 hover:to-indigo-200"
                      }`}
                    >
                      {city}
                    </span>
                  ))}
                  <span className="rounded-full border border-purple-200 bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-1 text-xs font-bold text-purple-800">
                    + Utanför Göteborg
                  </span>
                </div>
              </div>

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

            <div className="relative order-first hidden lg:order-last lg:block">
              <Image
                src="/glada-car-background.png"
                alt={`Glada Fönster servicefordon för ${keywordData.Keyword.replace(/(^\w{1}|\s+\w{1})/g, (letter) => letter.toUpperCase())}`}
                width={500}
                height={600}
                priority
                className="w-full rounded-3xl border border-white/20 shadow-2xl shadow-blue-500/20"
              />
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
                Professionella Tjänster i {keywordData.Location}
              </span>
            </h2>
            <p className="mx-auto mb-12 max-w-3xl text-lg font-light text-gray-600 md:text-xl">
              Vi erbjuder komplett {keywordData.Service} med moderna tekniker och miljövänliga produkter.
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
                Nöjda Kunder i {keywordData.Location}
              </span>
            </h2>
            <p className="mx-auto mb-12 max-w-3xl text-lg font-light text-gray-600 md:text-xl">
              Se varför kunder i {keywordData.Location} väljer oss för {keywordData.Service}.
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
        <div className="container relative z-10 mx-auto px-4 text-center">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-6 text-4xl font-bold text-white lg:text-6xl">
              Spara 20% på {keywordData.Service} i {keywordData.Location}
            </h2>
            <p className="mx-auto mb-8 max-w-3xl text-xl font-light leading-relaxed text-blue-100">
              Boka {keywordData.Keyword.replace(/(^\w{1}|\s+\w{1})/g, (letter) => letter.toUpperCase())} nu och få 20% rabatt. Gäller endast nya kunder.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center">
              <Link href="/contact#request-quote-form">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 text-base md:text-lg px-6 md:px-8 py-4 md:py-6 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 group font-semibold"
                >
                  Få Din Rabatt Nu
                  <ArrowRight className="h-4 w-4 md:h-5 md:w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
            </div>
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
              Svar på vanliga frågor om {keywordData.Service} i {keywordData.Location}.
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

      <Footer keywordData={keywordData} />
    </div>
  )
}

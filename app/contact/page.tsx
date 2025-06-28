"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Phone, Mail, MapPin, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useActionState } from "react"
import { sendContactEmail } from "../actions/send-email"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useRef, useLayoutEffect } from "react"
import type { ElementType } from "react"

/* Small presentational card – keeps main JSX simpler & avoids complex generic inference */
function ContactCard({
  icon: Icon,
  gradient,
  title,
  value,
  subtitle,
  cities,
}: {
  icon: ElementType
  gradient: string
  title: string
  value: string
  subtitle: string
  cities?: string[]
}) {
  return (
    <div className="flex items-center space-x-3 md:space-x-4 p-4 md:p-6 bg-white/60 backdrop-blur-sm rounded-xl md:rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
      <div
        className={`w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br ${gradient} rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg`}
      >
        <Icon className="h-6 w-6 md:h-7 md:w-7 text-white" />
      </div>
      <div>
        <div className="font-bold text-gray-900 text-lg">{title}</div>
        <div className="text-gray-700 font-semibold">{value}</div>
        <div className="text-sm text-gray-500">{subtitle}</div>
        {cities && (
          <div className="mt-3 flex flex-wrap gap-1">
            {cities.map((c) => (
              <span key={c} className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                {c}
              </span>
            ))}
            <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-bold text-purple-800">
              + Utanför Göteborg
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ContactPage() {
  const [state, formAction, isPending] = useActionState(sendContactEmail, {
    success: false,
    message: "",
  })

  const formRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    if (window.location.hash === "#request-quote-form" && formRef.current) {
      const headerHeight = headerRef.current?.offsetHeight || 90
      const targetY = formRef.current.getBoundingClientRect().top + window.scrollY - headerHeight
      window.scrollTo({ top: targetY, behavior: "auto" })
    }
  }, [])

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
        "Ja, vår tjänst inkluderar komplett fönsterputs, både inifrån och utifrån, för en perfekt sikt. Detta kan medföra en extra kostnad.",
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
      <Header ref={headerRef} />

      <section className="relative overflow-hidden py-12 md:py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-indigo-600/5 to-purple-600/5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12 md:mb-16">
            <Badge className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-0 px-3 md:px-4 py-2 mb-4 md:mb-6">
              Kontakta Oss
            </Badge>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
                Få Din Gratis Offert
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              Kontakta oss idag för en kostnadsfri offert. Vi svarar inom 15 minuter och kan ofta erbjuda service samma
              dag.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-16">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
                <span className="bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
                  Hör Av Dig
                </span>
              </h2>
              <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8 leading-relaxed font-light">
                Redo för kristallklara fönster? Kontakta oss med någon av metoderna nedan. Vi är här för att hjälpa dig
                med alla dina fönsterputsbehov.
              </p>

              <div className="space-y-4 md:space-y-6">
                <a
                  href="tel:0728512420"
                  className="flex items-center space-x-3 md:space-x-4 p-4 md:p-6 bg-white/60 backdrop-blur-sm rounded-xl md:rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg">
                    <Phone className="h-6 w-6 md:h-7 md:w-7 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-lg">Telefon</div>
                    <div className="text-gray-700 font-semibold">072-8512420</div>
                    <div className="text-sm text-gray-500">Vardagar 7:00-19:00</div>
                  </div>
                </a>
                <ContactCard
                  icon={Mail}
                  title="E-post"
                  value="info@gladafonster.se"
                  subtitle="Svar inom 2 timmar"
                  gradient="from-indigo-500 to-purple-600"
                />
                <ContactCard
                  icon={MapPin}
                  title="Serviceområde"
                  value="Flera städer"
                  subtitle="Gratis hembesök för offerter"
                  gradient="from-purple-500 to-pink-600"
                  cities={serviceAreas}
                />
                <ContactCard
                  icon={Clock}
                  title="Öppettider"
                  value="Måndag – Fredag"
                  subtitle="07:00 – 19:00"
                  gradient="from-green-500 to-emerald-600"
                />
              </div>

              <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Behöver du Omedelbar Hjälp?</h3>
                <p className="text-gray-600 mb-4">
                  För akuta fönsterputsbehov eller jourtjänster, ring oss direkt. Vi erbjuder service samma dag mot
                  extra kostnad.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a href="tel:0728512420">
                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg">
                      <Phone className="h-4 w-4 mr-2" /> Ring Nu
                    </Button>
                  </a>
                  <a href="mailto:info@gladafonster.se">
                    <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                      <Mail className="h-4 w-4 mr-2" /> Skicka E-post
                    </Button>
                  </a>
                </div>
              </div>
            </div>

            <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
              <CardContent id="request-quote-form" ref={formRef} className="p-6 md:p-8">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">Begär Offert</h3>
                {state?.message && (
                  <div
                    className={`mb-6 p-4 rounded-lg ${state.success ? "bg-green-50 border border-green-200 text-green-800" : "bg-red-50 border border-red-200 text-red-800"}`}
                  >
                    {state.message}
                  </div>
                )}
                <form action={formAction} className="space-y-4 md:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Förnamn *</label>
                      <Input
                        name="firstName"
                        placeholder="Ditt förnamn"
                        required
                        disabled={isPending}
                        className="border-2 border-gray-200 focus:border-blue-500 transition-colors duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Efternamn *</label>
                      <Input
                        name="lastName"
                        placeholder="Ditt efternamn"
                        required
                        disabled={isPending}
                        className="border-2 border-gray-200 focus:border-blue-500 transition-colors duration-300"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">E-post *</label>
                    <Input
                      name="email"
                      type="email"
                      placeholder="din@email.com"
                      required
                      disabled={isPending}
                      className="border-2 border-gray-200 focus:border-blue-500 transition-colors duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Telefon *</label>
                    <Input
                      name="phone"
                      type="tel"
                      placeholder="08-123 456 78"
                      required
                      disabled={isPending}
                      className="border-2 border-gray-200 focus:border-blue-500 transition-colors duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Adress</label>
                    <Input
                      name="address"
                      placeholder="Din adress"
                      disabled={isPending}
                      className="border-2 border-gray-200 focus:border-blue-500 transition-colors duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Fastighetstyp</label>
                    <select
                      name="propertyType"
                      disabled={isPending}
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white"
                    >
                      <option value="">Välj typ</option>
                      <option value="House">Hus</option>
                      <option value="Townhouse">Radhus</option>
                      <option value="Apartment">Lägenhet</option>
                      <option value="Office">Kontor</option>
                      <option value="Shop">Butik</option>
                      <option value="Other">Annat</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Beskriv Dina Behov</label>
                    <Textarea
                      name="description"
                      placeholder="Antal fönster, våningar, speciella krav, etc."
                      rows={4}
                      disabled={isPending}
                      className="border-2 border-gray-200 focus:border-blue-500 transition-colors duration-300"
                    />
                  </div>
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="gdpr"
                      name="gdpr"
                      disabled={isPending}
                      className="mt-1 w-4 h-4 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500"
                      required
                    />
                    <label htmlFor="gdpr" className="text-sm text-gray-600">
                      Jag godkänner att mina uppgifter behandlas enligt{" "}
                      <Link href="/privacy-policy" className="text-blue-600 hover:underline font-semibold">
                        integritetspolicyn
                      </Link>{" "}
                      och GDPR. *
                    </label>
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isPending}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105 group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>{" "}
                        Skickar...
                      </>
                    ) : (
                      <>
                        Skicka Förfrågan{" "}
                        <ArrowRight className="h-4 w-4 md:h-5 md:w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

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

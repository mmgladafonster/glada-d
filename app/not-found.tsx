"use client"

import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Home, Search, Phone } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      
      {/* 404 Content */}
      <section className="relative overflow-hidden py-12 md:py-20 lg:py-32">
        {/* subtle gradient blobs */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-indigo-600/5 to-purple-600/5" />
        <div className="absolute top-20 left-10 h-32 w-32 rounded-full bg-gradient-to-br from-blue-400/20 to-indigo-600/20 blur-3xl md:h-72 md:w-72" />
        <div className="absolute bottom-20 right-10 h-48 w-48 rounded-full bg-gradient-to-br from-indigo-400/20 to-purple-600/20 blur-3xl md:h-96 md:w-96" />

        <div className="container relative z-10 mx-auto px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* -- text column -- */}
            <div className="space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 border-0 bg-gradient-to-r from-blue-100 to-indigo-100 px-4 py-2 text-blue-800 shadow-lg shadow-blue-500/10 rounded-full">
                <Search className="h-5 w-5" />
                <span className="font-semibold">Sidan kunde inte hittas</span>
              </div>

              <h1 className="text-4xl font-bold leading-tight md:text-5xl lg:text-7xl">
                <span className="text-gray-900">Sidan finns inte</span>
              </h1>

              <p className="mx-auto max-w-2xl text-lg font-light leading-relaxed text-gray-600 md:text-xl lg:mx-0">
                Hoppsan! Det verkar som att du har tagit fel väg. Precis som när du letar efter en ren spegel i ett smutsigt fönster - vi hjälper dig hitta rätt!
              </p>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-base md:text-lg px-6 md:px-8 py-4 md:py-6 shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105 group"
                  >
                    <Home className="h-5 w-5 mr-2" />
                    Tillbaka till startsidan
                  </Button>
                </Link>
                <a href="tel:0728512420">
                  <Button
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-gray-100 text-base md:text-lg px-6 md:px-8 py-4 md:py-6 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 font-semibold"
                  >
                    <Phone className="h-5 w-5 mr-2" />
                    Kontakta oss
                  </Button>
                </a>
              </div>

              {/* Navigation options */}
              <div className="grid grid-cols-1 gap-3 pt-6 sm:grid-cols-3 md:gap-4">
                {[
                  {
                    title: "Våra Tjänster",
                    link: "/#services",
                    description: "Se våra professionella fönsterputstjänster"
                  },
                  {
                    title: "Om Oss",
                    link: "/about",
                    description: "Lär känna Glada Fönster Städ AB"
                  },
                  {
                    title: "Kontakt",
                    link: "/contact",
                    description: "Få en gratis offert idag"
                  }
                ].map((item, idx) => (
                  <Link 
                    key={idx} 
                    href={item.link}
                    className="flex flex-col items-center gap-3 rounded-2xl border border-white/20 bg-white/60 p-4 shadow-lg shadow-blue-500/5 backdrop-blur-sm hover:bg-white/80 transition-all duration-300"
                  >
                    <div className="text-center">
                      <div className="text-sm font-semibold text-gray-900">{item.title}</div>
                      <div className="text-xs text-gray-600 mt-1">{item.description}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* -- image column -- */}
            <div className="relative order-first lg:order-last flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl border border-white/20 shadow-2xl shadow-blue-500/20 p-8 md:p-12">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 mb-6">
                      <Search className="h-12 w-12 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Letar du efter något specifikt?</h3>
                    <p className="text-gray-600 mb-6">
                      Vi kan hjälpa dig hitta rätt tjänst eller svara på dina frågor.
                    </p>
                    <div className="space-y-3">
                      <Link 
                        href="/contact#request-quote-form" 
                        className="block w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
                      >
                        Få Gratis Offert
                      </Link>
                      <a 
                        href="tel:0728512420" 
                        className="block w-full bg-white text-blue-600 border border-blue-200 py-3 px-4 rounded-xl hover:bg-blue-50 transition-all duration-300 font-medium"
                      >
                        Ring: 072-8512420
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

import { Phone, Mail, Sparkles } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white py-12 md:py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=60 height=60 viewBox=0 0 60 60 xmlns=http://www.w3.org/2000/svg%3E%3Cg fill=none fillRule=evenodd%3E%3Cg fill=%23ffffff fillOpacity=0.05%3E%3Ccircle cx=30 cy=30 r=2/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4 md:mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles className="h-6 w-6 md:h-7 md:w-7 text-white" />
              </div>
              <div>
                <span className="text-xl md:text-2xl font-bold">Glada Fönster Städ AB</span>
                <div className="text-xs text-blue-300">
                  <br />
                </div>
              </div>
            </div>
            <p className="text-gray-300 mb-4 md:mb-6 leading-relaxed">
              Kungsbacka mest pålitliga fönsterputsare sedan 2014. Professionell service med 100% nöjdhetsgaranti.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4 md:mb-6 text-lg">Kontakt</h4>
            <ul className="space-y-2 md:space-y-3 text-gray-300">
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-blue-400" />
                <a href="tel:0728512420" className="hover:text-white transition-colors duration-300">
                  072-8512420
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-blue-400" />
                <span>info@gladafonster.se</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 md:mt-12 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© 2025 Glada Fönster Städ AB. Alla rättigheter förbehållna.</p>
          <div className="flex space-x-4 md:space-x-6 mt-3 md:mt-0">
            <Link
              href="/privacy-policy"
              className="text-gray-400 hover:text-white transition-colors duration-300 hover:underline"
            >
              Integritetspolicy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

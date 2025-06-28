"use client"

import { Button } from "@/components/ui/button"
import { Phone, Menu, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState, forwardRef } from "react"
import { usePathname } from "next/navigation"

export const Header = forwardRef<HTMLElement, {}>((props, ref) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <header
      ref={ref}
      className="border-b border-white/20 bg-white/80 backdrop-blur-xl sticky top-0 z-50 shadow-lg shadow-blue-500/5"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative">
              <Image
                src="/glada-fonster-kungsbacka-happy.png"
                alt="Glada Fönster Städ AB Logo"
                width={40}
                height={40}
                className="rounded-xl shadow-lg"
              />
            </div>
            <div>
              <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Glada Fönster Städ AB
              </span>
              <div className="text-xs text-gray-500 font-medium">
                <br />
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link
              href="/"
              className={`transition-all duration-300 font-bold uppercase relative group ${
                isActive("/") ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Hem
              <span
                className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300 ${
                  isActive("/") ? "w-full" : "w-0 group-hover:w-full"
                }`}
              ></span>
            </Link>
            <Link
              href="/about"
              className={`transition-all duration-300 font-bold uppercase relative group ${
                isActive("/about") ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Om Oss
              <span
                className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300 ${
                  isActive("/about") ? "w-full" : "w-0 group-hover:w-full"
                }`}
              ></span>
            </Link>
            <Link
              href="/contact"
              className={`transition-all duration-300 font-bold uppercase relative group ${
                isActive("/contact") ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Kontakt
              <span
                className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300 ${
                  isActive("/contact") ? "w-full" : "w-0 group-hover:w-full"
                }`}
              ></span>
            </Link>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href="tel:0728512420"
              className="hidden lg:flex items-center space-x-2 text-sm text-gray-600 bg-white/60 backdrop-blur-sm px-3 py-2 rounded-full border border-white/20 hover:bg-blue-50 transition-all duration-300"
            >
              <Phone className="h-4 w-4 text-blue-600" />
              <span className="font-medium">072-8512420</span>
            </a>
            <Link href="/contact#request-quote-form">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-105">
                Få Offert
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-white/60 backdrop-blur-sm border border-white/20 shadow-lg"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6 text-gray-600" /> : <Menu className="h-6 w-6 text-gray-600" />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-white/20">
            <nav className="flex flex-col space-y-4 pt-4">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`transition-all duration-300 font-bold uppercase py-2 px-4 rounded-lg ${
                  isActive("/") ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                Hem
              </Link>
              <Link
                href="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`transition-all duration-300 font-bold uppercase py-2 px-4 rounded-lg ${
                  isActive("/about") ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                Om Oss
              </Link>
              <Link
                href="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`transition-all duration-300 font-bold uppercase py-2 px-4 rounded-lg ${
                  isActive("/contact")
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                Kontakt
              </Link>
              <div className="flex flex-col space-y-3 pt-4 border-t border-gray-200">
                <a
                  href="tel:0728512420"
                  className="flex items-center space-x-2 text-sm text-gray-600 bg-white/60 backdrop-blur-sm px-4 py-3 rounded-lg border border-white/20 hover:bg-blue-50 transition-all duration-300"
                >
                  <Phone className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">072-8512420</span>
                </a>
                <Link href="/contact#request-quote-form" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25 transition-all duration-300">
                    Få Offert
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
})

Header.displayName = "Header"

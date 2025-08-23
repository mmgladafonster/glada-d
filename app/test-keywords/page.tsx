"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Search, Filter, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

// Mock data for testing - this would come from lib/keywords.json in real implementation
const mockKeywords = [
  {
    "Keyword": "fönsterputs in och utvändigt",
    "Service": "fönsterputs",
    "Location": "All",
    "Modifier": "comprehensive",
    "Keyword_Type": "Long-tail",
    "Search_Intent": "Informational",
    "Estimated_Difficulty": "Medium",
    "Content_Type_Suggestion": "Service description page",
    "slug": "fonsterputs-in-och-utvandigt"
  },
  {
    "Keyword": "fönsterputs efter byggarbete",
    "Service": "fönsterputs",
    "Location": "All",
    "Modifier": "efter byggarbete",
    "Keyword_Type": "Problem-solving",
    "Search_Intent": "Transactional",
    "Estimated_Difficulty": "Low-Medium",
    "Content_Type_Suggestion": "Specialized cleaning page",
    "slug": "fonsterputs-efter-byggarbete"
  },
  {
    "Keyword": "fönsterputs med garanti",
    "Service": "fönsterputs",
    "Location": "All",
    "Modifier": "garanti",
    "Keyword_Type": "Long-tail",
    "Search_Intent": "Transactional",
    "Estimated_Difficulty": "Low",
    "Content_Type_Suggestion": "Guarantee/warranty page",
    "slug": "fonsterputs-med-garanti"
  },
  {
    "Keyword": "kristallklara fönster service",
    "Service": "fönsterputs",
    "Location": "All",
    "Modifier": "kristallklara",
    "Keyword_Type": "Benefit-focused",
    "Search_Intent": "Transactional",
    "Estimated_Difficulty": "Low",
    "Content_Type_Suggestion": "Results showcase page",
    "slug": "kristallklara-fonster-service"
  },
  {
    "Keyword": "fönsterputs göteborg",
    "Service": "fönsterputs",
    "Location": "Göteborg",
    "Modifier": "None",
    "Keyword_Type": "Local Service",
    "Search_Intent": "Transactional",
    "Estimated_Difficulty": "Medium-High",
    "Content_Type_Suggestion": "Service page for fönsterputs in Göteborg",
    "slug": "fonsterputs-goteborg"
  },
  {
    "Keyword": "billig fönsterputs göteborg",
    "Service": "fönsterputs",
    "Location": "Göteborg",
    "Modifier": "billig",
    "Keyword_Type": "Modified Service",
    "Search_Intent": "Transactional",
    "Estimated_Difficulty": "Medium",
    "Content_Type_Suggestion": "Landing page: billig fönsterputs Göteborg",
    "slug": "billig-fonsterputs-goteborg"
  }
]

export default function TestKeywordsPage() {
  const router = useRouter()
  const [keywords, setKeywords] = useState(mockKeywords)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterService, setFilterService] = useState("all")
  const [filterLocation, setFilterLocation] = useState("all")

  const services = Array.from(new Set(mockKeywords.map(k => k.Service)))
  const locations = Array.from(new Set(mockKeywords.map(k => k.Location)))

  const filteredKeywords = keywords.filter(keyword => {
    const matchesSearch = keyword.Keyword.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         keyword.Modifier.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesService = filterService === "all" || keyword.Service === filterService
    const matchesLocation = filterLocation === "all" || keyword.Location === filterLocation
    
    return matchesSearch && matchesService && matchesLocation
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <Badge className="mb-4 border-0 bg-gradient-to-r from-blue-100 to-indigo-100 px-4 py-2 text-blue-800">
            Technical Keywords Test
          </Badge>
          <h1 className="text-4xl font-bold lg:text-5xl mb-4">
            <span className="bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
              Technical Keywords Implementation Test
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Test the implementation of technical keywords for SEO optimization. This demonstrates how keywords are structured and filtered.
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Sök efter nyckelord..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Service Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  value={filterService}
                  onChange={(e) => setFilterService(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Alla tjänster</option>
                  {services.map(service => (
                    <option key={service} value={service}>{service}</option>
                  ))}
                </select>
              </div>

              {/* Location Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Alla platser</option>
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredKeywords.map((keyword, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {keyword.Keyword.charAt(0).toUpperCase() + keyword.Keyword.slice(1)}
                  </h3>
                  <Badge className={`ml-2 ${
                    keyword.Search_Intent === "Transactional" ? "bg-green-100 text-green-800" :
                    keyword.Search_Intent === "Informational" ? "bg-blue-100 text-blue-800" :
                    "bg-gray-100 text-gray-800"
                  }`}>
                    {keyword.Search_Intent}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <span className="font-medium">Tjänst:</span>
                    <span className="ml-2">{keyword.Service}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium">Plats:</span>
                    <span className="ml-2">{keyword.Location}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium">Modifierare:</span>
                    <span className="ml-2">{keyword.Modifier}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium">Typ:</span>
                    <span className="ml-2">{keyword.Keyword_Type}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium">Svårighet:</span>
                    <span className="ml-2">{keyword.Estimated_Difficulty}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Förslag:</span> {keyword.Content_Type_Suggestion}
                  </p>
                </div>

                <div className="mt-4">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => router.push(`/lp/${keyword.slug}`)}
                  >
                    Testa länk: /{keyword.slug}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats */}
        {filteredKeywords.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Inga nyckelord matchar dina filter.</p>
          </div>
        )}

        <div className="mt-8 text-center">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Testresultat</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{filteredKeywords.length}</div>
                  <div className="text-sm text-gray-600">Matchande nyckelord</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {new Set(filteredKeywords.map(k => k.Service)).size}
                  </div>
                  <div className="text-sm text-gray-600">Unika tjänster</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {new Set(filteredKeywords.map(k => k.Location)).size}
                  </div>
                  <div className="text-sm text-gray-600">Unika platser</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {new Set(filteredKeywords.map(k => k.Search_Intent)).size}
                  </div>
                  <div className="text-sm text-gray-600">Sökningsintentioner</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Test Instructions */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Testinstruktioner</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span>Testa sökfunktionen med olika nyckelord</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span>Filtrera efter tjänsttyp och plats</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span>Kontrollera att alla SEO-attribut visas korrekt</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span>Verifiera att slugs genereras korrekt</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  )
}

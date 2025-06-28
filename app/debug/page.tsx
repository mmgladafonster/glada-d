"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"

export default function DebugPage() {
  // This will run on the client side to show what we can see
  const clientEnvCheck = {
    nodeEnv: typeof window !== "undefined" ? "client" : "server",
    hasWindow: typeof window !== "undefined",
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>🔍 Resend Konfigurationsfelsökning</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Klientmiljö</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-100 rounded">
                    <span>Miljö:</span>
                    <Badge>{clientEnvCheck.nodeEnv}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-100 rounded">
                    <span>Har Fönster:</span>
                    {clientEnvCheck.hasWindow ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Förväntad Konfiguration</h3>
                <div className="space-y-2">
                  <div className="p-3 bg-blue-50 rounded">
                    <div className="font-medium">Obligatorisk Miljövariabel:</div>
                    <code className="text-sm">RESEND_API_KEY=re_...</code>
                  </div>
                  <div className="p-3 bg-blue-50 rounded">
                    <div className="font-medium">Förväntad Domän:</div>
                    <code className="text-sm">gladafonster.se</code>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-800">Server-Side Kontroll Krävs</h4>
                  <p className="text-yellow-700 text-sm mt-1">
                    Miljövariabler är endast tillgängliga på servern. Använd test-e-postsidan eller kontrollera
                    serverloggar för detaljerad diagnostik.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">🔧 Felsökningssteg</h4>
              <ol className="text-blue-700 text-sm space-y-1 list-decimal list-inside">
                <li>Kontrollera om RESEND_API_KEY är inställt i dina miljövariabler</li>
                <li>Verifiera att API-nyckeln börjar med "re_"</li>
                <li>Bekräfta att gladafonster.se-domänen är verifierad i Resend-instrumentpanelen</li>
                <li>Testa med hjälp av sidan /test-email</li>
                <li>Kontrollera webbläsarkonsolen och serverloggar för detaljerade fel</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

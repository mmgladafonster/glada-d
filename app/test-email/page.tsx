"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { sendContactEmail } from "../actions/send-email"

export default function TestEmailPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testEmail = async () => {
    setLoading(true)
    setResult(null)

    // Create test form data
    const formData = new FormData()
    formData.append("firstName", "Test")
    formData.append("lastName", "Användare")
    formData.append("email", "test@example.com")
    formData.append("phone", "070-123 45 67")
    formData.append("address", "Testgatan 123, Göteborg")
    formData.append("propertyType", "Villa")
    formData.append("description", "Detta är ett test av e-postfunktionen")

    try {
      const response = await sendContactEmail(null, formData)
      setResult(response)
    } catch (error) {
      setResult({
        success: false,
        message: `Fel: ${error}`,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>🧪 E-post Testsida</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Testa E-postfunktionalitet</h3>
              <p className="text-gray-600">
                Detta kommer att skicka ett test-e-postmeddelande till mmgladafonster@gmail.com med hjälp av
                kontaktformulärsåtgärden.
              </p>

              <Button onClick={testEmail} disabled={loading} className="w-full">
                {loading ? "Skickar Test-E-post..." : "Skicka Test-E-post"}
              </Button>
            </div>

            {result && (
              <div
                className={`p-4 rounded-lg ${
                  result.success
                    ? "bg-green-50 border border-green-200 text-green-800"
                    : "bg-red-50 border border-red-200 text-red-800"
                }`}
              >
                <h4 className="font-semibold mb-2">{result.success ? "✅ Lyckades" : "❌ Fel"}</h4>
                <p>{result.message}</p>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">🔍 Felsökningschecklista</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Kontrollera webbläsarkonsolen för felloggar</li>
                <li>• Verifiera att RESEND_API_KEY är inställt i miljön</li>
                <li>• Bekräfta att domänen gladafonster.se är verifierad i Resend</li>
                <li>• Kontrollera skräppostmappen i mmgladafonster@gmail.com</li>
                <li>• Verifiera Resend-instrumentpanelen för leveransstatus</li>
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Vanliga Problem</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Domän inte verifierad i Resend-instrumentpanelen</li>
                <li>• API-nyckel inte korrekt inställd i miljövariabler</li>
                <li>• E-post hamnar i skräppostmappen</li>
                <li>• Hastighetsbegränsning (för många test-e-postmeddelanden)</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

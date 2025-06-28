"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { useActionState } from "react"
import { sendContactEmail } from "../actions/send-email"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function TestEmailPage() {
  const [state, formAction, isPending] = useActionState(sendContactEmail, {
    success: false,
    message: "",
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />

      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6 md:p-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Test Email Functionality</h1>
                
                {state?.message && (
                  <div
                    className={`mb-6 p-4 rounded-lg ${
                      state.success 
                        ? "bg-green-50 border border-green-200 text-green-800" 
                        : "bg-red-50 border border-red-200 text-red-800"
                    }`}
                  >
                    {state.message}
                  </div>
                )}

                <form action={formAction} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Förnamn *</label>
                      <Input
                        name="firstName"
                        placeholder="Test"
                        required
                        disabled={isPending}
                        className="border-2 border-gray-200 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Efternamn *</label>
                      <Input
                        name="lastName"
                        placeholder="User"
                        required
                        disabled={isPending}
                        className="border-2 border-gray-200 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">E-post *</label>
                    <Input
                      name="email"
                      type="email"
                      placeholder="test@example.com"
                      required
                      disabled={isPending}
                      className="border-2 border-gray-200 focus:border-blue-500"
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
                      className="border-2 border-gray-200 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Beskrivning</label>
                    <Textarea
                      name="description"
                      placeholder="This is a test email to verify the functionality..."
                      rows={3}
                      disabled={isPending}
                      className="border-2 border-gray-200 focus:border-blue-500"
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
                      Jag godkänner GDPR *
                    </label>
                  </div>
                  
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isPending}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    {isPending ? "Skickar..." : "Skicka Test Email"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

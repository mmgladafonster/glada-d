import type { ReactNode } from "react"
import type { Metadata } from "next"
import "./globals.css"
import Analytics from "@/components/google-analytics"

export const metadata: Metadata = {
  title: "Glada Fönster - Professionell Fönsterputs i Göteborg",
  description: "Professionella fönsterputstjänster för hem och företag i Göteborg. 100% nöjdhetsgaranti.",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="sv">
      <body>
        <Analytics />
        {children}
      </body>
    </html>
  )
}

import type { ReactNode } from "react"
import type { Metadata } from "next"
import "./globals.css"
import Analytics from "@/components/google-analytics"

export const metadata: Metadata = {
  title: "Glada Fรถnster - Professionell Fรถnsterputs i Gรถteborg",
  description: "Professionella fรถnsterputstjรคnster fรถr hem och fรถretag i Gรถteborg. 100% nรถjdhetsgaranti.",
  generator: "v0.dev",
  alternates: {
    canonical: "https://gladafonster.se",
  },
  openGraph: {
    title: 'Glada Fรถnster',
    description: 'Vi levererar och monterar fรถnster i Kungsbacka, Gรถteborg och hela Halland. Kontakta oss fรถr kostnadsfri offert!',
    images: ['https://www.gladafonster.se/glada-fonster-kungsbacka-happy.png'],
    url: 'https://gladafonster.se',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="sv">
      <head>
        <link rel="icon" href="/glada-fonster.ico" sizes="any" />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Glada Fönster",
              "url": "https://gladafonster.se",
              "description": "Vi levererar och monterar fönster i Kungsbacka, Göteborg och hela Halland. Kontakta oss för kostnadsfri offert!",
              "publisher": {
                "@type": "Organization",
                "name": "Glada Fönster",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://www.gladafonster.se/glada-fonster-kungsbacka-happy.png"
                }
              }
            })
          }}
        />
        <Analytics />
        {children}
      </body>
    </html>
  )
}

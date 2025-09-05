import type { ReactNode } from "react"
import type { Metadata } from "next"
import "./globals.css"
import Analytics from "@/components/google-analytics"
import "@/lib/security-init" // Initialize security monitoring

export const metadata: Metadata = {
  title: "Glada Fönster - Professionell Fönsterputs i Göteborg",
  description: "Professionella fönsterputstjänster för hem och företag i Göteborg. 100% nöjdhetsgaranti.",
  generator: "v0.dev",
  alternates: {
    canonical: "https://gladafonster.se",
  },
  openGraph: {
    title: 'Glada Fönster',
    description: 'Vi levererar och monterar fönster i Kungsbacka, Göteborg och hela Halland. Kontakta oss för kostnadsfri offert!',
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
      <body suppressHydrationWarning={true}>
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

"use client"

import Script from "next/script"
import { CONFIG } from "@/lib/config"

export default function Analytics() {
  const GA_MEASUREMENT_ID = CONFIG.analytics.gaMeasurementId

  return (
    <>
      {/* Google Analytics */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="lazyOnload"
      />
      <Script id="google-analytics" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_title: document.title,
            page_location: window.location.href,
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  )
}

"use client"

import Script from "next/script"

interface GoogleAnalyticsLazyProps {
  gaId: string
}

export function GoogleAnalyticsLazy({
  gaId,
}: GoogleAnalyticsLazyProps): React.ReactElement {
  return (
    <>
      <Script
        id="ga-gtag"
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <Script id="ga-config" strategy="lazyOnload">
        {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');`}
      </Script>
    </>
  )
}

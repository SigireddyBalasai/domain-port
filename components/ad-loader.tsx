"use client"

import Script from "next/script"
import { useEffect, useRef } from "react"
import { useConsent } from "@/components/consent-provider"

interface AdLoaderProps {
  /** AdSense publisher client id, e.g. ca-pub-XXXXXXXXXXXXXXXX. */
  clientId?: string
}

/**
 * Loads the AdSense script only after the user has granted ad consent.
 * Renders nothing when ads are not consented or no client id is configured.
 */
export function AdLoader({
  clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID,
}: AdLoaderProps): React.ReactElement | null {
  const { consent, ready } = useConsent()
  const pushedRef = useRef(false)

  const adsAllowed = ready && consent?.ads === true

  useEffect(() => {
    if (!adsAllowed || !clientId || pushedRef.current) {
      return
    }

    pushedRef.current = true

    const w = window as unknown as {
      adsbygoogle?: unknown[]
    }

    w.adsbygoogle = w.adsbygoogle ?? []
  }, [adsAllowed, clientId])

  if (!adsAllowed || !clientId) {
    return null
  }

  return (
    <>
      <Script
        id="adsbygoogle"
        strategy="lazyOnload"
        crossOrigin="anonymous"
        data-ad-client={clientId}
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
      />
    </>
  )
}

/** A single ad slot. Renders a placeholder until ads are consented. */
export function AdSlot({
  slot,
  format = "auto",
  className,
}: {
  slot: string
  format?: string
  className?: string
}): React.ReactElement {
  const { consent, ready } = useConsent()
  const adsAllowed = ready && consent?.ads === true
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID

  if (!adsAllowed || !clientId) {
    return (
      <div
        className={`ad-slot-placeholder border-border text-muted-foreground flex min-h-[100px] items-center justify-center rounded-md border border-dashed text-sm ${
          className ?? ""
        }`}
        aria-hidden="true"
      />
    )
  }

  return (
    <ins
      className={`adsbygoogle ${className ?? ""}`}
      style={{ display: "block" }}
      data-ad-client={clientId}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  )
}

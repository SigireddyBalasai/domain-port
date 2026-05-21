"use client"

import type { JSX } from "react/jsx-runtime"
import { GoogleAnalytics } from "@next/third-parties/google"

export function Analytics(): JSX.Element | null {
  const gaId = process.env.NEXT_PUBLIC_GA4_ID

  if (!gaId) {
    return null
  }

  return <GoogleAnalytics gaId={gaId} />
}

"use client"

import dynamic from "next/dynamic"
import type { JSX } from "react/jsx-runtime"

const GoogleAnalytics = dynamic(
  () => import("@next/third-parties/google").then((mod) => mod.GoogleAnalytics),
  { ssr: false }
)

export function Analytics(): JSX.Element | null {
  const gaId = process.env.NEXT_PUBLIC_GA4_ID

  if (!gaId) {
    return null
  }

  return <GoogleAnalytics gaId={gaId} />
}

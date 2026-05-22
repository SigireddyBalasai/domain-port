"use client"

import dynamic from "next/dynamic"
import type { JSX } from "react"

const GoogleAnalyticsInner = dynamic(
  () => import("@next/third-parties/google").then((mod) => mod.GoogleAnalytics),
  { ssr: false }
)

interface GoogleAnalyticsLazyProps {
  gaId: string
}
export function GoogleAnalyticsLazy({
  gaId,
}: GoogleAnalyticsLazyProps): JSX.Element {
  return <GoogleAnalyticsInner gaId={gaId} />
}

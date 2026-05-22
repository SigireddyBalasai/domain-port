import type { JSX } from "react"
import { GoogleAnalytics } from "@next/third-parties/google"

interface GoogleAnalyticsLazyProps {
  gaId: string
}
export function GoogleAnalyticsLazy({
  gaId,
}: GoogleAnalyticsLazyProps): JSX.Element {
  return <GoogleAnalytics gaId={gaId} />
}

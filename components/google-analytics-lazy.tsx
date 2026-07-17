import { GoogleAnalytics } from "@next/third-parties/google"
import type { JSX } from "react"

interface GoogleAnalyticsLazyProps {
  gaId: string
}
export function GoogleAnalyticsLazy({
  gaId,
}: GoogleAnalyticsLazyProps): JSX.Element {
  return <GoogleAnalytics gaId={gaId} />
}

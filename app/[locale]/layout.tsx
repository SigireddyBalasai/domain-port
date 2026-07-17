import { SerwistProvider } from "@serwist/turbopack/react"
import { notFound } from "next/navigation"
import { hasLocale, NextIntlClientProvider } from "next-intl"
import { getMessages, setRequestLocale } from "next-intl/server"
import type { ReactNode } from "react"
import type { JSX } from "react/jsx-runtime"
import Footer from "@/components/footer"
import { ConsentBanner } from "@/components/consent-banner"
import { ConsentProvider } from "@/components/consent-provider"
import { AdLoader } from "@/components/ad-loader"
import { GoogleAnalyticsLazy } from "@/components/google-analytics-lazy"
import Header from "@/components/header"
import { ThemeProvider } from "@/components/theme-provider"
import { routing } from "@/i18n/routing"
import { fontVariables } from "@/lib/fonts"
import { isRtlLanguage } from "@/lib/languages"

interface Props {
  children: ReactNode
  params: Promise<{ locale: string }>
}

export const generateStaticParams = (): { locale: string }[] => {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: Props): Promise<JSX.Element> {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)

  const messages = await getMessages()
  const direction = isRtlLanguage(locale) ? "rtl" : "ltr"

  return (
    <html lang={locale} dir={direction} className={fontVariables}>
      <body>
        <SerwistProvider swUrl="/serwist/sw.js">
          <a
            href="#main-content"
            className="focus:bg-background focus:text-foreground focus:outline-ring sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:p-3"
          >
            Skip to content
          </a>
          <ThemeProvider>
            <NextIntlClientProvider locale={locale} messages={messages}>
              <ConsentProvider>
                <div className="flex min-h-screen flex-col">
                  <Header locale={locale} />
                  <main id="main-content" className="flex-1">
                    {children}
                  </main>
                  <Footer locale={locale} />
                </div>
                <ConsentBanner />
                <AdLoader />
              </ConsentProvider>
            </NextIntlClientProvider>
            {process.env.NEXT_PUBLIC_GA4_ID ? (
              <GoogleAnalyticsLazy gaId={process.env.NEXT_PUBLIC_GA4_ID} />
            ) : null}
          </ThemeProvider>
        </SerwistProvider>
      </body>
    </html>
  )
}

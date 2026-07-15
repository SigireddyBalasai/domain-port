import { notFound } from "next/navigation"
import { hasLocale, NextIntlClientProvider } from "next-intl"
import { getMessages, setRequestLocale } from "next-intl/server"
import type { ReactNode } from "react"
import type { JSX } from "react/jsx-runtime"
import { SerwistProvider } from "@serwist/turbopack/react"
import Footer from "@/components/footer"
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
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-background focus:p-3 focus:text-foreground focus:outline-ring"
          >
            Skip to content
          </a>
          <ThemeProvider>
            <NextIntlClientProvider locale={locale} messages={messages}>
              <div className="flex min-h-screen flex-col">
                <Header locale={locale} />
                <main id="main-content" className="flex-1">
                  {children}
                </main>
                <Footer locale={locale} />
              </div>
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

import { notFound } from "next/navigation"
import { hasLocale, NextIntlClientProvider } from "next-intl"
import { getMessages, setRequestLocale } from "next-intl/server"
import type { ReactNode } from "react"
import type { JSX } from "react/jsx-runtime"
import Footer from "@/components/footer"
import { GoogleAnalyticsLazy } from "@/components/google-analytics-lazy"
import Header from "@/components/header"
import { ThemeProvider } from "@/components/theme-provider"
import { routing } from "@/i18n/routing"
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
    <ThemeProvider>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <div className="flex min-h-screen flex-col" dir={direction}>
          <Header locale={locale} />
          {children}
          <Footer locale={locale} />
        </div>
      </NextIntlClientProvider>
      {process.env.NEXT_PUBLIC_GA4_ID ? (
        <GoogleAnalyticsLazy gaId={process.env.NEXT_PUBLIC_GA4_ID} />
      ) : null}
    </ThemeProvider>
  )
}

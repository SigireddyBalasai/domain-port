import { notFound } from "next/navigation"
import { hasLocale, NextIntlClientProvider } from "next-intl"
import { getMessages, setRequestLocale } from "next-intl/server"
import type { ReactNode } from "react"
import type { JSX } from "react/jsx-runtime"
import { GoogleAnalyticsLazy } from "@/components/google-analytics-lazy"
import { ThemeProvider } from "@/components/theme-provider"
import { routing } from "@/i18n/routing"

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

  return (
    <ThemeProvider>
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
      </NextIntlClientProvider>
      {process.env.NEXT_PUBLIC_GA4_ID ? (
        <GoogleAnalyticsLazy gaId={process.env.NEXT_PUBLIC_GA4_ID} />
      ) : null}
    </ThemeProvider>
  )
}

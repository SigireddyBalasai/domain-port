"use client"

import { useParams, usePathname, useRouter } from "next/navigation"
import { routing } from "@/i18n/routing"
import type { JSX } from "react"

const localeLabels: Record<string, string> = {
  en: "EN",
  es: "ES",
  fr: "FR",
}

export default function LanguageSwitcher(): JSX.Element {
  const pathname = usePathname()
  const router = useRouter()
  const { locale: currentLocale } = useParams()

  const switchLocale = (nextLocale: string) => {
    const segments = pathname.split("/").filter(Boolean)
    const pathWithoutLocale = (routing.locales as readonly string[]).includes(segments[0])
      ? segments.slice(1)
      : segments
    const nextPath = `/${nextLocale}/${pathWithoutLocale.join("/")}`
    router.push(nextPath.replace(/\/$/, "") || "/")
  }

  return (
    <div className="flex items-center gap-1">
      {routing.locales.map((locale) => (
        <button
          key={locale}
          onClick={() => switchLocale(locale)}
          type="button"
          className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
            currentLocale === locale
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {localeLabels[locale] ?? locale.toUpperCase()}
        </button>
      ))}
    </div>
  )
}

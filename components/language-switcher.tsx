"use client"

import { useParams, usePathname, useRouter } from "next/navigation"
import type { JSX } from "react"
import { Button } from "@/components/ui/button"
import { routing } from "@/i18n/routing"

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
    const pathWithoutLocale = (routing.locales as readonly string[]).includes(
      segments[0]
    )
      ? segments.slice(1)
      : segments
    const nextPath = `/${nextLocale}/${pathWithoutLocale.join("/")}`

    router.push(nextPath.replace(/\/$/, "") || "/")
  }

  return (
    <div className="flex items-center gap-1">
      {routing.locales.map((locale) => {
        return (
          <Button
            key={locale}
            variant={currentLocale === locale ? "default" : "ghost"}
            size="xs"
            onClick={() => {
              switchLocale(locale)
            }}
          >
            {localeLabels[locale] ?? locale.toUpperCase()}
          </Button>
        )
      })}
    </div>
  )
}

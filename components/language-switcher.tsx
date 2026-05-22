import Link from "next/link"
import type { JSX } from "react"
import { localeLabels, locales } from "@/lib/locales"

interface LanguageSwitcherProps {
  currentLocale: string
  currentPath: string
}

export default function LanguageSwitcher({
  currentLocale,
  currentPath,
}: LanguageSwitcherProps): JSX.Element {
  const normalizedPath =
    currentPath === "/" ? "" : currentPath.replace(/\/$/, "")

  return (
    <div className="flex items-center gap-1">
      {locales.map((locale) => {
        const href = `/${locale}${normalizedPath}`

        return (
          <Link
            key={locale}
            href={href}
            aria-current={currentLocale === locale ? "page" : undefined}
            className={
              currentLocale === locale
                ? "rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground"
                : "rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            }
          >
            {localeLabels[locale] ?? locale.toUpperCase()}
          </Link>
        )
      })}
    </div>
  )
}

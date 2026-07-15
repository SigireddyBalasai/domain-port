import Link from "next/link"
import { getLocale, getTranslations } from "next-intl/server"
import type { JSX } from "react"

export default async function LocaleNotFound(): Promise<JSX.Element> {
  const t = await getTranslations("common")
  const locale = await getLocale()

  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="mx-auto max-w-md px-4 text-center sm:px-6">
        <p className="font-display text-8xl font-bold text-primary">404</p>
        <h1 className="font-display mt-4 text-2xl font-bold">
          {t("notFoundTitle")}
        </h1>
        <p className="mt-2 text-muted-foreground">{t("notFoundDescription")}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("notFoundReport")}
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            {t("notFoundGoHome")}
          </Link>
          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center rounded-lg border border-border bg-background px-5 py-2.5 text-sm font-medium hover:bg-accent"
          >
            {t("notFoundBrowseBlog")}
          </Link>
        </div>
      </div>
    </div>
  )
}

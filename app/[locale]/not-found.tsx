import Link from "next/link"
import { getLocale, getTranslations } from "next-intl/server"
import type { JSX } from "react"

export default async function LocaleNotFound(): Promise<JSX.Element> {
  const t = await getTranslations("common")
  const locale = await getLocale()

  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="mx-auto max-w-md px-4 text-center sm:px-6">
        <p className="font-display text-primary text-8xl font-bold">404</p>
        <h1 className="font-display mt-4 text-2xl font-bold">
          {t("notFoundTitle")}
        </h1>
        <p className="text-muted-foreground mt-2">{t("notFoundDescription")}</p>
        <p className="text-muted-foreground mt-1 text-sm">
          {t("notFoundReport")}
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href={`/${locale}`}
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center rounded-lg px-5 py-2.5 text-sm font-medium"
          >
            {t("notFoundGoHome")}
          </Link>
          <Link
            href={`/${locale}/blog`}
            className="border-border bg-background hover:bg-accent inline-flex items-center rounded-lg border px-5 py-2.5 text-sm font-medium"
          >
            {t("notFoundBrowseBlog")}
          </Link>
        </div>
      </div>
    </div>
  )
}

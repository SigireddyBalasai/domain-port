import Image from "next/image"
import Link from "next/link"
import { getTranslations } from "next-intl/server"
import type { JSX } from "react"
import LanguageSwitcher from "@/components/language-switcher"
import { ThemeToggleLazy as ThemeToggle } from "@/components/theme-toggle-lazy"
import { locales } from "@/lib/locales"
import { siteConfig } from "@/lib/site-config"

interface HeaderProps {
  locale: string
}

export default async function Header({
  locale,
}: HeaderProps): Promise<JSX.Element> {
  const t = await getTranslations("common")

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <Link href={`/${locale}`} className="flex items-center space-x-2">
            <Image
              priority
              src="/logo-icon.svg"
              alt={siteConfig.name}
              width={24}
              height={24}
            />
            <span className="font-bold">{siteConfig.name}</span>
          </Link>
          <nav className="flex items-center space-x-6">
            <Link
              href={`/${locale}/blog`}
              className="text-sm font-medium hover:text-primary"
            >
              {t("blog")}
            </Link>
            <LanguageSwitcher currentLocale={locale} locales={locales} />
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}

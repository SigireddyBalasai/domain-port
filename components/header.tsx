import Image from "next/image"
import Link from "next/link"
import { getTranslations } from "next-intl/server"
import type { JSX } from "react"
import LanguageSwitcher from "@/components/language-switcher"
import { ThemeToggleLazy as ThemeToggle } from "@/components/theme-toggle-lazy"
import { siteConfig } from "@/lib/site-config"

interface HeaderProps {
  locale: string
  currentPath: string
}

export default async function Header({
  locale,
  currentPath,
}: HeaderProps): Promise<JSX.Element> {
  const t = await getTranslations("common")

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <Link href={`/${locale}`} className="flex items-center space-x-2">
            <Image
              aria-hidden
              priority
              src="/logo-icon.svg"
              alt=""
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
            <LanguageSwitcher
              currentLocale={locale}
              currentPath={currentPath}
            />
            <ThemeToggle />
            {siteConfig.links.twitter && (
              <a
                href={siteConfig.links.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium hover:text-primary"
                aria-label="X (Twitter)"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

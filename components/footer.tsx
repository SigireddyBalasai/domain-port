"use client"

import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useTranslations } from "next-intl"
import type { JSX } from "react"
import { siteConfig } from "@/lib/site-config"

export default function Footer(): JSX.Element {
  const t = useTranslations("common")
  const { locale } = useParams()

  return (
    <footer className="border-t border-border/40 bg-background/95 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center space-x-2">
              <Image src="/logo-icon.svg" alt={siteConfig.name} width={24} height={24} />
              <h3 className="font-bold">{siteConfig.name}</h3>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {siteConfig.description}
            </p>
          </div>
          <div>
            <h4 className="font-semibold">{t("navigation")}</h4>
            <nav className="mt-4 space-y-2">
              <Link href={`/${locale}`} className="block text-sm hover:text-primary">
                {t("home")}
              </Link>
              <Link href={`/${locale}/blog`} className="block text-sm hover:text-primary">
                {t("blog")}
              </Link>
            </nav>
          </div>
          <div>
            <h4 className="font-semibold">{t("connect")}</h4>
            <div className="mt-4 space-y-2">
              {siteConfig.links.twitter && (
                <a
                  href={siteConfig.links.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm hover:text-primary"
                >
                  Twitter
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-border/40 pt-8 text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.name}. {t("copyright")}
          </p>
        </div>
      </div>
    </footer>
  )
}

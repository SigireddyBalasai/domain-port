import Image from "next/image"
import Link from "next/link"
import { getTranslations } from "next-intl/server"
import type { JSX } from "react"
import { siteConfig } from "@/lib/site-config"

interface FooterProps {
  locale: string
}

export default async function Footer({
  locale,
}: FooterProps): Promise<JSX.Element> {
  const t = await getTranslations("common")

  return (
    <footer className="border-border/40 bg-background/95 border-t py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center space-x-2">
              <Image
                priority={true}
                src="/logo-icon.svg"
                alt={siteConfig.name}
                width={24}
                height={24}
              />
              <h3 className="font-bold">{siteConfig.name}</h3>
            </div>
            <p className="text-muted-foreground mt-2 text-sm">
              {siteConfig.description}
            </p>
          </div>
          <div>
            <h4 className="font-semibold">{t("navigation")}</h4>
            <nav className="mt-4 space-y-2">
              <Link
                href={`/${locale}`}
                className="hover:text-primary block text-sm"
              >
                {t("home")}
              </Link>
              <Link
                href={`/${locale}/blog`}
                className="hover:text-primary block text-sm"
              >
                {t("blog")}
              </Link>
            </nav>
          </div>
          <div>
            <h4 className="font-semibold">{t("connect")}</h4>
            <div className="mt-4 space-y-2" />
          </div>
        </div>
        <div className="border-border/40 text-muted-foreground mt-8 border-t pt-8 text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.name}.{" "}
            {t("copyright")}
          </p>
        </div>
      </div>
    </footer>
  )
}

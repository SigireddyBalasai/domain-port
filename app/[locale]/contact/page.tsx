import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import type { JSX } from "react"
import type { BreadcrumbList, WebPage } from "schema-dts"
import { defaultLocale, locales } from "@/lib/locales"
import { siteConfig } from "@/lib/site-config"
import { JsonLd } from "@/lib/json-ld"

interface Props {
  params: Promise<{ locale: string }>
}

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "legal" })
  const ogLocale = (siteConfig.localeMap[locale] ?? "en-US").replaceAll(
    "-",
    "_"
  )
  const localePrefix = locale === defaultLocale ? "" : `/${locale}`
  const pageUrl = `${siteConfig.url}${localePrefix}/contact`

  return {
    title: t("contactTitle"),
    description: t("contactDescription"),
    alternates: {
      canonical: pageUrl,
      languages: {
        ...Object.fromEntries(
          locales.map((l) => [
            l,
            `${siteConfig.url}${l === defaultLocale ? "" : `/${l}`}/contact`,
          ])
        ),
        "x-default": `${siteConfig.url}/contact`,
      },
    },
    openGraph: {
      locale: ogLocale,
      url: pageUrl,
      siteName: siteConfig.name,
      title: t("contactTitle"),
      description: t("contactDescription"),
      images: [{ url: siteConfig.ogImage, width: 1200, height: 630 }],
    },
  }
}

export default async function ContactPage({
  params,
}: Props): Promise<JSX.Element> {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: "legal" })
  const localePrefix = locale === defaultLocale ? "" : `/${locale}`

  return (
    <>
      <JsonLd<BreadcrumbList>
        schema={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: siteConfig.url,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: t("contact"),
              item: `${siteConfig.url}${localePrefix}/contact`,
            },
          ],
        }}
      />
      <JsonLd<WebPage>
        schema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: t("contactTitle"),
          description: t("contactDescription"),
          url: `${siteConfig.url}${localePrefix}/contact`,
          isPartOf: {
            "@type": "WebSite",
            name: siteConfig.name,
            url: siteConfig.url,
          },
        }}
      />
      <div className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="mb-6 text-4xl font-bold">{t("contactTitle")}</h1>
          <div className="prose prose-sm max-w-none space-y-4">
            <p>{t("contactDescription")}</p>
            <ul className="list-inside list-disc space-y-1">
              <li>
                Email:{" "}
                <a
                  className="text-primary underline"
                  href="mailto:hello@cctv.name"
                >
                  hello@cctv.name
                </a>
              </li>
              {siteConfig.links.youtube ? (
                <li>
                  YouTube:{" "}
                  <a
                    className="text-primary underline"
                    href={siteConfig.links.youtube}
                  >
                    {siteConfig.links.youtube}
                  </a>
                </li>
              ) : null}
              {siteConfig.links.github ? (
                <li>
                  GitHub:{" "}
                  <a
                    className="text-primary underline"
                    href={siteConfig.links.github}
                  >
                    {siteConfig.links.github}
                  </a>
                </li>
              ) : null}
            </ul>
            <p className="text-muted-foreground text-sm">
              &copy; {new Date().getFullYear()} {siteConfig.name}.{" "}
              {t("copyrightNote")}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

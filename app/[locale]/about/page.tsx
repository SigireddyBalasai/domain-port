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
  const pageUrl = `${siteConfig.url}${localePrefix}/about`

  return {
    title: t("aboutTitle"),
    description: t("aboutDescription"),
    alternates: {
      canonical: pageUrl,
      languages: {
        ...Object.fromEntries(
          locales.map((l) => [
            l,
            `${siteConfig.url}${l === defaultLocale ? "" : `/${l}`}/about`,
          ])
        ),
        "x-default": `${siteConfig.url}/about`,
      },
    },
    openGraph: {
      locale: ogLocale,
      url: pageUrl,
      siteName: siteConfig.name,
      title: t("aboutTitle"),
      description: t("aboutDescription"),
      images: [{ url: siteConfig.ogImage, width: 1200, height: 630 }],
    },
  }
}

export default async function AboutPage({
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
              name: t("about"),
              item: `${siteConfig.url}${localePrefix}/about`,
            },
          ],
        }}
      />
      <JsonLd<WebPage>
        schema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: t("aboutTitle"),
          description: t("aboutDescription"),
          url: `${siteConfig.url}${localePrefix}/about`,
          isPartOf: {
            "@type": "WebSite",
            name: siteConfig.name,
            url: siteConfig.url,
          },
        }}
      />
      <div className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="mb-6 text-4xl font-bold">{t("aboutTitle")}</h1>
          <div className="prose prose-sm max-w-none space-y-4">
            <p>
              {siteConfig.name} is an independent resource for CCTV and
              surveillance buyers. We publish hands-on camera reviews,
              comparison guides, and practical installation tips to help
              homeowners and businesses choose the right security setup.
            </p>
            <p>
              Our content is researched and written by a small editorial team.
              Where we link to products, we may use affiliate links that earn a
              commission at no extra cost to you. This does not influence our
              reviews.
            </p>
            <p>
              Questions or corrections? Reach us through the{" "}
              <a
                className="text-primary underline"
                href={`${localePrefix}/contact`}
              >
                {t("contact").toLowerCase()}
              </a>{" "}
              page.
            </p>
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

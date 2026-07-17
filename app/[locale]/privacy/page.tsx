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
  const pageUrl = `${siteConfig.url}${localePrefix}/privacy`

  return {
    title: t("privacyTitle"),
    description: t("privacyDescription"),
    alternates: {
      canonical: pageUrl,
      languages: {
        ...Object.fromEntries(
          locales.map((l) => [
            l,
            `${siteConfig.url}${l === defaultLocale ? "" : `/${l}`}/privacy`,
          ])
        ),
        "x-default": `${siteConfig.url}/privacy`,
      },
    },
    openGraph: {
      locale: ogLocale,
      url: pageUrl,
      siteName: siteConfig.name,
      title: t("privacyTitle"),
      description: t("privacyDescription"),
      images: [{ url: siteConfig.ogImage, width: 1200, height: 630 }],
    },
  }
}

export default async function PrivacyPage({
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
              name: t("privacy"),
              item: `${siteConfig.url}${localePrefix}/privacy`,
            },
          ],
        }}
      />
      <JsonLd<WebPage>
        schema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: t("privacyTitle"),
          description: t("privacyDescription"),
          url: `${siteConfig.url}${localePrefix}/privacy`,
          isPartOf: {
            "@type": "WebSite",
            name: siteConfig.name,
            url: siteConfig.url,
          },
        }}
      />
      <div className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="mb-6 text-4xl font-bold">{t("privacyTitle")}</h1>
          <div className="prose prose-sm max-w-none space-y-4">
            <p>
              This Privacy Policy explains how {siteConfig.name}{" "}
              (&quot;we&quot;, &quot;us&quot;) collects, uses, and protects
              information when you visit {siteConfig.url} and its localized
              versions.
            </p>

            <h2 className="text-2xl font-semibold">Information we collect</h2>
            <p>
              We collect limited technical data automatically through cookies
              and analytics tools, such as pages viewed, approximate location
              (country and language), device type, and referral source. We do
              not require you to create an account to read our content.
            </p>

            <h2 className="text-2xl font-semibold">Cookies and advertising</h2>
            <p>
              We use cookies for essential site functionality, anonymous
              analytics, and to display advertising. Advertising and analytics
              cookies are loaded only after you grant consent through our cookie
              banner. You can change your choice at any time. Advertising is
              served by third-party networks (such as Google AdSense) that may
              use cookies to personalize ads based on your prior visits.
            </p>

            <h2 className="text-2xl font-semibold">Third parties</h2>
            <p>
              We may use third-party services for analytics and advertising.
              These providers process data under their own privacy policies. We
              do not sell personal information.
            </p>

            <h2 className="text-2xl font-semibold">Your rights</h2>
            <p>
              Depending on your region (including the EU/EEA under GDPR and
              California under CCPA), you may have the right to access, correct,
              or delete your data, and to object to or restrict certain
              processing. You can exercise these rights by contacting us via the
              contact page.
            </p>

            <h2 className="text-2xl font-semibold">Changes</h2>
            <p>
              We may update this policy periodically. Material changes will be
              reflected on this page.
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

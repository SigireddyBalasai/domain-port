import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import type { JSX } from "react/jsx-runtime"
import type { BreadcrumbList, CollectionPage, ItemList } from "schema-dts"
import { posts } from "@/.velite"
import BlogCard from "@/components/blog/blog-card"
import { PopularTagsSidebar } from "@/components/blog/popular-tags-sidebar"
import { JsonLd } from "@/lib/json-ld"
import { defaultLocale, locales } from "@/lib/locales"
import { siteConfig } from "@/lib/site-config"

interface Props {
  params: Promise<{ locale: string }>
}

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { locale } = await params
  const ogLocale = (siteConfig.localeMap[locale] ?? "en-US").replaceAll(
    "-",
    "_"
  )
  const localePrefix = locale === defaultLocale ? "" : `/${locale}`
  const pageUrl = `${siteConfig.url}${localePrefix}/blog`

  return {
    title: "CCTV Camera Guides & Reviews",
    description:
      "Expert CCTV guides, security camera reviews, and surveillance how-tos. Compare 4K vs 5MP, learn NVR setup, and find the best cameras for your needs.",
    keywords: [
      "CCTV blog",
      "security camera guide",
      "surveillance tips",
      "camera reviews",
      "CCTV installation",
    ],
    openGraph: {
      locale: ogLocale,
      url: pageUrl,
      siteName: siteConfig.name,
      title: "CCTV Camera Guides & Reviews",
      description:
        "Expert CCTV guides, security camera reviews, and surveillance how-tos. Compare 4K vs 5MP, learn NVR setup, and find the best cameras for your needs.",
      images: [{ url: siteConfig.ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: "CCTV Camera Guides & Reviews",
      description:
        "Expert CCTV guides, security camera reviews, and surveillance how-tos. Compare 4K vs 5MP, learn NVR setup, and find the best cameras for your needs.",
      images: [siteConfig.ogImage],
    },
    alternates: {
      canonical: pageUrl,
      languages: {
        ...Object.fromEntries(
          locales.map((l) => {
            return [
              l,
              l === defaultLocale
                ? `${siteConfig.url}/blog`
                : `${siteConfig.url}/${l}/blog`,
            ]
          })
        ),
        "x-default": `${siteConfig.url}/blog`,
      },
    },
  }
}

export default async function BlogPage({
  params,
}: Props): Promise<JSX.Element> {
  const { locale } = await params

  setRequestLocale(locale)
  const t = await getTranslations("common")

  const sorted = [...posts]
    .filter((p) => p.locale === locale)
    .toSorted(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )

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
              name: "Blog",
              item: `${siteConfig.url}/${locale}/blog`,
            },
          ],
        }}
      />
      <JsonLd<CollectionPage>
        schema={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `Blog | ${siteConfig.name}`,
          description: `Latest CCTV and surveillance insights from ${siteConfig.name}.`,
          url: `${siteConfig.url}/${locale}/blog`,
        }}
      />
      <JsonLd<ItemList>
        schema={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: `Blog | ${siteConfig.name}`,
          description: `Latest CCTV and surveillance insights from ${siteConfig.name}.`,
          url: `${siteConfig.url}/${locale}/blog`,
          numberOfItems: sorted.length,
          itemListElement: sorted.map((post, index) => {
            const postPrefix = locale === defaultLocale ? "" : `/${locale}`

            return {
              "@type": "ListItem",
              position: index + 1,
              url: `${siteConfig.url}${postPrefix}/blog/${post.slug}`,
            }
          }),
        }}
      />
      <div className="flex-1">
        <div className="mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main content */}
            <div className="lg:col-span-3 space-y-6">
              <h1 className="mb-8 text-4xl font-bold">{t("blog")}</h1>
              {sorted.map((post) => {
                return (
                  <BlogCard
                    key={post.slug}
                    title={post.title}
                    description={post.description}
                    publishedAt={post.publishedAt}
                    slug={post.slug}
                    locale={locale}
                    tags={post.tags}
                  />
                )
              })}
              {sorted.length === 0 && (
                <p className="text-muted-foreground">{t("noPosts")}</p>
              )}
            </div>
            {/* Sidebar */}
            <aside className="lg:col-span-1 space-y-8">
              <PopularTagsSidebar posts={sorted} />
            </aside>
          </div>
        </div>
      </div>
    </>
  )
}

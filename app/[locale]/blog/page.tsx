import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import type { JSX } from "react/jsx-runtime"
import type { BreadcrumbList, CollectionPage } from "schema-dts"
import { posts } from "@/.velite"
import BlogCard from "@/components/blog/blog-card"
import Footer from "@/components/footer"
import Header from "@/components/header"
import { JsonLd } from "@/lib/json-ld"
import { locales } from "@/lib/locales"
import { siteConfig } from "@/lib/site-config"

interface Props {
  params: Promise<{ locale: string }>
}

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { locale } = await params
  const ogLocale = siteConfig.localeMap[locale] ?? "en_US"

  return {
    title: "Blog",
    description: `Latest CCTV and surveillance insights — reviews, guides, and security tips from ${siteConfig.name}.`,
    openGraph: {
      locale: ogLocale,
      url: `${siteConfig.url}/${locale}/blog`,
      siteName: siteConfig.name,
      title: `Blog | ${siteConfig.name}`,
      description: `Latest CCTV and surveillance insights — reviews, guides, and security tips from ${siteConfig.name}.`,
      images: [{ url: siteConfig.ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      site: siteConfig.author.twitter,
      creator: siteConfig.author.twitter,
      title: `Blog | ${siteConfig.name}`,
      description: `Latest CCTV and surveillance insights — reviews, guides, and security tips from ${siteConfig.name}.`,
      images: [siteConfig.ogImage],
    },
    alternates: {
      canonical: `${siteConfig.url}/${locale}/blog`,
      languages: {
        ...Object.fromEntries(
          locales.map((l) => [l, `${siteConfig.url}/${l}/blog`])
        ),
        "x-default": `${siteConfig.url}/en/blog`,
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

  const sorted = [...posts].toSorted(
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
      <div className="flex min-h-screen flex-col">
        <Header locale={locale} currentPath="/blog" />
        <main className="flex-1">
          <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
            <h1 className="mb-8 text-4xl font-bold">{t("blog")}</h1>
            <div className="space-y-6">
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
          </div>
        </main>
        <Footer locale={locale} />
      </div>
    </>
  )
}

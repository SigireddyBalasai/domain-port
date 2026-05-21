import type { Metadata } from "next"
import type { JSX } from "react"
import type { BreadcrumbList, Person, ProfilePage } from "schema-dts"
import { getTranslations } from "next-intl/server"
import { setRequestLocale } from "next-intl/server"
import { posts } from "@/.velite"
import BlogCard from "@/components/blog/blog-card"
import Footer from "@/components/footer"
import Header from "@/components/header"
import { JsonLd } from "@/lib/json-ld"
import { siteConfig } from "@/lib/site-config"

type Props = {
  params: Promise<{ locale: string; name: string }>
}

export const generateStaticParams = async (): Promise<
  { locale: string; name: string }[]
> => {
  const locales = ["en", "es", "fr"]
  const authors = posts
    .map((post) => post.author)
    .filter(
      (author): author is string => typeof author === "string" && author !== ""
    )

  const uniqueAuthors = [...new Set(authors)]

  return locales.flatMap((locale) =>
    uniqueAuthors.map((author) => ({
      locale,
      name: author.toLowerCase().replaceAll(/\s+/g, "-"),
    }))
  )
}

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { locale, name } = await params
  const authorName = name.replaceAll("-", " ")

  return {
    title: `${authorName} - Author`,
    description: `Articles and guides by ${authorName} on ${siteConfig.name}.`,
    openGraph: {
      url: `${siteConfig.url}/${locale}/author/${name}`,
      title: `${authorName} | ${siteConfig.name}`,
      description: `Articles and guides by ${authorName}.`,
    },
    alternates: {
      canonical: `/${locale}/author/${name}`,
      languages: {
        en: `/en/author/${name}`,
        es: `/es/author/${name}`,
        fr: `/fr/author/${name}`,
        "x-default": `/en/author/${name}`,
      },
    },
  }
}

export default async function AuthorPage({
  params,
}: Props): Promise<JSX.Element> {
  const { locale, name } = await params
  setRequestLocale(locale)
  const t = await getTranslations("common")

  const authorName = name.replaceAll("-", " ")
  const authorPosts = posts.filter(
    (post) => post.author?.toLowerCase() === authorName.toLowerCase()
  )
  const sorted = [...authorPosts].toSorted(
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
              name: "Authors",
              item: `${siteConfig.url}/${locale}/authors`,
            },
            {
              "@type": "ListItem",
              position: 3,
              name: authorName,
              item: `${siteConfig.url}/${locale}/author/${name}`,
            },
          ],
        }}
      />
      <JsonLd<Person>
        schema={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: authorName,
          url: `${siteConfig.url}/${locale}/author/${name}`,
          sameAs: [siteConfig.links.twitter],
        }}
      />
      <JsonLd<ProfilePage>
        schema={{
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          mainEntity: {
            "@type": "Person",
            name: authorName,
          },
        }}
      />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
            <h1 className="mb-2 text-4xl font-bold">{authorName}</h1>
            <p className="mb-8 text-muted-foreground">
              {sorted.length} article{sorted.length === 1 ? "" : "s"} published
            </p>
            <div className="space-y-6">
              {sorted.map((post) => {
                return (
                  <BlogCard
                    key={post.slug}
                    title={post.title}
                    description={post.description}
                    publishedAt={post.publishedAt}
                    slug={post.slug}
                    tags={post.tags}
                  />
                )
              })}
              {sorted.length === 0 && (
                <p className="text-muted-foreground">{t("noArticles")}</p>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  )
}

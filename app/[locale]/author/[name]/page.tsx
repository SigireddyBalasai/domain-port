import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { setRequestLocale } from "next-intl/server"
import type { JSX } from "react"
import type { BreadcrumbList, Person, ProfilePage } from "schema-dts"
import { posts } from "@/.velite"
import BlogCard from "@/components/blog/blog-card"
import { JsonLd } from "@/lib/json-ld"
import { defaultLocale, locales } from "@/lib/locales"
import { siteConfig } from "@/lib/site-config"

interface Props {
  params: Promise<{ locale: string; name: string }>
}

export const generateStaticParams = (): { locale: string; name: string }[] => {
  const authors = posts
    .map((post) => post.author)
    .filter(
      (author): author is string => typeof author === "string" && author !== ""
    )

  const uniqueAuthors = [...new Set(authors)]

  return locales.flatMap((locale) => {
    return uniqueAuthors.map((author) => {
      return {
        locale,
        name: author.toLowerCase().replaceAll(/\s+/g, "-"),
      }
    })
  })
}

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { locale, name } = await params
  const authorName = name.replaceAll("-", " ")
  const ogLocale = (siteConfig.localeMap[locale] ?? "en-US").replaceAll(
    "-",
    "_"
  )
  const localePrefix = locale === defaultLocale ? "" : `/${locale}`
  const pageUrl = `${siteConfig.url}${localePrefix}/author/${name}`

  return {
    title: `${authorName} - Author`,
    description: `Articles and guides by ${authorName} on ${siteConfig.name}.`,
    openGraph: {
      locale: ogLocale,
      url: pageUrl,
      siteName: siteConfig.name,
      title: `${authorName} | ${siteConfig.name}`,
      description: `Articles and guides by ${authorName}.`,
      images: [{ url: siteConfig.ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${authorName} | ${siteConfig.name}`,
      description: `Articles and guides by ${authorName}.`,
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
                ? `${siteConfig.url}/author/${name}`
                : `${siteConfig.url}/${l}/author/${name}`,
            ]
          })
        ),
        "x-default": `${siteConfig.url}/author/${name}`,
      },
    },
  }
}

export default async function AuthorPage({
  params,
}: Props): Promise<JSX.Element> {
  const { locale, name } = await params

  setRequestLocale(locale)

  const authorName = name.replaceAll("-", " ")
  const authorPosts = posts.filter(
    (post) => post.author?.toLowerCase() === authorName.toLowerCase()
  )

  if (authorPosts.length === 0) {
    notFound()
  }

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
              name: "Blog",
              item: `${siteConfig.url}/${locale}/blog`,
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
          sameAs: [],
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
      <div className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="mb-2 text-4xl font-bold">{authorName}</h1>
          <p className="text-muted-foreground mb-8">
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
                  locale={locale}
                  tags={post.tags}
                />
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}

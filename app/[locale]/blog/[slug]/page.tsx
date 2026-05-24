import "../../../blog-content.css"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getTranslations, setRequestLocale } from "next-intl/server"
import type { JSX } from "react/jsx-runtime"
import type {
  Article,
  BlogPosting,
  BreadcrumbList,
  Event,
  FAQPage,
  HowTo,
  ImageObject,
  Organization,
  Person,
  Product,
  Review,
  SoftwareApplication,
  SpeakableSpecification,
  VideoObject,
  WithContext,
} from "schema-dts"
import { posts } from "@/.velite"
import { ShareButtonsLazy } from "@/components/blog/share-buttons-lazy"
import { MdxContent } from "@/components/mdx-content"
import { JsonLd } from "@/lib/json-ld"
import { defaultLocale, locales } from "@/lib/locales"
import { siteConfig } from "@/lib/site-config"

const ShareButtons = ShareButtonsLazy

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

export const generateStaticParams = (): { locale: string; slug: string }[] => {
  return locales.flatMap((locale) => {
    return posts.map((post) => {
      return {
        locale,
        slug: post.slug,
      }
    })
  })
}

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { locale, slug } = await params
  const post = posts.find((p) => p.slug === slug)

  if (!post) {
    return Promise.resolve({})
  }

  const ogLocale = (siteConfig.localeMap[locale] ?? "en-US").replaceAll('-', "_")
  const localePrefix = locale === defaultLocale ? "" : `/${locale}`
  const postUrl = `${siteConfig.url}${localePrefix}/blog/${post.slug}`

  return Promise.resolve({
    title: post.title,
    description:
      post.description ?? `Read about ${post.title} on ${siteConfig.name}`,
    alternates: {
      canonical: postUrl,
      languages: {
        ...Object.fromEntries(
          locales.map((l) => {
            return [
              l,
              l === defaultLocale
                ? `${siteConfig.url}/blog/${post.slug}`
                : `${siteConfig.url}/${l}/blog/${post.slug}`,
            ]
          })
        ),
        "x-default": `${siteConfig.url}/blog/${post.slug}`,
      },
    },
    authors: post.author
      ? [
          {
            name: post.author,
            url: `${siteConfig.url}${localePrefix}/author/${post.author.toLowerCase().replaceAll(/\s+/g, "-")}`,
          },
        ]
      : undefined,
    keywords: post.tags,
    openGraph: {
      type: "article",
      locale: ogLocale,
      url: postUrl,
      siteName: siteConfig.name,
      title: post.title,
      description:
        post.description ?? `Read about ${post.title} on ${siteConfig.name}`,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      tags: post.tags,
      images: [
        {
          url: `${siteConfig.url}${post.image ?? "/og.svg"}`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: siteConfig.author.twitter,
      creator: siteConfig.author.twitter,
      title: post.title,
      description:
        post.description ?? `Read about ${post.title} on ${siteConfig.name}`,
      images: [`${siteConfig.url}${post.image ?? "/og.svg"}`],
    },
  })
}

const createAuthorSchema = (
  author: string | undefined
): WithContext<Person> | WithContext<Organization> => {
  if (author) {
    return {
      "@context": "https://schema.org",
      "@type": "Person",
      name: author,
    }
  }

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
  }
}

export default async function PostPage({
  params,
}: Props): Promise<JSX.Element> {
  const { locale, slug } = await params

  setRequestLocale(locale)
  const t = await getTranslations("common")
  const post = posts.find((p) => p.slug === slug)

  if (!post) {
    notFound()
  }

  const authorSchema = createAuthorSchema(post.author)

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
              name: post.title,
              item: `${siteConfig.url}/${locale}/blog/${post.slug}`,
            },
          ],
        }}
      />
      <JsonLd<BlogPosting>
        schema={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.description ?? undefined,
          keywords: post.tags ?? undefined,
          datePublished: post.publishedAt,
          dateModified: post.updatedAt ?? post.publishedAt,
          author: authorSchema,
          url: `${siteConfig.url}/${locale}/blog/${post.slug}`,
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `${siteConfig.url}/${locale}/blog/${post.slug}`,
          },
          image: {
            "@type": "ImageObject",
            url: `${siteConfig.url}${post.image ?? "/og.svg"}`,
            width: "1200",
            height: "630",
          },
          publisher: {
            "@type": "Organization",
            name: siteConfig.name,
            logo: { "@type": "ImageObject", url: siteConfig.ogImage },
          },
        }}
      />
      {post.postType === "article" && (
        <JsonLd<Article>
          schema={{
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.description ?? undefined,
            keywords: post.tags ?? undefined,
            datePublished: post.publishedAt,
            dateModified: post.updatedAt ?? post.publishedAt,
            author: authorSchema,
            url: `${siteConfig.url}/${locale}/blog/${post.slug}`,
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `${siteConfig.url}/${locale}/blog/${post.slug}`,
            },
            image: {
              "@type": "ImageObject",
              url: `${siteConfig.url}${post.image ?? "/og.svg"}`,
              width: "1200",
              height: "630",
            },
            publisher: {
              "@type": "Organization",
              name: siteConfig.name,
              logo: { "@type": "ImageObject", url: siteConfig.ogImage },
            },
          }}
        />
      )}
      {post.faq && post.faq.length > 0 && (
        <JsonLd<FAQPage>
          schema={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: post.faq.map((item) => {
              return {
                "@type": "Question",
                name: item.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: item.answer,
                },
              }
            }),
          }}
        />
      )}
      {post.howTo && post.howTo.length > 0 && (
        <JsonLd<HowTo>
          schema={{
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: post.title,
            description: post.description ?? undefined,
            step: post.howTo.map((step) => {
              return {
                "@type": "HowToStep",
                name: step.name,
                text: step.text,
              }
            }),
          }}
        />
      )}
      {post.video &&
        post.video.length > 0 &&
        post.video.map((video, index) => {
          return (
            <JsonLd<VideoObject>
              key={video.name + String(index)}
              schema={{
                "@context": "https://schema.org",
                "@type": "VideoObject",
                name: video.name,
                description: video.description ?? post.description ?? undefined,
                thumbnailUrl: video.thumbnailUrl ?? post.image ?? undefined,
                uploadDate: video.uploadDate ?? post.publishedAt,
                contentUrl: video.contentUrl,
                embedUrl: video.embedUrl,
                duration: video.duration,
              }}
            />
          )
        })}
      {post.product && (
        <>
          <JsonLd<Product>
            schema={{
              "@context": "https://schema.org",
              "@type": "Product",
              name: post.product.name,
              description: post.product.description ?? post.description,
              image: post.product.image ?? post.image,
              brand: post.product.brand
                ? { "@type": "Brand", name: post.product.brand }
                : undefined,
              offers: {
                "@type": "Offer",
                price: post.product.price,
                priceCurrency: post.product.priceCurrency,
                availability:
                  post.product.availability === "OutOfStock"
                    ? "https://schema.org/OutOfStock"
                    : "https://schema.org/InStock",
              },
            }}
          />
          {post.product.ratingValue !== undefined && (
            <JsonLd<Review>
              schema={{
                "@context": "https://schema.org",
                "@type": "Review",
                reviewBody: post.description,
                author: authorSchema,
                datePublished: post.publishedAt,
                itemReviewed: {
                  "@type": "Product",
                  name: post.product.name,
                },
                reviewRating: {
                  "@type": "Rating",
                  ratingValue: post.product.ratingValue,
                  bestRating: 5,
                  worstRating: 1,
                },
              }}
            />
          )}
        </>
      )}
      {post.software && (
        <JsonLd<SoftwareApplication>
          schema={{
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: post.software.name,
            operatingSystem: post.software.operatingSystem,
            applicationCategory: post.software.applicationCategory,
            offers: {
              "@type": "Offer",
              price: post.software.price,
              priceCurrency: post.software.priceCurrency,
            },
            aggregateRating: post.software.ratingValue
              ? {
                  "@type": "AggregateRating",
                  ratingValue: post.software.ratingValue,
                  ratingCount: post.software.ratingCount ?? 1,
                }
              : undefined,
          }}
        />
      )}
      {post.event && (
        <JsonLd<Event>
          schema={{
            "@context": "https://schema.org",
            "@type": "Event",
            name: post.event.name,
            description: post.event.description ?? post.description,
            startDate: post.event.startDate,
            endDate: post.event.endDate ?? post.event.startDate,
            location: post.event.location
              ? {
                  "@type": "Place",
                  name: post.event.location,
                }
              : undefined,
            organizer: {
              "@type": "Organization",
              name: siteConfig.name,
              url: siteConfig.url,
            },
          }}
        />
      )}
      {post.speakable && post.speakable.length > 0 && (
        <JsonLd<SpeakableSpecification>
          schema={{
            "@context": "https://schema.org",
            "@type": "SpeakableSpecification",
            cssSelector: post.speakable.map((selector) => `.${selector}`),
          }}
        />
      )}
      <JsonLd<ImageObject>
        schema={{
          "@context": "https://schema.org",
          "@type": "ImageObject",
          contentUrl: `${siteConfig.url}${post.image ?? "/og.svg"}`,
          caption: post.description ?? post.title,
          creator: authorSchema,
          copyrightNotice: `© ${String(new Date().getFullYear())} ${siteConfig.name}. All rights reserved.`,
          license: `${siteConfig.url}/license`,
        }}
      />
      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <Link
            href={`/${locale}/blog`}
            className="mb-8 block text-sm text-muted-foreground hover:text-primary"
          >
            &larr; {t("backToBlog")}
          </Link>
          <p className="text-sm text-muted-foreground">
            Published{" "}
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString(locale, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </p>
          <h1 className="mt-2 text-4xl font-bold">{post.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span>{post.author ?? siteConfig.name}</span>
            <span aria-hidden="true">•</span>
            <time dateTime={post.updatedAt ?? post.publishedAt}>
              Updated{" "}
              {new Date(post.updatedAt ?? post.publishedAt).toLocaleDateString(
                locale,
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )}
            </time>
          </div>
          {post.description && (
            <p className="mt-4 text-lg text-muted-foreground">
              {post.description}
            </p>
          )}
          {post.author && (
            <Link
              href={`/${locale}/author/${post.author.toLowerCase().replaceAll(/\s+/g, "-")}`}
              className="mt-2 inline-block text-sm text-primary hover:underline"
            >
              View all articles by {post.author}
            </Link>
          )}
          <div className="blog-content mt-8">
            <MdxContent code={post.content} />
          </div>
          <div className="mt-12">
            <ShareButtons title={post.title} slug={post.slug} locale={locale} />
          </div>
        </article>
      </main>
    </>
  )
}

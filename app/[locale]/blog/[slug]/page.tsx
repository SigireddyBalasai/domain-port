import "../../../blog-content.css"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { setRequestLocale } from "next-intl/server"
import { Suspense } from "react"
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
import { Comments } from "@/components/blog/comments"
import RelatedPosts from "@/components/blog/related-posts"
import { ShareButtonsLazy } from "@/components/blog/share-buttons-lazy"
import TableOfContents from "@/components/blog/table-of-contents"
import Breadcrumbs from "@/components/breadcrumbs"
import { Callout } from "@/components/mdx-components"
import { MdxContent } from "@/components/mdx-content"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getCommentCount } from "@/lib/comment-db"
import { JsonLd } from "@/lib/json-ld"
import { defaultLocale } from "@/lib/locales"
import { buildMetaDescription, buildOgImageUrl } from "@/lib/seo"
import { siteConfig } from "@/lib/site-config"

const ShareButtons = ShareButtonsLazy

interface AffiliateInput {
  url?: string
}

const normalizeAffiliateUrl = ({ url }: AffiliateInput): string | undefined => {
  if (!url) {
    return undefined
  }

  const { tag } = siteConfig.affiliate.amazon

  if (!tag) {
    return url
  }

  try {
    const parsed = new URL(url)

    parsed.searchParams.set("tag", tag)

    return parsed.toString()
  } catch {
    return url
  }
}

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const dynamicParams = false

export const generateStaticParams = (): { locale: string; slug: string }[] => {
  return posts.map((post) => {
    return {
      locale: post.locale,
      slug: post.slug,
    }
  })
}

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { locale, slug } = await params
  const post =
    posts.find((p) => p.slug === slug && p.locale === locale) ??
    posts.find((p) => p.slug === slug && p.locale === "en")

  if (!post) {
    return Promise.resolve({})
  }

  const ogLocale = (siteConfig.localeMap[locale] ?? "en-US").replaceAll(
    "-",
    "_"
  )
  const localePrefix = locale === defaultLocale ? "" : `/${locale}`
  const postUrl = `${siteConfig.url}${localePrefix}/blog/${post.slug}`

  const translatedLocales = posts
    .filter((p) => p.slug === slug)
    .map((p) => p.locale)

  const languageAlternates = Object.fromEntries(
    translatedLocales.map((l) => {
      return [
        l,
        l === defaultLocale
          ? `${siteConfig.url}/blog/${post.slug}`
          : `${siteConfig.url}/${l}/blog/${post.slug}`,
      ]
    })
  )

  return Promise.resolve({
    title: post.title,
    description: buildMetaDescription(post),
    alternates: {
      canonical: postUrl,
      languages: {
        ...languageAlternates,
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
      description: buildMetaDescription(post),
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      tags: post.tags,
      images: [
        {
          url: post.image
            ? `${siteConfig.url}${post.image}`
            : buildOgImageUrl(post.slug),
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: buildMetaDescription(post),
      images: [
        post.image
          ? `${siteConfig.url}${post.image}`
          : buildOgImageUrl(post.slug),
      ],
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
  const post =
    posts.find((p) => p.slug === slug && p.locale === locale) ??
    posts.find((p) => p.slug === slug && p.locale === "en")

  if (!post) {
    notFound()
  }

  const authorSchema = createAuthorSchema(post.author)
  const isFallback = post.locale !== locale
  const localePrefix = locale === defaultLocale ? "" : `/${locale}`
  const commentCount = await getCommentCount(slug, locale)

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
          interactionStatistic: [
            {
              "@type": "InteractionCounter",
              interactionType: { "@id": "https://schema.org/CommentAction" },
              userInteractionCount: commentCount,
            },
          ],
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
      {(post.postType === "article" ||
        post.postType === "blog" ||
        post.postType === "howto" ||
        post.postType === "review" ||
        post.postType === "faq" ||
        post.postType === "video" ||
        post.postType === "listing") && (
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
              "@id": `#product-${post.product.name}`,
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
              ...(post.product.ratingValue !== undefined &&
              post.product.ratingCount !== undefined
                ? {
                    aggregateRating: {
                      "@type": "AggregateRating",
                      ratingValue: post.product.ratingValue,
                      ratingCount: post.product.ratingCount,
                      bestRating: 5,
                      worstRating: 1,
                    },
                  }
                : {}),
            }}
          />
          {post.product.ratingValue !== undefined && (
            <JsonLd<Review>
              schema={{
                "@context": "https://schema.org",
                "@type": "Review",
                "@id": `#review-${post.product.name}`,
                reviewBody: post.description,
                author: authorSchema,
                datePublished: post.publishedAt,
                itemReviewed: {
                  "@id": `#product-${post.product.name}`,
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
          creditText: siteConfig.name,
          copyrightNotice: `© ${String(new Date().getFullYear())} ${siteConfig.name}. All rights reserved.`,
        }}
      />
      <div className="flex-1">
        <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Home", href: `/${locale}` },
              { label: "Blog", href: `/${locale}/blog` },
              { label: post.title, href: `/${locale}/blog/${post.slug}` },
            ]}
          />
          {isFallback && (
            <Badge variant="secondary" className="mb-4">
              Showing English version
            </Badge>
          )}
          <p className="text-muted-foreground text-sm">
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
          <div className="text-muted-foreground mt-3 flex flex-wrap items-center gap-3 text-sm">
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
            <p className="text-muted-foreground mt-4 text-lg">
              {post.description}
            </p>
          )}
          {post.author && (
            <Link
              href={`/${locale}/author/${post.author.toLowerCase().replaceAll(/\s+/g, "-")}`}
              className="text-primary mt-2 inline-block text-sm hover:underline"
            >
              View all articles by {post.author}
            </Link>
          )}
          <TableOfContents />
          <div className="blog-content mt-8">
            <MdxContent code={post.content} localePrefix={localePrefix} />
          </div>
          {post.postType === "listing" && post.listing?.length ? (
            <div className="mt-8 space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                {post.listing.map((item) => {
                  const primaryLink =
                    normalizeAffiliateUrl({ url: item.affiliateUrl }) ??
                    normalizeAffiliateUrl({ url: item.amazonUrl })

                  return (
                    <Card key={`${item.name}-${item.asin ?? ""}`}>
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={400}
                          height={224}
                          className="h-56 w-full object-cover"
                        />
                      )}
                      <CardHeader>
                        <CardTitle>{item.name}</CardTitle>
                        {item.brand && (
                          <p className="text-muted-foreground text-xs tracking-wide uppercase">
                            {item.brand}
                          </p>
                        )}
                        {item.price && (
                          <p className="text-muted-foreground text-sm">
                            {item.priceCurrency ? `${item.priceCurrency} ` : ""}
                            {item.price}
                          </p>
                        )}
                      </CardHeader>
                      <CardContent>
                        {item.description && (
                          <p className="text-muted-foreground text-sm">
                            {item.description}
                          </p>
                        )}
                        {item.ratingValue !== undefined && (
                          <p className="text-muted-foreground mt-3 text-sm">
                            Rating: {String(item.ratingValue)}
                            {item.ratingCount
                              ? ` (${String(item.ratingCount)})`
                              : ""}
                          </p>
                        )}
                        {item.features && item.features.length > 0 && (
                          <ul className="mt-4 list-disc space-y-1 pl-5 text-sm">
                            {item.features.map((feature) => (
                              <li key={feature}>{feature}</li>
                            ))}
                          </ul>
                        )}
                        {item.pros && item.pros.length > 0 && (
                          <ul className="mt-4 list-disc space-y-1 pl-5 text-sm">
                            {item.pros.map((pro) => (
                              <li key={pro}>{pro}</li>
                            ))}
                          </ul>
                        )}
                        {item.cons && item.cons.length > 0 && (
                          <ul className="text-muted-foreground mt-4 list-disc space-y-1 pl-5 text-sm">
                            {item.cons.map((con) => (
                              <li key={con}>{con}</li>
                            ))}
                          </ul>
                        )}
                        {item.specs && Object.keys(item.specs).length > 0 && (
                          <div className="text-muted-foreground mt-4 text-sm">
                            {Object.entries(item.specs).map(([key, value]) => {
                              return (
                                <p key={key}>
                                  <span className="text-foreground font-medium">
                                    {key}:
                                  </span>{" "}
                                  {value}
                                </p>
                              )
                            })}
                          </div>
                        )}
                        {primaryLink && (
                          <div className="mt-4">
                            <Button asChild={true}>
                              <a
                                href={primaryLink}
                                target="_blank"
                                rel="nofollow noopener noreferrer"
                              >
                                View on Amazon
                              </a>
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
              <div className="blog-content">
                <Callout title="Affiliate disclosure">
                  This page may contain affiliate links. If you purchase through
                  them, we may earn a small commission at no extra cost to you.
                </Callout>
              </div>
            </div>
          ) : null}
          <RelatedPosts
            currentSlug={post.slug}
            locale={locale}
            tags={post.tags}
          />
          <div className="mt-12">
            <ShareButtons title={post.title} slug={post.slug} locale={locale} />
          </div>
          <Suspense
            fallback={
              <div className="border-border text-muted-foreground mt-16 border-t pt-10">
                Loading comments…
              </div>
            }
          >
            <Comments postSlug={slug} locale={locale} />
          </Suspense>
        </article>
      </div>
    </>
  )
}

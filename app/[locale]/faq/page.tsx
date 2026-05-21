import type { Metadata } from "next"
import type { JSX } from "react"
import type { BreadcrumbList, FAQPage, WebPage } from "schema-dts"
import { setRequestLocale } from "next-intl/server"
import { faqs } from "@/.velite"
import Footer from "@/components/footer"
import Header from "@/components/header"
import { MdxContent } from "@/components/mdx-content"
import { JsonLd } from "@/lib/json-ld"
import { siteConfig } from "@/lib/site-config"

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return {
    title: "FAQ - Common CCTV Questions",
    description:
      "Frequently asked questions about CCTV cameras, installation, and surveillance solutions.",
    openGraph: {
      url: `${siteConfig.url}/${locale}/faq`,
      title: `FAQ | ${siteConfig.name}`,
      description:
        "Frequently asked questions about CCTV cameras, installation, and surveillance solutions.",
    },
    alternates: {
      canonical: `/${locale}/faq`,
      languages: {
        en: "/en/faq",
        es: "/es/faq",
        fr: "/fr/faq",
        "x-default": "/en/faq",
      },
    },
  }
}

const categories = [
  "all",
  ...new Set(
    faqs
      .map((faq) => faq.category)
      .filter((c): c is string => typeof c === "string")
  ),
]

export default async function FaqPage({ params }: Props): Promise<JSX.Element> {
  const { locale } = await params
  setRequestLocale(locale)

  const sortedFaqs = [...faqs].toSorted(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  )

  const groupedFaqs: Record<string, typeof faqs> = {}

  for (const faq of sortedFaqs) {
    const category = faq.category ?? "general"

    groupedFaqs[category] = groupedFaqs[category] ?? []
    groupedFaqs[category].push(faq)
  }

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
              name: "FAQ",
              item: `${siteConfig.url}/${locale}/faq`,
            },
          ],
        }}
      />
      <JsonLd<FAQPage>
        schema={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: sortedFaqs.map((faq) => {
            return {
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer.replaceAll(/<[^>]*>/g, "").slice(0, 500),
              },
            }
          }),
        }}
      />
      <JsonLd<WebPage>
        schema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Frequently Asked Questions",
          description:
            "Common questions about CCTV cameras, installation, and surveillance.",
          url: `${siteConfig.url}/${locale}/faq`,
          isPartOf: {
            "@type": "WebSite",
            name: siteConfig.name,
            url: siteConfig.url,
          },
        }}
      />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
            <h1 className="mb-2 text-4xl font-bold">
              Frequently Asked Questions
            </h1>
            <p className="mb-8 text-muted-foreground">
              {sortedFaqs.length} question{sortedFaqs.length === 1 ? "" : "s"}{" "}
              answered
            </p>

            {/* Category quick links */}
            <div className="mb-8 flex flex-wrap gap-2">
              {categories.map((category) => {
                return (
                  <a
                    key={category}
                    href={`#${category}`}
                    className="rounded-full border border-border/40 px-3 py-1 text-sm capitalize hover:border-primary hover:text-primary"
                  >
                    {category}
                  </a>
                )
              })}
            </div>

            {/* Grouped FAQs */}
            {Object.entries(groupedFaqs).map(([category, categoryFaqs]) => {
              return (
                <section key={category} id={category} className="mb-12">
                  <h2 className="mb-4 text-2xl font-semibold capitalize">
                    {category}
                  </h2>
                  <div className="space-y-6">
                    {categoryFaqs.map((faq) => {
                      return (
                        <div
                          key={faq.slug}
                          className="border-b border-border/40 pb-6"
                        >
                          <h3 className="text-xl font-semibold">
                            {faq.question}
                          </h3>
                          <div className="faq-content mt-3 text-muted-foreground">
                            <MdxContent code={faq.answer} />
                          </div>
                          {faq.tags && faq.tags.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-1">
                              {faq.tags.map((tag) => {
                                return (
                                  <span
                                    key={tag}
                                    className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                                  >
                                    {tag}
                                  </span>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </section>
              )
            })}
          </div>
        </main>
        <Footer />
      </div>
    </>
  )
}

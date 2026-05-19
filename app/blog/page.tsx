import type { Metadata } from "next"
import type { JSX } from "react/jsx-runtime"
import type { BreadcrumbList, CollectionPage } from "schema-dts"
import { posts } from "@/.velite"
import BlogCard from "@/components/blog/blog-card"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { JsonLd } from "@/lib/json-ld"
import { siteConfig } from "@/lib/site-config"

export const metadata: Metadata = {
  title: "Blog",
  description: `Latest CCTV and surveillance insights — reviews, guides, and security tips from ${siteConfig.name}.`,
  openGraph: {
    url: `${siteConfig.url}/blog`,
    title: `Blog | ${siteConfig.name}`,
    description: `Latest CCTV and surveillance insights — reviews, guides, and security tips from ${siteConfig.name}.`,
  },
}

export default function BlogPage(): JSX.Element {
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
              item: `${siteConfig.url}/blog`,
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
          url: `${siteConfig.url}/blog`,
        }}
      />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
            <h1 className="mb-8 text-4xl font-bold">Blog</h1>
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
                <p className="text-muted-foreground">No posts yet.</p>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  )
}

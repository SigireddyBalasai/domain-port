import type { Metadata } from "next"
import Link from "next/link"
import type { JSX } from "react/jsx-runtime"
import type { Blog, Organization } from "schema-dts"
import { posts } from "@/.velite"
import BlogCard from "@/components/blog/blog-card"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { JsonLd } from "@/lib/json-ld"
import { siteConfig } from "@/lib/site-config"

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  openGraph: {
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
  },
}

export default function Page(): JSX.Element {
  const sorted = [...posts].toSorted(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )
  const latestPosts = sorted.slice(0, 3)
  const featuredPosts = sorted.slice(0, 2)

  return (
    <>
      <JsonLd<Organization>
        schema={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: siteConfig.name,
          url: siteConfig.url,
          description: siteConfig.description,
        }}
      />
      <JsonLd<Blog>
        schema={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: siteConfig.name,
          description: siteConfig.description,
          url: siteConfig.url,
        }}
      />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          {/* Hero Section */}
          <section className="border-b border-border/40 py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                  {siteConfig.name}
                </h1>
                <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
                  {siteConfig.description}
                </p>
                <div className="mt-10 flex justify-center gap-4">
                  <Link
                    href="/blog"
                    className="inline-flex items-center rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    Read Blog
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Featured Posts */}
          {featuredPosts.length > 0 && (
            <section className="border-b border-border/40 py-24 sm:py-32">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <h2 className="font-display text-3xl font-bold">
                  Featured Posts
                </h2>
                <div className="mt-12 space-y-6">
                  {featuredPosts.map((post) => {
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
                </div>
              </div>
            </section>
          )}

          {/* Latest Posts */}
          {latestPosts.length > 0 && (
            <section className="py-24 sm:py-32">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-3xl font-bold">
                    Latest Posts
                  </h2>
                  <Link
                    href="/blog"
                    className="text-sm font-medium hover:text-primary"
                  >
                    View all →
                  </Link>
                </div>
                <div className="mt-12 space-y-6">
                  {latestPosts.map((post) => {
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
                </div>
              </div>
            </section>
          )}
        </main>
        <Footer />
      </div>
    </>
  )
}

import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { JSX } from "react/jsx-runtime"
import type { BlogPosting, BreadcrumbList } from "schema-dts"
import { posts } from "@/.velite"
import { ShareButtons } from "@/components/blog/share-buttons"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { MdxContent } from "@/components/mdx-content"
import { JsonLd } from "@/lib/json-ld"
import { siteConfig } from "@/lib/site-config"

interface InlineInterface2 {
  slug: string
}
interface InlineInterface {
  params: InlineInterface2
}

export const generateStaticParams = (): InlineInterface2[] => {
  return posts.map((post) => { return {
    slug: post.slug,
  } })
}

export const generateMetadata = ({
  params,
}: InlineInterface): Promise<Metadata> => {
  const post = posts.find((p) => p.slug === params.slug)

  if (!post) {
    return Promise.resolve({})
  }

  return Promise.resolve({
    title: post.title,
    description:
      post.description ?? `Read about ${post.title} on ${siteConfig.name}`,
    openGraph: {
      type: "article",
      url: `${siteConfig.url}/blog/${post.slug}`,
      title: post.title,
      description:
        post.description ?? `Read about ${post.title} on ${siteConfig.name}`,
      publishedTime: post.publishedAt,
      tags: post.tags,
    },
  })
}
export default function PostPage({ params }: InlineInterface): JSX.Element {
  const post = posts.find((p) => p.slug === params.slug)

  if (!post) {
    notFound()
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
              name: "Blog",
              item: `${siteConfig.url}/blog`,
            },
            {
              "@type": "ListItem",
              position: 3,
              name: post.title,
              item: `${siteConfig.url}/blog/${post.slug}`,
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
          datePublished: post.publishedAt,
          author: { "@type": "Organization", name: siteConfig.name },
          url: `${siteConfig.url}/blog/${post.slug}`,
        }}
      />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
            <Link
              href="/blog"
              className="mb-8 block text-sm text-muted-foreground hover:text-primary"
            >
              &larr; Back to Blog
            </Link>
            <time className="text-sm text-muted-foreground">
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <h1 className="mt-2 text-4xl font-bold">{post.title}</h1>
            {post.description && (
              <p className="mt-4 text-lg text-muted-foreground">
                {post.description}
              </p>
            )}
            <div className="blog-content mt-8">
              <MdxContent code={post.content} />
            </div>
            <div className="mt-12">
              <ShareButtons title={post.title} slug={post.slug} />
            </div>
          </article>
        </main>
        <Footer />
      </div>
    </>
  )
}

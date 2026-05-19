import type { Metadata } from "next"
import type { JSX } from "react/jsx-runtime"
import { posts } from "@/.velite"
import BlogCard from "@/components/blog/blog-card"
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
    <div className="mx-auto max-w-3xl py-12">
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
  )
}

import Link from "next/link"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import type { JSX } from "react/jsx-runtime"
import { posts } from "@/.velite"
import { MdxContent } from "@/components/mdx-content"
import { siteConfig } from "@/lib/site-config"

export const generateMetadata = async ({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> => {
  const post = posts.find((p) => p.slug === params.slug)
  if (!post) return {}

  return {
    title: post.title,
    description: post.description ?? `Read about ${post.title} on ${siteConfig.name}`,
    openGraph: {
      type: "article",
      url: `${siteConfig.url}/blog/${post.slug}`,
      title: post.title,
      description: post.description ?? `Read about ${post.title} on ${siteConfig.name}`,
      publishedTime: post.publishedAt,
      tags: post.tags,
    },
  }
}

export const generateStaticParams = (): { slug: string }[] =>
  posts.map((post) => ({ slug: post.slug }))

interface InlineInterface2 {
  slug: string
}
interface InlineInterface {
  params: InlineInterface2
}
export default function PostPage({ params }: InlineInterface): JSX.Element {
  const post = posts.find((p) => p.slug === params.slug)

  if (!post) {
    notFound()
  }

  return (
    <article className="mx-auto max-w-3xl py-12">
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
        <p className="mt-4 text-lg text-muted-foreground">{post.description}</p>
      )}
      <div className="blog-content mt-8">
        <MdxContent code={post.content} />
      </div>
    </article>
  )
}

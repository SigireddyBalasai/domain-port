import Link from "next/link"
import { notFound } from "next/navigation"
import type { JSX } from "react/jsx-runtime";
import { posts } from "@/.velite"
import { MdxContent } from "@/components/mdx-content"

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

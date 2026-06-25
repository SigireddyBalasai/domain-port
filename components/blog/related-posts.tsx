import Link from "next/link"
import type { JSX } from "react/jsx-runtime"
import { posts } from "@/.velite"

interface RelatedPostsProps {
  currentSlug: string
  locale: string
  tags?: string[]
}

export default function RelatedPosts({
  currentSlug,
  locale,
  tags = [],
}: RelatedPostsProps): JSX.Element | null {
  const candidates = posts
    .filter((p) => p.slug !== currentSlug && p.locale === locale)
    .map((p) => {
      const overlap = tags.filter((t) => (p.tags ?? []).includes(t)).length
      return { post: p, overlap }
    })
    .toSorted(
      (a, b) =>
        b.overlap - a.overlap ||
        new Date(b.post.publishedAt).getTime() -
          new Date(a.post.publishedAt).getTime()
    )
    .slice(0, 3)

  if (candidates.length === 0) return null

  return (
    <section aria-label="Related Articles" className="mt-16 border-t pt-12">
      <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {candidates.map(({ post }) => (
          <Link
            key={post.slug}
            href={`/${locale}/blog/${post.slug}`}
            className="group rounded-lg border p-5 transition-colors hover:border-primary"
          >
            <h3 className="font-semibold group-hover:text-primary transition-colors">
              {post.title}
            </h3>
            {post.description && (
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                {post.description}
              </p>
            )}
            <p className="mt-3 text-xs text-muted-foreground">
              {new Date(post.publishedAt).toLocaleDateString(locale, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}

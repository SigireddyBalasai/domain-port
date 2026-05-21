import Link from "next/link"
import type { JSX } from "react/jsx-runtime"

interface BlogCardProps {
  title: string
  description?: string
  publishedAt: string
  slug: string
  tags?: string[]
}

export default function BlogCard({
  title,
  description,
  publishedAt,
  slug,
  tags,
}: BlogCardProps): JSX.Element {
  return (
    <article className="group rounded-lg border p-6 transition-colors hover:border-primary">
      <Link href={`/blog/${slug}`} className="block">
        <span className="text-sm text-muted-foreground">
          Published{" "}
          <time dateTime={publishedAt}>
            {new Date(publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </span>
        <h2 className="mt-2 text-xl font-semibold group-hover:text-primary">
          {title}
        </h2>
        {description && (
          <p className="mt-2 text-muted-foreground">{description}</p>
        )}
        {tags && tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map((tag) => {
              return (
                <span
                  key={tag}
                  className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-secondary-foreground"
                >
                  {tag}
                </span>
              )
            })}
          </div>
        )}
      </Link>
    </article>
  )
}

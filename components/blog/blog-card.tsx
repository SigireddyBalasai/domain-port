import Link from "next/link"
import type { JSX } from "react/jsx-runtime"
import { siteConfig } from "@/lib/site-config"

interface BlogCardProps {
  title: string
  description?: string
  publishedAt: string
  slug: string
  locale: string
  tags?: string[]
}

export default function BlogCard({
  title,
  description,
  publishedAt,
  slug,
  locale,
  tags,
}: BlogCardProps): JSX.Element {
  return (
    <article className="group hover:border-primary rounded-lg border p-6 transition-colors">
      <Link href={`/${locale}/blog/${slug}`} className="block">
        <span className="text-muted-foreground text-sm">
          Published{" "}
          <time dateTime={publishedAt}>
            {new Date(publishedAt).toLocaleDateString(
              siteConfig.localeMap[locale] || "en-US",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            )}
          </time>
        </span>
        <h2 className="group-hover:text-primary mt-2 text-xl font-semibold">
          {title}
        </h2>
        {description && (
          <p className="text-muted-foreground mt-2">{description}</p>
        )}
        {tags && tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map((tag) => {
              return (
                <span
                  key={tag}
                  className="bg-secondary text-secondary-foreground rounded-full px-2.5 py-0.5 text-xs"
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

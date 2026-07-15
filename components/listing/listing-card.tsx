import Link from "next/link"
import type { JSX } from "react/jsx-runtime"

interface ListingCardProps {
  title: string
  description?: string
  slug: string
  locale: string
}

export function ListingCard({
  title,
  description,
  slug,
  locale,
}: ListingCardProps): JSX.Element {
  return (
    <article className="group rounded-lg border p-6 transition-colors hover:border-primary">
      <Link href={`/${locale}/blog/${slug}`} className="block">
        <h2 className="text-xl font-semibold group-hover:text-primary">
          {title}
        </h2>
        {description && (
          <p className="mt-2 text-muted-foreground">{description}</p>
        )}
      </Link>
    </article>
  )
}

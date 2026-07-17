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
    <article className="group hover:border-primary rounded-lg border p-6 transition-colors">
      <Link href={`/${locale}/blog/${slug}`} className="block">
        <h2 className="group-hover:text-primary text-xl font-semibold">
          {title}
        </h2>
        {description && (
          <p className="text-muted-foreground mt-2">{description}</p>
        )}
      </Link>
    </article>
  )
}

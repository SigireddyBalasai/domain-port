import Link from "next/link"
import { Badge } from "@/components/ui/badge"

interface PopularTagsSidebarProps {
  posts: Array<{ tags: string[] }>
  limit?: number
}

export function PopularTagsSidebar({ posts, limit = 10 }: PopularTagsSidebarProps) {
  const tagCounts = new Map<string, number>()
  posts.forEach(post => {
    post.tags.forEach(tag => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
    })
  })

  const popularTags = Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(entry => entry[0])

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Popular Topics</h3>
      <div className="flex flex-wrap gap-2">
        {popularTags.map(tag => (
          <Link key={tag} href={`/blog?tag=${tag}`} passHref legacyBehavior>
            <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
              {tag.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              <span className="ml-1 text-xs text-muted-foreground">
                ({tagCounts.get(tag)})
              </span>
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  )
}

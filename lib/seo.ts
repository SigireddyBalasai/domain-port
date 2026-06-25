import type { Post } from "@/.velite"
import { siteConfig } from "./site-config"

const DESCRIPTION_MAX = 160

function buildMetaDescription(post: Post): string {
  const base = post.description ?? `Read about ${post.title} on ${siteConfig.name}`

  const typeSuffixes: Record<string, string> = {
    howto: " Step-by-step guide with expert tips →",
    review: " See our hands-on review with real data →",
    blog: " Read the full guide now →",
  }

  const tags = post.tags ?? []
  const hasComparisonTags = tags.some((t) =>
    ["comparison", "vs", "versus"].includes(t.toLowerCase())
  )

  const suffix = hasComparisonTags
    ? " See the full head-to-head comparison →"
    : (post.postType && typeSuffixes[post.postType]) ?? typeSuffixes.blog

  const truncated =
    base.length > DESCRIPTION_MAX - suffix.length
      ? base.slice(0, DESCRIPTION_MAX - suffix.length - 3) + "..." + suffix
      : base + suffix

  return truncated
}

function buildMetaTitle(post: Post): string {
  return post.title
}

function buildOgImageUrl(slug: string): string {
  return `${siteConfig.url}/api/og/post/${slug}`
}

export { buildMetaDescription, buildMetaTitle, buildOgImageUrl }

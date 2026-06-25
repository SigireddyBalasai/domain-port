import Rss from "rss"
import { posts } from "@/.velite"
import { defaultLocale } from "@/lib/locales"
import { siteConfig } from "@/lib/site-config"

export async function GET(): Promise<Response> {
  const feed = new Rss({
    title: siteConfig.name,
    description: siteConfig.description,
    feed_url: `${siteConfig.url}/feed.xml`,
    site_url: siteConfig.url,
    language: defaultLocale,
    pubDate: new Date().toUTCString(),
    ttl: 60,
  })

  const enPosts = posts.filter((p) => p.locale === defaultLocale)

  enPosts
    .toSorted(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    .forEach((post) => {
      feed.item({
        title: post.title,
        description: post.description ?? "",
        url: `${siteConfig.url}/blog/${post.slug}`,
        guid: `${siteConfig.url}/blog/${post.slug}`,
        date: new Date(post.publishedAt),
      })
    })

  const xml = feed.xml({ indent: true })

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  })
}

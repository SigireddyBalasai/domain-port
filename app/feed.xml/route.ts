import { siteConfig } from "@/lib/site-config"
import { posts } from "@/.velite"

export const dynamic = "force-static"

export async function GET() {
  const items = posts
    .toSorted(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    .map(
      (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.description ?? ""}]]></description>
      <link>${siteConfig.url}/blog/${post.slug}</link>
      <guid>${siteConfig.url}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
    </item>`
    )
    .join("\n")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteConfig.name}</title>
    <description>${siteConfig.description}</description>
    <link>${siteConfig.url}</link>
    <atom:link href="${siteConfig.url}/feed.xml" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  })
}

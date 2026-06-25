import { readdirSync, readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import type { IConfig, ISitemapField } from "next-sitemap"

const currentDir = dirname(fileURLToPath(import.meta.url))
const postsRaw = readFileSync(
  join(currentDir, ".velite", "posts.json"),
  "utf-8"
)

const locales = readdirSync(join(currentDir, "messages"))
  .filter((f) => f.endsWith(".json"))
  .map((f) => f.replace(/\.json$/, ""))
  .toSorted()

const authors = [
  ...new Set(
    (JSON.parse(postsRaw) as { author?: string }[])
      .map((p) => p.author)
      .filter((a): a is string => typeof a === "string" && a.length > 0)
  ),
]

const faqSlugs = readdirSync(join(currentDir, "content", "faqs"), {
  withFileTypes: true,
})
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name)

interface Post {
  slug: string
  publishedAt: string
  updatedAt?: string
}

const typedPosts = JSON.parse(postsRaw) as Post[]

const postLastmodByPath = new Map<string, string>(
  typedPosts.flatMap((post) => {
    return locales.map((locale) => {
      return [
        `/${locale}/blog/${post.slug}`,
        post.updatedAt ?? post.publishedAt,
      ]
    })
  })
)

if (faqSlugs.length > 0) {
  postLastmodByPath.set(`/faq`, new Date().toISOString())
}

const config: IConfig = {
  siteUrl: "https://www.cctv.name",
  generateRobotsTxt: false,
  exclude: ["/api/*", "/login*", "/apple-icon.png", "/robots.txt", "/*/admin*"],
  alternateRefs: [
    ...locales.map((locale) => {
      return {
        href: `https://www.cctv.name/${locale}`,
        hreflang: locale,
      }
    }),
    { href: "https://www.cctv.name/en", hreflang: "x-default" },
  ],
  transform: (cfg, path) => {
    let priority = 0.5

    if (locales.some((l) => path === `/${l}`)) {
      priority = 1.0
    } else if (path === "/faq" || locales.some((l) => path === `/${l}/faq`)) {
      priority = 0.7
    } else if (path.includes("/listing/")) {
      priority = 0.7
    } else if (path.includes("/blog") && !path.includes("/blog/")) {
      priority = 0.8
    } else if (path.includes("/blog/")) {
      priority = 0.6
    } else if (
      authors.some((a) =>
        path.includes(`/author/${a.toLowerCase().replaceAll(/\s+/g, "-")}`)
      )
    ) {
      priority = 0.5
    }

    const lastmod = postLastmodByPath.get(path)

    return {
      loc: path,
      changefreq: locales.some((l) => path === `/${l}`) ? "daily" : "weekly",
      priority,
      ...(lastmod ? { lastmod } : {}),
    }
  },
  additionalPaths: () => {
    const paths: ISitemapField[] = []

    for (const locale of locales) {
      const prefix = locale === "en" ? "" : `/${locale}`

      paths.push({
        loc: `${prefix}/faq`,
        changefreq: "weekly" as const,
        priority: 0.7,
      })

      for (const author of authors) {
        const slug = author.toLowerCase().replaceAll(/\s+/g, "-")

        paths.push({
          loc: `${prefix}/author/${slug}`,
          changefreq: "weekly" as const,
          priority: 0.5,
        })
      }
    }

    return paths
  },
}

export default config

import type { IConfig } from "next-sitemap"
import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const __dirname = dirname(fileURLToPath(import.meta.url))
const postsRaw = readFileSync(join(__dirname, ".velite", "posts.json"), "utf-8")

interface Post {
  slug: string
  publishedAt: string
  updatedAt?: string
}

const typedPosts = JSON.parse(postsRaw) as Post[]

const locales = ["en", "es", "fr"]

const postLastmodByPath = new Map<string, string>(
  typedPosts.flatMap((post) =>
    locales.map((locale) => [
      `/${locale}/blog/${post.slug}`,
      post.updatedAt ?? post.publishedAt,
    ])
  )
)

const config: IConfig = {
  siteUrl: "https://cctv.name",
  generateRobotsTxt: false,
  exclude: [
    "/keystatic/*",
    "/api/*",
    "/login*",
    "/markdoc-demo",
    "/robots.txt",
    "/*.txt",
  ],
  alternateRefs: [
    { href: "https://cctv.name/en", hreflang: "en" },
    { href: "https://cctv.name/es", hreflang: "es" },
    { href: "https://cctv.name/fr", hreflang: "fr" },
    { href: "https://cctv.name/en", hreflang: "x-default" },
  ],
  transform: async (_config, path) => {
    let priority = 0.5

    if (locales.some((l) => path === `/${l}`)) {
      priority = 1.0
    } else if (path.includes("/blog") && !path.includes("/blog/")) {
      priority = 0.8
    } else if (path.includes("/blog/")) {
      priority = 0.6
    }

    return {
      loc: path,
      changefreq: locales.some((l) => path === `/${l}`) ? "daily" : "weekly",
      priority,
      lastmod: postLastmodByPath.get(path) ?? new Date().toISOString(),
    }
  },
}

export default config

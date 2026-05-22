import type { IConfig } from "next-sitemap"
import { readdirSync, readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const __dirname = dirname(fileURLToPath(import.meta.url))
const postsRaw = readFileSync(join(__dirname, ".velite", "posts.json"), "utf-8")

const locales = readdirSync(join(__dirname, "messages"))
  .filter((f) => f.endsWith(".json"))
  .map((f) => f.replace(/\.json$/, ""))
  .toSorted()

interface Post {
  slug: string
  publishedAt: string
  updatedAt?: string
}

const typedPosts = JSON.parse(postsRaw) as Post[]

const postLastmodByPath = new Map<string, string>(
  typedPosts.flatMap((post) =>
    locales.map((locale) => [
      `/${locale}/blog/${post.slug}`,
      post.updatedAt ?? post.publishedAt,
    ])
  )
)

const config: IConfig = {
  siteUrl: "https://www.cctv.name",
  generateRobotsTxt: false,
  exclude: [
    "/keystatic/*",
    "/api/*",
    "/login*",
    "/apple-icon.png",
    "/robots.txt",
    "/*.txt",
  ],
  alternateRefs: [
    ...locales.map((locale) => ({
      href: `https://www.cctv.name/${locale}`,
      hreflang: locale,
    })),
    { href: "https://www.cctv.name/en", hreflang: "x-default" },
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

    const lastmod = postLastmodByPath.get(path)

    return {
      loc: path,
      changefreq: locales.some((l) => path === `/${l}`) ? "daily" : "weekly",
      priority,
      ...(lastmod ? { lastmod } : {}),
    }
  },
}

export default config

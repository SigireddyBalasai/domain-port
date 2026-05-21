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

const postLastmodByPath = new Map<string, string>(
  typedPosts.map((post) => [
    `/blog/${post.slug}`,
    post.updatedAt ?? post.publishedAt,
  ])
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
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/", disallow: ["/keystatic/", "/api/"] },
    ],
  },
  transform: async (_config, path) => {
    let priority = 0.5

    if (path === "/") {
      priority = 1.0
    } else if (path === "/blog") {
      priority = 0.8
    } else if (path.startsWith("/blog/")) {
      priority = 0.6
    }

    return {
      loc: path,
      changefreq: path === "/" ? "daily" : "weekly",
      priority,
      lastmod: postLastmodByPath.get(path) ?? new Date().toISOString(),
    }
  },
}

export default config

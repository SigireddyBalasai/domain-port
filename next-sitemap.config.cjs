/** @type {import('next-sitemap').IConfig} */
const posts = require("./.velite/posts.json")

const postLastmodByPath = new Map(
  posts.map((post) => [`/blog/${post.slug}`, post.updatedAt ?? post.publishedAt])
)

module.exports = {
  siteUrl: "https://cctv.name",
  generateRobotsTxt: false,
  exclude: ["/keystatic/*", "/api/*"],
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/", disallow: ["/keystatic/", "/api/"] },
    ],
  },
  transform: async (config, path) => {
    let priority = 0.5

    if (path === "/") {priority = 1.0}
    else if (path === "/blog") {priority = 0.8}
    else if (path.startsWith("/blog/")) {priority = 0.6}

    return {
      loc: path,
      changefreq: path === "/" ? "daily" : "weekly",
      priority,
      lastmod: postLastmodByPath.get(path) ?? new Date().toISOString(),
    }
  },
}

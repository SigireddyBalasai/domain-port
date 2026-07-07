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
  locale: string
  listing?: unknown[]
}

const typedPosts = JSON.parse(postsRaw) as Post[]

const listingSlugs = [
  ...new Set(
    typedPosts
      .filter(
        (p) => p.listing && Array.isArray(p.listing) && p.listing.length > 0
      )
      .map((p) => p.slug)
  ),
]

const postsBySlugAndLocale = new Map<string, Post[]>()

for (const post of typedPosts) {
  const existing = postsBySlugAndLocale.get(post.slug)

  if (existing) {
    existing.push(post)
  } else {
    postsBySlugAndLocale.set(post.slug, [post])
  }
}

const postLastmodByPath = new Map<string, string>()

for (const [, posts] of postsBySlugAndLocale) {
  for (const post of posts) {
    postLastmodByPath.set(
      `/${post.locale}/blog/${post.slug}`,
      post.updatedAt ?? post.publishedAt
    )
  }
}

// Add English non-prefixed blog paths for lastmod lookup
for (const post of typedPosts) {
  if (post.locale === "en") {
    postLastmodByPath.set(
      `/blog/${post.slug}`,
      post.updatedAt ?? post.publishedAt
    )
  }
}

if (faqSlugs.length > 0) {
  postLastmodByPath.set(`/faq`, new Date().toISOString())
}

const config: IConfig = {
  siteUrl: "https://www.cctv.name",
  generateRobotsTxt: false,
  exclude: [
    "/api/*",
    "/login*",
    "/apple-icon.png",
    "/robots.txt",
    "/*/admin*",
    "/en",
    "/en/*",
    "/serwist/*",
  ],
  alternateRefs: [
    ...locales.map((locale) => {
      return {
        href:
          locale === "en"
            ? "https://www.cctv.name"
            : `https://www.cctv.name/${locale}`,
        hreflang: locale,
      }
    }),
    { href: "https://www.cctv.name", hreflang: "x-default" },
  ],
  transform: (cfg, path) => {
    if (path === "/en" || path.startsWith("/en/")) {
      return undefined // Skip this path
    }

    // Skip service worker files
    if (path.startsWith("/serwist/")) {
      return undefined // Skip this path
    }

    let priority = 0.5

    if (path === "/" || locales.some((l) => path === `/${l}`)) {
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
      changefreq:
        path === "/" || locales.some((l) => path === `/${l}`)
          ? "daily"
          : "weekly",
      priority,
      ...(lastmod ? { lastmod } : {}),
    }
  },
  additionalPaths: () => {
    let paths: ISitemapField[] = []

    // English root (non-prefixed, since localePrefix: "as-needed")
    paths = [
      ...paths,
      {
        loc: "/",
        changefreq: "daily" as const,
        priority: 1.0,
      },
    ]

    // English blog listing
    paths = [
      ...paths,
      {
        loc: "/blog",
        changefreq: "weekly" as const,
        priority: 0.8,
      },
    ]

    // English blog posts (non-prefixed) — only slugs with English content
    const uniqueSlugs = [
      ...new Set(
        typedPosts.filter((p) => p.locale === "en").map((p) => p.slug)
      ),
    ]

    for (const slug of uniqueSlugs) {
      const lastmod = postLastmodByPath.get(`/blog/${slug}`)

      paths = [
        ...paths,
        {
          loc: `/blog/${slug}`,
          changefreq: "weekly" as const,
          priority: 0.6,
          ...(lastmod ? { lastmod } : {}),
        },
      ]
    }

    // English listing pages
    for (const slug of listingSlugs) {
      paths = [
        ...paths,
        {
          loc: `/listing/${slug}`,
          changefreq: "weekly" as const,
          priority: 0.7,
        },
      ]
    }

    // Localized pages
    for (const locale of locales) {
      const prefix = locale === "en" ? "" : `/${locale}`

      paths = [
        ...paths,
        {
          loc: `${prefix}/faq`,
          changefreq: "weekly" as const,
          priority: 0.7,
        },
      ]

      for (const author of authors) {
        const slug = author.toLowerCase().replaceAll(/\s+/g, "-")

        paths = [
          ...paths,
          {
            loc: `${prefix}/author/${slug}`,
            changefreq: "weekly" as const,
            priority: 0.5,
          },
        ]
      }
    }

    return paths
  },
}

export default config

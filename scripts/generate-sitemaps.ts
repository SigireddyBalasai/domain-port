import { readdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { SitemapBuilder } from "next-sitemap"

const currentDir = dirname(fileURLToPath(import.meta.url))
const rootDir = join(currentDir, "..")
const publicDir = join(rootDir, "public")

const posts: {
  slug: string
  publishedAt: string
  updatedAt?: string
  locale: string
  listing?: unknown[]
  author?: string
}[] = JSON.parse(readFileSync(join(rootDir, ".velite", "posts.json"), "utf-8"))

const locales = readdirSync(join(rootDir, "messages"))
  .filter((f) => f.endsWith(".json"))
  .map((f) => f.replace(/\.json$/, ""))
  .toSorted()

const authors = [
  ...new Set(
    posts
      .map((p) => p.author)
      .filter((a): a is string => typeof a === "string" && a.length > 0)
  ),
]

const listingSlugs = [
  ...new Set(
    posts
      .filter(
        (p) => p.listing && Array.isArray(p.listing) && p.listing.length > 0
      )
      .map((p) => p.slug)
  ),
]

const siteUrl = "https://www.cctv.name"

function alternateRefs(
  path: string
): Array<{ href: string; hreflang: string }> {
  return [
    ...locales.map((l) => ({
      hreflang: l,
      href: l === "en" ? `${siteUrl}${path}` : `${siteUrl}/${l}${path}`,
    })),
    { hreflang: "x-default", href: `${siteUrl}${path}` },
  ]
}

function field(
  loc: string,
  path: string,
  alternates: Array<{ href: string; hreflang: string }>
): {
  loc: string
  changefreq: string
  priority: number
  lastmod?: string
  alternateRefs: Array<{ href: string; hreflang: string }>
} {
  const isHome = path === "/" || locales.some((l) => path === `/${l}`)
  return {
    loc,
    changefreq: isHome ? "daily" : "weekly",
    priority: isHome
      ? 1.0
      : path.endsWith("/faq") || path.includes("/listing/")
        ? 0.7
        : path.endsWith("/blog")
          ? 0.8
          : path.includes("/blog/")
            ? 0.6
            : 0.5,
    alternateRefs: alternates,
  }
}

function concat<T>(a: T[], b: T[]): T[] {
  return a.concat(b)
}

type Field = ReturnType<typeof field>

// --- Build per-locale groups ---
const rootFields: Field[] = []
const localeFields: Record<string, Field[]> = {}

for (const locale of locales) {
  localeFields[locale] = []
}

// Root homepage
rootFields.push(field(`${siteUrl}/`, "/", alternateRefs("/")))

// Root pages
for (const p of ["/blog", "/faq"]) {
  rootFields.push(field(`${siteUrl}${p}`, p, alternateRefs(p)))
}

// Root author pages
for (const author of authors) {
  const slug = author.toLowerCase().replaceAll(/\s+/g, "-")
  rootFields.push(
    field(`${siteUrl}/author/${slug}`, "/author", alternateRefs("/author"))
  )
}

// Root blog posts (English non-prefixed)
for (const slug of [
  ...new Set(posts.filter((p) => p.locale === "en").map((p) => p.slug)),
]) {
  const path = `/blog/${slug}`
  const postAlts = posts
    .filter((p) => p.slug === slug)
    .map((p) => ({
      hreflang: p.locale,
      href:
        p.locale === "en"
          ? `${siteUrl}${path}`
          : `${siteUrl}/${p.locale}${path}`,
    }))
  rootFields.push(field(`${siteUrl}${path}`, path, postAlts))
}

// Root listing pages
for (const slug of listingSlugs) {
  const path = `/listing/${slug}`
  rootFields.push(field(`${siteUrl}${path}`, path, alternateRefs(path)))
}

// Per-locale pages
for (const locale of locales) {
  const prefix = `/${locale}`
  const allRefs = alternateRefs("/")

  // Homepage
  localeFields[locale].push(field(`${siteUrl}${prefix}`, prefix, allRefs))

  // Blog listing
  localeFields[locale].push(
    field(`${siteUrl}${prefix}/blog`, `${prefix}/blog`, alternateRefs("/blog"))
  )

  // FAQ
  localeFields[locale].push(
    field(`${siteUrl}${prefix}/faq`, `${prefix}/faq`, alternateRefs("/faq"))
  )

  // Author pages
  for (const author of authors) {
    const slug = author.toLowerCase().replaceAll(/\s+/g, "-")
    localeFields[locale].push(
      field(
        `${siteUrl}${prefix}/author/${slug}`,
        `${prefix}/author`,
        alternateRefs("/author")
      )
    )
  }

  // Blog posts
  for (const post of posts.filter((p) => p.locale === locale)) {
    const path = `/blog/${post.slug}`
    const postAlts = posts
      .filter((p) => p.slug === post.slug)
      .map((p) => ({
        hreflang: p.locale,
        href:
          p.locale === "en"
            ? `${siteUrl}${path}`
            : `${siteUrl}/${p.locale}${path}`,
      }))
    localeFields[locale].push(
      field(`${siteUrl}${prefix}${path}`, `${prefix}${path}`, postAlts)
    )
  }

  // Listing pages
  for (const slug of listingSlugs) {
    const path = `/listing/${slug}`
    localeFields[locale].push(
      field(
        `${siteUrl}${prefix}${path}`,
        `${prefix}${path}`,
        alternateRefs(path)
      )
    )
  }
}

const builder = new SitemapBuilder()

// Write root sitemap
writeFileSync(
  join(publicDir, "sitemap-root.xml"),
  builder.buildSitemapXml(rootFields),
  "utf-8"
)

// Write per-locale sitemaps
for (const locale of locales) {
  writeFileSync(
    join(publicDir, `sitemap-${locale}.xml`),
    builder.buildSitemapXml(localeFields[locale]),
    "utf-8"
  )
}

// Write sitemap index
const sitemapUrls = [
  `${siteUrl}/sitemap-root.xml`,
  ...locales.map((l) => `${siteUrl}/sitemap-${l}.xml`),
]

writeFileSync(
  join(publicDir, "sitemap.xml"),
  builder.buildSitemapIndexXml(sitemapUrls),
  "utf-8"
)

console.log(
  `[sitemaps] Generated sitemap index + root + ${String(locales.length)} locale sitemaps`
)

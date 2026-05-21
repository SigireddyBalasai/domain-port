# SEO, AEO & Performance Implementation Plan

**Status:** In progress
**Last updated:** 2026-05-19

## Current Audit

- Root metadata, robots.txt, sitemap generation, JSON-LD, RSS feed, and static blog generation already exist.
- IndexNow is now wired through the `indexnow-submitter` package in `postbuild`, with a root key-file route at `/<INDEXNOW_KEY>.txt`.
- Blog post metadata still needs canonical URLs, Open Graph images, Twitter images, `dateModified`, and richer author support.
- The only live post is a starter post, so the biggest SEO lift now is publishing substantial, intent-driven articles with strong internal linking.
- `next-sitemap` currently stamps `lastmod` from build time, which should be replaced with content-aware timestamps.
- Current content is brand-light and trust-light; adding author bios, update dates, and topical clusters will better match Google’s people-first guidance.

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add full SEO, AEO, analytics, RSS, social sharing, performance, and accessibility optimizations to the cctv.name CCTV/surveillance blog.

**Architecture:** Next.js App Router built-in Metadata API + `next-sitemap` for sitemaps + `schema-dts` for type-safe JSON-LD structured data + `@next/third-parties` for GA4. All SEO data driven from a central `lib/site-config.ts`.

**Tech Stack:** Next.js 16, React 19, shadcn/ui, Tailwind v4, Velite MDX, Bun

**Design Spec:** `docs/superpowers/specs/2026-05-19-seo-aeo-optimizations-design.md`

---

### Task 1: Install dependencies

**Files:**
- Modify: `package.json`
- (bun install)

**Step 1: Install runtime and dev deps**

Run:
```bash
bun add schema-dts @next/third-parties
bun add -d next-sitemap
```

Expected: packages added to `dependencies` and `devDependencies` in `package.json`.

**Current state:** already present in `package.json` and locked in the workspace.

**Step 2: Commit**

```bash
git add package.json bun.lock
git commit -m "chore: add schema-dts, @next/third-parties, next-sitemap"
```

---

### Task 2: Create `lib/site-config.ts`

**Files:**
- Create: `lib/site-config.ts`

**Step 1: Write the site config**

```ts
export const siteConfig = {
  name: "CCTV Name",
  url: "https://cctv.name",
  ogImage: `${url}/og.png`,
  description: "Expert CCTV and surveillance solutions — reviews, installation guides, and security tips for your home and business.",
  keywords: ["CCTV", "surveillance", "security cameras", "home security", "business surveillance"],
  links: {
    twitter: "https://twitter.com/cctvname",
  },
}
```

**Step 2: Verify it compiles**

Run: `bun run typecheck`
Expected: no errors

**Step 3: Commit**

```bash
git add lib/site-config.ts
git commit -m "feat: add central site configuration"
```

---

### Task 3: Add metadata to root layout

**Files:**
- Modify: `app/layout.tsx`

**Step 1: Write the metadata export**

Add `import type { Metadata } from "next"` and `import { siteConfig } from "@/lib/site-config"`.

Add before `export default function RootLayout`:
```ts
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    template: `%s | ${siteConfig.name}`,
    default: siteConfig.name,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
  },
}
```

**Step 2: Verify typecheck**

Run: `bun run typecheck`
Expected: no errors

**Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: add global metadata and OpenGraph tags"
```

---

### Task 4: Create `app/robots.ts`

**Files:**
- Create: `app/robots.ts`

**Current state:** already implemented.

**Step 1: Write robots.txt handler**

```ts
import type { MetadataRoute } from "next"
import { siteConfig } from "@/lib/site-config"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/keystatic/", "/api/"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  }
}
```

**Step 2: Verify typecheck**

Run: `bun run typecheck`
Expected: no errors

**Step 3: Commit**

```bash
git add app/robots.ts
git commit -m "feat: add robots.txt"
```

---

### Task 5: Create `next-sitemap.config.js` + update package.json

**Files:**
- Create: `next-sitemap.config.js`
- Modify: `package.json`

**Current state:** the repo uses `next-sitemap.config.cjs` and the build hook is already wired.

**Step 1: Write next-sitemap config**

```js
/** @type {import('next-sitemap').IConfig} */
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
    if (path === "/") priority = 1.0
    else if (path === "/blog") priority = 0.8
    else if (path.startsWith("/blog/")) priority = 0.6

    return {
      loc: path,
      changefreq: path === "/" ? "daily" : "weekly",
      priority,
      lastmod: new Date().toISOString(),
    }
  },
}
```

**Step 2: Update package.json build scripts**

Change `"build": "run-s build:*"` to:
```json
"build": "run-s build:*",
"postbuild": "next-sitemap"
```

**Step 3: Commit**

```bash
git add next-sitemap.config.js package.json
git commit -m "feat: add next-sitemap config and postbuild hook"
```

---

### Task 6: Add metadata to homepage

**Files:**
- Modify: `app/page.tsx`

**Current state:** already implemented.

**Step 1: Add metadata export**

```ts
import type { Metadata } from "next"
import { siteConfig } from "@/lib/site-config"

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  openGraph: {
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
  },
}
```

**Step 2: Verify typecheck**

Run: `bun run typecheck`
Expected: no errors

**Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: add metadata to homepage"
```

---

### Task 7: Add metadata to blog listing page

**Files:**
- Modify: `app/blog/page.tsx`

**Step 1: Add metadata export**

```ts
import type { Metadata } from "next"
import { siteConfig } from "@/lib/site-config"

export const metadata: Metadata = {
  title: "Blog",
  description: `Latest CCTV and surveillance insights — reviews, guides, and security tips from ${siteConfig.name}.`,
  openGraph: {
    url: `${siteConfig.url}/blog`,
    title: `Blog | ${siteConfig.name}`,
    description: `Latest CCTV and surveillance insights — reviews, guides, and security tips from ${siteConfig.name}.`,
  },
}
```

**Step 2: Verify typecheck**

Run: `bun run typecheck`
Expected: no errors

**Step 3: Commit**

```bash
git add app/blog/page.tsx
git commit -m "feat: add metadata to blog listing"
```

---

### Task 8: Add generateMetadata to blog post page

**Files:**
- Modify: `app/blog/[slug]/page.tsx`

**Step 1: Add generateMetadata function**

```ts
import type { Metadata } from "next"
import { siteConfig } from "@/lib/site-config"

export const generateMetadata = async ({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> => {
  const post = posts.find((p) => p.slug === params.slug)
  if (!post) return {}

  return {
    title: post.title,
    description: post.description ?? `Read about ${post.title} on ${siteConfig.name}`,
    openGraph: {
      type: "article",
      url: `${siteConfig.url}/blog/${post.slug}`,
      title: post.title,
      description: post.description ?? `Read about ${post.title} on ${siteConfig.name}`,
      publishedTime: post.publishedAt,
      tags: post.tags,
    },
  }
}
```

**Step 2: Verify typecheck**

Run: `bun run typecheck`
Expected: no errors

**Step 3: Commit**

```bash
git add app/blog/\[slug\]/page.tsx
git commit -m "feat: add generateMetadata per blog post"
```

---

### Task 9: Create `lib/json-ld.tsx`

**Files:**
- Create: `lib/json-ld.tsx`

**Step 1: Write the JsonLd component**

```ts
import type { Thing, WithContext } from "schema-dts"

interface JsonLdProps<T extends Thing> {
  schema: WithContext<T>
}

export function JsonLd<T extends Thing>({ schema }: JsonLdProps<T>) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  )
}
```

**Step 2: Verify typecheck**

Run: `bun run typecheck`
Expected: no errors

**Step 3: Commit**

```bash
git add lib/json-ld.tsx
git commit -m "feat: add typed JsonLd component"
```

---

### Task 10: Add JSON-LD to homepage

**Files:**
- Modify: `app/page.tsx`

**Step 1: Add Organization and Blog structured data**

```tsx
import { JsonLd } from "@/lib/json-ld"
import type { Blog, Organization } from "schema-dts"

// Inside Page component, before or after the div:
return (
  <>
    <JsonLd<Organization>
      schema={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: siteConfig.name,
        url: siteConfig.url,
        description: siteConfig.description,
      }}
    />
    <JsonLd<Blog>
      schema={{
        "@context": "https://schema.org",
        "@type": "Blog",
        name: siteConfig.name,
        description: siteConfig.description,
        url: siteConfig.url,
      }}
    />
    {/* existing content */}
  </>
)
```

**Step 2: Verify typecheck**

Run: `bun run typecheck`
Expected: no errors

**Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: add Organization and Blog JSON-LD to homepage"
```

---

### Task 11: Add JSON-LD to blog listing

**Files:**
- Modify: `app/blog/page.tsx`

**Step 1: Add BreadcrumbList and CollectionPage**

```tsx
import { JsonLd } from "@/lib/json-ld"
import type { BreadcrumbList, CollectionPage } from "schema-dts"

// Inside BlogPage return:
<>
  <JsonLd<BreadcrumbList>
    schema={{
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${siteConfig.url}/blog` },
      ],
    }}
  />
  <JsonLd<CollectionPage>
    schema={{
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Blog | " + siteConfig.name,
      description: `Latest CCTV and surveillance insights from ${siteConfig.name}.`,
      url: `${siteConfig.url}/blog`,
    }}
  />
  {/* existing content */}
</>
```

**Step 2: Verify typecheck**

Run: `bun run typecheck`
Expected: no errors

**Step 3: Commit**

```bash
git add app/blog/page.tsx
git commit -m "feat: add BreadcrumbList and CollectionPage JSON-LD"
```

---

### Task 12: Add JSON-LD to blog post page

**Files:**
- Modify: `app/blog/[slug]/page.tsx`

**Step 1: Add BlogPosting and BreadcrumbList**

```tsx
import { JsonLd } from "@/lib/json-ld"
import type { BlogPosting, BreadcrumbList } from "schema-dts"

// Inside PostPage return:
<>
  <JsonLd<BreadcrumbList>
    schema={{
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${siteConfig.url}/blog` },
        { "@type": "ListItem", position: 3, name: post.title, item: `${siteConfig.url}/blog/${post.slug}` },
      ],
    }}
  />
  <JsonLd<BlogPosting>
    schema={{
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description ?? undefined,
      datePublished: post.publishedAt,
      author: { "@type": "Organization", name: siteConfig.name },
      url: `${siteConfig.url}/blog/${post.slug}`,
    }}
  />
  {/* existing content */}
</>
```

**Step 2: Verify typecheck**

Run: `bun run typecheck`
Expected: no errors

**Step 3: Commit**

```bash
git add app/blog/\[slug\]/page.tsx
git commit -m "feat: add BlogPosting and BreadcrumbList JSON-LD to posts"
```

---

### Task 13: Add GA4 analytics

**Files:**
- Create: `components/google-analytics.tsx`
- Modify: `app/layout.tsx`
- Modify: `.env.local` (create if not exists)

**Step 1: Create GA4 wrapper**

```ts
"use client"

import { GoogleAnalytics } from "@next/third-parties/google"

export function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA4_ID

  if (!gaId) return null

  return <GoogleAnalytics gaId={gaId} />
}
```

**Step 2: Add Analytics to root layout**

Import and add `<Analytics />` inside `<body>`, after `<ThemeProvider>`.

**Step 3: Create .env.local**

```
NEXT_PUBLIC_GA4_ID=
```

**Step 4: Add .env.local to .gitignore if not already present**

Check `.gitignore` — if `.env.local` is missing, add it.

**Step 5: Verify typecheck**

Run: `bun run typecheck`
Expected: no errors

**Step 6: Commit**

```bash
git add components/google-analytics.tsx app/layout.tsx .env.local
git commit -m "feat: add GA4 analytics component"
```

---

### Task 14: Create RSS feed

**Files:**
- Create: `app/feed.xml/route.ts`

**Step 1: Write RSS feed route**

```ts
import { siteConfig } from "@/lib/site-config"
import { posts } from "@/.velite"

export const dynamic = "force-static"

export async function GET() {
  const items = posts
    .toSorted((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
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
```

**Step 2: Verify typecheck**

Run: `bun run typecheck`
Expected: no errors

**Step 3: Commit**

```bash
git add app/feed.xml/route.ts
git commit -m "feat: add RSS feed at /feed.xml"
```

---

### Task 15: Create social share buttons

**Files:**
- Create: `components/blog/share-buttons.tsx`

**Step 1: Write share buttons component**

```tsx
"use client"

import { siteConfig } from "@/lib/site-config"
import { cn } from "@/lib/utils"

interface ShareButtonsProps {
  title: string
  slug: string
}

export function ShareButtons({ title, slug }: ShareButtonsProps) {
  const url = `${siteConfig.url}/blog/${slug}`
  const text = `${title} — ${siteConfig.name}`

  const shareLinks = [
    {
      name: "X",
      href: `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      label: "Share on X",
    },
    {
      name: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      label: "Share on LinkedIn",
    },
  ]

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      // fallback
    }
  }

  return (
    <div className="flex items-center gap-2 pt-6">
      <span className="text-sm text-muted-foreground">Share:</span>
      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.label}
          className={cn(
            "inline-flex h-8 w-8 items-center justify-center rounded-md border text-xs transition-colors",
            "hover:bg-secondary hover:text-foreground"
          )}
        >
          {link.name}
        </a>
      ))}
      <button
        type="button"
        onClick={handleCopyLink}
        aria-label="Copy link"
        className={cn(
          "inline-flex h-8 w-8 items-center justify-center rounded-md border text-xs transition-colors",
          "hover:bg-secondary hover:text-foreground"
        )}
        title="Copy link"
      >
        ⎘
      </button>
    </div>
  )
}
```

**Step 2: Add share buttons to blog post page**

Import `ShareButtons` and add `<ShareButtons title={post.title} slug={post.slug} />` after the `<MdxContent>` block in `app/blog/[slug]/page.tsx`.

**Step 3: Verify typecheck**

Run: `bun run typecheck`
Expected: no errors

**Step 4: Commit**

```bash
git add components/blog/share-buttons.tsx app/blog/\[slug\]/page.tsx
git commit -m "feat: add social share buttons to blog posts"
```

---

### Task 16: Add skip-to-content accessibility link

**Files:**
- Modify: `app/layout.tsx`

**Step 1: Add skip-to-content link**

Add before `<ThemeProvider>` in root layout:
```tsx
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:p-3 focus:text-foreground focus:outline-ring"
>
  Skip to content
</a>
```

Add `id="main-content"` to a wrapper `<main>` element in layout.

**Step 2: Verify typecheck**

Run: `bun run typecheck`
Expected: no errors

**Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: add skip-to-content accessibility link"
```

---

### Task 17: Build and verify

**Files:**
- N/A

**Step 1: Run full build**

```bash
bun run build
```

Expected: Build succeeds, next-sitemap runs after, `public/sitemap.xml` and `public/robots.txt` generated.

**Step 2: Verify sitemap exists**

```bash
ls -la public/sitemap.xml
```

**Step 3: Run typecheck**

```bash
bun run typecheck
```

**Step 4: Run lint**

```bash
bun run lint
```

Expected: No errors

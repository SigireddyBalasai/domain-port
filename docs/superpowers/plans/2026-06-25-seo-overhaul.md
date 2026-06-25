# SEO Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix 0% CTR (56 impressions, 0 clicks) via metadata overhaul, breadcrumbs, related posts, table of contents, and dynamic OG images.

**Architecture:** 5 independent tasks — a shared SEO utility (`lib/seo.ts`), then components (Breadcrumbs, RelatedPosts, TableOfContents, OG image route). Each component plugs into existing page templates.

**Tech Stack:** Next.js 16, Tailwind v4, next-intl, Velite (static content), `next/og` for OG images.

## Global Constraints

- All new components go in `components/` or `components/blog/`
- Use existing i18n keys from `messages/*.json`; add new keys if needed
- Follow existing patterns: `Link` from `next/link`, Tailwind classes, shadcn/ui conventions
- No extra npm dependencies — everything uses what's already in `package.json`

---

### Task 1: Shared SEO Utilities (`lib/seo.ts`)

**Files:**
- Create: `lib/seo.ts`

**Interfaces:**
- Consumes: Post type from `@/.velite`
- Produces: `buildMetaDescription(post)`, `buildMetaTitle(post)`, `buildOgImageUrl(post)`

- [ ] **Write `lib/seo.ts`**

```ts
import type { Post } from "@/.velite"
import { siteConfig } from "./site-config"

function buildMetaDescription(post: Post): string {
  const base = post.description ?? `Read about ${post.title} on ${siteConfig.name}`

  const typeSuffixes: Record<string, string> = {
    howto: " Step-by-step guide with expert tips →",
    review: " See our hands-on review with real data →",
    comparison: " See the full head-to-head comparison →",
    blog: " Read the full guide now →",
  }

  const tags = post.tags ?? []
  let suffix = typeSuffixes.blog

  if (tags.some((t) =>["comparison", "vs", "versus"].includes(t.toLowerCase()))) {
    suffix = typeSuffixes.comparison
  } else if (post.postType && typeSuffixes[post.postType]) {
    suffix = typeSuffixes[post.postType]
  }

  return base.length > 150 ? base.slice(0, 147) + "..." + suffix : base + suffix
}

function buildMetaTitle(post: Post): string {
  return post.title
}

function buildOgImageUrl(slug: string): string {
  return `${siteConfig.url}/api/og/post/${slug}`
}

export { buildMetaDescription, buildMetaTitle, buildOgImageUrl }
```

- [ ] **Commit**

```bash
git add lib/seo.ts
git commit -m "feat: add shared SEO utilities"
```

---

### Task 2: Breadcrumbs Component

**Files:**
- Create: `components/breadcrumbs.tsx`
- Modify: `app/[locale]/blog/[slug]/page.tsx` (add visible breadcrumbs)
- Modify: `app/[locale]/listing/[slug]/page.tsx` (add visible breadcrumbs)
- Modify: `messages/en.json` (add breadcrumb labels if needed)

**Interfaces:**
- Consumes: `{ items: { label: string; href: string }[] }` from page components
- Produces: Rendered `<nav>` element with breadcrumb links

- [ ] **Create `components/breadcrumbs.tsx`**

```tsx
import Link from "next/link"
import type { JSX } from "react/jsx-runtime"

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumbs({ items }: BreadcrumbsProps): JSX.Element {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={item.href} className="flex items-center gap-1.5">
              {index > 0 && <span aria-hidden="true">/</span>}
              {isLast ? (
                <span className="text-foreground" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
```

- [ ] **Integrate into `app/[locale]/blog/[slug]/page.tsx`**

Replace the "← Back to Blog" link and surrounding code with breadcrumbs:

```tsx
// At top: add import
import Breadcrumbs from "@/components/breadcrumbs"

// In the component, replace lines 446-451:
<Breadcrumbs
  items={[
    { label: "Home", href: `/${locale}` },
    { label: "Blog", href: `/${locale}/blog` },
    { label: post.title, href: `/${locale}/blog/${post.slug}` },
  ]}
/>
```

Remove the `&larr; {t("backToBlog")}` link that was there before.

- [ ] **Integrate into `app/[locale]/listing/[slug]/page.tsx`**

Same pattern:

```tsx
import Breadcrumbs from "@/components/breadcrumbs"

// Replace lines 442-447:
<Breadcrumbs
  items={[
    { label: "Home", href: `/${locale}` },
    { label: "Listings", href: `/${locale}/blog` },
    { label: post.title, href: `/${locale}/listing/${post.slug}` },
  ]}
/>
```

- [ ] **Verify the breadcrumbs show on both blog and listing pages**

Run: `bun run dev` and check `/blog/4k-vs-5mp-resolution-guide` and `/en/blog/4k-vs-5mp-resolution-guide`

- [ ] **Commit**

```bash
git add components/breadcrumbs.tsx app/\[locale\]/blog/\[slug\]/page.tsx app/\[locale\]/listing/\[slug\]/page.tsx
git commit -m "feat: add visible breadcrumb navigation"
```

---

### Task 3: Related Posts Component

**Files:**
- Create: `components/blog/related-posts.tsx`
- Modify: `app/[locale]/blog/[slug]/page.tsx` (render below article)

**Interfaces:**
- Consumes: `{ currentSlug: string; locale: string; tags?: string[] }`
- Produces: Rendered card grid of up to 3 related posts

- [ ] **Create `components/blog/related-posts.tsx`**

```tsx
import Link from "next/link"
import type { JSX } from "react/jsx-runtime"
import { posts } from "@/.velite"

interface RelatedPostsProps {
  currentSlug: string
  locale: string
  tags?: string[]
}

export default function RelatedPosts({
  currentSlug,
  locale,
  tags = [],
}: RelatedPostsProps): JSX.Element | null {
  const candidates = posts
    .filter((p) => p.slug !== currentSlug && p.locale === locale)
    .map((p) => {
      const overlap = tags.filter((t) => (p.tags ?? []).includes(t)).length
      return { post: p, overlap }
    })
    .toSorted((a, b) => b.overlap - a.overlap)
    .slice(0, 3)

  if (candidates.length === 0) return null

  return (
    <section className="mt-16 border-t pt-12">
      <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {candidates.map(({ post }) => (
          <Link
            key={post.slug}
            href={`/${locale}/blog/${post.slug}`}
            className="group rounded-lg border p-5 transition-colors hover:border-primary"
          >
            <h3 className="font-semibold group-hover:text-primary transition-colors">
              {post.title}
            </h3>
            {post.description && (
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                {post.description}
              </p>
            )}
            <p className="mt-3 text-xs text-muted-foreground">
              {new Date(post.publishedAt).toLocaleDateString(locale, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Integrate into `app/[locale]/blog/[slug]/page.tsx`**

Add import and render below article content (before ShareButtons):

```tsx
// At top
import RelatedPosts from "@/components/blog/related-posts"

// In the component, between the </div> closing the blog-content and the share buttons div:
<RelatedPosts
  currentSlug={post.slug}
  locale={locale}
  tags={post.tags}
/>
```

- [ ] **Verify on a blog post**

The blog post page should now show related articles below the content.

- [ ] **Commit**

```bash
git add components/blog/related-posts.tsx app/\[locale\]/blog/\[slug\]/page.tsx
git commit -m "feat: add related posts section with tag-based matching"
```

---

### Task 4: Table of Contents Component

**Files:**
- Create: `components/blog/table-of-contents.tsx`

**Interfaces:**
- Self-contained client component
- Uses `IntersectionObserver` to track active heading

Note: Since `rehype-slug` already adds `id` attributes to headings, the TOC just needs to observe them.

- [ ] **Create `components/blog/table-of-contents.tsx`**

```tsx
"use client"

import { useEffect, useState } from "react"
import type { JSX } from "react/jsx-runtime"

interface TocItem {
  id: string
  text: string
  level: number
}

export default function TableOfContents(): JSX.Element | null {
  const [items, setItems] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    const article = document.querySelector(".blog-content")
    if (!article) return

    const headings = article.querySelectorAll("h2, h3")
    const tocItems: TocItem[] = []

    headings.forEach((h) => {
      if (!h.id) return
      tocItems.push({
        id: h.id,
        text: h.textContent ?? "",
        level: h.tagName === "H2" ? 2 : 3,
      })
    })

    setItems(tocItems)

    if (tocItems.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: "-80px 0px -80% 0px" }
    )

    headings.forEach((h) => observer.observe(h))

    return () => observer.disconnect()
  }, [])

  if (items.length < 2) return null

  return (
    <nav aria-label="Table of contents" className="mb-10">
      <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase mb-3">
        On this page
      </h2>
      <ul className="space-y-2 text-sm">
        {items.map((item) => (
          <li
            key={item.id}
            style={{ paddingLeft: item.level === 3 ? "1rem" : undefined }}
          >
            <a
              href={`#${item.id}`}
              className={`block transition-colors hover:text-primary ${
                activeId === item.id
                  ? "text-primary font-medium"
                  : "text-muted-foreground"
              }`}
              onClick={(e) => {
                e.preventDefault()
                document.getElementById(item.id)?.scrollIntoView({
                  behavior: "smooth",
                })
              }}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
```

- [ ] **Integrate into the blog post page**

Add import and render inside the article, before the MDX content:

```tsx
import TableOfContents from "@/components/blog/table-of-contents"

// In the JSX, before the blog-content div:
<TableOfContents />
<div className="blog-content mt-8">
  <MdxContent code={post.content} />
</div>
```

- [ ] **Commit**

```bash
git add components/blog/table-of-contents.tsx app/\[locale\]/blog/\[slug\]/page.tsx
git commit -m "feat: add table of contents with scroll tracking"
```

---

### Task 5: Dynamic OG Images

**Files:**
- Create: `app/api/og/post/[slug]/route.tsx`
- Modify: `app/[locale]/blog/[slug]/page.tsx` (update og:image URL)

**Interfaces:**
- Route consumes `slug` param
- Returns PNG image via `ImageResponse`

- [ ] **Create `app/api/og/post/[slug]/route.tsx`**

```tsx
import { ImageResponse } from "next/og"
import type { JSX } from "react/jsx-runtime"
import { posts } from "@/.velite"

export const runtime = "edge"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
): Promise<ImageResponse | Response> {
  const { slug } = await params
  const post = posts.find((p) => p.slug === slug && p.locale === "en")

  if (!post) {
    return new Response("Not found", { status: 404 })
  }

  const tagColor = post.postType === "review" ? "#f59e0b"
    : post.postType === "howto" ? "#3b82f6"
    : post.postType === "listing" ? "#10b981"
    : "#6366f1"

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          padding: "60px 80px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "24px",
          }}
        >
          <span
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "#94a3b8",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            cctv.name
          </span>
          <span
            style={{
              fontSize: "16px",
              fontWeight: 600,
              color: "#fff",
              background: tagColor,
              padding: "4px 16px",
              borderRadius: "999px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {post.postType ?? "Blog"}
          </span>
        </div>
        <h1
          style={{
            fontSize: "48px",
            fontWeight: 800,
            color: "#f8fafc",
            lineHeight: 1.2,
            margin: 0,
            maxWidth: "800px",
          }}
        >
          {post.title.length > 80
            ? post.title.slice(0, 77) + "..."
            : post.title}
        </h1>
        <p
          style={{
            fontSize: "20px",
            color: "#94a3b8",
            marginTop: "24px",
            maxWidth: "700px",
          }}
        >
          {post.description?.slice(0, 120)}
        </p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
```

- [ ] **Update `generateMetadata` in blog post page**

Add a `getImageUrl` function that checks if the post has its own image, otherwise returns the OG route:

```tsx
// In generateMetadata, update the images:
import { buildOgImageUrl } from "@/lib/seo"

// Replace the images block:
images: [
  {
    url: post.image
      ? `${siteConfig.url}${post.image}`
      : buildOgImageUrl(post.slug),
    width: 1200,
    height: 630,
  },
],
```

Also update twitter images:

```tsx
// Replace:
images: [`${siteConfig.url}${post.image ?? "/og.svg"}`],
// With:
images: [
  post.image
    ? `${siteConfig.url}${post.image}`
    : buildOgImageUrl(post.slug),
],
```

And in the listing page, same pattern.

- [ ] **Commit**

```bash
git add app/api/og/post/\[slug\]/route.tsx app/\[locale\]/blog/\[slug\]/page.tsx
git commit -m "feat: add dynamic OG image generation for posts"
```

---

### Task 6: Enhanced Metadata for List Pages

**Files:**
- Modify: `app/[locale]/blog/page.tsx` (better meta description)
- Modify: `app/[locale]/faq/page.tsx` (better meta description)
- Modify: `app/[locale]/page.tsx` (better meta description)

- [ ] **Update `app/[locale]/blog/page.tsx` metadata**

```tsx
// Replace the title and description:
title: "CCTV & Security Camera Guides, Reviews, and How-Tos",
description: `Expert CCTV guides, security camera reviews, and surveillance how-tos. Compare 4K vs 5MP, learn NVR setup, and find the best cameras for your needs.`,
```

- [ ] **Update `app/[locale]/faq/page.tsx` metadata**

```tsx
// Replace the title:
title: "CCTV & Security Camera FAQ — Common Questions Answered",
// Replace the description:
description: `Answers to common CCTV questions: camera resolution, NVR vs DVR, storage needs, night vision, installation tips, and more.`
```

- [ ] **Update `app/[locale]/page.tsx` metadata**

The homepage already uses `siteConfig.description` which is good. But let's add a keyword-rich alt title:

```tsx
// Add title override:
title: {
  absolute: `${siteConfig.name} — Expert CCTV Reviews, Guides & Surveillance Tips`,
},
```

- [ ] **Commit**

```bash
git add app/\[locale\]/blog/page.tsx app/\[locale\]/faq/page.tsx app/\[locale\]/page.tsx
git commit -m "feat: enhance metadata for list pages with keyword-rich titles"
```

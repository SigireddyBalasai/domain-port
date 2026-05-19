# SEO, AEO, and Performance Optimizations for cctv.name

**Date:** 2026-05-19
**Project:** domain_port — CCTV/surveillance content marketing blog at cctv.name

## Stack

- **Framework:** Next.js 16 (App Router) + React 19
- **Package manager:** Bun
- **Content:** Velite MDX + Keystatic CMS
- **UI:** shadcn/ui + Tailwind v4
- **Fonts:** Playfair Display, Manrope, Geist Mono

## Approach: Tooling-Assisted (B)

Use Next.js built-in APIs for core SEO, with `next-sitemap` for advanced sitemaps, `schema-dts` for type-safe JSON-LD, and `@next/third-parties` for GA4.

## Dependencies

```
bun add schema-dts @next/third-parties
bun add -d next-sitemap
```

## File Plan

### Create (7 files)

| File | Purpose |
|---|---|
| `lib/site-config.ts` | Central site config: name, URL, description, social links |
| `lib/json-ld.tsx` | Reusable `<JsonLd>` component with `schema-dts` types |
| `components/google-analytics.tsx` | GA4 wrapper via `@next/third-parties` |
| `components/blog/share-buttons.tsx` | Social share buttons (Twitter, LinkedIn, copy link) |
| `app/feed.xml/route.ts` | RSS 2.0 feed from Velite posts |
| `app/robots.ts` | Robots.txt with sitemap reference |
| `next-sitemap.config.js` | Post-build sitemap config |

### Modify (5 files)

| File | Changes |
|---|---|
| `app/layout.tsx` | Add `metadata` export with title template, description, canonical; add GA4 |
| `app/page.tsx` | Add metadata, add `Organization` + `Blog` JSON-LD |
| `app/blog/page.tsx` | Add metadata, add `BreadcrumbList` + `CollectionPage` JSON-LD |
| `app/blog/[slug]/page.tsx` | Add `generateMetadata` per post, add `BlogPosting` + `BreadcrumbList` JSON-LD |
| `package.json` | Add `postbuild` script: `next-sitemap` |

## Sections

### 1. SEO

- **Root layout metadata:** `metadataBase`, title template (`"%s | CCTV Name"`), description, robots directive, OpenGraph, Twitter card
- **Per-page metadata:** homepage gets default; blog listing gets its own; each post uses `generateMetadata` pulling title/description/date from Velite
- **`app/robots.ts`:** Allow all, point to sitemap
- **`next-sitemap`:** Post-build sitemap generation with per-URL priorities (homepage=1.0, blog listing=0.8, posts=0.6), changefreq, exclude keystatic admin routes

### 2. AEO (Structured Data)

- **`<JsonLd>` component:** Accepts typed schema from `schema-dts`, renders `<script type="application/ld+json">`
- **Homepage:** `Organization` (name, url, logo), `Blog` (description)
- **Blog posts:** `BlogPosting` (headline, datePublished, description, author), `BreadcrumbList`
- **Blog listing:** `BreadcrumbList`, `CollectionPage`
- **Future-ready:** `FAQPage`, `HowTo` schemas can be added per-post when content matches

### 3. Analytics

- **`@next/third-parties`:** `<GoogleAnalytics>` component in root layout
- **Measurement ID:** `NEXT_PUBLIC_GA4_ID` env var
- **Usage tracking:** Page views automatic; future: outbound link clicks, CTA events

### 4. RSS Feed

- **`app/feed.xml/route.ts`:** Generates RSS 2.0 XML at `/feed.xml`
- Includes all published posts with title, description, pubDate, URL link
- Auto-regenerates on each build

### 5. Social Sharing

- **Share buttons on blog posts:** X/Twitter, LinkedIn, clipboard copy
- Shadcn icon-only buttons with Remixicon icons
- Uses `navigator.share` where available, falls back to link share

### 6. Performance

- Next.js `<Image>` for any images (already available via Velite assets)
- Font preloading already configured via `next/font/google`
- Static rendering for all pages (already SSG via `generateStaticParams`)
- Bundle optimization: no layout shift from analytics (loaded async)

### 7. Accessibility

- Skip-to-content link as first focusable element in layout
- Semantic landmarks: `<main>`, `<nav>`, `<article>` already partially used
- Alt text enforcement for blog images
- Focus ring visibility on interactive elements

## Build Scripts

```json
{
  "build:content": "velite --clean",
  "build:next": "next build",
  "build": "run-s build:*",
  "postbuild": "next-sitemap"
}
```

## Implementation Order

1. Create `lib/site-config.ts` — single source of truth
2. Add `metadata` export to root layout
3. Create `app/robots.ts`
4. Create `next-sitemap.config.js` + update `package.json` scripts
5. Add metadata to homepage, blog listing, blog post pages
6. Create `lib/json-ld.tsx` + add structured data to pages
7. Install + add GA4 analytics
8. Create RSS feed at `app/feed.xml/route.ts`
9. Create social share buttons component
10. Add accessibility skip-to-content link

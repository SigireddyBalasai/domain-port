# SEO Overhaul — cctv.name

## Problem

GSC data (Jun 24, 2026) shows 56 impressions, 0 clicks, avg position 7.7. The site gets visibility but zero engagement. Root causes:

1. **Weak meta descriptions** — Generic descriptions don't compel clicks in SERPs
2. **No internal linking** — Related posts never link to each other (resolution guide, 4Kvs5MP, NVRvsDVR are all inter-related)
3. **No breadcrumb UI** — JSON-LD exists but users see no navigation trail
4. **No table of contents** — Long posts lack navigation, hurting engagement
5. **Generic OG images** — All posts share `/og.svg`, no differentiation on social

## Approach

### 1. Metadata Overhaul (`app/[locale]/blog/[slug]/page.tsx`)

- Append compelling CTA to meta description based on post type and tags
- Comparison posts: "See our head-to-head comparison with real data →"
- HowTo posts: "Step-by-step guide with [N] expert tips →"
- Keep title format consistent with template

### 2. Breadcrumbs Component (`components/breadcrumbs.tsx`)

- Visible breadcrumb nav on blog post and listing pages
- Uses next-intl for "Home", "Blog" translations
- Integrates with existing JSON-LD
- Responsive: horizontal on desktop, collapsible on mobile

### 3. Related Posts Component (`components/blog/related-posts.tsx`)

- Matches posts by tag overlap in same locale
- Returns top 3-4 matches (min 1 shared tag)
- Falls back to any other post in same locale
- Uses existing `BlogCard` pattern for rendering
- Placed below article body

### 4. Table of Contents Component (`components/blog/table-of-contents.tsx`)

- Extracts h2/h3 headings from rendered article content
- Builds anchor-linked sticky menu
- Desktop: sidebar, Mobile: collapsible "On this page" menu
- Active heading tracking via IntersectionObserver

### 5. Dynamic OG Images (`app/api/og/post/[slug]/route.tsx`)

- Edge runtime route using `next/og` `ImageResponse` (built into Next.js 16, no extra deps needed)
- Generate per-post image with title, category badge, site branding
- Fall back to `/og.svg` on error
- Update `generateMetadata` to reference dynamic OG URL

## Files Changed

| File                                    | Change                                                       |
| --------------------------------------- | ------------------------------------------------------------ |
| `app/[locale]/blog/[slug]/page.tsx`     | Enhanced `generateMetadata`, add breadcrumbs + related posts |
| `app/[locale]/listing/[slug]/page.tsx`  | Add breadcrumbs                                              |
| `app/[locale]/blog/page.tsx`            | Enhanced `generateMetadata`                                  |
| `app/[locale]/faq/page.tsx`             | Enhanced `generateMetadata`                                  |
| `app/[locale]/page.tsx`                 | Enhanced `generateMetadata`                                  |
| `components/breadcrumbs.tsx`            | New component                                                |
| `components/blog/related-posts.tsx`     | New component                                                |
| `components/blog/table-of-contents.tsx` | New component                                                |
| `app/api/og/post/[slug]/route.tsx`      | New OG image route                                           |
| `lib/seo.ts`                            | New — shared SEO utilities                                   |

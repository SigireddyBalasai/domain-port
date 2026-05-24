# Multi-Language Blog Content Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Enable multi-language blog content using per-post folders with locale files (`content/posts/<slug>/<locale>.mdx`).

**Architecture:** Velite scans `content/posts/*/*.mdx`, derives slug from parent folder name and locale from filename. Pages filter/query by locale with EN fallback.

**Tech Stack:** Velite (content layer), Next.js 16 App Router, next-intl

---

### Task 1: Update Velite Schema and Config

**Files:**
- Modify: `velite.config.ts:89-133`

**Step 1: Read current config**

Already read. Current state:
- Glob: `"posts/**/*.mdx"` (line 91)
- Slug derived from filename via `meta.path.split("/").pop()?.replace(/\.mdx$/, "")` (lines 123-132)
- No locale field

**Step 2: Change glob pattern**

`"posts/**/*.mdx"` → `"posts/*/*.mdx"`

This matches `content/posts/<folder>/<filename>.mdx` only, not nested deeper.

**Step 3: Add locale field to schema**

```ts
locale: s.string(),
```

**Step 4: Update .transform() to derive slug from parent folder and locale from filename**

In the `.transform()` callback:
- `meta.path` for a file like `posts/getting-started/en.mdx`
- Split by `/` → `["posts", "getting-started", "en.mdx"]`
- `slug` = second-to-last element (`meta.path.split("/").at(-2)`)
- `locale` = last element minus `.mdx` (`meta.path.split("/").pop()?.replace(/\.mdx$/, "")`)

Apply locale value to the returned data before spreading:
```ts
.transform((data, { meta }) => {
  const parts = meta.path.split("/")
  const file = parts.pop() ?? ""
  const folder = parts.pop() ?? ""
  return {
    ...data,
    slug: folder,
    locale: file.replace(/\.mdx$/, ""),
  }
})
```

**Step 5: Run Velite to verify the new schema works**

```bash
npx velite --clean
```

Expected: Clean build, no errors. Check `.velite/posts.json` has `locale` field and correct `slug` values.

**Step 6: Generate fresh TypeScript types**

```bash
npx velite --clean
```

Expected: `.velite/index.d.ts` regenerated with `locale: string` in Post type.

---

### Task 2: Migrate Existing Posts to Folder Structure

**Files:**
- Modify: Move 3 files

**Step 1: Create folders and move files**

Current flat files:
- `content/posts/best-cameras-under-200.mdx`
- `content/posts/cctv-video-file-formats.mdx`
- `content/posts/poe-nvr-setup.mdx`

Target:
```
content/posts/best-cameras-under-200/en.mdx
content/posts/cctv-video-file-formats/en.mdx
content/posts/poe-nvr-setup/en.mdx
```

**Step 2: Verify Velite still builds**

```bash
npx velite --clean
```

Expected: Clean build. All 3 posts found with correct slugs and `locale: "en"`.

---

### Task 3: Update Blog Listing Page — Filter by Locale

**Files:**
- Modify: `app/[locale]/blog/page.tsx`

**Step 1: Filter posts by current locale**

Current (line 64-67):
```ts
const sorted = [...posts].toSorted(
  (a, b) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
)
```

Change to:
```ts
const sorted = [...posts]
  .filter((p) => p.locale === locale)
  .toSorted(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )
```

---

### Task 4: Update Single Post Page — Locale-Aware Query with EN Fallback

**Files:**
- Modify: `app/[locale]/blog/[slug]/page.tsx`

**Step 1: Update `generateStaticParams` (line 37-46)**

Current: generates all `locale × post` combos — wrong, will try to render non-existent translations.

Change to: generate only combos where a translation exists:
```ts
export const generateStaticParams = (): { locale: string; slug: string }[] => {
  return posts.flatMap((post) => {
    return { locale: post.locale, slug: post.slug }
  })
}
```

**Step 2: Update `generateMetadata` (line 48-114)**

Current (line 52): `posts.find((p) => p.slug === slug)` — no locale filter.

Change to:
```ts
const post = posts.find((p) => p.slug === slug && p.locale === locale)
  ?? posts.find((p) => p.slug === slug && p.locale === "en")
```

**Step 3: Update main `PostPage` (line 134-458)**

Current (line 141): `posts.find((p) => p.slug === slug)` — no locale filter.

Change to:
```ts
const post = posts.find((p) => p.slug === slug && p.locale === locale)
  ?? posts.find((p) => p.slug === slug && p.locale === "en")
```

**Step 4: Add fallback badge (after line 145, before the authorSchema)**

If `post.locale !== locale`, show a fallback badge:
```tsx
{post.locale !== locale && (
  <Badge variant="secondary" className="mb-4">
    Showing English version
  </Badge>
)}
```

Need to import `Badge` from `@/components/mdx-components` or the shadcn badge component.

---

### Task 5: Create Demo Spanish Translation

**Files:**
- Create: `content/posts/<first-post>/es.mdx`

**Step 1: Pick one existing post and create a Spanish version**

Copy `content/posts/<first-post>/en.mdx` → `content/posts/<first-post>/es.mdx`

Translate the frontmatter (title, description) and body. Use the same `publishedAt`, `author`, `tags`.

**Step 2: Verify it renders**

```bash
npx velite --clean
```

Expected: Both `en` and `es` versions of the post appear in `.velite/posts.json`.

---

### Task 6: Verify the Full Pipeline

**Step 1: Build the project**

```bash
bun run build
```

Expected: Clean build, no TypeScript errors.

**Step 2: Test the listing page**

- `GET /blog` — shows all EN posts
- `GET /es/blog` — shows only the post with ES translation

**Step 3: Test the single post page**

- `GET /blog/<slug>` — renders the EN version
- `GET /es/blog/<slug>` — renders the ES version if available
- `GET /fr/blog/<slug>` — shows EN fallback with badge (if no FR translation)

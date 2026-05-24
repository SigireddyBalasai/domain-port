# Multi-Language Blog Content — Design

Date: 2026-05-24

Status: Approved

## Content Structure

Each blog post lives in its own folder under `content/posts/`. The folder name is the slug. Inside, each locale has its own `.mdx` file named `<locale>.mdx`.

```
content/posts/
  getting-started-with-cameras/
    en.mdx        ← English translation
    es.mdx        ← Spanish translation
  nvr-setup-guide/
    en.mdx
    es.mdx
  existing-post-slug/
    en.mdx        ← migrated from flat file
```

## Velite Schema Changes

- Glob pattern: `"posts/**/*.mdx"` → `"posts/*/*.mdx"`
- New fields:
  - `locale: s.string()` — extracted from filename stem (`en`, `es`, etc.)
  - `slug: s.string()` — derived from parent folder name (via `s.path()`)
- All existing frontmatter fields (`title`, `publishedAt`, `description`, `author`, `tags`, etc.) remain unchanged

## Page Routing

### Listing (`app/[locale]/blog/page.tsx`)
- Filter: `posts.filter(p => p.locale === currentLocale)`
- Only shows posts with a translation in the current locale

### Single Post (`app/[locale]/blog/[slug]/page.tsx`)
- Primary query: `posts.find(p => p.slug === params.slug && p.locale === currentLocale)`
- Fallback: `posts.find(p => p.slug === params.slug && p.locale === "en")`
- Shows `<Badge variant="secondary">Showing English version</Badge>` when fallback is used
- `generateStaticParams`: iterate all `(locale × slug)` combos where a translation file exists

## Fallback Strategy

When a post lacks a translation for the requested locale:
1. Serve the English version (`locale === "en"`)
2. Display a subtle badge: "Showing English version"
3. Listing page only shows posts with translations in the current locale

## Migration

Existing flat files are moved into folders:
```
content/posts/<slug>.mdx → content/posts/<slug>/en.mdx
```

## Files to Modify

| File | Change |
|---|---|
| `velite.config.ts` | Glob pattern → `posts/*/*.mdx`; add `locale` field; derive slug from folder |
| `app/[locale]/blog/page.tsx` | Filter posts by locale |
| `app/[locale]/blog/[slug]/page.tsx` | Query by slug + locale; add EN fallback; locale-aware structured data |
| `components/blog/blog-card.tsx` | Pass locale for any translation-status UI |
| `keystatic.config.ts` | Update to include locale support |
| `.velite/index.d.ts` | Auto-regen after schema change |
| `content/posts/*.mdx` | Migrate existing 3 posts into folders as `en.mdx` |

## Demo Content

Create `content/posts/<existing-slug>/es.mdx` as a sample Spanish translation to validate the system.

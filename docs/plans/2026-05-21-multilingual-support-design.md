# Multilingual Support Design

**Date:** 2026-05-21
**Status:** Approved

## Overview

Add multilingual support to the Next.js 16 App Router site using `next-intl`, with locale-prefixed URLs (`/en/...`, `/es/...`, `/fr/...`) and English as default fallback.

## Requirements

- Always show locale prefix in URLs (`localePrefix: 'always'`)
- English as default/fallback language
- Easy to add new languages
- Full hreflang + sitemap support for SEO
- JSON/YAML for UI translation strings
- MDX content (blog, FAQ) stays single-language for now
- Language switcher component for users

## Architecture

### Directory Structure

```
app/
  [locale]/              # Dynamic segment wraps all pages
    layout.tsx           # Locale-aware root layout (setRequestLocale, html lang)
    page.tsx             # Home page (moved from app/page.tsx)
    blog/
      page.tsx           # Blog listing (moved)
    faq/
      page.tsx           # FAQ page (moved)
    ...                  # All other routes moved under [locale]/

messages/                # Translation JSON files
  en.json
  es.json
  fr.json

i18n/
  routing.ts             # defineRouting config (locales, defaultLocale, localePrefix)
  request.ts             # getRequestConfig (load messages per locale)

proxy.ts                 # Chains next-intl middleware + existing keystatic auth
```

### Key Changes

1. **All routes move under `app/[locale]/`** — existing `app/*` pages become `app/[locale]/*`
2. **`proxy.ts` updated** — chains `createMiddleware(routing)` with keystatic auth check
3. **`next-sitemap` config** — iterates all locales, generates hreflang alternates
4. **`generateMetadata`** — every page adds `alternates.languages` for hreflang
5. **UI components** — Header, Footer use `useTranslations` instead of hardcoded text
6. **Language switcher** — new component using next-intl's locale-aware `useRouter`

## Translation Structure

### JSON Files

Location: `messages/{locale}.json`

```json
{
  "common": {
    "siteName": "Domain Port",
    "readBlog": "Read Blog",
    "featuredPosts": "Featured Posts",
    "latestPosts": "Latest Posts",
    "viewAll": "View all →",
    "skipToContent": "Skip to content"
  },
  "header": {
    "home": "Home",
    "blog": "Blog",
    "faq": "FAQ"
  },
  "footer": {
    "copyright": "All rights reserved."
  }
}
```

- Type-safe: `next-intl` generates TypeScript types from JSON keys
- Namespaced by component/area
- MDX content remains single-language

## SEO & hreflang

### Per-Page Metadata

```ts
export async function generateMetadata({ params }) {
  const { locale } = await params
  return {
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: "/en",
        es: "/es",
        fr: "/fr",
        "x-default": "/en",
      },
    },
  }
}
```

### Sitemap

`next-sitemap` config iterates all locales, generating alternate URLs with `hreflang` attributes.

### Middleware Headers

next-intl's middleware automatically sets `Link` response headers with hreflang alternates.

### robots.ts

Updated to include locale-prefixed paths.

## Static Rendering

- `generateStaticParams` returns all supported locales
- `setRequestLocale(locale)` called in layout before any translation functions
- Enables static rendering at build time for each locale

## Implementation Order

1. Install `next-intl`
2. Create `i18n/routing.ts` and `i18n/request.ts`
3. Create `messages/en.json`, `messages/es.json`, `messages/fr.json`
4. Move all `app/*` routes under `app/[locale]/`
5. Create `app/[locale]/layout.tsx` with locale validation + `setRequestLocale`
6. Update `proxy.ts` to chain next-intl middleware with keystatic auth
7. Update `generateMetadata` on all pages with hreflang alternates
8. Update `next-sitemap.config.ts` for multilingual sitemap
9. Update UI components (Header, Footer) to use translations
10. Add language switcher component
11. Update `robots.ts` for locale paths
12. Test all routes, verify hreflang, verify sitemap

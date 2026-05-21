# Multilingual Support Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add `/<lang>/page` routing to the site using `next-intl` with JSON translation files, hreflang SEO, and English as default.

**Architecture:** All existing pages move under `app/[locale]/` dynamic segment. `next-intl` middleware in `proxy.ts` handles locale detection/redirect and auto-injects hreflang headers. UI strings live in `messages/{locale}.json` with type-safe translations. `next-sitemap` config generates per-locale sitemap entries with hreflang alternates.

**Tech Stack:** next-intl, Next.js 16 App Router, next-sitemap

---

### Task 1: Install next-intl and create i18n config

**Files:**
- Modify: `package.json`
- Create: `i18n/routing.ts`
- Create: `i18n/request.ts`

**Step 1: Install next-intl**

Run: `npm install next-intl`

**Step 2: Create `i18n/routing.ts`**

```ts
import { defineRouting } from "next-intl/routing"

export const routing = defineRouting({
  locales: ["en", "es", "fr"],
  defaultLocale: "en",
  localePrefix: "always",
})
```

**Step 3: Create `i18n/request.ts`**

```ts
import { getRequestConfig } from "next-intl/server"
import { hasLocale } from "next-intl"
import { routing } from "./routing"

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
```

**Step 4: Commit**

```bash
git add package.json package-lock.json i18n/
git commit -m "feat: install next-intl and create i18n config"
```

---

### Task 2: Create translation JSON files

**Files:**
- Create: `messages/en.json`
- Create: `messages/es.json`
- Create: `messages/fr.json`

**Step 1: Create `messages/en.json`**

```json
{
  "common": {
    "siteName": "CCTV Name",
    "skipToContent": "Skip to content",
    "readBlog": "Read Blog",
    "featuredPosts": "Featured Posts",
    "latestPosts": "Latest Posts",
    "viewAll": "View all \u2192",
    "noPosts": "No posts yet.",
    "published": "Published",
    "updated": "Updated",
    "backToBlog": "\u2190 Back to Blog",
    "viewAllArticlesBy": "View all articles by {author}",
    "articlesPublished": "{count} article published",
    "articlesPublished_plural": "{count} articles published",
    "noArticles": "No articles yet.",
    "faqTitle": "Frequently Asked Questions",
    "faqDescription": "Frequently asked questions about CCTV cameras, installation, and surveillance solutions.",
    "faqQuestionsAnswered": "{count} question answered",
    "faqQuestionsAnswered_plural": "{count} questions answered",
    "copyright": "All rights reserved.",
    "navigation": "Navigation",
    "connect": "Connect",
    "home": "Home",
    "blog": "Blog",
    "faq": "FAQ",
    "authors": "Authors"
  }
}
```

**Step 2: Create `messages/es.json`**

Spanish translations following same structure as `en.json`.

**Step 3: Create `messages/fr.json`**

French translations following same structure as `en.json`.

**Step 4: Commit**

```bash
git add messages/
git commit -m "feat: add translation JSON files for en, es, fr"
```

---

### Task 3: Update proxy.ts with next-intl middleware

**Files:**
- Modify: `proxy.ts`

**Step 1: Replace `proxy.ts`**

```ts
import createMiddleware from "next-intl/middleware"
import { type NextRequest, NextResponse } from "next/server"
import { routing } from "./i18n/routing"

const intlMiddleware = createMiddleware(routing)

export const proxy = (request: NextRequest): NextResponse | Promise<NextResponse> => {
  if (request.nextUrl.pathname.startsWith("/keystatic")) {
    const sessionToken = request.cookies.get("better-auth.session_token")

    if (!sessionToken) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
}
```

**Step 2: Commit**

```bash
git add proxy.ts
git commit -m "feat: add next-intl middleware to proxy.ts"
```

---

### Task 4: Create [locale] layout and update root layout

**Files:**
- Create: `app/[locale]/layout.tsx`
- Modify: `app/layout.tsx`

**Step 1: Create `app/[locale]/layout.tsx`**

```ts
import { NextIntlClientProvider, hasLocale } from "next-intl"
import { getMessages, setRequestLocale } from "next-intl/server"
import { notFound } from "next/navigation"
import { routing } from "@/i18n/routing"
import type { ReactNode } from "react"

type Props = {
  children: ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)

  const messages = await getMessages()

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  )
}
```

**Step 2: Keep `app/layout.tsx` as-is** (it already has `<html>` and `<body>` — children will be `[locale]` layout output)

The existing `app/layout.tsx` should remain mostly unchanged. It already renders `<html>` and `<body>` wrapping `{children}`. The `[locale]/layout.tsx` will be rendered inside it.

**Step 3: Commit**

```bash
git add app/[locale]/layout.tsx
git commit -m "feat: add locale layout with next-intl provider"
```

---

### Task 5: Move home page under [locale]

**Files:**
- Create: `app/[locale]/page.tsx`
- Delete: `app/page.tsx`

**Step 1: Create `app/[locale]/page.tsx`**

Copy existing `app/page.tsx`, adding locale params, `setRequestLocale`, `getTranslations`, locale-prefixed links, and hreflang metadata.

**Step 2: Delete `app/page.tsx`**

**Step 3: Commit**

```bash
git add app/[locale]/page.tsx app/page.tsx
git commit -m "feat: move home page under [locale] with translations"
```

---

### Task 6: Move blog listing under [locale]

**Files:**
- Create: `app/[locale]/blog/page.tsx`
- Delete: `app/blog/page.tsx`

**Step 1: Create `app/[locale]/blog/page.tsx`**

Copy from `app/blog/page.tsx`, adding locale params, `setRequestLocale`, translations, and locale-prefixed URLs.

**Step 2: Delete `app/blog/page.tsx`**

**Step 3: Commit**

```bash
git add app/[locale]/blog/page.tsx app/blog/page.tsx
git commit -m "feat: move blog listing under [locale]"
```

---

### Task 7: Move blog post detail under [locale]

**Files:**
- Create: `app/[locale]/blog/[slug]/page.tsx`
- Delete: `app/blog/[slug]/page.tsx`

**Step 1: Create `app/[locale]/blog/[slug]/page.tsx`**

Copy from `app/blog/[slug]/page.tsx`, adding locale params, `setRequestLocale`, translations, and locale-prefixed URLs. `generateStaticParams` returns locale + slug combinations.

**Step 2: Delete `app/blog/[slug]/page.tsx`**

**Step 3: Commit**

```bash
git add app/[locale]/blog/\[slug\]/page.tsx app/blog/\[slug\]/page.tsx
git commit -m "feat: move blog post detail under [locale]"
```

---

### Task 8: Move FAQ page under [locale]

**Files:**
- Create: `app/[locale]/faq/page.tsx`
- Delete: `app/faq/page.tsx`

**Step 1: Create `app/[locale]/faq/page.tsx`**

Copy from `app/faq/page.tsx`, adding locale params, `setRequestLocale`, translations, and locale-prefixed canonical URLs.

**Step 2: Delete `app/faq/page.tsx`**

**Step 3: Commit**

```bash
git add app/[locale]/faq/page.tsx app/faq/page.tsx
git commit -m "feat: move FAQ page under [locale]"
```

---

### Task 9: Move author page under [locale]

**Files:**
- Create: `app/[locale]/author/[name]/page.tsx`
- Delete: `app/author/[name]/page.tsx`

**Step 1: Create `app/[locale]/author/[name]/page.tsx`**

Copy from `app/author/[name]/page.tsx`, adding locale params, `setRequestLocale`, translations, and locale-prefixed URLs.

**Step 2: Delete `app/author/[name]/page.tsx`**

**Step 3: Commit**

```bash
git add app/[locale]/author/\[name\]/page.tsx app/author/\[name\]/page.tsx
git commit -m "feat: move author page under [locale]"
```

---

### Task 10: Update Header and Footer to use translations

**Files:**
- Modify: `components/header.tsx`
- Modify: `components/footer.tsx`

**Step 1: Update `components/header.tsx`**

Replace hardcoded strings with `useTranslations("common")` calls. Add `useParams()` for locale-prefixed links.

**Step 2: Update `components/footer.tsx`**

Replace hardcoded strings with `useTranslations("common")` calls. Add `useParams()` for locale-prefixed links.

**Step 3: Commit**

```bash
git add components/header.tsx components/footer.tsx
git commit -m "feat: update Header and Footer to use translations"
```

---

### Task 11: Update next-sitemap config for multilingual

**Files:**
- Modify: `next-sitemap.config.ts`

**Step 1: Update config**

```ts
import type { IConfig } from "next-sitemap"
import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const __dirname = dirname(fileURLToPath(import.meta.url))
const postsRaw = readFileSync(join(__dirname, ".velite", "posts.json"), "utf-8")

interface Post {
  slug: string
  publishedAt: string
  updatedAt?: string
}

const typedPosts = JSON.parse(postsRaw) as Post[]

const locales = ["en", "es", "fr"]

const postLastmodByPath = new Map<string, string>(
  typedPosts.flatMap((post) =>
    locales.map((locale) => [
      `/${locale}/blog/${post.slug}`,
      post.updatedAt ?? post.publishedAt,
    ])
  )
)

const config: IConfig = {
  siteUrl: "https://cctv.name",
  generateRobotsTxt: false,
  exclude: [
    "/keystatic/*",
    "/api/*",
    "/login*",
    "/markdoc-demo",
    "/robots.txt",
    "/*.txt",
  ],
  alternateRefs: locales.map((locale) => ({
    href: `https://cctv.name/${locale}`,
    hreflang: locale,
  })),
  transform: async (_config, path) => {
    let priority = 0.5

    if (path === "/en" || path === "/es" || path === "/fr") {
      priority = 1.0
    } else if (path.endsWith("/blog")) {
      priority = 0.8
    } else if (path.includes("/blog/")) {
      priority = 0.6
    }

    return {
      loc: path,
      changefreq: path === "/en" || path === "/es" || path === "/fr" ? "daily" : "weekly",
      priority,
      lastmod: postLastmodByPath.get(path) ?? new Date().toISOString(),
    }
  },
}

export default config
```

**Step 2: Commit**

```bash
git add next-sitemap.config.ts
git commit -m "feat: update sitemap config for multilingual locales"
```

---

### Task 12: Update robots.ts

**Files:**
- Modify: `app/robots.ts`

No changes needed — sitemap URL remains the same (`/sitemap.xml`).

---

### Task 13: Add language switcher component

**Files:**
- Create: `components/language-switcher.tsx`
- Modify: `components/header.tsx`

**Step 1: Create `components/language-switcher.tsx`**

```ts
"use client"

import { useParams, usePathname, useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { routing } from "@/i18n/routing"
import type { JSX } from "react"

const localeLabels: Record<string, string> = {
  en: "EN",
  es: "ES",
  fr: "FR",
}

export default function LanguageSwitcher(): JSX.Element {
  const t = useTranslations("common")
  const pathname = usePathname()
  const router = useRouter()
  const { locale: currentLocale } = useParams()

  const switchLocale = (nextLocale: string) => {
    const segments = pathname.split("/").filter(Boolean)
    const pathWithoutLocale = routing.locales.includes(segments[0])
      ? segments.slice(1)
      : segments
    const nextPath = `/${nextLocale}/${pathWithoutLocale.join("/")}`
    router.push(nextPath.replace(/\/$/, "") || "/")
  }

  return (
    <div className="flex items-center gap-1">
      {routing.locales.map((locale) => (
        <button
          key={locale}
          onClick={() => switchLocale(locale)}
          type="button"
          className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
            currentLocale === locale
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {localeLabels[locale] ?? locale.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
```

**Step 2: Add language switcher to Header**

Import and render `<LanguageSwitcher />` in `components/header.tsx` inside the `<nav>` element.

**Step 3: Commit**

```bash
git add components/language-switcher.tsx components/header.tsx
git commit -m "feat: add language switcher component"
```

---

### Task 14: Update markdoc-demo route

**Files:**
- Move: `app/markdoc-demo/page.tsx` to `app/[locale]/markdoc-demo/page.tsx`

Same pattern as other pages — add locale params.

---

### Task 15: Build and verify

**Step 1: Run typecheck**

```bash
npm run typecheck
```

**Step 2: Run dev server and test**

```bash
npm run dev
```

Visit:
- `/en` — English home
- `/es` — Spanish home
- `/fr` — French home
- `/en/blog` — English blog listing
- `/es/faq` — Spanish FAQ
- `/en/blog/<slug>` — English blog post

Verify language switcher navigates correctly.

**Step 3: Build**

```bash
npm run build
```

```

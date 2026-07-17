# Listing Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a reusable `ListingCard` component, make it available in MDX, and integrate a "Latest Listings" section on the homepage.

**Architecture:** Approach 1 - Clean separation via dedicated component and homepage integration.

**Tech Stack:** React, Next.js, Velite (for schema management).

---

### Task 1: Create `ListingCard` Component

**Files:**

- Create: `components/listing/listing-card.tsx`

- [ ] **Step 1: Write `ListingCard` implementation**

```tsx
import Link from "next/link"
import type { JSX } from "react/jsx-runtime"
import { siteConfig } from "@/lib/site-config"

interface ListingCardProps {
  title: string
  description?: string
  slug: string
  locale: string
  listingItems?: any[] // Using any for now based on velite listingItem schema
}

export default function ListingCard({
  title,
  description,
  slug,
  locale,
  listingItems,
}: ListingCardProps): JSX.Element {
  return (
    <article className="group rounded-lg border p-6 transition-colors hover:border-primary">
      <Link href={`/${locale}/listing/${slug}`} className="block">
        <h2 className="text-xl font-semibold group-hover:text-primary">
          {title}
        </h2>
        {description && (
          <p className="mt-2 text-muted-foreground">{description}</p>
        )}
      </Link>
    </article>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/listing/listing-card.tsx
git commit -m "feat: create ListingCard component"
```

---

### Task 2: Register `ListingCard` in `mdx-components.tsx`

**Files:**

- Modify: `components/mdx-components.tsx`

- [ ] **Step 1: Import and add to sharedComponents**

```tsx
import ListingCard from "@/components/listing/listing-card"

// ... existing imports

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    ListingCard, // Add this line
    // ...
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add components/mdx-components.tsx
git commit -m "feat: register ListingCard in MDX"
```

---

### Task 3: Integrate "Latest Listings" on Homepage

**Files:**

- Modify: `app/[locale]/page.tsx`

- [ ] **Step 1: Fetch and sort listings**

```tsx
// Inside Page component
const localePosts = posts.filter((post) => post.locale === locale)
const listings = localePosts.filter((post) => post.postType === "listing")
const sortedListings = [...listings].toSorted(
  (a, b) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
)
const latestListings = sortedListings.slice(0, 3)
```

- [ ] **Step 2: Add "Latest Listings" section**

```tsx
// Inside Page component return, after Latest Posts section
{
  latestListings.length > 0 && (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-3xl font-bold">
            {t("latestListings")}
          </h2>
          <Link
            href={`/${locale}/listing`}
            className="text-sm font-medium hover:text-primary"
          >
            {t("viewAll")}
          </Link>
        </div>
        <div className="mt-12 space-y-6">
          {latestListings.map((listing) => {
            return (
              <ListingCard
                key={listing.slug}
                title={listing.title}
                description={listing.description}
                slug={listing.slug}
                locale={locale}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Update Translations**

(Need to add `latestListings` key to the relevant translation file)

- [ ] **Step 4: Commit**

```bash
git add app/[locale]/page.tsx
git commit -m "feat: add Latest Listings section to homepage"
```

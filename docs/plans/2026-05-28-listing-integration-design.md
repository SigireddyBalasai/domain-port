# Design Document: Listings Component and Homepage Integration

## Overview

This design introduces a reusable `ListingCard` component and integrates a "Latest Listings" section into the homepage. This allows for consistent display of listing-type content across the site, including homepage discovery and embedding within blog posts.

## Proposed Changes

### 1. New Component: `ListingCard`

- **Location:** `components/listing/listing-card.tsx`
- **Purpose:** Provide a reusable, consistent card component for rendering items of `postType: "listing"`.
- **Styling:** Follows the existing `BlogCard` design pattern to maintain site coherence (group hover effects, border styling, responsive typography).

### 2. Homepage Integration

- **Location:** `app/[locale]/page.tsx`
- **Purpose:** Expose recent listings to users directly on the homepage.
- **Logic:**
  - Filter the global `posts` collection for `postType === "listing"`.
  - Sort by `publishedAt`.
  - Render a new section labeled "Latest Listings" immediately following the "Latest Posts" section, utilizing the new `ListingCard`.

### 3. MDX Integration

- **Location:** `components/mdx-components.tsx`
- **Purpose:** Enable developers to embed specific listings into blog posts using MDX.
- **Implementation:** Export `ListingCard` in `mdx-components.tsx` to make it globally available for use in `.mdx` content.

## Schema Considerations

- The implementation will leverage the existing Velite `listingItem` schema defined in `velite.config.ts`.
- `ListingCard` props will dynamically map the required fields (title, description, listing details) from this schema.

## Impact

- **Consistency:** Ensures listings match the visual language of the blog.
- **Discovery:** Improves visibility of listings.
- **Reusability:** Provides a flexible tool for editorial content.

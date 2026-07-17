# Blog Comment Section Design

**Date:** 2026-05-25
**Status:** Approved

## Overview

Add a self-hosted, moderated comment section below blog posts. Comments are server-rendered as HTML for full SEO indexability, with JSON-LD structured data for rich result eligibility.

## Database

**Neon Postgres** — existing project "cctv.name" (`broad-star-11787918`), `neondb` database.

New table `blog_comments` (separate from existing `comments` table which uses UUID FK to CMS `posts.id`):

```sql
CREATE TABLE blog_comments (
  id SERIAL PRIMARY KEY,
  post_slug TEXT NOT NULL,
  locale TEXT NOT NULL DEFAULT 'en',
  author_name TEXT NOT NULL,
  author_email TEXT NOT NULL,
  content TEXT NOT NULL,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  moderated_at TIMESTAMPTZ
);

CREATE INDEX idx_blog_comments_post ON blog_comments(post_slug, locale, is_approved);
```

Connection via `@neondatabase/serverless` with pooled connection string from existing project.

Flat comments (no threaded replies).

## Files

| File                                    | Purpose                                                                                            |
| --------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `lib/comment-db.ts`                     | Neon Postgres wrapper (query, insert, list, approve, delete, count) via `@neondatabase/serverless` |
| `lib/comment-spam.ts`                   | Spam detection (honeypot, rate limit, URL blocking)                                                |
| `app/api/comments/route.ts`             | POST submit comment                                                                                |
| `app/api/comments/[id]/route.ts`        | PATCH approve, DELETE reject                                                                       |
| `components/blog/comments.tsx`          | Server component: renders comment list + form                                                      |
| `components/blog/comment-form.tsx`      | Client component: form with validation                                                             |
| `components/blog/comment-form-lazy.tsx` | Lazy wrapper for comment form                                                                      |
| `app/[locale]/admin/comments/page.tsx`  | Moderation dashboard                                                                               |
| `lib/comment-jsonld.tsx`                | JSON-LD Comment schema generator                                                                   |

## Data Flow

1. Visitor submits form (name, email, comment) → `POST /api/comments`
2. Server validates (honeypot, rate limit, email, URL filter) → inserts as unapproved
3. Admin visits `/admin/comments` → reviews list → approves or deletes
4. On approve: `revalidatePath()` to update the blog post page + sitemap
5. Blog page server component queries `WHERE is_approved = 1 ORDER BY created_at ASC`
6. Comments render as HTML in the page source — fully indexable

## Component Architecture

### PostPage (`app/[locale]/blog/[slug]/page.tsx`)

- Add `interactionStatistic` to BlogPosting JSON-LD
- Add `<Comments postSlug={slug} locale={locale} />` after `</ShareButtons>`
- Comments server component fetches approved comments directly from SQLite

### Comments (`components/blog/comments.tsx`)

- Server component (async)
- Accepts `postSlug` and `locale` props
- Queries SQLite for approved comments
- Renders:
  - `<section>` with heading "Comments (N)"
  - List of comment cards (author name, date, content)
  - Each comment has h-entry microformat classes
- Includes `<CommentFormLazy>` at the bottom

### CommentForm (`components/blog/comment-form.tsx`)

- Client component with `"use client"`
- Fields: name, email, comment (textarea), honeypot (hidden)
- Client-side validation
- POSTs to `/api/comments`
- Shows success/error states
- Uses shadcn Input and Button components

### Moderation Dashboard

- Simple table listing all comments (approved + pending)
- Approve button (PATCH), Delete button (DELETE)
- Shows post slug, locale, author, content preview, date
- Protected by Better Auth session check

## SEO

1. **Server-rendered HTML** — comments in initial payload, no JS dependency for indexing
2. **BlogPosting interactionStatistic** — JSON-LD tells Google comment count
3. **h-entry microformat** — each comment has `h-entry`, `p-author`, `dt-published`, `e-content`
4. **revalidatePath on approve** — fresh content signals to crawlers

## Spam Protection

- **Honeypot**: hidden `website` field positioned off-screen
- **Rate limit**: 1 submission per 60s per IP (in-memory Map)
- **URL filter**: reject if URL patterns found in author_name
- **Email validation**: server-side format check

## Comment Form

- Fields: Name (required), Email (required), Comment (required, min 10 chars)
- Honeypot field (hidden from humans)
- Submit button with loading state
- Success message: "Comment submitted for moderation"
- Error messages: validation feedback

## i18n

- API rejects submissions for non-existent locale from the project's locale list
- Comments table stores locale so each translation has its own comment thread
- Moderation dashboard shows locale column for context

## JSON-LD (post page enhancement)

Add to the existing BlogPosting schema:

```json
"interactionStatistic": [
  {
    "@type": "InteractionCounter",
    "interactionType": "https://schema.org/CommentAction",
    "userInteractionCount": 5
  }
]
```

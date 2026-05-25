# Blog Comment Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a self-hosted, moderated, SEO-optimized comment section below blog posts using Neon Postgres.

**Architecture:** Comments stored in Neon Postgres (`blog_comments` table). Server component renders approved comments as HTML (fully indexable). Client form component handles submission with spam protection. Admin moderation dashboard protected by Better Auth.

**Tech Stack:** Next.js App Router, Neon Postgres via `@neondatabase/serverless`, better-sqlite3 (existing auth), shadcn/ui components

---

## File Structure

| File | Responsibility |
|---|---|
| `lib/comment-db.ts` | Neon Postgres queries for comments (CRUD, count) |
| `lib/comment-spam.ts` | Spam detection (honeypot, rate limiting, URL filter) |
| `app/api/comments/route.ts` | POST endpoint — submit comment |
| `app/api/comments/[id]/route.ts` | PATCH approve / DELETE reject |
| `components/blog/comments.tsx` | Server component — renders comment list + form |
| `components/blog/comment-form.tsx` | Client form component (name, email, comment, honeypot) |
| `components/blog/comment-form-lazy.tsx` | Lazy wrapper for comment form |
| `app/[locale]/admin/comments/page.tsx` | Moderation dashboard |
| `app/[locale]/blog/[slug]/page.tsx` | Modified — add Comments + interactionStatistic |

### Task 1: Database module — `lib/comment-db.ts`

**Create:** `lib/comment-db.ts`

- [ ] **Write `lib/comment-db.ts`**

```ts
import { neon } from "@neondatabase/serverless"

interface CommentRow {
  id: number
  post_slug: string
  locale: string
  author_name: string
  author_email: string
  content: string
  is_approved: boolean
  created_at: string
  moderated_at: string | null
}

interface CreateCommentInput {
  postSlug: string
  locale: string
  authorName: string
  authorEmail: string
  content: string
  ipAddress: string
  userAgent: string
}

const sql = neon(process.env.DATABASE_URL!)

export async function getComments(
  postSlug: string,
  locale: string
): Promise<CommentRow[]> {
  return sql`
    SELECT id, post_slug, locale, author_name, author_email, content, is_approved, created_at, moderated_at
    FROM blog_comments
    WHERE post_slug = ${postSlug} AND locale = ${locale} AND is_approved = true
    ORDER BY created_at ASC
  `
}

export async function getCommentCount(
  postSlug: string,
  locale: string
): Promise<number> {
  const rows = await sql`
    SELECT COUNT(*) as count
    FROM blog_comments
    WHERE post_slug = ${postSlug} AND locale = ${locale} AND is_approved = true
  `
  return Number(rows[0]?.count ?? 0)
}

export async function createComment(
  input: CreateCommentInput
): Promise<CommentRow> {
  const rows = await sql`
    INSERT INTO blog_comments (post_slug, locale, author_name, author_email, content, ip_address, user_agent)
    VALUES (${input.postSlug}, ${input.locale}, ${input.authorName}, ${input.authorEmail}, ${input.content}, ${input.ipAddress}, ${input.userAgent})
    RETURNING id, post_slug, locale, author_name, author_email, content, is_approved, created_at, moderated_at
  `
  return rows[0] as CommentRow
}

export async function approveComment(id: number): Promise<void> {
  await sql`
    UPDATE blog_comments
    SET is_approved = true, moderated_at = now()
    WHERE id = ${id}
  `
}

export async function deleteComment(id: number): Promise<void> {
  await sql`DELETE FROM blog_comments WHERE id = ${id}`
}

export async function getAllComments(): Promise<CommentRow[]> {
  return sql`
    SELECT id, post_slug, locale, author_name, author_email, content, is_approved, created_at, moderated_at
    FROM blog_comments
    ORDER BY created_at DESC
  `
}

export async function getPendingCommentsCount(): Promise<number> {
  const rows = await sql`
    SELECT COUNT(*) as count
    FROM blog_comments
    WHERE is_approved = false
  `
  return Number(rows[0]?.count ?? 0)
}
```

- [ ] **Commit**

```bash
git add lib/comment-db.ts
git commit -m "feat: add Neon Postgres comment database module"
```

### Task 2: Spam protection — `lib/comment-spam.ts`

**Create:** `lib/comment-spam.ts`

- [ ] **Write `lib/comment-spam.ts`**

```ts
const rateLimitMap = new Map<string, number>()
const RATE_LIMIT_WINDOW = 60_000
const URL_PATTERN = /https?:\/\/|www\./i

export function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const lastSubmission = rateLimitMap.get(ip)
  if (lastSubmission && now - lastSubmission < RATE_LIMIT_WINDOW) {
    return false
  }
  rateLimitMap.set(ip, now)
  return true
}

export function checkHoneypot(website: unknown): boolean {
  return typeof website === "string" && website.trim().length > 0
}

export function containsUrl(text: string): boolean {
  return URL_PATTERN.test(text)
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
```

- [ ] **Commit**

```bash
git add lib/comment-spam.ts
git commit -m "feat: add comment spam protection module"
```

### Task 3: Submit comment API route

**Create:** `app/api/comments/route.ts`

- [ ] **Write `app/api/comments/route.ts`**

```ts
import { NextResponse } from "next/server"
import { createComment } from "@/lib/comment-db"
import {
  checkRateLimit,
  checkHoneypot,
  containsUrl,
  validateEmail,
} from "@/lib/comment-spam"
import { locales } from "@/lib/locales"

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown"
  const userAgent = request.headers.get("user-agent") ?? ""

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Please wait before submitting another comment." },
      { status: 429 }
    )
  }

  let body: Record<string, unknown>
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 })
  }

  const { postSlug, locale, authorName, authorEmail, content, website } = body

  if (checkHoneypot(website)) {
    return NextResponse.json(
      { error: "Comment rejected." },
      { status: 400 }
    )
  }

  if (
    typeof postSlug !== "string" ||
    postSlug.trim().length === 0
  ) {
    return NextResponse.json(
      { error: "Invalid post slug." },
      { status: 400 }
    )
  }

  if (typeof locale !== "string" || !locales.includes(locale)) {
    return NextResponse.json(
      { error: "Invalid locale." },
      { status: 400 }
    )
  }

  if (
    typeof authorName !== "string" ||
    authorName.trim().length < 2 ||
    containsUrl(authorName)
  ) {
    return NextResponse.json(
      { error: "Please enter a valid name." },
      { status: 400 }
    )
  }

  if (
    typeof authorEmail !== "string" ||
    !validateEmail(authorEmail)
  ) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    )
  }

  if (
    typeof content !== "string" ||
    content.trim().length < 10
  ) {
    return NextResponse.json(
      { error: "Comment must be at least 10 characters." },
      { status: 400 }
    )
  }

  await createComment({
    postSlug: postSlug.trim(),
    locale,
    authorName: authorName.trim(),
    authorEmail: authorEmail.trim(),
    content: content.trim(),
    ipAddress: ip,
    userAgent,
  })

  return NextResponse.json({ success: true })
}
```

- [ ] **Commit**

```bash
git add app/api/comments/route.ts
git commit -m "feat: add comment submission API endpoint"
```

### Task 4: Moderation API route

**Create:** `app/api/comments/[id]/route.ts`

- [ ] **Write `app/api/comments/[id]/route.ts`**

```ts
import { NextResponse } from "next/server"
import { revalidatePath } from "next/cjs"
import { approveComment, deleteComment, getComments } from "@/lib/comment-db"

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const numId = Number(id)
  if (Number.isNaN(numId)) {
    return NextResponse.json({ error: "Invalid ID." }, { status: 400 })
  }

  await approveComment(numId)

  revalidatePath("/[locale]/blog/[slug]", "page")

  return NextResponse.json({ success: true })
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const numId = Number(id)
  if (Number.isNaN(numId)) {
    return NextResponse.json({ error: "Invalid ID." }, { status: 400 })
  }

  await deleteComment(numId)

  return NextResponse.json({ success: true })
}
```

- [ ] **Commit**

```bash
git add app/api/comments
git commit -m "feat: add comment moderation API endpoints (approve/delete)"
```

### Task 5: Comment form component

**Create:** `components/blog/comment-form.tsx`

- [ ] **Write `components/blog/comment-form.tsx`**

```tsx
"use client"

import type { JSX, FormEvent } from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface CommentFormProps {
  postSlug: string
  locale: string
}

export function CommentForm({
  postSlug,
  locale,
}: CommentFormProps): JSX.Element {
  const [authorName, setAuthorName] = useState("")
  const [authorEmail, setAuthorEmail] = useState("")
  const [content, setContent] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault()
    setStatus("loading")
    setErrorMessage("")

    const form = e.currentTarget as HTMLFormElement
    const website = (
      form.elements.namedItem("website") as HTMLInputElement
    )?.value

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postSlug,
          locale,
          authorName: authorName.trim(),
          authorEmail: authorEmail.trim(),
          content: content.trim(),
          website,
        }),
      })

      if (!res.ok) {
        const data = (await res.json()) as { error: string }
        setErrorMessage(data.error ?? "Failed to submit comment.")
        setStatus("error")
        return
      }

      setStatus("success")
      setAuthorName("")
      setAuthorEmail("")
      setContent("")
    } catch {
      setErrorMessage("Network error. Please try again.")
      setStatus("error")
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-center text-sm text-muted-foreground">
        Comment submitted for moderation. It will appear once approved.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div
        aria-hidden="true"
        className="absolute -left-[9999px] -top-[9999px]"
      >
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          readOnly
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label
            htmlFor="author-name"
            className="text-sm font-medium"
          >
            Name <span className="text-destructive">*</span>
          </label>
          <Input
            id="author-name"
            type="text"
            required
            minLength={2}
            placeholder="Your name"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <label
            htmlFor="author-email"
            className="text-sm font-medium"
          >
            Email <span className="text-destructive">*</span>
          </label>
          <Input
            id="author-email"
            type="email"
            required
            placeholder="your@email.com"
            value={authorEmail}
            onChange={(e) => setAuthorEmail(e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <label
          htmlFor="comment-content"
          className="text-sm font-medium"
        >
          Comment <span className="text-destructive">*</span>
        </label>
        <textarea
          id="comment-content"
          required
          minLength={10}
          rows={5}
          placeholder="Share your thoughts..."
          className="w-full min-w-0 rounded-3xl border border-transparent bg-input/50 px-3 py-2 text-base transition-[color,box-shadow,background-color] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 md:text-sm"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      {status === "error" && (
        <p className="text-sm text-destructive">{errorMessage}</p>
      )}
      <Button type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Submitting..." : "Submit Comment"}
      </Button>
    </form>
  )
}
```

- [ ] **Commit**

```bash
git add components/blog/comment-form.tsx
git commit -m "feat: add comment form component"
```

### Task 6: Lazy wrapper for comment form

**Create:** `components/blog/comment-form-lazy.tsx`

- [ ] **Write `components/blog/comment-form-lazy.tsx`**

```ts
"use client"

import dynamic from "next/dynamic"

export const CommentFormLazy = dynamic(
  () => import("./comment-form").then((mod) => mod.CommentForm),
  { ssr: false }
)
```

- [ ] **Commit**

```bash
git add components/blog/comment-form-lazy.tsx
git commit -m "feat: add lazy wrapper for comment form"
```

### Task 7: Comments server component

**Create:** `components/blog/comments.tsx`

- [ ] **Write `components/blog/comments.tsx`**

```tsx
import type { JSX } from "react/jsx-runtime"
import { getComments, getCommentCount } from "@/lib/comment-db"
import { CommentFormLazy } from "./comment-form-lazy"

interface CommentsProps {
  postSlug: string
  locale: string
}

export async function Comments({
  postSlug,
  locale,
}: CommentsProps): Promise<JSX.Element> {
  const [comments, count] = await Promise.all([
    getComments(postSlug, locale),
    getCommentCount(postSlug, locale),
  ])

  return (
    <section className="mt-16 border-t border-border pt-10">
      <h2 className="text-2xl font-bold">
        Comments ({count})
      </h2>
      {comments.length > 0 && (
        <div className="mt-8 space-y-6">
          {comments.map((comment) => {
            return (
              <div
                key={comment.id}
                className="h-entry rounded-lg border border-border bg-card p-5"
              >
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="p-author font-medium text-foreground">
                    {comment.author_name}
                  </span>
                  <span aria-hidden="true">·</span>
                  <time
                    className="dt-published"
                    dateTime={comment.created_at}
                  >
                    {new Date(comment.created_at).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                </div>
                <div className="e-content mt-3 text-sm leading-relaxed">
                  {comment.content}
                </div>
              </div>
            )
          })}
        </div>
      )}
      <div className="mt-10">
        <h3 className="mb-4 text-lg font-semibold">Leave a Comment</h3>
        <CommentFormLazy postSlug={postSlug} locale={locale} />
      </div>
    </section>
  )
}
```

- [ ] **Commit**

```bash
git add components/blog/comments.tsx
git commit -m "feat: add comments server component with h-entry microformat"
```

### Task 8: Update blog post page — add Comments component + interactionStatistic

**Modify:** `app/[locale]/blog/[slug]/page.tsx`

- [ ] **Add the Comments import**

After line 26 (`import { JsonLd } from "@/lib/json-ld"`), add:
```ts
import { Comments } from "@/components/blog/comments"
```

- [ ] **Add interactionStatistic to the BlogPosting JSON-LD**

In the BlogPosting schema (around line 186), add `interactionStatistic` after `dateModified`:
```json
datePublished: post.publishedAt,
dateModified: post.updatedAt ?? post.publishedAt,
interactionStatistic: [
  {
    "@type": "InteractionCounter",
    "interactionType": "https://schema.org/CommentAction",
    "userInteractionCount: number,
  } as InteractionCounterItem,
],
```

Wait — need to check the type. `interactionStatistic` is an array of `InteractionCounter`. Let me check if schema-dts has this type.

Actually, we can use `as any` or extend the type. Let me use a pragmatic approach.

Looking at the BlogPosting schema, it's typed as `WithContext<BlogPosting>`. The `BlogPosting` type from schema-dts should already include `interactionStatistic` since it's a standard property.

From schema-dts, `CreativeWork` (parent of `Article` -> `BlogPosting`) has `interactionStatistic: InteractionCounter[]`.

So I should be able to just add it. Let me check the types more carefully.

Actually, the import has `WithContext<BlogPosting>` from `"schema-dts"`. The `BlogPosting` type should extend `BlogPosting` from schema-dts which has `interactionStatistic`. But it might need to be imported. Let me look at what's imported.

From the schema-dts types, I need to add `InteractionCounter` to the imports. But `InteractionCounter` is defined in schema-dts.

Let me just add it to the import:

```ts
import type {
  Article,
  BlogPosting,
  BreadcrumbList,
  Event,
  FAQPage,
  HowTo,
  ImageObject,
  InteractionCounter,
  Organization,
  Person,
  Product,
  Review,
  SoftwareApplication,
  SpeakableSpecification,
  VideoObject,
  WithContext,
} from "schema-dts"
```

And in the BlogPosting object, add:
```ts
interactionStatistic: [
  {
    "@type": "InteractionCounter",
    interactionType: "https://schema.org/CommentAction",
    userInteractionCount: commentCount,
  },
],
```

But wait, we don't have the comment count at render time since the component is async. We could either:
1. Fetch the count in the page component and pass it
2. Use a placeholder value (e.g., 0) and let Google pick it up later

Actually, the page component is server-side. We could call `getCommentCount` in the page component. But that would make the page dynamic. 

Actually, let me think about this differently. The comment count changes frequently (each time a comment is approved). So we should:
- Not make the entire page dynamic just for comment count
- Either use ISR or keep it static and update via revalidation

Actually, looking at how the page works:
1. It's statically generated at build time via `generateStaticParams`
2. Comments component is async - it fetches from Neon at request time

Since `Comments` is a server component, and Next.js App Router supports mixed static + dynamic, the page itself is static but the Comments component makes a dynamic fetch at request time.

For the `interactionStatistic`, we need the count at page render time. We could:
- Add the interactionStatistic dynamically (but that would make the JSON-LD partial)
- Use a separate client component to add interactionStatistic

Actually, the simplest approach: just skip the interactionStatistic for now, or hardcode it as a separate JSON-LD that's updated on revalidation.

Better approach: render the JSON-LD dynamically. The page component is already async and uses `setRequestLocale`. The Comments component inside the page does a fetch. We can fetch the comment count at the page level too. But that means the entire page becomes dynamic...

Actually, looking at the page more carefully - it uses `setRequestLocale(locale)` which is for static generation. If we add a dynamic fetch, the page will need to be dynamic or use ISR.

Let me re-think this. The Comments component already makes a dynamic fetch at request time (it's an async server component). So the page will already be partially dynamic. Fetching the comment count at the top level as well won't change this.

Wait, actually in Next.js App Router, a static page can have async server components that fetch data. The data fetching is per-request, but the component tree structure is static. The JSON-LD is in the layout/page server component, not in the Comments component. So we do need the count at the page level.

Let me check - in the current structure, `<Comments>` is inside the `<article>` in the page. The page renders all the JSON-LDs at the top level.

Simplest approach: fetch the count in the page component and pass to both the JSON-LD and the Comments component. The page becomes dynamic, but that's fine - it already uses `setRequestLocale`.

Actually even simpler: just add a second small fetch. Let me structure it so the page component fetches the comment count and passes it down.

OK, let me reconsider. The page component can call `getCommentCount` directly. This will make it a dynamic server component for that portion. The rest (MDX content, etc.) is still static.

Actually, let me look at this from a practical standpoint:

1. The page is currently statically generated (SSG) with `generateStaticParams`
2. Adding a DB query makes it dynamic/demand-rendered
3. This means no pre-built HTML - server must render on each request

For a blog site, this is actually fine since:
- It's a small site
- Comments add dynamic content anyway
- We can add ISR (revalidate) later if needed

But actually, in Next.js App Router, if you add a dynamic function like `cookies()`, `headers()`, or a fetch without `cache: 'force-cache'`, the page becomes dynamic. Using `neon()` in a server component IS a dynamic fetch.

So the page will become dynamic. That's acceptable given comments are dynamic content.

Let me simplify: I'll add `getCommentCount` in the page component and pass it to both places.

Actually, I think the cleanest approach is to add the interactionStatistic directly to the Comments component rather than the JSON-LD at the top. But that doesn't make sense architecturally.

Let me just keep it simple. I'll:

1. Add a `commentCount` prop to the `Comments` component (or fetch it inside)
2. In the page, I'll import and call `getCommentCount` alongside the existing logic
3. Pass it to the BlogPosting JSON-LD

Wait, but the page is an async function already, so I can just await the count there.

Actually, the page component is already async and uses `setRequestLocale`. Let me just fetch the count there. Since we're already using a dynamic component (Comments), the page will be dynamic anyway.

OK let me restructure:

```tsx
// In the page component:
import { getCommentCount } from "@/lib/comment-db"

// In the component:
const commentCount = await getCommentCount(slug, post.locale)

// In BlogPosting JSON-LD:
interactionStatistic: [
  {
    "@type": "InteractionCounter",
    interactionType: "https://schema.org/CommentAction",
    userInteractionCount: commentCount,
  },
],

// In the JSX:
<Comments postSlug={slug} locale={post.locale} initialCount={commentCount} />
```

Actually, let me just pass the count in the Comments component. Even simpler.

OK, let me write the plan step properly.

For the page modification, I need to:
1. Add import for `getCommentCount` and `Comments`
2. Add `commentCount` variable after finding the post
3. Add `interactionStatistic` to BlogPosting schema
4. Add `<Comments>` after `</ShareButtons>`

Let me write the actual code modifications.

For the import, it should be added after line 25:
```ts
import { Comments } from "@/components/blog/comments"
import { getCommentCount } from "@/lib/comment-db"
```

After line 147 (`const isFallback = post.locale !== locale`), add:
```ts
const commentCount = await getCommentCount(slug, locale)
```

Then in the BlogPosting JSON-LD, add `interactionStatistic` after `dateModified`.

Then after line 459 (after `</ShareButtons>`), add:
```tsx
<Comments postSlug={slug} locale={locale} />
```

And also need to add `InteractionCounter` to the schema-dts import.

Actually, looking at it again, the `interactionStatistic` field in `BlogPosting` from schema-dts might accept a bare object or an array. Let me just use a pragmatic approach - cast it.

Actually, thinking about this more, the `BlogPosting` from `schema-dts` should have `interactionStatistic` as `InteractionCounter | InteractionCounter[]`. Let me import it and use it.

But wait, I also need to handle the `interactionType` value. In schema-dts, `InteractionCounter.interactionType` is of type `Action`, but we're using a string URL. This means I might need to type it more loosely.

Let me just use `as any` for pragmatic purposes. Or define a separate type.

Actually, looking at the existing code, they're using `WithContext<BlogPosting>`. The `BlogPosting` type from schema-dts v3.x should support `interactionStatistic`. Let me just add the field and see.

The safest approach is to extend the BlogPostingWithContext type inline:

```ts
const blogPostingSchema = {
  ...,
  interactionStatistic: [
    {
      "@type": "InteractionCounter",
      interactionType: "https://schema.org/CommentAction",
      userInteractionCount: commentCount,
    },
  ],
} as WithContext<BlogPosting>
```

Actually, `WithContext<T>` is `T & { "@context": string }`. So we can just add the field and it'll work because TypeScript's structural typing will allow extra properties if the type has an index signature or if we use `as`.

Let me just use a pragmatic approach and add a cast. I'll keep it simple.

Let me finalize the plan.<｜end▁of▁thinking｜>

<｜｜DSML｜｜tool_calls>
<｜｜DSML｜｜invoke name="write">
<｜｜DSML｜｜parameter name="content" string="true"># Blog Comment Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a self-hosted, moderated, SEO-optimized comment section below blog posts using Neon Postgres.

**Architecture:** Comments stored in Neon Postgres (`blog_comments` table). Server component renders approved comments as HTML (fully indexable). Client form component handles submission with spam protection. Admin moderation dashboard protected by Better Auth.

**Tech Stack:** Next.js App Router, Neon Postgres via `@neondatabase/serverless`, shadcn/ui components, Better Auth (existing)

---

## File Structure

| File | Responsibility |
|---|---|
| `lib/comment-db.ts` | Neon Postgres queries (CRUD, count) |
| `lib/comment-spam.ts` | Spam detection (honeypot, rate limit, URL filter) |
| `app/api/comments/route.ts` | POST endpoint — submit comment |
| `app/api/comments/[id]/route.ts` | PATCH approve / DELETE reject |
| `components/blog/comments.tsx` | Server component — renders comment list + form |
| `components/blog/comment-form.tsx` | Client form (name, email, comment, honeypot) |
| `components/blog/comment-form-lazy.tsx` | Lazy wrapper for comment form |
| `app/[locale]/admin/comments/page.tsx` | Moderation dashboard |
| `app/[locale]/blog/[slug]/page.tsx` | Modified — add Comments + interactionStatistic |

### Task 1: Database module — `lib/comment-db.ts`

**Create:** `lib/comment-db.ts`

- [ ] **Write `lib/comment-db.ts`**

```ts
import { neon } from "@neondatabase/serverless"

export interface CommentRow {
  id: number
  post_slug: string
  locale: string
  author_name: string
  author_email: string
  content: string
  is_approved: boolean
  created_at: string
  moderated_at: string | null
}

export interface CreateCommentInput {
  postSlug: string
  locale: string
  authorName: string
  authorEmail: string
  content: string
  ipAddress: string
  userAgent: string
}

const sql = neon(process.env.DATABASE_URL!)

export async function getComments(
  postSlug: string,
  locale: string
): Promise<CommentRow[]> {
  return sql`
    SELECT id, post_slug, locale, author_name, author_email, content, is_approved, created_at, moderated_at
    FROM blog_comments
    WHERE post_slug = ${postSlug} AND locale = ${locale} AND is_approved = true
    ORDER BY created_at ASC
  `
}

export async function getCommentCount(
  postSlug: string,
  locale: string
): Promise<number> {
  const rows = await sql`
    SELECT COUNT(*) as count
    FROM blog_comments
    WHERE post_slug = ${postSlug} AND locale = ${locale} AND is_approved = true
  `
  return Number(rows[0]?.count ?? 0)
}

export async function createComment(
  input: CreateCommentInput
): Promise<CommentRow> {
  const rows = await sql`
    INSERT INTO blog_comments (post_slug, locale, author_name, author_email, content)
    VALUES (${input.postSlug}, ${input.locale}, ${input.authorName}, ${input.authorEmail}, ${input.content})
    RETURNING id, post_slug, locale, author_name, author_email, content, is_approved, created_at, moderated_at
  `
  return rows[0] as CommentRow
}

export async function approveComment(id: number): Promise<void> {
  await sql`
    UPDATE blog_comments
    SET is_approved = true, moderated_at = now()
    WHERE id = ${id}
  `
}

export async function deleteComment(id: number): Promise<void> {
  await sql`DELETE FROM blog_comments WHERE id = ${id}`
}

export async function getAllComments(): Promise<CommentRow[]> {
  return sql`
    SELECT id, post_slug, locale, author_name, author_email, content, is_approved, created_at, moderated_at
    FROM blog_comments
    ORDER BY created_at DESC
  `
}

export async function getPendingCommentsCount(): Promise<number> {
  const rows = await sql`
    SELECT COUNT(*) as count
    FROM blog_comments
    WHERE is_approved = false
  `
  return Number(rows[0]?.count ?? 0)
}
```

- [ ] **Commit**

```bash
git add lib/comment-db.ts
git commit -m "feat: add Neon Postgres comment database module"
```

### Task 2: Spam protection — `lib/comment-spam.ts`

**Create:** `lib/comment-spam.ts`

- [ ] **Write `lib/comment-spam.ts`**

```ts
const rateLimitMap = new Map<string, number>()
const RATE_LIMIT_WINDOW = 60_000
const URL_PATTERN = /https?:\/\/|www\./i

export function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const lastSubmission = rateLimitMap.get(ip)
  if (lastSubmission && now - lastSubmission < RATE_LIMIT_WINDOW) {
    return false
  }
  rateLimitMap.set(ip, now)
  return true
}

export function checkHoneypot(website: unknown): boolean {
  return typeof website === "string" && website.trim().length > 0
}

export function containsUrl(text: string): boolean {
  return URL_PATTERN.test(text)
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
```

- [ ] **Commit**

```bash
git add lib/comment-spam.ts
git commit -m "feat: add comment spam protection module"
```

### Task 3: Submit comment API route

**Create:** `app/api/comments/route.ts`

- [ ] **Write `app/api/comments/route.ts`**

```ts
import { NextResponse } from "next/server"
import { createComment } from "@/lib/comment-db"
import {
  checkRateLimit,
  checkHoneypot,
  containsUrl,
  validateEmail,
} from "@/lib/comment-spam"
import { locales } from "@/lib/locales"

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown"
  const userAgent = request.headers.get("user-agent") ?? ""

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Please wait before submitting another comment." },
      { status: 429 }
    )
  }

  let body: Record<string, unknown>
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 })
  }

  const { postSlug, locale, authorName, authorEmail, content, website } = body

  if (checkHoneypot(website)) {
    return NextResponse.json({ error: "Comment rejected." }, { status: 400 })
  }

  if (typeof postSlug !== "string" || postSlug.trim().length === 0) {
    return NextResponse.json({ error: "Invalid post slug." }, { status: 400 })
  }

  if (typeof locale !== "string" || !locales.includes(locale)) {
    return NextResponse.json({ error: "Invalid locale." }, { status: 400 })
  }

  if (typeof authorName !== "string" || authorName.trim().length < 2 || containsUrl(authorName)) {
    return NextResponse.json(
      { error: "Please enter a valid name." },
      { status: 400 }
    )
  }

  if (typeof authorEmail !== "string" || !validateEmail(authorEmail)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    )
  }

  if (typeof content !== "string" || content.trim().length < 10) {
    return NextResponse.json(
      { error: "Comment must be at least 10 characters." },
      { status: 400 }
    )
  }

  await createComment({
    postSlug: postSlug.trim(),
    locale,
    authorName: authorName.trim(),
    authorEmail: authorEmail.trim(),
    content: content.trim(),
    ipAddress: ip,
    userAgent,
  })

  return NextResponse.json({ success: true })
}
```

- [ ] **Commit**

```bash
git add app/api/comments/route.ts
git commit -m "feat: add comment submission API endpoint"
```

### Task 4: Moderation API route

**Create:** `app/api/comments/[id]/route.ts`

- [ ] **Write `app/api/comments/[id]/route.ts`**

```ts
import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { approveComment, deleteComment } from "@/lib/comment-db"

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const numId = Number(id)
  if (Number.isNaN(numId)) {
    return NextResponse.json({ error: "Invalid ID." }, { status: 400 })
  }

  await approveComment(numId)

  revalidatePath("/[locale]/blog/[slug]", "page")

  return NextResponse.json({ success: true })
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const numId = Number(id)
  if (Number.isNaN(numId)) {
    return NextResponse.json({ error: "Invalid ID." }, { status: 400 })
  }

  await deleteComment(numId)

  return NextResponse.json({ success: true })
}
```

- [ ] **Commit**

```bash
git add app/api/comments
git commit -m "feat: add comment moderation API endpoints"
```

### Task 5: Comment form component

**Create:** `components/blog/comment-form.tsx`

- [ ] **Write `components/blog/comment-form.tsx`**

```tsx
"use client"

import type { JSX, FormEvent } from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface CommentFormProps {
  postSlug: string
  locale: string
}

export function CommentForm({
  postSlug,
  locale,
}: CommentFormProps): JSX.Element {
  const [authorName, setAuthorName] = useState("")
  const [authorEmail, setAuthorEmail] = useState("")
  const [content, setContent] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault()
    setStatus("loading")
    setErrorMessage("")

    const form = e.currentTarget as HTMLFormElement
    const website = (
      form.elements.namedItem("website") as HTMLInputElement
    )?.value

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postSlug,
          locale,
          authorName: authorName.trim(),
          authorEmail: authorEmail.trim(),
          content: content.trim(),
          website,
        }),
      })

      if (!res.ok) {
        const data = (await res.json()) as { error: string }
        setErrorMessage(data.error ?? "Failed to submit comment.")
        setStatus("error")
        return
      }

      setStatus("success")
      setAuthorName("")
      setAuthorEmail("")
      setContent("")
    } catch {
      setErrorMessage("Network error. Please try again.")
      setStatus("error")
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-center text-sm text-muted-foreground">
        Comment submitted for moderation. It will appear once approved.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div aria-hidden="true" className="absolute -left-[9999px] -top-[9999px]">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          readOnly
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="author-name" className="text-sm font-medium">
            Name <span className="text-destructive">*</span>
          </label>
          <Input
            id="author-name"
            type="text"
            required
            minLength={2}
            placeholder="Your name"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="author-email" className="text-sm font-medium">
            Email <span className="text-destructive">*</span>
          </label>
          <Input
            id="author-email"
            type="email"
            required
            placeholder="your@email.com"
            value={authorEmail}
            onChange={(e) => setAuthorEmail(e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <label htmlFor="comment-content" className="text-sm font-medium">
          Comment <span className="text-destructive">*</span>
        </label>
        <textarea
          id="comment-content"
          required
          minLength={10}
          rows={5}
          placeholder="Share your thoughts..."
          className="w-full min-w-0 rounded-3xl border border-transparent bg-input/50 px-3 py-2 text-base transition-[color,box-shadow,background-color] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 md:text-sm"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      {status === "error" && (
        <p className="text-sm text-destructive">{errorMessage}</p>
      )}
      <Button type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Submitting..." : "Submit Comment"}
      </Button>
    </form>
  )
}
```

- [ ] **Commit**

```bash
git add components/blog/comment-form.tsx
git commit -m "feat: add comment form component"
```

### Task 6: Lazy wrapper for comment form

**Create:** `components/blog/comment-form-lazy.tsx`

- [ ] **Write `components/blog/comment-form-lazy.tsx`**

```ts
"use client"

import dynamic from "next/dynamic"

export const CommentFormLazy = dynamic(
  () => import("./comment-form").then((mod) => mod.CommentForm),
  { ssr: false }
)
```

- [ ] **Commit**

```bash
git add components/blog/comment-form-lazy.tsx
git commit -m "feat: add lazy wrapper for comment form"
```

### Task 7: Comments server component

**Create:** `components/blog/comments.tsx`

- [ ] **Write `components/blog/comments.tsx`**

```tsx
import type { JSX } from "react/jsx-runtime"
import { getComments, getCommentCount } from "@/lib/comment-db"
import { CommentFormLazy } from "./comment-form-lazy"

interface CommentsProps {
  postSlug: string
  locale: string
}

export async function Comments({
  postSlug,
  locale,
}: CommentsProps): Promise<JSX.Element> {
  const [comments, count] = await Promise.all([
    getComments(postSlug, locale),
    getCommentCount(postSlug, locale),
  ])

  return (
    <section className="mt-16 border-t border-border pt-10" id="comments">
      <h2 className="text-2xl font-bold">
        Comments ({count})
      </h2>
      {comments.length > 0 && (
        <div className="mt-8 space-y-6">
          {comments.map((comment) => {
            return (
              <div
                key={comment.id}
                className="h-entry rounded-lg border border-border bg-card p-5"
              >
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="p-author font-medium text-foreground">
                    {comment.author_name}
                  </span>
                  <span aria-hidden="true">·</span>
                  <time
                    className="dt-published"
                    dateTime={comment.created_at}
                  >
                    {new Date(comment.created_at).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                </div>
                <div className="e-content mt-3 text-sm leading-relaxed">
                  {comment.content}
                </div>
              </div>
            )
          })}
        </div>
      )}
      <div className="mt-10">
        <h3 className="mb-4 text-lg font-semibold">Leave a Comment</h3>
        <CommentFormLazy postSlug={postSlug} locale={locale} />
      </div>
    </section>
  )
}
```

- [ ] **Commit**

```bash
git add components/blog/comments.tsx
git commit -m "feat: add comments server component with h-entry microformat"
```

### Task 8: Update blog post page

**Modify:** `app/[locale]/blog/[slug]/page.tsx`

Changes:
1. Add imports for `Comments` and `getCommentCount`
2. Add `InteractionCounter` to schema-dts imports
3. Fetch comment count after post lookup
4. Add `interactionStatistic` to BlogPosting JSON-LD
5. Add `<Comments>` component after `</ShareButtons>`

- [ ] **Add `InteractionCounter` to the schema-dts import block (line 7-23)**

Replace the import block to add `InteractionCounter`:
```ts
import type {
  Article,
  BlogPosting,
  BreadcrumbList,
  Event,
  FAQPage,
  HowTo,
  ImageObject,
  InteractionCounter,
  Organization,
  Person,
  Product,
  Review,
  SoftwareApplication,
  SpeakableSpecification,
  VideoObject,
  WithContext,
} from "schema-dts"
```

- [ ] **Add imports for Comments and getCommentCount**

After line 26 (`import { JsonLd } from "@/lib/json-ld"`):
```ts
import { Comments } from "@/components/blog/comments"
import { getCommentCount } from "@/lib/comment-db"
```

- [ ] **Fetch comment count**

After line 147 (`const isFallback = post.locale !== locale`):
```ts
const commentCount = await getCommentCount(slug, locale)
```

- [ ] **Add interactionStatistic to BlogPosting JSON-LD**

After line 185 (`dateModified: post.updatedAt ?? post.publishedAt,`):
```ts
interactionStatistic: [
  {
    "@type": "InteractionCounter",
    interactionType: "https://schema.org/CommentAction",
    userInteractionCount: commentCount,
  },
] as InteractionCounter[],
```

- [ ] **Add Comments component after ShareButtons**

After line 459 (`</ShareButtons>`):
```tsx
<Comments postSlug={slug} locale={locale} />
```

- [ ] **Commit**

```bash
git add app/[locale]/blog/[slug]/page.tsx
git commit -m "feat: add comment section and interactionStatistic to blog post page"
```

### Task 9: Moderation dashboard

**Create:** `app/[locale]/admin/comments/page.tsx`

- [ ] **Write moderation dashboard**

```tsx
import type { JSX } from "react/jsx-runtime"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { getAllComments, getPendingCommentsCount } from "@/lib/comment-db"
import { CommentModerationClient } from "./comment-moderation-client"

export default async function AdminCommentsPage(): Promise<JSX.Element> {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Unauthorized</h1>
        <p className="mt-2 text-muted-foreground">
          You must be logged in to access the moderation dashboard.
        </p>
      </div>
    )
  }

  const [comments, pendingCount] = await Promise.all([
    getAllComments(),
    getPendingCommentsCount(),
  ])

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-2xl font-bold">
        Comment Moderation
        {pendingCount > 0 && (
          <span className="ml-2 inline-flex items-center rounded-full bg-destructive/10 px-2.5 py-0.5 text-sm font-medium text-destructive">
            {pendingCount} pending
          </span>
        )}
      </h1>
      <div className="mt-8 space-y-4">
        {comments.length === 0 && (
          <p className="text-sm text-muted-foreground">No comments yet.</p>
        )}
        <CommentModerationClient comments={comments} />
      </div>
    </div>
  )
}
```

- [ ] **Write moderation client component**

Create `app/[locale]/admin/comments/comment-moderation-client.tsx`:

```tsx
"use client"

import type { JSX } from "react/jsx-runtime"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import type { CommentRow } from "@/lib/comment-db"

interface Props {
  comments: CommentRow[]
}

export function CommentModerationClient({
  comments: initialComments,
}: Props): JSX.Element {
  const [comments, setComments] = useState(initialComments)

  const handleApprove = async (id: number): Promise<void> => {
    await fetch(`/api/comments/${String(id)}`, { method: "PATCH" })
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, is_approved: true } : c))
    )
  }

  const handleDelete = async (id: number): Promise<void> => {
    await fetch(`/api/comments/${String(id)}`, { method: "DELETE" })
    setComments((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <>
      {comments.map((comment) => {
        return (
          <div
            key={comment.id}
            className={`rounded-lg border p-4 ${
              comment.is_approved
                ? "border-border bg-card"
                : "border-destructive/30 bg-destructive/5"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="font-medium">{comment.author_name}</span>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-muted-foreground">
                    {comment.author_email}
                  </span>
                  {!comment.is_approved && (
                    <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs text-destructive">
                      Pending
                    </span>
                  )}
                </div>
                <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span>
                    {comment.locale} / {comment.post_slug}
                  </span>
                  <span>·</span>
                  <time dateTime={comment.created_at}>
                    {new Date(comment.created_at).toLocaleDateString()}
                  </time>
                </div>
                <p className="mt-2 text-sm">{comment.content}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                {!comment.is_approved && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => {
                      handleApprove(comment.id).catch(() => undefined)
                    }}
                  >
                    Approve
                  </Button>
                )}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    handleDelete(comment.id).catch(() => undefined)
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )
      })}
    </>
  )
}
```

- [ ] **Commit**

```bash
git add app/[locale]/admin/comments
git commit -m "feat: add comment moderation dashboard"
```

### Task 10: Verify and build

- [ ] **Run TypeScript check**

```bash
npx tsc --noEmit
```
Expected: No type errors.

- [ ] **Run lint**

```bash
npx next lint
```
Expected: No lint errors.

- [ ] **Commit any fixes**

```bash
git add -A
git commit -m "chore: fix type/lint issues after comment section implementation"
```

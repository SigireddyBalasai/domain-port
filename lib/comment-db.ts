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

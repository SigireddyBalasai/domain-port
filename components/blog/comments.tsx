import type { JSX } from "react/jsx-runtime"
import { getCommentCount, getComments } from "@/lib/comment-db"
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
    <section className="border-border mt-16 border-t pt-10" id="comments">
      <h2 className="text-2xl font-bold">Comments ({count})</h2>
      {comments.length > 0 && (
        <div className="mt-8 space-y-6">
          {comments.map((comment) => {
            return (
              <div
                key={comment.id}
                className="h-entry border-border bg-card rounded-lg border p-5"
              >
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <span className="p-author text-foreground font-medium">
                    {comment.author_name}
                  </span>
                  <span aria-hidden="true">·</span>
                  <time className="dt-published" dateTime={comment.created_at}>
                    {new Date(comment.created_at).toLocaleDateString(
                      undefined,
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }
                    )}
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

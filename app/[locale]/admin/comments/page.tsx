import { headers } from "next/headers"
import type { JSX } from "react/jsx-runtime"
import { auth } from "@/lib/auth"
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

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import type { JSX } from "react/jsx-runtime"
import { auth } from "@/lib/auth"
import { getAllComments, getPendingCommentsCount } from "@/lib/comment-db"
import { CommentModerationClient } from "./comment-moderation-client"

export default async function AdminCommentsPage(): Promise<JSX.Element> {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect("/login")
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
          <span className="bg-destructive/10 text-destructive ml-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-sm font-medium">
            {pendingCount} pending
          </span>
        )}
      </h1>
      <div className="mt-8 space-y-4">
        {comments.length === 0 && (
          <p className="text-muted-foreground text-sm">No comments yet.</p>
        )}
        <CommentModerationClient comments={comments} />
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import type { JSX } from "react/jsx-runtime"
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

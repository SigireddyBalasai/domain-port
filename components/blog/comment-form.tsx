"use client"

import { type JSX, useState } from "react"
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
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>): void => {
    e.preventDefault()
    setStatus("loading")
    setErrorMessage("")

    const form = e.currentTarget
    const website = (
      form.elements.namedItem("website") as HTMLInputElement | null
    )?.value

    const submit = async (): Promise<void> => {
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
          const data = (await res.json()) as { error?: string }

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

    submit().catch(() => undefined)
  }

  if (status === "success") {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-center text-sm text-muted-foreground">
        Comment submitted for moderation. It will appear once approved.
      </div>
    )
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div aria-hidden="true" className="absolute -top-[9999px] -left-[9999px]">
        <label htmlFor="website">Website</label>
        <input
          readOnly
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="author-name" className="text-sm font-medium">
            Name <span className="text-destructive">*</span>
          </label>
          <Input
            required
            id="author-name"
            type="text"
            minLength={2}
            placeholder="Your name"
            value={authorName}
            onChange={(e) => {
              setAuthorName(e.target.value)
            }}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="author-email" className="text-sm font-medium">
            Email <span className="text-destructive">*</span>
          </label>
          <Input
            required
            id="author-email"
            type="email"
            placeholder="your@email.com"
            value={authorEmail}
            onChange={(e) => {
              setAuthorEmail(e.target.value)
            }}
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <label htmlFor="comment-content" className="text-sm font-medium">
          Comment <span className="text-destructive">*</span>
        </label>
        <textarea
          required
          id="comment-content"
          minLength={10}
          rows={5}
          placeholder="Share your thoughts..."
          className="w-full min-w-0 rounded-3xl border border-transparent bg-input/50 px-3 py-2 text-base transition-[color,box-shadow,background-color] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 md:text-sm"
          value={content}
          onChange={(e) => {
            setContent(e.target.value)
          }}
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

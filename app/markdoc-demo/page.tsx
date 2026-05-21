"use client"

import { type JSX, useEffect, useState } from "react"
import type { RenderableTreeNode } from "@markdoc/markdoc"

export default function MarkdocDemo(): JSX.Element {
  const [data, setData] = useState<{
    transformed?: RenderableTreeNode
    error?: boolean
  } | null>(null)

  useEffect(() => {
    fetch("/api/markdoc")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {
        setData({ error: true })
      })
  }, [])

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="mb-4 text-2xl font-bold">Markdoc Demo</h1>
      <p className="mb-4">
        Shows Markdoc transform output (JSON) from server-side parse/transform.
      </p>
      <pre className="rounded bg-neutral-800 p-4 text-sm whitespace-pre-wrap">
        {data ? JSON.stringify(data, null, 2) : "Loading..."}
      </pre>
    </main>
  )
}

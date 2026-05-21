"use client"

import { type JSX, useEffect , useState } from "react";

export default function MarkdocDemo() : JSX.Element {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    fetch("/api/markdoc")
      .then((r) => r.json())
      .then(setData)
      .catch(() => { setData({ error: true }); })
  }, [])

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-bold mb-4">Markdoc Demo</h1>
      <p className="mb-4">Shows Markdoc transform output (JSON) from server-side parse/transform.</p>
      <pre className="whitespace-pre-wrap bg-neutral-800 text-sm p-4 rounded">
        {data ? JSON.stringify(data, null, 2) : "Loading..."}
      </pre>
    </main>
  )
}

import type { NextRequest } from "next/server"

const indexnowKey = process.env.INDEXNOW_KEY?.trim()

export async function GET(request: NextRequest): Promise<Response> {
  if (!indexnowKey) {
    return new Response("Not found", { status: 404 })
  }

  const key = new URL(request.url).pathname.slice(1, -4)

  if (key !== indexnowKey) {
    return new Response("Not found", { status: 404 })
  }

  return new Response(indexnowKey, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  })
}

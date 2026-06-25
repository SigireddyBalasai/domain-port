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

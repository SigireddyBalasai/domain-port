import { ImageResponse } from "next/og"
import { posts } from "@/.velite"

export const runtime = "nodejs"

interface InlineInterface {
  params: Promise<{ slug: string }>
}
export async function GET(
  _request: Request,
  { params }: InlineInterface
): Promise<ImageResponse | Response> {
  const { slug } = await params
  const post = posts.find((p) => p.slug === slug && p.locale === "en")

  if (!post) {
    return new Response("Not found", { status: 404 })
  }

  const tagColor =
    post.postType === "review"
      ? "#f59e0b"
      : post.postType === "howto"
        ? "#3b82f6"
        : post.postType === "listing"
          ? "#10b981"
          : "#6366f1"

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        padding: "60px 80px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "24px",
        }}
      >
        <span
          style={{
            fontSize: "24px",
            fontWeight: 700,
            color: "#94a3b8",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          cctv.name
        </span>
        <span
          style={{
            fontSize: "16px",
            fontWeight: 600,
            color: "#fff",
            background: tagColor,
            padding: "4px 16px",
            borderRadius: "999px",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {post.postType ?? "Blog"}
        </span>
      </div>
      <h1
        style={{
          fontSize: "48px",
          fontWeight: 800,
          color: "#f8fafc",
          lineHeight: 1.2,
          margin: 0,
          maxWidth: "800px",
        }}
      >
        {post.title.length > 80 ? `${post.title.slice(0, 77)}...` : post.title}
      </h1>
      <p
        style={{
          fontSize: "20px",
          color: "#94a3b8",
          marginTop: "24px",
          maxWidth: "700px",
        }}
      >
        {post.description
          ? post.description.length > 120
            ? `${post.description.slice(0, 117)}...`
            : post.description
          : ""}
      </p>
    </div>,
    {
      width: 1200,
      height: 630,
    }
  )
}

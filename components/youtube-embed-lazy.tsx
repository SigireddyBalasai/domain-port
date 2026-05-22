"use client"

import dynamic from "next/dynamic"

export const YouTubeEmbedLazy = dynamic(
  () => import("./youtube-embed").then((mod) => mod.YouTubeEmbed),
  { ssr: false }
)

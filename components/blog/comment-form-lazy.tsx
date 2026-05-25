"use client"

import dynamic from "next/dynamic"

export const CommentFormLazy = dynamic(
  () => import("./comment-form").then((mod) => mod.CommentForm),
  { ssr: false }
)

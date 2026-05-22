"use client"

import dynamic from "next/dynamic"

export const BlogTableLazy = dynamic(
  () => import("../blog-table").then((mod) => mod.BlogTable),
  { ssr: false }
)

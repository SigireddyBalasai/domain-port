"use client"

import dynamic from "next/dynamic"

export const ShareButtonsLazy = dynamic(
  () => import("./share-buttons").then((mod) => mod.ShareButtons),
  { ssr: false }
)

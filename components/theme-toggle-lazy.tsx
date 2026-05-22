"use client"

import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"

export const ThemeToggleLazy = dynamic(() => import("./theme-toggle"), {
  ssr: false,
  loading: () => <Skeleton className="size-6 rounded-md" />,
})

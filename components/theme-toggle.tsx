"use client"

import { useTheme } from "next-themes"
import * as React from "react"
import type { JSX } from "react/jsx-runtime"

export default function ThemeToggle(): JSX.Element {
  const { resolvedTheme, setTheme } = useTheme()

  const toggle = React.useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }, [resolvedTheme, setTheme])

  return (
    <button
      aria-label="Toggle theme"
      title="Toggle theme"
      aria-pressed={resolvedTheme === "dark"}
      className="rounded-md px-2 py-1 text-sm hover:bg-accent"
      onClick={toggle}
    >
      <span className="sr-only">Toggle theme</span>
      <span aria-hidden>{resolvedTheme === "dark" ? "🌙" : "☀️"}</span>
    </button>
  )
}

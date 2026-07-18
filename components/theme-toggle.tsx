"use client"

import { useTheme } from "@wrksz/themes/client/use-theme"
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
      className="hover:bg-accent flex size-6 items-center justify-center rounded-md text-sm"
      onClick={toggle}
    >
      <span className="sr-only">Toggle theme</span>
      <span aria-hidden={true}>{resolvedTheme === "dark" ? "🌙" : "☀️"}</span>
    </button>
  )
}

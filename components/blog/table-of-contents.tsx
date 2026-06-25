"use client"

import { useEffect, useState } from "react"
import type { JSX } from "react/jsx-runtime"

interface TocItem {
  id: string
  text: string
  level: number
}

export default function TableOfContents(): JSX.Element | null {
  const [items, setItems] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    const article = document.querySelector(".blog-content")
    if (!article) return

    const allHeadings = Array.from(article.querySelectorAll("h2, h3"))
    const tocItems: TocItem[] = []
    const headingElements: Element[] = []

    allHeadings.forEach((h) => {
      if (!h.id) return
      tocItems.push({
        id: h.id,
        text: h.textContent?.trim() ?? "",
        level: h.tagName === "H2" ? 2 : 3,
      })
      headingElements.push(h)
    })

    setItems(tocItems)

    if (tocItems.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.target.id) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: "-80px 0px -80% 0px" }
    )

    headingElements.forEach((h) => observer.observe(h))

    return () => observer.disconnect()
  }, [])

  if (items.length < 2) return null

  return (
    <nav aria-label="Table of contents" className="mb-10">
      <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase mb-3">
        On this page
      </h2>
      <ul className="space-y-2 text-sm">
        {items.map((item) => (
          <li
            key={item.id}
            className={item.level === 3 ? "pl-4" : ""}
          >
            <a
              href={`#${item.id}`}
              className={`block transition-colors hover:text-primary ${
                activeId === item.id
                  ? "text-primary font-medium"
                  : "text-muted-foreground"
              }`}
              onClick={(e) => {
                e.preventDefault()
                const el = document.getElementById(item.id)
                if (!el) return
                el.scrollIntoView({ behavior: "smooth" })
                el.setAttribute("tabindex", "-1")
                el.focus({ preventScroll: true })
              }}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

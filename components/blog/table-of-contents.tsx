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

    if (!article) {
      return
    }

    const allHeadings = [...article.querySelectorAll("h2, h3")]
    const tocItems: TocItem[] = []
    const headingElements: Element[] = []

    for (const h of allHeadings) {
      if (!h.id) {
        continue
      }

      tocItems.push({
        id: h.id,
        text: (h.textContent || "").trim(),
        level: h.tagName === "H2" ? 2 : 3,
      })
      headingElements.push(h)
    }

    // eslint-disable-next-line react-you-might-not-need-an-effect/no-initialize-state
    setItems(tocItems)

    if (tocItems.length < 2) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: "-80px 0px -80% 0px" }
    )

    headingElements.forEach((h) => {
      observer.observe(h)
    })

    return () => {
      observer.disconnect()
    }
  }, [])

  if (items.length < 2) {
    return null
  }

  return (
    <nav aria-label="Table of contents" className="mb-10">
      <h2 className="mb-3 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
        On this page
      </h2>
      <ul className="space-y-2 text-sm">
        {items.map((item) => {
          return (
            <li key={item.id} className={item.level === 3 ? "pl-4" : ""}>
              <a
                href={`#${item.id}`}
                className={`block transition-colors hover:text-primary ${
                  activeId === item.id
                    ? "font-medium text-primary"
                    : "text-muted-foreground"
                }`}
                onClick={(e) => {
                  e.preventDefault()

                  const el = document.querySelector(`#${CSS.escape(item.id)}`)

                  if (!el) {
                    return
                  }

                  el.scrollIntoView({ behavior: "smooth" })
                  el.setAttribute("tabindex", "-1")
                  ;(el as HTMLElement).focus({ preventScroll: true })
                }}
              >
                {item.text}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

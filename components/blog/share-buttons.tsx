"use client"

import type { JSX } from "react/jsx-runtime"
import { siteConfig } from "@/lib/site-config"
import { cn } from "@/lib/utils"

interface ShareButtonsProps {
  title: string
  slug: string
}

export const ShareButtons = ({
  title,
  slug,
}: ShareButtonsProps): JSX.Element => {
  const url = `${siteConfig.url}/blog/${slug}`
  const text = `${title} — ${siteConfig.name}`

  const shareLinks = [
    {
      name: "X",
      href: `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      label: "Share on X",
    },
    {
      name: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      label: "Share on LinkedIn",
    },
  ]

  const handleCopyLink = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(url)
    } catch (error) {
      console.error("Failed to copy: ", error)
    }
  }

  return (
    <div className="flex items-center gap-2 pt-6">
      <span className="text-sm text-muted-foreground">Share:</span>
      {shareLinks.map((link) => {
        return (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            className={cn(
              "inline-flex h-8 w-8 items-center justify-center rounded-md border text-xs transition-colors",
              "hover:bg-secondary hover:text-foreground"
            )}
          >
            {link.name}
          </a>
        )
      })}
      <button
        type="button"
        aria-label="Copy link"
        title="Copy link"
        className={cn(
          "inline-flex h-8 w-8 items-center justify-center rounded-md border text-xs transition-colors",
          "hover:bg-secondary hover:text-foreground"
        )}
        onClick={() => {
          handleCopyLink().catch(() => undefined)
        }}
      >
        ⎘
      </button>
    </div>
  )
}

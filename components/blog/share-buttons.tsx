"use client"

import type { JSX } from "react/jsx-runtime"
import { RiLinkedinFill, RiLinksLine, RiTwitterXFill } from "@remixicon/react"
import { Button } from "@/components/ui/button"
import { siteConfig } from "@/lib/site-config"

interface ShareButtonsProps {
  title: string
  slug: string
}

export function ShareButtons({ title, slug }: ShareButtonsProps): JSX.Element {
  const url = `${siteConfig.url}/blog/${slug}`
  const text = `${title} — ${siteConfig.name}`

  const shareLinks = [
    {
      name: "X",
      href: `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      label: "Share on X",
      icon: RiTwitterXFill,
    },
    {
      name: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      label: "Share on LinkedIn",
      icon: RiLinkedinFill,
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
          <Button
            key={link.name}
            variant="outline"
            size="icon-sm"
            aria-label={link.label}
            onClick={() =>
              window.open(link.href, "_blank", "noopener,noreferrer")
            }
          >
            <link.icon size={16} />
          </Button>
        )
      })}
      <Button
        variant="outline"
        size="icon-sm"
        aria-label="Copy link"
        title="Copy link"
        onClick={() => {
          handleCopyLink().catch(() => undefined)
        }}
      >
        <RiLinksLine size={16} />
      </Button>
    </div>
  )
}

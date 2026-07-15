"use client"

import type { JSX } from "react/jsx-runtime"
import {
  RiBlueskyFill,
  RiFacebookFill,
  RiLinkedinFill,
  RiLinksLine,
  RiMailFill,
  RiRedditFill,
  RiTelegramFill,
  RiTwitterXFill,
  RiWhatsappFill,
} from "@remixicon/react"
import { Button } from "@/components/ui/button"
import { siteConfig } from "@/lib/site-config"

interface ShareButtonsProps {
  title: string
  slug: string
  locale?: string
}

export function ShareButtons({
  title,
  slug,
  locale = "",
}: ShareButtonsProps): JSX.Element {
  const localePath = locale ? `/${locale}` : ""
  const url = `${siteConfig.url}${localePath}/blog/${slug}`
  const text = `${title} — ${siteConfig.name}`
  const encodedUrl = encodeURIComponent(url)
  const encodedText = encodeURIComponent(text)

  const shareLinks = [
    {
      name: "X",
      href: `https://x.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      label: "Share on X",
      icon: RiTwitterXFill,
    },
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      label: "Share on Facebook",
      icon: RiFacebookFill,
    },
    {
      name: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      label: "Share on LinkedIn",
      icon: RiLinkedinFill,
    },
    {
      name: "WhatsApp",
      href: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      label: "Share on WhatsApp",
      icon: RiWhatsappFill,
    },
    {
      name: "Telegram",
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
      label: "Share on Telegram",
      icon: RiTelegramFill,
    },
    {
      name: "Reddit",
      href: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedText}`,
      label: "Share on Reddit",
      icon: RiRedditFill,
    },
    {
      name: "Bluesky",
      href: `https://bsky.app/intent/compose?text=${encodedText}%20${encodedUrl}`,
      label: "Share on Bluesky",
      icon: RiBlueskyFill,
    },
    {
      name: "Email",
      href: `mailto:?subject=${encodedText}&body=${encodedUrl}`,
      label: "Share via Email",
      icon: RiMailFill,
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
    <div className="flex flex-wrap items-center gap-2 pt-6">
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

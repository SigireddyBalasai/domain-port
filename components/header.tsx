"use client"

import Link from "next/link"
import type { JSX } from "react"
import { RiArrowRightLine } from "@remixicon/react"
import { siteConfig } from "@/lib/site-config"

export default function Header(): JSX.Element {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <RiArrowRightLine size={18} className="text-primary" />
            <span className="font-bold">{siteConfig.name}</span>
          </Link>
          <nav className="flex items-center space-x-6">
            <Link
              href="/blog"
              className="text-sm font-medium hover:text-primary"
            >
              Blog
            </Link>
            {siteConfig.links.twitter && (
              <a
                href={siteConfig.links.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium hover:text-primary"
              >
                Twitter
              </a>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

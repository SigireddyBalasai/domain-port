"use client"

import { useContext } from "react"
import { localePrefixContext } from "./mdx-link-context"

const isInternalPath = (href: string): boolean => {
  return href.startsWith("/") && !href.startsWith("//")
}

const localizeHref = (href: string, localePrefix: string): string => {
  if (!localePrefix || !isInternalPath(href)) {
    return href
  }

  const isAlreadyPrefixed =
    href === localePrefix || href.startsWith(`${localePrefix}/`)

  return isAlreadyPrefixed ? href : `${localePrefix}${href}`
}

export function MdxLink({
  href,
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>): React.ReactNode {
  const localePrefix = useContext(localePrefixContext)
  const resolvedHref =
    typeof href === "string" ? localizeHref(href, localePrefix) : href

  return (
    <a href={resolvedHref} {...props}>
      {children}
    </a>
  )
}

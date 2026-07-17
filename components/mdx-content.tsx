"use client"

import Image from "next/image"
import { createElement, useMemo } from "react"
import * as runtime from "react/jsx-runtime"
import { BlogTableLazy } from "./blog/blog-table-lazy"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Callout,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Kbd,
  KbdGroup,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./mdx-components"
import { MdxLink } from "./mdx-link"
import { localePrefixContext } from "./mdx-link-context"
import { YouTubeEmbedLazy } from "./youtube-embed-lazy"

const BlogTable = BlogTableLazy

const YouTubeEmbed = YouTubeEmbedLazy

const sharedComponents: Record<string, React.ComponentType<any>> = {
  h1: (props) => createElement("h2", props),
  h2: (props) => createElement("h3", props),
  h3: (props) => createElement("h4", props),
  h4: (props) => createElement("h5", props),
  h5: (props) => createElement("h6", props),
  h6: (props) => createElement("h6", props),
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    const { src, alt } = props

    if (!src || typeof src !== "string") {
      return null
    }
    if (src.endsWith(".svg") || src.startsWith("http")) {
      return (
        <Image
          unoptimized={true}
          src={src}
          alt={alt ?? ""}
          width={0}
          height={0}
          className="h-auto w-full"
        />
      )
    }

    return (
      <div className="relative my-6 w-full" style={{ aspectRatio: "16/9" }}>
        <Image
          fill={true}
          src={src}
          alt={alt ?? ""}
          className="rounded-lg object-cover"
          sizes="(max-width: 768px) 100vw, 672px"
        />
      </div>
    )
  },
  YouTubeEmbed,
  table: BlogTable,
  Alert,
  AlertTitle,
  AlertDescription,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Kbd,
  KbdGroup,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Callout,
}

interface MdxProps {
  code: string
  components?: Record<string, React.ComponentType<any>>
  localePrefix?: string
}

const createMdxComponent = (
  code: string
): React.ComponentType<{
  components?: Record<string, React.ComponentType<any>>
}> => {
  const Fn = globalThis.Function as unknown as new (code: string) => (
    ...args: unknown[]
  ) => {
    default: React.ComponentType<any>
  }
  const fn = new Fn(code)

  return fn({ ...runtime }).default
}

export function MdxContent({
  code,
  components,
  localePrefix = "",
}: MdxProps): React.ReactNode {
  const Component = useMemo(() => createMdxComponent(code), [code])
  const LocalePrefixProvider = localePrefixContext.Provider

  return (
    <LocalePrefixProvider value={localePrefix}>
      <Component
        components={{ ...sharedComponents, a: MdxLink, ...components }}
      />
    </LocalePrefixProvider>
  )
}

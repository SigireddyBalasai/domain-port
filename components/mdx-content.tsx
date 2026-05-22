import dynamic from "next/dynamic"
import { createElement, useMemo } from "react"
import * as runtime from "react/jsx-runtime"
import { BlogTable } from "./blog-table"
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

const YouTubeEmbed = dynamic(
  () => import("./youtube-embed").then((mod) => mod.YouTubeEmbed),
  { ssr: false }
)

const sharedComponents: Record<string, React.ComponentType<any>> = {
  h1: (props) => createElement("h2", props),
  h2: (props) => createElement("h3", props),
  h3: (props) => createElement("h4", props),
  h4: (props) => createElement("h5", props),
  h5: (props) => createElement("h6", props),
  h6: (props) => createElement("h6", props),
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

export function MdxContent({ code, components }: MdxProps): React.ReactNode {
  const Component = useMemo(() => createMdxComponent(code), [code])

  return <Component components={{ ...sharedComponents, ...components }} />
}

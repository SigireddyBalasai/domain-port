import { useMemo } from "react"
import * as runtime from "react/jsx-runtime"
import { BlogTable } from "./blog-table"
import { YouTubeEmbed } from "./youtube-embed"

const sharedComponents: Record<string, React.ComponentType<any>> = {
  YouTubeEmbed,
  table: BlogTable,
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

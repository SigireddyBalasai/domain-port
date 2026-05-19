import { useMemo } from "react"
import * as runtime from "react/jsx-runtime"

const sharedComponents: Record<string, React.ComponentType> = {}

interface MdxProps {
  code: string
  components?: Record<string, React.ComponentType>
}

const createMdxComponent = (
  code: string
): React.ComponentType<{
  components?: Record<string, React.ComponentType>
}> => {
  const Fn = globalThis.Function as unknown as new (
    code: string
  ) => (...args: unknown[]) => { default: React.ComponentType }
  const fn = new Fn(code)

  return fn({ ...runtime }).default
}

export const MdxContent = ({ code, components }: MdxProps): React.ReactNode => {
  const Component = useMemo(() => createMdxComponent(code), [code])

  return <Component components={{ ...sharedComponents, ...components }} />
}

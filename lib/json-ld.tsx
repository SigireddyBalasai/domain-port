import type { JSX } from "react/jsx-runtime"
import type { Thing, WithContext } from "schema-dts"

interface JsonLdProps<T extends Thing> {
  schema: WithContext<T>
}

export const JsonLd = <T extends Thing>({
  schema,
}: JsonLdProps<T>): JSX.Element => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  )
}

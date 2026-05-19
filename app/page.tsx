import type { Metadata } from "next"
import type { JSX } from "react/jsx-runtime"
import type { Blog, Organization } from "schema-dts"
import { Button } from "@/components/ui/button"
import { JsonLd } from "@/lib/json-ld"
import { siteConfig } from "@/lib/site-config"

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  openGraph: {
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
  },
}

export default function Page(): JSX.Element {
  return (
    <>
      <JsonLd<Organization>
        schema={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: siteConfig.name,
          url: siteConfig.url,
          description: siteConfig.description,
        }}
      />
      <JsonLd<Blog>
        schema={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: siteConfig.name,
          description: siteConfig.description,
          url: siteConfig.url,
        }}
      />
      <div className="flex min-h-svh p-6">
        <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
          <div>
            <h1 className="font-medium">Project ready!</h1>
            <p>You may now add components and start building.</p>
            <p>We&apos;ve already added the button component for you.</p>
            <Button className="mt-2">Button</Button>
          </div>
          <div className="font-mono text-xs text-muted-foreground">
            (Press <kbd>d</kbd> to toggle dark mode)
          </div>
        </div>
      </div>
    </>
  )
}

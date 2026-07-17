import Link from "next/link"
import type { JSX } from "react"
import { fontVariables } from "@/lib/fonts"
import { defaultLocale } from "@/lib/locales"

export default function RootNotFound(): JSX.Element {
  return (
    <html lang="en" className={fontVariables}>
      <body>
        <div className="bg-background flex min-h-screen flex-col items-center justify-center">
          <div className="mx-auto max-w-md px-4 text-center sm:px-6">
            <p className="font-display text-primary text-8xl font-bold">404</p>
            <h1 className="font-display mt-4 text-2xl font-bold">
              Page Not Found
            </h1>
            <p className="text-muted-foreground mt-2">
              Sorry, the page you are looking for does not exist or has been
              moved.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link
                href={`/${defaultLocale}`}
                className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center rounded-lg px-5 py-2.5 text-sm font-medium"
              >
                Go Home
              </Link>
              <Link
                href={`/${defaultLocale}/blog`}
                className="border-border bg-background hover:bg-accent inline-flex items-center rounded-lg border px-5 py-2.5 text-sm font-medium"
              >
                Browse Blog
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}

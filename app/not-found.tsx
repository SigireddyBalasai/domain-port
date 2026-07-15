import Link from "next/link"
import type { JSX } from "react"
import { fontVariables } from "@/lib/fonts"
import { defaultLocale } from "@/lib/locales"

export default function RootNotFound(): JSX.Element {
  return (
    <html lang="en" className={fontVariables}>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center bg-background">
          <div className="mx-auto max-w-md px-4 text-center sm:px-6">
            <p className="font-display text-8xl font-bold text-primary">404</p>
            <h1 className="font-display mt-4 text-2xl font-bold">
              Page Not Found
            </h1>
            <p className="mt-2 text-muted-foreground">
              Sorry, the page you are looking for does not exist or has been
              moved.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link
                href={`/${defaultLocale}`}
                className="inline-flex items-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Go Home
              </Link>
              <Link
                href={`/${defaultLocale}/blog`}
                className="inline-flex items-center rounded-lg border border-border bg-background px-5 py-2.5 text-sm font-medium hover:bg-accent"
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

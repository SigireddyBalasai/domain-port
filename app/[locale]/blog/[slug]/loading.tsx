import type { JSX } from "react/jsx-runtime"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading(): JSX.Element {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border/40">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-48" />
        </div>
      </header>
      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <Skeleton className="mb-8 h-4 w-24" />
          <Skeleton className="mb-2 h-4 w-40" />
          <Skeleton className="mt-2 h-10 w-full" />
          <div className="mt-3 flex items-center gap-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-1" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="mt-4 h-5 w-full" />
          <Skeleton className="mt-1 h-5 w-3/4" />
          <Skeleton className="mt-8 h-4 w-48" />
          <div className="mt-4 space-y-3">
            {Array.from({ length: 8 }).map((unused, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </article>
      </main>
      <footer className="border-t border-border/40">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </footer>
    </div>
  )
}

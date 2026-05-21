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
        <section className="border-b border-border/40 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center gap-6 text-center">
              <Skeleton className="h-12 w-96" />
              <Skeleton className="h-6 w-[500px]" />
              <Skeleton className="h-12 w-32 rounded-lg" />
            </div>
          </div>
        </section>
        <section className="border-b border-border/40 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Skeleton className="mb-12 h-8 w-48" />
            <div className="space-y-6">
              {Array.from({ length: 2 }).map((unused, i) => {
                return (
                  <div key={i} className="rounded-lg border p-6">
                    <Skeleton className="mb-2 h-4 w-32" />
                    <Skeleton className="mb-2 h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                )
              })}
            </div>
          </div>
        </section>
        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="mt-12 space-y-6">
              {Array.from({ length: 3 }).map((unused, i) => {
                return (
                  <div key={i} className="rounded-lg border p-6">
                    <Skeleton className="mb-2 h-4 w-32" />
                    <Skeleton className="mb-2 h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                )
              })}
            </div>
          </div>
        </section>
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

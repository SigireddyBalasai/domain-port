"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { type JSX, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { getLanguageByCode, languages } from "@/lib/languages"

interface LanguageSwitcherProps {
  currentLocale: string
  locales: string[]
}

export default function LanguageSwitcher({
  currentLocale,
  locales,
}: LanguageSwitcherProps): JSX.Element {
  const pathname = usePathname() || "/"
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const pathWithoutLocale = pathname.replace(`/${currentLocale}`, "") || "/"
  const normalizedPath =
    pathWithoutLocale === "/" ? "" : pathWithoutLocale.replace(/\/$/, "")

  const currentLanguage = getLanguageByCode(currentLocale)

  const filteredLanguages = languages.filter((lang) => {
    return (
      locales.includes(lang.code) &&
      (lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lang.code.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  })

  const groupedLanguages = {
    "un-official": filteredLanguages.filter(
      (l) => l.category === "un-official"
    ),
    "major-world": filteredLanguages.filter(
      (l) => l.category === "major-world"
    ),
    regional: filteredLanguages.filter((l) => l.category === "regional"),
  }

  const categoryLabels = {
    "un-official": "UN Official",
    "major-world": "Major World",
    regional: "Regional",
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        onClick={() => {
          setIsOpen(!isOpen)
        }}
      >
        <span>
          {currentLanguage?.nativeName || currentLocale.toUpperCase()}
        </span>
        <svg
          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </Button>

      {isOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-10 cursor-default bg-transparent"
            aria-label="Close language selector"
            onClick={() => {
              setIsOpen(false)
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setIsOpen(false)
              }
            }}
          />
          <Card className="absolute top-full right-0 z-20 mt-2 w-72 p-2 shadow-lg">
            <Input
              type="text"
              placeholder="Search languages..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
              }}
            />
            <div className="max-h-80 overflow-y-auto">
              {Object.entries(groupedLanguages).map(([category, langs]) => {
                return (
                  langs.length > 0 && (
                    <div key={category} className="mb-3">
                      <Badge variant="secondary" className="mb-1 ml-2 text-xs">
                        {
                          categoryLabels[
                            category as keyof typeof categoryLabels
                          ]
                        }
                      </Badge>
                      {langs.map((lang) => {
                        const href = `/${lang.code}${normalizedPath}`

                        return (
                          <Link
                            key={lang.code}
                            href={href}
                            role="option"
                            aria-selected={currentLocale === lang.code}
                            className={`flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-accent ${
                              currentLocale === lang.code
                                ? "bg-accent font-medium"
                                : ""
                            }`}
                            onClick={() => {
                              setIsOpen(false)
                            }}
                          >
                            <span>{lang.nativeName}</span>
                            <span className="text-xs text-muted-foreground">
                              {lang.name}
                            </span>
                          </Link>
                        )
                      })}
                    </div>
                  )
                )
              })}
              {filteredLanguages.length === 0 && (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  No languages found
                </div>
              )}
            </div>
          </Card>
        </>
      )}
    </div>
  )
}

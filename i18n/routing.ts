import { defineRouting } from "next-intl/routing"

export const locales = [
  "en", "es", "fr", "de", "hi", "ar", "zh", "ru", "pt",
  "ja", "ko", "it", "nl", "pl", "tr", "bn", "ur", "id",
  "vi", "th", "uk",
] as const

export const defaultLocale = "en"

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
})

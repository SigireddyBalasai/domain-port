import { readdirSync } from "node:fs"
import { join } from "node:path"

const messagesDir = join(process.cwd(), "messages")

export const locales = readdirSync(messagesDir)
  .filter((f) => f.endsWith(".json"))
  .map((f) => f.replace(/\.json$/, ""))
  .toSorted()

export const defaultLocale = "en"

export const localeLabels: Record<string, string> = {
  en: "EN",
  es: "ES",
  fr: "FR",
  de: "DE",
  hi: "HI",
  ar: "AR",
  zh: "ZH",
  ru: "RU",
  pt: "PT",
  ja: "JA",
  ko: "KO",
  it: "IT",
  nl: "NL",
  pl: "PL",
  tr: "TR",
  bn: "BN",
  ur: "UR",
  id: "ID",
  vi: "VI",
  th: "TH",
  uk: "UK",
}

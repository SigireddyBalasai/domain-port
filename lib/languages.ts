export interface Language {
  code: string
  name: string
  /** English name. */
  nativeName: string
  /** Native language name. */
  direction: "ltr" | "rtl"
  region?: string
  category: "un-official" | "major-world" | "regional"
}

export const languages: Language[] = [
  // Existing languages
  {
    code: "en",
    name: "English",
    nativeName: "English",
    direction: "ltr",
    category: "un-official",
  },
  {
    code: "es",
    name: "Spanish",
    nativeName: "Español",
    direction: "ltr",
    category: "un-official",
  },
  {
    code: "fr",
    name: "French",
    nativeName: "Français",
    direction: "ltr",
    category: "un-official",
  },
  {
    code: "de",
    name: "German",
    nativeName: "Deutsch",
    direction: "ltr",
    category: "major-world",
  },
  {
    code: "hi",
    name: "Hindi",
    nativeName: "हिन्दी",
    direction: "ltr",
    category: "major-world",
  },

  // Priority 1: UN Official Languages (Missing)
  {
    code: "ar",
    name: "Arabic",
    nativeName: "العربية",
    direction: "rtl",
    category: "un-official",
  },
  {
    code: "zh",
    name: "Chinese",
    nativeName: "中文",
    direction: "ltr",
    region: "Simplified",
    category: "un-official",
  },
  {
    code: "ru",
    name: "Russian",
    nativeName: "Русский",
    direction: "ltr",
    category: "un-official",
  },

  // Priority 2: Major World Languages
  {
    code: "pt",
    name: "Portuguese",
    nativeName: "Português",
    direction: "ltr",
    region: "Brazil",
    category: "major-world",
  },
  {
    code: "ja",
    name: "Japanese",
    nativeName: "日本語",
    direction: "ltr",
    category: "major-world",
  },
  {
    code: "ko",
    name: "Korean",
    nativeName: "한국어",
    direction: "ltr",
    category: "major-world",
  },
  {
    code: "it",
    name: "Italian",
    nativeName: "Italiano",
    direction: "ltr",
    category: "major-world",
  },
  {
    code: "nl",
    name: "Dutch",
    nativeName: "Nederlands",
    direction: "ltr",
    category: "major-world",
  },
  {
    code: "pl",
    name: "Polish",
    nativeName: "Polski",
    direction: "ltr",
    category: "major-world",
  },
  {
    code: "tr",
    name: "Turkish",
    nativeName: "Türkçe",
    direction: "ltr",
    category: "major-world",
  },

  // Priority 3: Regional Official Languages
  {
    code: "bn",
    name: "Bengali",
    nativeName: "বাংলা",
    direction: "ltr",
    category: "regional",
  },
  {
    code: "ur",
    name: "Urdu",
    nativeName: "اردو",
    direction: "rtl",
    category: "regional",
  },
  {
    code: "id",
    name: "Indonesian",
    nativeName: "Bahasa Indonesia",
    direction: "ltr",
    category: "regional",
  },
  {
    code: "vi",
    name: "Vietnamese",
    nativeName: "Tiếng Việt",
    direction: "ltr",
    category: "regional",
  },
  {
    code: "th",
    name: "Thai",
    nativeName: "ไทย",
    direction: "ltr",
    category: "regional",
  },
  {
    code: "uk",
    name: "Ukrainian",
    nativeName: "Українська",
    direction: "ltr",
    category: "regional",
  },
]

export const getLanguageByCode = (code: string): Language | undefined => {
  return languages.find((lang) => lang.code === code)
}

export const getLanguagesByCategory = (
  category: Language["category"]
): Language[] => {
  return languages.filter((lang) => lang.category === category)
}

export const getRtlLanguages = (): Language[] => {
  return languages.filter((lang) => lang.direction === "rtl")
}

export const isRtlLanguage = (code: string): boolean => {
  const lang = getLanguageByCode(code)

  return lang?.direction === "rtl"
}

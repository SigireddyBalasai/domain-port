export const siteConfig = {
  name: "CCTV Name",
  url: "https://cctv.name",
  ogImage: "https://cctv.name/og.svg",
  description:
    "Expert CCTV and surveillance solutions — reviews, installation guides, and security tips for your home and business.",
  keywords: [
    "CCTV",
    "surveillance",
    "security cameras",
    "home security",
    "business surveillance",
    "security systems",
    "video surveillance",
    "camera installation",
  ],
  links: {
    twitter: "https://twitter.com/cctvname",
    youtube: "https://youtube.com/@cctvname",
    github: "https://github.com/cctvname",
  },
  author: {
    name: "CCTV Name Team",
    twitter: "@cctvname",
  },
  localeMap: {
    en: "en_US",
    es: "es_ES",
    fr: "fr_FR",
  } as Record<string, string>,
  themeColor: {
    light: "#ffffff",
    dark: "#09090b",
  },
}

export type Locale = keyof typeof siteConfig.localeMap

import { Geist_Mono, Manrope, Playfair_Display } from "next/font/google"

const playfairDisplayHeading = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
})

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

export const fontVariables = `${fontMono.variable} ${manrope.variable} ${playfairDisplayHeading.variable} font-sans antialiased`

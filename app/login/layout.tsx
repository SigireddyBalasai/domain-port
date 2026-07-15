import type { ReactNode } from "react"
import { fontVariables } from "@/lib/fonts"

interface LoginLayoutProps {
  children: ReactNode
}

export default function LoginLayout({ children }: LoginLayoutProps): ReactNode {
  return (
    <html lang="en" className={fontVariables}>
      <body>{children}</body>
    </html>
  )
}

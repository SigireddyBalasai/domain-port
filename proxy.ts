import { type NextRequest, NextResponse } from "next/server"
import createMiddleware from "next-intl/middleware"
import { routing } from "./i18n/routing"

const intlMiddleware = createMiddleware(routing)

export const proxy = (
  request: NextRequest
): NextResponse | Promise<NextResponse> => {
  const host = request.headers.get("host") || ""

  if (host === "cctv.name") {
    const url = request.nextUrl.clone()

    url.host = "www.cctv.name"

    return NextResponse.redirect(url, 301)
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|login|.*\\..*).*)"],
}

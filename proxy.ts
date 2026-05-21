import createMiddleware from "next-intl/middleware"
import { type NextRequest, NextResponse } from "next/server"
import { routing } from "./i18n/routing"

const intlMiddleware = createMiddleware(routing)

export const proxy = (request: NextRequest): NextResponse | Promise<NextResponse> => {
  if (request.nextUrl.pathname.startsWith("/keystatic")) {
    const sessionToken = request.cookies.get("better-auth.session_token")

    if (!sessionToken) {
      const loginUrl = new URL("/login-keystatic", request.url)
      loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
}

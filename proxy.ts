import createMiddleware from "next-intl/middleware"
import { type NextRequest, NextResponse } from "next/server"
import { routing } from "./i18n/routing"

const intlMiddleware = createMiddleware(routing)

export const proxy = (request: NextRequest): NextResponse | Promise<NextResponse> => {
  // Keystatic is locale-unaware — handle auth before intl middleware
  if (request.nextUrl.pathname.startsWith("/keystatic")) {
    const sessionToken = request.cookies.get("better-auth.session_token")

    if (!sessionToken) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Authenticated: let keystatic render without locale prefix
    return NextResponse.next()
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
}

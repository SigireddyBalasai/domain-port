import createNextIntlPlugin from "next-intl/plugin"
import type { NextConfig } from "next"
import { withSerwist } from "@serwist/turbopack"

const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    webpackBuildWorker: true,
    optimizePackageImports: ["@remixicon/react", "@base-ui/react"],
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "cctv.name" }],
        destination: "https://www.cctv.name/:path*",
        permanent: true,
      },
    ]
  },
}

export default withSerwist(withNextIntl(nextConfig))

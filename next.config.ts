import createNextIntlPlugin from "next-intl/plugin"
import type { NextConfig } from "next"

const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
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

export default withNextIntl(nextConfig)

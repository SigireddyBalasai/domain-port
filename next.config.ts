import createNextIntlPlugin from "next-intl/plugin"
import type { NextConfig } from "next"

const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
  experimental: {
    webpackBuildWorker: true,
    optimizePackageImports: ["@remixicon/react", "@base-ui/react"],
  },
}

export default withNextIntl(nextConfig)

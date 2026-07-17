import { withSerwist } from "@serwist/turbopack"
import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    webpackBuildWorker: true,
    useTypeScriptCli: true,
    optimizePackageImports: ["@remixicon/react", "@base-ui/react"],
  },
  async redirects() {
    return [
      {
        source: "/markdoc-demo",
        destination: "/",
        permanent: true,
      },
      {
        source: "/:locale/markdoc-demo",
        destination: "/:locale",
        permanent: true,
      },
      // Listing posts are now served as blog posts at /blog/*. Redirect any
      // previously-indexed /listing/* URLs to the canonical /blog/* location.
      {
        source: "/listing/best-poe-cameras",
        destination: "/blog/best-poe-cameras",
        permanent: true,
      },
      {
        source: "/listing/best-cameras-under-200",
        destination: "/blog/best-cameras-under-200",
        permanent: true,
      },
      {
        source: "/:locale/listing/best-poe-cameras",
        destination: "/:locale/blog/best-poe-cameras",
        permanent: true,
      },
      {
        source: "/:locale/listing/best-cameras-under-200",
        destination: "/:locale/blog/best-cameras-under-200",
        permanent: true,
      },
    ]
  },
}

export default withSerwist(withNextIntl(nextConfig))

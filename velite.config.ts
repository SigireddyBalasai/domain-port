import type { PluggableList } from "unified"
import { defineCollection, defineConfig, s } from "velite"
import rehypeShiki from "@shikijs/rehype"

const posts = defineCollection({
  name: "Post",
  pattern: "posts/**/*.mdx",
  schema: s
    .object({
      title: s.string(),
      publishedAt: s.isodate(),
      description: s.string().max(999).optional(),
      tags: s.array(s.string()).optional(),
      content: s.mdx(),
    })
    .transform((data, { meta }) => {
      return {
        ...data,
        slug:
          meta.path
            .split("/")
            .pop()
            ?.replace(/\.mdx$/, "") ?? "",
      }
    }),
})

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:6].[ext]",
    clean: true,
  },
  collections: { posts },
  mdx: {
    rehypePlugins: [[rehypeShiki, { theme: "github-dark" }]] as PluggableList,
  },
})

import rehypeAutolinkHeadings from "rehype-autolink-headings"
import rehypeExternalLinks from "rehype-external-links"
import rehypeKatex from "rehype-katex"
import rehypeRaw from "rehype-raw"
import rehypeSlug from "rehype-slug"
import remarkEmoji from "remark-emoji"
import remarkGfm from "remark-gfm"
import type { PluggableList } from "unified"
import { defineCollection, defineConfig, s } from "velite"
import rehypeShiki from "@shikijs/rehype"

const faqItem = s.object({
  question: s.string(),
  answer: s.string(),
})

const howToStep = s.object({
  name: s.string(),
  text: s.string(),
})

const videoObject = s.object({
  name: s.string(),
  description: s.string().optional(),
  thumbnailUrl: s.string().optional(),
  uploadDate: s.isodate().optional(),
  contentUrl: s.string().optional(),
  embedUrl: s.string().optional(),
  duration: s.string().optional(),
})

const productReview = s.object({
  name: s.string(),
  brand: s.string().optional(),
  description: s.string().optional(),
  image: s.string().optional(),
  ratingValue: s.number().min(1).max(5).optional(),
  ratingCount: s.number().min(1).optional(),
  price: s.string().optional(),
  priceCurrency: s.string().default("USD").optional(),
  availability: s.string().default("InStock").optional(),
})

const softwareApp = s.object({
  name: s.string(),
  operatingSystem: s.string().optional(),
  applicationCategory: s.string().optional(),
  ratingValue: s.number().min(1).max(5).optional(),
  ratingCount: s.number().min(1).optional(),
  price: s.string().default("0").optional(),
  priceCurrency: s.string().default("USD").optional(),
})

const eventDetails = s.object({
  name: s.string(),
  startDate: s.isodate(),
  endDate: s.isodate().optional(),
  location: s.string().optional(),
  description: s.string().optional(),
  eventStatus: s.string().default("EventScheduled").optional(),
  eventAttendanceMode: s
    .string()
    .default("OfflineEventAttendanceMode")
    .optional(),
})

const faqs = defineCollection({
  name: "Faq",
  pattern: "faqs/**/*.mdx",
  schema: s
    .object({
      question: s.string(),
      answer: s.mdx(),
      category: s.string().default("general").optional(),
      order: s.number().default(0).optional(),
      tags: s.array(s.string()).optional(),
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

const posts = defineCollection({
  name: "Post",
  pattern: "posts/**/*.mdx",
  schema: s
    .object({
      title: s.string(),
      publishedAt: s.isodate(),
      description: s.string().max(999).optional(),
      author: s.string().optional(),
      updatedAt: s.isodate().optional(),
      image: s.string().optional(),
      tags: s.array(s.string()).optional(),
      content: s.mdx(),
      postType: s
        .enum([
          "blog",
          "article",
          "review",
          "faq",
          "video",
          "howto",
          "event",
          "software",
        ])
        .default("blog")
        .optional(),
      faq: s.array(faqItem).optional(),
      howTo: s.array(howToStep).optional(),
      video: s.array(videoObject).optional(),
      product: productReview.optional(),
      software: softwareApp.optional(),
      event: eventDetails.optional(),
      speakable: s.array(s.string()).max(3).optional(),
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
  collections: { posts, faqs },
  mdx: {
    remarkPlugins: [remarkGfm, remarkEmoji] as PluggableList,
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: "wrap" }],
      rehypeKatex,
      [
        rehypeRaw,
        {
          passThrough: [
            "mdxJsxFlowElement",
            "mdxJsxTextElement",
            "mdxFlowExpression",
            "mdxTextExpression",
            "mdxEsm",
          ] as const,
        },
      ],
      [
        rehypeExternalLinks,
        { target: "_blank", rel: ["nofollow", "noopener", "noreferrer"] },
      ],
      [rehypeShiki, { theme: "github-dark" }],
    ] as PluggableList,
  },
})

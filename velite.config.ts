import rehypeAutolinkHeadings from "rehype-autolink-headings"
import rehypeExternalLinks from "rehype-external-links"
// import rehypeRaw from "rehype-raw"
import rehypeSlug from "rehype-slug"
import remarkEmoji from "remark-emoji"
import remarkGfm from "remark-gfm"
import type { PluggableList } from "unified"
import { defineCollection, defineConfig, s } from "velite"

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

const listingItem = s.object({
  name: s.string(),
  brand: s.string().optional(),
  model: s.string().optional(),
  description: s.string().optional(),
  image: s.string().optional(),
  gallery: s.array(s.string()).optional(),
  price: s.string().optional(),
  priceCurrency: s.string().default("USD").optional(),
  priceRange: s.string().optional(),
  ratingValue: s.number().min(1).max(5).optional(),
  ratingCount: s.number().min(1).optional(),
  availability: s.string().default("InStock").optional(),
  amazonUrl: s.string().optional(),
  affiliateUrl: s.string().optional(),
  asin: s.string().optional(),
  sku: s.string().optional(),
  category: s.string().optional(),
  tags: s.array(s.string()).optional(),
  bestFor: s.array(s.string()).optional(),
  pros: s.array(s.string()).optional(),
  cons: s.array(s.string()).optional(),
  features: s.array(s.string()).optional(),
  specs: s.record(s.string()).optional(),
  warranty: s.string().optional(),
  dimensions: s.string().optional(),
  weight: s.string().optional(),
  color: s.string().optional(),
  material: s.string().optional(),
  power: s.string().optional(),
  installation: s.string().optional(),
  certifications: s.array(s.string()).optional(),
  included: s.array(s.string()).optional(),
  video: s.string().optional(),
  notes: s.string().optional(),
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
  pattern: "faqs/*/*.mdx",
  schema: s
    .object({
      question: s.string(),
      answer: s.mdx(),
      category: s.string().default("general").optional(),
      order: s.number().default(0).optional(),
      tags: s.array(s.string()).optional(),
      locale: s.string().optional(),
    })
    .transform((data, { meta }) => {
      const parts = meta.path.split("/")
      const file = parts.pop() ?? ""

      return {
        ...data,
        slug: parts.pop() ?? "",
        locale: file.replace(/\.mdx$/, ""),
      }
    }),
})

const posts = defineCollection({
  name: "Post",
  pattern: "posts/*/*.mdx",
  schema: s
    .object({
      title: s.string(),
      publishedAt: s.isodate(),
      description: s.string().max(999).optional(),
      author: s.string().optional(),
      updatedAt: s.isodate().optional(),
      image: s.string().optional(),
      tags: s.array(s.string()).optional(),
      locale: s.string().optional(),
      content: s.mdx(),
      html: s.markdown(),
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
          "listing",
          "guide",
        ])
        .default("blog")
        .optional(),
      faq: s.array(faqItem).optional(),
      howTo: s.array(howToStep).optional(),
      video: s.array(videoObject).optional(),
      product: productReview.optional(),
      listing: s.array(listingItem).optional(),
      software: softwareApp.optional(),
      event: eventDetails.optional(),
      speakable: s.array(s.string()).max(3).optional(),
    })
    .transform((data, { meta }) => {
      const parts = meta.path.split("/")
      const file = parts.pop() ?? ""
      const folder = parts.pop() ?? ""

      return {
        ...data,
        slug: folder,
        locale: file.replace(/\.mdx$/, ""),
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
      [
        rehypeExternalLinks,
        { target: "_blank", rel: ["nofollow", "noopener", "noreferrer"] },
      ],
    ] as PluggableList,
  },
})

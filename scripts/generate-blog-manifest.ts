import fs from "fs"
import path from "path"

interface Post {
  slug: string
  title: string
}

interface Faq {
  slug: string
  question: string
}

const messagesDir = path.join(process.cwd(), "messages")
const locales = fs
  .readdirSync(messagesDir)
  .filter((f) => f.endsWith(".json"))
  .map((f) => f.replace(/\.json$/, ""))
  .toSorted()

const defaultLocale = "en"

const veliteDir = path.join(process.cwd(), ".velite")
const publicDir = path.join(process.cwd(), "public")

const postsPath = path.join(veliteDir, "posts.json")
const faqsPath = path.join(veliteDir, "faqs.json")

const posts: Post[] = fs.existsSync(postsPath)
  ? JSON.parse(fs.readFileSync(postsPath, "utf8"))
  : []

const faqs: Faq[] = fs.existsSync(faqsPath)
  ? JSON.parse(fs.readFileSync(faqsPath, "utf8"))
  : []

const urls: string[] = []

for (const locale of locales) {
  for (const post of posts) {
    const prefix = locale === defaultLocale ? "" : `/${locale}`
    urls.push(`${prefix}/blog/${post.slug}`)
  }
}

for (const locale of locales) {
  const prefix = locale === defaultLocale ? "" : `/${locale}`
  urls.push(`${prefix}/faq`)
}

const manifest = JSON.stringify(urls, null, 2)
fs.writeFileSync(path.join(publicDir, "blog-manifest.json"), manifest, "utf8")

console.log(
  `[blog-manifest] Generated public/blog-manifest.json with ${urls.length} URLs (${posts.length} posts, ${faqs.length} faqs, ${locales.length} locales)`
)

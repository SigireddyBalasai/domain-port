import fs from "fs"
import path from "path"

interface Post {
  slug: string
  title: string
  description?: string
  publishedAt: string
}

interface Faq {
  slug: string
  question: string
  category?: string
}

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

const lines: string[] = []

lines.push("# CCTV Name")
lines.push("")
lines.push(
  "> Expert CCTV and surveillance solutions — reviews, installation guides, and security tips for your home and business."
)
lines.push("")

if (posts.length > 0) {
  lines.push("## Blog")
  lines.push(
    `- [All Posts](https://www.cctv.name/blog): Latest CCTV and surveillance insights`
  )
  for (const post of posts) {
    const desc = post.description ?? `Read about ${post.title}`
    lines.push(
      `- [${post.title}](https://www.cctv.name/blog/${post.slug}): ${desc}`
    )
  }
  lines.push("")
}

if (faqs.length > 0) {
  lines.push("## FAQ")
  lines.push(
    `- [Frequently Asked Questions](https://www.cctv.name/faq): Common questions about CCTV cameras, installation, and surveillance`
  )
  for (const faq of faqs) {
    lines.push(
      `- [${faq.question}](https://www.cctv.name/faq#${faq.slug}): ${faq.question}`
    )
  }
  lines.push("")
}

lines.push("## About")
lines.push(
  "- [Author: CCTV Name Team](https://www.cctv.name/author/cctv-name): Articles and guides by the CCTV Name team"
)
lines.push("")

const output = lines.join("\n")
fs.writeFileSync(path.join(publicDir, "llms.txt"), output, "utf8")
console.log(
  `[llmstxt] Generated public/llms.txt with ${posts.length} posts and ${faqs.length} faqs`
)

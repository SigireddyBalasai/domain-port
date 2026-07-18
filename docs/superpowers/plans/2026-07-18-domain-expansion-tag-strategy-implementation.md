# Domain Expansion via Tag Strategy: Implementation Plan

> **For agentic workers:** This is a content expansion plan, not a code-centric feature. Tasks involve creating/updating content files and a small UI enhancement. Follow the sequence; each content task is independent.

**Goal:** Expand cctv.name's topical authority by publishing 8+ new blog posts covering compliance, technology, and buying guides, using tag-based organization.

**Architecture:** Tag-only taxonomy - no schema changes. Posts get tags from defined vocabulary (`compliance`, `ndaa`, `resolution-guides`, `night-vision`, `ai-features`, `buying-guide`, `budget-cameras`, `comparison`, `installation`, `privacy-law`). Optional UI: Popular Tags sidebar.

**Tech Stack:** Next.js 16, Velite, TypeScript, Tailwind, shadcn/ui components. Content stored as MDX in `content/posts/`.

---

## Phase 1: Audit & Tag Existing Content (Task 1-3)

### Task 1: Identify Existing Posts for Tagging

**Files to modify:** None yet - this is research

- [ ] **Step 1:** List all existing blog posts
  - Run: `ls -R content/posts/ | grep -E '\.mdx$' | head -50`
  - Record slugs in a temporary list

- [ ] **Step 2:** For each post, determine applicable tags from vocabulary
  - Look at title and existing tags
  - Assign `ndaa` if product is imported/sourced and compliance is a selling point
  - Assign `resolution-guides` if post discusses resolution differences
  - Assign `night-vision` if covers night vision tech
  - Assign `buying-guide` if it's a recommendations list
  - Assign `budget-cameras` if focused on affordable options
  - Assign `comparison` if it's a head-to-head
  - Assign `installation` if about setup/wiring
  - Assign `ai-features` if covers smart detection
  - Assign `privacy-law` if discusses legal/consent
  - Keep a log: `slug -> tags[]`

- [ ] **Step 3:** Create a list of posts to tag
  - Prioritize: Product reviews with compliant products → resolution comparisons → night vision articles
  - Expect 5-10 posts to tag

**Outcome:** Document `docs/superpowers/plans/2026-07-18-tag-existing-posts.md` with mapping

### Task 2: Update Existing Posts Frontmatter

**Files to modify:** Multiple MDX frontmatter files

For each post identified in Task 1:

- [ ] **Step 1:** Read the current frontmatter
  - Use Read tool on `content/posts/<slug>/en.mdx` (and other locales if applicable)

- [ ] **Step 2:** Add the new `tags` array entries
  - If `tags` field exists, append new tags (avoid duplicates)
  - If `tags` doesn't exist, create it with the new tags
  - Example change:
    ```yaml
    tags: ["cctv-basics", "nvr"] # existing
    # becomes
    tags: ["cctv-basics", "nvr", "ndaa"] # if applicable
    ```

- [ ] **Step 3:** Commit the changes
  ```bash
  git add content/posts/<slug>/
  git commit -m "feat(content): tag <slug> with <tag1>, <tag2>"
  ```

**Note:** Some posts may have multiple locale files; tag all locale versions consistently.

### Task 3: Verify Updated Content Builds

- [ ] **Step 1:** Run Velite build to ensure frontmatter changes are valid

  ```bash
  bunx velite --clean
  ```

- [ ] **Step 2:** If build succeeds, run dev server to visually spot-check

  ```bash
  bun run dev
  ```
  - Open blog page, click through updated posts to confirm tags appear

- [ ] **Step 3:** Commit if not already done
  ```bash
  git add .velite/
  git commit -m "build: regenerate content after tagging updates"
  ```

---

## Phase 2: Write New Cornerstone Posts (Task 4-11)

### Task 4: Create NDAA Compliance Pillar Post

**Files to create:** `content/posts/ndaa-compliance-guide-2026/en.mdx`

- [ ] **Step 1:** Write frontmatter

  ```yaml
  ---
  title: "NDAA Compliance: What CCTV Installers Need to Know in 2026"
  description: "A comprehensive guide to understanding NDAA requirements, restricted brands (Hikvision, Dahua), and how to choose compliant cameras for federal projects."
  publishedAt: 2026-07-20T00:00:00.000Z
  updatedAt: 2026-07-20T00:00:00.000Z
  slug: "ndaa-compliance-guide-2026"
  author: "Your Name"
  tags: ["compliance", "ndaa"]
  postType: "article"
  ---
  ```

- [ ] **Step 2:** Write content structure (MDX) with sections:
  - What is NDAA and why it matters
  - Which brands are restricted (list with examples)
  - What "compliant" really means (components, assembly, software)
  - How to verify a camera is NDAA-compliant
  - Top compliant brands and product lines
  - Compliance checklist for installers
  - Frequently asked questions (NDAA myths)

- [ ] **Step 3:** Use Callout components where appropriate (from AGENTS.md: Callout for note/warning/info)
  - Example: `<Callout type="warning">This product is NOT NDAA-compliant</Callout>`

- [ ] **Step 4:** Save file and commit
  ```bash
  git add content/posts/ndaa-compliance-guide-2026/
  git commit -m "feat(content): add NDAA compliance pillar article"
  ```

### Task 5: Write "Best NDAA Cameras Under $300"

**Files to create:** `content/posts/best-ndaa-cameras-under-300/en.mdx`

- [ ] **Step 1:** Frontmatter

  ```yaml
  ---
  title: "Best NDAA-Compliant Cameras Under $300 (2026)"
  description: "Top affordable NDAA-compliant security cameras. Compare specs, pricing, and why these meet federal requirements without breaking the budget."
  publishedAt: 2026-07-21T00:00:00.000Z
  updatedAt: 2026-07-21T00:00:00.000Z
  slug: "best-ndaa-cameras-under-300"
  author: "Your Name"
  tags: ["ndaa", "budget-cameras", "buying-guide", "comparison"]
  postType: "review"
  ---
  ```

- [ ] **Step 2:** Content outline
  - Introduction: Why budget + compliance is a common need
  - Top 5-7 product picks with comparison table (camera model, resolution, FOV, storage, price, compliance notes)
  - Detailed reviews for each (pros/cons, best use case)
  - Buyer's guide: What to look for in a budget compliant camera
  - Installation considerations
  - FAQ

- [ ] **Step 3:** Use Card, Tabs, or table components for comparison
  - Check `components/ui/` for available components (shadcn). Use `Table` if available.

- [ ] **Step 4:** Commit new file

### Task 6: Write Resolution Comparison Guide

**Files to create:** `content/posts/resolution-guide-8mp-vs-12mp-vs-4k/en.mdx`

- [ ] **Step 1:** Frontmatter

  ```yaml
  ---
  title: "8MP vs 12MP vs 4K: When Higher Resolution Actually Matters"
  description: "Stop overpaying for resolution you don't need. Learn when 4K is worth it and which resolution is right for your property."
  publishedAt: 2026-07-22T00:00:00.000Z
  updatedAt: 2026-07-22T00:00:00.000Z
  slug: "resolution-guide-8mp-vs-12mp-vs-4k"
  author: "Your Name"
  tags: ["resolution-guides", "buying-guide"]
  postType: "howto"
  ---
  ```

- [ ] **Step 2:** Content outline
  - The myth: "more megapixels = better"
  - Field of view vs pixel density trade-offs
  - Storage and bandwidth implications
  - Practical scenarios: small home, large property, license plate reading, facial ID
  - Cost vs benefit analysis
  - Recommendation matrix by use case

- [ ] **Step 3:** Include visual comparison (image placeholders with alt text describing charts/diagrams)

  ```mdx
  ![Comparison of resolution at different FOVs showing pixel density](/static/...)
  ```

- [ ] **Step 4:** Commit

### Task 7: Write Night Vision Comparison

**Files to create:** `content/posts/color-night-vision-vs-ir-comparison/en.mdx`

- [ ] **Step 1:** Frontmatter

  ```yaml
  ---
  title: "Color Night Vision vs Infrared: Real-World Testing [2026]"
  description: "We tested color night vision vs traditional IR in actual low-light conditions. Find out which technology delivers better results and when."
  publishedAt: 2026-07-23T00:00:00.000Z
  updatedAt: 2026-07-23T00:00:00.000Z
  slug: "color-night-vision-vs-ir-comparison"
  author: "Your Name"
  tags: ["night-vision", "comparison"]
  postType: "review"
  ---
  ```

- [ ] **Step 2:** Content
  - How IR night vision works
  - How color night vision (starlight + ambient light) works
  - Test methodology: light levels, camera models, metrics
  - Results: side-by-side image comparisons
  - Pros/cons table
  - Recommendations by scenario (total darkness vs low-light, indoor vs outdoor)

- [ ] **Step 3:** Use `<YouTubeEmbed>` component if you have test videos

  ```mdx
  <YouTubeEmbed id="VIDEO_ID" title="Night Vision Comparison" start={0} />
  ```

- [ ] **Step 4:** Commit

### Task 8: Write AI Features Guide

**Files to create:** `content/posts/ai-features-explained-person-detection-vs-false-alarms/en.mdx`

- [ ] **Step 1:** Frontmatter

  ```yaml
  ---
  title: "AI-Powered Cameras: Do You Really Need Smart Detection?"
  description: "Person detection, vehicle recognition, pet immunity... we break down AI camera features and show which ones actually reduce false alarms."
  publishedAt: 2026-07-24T00:00:00.000Z
  updatedAt: 2026-07-24T00:00:00.000Z
  slug: "ai-features-explained"
  author: "Your Name"
  tags: ["ai-features", "buying-guide"]
  postType: "article"
  ---
  ```

- [ ] **Step 2:** Content
  - What "AI" means in CCTV (on-device vs cloud)
  - Common smart detection types: person, vehicle, pet, package, face
  - False alarm reduction statistics
  - Cost implications (subscriptions vs one-time)
  - Which AI features are worth paying for
  - Brand comparisons (Reolink vs Lorex vs Amcrest)

- [ ] **Step 3:** Use Accordion for FAQ section

  ```mdx
  <Accordion type="single" collapsible>
    <AccordionItem value="item-1">
      <AccordionTrigger>Do AI cameras need internet?</AccordionTrigger>
      <AccordionContent>
        On-device AI works offline; cloud-based requires internet...
      </AccordionContent>
    </AccordionItem>
  </Accordion>
  ```

- [ ] **Step 4:** Commit

### Task 9: Write Installation & Tech Comparison

**Files to create:** `content/posts/poe-vs-wireless-vs-solar-comparison/en.mdx`

- [ ] **Step 1:** Frontmatter

  ```yaml
  ---
  title: "PoE vs Wireless vs Solar: Complete Cost & Reliability Comparison"
  description: "Which camera power method is best? We compare installation cost, reliability, and long-term maintenance for PoE, WiFi, and solar cameras."
  publishedAt: 2026-07-25T00:00:00.000Z
  updatedAt: 2026-07-25T00:00:00.000Z
  slug: "poe-vs-wireless-vs-solar-comparison"
  author: "Your Name"
  tags: ["installation", "buying-guide", "comparison"]
  postType: "howto"
  ---
  ```

- [ ] **Step 2:** Content
  - PoE: stable power + data over single cable, requires switch/router proximity
  - Wireless: easy install, bandwidth limits, interference
  - Solar: truly wireless, battery life, weather dependency
  - Cost breakdown ( cables, switches, batteries, solar panels)
  - Reliability ranking by environment
  - Use-case matrix

- [ ] **Step 3:** Create comparison table using shadcn Table component

- [ ] **Step 4:** Commit

### Task 10: Write Privacy Law Guide

**Files to create:** `content/posts/privacy-laws-by-state-cctv-guide/en.mdx`

- [ ] **Step 1:** Frontmatter

  ```yaml
  ---
  title: "Privacy Laws by State: A Guide to Legal CCTV Installation (2026)"
  description: "Recording in public vs private, consent requirements, and employer guidelines. Know the law before you install."
  publishedAt: 2026-07-26T00:00:00.000Z
  updatedAt: 2026-07-26T00:00:00.000Z
  slug: "privacy-laws-by-state-cctv-guide"
  author: "Your Name"
  tags: ["privacy-law", "compliance", "installation"]
  postType: "article"
  ---
  ```

- [ ] **Step 2:** Content
  - Federal vs state privacy laws overview
  - State-by-state breakdown (mention major states: CA, TX, FL, NY, IL)
  - Do-not-record zones (bathrooms, locker rooms)
  - Audio recording considerations (two-party consent states)
  - Employer/employee surveillance rules
  - Signage requirements
  - Disclaimer: Not legal advice

- [ ] **Step 3:** Use Tabs to organize state info or a simple table

- [ ] **Step 4:** Commit

### Task 11: Write Budget Cameras Roundup

**Files to create:** `content/posts/best-security-cameras-under-100-2026/en.mdx`

- [ ] **Step 1:** Frontmatter

  ```yaml
  ---
  title: "Best Security Cameras Under $100 (2026 Edition)"
  description: "Affordable doesn't mean inadequate. These $100 cameras offer solid features without monthly fees."
  publishedAt: 2026-07-27T00:00:00.000Z
  updatedAt: 2026-07-27T00:00:00.000Z
  slug: "best-security-cameras-under-100-2026"
  author: "Your Name"
  tags: ["budget-cameras", "buying-guide", "comparison"]
  postType: "review"
  ---
  ```

- [ ] **Step 2:** Content
  - Why budget cameras are viable for many
  - Top 5-8 picks with pros/cons, specs, price
  - Comparison table: resolution, storage, power, app quality
  - Setup tips
  - Limitations to expect (no 24/7 recording, lower resolution)
  - Upgrade path when ready

- [ ] **Step 3:** Commit

---

## Phase 3: Optional UI Enhancement (Task 12-14)

### Task 12: Create Popular Tags Sidebar Component

**Files to create:** `components/blog/popular-tags-sidebar.tsx`

- [ ] **Step 1:** Import dependencies

  ```tsx
  import Link from "next/link"
  import { Badge } from "@/components/ui/badge"
  ```

- [ ] **Step 2:** Define component that receives all posts and extracts unique tags

  ```tsx
  interface PopularTagsSidebarProps {
    posts: Array<{ tags: string[] }>
    limit?: number
  }

  export function PopularTagsSidebar({
    posts,
    limit = 10,
  }: PopularTagsSidebarProps) {
    // Count tag frequency
    const tagCounts = new Map<string, number>()
    posts.forEach((post) => {
      post.tags.forEach((tag) => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
      })
    })

    // Sort by count descending, take top N
    const popularTags = Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map((entry) => entry[0])

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Popular Topics</h3>
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag) => (
            <Link key={tag} href={`/blog?tag=${tag}`} passHref legacyBehavior>
              <Badge
                variant="secondary"
                className="cursor-pointer hover:bg-secondary/80"
              >
                {tag
                  .replace(/-/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
                <span className="ml-1 text-xs text-muted-foreground">
                  ({tagCounts.get(tag)})
                </span>
              </Badge>
            </Link>
          ))}
        </div>
      </div>
    )
  }
  ```

- [ ] **Step 3:** Style using existing Tailwind/component classes

### Task 13: Add Sidebar to Blog Page

**Files to modify:** `app/[locale]/blog/page.tsx`

- [ ] **Step 1:** Import the new component

  ```tsx
  import { PopularTagsSidebar } from "@/components/blog/popular-tags-sidebar"
  ```

- [ ] **Step 2:** Add to layout (likely sidebar or below title)

  ```tsx
  <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
    <div className="lg:col-span-3">{/* existing blog posts grid */}</div>
    <aside className="lg:col-span-1 space-y-8">
      <PopularTagsSidebar posts={posts} />
      {/* other sidebar widgets */}
    </aside>
  </div>
  ```

- [ ] **Step 3:** Ensure `posts` variable (from Velite) is passed to component

- [ ] **Step 4:** Test locally with `bun run dev`

- [ ] **Step 5:** Commit

### Task 14: Add Basic Tag Filtering (Optional)

If you want basic filter functionality:

- [ ] **Step 1:** Add URL query param handling in blog page
  - Parse `?tag=ndaa` from `searchParams`
  - Filter posts: `posts.filter(p => p.tags.includes(tag))`

- [ ] **Step 2:** Show active filter badge with "clear" option

- [ ] **Step 3:** Update PopularTagsSidebar links to include query param

- [ ] **Step 4:** Test and commit

---

## Phase 4: Content Tasks (Repeated Pattern)

For each new post (Tasks 4-11), the pattern is:

1. **Write frontmatter** with title, description, date, slug, author, tags, postType
2. **Write MDX content** with proper headings, Callout/Accordion/Tabs as needed
3. **Add internal links** to related existing posts (manual; 2-3 per article)
4. **Create slug directory** and `en.mdx` file
5. **Commit** with message `feat(content): add <short-title>`
6. **Optional**: Consider adding translations later (21 locales) - but start with English only

---

## Testing & Verification

- After each new post, run: `bunx velite --clean && bun run build` to ensure no build errors
- Spot-check on `bun run dev` that post renders correctly
- Verify tags appear on post card and single post page
- Check that popular tags sidebar shows correct counts

---

## Commit Convention

- Content additions: `feat(content): add <topic> article`
- Content updates: `feat(content): tag <slug> with <tags>`
- UI changes: `feat(ui): add popular tags sidebar to blog page`
- Build/metadata: `build: regenerate content` (auto-generated by Velite)

---

## Deliverables

- 8 new published blog posts covering target domains
- Existing posts tagged appropriately (5-10)
- Optional: Popular Tags sidebar on `/blog` page
- All changes committed and pushed to main branch

---

## Notes

- No tests required (content site; visual verification sufficient)
- No database migrations
- No environment variables
- Follow existing content patterns in `content/posts/` for frontmatter and naming
- Use existing shadcn components for UI elements (Card, Badge, Accordion, Tabs, Table)
- Keep posts between 1500-3000 words for SEO

**Plan written.**: 2026-07-18

---

**Total estimated time**: 4-8 hours of focused content writing + 1 hour UI (optional)

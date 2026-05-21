# Blog Content Authoring Guide

## File Locations

| Type | Path |
|---|---|
| Blog posts | `content/posts/<slug>.mdx` |
| FAQs | `content/faqs/<slug>.mdx` |

## Blog Post Frontmatter

```yaml
---
title: "Post Title"
publishedAt: "2026-05-21"
description: "Meta description for SEO (max 999 chars)"
author: "Author Name"
updatedAt: "2026-05-21"         # optional
image: "/og.svg"                  # optional, OG image path
tags: ["tag1", "tag2"]            # optional
postType: "blog"                  # optional: blog | article | review | faq | video | howto | event | software
faq:                              # optional, FAQ schema
  - question: "Question?"
    answer: "Answer."
howTo:                            # optional, HowTo schema steps
  - name: "Step name"
    text: "Step description"
video:                            # optional, VideoObject schema
  - name: "Video title"
    description: "..."
    thumbnailUrl: "..."
    uploadDate: "2026-01-01"
    contentUrl: "..."
    embedUrl: "..."
    duration: "PT5M30S"
product:                          # optional, Product review schema
  name: "Product Name"
  brand: "Brand"
  description: "..."
  image: "..."
  ratingValue: 4.5
  ratingCount: 120
  price: "199.99"
  priceCurrency: "USD"
  availability: "InStock"
software:                         # optional, SoftwareApp schema
  name: "Software Name"
  operatingSystem: "Windows, Mac, Linux"
  applicationCategory: "Security"
  ratingValue: 4.0
  ratingCount: 50
  price: "0"
  priceCurrency: "USD"
event:                            # optional, Event schema
  name: "Event Name"
  startDate: "2026-06-01"
  endDate: "2026-06-03"
  location: "Venue or Online"
  description: "..."
  eventStatus: "EventScheduled"
  eventAttendanceMode: "OfflineEventAttendanceMode"
speakable: ["selector1"]          # optional, max 3 CSS selectors for Alexa/Google
---
```

## FAQ Frontmatter

```yaml
---
question: "Question text"
category: "general"               # optional
order: 1                           # optional
tags: ["tag1"]                     # optional
---
```

## Markdown Syntax

All standard GFM (GitHub Flavored Markdown) is supported:

```markdown
# Heading 1
## Heading 2
### Heading 3
**bold** *italic* `inline code`
[link text](https://example.com)
- unordered list item
1. ordered list item
> blockquote
| col1 | col2 |
|------|------|
| data | data |
- [x] task list item
:emoji:  (emoji shortcodes, e.g. :warning:)
```

## Custom MDX Components

All components are registered globally in `sharedComponents` and available in any `.mdx` file.

### Callout

Colored alert boxes for emphasis. Use for notes, tips, warnings, and key info.

```mdx
<Callout type="note" title="Note">
  Contextual information for the reader.
</Callout>

<Callout type="tip" title="Pro Tip">
  Best practice or optimization advice.
</Callout>

<Callout type="warning" title="Important">
  Something the reader must be aware of.
</Callout>

<Callout type="info" title="Did You Know?">
  Supplementary background information.
</Callout>

<Callout type="danger" title="Security Risk">
  Critical security or safety warning.
</Callout>
```

Prop | Type | Default | Description
---|---|---|---
`type` | `"note" \| "tip" \| "warning" \| "info" \| "danger"` | `"note"` | Visual style
`title` | `string` | — | Bold header text
`children` | `ReactNode` | — | Body content (parses markdown)

### Badge

Small inline label for status, version, or category tags.

```mdx
<Badge>Default</Badge>
<Badge variant="secondary">Updated</Badge>
<Badge variant="destructive">Deprecated</Badge>
<Badge variant="outline">v2.1</Badge>
```

Variants: `default` \| `secondary` \| `destructive` \| `outline` \| `ghost` \| `link`

Inline with text: `<Badge>New</Badge> some text afterward`

### Card

Structured content block with header, body, and optional sections.

```mdx
<Card>
  <CardHeader>
    <CardTitle>Camera Model X</CardTitle>
    <CardDescription>4K bullet camera with night vision</CardDescription>
  </CardHeader>
  <CardContent>
    Body content here — supports markdown.
  </CardContent>
</Card>
```

Sub-components: `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`

Card accepts optional `size` prop: `"default"` or `"sm"`.

### Table

GFM markdown tables are automatically enhanced with:
- Responsive horizontal scroll wrapper
- Borders, hover states, alternating row colors (shadcn styling)
- Clickable column headers for sorting (asc/desc toggle)

```markdown
| Feature | Basic | Pro |
|---------|-------|-----|
| Price   | $99   | $199|
| Support | Email | 24/7 |
```

Sort by clicking any column header.

### Tabs

Tabbed content for multi-option displays (code samples, comparisons, OS-specific instructions).

```mdx
<Tabs defaultValue="windows">
  <TabsList>
    <TabsTrigger value="windows">Windows</TabsTrigger>
    <TabsTrigger value="mac">macOS</TabsTrigger>
    <TabsTrigger value="linux">Linux</TabsTrigger>
  </TabsList>
  <TabsContent value="windows">Windows instructions here.</TabsContent>
  <TabsContent value="mac">macOS instructions here.</TabsContent>
  <TabsContent value="linux">Linux instructions here.</TabsContent>
</Tabs>
```

`TabsList` accepts optional `variant` prop: `"default"` (pill) or `"line"` (underline).

### Accordion

Collapsible sections for FAQs, detailed specs, or expandable content.

```mdx
<Accordion>
  <AccordionItem>
    <AccordionTrigger>What is the difference?</AccordionTrigger>
    <AccordionContent>
      Detailed answer here.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem>
    <AccordionTrigger>How long does it last?</AccordionTrigger>
    <AccordionContent>
      Another answer here.
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

### Kbd

Keyboard shortcut display.

```mdx
Press <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd> to search.
<Badge>New</Badge> <Kbd>Ctrl</Kbd>+<Kbd>Shift</Kbd>+<Kbd>Esc</Kbd>
```

`KbdGroup` wraps multiple keys: `<KbdGroup><Kbd>Ctrl</Kbd><Kbd>K</Kbd></KbdGroup>`

### YouTubeEmbed

Embed a YouTube video with click-to-load (lazy iframe).

```mdx
<YouTubeEmbed id="dQw4w9WgXcQ" title="Video Title" start={30} />
```

Prop | Type | Required | Description
---|---|---|---
`id` | `string` | yes | YouTube video ID
`title` | `string` | yes | Accessibility label
`start` | `number` | no | Start timestamp (seconds)

### Alert

Low-level shadcn alert (use `Callout` for simpler API unless you need custom structure).

```mdx
<Alert>
  <AlertTitle>Heading</AlertTitle>
  <AlertDescription>Body text.</AlertDescription>
</Alert>
```

`Alert` has `variant`: `"default"` or `"destructive"`.

## Content Authoring Patterns

### Comparison sections
```mdx
## Format Comparison

| Format | Quality | Size | Use Case |
|--------|---------|------|----------|
| H.264  | Good    | Med  | General recording |
| H.265  | Better  | Small| High-res, long-term |
| MJPEG  | Best    | Huge | Forensics |
```

### Product highlights
```mdx
<Card size="sm">
  <CardHeader>
    <CardTitle>Product Name</CardTitle>
    <Badge>Best Value</Badge>
  </CardHeader>
  <CardContent>
    Key features and pricing.
  </CardContent>
</Card>
```

### Multi-platform instructions
```mdx
<Tabs defaultValue="windows">
  <TabsList>
    <TabsTrigger value="windows">Windows</TabsTrigger>
    <TabsTrigger value="nvr">NVR</TabsTrigger>
  </TabsList>
  <TabsContent value="windows">...</TabsContent>
  <TabsContent value="nvr">...</TabsContent>
</Tabs>
```

### FAQ sections in blog posts
```mdx
## Frequently Asked Questions

<Accordion>
  <AccordionItem>
    <AccordionTrigger>Question 1?</AccordionTrigger>
    <AccordionContent>Answer 1.</AccordionContent>
  </AccordionItem>
</Accordion>
```

### Tips within prose
```mdx
Some paragraph text.

<Callout type="tip" title="Pro Tip">
  Save storage by enabling motion detection.
</Callout>

More content after the callout.
```

## Structured Data (JSON-LD)

Frontmatter fields like `product`, `software`, `howTo`, `video`, `event`, and `faq` generate JSON-LD structured data automatically for SEO. Use them whenever the content matches the schema type.

## Video Content

The `video` frontmatter field generates VideoObject schema. Use `duration` in ISO 8601 format (e.g. `"PT5M30S"`). The `embedUrl` enables embedded video rich results.

## Post Types

Set `postType` to one of: `blog`, `article`, `review`, `faq`, `video`, `howto`, `event`, `software`. This affects the JSON-LD `@type` generated for the page.

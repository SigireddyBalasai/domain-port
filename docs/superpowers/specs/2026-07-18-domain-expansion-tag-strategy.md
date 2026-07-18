# Domain Expansion via Tag-Based Content Strategy

**Date**: 2026-07-18  
**Project**: cctv.name - CCTV/Surveillance Review Site  
**Author**: opencode  
**Status**: Approved

---

## Problem Statement

The current site has a narrow set of content focused on general CCTV concepts and product reviews. To establish topical authority and drive organic traffic, we need to expand into high-value domains like **compliance (NDAA, privacy laws)**, **technology deep-dives (resolution, night vision, AI features)**, **specialized buying guides (budget, use-case specific)**, and **resources (calculators, glossaries)**.

However, the existing Velite schema lacks a categorical field for blog posts (only FAQs have `category`). We need an approach that allows content expansion without schema changes, keeping implementation lightweight and future-proof.

---

## Goals

1. **Organic Traffic Growth**: Target high-intent keywords in compliance and technology domains
2. **Authority Positioning**: Become a comprehensive resource across CCTV-related topics
3. **Lead Generation**: Create sticky content that builds trust and collects emails
4. **Zero Downtime**: No schema changes - work within existing `tags` taxonomy
5. **Future-Proof**: Enable easy addition of tag-based filtering/navigation later

---

## Non-Goals

- No multi-site or separate domain branching
- No database schema changes
- No immediate category landing pages (we'll use tags only initially)
- No complex multi-category assignment per post (single tags)

---

## Technical Approach

### Content Strategy (Tag-Only)

We will use the **existing `tags` array** in blog post frontmatter as the sole taxonomy mechanism. Each new post will be tagged with one or more topic tags from a defined set.

#### Defined Tag Vocabulary

| Tag                 | Purpose                                              | Example Post Types |
| ------------------- | ---------------------------------------------------- | ------------------ |
| `compliance`        | Legal/regulatory content (NDAA, GDPR, signage)       | article, howto     |
| `ndaa`              | Specific to NDAA requirements and compliant products | review, article    |
| `resolution-guides` | Resolution comparisons (4K vs 8MP, when to upgrade)  | howto, article     |
| `night-vision`      | Night vision tech, color vs IR, testing              | review, howto      |
| `ai-features`       | AI detection, false alarms, smart analytics          | article, howto     |
| `buying-guide`      | General purchasing advice                            | article            |
| `budget-cameras`    | Budget-specific recommendations (<$100, <$200)       | review             |
| `comparison`        | Head-to-head product comparisons                     | review             |
| `installation`      | Setup, mounting, wiring guides                       | howto              |
| `privacy-law`       | State/federal privacy regulations, consent           | article            |

**Tagging Guidelines**:

- Posts get **1-2 primary tags** from the set above
- Secondary tags can include specific products, brands, or niche topics (e.g., `hikvision-alternative`, `poe-camera`)
- New tags may be added if they represent a new domain (but keep vocabulary tight)

#### Post Type Usage

- `review`: Product roundups, best-of lists, brand comparisons (affiliate-focused)
- `howto`: Step-by-step guides, installation tutorials, checklists
- `article`: Analytical pieces, explainers, legal overviews (non-commercial)
- `blog`: General updates, news, opinion (use sparingly)

---

## Content Roadmap

### Phase 1: Quick Wins (Week 1-2)

1. **Update existing reviews** with relevant tags (`ndaa` where applicable)
2. **Publish cornerstone post**: "NDAA Compliance: What CCTV Installers Need to Know in 2026" (tags: `compliance`, `ndaa`)
3. **Add tag-based "Popular Topics" section** to blog sidebar (`app/[locale]/blog/page.tsx`)

### Phase 2: Authority Build (Month 1-2)

Publish 5-8 pillar articles:

1. "Best NDAA-Compliant Cameras Under $300" (tags: `ndaa`, `budget-cameras`, `buying-guide`, `comparison`)
2. "8MP vs 12MP vs 4K: When Higher Resolution Actually Matters" (tags: `resolution-guides`, `buying-guide`)
3. "Color Night Vision vs IR: Real-World Testing and Recommendations" (tags: `night-vision`, `comparison`)
4. "AI-Powered Cameras: Do You Really Need Smart Detection?" (tags: `ai-features`, `buying-guide`)
5. "PoE vs Wireless vs Solar: Complete Cost & Reliability Comparison" (tags: `installation`, `buying-guide`)
6. "Privacy Laws by State: A Guide to Legal CCTV Installation" (tags: `privacy-law`, `compliance`)
7. "How to Calculate Hard Drive Space for Your CCTV System" (tags: `resources` - optional new tag if needed)
8. "No-Subscription Security Cameras: Best Local Storage Picks" (tags: `budget-cameras`, `buying-guide`)

### Phase 3: Expansion (Month 3+)

- Add more niche topics based on search data
- Create "Ultimate Guides" that compile multiple tags
- Experiment with `budget-cameras` series by price tier

---

## UI/UX Enhancements (Optional, Deferred)

### Tag-Based Filtering on Blog Page

When ready, add filter UI to `app/[locale]/blog/page.tsx`:

- Tag cloud or dropdown
- Show active tag with count
- Filter posts by tags (client-side or server-side)

Implementation is straightforward since posts already have `tags` in the API response from Velite.

### Popular Tags Sidebar Widget

Blog sidebar component showing top 10 tags (by post count) with links:

```tsx
const popularTags = [...new Set(posts.flatMap((p) => p.tags))].slice(0, 10)
```

---

## SEO & Internal Linking

- Each post should include 2-3 internal links to related posts (use tag overlap to find candidates)
- Create tag pages later if needed: `/tags/ndaa`, `/tags/compliance` - can generate dynamically by filtering posts
- Use descriptive anchor text linking to compliance articles from product reviews where NDAA is mentioned
- Add schema.org `Article` markup (already likely present) with `keywords` from tags

---

## Success Metrics

- Increase in blog posts covering target domains: 8+ new posts in 60 days
- Organic traffic growth to new tags (track via Google Search Console)
- Backlinks to compliance/comparison content (monthly check)
- Increased affiliate click-through rates on new buying guides (existing affiliate links)

---

## Risks & Mitigations

| Risk                               | Mitigation                                                         |
| ---------------------------------- | ------------------------------------------------------------------ |
| Tags become inconsistent/chaotic   | Start with defined vocabulary; new tags require conscious decision |
| Over-tagging dilutes focus         | Limit to 1-2 primary tags per post; review quarterly               |
| Existing posts not tagged properly | Phase 1 includes audit of old posts for relevant tags              |

---

## Dependencies

- None (no schema changes, no database changes)
- Can start publishing immediately with updated frontmatter
- No deployment or build process changes

---

## Alternatives Considered

1. **Add `category` field to posts**: Rejected due to schema change overhead and desire for minimal friction. Tags provide equivalent functionality with more granularity.
2. **Create separate content collections**: Overkill; breaks existing blog flow.
3. **Build a full taxonomy system**: YAGNI - tags are sufficient for now.

---

## Appendix: Sample Frontmatter

```yaml
---
title: "NDAA Compliance: What CCTV Installers Need to Know in 2026"
description: "A comprehensive guide to understanding NDAA requirements, restricted brands, and how to choose compliant cameras."
publishedAt: 2026-07-18
updatedAt: 2026-07-18
slug: "ndaa-compliance-guide-2026"
author: "Your Name"
tags: ["compliance", "ndaa"]
postType: "article"
---
```

```yaml
---
title: "Best NDAA-Compliant Cameras Under $300"
description: "Top picks for affordable, compliant security cameras. Compare specs, pricing, and why they meet NDAA requirements."
publishedAt: 2026-07-20
updatedAt: 2026-07-20
slug: "best-ndaa-cameras-under-300"
author: "Your Name"
tags: ["ndaa", "budget-cameras", "buying-guide", "comparison"]
postType: "review"
---
```

---

**End of Specification**

# CCTV.name — domain_port

Next.js 16 (Turbopack) + Tailwind v4 + shadcn/ui. CCTV/surveillance review site at cctv.name.
Package manager: **bun** (bun@1.3.0). Path alias `@/*` → root (`./*`).

## Commands

| Command | What it runs |
|---------|-------------|
| `bun run dev` | `next dev --turbopack` + `velite --watch` (concurrent via npm-run-all) |
| `bun run build` | `velite --clean` → `next build` → `next-sitemap` (postbuild script) |
| `bun run lint` | eslint |
| `bun run typecheck` | `tsc --noEmit` |
| `bun run format` | `prettier --write \"**/*.{ts,tsx}\"` |
| `bun run knip` | dead file / unused export analysis |
| `bun run seed` | seeds a user for auth |

Always run **format → lint → typecheck** before committing. Build locally to catch content issues.

## Architecture

- **i18n middleware**: `proxy.ts` (NOT `middleware.ts`). 21 locales (`en`, `es`, `fr`, `de`, `hi`, `ar`, `zh`, `ru`, `pt`, `ja`, `ko`, `it`, `nl`, `pl`, `tr`, `bn`, `ur`, `id`, `vi`, `th`, `uk`). `localePrefix: "as-needed"` (en has no prefix).
- **Content (Velite)**: `content/posts/<slug>/<locale>.mdx` — blog posts, 21 locale files per slug. `content/faqs/<slug>.mdx` — English-only single files. Velite output: `.velite/` (JSON data) + `public/static/` (hashed assets).
- **Auth**: better-auth (email/password + 2FA, `username` additional field) with Neon PostgreSQL via `pg` pool in `lib/auth.ts`.
- **Comments**: `blog_comments` table via `@neondatabase/serverless` in `lib/comment-db.ts`.
- **UI**: `components/ui/` (shadcn, eslint-ignored). `components/ui/` is ignored by eslint — do not lint.

## Content Authoring

### Blog posts — `content/posts/<slug>/<locale>.mdx`

Frontmatter fields that generate JSON-LD structured data: `faq`, `howTo`, `video`, `product`, `listing`, `software`, `event`, `speakable`. Set `postType` to one of: `blog` | `article` | `review` | `faq` | `video` | `howto` | `event` | `software` | `listing`.

### FAQs — `content/faqs/<slug>.mdx`

Frontmatter: `question`, `answer` (MDX), `category`, `order`, `tags`.

### Custom MDX components (globally available)

`Callout` (type: note/tip/warning/info/danger), `Badge` (variant: default/secondary/destructive/outline/ghost/link), `Card`/`CardHeader`/`CardTitle`/`CardDescription`/`CardContent`, `Tabs`/`TabsList`/`TabsTrigger`/`TabsContent`, `Accordion`/`AccordionItem`/`AccordionTrigger`/`AccordionContent`, `Kbd`, `KbdGroup`, `YouTubeEmbed` (id + title + optional start), `Alert`.

## ESLint

Uses `eslint-config-sheriff` (strict). Ignored: `components/ui/**`, `scripts/**`, `**/route.ts`, `next.config.ts`, `lib/utils.ts`, `components/theme-provider.tsx`, `public/sw.js`.

## Prettier

`semi: false`, `singleQuote: false`, `tabWidth: 2`, `trailingComma: es5`, `printWidth: 80`. Plugin: `prettier-plugin-tailwindcss`.

## Env

No `.env.example`. Required vars: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`. Optional: `NEXT_PUBLIC_GA4_ID`, `INDEXNOW_KEY`, `INDEXNOW_SITE_URL`.

## Quirks

- Middleware file is `proxy.ts`, not `middleware.ts` — Next.js supports this via `config.matcher` export.
- Two `[locale]` dirs exist (`[locale]` and `\[locale\]` — likely escaped/unescaped fs artifact).
- No test framework configured. No CI workflow found.

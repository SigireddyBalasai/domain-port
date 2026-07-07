import type { Linter } from "eslint"
import { defineConfig } from "eslint/config"
import { sheriff } from "eslint-config-sheriff"

const sheriffOptions = {
  react: false,
  next: true,
  astro: false,
  lodash: false,
  remeda: false,
  playwright: false,
  storybook: false,
  jest: false,
  vitest: false,
  tsconfigRootDir: import.meta.dirname,
}

export default defineConfig([
  {
    ignores: [
      "components/ui/**/*",
      "components/theme-provider.tsx",
      "lib/utils.ts",
      "**/route.ts",
      "**/route.tsx",
      "next.config.ts",
      "postcss.config.mjs",
      "scripts/**/*",
      "public/sw.js",
      "public/blog-manifest.json",
    ],
  },
  ...sheriff(sheriffOptions),
  {
    rules: {
      "func-style": "off",
    },
  },
  {
    files: ["app/**/layout.tsx", "app/**/page.tsx"],
    rules: {
      "react-refresh/only-export-components": "off",
    },
  },
  {
    files: ["app/**/loading.tsx"],
    rules: {
      "react/no-array-index-key": "off",
      "arrow-return-style/arrow-return-style": "off",
    },
  },
  {
    files: [
      "components/mdx-content.tsx",
      "components/blog/share-buttons.tsx",
      "components/google-analytics.tsx",
      "lib/json-ld.tsx",
    ],
  },
  {
    files: ["components/mdx-content.tsx"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
]) satisfies Linter.Config[]

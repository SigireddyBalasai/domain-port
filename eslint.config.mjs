import { sheriff } from "eslint-config-sheriff";
import { defineConfig } from "eslint/config";

const sheriffOptions = {
  react: true,
  next: true,
  astro: false,
  lodash: false,
  remeda: false,
  playwright: false,
  storybook: false,
  jest: false,
  vitest: false,
  tsconfigRootDir: import.meta.dirname,
};

export default defineConfig([
  {
    ignores: [
      "components/ui/**/*",
      "components/theme-provider.tsx",
      "lib/utils.ts",
      "next.config.mjs",
      "postcss.config.mjs",
    ],
  },
  ...sheriff(sheriffOptions),
  {
    files: ["components/mdx-content.tsx"],
    rules: {
      "react/function-component-definition": ["error", {
        namedComponents: "arrow-function",
      }],
    },
  },
]);

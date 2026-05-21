# Next.js template

This is a Next.js template with shadcn/ui.

## IndexNow

Set `INDEXNOW_KEY` in the deployment environment to enable IndexNow verification and postbuild submissions.
The key file is served from `/<INDEXNOW_KEY>.txt`, and the postbuild script submits URLs collected from the generated sitemap files.

## Adding components

To add components to your app, run the following command:

```bash
npx shadcn@latest add button
```

This will place the ui components in the `components` directory.

## Using components

To use the components in your app, import them as follows:

```tsx
import { Button } from "@/components/ui/button";
```

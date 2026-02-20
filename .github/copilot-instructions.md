# Copilot Instructions

## Project overview

Gatsby 5 + TypeScript site scaffolded for CMS integration. The `plugins` array in [gatsby-config.ts](../gatsby-config.ts) is the primary integration point — CMS source plugins (e.g. `gatsby-source-contentful`, `gatsby-source-sanity`) belong there. No CMS has been wired up yet.

## Dev workflows

```bash
npm run develop   # local dev at http://localhost:8000, GraphQL at http://localhost:8000/___graphql
npm run build     # production build to public/
npm run serve     # serve production build locally
npm run clean     # wipe .cache/ and public/
npm run typecheck # tsc --noEmit, no watch mode
```

Both `bun.lock` and `package-lock.json` are present — prefer **bun** for installs (`bun add <pkg>`), but `npm` scripts are the canonical run target.

## Key conventions

**File-based routing** — every `.tsx` file in `src/pages/` becomes a route automatically. `404.tsx` is the catch-all.

**GraphQL type generation** — `graphqlTypegen: true` in `gatsby-config.ts` means Gatsby auto-generates TypeScript types for all GraphQL queries into `src/gatsby-types.d.ts` on `develop`/`build`. Use the generated types instead of writing manual interfaces for query results.

**Head API** — use Gatsby's `HeadFC` named export for `<head>` metadata; do not add a separate `<Helmet>` library unless needed:

```tsx
export const Head: HeadFC = () => <title>Page Title</title>
```

**Inline styles** — existing pages (`index.tsx`, `404.tsx`) define styles as plain JS objects and pass them via the `style` prop. Follow this pattern for new pages until a CSS strategy is established. Do not introduce CSS Modules or styled-components without discussion.

**Page component signature** — use `React.FC<PageProps>` from `gatsby` for page components:

```tsx
import type { HeadFC, PageProps } from "gatsby"
const MyPage: React.FC<PageProps> = () => { ... }
```

## Adding a CMS

1. Install the source plugin (e.g. `bun add gatsby-source-contentful`).
2. Add its config object to the `plugins` array in `gatsby-config.ts`.
3. Run `gatsby develop` — GraphQL schema introspection populates `src/gatsby-types.d.ts`.
4. Query data with `useStaticQuery` or page-level GraphQL queries; use generated types.

## TypeScript config highlights

- `"jsx": "react"` (not `react-jsx`) — import React explicitly in every TSX file.
- `"moduleResolution": "node"` — standard Node resolution, no path aliases configured.
- Target: `esnext`; lib: `dom`, `esnext`.

# Copilot Instructions

## Project overview

**nateeCRM** — a full-featured CRM application built with Gatsby 5 + TypeScript + Theme UI. Provides contact management, deal pipeline (Kanban + list), activity tracking, company management, task boards, sales reports, and multi-platform integrations.

**Key directories:**

- `src/pages/` — file-based routes (Dashboard, Contacts, Deals, Activities, Settings, Reports, Companies, Tasks, Integrations)
- `src/components/` — shared components (`Layout.tsx` is the main shell with sidebar + topbar)
- `src/hooks/` — custom hooks (`useSettings.ts` manages integration config in localStorage)
- `src/services/` — integration adapter layer (`integrations.ts` — pluggable connectors for Airtable, HubSpot, Salesforce, ERP, Webhook, Custom API)
- `src/gatsby-plugin-theme-ui/` — Theme UI theme definition (design tokens)

## Dev workflows

```bash
npm run develop   # local dev at http://localhost:8001, GraphQL at http://localhost:8001/___graphql
npm run build     # production build to public/
npm run serve     # serve production build locally
npm run clean     # wipe .cache/ and public/
npm run typecheck # tsc --noEmit
```

## Key conventions

**File-based routing** — every `.tsx` file in `src/pages/` becomes a route automatically. `404.tsx` is the catch-all.

**GraphQL type generation** — `graphqlTypegen: true` in `gatsby-config.ts` auto-generates TypeScript types into `src/gatsby-types.d.ts`.

**Head API** — use Gatsby's `HeadFC` export for `<head>` metadata:

```tsx
export const Head: HeadFC = () => <title>Page Title | nateeCRM</title>
```

**Theme UI styling** — all styles via the `sx` prop using design tokens from `src/gatsby-plugin-theme-ui/index.ts`. Use `Box`, `Flex`, `Grid`, `Text`, `Button`, `Input` from `theme-ui`. Do not introduce CSS Modules, styled-components, or Tailwind.

**Page component signature:**

```tsx
import type { HeadFC, PageProps } from "gatsby"
const MyPage: React.FC<PageProps> = ({ location }) => {
  return (
    <Layout currentPath={location.pathname} title="Title">
      ...
    </Layout>
  )
}
export default MyPage
```

**Language** — UI labels in Indonesian, code in English.

## Integration architecture

All platform integrations implement `IntegrationAdapter` in `src/services/integrations.ts`:

```ts
interface IntegrationAdapter {
  fetchContacts(): Promise<Contact[]>
  fetchDeals(): Promise<Deal[]>
  fetchActivities(): Promise<Activity[]>
  fetchCompanies(): Promise<Company[]>
  testConnection(): Promise<boolean>
}
```

Currently supported:

- **Airtable** — via Personal Access Token + Base ID
- **HubSpot** — API key based
- **Salesforce** — OAuth based
- **ERP** — generic REST/SOAP endpoint
- **Webhook** — custom webhook endpoints
- **Custom API** — generic REST API connector

Configuration stored in `localStorage` via `useSettings()` hook.

## TypeScript config highlights

- `"jsx": "react-jsx"` with `"jsxImportSource": "theme-ui"`
- `"moduleResolution": "node"` — standard Node resolution
- `"strict": true`
- Target: `esnext`; lib: `dom`, `esnext`

## Design tokens reference

**Colors:** `primary` (#2563EB), `text` (#1E293B), `muted` (#64748B), `background` (#F0F7FF), `border` (#E2E8F0), `surface` (#F8FAFC), `sidebar` (#1E3A8A), `success` (#10B981), `warning` (#F59E0B), `danger` (#EF4444), `purple` (#8B5CF6)

**Radii:** `sm` (6), `md` (8), `lg` (10), `xl` (12), `pill`, `circle`

**Font sizes:** [11, 12, 13, 14, 15, 16, 18, 20, 24, 28, 32] (index 0-10)

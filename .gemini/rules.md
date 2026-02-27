# nateeCRM — Gemini Antigravity Rules

## Project Overview

**nateeCRM** is a full-featured CRM application built with **Gatsby 5**, **TypeScript**, and **Theme UI**. It provides contact management, deal pipeline tracking, activity logging, task management, company management, sales reports, and multi-platform integrations (Airtable, HubSpot, Salesforce, ERP, webhooks, custom APIs).

## Tech Stack

- **Framework:** Gatsby 5 (React 18, file-based routing)
- **Language:** TypeScript (`strict: true`, `jsx: react-jsx`, `jsxImportSource: theme-ui`)
- **Styling:** Theme UI — all styling via the `sx` prop. No CSS modules, no styled-components, no Tailwind.
- **State:** React hooks + `localStorage` via `useSettings()` for integration config
- **Data:** Pluggable adapters in `src/services/integrations.ts`. Currently supports Airtable; others in progress.
- **GraphQL typegen:** `graphqlTypegen: true` — types auto-generated into `src/gatsby-types.d.ts`

## Code Conventions

### Page Components

```tsx
import type { HeadFC, PageProps } from "gatsby"
const MyPage: React.FC<PageProps> = ({ location }) => {
  return (
    <Layout currentPath={location.pathname} title="Page Title">
      ...
    </Layout>
  )
}
export default MyPage
export const Head: HeadFC = () => <title>Page Title | nateeCRM</title>
```

### Styling

- Use Theme UI `sx` prop exclusively — never raw CSS or inline `style` prop on new code
- Reference theme tokens: `color="primary"`, `bg="surface"`, `borderColor="border"`, etc.
- Theme defined in `src/gatsby-plugin-theme-ui/index.ts`
- Radii: `sm` (6), `md` (8), `lg` (10), `xl` (12), `pill`, `circle`
- Shadows: `card`, `sm`

### Naming & Structure

- Pages: `src/pages/<name>.tsx` (kebab-case filename = route)
- Components: `src/components/<PascalCase>.tsx`
- Hooks: `src/hooks/use<Name>.ts`
- Services/adapters: `src/services/<name>.ts`

### Language

- **UI labels:** Indonesian (e.g. "Kontak", "Tambah", "Simpan Konfigurasi")
- **Code:** English (variable names, comments, types)

### Integration Architecture

All platform integrations follow the `IntegrationAdapter` interface in `src/services/integrations.ts`:

```ts
interface IntegrationAdapter {
  fetchContacts(): Promise<Contact[]>
  fetchDeals(): Promise<Deal[]>
  fetchActivities(): Promise<Activity[]>
  fetchCompanies(): Promise<Company[]>
  testConnection(): Promise<boolean>
}
```

Use `getAdapter(settings)` factory to get the correct adapter based on user config.

## Dev Workflows

```bash
npm run develop   # dev server at http://localhost:8001
npm run build     # production build
npm run typecheck # tsc --noEmit
npm run clean     # wipe .cache/ and public/
```

## Key Rules

1. **Never** introduce CSS Modules, styled-components, or Tailwind without explicit approval
2. **Always** use the `Layout` component wrapper for new pages
3. **Always** export `Head` with `<title>Page Title | nateeCRM</title>`
4. **Always** type page components as `React.FC<PageProps>`
5. **Always** use theme tokens from `theme-ui` — do not hardcode colors except in mock data
6. **Prefer** composing existing Theme UI primitives (`Box`, `Flex`, `Grid`, `Text`, `Button`, `Input`) over creating new DOM elements
7. **Mock data** stays in the page file as a const array — real data comes from the adapter layer
8. **Integration settings** are stored in `localStorage` via the `useSettings()` hook — never store API keys server-side in this client-only app

# Coding Standards

## General

- Use TypeScript everywhere.
- Prefer functional React components.
- Avoid `any`.
- Keep components focused on a single responsibility.

---

## Naming

Components

ProviderCard.tsx

Hooks

useProviders.ts

Utilities

providerUtils.ts

---

## Styling

- One CSS file per page/component when needed.
- Prefer reusable classes.
- Keep styles mobile-first.

---

## Imports

Order imports as:

1. React
2. Third-party libraries
3. Local components
4. CSS

---

## Before Every Commit

Run:

```bash
npm run build
```

Never commit code that doesn't build.
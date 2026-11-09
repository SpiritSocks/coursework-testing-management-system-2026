# STMS Frontend

React + TypeScript + Vite client for the Software Testing Management System (STMS) term project.

## Run

```bash
npm install
npm run dev      # dev server, /api is proxied to http://localhost:5221 (ASP.NET Core backend)
npm run build    # type-check + production build into dist/
npm run lint     # ESLint
```

## Structure

- `src/api` – calls to the backend REST API
- `src/components` – reusable UI pieces (sidebar, cards, forms, icons)
- `src/pages` – page-level components
- `src/types` – shared TypeScript types
- `src/utils` – small helpers (date formatting)

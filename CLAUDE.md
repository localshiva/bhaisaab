# Bhaisaab

Family finance tracker built with Next.js (App Router), Tailwind and shadcn/ui. A Google Sheet is the only database. There is no backend of its own. API routes read and write the sheet with the signed-in user's Google OAuth token.

## Done means

`pnpm check-types`, `pnpm lint` and `pnpm build` all pass. There are no tests. Only the build catches server code imported into the browser bundle.

## Feature docs are the requirements

Each feature's `docs/` folder holds its requirements. The doc defines what gets built, and the code follows it.

- Before working in a feature, read its `README.md` and the relevant files in its `docs/`.
- A change to behaviour updates the doc first. Behaviour means anything the user can see or do, or anything written to the sheet. Show the doc diff and wait for approval before writing code.
- Bug fixes where the code drifted from the doc, refactors and dependency bumps change code only.
- If the code and the doc disagree, the doc wins and the code is the bug.
- The doc change and the code change are separate commits, doc first.
- Doc format rules live in `.claude/rules/feature-docs.md`.

## Folder structure

```text
src/
  app/                          routing only: page.tsx, route.ts, layouts
  features/
    <name>/
      README.md                 orientation: purpose, routes, file map, docs index
      CLAUDE.md                 only when the feature has rules of its own
      docs/                     requirements, one file per capability
      <name>-page.tsx           page entry, default export
      <name>-route.ts           API handlers, re-exported by app/api
      _shared/
        components/             one component per file
        hooks/                  client hooks, one per file, named by action
        schemas/                zod schemas and request types, used by both sides
        types/
        utils/
        constants/
        server/                 Google Sheets reads and writes
      <sub-feature>/            same shape, for a related page
  shared/
    components/core/            shadcn primitives, no domain knowledge
    components/app/             app shell and components used by 2+ features
    hooks/
    providers/
    server/                     auth, env, Sheets client, cross-feature sheet helpers
    types/
    utils/                      safe on both client and server
docs/                           requirements that span several features
```

- Files under `app/` only render a feature's `<name>-page.tsx` or re-export handlers from a `<name>-route.ts`. No logic lives in `app/`.
- `_shared/` is private to its parent folder. Only `app/` may import a feature's root entry files.
- Code used by 2+ features moves to `shared/`. Code used by one feature stays in that feature.
- No doubled nesting such as `_shared/_shared/`.

## Server code never reaches the browser

- Every file under a `server/` folder starts with `import "server-only";`. The build then fails if client code imports it.
- Only `<name>-route.ts` files, `app/` server components and other `server/` files import from `server/`.
- Types and zod schemas that the client also needs go in `_shared/schemas/` or `_shared/types/`, never in `server/`.
- Google OAuth tokens stay on the server. Never add them to the session object or to an API response.

## Conventions

- Data fetching uses React Query hooks that call the app's own `/api/spreadsheet/*` routes through `shared/utils/http-client.ts`.
- API handlers validate request bodies with the feature's zod schema and return errors through `getServerError` from `shared/utils/error.ts`.
- Sheet layout is a contract. Column order and header rows are documented in each feature's docs. Changing them is a behaviour change.

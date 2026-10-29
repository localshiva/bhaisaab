# Fixed deposits

## Purpose

Tracks the family's fixed deposits (bank deposits locked for a set term at a set interest rate). Each deposit is one row of the `FD Report` sheet tab. The user adds or copies a deposit, deletes one, and sees the expected interest and how long each deposit has left.

## Routes

- Page `/fixed-deposits`
- API `/api/spreadsheet/fixed-deposits`, with `GET` and `POST`
- API `/api/spreadsheet/fixed-deposits/{id}`, with `DELETE`

## Files

| Path                           | Holds                                                                         |
| ------------------------------ | ----------------------------------------------------------------------------- |
| `fixed-deposits-page.tsx`      | Page entry. Renders the create button, the summary card and the deposit list. |
| `fixed-deposits-route.ts`      | Handlers for `/api/spreadsheet/fixed-deposits`. Re-exported by `app/api`.     |
| `fixed-deposit-by-id-route.ts` | Handler for `/api/spreadsheet/fixed-deposits/{id}`. Re-exported by `app/api`. |
| `_shared/components/`          | Create form, deposit list and cards, row actions menu, summary card.          |
| `_shared/hooks/`               | React Query hooks for each API call, and the create dialog's store.           |
| `_shared/schemas/`             | Zod schema for the create request, used by the form and the API handler.      |
| `_shared/types/`               | The deposit row type shared by client and server.                             |
| `_shared/utils/`               | Interest and maturity calculations.                                           |
| `_shared/constants/`           | React Query keys.                                                             |
| `_shared/server/`              | Google Sheets reads and writes, and the sheet tab name.                       |

## Docs

- [deposit-list.md](docs/deposit-list.md): what the deposit list and summary card show, and how interest is worked out. It also holds the sheet's column layout.
- [create-deposit.md](docs/create-deposit.md): creating a deposit, and copying an existing one into the create form.
- [delete-deposit.md](docs/delete-deposit.md): deleting a deposit row.

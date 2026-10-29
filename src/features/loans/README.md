# Loans

## Purpose

Tracks money the family has borrowed. Each loan is one row of the `Loan Report` sheet tab. The user adds a loan, records payments against it, and sees how much is paid and how much is still pending.

## Routes

- Page `/loans`
- API `/api/spreadsheet/loans`, with `GET`, `POST` and `DELETE`
- API `/api/spreadsheet/loans/payments`, with `GET` and `POST`

## Files

| Path                     | Holds                                                                       |
| ------------------------ | --------------------------------------------------------------------------- |
| `loans-page.tsx`         | Page entry. Renders the summary card and the loan list.                     |
| `loans-route.ts`         | Handlers for `/api/spreadsheet/loans`. Re-exported by `app/api`.            |
| `loan-payments-route.ts` | Handlers for `/api/spreadsheet/loans/payments`. Re-exported by `app/api`.   |
| `_shared/components/`    | Add loan form, loan list and cards, row actions menu, payment dialogs.      |
| `_shared/hooks/`         | React Query hooks for each API call, and the add loan dialog's open state.  |
| `_shared/schemas/`       | Zod schemas for the request bodies, used by the forms and the API handlers. |
| `_shared/types/`         | Request and row types shared by client and server.                          |
| `_shared/constants/`     | React Query keys.                                                           |
| `_shared/server/`        | Google Sheets reads and writes, and the sheet tab name.                     |

## Docs

- [loan-list.md](docs/loan-list.md): the loan list and the summary card. It also holds the sheet's column layout.
- [add-loan.md](docs/add-loan.md): adding a loan row.
- [delete-loan.md](docs/delete-loan.md): deleting a loan row.
- [loan-payments.md](docs/loan-payments.md): recording a payment and viewing a loan's payments.

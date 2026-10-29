# Monthly Expenses

## Purpose

Tracks the family's spending month by month, with each month as one row in the "Monthly Expense" tab of the Google Sheet. The list page shows every month with its money in hand, additional payment, total spent and what is left. A details page lists the single expenses of one month and lets the user edit or delete them.

## Routes

Pages:

- `/monthly-expenses` shows the month list. The app root `/` redirects here.
- `/monthly-expenses/monthly-expense-details?rowIndex=<row>&date=<month>` shows one month's expenses. A query param is a `key=value` pair after the `?` in a URL.

API endpoints:

| Method | Path                                                   | Does                                      |
| ------ | ------------------------------------------------------ | ----------------------------------------- |
| GET    | `/api/spreadsheet/monthly-expenses`                    | Lists every month row, columns A to E.    |
| GET    | `/api/spreadsheet/monthly-expenses/expense`            | Lists the expenses in one month's row.    |
| POST   | `/api/spreadsheet/monthly-expenses/expense`            | Adds an expense to a month.               |
| PUT    | `/api/spreadsheet/monthly-expenses/expense`            | Changes one expense's amount and comment. |
| DELETE | `/api/spreadsheet/monthly-expenses/expense`            | Clears one expense.                       |
| POST   | `/api/spreadsheet/monthly-expenses/additional-payment` | Sets a month's additional payment.        |

## Files

Entry files:

- `monthly-expenses-page.tsx` is the month list page.
- `monthly-expenses-route.ts` handles the month list GET.
- `expense-route.ts` handles GET, POST, PUT and DELETE for single expenses.
- `additional-payment-route.ts` handles the additional payment POST.
- `monthly-expense-details/monthly-expense-details-page.tsx` is the details page. It reads its query params and renders the expense list.

`_shared/` folders:

- `components/` holds the month list, month card, empty state, summary card, add expense dialog and additional payment dialog.
- `hooks/` holds one React Query hook per read or write. React Query is the library that fetches, caches and refreshes server data in the browser.
- `schemas/` holds the zod schemas for adding an expense and setting the additional payment. Zod checks that a request body has the right shape and values.
- `types/` holds the expense and month row types.
- `constants/` holds the React Query keys that writes use to refresh the right lists.
- `server/` holds the Google Sheets reads and writes and the tab name.
- `monthly-expense-details/_shared/components/` holds the details page's expense list with inline edit and delete.

## Docs

- [month-list.md](docs/month-list.md): the month list with its summary card and the full sheet layout.
- [add-expense.md](docs/add-expense.md): adding an expense with an optional comment.
- [additional-payment.md](docs/additional-payment.md): setting a month's additional payment.
- [expense-details.md](docs/expense-details.md): viewing, editing and deleting one month's expenses.
- [current-month-lock.md](docs/current-month-lock.md): how only the current month accepts changes.

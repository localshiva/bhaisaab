# Monthly Returns

## Purpose

Tracks the family's regular monthly income, such as salaries and rent received. Each income source is one row of the `Monthly Returns` sheet tab. The user sees the totals by income type, adds a source, and deletes one.

## Routes

- Page `/monthly-returns`
- API `/api/spreadsheet/monthly-returns`, with `GET`, `POST` and `DELETE`

## Files

| Path                       | Holds                                                                      |
| -------------------------- | -------------------------------------------------------------------------- |
| `monthly-returns-page.tsx` | Page entry. Renders the add button, the summary card and the source list.  |
| `monthly-returns-route.ts` | Handlers for `/api/spreadsheet/monthly-returns`. Re-exported by `app/api`. |
| `_shared/components/`      | Add source dialog, summary card, source list and source list item.         |
| `_shared/hooks/`           | React Query hooks for each API call.                                       |
| `_shared/schemas/`         | Zod schemas for the request bodies, used by the form and the API handlers. |
| `_shared/types/`           | The row type, an array of strings in column order.                         |
| `_shared/utils/`           | The total income calculation.                                              |
| `_shared/constants/`       | React Query keys.                                                          |
| `_shared/server/`          | Google Sheets reads and writes, and the sheet tab name.                    |

## Docs

- [income-list.md](docs/income-list.md): the summary card and the source list. It also holds the sheet's column layout.
- [add-income-source.md](docs/add-income-source.md): adding an income source row.
- [delete-income-source.md](docs/delete-income-source.md): deleting an income source row.

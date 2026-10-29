# Income list

## Purpose

Lets the user see every monthly income source and the totals for all income, salary and rent.

## Requirements

1. The `/monthly-returns` page shows the heading "Monthly Returns", the "Add new" button, the summary card and the source list, in that order.
2. The page fetches `GET /api/spreadsheet/monthly-returns` with React Query under the key `["monthlyReturns"]`. React Query is the library that fetches and caches data in the browser.
3. The API reads the range `Monthly Returns!A1:Z` and returns `{ success: true, data: { headers, rows } }`.
   - `headers` is sheet row 1.
   - `rows` is every row from sheet row 2 down, in sheet order.
   - Each row is an array of strings in column order `[type, source, amount]`.
4. While the request runs, the page shows the shared loading indicator.
5. The summary card is titled "Income Summary" and has three lines.
   - "Total Income": the sum of the amount of every row.
   - "Total Salary": the sum over rows whose type is exactly `Salary`.
   - "Total Rent": the sum over rows whose type is exactly `Rent`.
6. Each summary line shows "{n} sources" below its title, where n is the number of rows it sums.
7. Summary amounts are formatted as Indian Rupees with Indian digit grouping and up to two decimals, for example ₹1,25,000.
8. The summary card collapses and expands. It starts open, and the browser remembers the choice under the local storage key `amount-summary-mr-summary-card`.
9. The source list is titled "Monthly Sources". It shows one item per row, in sheet order.
10. Each item shows the source name, the type below it, the amount with a ₹ sign, and a delete button labelled "Delete {source}". The delete button is described in [delete-income-source.md](delete-income-source.md).
11. The list ends with a total line that shows "Total ({n} sources)" and the sum of every amount with a ₹ sign.
12. Amounts are summed after converting each amount string with `Number()`.

## Data

Sheet tab `Monthly Returns`. The API reads `A1:Z` as formatted values, which are the strings the sheet displays.

| Column | Field  | Format                                              |
| ------ | ------ | --------------------------------------------------- |
| A      | type   | text, `Salary` or `Rent` when added through the app |
| B      | source | text, the income source name                        |
| C      | amount | whole number, 1 or more, with no number formatting  |

Row 1 is the header row. Sources start at row 2. Columns D to Z are read and ignored.

## Decisions

- **Rows are arrays of strings in column order `[type, source, amount]`.** The Sheets API returns each row as an array of cell values in column order. The app uses that shape as is, with no mapping to objects.
- **The amount column has no number formatting.** The API reads displayed values, and the page converts them with `Number()`. A displayed value such as `₹1,000` or `1,000` does not convert to a number.

## Edge cases

- **Empty sheet.** The API returns empty `headers` and `rows`. The page shows an empty list, totals of ₹0, and "Total (0 sources)".
- **Header row only.** Same as an empty sheet, except `headers` holds the header row.
- **Other types.** A row whose type is neither `Salary` nor `Rent` counts only in "Total Income".
- **Failed request.** A toast shows the error, and the page shows "No data found".
- **Expired session.** The API answers 401 and the user is signed out. See [session-and-token-refresh.md](../../auth/docs/session-and-token-refresh.md).

# Income list

## Purpose

Lets the user see every monthly income source and the totals for all income, salary and rent.

## Requirements

1. The `/monthly-returns` page shows the heading "Monthly Returns", the "Add new" button, the summary card and the source list, in that order.
2. The page fetches `GET /api/spreadsheet/monthly-returns` with React Query under the key `["monthlyReturns"]`. React Query is the library that fetches and caches data in the browser.
3. The API reads the range `Monthly Returns!A1:Z` and returns `{ success: true, data: { headers, rows } }`.
   - `headers` is sheet row 1.
   - `rows` is every row from sheet row 2 down, in sheet order.
   - Each row is an array of strings in column order. Its first three entries are `[type, source, amount]`.
4. While the request runs, the page shows the shared loading indicator.
5. The summary card is titled "Income Summary" and has three lines.
   - "Total Income": the sum of the amount of every listed row.
   - "Total Salary": the sum over listed rows whose type is exactly `Salary`.
   - "Total Rent": the sum over listed rows whose type is exactly `Rent`.
6. Each summary line shows "{n} sources" below its title, where n is the number of rows it sums.
7. Every amount on the page is formatted with `formatCurrency` from `shared/utils/currency.ts`. That covers the summary lines, each list item and the list total. `formatCurrency` shows Indian Rupees with Indian digit grouping and up to two decimals, for example ₹1,25,000.
8. The summary card collapses and expands. It starts open, and the browser remembers the choice under the local storage key `amount-summary-mr-summary-card`.
9. The source list is titled "Monthly Sources". It shows one item per listed row, in sheet order.
10. Each item shows the source name, the type below it, the amount, and a delete button labelled "Delete {source}". The delete button is described in [delete-income-source.md](delete-income-source.md).
11. The list ends with a total line that shows "Total ({n} sources)" and the sum of every listed amount.
12. A row is listed when its amount in column C is present and converts to a finite number with `Number()`. A row with a missing, blank or non-numeric amount is skipped, and so is a blank row. A skipped row appears in neither the list, the summary card nor any total.
13. A listed item keeps its own sheet row as its delete `id`, even when rows above it are skipped.

## Data

Sheet tab `Monthly Returns`. The API reads `A1:Z` as formatted values, which are the strings the sheet displays.

| Column | Field        | Format                                              |
| ------ | ------------ | --------------------------------------------------- |
| A      | type         | text, `Salary` or `Rent` when added through the app |
| B      | source       | text, the income source name                        |
| C      | amount       | whole number, 1 or more, with no number formatting  |
| G      | Total Income | sheet total, row 2 only                             |
| H      | Total Salary | sheet total, row 2 only                             |
| I      | Total Rent   | sheet total, row 2 only                             |

Row 1 is the header row. Sources start at row 2. Columns D to Z are read and ignored.

Row 2 also holds three totals in `G2:I2`, with their labels `Total Income`, `Total Salary` and `Total Rent` in `G1:I1`. The sheet maintains these cells with its own formulas, and they are a sheet contract.

| Cell | Formula                        |
| ---- | ------------------------------ |
| G2   | `=SUM(C2:C)`                   |
| H2   | `=SUMIF(A2:A, "Salary", C2:C)` |
| I2   | `=SUMIF(A2:A, "Rent", C2:C)`   |

- The app never writes to columns G, H or I.
- The app never treats `G:I` values as a source. They reach the page inside the row 2 array and are ignored there, like the rest of columns D to Z.

## Decisions

- **Rows are arrays of strings in column order `[type, source, amount]`.** The Sheets API returns each row as an array of cell values in column order. The app uses that shape as is, with no mapping to objects.
- **The amount column has no number formatting.** The API reads displayed values, and the page converts them with `Number()`. A displayed value such as `₹1,000` or `1,000` does not convert to a number.
- **Every amount uses `formatCurrency`.** One format everywhere, so that the list, its total and the summary card read the same way.
- **Rows without a usable amount are skipped.** A missing or non-numeric amount would turn every total into `NaN`, and the item it rendered could not be deleted. A blank row has no amount, so the same rule skips it.
- **The page computes its own totals from columns A to C.** The sheet's totals in `G2:I2` belong to the sheet. The page does not read them as totals and the app never writes them.

## Edge cases

- **Empty sheet.** The API returns empty `headers` and `rows`. The page shows an empty list, totals of ₹0, and "Total (0 sources)".
- **Header row only.** Same as an empty sheet, except `headers` holds the header row.
- **Other types.** A row whose type is neither `Salary` nor `Rent` counts only in "Total Income".
- **Missing or non-numeric amount.** The row is skipped. The items below it keep their own sheet rows as delete ids.
- **Blank row between sources.** The row is skipped. The items below it keep their own sheet rows as delete ids.
- **Row 2 totals.** The `G2:I2` totals never show as an item and never count in a total. Row 2's own source in `A2:C2` is listed like any other.
- **Failed request.** A toast shows the error, and the page shows "No data found".
- **Expired session.** The API answers 401 and the user is signed out. See [session-and-token-refresh.md](../../auth/docs/session-and-token-refresh.md).

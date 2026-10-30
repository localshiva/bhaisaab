# Month list and summary

## Purpose

Lets the user see every month at a glance, with a summary of the latest month compared to the one before it. Each month card leads to that month's expense details.

## Requirements

1. The page lives at `/monthly-expenses`. The app root `/` redirects here.
2. The page heading reads "Monthly Expenses". Next to it, today's month in India time (the `Asia/Kolkata` time zone) shows in the form `October 2026` (date-fns pattern `MMMM yyyy`).
3. While the month list loads, the shared loading spinner with the text "Loading..." shows.
4. The list comes from `GET /api/spreadsheet/monthly-expenses`. The route reads range `Monthly Expense!A1:E`, treats row 1 as the header row and returns every later row with its sheet row number.
5. The route returns rows in reverse sheet order. The last row of the sheet comes first, which puts the newest month at the top.
6. Each returned row carries `originalRowIndex`, the 1-based sheet row number. 1-based means the first row is 1. Row 1 is the header. So, the first month row is 2. This number is how every other endpoint addresses the month.
7. A summary card titled "Expense Summary" sits above the list. Clicking its title collapses or expands it. It is open by default, and the browser remembers the choice in localStorage under the key `amount-summary-monthly-expense-summary-card`.
8. The summary card treats the first returned row as the latest month and the second as the month before. It shows three amounts, each rounded to whole rupees.

   | Title                   | Amount                 | Subtitle                                                                                                                                                                                                                                   |
   | ----------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
   | Current Month In Hand   | Column B, latest month | Column A text of the latest month. With no rows, today's month in India time as `October, 2026`.                                                                                                                                           |
   | Current Month Expenses  | Column D, latest month | `+N% vs last month` or `-N% vs last month`, where N is the change in column D rounded to a whole number. "No change from last month" when N is 0. No subtitle when there is no earlier month or the earlier month's column D is 0 or less. |
   | Current Month Remainder | Column E, latest month | "No previous data" with no earlier month. "No change" when both remainders are equal. "Gain from last month" when the latest remainder is higher. "Loss from last month" when it is lower.                                                 |

9. Amounts on this page show as Indian rupees with Indian digit grouping, for example `₹1,25,000`. Month cards keep up to two decimals. The summary card shows whole rupees.
10. Below the summary, a section titled "Your Monthly Expenses" shows one card per month in the order the route returns them. The grid has one column on phones, two on medium screens and three on large screens.
11. Each month card shows the following.
    - The month as `Oct, 2026` (pattern `MMM, yyyy`), parsed from column A.
    - A "Current", "Upcoming" or "Past" badge, as set out in [current-month-lock.md](current-month-lock.md).
    - "In Hand" from column B.
    - "Additional Payment" from column C, in green.
    - "Total Expense" from column D, in red.
    - "Remainder" from column E, in red when below 0, green when above 0, and the default text colour at 0.
    - "Expense Utilization" as a percentage and a bar.
    - A banner and two buttons, "Addn. Payment" and "Expenses", whose behaviour [current-month-lock.md](current-month-lock.md) covers.
12. Expense Utilization is column D divided by column B, times 100, rounded to a whole number and capped at 100. It is 0 when column B is 0 or less. The bar is green up to 60%, amber above 60% up to 80%, and red above 80%.
13. Clicking a month card anywhere outside its button row opens `/monthly-expenses/monthly-expense-details` with these query params.
    - `rowIndex` is the month's 1-based sheet row.
    - `date` is the column A text, URL-encoded.
14. Adding an expense, setting an additional payment, editing an expense and deleting an expense each refresh this list. Refresh means React Query marks its cached copy as out of date and fetches the list again.

## Data

Tab: `Monthly Expense`. This page reads `A1:E` with the Sheets default of formatted values, which means the text each cell displays.

The full row layout of the tab, which every capability in this feature shares:

| Row or column | Holds                                                                                            | Format                                                                                                     | Written by                                                                                                                         |
| ------------- | ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Row 1         | Header row                                                                                       | Text. The app skips it.                                                                                    | The sheet owner                                                                                                                    |
| Rows 2 onward | One month per row                                                                                | Oldest at the top, newest at the bottom. At most 25 rows.                                                  | [month-rollover.md](month-rollover.md) adds one row on the 1st of each month and deletes the oldest once there are 25              |
| A             | Month                                                                                            | A date, the first day of the month. Displays as full month name, comma, year, for example `January, 2025`. | [month-rollover.md](month-rollover.md). The app never writes it.                                                                   |
| B             | In Hand, which is the month's income, the previous month's remainder and column C added together | Plain number, may be negative. A formula while the month is the latest, then a fixed number.               | [month-rollover.md](month-rollover.md). The app never writes it.                                                                   |
| C             | Additional Payment. The sheet's header text for this column differs, see Decisions.              | Whole number. The month's one additional payment total.                                                    | [month-rollover.md](month-rollover.md) starts it at 0. After that, the app, through [additional-payment.md](additional-payment.md) |
| D             | Total Expense                                                                                    | Plain number, the sum of the expense cells                                                                 | The formula `=IF(A{row}="","", SUM(F{row}:ZZ{row}))`. The app never writes it.                                                     |
| E             | Remainder                                                                                        | Plain number, may be negative                                                                              | The formula `=IF(A{row}="","", B{row} - D{row})`. Column B already includes column C. The app never writes it.                     |
| F onward      | One expense per cell                                                                             | Whole number. The expense's comment is the cell's note. A cell holding text is not an expense.             | The app, through [add-expense.md](add-expense.md) and [expense-details.md](expense-details.md)                                     |

A note is the small text box Google Sheets attaches to a cell, shown when you hover over it. It is separate from the cell's value.

Index conventions used across the feature:

- `rowIndex` is always the 1-based sheet row. Row 1 is the header. So, the first month is row 2.
- `columnIndex` is always 0-based. Column A is 0 and column F, the first expense column, is 5.

Response of `GET /api/spreadsheet/monthly-expenses`:

```json
{
  "success": true,
  "data": {
    "headers": ["<row 1, columns A to E>"],
    "rows": [
      { "data": ["<A>", "<B>", "<C>", "<D>", "<E>"], "originalRowIndex": 14 }
    ]
  }
}
```

## Decisions

- **Months are listed newest first.** The current month is the one used most.
- **Dev and production use the same `Monthly Expense` tab.** Which spreadsheet the app opens comes from the `GOOGLE_SPREADSHEET_ID` environment variable, not from the tab name. So, the tab name needs no switch per environment. The Dev spreadsheet also has a `Monthly Expense Test` tab, which the app never reads.
- **The summary card's "latest month" is the last sheet row, not today's calendar month.** The card reads the first row the route returns, and the route returns rows in reverse sheet order. A row for today's month must exist in the sheet for the card to show today's figures. [month-rollover.md](month-rollover.md) adds that row on the 1st.
- **The heading and the empty summary use India time, the same as the lock.** On a device outside India, the device clock can sit in a different month from India around midnight on the 1st. The heading would then name a different month from the card marked "Current".
- **Columns B to E are read as displayed text and turned into numbers in the browser.** The list route uses the Sheets default of formatted values. So, these cells must display plain numbers for the page to read them.
- **The column C header text differs from the app's name for it.** The header reads "Additional Column" in production and "Additional Expense" in Dev, while the app calls it the additional payment. The app reads columns by position, not by header text. So, the headers need no rename.
- **The expenses amount has no comparison line without a usable earlier month.** With no earlier month, or an earlier total of 0 or less, there is nothing to compare against. "No change from last month" would claim a comparison that was never made.

## Edge cases

- **Empty tab.** The route returns no headers and no rows. The summary card shows ₹0 for all three amounts, today's month as the first subtitle, no subtitle under the expenses amount, and "No previous data". The list shows the empty state with the text "No monthly expenses added yet" and no "Your Monthly Expenses" heading.
- **Only one month row.** The summary card shows no subtitle under the expenses amount, and "No previous data" under the remainder.
- **Earlier month's column D is 0 or less.** The summary card shows no subtitle under the expenses amount.
- **Entirely empty month row.** The sheet returns no cells for it. Its card renders locked, like an unreadable column A (see [current-month-lock.md](current-month-lock.md)), with ₹0 amounts. As the latest month, the summary card shows ₹0 amounts and no month text.
- **Missing or non-numeric value in B to E.** It shows as ₹0. A cell that displays a currency symbol or thousands separators, such as `₹85,000`, also reads as ₹0.
- **Negative In Hand.** It shows as a negative amount, and Expense Utilization is 0%.
- **More expenses than column ZZ holds.** Column D sums up to column ZZ, while the app writes up to column ZZZ. A month with more than 697 expenses would show a Total Expense without the extra ones.
- **Failed list request.** A red toast, which is a small pop-up message, shows the error from the server. The page shows "No data found" in place of the summary and list.
- **Expired Google session.** The server answers 401 with the session-expired message. The browser signs the user out and sends them to `/auth/login?error=SessionExpired` without a toast.

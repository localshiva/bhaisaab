# Loan list

## Purpose

Shows every loan with its total, paid and pending amounts, and a summary of all loans together.

## Requirements

1. The page at `/loans` shows the heading "Loans" and an "Add new loan" button.
2. The page fetches `GET /api/spreadsheet/loans`. While the request runs, the page shows the shared loading spinner.
3. The API reads `Loan Report!A1:D` and returns `{ headers, rows }`. `headers` is sheet row 1. `rows` is every row after it, in sheet order.
4. A list position is a loan's only identifier. The loan at list position `i` (counted from 0) is sheet row `i + 2` (counted from 1).
5. The summary card has the title "Loan Summary" and shows three figures, each rounded to whole rupees.

   | Title                | Value           | Subtitle              |
   | -------------------- | --------------- | --------------------- |
   | Total Loan Amount    | sum of column B | `{n} total loans`     |
   | Total Paid Amount    | sum of column C | `{n} loans completed` |
   | Total Pending Amount | sum of column D | `{n} active loans`    |

6. A loan is active when its pending amount is above 0. Any other loan counts as completed.
7. The summary card can be collapsed. The browser remembers the open or closed state in `localStorage` under the key `amount-summary-loan-summary-card`. It starts open.
8. Below the summary, a card titled "Your Loans" shows one card per loan in sheet order.
9. Each loan card shows these items.
   - The provider name.
   - A badge that reads "Paid" when the pending amount is 0 or less, and "Active" otherwise.
   - "Total Loan Amount", "Amount Paid" and "Pending Amount", formatted as rupees.
   - "Payment Progress" as a whole percentage, `round(paid / loan amount × 100)`, capped at 100. It is 0 when the loan amount is 0 or less.
   - "This loan has been fully paid off!" when paid, or "₹X remaining to be paid." otherwise.
10. Each loan card has a menu with these items.
    - "Add Payment" while the loan is active. A paid loan shows a disabled "Fully Paid" item instead.
    - "View Payments".
    - "Delete".
11. Amounts are formatted as Indian rupees with Indian digit grouping, for example ₹1,25,000, with at most two decimals.

## Data

Sheet tab `Loan Report`. The list reads range `A1:D` with formatted values. Formatted means the text the sheet displays, not the raw number.

Row 1 is the header row. Each later row is one loan.

| Column   | Holds          | Format                     | Written by                                                |
| -------- | -------------- | -------------------------- | --------------------------------------------------------- |
| A        | Provider       | text                       | the app, when the loan is added                           |
| B        | Loan amount    | whole number, rupees       | the app, when the loan is added                           |
| C        | Paid amount    | whole number, rupees       | sheet formula `=SUM(E{row}:ZZZ{row})`, written by the app |
| D        | Pending amount | whole number, rupees       | sheet formula `=B{row}-C{row}`, written by the app        |
| E to ZZZ | Payments       | whole number, one per cell | the app, one cell per recorded payment                    |

The list does not read columns E onwards. [loan-payments.md](loan-payments.md) covers them.

## Decisions

- **The list position is the loan id.** The sheet has no id column. So, every action on a loan sends a row number worked out from the loan's position in the list.
- **Paid and pending come from the sheet, not the app.** Columns C and D are formulas. So, they stay correct when someone edits a payment cell directly in the sheet.

## Edge cases

- **Sheet with only a header row, or completely empty.** The API returns no rows. The page shows the summary card with ₹0 figures and an empty state that reads "No loans added yet" and "Add your first loan to track payments and pending amounts.", with an "Add new loan" button. That button opens the same dialog as the header's "Add new loan" button. Only one dialog opens.
- **A cell that is not a number.** The card and the summary treat it as 0.
- **Failed request.** A toast (a short pop-up message) shows the API's error message, and the page shows "No data found". A 500 response shows "There was an error processing your request. Please try again." instead of the API's message.
- **Expired Google session.** The API answers 401 and the app signs the user out to `/auth/login?error=SessionExpired`.

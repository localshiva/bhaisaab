# Deposit list

## Purpose

Shows every fixed deposit with its interest and time to maturity, and a summary of the deposits that are still active.

## Requirements

### Page and API

1. The page at `/fixed-deposits` shows the heading "Fixed Deposits" and an "Add new" button.
2. The page fetches `GET /api/spreadsheet/fixed-deposits`. While the request runs, the page shows the shared loading spinner.
3. The API reads `FD Report!A1:D` and returns `{ headers, rows }`. `headers` is sheet row 1. Each item of `rows` is `{ data, originalRowIndex }`.
   - `data` is the row's four cells, in column order.
   - `originalRowIndex` is the row's 0-based sheet row, header row included. 0-based means the count starts at 0. So, the header is row 0 and the first deposit is row 1.
4. The API returns the rows in reverse sheet order. The last row of the sheet comes first.

### Interest maths

5. Monthly interest is simple interest for one month: `amount × rate / 1200`. `rate` is the annual rate as a percentage, such as 7.5. Simple interest means interest is never added back to the amount.
6. Total expected interest is the monthly interest times the term in whole calendar months. The term is `(maturity year − deposit year) × 12 + (maturity month − deposit month)`. The day of the month is ignored.
7. A deposit is matured when its maturity date is at or before the current moment. Otherwise it is active.
8. Days left is `ceil((maturity date − now) / 1 day)`, and never below 0.

### Summary card

9. The summary card has the title "Fixed Deposit Summary" and shows three figures, each rounded to whole rupees. Only active deposits count towards the amounts.

   | Title             | Value                                                | Subtitle                  |
   | ----------------- | ---------------------------------------------------- | ------------------------- |
   | Active Investment | sum of active deposit amounts, each rounded          | `{n} active deposits`     |
   | Expected Interest | sum of active deposits' total interest, each rounded | `From active deposits`    |
   | Projected Value   | Active Investment plus Expected Interest             | `{a} active, {m} matured` |

10. The summary card can be collapsed. The browser remembers the open or closed state in `localStorage` under the key `amount-summary-fd-summary-card`. It starts open.

### Deposit cards

11. Below the summary, the page shows one card per deposit, in the order the API returns.
12. Each card shows these items.
    - "Fixed Deposit" and the amount, formatted as rupees.
    - A badge that reads "Matured" or "Active".
    - "Interest Rate" as `{rate}%`.
    - "Monthly Interest", formatted as rupees.
    - "From {deposit date}" and "To {maturity date}", formatted in the browser's locale.
    - "Maturity Progress" with `{n} days left`. The text turns amber when 30 or fewer days are left.
    - A progress bar of width `100 − days left / term in days × 100` percent, kept between 5 and 100.
    - "Total Expected Interest", formatted as rupees.
13. A matured card uses amber accents. An active card uses green accents.
14. Each card has a menu with "Copy" and "Delete". [create-deposit.md](create-deposit.md) covers Copy. [delete-deposit.md](delete-deposit.md) covers Delete.
15. Amounts are formatted as Indian rupees with Indian digit grouping, for example ₹1,25,000, with at most two decimals.

## Data

Sheet tab `FD Report`. The list reads range `A1:D` with formatted values. Formatted means the text the sheet displays, not the raw number or date.

Row 1 is the header row. Each later row is one deposit.

| Column | Holds         | Format                                | Written by                                         |
| ------ | ------------- | ------------------------------------- | -------------------------------------------------- |
| A      | Amount        | whole number, rupees                  | the app, as a number                               |
| B      | Interest rate | number, annual percentage such as 7.5 | the app, as a number                               |
| C      | Deposit date  | date                                  | the app, as the formula `=DATEVALUE("YYYY-MM-DD")` |
| D      | Maturity date | date                                  | the app, as the formula `=DATEVALUE("YYYY-MM-DD")` |

No column holds a sheet-computed total. The app computes all interest in the browser.

## Decisions

- **Rows are listed in reverse sheet order.** The most recently added deposit matters most.
- **Interest is simple interest over whole calendar months.** The family's FDs pay out interest monthly.
- **The summary leaves matured deposits out of the amounts.** Matured money is no longer invested.
- **`originalRowIndex` is the deposit id.** The sheet has no id column. The delete endpoint passes the number straight to `deleteDimension`, which counts rows from 0. So, the list sends the 0-based row.

## Edge cases

- **Sheet with only a header row, or completely empty.** The API returns no rows. The page shows the summary card with ₹0 figures and "0 active, 0 matured", and an empty state that reads "No fixed deposits yet" and "Create your first fixed deposit to track interest and maturity.", with an "Add new" button. That button opens the same dialog as the header's "Add new" button. Only one dialog opens.
- **Failed request.** A toast (a short pop-up message) shows the API's error message. A 500 response shows "There was an error processing your request. Please try again." instead. The page then shows the same view as an empty sheet.
- **Expired Google session.** The API answers 401 and the app signs the user out to `/auth/login?error=SessionExpired`.

# Create a deposit

## Purpose

Lets the user add a fixed deposit, either from a blank form or by copying an existing deposit into the form.

## Requirements

### The form

1. The "Add new" button opens a dialog titled "Add new fixed deposit" with the description "Add a new fixed deposit to track interest and maturity."
2. A blank form starts with these values.
   - Amount 0 and interest rate 0, shown as empty fields.
   - Deposit date today.
   - Maturity date one year after today.
3. "Deposit Amount" is a whole number of rupees, in a number field with `min` 1 and `step` 1. Typing a value below 1 turns it into 1. Clearing the field sets the amount to 0, which fails validation.
4. "Interest Rate (%)" is a number field with `min` 0.01 and `step` 0.01. Typing keeps the value between 0.01 and 100. Clearing the field sets the rate to 0, which fails validation.
5. "Deposit Date" is a date field. Clicking it opens the browser's date picker. Changing it sets the maturity date to one year after the new deposit date.
6. The maturity date is set through two number fields.
   - "Years", from 0 to 20.
   - "Months", from 0 to 11.
   - Each shows the gap between the deposit date and the current maturity date. Changing either one sets the maturity date to the deposit date plus those years and months.
7. Below them, the form shows "Matures on {date}", in the format `MMM d, yyyy`, for example "Apr 15, 2026".

### Validation

8. The form and the API both validate with `CreateFixedDepositSchema`.
   - `amount` must be a whole number of at least 1.
   - `interestRate` must be from 0.01 to 100.
   - `depositDate` and `maturityDate` must be strings in `YYYY-MM-DD` format.
   - The maturity date must be after the deposit date.
   - The maturity date must be at least 1 month after the deposit date.
   - The maturity date must be at most 20 years after the deposit date.
9. Date errors show under the maturity date. An invalid body sent to the API gets a 400 response with the error "The fixed deposit data you provided is invalid".

### Saving

10. Submitting sends `POST /api/spreadsheet/fixed-deposits` with `{ amount, interestRate, depositDate, maturityDate }`.
11. The API finds the target row: one below the last filled cell in column A. When column A is empty, the target is row 2.
12. The API writes the row in a single `batchUpdate` request with two parts.
    - Cells A to D get the amount as a number, the rate as a number, `=DATEVALUE("{depositDate}")` and `=DATEVALUE("{maturityDate}")`.
    - Cells A to D get a light grey background, red, green and blue each 0.95.
13. While the request runs, both dialog buttons are disabled and the submit button reads "Creating...".
14. On success, the dialog closes, the form returns to the blank values, any copied values are dropped, and the deposit list refetches. No success toast appears.
15. Closing the dialog any other way, with "Cancel", the Escape key or a click outside, also returns the form to the blank values and drops any copied values.

### Copy

16. The "Copy" item in a deposit card's menu opens the same dialog, prefilled with that deposit's amount, interest rate, deposit date and maturity date.
17. Copy passes the dates as the sheet returned them. The form turns each one into `YYYY-MM-DD` with `format(new Date(sheetDate), "yyyy-MM-dd")`.
18. Saving a copied deposit adds a new row. The original row is not changed.

## Data

Sheet tab `FD Report`. The API reads `A:A` to find the target row, then writes `A{row}:D{row}`.

| Column | Value written                  | Format                                |
| ------ | ------------------------------ | ------------------------------------- |
| A      | `amount`                       | whole number, rupees, 1+              |
| B      | `interestRate`                 | number, annual percentage such as 7.5 |
| C      | `=DATEVALUE("{depositDate}")`  | formula, the sheet stores a date      |
| D      | `=DATEVALUE("{maturityDate}")` | formula, the sheet stores a date      |

The full layout is in [deposit-list.md](deposit-list.md).

## Decisions

- **The amount is whole rupees, at least 1.** The family tracks whole rupees, and paise add noise. The interest rate keeps its decimals.
- **Changing the deposit date resets the term to 1 year.** 1 year is the most common term.
- **The term is 1 month to 20 years.** It covers the terms banks offer.
- **New rows get a light grey background.** It marks rows the app added, as opposed to rows typed by hand.
- **Dates are written as `DATEVALUE` formulas.** A plain string would sit in the sheet as text. `DATEVALUE` turns it into a real date that the sheet can format and compare.
- **Copy prefills the form from the sheet's own date strings.** The card shows dates through `toLocaleDateString`, whose output depends on the browser's locale, for example "15/4/2026" in an Indian locale. `new Date` cannot parse those strings reliably. So, Copy reads the dates the API returned instead of the text on the card.

## Edge cases

- **Empty sheet.** The deposit goes into row 2, below the header row.
- **Gaps in column A.** The new deposit goes below the last filled cell in column A. A gap above it stays empty.
- **Invalid input.** The form shows the field's error message and does not send the request.
- **Failed request.** A toast shows the API's error message. A 500 response shows "There was an error processing your request. Please try again." instead. The dialog stays open with the values the user entered.
- **`FD Report` tab missing.** The API answers 500 with the error "Sheet FD Report not found".

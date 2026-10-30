# Add a loan

## Purpose

Lets the user add a new loan with a provider name and an amount.

## Requirements

1. The "Add new loan" button opens a dialog titled "Add new loan" with the description "Add a new loan to track payments and pending amounts."
2. The form has two fields.
   - "Loan Provider", a required text field. An empty value shows "Provider name is required".
   - "Loan Amount", a whole number of rupees, at least 1.
3. Typing an amount below 1 into "Loan Amount" turns it into 1. Clearing the field sets the amount to 0, which fails validation.
4. Submitting sends `POST /api/spreadsheet/loans` with `{ provider, amount }`.
5. The API validates the body with `AddLoanSchema`, the same schema the form uses. `amount` must be a whole number of at least 1. An invalid body gets a 400 response with the error "The loan data you provided is invalid".
6. The API finds the target row: one below the last filled cell in column A. When column A is empty, the target is row 2.
7. The API writes the provider to column A and the amount to column B of the target row as `RAW`. `RAW` means the sheet stores each value exactly as sent, without parsing it as if a person typed it. The provider is stored as text, and the amount, sent as a number, is stored as a number.
8. The API then writes two formulas into the same row.
   - Column C: `=SUM(E{row}:ZZZ{row})`, the paid amount.
   - Column D: `=B{row}-C{row}`, the pending amount.
9. While the request runs, both dialog buttons are disabled and the submit button reads "Adding...".
10. On success, the dialog closes, the form resets, and the loan list refetches. A success toast reads "Loan from {provider} was added successfully".
11. On success, the app also drops every cached payment history. The next "View Payments" fetches the loan's payments again.

## Data

Sheet tab `Loan Report`. The API reads `A:A` to find the target row, then writes `A{row}:B{row}` as `RAW` values and `C{row}:D{row}` as formulas.

| Column | Value written           | Format                         |
| ------ | ----------------------- | ------------------------------ |
| A      | provider                | text                           |
| B      | amount                  | whole number, rupees, 1+       |
| C      | `=SUM(E{row}:ZZZ{row})` | formula, the sheet computes it |
| D      | `=B{row}-C{row}`        | formula, the sheet computes it |

Columns E onwards stay empty until a payment is recorded. The full layout is in [loan-list.md](loan-list.md).

## Decisions

- **The amount is whole rupees, at least 1.** The family tracks whole rupees, and paise add noise. There is no business minimum. The floor of 1 only rejects zero and negative amounts, and any real amount is allowed.
- **The provider is written as `RAW`.** The provider is free text from the user. Written as `USER_ENTERED`, a name that starts with `=` would become a formula, and one like `1/2` would become a date. `RAW` keeps it as the text the user typed.
- **Every successful write shows a success toast.** Adding a loan, adding a payment and deleting a loan each confirm with a short toast. It gives consistent feedback across the app.
- **Adding a loan drops the cached payment histories.** Payment histories are cached by sheet row. A new loan can land in a row that an earlier loan used, so a cached history could belong to another loan.
- **The paid formula sums up to column ZZZ.** Payments take one cell each from column E, with no column limit. ZZZ is the last column a Google Sheet can have. So, the formula covers every possible payment cell.
- **The API writes the formulas itself.** The sheet's `onEdit` script, which [loan-list.md](loan-list.md) describes, only runs for edits a person makes. Google does not run it for changes made through the Sheets API.

## Edge cases

- **Empty sheet.** The loan goes into row 2, below the header row.
- **Gaps in column A.** The new loan goes below the last filled cell in column A. A gap above it stays empty.
- **Provider that looks like a formula or a number.** A provider such as `=SUM(A1)` or `007` is stored as that exact text.
- **Invalid input.** The form shows the field's error message and does not send the request.
- **Failed request.** A toast shows the API's error message. A 500 response shows "There was an error processing your request. Please try again." instead. The dialog stays open with the values the user typed.
- **`Loan Report` tab missing.** The API answers 500 with the error "Sheet Loan Report not found".

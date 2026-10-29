# Loan payments

## Purpose

Lets the user record a payment towards a loan and see every payment made on it.

## Requirements

### Recording a payment

1. The "Add Payment" item in an active loan's menu opens a dialog titled "Add Payment for {provider}". Its description reads "Record a payment towards this loan. Pending amount: ₹X".
2. The form has one field, "Payment Amount", a whole number of rupees from 1 to the loan's pending amount.
3. Typing into "Payment Amount" keeps the value between 1 and the loan's pending amount. A value above the pending amount turns into the pending amount. A value below 1 turns into 1. Clearing the field sets the amount to 0, which fails validation.
4. Submitting sends `POST /api/spreadsheet/loans/payments` with `{ rowIndex, amount }`.
5. `rowIndex` is the loan's 1-based sheet row, header row included. 1-based means the count starts at 1, the way the sheet numbers its rows. The loan at list position `i` sends `rowIndex` `i + 2`.
6. The API validates the body with `AddLoanPaymentSchema`.
   - `rowIndex` must be a whole number of at least 2.
   - `amount` must be a whole number of at least 1.
   - An invalid body gets a 400 response with the error "The payment data you provided is invalid".
7. The API reads the loan's pending amount from column D of row `rowIndex`. A payment larger than the pending amount gets a 400 response with the error "Payment is more than the pending amount." The API writes nothing.
8. The API reads `Loan Report!E{rowIndex}:ZZZ{rowIndex}` as raw values. It counts the filled cells from column E up to the first empty cell, and writes the amount into that first empty cell as `USER_ENTERED`.
9. While the request runs, both dialog buttons are disabled and the submit button reads "Processing...".
10. On success, the dialog closes, the form resets, and both the loan list and this loan's payments refetch. A success toast reads "Payment of ₹X for {provider} was added successfully".

### Viewing payments

11. The "View Payments" item opens a dialog titled "Payment History for {provider}" with the description "Review all payments made towards this loan."
12. When it opens, the dialog fetches `GET /api/spreadsheet/loans/payments?rowIndex={rowIndex}`, with the same 1-based `rowIndex` as recording a payment. The page does not fetch payments for a loan whose dialog is closed.
13. The API rejects the request with a 400 response in two cases.
    - `rowIndex` is missing. The error is "Row index is required".
    - `rowIndex` does not parse to a whole number of at least 2. The error is "Invalid row index".
14. The API reads `Loan Report!E{rowIndex}:ZZZ{rowIndex}` as raw values and returns every filled cell in column order, as `{ amount, columnIndex }`. `columnIndex` is the cell's 0-based column. Column E, the first payment cell, is 4.
15. While loading, the dialog shows a spinner and "Loading payment history...".
16. With payments, the dialog shows these parts.
    - A "Payment Summary" with "Total Payments" (the count) and "Total Amount Paid" (the sum).
    - "Payment Details", which lists one entry per payment in column order. Each entry reads "Payment #{n}" with its amount, counting from 1. An entry shows no date.
17. A "Close" button closes the dialog.

## Data

Sheet tab `Loan Report`. Both endpoints work on one loan row, `rowIndex`, which is 2 or more. Row 1 is the header row. Recording a payment reads `D{row}` and `E{row}:ZZZ{row}`, then writes one cell. Viewing reads `E{row}:ZZZ{row}`. All reads use raw (unformatted) values.

| Column   | Holds                        | Format                   | Written by                             |
| -------- | ---------------------------- | ------------------------ | -------------------------------------- |
| C        | Paid amount, sum of E to ZZZ | whole number, rupees     | sheet formula                          |
| D        | Pending amount, B minus C    | whole number, rupees     | sheet formula                          |
| E to ZZZ | Payments, one per cell       | whole number, rupees, 1+ | the app, one cell per recorded payment |

The sheet stores only the amount of each payment. It stores no date, note or payer. The full layout is in [loan-list.md](loan-list.md).

## Decisions

- **Payments are whole rupees, at least 1.** The family tracks whole rupees, and paise add noise. There is no business minimum. The floor of 1 only rejects zero and negative amounts, and any real amount is allowed.
- **The API rejects a payment larger than the pending amount.** The form already caps the amount, but a browser-only cap can be bypassed by a direct request.
- **`rowIndex` must be at least 2.** Row 1 is the header and holds no loan.
- **Payment endpoints use a 1-based row.** They build A1 ranges such as `Loan Report!E5`, and A1 notation counts rows from 1. The delete endpoint differs, as [delete-loan.md](delete-loan.md) explains.
- **A payment goes into the first empty cell from column E, with no column limit.** Column letters go past Z, to AA, AB and onwards. A loan can have more payments than the 22 columns from E to Z.
- **Every successful write shows a success toast.** It gives consistent feedback across the app.
- **A payment entry shows no date.** The sheet stores no payment dates. A date worked out in the browser would be made up.
- **Payments are fetched only while the dialog is open.** Each loan card has its own dialog. Fetching on page load would send one request per loan that the user may never look at.
- **Paid and pending update without the app.** Writing the payment cell is enough. The sheet recalculates columns C and D.

## Edge cases

- **No payments.** The dialog shows "No payments found" and "There are no recorded payments for this loan yet."
- **A gap in the payment cells.** Viewing skips the empty cell. Recording a payment fills the first empty cell, which is the gap.
- **Fully paid loan.** The menu shows a disabled "Fully Paid" item in place of "Add Payment".
- **Invalid input.** The form shows the field's error message and does not send the request.
- **Payment above the pending amount.** The API answers 400 and the toast reads "Payment is more than the pending amount."
- **Failed request.** A toast shows the API's error message. A 500 response shows "There was an error processing your request. Please try again." instead. On a failed payment, the dialog stays open.

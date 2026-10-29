# Delete a loan

## Purpose

Lets the user remove a loan and all its payments.

## Requirements

1. The "Delete" item in a loan card's menu opens a confirmation dialog with the message "Are you sure you want to delete this loan from {provider}? This action cannot be undone." and a "Delete" button.
2. Confirming sends `DELETE /api/spreadsheet/loans` with the body `{ rowIndex }`.
3. `rowIndex` is the loan's 0-based sheet row, header row included. 0-based means the count starts at 0. So, the header row is row 0. The loan at list position `i` sends `rowIndex` `i + 1`.
4. The API validates the body with `DeleteLoanSchema`. `rowIndex` must be a whole number of at least 1. Anything else gets a 400 response with the error "The delete request data you provided is invalid".
5. The API looks up the numeric id of the `Loan Report` tab, then removes the whole row with a `deleteDimension` request. `deleteDimension` is the Sheets request that deletes rows and shifts the rows below it up.
6. The loan's payment cells are in the same row. So, they are deleted with it.
7. While the request runs, the menu's delete item is disabled and reads "Deleting...".
8. On success, a success toast reads "Loan from {provider} was deleted successfully", and the loan list refetches.
9. On success, the app also drops every cached payment history. The next "View Payments" fetches the loan's payments again.

## Data

Sheet tab `Loan Report`. The API deletes one whole row, columns A to the last column. Rows below it move up by one. The column layout is in [loan-list.md](loan-list.md).

## Decisions

- **Delete uses a 0-based row, while the payment endpoints use a 1-based row.** `deleteDimension` counts rows from 0. A1 notation, the `Loan Report!E5` style the payment endpoints build, counts rows from 1.
- **Every successful write shows a success toast.** It gives consistent feedback across the app.
- **Deleting a loan drops the cached payment histories.** Payment histories are cached by sheet row. The rows below a deleted loan move up, so a cached history would show the payments of the loan that used to sit in that row.
- **`rowIndex` must be at least 1.** Row 0 is the header row. Rejecting it keeps the header from being deleted.

## Edge cases

- **Stale list.** The row number comes from the list on screen. If the sheet changed since the list loaded, the request deletes whichever loan now sits in that row.
- **Failed request.** A toast shows the API's error message. A 500 response shows "There was an error processing your request. Please try again." instead.
- **`Loan Report` tab missing.** The API answers 500 with the error "Sheet Loan Report not found".

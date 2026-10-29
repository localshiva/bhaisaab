# Delete a deposit

## Purpose

Lets the user remove a fixed deposit.

## Requirements

1. The "Delete" item in a deposit card's menu opens a confirmation dialog with the message "Are you sure you want to delete this fixed deposit of ₹X? This action cannot be undone." and a "Delete" button.
2. Confirming sends `DELETE /api/spreadsheet/fixed-deposits/{id}`, where `id` is the deposit's `originalRowIndex`. [deposit-list.md](deposit-list.md) defines it as the 0-based sheet row, header row included.
3. The API rejects the request with a 400 response in two cases.
   - `id` is missing. The error is "Fixed deposit ID is required".
   - `id` is not a whole number, or is less than 1. The error is "Fixed deposit ID should be a row number".
4. The API looks up the numeric id of the `FD Report` tab, then removes the whole row with a `deleteDimension` request. `deleteDimension` is the Sheets request that deletes rows and shifts the rows below it up.
5. While the request runs, the delete item in the card's menu is disabled and reads "Deleting...".
6. On success, the deposit list refetches. No success toast appears.

## Data

Sheet tab `FD Report`. The API deletes one whole row. Rows below it move up by one. The column layout is in [deposit-list.md](deposit-list.md).

## Decisions

- **The API rejects ids that are not whole numbers or that point at the header row.** The id goes straight to `deleteDimension`, which counts rows from 0. Row 0 is the header row, and deleting it would break the sheet's column labels. A fractional id names no row.

## Edge cases

- **Stale list.** The id comes from the list on screen. If the sheet changed since the list loaded, the request deletes whichever deposit now sits in that row.
- **Failed request.** A toast shows the API's error message. A 500 response shows "There was an error processing your request. Please try again." instead.
- **`FD Report` tab missing.** The API answers 500 with the error "Sheet FD Report not found".

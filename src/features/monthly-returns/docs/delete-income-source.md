# Delete an income source

## Purpose

Lets the user remove an income source from the sheet.

## Requirements

1. Clicking an item's delete button opens a confirmation dialog with the message "Are you sure you want to delete {source}? This action cannot be undone.", a "Cancel" button and a "Delete" button.
2. "Cancel" closes the dialog and sends nothing.
3. "Delete" sends `DELETE /api/spreadsheet/monthly-returns` with `{ id, source }`.
   - `id` is the source's 0-based sheet row, where the header row is 0. The first source has id 1.
   - `source` is the item's source name.
4. The API validates the body with `DeleteSourceSchema`. `id` must be a number of at least 1, and `source` must be a non-empty string. An invalid body gets a 400 response with the error "The delete request data you provided is invalid".
5. The API looks up the numeric sheet ID of the `Monthly Returns` tab. When the tab is missing, the request fails with "Sheet Monthly Returns not found".
6. The API reads `A{id + 1}:C{id + 1}`, which is the same row in the sheet's 1-based row numbers.
7. When that row is empty, the API answers 404 with the error "Row not found".
8. When that row's column B is not exactly equal to `source`, the API answers 409 with the error "Income Source does not match".
9. Otherwise the API deletes only the cells `A:C` of that row. The `A:C` cells below it move up by one. Columns D onwards are not touched.
10. A successful delete returns `{ success: true, message: "Source deleted successfully" }`.
11. While the request runs, that item's delete button is disabled and shows a spinner.
12. On success, a toast shows "Source deleted successfully" and the income list refetches.
13. On failure, a toast shows the error. For a 404 or a 409 that is the API's own message.

## Data

Sheet tab `Monthly Returns`. The API reads `A{id + 1}:C{id + 1}` and compares column B, then deletes the cells `A:C` at 0-based row index `id` and shifts the `A:C` cells below up.

| Column | Use in this capability      |
| ------ | --------------------------- |
| A      | read, not checked           |
| B      | must equal `source` exactly |
| C      | read, not checked           |

The full layout is in [income-list.md](income-list.md).

## Decisions

- **A delete asks for confirmation first.** A delete cannot be undone and shifts the rows below it. Loans, fixed deposits and expenses confirm their deletes the same way.
- **A delete removes only `A:C`, never the whole row.** Row 2 also holds the sheet's total formulas in `G2:I2`. Deleting the whole row would delete those formulas together with the first source, and the [month rollover](../../monthly-expenses/docs/month-rollover.md) reads `G2`. The formulas read open-ended ranges that start at row 2, such as `C2:C`. So, they keep working after the `A:C` cells shift up.
- **`id` is a 0-based sheet row with the header at 0.** The Sheets API addresses the deleted range by 0-based row index. So, the API passes `id` straight to the delete call and adds 1 only to build the A1 range it reads.
- **`id` must be at least 1.** Row 0 is the header row.
- **`source` must match column B.** Rows shift up after every delete, and the sheet can also be edited outside the app. The check stops a stale `id` from deleting a different source.
- **A missing row and a mismatched source are client errors.** They answer 404 and 409 with their own message, so that the toast tells the user why the delete failed. Any other failure answers 500, and the toast shows a generic message.
- **A successful delete shows a short success toast.** Every successful write in the app gives the same feedback.
- **The API looks up the tab's numeric sheet ID.** The Sheets API addresses a range delete by sheet ID, not by tab name.

## Edge cases

- **User cancels.** The dialog closes and the row stays.
- **Row moved since the list loaded.** The source check answers 409, a toast shows "Income Source does not match", and nothing is deleted.
- **Row emptied since the list loaded.** The API answers 404, a toast shows "Row not found", and nothing is deleted.
- **`id` of 0.** The API answers 400 and the header row stays.
- **Deleting the first source (row 2).** Its `A2:C2` cells are removed and the next source moves into row 2. The `G2:I2` totals stay in place and recalculate.
- **Invalid input.** The API answers 400 and a toast shows the error.
- **Failed request.** A toast shows the error and the list stays as it was.

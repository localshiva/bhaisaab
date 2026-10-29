# Add an expense

## Purpose

Lets the user record one expense, with an optional comment, against the current month.

## Requirements

1. The add expense dialog opens from two places, and only for a month that accepts expenses (see [current-month-lock.md](current-month-lock.md)).
   - The "Expenses" button on a month card on the list page.
   - The "+ Expense" button on that month's details page.
2. The dialog title reads "Add Expense for {date}", where `{date}` is the month's column A text. The description reads "Record an expense for this month with optional details."
3. The dialog has two fields.
   - "Expense Amount", a number input, empty when the dialog opens.
   - "Comment (Optional)", a multi-line text box with the placeholder "E.g., Car maintenance at Lakozy".
4. The amount must be a whole number of at least 1, in rupees with no paise. The amount input turns any typed value below 1 into 1. An empty amount fails with the message "Amount must be greater than 0" under the field. An amount with a decimal part fails with the message "Amount must be a whole number". In both cases nothing is sent.
5. The dialog and `POST /api/spreadsheet/monthly-expenses/expense` check the body with the same zod schema, `AddMonthlyExpenseSchema`.
   - `rowIndex` is a positive whole number, the month's 1-based sheet row.
   - `amount` is a whole number of at least 1.
   - `comment` is an optional string.
6. The route rejects an invalid body with status 400 and the error "The expense data you provided is invalid".
7. The route rejects a month that is not current with status 403 and the error "Only the current month can be changed.", and writes nothing (see [current-month-lock.md](current-month-lock.md)).
8. The route reads the month's row from column F to column ZZZ as raw values. It counts filled cells from F until it meets the first empty one, and writes the amount into that empty cell.
9. The amount is written with the Sheets `USER_ENTERED` option, which stores it as if a person had typed it into the cell.
10. When the comment is not empty, the route stores it as the note on the same cell. An empty comment leaves the cell's note untouched.
11. On success the route answers `{ success: true, message: "Expense added successfully" }`.
12. While saving, the "Cancel" and "Add Expense" buttons are disabled and "Add Expense" reads "Processing...".
13. On success the dialog closes and its fields clear. The month list and that month's expense list both refresh.
14. On failure the dialog stays open with the entered values.

## Data

Tab: `Monthly Expense`.

- Read: `A{rowIndex}` as displayed text, for the lock check.
- Read: `F{rowIndex}:ZZZ{rowIndex}` with raw (unformatted) values, to find the next empty cell.
- Write: the single cell `{column}{rowIndex}`, where the column is the first empty one from F onward.
- Note: the same cell, through the Sheets `batchUpdate` call, with 0-based `startRowIndex = rowIndex - 1` and `startColumnIndex` equal to the cell's 0-based column. The route first looks up the tab's numeric sheet ID by its name.

Request body:

| Field      | Type   | Rule                                       |
| ---------- | ------ | ------------------------------------------ |
| `rowIndex` | number | Whole number, 1 or more. 1-based row.      |
| `amount`   | number | Whole number, 1 or more. Rupees, no paise. |
| `comment`  | string | Optional                                   |

Column layout of the tab: [month-list.md](month-list.md#data).

## Decisions

- **The amount must be at least 1.** This is not a business minimum. It rules out zero, negative amounts and amounts below one rupee, and any real amount from 1 upward is allowed.
- **The amount is a whole number of rupees.** The family tracks whole rupees, and paise only add noise.
- **A new expense fills the first empty cell from column F, not the cell after the last one.** Deleting an expense empties its cell and leaves a gap. Filling the first gap reuses that slot instead of letting the row grow with holes.
- **Adding and viewing both read the row from F up to ZZZ.** Both must agree on which cells hold expenses. Otherwise an add could write into a cell the details page never shows. ZZZ is the last column a Google Sheet can have.
- **The comment is a cell note, written in a second call.** The Sheets values API cannot write notes, only `batchUpdate` can. The route skips that call when there is no comment.

## Edge cases

- **Month that is not current.** The route answers 403 with "Only the current month can be changed." A red toast shows that message and the dialog stays open.
- **Row with no expenses yet.** The amount goes into column F.
- **Row with a gap from a deleted expense.** The amount goes into the leftmost empty cell from F.
- **The note write fails after the amount is written.** The amount stays in the sheet without its comment, and the request reports an error.
- **Failed request.** A red toast shows the server's error message. A server error with status 500 shows "There was an error processing your request. Please try again."
- **Expired Google session.** The browser signs the user out to `/auth/login?error=SessionExpired` without a toast.

# Expense details

## Purpose

Lets the user see every single expense recorded for one month, with its comment. For the current month, the user can also add, edit and delete expenses here.

## Requirements

### Page and header

1. The page lives at `/monthly-expenses/monthly-expense-details` and reads two query params.
   - `rowIndex`, the month's 1-based sheet row.
   - `date`, the month's column A text, URL-decoded before display.
2. A back arrow button returns to the previous page in the browser history.
3. The title reads "Expenses for {date}".
4. When the month has at least one expense, a line under the title reads "{n} expense · Total: {amount}" or "{n} expenses · Total: {amount}". The total is the sum of the listed amounts, added up in the browser.
5. When the expense response says `isCurrentMonth` is `true`, a "+ Expense" button sits at the top right. It opens the same add expense dialog as the list page, for this month (see [add-expense.md](add-expense.md)).

### Viewing

6. The expenses come from `GET /api/spreadsheet/monthly-expenses/expense?rowIndex={rowIndex}`.
7. The route reads the month's row from column F to column ZZZ as raw values, then reads the notes of the same range in a second call. It also reads `A{rowIndex}` to work out `isCurrentMonth` with the rule in [current-month-lock.md](current-month-lock.md).
8. The route answers `{ success: true, data: { isCurrentMonth, expenses } }`. `expenses` holds one item per cell that holds a number, in column order from left to right. Empty cells and cells holding text are skipped. Each item has the amount as a number, the cell's note as `comment`, and the cell's 0-based `columnIndex`.
9. While the expenses load, six placeholder cards show.
10. Each expense shows as a card with the amount in rupees, the label "Item #{n}" where n counts from 1 in display order, and the comment underneath when there is one.
11. Cards sit in a grid of one column on phones, two on medium screens and three on large screens.

### Editing

12. When `isCurrentMonth` is `true`, each card has an edit button and a delete button, with the tooltips "Edit expense" and "Delete expense". Otherwise, and while the expenses load, neither button shows.
13. Clicking edit turns that card into a form titled "Edit Expense #{n}" with an "Amount" number field and a "Comment (Optional)" text box, both filled with the current values. Only one card is in edit mode at a time. Opening another card's form drops unsaved changes in the first.
14. "Cancel" leaves edit mode without saving.
15. "Save" requires a whole number of at least 1. Any other amount, including one with paise, shows the error toast "Please enter a valid amount" and sends nothing.
16. The comment is trimmed of leading and trailing spaces. An empty comment after trimming clears the cell's note.
17. Save sends `PUT /api/spreadsheet/monthly-expenses/expense`. The route rejects a month that is not current with 403 (see [current-month-lock.md](current-month-lock.md)). Otherwise it writes the new amount into the same cell with the Sheets `USER_ENTERED` option, then replaces the cell's note with the comment.
18. While saving, both fields and both buttons are disabled and "Save" reads "Saving...".
19. On success a toast reads "Expense updated successfully", the card leaves edit mode, and the month list and this month's expenses both refresh.
20. On failure the card stays in edit mode with the entered values.

### Deleting

21. Clicking delete opens a confirmation dialog with the message "Are you sure you want to delete this expense? This action cannot be undone." and the buttons "Cancel" and "Delete".
22. Confirming sends `DELETE /api/spreadsheet/monthly-expenses/expense?rowIndex={rowIndex}&columnIndex={columnIndex}`.
23. The route rejects a month that is not current with 403 (see [current-month-lock.md](current-month-lock.md)). Otherwise it empties the cell's value and clears its note. The cell stays in place and the other expenses keep their columns.
24. On success a toast reads "Expense deleted successfully", the dialog closes, and the month list and this month's expenses both refresh. The remaining cards renumber from "Item #1".

## Data

Tab: `Monthly Expense`. Column layout of the tab: [month-list.md](month-list.md#data).

| Endpoint | Reads or writes                                                                                                              | Row                                                              | Column                                                           |
| -------- | ---------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------- |
| GET      | Values of `F{rowIndex}:ZZZ{rowIndex}` as raw numbers, then the notes of the same range, then `A{rowIndex}` as displayed text | `rowIndex`, 1-based                                              | Returns `columnIndex` 0-based. F is 5.                           |
| PUT      | Reads `A{rowIndex}` for the lock. Writes the value of one cell, then its note through `batchUpdate`.                         | `rowIndex`, 1-based. The note call uses `rowIndex - 1`, 0-based. | `columnIndex`, 0-based, turned into a letter for the value write |
| DELETE   | Reads `A{rowIndex}` for the lock. Writes an empty value to one cell, then an empty note through `batchUpdate`.               | `rowIndex`, 1-based. The note call uses `rowIndex - 1`, 0-based. | `columnIndex`, 0-based                                           |

GET response `data`:

| Field            | Type    | Meaning                                                                                             |
| ---------------- | ------- | --------------------------------------------------------------------------------------------------- |
| `isCurrentMonth` | boolean | Whether the row is the current month, by the rule in [current-month-lock.md](current-month-lock.md) |
| `expenses`       | array   | One item per expense cell that holds a number, left to right                                        |

Each item in `expenses`:

| Field         | Type   | Meaning                                   |
| ------------- | ------ | ----------------------------------------- |
| `amount`      | number | The cell's raw numeric value              |
| `comment`     | string | The cell's note. Absent when it has none. |
| `columnIndex` | number | The cell's 0-based column                 |

PUT body:

| Field         | Type   | Rule                                             |
| ------------- | ------ | ------------------------------------------------ |
| `rowIndex`    | number | Whole number, 1 or more. 1-based row.            |
| `columnIndex` | number | Whole number, 5 or more. 0-based. Column F is 5. |
| `amount`      | number | Whole number, 1 or more. Rupees, no paise.       |
| `comment`     | string | Optional. Missing clears the note.               |

DELETE query params:

- `rowIndex` is a whole number, 1 or more, 1-based.
- `columnIndex` is a whole number, 5 or more, 0-based. Column F is 5.

## Decisions

- **Edit and delete are hidden for past months.** Past months are closed, and changing an expense would change a closed month's totals.
- **The lock state comes from the server, not from the URL.** A browser-only lock can be bypassed by an edited URL. The server works out `isCurrentMonth` from the sheet itself.
- **The "+ Expense" button opens the same add expense dialog as the list page.** Adding from either page then runs the same checks and writes to the same cell.
- **Edit amounts are whole numbers of at least 1, the same as adding.** The family tracks whole rupees, and paise only add noise. There is no business minimum beyond 1, and any real amount from 1 upward is allowed.
- **Delete empties the cell instead of removing it.** Removing a cell would shift every later expense one column left. The `columnIndex` values the page already holds would then point at the wrong expenses, and the next add reuses the gap anyway.
- **The route reads the row twice.** The Sheets values API does not return notes. So, a second call to the spreadsheet API fetches the notes for the same range.
- **Edit and delete only reach columns F onward.** Columns A to E hold the month, In Hand, the additional payment, Total and Remainder. A `columnIndex` below 5 would overwrite or clear one of them.
- **A cell holding text is not an expense.** Text has no amount. Listing it would show ₹NaN and break the total.
- **Every successful write shows a short success toast.** Adding, setting the additional payment, editing and deleting all give the same kind of feedback across the app.

## Edge cases

- **Missing `rowIndex` or `date` in the page URL.** The page sends no request. It shows "No month selected." with a "Back to monthly expenses" link to `/monthly-expenses`.
- **Text in an expense cell.** The cell does not show as a card and does not count towards the count or the total.

- **Month with no expenses.** The page shows "No expenses recorded". Underneath, it reads "Add your first expense to get started." when `isCurrentMonth` is `true`, and "There are no expenses recorded for this month." otherwise. The count and total line does not show.
- **Existing expense with paise.** It shows with its decimals. Saving an edit requires changing the amount to a whole number.
- **Write to a month that is not current.** The PUT or DELETE answers 403 with "Only the current month can be changed." and the sheet does not change.
- **Missing `rowIndex` on the GET.** The route answers 400 with "Row index is required".
- **`rowIndex` that is not a positive whole number.** The GET answers 400 with "Invalid row index". The DELETE answers 400 with "Invalid parameters".
- **Missing `rowIndex` or `columnIndex` on the DELETE.** The route answers 400 with "Both rowIndex and columnIndex are required".
- **Invalid PUT body.** The route answers 400 with "The expense update data you provided is invalid".
- **`columnIndex` below 5.** The PUT answers 400 with "The expense update data you provided is invalid". The DELETE answers 400 with "Invalid parameters". The sheet does not change.
- **Failed request.** A red toast shows the server's error message. A failed expense fetch also shows the empty state, with the change controls hidden.
- **Expired Google session.** The browser signs the user out to `/auth/login?error=SessionExpired` without a toast.

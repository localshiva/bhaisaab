# Current month lock

## Purpose

Decides which month accepts changes. Only the current month can take a new expense, an additional payment, or an edit or delete of an expense. Every other month is read-only, in the app and on the server.

## Requirements

### The rule

1. A month is current when its column A text, read as the first day of that month, falls in the same month and year as today in India time (the `Asia/Kolkata` time zone).
2. Column A is parsed by splitting `January, 2025` at the comma into a month name and a year, then reading it as `January 1, 2025`.
3. A row whose column A is empty or cannot be read as a month is not current.

### Month list

4. The list page applies the rule in the browser, using today's date in India time, whatever the device's own time zone.
5. A month card shows a badge reading "Current" in blue for the current month, and "Past" in grey for every other month.
6. A month card shows a banner. It reads "You can add expenses for this month." for the current month and "This is a past month, expenses are locked." for every other month.
7. For the current month, the "Addn. Payment" button opens the additional payment dialog and the "Expenses" button opens the add expense dialog.
8. For every other month, both buttons look disabled, at half opacity with a not-allowed cursor, and carry `aria-disabled="true"`. They stay clickable. Clicking either one opens no dialog and shows an info toast reading "{month} is a past month. You can only add payments and expenses for the current month.", where `{month}` is in the form `Oct, 2026`.
9. Clicking either button never opens the details page, for any month.

### Details page

10. The details page takes the lock state from the `isCurrentMonth` field of the `GET /api/spreadsheet/monthly-expenses/expense` response. The server works it out with the rule above. No URL param grants or removes permission.
11. When `isCurrentMonth` is `true`, the page shows the "+ Expense" button and each card's edit and delete buttons. Otherwise, and while the expenses load, it hides all three (see [expense-details.md](expense-details.md)).

### Server

12. These four endpoints check the lock before writing anything.
    - `POST /api/spreadsheet/monthly-expenses/expense` (add an expense)
    - `PUT /api/spreadsheet/monthly-expenses/expense` (edit an expense)
    - `DELETE /api/spreadsheet/monthly-expenses/expense` (delete an expense)
    - `POST /api/spreadsheet/monthly-expenses/additional-payment` (set the additional payment)
13. Each one reads column A of the target row and applies the rule with today's date in India time. The check runs after the request passes its validation.
14. When the row is not the current month, the endpoint answers status 403 with `{ success: false, error: "Only the current month can be changed." }` and writes nothing to the sheet.
15. In the browser, a 403 shows the error "Only the current month can be changed." in a red toast. The dialog or edit form stays open with the entered values.

## Data

Tab: `Monthly Expense`. Column layout of the tab: [month-list.md](month-list.md#data).

- The list page reads column A through the month list (`A1:E`).
- The four write endpoints and the expense GET each read the single cell `A{rowIndex}`, where `rowIndex` is the 1-based sheet row, as displayed text.
- The lock writes nothing.

## Decisions

- **Only the current month accepts new expenses and payments.** Past months are closed. So, their totals stay fixed.
- **Edit and delete are hidden for past months.** Past months are closed, and editing or deleting an expense would change a closed month's totals.
- **The server enforces the lock as well as the page.** A lock that lives only in the browser can be bypassed by a direct request or an edited URL.
- **Both sides use India time, not their own clock.** The server runs on UTC, 5 hours 30 minutes behind India. With each side on its own clock, the page would show the new month as open from midnight to 05:30 IST on the 1st while the server still rejected writes. The browser does not send its date, because a wrong device clock would then unlock a past month.
- **Locked buttons on the month list stay clickable.** A truly disabled button ignores clicks and gives no feedback. Keeping it clickable lets a press explain why the month is locked.

## Edge cases

- **No row for today's month.** Every card is locked and labelled "Past", and every write is rejected with 403. The user adds the month's row in the sheet first.
- **Unreadable column A.** The month counts as locked. The page hides the change controls, and the server rejects writes to that row with 403.
- **Direct request to a past month.** The endpoint answers 403 and the sheet does not change.

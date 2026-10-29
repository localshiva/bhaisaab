# Set the additional payment

## Purpose

Lets the user record extra money received in the current month on top of the money in hand. The month holds one additional payment total, and setting it replaces the old value.

## Requirements

1. The dialog opens from the "Addn. Payment" button on a month card, only for a month that accepts changes (see [current-month-lock.md](current-month-lock.md)).
2. The dialog title reads "Set Additional Payment for {date}", where `{date}` is the month's column A text. The description reads "Replaces any additional payment already entered for this month."
3. The dialog has one field, "Payment Amount", a number input that is empty when the dialog opens. It does not show the month's current value.
4. The amount must be a whole number of at least 1, in rupees with no paise. The amount input turns any typed value below 1 into 1. An empty amount fails with the message "Amount must be greater than 0" under the field. An amount with a decimal part fails with the message "Amount must be a whole number". In both cases nothing is sent.
5. The dialog and `POST /api/spreadsheet/monthly-expenses/additional-payment` check the body with the zod schema `AddAdditionalPaymentSchema`.
   - `rowIndex` is a positive whole number, the month's 1-based sheet row.
   - `amount` is a whole number of at least 1.
6. The route rejects an invalid body with status 400 and the error "The payment data you provided is invalid".
7. The route rejects a month that is not current with status 403 and the error "Only the current month can be changed.", and writes nothing (see [current-month-lock.md](current-month-lock.md)).
8. The route writes the amount into column C of the month's row with the Sheets `USER_ENTERED` option, which stores it as if a person had typed it. The new value replaces whatever column C held.
9. On success the route answers `{ success: true, message: "Additional payment saved successfully" }`.
10. While saving, the "Cancel" and "Save Payment" buttons are disabled and "Save Payment" reads "Processing...".
11. On success the dialog closes and its field clears. The month list and that month's expense list both refresh.
12. On failure the dialog stays open with the entered value.

## Data

Tab: `Monthly Expense`.

- Read: the single cell `A{rowIndex}` as displayed text, for the lock check.
- Write: the single cell `C{rowIndex}`.
- `rowIndex` is 1-based.

Request body:

| Field      | Type   | Rule                                       |
| ---------- | ------ | ------------------------------------------ |
| `rowIndex` | number | Whole number, 1 or more. 1-based row.      |
| `amount`   | number | Whole number, 1 or more. Rupees, no paise. |

Column layout of the tab: [month-list.md](month-list.md#data).

## Decisions

- **The amount replaces column C. It is not added to it.** Column C holds the month's one additional payment total. The dialog says "Set Additional Payment" and "Save Payment" so that the label matches what the write does.
- **The amount must be a whole number of at least 1, the same as an expense.** Any real amount from 1 upward is allowed. The family tracks whole rupees, and paise only add noise.

## Edge cases

- **Month that is not current.** The route answers 403 with "Only the current month can be changed." A red toast shows that message and the dialog stays open.
- **Clearing the payment.** The app cannot set column C to 0 or empty. The user clears the cell in the sheet.
- **Failed request.** A red toast shows the server's error message. A server error with status 500 shows "There was an error processing your request. Please try again."
- **Expired Google session.** The browser signs the user out to `/auth/login?error=SessionExpired` without a toast.

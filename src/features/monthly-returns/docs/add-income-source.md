# Add an income source

## Purpose

Lets the user add a monthly income source with its type and amount.

## Requirements

1. The "Add new" button opens a dialog titled "Add new source" with the description "Add new source of income to your monthly returns."
2. The form has three fields.
   - "Type" is a select with the options `Salary` and `Rent` and the placeholder "Select type". Submitting with no choice shows "Type is required".
   - "Income Source" is a required text field with the placeholder "Enter source name". An empty value shows "Source is required".
   - "Amount" is a number field with step 1. It accepts whole numbers of 1 or more.
3. An amount below 1, a decimal amount or an empty amount fails validation and shows "Amount must be a whole number of at least 1".
4. Submitting sends `POST /api/spreadsheet/monthly-returns` with `{ type, source, amount }`.
5. The API validates the body with `AddSourceSchema`, the same schema the form uses. An invalid body gets a 400 response with the error "The income data you provided is invalid".
6. The API finds the target row: one below the last filled cell in column A. When column A is empty, the target is row 2.
7. The API writes `[type, source, amount]` to `A{row}:C{row}` as `USER_ENTERED`. `USER_ENTERED` means the sheet parses each value as if a person typed it.
8. The API does not check for an existing source with the same name.
9. A successful add returns `{ success: true, message: "Source added successfully" }`.
10. While the request runs, both dialog buttons are disabled and the submit button reads "Adding...".
11. On success, the dialog closes, the form resets, and the income list refetches. No success toast appears.

## Data

Sheet tab `Monthly Returns`. The API reads `A:A` as unformatted values to find the target row, then writes `A{row}:C{row}`.

| Column | Value written | Format                   |
| ------ | ------------- | ------------------------ |
| A      | type          | text, `Salary` or `Rent` |
| B      | source        | text                     |
| C      | amount        | whole number, 1 or more  |

The full layout is in [income-list.md](income-list.md).

## Decisions

- **The type is `Salary` or `Rent` only.** The summary card shows one total per type.
- **The amount is a whole number of at least 1.** Every amount in the app starts at 1, and the family tracks whole rupees.
- **There is no duplicate check.** Two family members can have sources with the same name.
- **An empty sheet gets its first source in row 2.** Row 1 is the header row.
- **Column A finds the last row.** Every row the app writes has a type in column A. So, the last filled cell in column A marks the last source.

## Edge cases

- **Empty sheet.** The source goes into row 2, below the header row.
- **Gaps in column A.** The new source goes below the last filled cell in column A. A gap above it stays empty.
- **Invalid input.** The form shows the field's error message and does not send the request.
- **Failed request.** A toast shows the error. The dialog stays open with the values the user typed.

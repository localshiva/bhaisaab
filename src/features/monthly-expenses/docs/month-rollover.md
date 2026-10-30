# Month rollover

## Purpose

Opens each new month without anyone doing it by hand. On the 1st, a Google Apps Script adds the month's row to the `Monthly Expense` tab and carries the money left over from the month before. Apps Script is Google's tool for running code inside a spreadsheet. The app itself never creates a month.

## Requirements

### When it runs

1. The function `addMonthlyExpenseRow`, in the script file `Monthly Expense.gs`, runs from a time-driven trigger. A time-driven trigger is a schedule that Google keeps for the script.
2. The trigger fires once a month, on the 1st, between midnight and 1am India time.
3. The function stops without writing anything on any day other than the 1st.
4. The script's time zone is India Standard Time. It names the new month from today's date in that time zone, in the form `November, 2026`.
5. When a run fails, Google emails the script's owner a daily summary of the failures.

### What it does

The steps run in this order.

6. The latest month's In Hand (column B) changes from a formula to the fixed number it currently shows. This only happens when the cell shows a number.
7. The function reads the total income from `Monthly Returns!G2`. It must be a number above 0. Otherwise the function stops with an error and adds no row.
8. The function reads the latest month's Remainder (column E) as the previous remainder. An empty remainder counts as 0.
9. The new row goes directly below the last row, with these values.

   | Column | Value                                                                 |
   | ------ | --------------------------------------------------------------------- |
   | A      | The month text, which the sheet stores as the first day of that month |
   | B      | `=IF(A{row}="","", {total income} + {previous remainder} + C{row})`   |
   | C      | `0`                                                                   |
   | D      | `=IF(A{row}="","", SUM(F{row}:ZZ{row}))`                              |
   | E      | `=IF(A{row}="","", B{row} - D{row})`                                  |

10. In column B, `{total income}` and `{previous remainder}` are written into the formula as fixed numbers. For example, with a total income of ₹3,00,000 and an October remainder of -₹5,000, November's In Hand starts at ₹2,95,000.
11. The sheet keeps at most 25 month rows. When the new row number is above 26, the function deletes the oldest rows from row 2 down, and the rows below move up. So, the 26th month's run deletes the first month.

## Data

Tabs: `Monthly Expense` and `Monthly Returns`. Column layout of the expense tab: [month-list.md](month-list.md#data).

| Cell                     | Use                                                       |
| ------------------------ | --------------------------------------------------------- |
| `Monthly Expense!A2:A`   | Read, to look for the new month                           |
| `Monthly Expense!B{row}` | The latest month's cell turns into a fixed number         |
| `Monthly Expense!E{row}` | The latest month's cell is read as the previous remainder |
| `Monthly Returns!G2`     | Read as the total income                                  |

Each spreadsheet has its own copy of the script and its own trigger. The Dev copy has no check on the total income from requirement 7.

## Decisions

- **The rollover runs in the sheet, not in the app.** A new month must open on the 1st whether or not anyone opens the app that day.
- **The new month's income is fixed when the month opens.** It is written into the formula as a number. So, a change to the income sources reaches the next month, and earlier months keep the income they really had.
- **A negative remainder carries forward like any other.** Overspending in one month lowers the next month's In Hand.
- **In Hand already includes the additional payment.** Column B adds column C. So, the Remainder is `B - D`, and subtracting or adding C again would count it twice.
- **The latest month's In Hand turns into a fixed number at rollover.** A past month is closed. So, its In Hand stays as it was when the month ended.
- **The sheet keeps only 25 months.** A spreadsheet gets heavier as it fills up. So, the oldest months are deleted to keep it light.

## Edge cases

- **The first hour of the 1st.** Until the trigger fires, the new month has no row. Every month is locked, as [current-month-lock.md](current-month-lock.md) describes.
- **Total income empty or 0.** The production script stops with an error and adds no row. The latest month's In Hand has already turned into a fixed number. After fixing `G2`, run the function again the same day. The Dev script adds the row with the wrong income instead.
- **The rollover misses the 1st.** The function stops on any other day. So, a later run does nothing, and the row must be added by hand.
- **A second run on the 1st.** It adds a second row for the same month. The function looks for the month's text in column A, but column A holds dates. So, the text never matches.
- **In Hand formula edited by hand.** A row's formula can point at the previous month's remainder cell, such as `E19`, instead of holding a fixed number. The app reads only the displayed value. So, it behaves the same. A later change to that earlier month then moves this month's In Hand too.
- **The oldest month is deleted.** The app can no longer show it, and the sheet's version history is the only copy. The rows below move up by one. So, a details page URL saved earlier points at a different month.
- **Empty tab.** With only the header row, there is no latest month. The previous remainder is 0 and the new month goes into row 2.

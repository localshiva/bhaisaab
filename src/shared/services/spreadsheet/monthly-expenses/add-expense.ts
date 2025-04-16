// @bhaisaab/shared/services/spreadsheet/monthly-expenses/add-expense.ts
import { googleServiceConfig } from "@bhaisaab/shared/constants/spreadsheet";
import { AddMonthlyExpenseRequest } from "@bhaisaab/shared/constants/validation/monthly-expenses";
import { createSheetsClient } from "@bhaisaab/shared/utils/spreadsheet/spreadsheet-config";

import { MONTHLY_EXPENSE_SHEET_NAME } from "./shared";

/**
 * Adds an expense to a monthly record
 *
 * @param expenseData Data for the new expense to be added
 * @returns Boolean indicating success
 */
export async function addMonthlyExpense(
  expenseData: AddMonthlyExpenseRequest,
): Promise<boolean> {
  try {
    const sheetsClient = await createSheetsClient();
    const { spreadsheetId } = googleServiceConfig;

    // First, get the current row data to find the next empty cell for expense
    const rowResponse = await sheetsClient.spreadsheets.values.get({
      spreadsheetId,
      range: `${MONTHLY_EXPENSE_SHEET_NAME}!E${expenseData.rowIndex}:ZZ${expenseData.rowIndex}`,
      valueRenderOption: "UNFORMATTED_VALUE",
    });

    // Find the next empty cell in the row
    const rowValues = rowResponse.data.values?.[0] ?? [];

    // Count non-empty cells to determine the next column
    let filledCellCount = 0;
    for (const value of rowValues) {
      if (value !== null && value !== undefined && value !== "") {
        filledCellCount += 1;
      } else {
        break; // Stop at the first empty cell
      }
    }

    // E is the 5th column (index 4), so we add filledCellCount to get the next empty column
    const nextEmptyColumnIndex = 4 + filledCellCount;

    // Convert column index to A1 notation (0 = A, 1 = B, etc.)
    const columnLetter = String.fromCodePoint(65 + nextEmptyColumnIndex); // 65 is ASCII for 'A'

    // Update the cell with the expense amount
    await sheetsClient.spreadsheets.values.update({
      spreadsheetId,
      range: `${MONTHLY_EXPENSE_SHEET_NAME}!${columnLetter}${expenseData.rowIndex}`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[expenseData.amount]],
      },
    });

    // If a comment is provided, add it as a note to the cell
    if (expenseData.comment) {
      const spreadsheetInfo = await sheetsClient.spreadsheets.get({
        spreadsheetId,
        ranges: [MONTHLY_EXPENSE_SHEET_NAME],
        fields: "sheets.properties(sheetId,title)",
      });

      const sheetId = spreadsheetInfo.data.sheets?.[0]?.properties?.sheetId;

      if (sheetId === undefined || sheetId === null) {
        throw new Error(`Sheet ${MONTHLY_EXPENSE_SHEET_NAME} not found`);
      }

      await sheetsClient.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              updateCells: {
                range: {
                  sheetId,
                  startRowIndex: expenseData.rowIndex - 1,
                  endRowIndex: expenseData.rowIndex,
                  startColumnIndex: nextEmptyColumnIndex,
                  endColumnIndex: nextEmptyColumnIndex + 1,
                },
                rows: [
                  {
                    values: [
                      {
                        note: expenseData.comment,
                      },
                    ],
                  },
                ],
                fields: "note",
              },
            },
          ],
        },
      });
    }

    return true;
  } catch (error) {
    console.error("Error adding monthly expense:", error);
    throw error;
  }
}

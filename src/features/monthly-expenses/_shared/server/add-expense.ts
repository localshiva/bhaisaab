import "server-only";

import { AddMonthlyExpenseRequest } from "@bhaisaab/features/monthly-expenses/_shared/schemas/monthly-expenses";
import { columnIndexToLetter } from "@bhaisaab/shared/server/spreadsheet/column-index-to-letter";
import { googleServiceConfig } from "@bhaisaab/shared/server/spreadsheet/google-service-config";
import { createSheetsClient } from "@bhaisaab/shared/server/spreadsheet/spreadsheet-config";

import { MONTHLY_EXPENSE_SHEET_NAME } from "./monthly-expense-sheet";

/**
 * Writes the amount into the first empty cell from column F onward
 * in the month's row, and stores the comment as that cell's note.
 *
 * Filling the first gap means a slot left by a deleted expense is reused.
 */
export async function addMonthlyExpense(
  expenseData: AddMonthlyExpenseRequest,
): Promise<boolean> {
  try {
    const sheetsClient = await createSheetsClient();
    const { spreadsheetId } = googleServiceConfig;

    const EXPENSE_START_COLUMN_INDEX = 5; // Column F

    const rowResponse = await sheetsClient.spreadsheets.values.get({
      spreadsheetId,
      range: `${MONTHLY_EXPENSE_SHEET_NAME}!F${expenseData.rowIndex}:ZZZ${expenseData.rowIndex}`,
      valueRenderOption: "UNFORMATTED_VALUE",
    });

    const rowValues = rowResponse.data.values?.[0] ?? [];

    let filledCellCount = 0;
    for (const value of rowValues) {
      if (value !== null && value !== undefined && value !== "") {
        filledCellCount += 1;
      } else {
        break;
      }
    }

    const nextEmptyColumnIndex = EXPENSE_START_COLUMN_INDEX + filledCellCount;

    const columnLetter = columnIndexToLetter(nextEmptyColumnIndex);

    await sheetsClient.spreadsheets.values.update({
      spreadsheetId,
      range: `${MONTHLY_EXPENSE_SHEET_NAME}!${columnLetter}${expenseData.rowIndex}`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[expenseData.amount]],
      },
    });

    // Notes can only be written through batchUpdate, not the values API.
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

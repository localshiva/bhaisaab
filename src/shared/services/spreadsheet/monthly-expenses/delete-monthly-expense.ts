// @bhaisaab/shared/services/spreadsheet/monthly-expense/delete-expense.ts
import { googleServiceConfig } from "@bhaisaab/shared/constants/spreadsheet";
import { createSheetsClient } from "@bhaisaab/shared/utils/spreadsheet/spreadsheet-config";

import { MONTHLY_EXPENSE_SHEET_NAME } from "./shared";

/**
 * Interface for deleting a monthly expense
 */
export interface IDeleteMonthlyExpenseRequest {
  rowIndex: number; // The row index of the month
  columnIndex: number; // Column index of the expense to delete
}

/**
 * Deletes an expense by clearing the cell value and note
 *
 * @param deleteData Data identifying which expense to delete
 * @returns Boolean indicating success
 */
export async function deleteMonthlyExpense(
  deleteData: IDeleteMonthlyExpenseRequest,
): Promise<boolean> {
  try {
    const sheetsClient = await createSheetsClient();
    const { spreadsheetId } = googleServiceConfig;

    // Convert column index to A1 notation (0 = A, 1 = B, etc.)
    const columnLetter = String.fromCodePoint(65 + deleteData.columnIndex); // 65 is ASCII for 'A'

    // Clear the cell value
    await sheetsClient.spreadsheets.values.update({
      spreadsheetId,
      range: `${MONTHLY_EXPENSE_SHEET_NAME}!${columnLetter}${deleteData.rowIndex}`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[""]],
      },
    });

    const spreadsheetInfo = await sheetsClient.spreadsheets.get({
      spreadsheetId,
      ranges: [MONTHLY_EXPENSE_SHEET_NAME],
      fields: "sheets.properties(sheetId,title)",
    });

    const sheetId = spreadsheetInfo.data.sheets?.[0]?.properties?.sheetId;

    if (sheetId === undefined || sheetId === null) {
      throw new Error(`Sheet ${MONTHLY_EXPENSE_SHEET_NAME} not found`);
    }

    // Clear the cell note
    await sheetsClient.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            updateCells: {
              range: {
                sheetId,
                startRowIndex: deleteData.rowIndex - 1,
                endRowIndex: deleteData.rowIndex,
                startColumnIndex: deleteData.columnIndex,
                endColumnIndex: deleteData.columnIndex + 1,
              },
              rows: [
                {
                  values: [
                    {
                      note: "",
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

    return true;
  } catch (error) {
    console.error("Error deleting monthly expense:", error);
    throw error;
  }
}

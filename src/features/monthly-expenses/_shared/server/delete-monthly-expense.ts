import "server-only";

import { googleServiceConfig } from "@bhaisaab/shared/server/spreadsheet/google-service-config";
import { createSheetsClient } from "@bhaisaab/shared/server/spreadsheet/spreadsheet-config";

import {
  columnIndexToLetter,
  MONTHLY_EXPENSE_SHEET_NAME,
} from "./monthly-expense-sheet";

export interface IDeleteMonthlyExpenseRequest {
  rowIndex: number; // 1-based sheet row of the month
  columnIndex: number; // 0-based sheet column of the expense
}

/**
 * Clears an expense cell's value and note. The cell is emptied, not removed,
 * so the other expenses keep their columns and the next add reuses the gap.
 */
export async function deleteMonthlyExpense(
  deleteData: IDeleteMonthlyExpenseRequest,
): Promise<boolean> {
  try {
    const sheetsClient = await createSheetsClient();
    const { spreadsheetId } = googleServiceConfig;

    const columnLetter = columnIndexToLetter(deleteData.columnIndex);

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

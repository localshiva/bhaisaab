import "server-only";

import { googleServiceConfig } from "@bhaisaab/shared/server/spreadsheet/google-service-config";
import { createSheetsClient } from "@bhaisaab/shared/server/spreadsheet/spreadsheet-config";

import {
  columnIndexToLetter,
  MONTHLY_EXPENSE_SHEET_NAME,
} from "./monthly-expense-sheet";

export interface IUpdateMonthlyExpenseRequest {
  rowIndex: number; // 1-based sheet row of the month
  columnIndex: number; // 0-based sheet column of the expense
  amount: number;
  comment?: string;
}

/**
 * Overwrites an expense cell's amount and replaces its note.
 * A missing comment clears the note.
 */
export async function updateMonthlyExpense(
  updateData: IUpdateMonthlyExpenseRequest,
): Promise<boolean> {
  try {
    const sheetsClient = await createSheetsClient();
    const { spreadsheetId } = googleServiceConfig;

    const columnLetter = columnIndexToLetter(updateData.columnIndex);

    await sheetsClient.spreadsheets.values.update({
      spreadsheetId,
      range: `${MONTHLY_EXPENSE_SHEET_NAME}!${columnLetter}${updateData.rowIndex}`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[updateData.amount]],
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
                startRowIndex: updateData.rowIndex - 1,
                endRowIndex: updateData.rowIndex,
                startColumnIndex: updateData.columnIndex,
                endColumnIndex: updateData.columnIndex + 1,
              },
              rows: [
                {
                  values: [
                    {
                      note: updateData.comment ?? "",
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
    console.error("Error updating monthly expense:", error);
    throw error;
  }
}

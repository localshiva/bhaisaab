import "server-only";

import { googleServiceConfig } from "@bhaisaab/shared/server/spreadsheet/google-service-config";
import { createSheetsClient } from "@bhaisaab/shared/server/spreadsheet/spreadsheet-config";

import {
  columnIndexToLetter,
  MONTHLY_EXPENSE_SHEET_NAME,
} from "./monthly-expense-sheet";

/**
 * Interface for updating a monthly expense
 */
export interface IUpdateMonthlyExpenseRequest {
  rowIndex: number; // The row index of the month
  columnIndex: number; // Column index of the expense to update
  amount: number; // New amount for the expense
  comment?: string; // Optional comment for the expense
}

/**
 * Updates an existing expense
 *
 * @param updateData Data for updating the expense
 * @returns Boolean indicating success
 */
export async function updateMonthlyExpense(
  updateData: IUpdateMonthlyExpenseRequest,
): Promise<boolean> {
  try {
    const sheetsClient = await createSheetsClient();
    const { spreadsheetId } = googleServiceConfig;

    // Use the columnIndexToLetter helper for consistent column handling
    const columnLetter = columnIndexToLetter(updateData.columnIndex);

    // Update the cell with the new expense amount
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

    // Update the cell note
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

import "server-only";

import { IMonthlyExpense } from "@bhaisaab/features/monthly-expenses/_shared/types/monthly-expenses";
import { googleServiceConfig } from "@bhaisaab/shared/server/spreadsheet/google-service-config";
import { createSheetsClient } from "@bhaisaab/shared/server/spreadsheet/spreadsheet-config";

import { MONTHLY_EXPENSE_SHEET_NAME } from "./monthly-expense-sheet";

export interface IMonthlyExpenseRequest {
  rowIndex: number; // 1-based sheet row of the month
}

/**
 * Reads the cells holding a number from column F onward in a month's row,
 * each with its note as the comment and its 0-based column index.
 *
 * Empty cells and cells holding text are skipped.
 */
export async function getMonthlyExpenses(
  requestData: IMonthlyExpenseRequest,
): Promise<IMonthlyExpense[]> {
  try {
    const sheetsClient = await createSheetsClient();
    const { spreadsheetId } = googleServiceConfig;

    const EXPENSE_START_COLUMN = "F";
    const EXPENSE_START_INDEX = 5;

    const rowResponse = await sheetsClient.spreadsheets.values.get({
      spreadsheetId,
      range: `${MONTHLY_EXPENSE_SHEET_NAME}!${EXPENSE_START_COLUMN}${requestData.rowIndex}:ZZZ${requestData.rowIndex}`,
      valueRenderOption: "UNFORMATTED_VALUE",
    });

    // The values API does not return notes, so they need a second read.
    const notesResponse = await sheetsClient.spreadsheets.get({
      spreadsheetId,
      ranges: [
        `${MONTHLY_EXPENSE_SHEET_NAME}!${EXPENSE_START_COLUMN}${requestData.rowIndex}:ZZZ${requestData.rowIndex}`,
      ],
      fields: "sheets.data.rowData.values.note",
    });

    const rowValues = rowResponse.data.values?.[0] ?? [];
    const expenses: IMonthlyExpense[] = [];

    const notes: (string | undefined)[] = [];
    if (notesResponse.data.sheets && notesResponse.data.sheets.length > 0) {
      const sheet = notesResponse.data.sheets[0];
      if (sheet.data && sheet.data.length > 0) {
        const rowData = sheet.data[0].rowData;
        if (rowData && rowData.length > 0) {
          const values = rowData[0].values ?? [];
          for (const cell of values) {
            notes.push(cell.note ?? undefined);
          }
        }
      }
    }

    for (const [index, value] of rowValues.entries()) {
      // Text has no amount and would show as ₹NaN, so only numbers are expenses
      if (typeof value === "number" && Number.isFinite(value)) {
        expenses.push({
          amount: value,
          comment: notes[index],
          columnIndex: index + EXPENSE_START_INDEX,
        });
      }
    }

    return expenses;
  } catch (error) {
    console.error("Error fetching monthly expenses:", error);
    throw error;
  }
}

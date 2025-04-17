// @bhaisaab/shared/services/spreadsheet/monthly-expense/view-monthly-expense.ts
import { googleServiceConfig } from "@bhaisaab/shared/constants/spreadsheet";
import { createSheetsClient } from "@bhaisaab/shared/utils/spreadsheet/spreadsheet-config";

import { MONTHLY_EXPENSE_SHEET_NAME } from "./shared";

/**
 * Interface for the monthly expense request
 */
export interface IMonthlyExpenseRequest {
  rowIndex: number; // The row index (1-based) of the month to view expenses for
}

/**
 * Interface for monthly expense details
 */
export interface IMonthlyExpense {
  amount: number;
  comment?: string;
  columnIndex: number; // Useful for potential future features like editing expenses
}

/**
 * Fetches all expenses for a specific month
 *
 * @param requestData Data identifying which month to fetch expenses for
 * @returns Array of expense details
 */
export async function getMonthlyExpenses(
  requestData: IMonthlyExpenseRequest,
): Promise<IMonthlyExpense[]> {
  try {
    const sheetsClient = await createSheetsClient();
    const { spreadsheetId } = googleServiceConfig;

    // Fetch the row with expense data (starting from column E)
    const rowResponse = await sheetsClient.spreadsheets.values.get({
      spreadsheetId,
      range: `${MONTHLY_EXPENSE_SHEET_NAME}!E${requestData.rowIndex}:ZZZ${requestData.rowIndex}`,
      valueRenderOption: "UNFORMATTED_VALUE",
    });

    // Get cell notes to retrieve comments
    const notesResponse = await sheetsClient.spreadsheets.get({
      spreadsheetId,
      ranges: [
        `${MONTHLY_EXPENSE_SHEET_NAME}!E${requestData.rowIndex}:ZZZ${requestData.rowIndex}`,
      ],
      fields: "sheets.data.rowData.values.note",
    });

    const rowValues = rowResponse.data.values?.[0] ?? [];
    const expenses: IMonthlyExpense[] = [];

    // Get notes if available
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

    // Process each cell to find expenses (non-empty cells)
    for (const [index, value] of rowValues.entries()) {
      if (value !== null && value !== undefined && value !== "") {
        // Add expense with its amount, comment (if any), and column index
        expenses.push({
          amount: Number(value),
          comment: notes[index],
          columnIndex: index + 4, // +4 because we start from column E (index 4)
        });
      }
    }

    return expenses;
  } catch (error) {
    console.error("Error fetching monthly expenses:", error);
    throw error;
  }
}
